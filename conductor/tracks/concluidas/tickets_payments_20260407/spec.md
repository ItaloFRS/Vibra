# Track Specification: Tickets & Payments

## Overview
Implementação do módulo transacional do **VIBRA** (`com.vibra.tickets`). Este módulo gerencia a venda de ingressos, seleção de lotes ativos, integração com Mercado Pago e geração de QR Codes.

## Principais Requisitos
- **Seleção de Lote:** Identificar o lote ativo (data atual entre `start_date` e `end_date` e estoque > 0).
- **Consistência ACID:** Uso de `@Transactional` para decrementar estoque de lotes.
- **Mercado Pago:** Integrar via `mercadopago-sdk-java`.
- **Status do Ingresso:** `PENDING`, `PAID`, `CANCELLED`.
- **Eventos:** Publicar `TicketConfirmedEvent` após confirmação do pagamento.

## Entidades Principais
- `Ticket`: Registro individual de compra vinculado a `User`, `Event` e `TicketBatch`.
- `TicketStatus`: Enum para o ciclo de vida do ingresso.

## Pontos Críticos
- O ingresso deve ser salvo como `PENDING` antes de chamar o Mercado Pago.
- O Webhook do Mercado Pago deve ser seguro e idempotente.
