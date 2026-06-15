"use client";

import { Skeleton } from "./Skeleton";

export const EventCardSkeleton = () => {
  return (
    <div className="min-w-[300px] h-[170px] rounded-xl overflow-hidden border border-white/5 bg-white/5 p-4 flex flex-col justify-end">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
};
