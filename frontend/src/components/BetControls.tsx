import { useState } from "react";

interface BetControlsProps {
    gameState: string;
}

export default function BetControls({ gameState }: BetControlsProps) {
    const [hasBet, setHasBet] = useState(false);

    const handleAction = () => {
        if (gameState === 'WAITING') {
            setHasBet(true);
        }
        else if (gameState === 'PLAYING' && hasBet) {
            setHasBet(false);
        }
    };

    if (gameState === 'CRASHED' && hasBet) {
        setHasBet(false);
    }

    return (
        <div className="w-[600px] mt-6 p-6 bg-neutral-900 rounded-3xl border border-neutral-800 shadow-xl flex justify-center">

            {gameState === 'WAITING' && (
                <button
                    onClick={handleAction}
                    disabled={hasBet}
                    className={`w-full py-6 rounded-2xl text-2xl font-black uppercase tracking-widest transition-all ${hasBet
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                        }`}
                >
                    {hasBet ? 'Bet Placed' : 'Place Bet (10$)'}
                </button>
            )}
            {gameState === 'PLAYING' && (
                <button
                    onClick={handleAction}
                    disabled={!hasBet}
                    className={`w-full py-6 rounded-2xl text-2xl font-black uppercase tracking-widest transition-all ${!hasBet
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-yellow-500 text-neutral-950 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]'
                        }`}
                >
                    {hasBet ? 'CASHOUT' : 'Waiting...'}
                </button>
            )}
            {gameState === 'CRASHED' && (
                <button
                    disabled
                    className="w-full py-6 rounded-2xl text-2xl font-black uppercase tracking-widest bg-red-950 text-red-500 border border-red-900 cursor-not-allowed"
                >
                    Busted
                </button>
            )}
        </div>
    );
}