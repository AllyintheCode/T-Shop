"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Category {
  _id: string;
  title: string;
  image: string;
  createdAt: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    image: ""
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://t-shop-backend-chi.vercel.app/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://t-shop-backend-chi.vercel.app/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: "Kateqoriya yaradıldı!" });
        setFormData({ title: "", image: "" });
        fetchCategories();
      } else {
        const err = await res.json();
        setStatus({ type: 'error', msg: err.message || "Xəta baş verdi." });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Serverlə əlaqə kəsildi." });
    } finally {
      setFormLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://t-shop-backend-chi.vercel.app/api/categories/${id}`, {
        method: "DELETE",
        headers: { "token": `Bearer ${token}` }
      });
      if (res.ok) fetchCategories();
    } catch (err) {
      alert("Xəta baş verdi");
    }
  };

  return (
    <main className="flex-1 p-8 lg:px-12 flex flex-col gap-8">
      <header className="pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold text-foreground">Kateqoriya İdarəetməsi</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-card border border-border rounded-xl p-6 sticky top-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-primary" /> Yeni Kateqoriya
            </h2>

            {status && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="text-sm">{status.msg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kateqoriya Adı</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none transition-all"
                  placeholder="Məs: Elektronika"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">İkon/Şəkil URL</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
              <button 
                type="submit"
                disabled={formLoading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {formLoading ? <Loader2 className="animate-spin" size={20} /> : "Kateqoriya Əlavə Et"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-card border border-border rounded-xl animate-pulse" />
                ))
              ) : categories.length > 0 ? (
                categories.map(cat => (
                  <motion.div 
                    key={cat._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-background flex items-center justify-center border border-border">
                        {cat.image ? (
                          <img src={cat.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{cat.title}</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-mono tracking-tighter">İD: {cat._id}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteCategory(cat._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-400 bg-card border border-dashed border-border rounded-xl">
                  Kateqoriya tapılmadı.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
