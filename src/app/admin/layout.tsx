"use client";

import { ShoppingBag, LayoutDashboard, Package, Users, Settings, LogOut, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import "../globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/auth/login");
      return;
    }
    
    try {
      const user = JSON.parse(savedUser);
      if (!user.isAdmin) {
        router.push("/");
        return;
      }
      setAuthorized(true);
    } catch (e) {
      router.push("/auth/login");
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-gray-400">Giriş yoxlanılır...</p>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { href: "/admin/categories", icon: Layers, label: "Kategoriyalar", exact: true },
    { href: "/admin/products", icon: Package, label: "Məhsullar", exact: true },
    { href: "/admin/orders", icon: ShoppingBag, label: "Sifarişlər", exact: true },
    { href: "/admin/users", icon: Users, label: "Müştərilər", exact: true },
    { href: "#", icon: Settings, label: "Tənzimləmələr", exact: true },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-[80px]" : "w-[260px]"
        } bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out relative`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 z-50 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
          title={collapsed ? "Genişlət" : "Yığ"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <div className={`flex items-center gap-2 text-primary p-6 mb-4 ${collapsed ? "justify-center" : ""}`}>
          <ShoppingBag size={28} className="shrink-0" />
          {!collapsed && <span className="font-bold text-xl whitespace-nowrap">T-Shop Admin</span>}
        </div>

        {/* Nav Menu */}
        <nav className="flex flex-col gap-1 flex-1 px-3">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-200 no-underline ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-gray-400 hover:bg-primary/5 hover:text-primary"
                } ${collapsed ? "justify-center px-3" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 mt-auto">
          <Link
            href="/"
            className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 no-underline ${
              collapsed ? "justify-center px-3" : ""
            }`}
            title={collapsed ? "Sayta Qayıt" : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Sayta Qayıt</span>}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {children}
      </div>
    </div>
  );
}
