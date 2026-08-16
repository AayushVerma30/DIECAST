import React, { useState } from 'react'
import { X, CheckCircle2, ShoppingBag, Shield, Award, Sparkles, Truck } from 'lucide-react'

export default function CarModal({ car, onClose, onAddToCart }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0)

  if (!car) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Gallery */}
        <div className="modal-gallery">
          <img 
            src={car.images?.[activeImgIndex] || car.images?.[0] || ''} 
            alt={car.name} 
            className="modal-main-img" 
          />
          {car.images && car.images.length > 1 && (
            <div className="modal-thumbs">
              {car.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`modal-thumb-btn ${activeImgIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImgIndex(idx)}
                >
                  <img src={img} alt="Thumbnail" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clean Spec Details */}
        <div className="modal-details">
          <div className="modal-scale-badge">Scale {car.scale}</div>
          <h2 className="modal-title">{car.name}</h2>
          
          <div style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={15} /> {car.limitedEdition || 'Collector Series'}
          </div>

          <div className="modal-meta-grid">
            <div>
              <span className="meta-item-label">Brand</span>
              <span className="meta-item-val">{car.brand}</span>
            </div>
            <div>
              <span className="meta-item-label">Material</span>
              <span className="meta-item-val">{car.material || 'Diecast Metal'}</span>
            </div>
            <div>
              <span className="meta-item-label">Weight</span>
              <span className="meta-item-val">{car.weight || '~140g'}</span>
            </div>
            <div>
              <span className="meta-item-label">Dimensions</span>
              <span className="meta-item-val">{car.dimensions || 'Standard 1:64'}</span>
            </div>
          </div>

          <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Key Features
          </h4>
          <ul className="modal-features-list">
            {(car.features || []).map((feature, idx) => (
              <li key={idx}>
                <CheckCircle2 size={15} color="var(--accent-amber)" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="modal-actions">
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                ₹{car.price ? car.price.toLocaleString('en-IN') : '0'}
              </span>
            </div>

            <button 
              className="btn-primary"
              onClick={() => {
                onAddToCart(car)
                onClose()
              }}
            >
              <ShoppingBag size={17} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
