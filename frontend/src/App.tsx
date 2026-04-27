import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import GameScreen from './components/GameScreen';
import BetControls from "./components/BetControls";

const API_URL = "http://localhost:3001"

const socket = io(API_URL);

export default function App() {
    const [gameState, setGameState] = useState('WAITING');
    const [multiplier, setMultiplier] = useState(1.00);
    const [timeRemaining, setTimeRemaining] = useState(10000);

    useEffect(() => {
        socket.on('gameStateUpdate', (data) => {
            setGameState(data.status);
            setMultiplier(data.multiplier);
            setTimeRemaining(data.timeRemaining);
        });

        return () => {
            socket.off('gameStateUpdate');
        }
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center font-mono">
            <h1 className="text-5xl font-bold text-fuchsia-500 tracking-widest drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] uppercase">
                Crash 2077
            </h1>
            {GameScreen({ gameState, multiplier, timeRemaining })}
            {BetControls({ gameState })}
        </div>
    )
}
