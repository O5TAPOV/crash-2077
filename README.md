# 🚀 Crash 2077 | Real-Time Multiplayer iGaming Experience

![Status](https://img.shields.io/badge/Status-Live-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Node.js_|_Socket.io-fuchsia?style=for-the-badge)

**Crash 2077** — це високотехнологічна мультиплеєрна гра, створена для нового покоління iGaming. Відчуй азарт зростаючого множника, роби ставки та встигни вистрибнути до того, як станеться краш!

🔗 **[LIVE DEMO HERE](https://crash-2077.vercel.app/)** | 📂 **[GITHUB REPO](https://github.com/O5TAPOV/crash-2077)**

---

## ✨ Основні фішки

- 🌐 **Real-Time Multiplayer:** Працює на **Socket.io**. Синхронізація станів гри між усіма клієнтами з затримкою менше 100мс.
- 📱 **Mobile-First UX:** Інтерфейс у стилі "Glassmorphism", повністю адаптований під мобільні пристрої (Zero-scroll architecture).
- 🚀 **Squad Visualization:** Бач ракети інших гравців, що злітають і летять поруч з тобою в реальному часі.
- ⚡ **Dynamic Game Loop:** Автоматизований ігровий цикл на стороні сервера (Waiting -> Playing -> Crashed).
- 💎 **Cyberpunk Aesthetics:** Використання сучасних CSS-ефектів: backdrop-blur, неонове сяйво та плавні мікро-анімації.

---

## 🛠 Технологічний стек

| Frontend | Backend | DevOps |
| :--- | :--- | :--- |
| **React 19** | **Node.js** | **Render** (Backend/WebSockets) |
| **TailwindCSS 4** | **Express** | **Vercel** (Frontend Hosting) |
| **Vite** | **Socket.io** | **TypeScript** |

---

## 🏗 Архітектура проєкту

Проєкт реалізований як монорепозиторій:

- **/frontend**: React-застосунок з кастомною системою оверлеїв та стейт-менеджментом ігрових фаз.
- **/backend**: Node.js сервер, що керує ігровою логікою, розрахунком множників та авторизацією сокетів.

### Ігровий цикл (The Engine)
Сервер підтримує машину станів (State Machine), яка кожні 100мс розраховує новий множник та транслює його всім підключеним гравцям. Розрахунок виграшів відбувається миттєво на стороні сервера для безпеки даних.