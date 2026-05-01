import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import { Request, Response } from 'express';

const app = express();
app.use(cors());
app.use(express.json());

type User = {
    username: string;
    balance: number;
}

const users: User[] = [];

const currentBets = new Map<string, number>();

const server = http.createServer(app);

app.post('/register', (req: Request, res : Response) => {
    const {username} = req.body;
    const user = users.find(u => u.username === username);
    
    if(user)
        return res.json(user);

    const newUser = {username, balance: 1000};
    users.push(newUser);
    res.json(newUser);
})

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

    socket.on('auth', (username: string) => {
        if(users.find(u => u.username === username)) {
            (socket as any).username = username;
            console.log(`🔗 Сокет ${socket.id} авторизовано як ${username}`);
        }
        else { socket.emit('error', 'Користувача не знайдено'); }
    })

    socket.on('placeBet', (amount: number) => {
        const username = (socket as any).username;
        const user = users.find(u => u.username === username);

        if(!user) {
            socket.emit('error', 'Не авторизовано');
            return;
        }

        if(currentGameState !== 'WAITING') {
            socket.emit('error', 'Ставки приймаються тільки до старту!');
            return;
        }
         
        if(user.balance >= amount) {
            user.balance -= amount;
            currentBets.set(username, amount);
            socket.emit('balanceUpdate', user.balance);
            console.log(`Ставка в розмірі ${amount} від ${user.username} прийнята!`);
        }
        else { socket.emit('error', 'Недостатньо коштів'); }
    })

    socket.on('cashout', () => {
        const username = (socket as any).username;
        const user = users.find(u => u.username === username);

        if(!user) {
            socket.emit('error', 'Не авторизовано');
            return;
        }

        if(currentGameState !== 'PLAYING') {
            socket.emit('error', 'Забрати кошти можна тільки під час польоту ракети');
            return;
        }

        if(!currentBets.has(username)) {
            socket.emit('error', "Ви не робили ставку");
            return;
        }

        const betAmount = currentBets.get(username) || 0;
        const winAmount = betAmount * multiplier;
        user.balance += winAmount;

        currentBets.delete(username);
        socket.emit('balanceUpdate', user.balance);

        console.log(`Вітаємо гравця ${username}. Його куш: ${winAmount}`);
    })

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
                multiplier = Number((multiplier * 1.02).toFixed(2))
                if(multiplier >= crashPoint)
                {
                    currentGameState = 'CRASHED';
                    currentBets.forEach((amount, username) => {
                        console.log(`💀 Гравець ${username} зажадібнів і втратив ${amount}$!`);
                    });
                    currentBets.clear();
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
            timeRemaining: timerMs,
            players: Array.from(currentBets.entries()).map(([username, amount]) => ({username, amount}))
        })
    }, 100);
}

const PORT = process.env.PORT || 3001;
startGameLoop();
server.listen(PORT, () => {
    console.log(`🚀 Crash Server is running on http://localhost:${PORT}`);
})