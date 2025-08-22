import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Plane } from "lucide-react";

const ResultsSkeleton = () => (
  // The main container that holds all skeleton elements, matching the layout of the real results.
  <div className="mt-10 space-y-6 animate-fade-in-up">
    {/* SkeletonTheme provides the base and highlight colors for the shimmer effect.    */}
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* We map over an array to generate multiple skeleton cards, creating a realistic loading state. */}
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            // This card uses the exact same glassmorphism classes as the real result card for a seamless transition.
            className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10"
          >
            {/* Top section: From City -> To City */}
            <div className="flex justify-between items-center mb-4">
              <Skeleton width={120} height={28} />
              <Plane className="text-slate-600" />
              <Skeleton width={120} height={28} />
            </div>

            {/* Details section: Mimics the layout for Duration and Airfare. */}
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Skeleton height={20} />
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Skeleton height={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  </div>
);

export default ResultsSkeleton;
