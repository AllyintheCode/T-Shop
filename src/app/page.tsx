"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ShoppingBag, Star, Crown, Search, Menu, Heart, Sun, Moon, 
  LogOut, User, X, Trash2, Plus, Minus, ShoppingCart, ArrowRight, ChevronLeft 
} from "lucide-react";
import './globals.css';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  categories: string[];
}

interface CartItem extends Product {
  quantity: number;
}

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<{_id: string, title: string, image: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<{ name: string; isAdmin: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeOverlay, setActiveOverlay] = useState<'cart' | 'wishlist' | 'mobileMenu' | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({ city: "", street: "", phone: "" });

  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // User setup
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Cart setup
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Initial data fetch
    const fetchData = async () => {
      try {
        setLoading(true);
        // Products
        const prodRes = await fetch("https://talkmart-backend.vercel.app/api/products");
        const prodData = await prodRes.json();
        setProducts(prodData);

        // Categories
        const catRes = await fetch("https://talkmart-backend.vercel.app/api/categories");
        const catData = await catRes.json();
        setCategories(catData);

        // Wishlist if logged in
        const token = localStorage.getItem("token");
        if (token) {
          const wishRes = await fetch("https://talkmart-backend.vercel.app/api/users/wishlist", {
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

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categories?.includes(selectedCategory))
    : products;

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
      const res = await fetch(`https://talkmart-backend.vercel.app/api/users/wishlist/${product._id}`, {
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
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Sifariş üçün giriş edin!");
    if (cart.length === 0) return;

    try {
      setOrderLoading(true);
      const res = await fetch("https://talkmart-backend.vercel.app/api/orders", {
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

  const Overlay = ({ type, title, children }: { type: 'cart' | 'wishlist' | 'mobileMenu', title: string, children: React.ReactNode }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex justify-end"
      onClick={() => {
        setActiveOverlay(null);
        setIsCheckout(false);
      }}
    >
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-md bg-card h-full shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 flex justify-between items-center border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {isCheckout && (
              <button onClick={() => setIsCheckout(false)} className="p-1 hover:bg-primary/10 rounded-lg mr-2 transition-colors">
                <ChevronLeft size={20} className="text-primary" />
              </button>
            )}
            {type === 'cart' ? <ShoppingCart className="text-primary" /> : type === 'wishlist' ? <Heart className="text-primary fill-primary" /> : <Menu className="text-primary" />}
            <h2 className="text-xl font-bold">{isCheckout ? "Ödəniş" : title}</h2>
          </div>
          <button onClick={() => {
            setActiveOverlay(null);
            setIsCheckout(false);
          }} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </div>

        {type === 'cart' && cart.length > 0 && !isCheckout && !orderSuccess && (
          <div className="p-6 border-t border-border bg-card space-y-4">
            <div className="flex justify-between items-center text-lg font-bold text-foreground">
              <span>Cəmi Məbləğ:</span>
              <span className="text-primary">{cartTotal} AZN</span>
            </div>
            <button 
              onClick={() => setIsCheckout(true)}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all transform hover:-translate-y-1"
            >
              Sifarişi Tamamla <ArrowRight size={20} />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
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

      {/* Overlays */}
      <AnimatePresence>
        {activeOverlay === 'cart' && (
          <Overlay type="cart" title="Səbətim">
            {orderSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="p-8 bg-green-500/20 rounded-full text-green-500"
                >
                  <Star size={64} className="fill-green-500" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">Təbriklər!</h3>
                  <p className="text-gray-400 font-medium">Sifarişiniz uğurla qəbul edildi.</p>
                </div>
              </div>
            ) : isCheckout ? (
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Məbləğ</p>
                  <p className="text-3xl font-black text-foreground">{cartTotal} AZN</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Çatdırılma Ünvanı</h4>
                  <input 
                    required 
                    type="text" 
                    placeholder="Şəhər" 
                    className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold"
                    value={shippingAddress.city}
                    onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})}
                  />
                  <input 
                    required 
                    type="text" 
                    placeholder="Küçə / Bina / Mənzil" 
                    className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold"
                    value={shippingAddress.street}
                    onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})}
                  />
                  <input 
                    required 
                    type="tel" 
                    placeholder="Mobil nömrə" 
                    className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold"
                    value={shippingAddress.phone}
                    onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Kart Məlumatları (Mock)</h4>
                  <div className="relative">
                    <input 
                      required 
                      type="text" 
                      placeholder="**** **** **** ****" 
                      className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold"
                    />
                    <ShoppingCart className="absolute right-4 top-4 text-gray-400" size={24} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="MM/YY" className="bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" />
                    <input required type="text" placeholder="CVV" className="bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" />
                  </div>
                </div>

                <button 
                  disabled={orderLoading}
                  type="submit" 
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {orderLoading ? "Gözləyin..." : "Ödəniş Et"}
                </button>
              </form>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="p-8 bg-primary/10 rounded-full text-primary"><ShoppingCart size={64} /></div>
                <p className="text-gray-400 font-medium tracking-tight">Səbətiniz hələ ki boşdur.</p>
                <button onClick={() => setActiveOverlay(null)} className="text-primary font-black uppercase tracking-widest text-xs">Alış-verişə davam et</button>
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
          </Overlay>
        )}

        {/* Wishlist Overlay */}
        {activeOverlay === 'wishlist' && (
          <Overlay type="wishlist" title="İstək Siyahım">
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
                    <button 
                      onClick={() => addToCart(item)}
                      className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                    >
                      <ShoppingCart size={16} />
                    </button>
                    <button 
                      onClick={() => toggleWishlist(item)}
                      className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </Overlay>
        )}

        {/* Mobile Menu Overlay */}
        {activeOverlay === 'mobileMenu' && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-0 z-[60] bg-card h-full flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-border">
              <span className="font-black text-2xl text-primary tracking-tighter">T-Shop Menu</span>
              <button onClick={() => setActiveOverlay(null)} className="p-2 text-foreground hover:bg-primary/10 rounded-full transition-all"><X size={24} /></button>
            </div>
            <div className="p-6 flex flex-col gap-8 flex-1">
              <div className="flex items-center bg-background border border-border rounded-xl px-4 py-4 gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Hər şeyi mən taparam..." className="bg-transparent border-none text-foreground w-full outline-none font-bold" />
              </div>

              {user ? (
                <div className="space-y-8 flex-1">
                  <div className="bg-background rounded-2xl p-6 border border-border flex items-center gap-4">
                    <div className="bg-primary/20 p-4 rounded-2xl text-primary shadow-lg shadow-primary/10"><User size={32} /></div>
                    <div>
                      <p className="font-black text-xl leading-none mb-1">{user.name}</p>
                      {user.isAdmin && <Link href="/admin" className="text-xs text-primary font-black uppercase tracking-widest" onClick={() => setActiveOverlay(null)}>Admin Panel</Link>}
                    </div>
                  </div>
                  <nav className="flex flex-col gap-2">
                    <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 font-bold transition-all text-foreground"><Heart size={20}/> İstək Siyahım</button>
                    <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 font-bold transition-all text-foreground"><ShoppingBag size={20}/> Sifarişlərim</button>
                    <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 font-bold transition-all text-foreground text-red-500 mt-4" onClick={handleLogout}><LogOut size={20}/> Çıxış Et</button>
                  </nav>
                </div>
              ) : (
                <div className="mt-auto space-y-4">
                  <Link href="/auth/login" className="w-full text-center py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest no-underline flex items-center justify-center hover:bg-primary-dark shadow-xl shadow-primary/20" onClick={() => setActiveOverlay(null)}>Giriş Et</Link>
                  <p className="text-center text-xs text-gray-500">Hələ də qeydiyyatdan keçməmisən? <Link href="/auth/register" className="text-primary font-bold">Qoşul!</Link></p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 md:px-8 mt-8">
        {/* Banner Section */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-br from-card to-gray-800/20 border border-border rounded-3xl p-8 md:p-20 min-h-[400px] flex items-center mb-12 shadow-2xl group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute -top-1/2 -right-[15%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary opacity-20 rounded-full blur-[100px] group-hover:opacity-30 transition-opacity duration-700"></div>
          <div className="absolute -bottom-1/2 -left-[10%] w-[300px] h-[300px] bg-blue-500 opacity-10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 max-w-2xl text-left">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <span className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 inline-block border border-primary/20 shadow-lg">New Season 2026</span>
              <h1 className="text-4xl md:text-7xl font-black leading-[0.9] mb-6 text-foreground tracking-tighter">
                Sənin Tərzin, <br/><span className="text-primary italic">Sənin Qaydan.</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-md mb-10 leading-relaxed font-semibold">T-Shop ilə gələcəyin moda dünyasını kəşf etməyə hazır ol.</p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-white font-black py-4 px-10 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 flex items-center gap-2 group/btn">İndi Başla <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform"/></button>
                <button className="bg-card/50 backdrop-blur-md border border-border text-foreground font-bold py-4 px-10 rounded-2xl hover:bg-card transition-all">Trendləri Kəşf Et</button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full"></div>
                <h2 className="text-xl font-black uppercase tracking-widest text-foreground/80">Kateqoriyalar</h2>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!selectedCategory ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card text-foreground hover:bg-border border border-border'}`}
              >
                Hamısı
              </button>
            </div>
            
            <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
              {categories.map(cat => (
                <motion.button
                  key={cat._id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.title === selectedCategory ? null : cat.title)}
                  className={`flex flex-col items-center gap-4 shrink-0 group ${selectedCategory === cat.title ? 'scale-110' : ''}`}
                >
                  <div className={`w-24 h-24 md:w-28 md:h-28 rounded-[2rem] overflow-hidden border transition-all duration-500 flex items-center justify-center p-2 relative shadow-2xl ${
                    selectedCategory === cat.title ? 'border-primary bg-primary/10 shadow-primary/20 scale-105' : 'border-border bg-card group-hover:border-primary/50'
                  }`}>
                    <img src={cat.image} className="w-full h-full object-cover rounded-[1.5rem]" alt={cat.title} />
                    {selectedCategory === cat.title && <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>}
                  </div>
                  <span className={`text-[10px] uppercase font-black tracking-widest transition-colors ${selectedCategory === cat.title ? 'text-primary' : 'text-gray-500 group-hover:text-foreground'}`}>
                    {cat.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-5xl font-black text-foreground tracking-tighter">
              {selectedCategory ? selectedCategory : 'Seçilmiş Məhsullar'}
            </h2>
            <Crown className="text-primary w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-[2.5rem] h-[450px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-32">
            <AnimatePresence mode='popLayout'>
            {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
              <motion.div 
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-card border border-border rounded-[2.5rem] flex flex-col group overflow-hidden transition-all hover:shadow-2xl hover:shadow-black/10 hover:border-primary/30 relative"
              >
                <div className="relative h-80 w-full overflow-hidden bg-background">
                  <img src={product.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                    <div className="flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       <button 
                        onClick={() => toggleWishlist(product)}
                        className="bg-white text-black p-4 rounded-2xl shadow-xl hover:bg-primary hover:text-white transition-all transform hover:rotate-6 active:scale-95"
                       >
                         <Heart size={20} className={wishlist.some(item => item._id === product._id) ? "fill-current" : ""} />
                       </button>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                     {product.categories?.map(c => (
                        <span key={c} className="bg-primary/90 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-primary/20">{c}</span>
                     ))}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[11px] font-black text-foreground border border-white/20 flex items-center gap-1.5 shadow-xl">
                    <Star size={14} className="fill-yellow-400 text-yellow-400 stroke-yellow-400" /> 4.9
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-foreground text-lg mb-2 line-clamp-1 tracking-tight">{product.title}</h3>
                  <p className="text-gray-400 text-xs mb-8 line-clamp-2 leading-relaxed font-semibold">{product.description}</p>
                  
                  <div className="mt-auto flex justify-between items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-0.5">Qiymət</span>
                      <span className="text-3xl font-black text-primary tracking-tighter">{product.price} <span className="text-xs uppercase ml-0.5 tracking-tight">AZN</span></span>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-primary text-white p-5 rounded-[1.5rem] hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-primary/20"
                    >
                      <ShoppingCart size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-24 text-center">
                <div className="bg-card w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 border border-dashed border-border"><Search size={40}/></div>
                <h3 className="text-2xl font-black tracking-tight text-foreground">Uyğun məhsul tapılmadı</h3>
                <p className="text-gray-400 mt-2">Başqa bir kateqoriya seçməyə nə deyirsiniz?</p>
              </div>
            )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <footer className="bg-card border-t border-border pt-20 pb-10">
         <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="text-primary w-8 h-8" />
                  <span className="font-black text-3xl text-primary tracking-tighter">T-Shop</span>
               </div>
               <p className="text-gray-400 font-semibold max-w-sm">Azərbaycanın ən dinamik və premium e-ticarət platforması. Biz yalnız məhsul deyil, həyat tərzi satırıq.</p>
            </div>
            <div>
               <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-foreground/50">Şirkət</h4>
               <ul className="space-y-4 font-bold text-gray-400">
                  <li className="hover:text-primary cursor-pointer transition-colors">Haqqımızda</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Vakansiyalar</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
               </ul>
            </div>
            <div>
               <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-foreground/50">Dəstək</h4>
               <ul className="space-y-4 font-bold text-gray-400">
                  <li className="hover:text-primary cursor-pointer transition-colors">Sual-Cavab</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Çatdırılma</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Geri qaytarma</li>
               </ul>
            </div>
         </div>
         <div className="container mx-auto px-4 md:px-8 pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">© 2026 T-Shop. Bütün hüquqlar qorunur.</p>
            <div className="flex gap-6 text-gray-500 font-bold text-xs uppercase tracking-widest">
               <span>Privacy</span>
               <span>Terms</span>
               <span>Cookies</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
