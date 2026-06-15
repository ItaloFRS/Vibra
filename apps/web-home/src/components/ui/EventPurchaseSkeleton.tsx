"use client";

import { Skeleton } from "./Skeleton";

export const EventPurchaseSkeleton = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Skeleton */}
      <div className="h-[80vh] w-full bg-white/5 animate-pulse flex flex-col justify-end p-6 md:p-20">
        <Skeleton className="h-6 w-32 mb-8 rounded-full" />
        <Skeleton className="h-20 md:h-32 w-full md:w-2/3 mb-8" />
        <div className="flex gap-4">
          <Skeleton className="h-14 w-48 rounded-full" />
          <Skeleton className="h-14 w-24 rounded-xl" />
        </div>
      </div>
      
      {/* Details Skeleton */}
      <div className="max-w-[1400px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Skeleton className="h-32 w-full rounded-2xl" />
               <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 space-y-8">
          <Skeleton className="h-64 w-full rounded-[2rem]" />
          <Skeleton className="h-48 w-full rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
};
