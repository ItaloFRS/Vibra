# Plano de Implementação: Refatoração do Filtro do Motor de Match

## Phase 1: Backend - Transferência de Lógica e Logs (Service Layer)
- [x] Task: Escrever testes unitários (TDD) para o `MatchService` simulando a filtragem em memória por idade, gênero e a presença de logs detalhados para candidatos recusados.
- [x] Task: Atualizar o Repositório (ex: `UserEventInterestRepository`) para remover os filtros rigorosos de JSONB, buscando todos os usuários interessados no evento (ampliando a base).
- [x] Task: Implementar a lógica de filtragem cruzada (Idade e Gênero) e a ordenação por pontuação de "Vibes" dentro do `MatchService` em Java, incluindo logs de depuração (DEBUG) precisos para cada etapa da recusa.
- [x] Task: Conductor - User Manual Verification 'Backend - Transferência de Lógica e Logs' (Protocol in workflow.md)

## Phase 2: Backend & Frontend - Feedback de Perfil Incompleto
- [x] Task: Atualizar a API no Backend que retorna os potenciais matches para validar o JSONB de preferências do usuário requisitante e retornar uma mensagem/status específico se o perfil estiver incompleto (detalhando o que falta: Idade, Gênero, etc.).
- [x] Task: Escrever testes unitários (TDD) no Frontend (`MatchTab.tsx`) para garantir que o componente reaja adequadamente a essa nova resposta da API, exibindo o aviso.
- [x] Task: Atualizar o `MatchTab.tsx` (App Mobile) para ler a resposta de "Perfil Incompleto" da API, exibir a mensagem clara de "Falta X" e fornecer o botão com o caminho/redirecionamento correto para a aba de Perfil (`/(tabs)/profile`).
- [x] Task: Conductor - User Manual Verification 'Backend & Frontend - Feedback de Perfil Incompleto' (Protocol in workflow.md)
