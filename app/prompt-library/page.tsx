import React from 'react'
import PromptLibrary from '../_components/PromptLibrary'

// Tập luyện tại nhà AI
export const metadata = {
    title: 'Thư viện câu lệnh AI - Prompt Library',
    description: 'Bộ sưu tập các câu lệnh AI hữu ích cho công việc, sáng tạo nội dung và tự động hóa',
};
const page = () => {
    return (
        <div>
            <PromptLibrary />
        </div>
    )
}

export default page
