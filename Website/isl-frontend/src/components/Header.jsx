import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(3,7,18,0.25)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    }}>
      <div className="container" style={{ paddingTop: '0.875rem', paddingBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: '#01696f',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              flexShrink: 0,
            }}>🤟</div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                ISL Recognition
              </p>
              <p style={{ fontSize: '0.68rem', color: '#475569', margin: 0 }}>
                Indian Sign Language · AI
              </p>
            </div>
          </Link>

          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isHome ? (
              <>
                <Link to="/predict" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1.1rem' }}>
                  Try Demo →
                </Link>
              </>
            ) : (
              <>
                <Link to="/" style={{
                  fontSize: '0.8rem', color: '#64748b', textDecoration: 'none',
                  transition: 'color 150ms',
                }}
                  onMouseOver={e => e.target.style.color = '#fff'}
                  onMouseOut={e => e.target.style.color = '#64748b'}
                >
                  ← Home
                </Link>
                {pathname !== '/live' && (
                  <Link to="/live"
                    style={{
                      fontSize: '0.8rem', color: '#64748b', textDecoration: 'none',
                      transition: 'color 150ms',
                    }}
                    onMouseOver={e => e.target.style.color = '#fff'}
                    onMouseOut={e => e.target.style.color = '#64748b'}
                  >
                    📷 Live
                  </Link>
                )}
                {pathname !== '/predict' && (
                  <Link to="/predict"
                    style={{
                      fontSize: '0.8rem', color: '#64748b', textDecoration: 'none',
                      transition: 'color 150ms',
                    }}
                    onMouseOver={e => e.target.style.color = '#fff'}
                    onMouseOut={e => e.target.style.color = '#64748b'}
                  >
                    Upload
                  </Link>
                )}
                <a
                  href={`${import.meta.env.VITE_API_URL || '#'}/health`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    fontSize: '0.7rem', color: '#64748b', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
                    padding: '0.35rem 0.85rem', background: 'rgba(255,255,255,0.04)',
                  }}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#34d399',
                    animation: 'shimmer 2s ease infinite',
                  }} />
                  API Live
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}