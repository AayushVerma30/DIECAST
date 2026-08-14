import React from 'react'
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onClearCart 
}) {
  if (!isOpen) return null

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="drawer-header">
          <h3 className="drawer-title">
            <ShoppingBag size={20} color="var(--accent-red)" />
            Vault Cart ({cartItems.reduce((cnt, item) => cnt + item.quantity, 0)})
          </h3>
          <button className="nav-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p>Your Vault Cart is empty</p>
            <button 
              className="btn-secondary" 
              style={{ marginTop: '1rem', fontSize: '0.85rem' }}
              onClick={onClose}
            >
              Discover Models
            </button>
          </div>
        ) : (
          <div className="drawer-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.images[0]} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-scale">Scale {item.scale} · Qty: {item.quantity}</div>
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
                <button 
                  className="cart-item-remove"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-total-row">
              <span>Total Value</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => alert(`Order initiated for ₹${total.toLocaleString('en-IN')}! Authenticated and insured dispatch ready.`)}
            >
              Secure Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
