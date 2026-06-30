import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ background: '#e9e4da', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 56, height: 56, border: '2px solid #b23a2e',
          fontFamily: '"Noto Serif SC", Georgia, serif',
          fontSize: 28, fontWeight: 'bold', color: '#b23a2e',
          background: '#fff', marginBottom: 24,
        }}>
          玄
        </div>
        <h1 style={{
          fontFamily: '"Noto Serif SC", Georgia, serif',
          fontSize: 52, fontWeight: 700, color: '#2a2622',
          letterSpacing: '10px', marginBottom: 12,
        }}>
          玄 机
        </h1>
        <p style={{
          fontFamily: 'Georgia, "Noto Serif SC", serif',
          fontSize: 13, color: '#8a8276', letterSpacing: '7px',
        }}>
          XUAN JI
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', gap: 24, maxWidth: 640, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/bazi" style={{
          flex: '1 1 260px', maxWidth: 320, textDecoration: 'none',
          background: '#fff', border: '1px solid #e6ddcc', borderRadius: 12,
          padding: '48px 32px', textAlign: 'center',
          boxShadow: '0 10px 40px rgba(60,45,25,.10)',
          transition: 'transform .3s, box-shadow .3s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 48px rgba(60,45,25,.16)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 40px rgba(60,45,25,.10)'; }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, border: '1px solid #d9a89f',
            fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 20,
            color: '#b23a2e', marginBottom: 20,
          }}>
            命
          </div>
          <h2 style={{
            fontFamily: '"Noto Serif SC", Georgia, serif',
            fontSize: 22, fontWeight: 700, color: '#2a2622',
            letterSpacing: '6px', marginBottom: 10,
          }}>
            八字命盘
          </h2>
          <p style={{ fontSize: 14, color: '#8a8276', lineHeight: 1.8, letterSpacing: '1px' }}>
            四柱推演 · 五行生克
          </p>
        </Link>

        <Link to="/liuyao" style={{
          flex: '1 1 260px', maxWidth: 320, textDecoration: 'none',
          background: '#fff', border: '1px solid #e6ddcc', borderRadius: 12,
          padding: '48px 32px', textAlign: 'center',
          boxShadow: '0 10px 40px rgba(60,45,25,.10)',
          transition: 'transform .3s, box-shadow .3s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 48px rgba(60,45,25,.16)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 40px rgba(60,45,25,.10)'; }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, border: '1px solid #d9a89f',
            fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 20,
            color: '#b23a2e', marginBottom: 20,
          }}>
            爻
          </div>
          <h2 style={{
            fontFamily: '"Noto Serif SC", Georgia, serif',
            fontSize: 22, fontWeight: 700, color: '#2a2622',
            letterSpacing: '6px', marginBottom: 10,
          }}>
            六爻占卜
          </h2>
          <p style={{ fontSize: 14, color: '#8a8276', lineHeight: 1.8, letterSpacing: '1px' }}>
            起卦问事 · 爻象精解
          </p>
        </Link>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 96, textAlign: 'center' }}>
        <div style={{ width: 80, height: 1, background: '#b23a2e', opacity: .35, margin: '0 auto 16px' }} />
        <p style={{ fontSize: 11, color: '#b9b0a0', letterSpacing: '5px' }}>
          玄 机 · 传 统 命 理 · 现 代 演 绎
        </p>
      </div>
    </div>
  );
}
