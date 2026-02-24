export const FEE_CONFIG = {
    // Thuế trước bạ
    registrationTax: {
        apartment: 0.005, // 0.5% cho căn hộ
        house: 0.005, // 0.5% cho nhà ở
        land: 0.005, // 0.5% cho đất
        commercial: 0.02, // 2% cho BĐS kinh doanh
        individual: 0.005, // Cá nhân: 0.5%
        company: 0.02, // Tổ chức: 2%
        maxRate: 0.005, // Trần 0.5% theo NĐ 10/2022
        minRate: 0.005 // Sàn 0.5%
    },
    
    // Phí công chứng (Thông tư 257/2016)
    notaryFee: {
        tiers: [
            { max: 100_000_000, rate: 0.005, fixed: 0 }, // Dưới 100tr: 0.5%
            { max: 500_000_000, rate: 0.004, fixed: 500_000 }, // 100-500tr: 0.4% + 500k
            { max: 1_000_000_000, rate: 0.003, fixed: 2_100_000 }, // 500tr-1 tỷ: 0.3% + 2.1tr
            { max: 3_000_000_000, rate: 0.002, fixed: 5_100_000 }, // 1-3 tỷ: 0.2% + 5.1tr
            { max: 5_000_000_000, rate: 0.001, fixed: 9_100_000 }, // 3-5 tỷ: 0.1% + 9.1tr
            { max: Infinity, rate: 0.0005, fixed: 14_100_000 } // Trên 5 tỷ: 0.05% + 14.1tr
        ]
    },
    
    // Phí sang tên (lệ phí trước bạ + phí thẩm định)
    transferFee: {
        application: 100_000, // Phí nộp hồ sơ: 100k
        appraisal: 0.001, // Phí thẩm định: 0.1% giá trị (tối thiểu 500k)
        certificate: 100_000, // Phí cấp giấy chứng nhận: 100k
        minAppraisal: 500_000 // Phí thẩm định tối thiểu
    },
    
    // Phí môi giới (Luật kinh doanh BĐS)
    brokerageFee: {
        maxRate: 0.05, // Tối đa 5% (thường 1-3%)
        defaultRate: 0.02, // Mặc định 2%
        min: 10_000_000, // Tối thiểu 10tr
        vat: 0.1 // VAT 10% trên phí môi giới
    },
    
    // Lãi suất ngân hàng tham khảo
    bankRates: [
        { bank: 'Vietcombank', rate: 0.085 }, // 8.5%/năm
        { bank: 'Vietinbank', rate: 0.086 },
        { bank: 'BIDV', rate: 0.085 },
        { bank: 'Agribank', rate: 0.084 },
        { bank: 'Techcombank', rate: 0.095 },
        { bank: 'VPBank', rate: 0.098 },
        { bank: 'MB Bank', rate: 0.092 },
        { bank: 'ACB', rate: 0.09 }
    ]
};