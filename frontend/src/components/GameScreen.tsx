interface GameScreenProps {
    gameState: string;
    multiplier: number;
    timeRemaining: number;
}

export default function GameScreen({ gameState, multiplier, timeRemaining }: GameScreenProps) {
    const textColor =
        gameState === 'CRASHED' ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' :
            gameState === 'PLAYING' ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]' :
                'text-fuchsia-500';

    return (
        <div className="w-[600px] h-[400px] bg-neutral-900 rounded-3xl border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            {/* Показуємо Множник тільки якщо летимо або впали */}

            {(gameState === 'PLAYING' || gameState === 'CRASHED') && (
                <div className={`text-8xl font-black tracking-tighter ${textColor}`}>
                    {multiplier.toFixed(2)}x
                </div>
            )}
            {/* Якщо Ракета впала - додаємо напис BUSTED */}
            {gameState === 'CRASHED' && (
                <div className="absolute top-1/4 text-red-500 font-bold text-2xl tracking-[0.5em] animate-pulse">
                    CRASHED
                </div>
            )}
            {/* Таймер показуємо тільки якщо чекаємо */}
            {gameState === 'WAITING' && (
                <div className="text-center">
                    <p className="text-neutral-400 text-xl mb-2 uppercase tracking-widest">Next round in</p>
                    <p className="text-5xl font-mono text-emerald-400">
                        {(timeRemaining / 1000).toFixed(1)}s
                    </p>
                </div>
            )}
        </div>
    )
}