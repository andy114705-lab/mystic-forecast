import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-light text-gold-400 mb-3 tracking-wider">玄机</h1>
        <p className="text-white/30 text-sm tracking-[0.3em] uppercase">XUAN JI</p>
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        <Link to="/bazi" className="glow-card w-72 p-8 text-center group cursor-pointer no-underline">
          <div className="text-5xl mb-4">☰</div>
          <h2 className="text-xl text-white/90 mb-2 group-hover:text-gold-400 transition-colors">八字命盘</h2>
          <p className="text-white/40 text-sm">输入生辰 · 解读命运走向</p>
        </Link>

        <Link to="/liuyao" className="glow-card w-72 p-8 text-center group cursor-pointer no-underline">
          <div className="text-5xl mb-4">☯</div>
          <h2 className="text-xl text-white/90 mb-2 group-hover:text-gold-400 transition-colors">六爻占卜</h2>
          <p className="text-white/40 text-sm">起卦问事 · 一事一断</p>
        </Link>
      </div>

      <div className="mt-20 text-center">
        <p className="text-xs text-white/15">
          Powered by lunar-javascript · DeepSeek · 旺衰派
        </p>
      </div>
    </div>
  );
}
