import { useLocation, Link } from 'react-router-dom';
import Markdown from '../components/Markdown.jsx';

const YaoLine = ({ yao, index }) => {
  const isShi = yao.世应 === '世';
  const isYing = yao.世应 === '应';
  const isChanging = yao.动爻;

  return (
    <div 
      className="flex items-center gap-3 px-4 py-2.5 text-sm"
      style={{
        borderLeft: isShi ? '3px solid #c43a31' : isYing ? '3px solid #c9a55c' : '3px solid transparent',
        background: isShi ? 'rgba(196,58,49,0.03)' : isYing ? 'rgba(201,165,92,0.03)' : 'transparent',
        borderBottom: '1px solid #ede6d8',
      }}
    >
      <span className="text-xs w-6 text-right" style={{ color: '#b8a88a' }}>{7-yao.位置}</span>
      <span className="font-bold w-14" style={{ fontFamily: "Georgia, serif", color: '#1a1a1a' }}>{yao.纳甲}</span>
      <span className="text-xs w-10" style={{ color: '#5c4f3d' }}>{yao.六亲}</span>
      <span className="text-xs w-10" style={{ color: '#8b7355' }}>{yao.六神}</span>
      <span className="text-xs font-bold w-8" style={{ color: isShi ? '#c43a31' : isYing ? '#c9a55c' : '#b8a88a' }}>
        {yao.世应}
      </span>
      {isChanging && <span className="tag tag-accent text-[10px]">{isChanging}</span>}
      {yao.空亡 && <span className="text-[10px]" style={{ color: '#c43a31', opacity: 0.6 }}>空</span>}
      {yao.旺衰 && <span className="text-[10px] ml-auto" style={{ color: '#b8a88a' }}>{yao.旺衰}</span>}
    </div>
  );
};

export default function LiuyaoResult() {
  const { state } = useLocation();
  if (!state) return <div className="text-center p-16" style={{ color: '#8b7355' }}>暂无数据，请先占卜</div>;

  const { chart, interpretation, tokens } = state;

  return (
    <div className="max-w-3xl mx-auto p-6 pt-8 pb-16 animate-fade-in">
      <Link to="/liuyao" className="text-sm tracking-[0.05em] hover:opacity-70 transition-opacity" style={{ color: '#8b7355' }}>
        ← 重新占卜
      </Link>

      {/* Hexagram Card */}
      <div className="card mt-4 p-8" style={{ background: '#fffdf7', border: '1px solid #e0d8c8' }}>
        <div className="section-title mb-6">卦象</div>

        <p className="text-base mb-8 leading-relaxed" style={{ color: '#2c2416' }}>{chart.question}</p>

        {/* Main + Changed */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 text-center" style={{ background: 'rgba(0,0,0,0.01)' }}>
            <div className="text-[10px] mb-2 uppercase tracking-[0.08em]" style={{ color: '#8b7355' }}>本卦</div>
            <div className="text-2xl font-bold mb-1" style={{ fontFamily: "Georgia, serif", color: '#1a1a1a' }}>{chart.本卦.名称}</div>
            <div className="text-xs" style={{ color: '#8b7355' }}>{chart.本卦.宫位}宫 · {chart.本卦.五行}</div>
          </div>
          <div className="p-6 text-center" style={{ background: 'rgba(0,0,0,0.01)' }}>
            <div className="text-[10px] mb-2 uppercase tracking-[0.08em]" style={{ color: '#8b7355' }}>变卦</div>
            <div className="text-2xl font-bold mb-1" style={{ fontFamily: "Georgia, serif", color: '#1a1a1a' }}>{chart.变卦?.名称 || '无变卦'}</div>
            <div className="text-xs" style={{ color: '#8b7355' }}>{chart.变卦?.宫位 || ''}</div>
          </div>
        </div>

        {/* Yao lines */}
        <div className="mb-6">
          {chart.六爻.map((y, i) => <YaoLine key={i} yao={y} index={i} />)}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          {chart.用神?.map((y,i) => (
            <span key={i} className="tag tag-accent">用神：{y.目标}（{y.选中}）</span>
          ))}
          {chart.互卦 && <span className="tag tag-muted">互卦：{chart.互卦}</span>}
          {chart.错卦 && <span className="tag tag-muted">错卦：{chart.错卦}</span>}
          {chart.综卦 && <span className="tag tag-muted">综卦：{chart.综卦}</span>}
          {chart.六冲 && <span className="tag tag-accent">六冲</span>}
          {chart.六合 && <span className="tag tag-gold">六合</span>}
        </div>
      </div>

      {/* AI Interpretation */}
      <div className="card p-8 mt-5" style={{ background: '#fffdf7', border: '1px solid #e0d8c8' }}>
        <div className="section-title mb-8">AI 断卦</div>
        <Markdown text={interpretation} />
      </div>

      <div className="text-center mt-6 mb-8 text-[10px] tracking-[0.05em]" style={{ color: '#b8a88a' }}>
        Token: {tokens?.total_tokens || '?'} · 起卦时间：{chart.起卦时间?.年}年{chart.起卦时间?.月}月{chart.起卦时间?.日}日
      </div>
    </div>
  );
}
