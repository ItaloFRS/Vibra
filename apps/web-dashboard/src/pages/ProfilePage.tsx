import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User as UserIcon, 
  Building2, 
  Camera, 
  Save, 
  Shield, 
  CreditCard,
  Loader2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import api from '../services/api';

export const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Form States
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [document, setBusinessDocument] = useState('');
  const [bio, setBio] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  
  // Payout States
  const [pixKey, setPixKey] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAgency, setBankAgency] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountType, setAccountType] = useState('CORRENTE');

  // Change Password States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Fetch current user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data;
    }
  });

  // Sync form states with user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setBusinessName(user.businessName || '');
      setBusinessDocument(user.businessDocument || '');
      setBio(user.bio || '');
      setLogoUrl(user.profilePhotoUrl || '');
      setBannerUrl(user.bannerUrl || '');
      setPixKey(user.pixKey || '');
      setBankName(user.bankName || '');
      setBankAgency(user.bankAgency || '');
      setBankAccount(user.bankAccount || '');
      setAccountType(user.accountType || 'CORRENTE');
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: any) => {
      await api.patch('/auth/profile', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      alert('Perfil atualizado com sucesso!');
    },
    onError: () => alert('Erro ao salvar perfil.')
  });

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    const setter = type === 'logo' ? setIsUploadingLogo : setIsUploadingBanner;
    setter(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/media/upload', formData);
      const newUrl = response.data.url;
      // Atualizar imediatamente no backend
      updateProfileMutation.mutate({ [type === 'logo' ? 'profilePhotoUrl' : 'bannerUrl']: newUrl });
    } catch (error) {
      alert('Erro no upload da imagem.');
    } finally {
      setter(false);
    }
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      fullName,
      businessName,
      businessDocument: document,
      bio,
      pixKey,
      bankName,
      bankAgency,
      bankAccount,
      accountType
    });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      alert('Senha alterada com sucesso!');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao alterar senha. Verifique sua senha atual.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary-container" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] pb-20 space-y-12">
      <header>
        <h1 className="text-[3.5rem] font-black tracking-tighter leading-none text-on-background">
          Public <span className="text-transparent bg-clip-text bg-pulse-gradient">Profile</span>
        </h1>
        <p className="text-stone-500 mt-4 text-lg">Manage your producer identity and public branding.</p>
      </header>

      <section className="space-y-6">
        <div className="relative">
          <div 
            onClick={() => bannerInputRef.current?.click()}
            className="h-64 w-full rounded-[3rem] bg-stone-900 border border-stone-800 overflow-hidden cursor-pointer group relative shadow-2xl"
          >
            {bannerUrl ? <img src={bannerUrl} className="w-full h-full object-cover" /> : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-700">
                <ImageIcon size={48} className="opacity-20 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-center">Click to upload brand banner</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {isUploadingBanner ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white" size={32} />}
            </div>
            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')} />
          </div>

          <div 
            onClick={() => logoInputRef.current?.click()}
            className="absolute -bottom-10 left-12 w-32 h-32 rounded-full bg-stone-950 border-4 border-background overflow-hidden cursor-pointer group shadow-2xl z-10"
          >
            {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" /> : (
              <div className="w-full h-full flex items-center justify-center bg-stone-900 text-stone-700">
                <UserIcon size={40} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {isUploadingLogo ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white" size={24} />}
            </div>
            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-stone-900/40 p-10 rounded-[3rem] border border-stone-800/50 space-y-8 shadow-inner">
            <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Building2 className="text-primary-container" />
              Empresa & Identidade
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Nome do Responsável</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-stone-950 border-none rounded-2xl p-4 text-on-background focus:ring-2 focus:ring-primary-container" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Nome Fantasia (Público)</label>
                  <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Ex: Pulse Events" className="w-full bg-stone-950 border-none rounded-2xl p-4 text-on-background focus:ring-2 focus:ring-primary-container" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">CPF ou CNPJ</label>
                  <input value={document} onChange={e => setBusinessDocument(e.target.value)} placeholder="00.000.000/0001-00" className="w-full bg-stone-950 border-none rounded-2xl p-4 text-on-background focus:ring-2 focus:ring-primary-container" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Email de Login</label>
                  <input value={user?.email || ''} className="w-full bg-stone-950/50 border-none rounded-2xl p-4 text-stone-600 cursor-not-allowed font-medium" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Bio da Produtora</label>
                <textarea 
                  value={bio} 
                  onChange={e => setBio(e.target.value)}
                  placeholder="Conte a história da sua produtora..."
                  className="w-full bg-stone-950 border-none rounded-2xl p-6 text-stone-300 h-40 resize-none focus:ring-2 focus:ring-primary-container" 
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveProfile}
            disabled={updateProfileMutation.isPending}
            className="bg-pulse-gradient w-full py-5 rounded-[2rem] text-on-background font-black shadow-2xl shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Atualizar Informações de Perfil
          </button>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-stone-900/40 p-8 rounded-[2.5rem] border border-stone-800/50 space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-stone-500 flex items-center gap-2 italic">
              <Shield size={14} className="text-emerald-500" />
              Security Hub
            </h4>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full py-4 rounded-xl bg-stone-800/50 text-stone-400 font-bold hover:bg-stone-800 hover:text-stone-200 transition-all text-sm"
            >
              Alterar Senha
            </button>
            <button className="w-full py-4 rounded-xl bg-stone-800/50 text-stone-400 font-bold hover:bg-stone-800 hover:text-stone-200 transition-all text-sm">
              Autenticação 2FA
            </button>
          </div>

          <div className="bg-primary-container/5 p-8 rounded-[2.5rem] border border-primary-container/10 space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-primary-container flex items-center gap-2">
              <CreditCard size={14} />
              Bancos & Payouts
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-1">Chave PIX</label>
                <input 
                  value={pixKey} 
                  onChange={e => setPixKey(e.target.value)}
                  placeholder="E-mail, CPF ou Aleatória" 
                  className="w-full bg-stone-900/50 border-none rounded-xl p-3 text-xs text-on-background focus:ring-1 focus:ring-primary-container/50" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-1">Banco</label>
                <input 
                  value={bankName} 
                  onChange={e => setBankName(e.target.value)}
                  placeholder="Ex: Nubank" 
                  className="w-full bg-stone-900/50 border-none rounded-xl p-3 text-xs text-on-background focus:ring-1 focus:ring-primary-container/50" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-1">Agência</label>
                  <input 
                    value={bankAgency} 
                    onChange={e => setBankAgency(e.target.value)}
                    placeholder="0001" 
                    className="w-full bg-stone-900/50 border-none rounded-xl p-3 text-xs text-on-background focus:ring-1 focus:ring-primary-container/50" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-1">Conta</label>
                  <input 
                    value={bankAccount} 
                    onChange={e => setBankAccount(e.target.value)}
                    placeholder="12345-6" 
                    className="w-full bg-stone-900/50 border-none rounded-xl p-3 text-xs text-on-background focus:ring-1 focus:ring-primary-container/50" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-1">Tipo de Conta</label>
                <select 
                  value={accountType} 
                  onChange={e => setAccountType(e.target.value)}
                  className="w-full bg-stone-900/50 border-none rounded-xl p-3 text-xs text-on-background focus:ring-1 focus:ring-primary-container/50 appearance-none cursor-pointer"
                >
                  <option value="CORRENTE">Conta Corrente</option>
                  <option value="POUPANCA">Conta Poupança</option>
                </select>
              </div>
            </div>

            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-wider leading-relaxed italic opacity-60">
              * Os pagamentos são processados em até 48h após o término do evento.
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-md rounded-[3rem] p-10 shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-tighter">Alterar <span className="text-primary-container">Senha</span></h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-stone-500 hover:text-on-background transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Senha Atual</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-stone-950 border-none rounded-2xl p-4 text-on-background focus:ring-2 focus:ring-primary-container" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Nova Senha</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-stone-950 border-none rounded-2xl p-4 text-on-background focus:ring-2 focus:ring-primary-container" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-stone-950 border-none rounded-2xl p-4 text-on-background focus:ring-2 focus:ring-primary-container" 
                />
              </div>
            </div>

            <button 
              onClick={handleChangePassword}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full py-5 rounded-2xl bg-pulse-gradient text-on-background font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isChangingPassword ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
              Confirmar Alteração
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
