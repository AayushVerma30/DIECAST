import React, { useState } from 'react'
import {
  X, Crown, TrendingUp, DollarSign, PackageCheck, ShoppingBag,
  BarChart3, PieChart, Users, ArrowUpRight, Download, Filter,
  CheckCircle2, Clock, Truck, ShieldAlert, Sparkles, RefreshCw, Car,
  CreditCard, QrCode, FileText, Printer, Award, Star, Search,
  Wrench, ArrowDownRight, Check, AlertCircle, Send, ExternalLink,
  Gift, HeartHandshake, Phone, Mail, MapPin, Edit3, Plus, Minus, Calculator, Percent,
  FileSpreadsheet
} from 'lucide-react'
import VipCustomersPage, { INITIAL_VIP_CUSTOMERS } from './VipCustomersPage'
import { exportToCSV, exportToPDF, exportMultiSectionPDF } from '../utils/exportUtils'

// VIP Customers List
const DEFAULT_VIP_CUSTOMERS = INITIAL_VIP_CUSTOMERS || [
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

  // =========================================================================
  // EXPORT UTILITIES (ALL 6 TABS + MASTER DOSSIER)
  // =========================================================================

  // 1. Tab 1: Sales & Profit Overview CSV & PDF
  const handleExportOverviewCSV = () => {
    const headers = ["Rank", "Car Model", "Brand", "Scale", "Category", "Unit Price (INR)", "Units Sold", "Total Revenue (INR)"]
    const rows = bestSellers.map((item, idx) => [
      `#${idx + 1}`,
      item.name,
      item.brand,
      item.scale || '1:64',
      item.category || 'Diecast',
      item.price,
      item.unitsSold,
      item.grossSales
    ])

    exportToCSV({
      filename: `Diecast_Vault_Sales_Overview_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    })

    if (onAddToast) onAddToast("Sales & Profit overview exported to CSV!", "success")
  }

  const handleExportOverviewPDF = () => {
    const headers = ["Rank", "Diecast Model", "Brand & Scale", "Unit Price", "Units Sold", "Total Made"]
    const rows = bestSellers.map((item, idx) => [
      `<strong>#${idx + 1}</strong>`,
      `<strong>${item.name}</strong>`,
      `${item.brand} (${item.scale || '1:64'})`,
      `₹${item.price.toLocaleString('en-IN')}`,
      `<strong>${item.unitsSold} units</strong>`,
      `<strong style="color:#059669">₹${item.grossSales.toLocaleString('en-IN')}</strong>`
    ])

    exportToPDF({
      title: "Business Sales & Revenue Overview Report",
      subtitle: "Top-performing diecast castings, brand revenue distribution, and net take-home margin.",
      category: "Sales Overview",
      kpis: [
        { label: "Total Sales", value: `₹${totalSales.toLocaleString('en-IN')}`, sub: "Gross payments collected", color: "#f59e0b" },
        { label: "Clean Net Profit", value: `₹${cleanTakeHomeProfit.toLocaleString('en-IN')}`, sub: `${profitMarginPercent}% Take-Home Margin`, color: "#10b981" },
        { label: "Total Orders", value: `${totalOrdersCount} Orders`, sub: `Avg Basket: ₹${avgOrderValue.toLocaleString('en-IN')}`, color: "#3b82f6" },
        { label: "Stock In Warehouse", value: `${totalStockUnits} Units`, sub: `₹${totalWarehouseValue.toLocaleString('en-IN')} Worth`, color: "#8b5cf6" }
      ],
      headers,
      rows,
      notes: "Top-ranking best sellers are sorted by gross revenue generated across all verified customer orders."
    })

    if (onAddToast) onAddToast("Sales Overview PDF generated! Save or print.", "success")
  }

  // 2. Tab 2: Profit per Car (Cost vs Margin) CSV & PDF
  const handleExportProfitCalculatorCSV = () => {
    const headers = ["Car ID", "Car Name", "Brand", "Scale", "Selling Price (INR)", `Buying Cost (${buyingCostPercent}%)`, `Packaging Cost (${deliveryPackPercent}%)`, "Clean Unit Profit (INR)", "Margin %", "Stock Units", "Total Potential Profit (INR)"]
    const rows = cars.map(car => {
      const unitBuyCost = Math.round(car.price * (buyingCostPercent / 100))
      const unitPackCost = Math.round(car.price * (deliveryPackPercent / 100))
      const unitProfit = car.price - unitBuyCost - unitPackCost
      const marginPct = Math.round((unitProfit / car.price) * 100)
      const potentialStockProfit = unitProfit * (car.inStock || 0)
      return [
        car.id,
        car.name,
        car.brand,
        car.scale,
        car.price,
        unitBuyCost,
        unitPackCost,
        unitProfit,
        `${marginPct}%`,
        car.inStock || 0,
        potentialStockProfit
      ]
    })

    exportToCSV({
      filename: `Diecast_Vault_Item_Cost_Profit_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    })

    if (onAddToast) onAddToast("Cost & Profit Margin sheet exported to CSV!", "success")
  }

  const handleExportProfitCalculatorPDF = () => {
    const headers = ["Car Model", "Selling Price", `Buying (${buyingCostPercent}%)`, `Packing (${deliveryPackPercent}%)`, "Unit Profit", "Margin", "Total Stock Profit"]
    const rows = cars.map(car => {
      const unitBuyCost = Math.round(car.price * (buyingCostPercent / 100))
      const unitPackCost = Math.round(car.price * (deliveryPackPercent / 100))
      const unitProfit = car.price - unitBuyCost - unitPackCost
      const marginPct = Math.round((unitProfit / car.price) * 100)
      const potentialStockProfit = unitProfit * (car.inStock || 0)
      return [
        `<strong>${car.name}</strong> <small style="color:#6b7280">(${car.brand})</small>`,
        `₹${car.price.toLocaleString('en-IN')}`,
        `<span style="color:#dc2626">-₹${unitBuyCost.toLocaleString('en-IN')}</span>`,
        `<span style="color:#d97706">-₹${unitPackCost.toLocaleString('en-IN')}</span>`,
        `<strong style="color:#059669">+₹${unitProfit.toLocaleString('en-IN')}</strong>`,
        `<span style="background:#ecfdf5; color:#065f46; padding:2px 6px; border-radius:4px; font-weight:700">${marginPct}%</span>`,
        `<strong style="color:#059669">₹${potentialStockProfit.toLocaleString('en-IN')}</strong>`
      ]
    })

    exportToPDF({
      title: "Diecast Item Sourcing Cost & Margin Audit Report",
      subtitle: `Calculated with ${buyingCostPercent}% Wholesale Sourcing and ${deliveryPackPercent}% Box & Courier Packing.`,
      category: "Cost & Margin Analysis",
      kpis: [
        { label: "Wholesale Sourcing", value: `${buyingCostPercent}%`, sub: `₹${totalBuyingCost.toLocaleString('en-IN')} Total Cost`, color: "#ef4444" },
        { label: "Packaging & Courier", value: `${deliveryPackPercent}%`, sub: `₹${totalDeliveryCost.toLocaleString('en-IN')} Packing Fee`, color: "#f59e0b" },
        { label: "Clean Take-Home Profit", value: `₹${cleanTakeHomeProfit.toLocaleString('en-IN')}`, sub: `${profitMarginPercent}% Net Margin`, color: "#10b981" },
        { label: "Models Evaluated", value: `${cars.length} Castings`, sub: `${totalStockUnits} Units In Warehouse`, color: "#3b82f6" }
      ],
      headers,
      rows,
      notes: "Unit profits and potential warehouse yields update dynamically with your active wholesale buying percentage and courier costs."
    })

    if (onAddToast) onAddToast("Profit & Margin PDF generated! Save or print.", "success")
  }

  // 3. Tab 3: Payment Methods & Payouts CSV & PDF
  const handleExportPaymentsCSV = () => {
    const headers = ["Payment Channel", "Orders Count", "Gross Amount Collected (INR)", "Bank Fee Rate", "Bank Fee Deducted (INR)", "Net Payout Deposited (INR)"]
    const rows = Object.entries(paymentBreakdown).map(([key, channel]) => {
      const fees = Math.round(channel.amount * channel.feeRate)
      const net = channel.amount - fees
      return [
        channel.name,
        channel.count,
        channel.amount,
        channel.feeRate > 0 ? `${(channel.feeRate * 100).toFixed(1)}%` : '0% (Free)',
        fees,
        net
      ]
    })

    exportToCSV({
      filename: `Diecast_Vault_Bank_Payouts_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    })

    if (onAddToast) onAddToast("Payment Methods & Payouts exported to CSV!", "success")
  }

  const handleExportPaymentsPDF = () => {
    const headers = ["Payment Channel", "Orders Count", "Gross Amount", "Gateway Rate", "Fees Deducted", "Net Bank Deposit"]
    const rows = Object.entries(paymentBreakdown).map(([key, channel]) => {
      const fees = Math.round(channel.amount * channel.feeRate)
      const net = channel.amount - fees
      return [
        `<strong>${channel.name}</strong>`,
        `${channel.count} orders`,
        `₹${channel.amount.toLocaleString('en-IN')}`,
        channel.feeRate > 0 ? `${(channel.feeRate * 100).toFixed(1)}%` : '<span style="color:#059669">0% (Free)</span>',
        `<span style="color:#dc2626">-₹${fees.toLocaleString('en-IN')}</span>`,
        `<strong style="color:#059669">₹${net.toLocaleString('en-IN')}</strong>`
      ]
    })

    exportToPDF({
      title: "Payment Gateway Settlements & Bank Payouts Statement",
      subtitle: "Gross customer payments collected across UPI, Credit Cards, Net Banking, and COD with bank processing fees deducted.",
      category: "Payouts Statement",
      kpis: [
        { label: "Gross Payments", value: `₹${totalSales.toLocaleString('en-IN')}`, sub: `${totalOrdersCount} Total Customer Payments`, color: "#f59e0b" },
        { label: "Bank Gateway Fees", value: `-₹${totalBankFees.toLocaleString('en-IN')}`, sub: "Processing charges", color: "#ef4444" },
        { label: "Net Money in Bank", value: `₹${netInBank.toLocaleString('en-IN')}`, sub: "Direct bank deposit", color: "#10b981" },
        { label: "Settlement Time", value: "24-48 Hours", sub: "Auto-payout schedule", color: "#3b82f6" }
      ],
      headers,
      rows,
      notes: "UPI transactions have 0% gateway charges. Card transactions incur standard 1.8% gateway MDR fee."
    })

    if (onAddToast) onAddToast("Bank Payout statement PDF generated! Save or print.", "success")
  }

  // 4. Tab 4: Customer Orders & Shipping CSV & PDF
  const handleExportOrdersCSV = () => {
    const headers = ["Order ID", "Date", "Customer & Address", "Payment Method", "Items Ordered", "Total Amount (INR)", "Status"]
    const rows = filteredOrders.map(o => [
      o.id,
      o.date,
      o.shippingAddress || 'Customer Order',
      o.paymentMethod || 'Prepaid UPI',
      (o.items || []).map(i => `${i.name} (x${i.quantity || 1})`).join('; '),
      o.totalAmount || 0,
      o.status
    ])

    exportToCSV({
      filename: `Diecast_Vault_Customer_Orders_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    })

    if (onAddToast) onAddToast("Customer Orders exported to CSV successfully!", "success")
  }

  const handleExportOrdersPDF = () => {
    const headers = ["Order ID", "Date", "Customer & Delivery Address", "Items Ordered", "Total Paid", "Status"]
    const rows = filteredOrders.map(o => [
      `<strong>${o.id}</strong>`,
      o.date,
      `<div>${o.shippingAddress || 'Skyline Towers, Flat 402'}</div><small style="color:#6b7280; font-size:11px">${o.paymentMethod || 'Prepaid UPI'}</small>`,
      (o.items || []).map(i => `<div>${i.name} <strong style="color:#ef4444">x${i.quantity || 1}</strong></div>`).join(''),
      `<strong style="color:#059669; font-size:13px">₹${(o.totalAmount || 0).toLocaleString('en-IN')}</strong>`,
      `<span style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:4px; font-weight:700; font-size:11px">${o.status}</span>`
    ])

    exportToPDF({
      title: "Customer Orders & Shipping Fulfillment Report",
      subtitle: "Official order tracking records, customer fulfillment addresses, item line lists, and dispatch statuses.",
      category: "Orders & Shipping",
      kpis: [
        { label: "Orders Listed", value: `${filteredOrders.length} Orders`, sub: `${orderFilter} filter active`, color: "#3b82f6" },
        { label: "Total Paid", value: `₹${filteredOrders.reduce((s, o) => s + (o.totalAmount || 0), 0).toLocaleString('en-IN')}`, sub: "Gross order value", color: "#10b981" },
        { label: "Delivered", value: `${orders.filter(o => o.status === 'Delivered').length}`, sub: "Completed orders", color: "#059669" },
        { label: "In Transit", value: `${orders.filter(o => o.status === 'In Transit').length}`, sub: "Courier on the way", color: "#f59e0b" }
      ],
      headers,
      rows,
      notes: "This document contains customer order tracking details verified from the Diecast Vault Shipping Portal."
    })

    if (onAddToast) onAddToast("Orders PDF report generated! Save or print.", "success")
  }

  // Alias for backward compatibility
  const handleExportCSV = handleExportOrdersCSV
  const handleExportPDF = handleExportOrdersPDF

  // 5. Tab 5: VIP Customers CSV & PDF
  const handleExportVipCSV = () => {
    const headers = ["VIP ID", "Name", "Email", "Phone", "City", "VIP Tier", "Total Spent (INR)", "Orders Count", "Favorite Brand", "Packaging Instructions"]
    const rows = vipList.map(c => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.city,
      c.tier || c.badge || 'VIP',
      c.totalSpent || 0,
      c.totalOrders || 0,
      c.favBrand || 'Hot Wheels Premium',
      c.specialHandling || c.notes || 'Mint blister pack'
    ])

    exportToCSV({
      filename: `Diecast_Vault_VIP_Customers_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    })

    if (onAddToast) onAddToast("VIP Customer registry exported to CSV!", "success")
  }

  const handleExportVipPDF = () => {
    const totalVipSpend = vipList.reduce((s, c) => s + (c.totalSpent || 0), 0)
    const headers = ["VIP ID", "Collector Contact", "VIP Tier", "Total Spent", "Orders", "Fav Brand", "Special Packaging"]
    const rows = vipList.map(c => [
      `<strong>${c.id}</strong>`,
      `<div><strong>${c.name}</strong></div><small style="color:#6b7280">${c.email} • ${c.phone} • ${c.city}</small>`,
      `<span style="background:#fef3c7; color:#92400e; padding:3px 8px; border-radius:4px; font-weight:800; font-size:11px">${c.badge || `${c.tier || 'VIP'} Member`}</span>`,
      `<strong style="color:#059669">₹${(c.totalSpent || 0).toLocaleString('en-IN')}</strong>`,
      `${c.totalOrders || 1} orders`,
      c.favBrand || 'Hot Wheels Premium',
      `<div style="background:#fffbeb; padding:4px 8px; border-radius:4px; border:1px solid #fef3c7; font-size:11px; color:#b45309">📦 ${c.specialHandling || c.notes || 'Mint blister packaging'}</div>`
    ])

    exportToPDF({
      title: "Top VIP Collectors Registry & Packaging Directory",
      subtitle: "Top-tier collectors, purchase history, favorite castings, and custom packaging handling instructions.",
      category: "VIP Registry",
      kpis: [
        { label: "VIP Collectors", value: `${vipList.length} Members`, sub: "High-value tier", color: "#f59e0b" },
        { label: "VIP Total Spend", value: `₹${totalVipSpend.toLocaleString('en-IN')}`, sub: "Collective gross spend", color: "#10b981" },
        { label: "Avg Spend / VIP", value: `₹${Math.round(totalVipSpend / (vipList.length || 1)).toLocaleString('en-IN')}`, sub: "Per VIP member", color: "#3b82f6" },
        { label: "Custom Packing", value: `${vipList.length} Active`, sub: "Clamshells & Wax Seals", color: "#8b5cf6" }
      ],
      headers,
      rows,
      notes: "VIP collectors must be dispatched with pristine blister protection, plastic clamshell cases, and corner edge guards as recorded above."
    })

    if (onAddToast) onAddToast("VIP Registry PDF report generated! Save or print.", "success")
  }

  // 6. Tab 6: Warehouse Stock CSV & PDF
  const handleExportStockCSV = () => {
    const headers = ["Car Name", "Brand", "Scale", "Category", "Unit Price (INR)", "Units in Stock", "Total Stock Value (INR)"]
    const rows = cars.map(c => [
      c.name,
      c.brand,
      c.scale,
      c.category || 'Diecast',
      c.price,
      c.inStock || 0,
      c.price * (c.inStock || 0)
    ])

    exportToCSV({
      filename: `Diecast_Vault_Warehouse_Stock_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    })

    if (onAddToast) onAddToast("Warehouse Stock Valuation exported to CSV!", "success")
  }

  const handleExportStockPDF = () => {
    const headers = ["Car Model", "Brand & Scale", "Unit Price", "Stock Units", "Total Worth"]
    const rows = cars.map(c => [
      `<strong>${c.name}</strong>`,
      `${c.brand} (${c.scale})`,
      `₹${c.price.toLocaleString('en-IN')}`,
      `<span style="font-weight:700">${c.inStock} units</span>`,
      `<strong style="color:#059669">₹${(c.price * (c.inStock || 0)).toLocaleString('en-IN')}</strong>`
    ])

    exportToPDF({
      title: "Warehouse Inventory Valuation & Stock Report",
      subtitle: "Complete diecast catalog stock inventory quantities, unit values, and total warehouse asset worth.",
      category: "Stock Valuation",
      kpis: [
        { label: "Total Models", value: `${cars.length} Models`, sub: "Distinct car castings", color: "#3b82f6" },
        { label: "Total Units", value: `${totalStockUnits} Units`, sub: "Available in warehouse", color: "#f59e0b" },
        { label: "Warehouse Worth", value: `₹${totalWarehouseValue.toLocaleString('en-IN')}`, sub: "Total retail asset value", color: "#10b981" },
        { label: "Avg Price", value: `₹${Math.round(totalWarehouseValue / (totalStockUnits || 1)).toLocaleString('en-IN')}`, sub: "Per casting unit", color: "#8b5cf6" }
      ],
      headers,
      rows,
      notes: "Stock valuation calculated based on current catalog selling price and remaining warehouse count."
    })

    if (onAddToast) onAddToast("Warehouse Valuation PDF generated! Save or print.", "success")
  }

  // 7. Master PDF: Complete Business Master Dossier (All 6 Pages in One PDF)
  const handleExportMasterPDF = () => {
    const totalVipSpend = vipList.reduce((s, c) => s + (c.totalSpent || 0), 0)

    const sections = [
      // 01. Sales Overview
      {
        title: "Sales & Revenue Performance Overview",
        subtitle: "Top-ranked best-selling diecast models and revenue yields across customer orders.",
        kpis: [
          { label: "Total Sales", value: `₹${totalSales.toLocaleString('en-IN')}`, color: "#f59e0b" },
          { label: "Clean Net Profit", value: `₹${cleanTakeHomeProfit.toLocaleString('en-IN')}`, sub: `${profitMarginPercent}% Margin`, color: "#10b981" },
          { label: "Orders Count", value: `${totalOrdersCount}`, color: "#3b82f6" },
          { label: "Warehouse Asset", value: `₹${totalWarehouseValue.toLocaleString('en-IN')}`, color: "#8b5cf6" }
        ],
        headers: ["Rank", "Diecast Model", "Brand & Scale", "Unit Price", "Units Sold", "Total Made"],
        rows: bestSellers.slice(0, 10).map((item, idx) => [
          `<strong>#${idx + 1}</strong>`,
          `<strong>${item.name}</strong>`,
          `${item.brand} (${item.scale || '1:64'})`,
          `₹${item.price.toLocaleString('en-IN')}`,
          `<strong>${item.unitsSold} units</strong>`,
          `<strong style="color:#059669">₹${item.grossSales.toLocaleString('en-IN')}</strong>`
        ])
      },
      // 02. Profit per Car
      {
        title: "Profit per Car & Sourcing Cost vs Margin Analysis",
        subtitle: `Wholesale sourcing calculated at ${buyingCostPercent}%, Box & Courier packaging calculated at ${deliveryPackPercent}%.`,
        kpis: [
          { label: "Sourcing Cost", value: `${buyingCostPercent}% (₹${totalBuyingCost.toLocaleString('en-IN')})`, color: "#ef4444" },
          { label: "Packaging & Courier", value: `${deliveryPackPercent}% (₹${totalDeliveryCost.toLocaleString('en-IN')})`, color: "#f59e0b" },
          { label: "Net Take-Home", value: `${profitMarginPercent}% (₹${cleanTakeHomeProfit.toLocaleString('en-IN')})`, color: "#10b981" }
        ],
        headers: ["Car Model", "Selling Price", `Buying (${buyingCostPercent}%)`, `Packing (${deliveryPackPercent}%)`, "Unit Profit", "Margin", "Total Stock Profit"],
        rows: cars.slice(0, 15).map(car => {
          const unitBuyCost = Math.round(car.price * (buyingCostPercent / 100))
          const unitPackCost = Math.round(car.price * (deliveryPackPercent / 100))
          const unitProfit = car.price - unitBuyCost - unitPackCost
          const marginPct = Math.round((unitProfit / car.price) * 100)
          const potentialStockProfit = unitProfit * (car.inStock || 0)
          return [
            `<strong>${car.name}</strong> <small>(${car.brand})</small>`,
            `₹${car.price.toLocaleString('en-IN')}`,
            `<span style="color:#dc2626">-₹${unitBuyCost.toLocaleString('en-IN')}</span>`,
            `<span style="color:#d97706">-₹${unitPackCost.toLocaleString('en-IN')}</span>`,
            `<strong style="color:#059669">+₹${unitProfit.toLocaleString('en-IN')}</strong>`,
            `<strong>${marginPct}%</strong>`,
            `<strong style="color:#059669">₹${potentialStockProfit.toLocaleString('en-IN')}</strong>`
          ]
        })
      },
      // 03. Payments & Gateway Settlements
      {
        title: "Payment Gateway Settlements & Net Bank Payouts",
        subtitle: "Gross customer collections across UPI, Credit Cards, Net Banking, and COD with bank processing fees deducted.",
        kpis: [
          { label: "Gross Payments", value: `₹${totalSales.toLocaleString('en-IN')}`, color: "#f59e0b" },
          { label: "Bank Charges", value: `-₹${totalBankFees.toLocaleString('en-IN')}`, color: "#ef4444" },
          { label: "Net in Bank", value: `₹${netInBank.toLocaleString('en-IN')}`, color: "#10b981" }
        ],
        headers: ["Payment Channel", "Orders Count", "Gross Amount", "Gateway Rate", "Fees Deducted", "Net Bank Deposit"],
        rows: Object.entries(paymentBreakdown).map(([key, channel]) => {
          const fees = Math.round(channel.amount * channel.feeRate)
          const net = channel.amount - fees
          return [
            `<strong>${channel.name}</strong>`,
            `${channel.count} orders`,
            `₹${channel.amount.toLocaleString('en-IN')}`,
            channel.feeRate > 0 ? `${(channel.feeRate * 100).toFixed(1)}%` : '<span style="color:#059669">0% (Free)</span>',
            `<span style="color:#dc2626">-₹${fees.toLocaleString('en-IN')}</span>`,
            `<strong style="color:#059669">₹${net.toLocaleString('en-IN')}</strong>`
          ]
        })
      },
      // 04. Customer Orders
      {
        title: "Customer Orders & Delivery Dispatch Log",
        subtitle: "Verified customer purchases, delivery addresses, item lineups, and live shipping status.",
        kpis: [
          { label: "Orders Logged", value: `${orders.length} Orders`, color: "#3b82f6" },
          { label: "Delivered", value: `${orders.filter(o => o.status === 'Delivered').length}`, color: "#10b981" },
          { label: "In Transit", value: `${orders.filter(o => o.status === 'In Transit').length}`, color: "#f59e0b" }
        ],
        headers: ["Order ID", "Date", "Customer & Delivery Address", "Items Ordered", "Total Paid", "Status"],
        rows: orders.map(o => [
          `<strong>${o.id}</strong>`,
          o.date,
          `<div>${o.shippingAddress || 'Skyline Towers, Flat 402'}</div><small style="color:#6b7280">${o.paymentMethod || 'Prepaid UPI'}</small>`,
          (o.items || []).map(i => `<div>${i.name} <strong style="color:#ef4444">x${i.quantity || 1}</strong></div>`).join(''),
          `<strong style="color:#059669">₹${(o.totalAmount || 0).toLocaleString('en-IN')}</strong>`,
          `<span style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-weight:700; font-size:11px">${o.status}</span>`
        ])
      },
      // 05. VIP Customers
      {
        title: "VIP Collector Registry & Special Packaging Instructions",
        subtitle: "High-value buyers, total lifetime spend, preferred brands, and custom protective shipping instructions.",
        kpis: [
          { label: "VIP Collectors", value: `${vipList.length} Members`, color: "#f59e0b" },
          { label: "VIP Spend", value: `₹${totalVipSpend.toLocaleString('en-IN')}`, color: "#10b981" }
        ],
        headers: ["VIP ID", "Collector Contact", "VIP Tier", "Total Spent", "Orders", "Fav Brand", "Special Packaging"],
        rows: vipList.map(c => [
          `<strong>${c.id}</strong>`,
          `<div><strong>${c.name}</strong></div><small style="color:#6b7280">${c.email} • ${c.phone} • ${c.city}</small>`,
          `<span style="background:#fef3c7; color:#92400e; padding:2px 6px; border-radius:4px; font-weight:800">${c.badge || `${c.tier || 'VIP'} Member`}</span>`,
          `<strong style="color:#059669">₹${(c.totalSpent || 0).toLocaleString('en-IN')}</strong>`,
          `${c.totalOrders || 1} orders`,
          c.favBrand || 'Hot Wheels Premium',
          `<div style="background:#fffbeb; padding:4px 8px; border-radius:4px; border:1px solid #fef3c7; font-size:11px; color:#b45309">📦 ${c.specialHandling || c.notes || 'Mint blister card'}</div>`
        ])
      },
      // 06. Warehouse Stock
      {
        title: "Warehouse Inventory Stock & Asset Valuation",
        subtitle: "Complete physical catalog stock count, unit selling prices, and total inventory value.",
        kpis: [
          { label: "Total Models", value: `${cars.length} Models`, color: "#3b82f6" },
          { label: "Total Units", value: `${totalStockUnits} Units`, color: "#f59e0b" },
          { label: "Warehouse Worth", value: `₹${totalWarehouseValue.toLocaleString('en-IN')}`, color: "#10b981" }
        ],
        headers: ["Car Model", "Brand & Scale", "Unit Price", "Stock Units", "Total Worth"],
        rows: cars.map(c => [
          `<strong>${c.name}</strong>`,
          `${c.brand} (${c.scale})`,
          `₹${c.price.toLocaleString('en-IN')}`,
          `<span style="font-weight:700">${c.inStock} units</span>`,
          `<strong style="color:#059669">₹${(c.price * (c.inStock || 0)).toLocaleString('en-IN')}</strong>`
        ])
      }
    ]

    exportMultiSectionPDF({
      title: "Diecast Vault • Complete Business Intelligence Master Dossier",
      subtitle: "Official executive financial performance, cost margins, bank settlements, customer orders, VIP registry, and warehouse inventory valuation.",
      category: "Executive Master Dossier",
      kpis: [
        { label: "Total Money Made", value: `₹${totalSales.toLocaleString('en-IN')}`, sub: "Gross customer payments", color: "#f59e0b" },
        { label: "Clean Net Profit", value: `₹${cleanTakeHomeProfit.toLocaleString('en-IN')}`, sub: `${profitMarginPercent}% Take-Home Margin`, color: "#10b981" },
        { label: "Customer Orders", value: `${totalOrdersCount} Orders`, sub: `Avg Basket: ₹${avgOrderValue.toLocaleString('en-IN')}`, color: "#3b82f6" },
        { label: "Warehouse Worth", value: `₹${totalWarehouseValue.toLocaleString('en-IN')}`, sub: `${totalStockUnits} Units in Warehouse`, color: "#8b5cf6" }
      ],
      sections,
      notes: "This comprehensive executive document consolidates all operational, customer fulfillment, and inventory data generated from the Diecast Vault Store Owner Portal."
    })

    if (onAddToast) onAddToast("Complete Master Business Dossier PDF generated! Save or print all 6 sections.", "success")
  }

  // Active page export dispatcher
  const handleExportActivePagePDF = () => {
    switch (activeTab) {
      case 'overview':
        handleExportOverviewPDF()
        break
      case 'profit_calculator':
        handleExportProfitCalculatorPDF()
        break
      case 'payments':
        handleExportPaymentsPDF()
        break
      case 'orders':
        handleExportOrdersPDF()
        break
      case 'vip_customers':
        handleExportVipPDF()
        break
      case 'stock_value':
        handleExportStockPDF()
        break
      default:
        handleExportMasterPDF()
    }
  }

  // Dynamic label for active tab PDF button
  const getActiveTabExportLabel = () => {
    switch (activeTab) {
      case 'overview': return 'Export Sales PDF'
      case 'profit_calculator': return 'Export Margins PDF'
      case 'payments': return 'Export Payouts PDF'
      case 'orders': return 'Export Orders PDF'
      case 'vip_customers': return 'Export VIPs PDF'
      case 'stock_value': return 'Export Stock PDF'
      default: return 'Export PDF'
    }
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
          {/* 🌟 Master PDF - Export All 6 Pages in One */}
          <button
            className="btn-primary btn-sm"
            onClick={handleExportMasterPDF}
            title="Export all 6 pages into one complete Master Business Dossier PDF"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
              color: '#000',
              fontWeight: 800,
              border: 'none',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.3)'
            }}
          >
            <Sparkles size={14} color="#000" /> Export All (Master PDF)
          </button>

          {/* Dynamic Active Tab PDF */}
          <button
            className="btn-secondary btn-sm"
            onClick={handleExportActivePagePDF}
            title={`Export PDF for currently open tab: ${activeTab}`}
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24', fontWeight: 700 }}
          >
            <FileText size={14} color="#fbbf24" /> {getActiveTabExportLabel()}
          </button>

          {onOpenStorefront && (
            <button
              className="btn-secondary btn-sm"
              onClick={onOpenStorefront}
              title="See what customers see"
            >
              <Car size={14} /> Storefront
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
              <Wrench size={14} /> Add / Edit Cars
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
                    Best Selling Diecast Models & Sales Performance
                  </h3>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Top revenue-generating diecast models ordered by collectors (picture on top with full details below).
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  className="btn-secondary btn-sm"
                  onClick={handleExportOverviewCSV}
                  title="Export Sales Overview to CSV"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                >
                  <FileSpreadsheet size={13} color="#34d399" /> Overview CSV
                </button>
                <button
                  className="btn-secondary btn-sm"
                  onClick={handleExportOverviewPDF}
                  title="Export Sales Overview to PDF"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.35)' }}
                >
                  <FileText size={13} color="#fbbf24" /> Overview PDF
                </button>
                <span className="badge-pill">Top Performers</span>
              </div>
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

            <div className="cogs-control-grid">
              {/* Wholesale Buying Cost Control */}
              <div className="cost-input-box">
                <div className="cost-input-header">
                  <div className="cost-input-title">
                    <span className="cost-dot buying" />
                    <div>
                      <strong>Wholesale Sourcing Cost</strong>
                      <p>What you pay suppliers per diecast car</p>
                    </div>
                  </div>
                  <div className="cost-value-badge buying">
                    {buyingCostPercent}%
                  </div>
                </div>

                <div className="cost-input-controls">
                  <div className="cost-stepper">
                    <button 
                      type="button"
                      className="cost-step-btn"
                      onClick={() => setBuyingCostPercent(prev => Math.max(10, prev - 5))}
                      title="Decrease by 5%"
                    >
                      -5%
                    </button>
                    <button 
                      type="button"
                      className="cost-step-btn"
                      onClick={() => setBuyingCostPercent(prev => Math.max(10, prev - 1))}
                      title="Decrease by 1%"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="cost-number-field">
                      <input
                        type="number"
                        min="10"
                        max="80"
                        value={buyingCostPercent}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          if (!isNaN(val)) setBuyingCostPercent(Math.min(80, Math.max(10, val)))
                        }}
                      />
                      <span>%</span>
                    </div>
                    <button 
                      type="button"
                      className="cost-step-btn"
                      onClick={() => setBuyingCostPercent(prev => Math.min(80, prev + 1))}
                      title="Increase by 1%"
                    >
                      <Plus size={14} />
                    </button>
                    <button 
                      type="button"
                      className="cost-step-btn"
                      onClick={() => setBuyingCostPercent(prev => Math.min(80, prev + 5))}
                      title="Increase by 5%"
                    >
                      +5%
                    </button>
                  </div>

                  <div className="cost-preset-chips">
                    <span className="preset-label">Presets:</span>
                    {[25, 35, 40, 50].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`preset-chip ${buyingCostPercent === preset ? 'active' : ''}`}
                        onClick={() => setBuyingCostPercent(preset)}
                      >
                        {preset}% {preset <= 25 ? 'High Margin' : (preset === 35 ? 'Standard' : 'High Cost')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Courier & Box Packaging Control */}
              <div className="cost-input-box">
                <div className="cost-input-header">
                  <div className="cost-input-title">
                    <span className="cost-dot pack" />
                    <div>
                      <strong>Box, Bubble Wrap & Courier</strong>
                      <p>Packaging supplies and courier shipping per car</p>
                    </div>
                  </div>
                  <div className="cost-value-badge pack">
                    {deliveryPackPercent}%
                  </div>
                </div>

                <div className="cost-input-controls">
                  <div className="cost-stepper">
                    <button 
                      type="button"
                      className="cost-step-btn"
                      onClick={() => setDeliveryPackPercent(prev => Math.max(1, prev - 2))}
                      title="Decrease by 2%"
                    >
                      -2%
                    </button>
                    <button 
                      type="button"
                      className="cost-step-btn"
                      onClick={() => setDeliveryPackPercent(prev => Math.max(1, prev - 1))}
                      title="Decrease by 1%"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="cost-number-field">
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={deliveryPackPercent}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          if (!isNaN(val)) setDeliveryPackPercent(Math.min(25, Math.max(1, val)))
                        }}
                      />
                      <span>%</span>
                    </div>
                    <button 
                      type="button"
                      className="cost-step-btn"
                      onClick={() => setDeliveryPackPercent(prev => Math.min(25, prev + 1))}
                      title="Increase by 1%"
                    >
                      <Plus size={14} />
                    </button>
                    <button 
                      type="button"
                      className="cost-step-btn"
                      onClick={() => setDeliveryPackPercent(prev => Math.min(25, prev + 2))}
                      title="Increase by 2%"
                    >
                      +2%
                    </button>
                  </div>

                  <div className="cost-preset-chips">
                    <span className="preset-label">Presets:</span>
                    {[3, 5, 7, 10].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`preset-chip ${deliveryPackPercent === preset ? 'active' : ''}`}
                        onClick={() => setDeliveryPackPercent(preset)}
                      >
                        {preset}% {preset === 3 ? 'Basic Box' : (preset === 7 ? 'Standard' : 'Air Courier')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Cost Breakdown Table */}
          <div className="table-filter-bar" style={{ marginTop: '1.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Individual cost breakdown, unit profit, and stock yield for <strong>{cars.length}</strong> catalog castings.
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary btn-sm"
                onClick={handleExportProfitCalculatorCSV}
                title="Export Sourcing Costs & Profit Margins as CSV"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <FileSpreadsheet size={13} color="#34d399" /> Margin CSV
              </button>
              <button
                className="btn-secondary btn-sm"
                onClick={handleExportProfitCalculatorPDF}
                title="Export Sourcing Costs & Profit Margins as PDF"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.35)' }}
              >
                <FileText size={13} color="#fbbf24" /> Margin PDF
              </button>
            </div>
          </div>

          <div className="owner-orders-table-wrapper">
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

          {/* Payment Methods Breakdown Toolbar */}
          <div className="table-filter-bar" style={{ marginTop: '1.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Channel breakdown across UPI, Credit Cards, Net Banking, and COD with bank MDR fees.
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary btn-sm"
                onClick={handleExportPaymentsCSV}
                title="Export Bank Payouts Ledger as CSV"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <FileSpreadsheet size={13} color="#34d399" /> Payouts CSV
              </button>
              <button
                className="btn-secondary btn-sm"
                onClick={handleExportPaymentsPDF}
                title="Export Bank Payouts Statement as PDF"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.35)' }}
              >
                <FileText size={13} color="#fbbf24" /> Payouts PDF
              </button>
            </div>
          </div>

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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Showing {filteredOrders.length} customer orders
              </span>
              <button
                className="btn-secondary btn-sm"
                onClick={handleExportCSV}
                title="Export Filtered Orders as CSV"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <FileSpreadsheet size={13} color="#34d399" /> Orders CSV
              </button>
              <button
                className="btn-secondary btn-sm"
                onClick={handleExportPDF}
                title="Export Filtered Orders as PDF"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.35)' }}
              >
                <FileText size={13} color="#fbbf24" /> Orders PDF
              </button>
            </div>
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

          <div className="table-filter-bar" style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Detailed breakdown of <strong>{cars.length}</strong> catalog castings and warehouse unit values.
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary btn-sm"
                onClick={handleExportStockCSV}
                title="Export Stock Valuation as CSV"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <FileSpreadsheet size={13} color="#34d399" /> Stock CSV
              </button>
              <button
                className="btn-secondary btn-sm"
                onClick={handleExportStockPDF}
                title="Export Stock Valuation as PDF"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.35)' }}
              >
                <FileText size={13} color="#fbbf24" /> Stock PDF
              </button>
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
        <div className="owner-full-page-container">
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
