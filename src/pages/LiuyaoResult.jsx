import { useLocation, Link } from 'react-router-dom';

export default function LiuyaoResult() {
  const { state } = useLocation();
  if (!state) return <div className="text-center p-12 text-white/40">暂无数据，请先占卜</div>;

  const { chart, interpretation, tokens } = state;

  return (
    <div className="max-w-3xl mx-auto p-6 pt-8">
      <Link to="/liuyao" className="text-white/30 text-sm hover:text-white/60 transition-colors">← 重新占卜</Link>

      {/* 卦象卡片 */}
      <div className="glow-card p-6 mt-4">
        <h2 className="text-gold-400 text-lg mb-4">
          {chart.question}
        </h2>
        
        <div className="flex gap-4 items-start">
          {/* 本卦 */}
          <div className="flex-1 text-center bg-white/3 rounded-lg p-4">
            <div className="text-xs text-white/30 mb-1">本卦</div>
            <div className="text-2xl text-white/90">{chart.本卦.名称}</div>
            <div className="text-xs text-white/40 mt-1">{chart.本卦.宫位}宫 · {chart.本卦.五行}</div>
          </div>

          {/* 变卦 */}
          <div className="flex-1 text-center bg-white/3 rounded-lg p-4">
            <div className="text-xs text-white/30 mb-1">变卦</div>
            <div className="text-2xl text-white/90">{chart.变卦?.名称 || '（无变卦）'}</div>
            <div className="text-xs text-white/40 mt-1">{chart.变卦?.宫位 || ''}</div>
          </div>
        </div>

        {/* 六爻 */}
        <div className="mt-4 space-y-1">
          {chart.六爻.map((y, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 py-1.5 rounded ${y.世应 === '世' ? 'bg-purple-500/10' : y.世应 === '应' ? 'bg-teal-400/10' : ''} ${y.动爻 !== '静' ? 'border-l-2 border-gold-400' : ''}`}>
              <span className="text-white/20 text-xs w-8">第{7-y.位置}爻</span>
              <span className="text-white/70 text-sm w-12">{y.纳甲}</span>
              <span className="text-white/50 text-xs w-10">{y.六亲}</span>
              <span className="text-white/30 text-xs w-10">{y.六神}</span>
              <span className={`text-xs font-bold w-8 ${y.世应 === '世' ? 'text-purple-400' : y.世应 === '应' ? 'text-teal-400' : 'text-white/20'}`}>{y.世应}</span>
              {y.动爻 !== '静' && <span className="text-gold-400 text-xs">⚡动</span>}
              {y.空亡 && <span className="text-red-400/70 text-xs">空</span>}
            </div>
          ))}
        </div>

        {/* 用神 + 卦象标签 */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-purple-500/15 text-purple-300 rounded">
            用神：{chart.用神?.map(y => `${y.目标}(${y.选中})`).join(' ')}
          </span>
          {chart.互卦 && <span className="px-2 py-1 bg-white/5 text-white/40 rounded">互卦：{chart.互卦}</span>}
          {chart.错卦 && <span className="px-2 py-1 bg-white/5 text-white/40 rounded">错卦：{chart.错卦}</span>}
          {chart.综卦 && <span className="px-2 py-1 bg-white/5 text-white/40 rounded">综卦：{chart.综卦}</span>}
          {chart.六冲 && <span className="px-2 py-1 bg-red-500/15 text-red-300 rounded">六冲</span>}
          {chart.六合 && <span className="px-2 py-1 bg-teal-400/15 text-teal-300 rounded">六合</span>}
        </div>
      </div>

      {/* AI 解读 */}
      <div className="glow-card p-6 mt-4">
        <h2 className="text-gold-400 text-lg mb-4">AI 断卦</h2>
        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-white/80 leading-relaxed">
          {interpretation}
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-white/20">
        Token: {tokens?.total_tokens || '?'} · 起卦时间：{chart.起卦时间?.年}年{chart.起卦时间?.月}月{chart.起卦时间?.日}日
      </div>
    </div>
  );
}
