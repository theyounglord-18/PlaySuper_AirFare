"use client";
import Link from "next/link";
import { PlaneTakeoff, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="mt-2 sm:mt-4 bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl">
          <nav className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl font-bold text-white transition-transform hover:scale-105 z-50"
              onClick={closeMenu}
            >
              <PlaneTakeoff className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              <span>FlyRoute</span>
            </Link>

            <div className="hidden md:flex items-center gap-4 lg:gap-8 text-sm lg:text-lg font-medium">
              <Link
                href="#find-flight"
                className="text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Find Connection
              </Link>
              <Link
                href="#contact"
                className="text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Contact Us
              </Link>
              <Link
                href="/admin/login"
                className="text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Admin
              </Link>
            </div>

            <button
              onClick={toggleMenu}
              className="md:hidden text-white hover:text-blue-400 transition-colors p-2 z-50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>

          {isMenuOpen && (
            <div className="md:hidden absolute top-0 left-0 w-full bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl">
              <div className="flex flex-col pt-20 pb-6 px-6 space-y-6">
                <Link
                  href="#find-flight"
                  className="text-slate-300 hover:text-white transition-colors text-lg font-medium py-2 border-b border-slate-700/50"
                  onClick={closeMenu}
                >
                  Find Connection
                </Link>
                <Link
                  href="#contact"
                  className="text-slate-300 hover:text-white transition-colors text-lg font-medium py-2 border-b border-slate-700/50"
                  onClick={closeMenu}
                >
                  Contact Us
                </Link>
                <Link
                  href="/admin/login"
                  className="text-slate-300 hover:text-white transition-colors text-lg font-medium py-2"
                  onClick={closeMenu}
                >
                  Admin
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
