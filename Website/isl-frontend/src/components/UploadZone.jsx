import { useRef, useState, useCallback } from 'react'

export default function UploadZone({ onImage, loading }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)

  const process = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    onImage(file)
  }, [onImage])

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files[0]) }}
      onClick={() => !loading && inputRef.current?.click()}
      className={drag ? 'drag-active' : ''}
      style={{
        border: `2px dashed ${drag ? '#01696f' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '1.25rem',
        background: drag ? 'rgba(1,105,111,0.08)' : 'rgba(15,23,42,0.6)',
        padding: '4rem 2rem',
        cursor: loading ? 'default' : 'pointer',
        textAlign: 'center',
        transition: 'all 200ms ease',
        userSelect: 'none',
      }}
    >
      <input
        ref={inputRef} type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={e => process(e.target.files[0])}
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid rgba(1,105,111,0.3)',
            borderTopColor: '#01696f',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Classifying your sign…</p>
        </div>
      ) : (
        <>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'rgba(1,105,111,0.15)',
            border: '1px solid rgba(1,105,111,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 1.25rem',
          }}>🤟</div>

          <p style={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.4rem' }}>
            Drop a hand sign image here
          </p>
          <p style={{ color: '#475569', fontSize: '0.825rem', marginBottom: '1.5rem' }}>
            or click to browse · JPEG, PNG, WebP supported
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Alphabets A–Z', 'Digits 0–9', 'Special signs'].map(t => (
              <span key={t} style={{
                fontSize: '0.7rem', color: '#475569',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999, padding: '0.25rem 0.75rem',
                background: 'rgba(255,255,255,0.03)',
              }}>{t}</span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}