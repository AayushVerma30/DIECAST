import React from 'react'
import { Sparkles, ArrowRight, Eye, Flame } from 'lucide-react'

export default function Hero({ featuredCar, onSelectCar, onSelectBrand, selectedBrand }) {
  const brandLines = ["ALL", "Hot Wheels Premium", "Matchbox Collectors", "Hot Wheels Elite", "Mini GT x Hot Wheels"]

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-badge">
              <Flame size={16} color="var(--accent-red)" />
              <span>OFFICIAL HOT WHEELS & MATCHBOX COLLECTOR VAULT</span>
            </div>

            <h1 className="hero-title">
              Diecast Metal. <br />
              <span className="highlight">Hot Wheels & Matchbox</span> Classics.
            </h1>

            <p className="hero-subtitle">
              Authentic 1:64 Metal/Metal™ diecast castings, Real Riders™ soft rubber tires, 
              collector blister cards, and vintage Matchbox display podiums.
            </p>

            <div className="hero-cta-group">
              <a href="#showcase" className="btn-primary">
                Explore Diecast Vault <ArrowRight size={18} />
              </a>
              {featuredCar && (
                <button 
                  className="btn-secondary"
                  onClick={() => onSelectCar(featuredCar)}
                >
                  <Eye size={18} /> View Blister Pack & Specs
                </button>
              )}
            </div>

            <div className="scale-pills">
              {brandLines.map(line => (
                <button
                  key={line}
                  className={`scale-pill-btn ${selectedBrand === line ? 'active' : ''}`}
                  onClick={() => {
                    onSelectBrand(line)
                    const el = document.getElementById('showcase')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {line === 'ALL' ? 'All Diecast Collections' : line}
                </button>
              ))}
            </div>
          </div>

          {featuredCar && (
            <div className="hero-card" onClick={() => onSelectCar(featuredCar)} style={{ cursor: 'pointer' }}>
              <div className="hero-img-wrapper">
                <img 
                  src={featuredCar.images[0]} 
                  alt={featuredCar.name} 
                  className="hero-img"
                />
                <span className="card-badge" style={{ position: 'absolute', top: '15px', left: '15px' }}>
                  {featuredCar.badge}
                </span>
                <span className="card-scale" style={{ position: 'absolute', top: '15px', right: '15px' }}>
                  {featuredCar.scale}
                </span>
              </div>
              <div className="hero-card-meta">
                <div>
                  <div className="hero-card-scale">{featuredCar.brand} · {featuredCar.year}</div>
                  <h3 className="hero-card-title">{featuredCar.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {featuredCar.material}
                  </div>
                </div>
                <div>
                  <div className="hero-card-price">₹{featuredCar.price.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
