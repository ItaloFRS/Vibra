import { useQuery } from '@tanstack/react-query';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Download,
  Search,
  Loader2,
  DollarSign,
  HelpCircle
} from 'lucide-react';
import api from '../services/api';

export const FinancesPage = () => {
  // 1. Fetch Summary
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['finances', 'summary'],
    queryFn: async () => {
      const response = await api.get('/admin/finances/summary');
      return response.data;
    }
  });

  // 2. Fetch Transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['finances', 'transactions'],
    queryFn: async () => {
      const response = await api.get('/admin/finances/transactions');
      return response.data;
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoadingSummary || isLoadingTransactions) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary-container" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] pb-20 space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-[3.5rem] font-black tracking-tighter leading-none text-on-background">
            Financial <span className="text-transparent bg-clip-text bg-pulse-gradient">Hub</span>
          </h1>
          <p className="text-stone-500 mt-4 text-lg">Gerencie seus lucros, taxas e extrato de vendas.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 border border-stone-800 text-stone-300 font-bold hover:bg-stone-800 transition-all text-sm">
          <Download size={18} />
          Exportar Relatório
        </button>
      </header>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="bg-stone-900/60 p-8 rounded-[3rem] border border-stone-800/50 space-y-4 shadow-2xl relative overflow-hidden group/card">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/card:scale-110 transition-transform">
            <Wallet size={80} />
          </div>
          <div className="flex items-center gap-3 text-stone-500">
            <div className="w-10 h-10 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary-container">
              <TrendingUp size={20} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest">Saldo Total Líquido</span>
              <div className="group/tip relative">
                <HelpCircle size={12} className="text-stone-700 cursor-help hover:text-stone-500 transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-stone-800 text-[9px] text-stone-300 rounded-xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none shadow-2xl border border-stone-700 z-50">
                  Este é o valor que você efetivamente recebe após o desconto da taxa de 10% da plataforma.
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-on-background tracking-tighter italic">
              {formatCurrency(summary?.totalBalance || 0)}
            </h2>
            <p className="text-stone-500 text-xs font-medium">Lucro real após taxas da plataforma.</p>
          </div>
        </div>

        {/* Available for Payout Card */}
        <div className="bg-emerald-500/5 p-8 rounded-[3rem] border border-emerald-500/10 space-y-4 shadow-xl relative overflow-hidden group/card">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/card:scale-110 transition-transform text-emerald-500">
            <CheckCircle2 size={80} />
          </div>
          <div className="flex items-center gap-3 text-emerald-500/70">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <ArrowUpRight size={20} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest">Disponível para Saque</span>
              <div className="group/tip relative">
                <HelpCircle size={12} className="text-emerald-900/40 cursor-help hover:text-emerald-500 transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-stone-800 text-[9px] text-stone-300 rounded-xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none shadow-2xl border border-stone-700 z-50">
                  Saldo de eventos já realizados. Você pode solicitar a transferência para sua conta bancária a qualquer momento.
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-emerald-400 tracking-tighter italic">
              {formatCurrency(summary?.availableBalance || 0)}
            </h2>
            <button className="mt-4 px-6 py-2 bg-emerald-500 text-stone-950 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              Solicitar Payout
            </button>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-stone-900/30 p-8 rounded-[3rem] border border-stone-800/30 space-y-4 relative overflow-hidden group/card opacity-80">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:scale-110 transition-transform">
            <Clock size={80} />
          </div>
          <div className="flex items-center gap-3 text-stone-600">
            <div className="w-10 h-10 rounded-2xl bg-stone-800 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest">A Receber</span>
              <div className="group/tip relative">
                <HelpCircle size={12} className="text-stone-800 cursor-help hover:text-stone-600 transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-stone-800 text-[9px] text-stone-300 rounded-xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none shadow-2xl border border-stone-700 z-50">
                  Vendas de eventos que ainda não aconteceram. O valor é liberado 48h após o encerramento do evento.
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-stone-400 tracking-tighter italic">
              {formatCurrency(summary?.pendingBalance || 0)}
            </h2>
            <p className="text-stone-600 text-[10px] font-bold uppercase leading-relaxed">Liberado 48h após os eventos.</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Feed: Transactions */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <DollarSign className="text-primary-container" />
              Extrato Detalhado
            </h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={16} />
              <input 
                placeholder="Filtrar por evento ou ID..." 
                className="bg-stone-900 border-none rounded-full py-2 pl-12 pr-6 text-xs text-stone-300 focus:ring-1 focus:ring-primary-container/30 w-64"
              />
            </div>
          </div>

          <div className="bg-stone-900/40 rounded-[3rem] border border-stone-800/50 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone-800">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500">Transação / Evento</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500">Data</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500">Bruto</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500">Líquido</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/50">
                  {transactions?.map((tx: any) => (
                    <tr key={tx.ticketId} className="group hover:bg-stone-800/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
                            <TicketIcon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-on-background tracking-tight">{tx.eventTitle}</p>
                            <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest mt-0.5">#{tx.ticketId.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-[11px] font-bold text-stone-400">
                        {formatDate(tx.purchaseDate)}
                      </td>
                      <td className="px-6 py-6 text-[11px] font-bold text-stone-500 line-through decoration-red-500/30">
                        {formatCurrency(tx.grossAmount)}
                      </td>
                      <td className="px-6 py-6 text-sm font-black text-emerald-400 italic">
                        {formatCurrency(tx.netAmount)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          tx.status === 'PAID' 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : 'bg-stone-800 text-stone-500 border-stone-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(!transactions || transactions.length === 0) && (
              <div className="py-20 flex flex-col items-center justify-center text-stone-700 opacity-40 italic">
                <AlertCircle size={40} className="mb-2" />
                <p>Nenhuma transação encontrada.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Financial Info */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-pulse-gradient p-10 rounded-[3rem] text-background shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h4 className="text-xl font-black tracking-tighter leading-tight">Total Bruto Acumulado</h4>
              <div className="space-y-1">
                <p className="text-5xl font-black italic tracking-tighter">
                  {formatCurrency(summary?.totalGrossRevenue || 0)}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Receita total sem descontos</p>
              </div>
              <div className="pt-6 border-t border-background/20 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Taxas da Plataforma</p>
                  <p className="text-xl font-black">{formatCurrency(summary?.totalPlatformFees || 0)}</p>
                </div>
                <div className="bg-background/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  10% Fee
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-900/40 p-8 rounded-[2.5rem] border border-stone-800/50 space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-stone-500 flex items-center gap-2 italic">
              <Calendar size={14} className="text-primary-container" />
              Ciclo de Payout
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1.5 h-auto rounded-full bg-primary-container shadow-[0_0_10px_rgba(var(--primary-container),0.5)]" />
                <p className="text-[11px] font-medium text-stone-400 leading-relaxed">
                  Vendas aprovadas de eventos realizados são liberadas imediatamente para saque.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 h-auto rounded-full bg-stone-700" />
                <p className="text-[11px] font-medium text-stone-500 leading-relaxed">
                  Para eventos futuros, o saldo permanece em custódia até 48h após o encerramento.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Sub-component for Transaction Icon
const TicketIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 9V5.2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2V9a2 2 0 0 0 0 6v3.8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V15a2 2 0 0 0 0-6z" />
    <path d="M15 3v18" />
    <path d="M15 8l-3 4 3 4" />
  </svg>
);
