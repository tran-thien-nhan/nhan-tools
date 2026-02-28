import React from 'react'
import HashtagGenerator from '../_components/HashtagGenerator'

// Tạo thẻ SEO
export const metadata = {
    title: 'Tạo thẻ SEO - SEO Meta Generator',
    description: 'Tự động tạo tiêu đề, mô tả và từ khóa chuẩn SEO cho website',
};
const page = () => {
    return (
        <div>
            <HashtagGenerator />
        </div>
    )
}

export default page
