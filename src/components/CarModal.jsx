import React, { useState } from 'react'
import { X, CheckCircle2, ShoppingBag, Shield, Award, Sparkles, Truck } from 'lucide-react'

export default function CarModal({ car, onClose, onAddToCart }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0)

  if (!car) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Gallery */}
        <div className="modal-gallery">
          <img 
            src={car.images[activeImgIndex] || car.images[0]} 
            alt={car.name} 
            className="modal-main-img" 
          />
          {car.images.length > 1 && (
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

        {/* Details */}
        <div className="modal-details">
          <div className="modal-scale-badge">Scale {car.scale}</div>
          <h2 className="modal-title">{car.name}</h2>
          
          <div style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={16} /> {car.limitedEdition}
          </div>

          <div className="modal-meta-grid">
            <div>
              <span className="meta-item-label">Material</span>
              <span className="meta-item-val">{car.material}</span>
            </div>
            <div>
              <span className="meta-item-label">Net Weight</span>
              <span className="meta-item-val">{car.weight}</span>
            </div>
            <div>
              <span className="meta-item-label">Dimensions</span>
              <span className="meta-item-val">{car.dimensions}</span>
            </div>
            <div>
              <span className="meta-item-label">Color Code</span>
              <span className="meta-item-val">{car.color}</span>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Precision Engineering Features
          </h4>
          <ul className="modal-features-list">
            {car.features.map((feature, idx) => (
              <li key={idx}>
                <CheckCircle2 size={16} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Shield size={14} color="#10b981" /> Serialized Plaque Included
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Truck size={14} color="#3b82f6" /> Insured Collector Freight
            </span>
          </div>

          <div className="modal-actions">
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Collector Price</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                ₹{car.price.toLocaleString('en-IN')}
              </span>
            </div>

            <button 
              className="btn-primary"
              onClick={() => {
                onAddToCart(car)
                onClose()
              }}
            >
              <ShoppingBag size={18} /> Add To Vault Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
