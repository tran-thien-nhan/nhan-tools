import { PromptCategory } from "./category";
import { prompt_1, prompt_2, prompt_3, prompt_4, prompt_5, prompt_6 } from "./prompt";

export interface Prompt {
    title: string;
    content: string;
    category: PromptCategory;
}

const promptsData: Prompt[] = [
    {
        title: "CTA trong tin đăng BĐS",
        content: `${prompt_4}`,
        category: PromptCategory.SEO
    },
    {
        title: "Tóm tắt video YouTube",
        content: `${prompt_1}`,
        category: PromptCategory.VIDEO
    },
    {
        title: "Tạo tin đăng BĐS",
        content: `${prompt_3}`,
        category: PromptCategory.BĐS
    },
    {
        title: "Tạo hình ảnh veo 3 cho BĐS",
        content: `${prompt_5}`,
        category: PromptCategory.IMAGE
    },
    {
        title: "Tạo kịch bản đọc tiktok",
        content: `${prompt_6}`,
        category: PromptCategory.TIKTOK
    }
];

export default promptsData;