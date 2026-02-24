// Thay thế URL này bằng webhook URL của bạn
export const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || '';

export const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml'
];

export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB (giới hạn của Discord)