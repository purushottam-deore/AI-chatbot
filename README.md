# Gemini AI Streaming Chatbot

A full-stack AI chatbot application featuring real-time response streaming, persistent conversation history, and a modern React interface.

## 🚀 Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **LLM:** Google Gemini 1.5/2.0 Flash API
- **State Management:** React Hooks (useState, useEffect, useRef)
- **Data Persistence:** Browser LocalStorage

## ✨ Features Implemented
- [x] **Real-time Streaming:** Server-Sent Events (SSE) for word-by-word AI responses.
- [x] **LLM Integration:** Seamless connection to Google Gemini API.
- [x] **Message History:** Persistent sidebar using LocalStorage.
- [x] **Timestamps:** Every message displays the exact time sent.
- [x] **UI/UX States:** - Loading indicators (Pulsing "AI is typing").
    - Input disabling during active streams.
    - Connection status indicators.
    - Error handling for failed API requests.
- [x] **Session Management:** "Clear Screen" for new chats vs "Clear History" for database wiping.

## 🛠 Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key (get it at [aistudio.google.com](https://aistudio.google.com))

### 2. Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your key: `GEMINI_API_KEY=YOUR_KEY_HERE`
4. Start the server: `node index.js`

### 3. Frontend Setup
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the React app: `npm run dev`

## 📦 Environment Variables
Required variables in `server/.env`:
- `GEMINI_API_KEY`: Your Google AI Studio API key.
- `PORT`: (Optional) Defaults to 5000.

## ⏱ Time Spent
- **Backend Setup & API Integration:** 2 hours
- **Streaming & SSE Logic:** 3 hours
- **Frontend UI & State Management:** 3 hours
- **Persistence & History Logic:** 2 hours
- **Total:** ~10 hours

## 🎥 Demo Video
[Link to your Loom/Google Drive/YouTube video here]