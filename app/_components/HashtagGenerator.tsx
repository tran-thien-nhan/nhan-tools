"use client"
import { Check, Copy, Loader2, Sparkles, RotateCcw, Hash, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { cn, copyToClipboard } from '../utils';
import { GoogleGenAI } from "@google/genai";
import { model } from '../_data/model';

const HashtagGenerator = () => {
    const [inputText, setInputText] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [contactCopied, setContactCopied] = useState(false);
    const [selectedCount, setSelectedCount] = useState<number>(30);

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            setError('Vui lòng nhập nội dung');
            return;
        }

        setIsGenerating(true);
        setError('');
        setHashtags([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

            const prompt = `Bạn là chuyên gia tạo hashtag. Dựa vào nội dung sau, hãy tạo ${selectedCount} hashtag chất lượng:

Nội dung: "${inputText}"

Yêu cầu:
- Mỗi hashtag bắt đầu bằng dấu #
- Không dấu, không khoảng trắng, viết liền
- Viết thường để dễ tìm kiếm
- Đa dạng: hashtag ngắn (1 từ), trung bình (2-3 từ), dài (4-6 từ)
- Bao gồm: chủ đề chính, từ khóa liên quan, địa điểm (nếu có), niche, xu hướng

Trả về danh sách hashtag, mỗi hashtag trên một dòng, ví dụ:
#bannha
#quan7
#bannhaquan7
#nhadat
#canho
#chungcu

CHÚ Ý: Phải tạo ĐỦ ${selectedCount} hashtag. KHÔNG thêm text giải thích, chỉ trả về hashtag.`;

            const response = await ai.models.generateContent({
                model: model,
                contents: prompt,
            });

            if (response.text) {
                // Tách các dòng và lọc hashtag
                const lines = response.text.split('\n');
                const extractedHashtags = lines
                    .map(line => line.trim())
                    .filter(line => line.startsWith('#') && line.length > 1) // Chỉ lấy dòng bắt đầu bằng #
                    .map(tag => tag.toLowerCase()) // Chuyển thành chữ thường
                    .filter((tag, index, self) => self.indexOf(tag) === index); // Loại bỏ trùng

                if (extractedHashtags.length > 0) {
                    setHashtags(extractedHashtags);

                    // Thông báo nếu không đủ số lượng
                    if (extractedHashtags.length < selectedCount) {
                        console.log(`Chỉ tạo được ${extractedHashtags.length}/${selectedCount} hashtag`);
                    }
                } else {
                    // Fallback: tìm tất cả hashtag trong text
                    const hashtagMatches = response.text.match(/#[a-zA-Z0-9]+/g);
                    if (hashtagMatches && hashtagMatches.length > 0) {
                        const uniqueMatches = [...new Set(hashtagMatches.map(t => t.toLowerCase()))];
                        setHashtags(uniqueMatches);
                    } else {
                        setError('Không thể tạo hashtag. Vui lòng thử lại với nội dung khác.');
                    }
                }
            }
        } catch (err) {
            console.error('Generation error:', err);
            setError('Không thể tạo hashtag. Vui lòng thử lại.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = () => {
        setInputText('');
        setHashtags([]);
        setError('');
        setCopied(false);
        setContactCopied(false);
    };

    const copyAllHashtags = () => {
        const text = hashtags.join(' ');
        copyToClipboard(setCopied, text);
    };

    const copyContactInfo = () => {
        const contactText = "Liên hệ trực tiếp Nhân 0909941199 để được hỗ trợ xem nhà, kiểm tra pháp lý – quy hoạch rõ ràng, thương lượng giá tốt nhất với chủ và hỗ trợ trọn gói công chứng, sang tên nhanh gọn.";
        copyToClipboard(setContactCopied, contactText);
    };

    return (
        <div className="w-full h-full flex items-start justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden flex flex-col min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)]">
                {/* Tool Header */}
                <div className="p-4 sm:p-6 border-b border-zinc-100 bg-gradient-to-r from-blue-50 to-cyan-50 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                                <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                Hashtag Generator
                            </h1>
                            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                                Tạo hashtag từ nội dung
                            </p>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={handleReset}
                            disabled={isGenerating || (!inputText && hashtags.length === 0)}
                            className={cn(
                                "p-2 sm:p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-medium",
                                (!inputText && hashtags.length === 0) || isGenerating
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
                                Nội dung
                            </label>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Nhập mô tả, bài viết, nội dung cần tạo hashtag..."
                                className="w-full h-32 sm:h-40 p-3 sm:p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                            />

                            {inputText && (
                                <div className="text-xs text-zinc-500">
                                    {inputText.length} ký tự
                                </div>
                            )}
                        </div>

                        {/* Hashtag Count Selector */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-zinc-700 uppercase tracking-wider">
                                Số lượng hashtag
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[10, 20, 30, 40, 50].map((count) => (
                                    <button
                                        key={count}
                                        onClick={() => setSelectedCount(count)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all",
                                            selectedCount === count
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                        )}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !inputText.trim()}
                            className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-zinc-400 disabled:to-zinc-400 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            ) : (
                                <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            {isGenerating ? 'ĐANG TẠO...' : `TẠO ${selectedCount} HASHTAG`}
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs sm:text-sm">
                                {error}
                            </div>
                        )}

                        {/* Hashtags Result */}
                        {hashtags.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs sm:text-sm font-semibold text-zinc-700 uppercase tracking-wider">
                                        Kết quả ({hashtags.length} hashtag)
                                    </label>
                                    <button
                                        onClick={copyAllHashtags}
                                        className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'ĐÃ COPY' : 'COPY TẤT CẢ'}
                                    </button>
                                </div>

                                {/* Hashtag Cloud */}
                                <div className="p-4 sm:p-6 bg-blue-50/50 border border-blue-100 rounded-xl">
                                    <div className="flex flex-wrap gap-2">
                                        {hashtags.map((tag, index) => (
                                            <button
                                                key={index}
                                                onClick={() => copyToClipboard(setCopied, tag)}
                                                className="group relative px-3 py-1.5 bg-white hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 transition-all hover:scale-105 hover:shadow-md"
                                                title="Click để copy"
                                            >
                                                {tag}
                                                <Copy className="absolute -top-1 -right-1 w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="p-3 sm:p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                    <p className="text-xs text-zinc-500 mb-1">Preview:</p>
                                    <p className="text-sm text-zinc-700 break-words">
                                        {hashtags.join(' ')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        {!hashtags.length && inputText && !isGenerating && (
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

                {/* Footer Stats */}
                {hashtags.length > 0 && (
                    <div className="px-4 sm:px-6 py-2 sm:py-3 bg-zinc-50 border-t border-zinc-200 text-xs text-zinc-500 flex justify-between items-center">
                        <span>
                            {hashtags.length} hashtag • {hashtags.join(' ').length} ký tự
                        </span>
                        {selectedCount > hashtags.length && (
                            <span className="text-amber-600">
                                Thiếu {selectedCount - hashtags.length} hashtag
                            </span>
                        )}
                    </div>
                )}

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

                {/* Tips */}
                <div className="px-4 sm:px-6 py-3 bg-blue-50 border-t border-blue-200">
                    <p className="text-xs text-blue-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Mẹo: Nhập nội dung càng chi tiết càng tạo được nhiều hashtag chất lượng.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HashtagGenerator;