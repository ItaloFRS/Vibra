import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { adminService, analyticsService } from '../services/api';
import { 
  ChevronLeft, 
  TrendingUp, 
  Heart,
  Calendar,
  MapPin,
  Share2,
  ExternalLink,
  Clock,
  ArrowRight,
  Loader2,
  Edit3,
  X,
  Save,
  PowerOff,
  Users,
  UserCheck,
  MousePointer2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { StatCard } from '../components/analytics/StatCard';
import { GenderDistributionChart } from '../components/analytics/GenderDistributionChart';
import { PeakHoursChart } from '../components/analytics/PeakHoursChart';

export const EventDashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [isEditModalOpen, setIsModalOpen] = useState(false);
  
  // Edit Form States
  const [editPrice, setEditPrice] = useState('');
  const [editCapacity, setEditCapacity] = useState('');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['event-stats', id],
    queryFn: () => adminService.getEventStats(id as string),
    enabled: !!id,
    refetchInterval: 10000
  });

  const { data: demographics, isLoading: isLoadingDemo, error: errorDemo } = useQuery({
    queryKey: ['event-demographics', id],
    queryFn: () => analyticsService.getDemographics(id as string),
    enabled: !!id
  });

  const { data: interactions, isLoading: isLoadingInteractions, error: errorInteractions } = useQuery({
    queryKey: ['event-interactions', id],
    queryFn: () => analyticsService.getInteractions(id as string),
    enabled: !!id
  });

  const { data: conversions, isLoading: isLoadingConversions, error: errorConversions } = useQuery({
    queryKey: ['event-conversions', id],
    queryFn: () => analyticsService.getConversions(id as string),
    enabled: !!id
  });

  if (errorDemo || errorInteractions || errorConversions) {
    console.error("Analytics fetch failed:", { errorDemo, errorInteractions, errorConversions });
  }

  const updateBatchMutation = useMutation({
    mutationFn: async (data: { price?: number, capacity?: number, endDate?: string }) => {
      const batchId = selectedBatch?.id;
      if (!batchId) throw new Error("No batch selected");
      await api.patch(`/events/batches/${batchId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-stats', id] });
      setIsModalOpen(false);
      alert('Operação realizada com sucesso!');
    },
    onError: (err: any) => {
      console.error(err);
      alert('Erro na operação. Verifique as permissões.');
    }
  });

  const handleOpenEdit = (batch: any) => {
    setSelectedBatch(batch);
    setEditPrice(''); // Idealmente o backend retornaria o preço atual
    setEditCapacity(batch.capacity.toString());
    setIsModalOpen(true);
  };

  const handleFinishBatch = (batch: any) => {
    if (window.confirm(`Deseja realmente encerrar o lote "${batch.batchName}"?`)) {
      setSelectedBatch(batch);
      updateBatchMutation.mutate({ endDate: new Date().toISOString() });
    }
  };

  const eventDate = stats?.eventDate ? new Date(stats.eventDate) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '---';
  const formattedTime = eventDate ? eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : '---';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary-container" size={48} />
      </div>
    );
  }

  const COLORS = ['#954400', '#FB8B3F', '#644e9d', '#8B5CF6'];

  return (
    <div className="space-y-10 pb-32">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-stone-500 hover:text-on-background transition-colors font-bold text-sm group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para Meus Eventos
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-[3.5rem] font-extrabold tracking-tighter leading-none text-on-background">
              {stats?.eventTitle}
            </h1>
            <div className="bg-primary-container/10 text-primary-container px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary-container/20 animate-pulse">
              Live Data
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-stone-400 font-bold text-sm uppercase tracking-wider">
            <div className="flex items-center gap-2"><Calendar size={18} className="text-primary-container" /> {formattedDate}</div>
            <div className="flex items-center gap-2"><Clock size={18} className="text-primary-container" /> Início: {formattedTime}</div>
            <div className="flex items-center gap-2"><MapPin size={18} className="text-primary-container" /> {stats?.location || 'Local não definido'}</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="bg-stone-900 text-stone-100 px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-stone-800 transition-all border border-stone-800 active:scale-95 text-sm">
            <ExternalLink size={18} />
            Página Pública
          </button>
          <button 
            onClick={() => navigate(`/events/${id}/edit`)}
            className="bg-pulse-gradient text-on-background px-10 py-4 rounded-full font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm"
          >
            Editar Evento
          </button>
        </div>
      </header>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-stone-900 p-8 rounded-[2rem] border border-stone-800/50">
          <p className="text-stone-500 text-xs font-black uppercase tracking-widest mb-2">Receita Total</p>
          <h3 className="text-4xl font-black text-on-background">R$ {stats?.revenue ? stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</h3>
        </div>
        <div className="bg-stone-900 p-8 rounded-[2rem] border border-stone-800/50">
          <p className="text-stone-500 text-xs font-black uppercase tracking-widest mb-2">Vendas</p>
          <h3 className="text-4xl font-black text-on-background">{stats?.soldTickets} <span className="text-stone-600 text-xl font-bold">/ {stats?.totalTickets}</span></h3>
        </div>
        <div className="bg-stone-900 p-8 rounded-[2rem] border border-stone-800/50">
          <p className="text-stone-500 text-xs font-black uppercase tracking-widest mb-2">Vibra Matches</p>
          <h3 className="text-4xl font-black text-primary-container">{stats?.matchesCount || 0}</h3>
        </div>
        <div className="bg-stone-900 p-8 rounded-[2rem] border border-stone-800/50">
          <p className="text-stone-500 text-xs font-black uppercase tracking-widest mb-2">Conversão</p>
          <h3 className="text-4xl font-black text-on-background">{stats?.conversionRate ? stats.conversionRate.toFixed(1) : 0}%</h3>
        </div>
      </div>

      {/* Ticket Batches - Full Width */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black tracking-tighter ml-2">Ticket <span className="text-primary-container">Batches</span></h2>
        <div className="space-y-4">
          {stats?.salesByBatch?.map((batch: any, index: number) => {
            const now = new Date();
            const start = batch.startDate ? new Date(batch.startDate) : null;
            const end = batch.endDate ? new Date(batch.endDate) : null;
            let status = "Scheduled";
            let isActive = false;
            if (start && end) {
              if (now >= start && now <= end) { status = "Active"; isActive = true; }
              else if (now > end) { status = "Finished"; }
            }
            const [typeName, batchName] = batch.batchName.split(" - ");

            return (
              <div key={index} className={`bg-stone-900/40 p-6 px-10 rounded-[2rem] border border-stone-800/50 flex flex-col md:flex-row items-center gap-8 transition-all duration-500 ${!isActive ? 'opacity-40 grayscale-[0.5]' : 'ring-2 ring-primary-container/20 shadow-2xl shadow-primary-container/5'}`}>
                <div className="w-full md:w-1/4">
                  <span className="text-[10px] font-black text-primary-container uppercase tracking-widest bg-primary-container/10 px-2 py-0.5 rounded mb-2 inline-block">{typeName}</span>
                  <h4 className="font-black text-xl text-on-background">{batchName}</h4>
                  <p className="text-[10px] font-bold text-stone-500 mt-1">{start?.toLocaleDateString('pt-BR')} - {end?.toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div className="flex-1 w-full space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-stone-500 mb-1">
                    <span>Vendas</span>
                    <span className={isActive ? "text-primary-container" : "text-on-background"}>{batch.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-stone-800/50 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div className={`h-full rounded-full transition-all duration-1000 ease-out ${isActive ? 'bg-pulse-gradient shadow-[0_0_15px_rgba(251,139,63,0.3)]' : 'bg-stone-700'}`} style={{ width: `${batch.percentage}%` }} />
                  </div>
                </div>

                <div className="w-full md:w-1/3 flex justify-end items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Vendido</p>
                    <p className="font-black text-on-background text-lg">{batch.sold} <span className="text-stone-600 text-sm">/ {batch.capacity}</span></p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Status</p>
                    <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-stone-600'}`}>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEdit(batch)}
                      className="p-4 rounded-full bg-stone-800 text-stone-400 hover:text-primary-container hover:bg-stone-700 transition-all active:scale-90"
                      title="Editar Lote"
                    >
                      <Edit3 size={18} />
                    </button>
                    {isActive && (
                      <button 
                        onClick={() => handleFinishBatch(batch)}
                        className="p-4 rounded-full bg-stone-800 text-stone-400 hover:text-red-500 hover:bg-stone-700 transition-all active:scale-90"
                        title="Encerrar Lote Agora"
                      >
                        <PowerOff size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-[500px] bg-stone-900 border border-stone-800 p-10 rounded-[3rem] shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">Edit <span className="text-primary-container">Batch</span></h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Preço do Ingresso (R$)</label>
                <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full bg-stone-950 border-none rounded-2xl p-4 text-on-background text-2xl font-black focus:ring-2 focus:ring-primary-container" placeholder="Ex: 150.00" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Capacidade Total</label>
                <input type="number" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} className="w-full bg-stone-950 border-none rounded-2xl p-4 text-on-background text-2xl font-black focus:ring-2 focus:ring-primary-container" />
              </div>
            </div>
            <button 
              onClick={() => updateBatchMutation.mutate({ price: parseFloat(editPrice) || undefined, capacity: parseInt(editCapacity) || undefined })}
              disabled={updateBatchMutation.isPending}
              className="w-full bg-pulse-gradient py-5 rounded-2xl text-on-background font-black shadow-xl shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {updateBatchMutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

      {/* Analytics & Insights Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black tracking-tighter ml-2 uppercase">Analytics & <span className="text-primary-container">Insights</span></h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Demographics Bento */}
          <div className="lg:col-span-4 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <StatCard 
                label="Média de Idade" 
                value={`${demographics?.averageAge?.toFixed(1) || '0.0'} anos`} 
                icon={<Users size={20} />}
                isLoading={isLoadingDemo}
              />
              <StatCard 
                label="Usuários Atingidos" 
                value={conversions?.usersReached || 0} 
                icon={<UserCheck size={20} />}
                isLoading={isLoadingConversions}
              />
            </div>
            
            <div className="bg-stone-900/40 p-8 rounded-[2.5rem] border border-stone-800/50">
              <p className="text-stone-500 text-xs font-black uppercase tracking-widest mb-6">Distribuição por Gênero</p>
              <GenderDistributionChart 
                data={demographics?.genderDistribution || []} 
                isLoading={isLoadingDemo} 
              />
            </div>
          </div>

          {/* Interactions Bento */}
          <div className="lg:col-span-8 bg-stone-900/40 p-10 rounded-[3rem] border border-stone-800/50 flex flex-col justify-between">
            <div>
              <p className="text-stone-500 text-xs font-black uppercase tracking-widest mb-2">Engajamento Temporal</p>
              <h3 className="text-3xl font-black text-on-background mb-10 tracking-tighter">Horários de <span className="text-primary-container">Pico no Chat</span></h3>
            </div>
            <PeakHoursChart 
              data={interactions?.peakHours || []} 
              isLoading={isLoadingInteractions} 
            />
          </div>
        </div>
      </section>

      {/* Bottom Layout - Bento Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-stone-900/40 p-10 rounded-[3rem] border border-stone-800/50">
          <h2 className="text-2xl font-black tracking-tighter mb-12 uppercase">Vendas por <span className="text-primary-container">Categoria</span></h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.salesByBatch}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1917" vertical={false} />
                <XAxis dataKey="batchName" axisLine={false} tickLine={false} tick={{ fill: '#57534e', fontSize: 10, fontWeight: 800 }} dy={10} />
                <Tooltip cursor={{ fill: '#1c1917', radius: 10 }} contentStyle={{ backgroundColor: '#0c0a09', border: '1px solid #292524', borderRadius: '1.5rem' }} />
                <Bar dataKey="sold" radius={[10, 10, 0, 0]} barSize={40}>
                  {stats?.salesByBatch?.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div onClick={() => navigate(`/events/${id}/community`)} className="lg:col-span-4 bg-primary-container p-10 rounded-[3rem] text-background flex flex-col justify-between min-h-[220px] shadow-2xl shadow-primary-container/20 group cursor-pointer active:scale-95 transition-all">
           <div className="flex justify-between items-start">
              <Heart size={32} fill="currentColor" />
              <ArrowRight size={24} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
           </div>
           <div>
              <p className="text-2xl font-black leading-none mb-2 text-background">Moderation Hub</p>
              <p className="text-background/70 text-sm font-bold leading-tight">Acesse o pulso da sua comunidade.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
