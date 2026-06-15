# Especificação: Refinamento do Match e Filtros de Preferência

## Visão Geral
Esta track foca no aprimoramento do motor de recomendações do Vibra Match. Atualmente, usuários que demonstram interesse em um evento entram na fila de match. O objetivo desta atualização é utilizar as preferências salvas no perfil do usuário (campo `preferences` JSONB) para realizar uma filtragem estrita (por Gênero e Faixa Etária) e uma ordenação inteligente (por "Vibes" em comum), melhorando a relevância das conexões e a experiência na plataforma.

## Requisitos Funcionais
1. **Filtros Restritivos (Gênero e Faixa Etária):** 
   - Apenas usuários que atendam mutuamente aos critérios de `matchGender`, `matchAgeMin` e `matchAgeMax` definidos nas preferências de ambos devem aparecer na fila de match um do outro.
   - O filtro "Todos" no campo `matchGender` deve ignorar a restrição de gênero e exibir qualquer pessoa que atenda aos critérios de idade.
2. **Ordenação por Afinidade (Vibes):**
   - As "Vibes" não devem atuar como um filtro restritivo, mas sim como um peso de priorização na ordenação da fila de match.
   - Usuários com um maior número de "vibes" em comum devem aparecer mais cedo (no topo) da fila.
   - Usuários sem vibes em comum ainda aparecerão na fila, mas com prioridade mais baixa (no final).
3. **Exigência de Preenchimento:**
   - Usuários que não tenham o perfil completo com as preferências de match ou que tenham desativado o "Vibra Match" (`wantsMatches: false`) não devem ser retornados nas consultas e receberão uma tela/aviso indicando a necessidade de preencher o perfil para acessar o recurso.
4. **Otimização no Banco de Dados:**
   - A filtragem restritiva (Gênero, Idade) e a extração do JSONB devem ser realizadas o máximo possível no nível do banco de dados PostgreSQL usando consultas nativas ou JPQL otimizado (JSONB operators), garantindo escalabilidade. A ordenação por afinidade pode envolver lógica híbrida (DB + Service Layer), mas priorizando o banco.

## Critérios de Aceite
- [ ] Usuários fora da faixa etária ou gênero de interesse estipulados não aparecem na fila de match de um evento.
- [ ] A fila de match é renderizada ordenando as sugestões com base na interseção do array de "vibes" (maior interseção primeiro).
- [ ] Usuários sem as chaves necessárias no JSONB `preferences` são barrados do match e invisíveis para os demais, sendo redirecionados para completar o perfil.
- [ ] As regras são aplicadas usando PostgreSQL JSONB queries (`@Query` no Spring Data JPA) para minimizar a transferência de dados e consumo de memória no Java.