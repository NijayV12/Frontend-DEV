import React from 'react'
import { CheckCircle2, ArrowRight, Printer } from 'lucide-react'

export default function OrderSuccess({ orderDetails, onNavigate }) {
  // Generate random order number
  const orderNumber = orderDetails?.orderId || `MGC-${Math.floor(100000 + Math.random() * 900000)}`
  
  // Calculate delivery date (3 days from now)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 3)
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', dateOptions)

  return (
    <div className="success-page-container">
      <div className="success-card">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={56} className="success-icon" />
        </div>

        <span className="success-badge">Payment Successful</span>
        <h1 className="success-title">Thank You For Your Order!</h1>
        <p className="success-subtitle">
          Your order has been placed successfully. A confirmation email with receipt and tracking details has been sent to <strong>{orderDetails?.email || 'your email'}</strong>.
        </p>

        <div className="order-details-box">
          <div className="detail-row">
            <span>Order Number:</span>
            <strong>{orderNumber}</strong>
          </div>
          <div className="detail-row">
            <span>Estimated Delivery:</span>
            <strong>{formattedDeliveryDate}</strong>
          </div>
          <div className="detail-row">
            <span>Deliver To:</span>
            <strong>{orderDetails?.fullName || 'Customer'}</strong>
          </div>
          <div className="detail-row">
            <span>Shipping Address:</span>
            <span className="address-val">{orderDetails?.address}, {orderDetails?.city} - {orderDetails?.zip}</span>
          </div>
        </div>

        <div className="success-action-buttons">
          <button className="continue-shop-btn" onClick={() => onNavigate('home')}>
            Continue Shopping <ArrowRight size={16} />
          </button>
          
          <button className="print-receipt-btn" onClick={() => window.print()}>
            <Printer size={16} /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  )
}
