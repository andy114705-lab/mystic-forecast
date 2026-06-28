import { Routes, Route, Link, useLocation } from 'react-router-dom';
import PasswordGate from './components/PasswordGate.jsx';
import Home from './pages/Home.jsx';
import BaziInput from './pages/BaziInput.jsx';
import BaziResult from './pages/BaziResult.jsx';
import LiuyaoInput from './pages/LiuyaoInput.jsx';
import LiuyaoResult from './pages/LiuyaoResult.jsx';

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/' && !location.hash.replace('#/', '');

  return (
    <PasswordGate>
      <div className="min-h-screen relative z-10">
        {!isHome && (
          <header className="flex items-center justify-between px-6 py-4 border-b border-purple-400/10">
            <Link to="/" className="text-lg font-semibold text-gold-400 hover:text-gold-500 transition-colors">
              ☯ 玄机
            </Link>
          </header>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bazi" element={<BaziInput />} />
          <Route path="/bazi/result" element={<BaziResult />} />
          <Route path="/liuyao" element={<LiuyaoInput />} />
          <Route path="/liuyao/result" element={<LiuyaoResult />} />
        </Routes>
      </div>
    </PasswordGate>
  );
}
