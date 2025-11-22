# 🚀 Guia Rápido - Frame-24 Frontend

## ⚡ Início Rápido (5 minutos)

### 1. Pré-requisitos
- Node.js >= 18
- pnpm 10.20.0
- Docker Desktop

### 2. Clonar e Instalar
```bash
# Já clonado, apenas instalar dependências
cd frame-24
pnpm install
```

### 3. Configurar Ambiente
```bash
# Copiar exemplo de .env
cp apps/frontend/.env.example apps/frontend/.env.local

# Editar se necessário (padrão já funciona)
# NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Iniciar Infraestrutura
```bash
# Iniciar Docker (PostgreSQL, RabbitMQ, etc.)
docker-compose up -d

# Aguardar serviços ficarem prontos (~30 segundos)
docker-compose ps
```

### 5. Configurar Banco de Dados
```bash
cd packages/db
pnpm db:generate
pnpm db:migrate:dev
pnpm build
cd ../..
```

### 6. Iniciar Aplicação

**Terminal 1 - Backend:**
```bash
pnpm dev:api
# API rodando em http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
pnpm dev:web
# Frontend rodando em http://localhost:3000
```

### 7. Acessar Sistema
- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:4000/api/docs
- **Dashboard:** http://localhost:3000/dashboard

## 📱 Módulos Disponíveis

| Módulo | URL | Descrição |
|--------|-----|-----------|
| 🏠 Dashboard | `/dashboard` | Métricas e ações rápidas |
| 🔐 Login | `/login` | Autenticação JWT |
| 👥 Usuários | `/users` | Gestão de usuários |
| 🎬 Filmes | `/movies` | Catálogo de filmes |
| 📦 Produtos | `/products` | Gestão de produtos |
| 🏢 Complexos | `/cinema-complexes` | Complexos de cinema |
| 🚪 Salas | `/rooms` | Salas de cinema |
| 📅 Sessões | `/showtimes` | Programação |
| 🚚 Fornecedores | `/suppliers` | Gestão de fornecedores |
| 🏷️ Categorias | `/movie-categories` | Categorias de filmes |

## 🔑 Credenciais de Teste

Para criar um usuário de teste, use a landing page ou a API diretamente:

```bash
# Registrar nova empresa via API
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Cinema Teste",
    "email": "admin@teste.com",
    "password": "senha123",
    "name": "Admin Teste"
  }'
```

Ou acesse: http://localhost:3003 (Landing Page) para registro.

## 🐛 Problemas Comuns

### Erro: "Cannot connect to API"
```bash
# Verificar se backend está rodando
curl http://localhost:4000/api/docs

# Se não responder, reiniciar backend
pnpm dev:api
```

### Erro: "Database connection failed"
```bash
# Verificar Docker
docker-compose ps

# Reiniciar se necessário
docker-compose restart postgres
```

### Erro: "Port 3000 already in use"
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar porta diferente
PORT=3001 pnpm dev:web
```

## 📚 Documentação Completa

- [FRONTEND_DEVELOPMENT.md](./FRONTEND_DEVELOPMENT.md) - Documentação completa
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Endpoints disponíveis
- [FRONTEND_FILES_SUMMARY.md](./FRONTEND_FILES_SUMMARY.md) - Arquivos criados
- [README.md](./README.md) - Documentação do projeto

## 🎯 Próximos Passos

1. ✅ Explorar o dashboard
2. ✅ Testar módulos de listagem
3. 🔜 Implementar páginas de criação/edição
4. 🔜 Adicionar upload de imagens
5. 🔜 Implementar sistema de vendas

## 💡 Dicas

- Use **Ctrl + Shift + I** para abrir DevTools
- Token JWT expira em 7 dias (configurável)
- Dark mode disponível no canto superior direito
- Todas as listagens têm busca integrada

## 🆘 Suporte

Se encontrar problemas:
1. Verifique a documentação completa
2. Consulte os logs do backend e frontend
3. Verifique se todos os serviços Docker estão rodando
4. Limpe cache do navegador se necessário

---

**Desenvolvido para o projeto Frame-24** 🎬
