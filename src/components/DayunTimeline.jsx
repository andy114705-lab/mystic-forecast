import { tenGodDesc } from '../lib/tenGodDesc.js';

export default function DayunTimeline({ dayunList, currentYear }) {
  const filtered = dayunList.filter(d => d.ganZhi);
  return (
    <div>
      {/* Track */}
      <div style={{ position: 'relative', height: 6, background: '#e6ddcc', borderRadius: 3, marginBottom: 10 }}>
        {filtered.map((d, i) => {
          const isCurrent = d.startYear <= currentYear && d.endYear >= currentYear;
          if (!isCurrent) return null;
          return (
            <div key={i} style={{
              position: 'absolute', top: -4,
              left: `${Math.min(95, Math.max(5, ((currentYear - filtered[0]?.startYear) / (filtered[filtered.length-1]?.endYear - filtered[0]?.startYear || 60)) * 100))}%`,
              width: 14, height: 14, borderRadius: '50%', background: '#b23a2e',
              border: '2px solid #fff', boxShadow: '0 0 0 2px #d9a89f',
            }} />
          );
        })}
      </div>
      {/* Nodes with tenGod */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
        {filtered.map((d, i) => {
          const isCurrent = d.startYear <= currentYear && d.endYear >= currentYear;
          return (
            <div key={i} style={{
              textAlign: 'center', minWidth: 64, padding: '8px 10px', borderRadius: 8,
              background: isCurrent ? '#fbf2f0' : '#f6f2ea',
              border: isCurrent ? '2px solid #d9a89f' : '1px solid #e6ddcc',
              flexShrink: 0,
            }}>
              <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, fontWeight: 700, color: isCurrent ? '#b23a2e' : '#2a2622' }}>
                {d.ganZhi}
              </div>
              <div style={{ fontSize: 10, color: '#a98b5a', marginTop: 2 }}>
                {d.tenGod || ''}
              </div>
              <div style={{ fontSize: 10, color: '#8a8276', marginTop: 1 }}>
                {d.startAge}-{d.endAge}岁
              </div>
            </div>
          );
        })}
      </div>
      {/* Brief description based on actual data */}
      {(() => {
        const current = filtered.find(d => d.startYear <= currentYear && d.endYear >= currentYear);
        const desc = tenGodDesc[current?.tenGod] || '';
        return desc ? (
          <div style={{ fontSize: 11, color: '#8a8276', marginTop: 8, lineHeight: 1.6 }}>
            {desc}
          </div>
        ) : null;
      })()}
    </div>
  );
}
