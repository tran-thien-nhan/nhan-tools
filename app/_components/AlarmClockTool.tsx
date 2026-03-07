"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    AlarmClock,
    Timer,
    Bell,
    BellOff,
    Play,
    Pause,
    RotateCcw,
    Plus,
    Trash2,
    Volume2,
    VolumeX,
    Coffee,
    Smartphone
} from 'lucide-react';
import { cn } from '../utils';

type TimerMode = 'timer' | 'alarm' | 'stopwatch';

type Alarm = {
    id: string;
    time: string;
    label: string;
    enabled: boolean;
    repeat: string[];
    sound: string;
    snooze: number;
};

type TimerPreset = {
    id: string;
    name: string;
    duration: number;
};

const AlarmClockTool = () => {
    // State for current mode
    const [activeMode, setActiveMode] = useState<TimerMode>('timer');

    // Timer states
    const [timerDuration, setTimerDuration] = useState(300);
    const [timerInput, setTimerInput] = useState('5:00');
    const [timerRemaining, setTimerRemaining] = useState(300);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerPaused, setTimerPaused] = useState(false);

    // Stopwatch states
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [stopwatchRunning, setStopwatchRunning] = useState(false);
    const [stopwatchLaps, setStopwatchLaps] = useState<number[]>([]);

    const lastTriggeredRef = useRef<string | null>(null);

    // Audio states
    const [showAlarmModal, setShowAlarmModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    // Vibration states
    const vibrationInterval = useRef<NodeJS.Timeout | null>(null);

    // Alarm states
    const [alarms, setAlarms] = useState<Alarm[]>([
        {
            id: '1',
            time: '07:00',
            label: 'Thức dậy',
            enabled: true,
            repeat: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            sound: 'default',
            snooze: 5
        },
        {
            id: '2',
            time: '22:00',
            label: 'Đi ngủ',
            enabled: true,
            repeat: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            sound: 'default',
            snooze: 5
        }
    ]);

    // Khởi tạo audio
    useEffect(() => {
        // Tạo audio element
        audioRef.current = new Audio('/sounds/rickroll.mp3');
        audioRef.current.loop = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Đánh dấu user đã tương tác với trang
    useEffect(() => {
        const handleUserInteraction = () => {
            setHasUserInteracted(true);
            // Play thử audio nếu đang có báo thức
            if (showAlarmModal && audioRef.current) {
                audioRef.current.play().catch(() => { });
            }
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('touchstart', handleUserInteraction);
        window.addEventListener('keydown', handleUserInteraction);

        return () => {
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };
    }, [showAlarmModal]);

    // Phát audio và rung khi modal mở
    useEffect(() => {
        if (showAlarmModal && audioRef.current) {
            // Bắt đầu rung (chỉ trên mobile)
            startVibration();

            const playAudio = async () => {
                try {
                    await audioRef.current?.play();
                    console.log('Đã phát âm thanh tự động');
                } catch (error) {
                    console.log('Không thể phát tự động:', error);
                }
            };

            playAudio();

            if (!hasUserInteracted) {
                const timer = setTimeout(() => {
                    playAudio();
                }, 1000);
                return () => clearTimeout(timer);
            }
        } else {
            // Dừng rung khi đóng modal
            stopVibration();
        }
    }, [showAlarmModal, hasUserInteracted]);

    // Hàm bắt đầu rung
    const startVibration = () => {
        // Kiểm tra xem thiết bị có hỗ trợ rung không
        if (!isMobile || !navigator.vibrate) {
            console.log('Thiết bị không hỗ trợ rung');
            return;
        }

        // Tạo mẫu rung: rung 1 giây, nghỉ 0.5 giây, lặp lại
        const vibrationPattern = [1000, 500, 1000, 500, 1000, 500, 1000];

        // Bắt đầu rung
        navigator.vibrate(vibrationPattern);

        // Tạo interval để rung liên tục (vì vibrate chỉ chạy 1 lần)
        vibrationInterval.current = setInterval(() => {
            if (showAlarmModal) {
                navigator.vibrate(vibrationPattern);
            }
        }, 6000); // Lặp lại mỗi 6 giây

        console.log('Đã bắt đầu rung');
    };

    // Hàm dừng rung
    const stopVibration = () => {
        if (vibrationInterval.current) {
            clearInterval(vibrationInterval.current);
            vibrationInterval.current = null;
        }

        if (navigator.vibrate) {
            navigator.vibrate(0); // Dừng rung ngay lập tức
        }
    };

    const startAlarmSound = async () => {
        if (!soundEnabled || !audioRef.current) return;
        setShowAlarmModal(true);
    };

    const stopAlarmSound = () => {
        setShowAlarmModal(false);
        stopVibration(); // Dừng rung khi tắt báo thức

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Common states
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [alarmTriggered, setAlarmTriggered] = useState<string | null>(null);
    const [showAddAlarm, setShowAddAlarm] = useState(false);
    const [newAlarm, setNewAlarm] = useState<Partial<Alarm>>({
        time: '08:00',
        label: '',
        enabled: true,
        repeat: [],
        sound: 'default',
        snooze: 5
    });

    // Timer presets
    const timerPresets: TimerPreset[] = [
        { id: '1', name: 'Pomodoro', duration: 1500 },
        { id: '2', name: 'Nghỉ ngắn', duration: 300 },
        { id: '3', name: 'Nghỉ dài', duration: 900 },
        { id: '4', name: 'Tập trung', duration: 3600 },
        { id: '5', name: 'Ngủ trưa', duration: 1800 },
        { id: '6', name: 'Tập thể dục', duration: 1800 },
    ];

    // Refs
    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const stopwatchInterval = useRef<NodeJS.Timeout | null>(null);
    const alarmCheckInterval = useRef<NodeJS.Timeout | null>(null);

    // Timer logic
    useEffect(() => {
        if (timerRunning && !timerPaused && timerRemaining > 0) {
            timerInterval.current = setInterval(() => {
                setTimerRemaining(prev => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
            }
        };
    }, [timerRunning, timerPaused, timerRemaining]);

    // Stopwatch logic
    useEffect(() => {
        if (stopwatchRunning) {
            stopwatchInterval.current = setInterval(() => {
                setStopwatchTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (stopwatchInterval.current) {
                clearInterval(stopwatchInterval.current);
            }
        };
    }, [stopwatchRunning]);

    // Check alarms
    useEffect(() => {
        alarmCheckInterval.current = setInterval(() => {
            checkAlarms();
        }, 1000);

        return () => {
            if (alarmCheckInterval.current) {
                clearInterval(alarmCheckInterval.current);
            }
        };
    }, [alarms]);

    useEffect(() => {
        return () => {
            stopAlarmSound();
        };
    }, []);

    const checkAlarms = () => {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

        alarms.forEach(alarm => {
            if (!alarm.enabled) return;
            if (alarm.time === currentTime) {
                if (alarm.repeat.length === 0 || alarm.repeat.includes(currentDay)) {
                    if (lastTriggeredRef.current !== alarm.id + currentTime) {
                        lastTriggeredRef.current = alarm.id + currentTime;
                        triggerAlarm(alarm.id);
                    }
                }
            }
        });
    };

    const triggerAlarm = (alarmId: string) => {
        setAlarmTriggered(alarmId);
        startAlarmSound();

        setTimeout(() => {
            lastTriggeredRef.current = null;
        }, 60000);
    };

    const stopAlarm = () => {
        stopAlarmSound();

        if (alarmTriggered) {
            const now = new Date();
            const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
            lastTriggeredRef.current = alarmTriggered + currentTime;
        }

        setAlarmTriggered(null);
    };

    const snoozeAlarm = () => {
        if (alarmTriggered) {
            const alarm = alarms.find(a => a.id === alarmTriggered);
            if (alarm) {
                const snoozeMinutes = alarm.snooze;
                const [hours, minutes] = alarm.time.split(':').map(Number);
                const newTime = new Date();
                newTime.setHours(hours);
                newTime.setMinutes(minutes + snoozeMinutes);

                const newAlarmTime = `${newTime.getHours().toString().padStart(2, '0')}:${newTime.getMinutes().toString().padStart(2, '0')}`;

                setAlarms(prev => prev.map(a =>
                    a.id === alarmTriggered
                        ? { ...a, time: newAlarmTime }
                        : a
                ));
            }
            stopAlarm();
        }
    };

    const handleTimerComplete = () => {
        setTimerRunning(false);
        startAlarmSound();
    };

    const startTimer = () => {
        setTimerRunning(true);
        setTimerPaused(false);
    };

    const increaseTimer = () => {
        const newTime = timerDuration + 60;
        setTimerDuration(newTime);
        setTimerRemaining(newTime);
        setTimerInput(formatTimeInput(newTime));
    };

    const decreaseTimer = () => {
        const newTime = Math.max(0, timerDuration - 60);
        setTimerDuration(newTime);
        setTimerRemaining(newTime);
        setTimerInput(formatTimeInput(newTime));
    };

    const pauseTimer = () => {
        setTimerPaused(true);
        setTimerRunning(false);
    };

    const resetTimer = () => {
        setTimerRunning(false);
        setTimerPaused(false);
        setTimerRemaining(timerDuration);
        stopAlarmSound();
    };

    const setTimerPreset = (duration: number) => {
        setTimerDuration(duration);
        setTimerRemaining(duration);
        setTimerInput(formatTimeInput(duration));
    };

    const handleTimerInputChange = (value: string) => {
        setTimerInput(value);
        const seconds = parseTimeInput(value);
        if (seconds > 0) {
            setTimerDuration(seconds);
            setTimerRemaining(seconds);
        }
    };

    const parseTimeInput = (input: string): number => {
        const parts = input.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;
            return minutes * 60 + seconds;
        }
        return 0;
    };

    const formatTimeInput = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startStopwatch = () => {
        setStopwatchRunning(true);
    };

    const pauseStopwatch = () => {
        setStopwatchRunning(false);
    };

    const resetStopwatch = () => {
        setStopwatchRunning(false);
        setStopwatchTime(0);
        setStopwatchLaps([]);
    };

    const addLap = () => {
        setStopwatchLaps(prev => [stopwatchTime, ...prev].slice(0, 10));
    };

    const addAlarm = () => {
        if (newAlarm.time) {
            const alarm: Alarm = {
                id: Date.now().toString(),
                time: newAlarm.time,
                label: newAlarm.label || 'Báo thức',
                enabled: newAlarm.enabled || true,
                repeat: newAlarm.repeat || [],
                sound: newAlarm.sound || 'default',
                snooze: newAlarm.snooze || 5
            };
            setAlarms(prev => [...prev, alarm]);
            setShowAddAlarm(false);
            setNewAlarm({
                time: '08:00',
                label: '',
                enabled: true,
                repeat: [],
                sound: 'default',
                snooze: 5
            });
        }
    };

    const deleteAlarm = (id: string) => {
        setAlarms(prev => prev.filter(a => a.id !== id));
    };

    const toggleAlarm = (id: string) => {
        setAlarms(prev => prev.map(a =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
        ));
    };

    const toggleRepeatDay = (day: string) => {
        setNewAlarm(prev => ({
            ...prev,
            repeat: prev.repeat?.includes(day)
                ? prev.repeat.filter(d => d !== day)
                : [...(prev.repeat || []), day]
        }));
    };

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Kiểm tra mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlarmClock className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">Hẹn giờ & Báo thức</h1>
                    </div>
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mode Selection */}
            <div className="flex border-b">
                {(['timer', 'stopwatch', 'alarm'] as TimerMode[]).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setActiveMode(mode)}
                        className={cn(
                            "flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                            activeMode === mode
                                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        {mode === 'timer' && <Timer className="w-4 h-4" />}
                        {mode === 'stopwatch' && <Clock className="w-4 h-4" />}
                        {mode === 'alarm' && <AlarmClock className="w-4 h-4" />}
                        <span className="capitalize">
                            {mode === 'timer' ? 'Hẹn giờ' : mode === 'stopwatch' ? 'Bấm giờ' : 'Báo thức'}
                        </span>
                    </button>
                ))}
            </div>

            {/* Alarm Modal */}
            {/* Alarm Modal */}
            <AnimatePresence>
                {showAlarmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                stopAlarm();
                            }
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center"
                        >
                            <Bell className="w-20 h-20 text-orange-500 mx-auto mb-4 animate-bounce" />
                            <h3 className="text-2xl font-bold mb-2">⏰ Báo thức!</h3>
                            <p className="text-gray-600 mb-1">
                                {alarms.find(a => a.id === alarmTriggered)?.label}
                            </p>
                            <p className="text-3xl font-bold text-blue-600 mb-6">
                                {alarms.find(a => a.id === alarmTriggered)?.time}
                            </p>

                            {/* Hiển thị trạng thái - ĐÃ SỬA LỖI */}
                            <div className="w-full mb-4 py-3 bg-green-100 text-green-800 font-bold rounded-xl flex items-center justify-center gap-2">
                                {isMobile && typeof navigator.vibrate !== 'undefined' ? (
                                    <>
                                        <Smartphone className="w-5 h-5 animate-pulse" />
                                        <span>Đang rung và phát...</span>
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="w-5 h-5 animate-pulse" />
                                        <span>Đang phát...</span>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={snoozeAlarm}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Coffee className="w-4 h-4" />
                                    Báo lại
                                </button>
                                <button
                                    onClick={stopAlarm}
                                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all"
                                >
                                    Tắt
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Timer Mode */}
            {activeMode === 'timer' && (
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="text-7xl font-bold text-blue-600 mb-4 font-mono">
                            {formatTime(timerRemaining)}
                        </div>

                        <div className="max-w-xs mx-auto flex items-center gap-2">
                            <button onClick={increaseTimer} disabled={timerRunning} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">+</button>
                            <input
                                type="text"
                                value={timerInput}
                                onChange={(e) => handleTimerInputChange(e.target.value)}
                                disabled={timerRunning}
                                placeholder="mm:ss"
                                className="flex-1 px-4 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={decreaseTimer} disabled={timerRunning} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">-</button>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                        {!timerRunning && !timerPaused ? (
                            <button
                                onClick={startTimer}
                                disabled={timerRemaining === 0}
                                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                <Play className="w-5 h-5" /> Bắt đầu
                            </button>
                        ) : (
                            <button
                                onClick={pauseTimer}
                                className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                            >
                                <Pause className="w-5 h-5" /> Tạm dừng
                            </button>
                        )}
                        <button
                            onClick={resetTimer}
                            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" /> Đặt lại
                        </button>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Cài đặt nhanh</h3>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {timerPresets.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => setTimerPreset(preset.duration)}
                                    className="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-center"
                                >
                                    <div className="font-medium">{preset.name}</div>
                                    <div className="text-sm text-gray-500">{formatTime(preset.duration)}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Stopwatch Mode */}
            {activeMode === 'stopwatch' && (
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="text-7xl font-bold text-blue-600 mb-4 font-mono">
                            {formatTime(stopwatchTime)}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                        {!stopwatchRunning ? (
                            <button
                                onClick={startStopwatch}
                                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" /> Bắt đầu
                            </button>
                        ) : (
                            <button
                                onClick={pauseStopwatch}
                                className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                            >
                                <Pause className="w-5 h-5" /> Tạm dừng
                            </button>
                        )}
                        <button
                            onClick={addLap}
                            disabled={!stopwatchRunning}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            <Plus className="w-5 h-5" /> Vòng
                        </button>
                        <button
                            onClick={resetStopwatch}
                            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" /> Đặt lại
                        </button>
                    </div>

                    {stopwatchLaps.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Các vòng</h3>
                            <div className="bg-white rounded-xl border border-gray-200 divide-y">
                                {stopwatchLaps.map((lap, index) => (
                                    <div key={index} className="flex justify-between p-3">
                                        <span className="text-gray-600">Vòng {stopwatchLaps.length - index}</span>
                                        <span className="font-mono font-medium">{formatTime(lap)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Alarm Mode */}
            {activeMode === 'alarm' && (
                <div className="p-8">
                    <button
                        onClick={() => setShowAddAlarm(true)}
                        className="w-full mb-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Thêm báo thức mới
                    </button>

                    <AnimatePresence>
                        {showAddAlarm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <h3 className="font-semibold mb-4">Thêm báo thức mới</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                                            <input
                                                type="time"
                                                value={newAlarm.time}
                                                onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn</label>
                                            <input
                                                type="text"
                                                value={newAlarm.label}
                                                onChange={(e) => setNewAlarm(prev => ({ ...prev, label: e.target.value }))}
                                                placeholder="VD: Thức dậy, Đi làm..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Lặp lại</label>
                                            <div className="flex flex-wrap gap-2">
                                                {weekDays.map((day) => (
                                                    <button
                                                        key={day}
                                                        onClick={() => toggleRepeatDay(day)}
                                                        className={cn(
                                                            "w-10 h-10 rounded-full text-sm font-medium transition-all",
                                                            newAlarm.repeat?.includes(day)
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                        )}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Báo lại sau (phút)</label>
                                            <select
                                                value={newAlarm.snooze}
                                                onChange={(e) => setNewAlarm(prev => ({ ...prev, snooze: parseInt(e.target.value) }))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value={1}>1 phút</option>
                                                <option value={5}>5 phút</option>
                                                <option value={10}>10 phút</option>
                                                <option value={15}>15 phút</option>
                                                <option value={30}>30 phút</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={addAlarm}
                                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                                            >
                                                Thêm
                                            </button>
                                            <button
                                                onClick={() => setShowAddAlarm(false)}
                                                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-3">
                        {alarms.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <BellOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Chưa có báo thức nào</p>
                            </div>
                        ) : (
                            alarms.map((alarm) => (
                                <motion.div
                                    key={alarm.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={cn(
                                        "bg-white rounded-xl p-4 border-2 transition-all",
                                        alarm.enabled ? "border-blue-200" : "border-gray-200 opacity-60"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => toggleAlarm(alarm.id)}
                                                className={cn(
                                                    "w-12 h-6 rounded-full transition-colors relative",
                                                    alarm.enabled ? "bg-blue-600" : "bg-gray-300"
                                                )}
                                            >
                                                <div className={cn(
                                                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                                    alarm.enabled ? "left-7" : "left-1"
                                                )} />
                                            </button>

                                            <div>
                                                <div className="text-2xl font-bold font-mono">{alarm.time}</div>
                                                <div className="text-sm text-gray-600">{alarm.label}</div>
                                                {alarm.repeat.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {weekDays.map(day => (
                                                            <span
                                                                key={day}
                                                                className={cn(
                                                                    "text-xs px-1.5 py-0.5 rounded",
                                                                    alarm.repeat.includes(day)
                                                                        ? "bg-blue-100 text-blue-700"
                                                                        : "text-gray-400"
                                                                )}
                                                            >
                                                                {day}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => deleteAlarm(alarm.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t text-center text-sm text-gray-500">
                <p>⏰ Hẹn giờ và báo thức thông minh - Quản lý thời gian hiệu quả</p>
            </div>
        </div>
    );
};

export default AlarmClockTool;