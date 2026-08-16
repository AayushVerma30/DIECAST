import React, { useState, useMemo, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CarShowcase from './components/CarShowcase'
import CarModal from './components/CarModal'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import UserAccountModal from './components/UserAccountModal'
import LoginPage, { DEMO_ACCOUNTS } from './components/LoginPage'
import OwnerDashboardModal from './components/OwnerDashboardModal'
import AdminInventoryModal from './components/AdminInventoryModal'
import Toast from './components/Toast'
import Footer from './components/Footer'
import { CARS_DATA } from './data/carsData'
import { Crown, Wrench, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

const DEFAULT_ORDERS = [
  {
    id: "DC-IND-772910",
    date: "12 Aug 2026",
    status: "In Transit",
    statusKey: "in-transit",
    currentStep: 3,
    items: [
      { ...CARS_DATA[2], quantity: 1 } // 1967 Shelby Cobra
    ],
    totalAmount: 1899,
    paymentMethod: "UPI (suresh@okhdfcbank)",
    shippingAddress: "Flat 402, Skyline Towers, New Delhi - 110001"
  },
  {
    id: "DC-IND-554102",
    date: "28 Jul 2026",
    status: "Delivered",
    statusKey: "delivered",
    currentStep: 4,
    items: [
      { ...CARS_DATA[0], quantity: 1 } // Skyline R34
    ],
    totalAmount: 1499,
    paymentMethod: "Credit Card (•••• 8821)",
    shippingAddress: "Flat 402, Skyline Towers, New Delhi - 110001"
  }
]

const DEFAULT_TRANSACTIONS = [
  {
    id: "TXN-9938210",
    date: "12 Aug 2026, 04:30 PM",
    method: "UPI (GPay)",
    status: "Paid",
    amount: 1899
  },
  {
    id: "TXN-8812904",
    date: "28 Jul 2026, 11:15 AM",
    method: "HDFC Card",
    status: "Paid",
    amount: 1499
  }
]

export default function App() {
  // Authentication Gateway State: LoginPage is ALWAYS the primary first screen
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('diecast_current_user')
      return saved ? JSON.parse(saved) : DEMO_ACCOUNTS.user
    } catch (e) {
      return DEMO_ACCOUNTS.user
    }
  })

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return localStorage.getItem('diecast_role') || 'user'
    } catch (e) {
      return 'user'
    }
  })

  // Active View: 'storefront' | 'owner_dashboard' | 'admin_inventory'
  const [activeView, setActiveView] = useState(() => {
    try {
      const savedRole = localStorage.getItem('diecast_role') || 'user'
      if (savedRole === 'owner') return 'owner_dashboard'
      if (savedRole === 'admin') return 'admin_inventory'
      return 'storefront'
    } catch (e) {
      return 'storefront'
    }
  })

  // Store Search & Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('ALL')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('popular')
  const [showWishlistOnly, setShowWishlistOnly] = useState(false)
  
  // Modals state
  const [activeCarModal, setActiveCarModal] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  // Dynamic Cars Catalog state (Admin can add/edit/delete/restock)
  const [cars, setCars] = useState(() => {
    try {
      const saved = localStorage.getItem('diecast_cars_catalog')
      return saved ? JSON.parse(saved) : CARS_DATA
    } catch (e) {
      return CARS_DATA
    }
  })

  // Orders and Transactions State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('diecast_orders')
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS
    } catch (e) {
      return DEFAULT_ORDERS
    }
  })

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('diecast_transactions')
      return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS
    } catch (e) {
      return DEFAULT_TRANSACTIONS
    }
  })

  // Collections (Cart & Wishlist)
  const [wishlist, setWishlist] = useState(['dc-001', 'dc-004'])
  const [cart, setCart] = useState([
    { ...CARS_DATA[1], quantity: 1 } // Porsche 911 GT3 RS in cart
  ])
  const [toasts, setToasts] = useState([])

  // Persist authentication & role
  useEffect(() => {
    try {
      localStorage.setItem('diecast_is_authenticated', isAuthenticated ? 'true' : 'false')
      localStorage.setItem('diecast_current_user', JSON.stringify(currentUser))
      localStorage.setItem('diecast_role', currentRole)
    } catch (e) {
      console.error(e)
    }
  }, [isAuthenticated, currentUser, currentRole])

  // Persist cars changes
  useEffect(() => {
    try {
      localStorage.setItem('diecast_cars_catalog', JSON.stringify(cars))
    } catch (e) {
      console.error(e)
    }
  }, [cars])

  // Persist orders & transactions
  useEffect(() => {
    try {
      localStorage.setItem('diecast_orders', JSON.stringify(orders))
      localStorage.setItem('diecast_transactions', JSON.stringify(transactions))
    } catch (e) {
      console.error(e)
    }
  }, [orders, transactions])

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Filter and Sort cars
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (car.scale && car.scale.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (car.category && car.category.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesBrand = 
        selectedBrand === 'ALL' || 
        car.brand.toLowerCase().includes(selectedBrand.toLowerCase())

      const matchesCategory = selectedCategory === 'ALL' || car.category === selectedCategory

      return matchesSearch && matchesBrand && matchesCategory
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8)
      return 0
    })
  }, [cars, searchTerm, selectedBrand, selectedCategory, sortBy])

  // Cart operations
  const handleAddToCart = (car) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === car.id)
      if (existing) {
        return prev.map(item => 
          item.id === car.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...car, quantity: 1 }]
    })
    addToast(`Added "${car.name}" to cart`, "success")
  }

  const handleRemoveFromCart = (carId) => {
    setCart(prev => prev.filter(item => item.id !== carId))
    addToast("Item removed from cart", "info")
  }

  // Wishlist operations
  const handleToggleWishlist = (carId) => {
    if (wishlist.includes(carId)) {
      setWishlist(prev => prev.filter(id => id !== carId))
      addToast(`Removed from wishlist`, "info")
    } else {
      setWishlist(prev => [...prev, carId])
      addToast(`Saved to wishlist`, "success")
    }
  }

  // Order Placement callback
  const handleOrderSuccess = (newOrderObj, newTxnObj) => {
    setOrders(prev => [newOrderObj, ...prev])
    setTransactions(prev => [newTxnObj, ...prev])
    setCart([])
    addToast(`Order ${newOrderObj.id} recorded in your Tracker!`, "success")
  }

  // Owner callback to change order status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const stepMap = {
      'Sealed': 1,
      'Packed': 2,
      'In Transit': 3,
      'Delivered': 4
    }
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          statusKey: newStatus.toLowerCase().replace(/\s+/g, '-'),
          currentStep: stepMap[newStatus] || 3
        }
      }
      return o
    }))
  }

  // Admin Catalog Management Callbacks
  const handleAddCar = (newCar) => {
    setCars(prev => [newCar, ...prev])
  }

  const handleUpdateCar = (updatedCar) => {
    setCars(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c))
  }

  const handleDeleteCar = (carId) => {
    setCars(prev => prev.filter(c => c.id !== carId))
  }

  const handleResetDefaultCars = () => {
    setCars(CARS_DATA)
    try {
      localStorage.removeItem('diecast_cars_catalog')
    } catch (e) {}
  }

  // Authentication Login Callback
  const handleLogin = (userObj) => {
    setCurrentUser(userObj)
    setCurrentRole(userObj.role || 'user')
    setIsAuthenticated(true)

    // Set initial view based on selected role
    if (userObj.role === 'owner') {
      setActiveView('owner_dashboard')
    } else if (userObj.role === 'admin') {
      setActiveView('admin_inventory')
    } else {
      setActiveView('storefront')
    }
  }

  // Logout Callback
  const handleLogout = () => {
    setIsAuthenticated(false)
    addToast("Signed out. Returned to Portal Gateway.", "info")
  }

  // IF NOT AUTHENTICATED: DISPLAY THE LOGIN PAGE FIRST!
  if (!isAuthenticated) {
    return (
      <div className="app-root">
        <LoginPage onLogin={handleLogin} onAddToast={addToast} />
        <Toast toasts={toasts} onRemoveToast={removeToast} />
      </div>
    )
  }

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length

  return (
    <div className="app-root">
      {/* Top Navbar */}
      <Navbar 
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        activeOrdersCount={activeOrdersCount}
        currentUser={currentUser}
        currentRole={currentRole}
        activeView={activeView}
        onChangeView={setActiveView}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onToggleWishlistFilter={() => setShowWishlistOnly(!showWishlistOnly)}
        isWishlistActive={showWishlistOnly}
      />

      {/* Contextual Owner / Admin Preview Notice when browsing Storefront */}
      {activeView === 'storefront' && currentRole === 'owner' && (
        <div className="top-role-banner" style={{ background: 'rgba(245, 158, 11, 0.15)', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.82rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Crown size={15} /> Store Owner Storefront Preview Mode
          </span>
          <button 
            className="btn-primary btn-sm"
            style={{ background: '#f59e0b', color: '#000', padding: '0.3rem 0.85rem', fontSize: '0.78rem', fontWeight: 700 }}
            onClick={() => setActiveView('owner_dashboard')}
          >
            ← Return to Owner Sales Dashboard
          </button>
        </div>
      )}

      {activeView === 'storefront' && currentRole === 'admin' && (
        <div className="top-role-banner" style={{ background: 'rgba(16, 185, 129, 0.15)', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.82rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wrench size={15} /> Inventory Admin Storefront Preview Mode
          </span>
          <button 
            className="btn-primary btn-sm"
            style={{ background: '#10b981', color: '#000', padding: '0.3rem 0.85rem', fontSize: '0.78rem', fontWeight: 700 }}
            onClick={() => setActiveView('admin_inventory')}
          >
            ← Return to Listing Console
          </button>
        </div>
      )}

      {/* VIEW 1: STOREFRONT */}
      {activeView === 'storefront' && (
        <>
          <Hero 
            featuredCar={cars[0] || CARS_DATA[0]}
            onSelectCar={(car) => setActiveCarModal(car)}
            onSelectBrand={setSelectedBrand}
            selectedBrand={selectedBrand}
          />

          <CarShowcase 
            cars={filteredCars}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSelectCar={(car) => setActiveCarModal(car)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            showWishlistOnly={showWishlistOnly}
            setShowWishlistOnly={setShowWishlistOnly}
          />

          <Footer />
        </>
      )}

      {/* VIEW 2: OWNER SALES & FINANCIAL DASHBOARD */}
      {activeView === 'owner_dashboard' && (
        <OwnerDashboardModal 
          isOpen={true}
          isFullView={true}
          orders={orders}
          transactions={transactions}
          cars={cars}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onOpenAdmin={() => setActiveView('admin_inventory')}
          onOpenStorefront={() => setActiveView('storefront')}
          onAddToast={addToast}
        />
      )}

      {/* VIEW 3: ADMIN INVENTORY & LISTING CONSOLE */}
      {activeView === 'admin_inventory' && (
        <AdminInventoryModal 
          isOpen={true}
          isFullView={true}
          cars={cars}
          onAddCar={handleAddCar}
          onUpdateCar={handleUpdateCar}
          onDeleteCar={handleDeleteCar}
          onResetDefaultCars={handleResetDefaultCars}
          onPreviewCar={(car) => setActiveCarModal(car)}
          onOpenStorefront={() => setActiveView('storefront')}
          onOpenOwner={() => setActiveView('owner_dashboard')}
          onAddToast={addToast}
        />
      )}

      {/* User Account & Order Tracker Modal */}
      <UserAccountModal 
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        userProfile={currentUser}
        currentRole={currentRole}
        onUpdateProfile={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
        orders={orders}
        transactions={transactions}
        onSelectCar={(car) => setActiveCarModal(car)}
        onOpenAuth={handleLogout}
        onAddToast={addToast}
      />

      {/* Car Detail Modal */}
      {activeCarModal && (
        <CarModal 
          car={activeCarModal}
          onClose={() => setActiveCarModal(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        userProfile={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Minimal Toast Notifications */}
      <Toast toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}
