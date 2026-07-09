import React, { useState } from 'react'
import { ArrowLeft, Trash2, ShoppingBag, Plus, Minus, Tag } from 'lucide-react'
import { formatPrice } from '../utils'

export default function Cart({ cart, onUpdateQuantity, onRemoveFromCart, onNavigate, setCurrentPage }) {
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  // Calculate cart costs
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  
  // Tax (GST) is calculated at 18% of subtotal
  const tax = Math.round(subtotal * 0.18)
  
  // Free shipping on orders over ₹4999, else ₹150
  const shipping = subtotal > 4999 || subtotal === 0 ? 0 : 150
  
  const discount = Math.round(subtotal * promoDiscount)
  const total = subtotal + tax + shipping - discount

  const handleApplyPromo = (e) => {
    e.preventDefault()
    setPromoError('')
    if (promoCode.trim().toUpperCase() === 'GAMER20') {
      setPromoDiscount(0.20) // 20% discount
      setPromoApplied(true)
    } else if (promoCode.trim() === '') {
      setPromoError('Please enter a promo code.')
    } else {
      setPromoError('Invalid promo code. Try "GAMER20" for 20% off.')
    }
  }

  const handleRemovePromo = () => {
    setPromoDiscount(0)
    setPromoApplied(false)
    setPromoCode('')
    setPromoError('')
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page-container empty">
        <div className="empty-cart-inner">
          <ShoppingBag size={48} className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Explore our premium catalog to add games and gaming gear to your cart.</p>
          <button className="empty-cart-shop-btn" onClick={() => onNavigate('home')}>
            Explore Shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page-container">
      <h1 className="cart-page-title">Shopping Cart</h1>

      <div className="cart-grid-layout">
        {/* Items List Column */}
        <section className="cart-items-column">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>

          <div className="cart-items-list">
            {cart.map((item) => (
              <article key={item.id} className="cart-item-row">
                {/* Product Detail */}
                <div className="cart-item-product">
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-meta">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <span className="cart-item-category">{item.category}</span>
                    <span className="cart-item-unit-price">{formatPrice(item.price)} each</span>
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="cart-item-quantity">
                  <div className="quantity-counter">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="qty-adjust-btn"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="qty-value-label">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="qty-adjust-btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button 
                    onClick={() => onRemoveFromCart(item.id)}
                    className="item-remove-link-btn"
                    title="Remove item"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>

                {/* Subtotal */}
                <div className="cart-item-subtotal">
                  <span className="subtotal-val">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="cart-footer-nav">
            <button className="cart-back-shop-btn" onClick={() => onNavigate('home')}>
              <ArrowLeft size={16} /> Continue Shopping
            </button>
          </div>
        </section>

        {/* Invoice Summary Card Column */}
        <section className="cart-summary-column">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-divider" />

            <div className="summary-costs">
              <div className="cost-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="cost-row">
                <span>GST Tax (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div className="cost-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>

              {shipping > 0 && (
                <p className="shipping-hint-text">Add {formatPrice(5000 - subtotal)} more for FREE shipping</p>
              )}

              {promoApplied && (
                <div className="cost-row discount-row">
                  <span>Discount (20%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            <div className="summary-divider" />

            {/* Promo code form */}
            {!promoApplied ? (
              <form onSubmit={handleApplyPromo} className="promo-code-form">
                <input 
                  type="text" 
                  placeholder="Promo Code (GAMER20)" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button type="submit" className="promo-apply-btn">Apply</button>
              </form>
            ) : (
              <div className="promo-applied-badge">
                <Tag size={14} />
                <span>GAMER20 applied</span>
                <button onClick={handleRemovePromo} className="remove-promo-btn" title="Remove Code">×</button>
              </div>
            )}
            {promoError && <p className="promo-error-msg">{promoError}</p>}

            <div className="summary-divider" />

            {/* Total */}
            <div className="total-cost-row">
              <span>Estimated Total</span>
              <span className="total-grand-value">{formatPrice(total)}</span>
            </div>

            <button className="proceed-checkout-btn" onClick={() => onNavigate('checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
