import { useLocation, Link } from 'react-router-dom';
import Markdown from '../components/Markdown.jsx';

export default function LiuyaoResult() {
  const { state } = useLocation();
  if (!state) return <div className="text-center p-16 text-white/20">暂无数据，请先占卜</div>;

  const { chart, interpretation, tokens } = state;

  return (
    <div className="max-w-3xl mx-auto p-6 pt-8 animate-fade-in">
      <Link to="/liuyao" className="text-white/15 text-xs hover:text-white/30 transition-colors tracking-[0.05em]">
        ← 重新占卜
      </Link>

      {/* Hexagram Card */}
      <div className="card mt-4 p-6">
        <div className="section-title mb-6">卦象</div>

        <p className="text-white/75 text-base mb-6 leading-relaxed">{chart.question}</p>

        {/* Main + Changed hexagram */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/[0.02] p-6 text-center">
            <div className="text-white/15 text-[10px] mb-2 uppercase tracking-[0.08em]">本卦</div>
            <div className="text-white/85 text-2xl mb-1" style={{ fontFamily: "Georgia, serif" }}>{chart.本卦.名称}</div>
            <div className="text-white/25 text-xs">{chart.本卦.宫位}宫 · {chart.本卦.五行}</div>
          </div>
          <div className="bg-white/[0.02] p-6 text-center">
            <div className="text-white/15 text-[10px] mb-2 uppercase tracking-[0.08em]">变卦</div>
            <div className="text-white/85 text-2xl mb-1" style={{ fontFamily: "Georgia, serif" }}>{chart.变卦?.名称 || '（无变卦）'}</div>
            <div className="text-white/25 text-xs">{chart.变卦?.宫位 || ''}</div>
          </div>
        </div>

        {/* Yao lines */}
        <div className="space-y-0">
          {chart.六爻.map((y, i) => {
            const isShi = y.世应 === '世';
            const isYing = y.世应 === '应';
            const isChanging = y.动爻;
            return (
              <div key={i} className={`yao-line ${isShi ? 'shi' : ''} ${isYing ? 'ying' : ''} ${isChanging ? 'changing' : ''}`}>
                <span className="text-white/10 text-xs w-6 text-right">{7-y.位置}</span>
                <span className="text-white/70 text-sm w-14">{y.纳甲}</span>
                <span className="text-white/35 text-xs w-10">{y.六亲}</span>
                <span className="text-white/20 text-xs w-10">{y.六神}</span>
                <span className={`text-xs font-medium w-8 ${isShi ? 'text-cinnabar-400' : isYing ? 'text-gold-400' : 'text-white/10'}`}>
                  {y.世应}
                </span>
                {isChanging && <span className="tag tag-gold text-[10px]">{isChanging}</span>}
                {y.空亡 && <span className="text-cinnabar-400/50 text-[10px]">空</span>}
                {y.旺衰 && <span className="text-white/15 text-[10px] ml-auto">{y.旺衰}</span>}
              </div>
            );
          })}
        </div>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
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
      <div className="card p-6 mt-4">
        <div className="section-title mb-6">AI 断卦</div>
        <Markdown text={interpretation} />
      </div>

      <div className="text-center mt-6 mb-8 text-[10px] text-white/10 tracking-[0.05em]">
        Token: {tokens?.total_tokens || '?'} · 起卦时间：{chart.起卦时间?.年}年{chart.起卦时间?.月}月{chart.起卦时间?.日}日
      </div>
    </div>
  );
}
