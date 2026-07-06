import React, { useState } from 'react'
import { Send, CheckCircle, Mail, MapPin, Phone } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Query', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const faqs = [
    {
      q: 'What is the standard delivery timeframe?',
      a: 'All orders are dispatched within 24 hours. Standard shipping takes 2-3 business days across India, while premium tier orders might arrive sooner.'
    },
    {
      q: 'Do you offer refunds or returns?',
      a: 'Yes, we have a 7-day replacement/return policy for hardware accessories if they arrive damaged or defective. Games (digital codes) are non-refundable once activated.'
    },
    {
      q: 'Is my payment transaction secure?',
      a: 'Absolutely. We utilize bank-grade AES-256 bit encryption protocols. Your card details are never saved on our databases directly.'
    },
    {
      q: 'How do I activate the games after purchase?',
      a: 'Once your payment completes, a Steam/Epic Games store digital key is sent directly to your registered email address along with detailed activation instructions.'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true)
      // Reset form
      setFormData({ name: '', email: '', subject: 'General Query', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <div className="contact-page-container">
      <h1 className="contact-page-title">Get in Touch</h1>
      
      <div className="contact-grid-layout">
        {/* Contact Info & FAQs */}
        <section className="contact-info-column">
          <div className="info-cards-row">
            <div className="contact-info-card">
              <Mail size={18} />
              <div>
                <h5>Email Us</h5>
                <p>support@marangaming.com</p>
              </div>
            </div>
            
            <div className="contact-info-card">
              <Phone size={18} />
              <div>
                <h5>Call Us</h5>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-info-card">
              <MapPin size={18} />
              <div>
                <h5>Office Location</h5>
                <p>12, Apex Hub, OMR, Chennai, TN</p>
              </div>
            </div>
          </div>

          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                  <button className="faq-question-btn" onClick={() => toggleFaq(index)}>
                    <span>{faq.q}</span>
                    <span className="faq-icon">{activeFaq === index ? '−' : '+'}</span>
                  </button>
                  {activeFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-column">
          <div className="contact-form-card">
            <h3>Send us a Message</h3>
            <p>Our dedicated support team usually replies within 2-4 hours.</p>
            
            {submitted && (
              <div className="form-success-banner">
                <CheckCircle size={16} />
                <span>Message sent! We'll get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nijay Kumar"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. nijay@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select 
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="General Query">General Query</option>
                  <option value="Order Issue">Order Support / Issue</option>
                  <option value="Sales">Sales & Enquiries</option>
                  <option value="Feedback">Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you need help with..."
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                <Send size={15} /> Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
