import React from 'react'
import FlappyBirdGame from '../_components/FlappyBirdGaame'

// Game Flappy Bird
export const metadata = {
    title: 'Game Flappy Bird - Trò chơi giải trí',
    description: 'Chơi game Flappy Bird trực tiếp trên trình duyệt để giải trí',
};
const page = () => {
    return (
        <div>
            <FlappyBirdGame />
        </div>
    )
}

export default page
