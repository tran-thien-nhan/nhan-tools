'use client';

import { ShieldCheck, X, Zap, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { cn } from '../utils';
import tools from '../_data/tools.json';

// Import icons dynamically
import * as Icons from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onToggle?: () => void; // Thêm prop cho nút toggle trên desktop
}

const Sidebar = ({ isOpen, onClose, onToggle }: SidebarProps) => {
    const pathname = usePathname();

    const getIcon = (iconName: string) => {
        const Icon = (Icons as any)[iconName] || Icons.Binary;
        return Icon;
    };

    return (
        <>
            {/* Mobile Overlay - chỉ hiện khi sidebar mở và là mobile */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 w-72 bg-white border-r border-zinc-200 z-50 transition-transform duration-300",
                    !isOpen && "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3" onClick={onClose}>
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-zinc-900 leading-tight">Nhân Tools</h2>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Utility Suite</p>
                            </div>
                        </Link>
                        <div className="flex items-center gap-1">
                            {/* Nút toggle cho desktop */}
                            <button
                                onClick={onToggle}
                                className="hidden lg:flex p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                                title="Toggle sidebar"
                            >
                                <ChevronLeft className={cn(
                                    "w-5 h-5 transition-transform",
                                    !isOpen && "rotate-180"
                                )} />
                            </button>
                            {/* Nút close cho mobile */}
                            <button
                                onClick={onClose}
                                className="lg:hidden p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tools</div>
                        {tools.map((tool) => {
                            const Icon = getIcon(tool.icon);
                            const isActive = pathname === tool.path;

                            return (
                                <Link
                                    key={tool.id}
                                    href={tool.path}
                                    onClick={onClose}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600"
                                    )} />
                                    <div className="text-left">
                                        <div className="text-sm font-semibold leading-none">{tool.name}</div>
                                        <div className="text-[10px] opacity-60 mt-1">{tool.description}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-zinc-100">
                        <div className="bg-zinc-50 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-zinc-900">Privacy First</div>
                                <div className="text-[10px] text-zinc-500">All tools run locally</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar