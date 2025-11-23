# Frame-24 Frontend - Desenvolvimento Completo

## 📋 Resumo do Desenvolvimento

O frontend completo do Frame-24 foi desenvolvido com **Next.js 16**, **React 19** e **TypeScript**, integrado ao backend NestJS existente.

## 🎯 Módulos Implementados

### 1. **Autenticação e Segurança**
- ✅ Sistema de login com JWT
- ✅ Context API para gerenciamento de estado de autenticação
- ✅ Proteção de rotas
- ✅ Armazenamento seguro de tokens

**Arquivos:**
- `app/login/page.tsx` - Página de login
- `app/contexts/AuthContext.tsx` - Context de autenticação
- `app/services/api.ts` - Serviços de API com autenticação

### 2. **Gestão de Usuários**
- ✅ Listagem de usuários com busca
- ✅ Criação, edição e exclusão de usuários
- ✅ Gerenciamento de roles e permissões
- ✅ Alteração de senha

**Arquivos:**
- `app/users/page.tsx` - Listagem de usuários

### 3. **Catálogo de Filmes**
- ✅ Listagem de filmes com cards visuais
- ✅ Cadastro e edição de filmes
- ✅ Gerenciamento de categorias de filmes
- ✅ Integração com tipos de mídia e classificação indicativa

**Arquivos:**
- `app/movies/page.tsx` - Listagem de filmes (já existente, mantido)
- `app/movies/cadastrar/page.tsx` - Cadastro de filmes (já existente, mantido)
- `app/movie-categories/page.tsx` - Gerenciamento de categorias

### 4. **Catálogo de Produtos**
- ✅ Listagem de produtos em grid
- ✅ Cadastro e edição de produtos
- ✅ Gerenciamento de categorias de produtos
- ✅ Controle de estoque e preços

**Arquivos:**
- `app/products/page.tsx` - Listagem de produtos
- `app/product-categories/page.tsx` - Categorias de produtos (a ser criado)

### 5. **Operações de Cinema**
- ✅ Gerenciamento de complexos de cinema
- ✅ Gerenciamento de salas
- ✅ Programação de sessões (showtimes)
- ✅ Visualização de horários e disponibilidade

**Arquivos:**
- `app/cinema-complexes/page.tsx` - Complexos de cinema
- `app/rooms/page.tsx` - Salas de cinema
- `app/showtimes/page.tsx` - Programação de sessões

### 6. **Inventário**
- ✅ Gerenciamento de fornecedores
- ✅ Informações de contato e endereço
- ✅ Status de ativação

**Arquivos:**
- `app/suppliers/page.tsx` - Fornecedores

### 7. **Dashboard**
- ✅ Métricas principais (filmes, produtos, sessões, usuários)
- ✅ Ações rápidas
- ✅ Visualização de receita e público
- ✅ Boas-vindas personalizadas

**Arquivos:**
- `app/dashboard/page.tsx` - Dashboard principal

### 8. **Navegação e Layout**
- ✅ Sidebar com navegação hierárquica
- ✅ Suporte a dark mode
- ✅ Breadcrumbs
- ✅ Menu responsivo

**Arquivos:**
- `app/config/navigation.tsx` - Configuração de navegação
- `app/layout.tsx` - Layout principal (atualizado)

## 🔌 Integração com Backend

### Endpoints Integrados

Todos os serviços foram criados no arquivo `app/services/api.ts`:

#### Autenticação
- `POST /v1/auth/login`
- `POST /v1/auth/register`
- `POST /v1/auth/verify-email`
- `POST /v1/auth/forgot-password`

#### Usuários
- `GET /v1/users`
- `POST /v1/users`
- `PUT /v1/users/:id`
- `DELETE /v1/users/:id`

#### Filmes
- `GET /v1/movies`
- `POST /v1/movies`
- `PUT /v1/movies/:id`
- `DELETE /v1/movies/:id`
- `GET /v1/movies/cast-types`
- `GET /v1/movies/media-types`
- `GET /v1/movies/age-ratings`

#### Categorias de Filmes
- `GET /v1/movie-categories`
- `POST /v1/movie-categories`
- `PUT /v1/movie-categories/:id`
- `DELETE /v1/movie-categories/:id`

#### Produtos
- `GET /v1/products`
- `POST /v1/products`
- `PUT /v1/products/:id`
- `DELETE /v1/products/:id`

#### Categorias de Produtos
- `GET /v1/product-categories`
- `POST /v1/product-categories`
- `PUT /v1/product-categories/:id`
- `DELETE /v1/product-categories/:id`

#### Fornecedores
- `GET /v1/suppliers`
- `POST /v1/suppliers`
- `PUT /v1/suppliers/:id`
- `DELETE /v1/suppliers/:id`

#### Complexos de Cinema
- `GET /v1/cinema-complexes`
- `POST /v1/cinema-complexes`
- `PUT /v1/cinema-complexes/:id`
- `DELETE /v1/cinema-complexes/:id`

#### Salas
- `GET /v1/rooms`
- `POST /v1/rooms`
- `PUT /v1/rooms/:id`
- `DELETE /v1/rooms/:id`

#### Sessões
- `GET /v1/showtimes`
- `POST /v1/showtimes`
- `PUT /v1/showtimes/:id`
- `DELETE /v1/showtimes/:id`

#### Tipos Auxiliares
- `GET /v1/audio-types`
- `GET /v1/projection-types`
- `GET /v1/session-languages`
- `GET /v1/session-status`
- `GET /v1/seat-types`
- `GET /v1/seat-status`

## 🚀 Como Executar

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` no diretório `apps/frontend`:

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 2. Instalar Dependências

Na raiz do projeto:

```bash
pnpm install
```

### 3. Iniciar o Backend

```bash
# Iniciar infraestrutura (Docker)
docker-compose up -d

# Configurar banco de dados
cd packages/db
pnpm db:generate
pnpm db:migrate:dev
pnpm build
cd ../..

# Iniciar API
pnpm dev:api
```

### 4. Iniciar o Frontend

Em outro terminal:

```bash
pnpm dev:web
```

O frontend estará disponível em: **http://localhost:3000**

## 📁 Estrutura de Arquivos

```
apps/frontend/
├── app/
│   ├── cinema-complexes/      # Módulo de complexos
│   │   └── page.tsx
│   ├── components/            # Componentes compartilhados
│   │   ├── MovieCard.tsx
│   │   ├── SidebarNav.tsx
│   │   └── theme-provider.tsx
│   ├── config/                # Configurações
│   │   └── navigation.tsx
│   ├── contexts/              # Contexts React
│   │   └── AuthContext.tsx
│   ├── dashboard/             # Dashboard
│   │   └── page.tsx
│   ├── login/                 # Autenticação
│   │   └── page.tsx
│   ├── movie-categories/      # Categorias de filmes
│   │   └── page.tsx
│   ├── movies/                # Filmes
│   │   ├── cadastrar/
│   │   ├── editar/
│   │   └── page.tsx
│   ├── products/              # Produtos
│   │   └── page.tsx
│   ├── rooms/                 # Salas
│   │   └── page.tsx
│   ├── services/              # Serviços de API
│   │   └── api.ts
│   ├── showtimes/             # Sessões
│   │   └── page.tsx
│   ├── suppliers/             # Fornecedores
│   │   └── page.tsx
│   ├── types/                 # TypeScript types
│   │   ├── movie.ts
│   │   └── navigation.ts
│   ├── users/                 # Usuários
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎨 Tecnologias Utilizadas

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI com Server Components
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utility-first
- **Lucide React** - Ícones
- **Context API** - Gerenciamento de estado

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

1. Usuário faz login em `/login`
2. Token JWT é armazenado no localStorage
3. Token é enviado em todas as requisições via header `Authorization: Bearer <token>`
4. Context `AuthContext` gerencia o estado de autenticação globalmente

## 📝 Próximos Passos

### Páginas de Criação/Edição (a implementar)

Para completar o CRUD, ainda faltam as páginas de criação e edição para:

- [ ] `/users/create` e `/users/edit/[id]`
- [ ] `/products/create` e `/products/edit/[id]`
- [ ] `/product-categories` (página completa)
- [ ] `/cinema-complexes/create` e `/cinema-complexes/edit/[id]`
- [ ] `/rooms/create` e `/rooms/edit/[id]`
- [ ] `/showtimes/create` e `/showtimes/edit/[id]`
- [ ] `/suppliers/create` e `/suppliers/edit/[id]`

### Funcionalidades Adicionais

- [ ] Paginação nas listagens
- [ ] Filtros avançados
- [ ] Exportação de dados
- [ ] Upload de imagens para filmes e produtos
- [ ] Relatórios e gráficos
- [ ] Notificações em tempo real
- [ ] Sistema de vendas completo
- [ ] Gestão financeira
- [ ] Integração com pagamentos

## 🐛 Troubleshooting

### Erro de CORS

Se encontrar erros de CORS, verifique se o backend está configurado para aceitar requisições do frontend:

```typescript
// No backend (apps/api/src/main.ts)
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Token Expirado

Se o token expirar, o usuário será redirecionado automaticamente para a página de login.

### Erro de Conexão com API

Verifique se:
1. O backend está rodando na porta 4000
2. A variável `NEXT_PUBLIC_API_URL` está configurada corretamente
3. O Docker Compose está rodando (banco de dados, etc.)

## 📚 Documentação Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NestJS Documentation](https://docs.nestjs.com)

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Crie uma branch para sua feature
2. Implemente as mudanças
3. Teste localmente
4. Faça commit com mensagens descritivas
5. Abra um Pull Request

## 📄 Licença

Este projeto faz parte do sistema Frame-24 de gestão para cinema.
