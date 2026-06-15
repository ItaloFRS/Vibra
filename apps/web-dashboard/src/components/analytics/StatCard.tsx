import React from 'react';

interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function StatCard({ label, value, icon, isLoading }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className="text-primary">{icon}</div>}
        <p className="text-stone-500 font-semibold uppercase tracking-widest text-xs">{label}</p>
      </div>
      
      {isLoading ? (
        <div className="h-10 w-24 bg-stone-100 animate-pulse rounded-lg" />
      ) : (
        <h3 className="text-3xl font-black text-stone-900 tracking-tighter">{value}</h3>
      )}
    </div>
  );
}
