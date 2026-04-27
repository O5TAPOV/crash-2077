import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import { time } from 'console';
import { stat } from 'fs';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

type GameState = 'WAITING' | 'PLAYING' | 'CRASHED';
let currentGameState: GameState = 'WAITING';
let multiplier: number = 1.00;
let crashPoint: number = 0;
let timerMs: number = 10000;

io.on('connection', (socket) => {
    console.log(`🟢 Гравець підключився: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`🔴 Гравець відключився: ${socket.id}`);
    });
});

function startGameLoop() {
    setInterval(() => {
        switch(currentGameState) {
            case 'WAITING':
                if(timerMs <= 0)
                {
                    currentGameState = 'PLAYING';
                    multiplier = 1.00;
                    crashPoint = Number((Math.random() * 9 + 1).toFixed(2));
                    console.log(`🚀 Старт! Ракета вибухне на ${crashPoint}x`);
                }      
                timerMs -= 100;
                break;
            case 'PLAYING':
                multiplier = Number((multiplier + 0.05).toFixed(2))
                if(multiplier >= crashPoint)
                {
                    currentGameState = 'CRASHED';
                    timerMs = 5000;
                    console.log(`💥 Бум! Ракета впала на ${multiplier}x`);
                }
                break;
            case 'CRASHED':
                timerMs -= 100;
                if(timerMs <= 0)
                {
                    currentGameState = 'WAITING';
                    timerMs = 10000;
                    console.log('⏳ Почався новий раунд, чекаємо ставки...');
                }
                break;
        }

        io.emit('gameStateUpdate', {
            status: currentGameState,
            multiplier: multiplier,
            timeRemaining: timerMs
        })
    }, 100);
}

const PORT = process.env.PORT || 3001;
startGameLoop();
server.listen(PORT, () => {
    console.log(`🚀 Crash Server is running on http://localhost:${PORT}`);
})