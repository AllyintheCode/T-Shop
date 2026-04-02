"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CopyPlus, Package, Users, ShoppingBag, Bell, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [categories, setCategories] = useState<{_id: string, title: string}[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    categories: [] as string[]
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://talkmart-backend.vercel.app/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categories.length === 0) return setStatus({ type: 'error', msg: 'Zəhmət olmasa ən azı bir kateqoriya seçin.' });
    
    setLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://talkmart-backend.vercel.app/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price)
        }),
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: "Məhsul uğurla əlavə edildi!" });
        setFormData({ title: "", price: "", image: "", description: "", categories: [] });
      } else {
        const errorData = await res.json();
        setStatus({ type: 'error', msg: errorData.message || "Xəta baş verdi." });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Serverlə əlaqə qurmaq mümkün olmadı." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8 lg:px-12 flex flex-col gap-8 max-w-full overflow-x-hidden">
      {/* Top Bar */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground">İdarəetmə Paneli</h1>
          <p className="text-sm text-gray-400">Xoş gəldiniz, Admin!</p>
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} className="text-gray-400 cursor-pointer hover:text-primary transition-colors" />
          <div className="flex items-center gap-3 bg-card p-2 pr-4 rounded-full border border-border">
             <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">A</div>
             <div>
                <p className="font-semibold text-xs text-foreground leading-none">Admin User</p>
                <p className="text-[10px] text-gray-400 leading-none mt-1 uppercase font-bold tracking-widest">Aktiv</p>
             </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 group cursor-default" whileHover={{ y: -5, borderColor: 'var(--primary)' }}>
          <div className="p-4 bg-primary/10 text-primary rounded-xl transition-colors group-hover:bg-primary group-hover:text-white">
            <Package size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Cəmi Məhsul</h3>
            <p className="text-2xl font-black text-foreground tracking-tight">1,248</p>
          </div>
        </motion.div>
        <motion.div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 group cursor-default" whileHover={{ y: -5, borderColor: 'var(--primary)' }}>
          <div className="p-4 bg-primary/10 text-primary rounded-xl transition-colors group-hover:bg-primary group-hover:text-white">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Aktiv Müştəri</h3>
            <p className="text-2xl font-black text-foreground tracking-tight">842</p>
          </div>
        </motion.div>
        <motion.div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 group cursor-default" whileHover={{ y: -5, borderColor: 'var(--primary)' }}>
          <div className="p-4 bg-primary/10 text-primary rounded-xl transition-colors group-hover:bg-primary group-hover:text-white">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Aylıq Sifariş</h3>
            <p className="text-2xl font-black text-foreground tracking-tight">3,105</p>
          </div>
        </motion.div>
      </div>

      {/* Add Product Form */}
      <motion.div
        className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-2xl shadow-black/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-8">
           <div className="bg-primary/20 p-2 rounded-lg text-primary"><CopyPlus size={24} /></div>
           <h2 className="text-xl font-black text-foreground tracking-tight">Yeni Məhsul Yarat</h2>
        </div>
        
        {status && (
          <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 border shadow-lg ${
            status.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold">{status.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Məhsul Adı</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="px-5 py-4 bg-background border border-border rounded-xl text-foreground font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 shadow-inner"
              placeholder="Minimalist Dizayn Saç..."
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Qiymət (AZN)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="px-5 py-4 bg-background border border-border rounded-xl text-foreground font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 shadow-inner"
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Kateqoriya</label>
            <select
              required
              value={formData.categories[0] || ""}
              onChange={(e) => setFormData({...formData, categories: [e.target.value]})}
              className="px-5 py-4 bg-background border border-border rounded-xl text-foreground font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer shadow-inner appearance-none"
            >
              <option value="" disabled>Kateqoriya Seçin</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.title}>{cat.title}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Şəkil URL</label>
            <input
              type="text"
              required
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="px-5 py-4 bg-background border border-border rounded-xl text-foreground font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 shadow-inner"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="flex flex-col gap-3 col-span-full">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Məhsul Haqqında Geniş Açıqlama</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="px-5 py-4 bg-background border border-border rounded-xl text-foreground font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none min-h-[160px] placeholder:text-gray-600 shadow-inner"
              placeholder="Bu məhsulun xüsusiyyətləri..."
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="col-span-full bg-primary text-white py-5 px-8 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><CopyPlus size={20} /> Məhsulu Yarat və Paylaş</>}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
