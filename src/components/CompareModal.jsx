import React from 'react'
import { X, Check, Minus, ShoppingBag, Eye } from 'lucide-react'

export default function CompareModal({ 
  isOpen, 
  onClose, 
  compareCars, 
  onRemoveCompareCar, 
  onClearCompare, 
  onAddToCart,
  onSelectCar 
}) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog" 
        style={{ gridTemplateColumns: '1fr', maxWidth: '1000px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Diecast Model Comparison</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Comparing specifications across {compareCars.length} selected collector castings.
              </p>
            </div>
            {compareCars.length > 0 && (
              <button 
                className="btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                onClick={onClearCompare}
              >
                Clear All
              </button>
            )}
          </div>

          {compareCars.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <p>No models selected for comparison.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Click the "Compare" button on any car card in the vault to add it here.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th style={{ width: '200px' }}>Specification</th>
                    {compareCars.map((car) => (
                      <th key={car.id} style={{ minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: 'var(--accent-red)', fontWeight: 800 }}>{car.scale}</span>
                          <button 
                            onClick={() => onRemoveCompareCar(car.id)}
                            style={{ color: 'var(--text-muted)' }}
                            title="Remove from comparison"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <img 
                          src={car.images[0]} 
                          alt={car.name} 
                          style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} 
                        />
                        <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>{car.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price</td>
                    {compareCars.map((car) => (
                      <td key={car.id} className="highlight" style={{ fontSize: '1.2rem', color: 'var(--accent-amber)' }}>
                        ₹{car.price.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Brand / Collector Line</td>
                    {compareCars.map((car) => (
                      <td key={car.id} className="highlight">{car.brand}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Series / Edition</td>
                    {compareCars.map((car) => (
                      <td key={car.id}>{car.limitedEdition}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Material Construction</td>
                    {compareCars.map((car) => (
                      <td key={car.id}>{car.material}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Casting Weight</td>
                    {compareCars.map((car) => (
                      <td key={car.id}>{car.weight}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Scale Dimensions</td>
                    {compareCars.map((car) => (
                      <td key={car.id}>{car.dimensions}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Tire & Wheel Type</td>
                    {compareCars.map((car) => (
                      <td key={car.id}>
                        {car.features.some(f => f.toLowerCase().includes('real riders') || f.toLowerCase().includes('rubber')) ? (
                          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={16} /> Real Riders™ Rubber
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Precision Hard Cast</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Action</td>
                    {compareCars.map((car) => (
                      <td key={car.id}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <button 
                            className="btn-card-action"
                            style={{ flex: 1, justifyContent: 'center' }}
                            onClick={() => {
                              onSelectCar(car)
                              onClose()
                            }}
                          >
                            <Eye size={14} /> View
                          </button>
                          <button 
                            className="btn-card-action"
                            style={{ background: 'var(--accent-red)', flex: 1, justifyContent: 'center' }}
                            onClick={() => {
                              onAddToCart(car)
                              onClose()
                            }}
                          >
                            <ShoppingBag size={14} /> Add
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
