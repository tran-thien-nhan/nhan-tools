import React from 'react'
import AISummarize from '../_components/AISummarize'

// Tóm tắt văn bản AI
export const metadata = {
    title: 'Tóm tắt văn bản AI - AI Summarizer',
    description: 'Tóm tắt nội dung văn bản nhanh chóng và thông minh bằng AI',
};
const page = () => {
    return (
        <div>
            <AISummarize />
        </div>
    )
}

export default page
