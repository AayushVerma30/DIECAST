import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-simple-content">
          <div className="brand-logo">
            <span style={{ color: 'var(--accent-red)' }}>✦</span> DIECAST <span className="brand-badge">VAULT</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.75rem 0 1.5rem', maxWidth: '460px' }}>
            Precision Hot Wheels & Matchbox collector diecast models. 1:64 Metal/Metal™ castings with Real Riders™ rubber tires.
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} DIECAST VAULT. All diecast models and trademarks belong to their respective creators.
          </div>
        </div>
      </div>
    </footer>
  )
}
