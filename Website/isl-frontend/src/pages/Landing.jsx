import { Suspense, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import Header from '../components/Header.jsx'
import HeroScene from '../components/three/HeroScene.jsx'

const SIGNS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9']

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16,1,0.3,1] } },
}
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

/* ── Hero ── */
function Hero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const frameCount = 192;
    const context = canvasRef.current?.getContext('2d');

    if (imagesRef.current.length === 0) {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const filename = i.toString().padStart(4, '0');
        img.src = `/frames/${filename}.jpg`;
        imagesRef.current.push(img);
      }
    }

    const renderFrame = (index) => {
      if (!context || !canvasRef.current) return;
      const img = imagesRef.current[index];
      if (img && img.complete && img.naturalWidth > 0) {
        if (canvasRef.current.width !== img.naturalWidth) {
          canvasRef.current.width = img.naturalWidth;
          canvasRef.current.height = img.naturalHeight;
        }
        context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };

    const firstImg = imagesRef.current[0];
    if (firstImg) {
      if (firstImg.complete) {
        renderFrame(0);
      } else {
        firstImg.onload = () => renderFrame(0);
      }
    }

    let animationFrameId;
    const updateLoop = () => {
      const progress = scrollYProgress.get();
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(progress * frameCount)
      );
      renderFrame(Math.max(0, frameIndex));
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    animationFrameId = requestAnimationFrame(updateLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollYProgress]);

  return (
    <section ref={containerRef} style={{ position: 'relative', height: '600vh', background: '#030712' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        <canvas 
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.75,
            zIndex: 0
          }}
        />

        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: 'transparent' }} />}>
            <HeroScene />
          </Suspense>
        </div>

        <div style={{ position: 'absolute', inset: '0 0 0 0', background: 'linear-gradient(to top, #030712 0%, transparent 40%)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, #030712 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '3rem 1.5rem', maxWidth: 860, margin: '0 auto', userSelect: 'none', background: 'radial-gradient(circle at center, rgba(3,7,18,0.65) 0%, rgba(3,7,18,0.3) 40%, transparent 75%)', borderRadius: '50%' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              border: '1px solid rgba(217, 119, 6,0.4)', background: 'rgba(217, 119, 6,0.1)',
              borderRadius: 999, padding: '0.35rem 1rem',
              fontSize: '0.72rem', color: '#fbbf24', marginBottom: '1.75rem',
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d97706', animation: 'border-glow 1.5s ease infinite' }} />
            MobileNetV2 · 36 ISL Classes · HuggingFace Spaces
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16,1,0.3,1] }}
            style={{ fontWeight: 900, lineHeight: 0.95, marginBottom: '1.25rem', textShadow: '0 12px 40px rgba(0,0,0,0.9)' }}
          >
            <span style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', color: '#fff', display: 'block' }}>Read every</span>
            <span className="gradient-text" style={{ fontSize: 'clamp(3.5rem, 10vw, 7.5rem)', display: 'block', textShadow: '0 12px 40px rgba(217, 119, 6,0.4)' }}>sign.</span>
            <span style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', color: 'rgba(255,255,255,0.4)', fontWeight: 400, display: 'block', textShadow: '0 8px 30px rgba(0,0,0,0.8)' }}>instantly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1.05rem)', color: '#cbd5e1', maxWidth: 500, margin: '0 auto 2.25rem', lineHeight: 1.7, textShadow: '0 4px 16px rgba(0,0,0,0.9)', fontWeight: 500 }}
          >
            Deep learning powered ISL classifier. 
            <br/>Upload a hand gesture image and get instant,
            accurate recognition backed by a 6-architecture benchmark.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.55 }}
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/predict" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.75rem 1.75rem' }}>
              🤟 Upload Image
            </Link>
            <Link to="/live" className="btn-ghost" style={{ fontSize: '0.9rem', padding: '0.75rem 1.75rem', border: '1px solid rgba(217, 119, 6, 0.5)', color: '#fbbf24' }}>
              📷 Live Camera
            </Link>
            <a href="#how-it-works" className="btn-ghost" style={{ fontSize: '0.9rem', padding: '0.75rem 1.75rem' }}>
              How it works ↓
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', zIndex: 10 }}
        >
          <span style={{ fontSize: '0.6rem', color: '#1e293b', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #d97706, transparent)', margin: '0 auto' }}
          />
        </motion.div>
      </div>
    </section>
  )
}

/* ── Marquee ── */
function Marquee() {
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: '#030712', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: '0 auto 0 0', width: 80, background: 'linear-gradient(to right, #030712, transparent)', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: '0 0 0 auto', width: 80, background: 'linear-gradient(to left, #030712, transparent)', zIndex: 1 }} />
      <div className="marquee-track" style={{ padding: '1.25rem 0', gap: '2.5rem', alignItems: 'center' }}>
        {[...SIGNS, ...SIGNS].map((s, i) => (
          <span key={i} style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.03)', cursor: 'default', transition: 'color 200ms' }}
            onMouseOver={e => e.target.style.color = 'rgba(217, 119, 6,0.3)'}
            onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.03)'}
          >{s}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Stats ── */
function Stats() {
  const stats = [
    { value: '36',   label: 'ISL Classes',   sub: 'A–Z · 0-9' },
    { value: '100%',  label: 'Val Accuracy',  sub: 'MobileNetV2' },
    { value: '6',    label: 'Models Tested', sub: 'Benchmarked' },
    { value: '<1s',  label: 'Inference',     sub: 'CPU inference' },
  ]
  return (
    <section className="section-sm" style={{ background: '#040d1a' }}>
      <div className="container">
        <div className="grid-4">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.55, ease: [0.16,1,0.3,1] }}
              style={{ textAlign: 'center' }}
            >
              <p className="gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginTop: '0.4rem' }}>{s.label}</p>
              <p style={{ fontSize: '0.7rem', color: '#334155', marginTop: '0.2rem' }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── How it works ── */
function HowItWorks() {
  const steps = [
    { num: '01', icon: '📸', title: 'Upload a photo',    desc: 'Capture or upload any ISL hand gesture. JPEG, PNG, or WebP — real-world unconstrained images accepted.' },
    { num: '02', icon: '🧠', title: 'AI processes it',   desc: 'Your image runs through MobileNetV2 — the winner of our 6-model benchmark — on our always-on HuggingFace backend.' },
    { num: '03', icon: '✅', title: 'Instant result',    desc: 'Get the predicted ISL sign with confidence score and top-5 candidates in under one second.' },
  ]
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <motion.span variants={fadeUp} className="section-label">Process</motion.span>
          <motion.h2 variants={fadeUp} className="section-title">Three steps to recognition</motion.h2>
        </motion.div>

        <div className="grid-3">
          {steps.map((step, i) => (
            <motion.div key={step.num}
              initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.65, ease: [0.16,1,0.3,1] }}
              className="glass-card"
              style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{step.icon}</span>
                <span style={{ fontSize: '2.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)', fontFamily: 'monospace', lineHeight: 1 }}>{step.num}</span>
              </div>
              <h3 style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem', fontSize: '1rem' }}>{step.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.65 }}>{step.desc}</p>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(217, 119, 6,0.07), transparent 60%)', pointerEvents: 'none' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Models ── */
function Models() {
  const models = [
    { name: 'MobileNetV2',     icon: '🏆', badge: 'Winner',     desc: 'Best accuracy + speed combo. The deployed model.', win: true },
    { name: 'EfficientNet-B0', icon: '⚡', badge: 'Runner-up',  desc: 'Highly efficient with strong generalisation.', win: false },
    { name: 'ResNet18',        icon: '🔷', badge: 'Solid',      desc: 'Deep residual connections, reliable output.', win: false },
    { name: 'VGG16',           icon: '🏛', badge: 'Classic',    desc: 'Strong baseline with deep conv features.', win: false },
    { name: 'CNN + Dropout',   icon: '🧱', badge: 'Custom',     desc: 'Regularised scratch-built CNN.', win: false },
    { name: 'SimpleCNN',       icon: '🌱', badge: 'Baseline',   desc: 'Lightweight scratch CNN for benchmarking.', win: false },
  ]
  return (
    <section className="section" style={{ background: '#040d1a' }}>
      <div className="container">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <motion.span variants={fadeUp} className="section-label">Architecture</motion.span>
          <motion.h2 variants={fadeUp} className="section-title">6 models. 1 winner.</motion.h2>
          <motion.p variants={fadeUp} className="section-sub">
            We trained six architectures head-to-head on the same ISL dataset — from scratch-built CNNs to pretrained transfer-learning giants.
          </motion.p>
        </motion.div>

        <div className="grid-3">
          {models.map((m, i) => (
            <motion.div key={m.name}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16,1,0.3,1] }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              style={{
                borderRadius: '1rem', padding: '1.25rem', position: 'relative', overflow: 'hidden',
                border: m.win ? '1px solid rgba(217, 119, 6,0.45)' : '1px solid rgba(255,255,255,0.05)',
                background: m.win ? 'rgba(217, 119, 6,0.1)' : 'rgba(15,23,42,0.7)',
                cursor: 'default',
              }}
            >
              {m.win && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #d97706, transparent)' }} />}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{m.icon}</span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 999,
                  border: m.win ? '1px solid rgba(217, 119, 6,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  background: m.win ? 'rgba(217, 119, 6,0.2)' : 'rgba(255,255,255,0.04)',
                  color: m.win ? '#fbbf24' : '#475569',
                }}>{m.badge}</span>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: m.win ? '#fff' : '#94a3b8', marginBottom: '0.4rem' }}>{m.name}</h3>
              <p style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.5 }}>{m.desc}</p>
              {m.win && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(217, 119, 6,0.12), transparent 55%)', pointerEvents: 'none' }} />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA ── */
function CTA() {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.75, ease: [0.16,1,0.3,1] }}
          className="teal-card bg-grid"
          style={{
            padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 4rem)',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
            background: 'radial-gradient(ellipse at 50% -10%, rgba(217, 119, 6,0.22), #07101e 55%)',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: 200, height: 200, background: 'rgba(217, 119, 6,0.1)', borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

          <motion.div
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            style={{ fontSize: '3.5rem', marginBottom: '1.25rem', display: 'inline-block' }}
          >🤟</motion.div>

          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
            Ready to classify a sign?
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', maxWidth: 440, margin: '0 auto 2rem', lineHeight: 1.65 }}>
            Upload any ISL hand gesture and our AI identifies it in real time with a confidence score and top-5 breakdown.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/predict" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.85rem 2.25rem' }}>
              Open Image Upload →
            </Link>
            <Link to="/live" className="btn-ghost" style={{ fontSize: '0.95rem', padding: '0.85rem 2.25rem', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              Open Live Camera →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 border-t border-white/5 text-center">
      <p className="text-xs text-slate-700">
        ISL Recognition · React + Vite + Three.js · Trained on Kaggle P100 · Deployed on HuggingFace Spaces
      </p>
    </footer>
  )
}

// ── Page export ────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <Header />
      <Hero />
      <Marquee />
      <Stats />
      <HowItWorks />
      <Models />
      <CTA />
      <Footer />
    </div>
  )
}