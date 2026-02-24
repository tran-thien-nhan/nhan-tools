"use client"
import React, { useState, useEffect } from 'react';
import {
    Calculator,
    DollarSign,
    Home,
    Building,
    Landmark,
    Users,
    Banknote,
    Calendar,
    Percent,
    FileText,
    Copy,
    Check,
    TrendingUp,
    Info,
    RotateCcw
} from 'lucide-react';
import { cn } from '@/app/utils';
import { FEE_CONFIG } from '@/app/_data/feeConfig';
import { FeeCalculator } from '../_data/feeCalculator';
import { FeeBreakdown } from '../_data/realEstate';

const RealEstateFeeCalculator: React.FC = () => {
    // State cho thông tin BĐS
    const [propertyPrice, setPropertyPrice] = useState<number>(3000000000); // 3 tỷ mặc định
    const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'land' | 'commercial'>('apartment');
    const [customerType, setCustomerType] = useState<'individual' | 'company'>('individual');
    const [brokerageRate, setBrokerageRate] = useState<number>(FEE_CONFIG.brokerageFee.defaultRate * 100);

    // State cho vay ngân hàng
    const [includeLoan, setIncludeLoan] = useState<boolean>(false);
    const [loanAmount, setLoanAmount] = useState<number>(0);
    const [loanRate, setLoanRate] = useState<number>(8.5);
    const [loanTerm, setLoanTerm] = useState<number>(240); // 20 năm mặc định

    // State kết quả
    const [result, setResult] = useState<any>(null);
    const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown[]>([]);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'loan'>('overview');

    // Tính toán khi thay đổi input
    useEffect(() => {
        calculateFees();
    }, [propertyPrice, propertyType, customerType, brokerageRate, includeLoan, loanAmount, loanRate, loanTerm]);

    const calculateFees = () => {
        const fees = FeeCalculator.calculateTotalFees(propertyPrice, {
            propertyType,
            customerType,
            brokerageRate: brokerageRate / 100,
            ...(includeLoan && loanAmount > 0 && {
                loanAmount,
                loanRate: loanRate / 100,
                loanTerm
            })
        });

        setResult(fees);
        setFeeBreakdown(FeeCalculator.getFeeBreakdown(fees));
    };

    // Reset về mặc định
    const handleReset = () => {
        setPropertyPrice(3000000000);
        setPropertyType('apartment');
        setCustomerType('individual');
        setBrokerageRate(2);
        setIncludeLoan(false);
        setLoanAmount(0);
        setLoanRate(8.5);
        setLoanTerm(240);
    };

    // Copy kết quả
    const copyResults = () => {
        if (!result) return;

        const text = `
CHI PHÍ MUA BẤT ĐỘNG SẢN
═══════════════════════

💰 GIÁ TRỊ BĐS: ${FeeCalculator.formatVND(result.propertyPrice)}
📋 LOẠI BĐS: ${propertyType === 'apartment' ? 'Căn hộ' : propertyType === 'house' ? 'Nhà ở' : propertyType === 'land' ? 'Đất' : 'BĐS thương mại'}
👤 ĐỐI TƯỢNG: ${customerType === 'individual' ? 'Cá nhân' : 'Tổ chức'}

📊 CHI TIẾT PHÍ:
${feeBreakdown.map(f => `${f.label}: ${FeeCalculator.formatVND(f.value)}`).join('\n')}

📈 TỔNG PHÍ: ${FeeCalculator.formatVND(result.totalFees)}
💵 TỔNG CHI PHÍ: ${FeeCalculator.formatVND(result.totalCost)}

${result.loanPayment ? `
🏦 VAY NGÂN HÀNG:
- Số tiền vay: ${FeeCalculator.formatVND(result.loanPayment.loanAmount)}
- Lãi suất: ${result.loanPayment.interestRate}%/năm
- Thời gian: ${result.loanPayment.loanTerm} tháng
- Trả hàng tháng: ${FeeCalculator.formatVND(result.loanPayment.monthlyPayment)}
- Tổng lãi: ${FeeCalculator.formatVND(result.loanPayment.totalInterest)}
- Tổng trả: ${FeeCalculator.formatVND(result.loanPayment.totalPayment)}
` : ''}

⏰ Tính ngày: ${new Date().toLocaleDateString('vi-VN')}
        `;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full h-full flex items-start justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="w-full max-w-7xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-emerald-200/50 border border-emerald-100 overflow-hidden flex flex-col min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)]">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-emerald-100 bg-emerald-50/50 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-900 flex items-center gap-2">
                                <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                Tính Chi Phí Bất Động Sản
                            </h1>
                            <p className="text-xs sm:text-sm text-emerald-600 mt-1">
                                Tính toán đầy đủ các khoản phí: thuế, công chứng, sang tên, môi giới, vay ngân hàng
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={copyResults}
                                disabled={!result}
                                className="p-2 sm:p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-medium active:scale-95"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Đã copy' : 'Copy kết quả'}
                            </button>

                            <button
                                onClick={handleReset}
                                className="p-2 sm:p-2.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 text-emerald-600 transition-all"
                                title="Reset"
                            >
                                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="space-y-6">
                        {/* Input Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Thông tin BĐS */}
                            <div className="space-y-4">
                                <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                                    <Home className="w-4 h-4" />
                                    Thông tin bất động sản
                                </h2>

                                {/* Giá trị BĐS */}
                                <div className="space-y-2">
                                    <label className="text-xs text-emerald-600 flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        Giá trị BĐS (VNĐ)
                                    </label>
                                    <input
                                        type="number"
                                        value={propertyPrice}
                                        onChange={(e) => setPropertyPrice(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                        min="0"
                                        step="1000000"
                                    />
                                    <div className="flex gap-2 text-xs">
                                        <button onClick={() => setPropertyPrice(1000000000)} className="px-2 py-1 bg-emerald-100 rounded-lg">1 tỷ</button>
                                        <button onClick={() => setPropertyPrice(2000000000)} className="px-2 py-1 bg-emerald-100 rounded-lg">2 tỷ</button>
                                        <button onClick={() => setPropertyPrice(3000000000)} className="px-2 py-1 bg-emerald-100 rounded-lg">3 tỷ</button>
                                        <button onClick={() => setPropertyPrice(5000000000)} className="px-2 py-1 bg-emerald-100 rounded-lg">5 tỷ</button>
                                    </div>
                                </div>

                                {/* Loại BĐS */}
                                <div className="space-y-2">
                                    <label className="text-xs text-emerald-600 flex items-center gap-1">
                                        <Building className="w-3 h-3" />
                                        Loại bất động sản
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setPropertyType('apartment')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                                propertyType === 'apartment'
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            )}
                                        >
                                            Căn hộ
                                        </button>
                                        <button
                                            onClick={() => setPropertyType('house')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                                propertyType === 'house'
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            )}
                                        >
                                            Nhà ở
                                        </button>
                                        <button
                                            onClick={() => setPropertyType('land')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                                propertyType === 'land'
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            )}
                                        >
                                            Đất
                                        </button>
                                        <button
                                            onClick={() => setPropertyType('commercial')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                                propertyType === 'commercial'
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            )}
                                        >
                                            Thương mại
                                        </button>
                                    </div>
                                </div>

                                {/* Đối tượng mua */}
                                <div className="space-y-2">
                                    <label className="text-xs text-emerald-600 flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        Đối tượng mua
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setCustomerType('individual')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                                customerType === 'individual'
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            )}
                                        >
                                            Cá nhân
                                        </button>
                                        <button
                                            onClick={() => setCustomerType('company')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                                customerType === 'company'
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            )}
                                        >
                                            Tổ chức/Công ty
                                        </button>
                                    </div>
                                </div>

                                {/* Phí môi giới */}
                                <div className="space-y-2">
                                    <label className="text-xs text-emerald-600 flex items-center gap-1">
                                        <Percent className="w-3 h-3" />
                                        Phí môi giới (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={brokerageRate}
                                        onChange={(e) => setBrokerageRate(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                    />
                                    <p className="text-xs text-emerald-500">Tối đa 5% theo quy định</p>
                                </div>
                            </div>

                            {/* Thông tin vay vốn */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                                        <Banknote className="w-4 h-4" />
                                        Vay ngân hàng
                                    </h2>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeLoan}
                                            onChange={(e) => setIncludeLoan(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-emerald-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                {includeLoan && (
                                    <div className="space-y-4">
                                        {/* Số tiền vay */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-emerald-600">Số tiền vay (VNĐ)</label>
                                            <input
                                                type="number"
                                                value={loanAmount}
                                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                                className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                max={propertyPrice}
                                                min="0"
                                                step="1000000"
                                            />
                                        </div>

                                        {/* Lãi suất */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-emerald-600">Lãi suất (%/năm)</label>
                                            <input
                                                type="number"
                                                value={loanRate}
                                                onChange={(e) => setLoanRate(Number(e.target.value))}
                                                className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                min="0"
                                                max="20"
                                                step="0.1"
                                            />
                                            <div className="flex flex-wrap gap-1">
                                                {FEE_CONFIG.bankRates.map((bank, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setLoanRate(bank.rate * 100)}
                                                        className="px-2 py-1 text-xs bg-emerald-100 rounded-lg hover:bg-emerald-200"
                                                    >
                                                        {bank.bank}: {bank.rate * 100}%
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Thời gian vay */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-emerald-600 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Thời gian vay (tháng)
                                            </label>
                                            <select
                                                value={loanTerm}
                                                onChange={(e) => setLoanTerm(Number(e.target.value))}
                                                className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                            >
                                                <option value={60}>5 năm (60 tháng)</option>
                                                <option value={120}>10 năm (120 tháng)</option>
                                                <option value={180}>15 năm (180 tháng)</option>
                                                <option value={240}>20 năm (240 tháng)</option>
                                                <option value={300}>25 năm (300 tháng)</option>
                                                <option value={360}>30 năm (360 tháng)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Thông tin thêm */}
                                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                                    <h3 className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        Lưu ý:
                                    </h3>
                                    <ul className="text-xs text-emerald-600 space-y-1 list-disc list-inside">
                                        <li>Thuế trước bạ: 0.5% cho cá nhân, 2% cho tổ chức</li>
                                        <li>Phí công chứng tính theo Thông tư 257/2016</li>
                                        <li>Phí sang tên đã bao gồm phí thẩm định và cấp giấy</li>
                                        <li>Phí môi giới đã bao gồm VAT 10%</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Kết quả */}
                        {result && (
                            <div className="space-y-4">
                                {/* Tabs */}
                                <div className="flex gap-2 border-b border-emerald-100">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium transition-all border-b-2",
                                            activeTab === 'overview'
                                                ? "border-emerald-600 text-emerald-700"
                                                : "border-transparent text-emerald-500 hover:text-emerald-600"
                                        )}
                                    >
                                        Tổng quan
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('breakdown')}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium transition-all border-b-2",
                                            activeTab === 'breakdown'
                                                ? "border-emerald-600 text-emerald-700"
                                                : "border-transparent text-emerald-500 hover:text-emerald-600"
                                        )}
                                    >
                                        Chi tiết phí
                                    </button>
                                    {includeLoan && (
                                        <button
                                            onClick={() => setActiveTab('loan')}
                                            className={cn(
                                                "px-4 py-2 text-sm font-medium transition-all border-b-2",
                                                activeTab === 'loan'
                                                    ? "border-emerald-600 text-emerald-700"
                                                    : "border-transparent text-emerald-500 hover:text-emerald-600"
                                            )}
                                        >
                                            Vay ngân hàng
                                        </button>
                                    )}
                                </div>

                                {/* Tab content */}
                                <div className="bg-emerald-50/30 rounded-xl p-6">
                                    {activeTab === 'overview' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-white rounded-xl p-4 border border-emerald-100">
                                                <p className="text-xs text-emerald-500 mb-1">Giá trị BĐS</p>
                                                <p className="text-2xl font-bold text-emerald-700">
                                                    {FeeCalculator.formatVND(result.propertyPrice)}
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 border border-emerald-100">
                                                <p className="text-xs text-emerald-500 mb-1">Tổng phí (thuế + phí)</p>
                                                <p className="text-2xl font-bold text-orange-600">
                                                    {FeeCalculator.formatVND(result.totalFees)}
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 border border-emerald-100 sm:col-span-2">
                                                <p className="text-xs text-emerald-500 mb-1">Tổng chi phí (bao gồm BĐS)</p>
                                                <p className="text-3xl font-bold text-emerald-600">
                                                    {FeeCalculator.formatVND(result.totalCost)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'breakdown' && (
                                        <div className="space-y-3">
                                            {feeBreakdown.map((fee, index) => (
                                                <div key={index} className="bg-white rounded-xl p-4 border border-emerald-100">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="font-medium text-emerald-800">{fee.label}</p>
                                                        <p className="text-lg font-bold text-emerald-600">
                                                            {FeeCalculator.formatVND(fee.value)}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-emerald-500">{fee.formula}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'loan' && result.loanPayment && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                                                    <p className="text-xs text-emerald-500">Trả hàng tháng</p>
                                                    <p className="text-xl font-bold text-blue-600">
                                                        {FeeCalculator.formatVND(result.loanPayment.monthlyPayment)}
                                                    </p>
                                                </div>
                                                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                                                    <p className="text-xs text-emerald-500">Tổng lãi phải trả</p>
                                                    <p className="text-xl font-bold text-orange-600">
                                                        {FeeCalculator.formatVND(result.loanPayment.totalInterest)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-xl p-4 border border-emerald-100">
                                                <p className="text-xs text-emerald-500 mb-2">Chi tiết khoản vay</p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-emerald-600">Số tiền vay:</span>
                                                        <span className="font-medium">{FeeCalculator.formatVND(result.loanPayment.loanAmount)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-emerald-600">Lãi suất:</span>
                                                        <span className="font-medium">{result.loanPayment.interestRate}%/năm</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-emerald-600">Thời gian:</span>
                                                        <span className="font-medium">{result.loanPayment.loanTerm} tháng</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-emerald-600">Tổng trả (gốc + lãi):</span>
                                                        <span className="font-medium">{FeeCalculator.formatVND(result.loanPayment.totalPayment)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Biểu đồ đơn giản */}
                                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                                    <h3 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Phân bổ chi phí
                                    </h3>
                                    <div className="space-y-2">
                                        {feeBreakdown.map((fee, index) => {
                                            const percentage = (fee.value / result.totalCost) * 100;
                                            return (
                                                <div key={index}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-emerald-600">{fee.label}</span>
                                                        <span className="font-medium">{percentage.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="w-full bg-emerald-100 rounded-full h-2">
                                                        <div
                                                            className={`bg-${fee.color}-500 h-2 rounded-full`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealEstateFeeCalculator;