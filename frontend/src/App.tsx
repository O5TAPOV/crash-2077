import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import GameScreen from './components/GameScreen';
import BetControls from "./components/BetControls";
import AuthScreen from "./components/AuthScreen";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"
const socket = io(API_URL);

export default function App() {
    const [gameState, setGameState] = useState('WAITING');
    const [multiplier, setMultiplier] = useState(1.00);
    const [timeRemaining, setTimeRemaining] = useState(10000);

    type Passenger = { username: string; amount: number };
    const [passengers, setPassengers] = useState<Passenger[]>([]);

    type UserData = { username: string; balance: number; }
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);

    const handleUserLogin = (username: string, balance: number) => {
        setCurrentUser({ username, balance });
        socket.emit('auth', username);
    }

    const handlePlaceBet = (amount: number) => {
        socket.emit('placeBet', amount);
    }

    const handleCashout = () => {
        socket.emit('cashout');
    }

    useEffect(() => {
        socket.on('gameStateUpdate', (data) => {
            setGameState(data.status);
            setMultiplier(data.multiplier);
            setTimeRemaining(data.timeRemaining);
            setPassengers(data.players || []);
        });

        socket.on('balanceUpdate', (newBalance: number) => {
            console.log('💰 Отримано новий баланс:', newBalance);
            setCurrentUser(prevUser => prevUser ? { ...prevUser, balance: newBalance } : null);
        });

        return () => {
            socket.off('gameStateUpdate');
            socket.off('balanceUpdate');
        }
    }, []);

    if (!currentUser) {
        return <AuthScreen onLogin={handleUserLogin} />
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center font-mono py-2 sm:py-10 relative overflow-x-hidden">
            <h1 className="text-2xl sm:text-5xl mb-2 sm:mb-8 font-bold text-fuchsia-500 tracking-widest drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] uppercase text-center absolute top-6 left-0 right-0 z-50 sm:static">
                Crash 2077
            </h1>

            <div className="flex-1 w-full max-w-[800px] mx-auto relative sm:flex-none sm:flex sm:flex-col sm:gap-6 sm:px-4">
                <GameScreen
                    gameState={gameState}
                    multiplier={multiplier}
                    timeRemaining={timeRemaining}
                    passengers={passengers}
                />

                <BetControls
                    gameState={gameState}
                    balance={currentUser.balance}
                    onPlaceBet={handlePlaceBet}
                    onCashout={handleCashout}
                />
            </div>
        </div>
    )
}
