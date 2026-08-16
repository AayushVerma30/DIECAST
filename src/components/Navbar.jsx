import React from 'react'
import { ShoppingBag, Heart, Search, User, Crown, Wrench, LogOut, ArrowRight, Car } from 'lucide-react'

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenAccount,
  onLogout,
  searchTerm, 
  setSearchTerm,
  onToggleWishlistFilter,
  isWishlistActive,
  currentUser,
  currentRole = 'user',
  activeView = 'storefront'
}) {
  const roleDisplay = {
    user: {
      label: 'Collector',
      icon: User,
      color: '#3b82f6',
      badgeClass: 'badge-user'
    },
    owner: {
      label: 'Store Owner',
      icon: Crown,
      color: '#f59e0b',
      badgeClass: 'badge-owner'
    },
    admin: {
      label: 'Inventory Admin',
      icon: Wrench,
      color: '#10b981',
      badgeClass: 'badge-admin'
    }
  }

  const currentMeta = roleDisplay[currentRole] || roleDisplay.user
  const RoleIcon = currentMeta.icon

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Left: Brand Logo & Role Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <a href="#" className="brand-logo">
            <span style={{ color: 'var(--accent-red)' }}>✦</span> DIECAST
            <span className="brand-badge">VAULT</span>
          </a>

          {/* Active Persona Badge */}
          <div 
            className={`nav-role-pill ${currentMeta.badgeClass}`}
            title={`Active Portal: ${currentMeta.label}`}
          >
            <RoleIcon size={13} style={{ marginRight: '4px' }} />
            <span>{currentMeta.label}</span>
          </div>
        </div>

        {/* Center: Search Bar (Only shown for storefront) */}
        {activeView === 'storefront' ? (
          <div className="search-box">
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search Skyline, Porsche, Matchbox..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        ) : (
          <div className="navbar-portal-title">
            {activeView === 'owner_dashboard' && (
              <span style={{ color: '#fbbf24', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Crown size={15} /> Executive Business & Sales Operations
              </span>
            )}
            {activeView === 'admin_inventory' && (
              <span style={{ color: '#34d399', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wrench size={15} /> Catalog Inventory & Product Management
              </span>
            )}
          </div>
        )}

        {/* Right: Actions */}
        <div className="nav-actions">
          {/* User Profile / Garage Button */}
          <button 
            className="user-avatar-btn"
            onClick={onOpenAccount}
            title="My Profile, Garage & Orders"
          >
            <div className="user-avatar-circle">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" />
              ) : (
                currentUser?.name ? currentUser.name.charAt(0) : 'U'
              )}
            </div>
            <span className="user-profile-label">
              {currentUser?.name ? currentUser.name.split(' ')[0] : 'Profile'}
            </span>
          </button>

          {/* Wishlist Button (shown for collector) */}
          {activeView === 'storefront' && (
            <button 
              className={`nav-btn ${isWishlistActive ? 'active' : ''}`}
              title="Saved Wishlist"
              onClick={onToggleWishlistFilter}
            >
              <Heart size={18} fill={isWishlistActive ? 'var(--accent-red)' : 'transparent'} />
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </button>
          )}
          
          {/* Cart Button (shown for collector) */}
          {activeView === 'storefront' && (
            <button 
              className="nav-btn" 
              title="Cart"
              onClick={onOpenCart}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </button>
          )}

          {/* Exit / Sign Out Button */}
          <button
            className="nav-btn logout-nav-btn"
            onClick={onLogout}
            title="Sign Out & Return to Login Page"
          >
            <LogOut size={16} />
            <span className="logout-text">Exit</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
