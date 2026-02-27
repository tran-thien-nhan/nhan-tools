import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import TikTokScraper, { TikTokChannel } from '@/app/_services/tiktokScraper';
import defaultConfig from '@/app/_data/channels.json';

// Cache cho scraper instance
let scraperInstance: TikTokScraper | null = null;

// Hàm kiểm tra và tạo file config nếu chưa tồn tại
async function getConfig() {
    const configPath = path.join(process.cwd(), 'app', '_data', 'channels.json');

    try {
        // Thử đọc file
        const data = await fs.readFile(configPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Nếu file không tồn tại, dùng config mặc định từ import
        console.log('⚠️ File channels.json không tồn tại, dùng config mặc định');

        // Tạo thư mục nếu chưa tồn tại
        await fs.mkdir(path.dirname(configPath), { recursive: true });

        // Ghi file config mặc định
        await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));

        console.log('✅ Đã tạo file channels.json với config mặc định');

        return defaultConfig;
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');

        // Đọc config từ file
        const configData = await getConfig();

        switch (action) {
            case 'channels':
                return NextResponse.json({
                    success: true,
                    channels: configData.channels,
                    settings: configData.settings
                });

            case 'scrape': {
                const channelId = searchParams.get('channelId');
                if (!channelId) {
                    return NextResponse.json(
                        { success: false, error: 'Missing channelId' },
                        { status: 400 }
                    );
                }

                const channel = configData.channels.find((c: TikTokChannel) => c.id === channelId);
                if (!channel) {
                    return NextResponse.json(
                        { success: false, error: 'Channel not found' },
                        { status: 404 }
                    );
                }

                const scraper = new TikTokScraper(configData.settings, [channel]);
                await scraper.initialize();
                const videos = await scraper.scrapeChannel(channel);
                await scraper.close();

                return NextResponse.json({ success: true, videos });
            }

            case 'scrape-all': {
                const allScraper = new TikTokScraper(configData.settings, configData.channels);
                await allScraper.initialize();
                const results = await allScraper.scrapeAllChannels();
                await allScraper.close();

                const videosMap = Object.fromEntries(results);
                return NextResponse.json({ success: true, results: videosMap });
            }

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, data } = body;

        const configPath = path.join(process.cwd(), 'app', '_data', 'channels.json');
        const configData = await getConfig();

        switch (action) {
            case 'add-channel':
                configData.channels.push({
                    id: Date.now().toString(),
                    ...data,
                    enabled: true,
                    lastScraped: null
                });
                break;

            case 'update-channel':
                const index = configData.channels.findIndex((c: TikTokChannel) => c.id === data.id);
                if (index !== -1) {
                    configData.channels[index] = { ...configData.channels[index], ...data };
                }
                break;

            case 'delete-channel':
                configData.channels = configData.channels.filter((c: TikTokChannel) => c.id !== data.id);
                break;

            case 'update-settings':
                configData.settings = { ...configData.settings, ...data };
                break;

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }

        // Đảm bảo thư mục tồn tại trước khi ghi
        await fs.mkdir(path.dirname(configPath), { recursive: true });

        // Ghi file
        await fs.writeFile(configPath, JSON.stringify(configData, null, 2));

        return NextResponse.json({
            success: true,
            channels: configData.channels,
            settings: configData.settings
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}