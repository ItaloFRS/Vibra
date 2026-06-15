import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Calendar, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  BarChart2, 
  Edit3, 
  MoreVertical 
} from 'lucide-react';

const EventCard = ({ event }: any) => {
  const navigate = useNavigate();
  const isSoldOut = event.soldPercentage >= 100;
  
  return (
    <div className="group relative flex flex-col bg-stone-900 rounded-xl overflow-hidden hover:translate-y-[-8px] transition-all duration-500 shadow-2xl shadow-black/40">
      {/* ... previous code ... */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={event.thumbnailUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent"></div>
        
        <div className={`absolute top-4 right-4 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 
          ${isSoldOut ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isSoldOut ? 'bg-orange-500' : 'bg-emerald-500 animate-pulse'}`}></span>
          {isSoldOut ? 'Sold Out' : 'Vendas Abertas'}
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-stone-100 leading-tight group-hover:text-primary-container transition-colors cursor-pointer" onClick={() => navigate(`/events/${event.id}/dashboard`)}>
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-stone-400 text-[11px] font-bold uppercase tracking-wider overflow-hidden">
            <div className="flex items-center gap-1 flex-shrink-0">
              <Calendar size={12} className="text-primary-container" />
              {new Date(event.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </div>
            <span className="text-stone-800 flex-shrink-0">•</span>
            <div className="flex items-center gap-1 min-w-0">
              <MapPin size={12} className="text-primary-container flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500 font-medium">Progresso de Vendas</span>
            <span className="text-primary-container font-bold">{event.soldPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pulse-gradient rounded-full transition-all duration-1000" 
              style={{ width: `${event.soldPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img 
                key={i}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.id + i}`} 
                className="w-8 h-8 rounded-full border-2 border-stone-900 bg-stone-800"
                alt="Participant"
              />
            ))}
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-400 border-2 border-stone-900">+1.2k</div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/events/${event.id}/dashboard`)}
              className="p-2 hover:bg-stone-800 rounded-full text-stone-400 transition-colors"
            >
              <BarChart2 size={20} />
            </button>
            <button 
              onClick={() => navigate(`/events/${event.id}/edit`)}
              className="p-2 hover:bg-stone-800 rounded-full text-stone-400 transition-colors"
            >
              <Edit3 size={20} />
            </button>
            <button className="p-2 hover:bg-stone-800 rounded-full text-stone-400 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EventsPage = () => {
  const navigate = useNavigate();
  // ... rest of the component ...
  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const response = await api.get('/events/producer');
      return response.data.map((e: any) => ({ ...e, soldPercentage: Math.floor(Math.random() * 100) }));
    }
  });

  return (
    <div className="space-y-12">
      {/* ... previous header and tabs code ... */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-stone-500 text-sm font-medium">
            <span>Produtor</span>
            <span className="text-stone-700">/</span>
            <span className="text-primary-container">Meus Eventos</span>
          </nav>
          <h2 className="text-[3.5rem] font-extrabold tracking-tight leading-[0.9] text-stone-100">
            Meus <span className="text-transparent bg-clip-text bg-pulse-gradient">Eventos</span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-primary-container transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Filtrar eventos..." 
              className="bg-stone-900 border-none rounded-full py-4 pl-12 pr-6 w-72 text-stone-200 focus:ring-2 focus:ring-primary-container placeholder:text-stone-600 transition-all"
            />
          </div>
          <button className="bg-stone-900 hover:bg-stone-800 text-stone-100 px-6 py-4 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95">
            <SlidersHorizontal size={20} />
            Filtros
          </button>
        </div>
      </header>

      <div className="flex items-center gap-8 border-b border-stone-800/50 pb-px">
        {['Todos', 'Ativos', 'Passados', 'Rascunhos'].map((tab, i) => (
          <button 
            key={tab}
            className={`pb-4 px-2 font-bold transition-all ${i === 0 ? 'text-primary-container border-b-2 border-primary-container' : 'text-stone-500 hover:text-stone-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div 
          onClick={() => navigate('/events/create')}
          className="group relative flex flex-col justify-center items-center bg-stone-900/30 border-2 border-dashed border-stone-800 rounded-xl min-h-[500px] hover:border-primary-container/50 hover:bg-stone-900/50 transition-all duration-500 cursor-pointer"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-pulse-gradient flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
              <Plus className="text-on-background" size={40} />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-stone-100">Criar Novo Evento</p>
              <p className="text-sm text-stone-500 max-w-[200px]">Comece a planejar sua próxima grande produção.</p>
            </div>
          </div>
        </div>

        {!isLoading && events?.map((event: any) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
