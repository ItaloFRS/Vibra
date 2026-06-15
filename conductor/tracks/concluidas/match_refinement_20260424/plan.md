# Plano de Implementação: Refinamento do Match

## Phase 1: Backend - Consultas e Filtros (com.vibra.social)
- [ ] Task: Escrever testes unitários (TDD) para o repositório de Match
    - [ ] Criar mock de dados JSONB para testar os filtros de gênero e idade.
- [ ] Task: Implementar as consultas otimizadas no `UserEventInterestRepository` ou `MatchRepository`
    - [ ] Criar query nativa/JPQL utilizando operadores JSONB (`->>`, `@>`) para filtrar estritamente a faixa etária (`matchAgeMin`, `matchAgeMax`) e o Gênero desejado.
    - [ ] Filtrar usuários com `wantsMatches: false` ou preferências incompletas.
- [ ] Task: Conductor - User Manual Verification 'Backend - Consultas e Filtros' (Protocol in workflow.md)

## Phase 2: Backend - Lógica de Ordenação por Afinidade
- [ ] Task: Escrever testes unitários para a lógica de ordenação por Vibes no Service
    - [ ] Validar que usuários com mais vibes em comum aparecem no início da lista.
- [ ] Task: Implementar algoritmo de interseção no `MatchService` ou via Query
    - [ ] Recuperar a lista filtrada (da Phase 1).
    - [ ] Aplicar lógica para comparar o array de vibes do usuário atual com os sugeridos e pontuar as correspondências.
    - [ ] Ordenar a lista resultante descendentemente pelo score de afinidade.
- [ ] Task: Conductor - User Manual Verification 'Backend - Lógica de Ordenação por Afinidade' (Protocol in workflow.md)

## Phase 3: Frontend - Bloqueios de UX e Validação
- [ ] Task: Testar a API de fila de match no App Mobile (B2C)
- [ ] Task: Implementar UI de feedback de "Perfil Incompleto"
    - [ ] Atualizar a tela da aba Vibra Match (Stitch: fa97fb1da3af4361a76ceaf60b8fe751) para checar se o usuário possui todas as prefs preenchidas (Idade, Gênero, Vibes).
    - [ ] Se incompletas ou `wantsMatches` false, renderizar um banner convidando a "Completar o Perfil / Ativar Matches".
- [ ] Task: Conductor - User Manual Verification 'Frontend - Bloqueios de UX e Validação' (Protocol in workflow.md)