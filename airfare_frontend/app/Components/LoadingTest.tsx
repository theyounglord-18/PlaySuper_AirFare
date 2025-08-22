import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingTest = () => {
  return (
    // The main container matches the page's structure.
    // The 'animate-fade-in-up' provides a smooth entrance for the skeleton itself.
    <div className="animate-fade-in-up">
      {/* The SkeletonTheme is updated with dark colors for a consistent look. */}
      <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
        {/* Skeleton for the page header */}
        <div className="flex justify-between items-center mb-8">
          {/* Mimics the large "Manage Cities" heading */}
          <h1 className="text-4xl font-bold">
            <Skeleton width={280} height={40} />
          </h1>
          {/* Mimics the "Add City" button */}
          <Skeleton width={140} height={48} borderRadius={12} />
        </div>

        {/* The grid layout matches the real content's grid. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* We generate 8 skeleton cards to give a sense of a full page loading. */}
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              // This container uses the *exact* same glassmorphism classes as the real city card.
              // This ensures a smooth visual transition when the actual data loads.
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg flex flex-col"
            >
              {/* Skeleton for the city image */}
              <Skeleton
                height={192}
                className="w-full !rounded-t-xl !rounded-b-none"
              />

              <div className="p-4 flex flex-col flex-grow justify-between">
                {/* Skeleton for the city name */}
                <Skeleton width={`60%`} height={24} className="mb-4" />

                {/* Skeletons for the Edit and Delete icon buttons */}
                <div className="flex justify-end space-x-2 mt-auto">
                  <Skeleton width={32} height={32} circle />
                  <Skeleton width={32} height={32} circle />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default LoadingTest;
