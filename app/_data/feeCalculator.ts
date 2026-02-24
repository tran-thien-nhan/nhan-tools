import { FEE_CONFIG } from "./feeConfig";
import { FeeBreakdown, LoanPayment, PropertyFees } from "./realEstate";

export class FeeCalculator {

    // Tính thuế trước bạ
    static calculateRegistrationTax(
        price: number,
        type: 'apartment' | 'house' | 'land' | 'commercial' = 'apartment',
        customerType: 'individual' | 'company' = 'individual'
    ): number {
        const rate = customerType === 'company'
            ? FEE_CONFIG.registrationTax.company
            : FEE_CONFIG.registrationTax[type];

        return price * rate;
    }

    // Tính phí công chứng theo biểu phí
    static calculateNotaryFee(price: number): number {
        const tiers = FEE_CONFIG.notaryFee.tiers;

        for (const tier of tiers) {
            if (price <= tier.max) {
                return price * tier.rate + tier.fixed;
            }
        }
        return price * 0.0005 + 14_100_000; // Cao nhất
    }

    // Tính phí sang tên
    static calculateTransferFee(price: number): number {
        const appraisalFee = Math.max(
            price * FEE_CONFIG.transferFee.appraisal,
            FEE_CONFIG.transferFee.minAppraisal
        );

        return FEE_CONFIG.transferFee.application +
            appraisalFee +
            FEE_CONFIG.transferFee.certificate;
    }

    // Tính phí môi giới
    static calculateBrokerageFee(price: number, rate: number = FEE_CONFIG.brokerageFee.defaultRate): number {
        const fee = Math.max(price * rate, FEE_CONFIG.brokerageFee.min);
        return fee * (1 + FEE_CONFIG.brokerageFee.vat); // Đã bao gồm VAT
    }

    // Tính lãi vay ngân hàng
    static calculateLoanPayment(
        loanAmount: number,
        annualRate: number,
        months: number
    ): LoanPayment {
        const monthlyRate = annualRate / 12;
        const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) /
            (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = monthlyPayment * months;

        return {
            loanAmount,
            interestRate: annualRate,
            loanTerm: months,
            monthlyPayment,
            totalInterest: totalPayment - loanAmount,
            totalPayment
        };
    }

    // Tính tổng chi phí
    static calculateTotalFees(
        price: number,
        options: {
            propertyType?: 'apartment' | 'house' | 'land' | 'commercial';
            customerType?: 'individual' | 'company';
            brokerageRate?: number;
            loanAmount?: number;
            loanRate?: number;
            loanTerm?: number;
        } = {}
    ): PropertyFees {
        const {
            propertyType = 'apartment',
            customerType = 'individual',
            brokerageRate = FEE_CONFIG.brokerageFee.defaultRate,
            loanAmount,
            loanRate,
            loanTerm
        } = options;

        // Tính từng khoản phí
        const registrationTax = this.calculateRegistrationTax(price, propertyType, customerType);
        const notaryFee = this.calculateNotaryFee(price);
        const transferFee = this.calculateTransferFee(price);
        const brokerageFee = this.calculateBrokerageFee(price, brokerageRate);

        // Tính lãi vay nếu có
        let loanPayment: LoanPayment | undefined;
        if (loanAmount && loanRate && loanTerm) {
            loanPayment = this.calculateLoanPayment(loanAmount, loanRate, loanTerm);
        }

        const totalFees = registrationTax + notaryFee + transferFee + brokerageFee;

        return {
            propertyPrice: price,
            registrationTax,
            notaryFee,
            transferFee,
            brokerageFee,
            loanPayment,
            totalFees,
            totalCost: price + totalFees
        };
    }

    // Lấy chi tiết từng khoản phí để hiển thị
    static getFeeBreakdown(fees: PropertyFees): FeeBreakdown[] {
        return [
            {
                label: 'Thuế trước bạ',
                value: fees.registrationTax,
                formula: '0.5% giá trị BĐS',
                color: 'blue'
            },
            {
                label: 'Phí công chứng',
                value: fees.notaryFee,
                formula: 'Theo biểu phí Thông tư 257/2016',
                color: 'green'
            },
            {
                label: 'Phí sang tên',
                value: fees.transferFee,
                formula: 'Phí hồ sơ + thẩm định + cấp giấy',
                color: 'purple'
            },
            {
                label: 'Phí môi giới (đã bao gồm VAT)',
                value: fees.brokerageFee,
                formula: '2% giá trị BĐS + VAT 10%',
                color: 'orange'
            }
        ];
    }

    // Format tiền Việt Nam
    static formatVND(amount: number): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
}