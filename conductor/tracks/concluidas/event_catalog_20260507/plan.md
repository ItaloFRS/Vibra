# Implementation Plan: Catálogo de Eventos (web-home)

## Phase 1: Research & Setup
- [x] Task: Definir estrutura de dados Mock para eventos e categorias.
- [x] Task: Criar tipos/interfaces TypeScript para os eventos.
- [x] Task: Configurar layout base da página em `apps/web-home/src/app/eventos/page.tsx`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Research & Setup' (Protocol in workflow.md)

## Phase 2: Hero & Foundation
- [x] Task: Desenvolver componente `EventHero` com parallax e background dinâmico.
- [x] Task: Implementar transição automática entre eventos em destaque no Hero.
- [x] Task: Testar componente `EventHero` (Unit Tests).
- [x] Task: Conductor - User Manual Verification 'Phase 2: Hero & Foundation' (Protocol in workflow.md)

## Phase 3: Interactivity & Navigation
- [x] Task: Desenvolver componente `EventCalendar` horizontal (alcance de 6 meses). -> *Refinado para Grid na Sidebar conforme solicitado.*
- [x] Task: Implementar lógica de filtragem por data no calendário.
- [x] Task: Criar componente `EventFilters` (Sidebar Desktop / Drawer Mobile).
- [x] Task: Testar filtros e navegação do calendário (Unit/Integration Tests).
- [x] Task: Conductor - User Manual Verification 'Phase 3: Interactivity & Navigation' (Protocol in workflow.md)

## Phase 4: Cinematic Experience
- [x] Task: Desenvolver `EventRow` com scroll horizontal (momentum/drag/wheel).
- [x] Task: Implementar `EventCard` com animação de expansão imersiva (estilo Netflix).
- [x] Task: Garantir que o hover expansion empurre os cards vizinhos suavemente.
- [x] Task: Adicionar `ExpandedEventCard` com informações detalhadas e CTA.
- [x] Task: Testar interações de hover e scroll (Unit/Interaction Tests).
- [x] Task: Conductor - User Manual Verification 'Phase 4: Cinematic Experience' (Protocol in workflow.md)

## Phase 5: Final Polish & Responsiveness
- [x] Task: Integrar `Lenis Scroll` para scroll suave em toda a página.
- [x] Task: Adaptar hover expand para interações touch no mobile (Bottom Sheet/Tap).
- [x] Task: Implementar Skeleton Loading e Lazy Loading de imagens.
- [x] Task: Auditoria final de fidelidade visual e performance (GPU acceleration).
- [x] Task: Conductor - User Manual Verification 'Phase 5: Final Polish & Responsiveness' (Protocol in workflow.md)

## Phase 6: Refinements & Fixes
- [x] Task: Implementar seletor de localização no topo da sidebar (device-based com opção de troca).
- [x] Task: Corrigir largura da sidebar de filtros para 30% e garantir posicionamento sticky.
- [x] Task: Corrigir visibilidade dos dados no hover do `EventCard` (ajustar lógica de expansão/altura).
- [x] Task: Validar responsividade e espaçamento geral após os ajustes.
- [x] Task: Conductor - User Manual Verification 'Phase 6: Refinements & Fixes' (Protocol in workflow.md)

