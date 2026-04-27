"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import './globals.css';

import { Product, CartItem, Category, ShippingAddress } from "./components/types";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import CategoryList from "./components/CategoryList";
import ProductGrid from "./components/ProductGrid";
import { CartOverlay, WishlistOverlay } from "./components/Overlays";
import MobileMenuOverlay from "./components/MobileMenu";
import Footer from "./components/Footer";

const API_BASE = "https://t-shop-backend-chi.vercel.app/api";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<{ name: string; isAdmin: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeOverlay, setActiveOverlay] = useState<'cart' | 'wishlist' | 'mobileMenu' | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({ city: "", street: "", phone: "" });

  // --- Initial data load ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`)
        ]);
        setProducts(await prodRes.json());
        setCategories(await catRes.json());

        const token = localStorage.getItem("token");
        if (token) {
          const wishRes = await fetch(`${API_BASE}/users/wishlist`, {
            headers: { token: `Bearer ${token}` }
          });
          const wishData = await wishRes.json();
          if (Array.isArray(wishData)) setWishlist(wishData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Persist cart ---
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // --- Theme ---
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // --- Auth ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setWishlist([]);
    window.location.reload();
  };

  // --- Wishlist ---
  const toggleWishlist = async (product: Product) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("İstək siyahısı üçün giriş edin!");

    try {
      const res = await fetch(`${API_BASE}/users/wishlist/${product._id}`, {
        method: "POST",
        headers: { token: `Bearer ${token}` }
      });
      if (res.ok) {
        if (wishlist.some(item => item._id === product._id)) {
          setWishlist(wishlist.filter(item => item._id !== product._id));
        } else {
          setWishlist([...wishlist, product]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Cart ---
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setActiveOverlay('cart');
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item._id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- Order ---
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Sifariş üçün giriş edin!");
    if (cart.length === 0) return;

    try {
      setOrderLoading(true);
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`
        },
        body: JSON.stringify({
          products: cart.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            title: item.title,
            image: item.image,
            price: item.price
          })),
          amount: cartTotal,
          address: shippingAddress
        })
      });

      if (res.ok) {
        setOrderSuccess(true);
        setCart([]);
        localStorage.removeItem("cart");
        setTimeout(() => {
          setOrderSuccess(false);
          setIsCheckout(false);
          setActiveOverlay(null);
        }, 3000);
      } else {
        alert("Sifariş zamanı xəta baş verdi.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrderLoading(false);
    }
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
    setIsCheckout(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        handleLogout={handleLogout}
        wishlist={wishlist}
        cart={cart}
        setActiveOverlay={setActiveOverlay}
      />

      {/* Overlays */}
      <AnimatePresence>
        {activeOverlay === 'cart' && (
          <CartOverlay
            cart={cart}
            cartTotal={cartTotal}
            isCheckout={isCheckout}
            setIsCheckout={setIsCheckout}
            orderSuccess={orderSuccess}
            orderLoading={orderLoading}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            handlePlaceOrder={handlePlaceOrder}
            updateCartQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
            onClose={closeOverlay}
          />
        )}
        {activeOverlay === 'wishlist' && (
          <WishlistOverlay
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            onClose={closeOverlay}
          />
        )}
        {activeOverlay === 'mobileMenu' && (
          <MobileMenuOverlay
            user={user}
            handleLogout={handleLogout}
            onClose={closeOverlay}
          />
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 md:px-8 mt-8">
        <HeroBanner />
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          loading={loading}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
        />
      </main>

      <Footer />
    </div>
  );
}
