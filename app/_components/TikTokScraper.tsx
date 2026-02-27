'use client';

import React, { useState, useEffect } from 'react';
import {
    Download,
    Video,
    Plus,
    Trash2,
    RefreshCw,
    Settings,
    Play,
    Pause,
    Check,
    X,
    Eye
} from 'lucide-react';
import { cn } from '../utils';

interface TikTokChannel {
    id: string;
    username: string;
    displayName: string;
    url: string;
    enabled: boolean;
    lastScraped: string | null;
}

interface TikTokVideo {
    id: string;
    url: string;
    caption: string;
    likes: number;
    comments: number;
    shares: number;
    author: string;
    downloaded: boolean;
    downloadPath?: string;
}

interface Settings {
    downloadPath: string;
    maxVideosPerChannel: number;
    headless: boolean;
    scrapeInterval: number;
}

const TikTokScraper = () => {
    const [channels, setChannels] = useState<TikTokChannel[]>([]);
    const [settings, setSettings] = useState<Settings>({
        downloadPath: './downloads',
        maxVideosPerChannel: 10,
        headless: true,
        scrapeInterval: 3600000
    });
    const [videos, setVideos] = useState<Record<string, TikTokVideo[]>>({});
    const [loading, setLoading] = useState(false);
    const [scraping, setScraping] = useState<string | null>(null);
    const [showAddChannel, setShowAddChannel] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [newChannel, setNewChannel] = useState({
        username: '',
        displayName: '',
        url: ''
    });
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);

    // Load channels on mount
    useEffect(() => {
        loadChannels();
    }, []);

    const loadChannels = async () => {
        try {
            const response = await fetch('/api/tiktok-scraper?action=channels');
            const data = await response.json();
            if (data.success) {
                setChannels(data.channels);
                // Load settings từ response
                if (data.settings) {
                    setSettings(data.settings);
                }
            }
        } catch (error) {
            console.error('Error loading channels:', error);
        }
    };

    const scrapeChannel = async (channelId: string) => {
        setScraping(channelId);
        try {
            const response = await fetch(`/api/tiktok-scraper?action=scrape&channelId=${channelId}`);
            const data = await response.json();
            if (data.success) {
                setVideos(prev => ({
                    ...prev,
                    [channelId]: data.videos
                }));
            }
        } catch (error) {
            console.error('Error scraping channel:', error);
        } finally {
            setScraping(null);
        }
    };

    const scrapeAll = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/tiktok-scraper?action=scrape-all');
            const data = await response.json();
            if (data.success) {
                setVideos(data.results);
            }
        } catch (error) {
            console.error('Error scraping all:', error);
        } finally {
            setLoading(false);
        }
    };

    const addChannel = async () => {
        try {
            const response = await fetch('/api/tiktok-scraper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'add-channel',
                    data: {
                        ...newChannel,
                        url: newChannel.url || `https://www.tiktok.com/${newChannel.username}`
                    }
                })
            });

            const data = await response.json();
            if (data.success) {
                setChannels(data.channels);
                setShowAddChannel(false);
                setNewChannel({ username: '', displayName: '', url: '' });
            }
        } catch (error) {
            console.error('Error adding channel:', error);
        }
    };

    const deleteChannel = async (channelId: string) => {
        if (!confirm('Xóa kênh này?')) return;

        try {
            const response = await fetch('/api/tiktok-scraper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete-channel',
                    data: { id: channelId }
                })
            });

            const data = await response.json();
            if (data.success) {
                setChannels(data.channels);
                setVideos(prev => {
                    const newVideos = { ...prev };
                    delete newVideos[channelId];
                    return newVideos;
                });
            }
        } catch (error) {
            console.error('Error deleting channel:', error);
        }
    };

    const updateSettings = async (newSettings: Partial<Settings>) => {
        try {
            const response = await fetch('/api/tiktok-scraper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update-settings',
                    data: newSettings
                })
            });

            const data = await response.json();
            if (data.success) {
                setSettings(data.settings);
                setShowSettings(false);
            }
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    const toggleChannel = async (channel: TikTokChannel) => {
        try {
            const response = await fetch('/api/tiktok-scraper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update-channel',
                    data: { ...channel, enabled: !channel.enabled }
                })
            });

            const data = await response.json();
            if (data.success) {
                setChannels(data.channels);
            }
        } catch (error) {
            console.error('Error toggling channel:', error);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-pink-600">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Video className="w-6 h-6" />
                            TikTok Video Scraper
                        </h2>
                        <p className="text-purple-100 mt-1">Cào video từ các kênh TikTok</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all"
                            title="Cài đặt"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={scrapeAll}
                            disabled={loading}
                            className="px-4 py-3 bg-white hover:bg-white/90 text-purple-600 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <Download className="w-5 h-5" />
                            )}
                            CÀO TẤT CẢ
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Channels List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-zinc-900">Danh sách kênh</h3>
                        <button
                            onClick={() => setShowAddChannel(true)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 text-sm transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            THÊM KÊNH
                        </button>
                    </div>

                    <div className="grid gap-3">
                        {channels.map(channel => (
                            <div
                                key={channel.id}
                                className={cn(
                                    "border rounded-xl p-4 transition-all",
                                    channel.enabled ? "bg-white border-zinc-200" : "bg-zinc-50 border-zinc-200 opacity-60"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleChannel(channel)}
                                            className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                channel.enabled ? "bg-green-100 text-green-600" : "bg-zinc-200 text-zinc-500"
                                            )}
                                        >
                                            {channel.enabled ? <Check className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                                        </button>
                                        <div>
                                            <h4 className="font-bold text-zinc-900">{channel.displayName}</h4>
                                            <p className="text-sm text-zinc-500">{channel.username}</p>
                                            {channel.lastScraped && (
                                                <p className="text-xs text-zinc-400">
                                                    Cào lúc: {new Date(channel.lastScraped).toLocaleString('vi-VN')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedChannel(selectedChannel === channel.id ? null : channel.id)}
                                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
                                            title="Xem videos"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => scrapeChannel(channel.id)}
                                            disabled={scraping === channel.id || !channel.enabled}
                                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors disabled:opacity-50"
                                            title="Cào videos"
                                        >
                                            {scraping === channel.id ? (
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Download className="w-5 h-5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => deleteChannel(channel.id)}
                                            className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                                            title="Xóa kênh"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Videos List */}
                                {selectedChannel === channel.id && videos[channel.id] && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h5 className="font-semibold text-zinc-700 mb-3">
                                            Videos ({videos[channel.id].length})
                                        </h5>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {videos[channel.id].map(video => (
                                                <div
                                                    key={video.id}
                                                    className="relative group aspect-[9/16] bg-zinc-100 rounded-lg overflow-hidden cursor-pointer"
                                                    onClick={() => setPreviewVideo(video.downloadPath || null)}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                                                            <p className="truncate">{video.caption || 'Không có caption'}</p>
                                                            <div className="flex gap-2 mt-1">
                                                                <span>❤️ {video.likes}</span>
                                                                <span>💬 {video.comments}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {video.downloaded && (
                                                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-lg">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {channels.length === 0 && (
                            <div className="text-center py-12 text-zinc-400 border-2 border-dashed rounded-xl">
                                <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Chưa có kênh nào</p>
                                <p className="text-sm">Nhấn "THÊM KÊNH" để bắt đầu</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Channel Modal */}
            {showAddChannel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600">
                            <h3 className="text-xl font-bold text-white">Thêm kênh TikTok</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-zinc-700 mb-2 block">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={newChannel.username}
                                    onChange={(e) => setNewChannel(prev => ({
                                        ...prev,
                                        username: e.target.value,
                                        url: `https://www.tiktok.com/${e.target.value}`
                                    }))}
                                    placeholder="@username"
                                    className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-zinc-700 mb-2 block">
                                    Tên hiển thị
                                </label>
                                <input
                                    type="text"
                                    value={newChannel.displayName}
                                    onChange={(e) => setNewChannel(prev => ({ ...prev, displayName: e.target.value }))}
                                    placeholder="Tên kênh"
                                    className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={addChannel}
                                    disabled={!newChannel.username}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                                >
                                    THÊM
                                </button>
                                <button
                                    onClick={() => setShowAddChannel(false)}
                                    className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all"
                                >
                                    HỦY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-pink-600">
                            <h3 className="text-xl font-bold text-white">Cài đặt</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-zinc-700 mb-2 block">
                                    Thư mục tải về
                                </label>
                                <input
                                    type="text"
                                    value={settings.downloadPath}
                                    onChange={(e) => setSettings(prev => ({ ...prev, downloadPath: e.target.value }))}
                                    className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-zinc-700 mb-2 block">
                                    Số video tối đa mỗi kênh
                                </label>
                                <input
                                    type="number"
                                    value={settings.maxVideosPerChannel}
                                    onChange={(e) => setSettings(prev => ({ ...prev, maxVideosPerChannel: parseInt(e.target.value) }))}
                                    min="1"
                                    max="50"
                                    className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={settings.headless}
                                    onChange={(e) => setSettings(prev => ({ ...prev, headless: e.target.checked }))}
                                    id="headless"
                                    className="w-4 h-4 text-purple-600"
                                />
                                <label htmlFor="headless" className="text-sm text-zinc-700">
                                    Chạy ẩn (headless mode)
                                </label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => updateSettings(settings)}
                                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
                                >
                                    LƯU
                                </button>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all"
                                >
                                    HỦY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Preview Modal */}
            {previewVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setPreviewVideo(null)}>
                    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <video
                            src={previewVideo}
                            controls
                            autoPlay
                            className="w-full rounded-2xl"
                        />
                        <button
                            onClick={() => setPreviewVideo(null)}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TikTokScraper;