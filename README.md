# 🚕 Servidor MCP - Databricks NYC Taxi Analytics

Servidor MCP (Model Context Protocol) para integração do Databricks Genie Agent "NYC Taxi Trips Analytics" com o Watsonx Orchestrate.

## 📋 Pré-requisitos

- Node.js v18 ou superior
- Conta Databricks com Genie Agent configurado
- Credenciais de API do Databricks

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build
```

## ⚙️ Configuração

O arquivo `.env` já está configurado com suas credenciais:

```env
DATABRICKS_HOST=https://dbc-c163c494-7b8e.cloud.databricks.com
DATABRICKS_TOKEN=seu_token_aqui
GENIE_SPACE_ID=01f1382acaba1875bcdaafad34670d36
GENIE_SPACE_NAME=NYC Taxi Trips Analytics
```

## 🏃 Executar

### Modo Produção
```bash
npm start
```

### Modo Desenvolvimento
```bash
npm run dev
```

## 🧪 Testar

### Testar com MCP Inspector
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

Isso abrirá uma interface web onde você pode testar os tools disponíveis.

## 🛠️ Tools Disponíveis

### 1. query_nyc_taxi
Faz perguntas sobre dados de táxis de NYC usando o Genie Agent.

**Exemplo:**
```json
{
  "question": "Quantas viagens de táxi foram registradas?"
}
```

### 2. list_genie_spaces
Lista todos os Genie Spaces disponíveis no workspace.

### 3. get_conversation
Obtém detalhes de uma conversa específica do Genie.

### 4. test_connection
Testa a conexão com o Databricks.

## 📊 Estrutura do Projeto

```
databricks-mcp-nyc-taxi/
├── src/
│   ├── index.ts          # Ponto de entrada
│   ├── server.ts         # Servidor MCP
│   ├── databricks.ts     # Cliente Databricks
│   └── tools.ts          # Definição de tools
├── dist/                 # Código compilado
├── .env                  # Variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Segurança

- ⚠️ Nunca commite o arquivo `.env`
- ⚠️ O `.gitignore` já está configurado para proteger credenciais
- ⚠️ Revogue tokens não utilizados

## 🐛 Troubleshooting

### Erro de conexão
Verifique se o token está correto no arquivo `.env`

### Erro "Genie Space not found"
Confirme se o `GENIE_SPACE_ID` está correto

### Timeout
Aumente o timeout no arquivo `src/databricks.ts` se necessário

## 📝 Próximos Passos

1. ✅ Servidor criado e compilado
2. ⏳ Testar localmente com MCP Inspector
3. ⏳ Expor servidor publicamente (ngrok ou Railway)
4. ⏳ Conectar ao Watsonx Orchestrate
5. ⏳ Testar integração completa

## 📞 Suporte

Consulte a documentação principal no diretório pai para mais informações.