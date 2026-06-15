# Specification: Fluxo de Compra de Ingressos Premium (web-home)

## Visão Geral
Criar uma experiência premium de compra de ingressos para a plataforma Vibra, integrando-se ao `web-home`. A experiência deve ser visualmente cinematográfica, fluida e focada em conversão rápida.

## Objetivos
- Transmitir segurança, exclusividade e fluidez.
- Fluxo rápido: Evento → Ingresso → Carrinho → Pagamento.
- Design System: Dark mode premium, Glassmorphism, Motion suave.

## Estrutura da Página
1. **Hero do Evento:** Fullscreen parcial, cinematográfica, com parallax leve e reveal animations.
2. **Informações Detalhadas:** Descrição, LineUp (timeline visual), Horários, Localização. Cards glassmorphism.
3. **Seção de Ingressos:** Lista premium com badges (VIP, Open Bar, etc.), seleção dinâmica e adição ao carrinho.
4. **Fluxo de Autenticação:** Modal premium (glass) com login, cadastro e social login.
5. **Carrinho (Drawer):** Slide-in lateral com resumo, taxas e subtotal em tempo real.
6. **Checkout Multi-step (Modal):** 
   - Step 1: User Info (autocompletar se logado).
   - Step 2: Payment Method (PIX, Crédito, Apple/Google Pay).
   - Step 3: Payment Details (QR Code animado para PIX, form moderno para cartão).
   - Step 4: Review final.
7. **Sucesso da Compra:** Confirmação animada, preview do ticket com QR Code.

## Requisitos Técnicos
- **Framework:** Next.js (App Router).
- **Styling:** Tailwind CSS.
- **Animações:** Framer Motion (GPU optimized).
- **Forms:** React Hook Form + Zod.
- **UI Components:** Radix UI (Primitives).
- **Imagens:** Otimização via Cloudinary (lazy loading).

## Design System (Overrides para Checkout)
- **Background:** Dark mode profundo (#000000).
- **Layers:** Glassmorphism refinado (blur intenso, bordas sutis).
- **Accents:** Vibra Gradient (#8B5CF6 a #D946EF).
- **Typography:** Plus Jakarta Sans (tracking -2%).

## Componentes a serem desenvolvidos
- `EventPurchaseHero`
- `EventDetailsSection`
- `TicketSelector` / `TicketCard`
- `AuthModal` (`LoginForm`, `RegisterForm`)
- `CartDrawer`
- `PaymentModal` (`PaymentMethodSelector`, `PixPayment`, `CreditCardForm`)
- `PurchaseReview`
- `PurchaseSuccess`
