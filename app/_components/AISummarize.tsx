"use client"
import { Check, Copy, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn, copyToClipboard } from '../utils';
import { GoogleGenAI } from "@google/genai";
import { prompt_1, prompt_2 } from '../_data/prompt';

const AISummarize = () => {
    const [summarizerInput, setSummarizerInput] = useState('');
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summarizerError, setSummarizerError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSummarize = async () => {
        if (!summarizerInput.trim()) return;

        setIsSummarizing(true);
        setSummarizerError('');
        setSummary('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `${prompt_1}:\n\n${summarizerInput}`,
                config: {
                    systemInstruction: `${prompt_2}`,
                }
            });

            if (response.text) {
                setSummary(response.text);
            } else {
                setSummarizerError('No summary generated.');
            }
        } catch (err) {
            console.error('Summarization error:', err);
            setSummarizerError('Failed to generate summary. Please check your connection or try again.');
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleReset = () => {
        setSummarizerInput('');
        setSummary('');
        setSummarizerError('');
        setCopied(false);
    };

    return (
        <div className="w-full h-full flex items-start justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden flex flex-col min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)]">
                {/* Tool Header */}
                <div className="p-4 sm:p-6 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                                AI Summarizer
                            </h1>
                            <p className="text-xs sm:text-sm text-zinc-500 mt-1">Paste long text to get a concise summary.</p>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={handleReset}
                            disabled={isSummarizing || (!summarizerInput && !summary)}
                            className={cn(
                                "p-2 sm:p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-medium",
                                (!summarizerInput && !summary) || isSummarizing
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
                        <div className="space-y-2 sm:space-y-3">
                            <label className="text-xs sm:text-sm font-semibold text-zinc-700 uppercase tracking-wider">Input Text</label>
                            <textarea
                                value={summarizerInput}
                                onChange={(e) => setSummarizerInput(e.target.value)}
                                placeholder="Paste your text here..."
                                className="w-full h-32 sm:h-40 p-3 sm:p-4 bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none font-sans text-sm"
                            />
                        </div>

                        {/* Summarize Button */}
                        <button
                            onClick={handleSummarize}
                            disabled={isSummarizing || !summarizerInput.trim()}
                            className="w-full py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group text-sm sm:text-base"
                        >
                            {isSummarizing ? (
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            {isSummarizing ? 'ĐANG TÓM TẮT...' : 'TÓM TẮT'}
                        </button>

                        {/* Error Message */}
                        {summarizerError && (
                            <div className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl sm:rounded-2xl text-red-600 text-xs sm:text-sm font-medium">
                                {summarizerError}
                            </div>
                        )}

                        {/* Summary Result */}
                        {summary && (
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs sm:text-sm font-semibold text-zinc-700 uppercase tracking-wider">Summary</label>
                                    <button
                                        onClick={() => copyToClipboard(setCopied, summary)}
                                        className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'COPIED' : 'COPY SUMMARY'}
                                    </button>
                                </div>
                                <div className="p-4 sm:p-6 bg-indigo-50/50 border border-indigo-100 rounded-xl sm:rounded-2xl prose prose-sm max-w-none prose-indigo overflow-x-auto">
                                    <ReactMarkdown>{summary}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions (when no summary yet) */}
                        {!summary && summarizerInput && !isSummarizing && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleReset}
                                    className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1 transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Clear input
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Stats (optional) */}
                {summarizerInput && (
                    <div className="px-4 sm:px-6 py-2 sm:py-3 bg-zinc-50 border-t border-zinc-200 text-xs text-zinc-500 flex justify-between items-center">
                        <span>
                            {summarizerInput.trim().split(/\s+/).filter(Boolean).length} words • {summarizerInput.length} characters
                        </span>
                        {summary && (
                            <span className="text-indigo-600 font-medium">
                                Reduced by {Math.round((1 - summary.split(/\s+/).filter(Boolean).length / summarizerInput.trim().split(/\s+/).filter(Boolean).length) * 100)}%
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AISummarize