import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import Markdown from '../components/Markdown.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import PillarCard from '../components/PillarCard.jsx';
import FiveElementsChart from '../components/FiveElementsChart.jsx';
import DayunTimeline from '../components/DayunTimeline.jsx';
import LiuyueRibbon from '../components/LiuyueRibbon.jsx';

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0ebe0', fontSize: 13 }}>
    <span style={{ color: '#8a8276' }}>{label}</span>
    <span style={{ color: '#2a2622', fontWeight: 500 }}>{value}</span>
  </div>
);

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card-dash-sm" style={{ marginBottom: 8, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14,
          fontFamily: '"Noto Sans SC", sans-serif', color: '#2a2622', fontWeight: 500,
        }}>
        {title}
        <span style={{ color: '#b9b0a0', fontSize: 12 }}>{open ? '⌃' : '⌄'}</span>
      </button>
      {open && <div style={{ padding: '0 18px 18px' }}>{children}</div>}
    </div>
  );
};

export default function BaziResult() {
  const { state } = useLocation();
  const [tab, setTab] = useState('运势');
  const [showInterpretation, setShowInterpretation] = useState(false);

  if (!state) return <div style={{ textAlign: 'center', padding: 64, color: '#8a8276' }}>暂无数据，请先排盘</div>;

  const { chart, interpretation, tokens } = state;
  const p = chart.pillars;
  const now = new Date();
  const liunianYear = chart.liunian?.year || now.getFullYear();
  const ringScores = { 事业: 85, 财富: 90, 感情: 70, 健康: 65 };
  const ringColors = { 事业: '#c4a44e', 财富: '#b23a2e', 感情: '#8a9a6b', 健康: '#6f8aa0' };

  // For mobile tab switching
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <div style={{ minHeight: '100vh', background: '#e9e4da' }} className="animate-fade-in">

      {/* ═══ Top Bar ═══ */}
      <div className="topbar">
        <Link to="/" className="topbar-brand">
          ☯ 玄机
        </Link>
        <Link to="/bazi" style={{ fontSize: 13, color: '#8a8276', textDecoration: 'none' }}>
          ← 重新排盘
        </Link>
      </div>

      {/* ═══ Hero: 流年优先 ═══ */}
      <div className="hero-section">
        <div style={{ fontSize: 12, color: '#a98b5a', letterSpacing: 3, marginBottom: 12, fontWeight: 500 }}>
          {liunianYear} · 当年运势
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center' }}>
          {/* Left: GanZhi + tags */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 60, fontWeight: 700, color: '#2a2622', lineHeight: 1 }}>
              {chart.liunian?.ganZhi || '—'}
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tag tag-seal">{chart.liunian?.tenGod || '—'}年</span>
              {chart.liunian?.dayunGanZhi && (
                <span className="tag tag-muted">{chart.liunian.dayunGanZhi}大运</span>
              )}
            </div>
          </div>

          {/* Middle: one-liner */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 20, fontWeight: 600, color: '#2a2622', lineHeight: 1.3 }}>
              {chart.strength?.level === '身强' ? '根基稳固之年' : chart.strength?.level === '身弱' ? '蓄势待发之年' : '平稳过渡之年'}
            </div>
            <div style={{ fontSize: 12, color: '#6f685d', marginTop: 4 }}>
              {chart.liunian?.dayunTenGod ? `大运${chart.liunian.dayunTenGod} · ` : ''}
              流年{chart.liunian?.tenGod || '—'}
            </div>
          </div>

          {/* Right: 4 score rings */}
          <div style={{ display: 'flex', gap: 20 }}>
            {Object.entries(ringScores).map(([k, v]) => (
              <ScoreRing key={k} label={k} score={v} color={ringColors[k]} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Mobile Tabs (shown below 1024px) ═══ */}
      <div className="hidden max-lg:flex" style={{ gap: 0, borderBottom: '1px solid #e6ddcc', background: '#f6f2ea' }}>
        {['运势', '命盘', '解读'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px 0', border: 'none', background: 'transparent',
            borderBottom: tab === t ? '2px solid #b23a2e' : '2px solid transparent',
            color: tab === t ? '#b23a2e' : '#8a8276',
            fontSize: 14, fontWeight: tab === t ? 600 : 400, cursor: 'pointer',
            fontFamily: '"Noto Sans SC", sans-serif',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* ═══ Main content — desktop: 2-col, mobile: tab-based ═══ */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '18px 16px 48px' }}>

        {/* Desktop: two-column. Mobile: show based on tab */}
        <div className="max-lg:hidden" style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          {/* ── LEFT COLUMN (flex 1.35) ── */}
          <div style={{ flex: '1.35', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Pillars */}
            <div className="card-dash" style={{ padding: 16 }}>
              <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 12, letterSpacing: 1 }}>
                八字命盘
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                <PillarCard pillar={p.year} label="年柱" />
                <PillarCard pillar={p.month} label="月柱" />
                <PillarCard pillar={p.day} label="日柱" isDayMaster />
                <PillarCard pillar={p.hour} label="时柱" />
              </div>
            </div>

            {/* Five Elements + Overview side by side */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="card-dash" style={{ flex: 1, padding: 16 }}>
                <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 8, letterSpacing: 1 }}>
                  五行能量
                </div>
                <FiveElementsChart fe={chart.fiveElements} dayMaster={chart.dayMaster} />
              </div>
              <div className="card-dash" style={{ flex: 1, padding: 16 }}>
                <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 8, letterSpacing: 1 }}>
                  命主概览
                </div>
                <InfoRow label="日主" value={<span style={{ color: '#b23a2e' }}>{chart.basic?.日主 || chart.dayMaster}</span>} />
                <InfoRow label="格局" value={chart.pattern?.name || '—'} />
                <InfoRow label="旺衰" value={chart.strength?.level || '—'} />
                <InfoRow label="生肖" value={chart.basic?.生肖 || '—'} />
                <InfoRow label="星座" value={chart.basic?.星座 || '—'} />
                <InfoRow label="公历" value={chart.basic?.公历 || '—'} />
                {chart.basic?.农历 && <InfoRow label="农历" value={chart.basic.农历} />}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (flex 1) ── */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Dayun Timeline */}
            <div className="card-dash" style={{ padding: 16 }}>
              <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 12, letterSpacing: 1 }}>
                大运 · 时间轴
              </div>
              <div style={{ fontSize: 11, color: '#8a8276', marginBottom: 10 }}>
                {chart.dayun?.direction}起运 · {chart.dayun?.startAge}岁起运
              </div>
              <DayunTimeline dayunList={chart.dayun?.list || []} currentYear={liunianYear} />
            </div>

            {/* Current Year Relations */}
            <div className="card-dash" style={{ padding: 16 }}>
              <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 12, letterSpacing: 1 }}>
                当前流年关系
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <InfoRow label="所处大运" value={chart.liunian?.dayunGanZhi || '—'} />
                <InfoRow label="流年" value={chart.liunian?.ganZhi || '—'} />
                <InfoRow label="大运十神" value={chart.liunian?.dayunTenGod || '—'} />
                <InfoRow label="流年十神" value={chart.liunian?.tenGod || '—'} />
              </div>
            </div>

            {/* TaiYuan / MingGong */}
            <div className="card-dash" style={{ padding: 16 }}>
              <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 12, letterSpacing: 1 }}>
                胎元 · 命宫
              </div>
              <div style={{ display: 'flex', gap: 16, textAlign: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#8a8276', marginBottom: 4 }}>胎元</div>
                  <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 18, fontWeight: 600, color: '#2a2622' }}>{chart.taiYuan || '—'}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#8a8276', marginBottom: 4 }}>命宫</div>
                  <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 18, fontWeight: 600, color: '#2a2622' }}>{chart.mingGong || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Mobile Tab Content ═══ */}
        <div className="lg:hidden">
          {/* Tab: 运势 */}
          {tab === '运势' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="card-dash" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: 12 }}>
                  {Object.entries(ringScores).map(([k, v]) => (
                    <ScoreRing key={k} label={k} score={v} color={ringColors[k]} />
                  ))}
                </div>
              </div>
              <div className="card-dash" style={{ padding: 16 }}>
                <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 8 }}>
                  五行能量
                </div>
                <FiveElementsChart fe={chart.fiveElements} dayMaster={chart.dayMaster} />
              </div>
              <div className="card-dash" style={{ padding: 16 }}>
                <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 8 }}>
                  大运时间轴
                </div>
                <DayunTimeline dayunList={chart.dayun?.list || []} currentYear={liunianYear} />
              </div>
              {chart.liuyue?.length > 0 && (
                <div className="card-dash" style={{ padding: 16 }}>
                  <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 8 }}>
                    {liunianYear}年流月
                  </div>
                  <LiuyueRibbon liuyue={chart.liuyue} />
                </div>
              )}
            </div>
          )}

          {/* Tab: 命盘 */}
          {tab === '命盘' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="card-dash" style={{ padding: 16 }}>
                <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 10 }}>
                  八字命盘
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                  <PillarCard pillar={p.year} label="年柱" />
                  <PillarCard pillar={p.month} label="月柱" />
                  <PillarCard pillar={p.day} label="日柱" isDayMaster />
                  <PillarCard pillar={p.hour} label="时柱" />
                </div>
              </div>
              <div className="card-dash" style={{ padding: 16 }}>
                <InfoRow label="日主" value={<span style={{ color: '#b23a2e' }}>{chart.basic?.日主 || chart.dayMaster}</span>} />
                <InfoRow label="格局" value={chart.pattern?.name || '—'} />
                <InfoRow label="旺衰" value={chart.strength?.level || '—'} />
                <InfoRow label="生肖" value={chart.basic?.生肖 || '—'} />
                <InfoRow label="公历" value={chart.basic?.公历 || '—'} />
                <InfoRow label="农历" value={chart.basic?.农历 || '—'} />
              </div>
              <div className="card-dash" style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 10 }}>
                  胎元 · 命宫
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#8a8276' }}>胎元</div>
                    <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 18, fontWeight: 600 }}>{chart.taiYuan || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#8a8276' }}>命宫</div>
                    <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 18, fontWeight: 600 }}>{chart.mingGong || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: 解读 */}
          {tab === '解读' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Accordion title="四维交叉验证 · 旺衰/格局/调候/病药">
                <Markdown text={interpretation} />
              </Accordion>
              <Accordion title="核心建议 · 事业/财富/感情/健康">
                <div style={{ color: '#6f685d', fontSize: 13 }}>
                  解读内容已包含在四维交叉验证中，请查看上方。
                </div>
              </Accordion>
              {chart.steps?.length > 0 && (
                <Accordion title="推导链 · 排盘过程">
                  {chart.steps.map((s, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0ebe0', fontSize: 12 }}>
                      <span style={{ color: '#b23a2e', fontWeight: 600 }}>{String(s.step).padStart(2, '0')} </span>
                      <span style={{ color: '#2a2622' }}>{s.title}</span>
                      <span style={{ color: '#8a8276', marginLeft: 8 }}>{s.output}</span>
                    </div>
                  ))}
                </Accordion>
              )}
            </div>
          )}
        </div>

        {/* ═══ Liuyue Ribbon (desktop only) ═══ */}
        {chart.liuyue?.length > 0 && (
          <div className="max-lg:hidden" style={{ marginTop: 18 }}>
            <div className="card-dash" style={{ padding: 14 }}>
              <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 600, color: '#2a2622', marginBottom: 10, letterSpacing: 1 }}>
                {liunianYear} · 流月
              </div>
              <LiuyueRibbon liuyue={chart.liuyue} />
            </div>
          </div>
        )}

        {/* ═══ 深度解读 (desktop accordion) ═══ */}
        <div className="max-lg:hidden" style={{ marginTop: 24 }}>
          <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 16, fontWeight: 600, color: '#2a2622', marginBottom: 12, letterSpacing: 1 }}>
            深度解读
            <span style={{ fontSize: 11, color: '#b9b0a0', marginLeft: 8, fontWeight: 400 }}>收起时点击展开</span>
          </div>
          <Accordion title="四维交叉验证 · 旺衰/格局/调候/病药">
            <Markdown text={interpretation} />
          </Accordion>
          <Accordion title="AI 综合解读">
            <Markdown text={interpretation} />
          </Accordion>
          <Accordion title="核心建议 · 事业/财富/感情/健康">
            <div style={{ color: '#6f685d', fontSize: 13 }}>
              建议内容已包含在上方解读中。如需独立分析，请在排盘时添加对应需求。
            </div>
          </Accordion>
          {chart.steps?.length > 0 && (
            <Accordion title="推导链 · 完整排盘过程">
              {chart.steps.map((s, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0ebe0', fontSize: 13 }}>
                  <span style={{ color: '#b23a2e', fontWeight: 600 }}>{String(s.step).padStart(2, '0')}. </span>
                  <span style={{ color: '#2a2622' }}>{s.title}</span>
                  <span style={{ color: '#8a8276', marginLeft: 8 }}>{s.output}</span>
                </div>
              ))}
            </Accordion>
          )}
        </div>

        {/* Token info */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 10, color: '#b9b0a0' }}>
          Token: {tokens?.total_tokens || '?'} · DeepSeek
        </div>
      </div>
    </div>
  );
}
