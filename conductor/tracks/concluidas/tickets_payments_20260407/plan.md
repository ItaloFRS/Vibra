# Implementation Plan: Tickets & Payments

## Phase 1: Banco de Dados e Módulo Tickets (com.vibra.tickets)
- [ ] Task: Escrever migração Flyway para a tabela `tickets`.
- [ ] Task: Implementar entidade `Ticket` e o enum `TicketStatus`.
- [ ] Task: Criar o `TicketRepository`.

## Phase 2: Integração Mercado Pago (Core)
- [ ] Task: Adicionar `mercadopago-sdk-java` ao `pom.xml`.
- [ ] Task: Implementar `MercadoPagoService` para geração de pagamentos.
- [ ] Task: Configurar as credenciais do Mercado Pago no `application.yml`.

## Phase 3: Lógica de Compra e Seleção de Lote
- [ ] Task: Implementar `BatchSelectionService` para encontrar o lote ativo.
- [ ] Task: Implementar `TicketService` com a lógica de compra (ACID transacional).
- [ ] Task: Escrever testes unitários para a lógica de seleção de lote e compra.

## Phase 4: Webhooks e Confirmação
- [ ] Task: Implementar endpoint de Webhook para notificações do Mercado Pago.
- [ ] Task: Atualizar status do ingresso para `PAID` e disparar evento de confirmação.
- [ ] Task: Geração da URL do QR Code (Mock ou real para o checkout).
