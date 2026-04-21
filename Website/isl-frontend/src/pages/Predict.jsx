import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header.jsx'
import UploadZone from '../components/UploadZone.jsx'
import PredictionCard from '../components/PredictionCard.jsx'
import TopFive from '../components/TopFive.jsx'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export default function Predict() {
  const [image,   setImage]   = useState(null)
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleImage = useCallback(async (file) => {
    const previewUrl = URL.createObjectURL(file)
    setImage({ file, previewUrl })
    setResult(null); setError(null); setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_URL}/predict`, { method: 'POST', body: form })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || `Error ${res.status}`)
      setResult(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = () => {
    if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl)
    setImage(null); setResult(null); setError(null); setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#030712' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="container-sm">

          {/* Breadcrumb */}
          <Link to="/" style={{ fontSize: '0.78rem', color: '#334155', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '2rem' }}>
            ← Back to home
          </Link>

          {/* Page header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '0.5rem' }}>
              ISL Prediction
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              Upload any hand gesture image for instant deep learning classification
            </p>
          </div>

          {/* ── No image: Full-width upload ── */}
          {!image && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
            >
              <UploadZone onImage={handleImage} loading={loading} />

              {/* Tip */}
              <div style={{
                marginTop: '1.5rem', padding: '1rem 1.25rem',
                borderRadius: '0.875rem', background: 'rgba(217, 119, 6,0.07)',
                border: '1px solid rgba(217, 119, 6,0.18)',
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 2 }}>💡</span>
                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>
                  For best results, use a <strong style={{ color: '#94a3b8' }}>well-lit image</strong> with a <strong style={{ color: '#94a3b8' }}>plain background</strong>. The model recognises ISL alphabets A–Z and digits 0–9.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Has image: 2-column layout ── */}
          {image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* 2-col grid: image | results */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr)',
                gap: '1.25rem',
              }}
                className="predict-grid"
              >
                {/* Left – Image panel */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#334155' }}>
                      Input Image
                    </span>
                    <button
                      onClick={reset}
                      disabled={loading}
                      style={{
                        fontSize: '0.75rem', color: '#475569', background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                        padding: '0.3rem 0.75rem', cursor: loading ? 'default' : 'pointer',
                        opacity: loading ? 0.4 : 1, transition: 'color 150ms',
                      }}
                      onMouseOver={e => e.currentTarget.style.color = '#fff'}
                      onMouseOut={e => e.currentTarget.style.color = '#475569'}
                    >
                      Try another →
                    </button>
                  </div>

                  <div style={{
                    borderRadius: '0.75rem', overflow: 'hidden',
                    background: '#0f172a', aspectRatio: '1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img
                      src={image.previewUrl}
                      alt="Uploaded gesture"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {loading && (
                    <div style={{
                      marginTop: '1rem', display: 'flex', alignItems: 'center',
                      gap: '0.6rem', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 16, height: 16,
                        border: '2px solid rgba(217, 119, 6,0.3)',
                        borderTopColor: '#d97706',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      <span style={{ fontSize: '0.8rem', color: '#475569' }}>Classifying…</span>
                    </div>
                  )}
                </div>

                {/* Right – Results */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <AnimatePresence mode="wait">
                    {loading && !result && (
                      <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="glass-card"
                        style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                      >
                        <div className="skeleton" style={{ height: 14, width: '40%' }} />
                        <div className="skeleton" style={{ height: 80, width: '55%', borderRadius: 16 }} />
                        <div className="skeleton" style={{ height: 10, width: '100%' }} />
                        {[90,50,35,25,15].map((w,i) => (
                          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div className="skeleton" style={{ width: 20, height: 12, borderRadius: 4 }} />
                            <div className="skeleton" style={{ height: 8, width: `${w}%`, borderRadius: 999 }} />
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                          padding: '1rem 1.25rem', borderRadius: '0.875rem',
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                          color: '#f87171', fontSize: '0.85rem',
                          display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                        }}
                      >
                        <span>⚠</span><span>{error}</span>
                      </motion.div>
                    )}

                    {result && !loading && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                      >
                        <PredictionCard result={result} />
                        <TopFive top5={result.top5} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* Inline CSS for responsive 2-col grid + spin */}
      <style>{`
        @media (min-width: 640px) {
          .predict-grid {
            grid-template-columns: 1fr 1fr !important;
            align-items: start;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}