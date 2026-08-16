import React, { useState } from 'react'
import {
  X, Crown, TrendingUp, DollarSign, PackageCheck, ShoppingBag,
  BarChart3, PieChart, Users, ArrowUpRight, Download, Filter,
  CheckCircle2, Clock, Truck, ShieldAlert, Sparkles, RefreshCw, Car,
  CreditCard, QrCode, FileText, Printer, Award, Star, Search,
  Sliders, ArrowDownRight, Check, AlertCircle, Send, ExternalLink,
  Gift, HeartHandshake, Phone, Mail, MapPin, Edit3
} from 'lucide-react'
import VipCustomersPage from './VipCustomersPage'

// VIP Customers List
const DEFAULT_VIP_CUSTOMERS = [
  {
    id: 'VIP-001',
    name: 'Suresh Verma',
    email: 'suresh@diecast.vault',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    badge: '👑 Diamond VIP Buyer',
    totalSpent: 28450,
    totalOrders: 9,
    favBrand: 'Hot Wheels Premium',
    avgOrderValue: 3161,
    notes: 'JDM enthusiast. Wants mint condition blister card with zero bent corners. Pack in hard plastic clamshell case.',
    specialHandling: 'Plastic Clamshell Case + Double Bubble Wrap',
    joined: 'Jan 2025'
  },
  {
    id: 'VIP-002',
    name: 'Aryan Malhotra',
    email: 'aryan.m@speedclub.in',
    phone: '+91 98111 44556',
    city: 'Mumbai',
    badge: '🥇 Gold VIP Buyer',
    totalSpent: 21990,
    totalOrders: 7,
    favBrand: 'Mini GT Supercars',
    avgOrderValue: 3141,
    notes: 'Pre-orders all GT3 RS and European supercars. Send via fastest Air Courier.',
    specialHandling: 'Priority Air Express Courier',
    joined: 'Mar 2025'
  },
  {
    id: 'VIP-003',
    name: 'Rohan Kapoor',
    email: 'rohan.k@collector.org',
    phone: '+91 99223 88776',
    city: 'Bangalore',
    badge: '🥈 Silver VIP Buyer',
    totalSpent: 16850,
    totalOrders: 6,
    favBrand: 'Classic Muscle (Shelby Cobra)',
    avgOrderValue: 2808,
    notes: 'Collects 1960s vintage cars. Always put a printed bill inside the shipping box.',
    specialHandling: 'Printed Tax Invoice in Box',
    joined: 'Jul 2025'
  },
  {
    id: 'VIP-004',
    name: 'Meera Deshmukh',
    email: 'meera.d@vintagedrive.in',
    phone: '+91 98334 11223',
    city: 'Pune',
    badge: '🥈 Silver VIP Buyer',
    totalSpent: 13400,
    totalOrders: 4,
    favBrand: 'Matchbox Heritage',
    avgOrderValue: 3350,
    notes: 'Buys gifts for junior collectors. Please gift wrap with Diecast Vault red wax sticker.',
    specialHandling: 'Gift Wrap + Vault Wax Seal',
    joined: 'Sep 2025'
  }
]

export default function OwnerDashboardModal({
  isOpen = true,
  onClose,
  orders = [],
  transactions = [],
  cars = [],
  onUpdateOrderStatus,
  onOpenAdmin,
  onOpenStorefront,
  onAddToast,
  isFullView = false
}) {
  const [orderFilter, setOrderFilter] = useState('ALL')
  // Tabs: 'overview' | 'profit_calculator' | 'payments' | 'orders' | 'vip_customers' | 'stock_value'
  const [activeTab, setActiveTab] = useState('overview')

  // Product Cost & Profit Simulation (Default wholesale buying cost is ~38% of MRP)
  const [buyingCostPercent, setBuyingCostPercent] = useState(38)
  const [deliveryPackPercent, setDeliveryPackPercent] = useState(6)

  // Waybill / Invoice Slip Modal State
  const [activeSlipOrder, setActiveSlipOrder] = useState(null)
  const [customerSearch, setCustomerSearch] = useState('')
  const [vipList, setVipList] = useState(DEFAULT_VIP_CUSTOMERS)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [tempNote, setTempNote] = useState('')

  if (!isOpen && !isFullView) return null

  // Financial calculations (Plain, easy terms)
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const totalOrdersCount = orders.length
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0

  // Cost & Profit calculations
  const totalBuyingCost = Math.round(totalSales * (buyingCostPercent / 100))
  const totalDeliveryCost = Math.round(totalSales * (deliveryPackPercent / 100))
  const cleanTakeHomeProfit = totalSales - totalBuyingCost - totalDeliveryCost
  const profitMarginPercent = totalSales > 0 ? Math.round((cleanTakeHomeProfit / totalSales) * 100) : 0

  // Inventory valuation
  const totalStockUnits = cars.reduce((sum, c) => sum + (c.inStock || 0), 0)
  const totalWarehouseValue = cars.reduce((sum, c) => sum + (c.price * (c.inStock || 0)), 0)

  // Aggregate items sold
  const soldItemsMap = {}
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      if (!soldItemsMap[item.id]) {
        soldItemsMap[item.id] = {
          id: item.id,
          name: item.name,
          brand: item.brand,
          category: item.category,
          price: item.price,
          image: item.images?.[0] || '',
          unitsSold: 0,
          grossSales: 0
        }
      }
      const qty = item.quantity || 1
      soldItemsMap[item.id].unitsSold += qty
      soldItemsMap[item.id].grossSales += item.price * qty
    })
  })

  const bestSellers = Object.values(soldItemsMap).sort((a, b) => b.unitsSold - a.unitsSold)

  // Brand sales breakdown
  const brandSalesMap = { 'Hot Wheels': 0, 'Matchbox': 0, 'Mini GT': 0, 'Other': 0 }
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      const brand = item.brand || 'Other'
      const amount = item.price * (item.quantity || 1)
      if (brandSalesMap[brand] !== undefined) {
        brandSalesMap[brand] += amount
      } else {
        brandSalesMap['Other'] += amount
      }
    })
  })

  // Payment Breakdown
  const paymentBreakdown = {
    upi: { name: 'UPI (GPay / PhonePe / Paytm)', count: 0, amount: 0, feeRate: 0.0, icon: QrCode, color: '#3b82f6' },
    card: { name: 'Credit & Debit Cards (Visa / MC)', count: 0, amount: 0, feeRate: 0.018, icon: CreditCard, color: '#10b981' },
    netbanking: { name: 'Net Banking & Online Transfer', count: 0, amount: 0, feeRate: 0.012, icon: DollarSign, color: '#f59e0b' },
    cod: { name: 'Cash on Delivery (COD)', count: 0, amount: 0, feeRate: 0.0, icon: Truck, color: '#8b5cf6' }
  }

  orders.forEach(order => {
    const methodStr = (order.paymentMethod || '').toLowerCase()
    const amount = order.totalAmount || 0
    if (methodStr.includes('card')) {
      paymentBreakdown.card.count += 1
      paymentBreakdown.card.amount += amount
    } else if (methodStr.includes('net') || methodStr.includes('bank')) {
      paymentBreakdown.netbanking.count += 1
      paymentBreakdown.netbanking.amount += amount
    } else if (methodStr.includes('cod') || methodStr.includes('cash')) {
      paymentBreakdown.cod.count += 1
      paymentBreakdown.cod.amount += amount
    } else {
      paymentBreakdown.upi.count += 1
      paymentBreakdown.upi.amount += amount
    }
  })

  const totalBankFees = Object.values(paymentBreakdown).reduce((sum, p) => sum + Math.round(p.amount * p.feeRate), 0)
  const netInBank = totalSales - totalBankFees

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'ALL') return true
    if (orderFilter === 'DELIVERED') return order.status === 'Delivered'
    if (orderFilter === 'IN_TRANSIT') return order.status === 'In Transit'
    if (orderFilter === 'PACKED') return order.status === 'Packed'
    return true
  })

  // Export Sales Report CSV
  const handleExportCSV = () => {
    const headers = ["Order ID", "Date", "Customer / Payment", "Total Items", "Order Total (INR)", "Delivery Status"]
    const rows = orders.map(o => [
      o.id,
      `"${o.date}"`,
      `"${o.paymentMethod || 'Prepaid'}"`,
      (o.items || []).reduce((s, i) => s + (i.quantity || 1), 0),
      o.totalAmount,
      `"${o.status}"`
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Diecast_Vault_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (onAddToast) onAddToast("Sales report downloaded successfully!", "success")
  }

  // Generate Courier Tracking Slip
  const handleCreateShippingSlip = (order) => {
    const couriers = [
      { name: 'BlueDart Air Express', prefix: 'BD-AIR' },
      { name: 'Delhivery Surface', prefix: 'DEL-SUR' },
      { name: 'FedEx Express', prefix: 'FDX-EXP' }
    ]
    const chosenCourier = couriers[Math.floor(Math.random() * couriers.length)]
    const trackingNo = `${chosenCourier.prefix}-${Math.floor(100000 + Math.random() * 900000)}`

    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(order.id, 'In Transit')
    }

    setActiveSlipOrder({
      ...order,
      trackingNumber: trackingNo,
      courierName: chosenCourier.name,
      dispatchHub: 'Diecast Vault Hub, Mumbai Central, 400001',
      shipDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      deliveryDays: '2 - 3 Days'
    })

    if (onAddToast) onAddToast(`Tracking number ${trackingNo} generated!`, 'success')
  }

  // Save note
  const handleSaveNote = (id) => {
    setVipList(prev => prev.map(c => c.id === id ? { ...c, notes: tempNote } : c))
    setEditingNoteId(null)
    if (onAddToast) onAddToast("Customer special request updated!", "success")
  }

  const content = (
    <div className={`owner-dialog-inner ${isFullView ? 'full-view' : 'modal-mode'}`}>
      {!isFullView && onClose && (
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      )}

      {/* Header */}
      <div className="owner-header">
        <div className="owner-title-group">
          <div className="owner-badge">
            <Crown size={14} color="#f59e0b" />
            <span>Store Owner Portal</span>
          </div>
          <h2 className="owner-main-title">Business Sales & Orders Dashboard</h2>
          <p className="owner-subtitle">
            See your total money made, clean profit, customer orders, and special packaging instructions in plain terms.
          </p>
        </div>

        <div className="owner-actions-top">
          <button
            className="btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Download Excel / CSV Sales Report"
          >
            <Download size={14} /> Download Report
          </button>
          {onOpenStorefront && (
            <button
              className="btn-secondary btn-sm"
              onClick={onOpenStorefront}
              title="See what customers see"
            >
              <Car size={14} /> Customer Storefront
            </button>
          )}
          {onOpenAdmin && (
            <button
              className="btn-primary btn-sm"
              style={{ background: '#10b981', color: '#000' }}
              onClick={() => {
                if (onClose) onClose()
                onOpenAdmin()
              }}
            >
              <Sliders size={14} /> Add / Edit Cars
            </button>
          )}
        </div>
      </div>

      {/* 6 Easy-to-Understand Navigation Tabs */}
      <div className="owner-nav-tabs">
        <button
          className={`owner-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={15} /> 📊 Sales & Profit Overview
        </button>

        <button
          className={`owner-tab-btn ${activeTab === 'profit_calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('profit_calculator')}
        >
          <DollarSign size={15} color="#10b981" /> 💰 Profit per Car (Cost vs Margin)
        </button>

        <button
          className={`owner-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <CreditCard size={15} color="#3b82f6" /> 💳 Payment Methods & Payouts
        </button>

        <button
          className={`owner-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <PackageCheck size={15} /> 📦 Customer Orders & Shipping ({orders.length})
        </button>

        <button
          className={`owner-tab-btn ${activeTab === 'vip_customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('vip_customers')}
        >
          <Award size={15} color="#fbbf24" /> 👑 Top VIP Customers ({vipList.length})
        </button>

        <button 
          className={`owner-tab-btn ${activeTab === 'stock_value' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock_value')}
        >
          <BarChart3 size={15} /> 🏎️ Warehouse Stock Worth
        </button>
      </div>

      {/* =========================================================================
          TAB 1: REVENUE OVERVIEW (Clean, Easy Business Numbers)
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="owner-tab-content">
          {/* Top 4 KPI Stat Cards */}
          <div className="metrics-grid">
            <div className="metric-card gold-border">
              <div className="metric-icon-bg gold">
                <DollarSign size={22} color="#f59e0b" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Money Made (Sales)</span>
                <span className="metric-value">₹{totalSales.toLocaleString('en-IN')}</span>
                <span className="metric-sub text-green">
                  <ArrowUpRight size={13} /> Total money paid by buyers
                </span>
              </div>
            </div>

            <div className="metric-card green-border">
              <div className="metric-icon-bg green">
                <TrendingUp size={22} color="#10b981" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Your Clean Profit ({profitMarginPercent}%)</span>
                <span className="metric-value" style={{ color: '#10b981' }}>₹{cleanTakeHomeProfit.toLocaleString('en-IN')}</span>
                <span className="metric-sub text-muted">Money left after buying & packing</span>
              </div>
            </div>

            <div className="metric-card blue-border">
              <div className="metric-icon-bg blue">
                <ShoppingBag size={22} color="#3b82f6" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Orders Placed</span>
                <span className="metric-value">{totalOrdersCount} Orders</span>
                <span className="metric-sub">Average Basket: ₹{avgOrderValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="metric-card purple-border">
              <div className="metric-icon-bg purple">
                <Car size={22} color="#8b5cf6" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Cars in Warehouse Stock</span>
                <span className="metric-value">{totalStockUnits} Units</span>
                <span className="metric-sub">Selling value: ₹{totalWarehouseValue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* SECTION 1: BEST SELLING DIECAST MODELS PHOTO GRID (Image on Top, Info Underneath) */}
          <div className="overview-section-card" style={{ marginTop: '1.75rem' }}>
            <div className="overview-section-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={18} color="#f59e0b" />
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem', fontWeight: 800 }}>
                    Best Selling Diecast Models
                  </h3>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Top revenue-generating diecast models ordered by collectors (picture on top with full details below).
                </p>
              </div>
              <span className="badge-pill">Top Performers</span>
            </div>

            <div className="bestsellers-photo-grid">
              {bestSellers.slice(0, 4).map((item, idx) => (
                <div key={item.id || idx} className="bestseller-grid-card">
                  {/* Image on top with badges */}
                  <div className="bestseller-photo-header">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="bestseller-card-img"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=600'
                      }}
                    />
                    <span className={`card-rank-tag rank-${idx + 1}`}>
                      #{idx + 1} Best Seller
                    </span>
                    <span className="card-scale-tag">
                      {item.scale || '1:64'}
                    </span>
                    <div className="card-units-sold-chip">
                      <CheckCircle2 size={12} /> {item.unitsSold} Units Sold
                    </div>
                  </div>

                  {/* Information Underneath Picture */}
                  <div className="bestseller-card-body">
                    <h4 className="bestseller-card-title">{item.name}</h4>
                    
                    <div className="bestseller-card-brand">
                      <span>{item.brand}</span>
                      <span className="dot-sep">•</span>
                      <span>{item.category || 'Diecast'}</span>
                    </div>

                    <div className="bestseller-card-financials">
                      <div className="card-price-col">
                        <span className="f-label">Unit Price</span>
                        <strong className="f-val">₹{item.price.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="card-revenue-col">
                        <span className="f-label">Total Made</span>
                        <strong className="f-val revenue-text">₹{item.grossSales.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Split Columns for Brand Market Share & Profit Health */}
          <div className="owner-analytics-split" style={{ marginTop: '1.5rem' }}>
            {/* Brand Market Share */}
            <div className="analytics-box">
              <div className="box-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieChart size={18} color="#38bdf8" />
                  <h3 style={{ margin: 0 }}>Sales by Brand</h3>
                </div>
                <span className="badge-pill">Market Share</span>
              </div>

              <div className="brand-bars-list">
                {Object.entries(brandSalesMap).map(([brand, amount]) => {
                  const percent = totalSales > 0 ? Math.round((amount / totalSales) * 100) : 0
                  const barColor = brand === 'Hot Wheels' ? '#ef4444' : (brand === 'Matchbox' ? '#f59e0b' : (brand === 'Mini GT' ? '#3b82f6' : '#8b5cf6'))

                  return (
                    <div key={brand} className="brand-bar-item">
                      <div className="brand-bar-labels">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="brand-color-dot" style={{ background: barColor }} />
                          <strong>{brand}</strong>
                        </div>
                        <span>₹{amount.toLocaleString('en-IN')} ({percent}%)</span>
                      </div>
                      <div className="progress-bar-track">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${Math.max(5, percent)}%`, background: barColor }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Profit Health Breakdown Card */}
            <div className="analytics-box">
              <div className="box-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="#10b981" />
                  <h3 style={{ margin: 0 }}>Profit & Cost Health</h3>
                </div>
                <span className="badge-pill" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  Healthy
                </span>
              </div>

              <div className="profit-health-card">
                <div className="stacked-bar-container">
                  <div 
                    className="stacked-slice buying" 
                    style={{ width: `${buyingCostPercent}%` }}
                    title={`Wholesale Buying Cost: ${buyingCostPercent}%`}
                  />
                  <div 
                    className="stacked-slice pack" 
                    style={{ width: `${deliveryPackPercent}%` }}
                    title={`Packing & Courier: ${deliveryPackPercent}%`}
                  />
                  <div 
                    className="stacked-slice profit" 
                    style={{ width: `${profitMarginPercent}%` }}
                    title={`Your Clean Profit: ${profitMarginPercent}%`}
                  />
                </div>

                <div className="stacked-legend-grid">
                  <div className="legend-item">
                    <span className="legend-dot buying" />
                    <div className="legend-text">
                      <span className="legend-name">Wholesale Cost</span>
                      <strong>{buyingCostPercent}% (₹{totalBuyingCost.toLocaleString('en-IN')})</strong>
                    </div>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot pack" />
                    <div className="legend-text">
                      <span className="legend-name">Box & Courier</span>
                      <strong>{deliveryPackPercent}% (₹{totalDeliveryCost.toLocaleString('en-IN')})</strong>
                    </div>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot profit" />
                    <div className="legend-text">
                      <span className="legend-name">Your Profit</span>
                      <strong style={{ color: '#10b981' }}>{profitMarginPercent}% (₹{cleanTakeHomeProfit.toLocaleString('en-IN')})</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PROFIT PER CAR (Simple Cost vs Profit Calculator)
          ========================================================================= */}
      {activeTab === 'profit_calculator' && (
        <div className="owner-tab-content">
          <div className="cogs-control-card">
            <div className="cogs-header-row">
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800 }}>
                  Item Cost & Profit Calculator
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '3px' }}>
                  Adjust what you pay to source each car and your packing cost to see your exact profit on every single sale.
                </p>
              </div>

              <div className="cogs-pill-summary">
                <span>Clean Take-Home Profit:</span>
                <strong style={{ color: '#10b981', fontSize: '1.25rem' }}>
                  ₹{cleanTakeHomeProfit.toLocaleString('en-IN')} ({profitMarginPercent}% Margin)
                </strong>
              </div>
            </div>

            <div className="cogs-sliders-grid">
              <div className="slider-box">
                <div className="slider-label-row">
                  <span>Wholesale Buying Cost (What you pay per car)</span>
                  <strong>{buyingCostPercent}% of Selling Price</strong>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={buyingCostPercent}
                  onChange={(e) => setBuyingCostPercent(Number(e.target.value))}
                  className="custom-range-slider"
                />
                <div className="slider-ticks">
                  <span>20% (Low Cost / Huge Profit)</span>
                  <span>38% (Normal Wholesale)</span>
                  <span>60% (High Cost)</span>
                </div>
              </div>

              <div className="slider-box">
                <div className="slider-label-row">
                  <span>Box, Bubble Wrap & Courier Cost</span>
                  <strong>{deliveryPackPercent}% of Selling Price</strong>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={deliveryPackPercent}
                  onChange={(e) => setDeliveryPackPercent(Number(e.target.value))}
                  className="custom-range-slider"
                />
                <div className="slider-ticks">
                  <span>2% (Basic Box)</span>
                  <span>6% (Clamshell + Air Courier)</span>
                  <span>15% (Extra Heavy)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Cost Breakdown Table */}
          <div className="owner-orders-table-wrapper" style={{ marginTop: '1.5rem' }}>
            <table className="owner-orders-table">
              <thead>
                <tr>
                  <th>Diecast Car</th>
                  <th>Selling Price</th>
                  <th>You Pay to Buy ({buyingCostPercent}%)</th>
                  <th>Box & Courier ({deliveryPackPercent}%)</th>
                  <th>Your Clean Profit</th>
                  <th>Profit %</th>
                  <th>Total Profit from Warehouse Stock</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => {
                  const unitBuyCost = Math.round(car.price * (buyingCostPercent / 100))
                  const unitPackCost = Math.round(car.price * (deliveryPackPercent / 100))
                  const unitProfit = car.price - unitBuyCost - unitPackCost
                  const marginPct = Math.round((unitProfit / car.price) * 100)
                  const potentialStockProfit = unitProfit * (car.inStock || 0)

                  return (
                    <tr key={car.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {car.images?.[0] && (
                            <img src={car.images[0]} alt={car.name} style={{ width: '45px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                          )}
                          <div>
                            <strong>{car.name}</strong>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{car.brand} ({car.scale})</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>₹{car.price.toLocaleString('en-IN')}</strong></td>
                      <td style={{ color: '#ef4444' }}>-₹{unitBuyCost.toLocaleString('en-IN')}</td>
                      <td style={{ color: '#f59e0b' }}>-₹{unitPackCost.toLocaleString('en-IN')}</td>
                      <td><strong style={{ color: '#10b981' }}>+₹{unitProfit.toLocaleString('en-IN')}</strong></td>
                      <td>
                        <span className="stock-status-pill good">{marginPct}%</span>
                      </td>
                      <td>
                        <span style={{ color: '#34d399', fontWeight: 700 }}>
                          ₹{potentialStockProfit.toLocaleString('en-IN')}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({car.inStock} units in stock)</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PAYMENT METHODS & BANK PAYOUTS
          ========================================================================= */}
      {activeTab === 'payments' && (
        <div className="owner-tab-content">
          <div className="metrics-grid">
            <div className="metric-card gold-border">
              <div className="metric-icon-bg gold"><DollarSign size={20} color="#f59e0b" /></div>
              <div className="metric-info">
                <span className="metric-label">Total Customer Payments</span>
                <span className="metric-value">₹{totalSales.toLocaleString('en-IN')}</span>
                <span className="metric-sub">{totalOrdersCount} Total Payments</span>
              </div>
            </div>

            <div className="metric-card red-border">
              <div className="metric-icon-bg red"><ArrowDownRight size={20} color="#ef4444" /></div>
              <div className="metric-info">
                <span className="metric-label">Bank Processing Charges</span>
                <span className="metric-value" style={{ color: '#ef4444' }}>-₹{totalBankFees.toLocaleString('en-IN')}</span>
                <span className="metric-sub">Credit Card & Payment Gateway Fees</span>
              </div>
            </div>

            <div className="metric-card green-border">
              <div className="metric-icon-bg green"><CheckCircle2 size={20} color="#10b981" /></div>
              <div className="metric-info">
                <span className="metric-label">Net Deposited into Bank</span>
                <span className="metric-value" style={{ color: '#10b981' }}>₹{netInBank.toLocaleString('en-IN')}</span>
                <span className="metric-sub text-green">Deposited in 24-48 Hours</span>
              </div>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="payment-channels-grid">
            {Object.entries(paymentBreakdown).map(([key, channel]) => {
              const ChannelIcon = channel.icon
              const percent = totalSales > 0 ? Math.round((channel.amount / totalSales) * 100) : 0
              const fees = Math.round(channel.amount * channel.feeRate)
              return (
                <div key={key} className="payment-channel-card">
                  <div className="channel-top">
                    <div className="channel-icon" style={{ color: channel.color, background: `${channel.color}18` }}>
                      <ChannelIcon size={20} />
                    </div>
                    <div>
                      <h4 className="channel-title">{channel.name}</h4>
                      <span className="channel-sub">{channel.count} Orders</span>
                    </div>
                  </div>

                  <div className="channel-volume-row">
                    <span>Total Paid:</span>
                    <strong>₹{channel.amount.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="progress-bar-track" style={{ margin: '0.65rem 0' }}>
                    <div className="progress-bar-fill" style={{ width: `${percent}%`, background: channel.color }} />
                  </div>

                  <div className="channel-footer-metrics">
                    <span>Bank Fee: {channel.feeRate > 0 ? `${channel.feeRate * 100}%` : '0% (Free)'}</span>
                    <span>Fee Deducted: ₹{fees.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CUSTOMER ORDERS & SHIPPING
          ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="owner-tab-content">
          <div className="table-filter-bar">
            <div className="filter-buttons">
              <button
                className={`filter-chip ${orderFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setOrderFilter('ALL')}
              >
                All Orders ({orders.length})
              </button>
              <button
                className={`filter-chip ${orderFilter === 'IN_TRANSIT' ? 'active' : ''}`}
                onClick={() => setOrderFilter('IN_TRANSIT')}
              >
                On the Way (In Transit)
              </button>
              <button
                className={`filter-chip ${orderFilter === 'DELIVERED' ? 'active' : ''}`}
                onClick={() => setOrderFilter('DELIVERED')}
              >
                Delivered
              </button>
            </div>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {filteredOrders.length} customer orders
            </span>
          </div>

          <div className="owner-orders-table-wrapper">
            <table className="owner-orders-table">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Date</th>
                  <th>Customer & Delivery Address</th>
                  <th>Items Ordered</th>
                  <th>Amount Paid</th>
                  <th>Order Status</th>
                  <th>Courier Shipping Slip</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <div className="customer-info-cell">
                        <strong>{order.shippingAddress?.split(',')[0] || 'Flat 402, Skyline Towers'}</strong>
                        <small>{order.shippingAddress || 'New Delhi, 110001'}</small>
                        <span className="pay-badge">{order.paymentMethod || 'Prepaid UPI'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="order-items-cell">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="order-item-chip">
                            {item.name} <span style={{ color: 'var(--accent-red)' }}>x{item.quantity || 1}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </strong>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                        className={`status-select ${order.status?.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <option value="Sealed">🔒 Order Confirmed</option>
                        <option value="Packed">📦 Packed in Box</option>
                        <option value="In Transit">🚚 In Transit (With Courier)</option>
                        <option value="Delivered">✅ Delivered to Customer</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn-primary btn-sm btn-waybill"
                        onClick={() => handleCreateShippingSlip(order)}
                        title="Print Courier Shipping Label and Bill"
                      >
                        <FileText size={13} />
                        <span>Print Shipping Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: TOP VIP CUSTOMERS & PACKAGING REQUESTS
          ========================================================================= */}
      {activeTab === 'vip_customers' && (
        <div className="owner-tab-content">
          <VipCustomersPage onAddToast={onAddToast} />
        </div>
      )}

      {/* =========================================================================
          TAB 6: WAREHOUSE STOCK WORTH
          ========================================================================= */}
      {activeTab === 'stock_value' && (
        <div className="owner-tab-content">
          <div className="metrics-grid">
            <div className="metric-card blue-border">
              <div className="metric-icon-bg blue"><Car size={22} color="#3b82f6" /></div>
              <div className="metric-info">
                <span className="metric-label">Total Diecast Stock</span>
                <span className="metric-value">{totalStockUnits} Units</span>
                <span className="metric-sub">{cars.length} Different Car Castings</span>
              </div>
            </div>

            <div className="metric-card green-border">
              <div className="metric-icon-bg green"><DollarSign size={22} color="#10b981" /></div>
              <div className="metric-info">
                <span className="metric-label">Total Selling Worth in Warehouse</span>
                <span className="metric-value">₹{totalWarehouseValue.toLocaleString('en-IN')}</span>
                <span className="metric-sub text-green">Total value when all units sell</span>
              </div>
            </div>
          </div>

          <div className="owner-orders-table-wrapper">
            <table className="owner-orders-table">
              <thead>
                <tr>
                  <th>Car Name</th>
                  <th>Brand & Scale</th>
                  <th>Selling Price per Unit</th>
                  <th>Units Remaining in Stock</th>
                  <th>Total Stock Worth</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => {
                  const lineValue = car.price * (car.inStock || 0)
                  return (
                    <tr key={car.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {car.images?.[0] && (
                            <img src={car.images[0]} alt={car.name} style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                          )}
                          <strong>{car.name}</strong>
                        </div>
                      </td>
                      <td>{car.brand} ({car.scale})</td>
                      <td>₹{car.price.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`stock-status-pill ${car.inStock < 10 ? 'low' : 'good'}`}>
                          {car.inStock} units
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: '#10b981' }}>₹{lineValue.toLocaleString('en-IN')}</strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRINTABLE COURIER SHIPPING SLIP & BILL MODAL */}
      {activeSlipOrder && (
        <div className="admin-submodal-overlay" onClick={() => setActiveSlipOrder(null)}>
          <div className="waybill-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="waybill-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} color="#10b981" />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>
                  Courier Shipping Slip & Invoice
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveSlipOrder(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Printable Slip Sheet */}
            <div className="printable-waybill-sheet">
              <div className="waybill-top-strip">
                <div className="waybill-brand">
                  <span>✦ DIECAST VAULT COURIER DISPATCH</span>
                  <h2>{activeSlipOrder.courierName}</h2>
                </div>
                <div className="waybill-awb-box">
                  <div className="awb-barcode-placeholder">
                    ||| | |||| | ||| |||| | || |||| |
                  </div>
                  <strong>Tracking No: {activeSlipOrder.trackingNumber}</strong>
                </div>
              </div>

              <div className="waybill-address-grid">
                <div className="address-block">
                  <label>SENDER (STORE WAREHOUSE):</label>
                  <strong>Diecast Vault Central Hub</strong>
                  <p>{activeSlipOrder.dispatchHub}</p>
                  <p>GSTIN: 27AAACD9981K1Z2 · Support: +91 22 2890 1100</p>
                </div>

                <div className="address-block recipient">
                  <label>DELIVER TO (CUSTOMER):</label>
                  <strong>Suresh Verma (Collector)</strong>
                  <p>{activeSlipOrder.shippingAddress || 'Flat 402, Skyline Towers, New Delhi - 110001'}</p>
                  <p>Phone: +91 98765 43210</p>
                </div>
              </div>

              <div className="waybill-items-table">
                <div className="items-table-header">
                  <span>Car Model</span>
                  <span>Qty</span>
                  <span>Price</span>
                </div>
                {(activeSlipOrder.items || []).map((item, i) => (
                  <div key={i} className="items-table-row">
                    <span>{item.name} ({item.scale} Diecast Metal Model)</span>
                    <span>x{item.quantity || 1}</span>
                    <span>₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="waybill-footer-summary">
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#666' }}>PAYMENT STATUS:</span>
                  <strong>{activeSlipOrder.paymentMethod || 'Prepaid Verified (UPI)'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#666' }}>DISPATCH DATE:</span>
                  <strong>{activeSlipOrder.shipDate}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#666' }}>TOTAL BILL AMOUNT:</span>
                  <strong style={{ color: '#000', fontSize: '1.05rem' }}>₹{activeSlipOrder.totalAmount?.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <div className="waybill-modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setActiveSlipOrder(null)}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  window.print()
                  if (onAddToast) onAddToast("Shipping slip ready for courier dispatch!", "success")
                }}
              >
                <Printer size={15} /> Print Shipping Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (isFullView) {
    return (
      <div className="owner-full-page-wrapper">
        <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1400px' }}>
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog owner-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  )
}
