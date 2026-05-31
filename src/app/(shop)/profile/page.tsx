"use client";

import { useEffect, useState } from "react";
import { useAppContext, API_BASE } from "../../context/AppContext";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, MapPin, Package, LogOut } from "lucide-react";

interface Order {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  products: {
    productId: string;
    quantity: number;
    title: string;
    image: string;
    price: number;
  }[];
}

export default function ProfilePage() {
  const { user, handleLogout } = useAppContext();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not logged in, redirect
    if (!localStorage.getItem("token")) {
      router.push("/auth/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        // We'll try to fetch user's orders (assuming the API is /orders and it returns user orders when token is passed)
        const res = await fetch(`${API_BASE}/orders`, {
          headers: { token: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Adjust based on typical MERN stack response
          if (Array.isArray(data)) {
            setOrders(data.reverse());
          }
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 md:px-8 py-12 min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-24">
            <div className="flex flex-col items-center mb-6 border-b border-border pb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold">{user?.name || "İstifadəçi"}</h2>
              <p className="text-gray-500 text-sm mt-1">{user?.isAdmin ? "Admin" : "Müştəri"}</p>
            </div>
            
            <nav className="flex flex-col gap-2">
              <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-primary/10 text-primary font-semibold transition-colors">
                <ShoppingBag size={20} />
                Sifarişlərim
              </button>
              <button className="flex items-center gap-3 w-full p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-card-hover transition-colors">
                <MapPin size={20} />
                Ünvanlarım
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-4"
              >
                <LogOut size={20} />
                Çıxış et
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
            <Package className="text-primary" /> Sifariş Tarixçəsi
          </h1>

          {orders.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Sifarişiniz yoxdur</h3>
              <p className="text-gray-500 mb-6">Siz hələ heç bir məhsul sifariş etməmisiniz.</p>
              <button onClick={() => router.push("/")} className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-primary/50 transition-all">
                Alış-verişə başla
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-wrap justify-between items-center border-b border-border pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Sifariş Tarixi</p>
                      <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('az-AZ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Sifariş №</p>
                      <p className="font-mono text-sm">{order._id.substring(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {order.status || 'Təsdiqləndi'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Ümumi Məbləğ</p>
                      <p className="text-xl font-black text-primary">{order.amount.toFixed(2)} AZN</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {order.products.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded-xl border border-border" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm line-clamp-1">{p.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{p.price} AZN x {p.quantity}</p>
                        </div>
                        <div className="font-bold text-sm">
                          {(p.price * p.quantity).toFixed(2)} AZN
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
