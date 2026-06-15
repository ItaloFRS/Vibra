# Specification: Aba Explorar e Refatoração da Home

## Overview
Criação de uma nova aba "Explorar" no aplicativo mobile (B2C) dedicada à descoberta e busca de próximos eventos. A listagem geral de "Próximos Eventos" será removida da tela Home atual, que passará a exibir apenas eventos em destaque/patrocinados.

## Functional Requirements
1.  **Nova Aba "Explorar"**:
    *   Adicionar uma nova tab na barra de navegação inferior (Bottom Tabs), posicionada como a segunda aba, logo após a Home.
    *   A aba deve conter uma funcionalidade de busca avançada.
    *   A busca deve permitir pesquisa por texto (nome do evento/produtor) e filtros (categoria, data, localização).
    *   A tela deve listar os próximos eventos baseados na busca/filtros aplicados, seguindo o design do Stitch (referência: "Próximos Eventos" ID: `1012f4a638b348fb937c1f9003c1410c` e "Home - Explorar" ID: `366800ef83b445d595ec1b45a7b572da`).

2.  **Refatoração da Tela Home**:
    *   Remover a seção/lista longa de "Próximos Eventos".
    *   A Home deve manter apenas a exibição de Eventos em Destaque (carrossel de banners/eventos patrocinados) para otimizar o fluxo e direcionar a exploração profunda para a nova aba.

## Non-Functional Requirements
*   **Fidelidade Stitch:** A nova tab "Explorar" deve utilizar os componentes e tokens de design já estabelecidos no `tailwind.config.js` conforme os protótipos do Google Stitch.
*   **Performance:** A busca avançada deve utilizar debounce para evitar chamadas excessivas à API via TanStack Query.
*   **Acessibilidade:** Garantir que o campo de busca e os botões de filtro sejam acessíveis via leitores de tela.

## Acceptance Criteria
*   O usuário consegue navegar para a nova aba "Explorar" usando a Bottom Tab Bar.
*   Na aba "Explorar", o usuário pode buscar eventos por texto e aplicar filtros de data, localização ou categoria.
*   A tela Home não exibe mais a lista genérica de próximos eventos, focando apenas nos destaques/carrossel inicial.
*   As rotas no Expo Router (`apps/mobile/src/app/(tabs)`) refletem a nova estrutura de abas.