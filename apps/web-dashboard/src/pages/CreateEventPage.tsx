import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronRight, 
  Image as ImageIcon, 
  PlusCircle, 
  MapPin, 
  Trash2,
  Send,
  Plus,
  Clock,
  Music,
  Loader2,
  Save,
  X,
  Hash,
  Ticket
} from 'lucide-react';
import api from '../services/api';

interface Batch {
  id?: string;
  batchName: string;
  price: string;
  capacity: string;
}

interface TicketType {
  id?: string;
  name: string;
  batches: Batch[];
}

interface Artist {
  id?: string;
  name: string;
  time: string;
  imageUrl: string;
  isUploading?: boolean;
}

export const CreateEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Festa Noturna');
  const [visibility, setVisibility] = useState<'Público' | 'Privado'>('Público');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState(''); // Rua / Logradouro
  const [streetNumber, setStreetNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [externalTicketLink, setExternalTicketLink] = useState('');

  // Auto-complete via ViaCEP
  useEffect(() => {
    const cep = zipCode.replace(/\D/g, '');
    if (cep.length === 8) {
      setIsSearchingCep(true);
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setLocation(`${data.logradouro}${data.bairro ? ' - ' + data.bairro : ''}${data.localidade ? ', ' + data.localidade : ''}`);
            // Focar no número após preencher a rua
            const numInput = document.getElementById('street-number') as HTMLInputElement;
            numInput?.focus();
          }
        })
        .catch(err => console.error('Erro ao buscar CEP:', err))
        .finally(() => setIsSearchingCep(false));
    }
  }, [zipCode]);

  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: 'Geral', batches: [{ batchName: 'Lote 1', price: '', capacity: '' }] }
  ]);
  const [lineup, setLineup] = useState<Artist[]>([]);

  // Load event data
  useEffect(() => {
    if (isEditMode) {
      api.get(`/events`)
        .then(response => {
          const event = response.data.find((e: any) => e.id === id);
          if (event) {
            setTitle(event.title);
            setCategory(event.category || 'Festa Noturna');
            setDescription(event.description || '');
            setBannerUrl(event.thumbnailUrl || '');
            setExternalTicketLink(event.externalTicketLink || '');
            
            // Tentar extrair partes do endereço salvo (Simples para MVP)
            const parts = event.location?.split(',') || [];
            setLocation(parts[0] || '');
            if (parts[1]) setStreetNumber(parts[1].trim().split(' ')[0]);
            
            if (event.eventDate) {
              const d = new Date(event.eventDate);
              setDate(d.toISOString().split('T')[0]);
              setStartTime(d.getUTCHours().toString().padStart(2, '0') + ':' + d.getUTCMinutes().toString().padStart(2, '0'));
            }

            if (event.lineup) {
              setLineup(event.lineup.map((l: any) => ({
                id: l.id,
                name: l.artistName,
                time: l.time || '',
                imageUrl: l.artistImageUrl
              })));
            }

            if (event.ticketTypes) {
              setTicketTypes(event.ticketTypes.map((tt: any) => ({
                id: tt.id,
                name: tt.name,
                batches: tt.batches.map((b: any) => ({
                  id: b.id,
                  batchName: b.batchName,
                  price: b.price.toString(),
                  capacity: b.capacity.toString()
                }))
              })));
            }
          }
        })
        .catch(err => console.error('Erro ao carregar evento:', err))
        .finally(() => setIsLoadingData(false));
    }
  }, [id, isEditMode]);

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/media/upload', formData);
      setBannerUrl(response.data.url);
    } catch (error) {
      alert('Falha ao carregar banner.');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleArtistImageUpload = async (index: number, file: File) => {
    const newLineup = [...lineup];
    newLineup[index].isUploading = true;
    setLineup(newLineup);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/media/upload', formData);
      const updatedLineup = [...lineup];
      updatedLineup[index].imageUrl = response.data.url;
      updatedLineup[index].isUploading = false;
      setLineup(updatedLineup);
    } catch (error) {
      const updatedLineup = [...lineup];
      updatedLineup[index].isUploading = false;
      setLineup(updatedLineup);
    }
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', batches: [{ batchName: 'Lote 1', price: '', capacity: '' }] }]);
  };

  const addBatch = (typeIndex: number) => {
    const newTypes = [...ticketTypes];
    const nextBatchNumber = newTypes[typeIndex].batches.length + 1;
    newTypes[typeIndex].batches.push({ 
      batchName: `Lote ${nextBatchNumber}`, 
      price: '', 
      capacity: '' 
    });
    setTicketTypes(newTypes);
  };

  const addArtist = () => {
    setLineup([...lineup, { name: '', time: '', imageUrl: '' }]);
  };

  const handleFinishCreation = async () => {
    if (!title || !date || !bannerUrl) {
      alert('Por favor, preencha o título, data e banner.');
      return;
    }
    setIsSubmitting(true);
    const eventDateTime = `${date}T${startTime || '00:00'}:00Z`;
    const payload = {
      title,
      category,
      description,
      thumbnailUrl: bannerUrl,
      eventDate: eventDateTime,
      location: `${location}, ${streetNumber} - ${zipCode}`,
      externalTicketLink,
      ticketTypes: ticketTypes.map(tt => ({
        name: tt.name,
        batches: tt.batches.map(b => ({
          batchName: b.batchName,
          price: parseFloat(b.price) || 0,
          capacity: parseInt(b.capacity) || 0
        }))
      })),
      lineup: lineup.map(artist => ({
        artistName: artist.name,
        artistImageUrl: artist.imageUrl
      }))
    };

    try {
      if (isEditMode) await api.patch(`/events/${id}`, payload);
      else await api.post('/events', payload);
      navigate('/events');
    } catch (error) {
      alert('Ocorreu um erro ao salvar o evento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionTitle = ({ number, title, description }: any) => (
    <div className="col-span-4 sticky top-12">
      <div className="flex items-center gap-4 mb-4">
        <span className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center text-primary-container font-black border border-stone-800">
          {number}
        </span>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>
      <p className="text-stone-400 text-sm leading-relaxed">{description}</p>
    </div>
  );

  const getMapUrl = () => {
    const query = encodeURIComponent(`${location} ${streetNumber} ${zipCode}`);
    return `https://www.google.com/maps/embed/v1/place?key=SUA_CHAVE_AQUI&q=${query}`;
    // Usando formato sem chave para teste rápido (pode ter limitações)
    // return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  if (isLoadingData) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin text-primary-container" size={48} /></div>;
  }

  return (
    <div className="max-w-[1200px] pb-32">
      <header className="flex justify-between items-end mb-16">
        <div>
          <nav className="flex items-center gap-2 text-stone-500 text-sm mb-4">
            <span>Eventos</span>
            <ChevronRight size={14} />
            <span className="text-stone-300">{isEditMode ? 'Editar Evento' : 'Criar Novo Evento'}</span>
          </nav>
          <h1 className="text-[3.5rem] font-extrabold tracking-tighter leading-none text-on-background">
            {isEditMode ? 'Editar' : 'Criar Novo'} <span className="text-transparent bg-clip-text bg-pulse-gradient">Evento</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/events')} className="px-8 py-3 rounded-full border border-stone-700 text-stone-300 font-bold hover:bg-stone-900 transition-colors text-sm">Cancelar</button>
          <button onClick={handleFinishCreation} disabled={isSubmitting} className="px-8 py-3 rounded-full bg-pulse-gradient text-on-background font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 text-sm">
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (isEditMode ? <Save size={18} /> : <Send size={18} />)}
            {isEditMode ? 'Salvar Alterações' : 'Publicar Evento'}
          </button>
        </div>
      </header>

      <div className="space-y-32">
        {/* Section 1: Basic Info */}
        <section className="grid grid-cols-12 gap-12 items-start">
          <SectionTitle number="01" title="Informações Básicas" description="Defina a identidade central do seu evento." />
          <div className="col-span-8 space-y-6 bg-stone-900/40 p-8 rounded-xl border border-stone-800/50">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Nome do Evento</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-stone-950 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary-container text-stone-100" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Categoria</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-stone-950 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary-container text-stone-100 appearance-none">
                  <option>Festa Noturna</option>
                  <option>São João | Forró</option>
                  <option>Futebol</option>
                  <option>Esportes</option>
                  <option>Cultural</option>
                  <option>Outros</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Visibilidade</label>
                <div className="flex p-1 bg-stone-950 rounded-full">
                  <button onClick={() => setVisibility('Público')} className={`flex-1 py-3 px-4 rounded-full font-bold text-sm transition-all ${visibility === 'Público' ? 'bg-stone-800 text-stone-100' : 'text-stone-500'}`}>Público</button>
                  <button onClick={() => setVisibility('Privado')} className={`flex-1 py-3 px-4 rounded-full font-bold text-sm transition-all ${visibility === 'Privado' ? 'bg-stone-800 text-stone-100' : 'text-stone-500'}`}>Privado</button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Descrição</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-stone-950 border-none rounded-xl p-6 focus:ring-2 focus:ring-primary-container text-stone-300 resize-none h-40" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Link Externo para Venda de Ingressos</label>
              <input type="url" value={externalTicketLink} onChange={e => setExternalTicketLink(e.target.value)} placeholder="https://exemplo.com/ingressos" className="w-full bg-stone-950 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary-container text-stone-100" />
            </div>
          </div>
        </section>

        {/* Section 2: Date & Location */}
        <section className="grid grid-cols-12 gap-12 items-start">
          <SectionTitle number="02" title="Data e Local" description="O mapa será atualizado conforme você preenche o CEP e o número." />
          <div className="col-span-8 space-y-6 bg-stone-900/40 p-8 rounded-xl border border-stone-800/50 shadow-2xl">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Data</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-stone-950 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary-container text-stone-100" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Início</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-stone-950 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary-container text-stone-100" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-8 space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Logradouro / Rua</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Av. Paulista" className="w-full bg-stone-950 border-none rounded-xl p-4 pl-12 focus:ring-2 focus:ring-primary-container text-stone-100" />
                  </div>
                </div>
                <div className="col-span-6 md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Nº</label>
                  <input type="text" value={streetNumber} onChange={e => setStreetNumber(e.target.value)} placeholder="123" className="w-full bg-stone-950 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary-container text-stone-100" />
                </div>
                <div className="col-span-6 md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">CEP</label>
                  <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="00000-000" className="w-full bg-stone-950 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary-container text-stone-100" />
                </div>
              </div>

              {/* Google Maps Iframe */}
              <div className="h-[400px] rounded-3xl overflow-hidden border-2 border-stone-800 shadow-inner relative group bg-stone-950">
                {(location || zipCode) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${location} ${streetNumber} ${zipCode}`)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-700 space-y-4">
                    <MapPin size={48} className="opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">Preencha o endereço para visualizar o mapa</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Tickets & Batches */}
        <section className="grid grid-cols-12 gap-12 items-start relative">
          <SectionTitle number="03" title="Ingressos e Lotes" description="Configure os tipos de entrada e a quantidade de lotes." />
          <div className="col-span-8 space-y-10">
            {ticketTypes.map((type, typeIndex) => (
              <div key={typeIndex} className="bg-stone-900/40 p-10 rounded-[3rem] border border-stone-800/50 space-y-8 shadow-inner relative group">
                <button 
                  onClick={() => setTicketTypes(ticketTypes.filter((_, i) => i !== typeIndex))}
                  className="absolute top-8 right-8 text-stone-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-primary-container">
                    <Ticket size={32} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-1">Tipo de Ingresso</label>
                    <input 
                      value={type.name} 
                      onChange={e => {
                        const nt = [...ticketTypes];
                        nt[typeIndex].name = e.target.value;
                        setTicketTypes(nt);
                      }}
                      placeholder="Ex: Pista Premium, Camarote..." 
                      className="bg-transparent border-none p-0 text-3xl font-black text-on-background w-full focus:ring-0 placeholder:text-stone-800" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {type.batches.map((batch, batchIndex) => (
                    <div key={batchIndex} className="grid grid-cols-12 gap-4 items-end bg-stone-950/50 p-6 rounded-[2rem] border border-stone-800/30 group/batch relative">
                      <div className="col-span-4 space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-1 italic">NOME DO LOTE</label>
                        <input 
                          value={batch.batchName} 
                          onChange={e => {
                            const nt = [...ticketTypes];
                            nt[typeIndex].batches[batchIndex].batchName = e.target.value;
                            setTicketTypes(nt);
                          }}
                          className="w-full bg-stone-900 border-none rounded-xl p-4 text-sm font-bold text-on-background focus:ring-1 focus:ring-primary-container/50" 
                        />
                      </div>
                      <div className="col-span-3 space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-1 italic flex items-center gap-2">
                          <span className="text-emerald-500">$</span> PREÇO (R$)
                        </label>
                        <input 
                          type="number"
                          value={batch.price} 
                          onChange={e => {
                            const nt = [...ticketTypes];
                            nt[typeIndex].batches[batchIndex].price = e.target.value;
                            setTicketTypes(nt);
                          }}
                          placeholder="0,00"
                          className="w-full bg-stone-900 border-none rounded-xl p-4 text-sm font-bold text-emerald-500 focus:ring-1 focus:ring-emerald-500/30" 
                        />
                      </div>
                      <div className="col-span-3 space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-1 italic flex items-center gap-2">
                          <Hash size={10} className="text-primary-container" /> CAPACIDADE
                        </label>
                        <input 
                          type="number"
                          value={batch.capacity} 
                          onChange={e => {
                            const nt = [...ticketTypes];
                            nt[typeIndex].batches[batchIndex].capacity = e.target.value;
                            setTicketTypes(nt);
                          }}
                          placeholder="Qtd"
                          className="w-full bg-stone-900 border-none rounded-xl p-4 text-sm font-bold text-on-background focus:ring-1 focus:ring-primary-container/50" 
                        />
                      </div>
                      <div className="col-span-2 flex justify-end pb-2">
                        {batchIndex > 0 && (
                          <button 
                            onClick={() => {
                              const nt = [...ticketTypes];
                              nt[typeIndex].batches = nt[typeIndex].batches.filter((_, i) => i !== batchIndex);
                              setTicketTypes(nt);
                            }}
                            className="p-3 text-stone-700 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addBatch(typeIndex)}
                    className="w-full py-4 border-2 border-dashed border-stone-800 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-stone-600 hover:border-primary-container/30 hover:text-primary-container transition-all flex items-center justify-center gap-3"
                  >
                    <Plus size={16} /> Adicionar Novo Lote
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={addTicketType}
              className="w-full py-8 bg-stone-900/40 border border-stone-800 rounded-[3rem] text-xs font-black uppercase tracking-[0.3em] text-on-background/40 hover:text-primary-container hover:border-primary-container/30 transition-all flex items-center justify-center gap-4"
            >
              <PlusCircle size={24} /> Criar Novo Tipo de Ingresso
            </button>
          </div>

        </section>

        {/* Section 4: Lineup */}
        <section className="grid grid-cols-12 gap-12 items-start">
          <SectionTitle number={isEditMode ? "04" : "05"} title="Lineup do Evento" description="Gerencie os artistas convidados." />
          <div className="col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {lineup.map((artist, index) => (
              <div key={index} className="bg-stone-900/60 p-6 rounded-[2.5rem] border border-stone-800 flex items-center gap-6 group relative hover:border-primary-container/30 transition-all shadow-xl">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-container/20 bg-stone-950 flex-shrink-0 flex items-center justify-center cursor-pointer relative shadow-inner" onClick={() => document.getElementById(`artist-input-${index}`)?.click()}>
                  {artist.imageUrl ? <img src={artist.imageUrl} className="w-full h-full object-cover" /> : <div className="text-stone-700 flex flex-col items-center"><Music size={24} /><span className="text-[8px] font-black uppercase mt-1">Add Pic</span></div>}
                  {artist.isUploading && <div className="absolute inset-0 bg-stone-950/80 flex items-center justify-center"><Loader2 className="animate-spin text-primary-container" size={24} /></div>}
                  <input id={`artist-input-${index}`} type="file" className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleArtistImageUpload(index, f); }} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-600 ml-1">Artist Name</label>
                    <input value={artist.name} onChange={e => { const nl = [...lineup]; nl[index].name = e.target.value; setLineup(nl); }} placeholder="Ex: Alok" className="bg-transparent border-none p-0 font-black text-xl text-on-background w-full focus:ring-0" />
                  </div>
                  <div className="flex items-center gap-2 group/time">
                    <Clock size={14} className="text-primary-container opacity-50 group-hover/time:opacity-100 transition-opacity" />
                    <input value={artist.time} onChange={e => { const nl = [...lineup]; nl[index].time = e.target.value; setLineup(nl); }} placeholder="Show time" className="bg-transparent border-none p-0 text-sm font-bold text-stone-200 w-full focus:ring-0" />
                  </div>
                </div>
                <button onClick={() => setLineup(lineup.filter((_, i) => i !== index))} className="absolute top-4 right-6 p-2 text-stone-700 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
              </div>
            ))}
            <button onClick={addArtist} className="col-span-1 md:col-span-2 py-10 rounded-[2.5rem] border-2 border-dashed border-stone-800 text-stone-600 font-black flex items-center justify-center gap-4 hover:border-primary-container/40 hover:text-primary-container hover:bg-stone-900/30 transition-all uppercase tracking-widest text-xs"><PlusCircle size={24} /> Add Artist to Lineup</button>
          </div>
        </section>

        {/* Section 4: Media */}
        <section className="grid grid-cols-12 gap-12 items-start">
          <SectionTitle number={isEditMode ? "04" : "05"} title="Mídia e Banner" description="Banner oficial em formato 16:9." />
          <div className="col-span-8 bg-stone-900/40 p-8 rounded-xl border border-stone-800/50">
            <div className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-stone-800 aspect-video flex flex-col items-center justify-center bg-stone-950 hover:border-primary-container/50 transition-colors" onClick={() => bannerInputRef.current?.click()}>
              {bannerUrl ? (
                <>
                  <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><p className="text-white font-bold bg-black/60 px-4 py-2 rounded-full text-xs">Trocar Banner</p></div>
                </>
              ) : (
                <div className="relative z-10 text-center">
                  {isUploadingBanner ? <Loader2 className="animate-spin text-primary-container" size={48} /> : <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-4 border border-stone-800 text-primary-container"><ImageIcon size={32} /></div>}
                  <span className="block text-stone-100 font-bold">Upload do Banner</span>
                </div>
              )}
              <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
