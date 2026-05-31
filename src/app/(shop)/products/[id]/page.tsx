"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../../components/types";
import { useAppContext, API_BASE } from "../../../context/AppContext";
import { Heart, ShoppingBag, ArrowLeft, Star, Truck, ShieldCheck, RefreshCcw } from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart } = useAppContext();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fallback to fetch all and find if specific endpoint is missing
        const res = await fetch(`${API_BASE}/products`);
        const data: Product[] = await res.json();
        const found = data.find(p => p._id === params.id);
        
        if (found) {
          setProduct(found);
        } else {
          // Attempt direct fetch
          const singleRes = await fetch(`${API_BASE}/products/${params.id}`);
          if (singleRes.ok) {
            setProduct(await singleRes.json());
          }
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-4">Məhsul tapılmadı</h2>
        <button onClick={() => router.push("/")} className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Əsas səhifəyə qayıt
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => item._id === product._id);

  return (
    <main className="container mx-auto px-4 md:px-8 py-8">
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} /> Geri qayıt
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Section */}
        <div className="bg-white rounded-3xl p-8 flex items-center justify-center shadow-sm relative overflow-hidden group">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Heart size={24} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-[500px] object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
              {product.categories?.[0] || 'Yeni'}
            </span>
            <div className="flex items-center text-yellow-400 gap-1 ml-auto">
              <Star size={16} className="fill-current" />
              <Star size={16} className="fill-current" />
              <Star size={16} className="fill-current" />
              <Star size={16} className="fill-current" />
              <Star size={16} className="text-gray-300" />
              <span className="text-gray-400 text-sm ml-1">(4.0)</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{product.title}</h1>
          <p className="text-3xl text-primary font-bold mb-8">{product.price.toFixed(2)} AZN</p>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            {product.description || "Bu məhsul üçün ətraflı təsvir hələ əlavə edilməyib. Yüksək keyfiyyət və münasib qiyməti ilə fərqlənən bu məhsulu indi sifariş edə bilərsiniz."}
          </p>

          <div className="flex gap-4 mb-10">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-lg hover:shadow-primary/50"
            >
              <ShoppingBag size={24} />
              Səbətə At
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-8">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Truck size={24} />
              </div>
              <span className="font-semibold text-sm">Pulsuz Çatdırılma</span>
              <span className="text-xs text-gray-500">50 AZN-dən yuxarı</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ShieldCheck size={24} />
              </div>
              <span className="font-semibold text-sm">Zəmanətli</span>
              <span className="text-xs text-gray-500">1 İl Zəmanət</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <RefreshCcw size={24} />
              </div>
              <span className="font-semibold text-sm">Geri Qaytarma</span>
              <span className="text-xs text-gray-500">14 Gün ərzində</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
