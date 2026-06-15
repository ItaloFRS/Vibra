# Specification: Meus Ingressos & Integração Backend (web-home)

## Visão Geral
Esta track foca na criação da área logada do usuário para visualização de seus ingressos e na integração completa das páginas principais do `web-home` com os endpoints reais do backend Java (Spring Boot). O objetivo é transformar o site de estático/mock para uma plataforma funcional e conectada.

## Objetivos
- Implementar a página "Meus Ingressos" com design Glassmorphism Premium.
- Conectar o carrossel da Home com a API de eventos (ordem cronológica).
- Implementar filtros reais (Busca, Categorias, Geolocation) na listagem de eventos.
- Exibir dados reais de eventos e tipos de ingressos na página de detalhes.

## Requisitos Funcionais
1. **Página Meus Ingressos:**
   - Exibir lista de ingressos comprados pelo usuário (Status: PAID).
   - Visualização premium de cada ticket com detalhes do evento e QR Code.
   - Estado vazio (Empty State) amigável se o usuário não tiver ingressos.
2. **Integração Home:**
   - Carrossel dinâmico consumindo `/api/events` ordenado por data.
3. **Página de Listagem de Eventos:**
   - Integração com endpoint de busca e filtros.
   - Implementação de `useLocation` para filtro de geolocalização.
4. **Página de Detalhes do Evento:**
   - Carregamento de dados via `slug` ou `id`.
   - Listagem dinâmica de lotes/tipos de ingressos disponíveis via backend.

## Requisitos Não-Funcionais
- **Performance:** Uso de Skeletons para estados de carregamento.
- **Cache:** Utilização do TanStack Query para gerenciar o estado das requisições.
- **Tipagem:** Interfaces TypeScript estritas para todas as respostas da API.

## Critérios de Aceitação
- [ ] O carrossel da Home reflete as mudanças feitas no banco de dados do backend.
- [ ] A busca na página de eventos retorna resultados precisos do backend.
- [ ] O usuário consegue visualizar seus ingressos comprados após o login.
- [ ] Todas as animações Framer Motion são mantidas durante a integração.

## Fora de Escopo
- Fluxo de pagamento real (será tratado em track futura).
- Edição de perfil de usuário.