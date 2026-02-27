'use client';

import React, { useState, useEffect } from 'react';
import {
    StickyNote,
    Plus,
    Trash2,
    Edit,
    Save,
    Send,
    Copy,
    Check,
    Loader2,
    AlertCircle,
    Clock,
    Calendar,
    X,
    Download
} from 'lucide-react';
import { cn } from '@/app/utils';
import { webhookUrl_2 } from '@/app/_data/discordConfig';

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
}

const NotesApp: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editTags, setEditTags] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sendingToDiscord, setSendingToDiscord] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [webhookError, setWebhookError] = useState<string | null>(null);

    // Load notes từ localStorage khi mount
    useEffect(() => {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            try {
                const parsed = JSON.parse(savedNotes);
                const notesWithDates = parsed.map((note: any) => ({
                    ...note,
                    createdAt: new Date(note.createdAt),
                    updatedAt: new Date(note.updatedAt)
                }));
                setNotes(notesWithDates);
            } catch (error) {
                console.error('Error loading notes:', error);
            }
        } else {
            // Tạo note mẫu
            const sampleNote: Note = {
                id: Date.now().toString(),
                title: 'Chào mừng bạn đến với Notes App!',
                content: 'Đây là ghi chú mẫu. Bạn có thể:\n\n' +
                    '📝 Tạo ghi chú mới\n' +
                    '🏷️ Thêm tags\n' +
                    '📤 Gửi lên Discord\n' +
                    '💾 Lưu tự động',
                createdAt: new Date(),
                updatedAt: new Date(),
                tags: ['welcome', 'guide']
            };
            setNotes([sampleNote]);
        }
    }, []);

    // Save notes to localStorage khi có thay đổi
    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem('notes', JSON.stringify(notes));
        }
    }, [notes]);

    // Kiểm tra webhook URL
    useEffect(() => {
        if (!webhookUrl_2) {
            setWebhookError('❌ Không tìm thấy DISCORD_WEBHOOK_URL trong file .env.local');
        } else if (!webhookUrl_2.startsWith('https://discord.com/api/webhooks/')) {
            setWebhookError('❌ Webhook URL không hợp lệ');
        } else {
            setWebhookError(null);
        }
    }, []);

    // Tạo note mới
    const createNewNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: 'Ghi chú mới',
            content: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: []
        };
        setNotes(prev => [newNote, ...prev]);
        setSelectedNote(newNote);
        setIsEditing(true);
        setEditTitle(newNote.title);
        setEditContent(newNote.content);
        setEditTags(newNote.tags.join(', '));
    };

    // Chọn note để xem
    const selectNote = (note: Note) => {
        setSelectedNote(note);
        setIsEditing(false);
    };

    // Bắt đầu chỉnh sửa
    const startEditing = () => {
        if (selectedNote) {
            setIsEditing(true);
            setEditTitle(selectedNote.title);
            setEditContent(selectedNote.content);
            setEditTags(selectedNote.tags.join(', '));
        }
    };

    // Lưu note
    const saveNote = () => {
        if (!selectedNote) return;

        const updatedNote: Note = {
            ...selectedNote,
            title: editTitle.trim() || 'Không có tiêu đề',
            content: editContent,
            tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date()
        };

        setNotes(prev => prev.map(note =>
            note.id === selectedNote.id ? updatedNote : note
        ));
        setSelectedNote(updatedNote);
        setIsEditing(false);
    };

    // Hủy chỉnh sửa
    const cancelEditing = () => {
        setIsEditing(false);
        if (selectedNote) {
            setEditTitle(selectedNote.title);
            setEditContent(selectedNote.content);
            setEditTags(selectedNote.tags.join(', '));
        }
    };

    // Xóa note
    const deleteNote = (id: string) => {
        if (confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            setNotes(prev => prev.filter(note => note.id !== id));
            if (selectedNote?.id === id) {
                setSelectedNote(null);
                setIsEditing(false);
            }
        }
    };

    // Gửi note lên Discord
    const sendToDiscord = async () => {
        if (!selectedNote || !webhookUrl_2) return;

        setSendingToDiscord(true);
        setSendError(null);
        setSendSuccess(false);

        try {
            const content = `📝 **${selectedNote.title}**\n\n` +
                `${selectedNote.content}\n\n` +
                `🏷️ Tags: ${selectedNote.tags.length > 0 ? selectedNote.tags.map(t => `\`${t}\``).join(' ') : '*Không có tag*'}\n` +
                `🕒 Tạo lúc: ${selectedNote.createdAt.toLocaleString('vi-VN')}\n` +
                `✏️ Cập nhật: ${selectedNote.updatedAt.toLocaleString('vi-VN')}`;

            const response = await fetch(webhookUrl_2, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    username: 'Notes App',
                    avatar_url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                })
            });

            if (!response.ok) {
                throw new Error(`Gửi thất bại: ${response.status}`);
            }

            setSendSuccess(true);
            setTimeout(() => setSendSuccess(false), 3000);
        } catch (error) {
            console.error('Error sending to Discord:', error);
            setSendError(error instanceof Error ? error.message : 'Không thể gửi lên Discord');
        } finally {
            setSendingToDiscord(false);
        }
    };

    // Copy note content
    const copyToClipboard = () => {
        if (!selectedNote) return;

        const text = `# ${selectedNote.title}\n\n${selectedNote.content}\n\nTags: ${selectedNote.tags.join(', ')}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Export notes
    const exportNotes = () => {
        const dataStr = JSON.stringify(notes, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `notes-export-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Filter notes
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-200">
                            <StickyNote className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
                                Notes App
                            </h1>
                            <p className="text-sm text-amber-600">
                                Ghi chú nhanh • Đồng bộ • Gửi lên Discord
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={exportNotes}
                            className="p-2 bg-white/80 hover:bg-white text-amber-700 rounded-xl transition-all"
                            title="Export notes"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button
                            onClick={createNewNote}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-amber-200"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Ghi chú mới</span>
                        </button>
                    </div>
                </div>

                {/* Webhook Error */}
                {webhookError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700">{webhookError}</p>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="🔍 Tìm kiếm ghi chú..."
                        className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900 placeholder-amber-400"
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Notes List */}
                    <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                        {filteredNotes.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-amber-200">
                                <StickyNote className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                                <p className="text-amber-500">Chưa có ghi chú nào</p>
                                <button
                                    onClick={createNewNote}
                                    className="mt-3 text-sm text-amber-600 hover:text-amber-700"
                                >
                                    Tạo ghi chú đầu tiên
                                </button>
                            </div>
                        ) : (
                            filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => selectNote(note)}
                                    className={cn(
                                        "p-4 bg-white rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                                        selectedNote?.id === note.id
                                            ? "border-amber-500 shadow-lg shadow-amber-100"
                                            : "border-amber-200 hover:border-amber-300"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-amber-900 truncate">
                                                {note.title}
                                            </h3>
                                            <p className="text-sm text-amber-700 line-clamp-2 mt-1">
                                                {note.content || '...'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-amber-600">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                    {new Date(note.updatedAt).toLocaleDateString('vi-VN')}
                                                </span>
                                                {note.tags.length > 0 && (
                                                    <span className="px-2 py-0.5 bg-amber-100 rounded-full">
                                                        {note.tags.length} tags
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNote(note.id);
                                            }}
                                            className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Note Editor/Viewer */}
                    <div className="lg:col-span-2">
                        {selectedNote ? (
                            <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-xl">
                                {/* Toolbar */}
                                <div className="p-4 border-b border-amber-200 bg-amber-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={saveNote}
                                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                                    title="Lưu"
                                                >
                                                    <Save className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                                    title="Hủy"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={startEditing}
                                                    className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
                                                    title="Copy"
                                                >
                                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={sendToDiscord}
                                                    disabled={sendingToDiscord || !!webhookError}
                                                    className={cn(
                                                        "p-2 rounded-lg transition-colors",
                                                        sendSuccess
                                                            ? "bg-green-500 text-white"
                                                            : webhookError
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                : "bg-indigo-500 hover:bg-indigo-600 text-white"
                                                    )}
                                                    title="Gửi lên Discord"
                                                >
                                                    {sendingToDiscord ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : sendSuccess ? (
                                                        <Check className="w-5 h-5" />
                                                    ) : (
                                                        <Send className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                placeholder="Tiêu đề..."
                                                className="w-full text-2xl font-bold bg-transparent border-b border-amber-200 focus:border-amber-500 outline-none pb-2 text-amber-900 placeholder-amber-300"
                                            />
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                placeholder="Nội dung ghi chú..."
                                                rows={12}
                                                className="w-full border border-amber-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-800 placeholder-amber-300 resize-none"
                                            />
                                            <div>
                                                <label className="text-sm font-medium text-amber-700 mb-1 block">
                                                    Tags (phân cách bằng dấu phẩy)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editTags}
                                                    onChange={(e) => setEditTags(e.target.value)}
                                                    placeholder="work, personal, idea..."
                                                    className="w-full px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="prose prose-amber max-w-none">
                                            <h2 className="text-2xl font-bold text-amber-900 mb-4">
                                                {selectedNote.title}
                                            </h2>
                                            <div className="text-amber-800 whitespace-pre-wrap min-h-[300px]">
                                                {selectedNote.content}
                                            </div>

                                            {selectedNote.tags.length > 0 && (
                                                <div className="mt-6 pt-4 border-t border-amber-200">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {selectedNote.tags.map(tag => (
                                                            <span
                                                                key={tag}
                                                                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 flex items-center gap-4 text-sm text-amber-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        Tạo: {selectedNote.createdAt.toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        Cập nhật: {selectedNote.updatedAt.toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {sendError && (
                                    <div className="px-6 pb-6">
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                            {sendError}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border-2 border-dashed border-amber-200 p-12 text-center">
                                <StickyNote className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-amber-700 mb-2">
                                    Chọn một ghi chú để xem
                                </h3>
                                <p className="text-amber-500">
                                    Hoặc tạo ghi chú mới để bắt đầu
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesApp;