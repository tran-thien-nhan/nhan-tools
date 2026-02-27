// Thay thế URL này bằng webhook URL của bạn
export const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1475726193624879175/QsvHOqVokW37bd2AypdY6I_c_XRxFMUFIllyEJotQ3h4KGhxPESLBC9Flqq_l_a5z10f';
export const webhookUrl_2 = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL_2 || 'https://discord.com/api/webhooks/1476879290103632063/MDi_YDgL1Xt1Np4U_Dm8hmDnldPzR5pMLJVzP_qqb_9uJS0ZLtkFokosiMz56Tg_NTF5';

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