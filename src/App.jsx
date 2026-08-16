import React, { useState, useMemo } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CarShowcase from './components/CarShowcase'
import CarModal from './components/CarModal'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import UserAccountModal from './components/UserAccountModal'
import Toast from './components/Toast'
import Footer from './components/Footer'
import { CARS_DATA } from './data/carsData'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('ALL')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('popular')
  const [showWishlistOnly, setShowWishlistOnly] = useState(false)
  
  // Modals
  const [activeCarModal, setActiveCarModal] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  // User Profile & Purchase Tracker State
  const [userProfile, setUserProfile] = useState({
    name: 'Suresh Verma',
    email: 'suresh@diecast.vault',
    tier: 'Gold Collector Tier'
  })

  const [orders, setOrders] = useState([
    {
      id: "DC-IND-772910",
      date: "12 Aug 2026",
      status: "In Transit",
      statusKey: "in-transit",
      currentStep: 3, // 1: Sealed, 2: Packed, 3: Air Express, 4: Delivered
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
  ])

  const [transactions, setTransactions] = useState([
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
  ])

  // Collections
  const [wishlist, setWishlist] = useState(['dc-001', 'dc-004'])
  const [cart, setCart] = useState([
    { ...CARS_DATA[1], quantity: 1 } // Porsche 911 GT3 RS in cart
  ])
  const [toasts, setToasts] = useState([])

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
    return CARS_DATA.filter(car => {
      const matchesSearch = 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.scale.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesBrand = 
        selectedBrand === 'ALL' || 
        car.brand.toLowerCase().includes(selectedBrand.toLowerCase())

      const matchesCategory = selectedCategory === 'ALL' || car.category === selectedCategory

      return matchesSearch && matchesBrand && matchesCategory
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })
  }, [searchTerm, selectedBrand, selectedCategory, sortBy])

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
    const car = CARS_DATA.find(c => c.id === carId)
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

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length

  return (
    <div className="app-root">
      <Navbar 
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        activeOrdersCount={activeOrdersCount}
        userName={userProfile.name}
        userAvatar={userProfile.avatar}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onToggleWishlistFilter={() => setShowWishlistOnly(!showWishlistOnly)}
        isWishlistActive={showWishlistOnly}
      />

      <Hero 
        featuredCar={CARS_DATA[0]}
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

      {/* User Account & Order Tracker Modal */}
      <UserAccountModal 
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
        orders={orders}
        transactions={transactions}
        onSelectCar={(car) => setActiveCarModal(car)}
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
        userProfile={userProfile}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Minimal Toast Notifications */}
      <Toast toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}
