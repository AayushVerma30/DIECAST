import React from 'react'
import { Heart, Eye, Star, Wrench } from 'lucide-react'

export default function CarCard({ 
  car, 
  onSelectCar, 
  isWishlisted, 
  onToggleWishlist,
  onAddToCart 
}) {
  return (
    <div className="car-card">
      <div className="card-media">
        <img 
          src={car.images[0]} 
          alt={car.name} 
          className="card-img" 
          loading="lazy" 
        />
        <span className="card-badge">{car.badge}</span>
        <span className="card-scale">{car.scale}</span>
        <button 
          className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist(car.id)
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? "#fff" : "transparent"} />
        </button>
      </div>

      <div className="card-content">
        <div className="card-specs-row">
          <span>{car.brand}</span>
          <span>•</span>
          <span>{car.year}</span>
          <span>•</span>
          <span style={{ color: 'var(--accent-amber)' }}>
            <Star size={13} fill="currentColor" /> {car.rating}
          </span>
        </div>

        <h3 className="card-title">{car.name}</h3>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <Wrench size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          {car.weight} · {car.category}
        </div>

        <div className="card-footer">
          <div className="card-price">₹{car.price.toLocaleString('en-IN')}</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn-card-action"
              onClick={() => onSelectCar(car)}
            >
              <Eye size={15} /> Specs
            </button>
            <button 
              className="btn-card-action"
              style={{ background: 'var(--accent-red)' }}
              onClick={() => onAddToCart(car)}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
