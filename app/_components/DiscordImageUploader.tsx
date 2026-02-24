"use client"
import React, { useState, useCallback } from 'react';
import {
    Upload,
    Image as ImageIcon,
    Loader2,
    Check,
    Copy,
    X,
    ExternalLink,
    Trash2,
    Link as LinkIcon,
    List,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/app/utils';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/app/_data/discordConfig';

interface UploadedFile {
    id: string;
    file: File;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    message?: string;
    discordUrl?: string;
}

const DiscordImageUploader: React.FC = () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [uploadAllStatus, setUploadAllStatus] = useState<'idle' | 'uploading'>('idle');
    const [copiedAllUrls, setCopiedAllUrls] = useState(false);
    const [showUrlList, setShowUrlList] = useState(false);
    const [webhookError, setWebhookError] = useState<string | null>(null);

    // Lấy webhook URL từ env
    const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

    // Kiểm tra webhook URL khi component mount
    React.useEffect(() => {
        if (!webhookUrl) {
            setWebhookError('❌ Không tìm thấy DISCORD_WEBHOOK_URL trong file .env.local');
        } else if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
            setWebhookError('❌ Webhook URL không hợp lệ. Cần bắt đầu bằng: https://discord.com/api/webhooks/');
        } else {
            setWebhookError(null);
        }
    }, [webhookUrl]);

    // Validate file
    const validateFile = (file: File): { valid: boolean; error?: string } => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return {
                valid: false,
                error: `Loại file không hợp lệ. Chỉ chấp nhận: ${ALLOWED_FILE_TYPES.map(t => t.split('/')[1]).join(', ')}`
            };
        }
        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File quá lớn. Giới hạn: ${MAX_FILE_SIZE / 1024 / 1024}MB`
            };
        }
        return { valid: true };
    };

    // Handle file selection
    const handleFiles = useCallback((selectedFiles: FileList | File[] | null) => {
        if (!selectedFiles) return;

        const newFiles: UploadedFile[] = [];

        Array.from(selectedFiles).forEach(file => {
            const validation = validateFile(file);
            if (!validation.valid) {
                const preview = URL.createObjectURL(file);
                newFiles.push({
                    id: Math.random().toString(36).substring(7),
                    file,
                    preview,
                    progress: 0,
                    status: 'error',
                    message: validation.error
                });
            } else {
                const preview = URL.createObjectURL(file);
                newFiles.push({
                    id: Math.random().toString(36).substring(7),
                    file,
                    preview,
                    progress: 0,
                    status: 'pending'
                });
            }
        });

        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    // Handle drop
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    // Handle drag events
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    // Remove file
    const removeFile = (id: string) => {
        setFiles(prev => {
            const fileToRemove = prev.find(f => f.id === id);
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prev.filter(f => f.id !== id);
        });
    };

    // Clear all files
    const clearAllFiles = () => {
        files.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });
        setFiles([]);
        setShowUrlList(false);
    };

    // Upload single file to Discord
    const uploadToDiscord = async (file: UploadedFile) => {
        if (!webhookUrl) {
            throw new Error('Webhook URL chưa được cấu hình');
        }

        const formData = new FormData();
        formData.append('file', file.file);

        const payload = {
            content: `📸 **${file.file.name}**\nKích thước: ${(file.file.size / 1024).toFixed(2)} KB`
        };
        formData.append('payload_json', JSON.stringify(payload));

        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload thất bại (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const attachmentUrl = data.attachments?.[0]?.url;

        return attachmentUrl;
    };

    // Upload all files
    const handleUploadAll = async () => {
        if (!webhookUrl) {
            setWebhookError('❌ Webhook URL chưa được cấu hình trong file .env.local');
            return;
        }

        setUploadAllStatus('uploading');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.status !== 'pending') continue;

            setFiles(prev => prev.map(f =>
                f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
            ));

            try {
                const progressInterval = setInterval(() => {
                    setFiles(prev => prev.map(f =>
                        f.id === file.id && f.progress < 90
                            ? { ...f, progress: f.progress + 10 }
                            : f
                    ));
                }, 200);

                const discordUrl = await uploadToDiscord(file);

                clearInterval(progressInterval);

                setFiles(prev => prev.map(f =>
                    f.id === file.id
                        ? {
                            ...f,
                            status: 'success',
                            progress: 100,
                            discordUrl
                        }
                        : f
                ));
            } catch (error) {
                console.error('Upload error:', error);
                setFiles(prev => prev.map(f =>
                    f.id === file.id
                        ? {
                            ...f,
                            status: 'error',
                            message: error instanceof Error ? error.message : 'Upload thất bại'
                        }
                        : f
                ));
            }
        }

        setUploadAllStatus('idle');
    };

    // Copy URL to clipboard
    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedUrl(id);
            setTimeout(() => setCopiedUrl(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Copy all URLs as comma-separated list
    const copyAllUrlsAsList = async () => {
        const successfulUrls = files
            .filter(f => f.status === 'success' && f.discordUrl)
            .map(f => f.discordUrl)
            .join(', ');

        if (!successfulUrls) return;

        try {
            await navigator.clipboard.writeText(successfulUrls);
            setCopiedAllUrls(true);
            setTimeout(() => setCopiedAllUrls(false), 2000);
        } catch (err) {
            console.error('Failed to copy URLs:', err);
        }
    };

    // Get status counts
    const getStatusCounts = () => {
        return {
            total: files.length,
            pending: files.filter(f => f.status === 'pending').length,
            uploading: files.filter(f => f.status === 'uploading').length,
            success: files.filter(f => f.status === 'success').length,
            error: files.filter(f => f.status === 'error').length
        };
    };

    const counts = getStatusCounts();
    const successfulUrls = files.filter(f => f.status === 'success' && f.discordUrl).map(f => f.discordUrl);

    return (
        <div className="w-full h-full flex items-start justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-200/50 border border-indigo-100 overflow-hidden flex flex-col min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)]">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-indigo-100 bg-indigo-50/50 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-900 flex items-center gap-2">
                                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                                Discord Image Uploader
                            </h1>
                            <p className="text-xs sm:text-sm text-indigo-600 mt-1">
                                Upload trực tiếp hình ảnh lên Discord channel
                            </p>
                        </div>

                        {/* Status indicator */}
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                                webhookUrl && !webhookError
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            )}>
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    webhookUrl && !webhookError ? "bg-green-500" : "bg-red-500"
                                )} />
                                {webhookUrl && !webhookError ? 'Webhook OK' : 'Lỗi webhook'}
                            </div>
                        </div>
                    </div>

                    {/* Webhook Error Message */}
                    {webhookError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-red-700">
                                <p className="font-medium">{webhookError}</p>
                                <p className="mt-1 text-red-600">
                                    Vui lòng thêm dòng sau vào file <code className="bg-red-100 px-1 py-0.5 rounded">.env.local</code>:
                                </p>
                                <pre className="mt-2 p-2 bg-red-100 rounded-lg text-red-800 font-mono text-xs overflow-x-auto">
                                    NEXT_PUBLIC_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Upload Area */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => !webhookError && document.getElementById('file-input')?.click()}
                            className={cn(
                                "relative border-2 border-dashed rounded-xl sm:rounded-2xl p-8 sm:p-12 transition-all cursor-pointer",
                                isDragging
                                    ? "border-indigo-500 bg-indigo-50"
                                    : webhookError
                                        ? "border-red-200 bg-red-50/50 cursor-not-allowed"
                                        : "border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                            )}
                        >
                            <input
                                id="file-input"
                                type="file"
                                multiple
                                accept={ALLOWED_FILE_TYPES.join(',')}
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                                disabled={!!webhookError}
                            />

                            <div className="text-center">
                                <div className={cn(
                                    "inline-flex p-4 rounded-full mb-4",
                                    webhookError ? "bg-red-100" : "bg-indigo-100"
                                )}>
                                    <ImageIcon className={cn(
                                        "w-8 h-8",
                                        webhookError ? "text-red-600" : "text-indigo-600"
                                    )} />
                                </div>
                                <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                                    {webhookError
                                        ? 'Vui lòng cấu hình webhook trước'
                                        : isDragging
                                            ? 'Thả file để upload'
                                            : 'Kéo thả hoặc click để chọn ảnh'
                                    }
                                </h3>
                                <p className="text-sm text-indigo-600 mb-4">
                                    Hỗ trợ: JPG, PNG, GIF, WEBP (tối đa 8MB)
                                </p>
                                {!webhookError && (
                                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                                        Chọn file
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs sm:text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                                            Danh sách ảnh ({files.length})
                                        </label>
                                        <div className="flex gap-1 text-xs">
                                            {counts.pending > 0 && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                                                    {counts.pending} chờ
                                                </span>
                                            )}
                                            {counts.success > 0 && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                    {counts.success} thành công
                                                </span>
                                            )}
                                            {counts.error > 0 && (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">
                                                    {counts.error} lỗi
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearAllFiles}
                                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Xóa tất cả
                                    </button>
                                </div>

                                {/* File Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="relative group bg-white rounded-lg border border-indigo-100 overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            {/* Preview */}
                                            <div className="relative aspect-square bg-indigo-50">
                                                <img
                                                    src={file.preview}
                                                    alt={file.file.name}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* Status Overlay */}
                                                {file.status === 'uploading' && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <div className="text-white text-center">
                                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-1" />
                                                            <span className="text-xs">{file.progress}%</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {file.status === 'success' && (
                                                    <div className="absolute top-2 right-2">
                                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}

                                                {file.status === 'error' && (
                                                    <div className="absolute top-2 right-2">
                                                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                            <X className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Remove Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(file.id);
                                                    }}
                                                    className="absolute top-2 left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4 text-white" />
                                                </button>
                                            </div>

                                            {/* Info */}
                                            <div className="p-2">
                                                <p className="text-xs text-indigo-900 truncate" title={file.file.name}>
                                                    {file.file.name}
                                                </p>
                                                <p className="text-xs text-indigo-500">
                                                    {(file.file.size / 1024).toFixed(1)} KB
                                                </p>

                                                {/* Discord URL */}
                                                {file.discordUrl && (
                                                    <div className="mt-2 flex items-center gap-1">
                                                        <button
                                                            onClick={() => window.open(file.discordUrl, '_blank')}
                                                            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            Xem
                                                        </button>
                                                        <button
                                                            onClick={() => copyToClipboard(file.discordUrl!, file.id)}
                                                            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                                        >
                                                            {copiedUrl === file.id ? (
                                                                <Check className="w-3 h-3" />
                                                            ) : (
                                                                <LinkIcon className="w-3 h-3" />
                                                            )}
                                                            {copiedUrl === file.id ? 'Đã copy' : 'Copy URL'}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Error Message */}
                                                {file.message && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {file.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Upload All Button */}
                                {counts.pending > 0 && !webhookError && (
                                    <button
                                        onClick={handleUploadAll}
                                        disabled={uploadAllStatus === 'uploading'}
                                        className="w-full py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group text-sm sm:text-base"
                                    >
                                        {uploadAllStatus === 'uploading' ? (
                                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                        {uploadAllStatus === 'uploading'
                                            ? `ĐANG UPLOAD... (${counts.success}/${counts.total})`
                                            : 'UPLOAD TẤT CẢ LÊN DISCORD'}
                                    </button>
                                )}

                                {/* URLs List */}
                                {successfulUrls.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setShowUrlList(!showUrlList)}
                                                    className="flex items-center gap-1 text-xs font-semibold text-indigo-700 uppercase tracking-wider hover:text-indigo-800"
                                                >
                                                    <List className="w-4 h-4" />
                                                    {showUrlList ? 'ẨN DANH SÁCH URLs' : 'HIỆN DANH SÁCH URLs'}
                                                </button>
                                                <span className="text-xs text-indigo-500">
                                                    ({successfulUrls.length} URLs)
                                                </span>
                                            </div>
                                            <button
                                                onClick={copyAllUrlsAsList}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                                                    copiedAllUrls
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                                )}
                                            >
                                                {copiedAllUrls ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5" />
                                                        ĐÃ COPY
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        COPY TẤT CẢ URLs
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {showUrlList && (
                                            <div className="relative">
                                                <div className="p-4 bg-gray-50 rounded-xl border border-indigo-100 font-mono text-xs whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                                                    {successfulUrls.join(', ')}
                                                </div>
                                                <p className="text-xs text-indigo-500 mt-2">
                                                    ⚡ Các URLs được ngăn cách bằng dấu phẩy, sẵn sàng để paste vào bất kỳ đâu
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Empty State */}
                        {files.length === 0 && !webhookError && (
                            <div className="text-center py-12">
                                <ImageIcon className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                                <p className="text-indigo-500">Chưa có ảnh nào được chọn</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {files.length > 0 && (
                    <div className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-50/50 border-t border-indigo-100 text-xs text-indigo-500 flex justify-between items-center">
                        <span>
                            Tổng dung lượng: {(files.reduce((acc, f) => acc + f.file.size, 0) / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span className="text-indigo-600 font-medium">
                            {counts.success}/{counts.total} thành công
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscordImageUploader;