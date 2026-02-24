export type ArcanaType = 'Major' | 'Minor';

export interface TarotCard {
    id: string;
    name: string;
    arcana: ArcanaType;
    meaningUpright: string;
    meaningReversed: string;
    imageUrl: string;
    description: string;
}

export interface ReadingResult {
    card: TarotCard;
    position: 'upright' | 'reversed';
    interpretation: string;
}

export interface Spread {
    name: string;
    description: string;
    cardsCount: number;
}