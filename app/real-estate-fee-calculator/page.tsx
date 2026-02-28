import React from 'react'
import RealEstateFeeCalculator from '../_components/RealEstateFeeCalculator'

// Tính chi phí BĐS
export const metadata = {
    title: 'Tính chi phí bất động sản - Real Estate Fee Calculator',
    description: 'Tính thuế trước bạ, công chứng, sang tên, môi giới và lãi vay ngân hàng',
};
const page = () => {
    return (
        <div>
            <RealEstateFeeCalculator />
        </div>
    )
}

export default page
