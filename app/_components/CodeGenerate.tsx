'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Copy, RefreshCw, Hash, Type, Binary, Check } from 'lucide-react';
import { cn, copyToClipboard } from '../utils';
import { Mode } from '../interface';

const CodeGenerator = () => {
    const [length, setLength] = useState<number>(8);
    const [mode, setMode] = useState<Mode>('alphanumeric');
    const [result, setResult] = useState<string>('');
    const [copied, setCopied] = useState(false);

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
    }, [length, mode]);

    useEffect(() => {
        generateCode();
    }, [generateCode]);

    return (
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
                                title="Copy to clipboard"
                            >
                                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
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
    );
};

export default CodeGenerator;