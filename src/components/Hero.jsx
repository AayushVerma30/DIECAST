import React, { useState, useRef } from 'react'
import { Sparkles, ArrowRight, Eye, Flame } from 'lucide-react'

export default function Hero({ featuredCar, onSelectCar, onSelectBrand, selectedBrand }) {
  const brandLines = ["ALL", "Hot Wheels", "Matchbox", "Mini GT"]
  
  // 3D Interactive Tilt on Mouse Move
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100

    setTilt({ x: rotateX, y: rotateY, glareX, glareY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 })
  }

  return (
    <section className="hero-section">
      {/* Background dynamic ambient glows */}
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <Flame size={15} color="var(--accent-red)" />
              <span>PRECISION DIECAST COLLECTION</span>
            </div>

            <h1 className="hero-title">
              Small Scale. <br />
              <span className="highlight">Pure Heavy Metal</span> Art.
            </h1>

            <p className="hero-subtitle">
              Curated collection of authentic Hot Wheels Premium, Matchbox Collectors, 
              and Real Riders™ 1:64 scale diecast castings.
            </p>

            <div className="hero-cta-group">
              <a href="#showcase" className="btn-primary">
                Explore Vault <ArrowRight size={18} />
              </a>
              {featuredCar && (
                <button 
                  className="btn-secondary"
                  onClick={() => onSelectCar(featuredCar)}
                >
                  <Eye size={18} /> View Specs
                </button>
              )}
            </div>

            {/* Clean minimal brand filter pills */}
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
                  {line === 'ALL' ? 'All Models' : line}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Tilt Showcase Card with Glare Effect */}
          {featuredCar && (
            <div 
              ref={cardRef}
              className="hero-tilt-wrapper"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              onClick={() => onSelectCar(featuredCar)}
              style={{
                perspective: '1000px'
              }}
            >
              <div 
                className="hero-card hero-3d-card"
                style={{
                  transform: isHovered 
                    ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)` 
                    : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                  transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
                }}
              >
                {/* Dynamic light reflection glare */}
                <div 
                  className="card-glare"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`,
                    opacity: isHovered ? 1 : 0
                  }}
                />

                <div className="hero-img-wrapper">
                  <img 
                    src={featuredCar.images[0]} 
                    alt={featuredCar.name} 
                    className="hero-img"
                  />
                  <span className="card-badge">
                    {featuredCar.badge}
                  </span>
                  <span className="card-scale">
                    {featuredCar.scale}
                  </span>
                </div>

                <div className="hero-card-meta">
                  <div>
                    <div className="hero-card-scale">{featuredCar.brand}</div>
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
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
