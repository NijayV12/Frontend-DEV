import React from 'react'
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react'
import { formatPrice } from '../utils'

export default function Wishlist({ wishlist, products, onAddToCart, onRemoveFromWishlist, onViewDetails, onNavigate }) {
  
  // Filter products that are in the wishlist
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id))

  if (wishlistedProducts.length === 0) {
    return (
      <div className="wishlist-page-container empty">
        <div className="empty-wishlist-inner">
          <Heart size={48} className="empty-wishlist-icon" />
          <h2>Your Wishlist is empty</h2>
          <p>Tap the heart icon on any product to save it here for later.</p>
          <button className="empty-wishlist-shop-btn" onClick={() => onNavigate('home')}>
            Explore Shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page-container">
      <h1 className="wishlist-page-title">My Wishlist</h1>
      
      <div className="wishlist-grid">
        {wishlistedProducts.map((product) => (
          <article key={product.id} className="wishlist-item-card">
            <div className="wishlist-img-wrapper" onClick={() => onViewDetails(product.id)}>
              <img src={product.image} alt={product.title} className="wishlist-img" />
              <button 
                className="wishlist-remove-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFromWishlist(product.id)
                }}
                title="Remove from Wishlist"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="wishlist-card-details">
              <span className="wishlist-card-brand">{product.manufacturer}</span>
              <h3 className="wishlist-card-title" onClick={() => onViewDetails(product.id)}>
                {product.title}
              </h3>
              
              <div className="wishlist-card-pricing">
                {product.originalPrice && (
                  <span className="wishlist-price-original">{formatPrice(product.originalPrice)}</span>
                )}
                <span className="wishlist-price-current">{formatPrice(product.price)}</span>
              </div>

              <div className="wishlist-actions">
                <button 
                  className="wishlist-add-to-cart-btn"
                  onClick={() => onAddToCart(product, 1)}
                >
                  <ShoppingCart size={14} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="wishlist-back-container">
        <button className="wishlist-back-shop-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={16} /> Return to Shop
        </button>
      </div>
    </div>
  )
}
