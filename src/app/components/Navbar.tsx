"use client";

import Link from "next/link";
import {
  ShoppingBag, Search, Menu, Heart, Sun, Moon,
  LogOut, ShoppingCart
} from "lucide-react";
import { Product, CartItem } from "./types";

interface NavbarProps {
  theme: string;
  toggleTheme: () => void;
  user: { name: string; isAdmin: boolean } | null;
  handleLogout: () => void;
  wishlist: Product[];
  cart: CartItem[];
  setActiveOverlay: (overlay: 'cart' | 'wishlist' | 'mobileMenu' | null) => void;
}

export default function Navbar({
  theme, toggleTheme, user, handleLogout,
  wishlist, cart, setActiveOverlay
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border py-4 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <ShoppingBag className="text-primary w-7 h-7" />
          <span className="font-bold text-2xl text-primary hidden sm:block tracking-tighter">T-Shop</span>
        </Link>

        <div className="hidden lg:flex items-center bg-background border border-border rounded-xl px-4 py-2.5 w-[400px] gap-2 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Axtarış..." className="bg-transparent border-none text-foreground w-full outline-none text-sm font-medium" />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={toggleTheme} className="text-foreground hover:text-primary transition-colors p-2.5 hover:bg-primary/5 rounded-xl hidden sm:block" title="Theme">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setActiveOverlay('wishlist')}
            className="relative text-foreground hover:text-primary transition-colors p-2.5 hover:bg-primary/5 rounded-xl"
          >
            <Heart size={22} className={wishlist.length > 0 ? "fill-primary text-primary" : ""} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-card">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveOverlay('cart')}
            className="relative text-foreground hover:text-primary transition-colors p-2.5 hover:bg-primary/5 rounded-xl"
          >
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-card">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-4 border-l border-border pl-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold truncate max-w-[120px]">{user.name}</span>
                  {user.isAdmin && <Link href="/admin" className="text-[10px] text-primary uppercase font-black tracking-widest hover:underline">Admin Panel</Link>}
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="bg-primary hover:bg-primary-dark text-white text-sm font-black py-2.5 px-6 rounded-xl transition-all no-underline shadow-lg shadow-primary/20 hover:-translate-y-0.5">Giriş</Link>
            )}
          </div>

          <button className="md:hidden text-foreground p-2" onClick={() => setActiveOverlay('mobileMenu')}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
