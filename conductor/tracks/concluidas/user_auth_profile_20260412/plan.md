# Implementation Plan: Cadastro e Perfil do Usuário

## Phase 1: Cadastro de Usuário (Sign Up)
- [x] **Task 1: Rota e UI de Cadastro**
  - Criar `apps/mobile/src/app/(auth)/register.tsx`.
  - Implementar formulário conforme Stitch ID `625c521e467e4bc0b8c08b653eb66bb4`.
  - Adicionar validações com Zod (nome, e-mail, senha forte).
- [x] **Task 2: Integração com Identity API**
  - Configurar chamada para `POST /auth/register`.
  - Forçar envio de `role: "USER"`.
  - Lógica de login automático após cadastro com sucesso.

## Phase 2: Perfil e Mídia
- [x] **Task 3: Upload de Foto de Perfil**
  - Integrar `expo-image-picker`.
  - Implementar serviço de upload para Cloudinary (via Backend ImageService).
  - Feedback visual de carregamento da imagem.
- [x] **Task 4: Edição de Perfil**
  - Implementar tela `apps/mobile/src/app/(tabs)/profile.tsx` conforme Stitch ID `7e04616232cb4943b633138edd26558b`.
  - Permitir edição de Bio e visualização de dados básicos.

## Phase 3: Configurações e Preferências
- [x] **Task 5: Preferências de Match (JSONB)**
  - Interface para selecionar estilos musicais e interesses.
  - Sincronização com a coluna `preferences` do banco.
- [x] **Task 6: Logout e Segurança**
  - Implementar botão de Sair com limpeza do SecureStore.
  - Testar proteção de rotas autenticadas.
