"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, ShieldAlert, ShieldCheck } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          token: `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if(res.ok) {
        setUsers(data);
      } else {
        setError(data.message || "Təstiqdən keçə bilmədik. Admin olduğunuza əmin olun.");
      }
    } catch(err) {
      setError("Serverlə əlaqə qurmaq mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          token: `Bearer ${token}`
        }
      });
      
      if(res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, isAdmin: !u.isAdmin } : u));
      } else {
        alert("Yetkiniz yoxdur!");
      }
    } catch(err) {
      alert("Xəta baş verdi.");
    }
  };

  return (
    <main className="flex-1 p-8 lg:px-12 flex flex-col gap-8">
      {/* Top Bar */}
      <header className="flex justify-between items-center pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold text-foreground">Müştərilərin İdarəetməsi</h1>
        <div className="flex items-center gap-4">
          <Bell size={20} className="text-gray-400 cursor-pointer hover:text-primary transition-colors" />
          <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">A</div>
          <div>
            <p className="font-semibold text-sm text-foreground">Admin User</p>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>
        </div>
      </header>

      {/* Users Table */}
      <motion.div
        className="bg-card border border-border rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-6">Sistemdəki Bütün İstifadəçilər</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Yüklənir...</span>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-8">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 font-semibold text-sm uppercase border-b border-border">Ad & Soyad</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-semibold text-sm uppercase border-b border-border">E-poçt</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-semibold text-sm uppercase border-b border-border">Qeydiyyat Tarixi</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-semibold text-sm uppercase border-b border-border">Rol</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-semibold text-sm uppercase border-b border-border">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 text-foreground font-medium border-b border-border">{user.name}</td>
                    <td className="px-4 py-4 text-foreground border-b border-border">{user.email}</td>
                    <td className="px-4 py-4 text-foreground border-b border-border">{new Date(user.createdAt).toLocaleDateString("az-AZ")}</td>
                    <td className="px-4 py-4 border-b border-border">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isAdmin
                          ? "bg-primary/10 text-primary"
                          : "bg-gray-400/10 text-gray-400"
                      }`}>
                        {user.isAdmin ? "Admin" : "Aktiv Alıcı"}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-border">
                      <button 
                        onClick={() => toggleRole(user._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5 ${
                          user.isAdmin
                            ? "bg-card border border-border text-foreground hover:border-red-400 hover:text-red-400"
                            : "bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20"
                        }`}
                      >
                        {user.isAdmin ? <><ShieldAlert size={16} /> Yetkini Al</> : <><ShieldCheck size={16} /> Admin Et</>}
                      </button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">Heç bir istifadəçi tapılmadı.</td>
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
