"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "../../components/types";
import ProductGrid from "../../components/ProductGrid";
import { useAppContext, API_BASE } from "../../context/AppContext";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { wishlist, toggleWishlist, addToCart } = useAppContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/products`);
        const allProducts: Product[] = await res.json();
        
        const filtered = allProducts.filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase()) || 
          (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
        );
        
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to fetch search results", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 md:px-8 mt-8">
      <h2 className="text-3xl font-black mb-8">
        "{query}" üçün axtarış nəticələri
      </h2>
      <ProductGrid 
        products={products}
        selectedCategory={null}
        loading={loading}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        addToCart={addToCart}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Yüklənir...</div>}>
      <SearchContent />
    </Suspense>
  );
}
