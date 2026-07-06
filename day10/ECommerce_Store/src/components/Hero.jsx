import React from 'react'

export default function Hero({ onExplore }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-tagline">Premium Gaming Collection</span>
        <h1 className="hero-title">Equip Your Play</h1>
        <p className="hero-description">
          Discover a curated selection of elite gaming accessories and high-performance immersive games. Sleek design, uncompromising quality.
        </p>
        <button className="hero-cta-btn" onClick={onExplore}>
          Explore Catalog
        </button>
      </div>
    </section>
  )
}
