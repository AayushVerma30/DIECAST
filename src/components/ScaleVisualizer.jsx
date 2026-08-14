import React, { useState } from 'react'
import { Ruler, Smartphone, Layers, Info } from 'lucide-react'

export default function ScaleVisualizer() {
  const [activeScale, setActiveScale] = useState('1:64')

  const scaleDetails = {
    '1:64': {
      title: '1:64 Pocket Precision Scale',
      brands: 'Hot Wheels, Matchbox, Mini GT, Tomica Limited',
      length: '7.5 cm (approx 3 inches)',
      weight: '40g - 155g (Metal/Metal)',
      widthPx: 80,
      heightPx: 32,
      desc: 'The iconic standard scale for Hot Wheels & Matchbox. Highly collectible, pocket-sized, with Real Riders rubber tires and metal chassis.'
    },
    '1:43': {
      title: '1:43 European Heritage Scale',
      brands: 'Spark, Minichamps, IXO Models, Kyosho',
      length: '11.0 cm (approx 4.5 inches)',
      weight: '220g - 400g',
      widthPx: 140,
      heightPx: 52,
      desc: 'The quintessential scale for classic Formula 1, Le Mans prototypes, and European rally collector cabinets.'
    },
    '1:24': {
      title: '1:24 Muscle & Custom Scale',
      brands: 'Jada Toys, Franklin Mint, Bburago, Welly',
      length: '19.5 cm (approx 7.8 inches)',
      weight: '650g - 900g',
      widthPx: 220,
      heightPx: 75,
      desc: 'Mid-size display models with opening front hoods, detailed engine bays, opening doors, and steerable rubber wheels.'
    },
    '1:18': {
      title: '1:18 Large Masterpiece Scale',
      brands: 'AutoArt, Kyosho, GT Spirit, CMC, Bburago',
      length: '26.0 cm (approx 10.2 inches)',
      weight: '1,100g - 1,600g (Heavy Cast)',
      widthPx: 290,
      heightPx: 95,
      desc: 'Ultimate museum-grade showcase scale featuring full working suspension, authentic interior carpeting, opening trunk/bonnet, and plumbed twin-turbos.'
    }
  }

  const current = scaleDetails[activeScale]

  return (
    <section id="scale-guide" className="scale-visualizer-section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            <Ruler size={16} color="var(--accent-amber)" />
            <span>COLLECTOR SCALE SIZE GUIDE</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Interactive Scale Size Visualizer
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Compare diecast scale dimensions side-by-side against a standard 6.1" smartphone to understand true physical proportions.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {Object.keys(scaleDetails).map((scale) => (
              <button
                key={scale}
                className={`scale-pill-btn ${activeScale === scale ? 'active' : ''}`}
                style={{ fontSize: '0.95rem', padding: '0.5rem 1.25rem' }}
                onClick={() => setActiveScale(scale)}
              >
                Scale {scale}
              </button>
            ))}
          </div>
        </div>

        <div className="scale-compare-display">
          {/* Smartphone for scale reference */}
          <div className="scale-box-item">
            <div 
              className="scale-visual-phone" 
              style={{ width: '150px', height: '75px' }}
            >
              <div style={{ textAlign: 'center' }}>
                <Smartphone size={18} style={{ margin: '0 auto 2px', opacity: 0.8 }} />
                <div>6.1" Smartphone</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>14.7 cm ref</div>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reference Object</span>
          </div>

          {/* Active Diecast scale visual */}
          <div className="scale-box-item">
            <div 
              className="scale-visual-car" 
              style={{ 
                width: `${current.widthPx}px`, 
                height: `${current.heightPx}px`,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {activeScale}
            </div>
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>
              {current.length}
            </span>
          </div>
        </div>

        {/* Details Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.75rem', maxWidth: '800px', margin: '2rem auto 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          <div>
            <span style={{ color: 'var(--accent-red)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Scale Profile
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.3rem 0 0.6rem' }}>{current.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>{current.desc}</p>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Average Physical Length</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>{current.length}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Casting Net Weight</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>{current.weight}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Primary Brands</span>
              <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{current.brands}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
