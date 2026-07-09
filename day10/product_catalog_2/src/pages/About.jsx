import React from 'react'

export default function About() {
  return (
    <div className="about-page-container">
      <section className="about-hero">
        <span className="about-subtitle">Our Journey</span>
        <h1 className="about-title">About Maran Gaming</h1>
        <p className="about-lead">
          Founded in 2026, we are dedicated to providing elite players with the finest hardware gear and immersive digital interactive software.
        </p>
      </section>

      <div className="about-content-grid">
        {/* Story Section */}
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            What started as a small group of gaming enthusiasts in Chennai has grown into a premium catalog hub for gamers worldwide. We select only the highest rated hardware and developer games to feature on our platform.
          </p>
          <p>
            We believe that gaming is not just a hobby, but a form of digital art. Therefore, your accessories and setup should reflect that elegance. That is why we emphasize sleek, monochrome, and highly responsive components.
          </p>
        </section>

        {/* Values Section */}
        <section className="about-section values">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h4>Quality First</h4>
              <p>Every accessory undergoes rigorous durability testing before getting listed on our storefront.</p>
            </div>
            <div className="value-item">
              <h4>Player Centric</h4>
              <p>We provide standard 2-year warranties and 7-day returns with 24/7 dedicated customer assistance.</p>
            </div>
            <div className="value-item">
              <h4>Minimalist Design</h4>
              <p>We eliminate unnecessary distractions to build clean, cohesive, and beautiful aesthetics.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Stats Section */}
      <section className="about-stats-bar">
        <div className="stat-card">
          <h3>25K+</h3>
          <p>Orders Delivered</p>
        </div>
        <div className="stat-card">
          <h3>99.4%</h3>
          <p>Positive Feedback</p>
        </div>
        <div className="stat-card">
          <h3>2 Years</h3>
          <p>Full Hardware Warranty</p>
        </div>
      </section>
    </div>
  )
}
