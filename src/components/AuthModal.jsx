import React, { useState } from 'react'
import { X, User, Crown, Wrench, Lock, Mail, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export const DEMO_ACCOUNTS = {
  user: {
    role: 'user',
    name: 'Suresh Verma',
    email: 'suresh@diecast.vault',
    password: 'user123',
    tier: 'Gold Collector Tier',
    title: 'Diecast Enthusiast & Collector',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    pincode: '110001'
  },
  owner: {
    role: 'owner',
    name: 'Rajesh Singhania',
    email: 'owner@diecast.vault',
    password: 'owner123',
    tier: 'Executive Partner',
    title: 'Store Owner & Business Director',
    phone: '+91 98111 22334',
    city: 'Mumbai',
    pincode: '400001'
  },
  admin: {
    role: 'admin',
    name: 'Vikram Seth',
    email: 'admin@diecast.vault',
    password: 'admin123',
    tier: 'Catalog Operations',
    title: 'Inventory & Product Listing Admin',
    phone: '+91 99223 34455',
    city: 'Bangalore',
    pincode: '560001'
  }
}

export default function AuthModal({
  isOpen,
  onClose,
  currentRole = 'user',
  currentUser,
  onLogin,
  onAddToast
}) {
  const [activeTab, setActiveTab] = useState(currentRole || 'user') // 'user' | 'owner' | 'admin'
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')

  if (!isOpen) return null

  const handleRoleSelect = (roleKey) => {
    setActiveTab(roleKey)
    setEmail(DEMO_ACCOUNTS[roleKey]?.email || '')
    setPassword(DEMO_ACCOUNTS[roleKey]?.password || '')
    if (roleKey !== 'user') {
      setMode('login')
    }
  }

  const handleQuickDemoLogin = (roleKey) => {
    const demo = DEMO_ACCOUNTS[roleKey]
    if (demo) {
      onLogin(demo)
      if (onAddToast) {
        onAddToast(`Logged in successfully as ${demo.name} (${roleKey.toUpperCase()})`, 'success')
      }
      onClose()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (mode === 'register' && activeTab === 'user') {
      if (!registerName.trim() || !email.trim()) {
        if (onAddToast) onAddToast('Please fill all required fields', 'error')
        return
      }
      const newUser = {
        role: 'user',
        name: registerName.trim(),
        email: email.trim(),
        phone: registerPhone || '+91 98000 00000',
        tier: 'New Collector Tier',
        title: 'Diecast Collector',
        city: 'India',
        pincode: '110001'
      }
      onLogin(newUser)
      if (onAddToast) onAddToast(`Welcome to Diecast Vault, ${newUser.name}!`, 'success')
      onClose()
      return
    }

    // Login validation
    const demo = DEMO_ACCOUNTS[activeTab]
    const userToLogin = {
      role: activeTab,
      name: email === demo.email ? demo.name : email.split('@')[0],
      email: email || demo.email,
      tier: demo.tier,
      title: demo.title,
      phone: demo.phone,
      city: demo.city,
      pincode: demo.pincode
    }

    onLogin(userToLogin)
    if (onAddToast) {
      onAddToast(`Welcome back, ${userToLogin.name}! Accessing ${activeTab.toUpperCase()} portal.`, 'success')
    }
    onClose()
  }

  const roleMeta = {
    user: {
      label: 'Collector / Customer',
      icon: User,
      color: '#3b82f6',
      badge: 'Customer Portal',
      desc: 'Browse showcase, buy models, manage garage & track deliveries in real time.'
    },
    owner: {
      label: 'Store Owner',
      icon: Crown,
      color: '#f59e0b',
      badge: 'Executive & Sales',
      desc: 'Access revenue metrics, gross profit, sales by brand, margins, and order fulfillment.'
    },
    admin: {
      label: 'Inventory Admin',
      icon: Wrench,
      color: '#10b981',
      badge: 'Listing & Stock',
      desc: 'Add new diecast cars, edit prices, upload photos, manage stock count, and delete items.'
    }
  }

  const ActiveIcon = roleMeta[activeTab].icon

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog auth-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Sparkles size={14} /> Diecast Vault Access Portal
          </div>
          <h2 className="auth-title">Select Portal & Sign In</h2>
          <p className="auth-subtitle">
            Experience role-based features tailored for Collectors, Store Owners, and Inventory Managers.
          </p>
        </div>

        {/* 3-Role Tab Selector */}
        <div className="auth-role-tabs">
          {Object.entries(roleMeta).map(([roleKey, meta]) => {
            const Icon = meta.icon
            const isSelected = activeTab === roleKey
            return (
              <button
                key={roleKey}
                type="button"
                className={`auth-role-tab ${isSelected ? 'active' : ''}`}
                style={{ '--role-color': meta.color }}
                onClick={() => handleRoleSelect(roleKey)}
              >
                <div className="role-tab-icon-wrap">
                  <Icon size={18} />
                </div>
                <div className="role-tab-info">
                  <span className="role-tab-label">{meta.label}</span>
                  <span className="role-tab-badge">{meta.badge}</span>
                </div>
                {isSelected && <span className="role-tab-indicator" />}
              </button>
            )
          })}
        </div>

        {/* Role Description Card */}
        <div 
          className="auth-role-desc-card"
          style={{ borderColor: `${roleMeta[activeTab].color}44` }}
        >
          <div className="role-desc-header">
            <span 
              className="role-pill" 
              style={{ background: `${roleMeta[activeTab].color}20`, color: roleMeta[activeTab].color }}
            >
              <ActiveIcon size={13} style={{ marginRight: '4px' }} />
              {roleMeta[activeTab].label}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {activeTab === 'user' ? 'Shopping & Tracking' : (activeTab === 'owner' ? 'Analytics & Financials' : 'Catalog Management')}
            </span>
          </div>
          <p className="role-desc-text">{roleMeta[activeTab].desc}</p>
        </div>

        {/* Instant 1-Click Demo Login Banner */}
        <div className="quick-demo-banner">
          <div className="demo-left">
            <Zap size={16} color="var(--accent-amber)" />
            <div>
              <strong>Quick 1-Click Access</strong>
              <span>Pre-configured {DEMO_ACCOUNTS[activeTab].name} credentials</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-quick-login"
            onClick={() => handleQuickDemoLogin(activeTab)}
          >
            ⚡ Launch as {activeTab === 'user' ? 'Collector' : (activeTab === 'owner' ? 'Owner' : 'Admin')}
          </button>
        </div>

        {/* Sign In / Sign Up Form */}
        <div className="auth-form-wrapper">
          {activeTab === 'user' && (
            <div className="auth-mode-switch">
              <button
                type="button"
                className={`mode-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
              >
                Create Account
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && activeTab === 'user' ? (
              <>
                <div className="auth-field">
                  <label>Full Name</label>
                  <div className="auth-input-box">
                    <User size={16} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="e.g. Aryan Malhotra"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>Phone / WhatsApp Number</label>
                  <div className="auth-input-box">
                    <input
                      type="tel"
                      placeholder="+91 98765 00000"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : null}

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-box">
                <Mail size={16} color="var(--text-muted)" />
                <input
                  type="email"
                  placeholder={DEMO_ACCOUNTS[activeTab].email}
                  value={email || DEMO_ACCOUNTS[activeTab].email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                {mode === 'login' && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-red)', cursor: 'pointer' }}>
                    Demo: {DEMO_ACCOUNTS[activeTab].password}
                  </span>
                )}
              </div>
              <div className="auth-input-box">
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password || DEMO_ACCOUNTS[activeTab].password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="pw-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <ShieldCheck size={18} />
              {mode === 'register' 
                ? 'Create Collector Account & Enter'
                : `Sign In as ${roleMeta[activeTab].label}`}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="auth-footer-notice">
          <CheckCircle2 size={14} color="#10b981" />
          <span>Instant live session syncing across storefront, sales ledger, and inventory manager.</span>
        </div>
      </div>
    </div>
  )
}
