"use client";

import { motion } from "framer-motion";
import { X, ChevronLeft, ShoppingCart, Heart, Menu, Star, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { CartItem, Product, ShippingAddress } from "./types";

interface CartOverlayProps {
  cart: CartItem[];
  cartTotal: number;
  isCheckout: boolean;
  setIsCheckout: (v: boolean) => void;
  orderSuccess: boolean;
  orderLoading: boolean;
  shippingAddress: ShippingAddress;
  setShippingAddress: (a: ShippingAddress) => void;
  handlePlaceOrder: (e: React.FormEvent) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onClose: () => void;
}

export function CartOverlay({
  cart, cartTotal, isCheckout, setIsCheckout, orderSuccess, orderLoading,
  shippingAddress, setShippingAddress, handlePlaceOrder, updateCartQuantity,
  removeFromCart, onClose
}: CartOverlayProps) {
  return (
    <OverlayShell icon={<ShoppingCart className="text-primary" />} title={isCheckout ? "Ödəniş" : "Səbətim"} onClose={onClose} isCheckout={isCheckout} setIsCheckout={setIsCheckout}
      footer={cart.length > 0 && !isCheckout && !orderSuccess ? (
        <div className="p-6 border-t border-border bg-card space-y-4">
          <div className="flex justify-between items-center text-lg font-bold text-foreground">
            <span>Cəmi Məbləğ:</span>
            <span className="text-primary">{cartTotal} AZN</span>
          </div>
          <button onClick={() => setIsCheckout(true)} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all transform hover:-translate-y-1">
            Sifarişi Tamamla <ArrowRight size={20} />
          </button>
        </div>
      ) : null}
    >
      {orderSuccess ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-8 bg-green-500/20 rounded-full text-green-500">
            <Star size={64} className="fill-green-500" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Təbriklər!</h3>
            <p className="text-gray-400 font-medium">Sifarişiniz uğurla qəbul edildi.</p>
          </div>
        </div>
      ) : isCheckout ? (
        <CheckoutForm cartTotal={cartTotal} orderLoading={orderLoading} shippingAddress={shippingAddress} setShippingAddress={setShippingAddress} handlePlaceOrder={handlePlaceOrder} />
      ) : cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="p-8 bg-primary/10 rounded-full text-primary"><ShoppingCart size={64} /></div>
          <p className="text-gray-400 font-medium tracking-tight">Səbətiniz hələ ki boşdur.</p>
          <button onClick={onClose} className="text-primary font-black uppercase tracking-widest text-xs">Alış-verişə davam et</button>
        </div>
      ) : (
        cart.map(item => (
          <div key={item._id} className="flex gap-4 bg-background p-4 rounded-2xl border border-border group hover:border-primary/30 transition-all">
            <img src={item.image} className="w-20 h-20 object-cover rounded-xl" alt="" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-sm line-clamp-1 mb-1">{item.title}</h3>
              <p className="text-primary font-black mb-3">{item.price} AZN</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-card rounded-xl px-3 py-1.5 border border-border shadow-inner">
                  <button onClick={() => updateCartQuantity(item._id, -1)} className="text-gray-400 hover:text-primary transition-colors"><Minus size={14} /></button>
                  <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item._id, 1)} className="text-gray-400 hover:text-primary transition-colors"><Plus size={14} /></button>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))
      )}
    </OverlayShell>
  );
}

// --- Wishlist Overlay ---
interface WishlistOverlayProps {
  wishlist: Product[];
  toggleWishlist: (p: Product) => void;
  addToCart: (p: Product) => void;
  onClose: () => void;
}

export function WishlistOverlay({ wishlist, toggleWishlist, addToCart, onClose }: WishlistOverlayProps) {
  return (
    <OverlayShell icon={<Heart className="text-primary fill-primary" />} title="İstək Siyahım" onClose={onClose}>
      {wishlist.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="p-8 bg-red-500/10 rounded-full text-red-500"><Heart size={64} /></div>
          <p className="text-gray-400 font-medium tracking-tight">İstək siyahınızda məhsul yoxdur.</p>
        </div>
      ) : (
        wishlist.map(item => (
          <div key={item._id} className="flex gap-4 bg-background p-4 rounded-2xl border border-border items-center hover:border-primary/30 transition-all">
            <img src={item.image} className="w-16 h-16 object-cover rounded-xl" alt="" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-xs line-clamp-1 mb-1">{item.title}</h3>
              <p className="text-primary font-black">{item.price} AZN</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => addToCart(item)} className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                <ShoppingCart size={16} />
              </button>
              <button onClick={() => toggleWishlist(item)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </OverlayShell>
  );
}

// --- Shared Overlay Shell ---
function OverlayShell({ icon, title, onClose, children, footer, isCheckout, setIsCheckout }: {
  icon: React.ReactNode; title: string; onClose: () => void; children: React.ReactNode;
  footer?: React.ReactNode; isCheckout?: boolean; setIsCheckout?: (v: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-md bg-card h-full shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 flex justify-between items-center border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {isCheckout && setIsCheckout && (
              <button onClick={() => setIsCheckout(false)} className="p-1 hover:bg-primary/10 rounded-lg mr-2 transition-colors">
                <ChevronLeft size={20} className="text-primary" />
              </button>
            )}
            {icon}
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>
        {footer}
      </motion.div>
    </motion.div>
  );
}

// --- Checkout Form ---
function CheckoutForm({ cartTotal, orderLoading, shippingAddress, setShippingAddress, handlePlaceOrder }: {
  cartTotal: number; orderLoading: boolean; shippingAddress: ShippingAddress;
  setShippingAddress: (a: ShippingAddress) => void; handlePlaceOrder: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={handlePlaceOrder} className="space-y-6">
      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
        <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Məbləğ</p>
        <p className="text-3xl font-black text-foreground">{cartTotal} AZN</p>
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Çatdırılma Ünvanı</h4>
        <input required type="text" placeholder="Şəhər" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" value={shippingAddress.city} onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
        <input required type="text" placeholder="Küçə / Bina / Mənzil" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" value={shippingAddress.street} onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })} />
        <input required type="tel" placeholder="Mobil nömrə" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" value={shippingAddress.phone} onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Kart Məlumatları (Mock)</h4>
        <div className="relative">
          <input required type="text" placeholder="**** **** **** ****" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" />
          <ShoppingCart className="absolute right-4 top-4 text-gray-400" size={24} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input required type="text" placeholder="MM/YY" className="bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" />
          <input required type="text" placeholder="CVV" className="bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" />
        </div>
      </div>
      <button disabled={orderLoading} type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
        {orderLoading ? "Gözləyin..." : "Ödəniş Et"}
      </button>
    </form>
  );
}
