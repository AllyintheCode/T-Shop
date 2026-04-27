"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-br from-card to-gray-800/20 border border-border rounded-3xl p-8 md:p-20 min-h-[400px] flex items-center mb-12 shadow-2xl group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute -top-1/2 -right-[15%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary opacity-20 rounded-full blur-[100px] group-hover:opacity-30 transition-opacity duration-700"></div>
      <div className="absolute -bottom-1/2 -left-[10%] w-[300px] h-[300px] bg-blue-500 opacity-10 rounded-full blur-[80px]"></div>

      <div className="relative z-10 max-w-2xl text-left">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <span className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 inline-block border border-primary/20 shadow-lg">New Season 2026</span>
          <h1 className="text-4xl md:text-7xl font-black leading-[0.9] mb-6 text-foreground tracking-tighter">
            Sənin Tərzin, <br /><span className="text-primary italic">Sənin Qaydan.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-md mb-10 leading-relaxed font-semibold">T-Shop ilə gələcəyin moda dünyasını kəşf etməyə hazır ol.</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-white font-black py-4 px-10 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 flex items-center gap-2 group/btn">İndi Başla <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" /></button>
            <button className="bg-card/50 backdrop-blur-md border border-border text-foreground font-bold py-4 px-10 rounded-2xl hover:bg-card transition-all">Trendləri Kəşf Et</button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
