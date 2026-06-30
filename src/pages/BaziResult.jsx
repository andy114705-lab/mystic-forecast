import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import Markdown from '../components/Markdown.jsx';

const Section = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card mb-5 overflow-hidden" style={{ background: '#fffdf7', border: '1px solid #e0d8c8' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/[0.01] transition-colors">
        <span 
          className="font-bold tracking-[0.06em]"
          style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", fontSize: 15, color: '#2c2416' }}
        >
          {title}
        </span>
        <span className="text-xs transition-transform duration-200" style={{ color: '#b8a88a', transform: open ? 'rotate(90deg)' : '' }}>
          &#9654;
        </span>
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
};

const StepSection = ({ step, title, input, rule, output, detail }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#ede6d8] last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full py-3 flex items-center gap-3 text-left hover:bg-black/[0.005]">
        <span className="text-xs shrink-0 w-8" style={{ color: '#c43a31', opacity: 0.6 }}>{String(step).padStart(2,'0')}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm" style={{ color: '#2c2416' }}>{title}</div>
        </div>
        <span className="text-[10px]" style={{ color: '#b8a88a' }}>{open ? '收起' : '展开'}</span>
      </button>
      {open && (
        <div className="pb-4 px-4 ml-8 text-xs space-y-2 border-l" style={{ borderColor: '#ede6d8' }}>
          <div><span style={{ color: '#8b7355' }}>输入：</span><span style={{ color: '#5c4f3d' }}>{input}</span></div>
          <div><span style={{ color: '#8b7355' }}>规则：</span><span style={{ color: '#5c4f3d' }} className="whitespace-pre-line">{rule}</span></div>
          <div><span style={{ color: '#c43a31' }}>输出：{output}</span></div>
          {detail && <div className="pt-2"><div style={{ color: '#5c4f3d' }} className="whitespace-pre-line">{detail}</div></div>}
        </div>
      )}
    </div>
  );
};

const PillarTable = ({ pillars }) => {
  const cols = [
    { key:'ganZhi', label:'干支' },
    { key:'tenGod', label:'十神' },
    { key:'nayin', label:'纳音' },
    { key:'wuXing', label:'五行' },
    { key:'diShi', label:'地势' },
    { key:'hiddenStems', label:'藏干' },
    { key:'xunKong', label:'旬空' },
    { key:'shenSha', label:'神煞' },
  ];
  const rowLabels = { year:'年柱', month:'月柱', day:'日柱', hour:'时柱' };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-center text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: '2px solid #e0d8c8' }}>
            <th className="p-3 text-[10px] font-semibold uppercase tracking-[0.08em] w-12" style={{ color: '#8b7355' }}></th>
            {cols.map(c => (
              <th key={c.key} className="p-3 text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#8b7355' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {['year','month','day','hour'].map(k => {
            const p = pillars[k];
            return (
              <tr key={k} className="border-b border-[#ede6d8]" style={k==='day' ? { background: 'rgba(196,58,49,0.03)' } : {}}>
                <td className="p-3 text-xs" style={{ color: '#8b7355' }}>{rowLabels[k]}</td>
                <td className="p-3 font-bold" style={{ fontFamily: "Georgia, serif", fontSize: 17, color: '#1a1a1a' }}>{p.ganZhi}</td>
                <td className="p-3 text-xs" style={{ color: '#c43a31' }}>{p.tenGod}</td>
                <td className="p-3 text-xs" style={{ color: '#5c4f3d' }}>{p.nayin}</td>
                <td className="p-3 text-xs" style={{ color: '#5c4f3d' }}>{p.wuXing}</td>
                <td className="p-3 text-xs" style={{ color: '#5c4f3d' }}>{p.diShi}</td>
                <td className="p-3 text-xs" style={{ color: '#5c4f3d' }}>{p.hiddenStems?.join(' ')}</td>
                <td className="p-3 text-xs" style={{ color: '#8b7355' }}>{p.xunKong || '—'}</td>
                <td className="p-3 text-xs">
                  {(p.shenSha?.length > 0
                    ? p.shenSha.map(s => <span key={s} className="tag tag-accent mr-1 mb-1">{s}</span>)
                    : <span style={{ color: '#b8a88a' }}>—</span>)}
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
  const colors = { 金:'#c43a31',木:'#7a9d6c',水:'#6b8db5',火:'#c43a31',土:'#8b7355' };
  return (
    <div className="grid grid-cols-5 gap-4">
      {Object.entries(fe).map(([k,v]) => (
        <div key={k} className="text-center">
          <div className="text-[10px] mb-2 uppercase tracking-[0.08em]" style={{ color: '#8b7355' }}>{labels[k]}</div>
          <div className="h-24 flex items-end justify-center mb-2">
            <div className="w-8 transition-all" style={{ height: `${Math.max((v/max)*80, 4)}px`, backgroundColor: colors[k], opacity: 0.5 }} />
          </div>
          <div className="text-base font-semibold" style={{ fontFamily: "Georgia, serif", color: '#1a1a1a' }}>{v}</div>
        </div>
      ))}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="p-4" style={{ background: 'rgba(0,0,0,0.01)' }}>
    <div className="text-[10px] mb-1 uppercase tracking-[0.08em]" style={{ color: '#8b7355' }}>{label}</div>
    <div className="text-sm" style={{ color: '#2c2416' }}>{value}</div>
  </div>
);

export default function BaziResult() {
  const { state } = useLocation();
  if (!state) return <div className="text-center p-16" style={{ color: '#8b7355' }}>暂无数据，请先排盘</div>;

  const { chart, interpretation, tokens } = state;
  const p = chart.pillars;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pt-8 pb-16 animate-fade-in">
      {/* Back */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/bazi" className="text-sm tracking-[0.05em] hover:opacity-70 transition-opacity" style={{ color: '#8b7355' }}>
          ← 重新排盘
        </Link>
        <Link to="/" className="text-sm tracking-[0.05em] hover:opacity-70 transition-opacity" style={{ color: '#8b7355' }}>
          玄机
        </Link>
      </div>

      {/* Title */}
      <h1 
        className="text-xl mt-4 mb-8 tracking-[0.08em] font-bold"
        style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", color: '#2c2416' }}
      >
        {chart.name ? `${chart.name} · 八字命盘` : '八字命盘'}
      </h1>

      {/* Four Pillars */}
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
          <Info label="日主" value={<span className="font-bold" style={{ color: '#c43a31' }}>{chart.basic.日主}</span>} />
          <Info label="格局" value={<span className="font-bold" style={{ color: '#c43a31' }}>{chart.pattern.name}</span>} />
          <Info label="旺衰" value={<span style={{ color: chart.strength.level==='身强'?'#c43a31':chart.strength.level==='身弱'?'#8b7355':'#2c2416' }}>{chart.strength.level}</span>} />
          <Info label="星座" value={chart.basic.星座} />
        </div>
      </Section>

      {/* Five Elements */}
      <Section title="五行">
        <FiveElements fe={chart.fiveElements} dayMaster={chart.dayMaster} />
        <p className="text-[10px] mt-3 text-center" style={{ color: '#b8a88a' }}>天干地支表层五行（不含藏干），共 8 字</p>
      </Section>

      {/* Relations */}
      {(chart.relations?.length > 0 || chart.sanHeGroups?.length > 0) && (
        <Section title="冲合关系">
          {chart.relations?.length > 0 && (
            <div className="mb-4">
              <div className="text-[10px] mb-2 uppercase tracking-[0.08em]" style={{ color: '#8b7355' }}>六冲 · 六合</div>
              {chart.relations.map((r,i) => <div key={i} className="text-sm leading-relaxed" style={{ color: '#2c2416' }}>{r}</div>)}
            </div>
          )}
          {chart.sanHeGroups?.length > 0 && (
            <div>
              <div className="text-[10px] mb-2 uppercase tracking-[0.08em]" style={{ color: '#8b7355' }}>三合局</div>
              {chart.sanHeGroups.map((s,i) => <div key={i} className="text-sm" style={{ color: '#c43a31' }}>{s}</div>)}
            </div>
          )}
        </Section>
      )}

      {/* Tai Yuan / Ming Gong */}
      <Section title="胎元 · 命宫">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-6" style={{ background: 'rgba(0,0,0,0.01)' }}>
            <div className="text-[10px] mb-2 uppercase tracking-[0.08em]" style={{ color: '#8b7355' }}>胎元</div>
            <div className="text-xl font-bold" style={{ fontFamily: "Georgia, serif", color: '#2c2416' }}>{chart.taiYuan || '—'}</div>
            <div className="text-xs mt-2" style={{ color: '#8b7355' }}>怀胎十月之气禀</div>
          </div>
          <div className="p-6" style={{ background: 'rgba(0,0,0,0.01)' }}>
            <div className="text-[10px] mb-2 uppercase tracking-[0.08em]" style={{ color: '#8b7355' }}>命宫</div>
            <div className="text-xl font-bold" style={{ fontFamily: "Georgia, serif", color: '#2c2416' }}>{chart.mingGong || '—'}</div>
            <div className="text-xs mt-2" style={{ color: '#8b7355' }}>安命之所在</div>
          </div>
        </div>
      </Section>

      {/* Dayun */}
      <Section title="大运">
        <div className="text-xs mb-4" style={{ color: '#8b7355' }}>
          {chart.dayun.direction}起运 · {chart.dayun.startAge}岁起运（{chart.dayun.startYear}年）
        </div>
        <div className="flex flex-wrap gap-2">
          {chart.dayun.list.filter(d=>d.ganZhi).map((d,i) => {
            const isCurrent = d.startYear <= new Date().getFullYear() && d.endYear >= new Date().getFullYear();
            return (
              <span key={i} className="text-xs px-3 py-2" style={isCurrent ? {
                background: 'rgba(196,58,49,0.06)', border: '1px solid rgba(196,58,49,0.2)', color: '#c43a31'
              } : {
                background: 'rgba(0,0,0,0.01)', color: '#5c4f3d'
              }}>
                <span className="font-bold">{d.ganZhi}</span>
                <span className="ml-1.5" style={{ opacity: 0.5 }}>{d.startAge}-{d.endAge}岁</span>
              </span>
            );
          })}
        </div>
      </Section>

      {/* Current Year */}
      <Section title="当前流年">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Info label="流年" value={<><span className="text-lg font-bold" style={{ fontFamily: "Georgia, serif", color: '#1a1a1a' }}>{chart.liunian.ganZhi}</span><span className="block text-xs mt-1" style={{ color: '#c43a31' }}>{chart.liunian.tenGod}年</span></>} />
          <Info label="所处大运" value={<><span style={{ color: '#1a1a1a' }}>{chart.liunian.dayunGanZhi}</span><span className="block text-xs mt-1" style={{ color: '#8b7355' }}>{chart.liunian.dayunAge}</span></>} />
          <Info label="大运十神" value={<><span style={{ color: '#1a1a1a' }}>{chart.liunian.dayunTenGod}</span><span className="block text-xs mt-1" style={{ color: '#b8a88a' }}>十年基调</span></>} />
          <Info label="流年十神" value={<><span style={{ color: '#1a1a1a' }}>{chart.liunian.tenGod}</span><span className="block text-xs mt-1" style={{ color: '#b8a88a' }}>当年主题</span></>} />
        </div>
      </Section>

      {/* Monthly */}
      {chart.liuyue?.length > 0 && (
        <Section title={`${chart.liunian.year}年流月`} defaultOpen={false}>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {chart.liuyue.map((m, i) => (
              <div key={i} className="p-3 text-center border" style={{
                background: 'rgba(0,0,0,0.01)',
                borderColor: m.relations.length > 0 ? 'rgba(196,58,49,0.25)' : '#e0d8c8'
              }}>
                <div className="text-[10px] mb-1" style={{ color: '#8b7355' }}>{m.month}月</div>
                <div className="text-sm font-bold" style={{ color: '#2c2416' }}>{m.ganZhi}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#c43a31' }}>{m.tenGod}</div>
                {m.relations.length > 0 && (
                  <div className="text-[10px] mt-1" style={{ color: '#8b7355' }}>{m.relations.join(' ')}</div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Derivation */}
      {chart.steps?.length > 0 && (
        <Section title="推导链" defaultOpen={false}>
          <p className="text-xs mb-4" style={{ color: '#8b7355' }}>从输入到输出的完整排盘推导过程，每步可展开查看。</p>
          {chart.steps.map(s => <StepSection key={s.step} {...s} />)}
        </Section>
      )}

      {/* AI Interpretation */}
      <div className="card p-8 my-5" style={{ background: '#fffdf7', border: '1px solid #e0d8c8' }}>
        <div className="section-title mb-8">深度解读</div>
        <Markdown text={interpretation} />
      </div>

      <div className="text-center mb-12 text-[10px] tracking-[0.05em]" style={{ color: '#b8a88a' }}>
        Token: {tokens?.total_tokens || '?'} · DeepSeek
      </div>
    </div>
  );
}
