export default function LiuyueRibbon({ liuyue }) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 6 }} className="scrollbar-hide">
      <div style={{ display: 'flex', gap: 6 }}>
        {liuyue.map((m, i) => {
          const isCurrent = m.month === currentMonth;
          return (
            <div key={i} style={{
              minWidth: 62, textAlign: 'center', padding: '8px 6px', borderRadius: 8,
              background: isCurrent ? '#fbf2f0' : '#ffffff',
              border: isCurrent ? '2px solid #d9a89f' : '1px solid #e6ddcc',
              flexShrink: 0,
              cursor: 'default',
            }}>
              <div style={{ fontSize: 10, color: '#8a8276' }}>{m.month}月</div>
              <div style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 13, fontWeight: 700, color: isCurrent ? '#b23a2e' : '#2a2622', margin: '2px 0' }}>
                {m.ganZhi}
              </div>
              <div style={{ fontSize: 10, color: '#a98b5a' }}>{m.tenGod}</div>
              {m.relations.length > 0 && (
                <div style={{ fontSize: 8, color: '#d9a89f', marginTop: 1 }}>{m.relations[0]}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
