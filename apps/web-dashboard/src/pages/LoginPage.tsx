import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('@VibraAdmin:token', response.data.token);
        localStorage.setItem('@VibraAdmin:user', JSON.stringify({ email: response.data.email, role: response.data.role }));
        navigate('/dashboard');
      } else {
        await api.post('/auth/register', { 
          email, 
          password, 
          fullName, 
          role: 'ROLE_PRODUCER' 
        });
        alert('Cadastro realizado com sucesso! Faça login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro na autenticação. Verifique seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs para atmosfera */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-stone-900/40 border border-stone-800/50 rounded-[3rem] overflow-hidden backdrop-blur-2xl shadow-2xl relative z-10">
        
        {/* Lado Esquerdo: Branding/Visual */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-pulse-gradient relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-on-background tracking-tighter mb-4">
              VIBRA <span className="opacity-50">STUDIO</span>
            </h2>
            <p className="text-on-background/80 font-medium max-w-[300px]">
              A plataforma definitiva para produtores que transformam eventos em comunidades.
            </p>
          </div>

          <div className="relative z-10 space-y-8">
             <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} className="w-12 h-12 rounded-full border-4 border-primary shadow-xl" />
                ))}
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-xs font-bold border-4 border-primary">+2k</div>
             </div>
             <p className="text-sm font-bold text-on-background/60 uppercase tracking-widest">Join 2,000+ elite producers</p>
          </div>
        </div>

        {/* Lado Direito: Form */}
        <div className="p-12 lg:p-20 flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-on-background tracking-tighter mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-stone-500 font-medium">
              {isLogin 
                ? 'Enter your credentials to manage your events.' 
                : 'Start your journey as a Vibra Producer today.'}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={18} />
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full bg-stone-950 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-primary-container text-stone-100 placeholder:text-stone-800"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="producer@vibra.com" 
                  className="w-full bg-stone-950 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-primary-container text-stone-100 placeholder:text-stone-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-stone-950 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-primary-container text-stone-100 placeholder:text-stone-800"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-pulse-gradient text-on-background font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-stone-500 font-bold hover:text-primary-container transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
