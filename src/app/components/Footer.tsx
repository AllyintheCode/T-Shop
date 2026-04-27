"use client";

import { ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="text-primary w-8 h-8" />
            <span className="font-black text-3xl text-primary tracking-tighter">T-Shop</span>
          </div>
          <p className="text-gray-400 font-semibold max-w-sm">Azərbaycanın ən dinamik və premium e-ticarət platforması. Biz yalnız məhsul deyil, həyat tərzi satırıq.</p>
        </div>
        <div>
          <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-foreground/50">Şirkət</h4>
          <ul className="space-y-4 font-bold text-gray-400">
            <li className="hover:text-primary cursor-pointer transition-colors">Haqqımızda</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Vakansiyalar</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
          </ul>
        </div>
        <div>
          <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-foreground/50">Dəstək</h4>
          <ul className="space-y-4 font-bold text-gray-400">
            <li className="hover:text-primary cursor-pointer transition-colors">Sual-Cavab</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Çatdırılma</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Geri qaytarma</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-8 pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">© 2026 T-Shop. Bütün hüquqlar qorunur.</p>
        <div className="flex gap-6 text-gray-500 font-bold text-xs uppercase tracking-widest">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Cookies</span>
        </div>
      </div>
    </footer>
  );
}
