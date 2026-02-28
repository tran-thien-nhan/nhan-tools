import React from 'react'
import CodeGenerator from '../_components/CodeGenerate'

// Tạo mã ngẫu nhiên
export const metadata = {
    title: 'Tạo mã ngẫu nhiên - Random Code Generator',
    description: 'Tạo chuỗi ký tự ngẫu nhiên an toàn, tùy chỉnh độ dài và ký tự',
};
const page = () => {
    return (
        <div>
            <CodeGenerator />
        </div>
    )
}

export default page
