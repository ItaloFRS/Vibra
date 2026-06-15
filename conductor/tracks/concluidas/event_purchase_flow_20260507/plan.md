# Implementation Plan: Fluxo de Compra de Ingressos Premium (web-home)

Este plano detalha as etapas para implementar a página de compra de ingressos no `web-home`.

## Fase 1: Setup e Estrutura de Rotas
- [x] Criar rota dinâmica `/eventos/[slug]` para a página de detalhes/venda.
- [x] Definir interface de dados do Evento e Ingressos.
- [x] Implementar `EventPurchaseHero` com efeito parallax e animação de entrada.

## Fase 2: Detalhes do Evento e Seleção de Ingressos
- [x] Desenvolver `EventDetailsSection` com cards glassmorphism.
- [x] Criar `TicketSelector` e `TicketCard` com estados de seleção e badges.
- [x] Implementar lógica básica de adição ao carrinho.

## Fase 3: Carrinho Lateral (CartDrawer)
- [x] Criar componente `CartDrawer` usando Radix UI Dialog/Sheet.
- [x] Implementar animações de slide-in e atualização de valores em tempo real.
- [x] Adicionar controles de quantidade e remoção.

## Fase 4: Autenticação (Modal Premium)
- [x] Criar `AuthModal` with transições entre Login e Cadastro.
- [x] Estilizar formulários com micro-interações e validação Zod.
- [x] Simular fluxo de autenticação (ou integrar se disponível).

## Fase 5: Checkout Multi-step (PaymentModal)
- [x] Desenvolver `PaymentModal` com navegação por steps.
- [x] Step 1: Coleta/Confirmação de dados do usuário.
- [x] Step 2: Seletor de método de pagamento (Cards interativos).
- [x] Step 3: Implementar formulário de cartão de crédito e visualização de PIX.
- [x] Step 4: Revisão final dos itens e total.

## Fase 6: Finalização e Sucesso
- [x] Implementar tela de `PurchaseSuccess` com animações de celebração.
- [x] Criar visualização de ticket com QR Code (mock).
- [x] Garantir responsividade (Bottom sheets no mobile).

## Fase 7: Polimento e Performance
- [x] Refinar todas as animações do Framer Motion.
- [x] Otimizar carregamento de imagens e estados de loading (Skeletons).
- [x] Testes de fluxo ponta a ponta.
