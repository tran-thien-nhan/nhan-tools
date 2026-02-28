import React from 'react'
import TabataTimer from '../_components/TabataTimer'

// Đếm giờ Tabata
export const metadata = {
    title: 'Đếm giờ Tabata - HIIT Timer',
    description: 'Đồng hồ tập luyện Tabata, hỗ trợ tập cường độ cao ngắt quãng',
};
const page = () => {
    return (
        <div>
            <TabataTimer />
        </div>
    )
}

export default page
