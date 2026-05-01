import { useState } from "react";

interface BetControlsProps {
    gameState: string;
    balance: number;
    onPlaceBet: (amount: number) => void;
    onCashout: () => void;
}

export default function BetControls({ gameState, balance, onPlaceBet, onCashout }: BetControlsProps) {
    const [hasBet, setHasBet] = useState(false);
    const [betAmount, setBetAmount] = useState(10);

    const handleAction = () => {
        if (gameState === 'WAITING') {
            onPlaceBet(betAmount);
            setHasBet(true);
        } else if (gameState === 'PLAYING' && hasBet) {
            onCashout();
            setHasBet(false);
        }
    };

    if (gameState === 'CRASHED' && hasBet) {
        setHasBet(false);
    }

    // --- НАШІ ЧИСТІ КЛАСИ ДЛЯ РЕФАКТОРИНГУ ---
    const quickBetBtn = "bg-neutral-800 text-white font-bold rounded-xl flex-1 hover:bg-neutral-700 transition disabled:opacity-50 p-2 sm:p-3 text-xs sm:text-base";
    const mainBtnBase = "w-full py-2 sm:py-6 rounded-2xl text-xl sm:text-2xl font-black uppercase tracking-widest transition-all shadow-lg";

    return (
        <div className="w-full max-w-[800px] p-2 sm:p-6 bg-black/60 backdrop-blur-xl border-t border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col items-center absolute bottom-0 left-0 right-0 z-50 sm:static sm:mt-6 sm:bg-neutral-900 sm:border">

            {/* Баланс - тепер компактний і красивий */}
            <div className="flex justify-between items-center mb-1 sm:mb-6 w-full px-2">
                <div className="text-[10px] sm:text-sm text-neutral-500 font-bold uppercase tracking-widest">Your Balance</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    ${balance.toFixed(2)}
                </div>
            </div>

            {/* Швидкі кнопки (10, 50, 100, MAX) */}
            <div className="grid grid-cols-4 gap-2 w-full mb-3 sm:mb-4">
                {[10, 50, 100].map(val => (
                    <button key={val} onClick={() => setBetAmount(val)} disabled={hasBet} className={quickBetBtn}>
                        {val}$
                    </button>
                ))}
                <button onClick={() => setBetAmount(balance)} disabled={hasBet} className={`${quickBetBtn} text-fuchsia-500`}>
                    MAX
                </button>
            </div>

            {/* Поле вводу ставки */}
            <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                disabled={hasBet}
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl p-1 sm:p-4 text-center text-xl sm:text-2xl font-black text-white mb-3 sm:mb-4 outline-none focus:border-emerald-500 transition disabled:opacity-50"
            />

            {/* ГОЛОВНА КНОПКА (Place Bet / Cashout / Busted) */}
            {gameState === 'WAITING' && (
                <button
                    onClick={handleAction}
                    disabled={hasBet}
                    className={`${mainBtnBase} ${hasBet ? 'bg-neutral-800 text-neutral-500' : 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}
                >
                    {hasBet ? 'Bet Placed' : `Place Bet (${betAmount})`}
                </button>
            )}

            {gameState === 'PLAYING' && (
                <button
                    onClick={handleAction}
                    disabled={!hasBet}
                    className={`${mainBtnBase} ${!hasBet ? 'bg-neutral-800 text-neutral-500' : 'bg-yellow-500 text-neutral-950 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]'}`}
                >
                    {hasBet ? 'CASHOUT' : 'Waiting...'}
                </button>
            )}

            {gameState === 'CRASHED' && (
                <button disabled className={`${mainBtnBase} bg-red-950 text-red-500 border border-red-900`}>
                    Busted
                </button>
            )}
        </div>
    );
}
