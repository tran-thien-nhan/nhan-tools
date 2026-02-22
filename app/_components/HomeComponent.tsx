import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import tools from '../_data/tools.json';
import { cn } from '../utils';

// Filter out the home item from tools to display only actual tools
const displayTools = tools.filter(tool => tool.id !== 'home');

const HomeComponent = () => {
    // Function to get icon component by name
    const getIcon = (iconName: string) => {
        const Icon = (Icons as any)[iconName] || Icons.Box;
        return Icon;
    };

    // Color mapping for different styles
    const colorClasses: Record<string, { bg: string, text: string, hover: string, iconBg: string }> = {
        indigo: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            hover: 'hover:border-indigo-200 hover:shadow-indigo-100',
            iconBg: 'bg-indigo-100'
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            hover: 'hover:border-purple-200 hover:shadow-purple-100',
            iconBg: 'bg-purple-100'
        },
        emerald: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            hover: 'hover:border-emerald-200 hover:shadow-emerald-100',
            iconBg: 'bg-emerald-100'
        },
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            hover: 'hover:border-blue-200 hover:shadow-blue-100',
            iconBg: 'bg-blue-100'
        },
        amber: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            hover: 'hover:border-amber-200 hover:shadow-amber-100',
            iconBg: 'bg-amber-100'
        },
        rose: {
            bg: 'bg-rose-50',
            text: 'text-rose-600',
            hover: 'hover:border-rose-200 hover:shadow-rose-100',
            iconBg: 'bg-rose-100'
        }
    };

    return (
        <div className="w-full min-h-full">
            <div id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayTools.map((tool) => {
                        const Icon = getIcon(tool.icon);
                        const colors = colorClasses[tool.color] || colorClasses.indigo;

                        return (
                            <Link
                                key={tool.id}
                                href={tool.path}
                                className={cn(
                                    "group relative bg-white rounded-2xl border border-zinc-200 p-6 transition-all duration-300",
                                    "hover:shadow-xl hover:-translate-y-1",
                                    colors.hover
                                )}
                            >
                                {/* Card Content */}
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={cn(
                                        "p-3 rounded-xl transition-all group-hover:scale-110",
                                        colors.iconBg
                                    )}>
                                        <Icon className={cn("w-6 h-6", colors.text)} />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-zinc-500 leading-relaxed">
                                            {tool.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Icons.ArrowRight className={cn("w-5 h-5", colors.text)} />
                                </div>

                                {/* Decorative Gradient */}
                                <div className={cn(
                                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none",
                                    `bg-gradient-to-br from-${tool.color}-500 to-${tool.color}-600`
                                )} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HomeComponent;