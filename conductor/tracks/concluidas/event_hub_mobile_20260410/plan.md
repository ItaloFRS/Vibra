# Implementation Plan: Hub do Evento

## Phase 1: Layout Base & Aba Feed
- [x] **Task 1: Estrutura de Navegação Interna**
  - Criar rota dinâmica `events/[id]/index.tsx`.
  - Configurar Top Tab Bar (Feed, Ingressos, Match, Chat) seguindo o design Stitch.
- [x] **Task 2: Aba Feed (UI & Data)**
  - Implementar visualização do Banner, Título e Localização.
  - Renderizar lista de Lineup.
  - Sincronizar botão de Favorito flutuante.

## Phase 2: Compra de Ingressos & Checkout
- [x] **Task 3: Listagem de Ingressos**
  - Renderizar os `TicketTypes` e lotes vindos do backend.
- [x] **Task 4: Fluxo de Pagamento**
  - Implementar tela de Seleção de Formas de Pagamento (Pix/Cartão).
  - Implementar cadastro de novo cartão com componente de **Cartão Interativo**.
  - Integrar chamada para `/tickets/purchase`.
  - Tela de confirmação com QR Code (Stitch ID: 52caca26753f48419e58781b3a2bff1f).

## Phase 3: Experiência Social (Match & Chat)
- [x] **Task 5: Vibra Match (Swipe UI)**
  - Implementar interface de cartões para Match.
  - Validar permissão de acesso (Gatekeeper).
- [x] **Task 6: Canais de Comunidade**
  - Interface de listagem de canais.
  - Integração real com WebSocket para mensagens.

## Phase 4: Refinamento & UX
- [x] **Task 7: Transições e Animações**
  - Polimento nas trocas de abas e feedback visual de compra.
