import React, { useState } from 'react'
import { Search, Heart, ShoppingCart, Eye } from 'lucide-react'
import Hero from '../components/Hero'
import { formatPrice } from '../utils'

export default function Home({ products, cart, wishlist, onAddToCart, onToggleWishlist, onViewDetails }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Games', 'Accessories']

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Scroll smoothly to catalog section
  const handleScrollToCatalog = () => {
    const element = document.getElementById('catalog-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="home-page">
      <Hero onExplore={handleScrollToCatalog} />

      <main id="catalog-section" className="catalog-container">
        {/* Toolbar */}
        <section className="catalog-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, category, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Results Metadata */}
        <div className="catalog-meta">
          <h2 className="section-title">{selectedCategory} Catalog</h2>
          <span className="results-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </span>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>We couldn't find matches for "{searchQuery}". Try adjusting your filters.</p>
              <button className="clear-filter-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                Reset Search
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id)
              const isInCart = cart.some(item => item.id === product.id)

              return (
                <article key={product.id} className="product-card">
                  {/* Card Image */}
                  <div className="card-image-container">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="card-image"
                      onClick={() => onViewDetails(product.id)}
                    />
                    <button 
                      className={`wishlist-toggle-btn ${isWishlisted ? 'liked' : ''}`}
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                    
                    <button 
                      className="quick-view-overlay-btn"
                      onClick={() => onViewDetails(product.id)}
                    >
                      <Eye size={16} /> Quick View
                    </button>
                  </div>

                  {/* Card details */}
                  <div className="card-details">
                    <div className="card-brand-cat">
                      <span className="card-brand">{product.manufacturer}</span>
                      <span className="card-cat-badge">{product.category}</span>
                    </div>

                    <h3 className="card-product-title" onClick={() => onViewDetails(product.id)}>
                      {product.title}
                    </h3>
                    
                    <p className="card-short-desc">{product.description}</p>

                    <div className="card-bottom">
                      <div className="card-pricing">
                        {product.originalPrice && (
                          <span className="card-price-original">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                        <span className="card-price-current">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <button 
                        className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
                        onClick={() => onAddToCart(product, 1)}
                      >
                        <ShoppingCart size={15} />
                        <span>{isInCart ? 'Added' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
