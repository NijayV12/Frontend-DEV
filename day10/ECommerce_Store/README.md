# Day 10 Assignment: My Gaming E-Commerce Store! 🎮🛒

Hey there! Welcome to my Day 10 project. Today, I took my Day 9 product catalog and upgraded it into a full-blown single-page e-commerce website! I wanted it to look super clean, modern, and simple (very Apple-like or Teenage Engineering vibe), and I'm really proud of how it turned out.

This is built using **React** and **Vite** with vanilla CSS for the styles.

## 🚀 What I Built (Features)

I created a complete shopping experience with **9 different pages/views** using a simple page router (state-based, no complex router setup needed!):

1. **Home / Shop**: A product catalog showing 12 cool items (games and hardware accessories). You can search items by name/brand or filter them using the category tabs at the top.
2. **Product Details**: Click on any product to see reviews, technical specs, a description, and choose the quantity before adding it to your cart or wishlist!
3. **Wishlist**: A dedicated section to save your favorite items so you don't lose them. You can add them straight to the cart from here too.
4. **Shopping Cart**: View your items, adjust quantities, delete items, and see the subtotal. Plus, I added a coupon code input! (Tip: Enter `GAMER20` to get 20% off!).
5. **Checkout Form**: A simple form to input shipping information and card details, with checks to make sure the fields aren't empty and the card CVV/numbers are valid.
6. **Order Confirmation**: Once placed, you get a custom receipt with a mock Order ID, delivery date, and a print button!
7. **Profile Dashboard**: A page where you can edit your profile details and view a history of all your orders (including their statuses like "In Transit").
8. **Contact & Help**: A clean query form and an interactive FAQ accordion to answer questions about shipping and returns.
9. **About Story**: A small page sharing the store's core values, story, and fun metrics.

---

## 🧠 What I Learned

Since I am a beginner, this project was a huge step up for me. Here's what I learned:
- **Global State Management**: Keeping track of `cart` items, `wishlist` items, and `pastOrders` inside the main `App.jsx` component and passing them down as props.
- **State-Based Navigation**: Implementing navigation without extra routing packages by changing a `currentPage` state string. It's super easy to debug!
- **Dynamic Price Calculations**: Handling live calculations for subtotals, tax (18% GST), shipping fees (free above ₹4999), and applying a 20% promo code.
- **Form Validations**: Checking email patterns and credit card criteria before allowing orders to proceed.
- **Vanilla CSS Layouts**: Designing responsive structures using CSS grids, flexbox, variables, and clean animations (like hover scales and transitions).

---

## 🛠️ How to Run locally

1. Open your terminal in this folder (`day10/ECommerce_Store`).
2. Install the packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Click on the localhost link in the terminal (usually `http://localhost:5173`) to view the store in your browser!
