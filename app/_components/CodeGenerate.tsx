'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Copy, RefreshCw, Hash, Type, Binary, Check, FileText, Code, Eye, X } from 'lucide-react';
import { cn, copyToClipboard } from '../utils';
import { Mode } from '../interface';
import { prompt_4, prompt_1, prompt_2, prompt_3, prompt_8, prompt_9, prompt_10, prompt_11, prompt_12, prompt_13, prompt_14, prompt_15, prompt_16, prompt_17 } from '../_data/prompt';

// Định nghĩa interface cho prompt
interface Prompt {
    id: string;
    name: string;
    content: string;
}

// Danh sách prompts
const prompts: Prompt[] = [
    { id: 'prompt_10', name: 'quận 1', content: prompt_10 },
    { id: 'prompt_17', name: 'quận 2', content: prompt_17 },
    { id: 'prompt_11', name: 'quận 3', content: prompt_11 },
    { id: 'prompt_8', name: 'quận 4', content: prompt_8 },
    { id: 'prompt_15', name: 'quận 5', content: prompt_15 },
    { id: 'prompt_4', name: 'quận 7', content: prompt_4 },
    { id: 'prompt_16', name: 'quận 8', content: prompt_16 },
    { id: 'prompt_14', name: 'quận 10', content: prompt_14 },
    { id: 'prompt_9', name: 'nhà bè', content: prompt_9 },
    { id: 'prompt_12', name: 'phú nhuận', content: prompt_12 },
    { id: 'prompt_13', name: 'bình thạnh', content: prompt_13 },
];

const CodeGenerator = () => {
    const [length, setLength] = useState<number>(8);
    const [mode, setMode] = useState<Mode>('alphanumeric');
    const [result, setResult] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedBoth, setCopiedBoth] = useState(false);

    // State cho preview
    const [showPreview, setShowPreview] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt>(prompts[3]); // Mặc định là prompt_4
    const [previewContent, setPreviewContent] = useState('');

    const generateCode = useCallback(() => {
        let charset = '';
        if (mode === 'numeric') charset = '0123456789';
        else if (mode === 'alphabetic') charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        else charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let newCode = '';
        for (let i = 0; i < length; i++) {
            newCode += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        setResult(newCode);
        setCopied(false);
        setCopiedPrompt(false);
        setCopiedBoth(false);
    }, [length, mode]);

    useEffect(() => {
        generateCode();
    }, [generateCode]);

    // Cập nhật preview content khi selectedPrompt hoặc result thay đổi
    useEffect(() => {
        setPreviewContent(`${result}\n${selectedPrompt.content}\n\n`);
    }, [selectedPrompt, result]);

    const handleCopyBoth = async () => {
        try {
            await navigator.clipboard.writeText(previewContent);
            setCopiedBoth(true);
            setTimeout(() => setCopiedBoth(false), 2000);
            setShowPreview(false); // Đóng preview sau khi copy
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const openPreview = () => {
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
    };

    return (
        <>
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden">
                {/* Tool Header */}
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                        <Binary className="w-6 h-6 text-indigo-600" />
                        Code Generator
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Generate secure random strings instantly.</p>
                </div>

                <div className="p-6 space-y-8">
                    {/* Result Display */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center justify-between bg-zinc-900 rounded-2xl p-6 overflow-hidden min-h-[100px]">
                            <div className="flex-1 overflow-hidden">
                                <div className="font-mono text-2xl sm:text-3xl text-white tracking-wider break-all text-center px-2">
                                    {result}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                                <button
                                    onClick={() => copyToClipboard(setCopied, result)}
                                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors relative"
                                    title="Copy code to clipboard"
                                >
                                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(setCopiedPrompt, selectedPrompt.content)}
                                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                    title={`Copy ${selectedPrompt.name} to clipboard`}
                                >
                                    {copiedPrompt ? <Check className="w-5 h-5 text-emerald-400" /> : <FileText className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={openPreview}
                                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                    title="Preview and copy both"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={generateCode}
                                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                    title="Regenerate"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        {/* Length Input */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">Number of characters</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={length}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val)) setLength(Math.min(100, Math.max(1, val)));
                                    }}
                                    className="w-20 px-3 py-2 text-center font-mono font-bold text-indigo-600 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Mode Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['numeric', 'alphabetic', 'alphanumeric'] as Mode[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
                                            mode === m
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                                                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                                        )}
                                    >
                                        {m === 'numeric' && <Hash className="w-5 h-5" />}
                                        {m === 'alphabetic' && <Type className="w-5 h-5" />}
                                        {m === 'alphanumeric' && <Binary className="w-5 h-5" />}
                                        <span className="text-[10px] font-bold uppercase tracking-tight">
                                            {m === 'numeric' ? 'Numbers' : m === 'alphabetic' ? 'Letters' : 'Mixed'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={generateCode}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            <RefreshCw className="w-5 h-5 group-active:rotate-180 transition-transform duration-500" />
                            GENERATE CODE
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Code className="w-5 h-5" />
                                    Xem trước nội dung
                                </h3>
                                <button
                                    onClick={closePreview}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            {/* Chọn Prompt */}
                            <div>
                                <label className="text-sm font-semibold text-zinc-700 mb-2 block">
                                    Chọn Prompt:
                                </label>
                                <select
                                    value={selectedPrompt.id}
                                    onChange={(e) => {
                                        const prompt = prompts.find(p => p.id === e.target.value);
                                        if (prompt) setSelectedPrompt(prompt);
                                    }}
                                    className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {prompts.map(prompt => (
                                        <option key={prompt.id} value={prompt.id}>
                                            {prompt.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Preview Content */}
                            <div>
                                <label className="text-sm font-semibold text-zinc-700 mb-2 block">
                                    Nội dung sẽ copy:
                                </label>
                                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 max-h-96 overflow-y-auto">
                                    <pre className="text-sm text-zinc-700 whitespace-pre-wrap font-mono">
                                        {previewContent}
                                    </pre>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleCopyBoth}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {copiedBoth ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            ĐÃ COPY
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5" />
                                            COPY NỘI DUNG
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={closePreview}
                                    className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all"
                                >
                                    ĐÓNG
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CodeGenerator;