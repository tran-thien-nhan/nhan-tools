"use client"
import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Search,
    Filter,
    X
} from 'lucide-react';
import promptsData, { Prompt } from '@/app/_data/promptsData';
import { getAllCategories } from '../_data/category';

const PromptLibrary: React.FC = () => {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Get unique categories from enum
    const categories = ['all', ...getAllCategories()];

    // Filter prompts based on search and category
    const filteredPrompts = promptsData.filter(prompt => {
        const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.content.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const toggleExpand = (index: number) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedItems(newExpanded);
    };

    const expandAll = () => {
        const allIndices = filteredPrompts.map((_, index) => index);
        setExpandedItems(new Set(allIndices));
    };

    const collapseAll = () => {
        setExpandedItems(new Set());
    };

    const handleCopy = async (content: string, index: number) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Tất cả prompts</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {filteredPrompts.length} prompts • {promptsData.length} total
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={expandAll}
                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <ChevronDown className="w-4 h-4" />
                                Mở rộng tất cả
                            </button>
                            <button
                                onClick={collapseAll}
                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <ChevronUp className="w-4 h-4" />
                                Thu gọn tất cả
                            </button>
                        </div>
                    </div>

                    {/* Search and filters */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm prompt theo tiêu đề hoặc nội dung..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${showFilters
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                            </button>

                            {showFilters && (
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? '📋 Tất cả danh mục' : `📁 ${category}`}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Prompts list */}
                <div className="divide-y divide-gray-200">
                    {filteredPrompts.length > 0 ? (
                        filteredPrompts.map((prompt, index) => (
                            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                {/* Prompt header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {prompt.title}
                                            </h3>
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                {prompt.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Copy button */}
                                    <button
                                        onClick={() => handleCopy(prompt.content, index)}
                                        className={`ml-4 p-2 rounded-lg transition-colors flex-shrink-0 ${copiedIndex === index
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        title="Copy prompt"
                                    >
                                        {copiedIndex === index ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Prompt content */}
                                <div className="mt-3">
                                    <div className={`relative ${!expandedItems.has(index) ? 'max-h-24 overflow-hidden' : ''}`}>
                                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                                            {prompt.content}
                                        </p>

                                        {/* Gradient fade for collapsed state */}
                                        {!expandedItems.has(index) && prompt.content.length > 150 && (
                                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                                        )}
                                    </div>

                                    {/* Expand/Collapse button */}
                                    {prompt.content.length > 150 && (
                                        <button
                                            onClick={() => toggleExpand(index)}
                                            className="mt-2 text-purple-500 hover:text-purple-600 text-sm font-medium flex items-center gap-1"
                                        >
                                            {expandedItems.has(index) ? (
                                                <>
                                                    <ChevronUp className="w-4 h-4" />
                                                    Thu gọn
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-4 h-4" />
                                                    Đọc thêm
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="mb-4">
                                <Search className="w-12 h-12 text-gray-300 mx-auto" />
                            </div>
                            <p className="text-gray-500 text-lg mb-2">
                                Không tìm thấy prompt nào
                            </p>
                            <p className="text-gray-400 text-sm">
                                Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
                            </p>
                            {(searchTerm || selectedCategory !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                    }}
                                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer with stats */}
                {filteredPrompts.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                                Hiển thị {filteredPrompts.length} / {promptsData.length} prompts
                            </span>
                            <div className="flex gap-4">
                                <span>
                                    📁 {selectedCategory === 'all' ? 'Tất cả danh mục' : selectedCategory}
                                </span>
                                {searchTerm && (
                                    <span>
                                        🔍 Tìm kiếm: "{searchTerm}"
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromptLibrary;