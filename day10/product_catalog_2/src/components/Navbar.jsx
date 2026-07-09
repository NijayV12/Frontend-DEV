import React from 'react'
import { Store, ShoppingBag, Heart, MessageSquare, Home, Info, User } from 'lucide-react'

export default function Navbar({ cart, wishlist, currentPage, setCurrentPage }) {
  // Calculate total items in cart
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-wrapper" onClick={() => setCurrentPage('home')}>
          <Store size={22} className="brand-logo" />
          <span className="brand-name">Maran Gaming</span>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-link ${currentPage === 'home' || currentPage === 'details' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            <Home size={18} />
            <span>Shop</span>
          </button>

          <button 
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentPage('about')}
          >
            <Info size={18} />
            <span>About</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'wishlist' ? 'active' : ''}`}
            onClick={() => setCurrentPage('wishlist')}
          >
            <div className="icon-wrapper">
              <Heart size={18} />
              {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
            </div>
            <span>Wishlist</span>
          </button>

          <button 
            className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
            onClick={() => setCurrentPage('contact')}
          >
            <MessageSquare size={18} />
            <span>Contact</span>
          </button>
        </nav>

        <div className="header-actions">
          <button 
            className={`profile-icon-btn ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentPage('profile')}
            aria-label="View Profile"
          >
            <User size={20} />
          </button>

          <button 
            className={`cart-btn-wrapper ${currentPage === 'cart' || currentPage === 'checkout' ? 'active' : ''}`}
            onClick={() => setCurrentPage('cart')}
            aria-label="View Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 ? (
              <span className="cart-badge">{cartItemCount}</span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  )
}
