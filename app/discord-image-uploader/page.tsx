import React from 'react'
import DiscordImageUploader from '../_components/DiscordImageUploader'

export const metadata = {
    title: 'Tải ảnh lên Discord - Discord Image Uploader',
    description: 'Upload hình ảnh trực tiếp lên kênh Discord thông qua webhook nhanh chóng và tiện lợi',
}

const page = () => {
    return (
        <div>
            <DiscordImageUploader />
        </div>
    )
}

export default page