import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { adminService } from '../services/api';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  ShieldCheck,
  Ban,
  Plus,
  ChevronLeft,
  Loader2,
  X,
  Hash
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const CommunityMetricCard = ({ title, value, growth, colorClass }: any) => (
  <div className="bg-stone-900/40 p-8 rounded-xl border border-stone-800/30 hover:border-primary-container/20 transition-all group">
    <p className="text-stone-500 text-sm font-semibold uppercase tracking-widest mb-4">{title}</p>
    <div className="flex items-end gap-3">
      <span className="text-4xl font-bold text-on-background">{value}</span>
      {growth && <span className="text-primary-container text-sm font-bold mb-1">{growth}</span>}
    </div>
    <div className="mt-4 h-1 w-full bg-stone-800 rounded-full overflow-hidden">
      <div className={`h-full ${colorClass} w-3/4 opacity-80`}></div>
    </div>
  </div>
);

export const CommunitiesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form states
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['event-stats', id],
    queryFn: () => adminService.getEventStats(id as string),
    enabled: !!id
  });

  const { data: channels, isLoading: isLoadingChannels } = useQuery({
    queryKey: ['event-channels', id],
    queryFn: async () => {
      const response = await api.get(`/social/events/${id}/channels`);
      return response.data;
    },
    enabled: !!id
  });

  const createChannelMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/social/events/${id}/channels`, {
        name: newChannelName,
        description: newChannelDescription
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-channels', id] });
      setIsModalOpen(false);
      setNewChannelName('');
      setNewChannelDescription('');
      alert('Comunidade criada com sucesso!');
    },
    onError: () => {
      alert('Erro ao criar comunidade. Verifique os dados.');
    }
  });

  const chartData = [
    { name: '08:00', value: 40 },
    { name: '10:00', value: 60 },
    { name: '12:00', value: 30 },
    { name: '14:00', value: 80 },
    { name: '16:00', value: 95, highlight: true },
    { name: '18:00', value: 50 },
    { name: '20:00', value: 45 },
    { name: '22:00', value: 70 },
  ];

  if (isLoadingStats || isLoadingChannels) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary-container" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 relative">
      {/* Event Context Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-4">
          <button 
            onClick={() => navigate(`/events/${id}/dashboard`)}
            className="flex items-center gap-2 text-stone-500 hover:text-on-background transition-colors font-bold text-sm group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para Dashboard do Evento
          </button>
          <h2 className="text-5xl font-extrabold tracking-tighter text-stone-50 leading-none">
            Comunidade: <span className="text-transparent bg-clip-text bg-pulse-gradient">{stats?.eventTitle || '---'}</span>
          </h2>
          <div className="flex items-center gap-6 text-stone-500 font-bold text-xs uppercase tracking-widest">
             <div className="flex items-center gap-2"><Users size={14} className="text-primary-container" /> {stats?.interestCount || 0} Membros</div>
             <div className="flex items-center gap-2"><MessageSquare size={14} className="text-primary-container" /> {stats?.messagesCount || 0} Mensagens</div>
          </div>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CommunityMetricCard title="Membros Ativos" value={stats?.interestCount || 0} growth="+5%" colorClass="bg-pulse-gradient" />
        <CommunityMetricCard title="Mensagens Hoje" value={stats?.messagesCount || 0} growth="Peak" colorClass="bg-primary-container" />
        <CommunityMetricCard title="Matches Ativos" value={stats?.matchesCount || 0} growth="Social" colorClass="bg-orange-400" />
        <CommunityMetricCard title="Sentimento" value="Positivo" growth="92%" colorClass="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Engagement Chart */}
        <div className="col-span-12 lg:col-span-8 bg-stone-900/30 p-8 rounded-xl border border-stone-800/20">
          <h3 className="text-2xl font-bold mb-10">Atividade Social (24h)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.highlight ? '#fb8b3f' : '#292524'} />
                  ))}
                </Bar>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#57534e', fontSize: 10, fontWeight: 800 }} dy={10} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#0c0a09', border: '1px solid #292524', borderRadius: '0.5rem' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="col-span-12 lg:col-span-4 bg-orange-600/10 p-8 rounded-xl border border-orange-900/20 flex flex-col">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-primary-container" size={24} />
            Trending Topics
          </h3>
          <div className="flex flex-wrap gap-3">
            {['#Transporte', '#Ingressos VIP', '#Lineup', '#Carona'].map((topic, i) => (
              <span key={topic} className={`px-6 py-3 rounded-full text-sm transition-all cursor-default ${i === 1 ? 'bg-primary-container text-background font-black' : 'bg-stone-950 text-stone-200 font-bold border border-stone-800'}`}>
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Active Channels / Moderation */}
        <div className="col-span-12 lg:col-span-8">
          <h3 className="text-2xl font-bold mb-6 text-on-background">Canais Ativos</h3>
          <div className="bg-stone-900/20 rounded-xl overflow-hidden border border-stone-800/30">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-stone-900/50 text-stone-500 font-black uppercase tracking-widest text-[10px]">
                  <th className="px-6 py-4">Canal</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/50">
                {channels?.map((channel: any) => (
                  <tr key={channel.id} className="hover:bg-stone-800/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 font-bold text-on-background">
                        <Hash size={14} className="text-primary-container" />
                        {channel.name}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-stone-400 text-xs italic">{channel.description || 'Sem descrição'}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-primary-container font-black uppercase text-[10px] tracking-widest hover:underline">Moderation Hub</button>
                    </td>
                  </tr>
                ))}
                {(!channels || channels.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-stone-600 font-bold uppercase tracking-widest text-xs">
                      Nenhum canal criado para este evento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Moderation Log */}
        <div className="col-span-12 lg:col-span-4">
          <h3 className="text-2xl font-bold mb-6">Log de Moderação</h3>
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, title: 'Mensagem Fixada', time: '14:20', desc: 'Regras da comunidade atualizadas.', active: true },
              { icon: Ban, title: 'Usuário Banido', time: '13:05', desc: 'Conduta inadequada detectada.', active: false },
            ].map((log, i) => (
              <div key={i} className={`p-4 bg-stone-900/40 rounded-xl border-l-4 ${log.active ? 'border-primary-container' : 'border-stone-700'} flex items-start gap-4`}>
                <log.icon className={log.active ? 'text-primary-container' : 'text-stone-500'} size={18} />
                <div>
                  <p className="text-sm font-bold text-on-background">{log.title}</p>
                  <p className="text-[10px] text-stone-500">{log.time} - {log.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-pulse-gradient shadow-2xl shadow-primary-container/40 flex items-center justify-center text-background group transition-transform hover:scale-110 active:scale-95 z-50"
      >
        <Plus size={32} strokeWidth={3} />
        <div className="absolute right-20 bg-stone-900 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-stone-800 text-on-background">
          Criar Nova Comunidade
        </div>
      </button>

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-[500px] bg-stone-900 border border-stone-800 p-10 rounded-[3rem] shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black tracking-tighter uppercase">Nova <span className="text-primary-container">Comunidade</span></h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Nome do Canal</label>
                <input 
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="Ex: Área VIP, Transporte..."
                  className="w-full bg-stone-950 border-none rounded-2xl p-4 text-on-background focus:ring-2 focus:ring-primary-container"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Descrição</label>
                <textarea 
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                  placeholder="Defina o propósito desta comunidade..."
                  className="w-full bg-stone-950 border-none rounded-2xl p-4 text-stone-300 h-32 resize-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>

            <button 
              onClick={() => createChannelMutation.mutate()}
              disabled={createChannelMutation.isPending || !newChannelName}
              className="w-full bg-pulse-gradient py-5 rounded-2xl text-on-background font-black shadow-xl shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createChannelMutation.isPending ? <Loader2 className="animate-spin" /> : 'Criar Comunidade Agora'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
