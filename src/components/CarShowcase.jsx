import React from 'react'
import CarCard from './CarCard'

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
  onAddToCart
}) {
  const brands = ["ALL", "Hot Wheels Premium", "Matchbox Collectors", "Hot Wheels Elite", "Matchbox Collectibles", "Mini GT x Hot Wheels"]
  const categories = ["ALL", "Supercars", "JDM Legends", "American Muscle", "Race & GT"]

  return (
    <section id="showcase" className="showcase-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Hot Wheels & Matchbox Vault</h2>
            <p className="section-desc">
              Browse authentic metal diecast toy models, Real Riders rubber tire editions, and collector blister cards.
            </p>
          </div>

          <div className="filter-bar">
            <select 
              className="filter-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="ALL">All Diecast Brands & Lines</option>
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
              <option value="popular">Featured & Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Collector Rating</option>
            </select>
          </div>
        </div>

        {cars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <h3>No diecast models match your filter criteria.</h3>
            <p style={{ marginTop: '0.5rem' }}>Try clearing filters or search terms.</p>
          </div>
        ) : (
          <div className="cars-grid">
            {cars.map(car => (
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
