import React, { useState } from 'react'
import { ArrowLeft, Star, ShoppingCart, Heart, Shield, RotateCcw, Truck } from 'lucide-react'
import { formatPrice } from '../utils'

export default function ProductDetails({ productId, products, cart, wishlist, onAddToCart, onToggleWishlist, onBack }) {
  const [quantity, setQuantity] = useState(1)

  // Find the selected product
  const product = products.find(p => p.id === productId)

  if (!product) {
    return (
      <div className="details-error-state">
        <h2>Product Not Found</h2>
        <p>The requested product could not be loaded.</p>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>
    )
  }

  const isWishlisted = wishlist.includes(product.id)
  const isInCart = cart.some(item => item.id === product.id)

  const handleIncrement = () => setQuantity(q => q + 1)
  const handleDecrement = () => setQuantity(q => q > 1 ? q - 1 : 1)

  // Mock Reviews Database matching the product's quality
  const mockReviews = [
    {
      id: 1,
      author: 'Aravind K.',
      rating: 5,
      date: '2 weeks ago',
      title: 'Absolutely fantastic quality!',
      comment: `Matches all specs perfectly. The build and performance of this ${product.category.toLowerCase()} is exactly what I needed. Highly recommendNexus products.`
    },
    {
      id: 2,
      author: 'Sneha M.',
      rating: 4,
      date: '1 month ago',
      title: 'Great value for money',
      comment: `Solid design, very minimalist and matches my workspace aesthetic. Delivery was extremely fast. Value is top-notch.`
    },
    {
      id: 3,
      author: 'Rohit S.',
      rating: 5,
      date: '1 month ago',
      title: 'Premium feel',
      comment: `The material feels premium. Can tell it is made to last. Nexus Gaming has did a great job on this product.`
    }
  ]

  // Mock Specifications based on Category
  const specs = product.category === 'Accessories' ? [
    { label: 'Manufacturer', value: product.manufacturer },
    { label: 'Connectivity', value: 'Wired & Wireless Modes' },
    { label: 'Warranty', value: '2 Year Domestic Warranty' },
    { label: 'Compatibility', value: 'Windows, macOS, PlayStation, Xbox' }
  ] : [
    { label: 'Developer/Publisher', value: product.manufacturer },
    { label: 'Platform', value: 'Steam (Digital Activation Key)' },
    { label: 'Language support', value: 'English, Hindi, French, Spanish' },
    { label: 'System Requirements', value: 'Min. 8GB RAM, GTX 1660 / AMD equivalent' }
  ]

  return (
    <div className="details-page-container">
      {/* Back button */}
      <div className="details-header">
        <button className="details-back-action" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to products</span>
        </button>
      </div>

      <div className="details-content-grid">
        {/* Left: Product Image */}
        <section className="details-gallery">
          <div className="main-image-wrapper">
            <img src={product.image} alt={product.title} className="details-main-img" />
          </div>
        </section>

        {/* Right: Info panel */}
        <section className="details-info-panel">
          <span className="info-brand">{product.manufacturer}</span>
          <h1 className="info-title">{product.title}</h1>
          
          <div className="info-meta-row">
            <span className="info-category-tag">{product.category}</span>
            <div className="info-rating-stars">
              <Star size={16} fill="#FFB800" stroke="#FFB800" />
              <span className="rating-val">{product.rating?.rate || '4.5'}</span>
              <span className="rating-count">({product.rating?.count || 120} customer reviews)</span>
            </div>
          </div>

          <div className="info-price-row">
            <span className="info-price-current">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="info-price-original">{formatPrice(product.originalPrice)}</span>
                <span className="info-price-discount-tag">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="info-description">{product.description}</p>

          <div className="divider" />

          {/* Action Row */}
          <div className="action-selection-section">
            <div className="quantity-controller-wrapper">
              <span className="control-label">Qty</span>
              <div className="quantity-controls">
                <button onClick={handleDecrement} className="qty-btn" aria-label="Decrease quantity">-</button>
                <span className="qty-display">{quantity}</span>
                <button onClick={handleIncrement} className="qty-btn" aria-label="Increase quantity">+</button>
              </div>
            </div>

            <div className="detail-cta-buttons">
              <button 
                className="detail-add-to-cart-btn"
                onClick={() => onAddToCart(product, quantity)}
              >
                <ShoppingCart size={18} />
                <span>Add {quantity} to Cart</span>
              </button>

              <button 
                className={`detail-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="divider" />

          {/* Trust points */}
          <div className="trust-points-grid">
            <div className="trust-point">
              <Truck size={18} className="trust-icon" />
              <div>
                <h6>Free Shipping</h6>
                <p>Delivery in 2-3 working days</p>
              </div>
            </div>
            <div className="trust-point">
              <RotateCcw size={18} className="trust-icon" />
              <div>
                <h6>Easy Returns</h6>
                <p>7-day replacement warranty</p>
              </div>
            </div>
            <div className="trust-point">
              <Shield size={18} className="trust-icon" />
              <div>
                <h6>Secure Checkout</h6>
                <p>100% verified SSL payment systems</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Specifications & Reviews Row */}
      <section className="details-tabs-section">
        <div className="tab-headings">
          <h3 className="tab-heading active">Product specifications & Reviews</h3>
        </div>

        <div className="tabs-content-row">
          {/* Specifications */}
          <div className="specs-column">
            <h4>Technical Details</h4>
            <div className="specs-table">
              {specs.map((spec, i) => (
                <div key={i} className="spec-row">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="reviews-column">
            <h4>Reviews ({mockReviews.length})</h4>
            <div className="reviews-list">
              {mockReviews.map((rev) => (
                <article key={rev.id} className="review-card">
                  <div className="review-card-header">
                    <span className="review-author">{rev.author}</span>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div className="review-stars">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="#FFB800" stroke="#FFB800" />
                    ))}
                  </div>
                  <h5 className="review-title">{rev.title}</h5>
                  <p className="review-comment">{rev.comment}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
