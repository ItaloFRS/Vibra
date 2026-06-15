# Plano de Implementação: Refinamento de Cadastro e Perfil

## Phase 1: Backend - Infraestrutura e Modelagem (com.vibra.identity)
- [x] Task: Atualizar a entidade `User` e repositórios
    - [x] Adicionar campos para status de e-mail verificado (booleano) e armazenar o código temporário.
    - [x] Garantir que a coluna `preferences` (JSONB) suporte os campos "idade", "genero", "vibes" e "preferencias_match".
- [x] Task: Criar serviços de integração externa
    - [x] Criar classe de serviço para integração com API Externa de CPF.
    - [x] Criar classe de serviço para envio de E-mails transacionais (Spring Mail).
    - [x] Configurar SDK Admin do Firebase para validação de tokens (Google Login).
- [ ] Task: Escrever testes unitários (TDD)
    - [ ] Testes unitários para o `CPFService` e `EmailService`.
    - [ ] Testes unitários para garantir que o modelo `User` lida corretamente com as novas informações em `preferences`.
- [ ] Task: Conductor - User Manual Verification 'Backend - Infraestrutura e Modelagem' (Protocol in workflow.md)

## Phase 2: Backend - Regras de Negócio e Controladores (com.vibra.identity)
- [ ] Task: Implementar lógica de Autenticação e Cadastro
    - [ ] Implementar validação de senha forte (Regex).
    - [ ] Implementar lógica de geração e validação do código de e-mail de 6 dígitos com expiração.
    - [ ] Implementar fluxo de autenticação com o Google via Firebase token.
- [ ] Task: Criar e atualizar Endpoints (Controllers)
    - [ ] Atualizar endpoint de Registro `/api/auth/register` para aceitar os novos dados e disparar o e-mail.
    - [ ] Criar endpoint `/api/auth/verify-email` para validar o código de 6 dígitos.
    - [ ] Criar endpoint `/api/auth/google-login` para tratar o login via Firebase.
    - [ ] Atualizar endpoint de Perfil `/api/users/profile` para permitir a edição das preferências (vibes, gênero, faixa etária).
- [ ] Task: Escrever testes de integração
    - [ ] Testar todos os endpoints de Autenticação, Cadastro e Perfil com requisições HTTP mockadas.
- [ ] Task: Conductor - User Manual Verification 'Backend - Regras de Negócio e Controladores' (Protocol in workflow.md)

## Phase 3: Frontend (App Mobile B2C)
- [ ] Task: Integração Firebase Auth
    - [ ] Configurar e inicializar o SDK do Firebase Auth no aplicativo Expo.
    - [ ] Implementar a função de login com Google chamando o provedor do Firebase e enviando o token gerado para a API do Vibra.
- [ ] Task: Atualizar Tela de Cadastro
    - [ ] Refatorar a tela de cadastro para incluir validação local de senha forte.
    - [ ] Integrar a chamada para validação do CPF via API.
    - [ ] Adicionar formulário extra (DatePicker para idade, seleção de gênero, tags de Vibes e slider para faixa etária de Match).
- [ ] Task: Criar Tela de Verificação de E-mail
    - [ ] Implementar tela com input de 6 dígitos para o código de ativação, incluindo temporizador (countdown) para expiração.
- [ ] Task: Atualizar Tela de Perfil e Configurações
    - [ ] Implementar inputs na tela de Perfil para que o usuário edite suas preferências (Vibes, Faixa Etária e Gênero do Match).
    - [ ] Conectar as edições ao endpoint de atualização de perfil da API via React Query.
- [ ] Task: Verificação de Fidelidade Stitch
    - [ ] Garantir que as telas de "Cadastro (Final)" (625c521e467e4bc0b8c08b653eb66bb4) e "Perfil e Configurações" (7e04616232cb4943b633138edd26558b) sigam o protótipo.
- [ ] Task: Conductor - User Manual Verification 'Frontend (App Mobile B2C)' (Protocol in workflow.md)