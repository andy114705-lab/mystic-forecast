import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import Markdown from '../components/Markdown.jsx';

const Section = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glow-card mb-4 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <h2 className="text-gold-400 text-base font-medium">{title}</h2>
        <span className="text-white/30 text-sm transition-transform" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

const StepSection = ({ step, title, input, rule, output, detail }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-lg mb-2 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-3 flex items-start gap-3 text-left hover:bg-white/[0.02] transition-colors">
        <span className="text-gold-400 text-sm font-mono mt-0.5 shrink-0">第{step}步</span>
        <div className="flex-1 min-w-0">
          <div className="text-white/70 text-sm">{title}</div>
          <div className="text-white/40 text-xs mt-0.5 truncate">{output}</div>
        </div>
        <span className="text-white/20 text-xs mt-0.5">{open ? '收起' : '展开'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0 border-t border-white/5 bg-white/[0.02]">
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div><span className="text-white/30">输入：</span><span className="text-white/60">{input}</span></div>
            <div><span className="text-white/30">规则：</span><span className="text-white/60 whitespace-pre-line">{rule}</span></div>
            <div><span className="text-white/30">输出：</span><span className="text-gold-400">{output}</span></div>
            {detail && <div className="mt-1 pt-2 border-t border-white/5"><span className="text-white/30">详解：</span><div className="text-white/50 whitespace-pre-line mt-1">{detail}</div></div>}
          </div>
        </div>
      )}
    </div>
  );
};

const PillarTable = ({ pillars }) => {
  const cols = [
    { key:'ganZhi', label:'干支', wide:false },
    { key:'tenGod', label:'十神', wide:false },
    { key:'nayin', label:'纳音', wide:false },
    { key:'wuXing', label:'五行', wide:false },
    { key:'diShi', label:'地势', wide:false },
    { key:'hiddenStems', label:'藏干', wide:false },
    { key:'xunKong', label:'旬空', wide:false },
    { key:'shenSha', label:'神煞', wide:true },
  ];
  const rowLabels = { year:'年柱', month:'月柱', day:'日柱（日元）', hour:'时柱' };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-center text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-2 text-white/30 text-xs font-normal w-14"></th>
            {cols.map(c => <th key={c.key} className={`p-2 text-white/30 text-xs font-normal ${c.wide?'min-w-[80px]':'min-w-[50px]'}`}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {['year','month','day','hour'].map(k => {
            const p = pillars[k];
            return (
              <tr key={k} className={`border-b border-white/5 ${k==='day'?'bg-purple-500/[0.05]':''}`}>
                <td className="p-2 text-white/40 text-xs">{rowLabels[k]}</td>
                <td className="p-2 text-white/90 font-medium text-lg">{p.ganZhi}</td>
                <td className="p-2 text-gold-400 text-xs">{p.tenGod}</td>
                <td className="p-2 text-white/50 text-xs">{p.nayin}</td>
                <td className="p-2 text-white/50 text-xs">{p.wuXing}</td>
                <td className="p-2 text-white/50 text-xs">{p.diShi}</td>
                <td className="p-2 text-white/50 text-xs">{p.hiddenStems?.join(' ')}</td>
                <td className="p-2 text-white/30 text-xs">{p.xunKong || '—'}</td>
                <td className="p-2 text-xs">{(p.shenSha?.length > 0 ? p.shenSha.map(s => <span key={s} className="inline-block bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded mr-1 mb-1">{s}</span>) : <span className="text-white/20">—</span>)}</td>
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
  const colors = { 金:'#fbbf24',木:'#34d399',水:'#60a5fa',火:'#f87171',土:'#a78bfa' };
  return (
    <div className="grid grid-cols-5 gap-3">
      {Object.entries(fe).map(([k,v]) => (
        <div key={k} className="text-center">
          <div className="text-white/30 text-xs mb-1">{k}</div>
          <div className="h-20 flex items-end justify-center mb-1">
            <div className="w-8 rounded-t-sm transition-all" style={{ height: `${(v/max)*72}px`, backgroundColor: colors[k], opacity: 0.7 }}></div>
          </div>
          <div className="text-white/70 text-sm font-medium">{v}</div>
          <div className="text-white/20 text-[10px]">{GAN_WX[dayMaster]===k?'(日主)':''}</div>
        </div>
      ))}
    </div>
  );
};

const GAN_WX = { 甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水' };

export default function BaziResult() {
  const { state } = useLocation();
  if (!state) return <div className="text-center p-12 text-white/40">暂无数据，请先排盘</div>;

  const { chart, interpretation, tokens } = state;
  const p = chart.pillars;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pt-8">
      <Link to="/bazi" className="text-white/30 text-sm hover:text-white/60 transition-colors">← 重新排盘</Link>

      <h1 className="text-white/80 text-xl mt-3 mb-4">{chart.name ? `${chart.name} · 八字命盘` : '八字命盘'}</h1>

      {/* ─── 基本信息 ─── */}
      <Section title="📋 基本信息">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Info label="公历" value={chart.basic.公历} />
          <Info label="农历" value={chart.basic.农历} />
          <Info label="生肖" value={chart.basic.生肖} />
          <Info label="星座" value={chart.basic.星座} />
          <Info label="性别" value={chart.basic.性别} />
          <Info label="日主" value={<span className="text-gold-400 font-medium">{chart.basic.日主}</span>} />
          <Info label="格局" value={<span className="text-gold-400 font-medium">{chart.pattern.name}</span>} />
          <Info label="旺衰" value={<span className={chart.strength.level==='身强'?'text-red-300':chart.strength.level==='身弱'?'text-blue-300':'text-green-300'}>{chart.strength.level}</span>} />
          {chart.basic.真太阳时 && <div className="bg-white/[0.03] rounded-lg p-3 col-span-2"><div className="text-white/30 text-xs mb-1">真太阳时</div><div className="text-white/70 text-sm"><span className="text-purple-300 text-xs">{chart.basic.真太阳时}</span></div></div>}
        </div>
      </Section>

      {/* ─── 四柱 ─── */}
      <Section title="📊 四柱详情">
        <PillarTable pillars={p} />
      </Section>

      {/* ─── 五行 ─── */}
      <Section title="🔥 五行分布">
        <FiveElements fe={chart.fiveElements} dayMaster={chart.dayMaster} />
        <div className="text-white/30 text-xs mt-3 text-center">统计口径：天干地支表层五行（不含藏干），共8个字</div>
      </Section>

      {/* ─── 冲合 ─── */}
      {(chart.relations?.length > 0 || chart.sanHeGroups?.length > 0) && (
        <Section title="🔗 干支冲合关系">
          {chart.relations?.length > 0 && (
            <div className="mb-2">
              <div className="text-white/30 text-xs mb-1">六冲·六合</div>
              {chart.relations.map((r,i) => <div key={i} className="text-white/60 text-sm">{r}</div>)}
            </div>
          )}
          {chart.sanHeGroups?.length > 0 && (
            <div>
              <div className="text-white/30 text-xs mb-1">三合局</div>
              {chart.sanHeGroups.map((s,i) => <div key={i} className="text-purple-300 text-sm">{s}</div>)}
            </div>
          )}
          {!chart.relations?.length && !chart.sanHeGroups?.length && <div className="text-white/30 text-sm">原局四柱地支之间无直接冲合关系</div>}
        </Section>
      )}

      {/* ─── 胎元·命宫 ─── */}
      <Section title="🏛 胎元 · 命宫">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/[0.03] rounded-lg p-3">
            <div className="text-white/30 text-xs mb-1">胎元</div>
            <div className="text-white/80 text-lg">{chart.taiYuan || '—'}</div>
            <div className="text-white/40 text-xs mt-1">怀胎十月之气禀</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3">
            <div className="text-white/30 text-xs mb-1">命宫</div>
            <div className="text-white/80 text-lg">{chart.mingGong || '—'}</div>
            <div className="text-white/40 text-xs mt-1">安命之所在</div>
          </div>
        </div>
      </Section>

      {/* ─── 大运 ─── */}
      <Section title="🔄 大运排盘">
        <div className="text-white/40 text-xs mb-3">{chart.dayun.direction}起运 · {chart.dayun.startAge}岁起运（{chart.dayun.startYear}年）</div>
        <div className="flex flex-wrap gap-1.5">
          {chart.dayun.list.filter(d=>d.ganZhi).map((d,i) => {
            const isCurrent = d.startYear <= new Date().getFullYear() && d.endYear >= new Date().getFullYear();
            return (
              <span key={i} className={`text-xs px-2 py-1.5 rounded ${isCurrent ? 'bg-purple-500/30 text-purple-200 ring-1 ring-purple-500/50' : 'bg-white/5 text-white/40'}`}>
                <span className="font-medium">{d.ganZhi}</span>
                <span className="opacity-50 ml-1">{d.startAge}-{d.endAge}岁</span>
                <span className="opacity-40 ml-1 text-[10px]">·{d.tenGod}</span>
              </span>
            );
          })}
        </div>
      </Section>

      {/* ─── 流年 ─── */}
      <Section title="📅 当前流年分析">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-white/[0.03] rounded-lg p-3">
            <div className="text-white/30 text-xs mb-1">流年</div>
            <div className="text-white/80 text-lg font-medium">{chart.liunian.ganZhi}</div>
            <div className="text-gold-400 text-xs mt-1">{chart.liunian.tenGod}流年</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3">
            <div className="text-white/30 text-xs mb-1">所处大运</div>
            <div className="text-white/80 text-lg font-medium">{chart.liunian.dayunGanZhi}</div>
            <div className="text-white/50 text-xs mt-1">{chart.liunian.dayunAge}</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3">
            <div className="text-white/30 text-xs mb-1">大运十神</div>
            <div className="text-white/80 text-lg">{chart.liunian.dayunTenGod}</div>
            <div className="text-white/50 text-xs mt-1">十年基调</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3">
            <div className="text-white/30 text-xs mb-1">流年十神</div>
            <div className="text-white/80 text-lg">{chart.liunian.tenGod}</div>
            <div className="text-white/50 text-xs mt-1">当年主题</div>
          </div>
        </div>
      </Section>

      {/* ─── 流月 ─── */}
      {chart.liuyue?.length > 0 && (
        <Section title={`📆 ${chart.liunian.year}年流月`} defaultOpen={false}>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {chart.liuyue.map((m, i) => (
              <div key={i} className={`bg-white/[0.03] rounded-lg p-2 text-center ${m.relations.length > 0 ? 'ring-1 ring-purple-500/20' : ''}`}>
                <div className="text-white/30 text-[10px]">{m.month}月</div>
                <div className="text-white/80 text-sm font-medium">{m.ganZhi}</div>
                <div className="text-gold-400 text-[10px]">{m.tenGod}</div>
                {m.relations.length > 0 && <div className="text-purple-300/60 text-[10px] mt-0.5">{m.relations.join(' ')}</div>}
              </div>
            ))}
          </div>
          <div className="text-white/20 text-[10px] mt-2 text-center">按月柱干支+十神排列，紫色边框=与命局有冲合关系的月份</div>
        </Section>
      )}

      {/* ─── 推导链 ─── */}
      {chart.steps?.length > 0 && (
        <Section title="🔍 推导链（专业人员可逐步核对）" defaultOpen={false}>
          <div className="text-white/30 text-xs mb-3">以下记录了从输入到输出的完整排盘推导过程，每步可展开查看输入、规则、输出和详解。</div>
          {chart.steps.map(s => (
            <StepSection key={s.step} {...s} />
          ))}
        </Section>
      )}

      {/* ─── AI 解读 ─── */}
      <div className="glow-card p-6 mb-4">
        <h2 className="text-gold-400 text-lg mb-4">🤖 AI 综合解读</h2>
        <Markdown text={interpretation} />
      </div>

      <div className="text-center mb-8 text-xs text-white/20">
        Token: {tokens?.total_tokens || '?'} · Powered by DeepSeek
      </div>
    </div>
  );
}

function Info({ label, value, colSpan = 1 }) {
  return (
    <div className={`bg-white/[0.03] rounded-lg p-3 ${colSpan > 1 ? `col-span-${colSpan}` : ''}`}>
      <div className="text-white/30 text-xs mb-1">{label}</div>
      <div className="text-white/70 text-sm">{value}</div>
    </div>
  );
}
