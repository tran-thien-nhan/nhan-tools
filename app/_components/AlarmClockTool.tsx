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
    Check,
    X,
    Coffee,
    Moon,
    Sun,
    Calendar,
    AlertCircle
} from 'lucide-react';
import { cn } from '../utils';

type TimerMode = 'timer' | 'alarm' | 'stopwatch';

// Thêm ở đầu file, sau các import
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

type Alarm = {
    id: string;
    time: string; // HH:MM format
    label: string;
    enabled: boolean;
    repeat: string[]; // days of week: 'Mon', 'Tue', etc.
    sound: string;
    snooze: number; // minutes
};

type TimerPreset = {
    id: string;
    name: string;
    duration: number; // seconds
    icon?: React.ReactNode;
};

const AlarmClockTool = () => {
    // State for current mode
    const [activeMode, setActiveMode] = useState<TimerMode>('timer');

    // Timer states
    const [timerDuration, setTimerDuration] = useState(300); // 5 minutes in seconds
    const [timerInput, setTimerInput] = useState('5:00');
    const [timerRemaining, setTimerRemaining] = useState(300);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerPaused, setTimerPaused] = useState(false);

    // Stopwatch states
    const [stopwatchTime, setStopwatchTime] = useState(0); // seconds
    const [stopwatchRunning, setStopwatchRunning] = useState(false);
    const [stopwatchLaps, setStopwatchLaps] = useState<number[]>([]);

    const audioContextRef = useRef<AudioContext | null>(null);
    const alarmSoundInterval = useRef<NodeJS.Timeout | null>(null);

    const lastTriggeredRef = useRef<string | null>(null);

    // YouTube player states
    const [showYouTubePlayer, setShowYouTubePlayer] = useState(false);
    const [isYouTubePlaying, setIsYouTubePlaying] = useState(false);
    const [youTubeReady, setYouTubeReady] = useState(false);
    const youTubePlayerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

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

    // Load YouTube API
    useEffect(() => {
        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Define callback when API is ready
        window.onYouTubeIframeAPIReady = () => {
            console.log('YouTube API ready');
            setYouTubeReady(true);
        };
    }, []);

    // Initialize YouTube player when needed
    const initYouTubePlayer = () => {
        if (!playerContainerRef.current || youTubePlayerRef.current || !window.YT) return;

        youTubePlayerRef.current = new window.YT.Player(playerContainerRef.current, {
            videoId: 'dQw4w9WgXcQ',
            playerVars: {
                autoplay: 0, // Tắt autoplay mặc định
                controls: 0,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                loop: 1,
                playlist: 'dQw4w9WgXcQ',
                playsinline: 1 // Quan trọng cho mobile
            },
            events: {
                onReady: (event: any) => {
                    console.log('YouTube player ready');
                    event.target.setVolume(100);
                    // Thử phát video sau khi sẵn sàng
                    if (soundEnabled) {
                        // Trên mobile, cần user interaction để phát video
                        // Nên chúng ta sẽ thử phát và bắt lỗi
                        try {
                            event.target.playVideo().catch((e: any) => {
                                console.log('Auto-play bị chặn trên mobile, cần user tương tác');
                                // Hiển thị nút play thủ công
                            });
                        } catch (e) {
                            console.log('Auto-play bị chặn');
                        }
                    }
                },
                onStateChange: (event: any) => {
                    // Video ended
                    if (event.data === window.YT.PlayerState.ENDED) {
                        event.target.playVideo(); // Replay
                    }
                },
                onError: (event: any) => {
                    console.log('YouTube error:', event.data);
                }
            }
        });
    };

    // Hàm phát video với xử lý cho mobile
    const playYouTubeVideo = () => {
        if (youTubePlayerRef.current && youTubePlayerRef.current.playVideo) {
            try {
                // Thử phát video
                const playPromise = youTubePlayerRef.current.playVideo();
                
                // Xử lý Promise cho mobile
                if (playPromise !== undefined) {
                    playPromise.catch((error: any) => {
                        console.log('Không thể tự động phát trên mobile:', error);
                        // Nếu không tự động phát được, hiển thị thông báo
                        setIsYouTubePlaying(false);
                    });
                }
            } catch (error) {
                console.log('Lỗi khi phát video:', error);
            }
        }
    };

    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
        }
    };

    const startAlarmSound = () => {
        if (!soundEnabled) return;

        // Initialize and show YouTube player
        setShowYouTubePlayer(true);

        // Small delay to ensure player container is rendered
        setTimeout(() => {
            initYouTubePlayer();
            // Thêm delay nhỏ để player khởi tạo xong
            setTimeout(() => {
                playYouTubeVideo();
            }, 500);
        }, 100);
    };

    const stopAlarmSound = () => {
        // Hide YouTube player and stop video
        setShowYouTubePlayer(false);
        if (youTubePlayerRef.current && youTubePlayerRef.current.stopVideo) {
            youTubePlayerRef.current.stopVideo();
            setIsYouTubePlaying(false);
        }
        youTubePlayerRef.current = null;
    };

    // Hàm phát thủ công khi user click vào màn hình
    const handlePlayerClick = () => {
        if (youTubePlayerRef.current && youTubePlayerRef.current.playVideo) {
            youTubePlayerRef.current.playVideo();
            setIsYouTubePlaying(true);
        }
    };

    const playBeep = (frequency = 800, duration = 200) => {
        if (!audioContextRef.current) return;

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);

        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
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
        { id: '1', name: 'Pomodoro', duration: 1500 }, // 25 phút
        { id: '2', name: 'Nghỉ ngắn', duration: 300 }, // 5 phút
        { id: '3', name: 'Nghỉ dài', duration: 900 }, // 15 phút
        { id: '4', name: 'Tập trung', duration: 3600 }, // 1 giờ
        { id: '5', name: 'Ngủ trưa', duration: 1800 }, // 30 phút
        { id: '6', name: 'Tập thể dục', duration: 1800 }, // 30 phút
    ];

    // Refs
    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const stopwatchInterval = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const alarmCheckInterval = useRef<NodeJS.Timeout | null>(null);

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio('/sounds/alarm.mp3'); // Đường dẫn đến file âm thanh
        audioRef.current.loop = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

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

    // Check alarms every minute
    useEffect(() => {
        alarmCheckInterval.current = setInterval(() => {
            checkAlarms();
        }, 1000); // Check every second

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

        const currentTime =
            now.getHours().toString().padStart(2, '0') +
            ":" +
            now.getMinutes().toString().padStart(2, '0');

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
            const currentTime =
                now.getHours().toString().padStart(2, '0') +
                ":" +
                now.getMinutes().toString().padStart(2, '0');

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
        initAudio();
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
        stopAlarmSound(); // tắt âm thanh/video
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

    // Kiểm tra nếu là mobile
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

            {/* YouTube Player Modal */}
            <AnimatePresence>
                {showYouTubePlayer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                        onClick={(e) => {
                            // Prevent closing when clicking on the player
                            if (e.target === e.currentTarget) {
                                stopAlarm();
                            }
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-xl"
                        >
                            <div className="text-center mb-4">
                                <Bell className="w-12 h-12 text-orange-500 mx-auto mb-2 animate-bounce" />
                                <h3 className="text-xl font-bold">Báo thức!</h3>
                                <p className="text-gray-600">
                                    {alarms.find(a => a.id === alarmTriggered)?.label} - {alarms.find(a => a.id === alarmTriggered)?.time}
                                </p>
                                {isMobile && !isYouTubePlaying && (
                                    <p className="text-sm text-blue-600 mt-2">
                                        👆 Nhấn vào video để phát (do trình duyệt mobile chặn tự động phát)
                                    </p>
                                )}
                            </div>

                            {/* YouTube Player Container */}
                            <div 
                                className="relative w-full cursor-pointer" 
                                style={{ paddingBottom: '56.25%' }}
                                onClick={handlePlayerClick}
                            >
                                <div
                                    ref={playerContainerRef}
                                    className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden"
                                />
                                {isMobile && !isYouTubePlaying && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                                        <Play className="w-16 h-16 text-white opacity-75" />
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={snoozeAlarm}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Coffee className="w-4 h-4" />
                                    Báo lại sau 5 phút
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
                    {/* Timer Display */}
                    <div className="text-center mb-8">
                        <div className="text-7xl font-bold text-blue-600 mb-4 font-mono">
                            {formatTime(timerRemaining)}
                        </div>

                        {/* Timer Input */}
                        <div className="max-w-xs mx-auto flex items-center gap-2">
                            <button
                                onClick={increaseTimer}
                                disabled={timerRunning}
                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                            >
                                +
                            </button>
                            <input
                                type="text"
                                value={timerInput}
                                onChange={(e) => handleTimerInputChange(e.target.value)}
                                disabled={timerRunning}
                                placeholder="mm:ss"
                                className="flex-1 px-4 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={decreaseTimer}
                                disabled={timerRunning}
                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                            >
                                -
                            </button>
                        </div>
                    </div>

                    {/* Timer Controls */}
                    <div className="flex justify-center gap-4 mb-8">
                        {!timerRunning && !timerPaused ? (
                            <button
                                onClick={startTimer}
                                disabled={timerRemaining === 0}
                                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Play className="w-5 h-5" />
                                Bắt đầu
                            </button>
                        ) : (
                            <button
                                onClick={pauseTimer}
                                className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
                            >
                                <Pause className="w-5 h-5" />
                                Tạm dừng
                            </button>
                        )}
                        <button
                            onClick={resetTimer}
                            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Đặt lại
                        </button>
                    </div>

                    {/* Timer Presets */}
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
                                    <div className="text-sm text-gray-500">
                                        {formatTime(preset.duration)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Stopwatch Mode */}
            {activeMode === 'stopwatch' && (
                <div className="p-8">
                    {/* Stopwatch Display */}
                    <div className="text-center mb-8">
                        <div className="text-7xl font-bold text-blue-600 mb-4 font-mono">
                            {formatTime(stopwatchTime)}
                        </div>
                    </div>

                    {/* Stopwatch Controls */}
                    <div className="flex justify-center gap-4 mb-8">
                        {!stopwatchRunning ? (
                            <button
                                onClick={startStopwatch}
                                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                Bắt đầu
                            </button>
                        ) : (
                            <button
                                onClick={pauseStopwatch}
                                className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
                            >
                                <Pause className="w-5 h-5" />
                                Tạm dừng
                            </button>
                        )}
                        <button
                            onClick={addLap}
                            disabled={!stopwatchRunning}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5" />
                            Vòng
                        </button>
                        <button
                            onClick={resetStopwatch}
                            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Đặt lại
                        </button>
                    </div>

                    {/* Laps */}
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
                    {/* Add Alarm Button */}
                    <button
                        onClick={() => setShowAddAlarm(true)}
                        className="w-full mb-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm báo thức mới
                    </button>

                    {/* Add Alarm Form */}
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
                                        {/* Time Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Thời gian
                                            </label>
                                            <input
                                                type="time"
                                                value={newAlarm.time}
                                                onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Label Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nhãn
                                            </label>
                                            <input
                                                type="text"
                                                value={newAlarm.label}
                                                onChange={(e) => setNewAlarm(prev => ({ ...prev, label: e.target.value }))}
                                                placeholder="VD: Thức dậy, Đi làm..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Repeat Days */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Lặp lại
                                            </label>
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

                                        {/* Snooze Duration */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Báo lại sau (phút)
                                            </label>
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

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={addAlarm}
                                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
                                            >
                                                Thêm
                                            </button>
                                            <button
                                                onClick={() => setShowAddAlarm(false)}
                                                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Alarms List */}
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
                                                <div className="text-2xl font-bold font-mono">
                                                    {alarm.time}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {alarm.label}
                                                </div>
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
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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