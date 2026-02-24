"use client"
import React, { useState } from 'react';
import {
    Sparkles,
    RotateCcw,
    Loader2,
    Copy,
    Check,
    Shuffle,
    Moon,
    Sun,
    ArrowRight,
    History,
    Clock,
    MessageSquare
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SPREADS } from '@/app/_data/spreads';
import { model } from '@/app/_data/model';
import { cn, copyToClipboard } from '@/app/utils';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { ReadingResult } from '../_data/tarot';
import { TAROT_DECK } from '../_data/tarotData';
import { SINGLE_CARD_PROMPT, TAROT_SYSTEM_PROMPT, THREE_CARDS_PROMPT } from '../_data/prompt';

const TarotReader: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [selectedSpread, setSelectedSpread] = useState(0); // 0: 1 lá, 1: 3 lá
    const [isReading, setIsReading] = useState(false);
    const [readingError, setReadingError] = useState('');
    const [readingResult, setReadingResult] = useState<ReadingResult[]>([]);
    const [aiInterpretation, setAiInterpretation] = useState('');
    const [copied, setCopied] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [showAllCards, setShowAllCards] = useState(true);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    // Hàm tạo prompt từ câu hỏi và các lá bài
    const generatePromptFromCards = (cards: ReadingResult[], userQuestion: string): string => {
        if (cards.length === 0) return '';

        let prompt = `TÔI LÀ MỘT CHUYÊN GIA TAROT. HÃY GIẢI MÃ CHO TÔI DỰA TRÊN:\n\n`;
        prompt += `📝 CÂU HỎI: "${userQuestion}"\n\n`;
        prompt += `🔮 CÁC LÁ BÀI ĐÃ RÚT:\n\n`;

        if (cards.length === 1) {
            const card = cards[0];
            prompt += `LÁ BÀI DUY NHẤT: ${card.card.name}\n`;
            prompt += `VỊ TRÍ: ${card.position === 'upright' ? 'XUÔI' : 'NGƯỢC'}\n`;
            prompt += `✨ Ý NGHĨA GỐC (Xuôi): ${card.card.meaningUpright}\n`;
            prompt += `🌙 Ý NGHĨA GỐC (Ngược): ${card.card.meaningReversed}\n`;
            prompt += `📖 MÔ TẢ: ${card.card.description}\n`;
        } else {
            // Quá khứ
            prompt += `🔙 QUÁ KHỨ (Lá 1):\n`;
            prompt += `   Tên: ${cards[0].card.name}\n`;
            prompt += `   Vị trí: ${cards[0].position === 'upright' ? 'XUÔI' : 'NGƯỢC'}\n`;
            prompt += `   Ý nghĩa: ${cards[0].position === 'upright' ? cards[0].card.meaningUpright : cards[0].card.meaningReversed}\n\n`;

            // Hiện tại
            prompt += `🔰 HIỆN TẠI (Lá 2):\n`;
            prompt += `   Tên: ${cards[1].card.name}\n`;
            prompt += `   Vị trí: ${cards[1].position === 'upright' ? 'XUÔI' : 'NGƯỢC'}\n`;
            prompt += `   Ý nghĩa: ${cards[1].position === 'upright' ? cards[1].card.meaningUpright : cards[1].card.meaningReversed}\n\n`;

            // Tương lai
            prompt += `🔜 TƯƠNG LAI (Lá 3):\n`;
            prompt += `   Tên: ${cards[2].card.name}\n`;
            prompt += `   Vị trí: ${cards[2].position === 'upright' ? 'XUÔI' : 'NGƯỢC'}\n`;
            prompt += `   Ý nghĩa: ${cards[2].position === 'upright' ? cards[2].card.meaningUpright : cards[2].card.meaningReversed}\n\n`;
        }

        prompt += `🎯 YÊU CẦU GIẢI MÃ:\n`;
        prompt += `1. Phân tích ý nghĩa từng lá bài trong bối cảnh câu hỏi\n`;
        prompt += `2. Chỉ ra mối liên hệ giữa các lá bài (nếu có)\n`;
        prompt += `3. Đưa ra lời khuyên dựa trên tổng thể các lá bài\n`;
        prompt += `4. Kết luận mang tính tích cực và truyền cảm hứng\n`;

        return prompt;
    };

    // Cập nhật hàm handleReading để tạo prompt
    const handleReading = async () => {
        if (!question.trim()) return;

        setIsReading(true);
        setReadingError('');
        setReadingResult([]);
        setAiInterpretation('');
        setGeneratedPrompt('');

        try {
            // Rút bài
            const cards = drawCards(SPREADS[selectedSpread].cardsCount);
            setReadingResult(cards);

            // Tạo prompt từ cards và câu hỏi
            const promptText = generatePromptFromCards(cards, question);
            setGeneratedPrompt(promptText);

            // Tạo prompt cho AI
            let aiPrompt = '';
            if (selectedSpread === 0) {
                aiPrompt = SINGLE_CARD_PROMPT
                    .replace('{cardName}', cards[0].card.name)
                    .replace('{position}', cards[0].position === 'upright' ? 'Xuôi' : 'Ngược')
                    .replace('{meaningUpright}', cards[0].card.meaningUpright)
                    .replace('{meaningReversed}', cards[0].card.meaningReversed)
                    .replace('{description}', cards[0].card.description)
                    .replace('{question}', question);
            } else {
                aiPrompt = THREE_CARDS_PROMPT
                    .replace('{pastName}', cards[0].card.name)
                    .replace('{pastPosition}', cards[0].position === 'upright' ? 'Xuôi' : 'Ngược')
                    .replace('{pastMeaning}', cards[0].position === 'upright' ? cards[0].card.meaningUpright : cards[0].card.meaningReversed)
                    .replace('{presentName}', cards[1].card.name)
                    .replace('{presentPosition}', cards[1].position === 'upright' ? 'Xuôi' : 'Ngược')
                    .replace('{presentMeaning}', cards[1].position === 'upright' ? cards[1].card.meaningUpright : cards[1].card.meaningReversed)
                    .replace('{futureName}', cards[2].card.name)
                    .replace('{futurePosition}', cards[2].position === 'upright' ? 'Xuôi' : 'Ngược')
                    .replace('{futureMeaning}', cards[2].position === 'upright' ? cards[2].card.meaningUpright : cards[2].card.meaningReversed)
                    .replace('{question}', question);
            }

            // Gọi AI
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: model,
                contents: aiPrompt,
                config: {
                    systemInstruction: TAROT_SYSTEM_PROMPT,
                }
            });

            if (response.text) {
                setAiInterpretation(response.text);
            } else {
                setReadingError('Không thể nhận được giải mã từ AI.');
            }
        } catch (err) {
            console.error('Tarot reading error:', err);
            setReadingError('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsReading(false);
        }
    };

    // Hàm rút bài
    const drawCards = (count: number): ReadingResult[] => {
        const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        return selected.map(card => ({
            card,
            position: Math.random() > 0.5 ? 'upright' : 'reversed',
            interpretation: ''
        }));
    };

    // Hàm reset
    const handleReset = () => {
        setQuestion('');
        setReadingResult([]);
        setAiInterpretation('');
        setGeneratedPrompt('');
        setReadingError('');
        setCopied(false);
        setCopiedPrompt(false);
        setShowAllCards(false);
    };

    // Hàm rút lại bài
    const handleReroll = () => {
        if (!question.trim()) return;
        handleReading();
    };

    // Hàm copy prompt riêng
    const handleCopyPrompt = async () => {
        if (!generatedPrompt) return;
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            setCopiedPrompt(true);
            setTimeout(() => setCopiedPrompt(false), 2000);
        } catch (err) {
            console.error('Failed to copy prompt:', err);
        }
    };

    return (
        <div className="w-full h-full flex items-start justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="w-full max-w-7xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-purple-200/50 border border-purple-100 overflow-hidden flex flex-col min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)]">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-purple-100 bg-purple-50/50 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-purple-900 flex items-center gap-2">
                                <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                Tarot Reader AI
                            </h1>
                            <p className="text-xs sm:text-sm text-purple-600 mt-1">
                                Kết nối với trực giác, khám phá những thông điệp từ vũ trụ
                            </p>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={handleReset}
                            disabled={isReading || (!question && readingResult.length === 0)}
                            className={cn(
                                "p-2 sm:p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-medium",
                                (!question && readingResult.length === 0) || isReading
                                    ? "border-purple-200 text-purple-300 cursor-not-allowed bg-purple-50"
                                    : "border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-300 active:scale-95"
                            )}
                            title="Reset"
                        >
                            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Question Input */}
                        <div className="space-y-2 sm:space-y-3">
                            <label className="text-xs sm:text-sm font-semibold text-purple-700 uppercase tracking-wider">
                                Câu hỏi của bạn
                            </label>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Nhập câu hỏi hoặc vấn đề bạn đang quan tâm..."
                                className="w-full h-24 sm:h-32 p-3 sm:p-4 bg-purple-50/50 border border-purple-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none font-sans text-sm"
                            />
                        </div>

                        {/* Spread Selection */}
                        <div className="space-y-2 sm:space-y-3">
                            <label className="text-xs sm:text-sm font-semibold text-purple-700 uppercase tracking-wider">
                                Chọn cách trải bài
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {SPREADS.map((spread, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSpread(index)}
                                        disabled={isReading}
                                        className={cn(
                                            "p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all text-left",
                                            selectedSpread === index
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-purple-100 hover:border-purple-200 bg-white",
                                            isReading && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            {index === 0 ? (
                                                <Sun className="w-4 h-4 text-purple-600" />
                                            ) : (
                                                <History className="w-4 h-4 text-purple-600" />
                                            )}
                                            <span className="font-semibold text-purple-900">
                                                {spread.name}
                                            </span>
                                        </div>
                                        <p className="text-xs text-purple-600">
                                            {spread.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleReading}
                                disabled={isReading || !question.trim()}
                                className="flex-1 py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group text-sm sm:text-base"
                            >
                                {isReading ? (
                                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                                {isReading ? 'ĐANG KẾT NỐI VŨ TRỤ...' : 'XEM BÓI'}
                            </button>

                            {readingResult.length > 0 && !isReading && (
                                <button
                                    onClick={handleReroll}
                                    className="px-4 sm:px-6 py-3 sm:py-4 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-xl sm:rounded-2xl transition-all active:scale-[0.98] flex items-center gap-2"
                                    title="Rút bài mới"
                                >
                                    <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Rút lại</span>
                                </button>
                            )}
                        </div>

                        {/* Error Message */}
                        {readingError && (
                            <div className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl sm:rounded-2xl text-red-600 text-xs sm:text-sm font-medium">
                                {readingError}
                            </div>
                        )}

                        {/* Reading Result */}
                        {readingResult.length > 0 && (
                            <div className="space-y-4 sm:space-y-6">
                                {/* Cards Display */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs sm:text-sm font-semibold text-purple-700 uppercase tracking-wider">
                                            {selectedSpread === 0 ? 'LÁ BÀI CỦA BẠN' : '3 LÁ BÀI'}
                                        </label>
                                    </div>

                                    <div className={cn(
                                        "grid gap-3 sm:gap-4 transition-all",
                                        selectedSpread === 0 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3",
                                        !showAllCards && selectedSpread === 1 && "sm:grid-cols-1"
                                    )}>
                                        {readingResult.map((result, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "bg-white rounded-xl sm:rounded-2xl border overflow-hidden transition-all",
                                                    result.position === 'upright' ? 'border-green-200' : 'border-orange-200',
                                                    !showAllCards && selectedSpread === 1 && index > 0 && "hidden sm:block"
                                                )}
                                            >
                                                {(!showAllCards && selectedSpread === 1 && index === 0) || showAllCards || selectedSpread === 0 ? (
                                                    <>
                                                        {/* Card Image */}
                                                        <div className="relative w-full h-48 sm:h-56 bg-purple-50">
                                                            <img
                                                                src={result.card.imageUrl}
                                                                alt={result.card.name}
                                                                className={cn(
                                                                    "absolute inset-0 w-full h-full object-contain p-2",
                                                                    result.position === 'reversed' && "transform rotate-180"
                                                                )}
                                                            />
                                                        </div>

                                                        {/* Card Info */}
                                                        <div className="p-3 sm:p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h3 className="font-bold text-purple-900">
                                                                    {result.card.name}
                                                                </h3>
                                                                <span className={cn(
                                                                    "text-xs px-2 py-1 rounded-full",
                                                                    result.position === 'upright'
                                                                        ? "bg-green-100 text-green-700"
                                                                        : "bg-orange-100 text-orange-700"
                                                                )}>
                                                                    {result.position === 'upright' ? 'Xuôi' : 'Ngược'}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-purple-600 mb-2">
                                                                {result.card.description}
                                                            </p>
                                                            <p className="text-xs italic text-purple-500">
                                                                {result.position === 'upright'
                                                                    ? result.card.meaningUpright
                                                                    : result.card.meaningReversed}
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Generated Prompt Section - MỚI */}
                                {generatedPrompt && (
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs sm:text-sm font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                PROMPT GỐC (Dùng cho AI khác)
                                            </label>
                                            <button
                                                onClick={handleCopyPrompt}
                                                className="text-purple-600 hover:text-purple-700 text-xs font-bold flex items-center gap-1"
                                            >
                                                {copiedPrompt ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                {copiedPrompt ? 'ĐÃ COPY' : 'COPY PROMPT'}
                                            </button>
                                        </div>
                                        <div className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl font-mono text-xs sm:text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                                            {generatedPrompt}
                                        </div>
                                    </div>
                                )}

                                {/* AI Interpretation */}
                                {aiInterpretation && (
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs sm:text-sm font-semibold text-purple-700 uppercase tracking-wider">
                                                Giải mã từ vũ trụ
                                            </label>
                                            <button
                                                onClick={() => copyToClipboard(setCopied, aiInterpretation)}
                                                className="text-purple-600 hover:text-purple-700 text-xs font-bold flex items-center gap-1"
                                            >
                                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                {copied ? 'ĐÃ COPY' : 'COPY'}
                                            </button>
                                        </div>
                                        <div className="p-4 sm:p-6 bg-purple-50/50 border border-purple-100 rounded-xl sm:rounded-2xl prose prose-sm max-w-none prose-purple overflow-x-auto">
                                            <ReactMarkdown>{aiInterpretation}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {question && (
                    <div className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-50/50 border-t border-purple-100 text-xs text-purple-500 flex justify-between items-center">
                        <span>
                            {question.trim().split(/\s+/).filter(Boolean).length} từ
                        </span>
                        {readingResult.length > 0 && (
                            <span className="text-purple-600 font-medium flex items-center gap-1">
                                <Moon className="w-3 h-3" />
                                {readingResult.length} lá bài
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TarotReader;