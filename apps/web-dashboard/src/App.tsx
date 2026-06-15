import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { EventDashboardPage } from './pages/EventDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { ProfilePage } from './pages/ProfilePage';
import { FinancesPage } from './pages/FinancesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Componente simples para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('@VibraAdmin:token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
          
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/create" element={<CreateEventPage />} />
            <Route path="/events/:id/edit" element={<CreateEventPage />} />
            <Route path="/events/:id/dashboard" element={<EventDashboardPage />} />
            <Route path="/events/:id/community" element={<CommunitiesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/finances" element={<FinancesPage />} />
            <Route path="/community" element={<Navigate to="/events" replace />} />
            <Route path="/analytics" element={<div className="p-10 text-stone-500 text-lg font-bold">Advanced Analytics Coming Soon</div>} />
          </Route>
          
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
