# Plano de Implementação: UX Premium da Tela de Mensagens (Feature)

## Phase 1: Backend - Novo Endpoint de Unread Count
- [x] Task: Escrever testes unitários (TDD) no `ChatServiceTest` para garantir o cálculo correto de chats com mensagens não lidas.
- [x] Task: Criar o endpoint `GET /social/chats/unread-count` no `ChatController`, retornando o total de chats não lidos (ex: `{ "unreadCount": 5 }`).
- [x] Task: Conductor - User Manual Verification 'Backend - Novo Endpoint de Unread Count' (Protocol in workflow.md)

## Phase 2: Frontend - UI/UX Refinement (`chats.tsx`)
- [x] Task: Atualizar a exibição da lista de chats (`chats.tsx`), garantindo que o backend retorne ou o frontend ordene os itens pela `lastMessageAt` (mais recentes no topo).
- [x] Task: Implementar as divisórias finas (estilo WhatsApp) abaixo de cada chat, garantindo que a linha inicie apenas após o `UserAvatar` (alinhada com o texto da última mensagem).
- [x] Task: Aplicar os estilos de "Não Lido": fundo levemente destacado (`bg-primary/5`), tipografia em negrito (`font-plus-ebold`) para nome/preview, e um badge contendo a quantidade de mensagens não lidas ou uma bolinha de destaque.
- [x] Task: Conductor - User Manual Verification 'Frontend - UI/UX Refinement' (Protocol in workflow.md)

## Phase 3: Backend - Silenciar e Filtro de Notificação
- [x] Task: Criar entidade/tabela `MutedChannel` ou campo `isMuted` na relação de interesse para persistir silenciamentos.
- [x] Task: Atualizar endpoint `unread-count` para ignorar mensagens de canais silenciados.
- [x] Task: Criar endpoint `POST /social/channels/{id}/mute` para alternar o estado de silêncio.

## Phase 3: Frontend - Badge Global na TabBar (`_layout.tsx`)
- [x] Task: Importar a chamada à API `/social/chats/unread-count` no `_layout.tsx` da pasta `(tabs)`, utilizando `useQuery` para manter o dado sempre atualizado.
- [x] Task: Modificar as opções da tela `chats` (aba Mensagens) na TabBar para renderizar um badge com a contagem (`unreadCount`) quando for maior que zero.
- [x] Task: Conductor - User Manual Verification 'Frontend - Badge Global na TabBar' (Protocol in workflow.md)

## Phase 4: Bug Fix - Suporte a ChatRequest (Solicitações) na Listagem
- [x] Task: Backend - Atualizar `MessageRepository` criando consultas nativas (ex: `findLastMessageByConnectionId` e `hasUnreadMessagesInConnection`) que aceitem a junção via `match_id` OR `chat_request_id`.
- [x] Task: Backend - Atualizar `countUnreadDirectChatsForUser` em `MessageRepository` para contabilizar mensagens não lidas tanto de matches quanto de chat requests.
- [x] Task: Backend - Refatorar `SocialController.getChats` substituindo `messageRepository.findMatchIdsBetweenUsers` por `chatRequestService.getMatchIdBetweenUsers` para capturar a conexão ativa corretamente.
- [x] Task: Conductor - User Manual Verification 'Bug Fix - Suporte a ChatRequest' (Protocol in workflow.md)