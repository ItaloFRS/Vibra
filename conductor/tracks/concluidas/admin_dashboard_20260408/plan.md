# Implementation Plan: Dashboard Admin (Web B2B)

Este plano detalha o passo a passo para a construção do painel administrativo do produtor, integrando o novo módulo backend `admin` com o frontend web React.

## Phase 1: Frontend Foundation (Setup & Layout) - DONE
O objetivo foi criar a estrutura base do projeto web e o layout global (Sidebar/Topbar) seguindo o Stitch.

- [x] **Task 1: Inicializar projeto React + Vite**
- [x] **Task 2: Implementar Design Tokens do Stitch** (Tailwind v4 integrado)
- [x] **Task 3: Layout Base (Sidebar e Topbar)**

## Phase 2: Backend Admin Module - DONE
Criação dos serviços de agregação de dados para o dashboard.

- [x] **Task 4: Criar estrutura do módulo `com.vibra.admin`**
- [x] **Task 5: Implementar Dashboard Summary** (Dados Reais)
- [x] **Task 6: Implementar Event Stats** (Dados Reais)

## Phase 3: Dashboard Principal & BI - DONE
Integração visual das métricas e gráficos.

- [x] **Task 7: Integração do Dashboard Principal**
- [x] **Task 8: Implementação de Gráficos (Recharts)**

## Phase 4: Gestão de Eventos (CRUD & Lotes) - DONE
Funcionalidades para o produtor gerenciar sua base.

- [x] **Task 9: Listagem de Eventos (Meus Eventos)**
- [x] **Task 10: CRUD de Lotes de Ingressos** (Edição e Encerramento com transição automática)
- [x] **Task 11: Tela de Criação de Evento** (ID Stitch 8e30cfb88b574d5e9e21d3e491433485)
- [x] **Extra: Integração Real com Cloudinary** (Upload de Banner e Artistas)
- [x] **Extra: Localização Avançada** (Busca por CEP via ViaCEP e Mapa Google Embed)
- [x] **Extra: Edição de Eventos** (Refatoração da página de criação para suportar edição)
- [x] **Extra: Dashboard de Comunidades** (Gestão de canais social por evento)

---

## Final Validation
- [x] Verificar fidelidade "pixel-perfect" ao Stitch.
- [x] Garantir cobertura de testes > 80% nos serviços do backend.
- [x] Validar segurança JWT e permissão `ROLE_PRODUCER`.
