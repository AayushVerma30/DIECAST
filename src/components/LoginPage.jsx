import React, { useState } from 'react'
import { 
  User, Crown, Wrench, Lock, Mail, Eye, EyeOff, Sparkles, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Car, TrendingUp, 
  Layers, ShoppingBag, Shield, Star, Award, ChevronRight
} from 'lucide-react'
import { CARS_DATA } from '../data/carsData'

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
    title: 'Store Founder & Business Owner',
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
    title: 'Product Listing & Inventory Admin',
    phone: '+91 99223 34455',
    city: 'Bangalore',
    pincode: '560001'
  }
}

export default function LoginPage({ onLogin, onAddToast }) {
  const [selectedRole, setSelectedRole] = useState('user') // 'user' | 'owner' | 'admin'
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState(DEMO_ACCOUNTS.user.email)
  const [password, setPassword] = useState(DEMO_ACCOUNTS.user.password)
  const [registerName, setRegisterName] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')

  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey)
    setEmail(DEMO_ACCOUNTS[roleKey].email)
    setPassword(DEMO_ACCOUNTS[roleKey].password)
    if (roleKey !== 'user') {
      setAuthMode('login')
    }
  }

  const handleQuickLaunch = (roleKey) => {
    const account = DEMO_ACCOUNTS[roleKey]
    if (account) {
      onLogin(account)
      if (onAddToast) {
        onAddToast(`Welcome, ${account.name}! Accessing ${roleKey.toUpperCase()} portal.`, 'success')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (authMode === 'register' && selectedRole === 'user') {
      if (!registerName.trim() || !email.trim()) {
        if (onAddToast) onAddToast('Please fill all required registration fields', 'error')
        return
      }
      const newCollector = {
        role: 'user',
        name: registerName.trim(),
        email: email.trim(),
        phone: registerPhone || '+91 98000 00000',
        tier: 'Gold Collector Tier',
        title: 'Diecast Collector',
        city: 'India',
        pincode: '110001'
      }
      onLogin(newCollector)
      if (onAddToast) onAddToast(`Welcome to Diecast Vault, ${newCollector.name}!`, 'success')
      return
    }

    const demo = DEMO_ACCOUNTS[selectedRole]
    const userToLogin = {
      role: selectedRole,
      name: email === demo.email ? demo.name : (email ? email.split('@')[0] : demo.name),
      email: email || demo.email,
      tier: demo.tier,
      title: demo.title,
      phone: demo.phone,
      city: demo.city,
      pincode: demo.pincode
    }

    onLogin(userToLogin)
    if (onAddToast) {
      onAddToast(`Signed in as ${userToLogin.name}`, 'success')
    }
  }

  const roleConfigs = {
    user: {
      label: 'Collector / Customer',
      shortLabel: 'Collector',
      icon: User,
      color: '#3b82f6',
      badge: 'Store & Garage',
      headline: 'Collector & Customer Portal',
      description: 'Browse 1:64 scale diecast models, save cars to your garage, and track home delivery in real time.',
      perks: [
        'Complete Diecast Storefront & Car Specs',
        'Personal Garage, Cart & Easy Checkout',
        'Live Courier Package & Delivery Tracker'
      ],
      quickName: 'Suresh Verma',
      quickRoleTitle: 'Collector & Customer'
    },
    owner: {
      label: 'Store Owner',
      shortLabel: 'Store Owner',
      icon: Crown,
      color: '#f59e0b',
      badge: 'Sales & Profit',
      headline: 'Sales, Profit & Orders Dashboard',
      description: 'See total money made, clean take-home profit, customer orders, and special packaging requests.',
      perks: [
        'Total Sales & Clean Profit Overview',
        'Sales by Brand (Hot Wheels, Mini GT, Matchbox)',
        'Customer Orders & Courier Shipping Slips',
        'Top VIP Customers & Packaging Notes'
      ],
      quickName: 'Rajesh Singhania',
      quickRoleTitle: 'Store Owner'
    },
    admin: {
      label: 'Inventory Admin',
      shortLabel: 'Inventory Admin',
      icon: Wrench,
      color: '#10b981',
      badge: 'Add & Manage Cars',
      headline: 'Product Listing & Warehouse Stock Console',
      description: 'Add new diecast models, upload photos, set prices, and update warehouse stock quantities.',
      perks: [
        'Add, Edit & Remove Diecast Models',
        'Easy + / - Stock Quantity Buttons',
        'Instant Updates to the Customer Storefront'
      ],
      quickName: 'Vikram Seth',
      quickRoleTitle: 'Inventory Manager'
    }
  }

  const currentConfig = roleConfigs[selectedRole]
  const ActiveRoleIcon = currentConfig.icon
  const previewCar = CARS_DATA[selectedRole === 'owner' ? 1 : (selectedRole === 'admin' ? 3 : 0)]

  return (
    <div className="login-page-premium">
      {/* Background Laser Ambient Glows */}
      <div className="login-bg-glow glow-1" />
      <div className="login-bg-glow glow-2" />

      <div className="login-layout-grid">
        {/* LEFT COLUMN: Visual Brand Showcase & Highlights */}
        <div className="login-showcase-panel">
          <div className="showcase-top-tag">
            <Sparkles size={14} /> PRECISION DIECAST VAULT
          </div>

          <h1 className="showcase-title">
            The Ultimate Scale Model <br />
            <span className="gradient-text">Collector & Operations</span> Vault.
          </h1>

          <p className="showcase-subtitle">
            A unified ecosystem tailored for collectors shopping rare castings, business owners tracking sales, and inventory managers listing items.
          </p>

          {/* Featured Dynamic Diecast Preview Card */}
          <div className="featured-preview-card">
            <div className="preview-card-media">
              <img 
                src={previewCar?.images?.[0]} 
                alt={previewCar?.name} 
                className="preview-card-img"
              />
              <span className="preview-card-scale">{previewCar?.scale || '1:64'}</span>
              <span className="preview-card-badge">{previewCar?.brand || 'Hot Wheels'}</span>
            </div>
            <div className="preview-card-content">
              <div className="preview-card-title">{previewCar?.name}</div>
              <div className="preview-card-specs">
                <span>{previewCar?.category}</span>
                <span>•</span>
                <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Star size={12} fill="currentColor" /> {previewCar?.rating || 4.9}
                </span>
                <span>•</span>
                <span className="preview-card-price">₹{previewCar?.price?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Role Feature Highlights for Active Role */}
          <div className="role-perks-box" style={{ borderColor: `${currentConfig.color}35` }}>
            <div className="role-perks-header">
              <div className="role-icon-circle" style={{ background: `${currentConfig.color}20`, color: currentConfig.color }}>
                <ActiveRoleIcon size={18} />
              </div>
              <div>
                <span className="role-header-sub">Active Portal Access</span>
                <strong className="role-header-title" style={{ color: currentConfig.color }}>
                  {currentConfig.headline}
                </strong>
              </div>
            </div>

            <ul className="perks-checklist">
              {currentConfig.perks.map((perk, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={15} color={currentConfig.color} />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Login & Role Gateway Form */}
        <div className="login-auth-card">
          {/* Card Header */}
          <div className="auth-card-top">
            <div className="auth-step-label">
              <ShieldCheck size={14} color="#10b981" /> SECURE ROLE ACCESS
            </div>
            <h2 className="auth-card-title">Sign In to Your Portal</h2>
            <p className="auth-card-sub">
              Select who you are to access your custom dashboard and tools.
            </p>
          </div>

          {/* 3-Role Segmented Selector */}
          <div className="role-segmented-control">
            {Object.entries(roleConfigs).map(([key, config]) => {
              const Icon = config.icon
              const isSelected = selectedRole === key
              return (
                <button
                  key={key}
                  type="button"
                  className={`role-segment-btn ${isSelected ? 'active' : ''}`}
                  style={{ '--active-accent': config.color }}
                  onClick={() => handleRoleChange(key)}
                >
                  <Icon size={16} />
                  <span>{config.shortLabel}</span>
                </button>
              )
            })}
          </div>

          {/* ⚡ 1-Click Instant Demo Access Box */}
          <div className="quick-access-box" style={{ borderColor: `${currentConfig.color}40` }}>
            <div className="quick-access-info">
              <div className="quick-avatar" style={{ background: currentConfig.color }}>
                {currentConfig.quickName.charAt(0)}
              </div>
              <div>
                <div className="quick-name">{currentConfig.quickName}</div>
                <div className="quick-role-sub">{currentConfig.quickRoleTitle} · {DEMO_ACCOUNTS[selectedRole].email}</div>
              </div>
            </div>

            <button
              type="button"
              className="btn-quick-launch"
              style={{ background: currentConfig.color }}
              onClick={() => handleQuickLaunch(selectedRole)}
            >
              <Zap size={14} /> Launch as {currentConfig.shortLabel}
            </button>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span>OR ENTER CUSTOM CREDENTIALS</span>
          </div>

          {/* Sign In / Sign Up Mode Switcher (for Customers) */}
          {selectedRole === 'user' && (
            <div className="auth-mode-pills">
              <button
                type="button"
                className={`mode-pill ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`mode-pill ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Create New Account
              </button>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="auth-inputs-form">
            {authMode === 'register' && selectedRole === 'user' && (
              <>
                <div className="input-field-group">
                  <label>Full Name *</label>
                  <div className="input-container">
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

                <div className="input-field-group">
                  <label>Phone / WhatsApp</label>
                  <div className="input-container">
                    <input
                      type="tel"
                      placeholder="+91 98765 00000"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="input-field-group">
              <label>Email Address</label>
              <div className="input-container">
                <Mail size={16} color="var(--text-muted)" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={DEMO_ACCOUNTS[selectedRole].email}
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                {authMode === 'login' && (
                  <span style={{ fontSize: '0.72rem', color: currentConfig.color, cursor: 'pointer' }}>
                    Demo: {DEMO_ACCOUNTS[selectedRole].password}
                  </span>
                )}
              </div>
              <div className="input-container">
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-large"
              style={{ 
                background: selectedRole === 'owner' 
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                  : (selectedRole === 'admin' 
                    ? 'linear-gradient(135deg, #10b981, #059669)' 
                    : 'linear-gradient(135deg, #ef4444, #dc2626)'),
                color: selectedRole === 'owner' || selectedRole === 'admin' ? '#000' : '#fff'
              }}
            >
              <ActiveRoleIcon size={16} />
              {authMode === 'register' 
                ? 'Create Collector Account & Enter' 
                : `Enter Vault as ${currentConfig.shortLabel}`}
            </button>
          </form>

          {/* Security Footer */}
          <div className="auth-card-footer">
            <span>🔒 Encrypted 256-bit Session</span>
            <span>•</span>
            <span>Role-Based Access Control</span>
          </div>
        </div>
      </div>
    </div>
  )
}
