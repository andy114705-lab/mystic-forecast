import { useState } from 'react';

export default function PillarCard({ pillar, label, isDayMaster = false }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="card-dash-sm p-3.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        borderColor: isDayMaster ? '#d9a89f' : '#e6ddcc',
        background: isDayMaster ? '#fbf2f0' : '#ffffff',
        borderWidth: isDayMaster ? '2px' : '1px',
        minWidth: 100,
      }}
    >
      <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 11, color: '#8a8276', marginBottom: 4, letterSpacing: 1 }}>
        {label}
      </div>
      <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 26, fontWeight: 700, color: '#2a2622', lineHeight: 1.2 }}>
        {pillar.ganZhi}
      </div>
      <div style={{ fontSize: 12, color: '#b23a2e', marginTop: 2, fontWeight: 500 }}>
        {pillar.tenGod}
      </div>

      {/* Expand hint */}
      <div style={{ fontSize: 10, color: '#b9b0a0', marginTop: 8, display: 'flex', alignItems: 'center', gap: 3 }}>
        {expanded ? '收起 ⌃' : '展开 ⌄'}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0ebe0', fontSize: 12, color: '#6f685d', lineHeight: 1.8 }}>
          <div><span style={{ color: '#8a8276' }}>纳音</span> {pillar.nayin}</div>
          <div><span style={{ color: '#8a8276' }}>藏干</span> {pillar.hiddenStems?.join(' ')}</div>
          <div><span style={{ color: '#8a8276' }}>地势</span> {pillar.diShi}</div>
          <div><span style={{ color: '#8a8276' }}>旬空</span> {pillar.xunKong || '—'}</div>
          {pillar.shenSha?.length > 0 && (
            <div><span style={{ color: '#8a8276' }}>神煞</span> {pillar.shenSha.join(' ')}</div>
          )}
        </div>
      )}
    </div>
  );
}
