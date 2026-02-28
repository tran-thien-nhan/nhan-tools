// app/api/gemini/meal-suggestions/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { model } from '@/app/_data/model';
import { meal_system_prompt, meal_user_prompt } from '@/app/_data/prompt';

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

export async function POST(request: Request) {
    try {
        const { budget, days, dietType, ingredients } = await request.json();

        const response = await genAI.models.generateContent({
            model: model,
            contents: meal_user_prompt(budget, days, dietType, ingredients),
            config: {
                systemInstruction: meal_system_prompt,
                temperature: 0.7,
                maxOutputTokens: 8192, // Tăng lên vì output dài hơn
            }
        });

        if (!response.text) {
            throw new Error('Không nhận được phản hồi từ Gemini');
        }

        return NextResponse.json({
            success: true,
            suggestion: response.text
        });

    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Có lỗi xảy ra khi gợi ý: ' + (error instanceof Error ? error.message : 'Unknown error')
            },
            { status: 500 }
        );
    }
}