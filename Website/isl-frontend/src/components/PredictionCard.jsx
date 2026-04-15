export default function PredictionCard({ result }) {
  const conf = result.confidence
  const tier = conf >= 80 ? 'high' : conf >= 70 ? 'mid' : 'low'

  const colors = {
    high: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#34d399', label: 'High confidence' },
    mid:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24', label: 'Moderate' },
    low:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#f87171', label: 'Low confidence' },
  }[tier]

  return (
    <div className="glass-card" style={{ padding: '1.75rem', height: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#475569' }}>
          Prediction
        </span>
        <span style={{
          fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.65rem',
          borderRadius: 999, background: colors.bg, border: `1px solid ${colors.border}`,
          color: colors.text,
        }}>
          {colors.label}
        </span>
      </div>

      {/* Big sign + confidence */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: 96, height: 96, borderRadius: 20, flexShrink: 0,
          background: `radial-gradient(circle at 40% 30%, ${colors.text}20, transparent)`,
          border: `2px solid ${colors.text}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', fontWeight: 900, color: '#fff',
        }}>
          {result.prediction}
        </div>
        <div>
          <p style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            {conf.toFixed(1)}%
          </p>
          <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.3rem' }}>
            confidence score
          </p>
        </div>
      </div>

      {/* Confidence arc bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          height: 6, borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <div
            className="bar-fill"
            style={{
              '--bar-w': `${conf}%`,
              height: '100%', borderRadius: 999,
              background: `linear-gradient(90deg, #01696f, ${colors.text})`,
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
          <span style={{ fontSize: '0.65rem', color: '#334155' }}>0%</span>
          <span style={{ fontSize: '0.65rem', color: '#334155' }}>100%</span>
        </div>
      </div>

      {/* Model tag */}
      <div style={{
        paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.7rem', color: '#334155' }}>Model used</span>
        <code style={{
          fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)',
          padding: '0.2rem 0.5rem', borderRadius: 6,
        }}>{result.model_used}</code>
      </div>
    </div>
  )
}