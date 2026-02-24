export enum PromptCategory {
    DEVELOPMENT = "Phát triển",
    WORKOUT = "Tập luyện",
    CONTENT = "Nội dung",
    TIKTOK = "Tiktok",
    VIDEO = "Video",
    IMAGE = "Hình ảnh",
    SEO = "SEO",
    BĐS = "BĐS"
}

// Helper function để lấy tất cả categories
export const getAllCategories = (): PromptCategory[] => {
    return Object.values(PromptCategory);
};

// Helper function để lấy label hiển thị
export const getCategoryLabel = (category: PromptCategory): string => {
    return category;
};