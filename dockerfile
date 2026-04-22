FROM node:18-alpine

# Instala dependências nativas caso algum pacote precise compilar algo (comum em SDKs complexos)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copia apenas os arquivos de pacotes primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências (incluindo as de desenvolvimento para o build do TS)
RUN npm install

# Copia o restante dos arquivos (incluindo a pasta src e tsconfig.json)
COPY . .

# Gera a pasta /dist
RUN npm run build

# O Code Engine usa a porta 8080 por padrão
EXPOSE 8080

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Comando para iniciar
CMD ["node", "dist/index.js"]