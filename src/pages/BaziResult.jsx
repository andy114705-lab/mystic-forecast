import { useLocation, Link } from 'react-router-dom';

export default function BaziResult() {
  const { state } = useLocation();
  if (!state) return <div className="text-center p-12 text-white/40">暂无数据，请先排盘</div>;

  const { chart, interpretation, tokens } = state;
  const p = chart.pillars;

  return (
    <div className="max-w-3xl mx-auto p-6 pt-8">
      <Link to="/bazi" className="text-white/30 text-sm hover:text-white/60 transition-colors">← 重新排盘</Link>

      {/* 命盘卡片 */}
      <div className="glow-card p-6 mt-4">
        <h2 className="text-gold-400 text-lg mb-4">命盘</h2>
        <div className="grid grid-cols-4 gap-3 text-center">
          {['year','month','day','hour'].map(k => (
            <div key={k} className="bg-white/3 rounded-lg p-3">
              <div className="text-xs text-white/30">{k==='year'?'年柱':k==='month'?'月柱':k==='day'?'日柱':'时柱'}</div>
              <div className="text-2xl text-white/90 my-1">{p[k].ganZhi}</div>
              <div className="text-xs text-white/50">{p[k].tenGod}</div>
              <div className="text-xs text-white/30">{p[k].nayin}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm text-white/40">
          <div>日主：<span className="text-gold-400">{chart.dayMaster}</span></div>
          <div>格局：<span className="text-gold-400">{chart.pattern.name}</span></div>
          <div>旺衰：<span className="text-gold-400">{chart.strength.level}</span></div>
          <div>生肖：<span className="text-gold-400">{chart.basic.生肖}</span></div>
        </div>
        {/* 大运 */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="text-xs text-white/30 mb-2">大运（{chart.dayun.direction}起运{chart.dayun.startAge}岁）</div>
          <div className="flex flex-wrap gap-1">
            {chart.dayun.list.filter(d=>d.ganZhi).map((d,i) => {
              const isCurrent = d.startYear <= 2026 && d.endYear >= 2026;
              return (
                <span key={i} className={`text-xs px-2 py-1 rounded ${isCurrent ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-white/40'}`}>
                  {d.ganZhi}<span className="opacity-50 ml-1">{d.startAge}-{d.endAge}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI 解读 */}
      <div className="glow-card p-6 mt-4">
        <h2 className="text-gold-400 text-lg mb-4">AI 解读</h2>
        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-white/80 leading-relaxed">
          {interpretation}
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-white/20">
        Token: {tokens?.total_tokens || '?'} · Powered by DeepSeek
      </div>
    </div>
  );
}
