"use client";

import { motion } from "framer-motion";
import { Category } from "./types";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
}

export default function CategoryList({ categories, selectedCategory, setSelectedCategory }: CategoryListProps) {
  if (categories.length === 0) return null;

  return (
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
  );
}
