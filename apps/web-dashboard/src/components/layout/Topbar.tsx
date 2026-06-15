import { Search, Bell, Settings } from 'lucide-react';

export const Topbar = () => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-288px)] z-40 bg-background/60 backdrop-blur-xl flex justify-between items-center px-10 py-4 shadow-xl shadow-stone-950/20">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search events, analytics or matches..." 
            className="w-full bg-stone-900/50 border-none rounded-full pl-12 pr-6 py-2.5 text-sm focus:ring-2 focus:ring-primary-container transition-all text-on-background placeholder-stone-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-stone-500 hover:text-primary-container transition-colors">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary-container rounded-full"></span>
        </button>
        
        <button className="text-stone-500 hover:text-primary-container transition-colors">
          <Settings size={22} />
        </button>

        <div className="h-10 w-[1px] bg-stone-800 mx-2"></div>

        <div className="flex items-center gap-3">
          <img 
            src="https://api.dicebear.com/7.x/identicon/svg?seed=Pulse" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover bg-stone-800"
          />
          <span className="text-sm font-bold text-stone-300">The Living Pulse</span>
        </div>
      </div>
    </header>
  );
};
