# Usa uma imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contentor
WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Copia os ficheiros de definição de dependências
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instala todas as dependências do monorepo
# Este passo será guardado em cache se estes ficheiros não mudarem
RUN pnpm install

# Copia o resto do código para dentro do contentor
COPY . .

# Gera o Prisma Client para que a aplicação possa comunicar com o banco de dados
WORKDIR /app/apps/backend
RUN pnpm exec prisma generate

# Expõe a porta em que a aplicação irá correr
EXPOSE 3001
CMD ["pnpm", "run", "dev"]
# O comando para iniciar a aplicação será definido no docker-compose.yml