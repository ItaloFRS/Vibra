# Specification: Refinamento de Chats (Real-time e Layout)

## Overview
Esta trilha visa transformar a experiência de chat do Vibra em um sistema verdadeiramente fluido e em tempo real, eliminando a necessidade de sair e entrar na tela para ver novas mensagens. Além disso, o layout do chat individual será completamente refatorado para seguir o Design System "Editorial Stone" do Google Stitch, corrigindo inconsistências visuais atuais.

## Functional Requirements
### 1. Comunicação Real-time (STOMP over WebSocket)
- **Atualização Instantânea:** Mensagens devem ser injetadas no estado local e renderizadas assim que recebidas via WebSocket, tanto em chats individuais quanto em canais de comunidade.
- **Status de Digitação:** Implementar sinalização visual ("Usuário está digitando...") disparada por eventos de WebSocket.
- **Recibos de Leitura:** Adicionar confirmação visual (ex: ícone de check duplo) quando as mensagens forem entregues/lidas.
- **Eventos de Sistema:** Em chats de comunidade, exibir mensagens automáticas quando novos membros entram no canal.

### 2. Refinamento de Layout (Fidelidade Stitch)
- **Estilo Editorial Stone:** Refatorar bolhas de mensagens, tipografia (Plus Jakarta Sans) e cores (paleta Stone) para alinhar com o protótipo de alta fidelidade.
- **Header e Input:** Ajustar o cabeçalho do chat (avatar, nome, status online) e a barra de entrada de texto para as dimensões e sombras exatas definidas no Stitch.
- **UX de Scroll:** Garantir que o chat abra sempre na mensagem mais recente e possua comportamento de "stick to bottom" ao receber novas mensagens.

### 3. Estrutura de Canais (Comunidade)
- Refinar a interface de navegação entre canais (estilo Discord) dentro do contexto do evento.

## Acceptance Criteria
- [ ] Mensagens enviadas de um aparelho A aparecem no aparelho B em menos de 100ms (em rede estável) sem refresh manual.
- [ ] O layout do chat individual é uma reprodução 1:1 do protótipo Stitch (Pixel-Perfect).
- [ ] Indicador de digitação aparece e desaparece corretamente conforme a ação do interlocutor.
- [ ] Recibos de leitura mudam de estado visual conforme o status da mensagem.

## Out of Scope
- Chamadas de áudio ou vídeo.
- Envio de arquivos pesados (PDF/Docs) - foco em texto e imagens simples (via Cloudinary).
