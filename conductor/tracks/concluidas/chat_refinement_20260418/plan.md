# Implementation Plan: Refinamento de Chats (Real-time e Layout)

## Phase 1: Infraestrutura Real-time e Eventos
Nesta fase, focaremos em corrigir a reatividade do WebSocket e implementar os novos eventos de sinalização.

- [x] Task: Audit e Correção do `socket.ts` e `socketService`
    - [x] Escrever testes de integração para o serviço de socket simulando recebimento de mensagens.
    - [x] Garantir que o `stompClient` não perca a conexão em background e processe mensagens instantaneamente.
- [x] Task: Implementar Eventos de Digitação (Typing Indicator)
    - [x] Adicionar handlers no backend/frontend para enviar e receber eventos `typing`.
    - [x] Criar testes unitários para o hook `useChat` validando a mudança de estado do indicador.
- [x] Task: Implementar Recibos de Leitura
    - [x] Adicionar persistência e sinalização de `read_at` no WebSocket.
    - [x] Verificar integridade do estado local com testes automatizados.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Infraestrutura Real-time e Eventos' (Protocol in workflow.md)

## Phase 2: Refinamento de Layout e Fidelidade Stitch
Foco total no visual do Chat Individual e elementos do Design System.

- [x] Task: Refatoração das Bolhas de Mensagem (Editorial Stone)
    - [x] Aplicar tokens de cor da paleta `stone` e tipografia `Plus Jakarta Sans`.
    - [x] Ajustar paddings, shadows e border-radius conforme o protótipo do Stitch.
- [x] Task: Header e Barra de Entrada (Input Bar)
    - [x] Redesenhar o Header (Individual Chat Elena style) com status online real-time.
    - [x] Implementar a barra de input flutuante com sombra e transparência conforme Stitch.
- [x] Task: Layout de Canais (Comunidade)
    - [x] Ajustar a interface estilo Discord para canais de transporte, VIP e geral.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Refinamento de Layout e Fidelidade Stitch' (Protocol in workflow.md)

## Phase 3: Polimento de UX e Estabilidade
Garantir que a experiência de uso seja fluida e sem bugs de navegação.

- [x] Task: Lógica de Scroll e Sticky Bottom
    - [x] Implementar scroll automático para novas mensagens e botão de "Scroll to bottom".
- [x] Task: Mensagens de Sistema e Join Events
    - [x] Injetar mensagens de entrada/saída de membros nos chats de comunidade (Refatorado para Modal de Presença).
- [x] Task: Conductor - User Manual Verification 'Phase 3: Polimento de UX e Estabilidade' (Protocol in workflow.md)
