import { useState } from 'react';
import { GATE_PASSWORD } from '../config.js';

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('gate_ok') === '1');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === GATE_PASSWORD) {
      sessionStorage.setItem('gate_ok', '1');
      setAuthed(true);
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 1500);
    }
  };

  if (authed) return children;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-6">
        <div className="text-7xl mb-4 animate-pulse">☯</div>
        <h1 className="text-3xl font-light text-gold-400 tracking-wider">玄机</h1>
        <p className="text-white/20 text-xs tracking-[0.3em] uppercase">XUAN JI</p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-3">
          <input
            type="password"
            placeholder="输入访问密码"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            className={`glow-input text-center text-lg tracking-[0.3em] w-48 ${error ? 'border-red-500 animate-shake' : ''}`}
            autoFocus
          />
          {error && <p className="text-red-400 text-xs animate-fade-in">密码错误</p>}
          <button type="submit" className="glow-btn w-48 mt-2">
            进入
          </button>
        </form>
      </div>
    </div>
  );
}
