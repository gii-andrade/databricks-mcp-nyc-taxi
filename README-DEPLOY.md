# 🚀 Deploy do Servidor MCP Databricks para Orchestrate

## ✅ Modificações Realizadas

O servidor foi modificado para suportar **HTTP/SSE** (Server-Sent Events), permitindo conexão remota via URL.

### Mudanças principais:
- ✅ Adicionado Express para servidor HTTP
- ✅ Substituído `StdioServerTransport` por `SSEServerTransport`
- ✅ Criados endpoints `/sse` e `/message` para comunicação MCP
- ✅ Adicionado endpoint `/` para health check

---

## 📋 Passo a Passo para Deploy

### **PASSO 1: Instalar Novas Dependências**

```bash
cd ~/Desktop/databricks-mcp-nyc-taxi
npm install
```

Isso vai instalar:
- `express` - Servidor HTTP
- `cors` - Permitir requisições cross-origin
- `@types/express` e `@types/cors` - Tipos TypeScript

---

### **PASSO 2: Compilar o Projeto**

```bash
npm run build
```

✅ **Resultado esperado:** Pasta `dist/` criada com arquivos JavaScript

---

### **PASSO 3: Testar Localmente**

```bash
npm start
```

✅ **Deve aparecer:**
```
============================================================
🚕 Servidor MCP HTTP - Databricks NYC Taxi Analytics
============================================================

📋 Configuração:
   Host: https://dbc-c163c494-7b8e.cloud.databricks.com
   Token: ***48cb
   Genie Space: NYC Taxi Trips Analytics
   Porta: 3000

🔌 Conectando ao Databricks...
✅ Conexão com Databricks estabelecida!

🚀 Servidor HTTP iniciado!
   URL local: http://localhost:3000
   Endpoint SSE: http://localhost:3000/sse
   Endpoint Message: http://localhost:3000/message

✅ Servidor pronto para receber conexões do Orchestrate!
```

**Testar no navegador:**
Abra: http://localhost:3000

Deve mostrar:
```json
{
  "status": "ok",
  "service": "Databricks MCP Server",
  "version": "1.0.0",
  "genie_space": "NYC Taxi Trips Analytics",
  "endpoints": {
    "sse": "/sse",
    "message": "/message",
    "health": "/"
  }
}
```

Pressione `Ctrl+C` para parar o servidor.

---

### **PASSO 4: Preparar para Deploy no Railway**

#### 4.1. Criar arquivo `.gitignore` (se não existir)

```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.DS_Store
*.log
.vscode/
EOF
```

#### 4.2. Inicializar Git

```bash
git init
git add .
git commit -m "Servidor MCP HTTP para Orchestrate"
```

#### 4.3. Criar repositório no GitHub

1. Acesse: https://github.com/new
2. **Nome:** `databricks-mcp-nyc-taxi`
3. **Visibilidade:** Private (recomendado)
4. Clique em **"Create repository"**

#### 4.4. Fazer push para GitHub

```bash
# Substitua SEU_USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU_USUARIO/databricks-mcp-nyc-taxi.git
git branch -M main
git push -u origin main
```

---

### **PASSO 5: Deploy no Railway**

#### 5.1. Criar conta e projeto

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Escolha **"Deploy from GitHub repo"**
5. Selecione `databricks-mcp-nyc-taxi`
6. Clique em **"Deploy Now"**

#### 5.2. Configurar Variáveis de Ambiente

No Railway, vá em **Variables** e adicione:

```
DATABRICKS_HOST=https://dbc-c163c494-7b8e.cloud.databricks.com
DATABRICKS_TOKEN=dapie52433d3a451c248f68be3366cc848cb
GENIE_SPACE_ID=01f1382acaba1875bcdaafad34670d36
GENIE_SPACE_NAME=NYC Taxi Trips Analytics
PORT=3000
```

#### 5.3. Aguardar Deploy

O Railway vai:
1. Instalar dependências (`npm install`)
2. Compilar TypeScript (`npm run build` via `postinstall`)
3. Iniciar servidor (`npm start`)

Aguarde 2-3 minutos.

✅ **Sucesso:** Quando aparecer "✅ Servidor pronto para receber conexões do Orchestrate!"

#### 5.4. Gerar Domínio Público

1. No Railway, vá em **Settings** → **Networking**
2. Clique em **"Generate Domain"**
3. Copie a URL gerada, exemplo:
   ```
   https://databricks-mcp-nyc-taxi-production.up.railway.app
   ```

#### 5.5. Testar a URL

Abra no navegador:
```
https://sua-url.up.railway.app
```

Deve mostrar o JSON com status "ok".

---

### **PASSO 6: Conectar ao Orchestrate**

#### 6.1. Adicionar Servidor MCP

1. Abra o **Orchestrate (WxO)**
2. Vá em **Settings** → **MCP Servers**
3. Clique em **"Add Server"**
4. Escolha **"Add remote MCP server"**

#### 6.2. Preencher Formulário

**Server name:**
```
databricks-nyc-taxi
```

**Description:**
```
Servidor MCP HTTP para consultar dados de táxis de NYC via Databricks Genie
```

**MCP server URL:**
```
https://sua-url.up.railway.app
```
*(Use a URL que o Railway gerou)*

**Transport type:**
```
Server-Sent Events (SSE)
```

**Select Connection:**
```
None
```

#### 6.3. Salvar e Verificar

1. Clique em **"Connect"**
2. Verifique se o status mostra **"Connected"**

---

### **PASSO 7: Conectar o Agent**

1. No Orchestrate, vá para **Agents**
2. Abra **"Databricks Genie Taxi"**
3. Vá em **Settings** → **MCP Servers**
4. Ative o servidor `databricks-nyc-taxi`
5. Salve

---

### **PASSO 8: Testar!**

No chat com o agent:

```
Use o tool test_connection para verificar a conexão com o Databricks
```

✅ **Deve funcionar!**

Teste com query:

```
Quantas viagens de táxi foram registradas no dataset?
```

✅ **Deve retornar dados do Databricks Genie!**

---

## 🔧 Troubleshooting

### Problema: Deploy falhou no Railway

**Solução:** Verifique os logs no Railway. Erros comuns:
- Falta de variáveis de ambiente
- Erro de compilação TypeScript
- Porta incorreta

### Problema: Servidor inicia mas Orchestrate não conecta

**Solução:**
1. Verifique se a URL está correta
2. Teste a URL no navegador (deve mostrar JSON)
3. Verifique se escolheu "Server-Sent Events (SSE)" como transport type
4. Veja os logs no Railway quando o Orchestrate tenta conectar

### Problema: "Cannot find module 'express'"

**Solução:**
```bash
npm install
npm run build
```

---

## 📊 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Health check e informações do servidor |
| `/health` | GET | Status de saúde do servidor |
| `/sse` | GET | Conexão SSE para MCP (usado pelo Orchestrate) |
| `/message` | POST | Receber mensagens MCP (usado pelo Orchestrate) |

---

## 🎯 Arquitetura

```
Orchestrate Agent
    ↓ (HTTPS)
Railway Server (Express)
    ↓ (SSE/HTTP)
MCP Server
    ↓ (REST API)
Databricks Genie
    ↓ (SQL)
NYC Taxi Dataset
```

---

## ✅ Checklist Final

- [ ] Dependências instaladas (`npm install`)
- [ ] Projeto compilado (`npm run build`)
- [ ] Teste local funcionou (`npm start`)
- [ ] Código no GitHub
- [ ] Deploy no Railway concluído
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio público gerado
- [ ] URL testada no navegador
- [ ] Servidor conectado no Orchestrate
- [ ] Agent conectado ao servidor
- [ ] Tool `test_connection` funciona
- [ ] Query de teste retorna dados

---

## 📝 Comandos Resumidos

```bash
# 1. Instalar e compilar
cd ~/Desktop/databricks-mcp-nyc-taxi
npm install
npm run build

# 2. Testar localmente
npm start
# Abrir http://localhost:3000 no navegador
# Ctrl+C para parar

# 3. Git e GitHub
git init
git add .
git commit -m "Servidor MCP HTTP"
git remote add origin https://github.com/SEU_USUARIO/databricks-mcp-nyc-taxi.git
git push -u origin main

# 4. Railway
# - Login com GitHub
# - Deploy from GitHub repo
# - Adicionar variáveis de ambiente
# - Gerar domínio

# 5. Orchestrate
# - Add remote MCP server
# - URL: https://sua-url.up.railway.app
# - Transport: Server-Sent Events (SSE)
```

---

**Criado por:** Bob (Code Mode)  
**Data:** 2026-04-17  
**Versão:** 1.0 - Servidor HTTP/SSE para Orchestrate