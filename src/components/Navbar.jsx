import React from 'react'
import { ShoppingBag, Heart, Search, User } from 'lucide-react'

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenAccount,
  activeOrdersCount,
  searchTerm, 
  setSearchTerm,
  onToggleWishlistFilter,
  isWishlistActive,
  userName
}) {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <a href="#" className="brand-logo">
          <span style={{ color: 'var(--accent-red)' }}>✦</span> DIECAST
          <span className="brand-badge">VAULT</span>
        </a>

        <div className="search-box">
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search Skyline, Porsche, Matchbox..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="nav-actions">
          {/* User Account / Orders Button */}
          <button 
            className="user-avatar-btn"
            onClick={onOpenAccount}
            title="My Account & Purchases Tracker"
          >
            <div className="user-avatar-circle">
              {userName ? userName.charAt(0) : 'U'}
            </div>
            <span>Orders {activeOrdersCount > 0 && `(${activeOrdersCount})`}</span>
          </button>

          <button 
            className={`nav-btn ${isWishlistActive ? 'active' : ''}`}
            title="Saved Wishlist"
            onClick={onToggleWishlistFilter}
          >
            <Heart size={18} fill={isWishlistActive ? 'var(--accent-red)' : 'transparent'} />
            {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
          </button>
          
          <button 
            className="nav-btn" 
            title="Cart"
            onClick={onOpenCart}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}
