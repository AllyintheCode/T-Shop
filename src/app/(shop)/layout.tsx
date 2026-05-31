"use client";

import { AnimatePresence } from "framer-motion";
import { AppProvider, useAppContext, API_BASE } from "../context/AppContext";
import Navbar from "../components/Navbar";
import { CartOverlay, WishlistOverlay } from "../components/Overlays";
import MobileMenuOverlay from "../components/MobileMenu";
import Footer from "../components/Footer";
import { useState } from "react";
import { ShippingAddress } from "../components/types";

function ShopLayoutInner({ children }: { children: React.ReactNode }) {
  const {
    theme, toggleTheme, user, handleLogout,
    wishlist, toggleWishlist, cart, addToCart,
    updateCartQuantity, removeFromCart, cartTotal,
    activeOverlay, setActiveOverlay, isCheckout, setIsCheckout
  } = useAppContext();

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({ city: "", street: "", phone: "" });

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
        // We need to clear cart via window reload or context method for clearing. 
        // For now let's just reload. A better way would be clearCart in context.
        localStorage.removeItem("cart");
        setTimeout(() => {
          setOrderSuccess(false);
          setIsCheckout(false);
          setActiveOverlay(null);
          window.location.reload();
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        handleLogout={handleLogout}
        wishlist={wishlist}
        cart={cart}
        setActiveOverlay={setActiveOverlay}
      />

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

      <div className="flex-1">
        {children}
      </div>

      <Footer />
    </div>
  );
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ShopLayoutInner>{children}</ShopLayoutInner>
    </AppProvider>
  );
}
