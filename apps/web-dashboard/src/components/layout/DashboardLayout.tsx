import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <Sidebar />
      
      <div className="flex-1 ml-72">
        <Topbar />
        
        <main className="pt-24 px-10 pb-12 h-screen overflow-y-auto no-scrollbar">
          {/* O Outlet renderiza a página atual da rota */}
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
