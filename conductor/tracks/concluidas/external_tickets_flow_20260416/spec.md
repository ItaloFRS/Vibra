# Specification: Reformulação do Fluxo de Ingressos (Venda Externa e Importação)

## Overview
Esta trilha modifica o fluxo principal de venda de ingressos do Vibra. A venda direta (transacional) no app será desativada temporariamente. Em vez disso, o app redirecionará os usuários para os sites de vendas das produtoras. O Dashboard do Produtor será atualizado para refletir essa mudança. Adicionalmente, a "Carteira de Ingressos" (Meus Ingressos) ganhará uma funcionalidade robusta de importação de PDFs/Imagens de ingressos comprados externamente, com extração inteligente de dados (OCR/QR Code) via backend, edição local de dados e suporte offline nativo.

## Functional Requirements

### 1. Dashboard Web B2B (Produtor)
*   **Cadastro de Evento (Nova Entrada):** Adicionar um campo de "Link Externo para Venda de Ingressos" no formulário de criação/edição de eventos.
*   **Seção de Lotes/Ingressos Oculta:** A seção atual de definição de tipos e lotes de ingressos deve ser desfocada (blur) ou desativada visualmente.
*   **Mensagem de Aviso:** Exibir uma mensagem clara e padronizada sobre a seção desativada: "Funcionalidade de vendas de ingressos está prevista para o terceiro trimestre de 2026".

### 2. App Mobile B2C (Usuário Final)
*   **Aba Ingressos no Evento (Feed):** Remover a listagem de tickets e o fluxo de checkout interno (Mercado Pago).
*   **Redirecionamento Externo:** Substituir a listagem por um Botão/Card com a identidade visual do app que redirecione o usuário para o "Link Externo" cadastrado pelo produtor.
*   **UX do Link:** Ao clicar, o link da produtora deve abrir no navegador padrão do dispositivo móvel (Chrome/Safari).

### 3. Carteira de Ingressos (App Mobile)
*   **Localização:** A tela "Meus Ingressos" ficará na aba principal, ao lado da aba Perfil.
*   **Importação de Ingresso:** Adicionar botão/fluxo para o usuário carregar um arquivo PDF ou Imagem (JPEG/PNG) da galeria ou arquivos do celular.
*   **Processamento Inteligente:** Enviar o arquivo para o backend realizar a extração. O app deve exibir feedback de carregamento durante o processo.
*   **Renderização do Card:** Com os dados retornados pelo backend, gerar e exibir um card do ingresso (similar ao modelo da Home) na carteira.
*   **Ação de Abertura:** Ao clicar no card renderizado, o app deve exibir o arquivo original importado (PDF ou Imagem) em tela cheia.
*   **Edição Corretiva:** O usuário terá um botão para editar os dados extraídos pelo OCR (Hora, Local, Nome, Tipo). Essas edições ocorrerão e serão salvas **apenas localmente no dispositivo**.

### 4. Extração de Dados (Backend)
*   **Endpoint de Extração:** Criar uma rota (ex: `POST /api/v1/tickets/extract`) que receba o arquivo multipart (PDF ou Imagem).
*   **Tecnologia:** Utilizar bibliotecas locais do ecossistema Java (ex: ZXing para Imagens/QR Code, Apache PDFBox para PDFs e Tesseract OCR para textos).
*   **Dados Alvo:** O backend deve tentar extrair:
    *   Código do QR Code/Código de Barras (String).
    *   Local do evento.
    *   Horário/Data.
    *   Tipo do ingresso (ex: Pista, Camarote).
    *   Nome do titular.
*   **Retorno:** Devolver um DTO estruturado com os dados encontrados para o front-end.

### 5. Modo Offline (App Mobile)
*   A carteira de ingressos deve ser 100% funcional sem internet.
*   **Arquivos Originais:** PDFs ou Imagens carregados/processados devem ser armazenados localmente usando a API `expo-file-system`.
*   **Metadados:** Os dados extraídos do ingresso, o link do arquivo local (URI) e as possíveis edições feitas pelo usuário devem ser salvos localmente em um banco/storage robusto (AsyncStorage, SQLite ou similar).

## Non-Functional Requirements
*   **Segurança/Privacidade:** As imagens de ingressos enviados para extração no backend NÃO devem ser armazenadas permanentemente no servidor, sendo descartadas ou mantidas apenas em memória/temp-file durante o processo de leitura.
*   **Desempenho OCR:** O processamento OCR via Tesseract no Java deve ser otimizado para não causar timeouts no front-end. Considerar limites de tamanho de arquivo.

## Out of Scope
*   Integração direta com APIs de ticketeiras terceiras (Sympla, Ingresse, etc) para resgate automático. Todo resgate externo será via upload manual de PDF/Imagem pelo usuário.