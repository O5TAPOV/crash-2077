import { useState } from "react";

interface BetControlsProps {
    gameState: string;
    balance: number;
}

export default function BetControls({ gameState, balance }: BetControlsProps) {
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
            <div className="flex justify-between items-center mb-6 w-full px-2">
                <div className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Your Balance</div>
                <div className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    ${balance.toFixed(2)}
                </div>
            </div>

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