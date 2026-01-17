import { useState, useEffect, useRef } from 'react';

export default function App() {
  // --- 1. STATES ---
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChat, setCurrentChat] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // --- 2. HELPERS ---
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [currentChat]);

  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // --- 3. ACTIONS ---
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const timeStamp = getTime();
    const userMsg = { role: 'user', content: input, time: timeStamp };

    setCurrentChat(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const aiMsg = { role: 'ai', content: '', time: timeStamp };
    setCurrentChat(prev => [...prev, aiMsg]);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let fullAiText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullAiText += chunk;

        setCurrentChat(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = fullAiText;
          return updated;
        });
      }

      // Save complete  history
      const finalAiMsg = { role: 'ai', content: fullAiText, time: timeStamp };
      setHistory(prev => {
        const updated = [...prev, userMsg, finalAiMsg];
        localStorage.setItem('chat_history', JSON.stringify(updated));
        return updated;
      });

    } catch (err) {
      console.error("Stream error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const deleteHistory = () => {
    if (window.confirm("This will permanently delete ALL saved history. Continue?")) {
      setHistory([]);
      localStorage.removeItem('chat_history');
      setCurrentChat([]); 
    }
  };

  const loadHistoryItem = (index) => {
    
    setCurrentChat([history[index], history[index + 1]]);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      
      {/* SIDEBAR */}
      <div className="w-72 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-700 font-bold text-indigo-400 flex justify-between items-center">
          <span>Past Conversations</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {history.length === 0 ? (
            <p className="text-slate-500 text-xs p-4 italic">No history saved yet.</p>
          ) : (
            history.map((m, i) => m.role === 'user' && (
              <button
                key={i}
                onClick={() => loadHistoryItem(i)}
                className="w-full text-left p-3 rounded bg-slate-800 hover:bg-slate-700 transition group"
              >
                <p className="text-[10px] text-slate-500 uppercase group-hover:text-indigo-300">{m.time}</p>
                <p className="text-sm truncate">{m.content}</p>
              </button>
            ))
          )}
        </div>

        {/* CLEAR HISTORY BUTTON */}
        <div className="p-4 border-t border-slate-700 bg-slate-950">
          <button
            onClick={deleteHistory}
            className="w-full py-2 rounded border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
          >
            Clear All History
          </button>
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
          <h1 className="font-bold text-slate-700 text-xl">Gemini Chat</h1>
          <button onClick={() => setCurrentChat([])} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition">
            NEW CHAT
          </button>
        </header>

        <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
          {currentChat.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border text-slate-800 rounded-bl-none'
                }`}>
                <p className="text-sm md:text-base whitespace-pre-wrap">{m.content}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                {m.time}
              </span>
            </div>
          ))}
          {isTyping && <div className="text-xs text-indigo-500 animate-pulse font-bold">AI IS TYPING...</div>}
        </main>

        <footer className="p-4 bg-white border-t">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-3">
            <input
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button disabled={isTyping || !input.trim()} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-lg">
              SEND
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}