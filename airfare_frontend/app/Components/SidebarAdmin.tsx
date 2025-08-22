"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ArrowRightLeft,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

async function handleLogout(router: any) {
  toast.success("You have been logged out!");
  Cookies.remove("access_token");
  router.push("/admin/login");
  router.refresh();
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/admin/dashboard/cities",
      label: "Manage Cities",
      icon: Building2,
    },
    {
      href: "/admin/dashboard/connections",
      label: "Manage Connections",
      icon: ArrowRightLeft,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#334155", color: "#fff" } }}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-800/80 backdrop-blur-lg border border-white/20 rounded-lg p-2 text-white hover:bg-slate-700/80 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 w-64 h-screen bg-black/30 backdrop-blur-lg border-r border-white/10 flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
      >
        <div className="flex items-center justify-center h-16 sm:h-20 border-b border-white/10 flex-shrink-0 px-4">
          <h1 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
          </h1>
        </div>

        <div className="flex flex-col flex-grow justify-between">
          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-blue-500/30 text-white font-semibold"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon size={18} className="sm:w-5 sm:h-5" />
                  <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 sm:p-4 border-t border-white/10">
            <button
              onClick={() => handleLogout(router)}
              className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-lg transition-colors duration-300 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
