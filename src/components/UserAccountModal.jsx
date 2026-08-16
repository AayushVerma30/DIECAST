import React, { useState, useRef } from 'react'
import { X, Package, Receipt, User, Clock, CheckCircle2, Truck, ShieldCheck, ArrowUpRight, Eye, Settings, Save, Sparkles, Car, Camera, Trash2, Upload } from 'lucide-react'

export default function UserAccountModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  onUpdateProfile, 
  orders, 
  transactions,
  onSelectCar,
  onAddToast
}) {
  const [activeTab, setActiveTab] = useState('garage')
  const fileInputRef = useRef(null)

  // Editable Profile Form state with Avatar
  const [profileForm, setProfileForm] = useState({
    name: userProfile.name || 'Suresh Verma',
    email: userProfile.email || 'suresh@diecast.vault',
    phone: userProfile.phone || '+91 98765 43210',
    city: userProfile.city || 'New Delhi',
    pincode: userProfile.pincode || '110001',
    tier: userProfile.tier || 'Gold Collector Tier',
    avatar: userProfile.avatar || null
  })

  if (!isOpen) return null

  // Extract all cars owned in Garage from orders
  const garageCars = orders.flatMap(order => 
    order.items.map(item => ({
      ...item,
      orderId: order.id,
      orderDate: order.date,
      orderStatus: order.status
    }))
  )

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalModelsPurchased = garageCars.reduce((cnt, i) => cnt + (i.quantity || 1), 0)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm(prev => ({ ...prev, [name]: value }))
  }

  // Handle Photo / Profile Picture File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      if (onAddToast) onAddToast("Image file must be under 5MB", "info")
      return
    }

    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target.result
      const updated = { ...profileForm, avatar: base64Url }
      setProfileForm(updated)
      if (onUpdateProfile) {
        onUpdateProfile(updated)
      }
      if (onAddToast) {
        onAddToast("Profile photo uploaded successfully!", "success")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    const updated = { ...profileForm, avatar: null }
    setProfileForm(updated)
    if (onUpdateProfile) {
      onUpdateProfile(updated)
    }
    if (onAddToast) {
      onAddToast("Profile photo removed", "info")
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (onUpdateProfile) {
      onUpdateProfile(profileForm)
    }
    if (onAddToast) {
      onAddToast("Profile details updated successfully!", "success")
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog" 
        style={{ gridTemplateColumns: '1fr', maxWidth: '820px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-content-pad">
          {/* User Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div 
                className="user-avatar-circle" 
                style={{ width: '52px', height: '52px', fontSize: '1.3rem', cursor: 'pointer' }}
                onClick={() => setActiveTab('profile')}
                title="Click to change profile picture"
              >
                {profileForm.avatar ? (
                  <img src={profileForm.avatar} alt="Profile" />
                ) : (
                  profileForm.name ? profileForm.name.charAt(0) : 'U'
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{profileForm.name}</h2>
                  <span className="brand-badge" style={{ fontSize: '0.65rem', background: '#eab308' }}>
                    {profileForm.tier}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {profileForm.email} · {profileForm.phone} · {profileForm.city}
                </p>
              </div>
            </div>

            <button 
              className={`scale-pill-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem' }}
            >
              <Settings size={14} /> Profile & Photo
            </button>
          </div>

          {/* Quick Clickable Stat Cards */}
          <div className="account-stats-row">
            <div 
              className="account-stat-card" 
              style={{ cursor: 'pointer', border: activeTab === 'garage' ? '1px solid var(--accent-red)' : '1px solid var(--border-subtle)' }}
              onClick={() => setActiveTab('garage')}
              title="Click to view all cars in Garage"
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cars in Garage</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '2px' }}>
                {totalModelsPurchased} Models
              </div>
            </div>

            <div 
              className="account-stat-card"
              style={{ cursor: 'pointer', border: activeTab === 'orders' ? '1px solid var(--accent-red)' : '1px solid var(--border-subtle)' }}
              onClick={() => setActiveTab('orders')}
              title="Click to view Orders & Tracking"
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders Placed</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {orders.length} Orders
              </div>
            </div>

            <div 
              className="account-stat-card"
              style={{ cursor: 'pointer', border: activeTab === 'transactions' ? '1px solid var(--accent-red)' : '1px solid var(--border-subtle)' }}
              onClick={() => setActiveTab('transactions')}
              title="Click to view Transactions"
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Spent</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                ₹{totalSpent.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="account-tabs">
            <button 
              className={`account-tab-btn ${activeTab === 'garage' ? 'active' : ''}`}
              onClick={() => setActiveTab('garage')}
            >
              <Car size={16} /> My Garage ({totalModelsPurchased})
            </button>
            <button 
              className={`account-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={16} /> Track Orders ({orders.length})
            </button>
            <button 
              className={`account-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <Receipt size={16} /> Transactions ({transactions.length})
            </button>
            <button 
              className={`account-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <Camera size={16} /> Profile & Photo
            </button>
          </div>

          {/* Tab 1: My Garage (Working Cars in Garage) */}
          {activeTab === 'garage' && (
            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {garageCars.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  <Car size={40} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                  <p>Your Collector Garage is empty.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>
                    Purchased diecast castings will automatically be parked in your garage!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {garageCars.map((car, idx) => (
                    <div 
                      key={idx} 
                      className="car-card" 
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.85rem' }}
                    >
                      <div style={{ position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.6rem' }}>
                        <img 
                          src={car.images[0]} 
                          alt={car.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <span className="card-scale" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>{car.scale}</span>
                      </div>

                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                        {car.brand}
                      </div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: '1.3', margin: '0.2rem 0 0.5rem', color: '#fff' }}>
                        {car.name}
                      </h4>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <span>Qty: {car.quantity || 1}</span>
                        <button 
                          className="btn-card-action"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                          onClick={() => {
                            if (onSelectCar) {
                              onSelectCar(car)
                              onClose()
                            }
                          }}
                        >
                          <Eye size={12} /> View Specs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Orders & Tracking */}
          {activeTab === 'orders' && (
            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  <Package size={40} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                  <p>No orders placed yet.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          Order ID: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{order.id}</strong>
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Placed on: {order.date}
                        </span>
                      </div>
                      <span className={`status-badge ${order.statusKey || 'in-transit'}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Items preview in order */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <img src={item.images[0]} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                            <div>
                              <span style={{ color: '#fff', fontWeight: 600 }}>{item.name}</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>
                                Scale {item.scale} · Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span style={{ color: '#fff', fontWeight: 700 }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Tracking Stepper */}
                    <div className="tracking-stepper">
                      <div className={`tracking-step ${order.currentStep >= 1 ? 'done' : ''}`}>
                        <div className="step-dot">1</div>
                        <span>Sealed</span>
                      </div>
                      <div className={`tracking-step ${order.currentStep >= 2 ? 'done' : ''}`}>
                        <div className="step-dot">2</div>
                        <span>Packed</span>
                      </div>
                      <div className={`tracking-step ${order.currentStep >= 3 ? (order.currentStep === 3 ? 'active' : 'done') : ''}`}>
                        <div className="step-dot">3</div>
                        <span>Air Express</span>
                      </div>
                      <div className={`tracking-step ${order.currentStep >= 4 ? 'done' : ''}`}>
                        <div className="step-dot">4</div>
                        <span>Delivered</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Payment: <strong style={{ color: '#fff' }}>{order.paymentMethod}</strong>
                      </span>
                      <span style={{ color: 'var(--accent-amber)', fontWeight: 800, fontSize: '0.95rem' }}>
                        Total: ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Transactions */}
          {activeTab === 'transactions' && (
            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Transaction ID</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id}>
                      <td>{txn.date}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>{txn.id}</td>
                      <td>{txn.method}</td>
                      <td>
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} /> {txn.status}
                        </span>
                      </td>
                      <td className="amount" style={{ textAlign: 'right' }}>
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: Edit Profile Details & Upload Photo */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {/* Profile Photo Upload Section */}
              <div className="avatar-upload-box">
                <div 
                  className="avatar-upload-preview" 
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  title="Click to upload picture"
                >
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt="Profile preview" />
                  ) : (
                    profileForm.name ? profileForm.name.charAt(0) : 'U'
                  )}
                  <div className="avatar-upload-overlay">
                    <Camera size={20} />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                    Profile Photo
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.6rem' }}>
                    Upload a JPEG or PNG photo (Max 5MB) for your collector avatar.
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button 
                      type="button" 
                      className="btn-upload-file"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <Upload size={14} /> Upload Picture
                    </button>
                    {profileForm.avatar && (
                      <button 
                        type="button" 
                        className="btn-upload-file" 
                        style={{ color: '#fca5a5' }}
                        onClick={handleRemoveAvatar}
                      >
                        <Trash2 size={14} /> Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
                  Personal Information
                </h4>

                <div className="checkout-form-grid">
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={profileForm.name} 
                      onChange={handleProfileChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={profileForm.email} 
                      onChange={handleProfileChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={profileForm.phone} 
                      onChange={handleProfileChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>City</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={profileForm.city} 
                      onChange={handleProfileChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PIN Code</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      value={profileForm.pincode} 
                      onChange={handleProfileChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Collector Tier</label>
                    <select 
                      name="tier"
                      value={profileForm.tier}
                      onChange={handleProfileChange}
                      className="checkout-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Standard Collector">Standard Collector</option>
                      <option value="Silver Vault Tier">Silver Vault Tier</option>
                      <option value="Gold Collector Tier">Gold Collector Tier</option>
                      <option value="Platinum VIP Member">Platinum VIP Member</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setActiveTab('garage')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  <Save size={16} /> Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
