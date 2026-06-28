import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, createContext, useContext, useEffect } from 'react';
import Home from './pages/Home.jsx';
import BaziInput from './pages/BaziInput.jsx';
import BaziResult from './pages/BaziResult.jsx';
import LiuyaoInput from './pages/LiuyaoInput.jsx';
import LiuyaoResult from './pages/LiuyaoResult.jsx';

export const KeyContext = createContext();
export const useKey = () => useContext(KeyContext);

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ds_key') || '');
  const location = useLocation();

  useEffect(() => {
    if (apiKey) localStorage.setItem('ds_key', apiKey);
  }, [apiKey]);

  const isHome = location.pathname === '/' && !location.hash.replace('#/', '');

  return (
    <KeyContext.Provider value={{ apiKey, setApiKey }}>
      <div className="min-h-screen relative z-10">
        {/* Header */}
        {!isHome && (
          <header className="flex items-center justify-between px-6 py-4 border-b border-purple-400/10">
            <Link to="/" className="text-lg font-semibold text-gold-400 hover:text-gold-500 transition-colors">
              ☯ 玄机
            </Link>
            <div className="flex items-center gap-4">
              <input
                type="password"
                placeholder="DeepSeek API Key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="glow-input text-sm w-48 py-1.5"
              />
              <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]' : 'bg-red-500/50'}`} />
            </div>
          </header>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bazi" element={<BaziInput />} />
          <Route path="/bazi/result" element={<BaziResult />} />
          <Route path="/liuyao" element={<LiuyaoInput />} />
          <Route path="/liuyao/result" element={<LiuyaoResult />} />
        </Routes>
      </div>
    </KeyContext.Provider>
  );
}
