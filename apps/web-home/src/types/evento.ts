export interface Evento {
  id: string;
  slug: string;
  nome: string;
  categoria: string;
  data: string; // ISO format
  local: string;
  cidade: string;
  thumbnailUrl: string;
  videoUrl?: string;
  descricao: string;
  precoMinimo: number;
  tags: string[];
  destaque?: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
}
