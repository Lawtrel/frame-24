# Frame-24 API

API REST para sistema de gestão de cinemas, desenvolvida com NestJS, Prisma e PostgreSQL. Suporta multi-tenancy, autenticação JWT, mensageria RabbitMQ, e integração com MinIO para armazenamento de arquivos.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Instalação](#-instalação)
- [Arquitetura](#-arquitetura)
- [Fluxo de Implementação](#-fluxo-de-implementação)
- [Módulos Principais](#-módulos-principais)
- [API Documentation](#-api-documentation)
- [Testes](#-testes)

---

## 🚀 Tecnologias

### Core
- **NestJS** - Framework Node.js para aplicações server-side
- **TypeScript** - Superset tipado do JavaScript
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional

### Autenticação & Segurança
- **Passport JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash de senhas
- **Helmet** - Segurança HTTP headers
- **Throttler** - Rate limiting
- **CORS** - Cross-Origin Resource Sharing

### Mensageria & Workers
- **RabbitMQ** - Message broker para comunicação assíncrona
- **@golevelup/nestjs-rabbitmq** - Integração RabbitMQ com NestJS
- Consumers para:
  - Auditoria (audit logs)
  - Emails (identity, customer)

### Storage & Upload
- **MinIO** - Object storage S3-compatible
- **Multer** - Middleware para upload de arquivos
- Suporte a multipart/form-data

### Email
- **Nodemailer** - Envio de emails
- Templates para:
  - Verificação de email
  - Recuperação de senha
  - Notificações

### Validação & Documentação
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de objetos
- **Zod** - Schema validation
- **Swagger/OpenAPI** - Documentação automática da API

### Utilitários
- **nestjs-cls** - Context Local Storage para multi-tenancy
- **Snowflake ID** - Geração de IDs únicos distribuídos
- **BrasilAPI** - Integração com APIs brasileiras (CEP, municípios)

---

## 📦 Pré-requisitos

- **Node.js** >= 18.x
- **pnpm** >= 8.x
- **PostgreSQL** >= 14.x
- **RabbitMQ** >= 3.x
- **MinIO** (opcional, para upload de arquivos)
- **Docker** (opcional, para rodar dependências)

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz de `apps/api/` com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/frame24?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# RabbitMQ
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
RABBITMQ_EXCHANGE="frame24.events"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="Frame24 <noreply@frame24.com>"

# MinIO (Object Storage)
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_USE_SSL=false
MINIO_BUCKET="frame24-uploads"

# Application
PORT=3000
NODE_ENV="development"
API_VERSION="1"

# Frontend URL (for email links)
FRONTEND_URL="http://localhost:5173"
```

### Variáveis Opcionais

```env
# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Logs
LOG_LEVEL="debug"
```

---

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd frame-24
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure o banco de dados

```bash
# Gerar Prisma Client
pnpm --filter @repo/db prisma generate

# Rodar migrations
pnpm --filter @repo/db prisma migrate deploy

# (Opcional) Seed inicial
pnpm --filter @repo/db prisma db seed
```

### 4. Inicie as dependências (Docker)

```bash
# PostgreSQL
docker run -d \
  --name postgres \
  -e POSTGRES_USER=frame24 \
  -e POSTGRES_PASSWORD=frame24 \
  -e POSTGRES_DB=frame24 \
  -p 5432:5432 \
  postgres:14

# RabbitMQ
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management

# MinIO (opcional)
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

### 5. Inicie a API

```bash
# Development
pnpm --filter api dev

# Production
pnpm --filter api build
pnpm --filter api start:prod
```

A API estará disponível em `http://localhost:3000`

---

## 🏗️ Arquitetura

### Multi-Tenancy

O sistema implementa **multi-tenancy a nível de aplicação** usando:

- **nestjs-cls**: Context Local Storage para armazenar `companyId` por requisição
- **Prisma Extension**: Intercepta queries e injeta `company_id` automaticamente
- **Tenant Isolation**: Cada empresa tem seus dados isolados logicamente

```typescript
// Exemplo de uso automático
const products = await prisma.products.findMany(); 
// Automaticamente filtra por company_id do contexto
```

### Mensageria (RabbitMQ)

**Padrão Publisher/Consumer:**

1. **Publishers**: Serviços publicam eventos em exchanges
2. **Consumers**: Workers processam mensagens de forma assíncrona

**Eventos principais:**
- `audit.*` - Logs de auditoria
- `identity.created` - Novo usuário criado
- `identity.password_reset` - Solicitação de reset de senha
- `customer.registered` - Novo cliente registrado

### Upload de Arquivos (MinIO)

**StorageService** centraliza operações de upload:

```typescript
// Upload automático com tenant isolation
const imageUrl = await storageService.uploadFile(file, 'products');
// Salvo em: {companyId}/products/{uuid}.{ext}
```

**Módulos integrados:**
- Products (`image_url`)
- Cinema Rooms (`layout_image`)

### Segurança

- **JWT Authentication**: Tokens com expiração configurável
- **RBAC**: Role-Based Access Control (roles + permissions)
- **Rate Limiting**: Proteção contra abuse
- **Helmet**: Headers de segurança HTTP
- **CORS**: Configurado para frontend específico

---

## 🔄 Fluxo de Implementação

### 1. Cadastro de Empresa (Signup)

**Endpoint:** `POST /v1/auth/signup`

**Fluxo:**
1. Usuário envia dados da empresa + admin
2. Sistema cria:
   - Empresa (`companies`)
   - Pessoa (`persons`)
   - Identidade (`identities`)
   - Usuário da empresa (`company_users`)
   - Role padrão (Admin)
   - Permissões padrão
3. Configura impostos automaticamente:
   - Impostos federais (PIS, COFINS, IRPJ, CSLL)
   - Impostos municipais (ISS) via BrasilAPI
4. Cria categorias de produtos padrão
5. Envia email de verificação
6. Retorna token JWT

**Exemplo de request:**
```json
{
  "company": {
    "legal_name": "Cine Estrela Ltda",
    "trade_name": "Cine Estrela",
    "cnpj": "12.345.678/0001-90",
    "tax_regime": "LUCRO_PRESUMIDO",
    "zip_code": "01310-100",
    "address": "Av. Paulista, 1000",
    "city": "São Paulo",
    "state": "SP"
  },
  "admin": {
    "full_name": "Maria Silva",
    "email": "maria@cineestrela.com",
    "password": "SenhaSegura123!",
    "cpf": "123.456.789-00",
    "phone": "(11) 98765-4321"
  }
}
```

### 2. Verificação de Email

**Endpoint:** `POST /v1/auth/verify-email`

**Fluxo:**
1. Usuário clica no link do email
2. Frontend envia token de verificação
3. Sistema valida e ativa a identidade
4. Usuário pode fazer login

### 3. Login

**Endpoint:** `POST /v1/auth/login`

**Fluxo:**
1. Usuário envia email + senha
2. Sistema valida credenciais
3. Verifica se email foi verificado
4. Retorna token JWT + dados do usuário

### 4. Criar Complexo de Cinema

**Endpoint:** `POST /v1/cinema-complexes`

**Headers:** `Authorization: Bearer {token}`

**Fluxo:**
1. Sistema extrai `companyId` do token JWT
2. Valida permissão (`cinema_complexes:create`)
3. Cria complexo vinculado à empresa
4. Retorna dados do complexo

### 5. Criar Sala de Cinema

**Endpoint:** `POST /v1/cinema-complexes/:complexId/rooms`

**Fluxo:**
1. Valida que o complexo pertence à empresa
2. Cria sala com layout de assentos
3. Gera assentos automaticamente baseado no layout
4. (Opcional) Upload de imagem do layout

### 6. Cadastrar Filme

**Endpoint:** `POST /v1/movies`

**Fluxo:**
1. Valida distribuidora (deve pertencer à empresa)
2. Cria filme
3. Vincula categorias
4. Retorna dados do filme

### 7. Criar Sessão (Showtime)

**Endpoint:** `POST /v1/showtimes`

**Fluxo:**
1. Valida filme, sala e horário
2. Verifica conflitos de horário
3. Cria sessão
4. Gera status de assentos (disponíveis)
5. Retorna dados da sessão

---

## 📚 Módulos Principais

### Identity
- **Auth**: Login, signup, verificação de email, reset de senha
- **Companies**: Gestão de empresas
- **Users**: Gestão de usuários da empresa
- **Roles & Permissions**: RBAC

### Operations
- **Cinema Complexes**: Complexos de cinema
- **Rooms**: Salas de exibição
- **Seats**: Assentos
- **Showtimes**: Sessões de filmes
- **Audio/Projection Types**: Tipos de áudio e projeção

### Catalog
- **Movies**: Filmes
- **Movie Categories**: Categorias de filmes
- **Products**: Produtos de concessão
- **Product Categories**: Categorias de produtos

### Sales
- **Tickets**: Venda de ingressos
- **Sales**: Vendas gerais

### Finance
- **Chart of Accounts**: Plano de contas
- **Journal Entries**: Lançamentos contábeis
- **Distributor Settlements**: Acertos com distribuidoras
- **Income Statement**: DRE

### Tax
- **Federal Tax Rates**: Impostos federais
- **Municipal Tax Parameters**: Impostos municipais (ISS)
- **Tax Compensations**: Compensações tributárias

### Contracts
- **Exhibition Contracts**: Contratos de exibição
- **Contract Types**: Tipos de contrato
- **Sliding Scales**: Escalas progressivas

### Inventory
- **Suppliers**: Fornecedores

### Marketing
- **Campaigns**: Campanhas promocionais

### CRM
- **Customers**: Clientes finais
- **Customer Auth**: Login/registro de clientes

### Public
- **Public API**: Endpoints públicos (sem autenticação)
  - Listar empresas, complexos, filmes, sessões, produtos

---

## 📖 API Documentation

### Swagger UI

Acesse a documentação interativa em:

```
http://localhost:3000/api/docs
```

### Versionamento

A API usa versionamento por URL:

```
/v1/endpoint
```

### Autenticação

Todos os endpoints (exceto `/public` e `/auth`) requerem autenticação JWT:

```http
Authorization: Bearer {token}
```

### Formato de Resposta

**Sucesso:**
```json
{
  "id": "123456789",
  "name": "Example",
  "created_at": "2025-11-21T12:00:00Z"
}
```

**Erro:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Upload de Arquivos

Endpoints que suportam upload usam `multipart/form-data`:

```http
POST /v1/products
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="image"; filename="product.jpg"
Content-Type: image/jpeg

[binary data]
--boundary
Content-Disposition: form-data; name="name"

Product Name
--boundary--
```

---

## 🧪 Testes

### Unit Tests

```bash
pnpm --filter api test
```

### E2E Tests

```bash
pnpm --filter api test:e2e
```

### Coverage

```bash
pnpm --filter api test:cov
```

---

## 🔧 Desenvolvimento

### Estrutura de Pastas

```
apps/api/src/
├── common/              # Código compartilhado
│   ├── decorators/      # Decorators customizados
│   ├── guards/          # Guards de autenticação/autorização
│   ├── services/        # Serviços utilitários
│   └── rabbitmq/        # Configuração RabbitMQ
├── modules/             # Módulos de negócio
│   ├── identity/        # Autenticação e empresas
│   ├── operations/      # Operações de cinema
│   ├── catalog/         # Catálogo de filmes/produtos
│   ├── sales/           # Vendas
│   ├── finance/         # Financeiro
│   ├── tax/             # Impostos
│   ├── contracts/       # Contratos
│   ├── inventory/       # Estoque
│   ├── marketing/       # Marketing
│   ├── crm/             # CRM
│   ├── public/          # API pública
│   └── storage/         # Upload de arquivos
├── prisma/              # Prisma service e middleware
├── workers/             # RabbitMQ consumers
├── app.module.ts        # Módulo raiz
├── main.ts              # Entry point
└── swagger.config.ts    # Configuração Swagger
```

### Convenções

- **DTOs**: Validação com `class-validator` e `Zod`
- **Services**: Lógica de negócio
- **Repositories**: Acesso a dados (Prisma)
- **Controllers**: Endpoints HTTP
- **Guards**: Autenticação e autorização
- **Decorators**: Metadata e validações customizadas

### Adicionar Novo Módulo

1. Criar estrutura de pastas:
```bash
mkdir -p src/modules/new-module/{controllers,services,repositories,dto}
```

2. Criar arquivos base:
- `new-module.module.ts`
- `controllers/new-module.controller.ts`
- `services/new-module.service.ts`
- `repositories/new-module.repository.ts`
- `dto/create-new-module.dto.ts`

3. Registrar no `app.module.ts`

4. Adicionar tag no `swagger.config.ts`

---

## 🚀 Deploy

### Build

```bash
pnpm --filter api build
```

### Variáveis de Produção

Certifique-se de configurar:
- `NODE_ENV=production`
- `JWT_SECRET` forte e único
- URLs de produção para `DATABASE_URL`, `RABBITMQ_URL`, `MINIO_ENDPOINT`
- SMTP configurado corretamente
- `FRONTEND_URL` apontando para o domínio de produção

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
CMD ["node", "dist/main.js"]
```

---

## 📝 Licença

Proprietary - Frame-24

---

## 👥 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
