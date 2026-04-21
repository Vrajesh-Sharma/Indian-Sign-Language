import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header.jsx'
import PredictionCard from '../components/PredictionCard.jsx'
import TopFive from '../components/TopFive.jsx'

const API_URL = import.meta.env.VITE_API_URL
// const API_URL = "http://localhost:8000"

export default function LiveDetection() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [stream, setStream] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)

  // Start the camera
  const startCamera = async () => {
    setError(null)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
      setCameraActive(true)
    } catch (err) {
      setError("Could not access the camera. " + err.message)
    }
  }

  // Stop the camera when navigating away
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setCameraActive(false)
    }
  }, [stream])

  useEffect(() => {
    // Automatically start camera on mount
    startCamera()
    return () => {
      stopCamera()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return

    // Set canvas dimensions to match video
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight

    const ctx = canvasRef.current.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return

      setLoading(true)
      setError(null)
      setResult(null)

      try {
        const form = new FormData()
        form.append('file', blob, 'capture.jpg')
        const res = await fetch(`${API_URL}/live`, { method: 'POST', body: form })
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || `Error ${res.status}`)
        setResult(await res.json())
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }, 'image/jpeg', 0.95)
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
              Live Camera Detection
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              Use your webcam to recognise sign language in real time
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 2-col grid: camera | results */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr)',
              gap: '1.25rem',
            }}
              className="predict-grid"
            >
              {/* Left – Camera panel */}
              <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: cameraActive ? '#ef4444' : '#64748b', animation: cameraActive ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }}></span>
                    Live Feed
                  </span>

                  {!cameraActive ? (
                    <button
                      onClick={startCamera}
                      style={{
                        fontSize: '0.75rem', color: '#475569', background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                        padding: '0.3rem 0.75rem', cursor: 'pointer', transition: 'color 150ms',
                      }}
                      onMouseOver={e => e.currentTarget.style.color = '#fff'}
                      onMouseOut={e => e.currentTarget.style.color = '#475569'}
                    >
                      Turn On Camera
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      style={{
                        fontSize: '0.75rem', color: '#ef4444', background: 'transparent',
                        border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8,
                        padding: '0.3rem 0.75rem', cursor: 'pointer', transition: 'background 150ms',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      Turn Off
                    </button>
                  )}
                </div>

                <div style={{
                  borderRadius: '0.75rem', overflow: 'hidden',
                  background: '#0f172a', aspectRatio: '4/3',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}>
                  {/* Invisible canvas for capturing */}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />

                  {!cameraActive ? (
                    <div style={{ color: '#475569', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '2rem' }}>📷</span>
                      Camera is off
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                    />
                  )}

                  {loading && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(3,7,18,0.6)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(4px)',
                    }}>
                      <div style={{
                        width: 24, height: 24,
                        border: '3px solid rgba(217, 119, 6,0.3)',
                        borderTopColor: '#d97706',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        marginBottom: '0.75rem'
                      }} />
                      <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Analyzing Frame...</span>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={handleCapture}
                    disabled={!cameraActive || loading}
                    className={(!cameraActive || loading) ? "btn-ghost" : "btn-primary"}
                    style={{
                      width: '100%', padding: '0.85rem',
                      opacity: (!cameraActive || loading) ? 0.5 : 1,
                      cursor: (!cameraActive || loading) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    📸 Capture & Predict
                  </button>
                </div>
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
                      {[90, 50, 35, 25, 15].map((w, i) => (
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
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                    >
                      <PredictionCard result={result} />
                      <TopFive top5={result.top5} />
                    </motion.div>
                  )}

                  {!result && !loading && !error && (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="glass-card"
                      style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}
                    >
                      <span style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>👀</span>
                      <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>Waiting for capture</h3>
                      <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: 250 }}>
                        Position your hand clearly in the frame and click capture to run the AI model.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <style>{`
        @media (min-width: 640px) {
          .predict-grid {
            grid-template-columns: 1fr 1fr !important;
            align-items: start;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  )
}
