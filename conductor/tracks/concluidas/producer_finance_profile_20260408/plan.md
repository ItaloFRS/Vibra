# Implementation Plan: Hub Financeiro & Perfil

## Phase 1: Perfil do Produtor (Identity Management)
- [ ] **Task 1: Criar Página de Perfil no Frontend**
  - Formulário de edição de dados (Nome, CPF/CNPJ, Bio).
  - Implementar upload de Logo e Banner (Cloudinary).
- [ ] **Task 2: Endpoints de Perfil no Backend**
  - Adicionar campos de endereço/CNPJ à entidade `User`.
  - Criar `ProfileController` e `ProfileService`.
- [ ] **Task 3: Integração de Perfil**
  - Conectar frontend com os novos endpoints.
  - *Checkpoint: Perfluxo de edição de perfil funcionando com imagens.*

## Phase 2: Backend Financeiro (Data Aggregation)
- [ ] **Task 4: Lógica de Cálculo de Taxas e Lucro**
  - Implementar no `AdminService` a lógica de receita líquida (Bruta - Taxa).
- [ ] **Task 5: Endpoint de Resumo Financeiro**
  - `GET /api/v1/admin/finances/summary`.
- [ ] **Task 6: Endpoint de Extrato de Vendas**
  - `GET /api/v1/admin/finances/transactions` (Paginado).
- [ ] **Task 7: Configuração de Dados Bancários**
  - Persistência de dados de payout (PIX/Conta).

## Phase 3: Hub Financeiro UI (Business Intelligence)
- [ ] **Task 8: Página de Finanças (Overview)**
  - Cards de Saldo e Gráficos de comparativo Bruto/Líquido.
- [ ] **Task 9: Tabela de Transações (Extrato)**
  - Implementar listagem rica com filtros por data e evento.
- [ ] **Task 10: Solicitação de Saque (Simulação/MVP)**
  - Botão para solicitar payout baseado no saldo disponível.

## Phase 4: Segurança & Polimento
- [ ] **Task 11: Alteração de Senha**
  - Modal de segurança para mudar credenciais.
- [ ] **Task 12: Refinamento de UX**
  - Tooltips explicativos sobre as taxas da plataforma.
- [ ] **Task 13: Validação Final**
  - Testes unitários para cálculos financeiros.
