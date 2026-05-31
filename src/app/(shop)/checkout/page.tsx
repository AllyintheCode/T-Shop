"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext, API_BASE } from "../../context/AppContext";
import { ShoppingCart, CheckCircle2, ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal } = useAppContext();
  
  const [shippingAddress, setShippingAddress] = useState({ city: "", street: "", phone: "" });
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sifariş üçün giriş edin!");
      router.push("/auth/login");
      return;
    }
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
        localStorage.removeItem("cart");
        setTimeout(() => {
          window.location.href = "/profile"; // Hard redirect to clear context cart easily and go to profile
        }, 3000);
      } else {
        alert("Sifariş zamanı xəta baş verdi.");
      }
    } catch (err) {
      console.error(err);
      alert("Sistem xətası baş verdi.");
    } finally {
      setOrderLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-8 bg-green-500/20 rounded-full text-green-500 mb-6">
          <CheckCircle2 size={80} className="text-green-500" />
        </motion.div>
        <h2 className="text-4xl font-black mb-4">Təbriklər!</h2>
        <p className="text-gray-500 text-lg mb-8">Sifarişiniz uğurla qəbul edildi. Qısa zamanda sizinlə əlaqə saxlanılacaq.</p>
        <p className="text-sm text-gray-400">Profil səhifəsinə yönləndirilirsiniz...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="p-8 bg-primary/10 rounded-full text-primary mb-6">
          <ShoppingCart size={80} />
        </div>
        <h2 className="text-3xl font-black mb-4">Səbətiniz boşdur</h2>
        <p className="text-gray-500 mb-8">Ödəniş etmək üçün əvvəlcə səbətinizə məhsul əlavə edin.</p>
        <button onClick={() => router.push("/")} className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors">
          Alış-verişə davam et
        </button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 md:px-8 py-8 min-h-[70vh]">
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} /> Geri qayıt
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="w-full lg:w-2/3">
          <h1 className="text-3xl font-black mb-8">Sifarişi Rəsmiləşdir</h1>
          
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-10">
            {/* Address Section */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <Truck className="text-primary" size={24} />
                <h2 className="text-xl font-bold">Çatdırılma Ünvanı</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Şəhər</label>
                  <input required type="text" placeholder="Bakı" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" value={shippingAddress.city} onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Mobil Nömrə</label>
                  <input required type="tel" placeholder="+994 50 000 00 00" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" value={shippingAddress.phone} onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Küçə / Bina / Mənzil</label>
                  <input required type="text" placeholder="Nizami küç. 42" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold" value={shippingAddress.street} onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <ShieldCheck className="text-primary" size={24} />
                <h2 className="text-xl font-bold">Ödəniş Məlumatları (Test)</h2>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Kart nömrəsi</label>
                  <input required type="text" placeholder="**** **** **** ****" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold mt-2" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Bitmə tarixi</label>
                    <input required type="text" placeholder="MM/YY" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold mt-2" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">CVV</label>
                    <input required type="text" placeholder="123" className="w-full bg-background border border-border p-4 rounded-xl focus:border-primary outline-none transition-all font-bold mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Sifariş Xülasəsi</h2>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-xl border border-border" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.price} AZN x {item.quantity}</p>
                  </div>
                  <div className="font-bold text-sm text-primary">
                    {(item.price * item.quantity).toFixed(2)} AZN
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold">Məhsulların dəyəri</span>
                <span className="font-bold">{cartTotal.toFixed(2)} AZN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold">Çatdırılma</span>
                <span className="font-bold text-green-500">Pulsuz</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-border mt-3">
                <span className="font-black text-lg">Cəmi Yekun</span>
                <span className="font-black text-2xl text-primary">{cartTotal.toFixed(2)} AZN</span>
              </div>
            </div>

            <button 
              form="checkout-form"
              type="submit"
              disabled={orderLoading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {orderLoading ? (
                <>Gözləyin...</>
              ) : (
                <>Ödənişi Təsdiqlə <CheckCircle2 size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
