'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Activity, Zap, RefreshCw } from 'lucide-react';
import { cn } from '../utils';

interface TabataTimerProps {
    className?: string;
}

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

const TabataTimer = ({ className }: TabataTimerProps) => {
    // Timer configuration
    const [workSeconds, setWorkSeconds] = useState<number>(20);
    const [restSeconds, setRestSeconds] = useState<number>(10);
    const [rounds, setRounds] = useState<number>(8);
    const [preparationSeconds, setPreparationSeconds] = useState<number>(5);

    // Timer state
    const [status, setStatus] = useState<TimerStatus>('idle');
    const [currentRound, setCurrentRound] = useState<number>(1);
    const [isWorkPhase, setIsWorkPhase] = useState<boolean>(true);
    const [timeLeft, setTimeLeft] = useState<number>(workSeconds);
    const [isPreparing, setIsPreparing] = useState<boolean>(false);
    const [prepTimeLeft, setPrepTimeLeft] = useState<number>(preparationSeconds);

    // Audio refs
    const audioContextRef = useRef<AudioContext | null>(null);

    // Timer interval ref
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize audio context on user interaction
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, []);

    // Play beep sound
    const playBeep = useCallback((frequency: number = 800, duration: number = 200) => {
        if (!audioContextRef.current) return;

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);

        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    }, []);

    // Play triple beep for phase changes
    const playPhaseChangeSound = useCallback(() => {
        playBeep(600, 100);
        setTimeout(() => playBeep(800, 100), 150);
        setTimeout(() => playBeep(1000, 200), 300);
    }, [playBeep]);

    // Play single beep for preparation countdown
    const playPrepBeep = useCallback((second: number) => {
        if (second <= 3) {
            playBeep(600, 100); // Urgent beep for last 3 seconds
        } else {
            playBeep(400, 80); // Regular beep
        }
    }, [playBeep]);

    // Cleanup timer
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Reset timer to initial state
    const resetTimer = useCallback(() => {
        clearTimer();
        setStatus('idle');
        setCurrentRound(1);
        setIsWorkPhase(true);
        setTimeLeft(workSeconds);
        setIsPreparing(false);
        setPrepTimeLeft(preparationSeconds);
    }, [clearTimer, workSeconds, preparationSeconds]);

    // Start timer
    const startTimer = useCallback(() => {
        initAudio();

        if (status === 'idle' && preparationSeconds > 0) {
            // Start with preparation phase
            setIsPreparing(true);
            setPrepTimeLeft(preparationSeconds);
            setStatus('running');
        } else if (status === 'idle') {
            // Start directly with work phase
            setStatus('running');
            setTimeLeft(workSeconds);
        } else if (status === 'paused') {
            setStatus('running');
        }
    }, [status, preparationSeconds, workSeconds, initAudio]);

    // Pause timer
    const pauseTimer = useCallback(() => {
        if (status === 'running') {
            clearTimer();
            setStatus('paused');
        }
    }, [status, clearTimer]);

    // Toggle pause/play
    const toggleTimer = useCallback(() => {
        if (status === 'running') {
            pauseTimer();
        } else {
            startTimer();
        }
    }, [status, pauseTimer, startTimer]);

    // Format time display
    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Handle timer logic
    useEffect(() => {
        if (status !== 'running') return;

        timerRef.current = setInterval(() => {
            if (isPreparing) {
                // Preparation phase
                setPrepTimeLeft((prev) => {
                    if (prev <= 1) {
                        // End preparation
                        setIsPreparing(false);
                        setTimeLeft(workSeconds);
                        playPhaseChangeSound();
                        return preparationSeconds;
                    }
                    playPrepBeep(prev - 1);
                    return prev - 1;
                });
            } else {
                // Work/Rest phases
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (isWorkPhase) {
                            // End work phase, start rest
                            if (currentRound === rounds) {
                                // Completed all rounds
                                clearTimer();
                                setStatus('completed');
                                playBeep(1200, 500); // Long beep for completion
                                return 0;
                            }
                            setIsWorkPhase(false);
                            setTimeLeft(restSeconds);
                            playPhaseChangeSound();
                            return restSeconds;
                        } else {
                            // End rest phase, start next work round
                            setIsWorkPhase(true);
                            setCurrentRound((r) => r + 1);
                            setTimeLeft(workSeconds);
                            playPhaseChangeSound();
                            return workSeconds;
                        }
                    }

                    // Play countdown beep for last 3 seconds of work/rest
                    if (prev <= 4 && prev > 1) {
                        playBeep(isWorkPhase ? 800 : 600, 80);
                    }

                    return prev - 1;
                });
            }
        }, 1000);

        return () => clearTimer();
    }, [status, isPreparing, isWorkPhase, currentRound, rounds, workSeconds, restSeconds, preparationSeconds, clearTimer, playBeep, playPhaseChangeSound, playPrepBeep]);

    // Update timeLeft when work/rest seconds change in idle state
    useEffect(() => {
        if (status === 'idle') {
            setTimeLeft(workSeconds);
        }
    }, [workSeconds, status]);

    // Update prepTimeLeft when preparation seconds change in idle state
    useEffect(() => {
        if (status === 'idle') {
            setPrepTimeLeft(preparationSeconds);
        }
    }, [preparationSeconds, status]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimer();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [clearTimer]);

    // Calculate progress percentage
    const getProgress = useCallback((): number => {
        if (isPreparing) {
            return ((preparationSeconds - prepTimeLeft) / preparationSeconds) * 100;
        }
        const total = isWorkPhase ? workSeconds : restSeconds;
        return ((total - timeLeft) / total) * 100;
    }, [isPreparing, prepTimeLeft, preparationSeconds, isWorkPhase, timeLeft, workSeconds, restSeconds]);

    // Get phase color
    const getPhaseColor = useCallback((): string => {
        if (isPreparing) return 'bg-yellow-500';
        return isWorkPhase ? 'bg-red-500' : 'bg-green-500';
    }, [isPreparing, isWorkPhase]);

    return (
        <div className={cn(
            "w-full max-w-md bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden",
            className
        )}>
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-indigo-600" />
                    Tabata Timer
                </h1>
                <p className="text-sm text-zinc-600 mt-1">High-intensity interval training</p>
            </div>

            <div className="p-6 space-y-8">
                {/* Timer Display */}
                <div className="relative">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-300", getPhaseColor())}
                            style={{ width: `${getProgress()}%` }}
                        />
                    </div>

                    {/* Timer Circle */}
                    <div className="pt-6 text-center">
                        {isPreparing ? (
                            <>
                                <div className="text-sm font-medium text-yellow-600 mb-2 animate-pulse">
                                    Get Ready!
                                </div>
                                <div className="text-7xl font-bold text-zinc-900 font-mono tracking-wider">
                                    {prepTimeLeft}
                                </div>
                                <div className="text-sm text-zinc-500 mt-2">Preparation</div>
                            </>
                        ) : (
                            <>
                                <div className={cn(
                                    "text-sm font-medium mb-2",
                                    isWorkPhase ? "text-red-600" : "text-green-600"
                                )}>
                                    {isWorkPhase ? 'WORK' : 'REST'} • Round {currentRound}/{rounds}
                                </div>
                                <div className="text-7xl font-bold text-zinc-900 font-mono tracking-wider">
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="text-sm text-zinc-500 mt-2">
                                    {isWorkPhase ? 'High Intensity' : 'Recovery'}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={toggleTimer}
                        className={cn(
                            "p-5 rounded-2xl transition-all shadow-lg",
                            status === 'running'
                                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                        )}
                    >
                        {status === 'running' ? (
                            <Pause className="w-8 h-8 text-white" />
                        ) : (
                            <Play className="w-8 h-8 text-white" />
                        )}
                    </button>

                    <button
                        onClick={resetTimer}
                        className="p-5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-2xl transition-all shadow-lg shadow-zinc-200"
                    >
                        <RotateCcw className="w-8 h-8" />
                    </button>
                </div>

                {/* Configuration */}
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <div className="grid grid-cols-3 gap-3">
                        {/* Work Duration */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                Work
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={workSeconds}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) setWorkSeconds(Math.min(60, Math.max(1, val)));
                                }}
                                disabled={status !== 'idle'}
                                className="w-full px-3 py-2 text-center font-mono font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Rest Duration */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" />
                                Rest
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={restSeconds}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) setRestSeconds(Math.min(60, Math.max(1, val)));
                                }}
                                disabled={status !== 'idle'}
                                className="w-full px-3 py-2 text-center font-mono font-bold text-green-600 bg-green-50 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Rounds */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Rounds
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={rounds}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) setRounds(Math.min(20, Math.max(1, val)));
                                }}
                                disabled={status !== 'idle'}
                                className="w-full px-3 py-2 text-center font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Preparation Time */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            Preparation Time (seconds)
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={preparationSeconds}
                            onChange={(e) => setPreparationSeconds(parseInt(e.target.value))}
                            disabled={status !== 'idle'}
                            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                        <div className="text-center text-sm font-medium text-zinc-600">
                            {preparationSeconds} seconds
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                {status === 'completed' && (
                    <div className="text-center text-green-600 font-bold animate-pulse">
                        🎉 Congratulations! Workout Complete! 🎉
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100">
                <p className="text-xs text-zinc-500 text-center">
                    ⚡ 20 seconds work • 10 seconds rest • 8 rounds • 5s preparation
                </p>
            </div>
        </div>
    );
};

export default TabataTimer;