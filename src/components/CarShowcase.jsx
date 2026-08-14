import React from 'react'
import CarCard from './CarCard'
import { Heart } from 'lucide-react'

export default function CarShowcase({ 
  cars, 
  selectedBrand, 
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onSelectCar,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  showWishlistOnly,
  setShowWishlistOnly
}) {
  const brands = ["ALL", "Hot Wheels", "Matchbox", "Mini GT"]
  const categories = ["ALL", "Supercars", "JDM Legends", "American Muscle", "Race & GT"]

  const displayedCars = showWishlistOnly 
    ? cars.filter(c => wishlist.includes(c.id))
    : cars

  return (
    <section id="showcase" className="showcase-section">
      <div className="container">
        <div className="section-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                {showWishlistOnly ? "My Wishlist" : "Diecast Vault"}
              </h2>
              <button 
                className={`scale-pill-btn ${showWishlistOnly ? 'active' : ''}`}
                onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
              >
                <Heart size={13} fill={showWishlistOnly ? "#fff" : "transparent"} />
                Saved ({wishlist.length})
              </button>
            </div>
            <p className="section-desc">
              {showWishlistOnly 
                ? "Your saved collector diecast models." 
                : "Authentic 1:64 Metal/Metal™ diecast models with Real Riders™ rubber tires."}
            </p>
          </div>

          <div className="filter-bar">
            <select 
              className="filter-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="ALL">All Brands</option>
              {brands.filter(b => b !== "ALL").map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.filter(c => c !== "ALL").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {displayedCars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <h3>{showWishlistOnly ? "No models saved in your wishlist." : "No diecast models match your search."}</h3>
            <p style={{ marginTop: '0.4rem', fontSize: '0.9rem' }}>
              {showWishlistOnly ? "Click the heart icon on any model to save it." : "Try resetting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="cars-grid">
            {displayedCars.map(car => (
              <CarCard 
                key={car.id}
                car={car}
                onSelectCar={onSelectCar}
                isWishlisted={wishlist.includes(car.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
