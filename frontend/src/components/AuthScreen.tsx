import { useState } from "react";
import { API_URL } from "../config";

interface AuthScreenProps {
    onLogin: (username: string, balance: number) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (name.trim() === '') return;

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: name })
            });

            const data = await response.json();

            onLogin(data.username, data.balance);
        } catch (error) {
            console.error("Помилка входу:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center font-mono">
            <div className="w-[400px] p-8 bg-neutral-900 rounded-3xl border border-neutral-800 shadow-[0_0_50px_rgba(170,59,255,0.1)] flex flex-col gap-6">

                <h1 className="text-4xl font-bold text-center text-fuchsia-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                    Login
                </h1>
                <input
                    type="text"
                    placeholder="ENTER NICKNAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-4 text-emerald-400 text-xl focus:outline-none focus:border-fuchsia-500 transition-colors text-center uppercase"
                />
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-xl py-4 rounded-xl uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] disabled:opacity-50"
                >
                    {isLoading ? "Connecting..." : "Play Now"}
                </button>
            </div>
        </div>
    );
}