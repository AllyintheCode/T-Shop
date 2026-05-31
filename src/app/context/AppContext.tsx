"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Category, ShippingAddress } from "../components/types";

interface AppContextType {
  theme: string;
  toggleTheme: () => void;
  user: { name: string; isAdmin: boolean } | null;
  handleLogout: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  cartTotal: number;
  activeOverlay: 'cart' | 'wishlist' | 'mobileMenu' | null;
  setActiveOverlay: (overlay: 'cart' | 'wishlist' | 'mobileMenu' | null) => void;
  isCheckout: boolean;
  setIsCheckout: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const API_BASE = "https://t-shop-backend-chi.vercel.app/api";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{ name: string; isAdmin: boolean } | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<'cart' | 'wishlist' | 'mobileMenu' | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);

  // Initial load
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

    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE}/users/wishlist`, {
        headers: { token: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setWishlist(data);
      })
      .catch(console.error);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setWishlist([]);
    window.location.reload();
  };

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

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, user, handleLogout,
      wishlist, toggleWishlist, cart, addToCart,
      updateCartQuantity, removeFromCart, cartTotal,
      activeOverlay, setActiveOverlay, isCheckout, setIsCheckout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
