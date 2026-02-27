// app/_services/tiktokScraper.ts
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
    private config: ScraperConfig;
    private channels: TikTokChannel[] = [];

    constructor(config: ScraperConfig, channels: TikTokChannel[]) {
        this.config = config;
        this.channels = channels;
    }

    async initialize() {
        // Không cần khởi tạo browser
        console.log('✅ TikTokScraper initialized (API mode)');
    }

    async close() {
        // Không cần đóng browser
        console.log('✅ TikTokScraper closed');
    }

    async scrapeChannel(channel: TikTokChannel): Promise<TikTokVideo[]> {
        console.log(`📹 Scraping channel: ${channel.username} using API`);

        try {
            // Dùng API TikTok không chính thức
            const apiUrl = `https://www.tikwm.com/api/user/posts?unique_id=${channel.username.replace('@', '')}&count=${this.config.maxVideosPerChannel}`;

            const response = await fetch(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.code !== 0 || !data.data || !data.data.videos) {
                console.log('⚠️ No videos found or API error');
                return [];
            }

            const videos: TikTokVideo[] = data.data.videos.map((video: any) => ({
                id: video.video_id,
                url: `https://www.tiktok.com/@${channel.username.replace('@', '')}/video/${video.video_id}`,
                downloadUrl: video.play || video.wmplay || video.hdplay || '',
                caption: video.title || '',
                likes: video.digg_count || 0,
                comments: video.comment_count || 0,
                shares: video.share_count || 0,
                plays: video.play_count || 0,
                duration: video.duration || 0,
                createTime: new Date(video.create_time * 1000),
                author: channel.username,
                downloaded: false
            }));

            console.log(`✅ Found ${videos.length} videos from ${channel.username}`);

            // Tải video về nếu cần
            if (videos.length > 0) {
                console.log(`⬇️ Starting download of ${videos.length} videos...`);
                await this.downloadVideos(videos, channel);
            }

            return videos;

        } catch (error) {
            console.error(`❌ Error scraping channel ${channel.username}:`, error);
            return [];
        }
    }

    private async downloadVideos(videos: TikTokVideo[], channel: TikTokChannel) {
        const downloadDir = path.join(process.cwd(), 'public', 'downloads', channel.username.replace('@', ''));

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

                if (!video.downloadUrl) {
                    console.log(`⚠️ No download URL for video ${video.id}`);
                    continue;
                }

                const date = new Date().toISOString().split('T')[0];
                const fileName = `${channel.username.replace('@', '')}_${date}_${video.id}.mp4`;
                const filePath = path.join(downloadDir, fileName);

                await this.downloadFile(video.downloadUrl, filePath);

                video.downloaded = true;
                video.downloadPath = `/downloads/${channel.username.replace('@', '')}/${fileName}`;

                console.log(`✅ Downloaded: ${fileName}`);

                // Delay giữa các lần download
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error(`❌ Failed to download video ${video.id}:`, error);
            }
        }
    }

    private downloadFile(url: string, dest: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const file = createWriteStream(dest);

            const options = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            };

            https.get(url, options, (response) => {
                if (response.statusCode === 302 || response.statusCode === 301) {
                    const location = response.headers.location;
                    if (location) {
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
            }).on('error', (err) => {
                fs.unlink(dest).catch(() => { });
                reject(err);
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
                await new Promise(resolve => setTimeout(resolve, 2000));
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