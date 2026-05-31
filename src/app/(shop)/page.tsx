"use client";

import { useState, useEffect } from "react";
import { Product, Category } from "../components/types";
import HeroBanner from "../components/HeroBanner";
import CategoryList from "../components/CategoryList";
import ProductGrid from "../components/ProductGrid";
import { useAppContext, API_BASE } from "../context/AppContext";

export default function Home() {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`)
        ]);
        setProducts(await prodRes.json());
        setCategories(await catRes.json());
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="container mx-auto px-4 md:px-8 mt-8">
      <HeroBanner />
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <ProductGrid
        products={products}
        selectedCategory={selectedCategory}
        loading={loading}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        addToCart={addToCart}
      />
    </main>
  );
}
