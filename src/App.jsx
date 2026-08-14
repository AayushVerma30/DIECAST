import React, { useState, useMemo } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsSection from './components/StatsSection'
import CarShowcase from './components/CarShowcase'
import CarModal from './components/CarModal'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import { CARS_DATA } from './data/carsData'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('ALL')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('popular')
  const [activeCarModal, setActiveCarModal] = useState(null)
  
  const [wishlist, setWishlist] = useState(['dc-001', 'dc-004'])
  const [cart, setCart] = useState([
    { ...CARS_DATA[0], quantity: 1 }
  ])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Filter and Sort cars
  const filteredCars = useMemo(() => {
    return CARS_DATA.filter(car => {
      const matchesSearch = 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.scale.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesBrand = selectedBrand === 'ALL' || car.brand.toLowerCase().includes(selectedBrand.toLowerCase()) || (selectedBrand.includes('Hot Wheels') && car.brand.includes('Hot Wheels')) || (selectedBrand.includes('Matchbox') && car.brand.includes('Matchbox'))
      const matchesCategory = selectedCategory === 'ALL' || car.category === selectedCategory

      return matchesSearch && matchesBrand && matchesCategory
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0 // default 'popular'
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
    setIsCartOpen(true)
  }

  const handleRemoveFromCart = (carId) => {
    setCart(prev => prev.filter(item => item.id !== carId))
  }

  // Wishlist toggle
  const handleToggleWishlist = (carId) => {
    setWishlist(prev => 
      prev.includes(carId) ? prev.filter(id => id !== carId) : [...prev, carId]
    )
  }

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="app-root">
      <Navbar 
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Hero 
        featuredCar={CARS_DATA[0]}
        onSelectCar={(car) => setActiveCarModal(car)}
        onSelectBrand={setSelectedBrand}
        selectedBrand={selectedBrand}
      />

      <StatsSection />

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
      />

      <Footer />

      {/* Modal View */}
      {activeCarModal && (
        <CarModal 
          car={activeCarModal}
          onClose={() => setActiveCarModal(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart & Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
      />
    </div>
  )
}
