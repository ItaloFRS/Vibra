import { Event, TicketType } from '../../types/api';

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: '1', nome: 'Noturnas', slug: 'noturnas' },
  { id: '2', nome: 'São João', slug: 'sao-joao' },
  { id: '3', nome: 'Futebol', slug: 'futebol' },
  { id: '4', nome: 'Shows', slug: 'shows' },
  { id: '5', nome: 'Festivais', slug: 'festivais' },
  { id: '6', nome: 'Universitário', slug: 'universitario' },
  { id: '7', nome: 'Tecnologia', slug: 'tecnologia' },
  { id: '8', nome: 'Gastronomia', slug: 'gastronomia' },
];

export const MOCK_EVENTOS: (Event & { destaque?: boolean })[] = [
  {
    id: 'e1',
    slug: 'baile-do-dennis',
    title: 'Baile do Dennis',
    category: 'Noturnas',
    eventDate: '2026-06-12T22:00:00Z',
    location: 'Arena Vibra, Campina Grande',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop',
    description: 'O maior baile do mundo chega em Campina Grande para uma noite inesquecível. Prepare-se para o Dennis DJ e convidados em uma mega estrutura cinematográfica.',
    minPrice: 80,
    destaque: true,
    producerId: 'p1',
    ticketTypes: [],
    lineup: [],
  },
  {
    id: 'e2',
    slug: 'o-maior-sao-joao-do-mundo',
    title: 'O Maior São João do Mundo',
    category: 'São João',
    eventDate: '2026-06-24T19:00:00Z',
    location: 'Parque do Povo, Campina Grande',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop',
    description: 'A tradição que vibra no coração do Nordeste. 30 dias de festa, música e cultura popular no Quartel General do Forró.',
    minPrice: 0,
    destaque: true,
    producerId: 'p1',
    ticketTypes: [],
    lineup: [],
  },
  {
    id: 'e3',
    slug: 'vibra-tech-conference',
    title: 'Vibra Tech Conference',
    category: 'Tecnologia',
    eventDate: '2026-08-15T09:00:00Z',
    location: 'Centro de Convenções, João Pessoa',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540575861501-7c910b4ec191?q=80&w=2070&auto=format&fit=crop',
    description: 'O futuro da tecnologia e inovação se encontra aqui. Palestras, workshops e networking com os líderes do mercado.',
    minPrice: 150,
    destaque: false,
    producerId: 'p1',
    ticketTypes: [],
    lineup: [],
  },
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `e-noturna-${i}`,
    slug: `festa-noturna-${i + 1}`,
    title: `Festa Noturna ${i + 1}`,
    category: 'Noturnas',
    eventDate: '2026-07-20T23:00:00Z',
    location: 'Clube Privê, Campina Grande',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    description: 'Uma festa incrível com os melhores DJs da região.',
    minPrice: 50 + i * 10,
    producerId: 'p1',
    ticketTypes: [],
    lineup: [],
  })),
];
