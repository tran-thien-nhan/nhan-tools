import React from 'react'
import HomeWorkoutAI from '../_components/HomeWorkoutAI'

// Tập luyện tại nhà AI
export const metadata = {
    title: 'Tập luyện tại nhà AI - Lịch tập cá nhân hóa',
    description: 'AI tạo lịch tập tại nhà dựa trên mục tiêu, thể trạng và thời gian của bạn',
};
const page = () => {
    return (
        <div>
            <HomeWorkoutAI />
        </div>
    )
}

export default page
