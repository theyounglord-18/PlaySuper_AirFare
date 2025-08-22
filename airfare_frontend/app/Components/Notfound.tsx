"use client";

import Link from "next/link";
import { Home } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    // Main container with the signature dark gradient background.
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4 overflow-hidden">
      <div className="text-center animate-fade-in-up">
        {/* Interactive SVG Illustration: A stylized representation of a lost signal or broken flight path. */}
        <div className="relative w-64 h-64 mx-auto mb-8 group">
          {/* Static background elements */}
          <div className="absolute inset-0 border-2 border-slate-700 rounded-full opacity-50"></div>
          <div className="absolute inset-4 border border-slate-800 rounded-full opacity-50"></div>

          {/* Animated scanning line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-blue-400/30 animate-[spin_8s_linear_infinite]">
            <div className="w-16 h-px bg-blue-400"></div>
          </div>

          {/* Central "404" text with pulsing effect on hover */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-8xl font-black text-slate-700 group-hover:text-blue-500 transition-colors duration-300">
              404
            </h1>
          </div>

          {/* Floating decorative nodes */}
          <div className="absolute top-8 left-8 w-3 h-3 bg-slate-600 rounded-full group-hover:bg-blue-500 transition-all duration-300 animate-[pulse_4s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-12 right-4 w-4 h-4 bg-slate-600 rounded-full group-hover:bg-blue-500 transition-all duration-300 animate-[pulse_5s_ease-in-out_infinite]"></div>
        </div>

        <h2 className="text-4xl font-bold text-white mb-2">Connection Lost</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
          It seems you've navigated to an unknown sector. The page you're
          looking for is off the grid.
        </p>

        {/* Themed "Return Home" button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 transform hover:-translate-y-1"
        >
          <Home size={20} />
          Return to Base
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
