# Frame-24

Sistema de gestão integrada para cinema, desenvolvido com arquitetura monorepo usando Turborepo, TypeScript, NestJS e Next.js.

## 🏗️ Arquitetura

Este projeto utiliza uma arquitetura monorepo organizada da seguinte forma:

### Apps

- **`api`** - Backend em [NestJS](https://nestjs.com/) (porta 3002)
  - RESTful API com Swagger/Scalar documentation
  - Autenticação JWT
  - Integração com Prisma ORM
  - Multi-schema database (identity, hr, finance, crm, sales, inventory, marketing, operations, projects, stock, tax, catalog, contracts)

- **`frontend`** - Dashboard administrativo em [Next.js 16](https://nextjs.org/) (porta 3001)
  - React 19
  - Tailwind CSS 4
  - Next Themes para dark mode
  - UI components compartilhados

- **`landing-page`** - Página institucional em [Next.js 16](https://nextjs.org/) (porta 3003)
  - React 19
  - Tailwind CSS 4
  - Otimizada para SEO

### Packages

- **`@repo/db`** - Camada de dados com Prisma
  - Schema multi-tenant
  - 13 schemas PostgreSQL separados
  - Prisma Client gerado

- **`@repo/ui`** - Biblioteca de componentes compartilhados

- **`@repo/eslint-config`** - Configurações ESLint compartilhadas

- **`@repo/tailwind-config`** - Configuração Tailwind CSS compartilhada

- **`@repo/typescript-config`** - Configurações TypeScript compartilhadas

## 🚀 Tecnologias

- **Node.js** >= 18
- **TypeScript** 5.9.3
- **pnpm** 10.20.0
- **Turborepo** 2.5.8
- **NestJS** 11.0.1
- **Next.js** 16.0.1
- **React** 19.2.0
- **Prisma** 6.18.0
- **PostgreSQL** 18.0
- **RabbitMQ** 4.2
- **Elasticsearch** 9.2.0

## 📋 Pré-requisitos

- Node.js >= 18
- pnpm 10.20.0
- Docker & Docker Compose (para infraestrutura)

## ⚙️ Variáveis de Ambiente

### Raiz do projeto (`.env`)

```env
# Database
DATABASE_URL="postgresql://frame24:frame24pass@localhost:5432/frame24?schema=public&connection_limit=30"

# Message Queue
RABBITMQ_URL=amqp://frame24:frame24pass@localhost:5672

# API Configuration
PORT=3002
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3001


# JWT Configuration
JWT_SECRET=frame24-super-secret-jwt-key-2024

# Worker Configuration
WORKER_ID=1
```

### Frontend (`apps/frontend/.env.local`)

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Package DB (`packages/db/.env`)

```env
# Database
DATABASE_URL="postgresql://frame24:frame24pass@localhost:5432/frame24?schema=public&connection_limit=30"
```

## 🐳 Infraestrutura (Docker)

O projeto inclui os seguintes serviços via Docker Compose:

- **PostgreSQL 18.0** - Porta 5432
- **RabbitMQ 4.2** com Management UI - Portas 5672 (AMQP) e 15672 (UI)
- **Elasticsearch 9.2.0** - Porta 9200

### Iniciar infraestrutura

```bash
docker-compose up -d
```

### Acessar RabbitMQ Management

```
http://localhost:15672
User: frame24
Password: frame24pass
```

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Gerar Prisma Client
cd packages/db
pnpm db:generate

# Executar migrations
pnpm db:migrate:dev
```

## 🏃 Desenvolvimento

### Iniciar todos os serviços

```bash
pnpm dev
```

### Iniciar serviços específicos

```bash
# Apenas API
pnpm dev:api

# Apenas Frontend
pnpm dev:web

# Usando filtros do Turbo
turbo dev --filter=landing-page
turbo dev --filter=api
turbo dev --filter=frontend
```

## 🏗️ Build

```bash
# Build de todos os apps
pnpm build

# Build específico
turbo build --filter=api
turbo build --filter=frontend
turbo build --filter=landing-page
```

## 🧪 Comandos Úteis

```bash
# Linting
pnpm lint

# Type checking
pnpm check-types

# Formatação de código
pnpm format

# Prisma Studio
cd packages/db
pnpm db:studio

# Reset database
cd packages/db
pnpm db:reset
```

## 📊 Database Schemas

O projeto utiliza 13 schemas PostgreSQL separados para organização modular:

- **identity** - Usuários, empresas, autenticação, permissões
- **hr** - Recursos humanos, funcionários, departamentos
- **finance** - Contabilidade, lançamentos, apurações
- **crm** - Clientes, preferências, pontos de fidelidade
- **sales** - Vendas, ingressos, concessão
- **inventory** - Fornecedores, estoque
- **marketing** - Campanhas promocionais, cupons
- **operations** - Complexos, salas, sessões, assentos
- **projects** - Projetos RECINE
- **stock** - Movimentação de estoque
- **tax** - Tributos, apurações fiscais
- **catalog** - Filmes, produtos, combos
- **contracts** - Contratos de exibição

## 🔐 Autenticação

A API utiliza JWT para autenticação. Endpoints protegidos requerem um token Bearer no header:

```
Authorization: Bearer <seu-token-jwt>
```

## 📚 Documentação da API

Após iniciar a API, acesse:

- **Swagger/Scalar**: http://localhost:3002/docs

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

UNLICENSED - Projeto privado
