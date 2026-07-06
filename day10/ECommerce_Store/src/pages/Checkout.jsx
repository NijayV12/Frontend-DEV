import React, { useState } from 'react'
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react'
import { formatPrice } from '../utils'

export default function Checkout({ cart, onPlaceOrder, onBack }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  })

  const [errors, setErrors] = useState({})

  // Calculate order details
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const tax = Math.round(subtotal * 0.18)
  const shipping = subtotal > 4999 ? 0 : 150
  const total = subtotal + tax + shipping

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.address.trim()) newErrors.address = 'Shipping Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP/Postal Code is required'
    } else if (!/^\d{5,6}$/.test(formData.zip)) {
      newErrors.zip = 'ZIP must be a 5 or 6 digit number'
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card Number is required'
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s+/g, ''))) {
      newErrors.cardNumber = 'Must be a 16-digit card number'
    }

    if (!formData.cardExpiry.trim()) {
      newErrors.cardExpiry = 'Expiry is required'
    } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Must be in MM/YY format'
    }

    if (!formData.cardCvv.trim()) {
      newErrors.cardCvv = 'CVV is required'
    } else if (!/^\d{3}$/.test(formData.cardCvv)) {
      newErrors.cardCvv = 'Must be 3 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onPlaceOrder(formData)
    }
  }

  return (
    <div className="checkout-page-container">
      <div className="checkout-header">
        <button className="checkout-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Cart
        </button>
        <h1 className="checkout-title">Checkout</h1>
      </div>

      <div className="checkout-grid-layout">
        {/* Form Column */}
        <section className="checkout-form-column">
          <form onSubmit={handleSubmit} className="checkout-form">
            
            {/* Shipping section */}
            <div className="form-section">
              <h2 className="form-section-title">Shipping Information</h2>
              
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName"
                  placeholder="e.g. Nijay Kumar"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  placeholder="e.g. nijay@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address"
                  placeholder="Street Address, Apartment, Suite"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city"
                    placeholder="e.g. Chennai"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="zip">ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    id="zip" 
                    name="zip"
                    placeholder="e.g. 600001"
                    value={formData.zip}
                    onChange={handleChange}
                    className={errors.zip ? 'error' : ''}
                  />
                  {errors.zip && <span className="error-message">{errors.zip}</span>}
                </div>
              </div>
            </div>

            {/* Payment section */}
            <div className="form-section">
              <h2 className="form-section-title">Payment Method</h2>
              <div className="payment-type-badge">
                <CreditCard size={16} />
                <span>Credit / Debit Card</span>
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input 
                  type="text" 
                  id="cardNumber" 
                  name="cardNumber"
                  placeholder="1234 5678 1234 5678"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={errors.cardNumber ? 'error' : ''}
                  maxLength="16"
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="cardExpiry">Expiry Date (MM/YY)</label>
                  <input 
                    type="text" 
                    id="cardExpiry" 
                    name="cardExpiry"
                    placeholder="MM/YY"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    className={errors.cardExpiry ? 'error' : ''}
                    maxLength="5"
                  />
                  {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cardCvv">CVV</label>
                  <input 
                    type="password" 
                    id="cardCvv" 
                    name="cardCvv"
                    placeholder="123"
                    value={formData.cardCvv}
                    onChange={handleChange}
                    className={errors.cardCvv ? 'error' : ''}
                    maxLength="3"
                  />
                  {errors.cardCvv && <span className="error-message">{errors.cardCvv}</span>}
                </div>
              </div>
            </div>

            <button type="submit" className="place-order-submit-btn">
              Complete Payment & Place Order ({formatPrice(total)})
            </button>
          </form>
        </section>

        {/* Recap Column */}
        <section className="checkout-recap-column">
          <div className="recap-card">
            <h3>Items in Order</h3>
            <div className="recap-items-list">
              {cart.map((item) => (
                <div key={item.id} className="recap-item-row">
                  <div className="recap-item-info">
                    <span className="recap-item-name">{item.title}</span>
                    <span className="recap-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="recap-item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="recap-divider" />

            <div className="recap-costs">
              <div className="recap-cost-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="recap-cost-row">
                <span>GST Tax (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="recap-cost-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="recap-divider" />
              <div className="recap-total-row">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="checkout-trust-badge">
              <ShieldCheck size={16} />
              <span>AES-256 Encrypted & Secure checkout</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
