import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HourlyData {
  hour: number;
  messageCount: number;
}

interface Props {
  data: HourlyData[];
  isLoading?: boolean;
}

export function PeakHoursChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-stone-100/50 rounded-2xl animate-pulse">
        <div className="w-full max-w-xs h-32 flex items-end gap-2">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex-1 bg-stone-200 rounded-t-lg" style={{ height: `${i * 20}%` }} />
            ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-stone-100/50 rounded-2xl">
        <p className="text-stone-500 font-medium">Sem dados de interação</p>
      </div>
    );
  }

  // Ensure all 24 hours are present
  const fullDayData = Array.from({ length: 24 }, (_, hour) => {
    const existing = data.find(d => d.hour === hour);
    return {
      hour,
      messageCount: existing ? existing.messageCount : 0,
      label: `${hour}h`
    };
  });

  const maxCount = Math.max(...fullDayData.map(d => d.messageCount));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={fullDayData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#78716C', fontSize: 10 }}
            interval={2}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#78716C', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar 
            dataKey="messageCount" 
            fill="#FF6B00" 
            radius={[4, 4, 0, 0]}
            barSize={30}
          >
            {fullDayData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.messageCount === maxCount && maxCount > 0 ? '#FF6B00' : '#FFB300'} 
                />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
