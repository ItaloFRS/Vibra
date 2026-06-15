import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/api';
import { 
  TrendingUp, 
  Ticket, 
  Heart, 
  Share2, 
  Bolt, 
  Star 
} from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  growth, 
  icon: Icon, 
  isOrange = false, 
  growthText = "High Velocity" 
}: any) => (
  <div className={`bg-stone-900 p-8 rounded-xl relative overflow-hidden group border-b-4 ${isOrange ? 'border-primary-container' : 'border-transparent'}`}>
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <Icon size={64} />
    </div>
    <p className="text-stone-500 text-sm font-semibold uppercase tracking-widest mb-2">{title}</p>
    <h3 className={`text-4xl font-black ${isOrange ? 'text-primary-container' : 'text-on-background'}`}>{value}</h3>
    <div className={`mt-4 flex items-center gap-2 ${isOrange ? 'text-primary-container' : 'text-emerald-500'} text-sm font-bold`}>
      {isOrange ? <Bolt size={16} /> : <TrendingUp size={16} />}
      <span>{growth ? `+${growth}%` : growthText}</span>
    </div>
  </div>
);

export const DashboardPage = () => {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['admin-summary'],
    queryFn: adminService.getSummary
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-stone-900 h-40 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-[3.5rem] font-extrabold tracking-tighter leading-none text-on-background">
          Dashboard <span className="text-transparent bg-clip-text bg-pulse-gradient">Summary</span>
        </h1>
        <p className="text-stone-500 mt-4 text-lg font-medium">Welcome back, here's what's happening with your events.</p>
      </header>

      {/* Hero High Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          title="Receita Total" 
          value={`R$ ${(summary?.totalRevenue / 1000000).toFixed(1)}M`} 
          growth={summary?.revenueGrowth} 
          icon={Star} 
        />
        <MetricCard 
          title="Ingressos" 
          value={`${(summary?.totalTicketsSold / 1000).toFixed(1)}k`} 
          growth={summary?.ticketsGrowth} 
          icon={Ticket} 
        />
        <MetricCard 
          title="Matches" 
          value="8.5k" 
          isOrange 
          icon={Heart} 
        />
        <MetricCard 
          title="Engagement" 
          value={`${summary?.avgEngagementRate}%`} 
          growthText="Top Tier" 
          icon={Share2} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-stone-900/50 p-10 rounded-xl border border-stone-800/50 min-h-[400px] flex flex-col justify-center items-center">
           <BarChart3 className="text-stone-800 mb-4" size={48} />
           <p className="text-stone-600 font-bold uppercase tracking-widest text-sm">Sales Chart Coming Soon</p>
        </div>
        
        <div className="bg-stone-900/40 backdrop-blur-3xl p-8 rounded-xl border border-stone-800/50">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3">
            <Bolt className="text-primary-container" size={20} />
            Social Activity
          </h2>
          <div className="space-y-8">
            <p className="text-stone-600 text-sm italic">Real-time social feeds will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { BarChart3 } from 'lucide-react';
