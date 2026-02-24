export interface PropertyFees {
    // Giá trị BĐS
    propertyPrice: number;
    landArea?: number; // m2
    constructionArea?: number; // m2

    // Kết quả tính toán
    registrationTax: number; // Thuế trước bạ
    notaryFee: number; // Phí công chứng
    transferFee: number; // Phí sang tên
    brokerageFee: number; // Phí môi giới
    loanPayment?: LoanPayment; // Chi phí vay

    totalFees: number; // Tổng phí (không bao gồm tiền vay)
    totalCost: number; // Tổng chi phí (giá BĐS + phí)
}

export interface LoanPayment {
    loanAmount: number; // Số tiền vay
    interestRate: number; // Lãi suất năm (%)
    loanTerm: number; // Thời gian vay (tháng)
    monthlyPayment: number; // Trả hàng tháng
    totalInterest: number; // Tổng lãi
    totalPayment: number; // Tổng trả (gốc + lãi)
}

export interface FeeBreakdown {
    label: string;
    value: number;
    formula: string;
    color: string;
}

export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial';
export type CustomerType = 'individual' | 'company';