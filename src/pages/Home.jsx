import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Seal + Title */}
      <div className="text-center mb-16">
        <div 
          className="inline-flex items-center justify-center mb-5"
          style={{
            width: 56, height: 56,
            border: '2px solid #c43a31',
            fontFamily: "Georgia, 'Noto Serif SC', serif",
            fontSize: 28, fontWeight: 'bold',
            color: '#c43a31',
            background: '#fffdf7',
          }}
        >
          玄
        </div>
        <h1 
          className="text-5xl font-bold mb-2 tracking-[0.25em]"
          style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", color: '#2c2416' }}
        >
          玄 机
        </h1>
        <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#8b7355', fontFamily: 'Georgia, serif' }}>
          XUAN JI
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl w-full px-4">
        <Link 
          to="/bazi" 
          className="no-underline text-center p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          style={{ background: '#fffdf7', border: '1px solid #e0d8c8' }}
        >
          <div 
            className="inline-flex items-center justify-center mb-4"
            style={{
              width: 44, height: 44,
              border: '1px solid rgba(196,58,49,0.22)',
              fontFamily: "Georgia, 'Noto Serif SC', serif",
              fontSize: 20,
              color: '#c43a31',
            }}
          >
            命
          </div>
          <h2 
            className="text-2xl font-bold mb-2 tracking-[0.2em]"
            style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", color: '#1a1a1a' }}
          >
            八字命盘
          </h2>
          <p className="text-sm leading-relaxed tracking-[0.05em]" style={{ color: '#8b7355' }}>
            四柱推演 · 五行生克
            <br />排盘推运洞悉命理格局
          </p>
        </Link>

        <Link 
          to="/liuyao" 
          className="no-underline text-center p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          style={{ background: '#fffdf7', border: '1px solid #e0d8c8' }}
        >
          <div 
            className="inline-flex items-center justify-center mb-4"
            style={{
              width: 44, height: 44,
              border: '1px solid rgba(196,58,49,0.22)',
              fontFamily: "Georgia, 'Noto Serif SC', serif",
              fontSize: 20,
              color: '#c43a31',
            }}
          >
            爻
          </div>
          <h2 
            className="text-2xl font-bold mb-2 tracking-[0.2em]"
            style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", color: '#1a1a1a' }}
          >
            六爻占卜
          </h2>
          <p className="text-sm leading-relaxed tracking-[0.05em]" style={{ color: '#8b7355' }}>
            起卦问事 · 爻象精解
            <br />一事一问灵应有验
          </p>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center">
        <div style={{ width: 36, height: 1, background: '#c43a31', opacity: 0.35, margin: '0 auto 16px' }} />
        <p className="text-xs tracking-[0.15em]" style={{ color: '#b8a88a' }}>
          玄机 · 传统命理 · 现代演绎
        </p>
      </div>
    </div>
  );
}
