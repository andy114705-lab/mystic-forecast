import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const labels = { 金: '金', 木: '木', 水: '水', 火: '火', 土: '土' };

export default function FiveElementsChart({ fe, dayMaster }) {
  const maxVal = Math.max(...Object.values(fe), 1);
  const data = Object.entries(fe).map(([k, v]) => ({
    element: labels[k],
    value: Math.round((v / maxVal) * 100),
    raw: v,
    isDayMaster: (() => {
      const map = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
      return map[dayMaster] === k;
    })(),
  }));

  return (
    <div style={{ width: '100%', height: 160, position: 'relative' }}>
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="#e6ddcc" />
          <PolarAngleAxis dataKey="element" tick={{ fontSize: 11, fill: '#8a8276', fontFamily: '"Noto Sans SC", sans-serif' }} />
          <Radar dataKey="value" stroke="#b23a2e" fill="#b23a2e" fillOpacity={0.08} strokeWidth={1.5} />
        </RadarChart>
      </ResponsiveContainer>
      {/* Day master marker */}
      <div style={{ position: 'absolute', bottom: 8, width: '100%', textAlign: 'center', fontSize: 10, color: '#8a8276' }}>
        日主：{dayMaster}
      </div>
    </div>
  );
}
