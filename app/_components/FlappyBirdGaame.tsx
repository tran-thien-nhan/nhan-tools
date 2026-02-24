/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants ---
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_X = 50;
const BIRD_SIZE = 34;
const GRAVITY = 0.4;
const JUMP_STRENGTH = -7;
const PIPE_WIDTH = 60;
const PIPE_GAP = 160;
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 100; // frames

type GameState = 'START' | 'PLAYING' | 'GAME_OVER';

interface Pipe {
    x: number;
    topHeight: number;
    passed: boolean;
}

export default function FlappyBirdGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState>('START');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('flappy-high-score');
            return saved ? parseInt(saved, 10) : 0;
        }
        return 0;
    });

    // Game state refs (to avoid closure issues in the loop)
    const birdY = useRef(CANVAS_HEIGHT / 2);
    const birdVelocity = useRef(0);
    const pipes = useRef<Pipe[]>([]);
    const frameCount = useRef(0);
    const requestRef = useRef<number>(null);

    const resetGame = useCallback(() => {
        birdY.current = CANVAS_HEIGHT / 2;
        birdVelocity.current = 0;
        pipes.current = [];
        frameCount.current = 0;
        setScore(0);
        setGameState('PLAYING');
    }, []);

    const jump = useCallback(() => {
        if (gameState === 'PLAYING') {
            birdVelocity.current = JUMP_STRENGTH;
        } else if (gameState === 'START' || gameState === 'GAME_OVER') {
            resetGame();
        }
    }, [gameState, resetGame]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

    const update = () => {
        if (gameState !== 'PLAYING') return;

        // Bird physics
        birdVelocity.current += GRAVITY;
        birdY.current += birdVelocity.current;

        // Collision with ground or ceiling
        if (birdY.current + BIRD_SIZE / 2 > CANVAS_HEIGHT || birdY.current - BIRD_SIZE / 2 < 0) {
            setGameState('GAME_OVER');
        }

        // Pipes logic
        frameCount.current++;
        if (frameCount.current % PIPE_SPAWN_RATE === 0) {
            const minPipeHeight = 50;
            const maxPipeHeight = CANVAS_HEIGHT - PIPE_GAP - minPipeHeight;
            const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
            pipes.current.push({ x: CANVAS_WIDTH, topHeight, passed: false });
        }

        pipes.current.forEach((pipe, index) => {
            pipe.x -= PIPE_SPEED;

            // Collision detection
            const birdLeft = BIRD_X - BIRD_SIZE / 2 + 5;
            const birdRight = BIRD_X + BIRD_SIZE / 2 - 5;
            const birdTop = birdY.current - BIRD_SIZE / 2 + 5;
            const birdBottom = birdY.current + BIRD_SIZE / 2 - 5;

            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + PIPE_WIDTH;

            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
                    setGameState('GAME_OVER');
                }
            }

            // Scoring
            if (!pipe.passed && birdLeft > pipeRight) {
                pipe.passed = true;
                setScore((s) => s + 1);
            }
        });

        // Remove off-screen pipes
        if (pipes.current.length > 0 && pipes.current[0].x + PIPE_WIDTH < 0) {
            pipes.current.shift();
        }
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
        // Background
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Pipes
        ctx.fillStyle = '#2e8b57';
        pipes.current.forEach((pipe) => {
            // Top pipe
            ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
            ctx.strokeStyle = '#1a5235';
            ctx.lineWidth = 4;
            ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

            // Bottom pipe
            const bottomY = pipe.topHeight + PIPE_GAP;
            ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, CANVAS_HEIGHT - bottomY);
            ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, CANVAS_HEIGHT - bottomY);
        });

        // Draw Bird
        ctx.save();
        ctx.translate(BIRD_X, birdY.current);
        const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdVelocity.current * 0.1));
        ctx.rotate(rotation);

        // Bird Body
        ctx.fillStyle = '#f7e61c';
        ctx.beginPath();
        ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(10, -5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(12, -5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Wing
        ctx.fillStyle = '#f7b51c';
        ctx.beginPath();
        ctx.ellipse(-10, 5, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    };

    const loop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        update();
        draw(ctx);

        requestRef.current = requestAnimationFrame(loop);
    }, [gameState]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(loop);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [loop]);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('flappy-high-score', score.toString());
        }
    }, [score, highScore]);

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans text-white overflow-hidden">
            <div className="relative group">
                {/* Game Canvas */}
                <div className="rounded-2xl overflow-hidden border-4 border-zinc-800 shadow-2xl bg-zinc-900">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onClick={jump}
                        className="cursor-pointer block"
                    />
                </div>

                {/* UI Overlay */}
                <AnimatePresence>
                    {gameState === 'START' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl"
                        >
                            <motion.h1
                                className="text-6xl font-black mb-8 tracking-tighter text-yellow-400 drop-shadow-lg"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                                FLAPPY BIRD
                            </motion.h1>
                            <button
                                onClick={resetGame}
                                className="group flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-full font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl"
                            >
                                <Play className="fill-current" size={24} />
                                START GAME
                            </button>
                            <p className="mt-6 text-zinc-300 font-medium text-sm animate-pulse">PRESS SPACE OR CLICK TO JUMP</p>
                        </motion.div>
                    )}

                    {gameState === 'GAME_OVER' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl"
                        >
                            <h2 className="text-5xl font-black mb-2 text-red-500">GAME OVER</h2>
                            <div className="bg-zinc-900/80 p-8 rounded-3xl border border-zinc-700 shadow-2xl mb-8 flex flex-col items-center min-w-[240px]">
                                <div className="flex flex-col items-center mb-6">
                                    <span className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-1">Current Score</span>
                                    <span className="text-6xl font-black text-white">{score}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                                        <Trophy size={16} />
                                        <span className="text-xs uppercase tracking-widest font-bold">Best Score</span>
                                    </div>
                                    <span className="text-3xl font-bold text-white">{highScore}</span>
                                </div>
                            </div>
                            <button
                                onClick={resetGame}
                                className="flex items-center gap-3 bg-white hover:bg-zinc-200 text-black px-10 py-4 rounded-full font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl"
                            >
                                <RotateCcw size={24} />
                                TRY AGAIN
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* In-game Score */}
                {gameState === 'PLAYING' && (
                    <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none">
                        <motion.span
                            key={score}
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-7xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                        >
                            {score}
                        </motion.span>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-8 flex gap-8 text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">
                <div className="flex flex-col items-center gap-1">
                    <span className="opacity-50">Controls</span>
                    <span className="text-zinc-300">Space / Click</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="opacity-50">High Score</span>
                    <span className="text-zinc-300">{highScore}</span>
                </div>
            </div>
        </div>
    );
}
