import React from 'react'
import HomeComponent from '../_components/HomeComponent'

// Trang chủ
export const metadata = {
    title: 'Trang chủ - Bộ công cụ cá nhân',
    description: 'Tổng hợp các công cụ hỗ trợ công việc, tập luyện, AI và bất động sản',
};
const page = () => {
    return (
        <div>
            <HomeComponent />
        </div>
    )
}

export default page
