// app/whats-for-dinner/page.tsx
'use client';

import { Check, Copy, Loader2, Sparkles, RotateCcw, ArrowLeft, ChefHat, Calendar, DollarSign, Leaf, ShoppingCart, PiggyBank, TrendingUp, Sun, Cloud, Coffee } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { cn, copyToClipboard } from '@/app/utils';

const WhatsForDinner = () => {
    const [budget, setBudget] = useState<string>('');
    const [days, setDays] = useState<string>('3');
    const [dietType, setDietType] = useState<'man' | 'chay'>('man');
    const [ingredients, setIngredients] = useState<string>('');
    const [suggestion, setSuggestion] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const handleSubmit = async () => {
        if (!budget.trim()) {
            setError('Vui lòng nhập số tiền bạn có');
            return;
        }

        if (parseInt(budget) < 20000) {
            setError('Số tiền quá ít, tối thiểu 20,000 VND để có thể đi chợ');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuggestion('');

        try {
            const response = await fetch('/api/gemini/meal-suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    budget: parseInt(budget),
                    days: parseInt(days),
                    dietType: dietType,
                    ingredients: ingredients
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Có lỗi xảy ra');
            }

            setSuggestion(data.suggestion);
        } catch (err) {
            console.error('Meal suggestion error:', err);
            setError(err instanceof Error ? err.message : 'Không thể gợi ý thực đơn. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setBudget('');
        setDays('3');
        setDietType('man');
        setIngredients('');
        setSuggestion('');
        setError('');
        setCopied(false);
    };

    // Tính toán gợi ý nhanh (không cần AI)
    const getQuickTip = () => {
        if (!budget || !days) return null;

        const perDay = parseInt(budget) / parseInt(days);
        const perMeal = perDay / 3;

        let tip = '';
        let tipColor = '';
        if (perMeal < 15000) {
            tip = '💰 "Siêu tiết kiệm" - Tập trung vào gạo, mì, trứng, đậu phụ';
            tipColor = 'from-amber-400 to-orange-400';
        } else if (perMeal < 30000) {
            tip = '🛒 "Vừa túi tiền" - Có thể thêm thịt hoặc cá nhỏ';
            tipColor = 'from-green-400 to-emerald-400';
        } else {
            tip = '✨ "Thoải mái" - Đa dạng thực phẩm, nhiều lựa chọn';
            tipColor = 'from-blue-400 to-cyan-400';
        }

        return {
            perDay: perDay.toFixed(0),
            perMeal: perMeal.toFixed(0),
            tip,
            tipColor
        };
    };

    const quickTip = getQuickTip();

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header với nút Back */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/"
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-orange-600" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl shadow-lg shadow-orange-200/50">
                            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 flex-wrap">
                                Nhà còn gì để nấu?
                                <span className="text-xs bg-gradient-to-r from-orange-400 to-amber-400 text-white px-3 py-1 rounded-full shadow-sm">
                                    Tiết kiệm thông minh
                                </span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">
                                Nhập số tiền và số ngày, AI sẽ lên thực đơn và gợi ý đi chợ tiết kiệm
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-orange-200/50 border border-orange-100 overflow-hidden">
                    {/* Tool Header */}
                    <div className="p-4 sm:p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg shadow-md">
                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    AI Lên thực đơn & Đi chợ
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Reset Button */}
                                <button
                                    onClick={handleReset}
                                    disabled={isLoading || (!budget && !ingredients && !suggestion)}
                                    className={cn(
                                        "p-2 sm:p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-medium",
                                        (!budget && !ingredients && !suggestion) || isLoading
                                            ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                                            : "border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 active:scale-95 bg-white"
                                    )}
                                    title="Reset tất cả"
                                >
                                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Reset</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        {quickTip && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                                    <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="font-medium">Mỗi ngày</span>
                                    </div>
                                    <p className="text-gray-800 font-bold text-xl">{parseInt(quickTip.perDay).toLocaleString()}đ</p>
                                    <p className="text-xs text-gray-500 mt-1">~ {parseInt(quickTip.perMeal).toLocaleString()}đ/bữa</p>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                                    <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="font-medium">Khẩu phần</span>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <div className="flex-1 text-center p-2 bg-orange-50 rounded-lg">
                                            <span className="text-xs text-gray-600">Sáng</span>
                                            <p className="text-orange-600 font-bold">{(parseInt(quickTip.perMeal) * 0.7).toFixed(0)}đ</p>
                                        </div>
                                        <div className="flex-1 text-center p-2 bg-amber-50 rounded-lg">
                                            <span className="text-xs text-gray-600">Trưa</span>
                                            <p className="text-amber-600 font-bold">{(parseInt(quickTip.perMeal) * 1.2).toFixed(0)}đ</p>
                                        </div>
                                        <div className="flex-1 text-center p-2 bg-orange-50 rounded-lg">
                                            <span className="text-xs text-gray-600">Tối</span>
                                            <p className="text-orange-600 font-bold">{(parseInt(quickTip.perMeal) * 1.1).toFixed(0)}đ</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={cn(
                                    "rounded-xl p-4 shadow-sm border",
                                    "bg-gradient-to-r text-white",
                                    quickTip.tipColor
                                )}>
                                    <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
                                        <PiggyBank className="w-4 h-4" />
                                        <span className="font-medium">Gợi ý</span>
                                    </div>
                                    <p className="text-white text-sm font-medium">{quickTip.tip}</p>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                            <p className="flex items-start gap-2 text-sm text-gray-700">
                                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                                <span>
                                    <strong className="text-blue-600">✨ Công cụ thông minh:</strong> Nhập số tiền, số ngày cần cầm cự, chọn ăn chay/mặn và nguyên liệu có sẵn.
                                    AI sẽ lên thực đơn chi tiết từng ngày, gợi ý đi chợ tiết kiệm và mẹo nấu ăn!
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Input Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Budget Input */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-medium flex items-center gap-1">
                                        <DollarSign className="w-4 h-4 text-orange-500" />
                                        Số tiền (VND)
                                    </label>
                                    <input
                                        type="number"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        placeholder="VD: 500000"
                                        className="w-full p-3 bg-white border border-orange-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all text-sm"
                                        min="20000"
                                    />
                                </div>

                                {/* Days Input */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-medium flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        Số ngày
                                    </label>
                                    <select
                                        value={days}
                                        onChange={(e) => setDays(e.target.value)}
                                        className="w-full p-3 bg-white border border-orange-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all text-sm"
                                    >
                                        <option value="1">1 ngày</option>
                                        <option value="2">2 ngày</option>
                                        <option value="3">3 ngày</option>
                                        <option value="4">4 ngày</option>
                                        <option value="5">5 ngày</option>
                                        <option value="6">6 ngày</option>
                                        <option value="7">7 ngày (1 tuần)</option>
                                    </select>
                                </div>

                                {/* Diet Type */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-medium flex items-center gap-1">
                                        <Leaf className="w-4 h-4 text-orange-500" />
                                        Chế độ ăn
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setDietType('man')}
                                            className={cn(
                                                "flex-1 p-3 rounded-xl border transition-all text-sm font-medium",
                                                dietType === 'man'
                                                    ? "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-md"
                                                    : "bg-white border-orange-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300"
                                            )}
                                        >
                                            🥩 Mặn
                                        </button>
                                        <button
                                            onClick={() => setDietType('chay')}
                                            className={cn(
                                                "flex-1 p-3 rounded-xl border transition-all text-sm font-medium",
                                                dietType === 'chay'
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-400 text-white shadow-md"
                                                    : "bg-white border-orange-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300"
                                            )}
                                        >
                                            🌱 Chay
                                        </button>
                                    </div>
                                </div>

                                {/* Ingredients Input */}
                                <div className="space-y-2 lg:col-span-1">
                                    <label className="block text-gray-700 text-sm font-medium flex items-center gap-1">
                                        <ShoppingCart className="w-4 h-4 text-orange-500" />
                                        Nguyên liệu có sẵn
                                    </label>
                                    <input
                                        type="text"
                                        value={ingredients}
                                        onChange={(e) => setIngredients(e.target.value)}
                                        placeholder="VD: gạo, trứng, hành, khoai tây"
                                        className="w-full p-3 bg-white border border-orange-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || !budget.trim()}
                                className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-orange-200/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        ĐANG LÊN KẾ HOẠCH...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                        LÊN THỰC ĐƠN & ĐI CHỢ TIẾT KIỆM
                                    </>
                                )}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 sm:p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs sm:text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Suggestion Result */}
                            {suggestion && (
                                <div className="space-y-2 sm:space-y-3 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm sm:text-base font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                            <div className="p-1.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg">
                                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            KẾ HOẠCH CHI TIẾT
                                        </label>
                                        <button
                                            onClick={() => copyToClipboard(setCopied, suggestion)}
                                            className="px-3 py-1.5 bg-white border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-50 text-xs font-bold flex items-center gap-1.5 transition-all"
                                        >
                                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            {copied ? 'ĐÃ COPY' : 'COPY'}
                                        </button>
                                    </div>
                                    <div className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl sm:rounded-2xl prose prose-orange max-w-none overflow-x-auto">
                                        <ReactMarkdown>{suggestion}</ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            {!suggestion && budget && !isLoading && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleReset}
                                        className="text-xs text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Xóa input
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Tips */}
                    {!suggestion && (
                        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100">
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                                    Nhập nguyên liệu có sẵn để tiết kiệm hơn
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                                    Đi chợ 1 lần cho nhiều ngày
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                                    Chọn món dễ nấu, dễ bảo quản
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Thêm vài decoration */}
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>✨ Nấu ăn vui vẻ, tiết kiệm thông minh cùng AI ✨</p>
                </div>
            </div>

            {/* Thêm CSS animation */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WhatsForDinner;