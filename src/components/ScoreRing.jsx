// CSS-only score ring — no chart library needed
export default function ScoreRing({ label, score, color = '#c4a44e' }) {
  const r = 23, circumference = 2 * Math.PI * r;
  const pct = score / 100;
  const offset = circumference * (1 - pct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={54} height={54} viewBox="0 0 54 54">
        <circle cx={27} cy={27} r={r} fill="none" stroke="#e6ddcc" strokeWidth={4} />
        <circle
          cx={27} cy={27} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 27 27)"
          style={{ transition: 'stroke-dashoffset .8s ease' }}
        />
        <text x={27} y={27} textAnchor="middle" dominantBaseline="central"
          fill="#2a2622" fontSize={12} fontWeight={700} fontFamily="Noto Sans SC, sans-serif">
          {score}
        </text>
      </svg>
      <span style={{ color: '#6f685d', fontSize: 10, fontWeight: 500, letterSpacing: 1 }}>{label}</span>
    </div>
  );
}
