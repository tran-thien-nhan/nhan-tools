import React from 'react'
import TarotReader from '../_components/TarotReader'

// Xem bài Tarot
export const metadata = {
    title: 'Xem bài Tarot AI - Trải bài trực tuyến',
    description: 'Xem bói Tarot với trí tuệ nhân tạo, giải mã thông điệp và định hướng',
};
const page = () => {
    return (
        <div>
            <TarotReader />
        </div>
    )
}

export default page
