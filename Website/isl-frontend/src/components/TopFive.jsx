export default function TopFive({ top5 }) {
  const max = top5[0]?.confidence || 100
  const palette = ['#d97706', '#fbbf24', '#fde68a', '#a8ced3', '#cde4e6']

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <p style={{
        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#475569', marginBottom: '1.25rem',
      }}>
        Top 5 Candidates
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {top5.map((item, i) => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {i === 0 && <span style={{ fontSize: '0.75rem' }}>👑</span>}
                <span style={{
                  fontWeight: i === 0 ? 700 : 500,
                  fontSize: i === 0 ? '0.95rem' : '0.85rem',
                  color: i === 0 ? '#fff' : '#64748b',
                }}>{item.label}</span>
              </div>
              <span style={{
                fontFamily: 'monospace', fontSize: '0.75rem',
                color: i === 0 ? '#fff' : '#475569',
              }}>
                {item.confidence.toFixed(2)}%
              </span>
            </div>
            {/* Track */}
            <div style={{ height: i === 0 ? 7 : 5, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                className="bar-fill"
                style={{
                  '--bar-w': `${(item.confidence / max) * 100}%`,
                  height: '100%', borderRadius: 999,
                  background: palette[i],
                  animationDelay: `${i * 100}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.65rem', color: '#1e293b', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        Bars scaled to top prediction
      </p>
    </div>
  )
}