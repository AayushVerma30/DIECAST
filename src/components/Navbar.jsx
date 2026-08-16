import React from 'react'
import { ShoppingBag, Heart, Search, User } from 'lucide-react'

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenAccount,
  searchTerm, 
  setSearchTerm,
  onToggleWishlistFilter,
  isWishlistActive,
  userName,
  userAvatar
}) {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Left: Brand Logo */}
        <a href="#" className="brand-logo">
          <span style={{ color: 'var(--accent-red)' }}>✦</span> DIECAST
          <span className="brand-badge">VAULT</span>
        </a>

        {/* Center: Search Bar */}
        <div className="search-box">
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search Skyline, Porsche, Matchbox..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Right: Actions */}
        <div className="nav-actions">
          {/* Profile Button with Avatar + "Profile" */}
          <button 
            className="user-avatar-btn"
            onClick={onOpenAccount}
            title="My Profile & Options"
          >
            <div className="user-avatar-circle">
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" />
              ) : (
                userName ? userName.charAt(0) : 'U'
              )}
            </div>
            <span className="user-profile-label">Profile</span>
          </button>

          {/* Wishlist Button */}
          <button 
            className={`nav-btn ${isWishlistActive ? 'active' : ''}`}
            title="Saved Wishlist"
            onClick={onToggleWishlistFilter}
          >
            <Heart size={18} fill={isWishlistActive ? 'var(--accent-red)' : 'transparent'} />
            {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
          </button>
          
          {/* Cart Button */}
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
