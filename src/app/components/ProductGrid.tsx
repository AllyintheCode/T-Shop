"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, Search, Crown, ShoppingCart } from "lucide-react";
import { Product } from "./types";

interface ProductGridProps {
  products: Product[];
  selectedCategory: string | null;
  loading: boolean;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToCart: (product: Product) => void;
}

export default function ProductGrid({ products, selectedCategory, loading, wishlist, toggleWishlist, addToCart }: ProductGridProps) {
  const filteredProducts = selectedCategory ? products.filter(p => p.categories?.includes(selectedCategory)) : products;

  return (
    <>
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
          <AnimatePresence mode="popLayout">
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
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                    <div className="flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button onClick={() => toggleWishlist(product)} className="bg-white text-black p-4 rounded-2xl shadow-xl hover:bg-primary hover:text-white transition-all transform hover:rotate-6 active:scale-95">
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
                    <button onClick={() => addToCart(product)} className="bg-primary text-white p-5 rounded-[1.5rem] hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-primary/20">
                      <ShoppingCart size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-24 text-center">
                <div className="bg-card w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 border border-dashed border-border"><Search size={40} /></div>
                <h3 className="text-2xl font-black tracking-tight text-foreground">Uyğun məhsul tapılmadı</h3>
                <p className="text-gray-400 mt-2">Başqa bir kateqoriya seçməyə nə deyirsiniz?</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
