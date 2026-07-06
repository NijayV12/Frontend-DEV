import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Wishlist from './pages/Wishlist'
import Contact from './pages/Contact'
import About from './pages/About'
import Profile from './pages/Profile'
import './App.css'

// Import cover art assets
import cyberpunkCover from './assets/cyberpunk.png'
import spaceCover from './assets/space.png'
import fantasyCover from './assets/fantasy.png'
import pixelCover from './assets/pixel.png'

// Gaming Accessories and Games Catalog Database (reused from day9 but enhanced)
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
    originalPrice: null,
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
    originalPrice: null,
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
  },
  {
    id: 9,
    title: 'Vanguard Gaming Chair',
    category: 'Accessories',
    price: 15499,
    originalPrice: 19999,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fce6e?w=600&auto=format&fit=crop&q=80',
    description: 'Ergonomic high-back leather gaming chair with adjustable 4D armrests, lumbar support pillow, and 135-degree tilt recline.',
    rating: { rate: 4.6, count: 180 },
    manufacturer: 'Apex Gear'
  },
  {
    id: 10,
    title: 'RGB Neon Mousepad',
    category: 'Accessories',
    price: 1499,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80',
    description: 'Extra large water-resistant micro-texture cloth mousepad with 14 customizable RGB LED perimeter lighting modes and non-slip rubber base.',
    rating: { rate: 4.4, count: 250 },
    manufacturer: 'Vortex Gear'
  },
  {
    id: 11,
    title: 'Medieval Siege',
    category: 'Games',
    price: 2499,
    originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    description: 'Real-time tactical strategy game featuring massive physics-based castle sieges, troop building, and competitive multiplayer battles.',
    rating: { rate: 4.5, count: 70 },
    manufacturer: 'Ironclad Games'
  },
  {
    id: 12,
    title: 'Cyber Racer',
    category: 'Games',
    price: 1999,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    description: 'High-octane neon racing simulator set in futuristic cities with customizable hovercars, gravity-defying tracks, and synthwave soundtrack.',
    rating: { rate: 4.7, count: 140 },
    manufacturer: 'Stellaris Studios'
  }
]

export default function App() {
  const [products] = useState(INITIAL_PRODUCTS)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [currentPage, setCurrentPage] = useState('home') // 'home' | 'details' | 'cart' | 'checkout' | 'success' | 'wishlist' | 'contact' | 'about' | 'profile'
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  
  // Pre-load past orders history to make Profile page look active
  const [pastOrders, setPastOrders] = useState([
    {
      orderId: 'MGC-489302',
      date: 'June 28, 2026',
      status: 'Delivered',
      items: [
        { id: 3, title: 'Apex-X Keyboard', price: 9999, quantity: 1 }
      ]
    }
  ])

  // Navigate to different page and scroll to top automatically
  const navigateTo = (pageName) => {
    setCurrentPage(pageName)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleAddToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prevCart, { ...product, quantity }]
    })
  }

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(id)
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
      )
    }
  }

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const handleToggleWishlist = (id) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(id)) {
        return prevWishlist.filter((item) => item !== id)
      }
      return [...prevWishlist, id]
    })
  }

  const handleViewDetails = (productId) => {
    setSelectedProductId(productId)
    navigateTo('details')
  }

  const handlePlaceOrder = (shippingInfo) => {
    const mockOrderId = `MGC-${Math.floor(100000 + Math.random() * 900000)}`
    const newOrder = {
      ...shippingInfo,
      orderId: mockOrderId,
      items: [...cart],
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'In Transit'
    }
    setOrderDetails(newOrder)
    setPastOrders((prev) => [newOrder, ...prev])
    setCart([]) // Clear Cart
    navigateTo('success')
  }

  // Router Switch logic
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            products={products}
            cart={cart}
            wishlist={wishlist}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onViewDetails={handleViewDetails}
          />
        )
      case 'details':
        return (
          <ProductDetails
            productId={selectedProductId}
            products={products}
            cart={cart}
            wishlist={wishlist}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onBack={() => navigateTo('home')}
          />
        )
      case 'cart':
        return (
          <Cart
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onNavigate={navigateTo}
            setCurrentPage={setCurrentPage}
          />
        )
      case 'checkout':
        return (
          <Checkout
            cart={cart}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => navigateTo('cart')}
          />
        )
      case 'success':
        return (
          <OrderSuccess
            orderDetails={orderDetails}
            onNavigate={navigateTo}
          />
        )
      case 'wishlist':
        return (
          <Wishlist
            wishlist={wishlist}
            products={products}
            onAddToCart={handleAddToCart}
            onRemoveFromWishlist={handleToggleWishlist}
            onViewDetails={handleViewDetails}
            onNavigate={navigateTo}
          />
        )
      case 'contact':
        return <Contact />
      case 'about':
        return <About />
      case 'profile':
        return <Profile pastOrders={pastOrders} onNavigate={navigateTo} />
      default:
        return (
          <Home
            products={products}
            cart={cart}
            wishlist={wishlist}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onViewDetails={handleViewDetails}
          />
        )
    }
  }

  return (
    <div className="app-container">
      <Navbar
        cart={cart}
        wishlist={wishlist}
        currentPage={currentPage}
        setCurrentPage={navigateTo}
      />

      <main className="main-content">{renderPage()}</main>

      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h4>Maran Gaming</h4>
            <p>Elevate your setup and gaming collection with our curated catalogue.</p>
          </div>
          <div className="footer-links">
            <span onClick={() => navigateTo('home')}>Shop</span>
            <span onClick={() => navigateTo('about')}>About</span>
            <span onClick={() => navigateTo('wishlist')}>Wishlist</span>
            <span onClick={() => navigateTo('contact')}>Contact</span>
            <span onClick={() => navigateTo('profile')}>Profile</span>
          </div>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Maran Gaming Stores. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
