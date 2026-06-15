# Implementation Plan: Vibra Social - VIP, Chat Avançado e Directs

## Phase 1: Aba VIP (Event Hub)
- [x] **Task 1: Lógica de Acesso VIP**
  - Implementar verificação no `EventHubScreen` para checar a ingresso comprado para o evento.
- [x] **Task 2: UI da Aba VIP**
  - Criar componente `VipTab.tsx` baseado no Stitch ID `916e4ff98ed84ff8b0567f982712a6c7`.
  - Se sem acesso: tela de "Upsell" (Compre VIP para acessar).
  - Se com acesso: exibir mapa exclusivo, bar secreto, ou chat VIP.

## Phase 2: Perfil Público e Inbox
- [x] **Task 3: Tela de Perfil Público**
  - Criar tela ou modal `PublicProfileScreen` que exibe Foto, Nome, Bio, e "Vibes" (interesses).
  - Lógica do botão de interação: "Enviar Mensagem" (se já houver match/aceite) ou "Solicitar Mensagem" (se não for amigo).
- [x] **Task 4: Inbox & Solicitações (Lista de Chats)**
  - Implementar tela de listagem de conversas (Stitch `596a1a4b4db2432993c7949bd046dea1`).
  - Separar em duas abas/seções: "Conversas Ativas" e "Solicitações (Directs pendentes)".

## Phase 3: Lógica Backend para Directs
- [x] **Task 5: Endpoints de Solicitação de Chat**
  - Criar/adaptar a entidade `ChatRequest` ou suportar status (PENDING, ACCEPTED, REJECTED) no caso de chats 1:1 sem Match prévio.
  - Criar endpoints: `POST /social/requests`, `POST /social/requests/{id}/accept`, `POST /social/requests/{id}/reject`.

## Phase 4: Chat Individual e Pro (Comunidade)
- [x] **Task 6: Refinamento do Chat Individual**
  - Implementar `apps/mobile/src/app/chat/individual/[id].tsx` baseado no Stitch `f1192dd7d0274465aade63d476a25944`.
  - Conectar ao WebSocket do backend para troca de mensagens 1:1 de forma robusta.
- [x] **Task 7: Polimento do Chat de Comunidade**
  - Permitir clique no avatar dentro do chat (`apps/mobile/src/app/chat/[id].tsx`) para abrir o Perfil Público da Task 3.
  - Melhorias visuais nas mensagens.