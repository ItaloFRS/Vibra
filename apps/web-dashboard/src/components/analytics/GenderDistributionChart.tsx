import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataPoint {
  label: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  isLoading?: boolean;
}

const COLORS = ['#FF6B00', '#FFB300', '#2B2B2B', '#E7E5E4'];

export function GenderDistributionChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-stone-100/50 rounded-2xl animate-pulse">
        <div className="w-20 h-20 rounded-full border-4 border-stone-200 border-t-primary" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-stone-100/50 rounded-2xl">
        <p className="text-stone-500 font-medium">Sem dados demográficos</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="label"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
