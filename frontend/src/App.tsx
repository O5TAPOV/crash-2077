import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import GameScreen from './components/GameScreen';
import BetControls from "./components/BetControls";
import AuthScreen from "./components/AuthScreen";

const API_URL = "http://localhost:3001"

const socket = io(API_URL);

export default function App() {
    const [gameState, setGameState] = useState('WAITING');
    const [multiplier, setMultiplier] = useState(1.00);
    const [timeRemaining, setTimeRemaining] = useState(10000);

    type UserData = { username: string; balance: number; }
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);

    const handleUserLogin = (username: string, balance: number) => {
        setCurrentUser({ username, balance });
        socket.emit('auth', username);
    }

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

    if (!currentUser) {
        return <AuthScreen onLogin={handleUserLogin} />
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center font-mono">
            <h1 className="text-5xl font-bold text-fuchsia-500 tracking-widest drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] uppercase">
                Crash 2077
            </h1>
            <GameScreen gameState={gameState} multiplier={multiplier} timeRemaining={timeRemaining} />
            <BetControls gameState={gameState} balance={currentUser.balance} />
        </div>
    )
}
