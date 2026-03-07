"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    BarChart3,
    CheckCircle2,
    Download,
    Share2,
    Sparkles,
    Award,
    TrendingUp,
    Users,
    Target,
    MessageCircle,
    Clock,
    BookOpen
} from 'lucide-react';
import { cn } from '../utils';
import { discQuestions, DiscResult, discResults } from '../_data/disc-questions';

type Answer = {
    questionId: number;
    selectedOption: 'A' | 'B';
};

type Score = {
    D: number;
    I: number;
    S: number;
    C: number;
};

// Extended DiscResult type to include scores
type DiscResultWithScores = DiscResult & {
    scores?: Score;
    careers: string[]; // Thêm field này nếu nó có trong DiscResult
};

const DiscTest = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState<DiscResultWithScores | null>(null);
    const [scores, setScores] = useState<Score>({ D: 0, I: 0, S: 0, C: 0 });
    const [testStarted, setTestStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const [showTimeWarning, setShowTimeWarning] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'strengths' | 'communication' | 'career'>('overview');

    // Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (testStarted && !showResult && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 300) setShowTimeWarning(true);
                    if (prev <= 0) {
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [testStarted, showResult, timeLeft]);

    const handleAutoSubmit = () => {
        calculateResults();
        setShowResult(true);
        setTestStarted(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartTest = () => {
        setTestStarted(true);
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResult(false);
        setTimeLeft(30 * 60);
        setShowTimeWarning(false);
    };

    const handleAnswer = (option: 'A' | 'B') => {
        const existingAnswerIndex = answers.findIndex(a => a.questionId === currentQuestion);

        if (existingAnswerIndex !== -1) {
            const updatedAnswers = [...answers];
            updatedAnswers[existingAnswerIndex] = { questionId: currentQuestion, selectedOption: option };
            setAnswers(updatedAnswers);
        } else {
            setAnswers([...answers, { questionId: currentQuestion, selectedOption: option }]);
        }

        // Auto move to next question if not last
        if (currentQuestion < discQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < discQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const calculateResults = () => {
        const newScores: Score = { D: 0, I: 0, S: 0, C: 0 };

        answers.forEach(answer => {
            const question = discQuestions.find(q => q.id === answer.questionId);
            if (question) {
                const selectedTrait = question.options[answer.selectedOption].trait;
                newScores[selectedTrait] += 1;
            }
        });

        setScores(newScores);

        // Determine dominant trait
        const dominantTrait = Object.entries(newScores).reduce((a, b) =>
            a[1] > b[1] ? a : b
        )[0] as keyof Score;

        // Tìm kết quả trong mảng discResults dựa trên type
        let foundResult = discResults.find(r => r.type === dominantTrait);

        // Nếu không tìm thấy kết quả cho trait đơn, thử tìm kết hợp
        if (!foundResult) {
            // Tìm trait cao thứ hai
            const sortedTraits = Object.entries(newScores)
                .sort((a, b) => b[1] - a[1])
                .map(entry => entry[0]);

            const combinedType = sortedTraits[0] + sortedTraits[1];
            foundResult = discResults.find(r => r.type === combinedType);
        }

        // Fallback nếu vẫn không tìm thấy
        if (!foundResult) {
            foundResult = discResults[0]; // Lấy kết quả đầu tiên làm mặc định
        }

        setResult({
            ...foundResult,
            scores: newScores,
            careers: (foundResult as any).careers || (foundResult as any).suitableCareers || [] // Thêm careers mặc định
        });
    };

    const handleSubmit = () => {
        if (answers.length < discQuestions.length) {
            if (confirm(`Bạn còn ${discQuestions.length - answers.length} câu chưa trả lời. Bạn có muốn nộp bài không?`)) {
                calculateResults();
                setShowResult(true);
                setTestStarted(false);
            }
        } else {
            calculateResults();
            setShowResult(true);
            setTestStarted(false);
        }
    };

    const handleReset = () => {
        setTestStarted(false);
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResult(false);
        setResult(null);
        setTimeLeft(30 * 60);
        setShowTimeWarning(false);
    };

    const handleDownloadResult = () => {
        if (!result) return;

        const resultText = `
KẾT QUẢ TRẮC NGHIỆM DISC
=========================
Loại tính cách: ${result.type} - ${result.title}
Mô tả: ${result.description}

ĐIỂM SỐ CHI TIẾT:
- D (Dominance): ${result.scores?.D || 0} điểm
- I (Influence): ${result.scores?.I || 0} điểm
- S (Steadiness): ${result.scores?.S || 0} điểm
- C (Conscientiousness): ${result.scores?.C || 0} điểm

ĐIỂM MẠNH:
${result.strengths.map(s => `✓ ${s}`).join('\n')}

ĐIỂM YẾU:
${result.weaknesses.map(w => `✗ ${w}`).join('\n')}

GIAO TIẾP HIỆU QUẢ:
${result.communicationTips.map(t => `• ${t}`).join('\n')}

NGHỀ NGHIỆP PHÙ HỢP:
${result.careers.map(c => `• ${c}`).join('\n')}
        `;

        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DISC_Result_${result.type}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        if (!result) return;

        const shareText = `Kết quả DISC của tôi: ${result.type} - ${result.title}. ${result.description.substring(0, 100)}...`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Kết quả trắc nghiệm DISC',
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            await navigator.clipboard.writeText(shareText);
            alert('Đã copy kết quả vào clipboard!');
        }
    };

    const progress = ((currentQuestion + 1) / discQuestions.length) * 100;
    const isAnswered = (questionId: number) => answers.some(a => a.questionId === questionId);

    // Nếu chưa bắt đầu test, hiển thị màn hình giới thiệu
    if (!testStarted && !showResult) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="w-8 h-8" />
                                <h1 className="text-3xl font-bold">Trắc nghiệm DISC</h1>
                            </div>
                            <p className="text-blue-100 text-lg">
                                Khám phá tính cách của bạn qua 4 nhóm: D (Thống trị), I (Ảnh hưởng),
                                S (Kiên định), C (Tuân thủ)
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                        Thông tin bài test
                                    </h2>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span><strong>{discQuestions.length} câu hỏi</strong> trắc nghiệm</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                            <span><strong>30 phút</strong> để hoàn thành</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Target className="w-5 h-5 text-purple-500" />
                                            <span>Mỗi câu chọn 1 trong 2 đáp án</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-orange-500" />
                                            <span>Nhận phân tích chi tiết về tính cách</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        Bạn sẽ nhận được
                                    </h2>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span>Xác định nhóm tính cách chính</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span>Điểm mạnh và điểm yếu</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span>Cách giao tiếp hiệu quả</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span>Nghề nghiệp phù hợp</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                                <p className="text-sm text-blue-800">
                                    <strong>💡 Lưu ý:</strong> Hãy trả lời theo cảm nhận đầu tiên của bạn,
                                    không suy nghĩ quá nhiều. Sự trung thực sẽ mang lại kết quả chính xác nhất.
                                </p>
                            </div>

                            <button
                                onClick={handleStartTest}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
                            >
                                <Sparkles className="w-5 h-5" />
                                BẮT ĐẦU BÀI TEST
                            </button>

                            {result && (
                                <button
                                    onClick={() => setShowResult(true)}
                                    className="w-full mt-4 py-3 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all"
                                >
                                    Xem lại kết quả gần nhất
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Hiển thị kết quả
    if (showResult && result) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden"
                    >
                        {/* Result Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl font-bold">Kết quả của bạn</h1>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDownloadResult}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        title="Tải kết quả"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        title="Chia sẻ"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-center py-4">
                                <div className="text-6xl mb-2 font-bold">{result.type}</div>
                                <h2 className="text-2xl font-semibold mb-2">{result.title}</h2>
                                <p className="text-blue-100">{result.description}</p>
                            </div>
                        </div>

                        {/* Score Chart */}
                        <div className="p-8 border-b">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                Điểm số chi tiết
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(Object.entries(result.scores || scores) as [keyof Score, number][]).map(([trait, score]) => (
                                    <div key={trait} className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{score}</div>
                                        <div className="text-sm font-medium text-gray-600">
                                            {trait === 'D' && 'D - Thống trị'}
                                            {trait === 'I' && 'I - Ảnh hưởng'}
                                            {trait === 'S' && 'S - Kiên định'}
                                            {trait === 'C' && 'C - Tuân thủ'}
                                        </div>
                                        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${(score / discQuestions.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="border-b">
                            <div className="flex overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={cn(
                                        "px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                                        activeTab === 'overview'
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    Tổng quan
                                </button>
                                <button
                                    onClick={() => setActiveTab('strengths')}
                                    className={cn(
                                        "px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                                        activeTab === 'strengths'
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    Điểm mạnh & yếu
                                </button>
                                <button
                                    onClick={() => setActiveTab('communication')}
                                    className={cn(
                                        "px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                                        activeTab === 'communication'
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    Giao tiếp
                                </button>
                                <button
                                    onClick={() => setActiveTab('career')}
                                    className={cn(
                                        "px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                                        activeTab === 'career'
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    Nghề nghiệp
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h4 className="font-semibold mb-2">Mô tả chi tiết</h4>
                                            <p className="text-gray-600">{result.description}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'strengths' && (
                                    <motion.div
                                        key="strengths"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="grid md:grid-cols-2 gap-6"
                                    >
                                        <div>
                                            <h4 className="font-semibold mb-3 text-green-600 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Điểm mạnh
                                            </h4>
                                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                                {result.strengths.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4" />
                                                Điểm cần cải thiện
                                            </h4>
                                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                                {result.weaknesses.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'communication' && (
                                    <motion.div
                                        key="communication"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-blue-600" />
                                            Cách giao tiếp hiệu quả
                                        </h4>
                                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                                            {result.communicationTips.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {activeTab === 'career' && (
                                    <motion.div
                                        key="career"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-600" />
                                            Nghề nghiệp phù hợp
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {result.careers.map((career, index) => (
                                                <div key={index} className="bg-blue-50 p-3 rounded-lg text-blue-800">
                                                    {career}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-8 bg-gray-50 border-t flex gap-3">
                            <button
                                onClick={handleStartTest}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                            >
                                Làm lại bài test
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 border border-gray-300 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Về trang chủ
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Hiển thị câu hỏi
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Câu {currentQuestion + 1}/{discQuestions.length}</span>
                        <div className="flex items-center gap-4">
                            <span className={cn(
                                "font-medium",
                                showTimeWarning ? "text-orange-600 animate-pulse" : "text-gray-600"
                            )}>
                                ⏱️ {formatTime(timeLeft)}
                            </span>
                            <span>{answers.length}/{discQuestions.length} đã trả lời</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            {discQuestions[currentQuestion].question}
                        </h2>

                        <div className="space-y-4">
                            {(['A', 'B'] as const).map((option) => {
                                const question = discQuestions[currentQuestion];
                                const isSelected = answers.some(
                                    a => a.questionId === currentQuestion && a.selectedOption === option
                                );

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        className={cn(
                                            "w-full p-4 text-left rounded-xl border-2 transition-all",
                                            "hover:border-blue-300 hover:bg-blue-50",
                                            isSelected
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-200"
                                        )}
                                    >
                                        <span className="font-medium text-blue-600 mr-3">
                                            {option}.
                                        </span>
                                        {question.options[option].text}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className={cn(
                                    "px-6 py-2 rounded-lg flex items-center gap-2 transition-all",
                                    currentQuestion === 0
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Câu trước
                            </button>

                            {currentQuestion === discQuestions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all active:scale-[0.98] flex items-center gap-2"
                                >
                                    Nộp bài
                                    <CheckCircle2 className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    disabled={!isAnswered(currentQuestion)}
                                    className={cn(
                                        "px-6 py-2 rounded-lg flex items-center gap-2 transition-all",
                                        isAnswered(currentQuestion)
                                            ? "text-blue-600 hover:bg-blue-50"
                                            : "text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    Câu tiếp
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Navigation */}
                <div className="mt-6 bg-white rounded-xl p-4 shadow">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Danh sách câu hỏi</h3>
                    <div className="flex flex-wrap gap-2">
                        {discQuestions.map((q, index) => {
                            const answered = answers.some(a => a.questionId === index);
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                                        currentQuestion === index
                                            ? "bg-blue-600 text-white"
                                            : answered
                                                ? "bg-green-100 text-green-700 border border-green-300"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Warning for unanswered questions */}
                {answers.length < discQuestions.length && (
                    <div className="mt-4 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-3">
                        ⚠️ Bạn còn {discQuestions.length - answers.length} câu chưa trả lời
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscTest;