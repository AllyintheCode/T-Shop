"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { X, Search, User, Heart, ShoppingBag, LogOut } from "lucide-react";

interface MobileMenuOverlayProps {
  user: { name: string; isAdmin: boolean } | null;
  handleLogout: () => void;
  onClose: () => void;
}

export default function MobileMenuOverlay({ user, handleLogout, onClose }: MobileMenuOverlayProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed inset-0 z-[60] bg-card h-full flex flex-col"
    >
      <div className="p-6 flex justify-between items-center border-b border-border">
        <span className="font-black text-2xl text-primary tracking-tighter">T-Shop Menu</span>
        <button onClick={onClose} className="p-2 text-foreground hover:bg-primary/10 rounded-full transition-all"><X size={24} /></button>
      </div>
      <div className="p-6 flex flex-col gap-8 flex-1">
        <div className="flex items-center bg-background border border-border rounded-xl px-4 py-4 gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Hər şeyi mən taparam..." className="bg-transparent border-none text-foreground w-full outline-none font-bold" />
        </div>

        {user ? (
          <div className="space-y-8 flex-1">
            <div className="bg-background rounded-2xl p-6 border border-border flex items-center gap-4">
              <div className="bg-primary/20 p-4 rounded-2xl text-primary shadow-lg shadow-primary/10"><User size={32} /></div>
              <div>
                <p className="font-black text-xl leading-none mb-1">{user.name}</p>
                {user.isAdmin && <Link href="/admin" className="text-xs text-primary font-black uppercase tracking-widest" onClick={onClose}>Admin Panel</Link>}
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 font-bold transition-all text-foreground"><Heart size={20} /> İstək Siyahım</button>
              <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 font-bold transition-all text-foreground"><ShoppingBag size={20} /> Sifarişlərim</button>
              <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 font-bold transition-all text-foreground text-red-500 mt-4" onClick={handleLogout}><LogOut size={20} /> Çıxış Et</button>
            </nav>
          </div>
        ) : (
          <div className="mt-auto space-y-4">
            <Link href="/auth/login" className="w-full text-center py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest no-underline flex items-center justify-center hover:bg-primary-dark shadow-xl shadow-primary/20" onClick={onClose}>Giriş Et</Link>
            <p className="text-center text-xs text-gray-500">Hələ də qeydiyyatdan keçməmisən? <Link href="/auth/register" className="text-primary font-bold">Qoşul!</Link></p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
