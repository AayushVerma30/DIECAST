import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-simple-content">
          <div className="brand-logo">
            <span style={{ color: 'var(--accent-red)' }}>✦</span> DIECAST <span className="brand-badge">VAULT</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.75rem 0 1.25rem', maxWidth: '480px' }}>
            A curated showcase of Hot Wheels, Matchbox, and miniature diecast toy cars.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Disclaimer: This is a fan and collector showcase application. Not an official Mattel, Hot Wheels, or Matchbox website.
          </div>
        </div>
      </div>
    </footer>
  )
}
