import React from 'react'
import WhatsForDinner from '../_components/WhatsForDinner'

// Nhà còn gì để nấu
export const metadata = {
    title: 'Nhà còn gì để nấu - Gợi ý món ăn bằng AI',
    description: 'Nhập ngân sách và nguyên liệu có sẵn, AI sẽ gợi ý món ăn phù hợp',
};
const page = () => {
    return (
        <div>
            <WhatsForDinner />
        </div>
    )
}

export default page
