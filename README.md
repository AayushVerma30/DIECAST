# DIECAST - React Scale Model Web Application

A modern, high-fidelity **React + Vite** web application for DIECAST precision scale models and collector vault.

## 🚀 Quick Start (Running Locally)

Open your terminal or command prompt in this directory (`c:\Users\SURESH VERMA\Desktop\DIECAST`) and run:

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

The app will start at `http://localhost:3000`.

## 📦 Project Structure

- `src/App.jsx` - Main application logic, filter state, cart, wishlist
- `src/index.css` - Custom dark metallic design system, glassmorphism, responsive layout
- `src/components/Navbar.jsx` - Sticky header, search bar, cart/wishlist triggers
- `src/components/Hero.jsx` - Hero showcase banner with interactive scale selector
- `src/components/CarShowcase.jsx` - Multi-scale filtering (1:18, 1:24, 1:43, 1:64) & sorting
- `src/components/CarCard.jsx` - Interactive card with specs and wishlist toggle
- `src/components/CarModal.jsx` - Fullscreen model detail & spec viewer with multi-image gallery
- `src/components/CartDrawer.jsx` - Slide-out vault cart and checkout
- `src/data/carsData.js` - Precision diecast models data and scale specifications
