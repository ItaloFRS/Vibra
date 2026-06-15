# Implementation Plan: Meus Ingressos & Integração Backend (web-home)

Este plano detalha as etapas para integrar o frontend `web-home` com o backend e criar a página de "Meus Ingressos".

## Fase 1: Infraestrutura de API e Tipagem
- [ ] Task: Definir interfaces TypeScript para `Event`, `Ticket`, `TicketType` e `User` baseadas nas entidades do backend.
- [ ] Task: Criar hooks customizados usando TanStack Query para fetching de dados (`useEvents`, `useEventBySlug`, `useUserTickets`).
- [ ] Task: Configurar Axios interceptor para gerenciar tokens JWT do Cookies (HttpOnly) conforme definido na Tech Stack.
- [ ] Task: Conductor - User Manual Verification 'Fase 1: Infraestrutura de API e Tipagem' (Protocol in workflow.md)

## Fase 2: Integração da Home e Carrossel
- [ ] Task: Escrever testes (Vitest) para o componente de Carrossel verificando estados de loading e erro.
- [ ] Task: Refatorar `EventCarousel` para consumir dados reais do backend via TanStack Query.
- [ ] Task: Implementar Skeletons para o Carrossel durante o carregamento.
- [ ] Task: Conductor - User Manual Verification 'Fase 2: Integração da Home e Carrossel' (Protocol in workflow.md)

## Fase 3: Página de Listagem de Eventos e Filtros
- [ ] Task: Implementar lógica de busca textual conectada à API.
- [ ] Task: Integrar filtros de categoria dinâmicos vindos do backend.
- [ ] Task: Implementar filtro de geolocalização usando a localização do navegador e enviando coordenadas para a API.
- [ ] Task: Escrever testes de integração para os filtros da página de eventos.
- [ ] Task: Conductor - User Manual Verification 'Fase 3: Página de Listagem de Eventos e Filtros' (Protocol in workflow.md)

## Fase 4: Página de Detalhes do Evento
- [ ] Task: Refatorar a página `/eventos/[slug]` para carregar dados reais do backend.
- [ ] Task: Integrar a lista de lotes/ingressos (`TicketSelector`) com os dados reais do backend.
- [ ] Task: Garantir que as animações de entrada e parallax funcionem com o carregamento assíncrono.
- [ ] Task: Conductor - User Manual Verification 'Fase 4: Página de Detalhes do Evento' (Protocol in workflow.md)

## Fase 5: Página Meus Ingressos
- [ ] Task: Criar a rota `/meus-ingressos` e o componente de página básico.
- [ ] Task: Desenvolver o layout Glassmorphism para a listagem de ingressos.
- [ ] Task: Implementar o componente `TicketCard` premium com QR Code (usando biblioteca como `qrcode.react`).
- [ ] Task: Adicionar proteção de rota (redirecionar para login se não autenticado).
- [ ] Task: Escrever testes de UI para a página de Meus Ingressos.
- [ ] Task: Conductor - User Manual Verification 'Fase 5: Página Meus Ingressos' (Protocol in workflow.md)

## Fase 6: Polimento e Finalização
- [ ] Task: Realizar auditoria de performance e garantir que as transições de página sejam fluidas.
- [ ] Task: Validar responsividade em dispositivos mobile.
- [ ] Task: Conductor - User Manual Verification 'Fase 6: Polimento e Finalização' (Protocol in workflow.md)