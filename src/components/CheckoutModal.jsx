import React, { useState } from 'react'
import { X, ShieldCheck, CheckCircle2, Truck, CreditCard, QrCode, Banknote, ArrowRight } from 'lucide-react'

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  onOrderSuccess 
}) {
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [formData, setFormData] = useState({
    name: 'Suresh Verma',
    phone: '+91 98765 43210',
    email: 'suresh@diecast.vault',
    address: 'Flat 402, Skyline Towers, Sector 18',
    city: 'New Delhi',
    pincode: '110001',
    upiId: 'suresh@okhdfcbank'
  })
  const [isOrdered, setIsOrdered] = useState(false)
  const [orderId, setOrderId] = useState('')

  if (!isOpen) return null

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()
    const generatedId = `DC-IND-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderId(generatedId)
    setIsOrdered(true)

    const paymentLabel = paymentMethod === 'upi' ? `UPI (${formData.upiId})` : (paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery')

    const newOrderObj = {
      id: generatedId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "In Transit",
      statusKey: "in-transit",
      currentStep: 3,
      items: [...cartItems],
      totalAmount: totalAmount,
      paymentMethod: paymentLabel,
      shippingAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`
    }

    const newTxnObj = {
      id: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      method: paymentLabel,
      status: "Paid",
      amount: totalAmount
    }

    if (onOrderSuccess) {
      onOrderSuccess(newOrderObj, newTxnObj)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog" 
        style={{ gridTemplateColumns: '1fr', maxWidth: '620px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {!isOrdered ? (
          <div style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <ShieldCheck size={22} color="var(--accent-red)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Collector Secure Checkout</h2>
            </div>

            {/* Cart summary preview */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                <span>Vault Models ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                <span>Insured Collector Packaging</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#fff', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent-amber)' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder}>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                Shipping Address
              </h4>
              <div className="checkout-form-grid">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="checkout-input"
                />
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Mobile Number" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="checkout-input"
                />
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Address / Street" 
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="checkout-input"
                  style={{ gridColumn: 'span 2' }}
                />
                <input 
                  type="text" 
                  name="city" 
                  placeholder="City" 
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="checkout-input"
                />
                <input 
                  type="text" 
                  name="pincode" 
                  placeholder="PIN Code" 
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  className="checkout-input"
                />
              </div>

              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                Payment Method
              </h4>
              <div className="payment-methods-grid">
                <div 
                  className={`payment-method-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <QrCode size={18} style={{ margin: '0 auto 4px', display: 'block' }} />
                  <span>UPI / GPay</span>
                </div>
                <div 
                  className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={18} style={{ margin: '0 auto 4px', display: 'block' }} />
                  <span>Card</span>
                </div>
                <div 
                  className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <Banknote size={18} style={{ margin: '0 auto 4px', display: 'block' }} />
                  <span>Cash on Delivery</span>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div style={{ marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    name="upiId" 
                    placeholder="Enter UPI ID (e.g. mobile@upi)" 
                    value={formData.upiId}
                    onChange={handleInputChange}
                    className="checkout-input"
                    required
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                Confirm Order (₹{totalAmount.toLocaleString('en-IN')}) <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="order-success-card">
            <div className="order-success-icon">
              <CheckCircle2 size={32} />
            </div>
            <span style={{ color: 'var(--accent-red)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              ORDER PLACED SUCCESSFULLY
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.3rem 0 0.5rem' }}>
              Thank You, {formData.name}!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 1.25rem' }}>
              Your order has been recorded in your Collector Purchases Tracker with real-time tracking.
            </p>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', maxWidth: '400px', margin: '0 auto 1.25rem', textAlign: 'left', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tracking ID:</span>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: '#60a5fa', fontWeight: 600 }}>In Transit (Air Express)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery PIN:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{formData.pincode}</span>
              </div>
            </div>

            <button 
              className="btn-primary"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
