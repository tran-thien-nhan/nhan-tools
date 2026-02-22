"use client"
import { Check, Copy, Loader2, Sparkles, RotateCcw, Building2, Phone } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn, copyToClipboard } from '../utils';
import { GoogleGenAI } from "@google/genai";
import { model } from '../_data/model';
import { prompt_3 } from '../_data/prompt';

const RealEstatePost = () => {
    const [inputText, setInputText] = useState('');
    const [generatedPost, setGeneratedPost] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [contactCopied, setContactCopied] = useState(false);

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            setError('Vui lòng nhập thông tin bất động sản');
            return;
        }

        setIsGenerating(true);
        setError('');
        setGeneratedPost('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

            const prompt = `Bạn là chuyên viên môi giới bất động sản. Dựa vào thông tin sau, hãy viết một bài đăng bán/thuê bất động sản chuyên nghiệp và hấp dẫn:

THÔNG TIN BĐS:
${inputText}

YÊU CẦU BÀI ĐĂNG:
${prompt_3}`;

            const response = await ai.models.generateContent({
                model: model,
                contents: prompt,
            });

            if (response.text) {
                setGeneratedPost(response.text);
            } else {
                setError('Không thể tạo bài đăng.');
            }
        } catch (err) {
            console.error('Generation error:', err);
            setError('Không thể tạo bài đăng. Vui lòng thử lại.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = () => {
        setInputText('');
        setGeneratedPost('');
        setError('');
        setCopied(false);
    };

    const copyContactInfo = () => {
        const contactText = "Liên hệ trực tiếp Nhân 0909941199 để được hỗ trợ xem nhà, kiểm tra pháp lý – quy hoạch rõ ràng, thương lượng giá tốt nhất với chủ và hỗ trợ trọn gói công chứng, sang tên nhanh gọn.";
        copyToClipboard(setContactCopied, contactText);
    };

    return (
        <div className="w-full h-full flex items-start justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden flex flex-col min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)]">
                {/* Tool Header */}
                <div className="p-4 sm:p-6 border-b border-zinc-100 bg-gradient-to-r from-amber-50 to-orange-50 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                                Tạo Tin Đăng BĐS
                            </h1>
                            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                                Nhập thông tin bất động sản, AI sẽ viết bài đăng chuyên nghiệp
                            </p>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={handleReset}
                            disabled={isGenerating || (!inputText && !generatedPost)}
                            className={cn(
                                "p-2 sm:p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-medium",
                                (!inputText && !generatedPost) || isGenerating
                                    ? "border-zinc-200 text-zinc-400 cursor-not-allowed bg-zinc-50"
                                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:border-zinc-300 active:scale-95"
                            )}
                            title="Reset all fields"
                        >
                            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Input Area */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-zinc-700 uppercase tracking-wider">
                                Thông tin bất động sản
                            </label>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ví dụ: Bán nhà mặt tiền Quận 7, 100m2, 4 tầng, giá 20 tỷ. Gần Phú Mỹ Hưng, sổ hồng chính chủ. Liên hệ: 090 123 4567"
                                className="w-full h-40 sm:h-48 p-3 sm:p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none text-sm"
                            />

                            {inputText && (
                                <div className="text-xs text-zinc-500">
                                    {inputText.length} ký tự
                                </div>
                            )}
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !inputText.trim()}
                            className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-zinc-400 disabled:to-zinc-400 text-white font-bold rounded-xl shadow-lg shadow-amber-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            ) : (
                                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            {isGenerating ? 'ĐANG TẠO BÀI ĐĂNG...' : 'TẠO TIN ĐĂNG'}
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs sm:text-sm">
                                {error}
                            </div>
                        )}

                        {/* Generated Post */}
                        {generatedPost && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">
                                        Bài đăng đã tạo
                                    </label>
                                    <button
                                        onClick={() => copyToClipboard(setCopied, generatedPost)}
                                        className="text-amber-600 hover:text-amber-700 text-xs font-bold flex items-center gap-1"
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'ĐÃ COPY' : 'COPY BÀI ĐĂNG'}
                                    </button>
                                </div>
                                <div className="p-4 sm:p-6 bg-amber-50/50 border border-amber-100 rounded-xl prose prose-sm max-w-none prose-amber overflow-x-auto">
                                    <ReactMarkdown>{generatedPost}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        {!generatedPost && inputText && !isGenerating && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleReset}
                                    className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Xóa input
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Information with Copy Button */}
                <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 border-t border-blue-700">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-xs sm:text-sm text-white flex items-center gap-2">
                                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                                <span>Liên hệ trực tiếp Nhân 0909941199 để được hỗ trợ xem nhà, kiểm tra pháp lý – quy hoạch rõ ràng, thương lượng giá tốt nhất với chủ và hỗ trợ trọn gói công chứng, sang tên nhanh gọn.</span>
                            </p>
                        </div>
                        <button
                            onClick={copyContactInfo}
                            className="flex-shrink-0 px-4 py-2 bg-white hover:bg-blue-50 text-blue-600 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                        >
                            {contactCopied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    ĐÃ COPY
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    COPY
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer Tips */}
                <div className="px-4 sm:px-6 py-3 bg-amber-50 border-t border-amber-200">
                    <p className="text-xs text-amber-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Mẹo: Nhập càng nhiều thông tin chi tiết (vị trí, giá, diện tích, pháp lý, tiện ích,...), bài đăng càng chuyên nghiệp.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RealEstatePost;