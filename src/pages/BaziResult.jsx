import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import Markdown from '../components/Markdown.jsx';

const Section = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card mb-3 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.01] transition-colors">
        <span className="text-[13px] tracking-[0.04em]"
          style={{ fontFamily: "Georgia, serif", color: '#c9a55c' }}>
          {title}
        </span>
        <span className="text-white/15 text-xs" style={{ transform: open ? 'rotate(90deg)' : '', transition: 'transform 0.2s' }}>
          &#9654;
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

const StepSection = ({ step, title, input, rule, output, detail }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-1 border-b border-white/[0.03] last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full py-3 flex items-center gap-3 text-left hover:bg-white/[0.01]">
        <span className="text-cinnabar-400/60 text-xs font-mono w-12 shrink-0">{String(step).padStart(2,'0')}</span>
        <div className="flex-1 min-w-0">
          <div className="text-white/60 text-sm">{title}</div>
        </div>
        <span className="text-white/10 text-[10px]">{open ? '收起' : '展开'}</span>
      </button>
      {open && (
        <div className="pb-3 px-4 ml-12 text-xs space-y-2 border-l border-white/[0.04]">
          <div><span className="text-white/20">输入：</span><span className="text-white/50">{input}</span></div>
          <div><span className="text-white/20">规则：</span><span className="text-white/50 whitespace-pre-line">{rule}</span></div>
          <div><span className="text-cinnabar-400/70">输出：{output}</span></div>
          {detail && <div className="pt-2"><div className="text-white/50 whitespace-pre-line">{detail}</div></div>}
        </div>
      )}
    </div>
  );
};

const PillarTable = ({ pillars }) => {
  const cols = [
    { key:'ganZhi', label:'干支', wide:true },
    { key:'tenGod', label:'十神' },
    { key:'nayin', label:'纳音' },
    { key:'wuXing', label:'五行' },
    { key:'diShi', label:'地势' },
    { key:'hiddenStems', label:'藏干' },
    { key:'xunKong', label:'旬空' },
    { key:'shenSha', label:'神煞', wide:true },
  ];
  const rowLabels = { year:'年柱', month:'月柱', day:'日柱', hour:'时柱' };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-center text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="p-3 text-white/15 text-[10px] font-normal uppercase tracking-[0.08em] w-12"></th>
            {cols.map(c => (
              <th key={c.key} className={`p-3 text-white/15 text-[10px] font-normal uppercase tracking-[0.08em]`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {['year','month','day','hour'].map(k => {
            const p = pillars[k];
            return (
              <tr key={k} className={`border-b border-white/[0.03] ${k==='day' ? 'bg-cinnabar-500/[0.04]' : ''}`}>
                <td className="p-3 text-white/20 text-xs">{rowLabels[k]}</td>
                <td className="p-3 text-white/85 font-medium" style={{ fontFamily: "Georgia, serif", fontSize: '17px' }}>{p.ganZhi}</td>
                <td className="p-3 text-gold-400 text-xs">{p.tenGod}</td>
                <td className="p-3 text-white/40 text-xs">{p.nayin}</td>
                <td className="p-3 text-white/40 text-xs">{p.wuXing}</td>
                <td className="p-3 text-white/40 text-xs">{p.diShi}</td>
                <td className="p-3 text-white/40 text-xs">{p.hiddenStems?.join(' ')}</td>
                <td className="p-3 text-white/25 text-xs">{p.xunKong || '—'}</td>
                <td className="p-3 text-xs">
                  {(p.shenSha?.length > 0
                    ? p.shenSha.map(s => <span key={s} className="tag tag-accent mr-1 mb-1">{s}</span>)
                    : <span className="text-white/10">—</span>)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const FiveElements = ({ fe, dayMaster }) => {
  const max = Math.max(...Object.values(fe), 1);
  const labels = { 金:'金',木:'木',水:'水',火:'火',土:'土' };
  const colors = { 金:'#c9a55c',木:'#7a9d6c',水:'#6b8db5',火:'#c43a31',土:'#b08d5c' };
  return (
    <div className="grid grid-cols-5 gap-4">
      {Object.entries(fe).map(([k,v]) => (
        <div key={k} className="text-center">
          <div className="text-white/15 text-[10px] mb-2 uppercase tracking-[0.08em]">{labels[k]}</div>
          <div className="h-24 flex items-end justify-center mb-2">
            <div className="w-8 transition-all" style={{ height: `${Math.max((v/max)*80, 4)}px`, backgroundColor: colors[k], opacity: 0.6 }} />
          </div>
          <div className="text-white/70 text-base font-medium" style={{ fontFamily: "Georgia, serif" }}>{v}</div>
        </div>
      ))}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="bg-white/[0.02] p-4">
    <div className="text-white/15 text-[10px] mb-1 uppercase tracking-[0.08em]">{label}</div>
    <div className="text-white/70 text-sm">{value}</div>
  </div>
);

export default function BaziResult() {
  const { state } = useLocation();
  if (!state) return <div className="text-center p-16 text-white/20">暂无数据，请先排盘</div>;

  const { chart, interpretation, tokens } = state;
  const p = chart.pillars;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pt-8 animate-fade-in">
      {/* Back + Header */}
      <Link to="/bazi" className="text-white/15 text-xs hover:text-white/30 transition-colors tracking-[0.05em]">
        ← 重新排盘
      </Link>
      <h1 className="text-gold-400 text-xl mt-4 mb-6 tracking-[0.06em]"
        style={{ fontFamily: "Georgia, 'Noto Serif SC', serif" }}>
        {chart.name ? `${chart.name} · 八字命盘` : '八字命盘'}
      </h1>

      {/* Pillars */}
      <Section title="四柱">
        <PillarTable pillars={p} />
      </Section>

      {/* Summary */}
      <Section title="概览">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Info label="公历" value={chart.basic.公历} />
          <Info label="农历" value={chart.basic.农历} />
          <Info label="生肖" value={chart.basic.生肖} />
          <Info label="性别" value={chart.basic.性别} />
          <Info label="日主" value={<span className="text-gold-400 font-medium">{chart.basic.日主}</span>} />
          <Info label="格局" value={<span className="text-gold-400 font-medium">{chart.pattern.name}</span>} />
          <Info label="旺衰" value={<span className={chart.strength.level==='身强'?'text-cinnabar-400':chart.strength.level==='身弱'?'text-gold-300':'text-white/60'}>{chart.strength.level}</span>} />
          <Info label="星座" value={chart.basic.星座} />
        </div>
        {chart.basic.真太阳时 && (
          <div className="mt-2 bg-white/[0.02] p-3 text-xs text-white/30">
            真太阳时：<span className="text-cinnabar-400/70">{chart.basic.真太阳时}</span>
          </div>
        )}
      </Section>

      {/* Five Elements */}
      <Section title="五行">
        <FiveElements fe={chart.fiveElements} dayMaster={chart.dayMaster} />
        <p className="text-white/10 text-[10px] mt-3 text-center">天干地支表层五行（不含藏干），共 8 字</p>
      </Section>

      {/* Relations */}
      {(chart.relations?.length > 0 || chart.sanHeGroups?.length > 0) && (
        <Section title="冲合关系">
          {chart.relations?.length > 0 && (
            <div className="mb-3">
              <div className="text-white/15 text-[10px] mb-2 uppercase tracking-[0.08em]">六冲 · 六合</div>
              {chart.relations.map((r,i) => <div key={i} className="text-white/55 text-sm leading-relaxed">{r}</div>)}
            </div>
          )}
          {chart.sanHeGroups?.length > 0 && (
            <div>
              <div className="text-white/15 text-[10px] mb-2 uppercase tracking-[0.08em]">三合局</div>
              {chart.sanHeGroups.map((s,i) => <div key={i} className="text-cinnabar-300 text-sm">{s}</div>)}
            </div>
          )}
        </Section>
      )}

      {/* Tai Yuan / Ming Gong */}
      <Section title="胎元 · 命宫">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/[0.02] p-6">
            <div className="text-white/15 text-[10px] mb-2 uppercase tracking-[0.08em]">胎元</div>
            <div className="text-white/80 text-xl" style={{ fontFamily: "Georgia, serif" }}>{chart.taiYuan || '—'}</div>
            <div className="text-white/15 text-xs mt-2">怀胎十月之气禀</div>
          </div>
          <div className="bg-white/[0.02] p-6">
            <div className="text-white/15 text-[10px] mb-2 uppercase tracking-[0.08em]">命宫</div>
            <div className="text-white/80 text-xl" style={{ fontFamily: "Georgia, serif" }}>{chart.mingGong || '—'}</div>
            <div className="text-white/15 text-xs mt-2">安命之所在</div>
          </div>
        </div>
      </Section>

      {/* Dayun */}
      <Section title="大运">
        <div className="text-white/20 text-xs mb-3">
          {chart.dayun.direction}起运 · {chart.dayun.startAge}岁起运（{chart.dayun.startYear}年）
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chart.dayun.list.filter(d=>d.ganZhi).map((d,i) => {
            const isCurrent = d.startYear <= new Date().getFullYear() && d.endYear >= new Date().getFullYear();
            return (
              <span key={i} className={`text-xs px-3 py-1.5 ${isCurrent ? 'bg-cinnabar-500/15 text-cinnabar-300 border border-cinnabar-500/20' : 'bg-white/[0.02] text-white/30'}`}>
                <span className="font-medium">{d.ganZhi}</span>
                <span className="opacity-40 ml-1.5">{d.startAge}-{d.endAge}岁</span>
              </span>
            );
          })}
        </div>
      </Section>

      {/* Current Year */}
      <Section title="当前流年">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Info label="流年" value={<><span className="text-white/80 text-lg" style={{ fontFamily: "Georgia, serif" }}>{chart.liunian.ganZhi}</span><span className="block text-gold-400 text-xs mt-1">{chart.liunian.tenGod}年</span></>} />
          <Info label="所处大运" value={<><span className="text-white/80">{chart.liunian.dayunGanZhi}</span><span className="block text-white/30 text-xs mt-1">{chart.liunian.dayunAge}</span></>} />
          <Info label="大运十神" value={<><span className="text-white/80">{chart.liunian.dayunTenGod}</span><span className="block text-white/20 text-xs mt-1">十年基调</span></>} />
          <Info label="流年十神" value={<><span className="text-white/80">{chart.liunian.tenGod}</span><span className="block text-white/20 text-xs mt-1">当年主题</span></>} />
        </div>
      </Section>

      {/* Monthly */}
      {chart.liuyue?.length > 0 && (
        <Section title={`${chart.liunian.year}年流月`} defaultOpen={false}>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {chart.liuyue.map((m, i) => (
              <div key={i} className={`bg-white/[0.02] p-3 text-center ${m.relations.length > 0 ? 'border border-cinnabar-500/15' : ''}`}>
                <div className="text-white/20 text-[10px] mb-1">{m.month}月</div>
                <div className="text-white/80 text-sm font-medium">{m.ganZhi}</div>
                <div className="text-gold-400/70 text-[10px] mt-0.5">{m.tenGod}</div>
                {m.relations.length > 0 && (
                  <div className="text-cinnabar-400/50 text-[10px] mt-1">{m.relations.join(' ')}</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-white/10 text-[10px] mt-3 text-center">
            红色边框 = 与命局有冲合关系的月份
          </p>
        </Section>
      )}

      {/* Derivation */}
      {chart.steps?.length > 0 && (
        <Section title="推导链" defaultOpen={false}>
          <p className="text-white/15 text-xs mb-3">从输入到输出的完整排盘推导过程，每步可展开查看。</p>
          {chart.steps.map(s => <StepSection key={s.step} {...s} />)}
        </Section>
      )}

      {/* AI Interpretation */}
      <div className="card p-6 my-4">
        <div className="section-title mb-6">AI 综合解读</div>
        <Markdown text={interpretation} />
      </div>

      <div className="text-center mb-12 text-[10px] text-white/10 tracking-[0.05em]">
        Token: {tokens?.total_tokens || '?'} · DeepSeek
      </div>
    </div>
  );
}
