# Especificação: Refatoração do Filtro do Motor de Match (Bug Fix)

## Visão Geral
Esta track visa corrigir o bug onde usuários com características compatíveis não aparecem na fila de match. A abordagem original (consultas nativas JSONB no banco de dados) provou ser muito restritiva e difícil de debugar quando os dados não estão perfeitamente formatados. O objetivo é mover a lógica de filtragem complexa (Idade e Gênero) para a camada de Serviço (Java), permitindo um diagnóstico detalhado e um tratamento amigável de perfis incompletos.

## Requisitos Funcionais
1. **Refatoração da Lógica de Consulta (Backend):**
   - O Repositório (DB) deve buscar de forma ampla todos os usuários que favoritaram ou têm ingresso para o evento, e que têm `wantsMatches: true`.
   - A filtragem rigorosa de Gênero (`gender` vs `matchGender`) e Faixa Etária (`age` vs `matchAgeMin`/`matchAgeMax`) deve ser transferida para o `MatchService` (Java).
   - O Serviço deve adicionar logs detalhados (Nível DEBUG) indicando por que um perfil foi rejeitado para o match atual, facilitando o rastreamento de falhas.

2. **Feedback Detalhado de Perfil Incompleto (Backend/Frontend):**
   - Se o usuário que está solicitando a fila de match não tiver o perfil completo (faltando idade, gênero ou vibes), a API deve retornar uma exceção de negócio ou um status específico informando *exatamente* quais campos faltam.
   - O Frontend (App Mobile) deve interceptar essa resposta e exibir um feedback claro (ex: "Falta preencher sua Idade para acessar o Match") e um botão/caminho direto para a tela de Perfil.

3. **Ordenação por Afinidade (Vibes):**
   - A lógica de ordenação por "Vibes" em comum continua ativa no Serviço (Java), pontuando a interseção de arrays e garantindo que quem tem mais em comum apareça primeiro.

## Critérios de Aceite
- [ ] O motor de match filtra corretamente usuários baseados nas preferências mútuas, processando a lógica no Java (Service).
- [ ] Usuários com perfis incompletos recebem uma mensagem clara do frontend detalhando o que falta preencher, com direcionamento para a tela de perfil.
- [ ] Os logs do backend demonstram claramente a razão da rejeição de cada candidato durante o processamento da fila de match.
