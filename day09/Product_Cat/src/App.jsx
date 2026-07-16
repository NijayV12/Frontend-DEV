import React, { useState } from 'react'
import { Store, Search } from 'lucide-react'
import './App.css'

// Import cover art assets
import cyberpunkCover from './assets/cyberpunk.png'
import spaceCover from './assets/space.png'
import fantasyCover from './assets/fantasy.png'
import pixelCover from './assets/pixel.png'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)

// Gaming Accessories and Games Catalog Database
const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: 'Cyberpunk Action',
    category: 'Games',
    price: 3749,
    originalPrice: 4999,
    image: cyberpunkCover,
    description: 'An open-world action RPG set in the vertical metropolis of Night City, complete with cybernetic upgrades and stealth missions.',
    rating: { rate: 4.8, count: 120 },
    manufacturer: 'Nexus Systems'
  },
  {
    id: 2,
    title: 'Space Odyssey',
    category: 'Games',
    price: 3299,
    image: spaceCover,
    description: 'Explore procedurally generated star systems, mine resource-rich asteroid belts, and upgrade your modular ship.',
    rating: { rate: 4.6, count: 85 },
    manufacturer: 'Stellaris Studios'
  },
  {
    id: 3,
    title: 'Apex-X Keyboard',
    category: 'Accessories',
    price: 9999,
    originalPrice: 12499,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'Hot-swappable tactile mechanical switches with custom programmable RGB backlighting, media dial, and magnetic wrist rest.',
    rating: { rate: 4.7, count: 320 },
    manufacturer: 'Apex Gear'
  },
  {
    id: 4,
    title: 'Vortex Wireless Mouse',
    category: 'Accessories',
    price: 5799,
    originalPrice: 7499,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-lightweight 65g design with an optical 26K DPI sensor, zero lag wireless connectivity, and 80 hours of battery life.',
    rating: { rate: 4.5, count: 215 },
    manufacturer: 'Vortex Gear'
  },
  {
    id: 5,
    title: 'Aura Surround Headset',
    category: 'Accessories',
    price: 7499,
    originalPrice: 8299,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
    description: 'Immersive 7.1 spatial surround sound with active noise-cancelling microphone, cool-gel memory foam earcups, and wireless receiver.',
    rating: { rate: 4.4, count: 180 },
    manufacturer: 'Aura Audio'
  },
  {
    id: 6,
    title: 'Spectra 27" Curved Monitor',
    category: 'Accessories',
    price: 18299,
    originalPrice: 20799,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    description: '144Hz high-speed refresh rate with 1ms response curved panel, AMD FreeSync support, and ultra-thin bezels for fluid gameplay.',
    rating: { rate: 4.9, count: 95 },
    manufacturer: 'Spectra Display'
  },
  {
    id: 7,
    title: 'Fantasy Quest',
    category: 'Games',
    price: 5799,
    image: fantasyCover,
    description: 'Epic medieval fantasy action RPG featuring massive raids, customizable spell classes, and deep atmospheric dungeons.',
    rating: { rate: 4.9, count: 240 },
    manufacturer: 'Ironclad Games'
  },
  {
    id: 8,
    title: 'Retro Platformer',
    category: 'Games',
    price: 799,
    originalPrice: 1249,
    image: pixelCover,
    description: 'Jump, dash, and double-jump through vibrant retro pixel art levels in an arcade platformer with customizable characters.',
    rating: { rate: 4.3, count: 110 },
    manufacturer: 'ByteSize Arcade'
  }
]

function App() {
  const [products] = useState(INITIAL_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Categories list
  const categories = ['All', 'Games', 'Accessories']

  // Filter products by category & search query
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-wrapper">
          <Store size={22} />
          <span>MARAN stores</span>
        </div>
      </header>

      <section className="catalog-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-list">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-item-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'All' ? 'All' : cat}
            </button>
          ))}
        </div>
      </section>

      <main className="catalog-main">
        <div className="catalog-header">
          <h1 className="catalog-title">Products</h1>
          <span className="results-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try another search or category.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="card-img-wrapper">
                  <img src={product.image} alt={product.title} className="card-img" />
                </div>

                <div className="card-info">
                  <span className="card-category">{product.category}</span>
                  <h4 className="card-title">{product.title}</h4>
                  <p className="card-description">{product.description}</p>

                  <div className="card-footer">
                    <div className="price-container">
                      {product.originalPrice && (
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      )}
                      <span className="current-price">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default App
