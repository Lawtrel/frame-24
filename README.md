<div align="center">

# 🎬 Frame-24

### Sistema de Gestão Integrada para Cinema

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.0-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.20.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.5.8-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)

**Arquitetura monorepo moderna** com TypeScript, NestJS e Next.js  
✨ Multi-tenant • 🚀 RESTful API • ⚡ Real-time messaging • 💻 Full-stack TypeScript

---

**Navegação Rápida:**  
[📦 Instalação](#-guia-de-instalação-rápida) • [🏗️ Arquitetura](#️-arquitetura) • [🛠️ Stack](#-stack-tecnológica) • [🌐 Serviços](#-acessando-os-serviços) • [📚 Documentação](#-acessando-os-serviços)

</div>

---

## 🏗️ Arquitetura

Este projeto utiliza uma **arquitetura monorepo moderna** organizada de forma modular e escalável.

### 📱 Applications

#### 🔧 **`api`** - Backend REST API

> **Porta:** `4000` | **Framework:** [NestJS](https://nestjs.com/)

- ✅ RESTful API versionada (`/v1/`) com documentação Swagger/Scalar
- 🔐 Autenticação JWT com sistema de permissões granulares
- 🏢 Multi-tenant com isolamento completo por empresa
- 📨 Integração com RabbitMQ para mensageria assíncrona
- 🔍 Integração com Elasticsearch para busca e analytics
- 🗄️ Multi-schema database (13 schemas PostgreSQL separados)

#### 🎨 **`frontend`** - Dashboard Administrativo

> **Porta:** `3002` | **Framework:** [Next.js 16](https://nextjs.org/)

- ⚛️ React 19 com Server Components
- 🎨 Tailwind CSS 4 para estilização
- 🌓 Next Themes para suporte a dark mode
- 🧩 UI components compartilhados e reutilizáveis

#### 🌐 **`landing-page`** - Página Institucional

> **Porta:** `3003` | **Framework:** [Next.js 16](https://nextjs.org/)

- ⚛️ React 19
- 🎨 Tailwind CSS 4
- 🔍 Otimizada para SEO e performance

### 📦 Packages

| Package                       | Descrição                                                                  |
| ----------------------------- | -------------------------------------------------------------------------- |
| **`@repo/db`**                | Camada de dados com Prisma - Schema multi-tenant com 13 schemas PostgreSQL |
| **`@repo/ui`**                | Biblioteca de componentes UI compartilhados                                |
| **`@repo/eslint-config`**     | Configurações ESLint padronizadas                                          |
| **`@repo/tailwind-config`**   | Configuração Tailwind CSS compartilhada                                    |
| **`@repo/typescript-config`** | Configurações TypeScript base                                              |

## 🚀 Stack Tecnológica

### 🔧 Core

| Tecnologia     | Versão  | Descrição                   |
| -------------- | ------- | --------------------------- |
| **Node.js**    | >= 18   | Runtime JavaScript          |
| **TypeScript** | 5.9.3   | Linguagem de programação    |
| **pnpm**       | 10.20.0 | Gerenciador de pacotes      |
| **Turborepo**  | 2.5.8   | Build system para monorepos |

### ⚙️ Backend

| Tecnologia | Versão | Uso                          |
| ---------- | ------ | ---------------------------- |
| **NestJS** | 11.0.1 | Framework Node.js            |
| **Prisma** | 6.18.0 | ORM e gerenciamento de banco |
| **JWT**    | -      | Autenticação e autorização   |

### 🎨 Frontend

| Tecnologia       | Versão | Uso                         |
| ---------------- | ------ | --------------------------- |
| **Next.js**      | 16.0.1 | Framework React             |
| **React**        | 19.2.0 | Biblioteca UI               |
| **Tailwind CSS** | 4      | Framework CSS utility-first |

### 🏗️ Infraestrutura

| Serviço        | Versão                | Descrição                   |
| -------------- | --------------------- | --------------------------- |
| **PostgreSQL** | 18.0-alpine           | Banco de dados relacional   |
| **RabbitMQ**   | 4.2-management-alpine | Message broker              |
| **MinIO**      | latest                | Armazenamento S3-compatible |
| **MailHog**    | latest                | Servidor SMTP para testes   |

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado as seguintes ferramentas:

| Ferramenta         | Versão Mínima | Link                                                       |
| ------------------ | ------------- | ---------------------------------------------------------- |
| **Node.js**        | >= 18         | [Download](https://nodejs.org/)                            |
| **pnpm**           | 10.20.0       | [Instalação](https://pnpm.io/installation)                 |
| **Docker Desktop** | latest        | [Download](https://www.docker.com/products/docker-desktop) |
| **Git**            | latest        | [Download](https://git-scm.com/)                           |

### 📦 Instalando pnpm

Escolha o método de instalação de acordo com seu sistema:

<details>
<summary><b>Via npm</b> (recomendado se você já tem Node.js)</summary>

```bash
npm install -g pnpm@10.20.0
```

</details>

<details>
<summary><b>Via Homebrew</b> (macOS/Linux)</summary>

```bash
brew install pnpm
```

</details>

<details>
<summary><b>Via Chocolatey</b> (Windows)</summary>

```bash
choco install pnpm
```

</details>

**Verificar instalação:**

```bash
pnpm --version
```

## 🚀 Guia de Instalação Rápida

### 1️⃣ Clone o repositório

```bash
git clone <url-do-repositorio>
cd frame-24
```

### 2️⃣ Inicie a infraestrutura com Docker

```bash
docker-compose up -d
```

> ⏳ **Aguarde** todos os serviços ficarem saudáveis. Você pode verificar o status com:

```bash
docker-compose ps
```

### 3️⃣ Configure as variáveis de ambiente

#### 📝 3.1. Criar `.env` por app/package (padrão recomendado do Turborepo)

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/landing-page/.env.example apps/landing-page/.env
cp packages/db/.env.example packages/db/.env
```

Se quiser sobrescrever algo localmente sem versionar, use `.env.local` dentro do app:

```bash
touch apps/web/.env.local
touch apps/admin/.env.local
```

> O Turborepo usa `env/globalEnv` no `turbo.json` para hashing de cache, e os arquivos `.env*` estão em `globalDependencies`.

### 4️⃣ Instale as dependências

```bash
pnpm install
```

### 5️⃣ Configure o banco de dados

```bash
# Entre no diretório do package de banco de dados
cd packages/db

# Gere o Prisma Client
pnpm db:generate

# Execute as migrations
pnpm db:migrate:dev

# Compile o TypeScript do package (configurado com comandos em linux, remova o rm -rf caso está no windows)
pnpm build

# Volte para a raiz
cd ../..
```

### 6️⃣ Inicie o projeto

**Opção 1: Iniciar todos os serviços** (API + Frontend + Landing Page)

```bash
pnpm dev
```

**Opção 2: Iniciar apenas a API**

```bash
pnpm dev:api
```

**Opção 3: Iniciar apenas o Frontend**

```bash
# build o @repo/ui pra pegar o sidebar antes de rodar o frontend
pnpm dev:web
```

## 🌐 Acessando os Serviços

Após a instalação, você pode acessar os seguintes serviços:

| 🎯 Serviço              | 🔗 URL                                    | 🔐 Credenciais            |
| ----------------------- | ----------------------------------------- | ------------------------- |
| **API (Swagger)**       | <http://localhost:4000/api/docs>            | -                         |
| **Frontend**            | <http://localhost:3000>                     | -                         |
| **Landing Page**        | <http://localhost:3003>                     | -                         |
| **RabbitMQ Management** | <http://localhost:15672>                    | `frame24` / `frame24pass` |
| **MailHog (Email UI)**  | <http://localhost:8025>                     | -                         |
| **Prisma Studio**       | Execute `pnpm db:studio` em `packages/db` | -                         |

## 📊 Database Schemas

O projeto utiliza **13 schemas PostgreSQL separados** para organização modular e isolamento de dados:

| 🗄️ Schema        | 📝 Descrição                                         |
| ---------------- | ---------------------------------------------------- |
| **`identity`**   | Usuários, empresas, autenticação, permissões, roles  |
| **`hr`**         | Recursos humanos, funcionários, departamentos        |
| **`finance`**    | Contabilidade, lançamentos, apurações                |
| **`crm`**        | Clientes, preferências, pontos de fidelidade         |
| **`sales`**      | Vendas, ingressos, concessão, transações             |
| **`inventory`**  | Fornecedores, produtos, estoque                      |
| **`marketing`**  | Campanhas promocionais, cupons, descontos            |
| **`operations`** | Complexos, salas, sessões, assentos                  |
| **`projects`**   | Projetos RECINE (regime especial de cinema)          |
| **`stock`**      | Movimentação de estoque                              |
| **`tax`**        | Tributos, apurações fiscais (ISS, ICMS, PIS, COFINS) |
| **`catalog`**    | Filmes, produtos, combos                             |
| **`contracts`**  | Contratos de exibição com distribuidoras             |

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Para acessar endpoints protegidos, siga estes passos:

1. **Faça signup** em `POST /v1/auth/signup`
2. **Faça login** em `POST /v1/auth/login`
3. **Use o token retornado** nos headers das requisições:

```http
Authorization: Bearer <seu-token-jwt>
```

## 🧪 Comandos Úteis

### 💻 Desenvolvimento

**Linting:**

```bash
pnpm lint
```

**Type checking:**

```bash
pnpm check-types
```

**Formatação de código:**

```bash
pnpm format
```

**Iniciar serviços específicos com Turbo:**

```bash
turbo dev --filter=api
turbo dev --filter=frontend
turbo dev --filter=landing-page
```

### 🗄️ Database

**Prisma Studio** (interface visual do banco):

```bash
cd packages/db
pnpm db:studio
```

**Criar uma nova migration:**

```bash
pnpm db:migrate:dev --name nome-da-migration
```

**Reset completo do banco de dados:**

```bash
pnpm db:reset
```

### 🏗️ Build

**Build de todos os apps:**

```bash
pnpm build
```

**Build específico:**

```bash
turbo build --filter=api
turbo build --filter=frontend
turbo build --filter=landing-page
```

### 🐳 Docker

**Parar todos os serviços:**

```bash
docker-compose down
```

**Parar e remover volumes** ⚠️ (CUIDADO: apaga dados):

```bash
docker-compose down -v
```

**Ver logs de um serviço específico:**

```bash
docker-compose logs -f postgres
docker-compose logs -f rabbitmq
```

**Reiniciar um serviço específico:**

```bash
docker-compose restart postgres
```

## 🏢 Multi-Tenancy

O sistema é **multi-tenant**, ou seja, uma única instância serve múltiplas empresas (cinemas) com **isolamento completo de dados**.

### ✨ Características

- 🏷️ Cada empresa tem seu próprio `tenant_slug` único
- 🔒 Todas as queries são automaticamente filtradas pelo `company_id` do usuário logado
- 👥 Permissões granulares baseadas em roles customizáveis por empresa
- 🛡️ Isolamento completo de dados entre tenants

## 📚 Documentação de Domínio

- [`docs/marketing-campaigns.md`](docs/marketing-campaigns.md) — fluxo completo de campanhas promocionais, endpoints, validações e integração com vendas.
- [`docs/finance-distributor-settlements.md`](docs/finance-distributor-settlements.md) — processo de cálculo e conciliação de repasses para distribuidoras.

## 🚀 Funcionalidades Principais

### 🎬 Gerenciamento de Cinemas

- ✅ Cadastro de complexos e salas
- 🪑 Tipos de assento (VIP, namoradeira, standard)
- 🎥 Tipos de projeção (2D, 3D, IMAX) e áudio (Dolby Atmos, DTS)

### 📅 Programação de Sessões

- 📊 Grade de horários inteligente
- ⚠️ Validação automática de conflitos
- ⏰ Cálculo de horário de término baseado na duração do filme

### 💰 Sistema de Vendas

- 🎫 Venda de ingressos com seleção de assentos
- 🍿 Combos e produtos de concessão
- 💳 Integração com gateway de pagamento

### 📊 Fiscal e Tributário

- 🧮 Cálculo automático de impostos (ISS, ICMS, PIS, COFINS, IRPF/IRPJ)
- 🔍 Determinação automática de regime tributário via BrasilAPI
- 📈 Apurações fiscais mensais

### 👥 CRM e Fidelidade

- 📝 Cadastro de clientes
- ⭐ Programa de pontos
- 📜 Histórico de compras

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir com o projeto:

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   ```

2. **Crie uma branch para sua feature**

   ```bash
   git checkout -b feature/nova-feature
   ```

3. **Commit suas mudanças**

   ```bash
   git commit -m 'feat: adiciona nova feature'
   ```

4. **Push para a branch**

   ```bash
   git push origin feature/nova-feature
   ```

5. **Abra um Pull Request** no GitHub

## 🐛 Troubleshooting

### 🔌 Porta já em uso

Se alguma porta estiver em uso, você pode:

- **Parar o processo** que está usando a porta
- **Ou alterar a porta** no `docker-compose.yml` e no `.env`

### 🗄️ Erro de conexão com o banco

**Verifique se o PostgreSQL está rodando:**

```bash
docker-compose ps postgres
```

**Se estiver com problemas, reinicie:**

```bash
docker-compose restart postgres
```

### 📨 RabbitMQ não conecta

Aguarde o healthcheck do RabbitMQ ficar verde:

```bash
docker-compose ps rabbitmq
```

### 🔄 Prisma Client out of sync

Se você alterou o schema:

```bash
cd packages/db
pnpm db:generate
pnpm build
```

## 📄 Licença

**UNLICENSED** - Projeto privado

---

<div align="center">

**Desenvolvido com ❤️ para projeto de Banco de Dados, UNEB Campus 2**

Made with [TypeScript](https://www.typescriptlang.org/) • [NestJS](https://nestjs.com/) • [Next.js](https://nextjs.org/)

</div>
