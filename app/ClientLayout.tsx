'use client';

import { useState } from "react";
import { Menu } from 'lucide-react';
import { usePathname } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import { cn } from "./utils";
import tools from "./_data/tools.json";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mặc định mở trên desktop
    const pathname = usePathname();

    // Find current tool name for mobile header
    const currentTool = tools.find(tool => tool.path === pathname);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onToggle={toggleSidebar}
            />

            {/* Main Content - điều chỉnh margin khi sidebar đóng/mở */}
            <main className={cn(
                "flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300",
                isSidebarOpen ? "lg:ml-72" : "lg:ml-0"
            )}>
                {/* Top Header (Mobile) */}
                <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-4 lg:px-6 shrink-0">
                    <div className="flex items-center gap-2">
                        {/* Nút menu cho mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Nút toggle cho desktop (khi sidebar đóng) */}
                        {!isSidebarOpen && (
                            <button
                                onClick={toggleSidebar}
                                className="hidden lg:flex p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
                                title="Open sidebar"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}

                        <div className="font-bold text-zinc-900">
                            {currentTool?.name || "DevTools"}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 flex flex-col items-center justify-center">
                    {children}

                    <footer className="mt-8 text-zinc-400 text-xs font-medium uppercase tracking-widest">
                        Secure & Client-Side Only
                    </footer>
                </div>
            </main>
        </div>
    );
}