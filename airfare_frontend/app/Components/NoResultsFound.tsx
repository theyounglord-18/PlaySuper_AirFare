import { SearchX } from "lucide-react";
import React from "react";

const NoResultsFound = () => (
  // The container uses the same dark, glassmorphism style for consistency.
  <div className="text-center mt-10 p-8 bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 animate-fade-in-up">
    {/* The icon color is updated to fit the new theme. Amber provides a good "warning" or "notice" feel. */}
    <SearchX className="mx-auto h-16 w-16 text-amber-500 mb-4" />

    {/* Text colors are changed to white and slate for high contrast and readability. */}
    <h2 className="text-2xl font-bold text-white">No Direct Flights Found</h2>
    <p className="text-slate-400 mt-2">
      We couldn't find any direct connections for this route. Please try a
      different city combination.
    </p>
  </div>
);

export default NoResultsFound;
