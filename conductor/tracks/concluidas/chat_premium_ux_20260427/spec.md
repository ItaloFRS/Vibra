# Especificação: UX Premium da Tela de Mensagens (Feature)

## Visão Geral
Esta track visa reformular a experiência do usuário (UX) e o design visual (UI) da tela de mensagens (`chats.tsx`), inspirando-se em padrões premium e consagrados no mercado (ex: WhatsApp). O foco é garantir uma navegação intuitiva com organização cronológica, destaque visual evidente para mensagens não lidas e um indicador global confiável na TabBar do aplicativo.

## Requisitos Funcionais
1. **Organização e Layout da Lista de Chats (Frontend):**
   - A lista de conversas deve ser ordenada pela data/hora da última mensagem (a mais recente no topo).
   - A separação entre as conversas deve utilizar linhas divisórias finas horizontais, que se iniciam alinhadas à caixa de texto (abaixo do nome), não tocando a borda esquerda (estilo WhatsApp), promovendo uma leitura mais limpa.
   - O resumo (preview) da última mensagem deve ser exibido logo abaixo do nome do contato.

2. **Destaque Visual para Não Lidas (Frontend):**
   - Conversas contendo mensagens não lidas devem receber destaque duplo:
     - O texto principal (nome ou preview) deve ter tipografia em negrito (bold/extrabold).
     - A célula inteira do chat deve apresentar um fundo levemente destacado (ex: `bg-primary/5`).
     - A presença do badge (bolinha ou círculo numerado com a cor primária) deve ser mantida ao lado do avatar ou da data, facilitando o escaneamento visual rápido.

3. **Badge Global de Notificação na TabBar (Backend e Frontend):**
   - **Backend:** Criar um endpoint leve e otimizado (ex: `GET /social/chats/unread-count`) que retorne a contagem total de chats com mensagens não lidas para o usuário atual.
   - **Frontend:** Integrar esse endpoint na estrutura principal de abas (`apps/mobile/src/app/(tabs)/_layout.tsx`) utilizando o React Query, exibindo um badge circular com o número sobre o ícone de Mensagens.

## Critérios de Aceite
- [ ] A lista de conversas é ordenada corretamente da mais recente para a mais antiga.
- [ ] O layout exibe as linhas divisórias e as últimas mensagens de forma alinhada e clara.
- [ ] Conversas não lidas são identificadas instantaneamente por meio do fundo destacado, negrito e badge.
- [ ] Um novo endpoint de contagem de não lidos é implementado e validado por testes no backend.
- [ ] O ícone da TabBar exibe dinamicamente o número total de chats não lidos.
