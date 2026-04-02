"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Trash2, Package, ExternalLink, Search } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if(res.ok) {
        setProducts(data);
      } else {
        setError("Məhsulları yükləmək mümkün olmadı.");
      }
    } catch(err) {
      setError("Serverlə əlaqə qurmaq mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if(!confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          token: `Bearer ${token}`
        }
      });
      
      if(res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert("Silmək üçün yetkiniz yoxdur!");
      }
    } catch(err) {
      alert("Xəta baş verdi.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 p-8 lg:px-12 flex flex-col gap-8 max-w-full overflow-x-hidden">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold text-foreground">Məhsulların İdarəetməsi</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Məhsul axtar..." 
               className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:border-primary outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <Bell size={20} className="text-gray-400 cursor-pointer hover:text-primary transition-colors hidden sm:block" />
          <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0">A</div>
        </div>
      </header>

      <motion.div 
        className="bg-card border border-border rounded-xl p-4 md:p-8 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-foreground">Sistemdəki Bütün Məhsullar</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{filteredProducts.length} Məhsul</span>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Yüklənir...</span>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-8">{error}</p>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold text-xs uppercase border-b border-border">Məhsul</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold text-xs uppercase border-b border-border">Qiymət</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold text-xs uppercase border-b border-border">Tarix</th>
                  <th className="px-6 py-3 text-right text-gray-400 font-semibold text-xs uppercase border-b border-border">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          onError={(e) => {(e.target as HTMLImageElement).src = "https://via.placeholder.com/40"}}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground line-clamp-1">{product.title}</span>
                          <span className="text-[10px] text-gray-500 font-mono tracking-tight">{product._id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary border-b border-border">{product.price} AZN</td>
                    <td className="px-6 py-4 text-xs text-gray-400 border-b border-border">{new Date(product.createdAt).toLocaleDateString("az-AZ")}</td>
                    <td className="px-6 py-4 border-b border-border text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                          title="Bax"
                          onClick={() => window.open(`http://localhost:3000/product/${product._id}`, '_blank')}
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-400 bg-gray-50/5">Heç bir məhsul tapılmadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </main>
  );
}
