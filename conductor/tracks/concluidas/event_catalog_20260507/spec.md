# Specification: Catálogo de Eventos (web-home)

## Overview
Criação de uma página de catálogo de eventos cinematográfica e moderna no aplicativo `web-home`, inspirada em plataformas de streaming como Netflix e Apple TV. O foco é a descoberta visual e a conversão para compra de ingressos, com forte ênfase em motion design premium e profundidade visual.

## Functional Requirements
- **Hero Banner:** Destaque de eventos principais com background dinâmico e parallax.
- **Calendário de Eventos:** Navegação horizontal por datas abrangendo até 6 meses.
- **Sistema de Filtros:** Sidebar com glassmorphism (desktop) ou drawer (mobile) para filtragem por categoria, cidade, preço, etc.
- **Event Rows (Netflix Style):** Listas horizontais categorizadas com scroll suave e drag support.
- **Hover Expand Cards:** Cards de evento que expandem ao passar o mouse, revelando informações detalhadas e elevando a profundidade visual.
- **Responsividade:** Experiência completa em desktop e adaptada para gestos de toque no mobile.
- **Dados:** Utilização de dados estáticos (Mock) para esta fase.

## Non-Functional Requirements
- **Tech Stack:** Next.js, React, Tailwind CSS, Framer Motion, Lenis Scroll.
- **Performance:** Virtualização de listas e lazy loading de imagens (GPU Optimized).
- **UI/UX:** Dark mode predominante, glassmorphism leve, alta sensação de profundidade e motion fluido.

## Acceptance Criteria
- Banner principal funcional com transição entre eventos em destaque.
- Calendário horizontal permite selecionar datas e filtrar visualmente os cards.
- Cards expandem suavemente no hover sem quebrar o layout (empurrando vizinhos).
- Scroll horizontal funciona via mouse, drag e wheel.
- Página 100% responsiva seguindo as diretrizes de mobile.

## Out of Scope
- Integração real com API do backend (foco em UI/UX com mocks).
- Sincronização de filtros com a URL (query params).