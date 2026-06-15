import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  Ticket, 
  Wallet, 
  Users, 
  BarChart3, 
  PlusCircle, 
  HelpCircle, 
  LogOut,
  User as UserIcon
} from 'lucide-react';
import api from '../../services/api';

export const Sidebar = () => {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data;
    }
  });

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Ticket, label: 'Events', path: '/events' },
    { icon: Wallet, label: 'Finances', path: '/finances' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('@VibraAdmin:token');
    localStorage.removeItem('@VibraAdmin:user');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-72 z-50 bg-stone-900 flex flex-col py-8 px-4 font-bold text-sm rounded-r-xl lg:rounded-r-[3rem] shadow-2xl">
      <div className="text-xl font-black text-primary-container mb-8 px-5 tracking-tighter">
        VIBRA <span className="text-on-background/50">BUSINESS</span>
      </div>

      <div 
        onClick={() => navigate('/profile')}
        className="flex items-center gap-4 px-5 mb-10 group cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="w-12 h-12 rounded-full border-2 border-primary-container/30 overflow-hidden bg-stone-800 flex items-center justify-center shrink-0">
          {user?.profilePhotoUrl ? (
            <img 
              src={user.profilePhotoUrl} 
              alt={user.businessName || 'Producer'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon size={24} className="text-stone-600" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-on-background font-bold block truncate">
            {user?.businessName || user?.fullName || 'Elite Producer'}
          </p>
          <p className="text-stone-500 text-[10px] uppercase tracking-widest truncate">
            {user?.businessName ? user.fullName : 'Partner'}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-300
              ${isActive 
                ? 'bg-primary-container text-background shadow-lg shadow-primary-container/20 translate-x-2' 
                : 'text-stone-400 hover:bg-stone-800 hover:text-on-background'}
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2 pt-6">
        <NavLink 
          to="/events/create" 
          className="w-full bg-pulse-gradient text-on-background font-bold py-4 rounded-full shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 mb-6"
        >
          <PlusCircle size={20} />
          Create Event
        </NavLink>

        <NavLink to="/support" className="flex items-center gap-4 text-stone-500 hover:text-primary-container px-6 py-3 transition-all">
          <HelpCircle size={20} />
          <span>Support</span>
        </NavLink>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 text-stone-500 hover:text-red-400 px-6 py-3 transition-all mt-2 cursor-pointer"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
