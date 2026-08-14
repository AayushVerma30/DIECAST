import React from 'react'
import { ShoppingBag, Heart, Search, ShieldCheck } from 'lucide-react'

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  searchTerm, 
  setSearchTerm 
}) {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <a href="#" className="brand-logo">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'var(--accent-red)' }}>✦</span> DIECAST
          </span>
          <span className="brand-badge">VAULT</span>
        </a>

        <div className="search-box">
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search Nissan GT-R, Ferrari, 1:18, Shelby..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="nav-actions">
          <button 
            className="nav-btn" 
            title="Wishlist"
            onClick={onOpenCart}
          >
            <Heart size={20} />
            {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
          </button>
          
          <button 
            className="nav-btn" 
            title="Cart"
            onClick={onOpenCart}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}
