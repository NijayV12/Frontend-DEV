import React, { useState } from 'react'
import { User, ShoppingBag, Package, MapPin, CheckCircle, Clock } from 'lucide-react'
import { formatPrice } from '../utils'

export default function Profile({ pastOrders, onNavigate }) {
  const [profile, setProfile] = useState({
    name: 'Nijay V',
    email: 'nijayv@example.com',
    phone: '+91 98765 43210',
    address: '123 Street, Chennai, TN',
    zip: '600001'
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [tempProfile, setTempProfile] = useState({ ...profile })
  const [saveMsg, setSaveMsg] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    setProfile({ ...tempProfile })
    setIsEditing(false)
    setSaveMsg('Profile saved successfully!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  return (
    <div className="profile-page-container">
      <h1 className="profile-page-title">My Account</h1>

      <div className="profile-grid-layout">
        {/* Profile Card Column */}
        <section className="profile-card-column">
          <div className="profile-details-card">
            <div className="profile-avatar-row">
              <div className="avatar-placeholder">
                <User size={32} />
              </div>
              <div>
                <h3>{profile.name}</h3>
                <p className="profile-email">{profile.email}</p>
              </div>
            </div>

            <div className="profile-divider" />

            {saveMsg && <div className="profile-save-success">{saveMsg}</div>}

            {!isEditing ? (
              <div className="profile-info-display">
                <div className="info-item">
                  <span className="info-label">Contact Number</span>
                  <span className="info-value">{profile.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Default Shipping Address</span>
                  <span className="info-value">
                    <MapPin size={14} className="map-icon" />
                    <span>{profile.address} - {profile.zip}</span>
                  </span>
                </div>
                <button className="profile-edit-btn" onClick={() => { setTempProfile({ ...profile }); setIsEditing(true); }}>
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="profile-edit-form">
                <div className="form-group">
                  <label htmlFor="edit-name">Full Name</label>
                  <input 
                    type="text" 
                    id="edit-name" 
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-email">Email Address</label>
                  <input 
                    type="email" 
                    id="edit-email" 
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-phone">Contact Number</label>
                  <input 
                    type="text" 
                    id="edit-phone" 
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-address">Shipping Address</label>
                  <input 
                    type="text" 
                    id="edit-address" 
                    value={tempProfile.address}
                    onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-zip">ZIP Code</label>
                  <input 
                    type="text" 
                    id="edit-zip" 
                    value={tempProfile.zip}
                    onChange={(e) => setTempProfile({ ...tempProfile, zip: e.target.value })}
                    required
                  />
                </div>
                <div className="edit-buttons-row">
                  <button type="submit" className="profile-save-btn">Save Changes</button>
                  <button type="button" className="profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Order History Column */}
        <section className="profile-orders-column">
          <div className="order-history-card">
            <div className="orders-header">
              <Package size={18} />
              <h3>Order History</h3>
            </div>
            
            <div className="profile-divider" />

            {pastOrders.length === 0 ? (
              <div className="empty-orders-state">
                <ShoppingBag size={32} className="empty-orders-icon" />
                <p>No orders placed yet.</p>
                <button className="shop-now-btn" onClick={() => onNavigate('home')}>Shop Now</button>
              </div>
            ) : (
              <div className="orders-list-table">
                {pastOrders.map((order, i) => {
                  const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                  const orderTax = Math.round(orderTotal * 0.18)
                  const orderShipping = orderTotal > 4999 ? 0 : 150
                  const finalTotal = orderTotal + orderTax + orderShipping

                  return (
                    <article key={i} className="order-history-row">
                      <div className="order-row-top">
                        <div>
                          <span className="order-id-label">Order ID:</span>
                          <span className="order-id-value"> {order.orderId}</span>
                        </div>
                        <span className={`order-status-badge ${order.status === 'Delivered' ? 'delivered' : 'pending'}`}>
                          {order.status === 'Delivered' ? <CheckCircle size={12} /> : <Clock size={12} />}
                          <span>{order.status}</span>
                        </span>
                      </div>

                      <div className="order-row-mid">
                        <div className="order-items-summary">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="order-item-snippet">
                              {item.title} (x{item.quantity})
                            </span>
                          ))}
                        </div>
                        <span className="order-total-price">{formatPrice(finalTotal)}</span>
                      </div>

                      <div className="order-row-bottom">
                        <span className="order-date-text">Placed on: {order.date || 'Today'}</span>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
