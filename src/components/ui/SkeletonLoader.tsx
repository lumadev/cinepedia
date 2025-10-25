"use client";

import React from "react";

interface SkeletonLoaderProps {
  count?: number;
}

export const SkeletonLoader = ({ count = 10 }: SkeletonLoaderProps) => {
  const skeletons = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className="relative group card shadow-md rounded-md overflow-hidden animate-pulse w-full opacity-80"
          style={{ backgroundColor: "var(--background)" }}
        >
          {/* Imagem */}
          <figure>
            <div className="h-88 w-full bg-gray-600 rounded-t-md"></div>
          </figure>

          {/* Corpo do card */}
          <div className="card-body p-3 space-y-2">
            <div className="h-4 bg-gray-500 rounded w-3/4"></div>
            <div className="h-3 bg-gray-500 rounded w-1/2"></div>
            <div className="h-3 bg-gray-500 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
