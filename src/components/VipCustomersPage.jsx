import React, { useState } from 'react'
import { 
  Crown, Award, Star, Search, Plus, Download, Mail, Phone, 
  MapPin, ShieldCheck, Gift, Edit3, Check, X, Sparkles, Send, 
  ShoppingBag, ExternalLink, Heart, Tag, UserPlus, Filter, Trash2,
  FileSpreadsheet, FileText
} from 'lucide-react'
import { exportToCSV, exportToPDF } from '../utils/exportUtils'

export const INITIAL_VIP_CUSTOMERS = [
  {
    id: 'VIP-001',
    name: 'Suresh Verma',
    email: 'suresh@diecast.vault',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    state: 'Delhi',
    tier: 'Diamond',
    tierLabel: '👑 Diamond VIP (₹25k+)',
    totalSpent: 28450,
    totalOrders: 9,
    avgOrderValue: 3161,
    favBrand: 'Hot Wheels Premium JDM',
    favModels: ['Skyline R34 GT-R', '1967 Shelby Cobra'],
    specialHandling: 'Plastic Clamshell Case + Double Bubble Wrap',
    notes: 'JDM enthusiast. Wants mint condition blister card with zero bent corners. Pack in hard plastic clamshell case.',
    lastOrderDate: '12 Aug 2026',
    lastOrderModel: '1967 Shelby Cobra 427',
    joined: 'Jan 2025'
  },
  {
    id: 'VIP-002',
    name: 'Aryan Malhotra',
    email: 'aryan.m@speedclub.in',
    phone: '+91 98111 44556',
    city: 'Mumbai',
    state: 'Maharashtra',
    tier: 'Gold',
    tierLabel: '🥇 Gold VIP (₹15k+)',
    totalSpent: 21990,
    totalOrders: 7,
    avgOrderValue: 3141,
    favBrand: 'Mini GT Supercars',
    favModels: ['Porsche 911 GT3 RS', 'Nissan GT-R Nismo'],
    specialHandling: 'Priority Air Express Courier',
    notes: 'Pre-orders all GT3 RS and European supercars. Send via fastest BlueDart Air courier to corporate office.',
    lastOrderDate: '04 Aug 2026',
    lastOrderModel: 'Porsche 911 GT3 RS (992)',
    joined: 'Mar 2025'
  },
  {
    id: 'VIP-003',
    name: 'Rohan Kapoor',
    email: 'rohan.k@collector.org',
    phone: '+91 99223 88776',
    city: 'Bangalore',
    state: 'Karnataka',
    tier: 'Silver',
    tierLabel: '🥈 Silver VIP (₹10k+)',
    totalSpent: 16850,
    totalOrders: 6,
    avgOrderValue: 2808,
    favBrand: 'Classic American Muscle',
    favModels: ['1967 Shelby Cobra', '1969 Dodge Charger'],
    specialHandling: 'Printed Tax Invoice in Box',
    notes: 'Collects 1960s vintage cars. Always put a printed bill inside the shipping box for his records.',
    lastOrderDate: '28 Jul 2026',
    lastOrderModel: '1967 Shelby Cobra 427 S/C',
    joined: 'Jul 2025'
  },
  {
    id: 'VIP-004',
    name: 'Meera Deshmukh',
    email: 'meera.d@vintagedrive.in',
    phone: '+91 98334 11223',
    city: 'Pune',
    state: 'Maharashtra',
    tier: 'Silver',
    tierLabel: '🥈 Silver VIP (₹10k+)',
    totalSpent: 13400,
    totalOrders: 4,
    avgOrderValue: 3350,
    favBrand: 'Matchbox Heritage',
    favModels: ['1971 Datsun 510 Wagon'],
    specialHandling: 'Gift Wrap + Vault Wax Seal',
    notes: 'Buys gifts for junior collectors in her family. Please gift wrap with Diecast Vault red wax sticker.',
    lastOrderDate: '15 Jul 2026',
    lastOrderModel: 'Matchbox Heritage Edition',
    joined: 'Sep 2025'
  },
  {
    id: 'VIP-005',
    name: 'Kabir Singhania',
    email: 'kabir.s@luxurycars.in',
    phone: '+91 97112 33445',
    city: 'Hyderabad',
    state: 'Telangana',
    tier: 'Gold',
    tierLabel: '🥇 Gold VIP (₹15k+)',
    totalSpent: 18700,
    totalOrders: 5,
    avgOrderValue: 3740,
    favBrand: 'Hot Wheels RLC (Red Line Club)',
    favModels: ['Nissan Skyline R34', 'Mazda RX-7 FD3S'],
    specialHandling: 'Double Boxed + Fragile Tape',
    notes: 'RLC numbered chassis collector. Demands sealed blister packs with intact holograms.',
    lastOrderDate: '01 Aug 2026',
    lastOrderModel: 'Nissan Skyline GT-R R34',
    joined: 'Feb 2025'
  }
]

export default function VipCustomersPage({ onAddToast }) {
  const [customers, setCustomers] = useState(INITIAL_VIP_CUSTOMERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState('ALL') // 'ALL' | 'Diamond' | 'Gold' | 'Silver'
  
  // Editing note state
  const [editingId, setEditingId] = useState(null)
  const [editNoteText, setEditNoteText] = useState('')

  // Add customer modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    tier: 'Silver',
    totalSpent: 10000,
    favBrand: 'Hot Wheels Premium',
    specialHandling: 'Double Bubble Wrap',
    notes: 'Collector requests mint blister packaging.'
  })

  // Promo message modal state
  const [promoModalCustomer, setPromoModalCustomer] = useState(null)
  const [promoCode, setPromoCode] = useState('VIPSECRET15')
  const [promoDiscount, setPromoDiscount] = useState('15% OFF')

  // Filtered list
  const filteredCustomers = customers.filter(c => {
    const matchSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.favBrand.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchTier = selectedTier === 'ALL' || c.tier === selectedTier
    return matchSearch && matchTier
  })

  // Calculated Stats
  const totalVipRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const totalVipOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0)
  const avgVipSpend = customers.length > 0 ? Math.round(totalVipRevenue / customers.length) : 0

  // Export CSV
  const handleExportVipCSV = () => {
    const headers = ["Customer ID", "Name", "Email", "Phone", "City", "VIP Tier", "Total Spent (INR)", "Orders", "Favorite Brand", "Packaging Instructions"]
    const rows = customers.map(c => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.city,
      c.tier,
      c.totalSpent,
      c.totalOrders,
      c.favBrand,
      c.specialHandling || c.notes
    ])

    exportToCSV({
      filename: `Diecast_Vault_VIP_Customers_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    })

    if (onAddToast) onAddToast("VIP Customer directory exported to CSV!", "success")
  }

  // Export PDF
  const handleExportVipPDF = () => {
    const headers = ["VIP ID", "Collector Contact", "VIP Tier", "Total Spent", "Orders", "Fav Brand", "Special Packaging"]
    const rows = customers.map(c => [
      `<strong>${c.id}</strong>`,
      `<div><strong>${c.name}</strong></div><small style="color:#6b7280">${c.email} • ${c.phone} • ${c.city}</small>`,
      `<span style="background:#fef3c7; color:#92400e; padding:3px 8px; border-radius:4px; font-weight:800; font-size:11px">${c.tier} VIP</span>`,
      `<strong style="color:#059669">₹${(c.totalSpent || 0).toLocaleString('en-IN')}</strong>`,
      `${c.totalOrders} orders`,
      c.favBrand,
      `<div style="background:#fffbeb; padding:4px 8px; border-radius:4px; border:1px solid #fef3c7; font-size:11px; color:#b45309">📦 ${c.specialHandling || c.notes}</div>`
    ])

    exportToPDF({
      title: "VIP Collector Registry & Packaging Directory",
      subtitle: "Top-tier collectors, purchase history, favorite castings, and custom packaging handling instructions.",
      category: "VIP Registry",
      kpis: [
        { label: "Total VIP Members", value: `${customers.length} Collectors`, sub: "High-value tier", color: "#f59e0b" },
        { label: "VIP Total Spend", value: `₹${totalVipRevenue.toLocaleString('en-IN')}`, sub: "Collective gross spend", color: "#10b981" },
        { label: "VIP Total Orders", value: `${totalVipOrders} Orders`, sub: `Avg Spend: ₹${avgVipSpend.toLocaleString('en-IN')}`, color: "#3b82f6" },
        { label: "Diamond Tier", value: `${customers.filter(c => c.tier === 'Diamond').length}`, sub: "VIP spend > ₹25k", color: "#8b5cf6" }
      ],
      headers,
      rows,
      notes: "VIP collectors must be dispatched with pristine blister protection, plastic clamshell cases, and corner edge guards as recorded above."
    })

    if (onAddToast) onAddToast("VIP Directory PDF report generated! Save or print.", "success")
  }

  // Save Note
  const handleSaveNote = (id) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, notes: editNoteText } : c))
    setEditingId(null)
    if (onAddToast) onAddToast("Packaging note updated successfully!", "success")
  }

  // Add Customer Submit
  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newCustomer.name || !newCustomer.email) {
      if (onAddToast) onAddToast("Please fill in the name and email", "error")
      return
    }

    const created = {
      ...newCustomer,
      id: `VIP-00${customers.length + 1}`,
      tierLabel: newCustomer.tier === 'Diamond' ? '👑 Diamond VIP (₹25k+)' : (newCustomer.tier === 'Gold' ? '🥇 Gold VIP (₹15k+)' : '🥈 Silver VIP (₹10k+)'),
      totalSpent: Number(newCustomer.totalSpent) || 12000,
      totalOrders: Math.max(1, Math.round((newCustomer.totalSpent || 12000) / 3000)),
      avgOrderValue: 3000,
      favModels: [newCustomer.favBrand],
      lastOrderDate: 'Just Added',
      lastOrderModel: 'Catalog Selection',
      joined: 'Today'
    }

    setCustomers(prev => [created, ...prev])
    setIsAddModalOpen(false)
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      city: '',
      tier: 'Silver',
      totalSpent: 10000,
      favBrand: 'Hot Wheels Premium',
      specialHandling: 'Double Bubble Wrap',
      notes: 'Collector requests mint blister packaging.'
    })
    if (onAddToast) onAddToast(`Added ${created.name} to VIP Directory!`, "success")
  }

  // Send Promo Code
  const handleSendPromo = () => {
    if (onAddToast) {
      onAddToast(`Private code "${promoCode}" (${promoDiscount}) sent to ${promoModalCustomer.name} via WhatsApp/Email!`, "success")
    }
    setPromoModalCustomer(null)
  }

  return (
    <div className="vip-page-root">
      {/* Top Banner & Header */}
      <div className="vip-top-header">
        <div className="vip-header-titles">
          <div className="vip-badge-pill">
            <Crown size={15} color="#f59e0b" />
            <span>VIP Customer Club & Collector Care</span>
          </div>
          <h1 className="vip-main-title">Top VIP Customers & Custom Packaging Registry</h1>
          <p className="vip-sub-title">
            Track your highest-spending diecast collectors, their total money spent, favorite car castings, and custom packaging instructions.
          </p>
        </div>

        <div className="vip-top-actions">
          <button 
            className="btn-secondary btn-sm"
            onClick={handleExportVipCSV}
            title="Download CSV spreadsheet of all VIP customers"
          >
            <FileSpreadsheet size={14} color="#34d399" /> Export CSV
          </button>
          <button 
            className="btn-secondary btn-sm"
            onClick={handleExportVipPDF}
            title="Download and print formatted PDF of VIP directory"
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
          >
            <FileText size={14} color="#fbbf24" /> Export PDF
          </button>
          <button 
            className="btn-primary btn-sm"
            style={{ background: '#f59e0b', color: '#000' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserPlus size={14} /> Add VIP Customer
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="metrics-grid" style={{ marginBottom: '1.75rem' }}>
        <div className="metric-card gold-border">
          <div className="metric-icon-bg gold">
            <Crown size={22} color="#f59e0b" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total VIP Members</span>
            <span className="metric-value">{customers.length} Collectors</span>
            <span className="metric-sub text-green">Top 5% of Buyer Base</span>
          </div>
        </div>

        <div className="metric-card green-border">
          <div className="metric-icon-bg green">
            <Award size={22} color="#10b981" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total VIP Lifetime Sales</span>
            <span className="metric-value" style={{ color: '#10b981' }}>₹{totalVipRevenue.toLocaleString('en-IN')}</span>
            <span className="metric-sub text-green">{totalVipOrders} Completed Orders</span>
          </div>
        </div>

        <div className="metric-card blue-border">
          <div className="metric-icon-bg blue">
            <ShoppingBag size={22} color="#3b82f6" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Average VIP Spend</span>
            <span className="metric-value">₹{avgVipSpend.toLocaleString('en-IN')}</span>
            <span className="metric-sub">Per VIP Customer</span>
          </div>
        </div>

        <div className="metric-card purple-border">
          <div className="metric-icon-bg purple">
            <ShieldCheck size={22} color="#8b5cf6" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Custom Packaging Requests</span>
            <span className="metric-value">{customers.length} Active</span>
            <span className="metric-sub">Clamshells & Wax Seals</span>
          </div>
        </div>
      </div>

      {/* Search & Tier Filter Bar */}
      <div className="vip-filter-toolbar">
        <div className="vip-search-box">
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search by customer name, city, or favorite car brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="vip-tier-pills">
          <button 
            className={`tier-filter-btn ${selectedTier === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedTier('ALL')}
          >
            All VIPs ({customers.length})
          </button>
          <button 
            className={`tier-filter-btn diamond ${selectedTier === 'Diamond' ? 'active' : ''}`}
            onClick={() => setSelectedTier('Diamond')}
          >
            👑 Diamond (₹25k+)
          </button>
          <button 
            className={`tier-filter-btn gold ${selectedTier === 'Gold' ? 'active' : ''}`}
            onClick={() => setSelectedTier('Gold')}
          >
            🥇 Gold (₹15k+)
          </button>
          <button 
            className={`tier-filter-btn silver ${selectedTier === 'Silver' ? 'active' : ''}`}
            onClick={() => setSelectedTier('Silver')}
          >
            🥈 Silver (₹10k+)
          </button>
        </div>
      </div>

      {/* VIP Customer Cards Grid */}
      <div className="vip-cards-grid">
        {filteredCustomers.map((customer, index) => {
          const isDiamond = customer.tier === 'Diamond'
          const isGold = customer.tier === 'Gold'
          const badgeColor = isDiamond ? '#38bdf8' : (isGold ? '#fbbf24' : '#94a3b8')

          return (
            <div key={customer.id} className={`vip-card ${customer.tier.toLowerCase()}`}>
              {/* Top Card Bar */}
              <div className="vip-card-top-bar">
                <span className="vip-rank-pill" style={{ borderColor: badgeColor, color: badgeColor }}>
                  #{index + 1} TOP BUYER
                </span>
                <span className="vip-tier-badge" style={{ color: badgeColor }}>
                  {customer.tierLabel}
                </span>
              </div>

              {/* Profile Header */}
              <div className="vip-profile-row">
                <div className="vip-avatar" style={{ border: `2px solid ${badgeColor}` }}>
                  {customer.name.charAt(0)}
                </div>
                <div className="vip-name-meta">
                  <h3 className="vip-name">{customer.name}</h3>
                  <div className="vip-contact-links">
                    <span className="vip-meta-item">
                      <MapPin size={12} /> {customer.city}, {customer.state || 'India'}
                    </span>
                    <span className="vip-meta-item">
                      <Mail size={12} /> {customer.email}
                    </span>
                    <span className="vip-meta-item">
                      <Phone size={12} /> {customer.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Metrics Strip */}
              <div className="vip-metrics-strip">
                <div className="vip-metric-box">
                  <span className="v-label">Total Money Spent</span>
                  <strong className="v-val" style={{ color: '#10b981' }}>
                    ₹{customer.totalSpent.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="vip-metric-box">
                  <span className="v-label">Total Orders</span>
                  <strong className="v-val">{customer.totalOrders} Shipments</strong>
                </div>
                <div className="vip-metric-box">
                  <span className="v-label">Avg Order Size</span>
                  <strong className="v-val">₹{customer.avgOrderValue.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Favorite Brand & Castings */}
              <div className="vip-interests-box">
                <span className="interest-label">Collector Favorites:</span>
                <div className="interest-tags">
                  <span className="tag-pill brand-tag">{customer.favBrand}</span>
                  {(customer.favModels || []).map((mod, i) => (
                    <span key={i} className="tag-pill model-tag">{mod}</span>
                  ))}
                </div>
              </div>

              {/* Special Packaging Requirement Tag */}
              <div className="vip-packaging-alert">
                <ShieldCheck size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#fbbf24', fontSize: '0.78rem' }}>Special Packaging Requirement:</strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#fff' }}>
                    {customer.specialHandling}
                  </p>
                </div>
              </div>

              {/* Packaging Instructions & Editable Notes */}
              <div className="vip-notes-container">
                <div className="notes-header-row">
                  <span>Collector Notes & Instructions:</span>
                  {editingId !== customer.id && (
                    <button 
                      className="btn-edit-note"
                      onClick={() => {
                        setEditingId(customer.id)
                        setEditNoteText(customer.notes)
                      }}
                      title="Click to edit instructions"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                  )}
                </div>

                {editingId === customer.id ? (
                  <div className="notes-edit-box">
                    <textarea 
                      rows={3}
                      value={editNoteText}
                      onChange={(e) => setEditNoteText(e.target.value)}
                      className="notes-textarea"
                      placeholder="Enter packaging preferences (e.g. clamshell case, zero corner damage)..."
                    />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn-secondary btn-sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn-primary btn-sm"
                        style={{ background: '#10b981', color: '#000' }}
                        onClick={() => handleSaveNote(customer.id)}
                      >
                        <Check size={13} /> Save Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="notes-display-text" onClick={() => {
                    setEditingId(customer.id)
                    setEditNoteText(customer.notes)
                  }}>
                    {customer.notes}
                  </p>
                )}
              </div>

              {/* Quick Actions Footer */}
              <div className="vip-card-footer">
                <span className="last-order-snippet">
                  Last order: <strong>{customer.lastOrderModel || 'Scale Model'}</strong> ({customer.lastOrderDate})
                </span>

                <button 
                  className="btn-send-coupon"
                  onClick={() => setPromoModalCustomer(customer)}
                  title="Send private discount coupon to this VIP buyer"
                >
                  <Tag size={13} /> Send VIP Discount
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* =========================================================================
          MODAL 1: ADD VIP CUSTOMER MODAL
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="admin-submodal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="vip-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="submodal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={18} color="#f59e0b" />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem' }}>Add New VIP Customer</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="admin-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Vikram Malhotra"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="vikram@collector.in"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Phone / WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="+91 98765 00000"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>City / Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mumbai, Delhi, Bangalore"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>VIP Tier</label>
                  <select 
                    value={newCustomer.tier}
                    onChange={(e) => setNewCustomer({ ...newCustomer, tier: e.target.value })}
                  >
                    <option value="Diamond">👑 Diamond VIP (₹25k+ spent)</option>
                    <option value="Gold">🥇 Gold VIP (₹15k+ spent)</option>
                    <option value="Silver">🥈 Silver VIP (₹10k+ spent)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estimated Total Money Spent (₹)</label>
                  <input 
                    type="number" 
                    placeholder="15000"
                    value={newCustomer.totalSpent}
                    onChange={(e) => setNewCustomer({ ...newCustomer, totalSpent: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Favorite Diecast Brand / Series</label>
                <input 
                  type="text" 
                  placeholder="e.g. Hot Wheels JDM Premium, Mini GT Porsche, Matchbox"
                  value={newCustomer.favBrand}
                  onChange={(e) => setNewCustomer({ ...newCustomer, favBrand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Special Packaging Requirement</label>
                <input 
                  type="text" 
                  placeholder="e.g. Plastic Clamshell Case + Double Bubble Wrap"
                  value={newCustomer.specialHandling}
                  onChange={(e) => setNewCustomer({ ...newCustomer, specialHandling: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Collector Preferences & Packaging Notes</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Demands unbent card corners, call before delivery..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                />
              </div>

              <div className="submodal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ background: '#f59e0b', color: '#000' }}>
                  <UserPlus size={15} /> Save to VIP Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SEND VIP DISCOUNT COUPON
          ========================================================================= */}
      {promoModalCustomer && (
        <div className="admin-submodal-overlay" onClick={() => setPromoModalCustomer(null)}>
          <div className="vip-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="submodal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} color="#10b981" />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem' }}>
                  Send Private VIP Discount to {promoModalCustomer.name}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setPromoModalCustomer(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Reward your top collector with an exclusive one-time discount code for their next diecast haul.
              </p>

              <div className="form-group">
                <label>Private Promo Code</label>
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}
                />
              </div>

              <div className="form-group">
                <label>Discount Value</label>
                <select 
                  value={promoDiscount}
                  onChange={(e) => setPromoDiscount(e.target.value)}
                >
                  <option value="15% OFF">15% Off Total Order</option>
                  <option value="20% OFF">20% Off Total Order (Diamond Special)</option>
                  <option value="₹500 Flat Off">₹500 Flat Discount</option>
                  <option value="Free Clamshell Case">Free Protective Clamshell Case with Order</option>
                </select>
              </div>

              <div className="vip-coupon-preview">
                <Sparkles size={16} color="#fbbf24" />
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.85rem' }}>Message Preview to {promoModalCustomer.name}:</strong>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '3px 0 0' }}>
                    "Hey {promoModalCustomer.name}, as our valued {promoModalCustomer.tier} VIP collector at Diecast Vault, here is your private {promoDiscount} code: <strong>{promoCode}</strong>. Use it on your next rare casting order!"
                  </p>
                </div>
              </div>

              <div className="submodal-actions">
                <button className="btn-secondary" onClick={() => setPromoModalCustomer(null)}>
                  Cancel
                </button>
                <button 
                  className="btn-primary" 
                  style={{ background: '#10b981', color: '#000' }}
                  onClick={handleSendPromo}
                >
                  <Send size={14} /> Send VIP Discount Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
