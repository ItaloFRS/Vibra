# Specification: Vibra Social - VIP, Chat Avançado e Directs

## Overview
Esta track complementa a experiência social do Vibra, finalizando as peças pendentes do Hub de Eventos (Aba VIP), refinando os canais de comunidade (estilo Discord) e introduzindo a mecânica de interações 1:1, seja via Match prévio ou via solicitação direta na comunidade (estilo Instagram Directs).

## Objetivos
1.  **Aba VIP:** Interface exclusiva para portadores de ingressos VIP, com layout Premium e acessos dedicados.
2.  **Chat Pro (Comunidade):** Refinamento visual do chat em grupo, com suporte a metadados, feedback de digitação e melhorias de UI baseadas no Stitch.
3.  **Perfil Público & Descoberta:** Permitir que o usuário clique no avatar de alguém na comunidade para ver seu Perfil Público (Nome, Bio, Vibes).
4.  **Solicitações de Mensagem (Directs):**
    -   Se há Match: O chat é liberado imediatamente.
    -   Se não há Match: O botão no perfil público envia uma "Solicitação de Mensagem". O alvo deve aceitar na área de notificações/solicitações antes do chat ser aberto.
5.  **Caixa de Entrada (Inbox):** Lista de chats individuais ativos e aba de solicitações pendentes.

## Telas do Stitch Referência
-   Aba VIP (Laranja) – `916e4ff98ed84ff8b0567f982712a6c7`
-   Chat Individual (Elena) – `f1192dd7d0274465aade63d476a25944`
-   Conversas e Mensagens (Inbox/Solicitações) – `596a1a4b4db2432993c7949bd046dea1`

## Regras de Negócio Críticas
-   **Aba VIP:** Só pode ser acessada se o usuário possuir um ingresso no backend. Se não for, deve exibir um upsell para comprar.
-   **Solicitações de Mensagem:** A entidade de `MessageRequest` (ou status pendente no `Match`/`ChatRoom`) deve ser criada no backend. O remetente não pode enviar novas mensagens até que a solicitação seja aceita.
-   **Privacidade:** O perfil público não deve exibir dados sensíveis como e-mail ou CPF. Apenas Foto, Nome, Bio e Preferências.
