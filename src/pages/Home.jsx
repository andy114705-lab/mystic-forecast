import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center mb-16">
        <h1 
          className="text-7xl font-normal mb-4 tracking-[0.15em]"
          style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", color: '#c9a55c' }}
        >
          玄机
        </h1>
        <p className="text-white/10 text-xs tracking-[0.5em] uppercase mt-2">XUAN JI</p>
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        <Link to="/bazi" className="card w-80 p-10 text-center group cursor-pointer no-underline hover:border-cinnabar-500/20 transition-colors duration-300">
          <div className="text-6xl mb-6" style={{ color: '#c43a31', opacity: 0.5 }}>☰</div>
          <h2 className="text-lg mb-3 tracking-[0.05em] text-white/80 group-hover:text-gold-400 transition-colors"
            style={{ fontFamily: "Georgia, 'Noto Serif SC', serif" }}>
            八字命盘
          </h2>
          <p className="text-white/25 text-sm leading-relaxed">输入生辰 · 四柱排盘 · 十神大运</p>
        </Link>

        <Link to="/liuyao" className="card w-80 p-10 text-center group cursor-pointer no-underline hover:border-cinnabar-500/20 transition-colors duration-300">
          <div className="text-6xl mb-6" style={{ color: '#c43a31', opacity: 0.5 }}>☯</div>
          <h2 className="text-lg mb-3 tracking-[0.05em] text-white/80 group-hover:text-gold-400 transition-colors"
            style={{ fontFamily: "Georgia, 'Noto Serif SC', serif" }}>
            六爻占卜
          </h2>
          <p className="text-white/25 text-sm leading-relaxed">起卦问事 · 一事一断</p>
        </Link>
      </div>

      <div className="mt-24 text-center">
        <hr className="border-white/[0.04] w-32 mx-auto mb-4" />
        <p className="text-[11px] tracking-[0.08em] text-white/10">
          lunar-javascript · DeepSeek · 四维交叉验证
        </p>
      </div>
    </div>
  );
}
