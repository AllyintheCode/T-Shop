"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";
import "../../globals.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://t-shop-backend-chi.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        if(data.user.isAdmin) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        setError(data.message || "Qeydiyyat zamanı xəta baş verdi.");
      }
    } catch (err) {
      setError("Serverlə əlaqə qurmaq mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,var(--primary)_0%,transparent_60%)] opacity-10 rounded-full blur-[60px]" />

      <motion.div
        className="bg-card border border-border rounded-2xl p-12 w-full max-w-[450px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative z-10"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-6">
          <ShoppingBag className="text-primary" size={40} />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ailəmizə Qatıl</h1>
          <p className="text-gray-400 text-[0.95rem]">Dərhal qeydiyyatdan keç və premium alış-verişə başla.</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Ad və Soyad</label>
            <input 
              type="text" 
              id="name" 
              className="w-full px-4 py-3.5 rounded-lg border border-border bg-background text-foreground font-[inherit] text-base transition-all outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">E-poçt ünvanı</label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-3.5 rounded-lg border border-border bg-background text-foreground font-[inherit] text-base transition-all outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Şifrə</label>
            <input 
              type="password" 
              id="password" 
              className="w-full px-4 py-3.5 rounded-lg border border-border bg-background text-foreground font-[inherit] text-base transition-all outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]" 
              placeholder="Ən az 8 simvol" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg text-base mt-2 flex justify-center items-center gap-2 bg-primary text-white font-semibold border-none cursor-pointer hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Yüklənir..." : "Qeydiyyatdan Keç"} <ArrowRight size={18} />
          </motion.button>
        </form>

        <div className="text-center mt-8 text-[0.95rem] text-gray-400">
          Artıq hesabınız var? 
          <Link href="/auth/login" className="text-primary font-semibold ml-2 no-underline hover:text-primary-dark transition-colors">Daxil Olun</Link>
        </div>
      </motion.div>
    </div>
  );
}
