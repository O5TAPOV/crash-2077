interface GameScreenProps {
    gameState: string;
    multiplier: number;
    timeRemaining: number;
    passengers: { username: string; amount: number }[];
}

export default function GameScreen({ gameState, multiplier, timeRemaining, passengers }: GameScreenProps) {
    const textColor = gameState === 'CRASHED' ? 'text-red-500' : gameState === 'PLAYING' ? 'text-yellow-400' : 'text-fuchsia-500';
    const displayMult = gameState === 'WAITING' ? 1.00 : multiplier;

    return (
        <div className="w-full sm:max-w-[800px] sm:aspect-[16/10] absolute inset-0 sm:relative rounded-none sm:rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl bg-space">

            {/* Центрований Множник (зверху) */}
            <div className="absolute top-28 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
                {(gameState === 'PLAYING' || gameState === 'CRASHED') && (
                    <div className={`text-7xl font-black tracking-tighter ${textColor} drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]`}>
                        {multiplier.toFixed(2)}x
                    </div>
                )}
                {gameState === 'WAITING' && (
                    <div className="text-center bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                        <p className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Next round in</p>
                        <p className="text-4xl font-mono text-emerald-400">{(timeRemaining / 1000).toFixed(1)}s</p>
                    </div>
                )}
            </div>

            {/* Інші гравці (маленькі ракети) */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {passengers.map((p, index) => {

                    const scale = Math.min(1.5, Math.max(0.8, p.amount / 50));

                    return (
                        <div
                            key={p.username}
                            className="absolute transition-all duration-1000 ease-in-out flex flex-col items-center opacity-80"
                            style={{
                                left: `${index % 2 === 0 ? (index * 5) % 10 + 25 : 65 + (index * 5) % 10}%`,
                                top: gameState === 'WAITING' ? '110%' : `${(index * 15) % 30 + 25}%`,
                                transform: `scale(${scale}) translateY(${Math.sin(multiplier + index) * 25}px) translateX(${Math.cos(multiplier + index) * 15}px)`
                            }}

                        >
                            <div className="text-[10px] text-white/90 mb-1 bg-black/80 px-2 py-1 rounded-lg border border-white/10 flex flex-col items-center leading-tight shadow-xl">
                                <span className="font-bold">{p.username}</span>
                                <span className="text-emerald-400">${(p.amount * displayMult).toFixed(1)}</span>
                            </div>


                            <img src="/rocket.png" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                        </div>
                    );
                })}
            </div>

            {/* ГОЛОВНА РАКЕТА */}
            {gameState === 'PLAYING' && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 animate-shake flex flex-col items-center transition-all duration-500 z-30"
                    style={{
                        bottom: '32%',
                        animationDuration: `${Math.max(0.05, 0.4 / multiplier)}s`
                    }}
                >
                    <img src="/rocket.png" className="w-44 h-44 object-contain drop-shadow-[0_0_40px_rgba(34,211,238,0.5)]" />
                    <div className="text-5xl animate-pulse -mt-6 rotate-180 drop-shadow-[0_0_15px_rgba(255,165,0,0.9)]">🔥</div>
                </div>
            )}

            {/* Ефект Крашу */}
            {gameState === 'CRASHED' && (
                <div className="animate-pulse absolute inset-0 bg-red-600/20 pointer-events-none">
                    <div className="absolute inset-0 flex items-center justify-center bg-red-950/20 backdrop-blur-[2px] z-40">
                        <div className="text-9xl animate-ping opacity-80">💥</div>
                    </div>
                </div>
            )}
        </div>
    );
}