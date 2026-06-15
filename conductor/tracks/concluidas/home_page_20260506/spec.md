# Specification: Home Page (Landing Page) Vibra

## 1. Overview
Desenvolvimento da Home (Landing Page) moderna e imersiva para a plataforma Vibra. O objetivo é criar uma experiência premium com foco em conversão para download do app, utilizando motion design avançado.

## 2. Architecture
- **Aplicação:** Novo app Next.js (para SEO e Performance) localizado em `apps/web-home`.
- **Framework:** Next.js + React.
- **Estilização:** Tailwind CSS (mesma paleta de cores do Mobile/Dashboard).
- **Animações:** Framer Motion (para UI transitions) e Remotion (para scroll-driven animations e video logic).

## 3. Global Design Principles
- **Estilo:** 3D UI, Glassmorphism, Dark Mode.
- **Visual:** Clean, minimalista e tecnológico.
- **Motion:** Suave, com easing refinado.
- **Performance:** Otimizado (lazy loading + GPU friendly).
- **Responsividade:** Mobile-first.

## 4. Functional Requirements (Sections)

### 4.1. Navbar
- **Comportamento:** Fixo no topo. Transparente na posição inicial, tornando-se sólido (glass effect) ao realizar o scroll.
- **Referência:** mastercard.com/businessoutcomes

### 4.2. Section 1 - Hero
- **Estrutura:** Hero full screen (100vh).
- **Background:** Vídeo em loop (utilizar placeholder inicial), overlay escuro para contraste.
- **Elementos:** Headline central forte e CTA principal (Download/Explorar).
- **Motion:**
  - Animação de entrada: Tela branca -> Logo centralizada -> Logo expande (reveal) -> Transição para a Hero.
  - Parallax leve no vídeo (gerenciado pelo Remotion).
  - Fade + scale nos elementos.

### 4.3. Section 2 - App CTA
- **Estrutura:** Dois mockups grandes (iPhone + Android) flutuantes.
- **Elementos:** Título chamativo, subtítulo e botões (App Store, Google Play).
- **Motion:** Floating animation, scroll reveal (fade + translateY) e micro-interações nos botões.

### 4.4. Section 4 - Event Wallet (Carteira)
- **Estrutura:** Pilha de tickets interativa, título e descrição.
- **Interação:** Scroll controla a pilha (tickets empilham/desempilham com efeito de profundidade 3D).
- **Motion:** Scroll-driven animation utilizando Remotion para suavização e interpolação.

### 4.5. Section 5 - Event Carousel
- **Estrutura:** Carrossel infinito horizontal de cards de eventos (imagem + título).
- **Elementos:** Botão "Ver todos os eventos".
- **Motion:** Loop infinito suave, hover nos cards (scale + depth).

## 5. Non-Functional Requirements
- **Performance:** Uso de lazy loading para os assets pesados (vídeo da hero) e otimização de imagens.
- **SEO:** Estrutura semântica e SSR/SSG providos pelo Next.js.