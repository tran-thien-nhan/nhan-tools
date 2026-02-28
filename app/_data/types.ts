// types.ts
export interface MealSuggestion {
    name: string;
    description: string;
    ingredients: string[];
    estimatedCost: number;
    cookingTime: number; // phút
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    steps: string[];
    tips?: string[];
}

export interface MealSuggestionResponse {
    suggestions: MealSuggestion[];
    message?: string;
}