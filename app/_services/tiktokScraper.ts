import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { createWriteStream } from 'fs';

export interface TikTokVideo {
    id: string;
    url: string;
    downloadUrl: string;
    caption: string;
    likes: number;
    comments: number;
    shares: number;
    plays: number;
    duration: number;
    createTime: Date;
    author: string;
    downloaded: boolean;
    downloadPath?: string;
}

export interface TikTokChannel {
    id: string;
    username: string;
    displayName: string;
    url: string;
    enabled: boolean;
    lastScraped: Date | null;
}

export interface ScraperConfig {
    downloadPath: string;
    maxVideosPerChannel: number;
    headless: boolean;
    scrapeInterval: number;
}

class TikTokScraper {
    private browser: Browser | null = null;
    private config: ScraperConfig;
    private channels: TikTokChannel[] = [];

    constructor(config: ScraperConfig, channels: TikTokChannel[]) {
        this.config = config;
        this.channels = channels;
    }

    async initialize() {
        try {
            // Tạo thư mục downloads nếu chưa tồn tại
            await fs.mkdir(this.config.downloadPath, { recursive: true });

            // Khởi tạo browser với cấu hình phù hợp
            this.browser = await puppeteer.launch({
                headless: this.config.headless,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--disable-blink-features=AutomationControlled',
                    '--window-size=1920,1080',
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                ],
                defaultViewport: null
            });

            console.log('✅ Browser initialized');
        } catch (error) {
            console.error('❌ Failed to initialize browser:', error);
            throw error;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('✅ Browser closed');
        }
    }

    async scrapeChannel(channel: TikTokChannel): Promise<TikTokVideo[]> {
        if (!this.browser) throw new Error('Browser not initialized');

        const page = await this.browser.newPage();
        let videos: TikTokVideo[] = [];

        try {
            console.log(`📹 Scraping channel: ${channel.username}`);

            // Thiết lập các headers để tránh bị phát hiện là bot
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Referer': 'https://www.tiktok.com/',
                'DNT': '1'
            });

            // Điều hướng đến trang channel
            console.log(`Navigating to ${channel.url}`);
            await page.goto(channel.url, {
                waitUntil: 'networkidle2',
                timeout: 60000
            });

            // Đợi page load cơ bản
            await page.waitForFunction(() => {
                return document.readyState === 'complete';
            }, { timeout: 30000 });

            // Scroll để load content
            await this.autoScroll(page, 3);

            // Lấy danh sách video URLs từ page
            const videoUrls = await page.evaluate((maxVideos) => {
                const urls: string[] = [];
                const links = document.querySelectorAll('a[href*="/video/"]');

                links.forEach((link) => {
                    if (urls.length >= maxVideos) return;
                    const href = link.getAttribute('href');
                    if (href) {
                        const fullUrl = href.startsWith('http') ? href : `https://www.tiktok.com${href}`;
                        if (!urls.includes(fullUrl)) {
                            urls.push(fullUrl);
                        }
                    }
                });

                return urls;
            }, this.config.maxVideosPerChannel);

            console.log(`✅ Found ${videoUrls.length} video URLs`);

            // Tạo video objects
            videos = videoUrls.map(url => {
                const videoId = url.split('/video/')[1]?.split('?')[0] || '';
                return {
                    id: videoId,
                    url: url,
                    downloadUrl: '',
                    caption: '',
                    likes: 0,
                    comments: 0,
                    shares: 0,
                    plays: 0,
                    duration: 0,
                    createTime: new Date(),
                    author: channel.username,
                    downloaded: false
                };
            });

            // Tải video về sử dụng API
            if (videos.length > 0) {
                console.log(`⬇️ Starting download of ${videos.length} videos...`);
                await this.downloadVideos(videos, channel);
                console.log(`✅ Downloaded ${videos.filter(v => v.downloaded).length} videos to ${this.config.downloadPath}`);
            }

        } catch (error) {
            console.error(`❌ Error scraping channel ${channel.username}:`, error);
        } finally {
            await page.close();
        }

        return videos;
    }

    private async autoScroll(page: Page, maxScrolls: number = 3) {
        for (let i = 0; i < maxScrolls; i++) {
            await page.evaluate(() => {
                window.scrollTo(0, document.documentElement.scrollHeight);
            });
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    private async downloadVideos(videos: TikTokVideo[], channel: TikTokChannel) {
        const downloadDir = `C:\\Users\\judyh\\Downloads\\tiktok_${channel.username.replace('@', '')}`;

        try {
            await fs.mkdir(downloadDir, { recursive: true });
            console.log(`📁 Download directory: ${downloadDir}`);
        } catch (error) {
            console.error('❌ Failed to create download directory:', error);
            return;
        }

        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];

            try {
                console.log(`⬇️ Downloading video ${i + 1}/${videos.length} (ID: ${video.id})...`);

                const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(video.url)}`;

                const response = await fetch(apiUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                });

                const data = await response.json() as any;

                if (data.code === 0 && data.data) {
                    const videoUrl = data.data.play || data.data.wmplay || data.data.hdplay;

                    if (videoUrl) {
                        const date = new Date().toISOString().split('T')[0];
                        const fileName = `${channel.username.replace('@', '')}_${date}_${video.id}.mp4`;
                        const filePath = path.join(downloadDir, fileName);

                        await this.downloadFile(videoUrl, filePath);

                        video.downloaded = true;
                        video.downloadPath = filePath;
                        video.caption = data.data.title || '';

                        console.log(`✅ Downloaded: ${fileName} (${(data.data.size || 0)} bytes)`);

                    } else {
                        console.log(`⚠️ No video URL found for video ${video.id}`);
                    }
                } else {
                    console.log(`⚠️ API error:`, data.msg || 'Unknown error');
                }

                // Delay giữa các video
                await new Promise(resolve => setTimeout(resolve, 3000));

            } catch (error) {
                console.error(`❌ Failed to process video ${video.id}:`, error);
            }
        }
    }

    private downloadFile(url: string, dest: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const file = createWriteStream(dest);

            const options = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://www.tiktok.com/',
                    'Accept': '*/*'
                }
            };

            const request = https.get(url, options, (response) => {
                if (response.statusCode === 302 || response.statusCode === 301) {
                    const location = response.headers.location;
                    if (location) {
                        console.log(`🔄 Redirecting to: ${location}`);
                        this.downloadFile(location, dest).then(resolve).catch(reject);
                    }
                    return;
                }

                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
                    return;
                }

                const totalSize = parseInt(response.headers['content-length'] || '0');
                let downloadedSize = 0;

                response.on('data', (chunk) => {
                    downloadedSize += chunk.length;
                    if (totalSize > 0) {
                        const percent = Math.round((downloadedSize / totalSize) * 100);
                        process.stdout.write(`\r   Progress: ${percent}% (${downloadedSize}/${totalSize} bytes)`);
                    }
                });

                response.pipe(file);

                file.on('finish', () => {
                    console.log('');
                    file.close();
                    resolve();
                });
            });

            request.on('error', (err) => {
                fs.unlink(dest).catch(() => { });
                reject(err);
            });

            request.setTimeout(60000, () => {
                request.destroy();
                reject(new Error('Download timeout'));
            });
        });
    }

    async scrapeAllChannels(): Promise<Map<string, TikTokVideo[]>> {
        const results = new Map<string, TikTokVideo[]>();

        for (const channel of this.channels) {
            if (channel.enabled) {
                const videos = await this.scrapeChannel(channel);
                results.set(channel.id, videos);
                channel.lastScraped = new Date();
                await this.saveChannels();
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        return results;
    }

    private async saveChannels() {
        try {
            const configPath = path.join(process.cwd(), 'app', '_data', 'channels.json');
            const configData = {
                channels: this.channels,
                settings: this.config
            };
            await fs.writeFile(configPath, JSON.stringify(configData, null, 2));
        } catch (error) {
            console.error('Error saving channels:', error);
        }
    }
}

export default TikTokScraper;