import React, { useState } from 'react'
import { X, Package, Receipt, User, Clock, CheckCircle2, Truck, ShieldCheck, ArrowUpRight } from 'lucide-react'

export default function UserAccountModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  orders, 
  transactions 
}) {
  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'transactions'

  if (!isOpen) return null

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalModelsPurchased = orders.reduce((sum, o) => sum + o.items.reduce((cnt, i) => cnt + i.quantity, 0), 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog" 
        style={{ gridTemplateColumns: '1fr', maxWidth: '780px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '1.75rem' }}>
          {/* User Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="user-avatar-circle" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{userProfile.name}</h2>
                <span className="brand-badge" style={{ fontSize: '0.65rem', background: '#eab308' }}>
                  {userProfile.tier}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {userProfile.email} · Collector Member since 2024
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="account-stats-row">
            <div className="account-stat-card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders Placed</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {orders.length}
              </div>
            </div>
            <div className="account-stat-card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Diecasts in Garage</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '2px' }}>
                {totalModelsPurchased}
              </div>
            </div>
            <div className="account-stat-card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Spent</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                ₹{totalSpent.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="account-tabs">
            <button 
              className={`account-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={16} /> My Orders & Tracking ({orders.length})
            </button>
            <button 
              className={`account-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <Receipt size={16} /> Clean Transactions ({transactions.length})
            </button>
          </div>

          {/* Tab 1: Orders & Tracking */}
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Payment Mode: <strong style={{ color: '#fff' }}>{order.paymentMethod}</strong>
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

          {/* Tab 2: Clean Transactions Ledger */}
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
        </div>
      </div>
    </div>
  )
}
