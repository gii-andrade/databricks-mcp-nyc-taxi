import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { DatabricksClient } from './databricks.js';
import { DatabricksMCPServer } from './server.js';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração
const host = process.env.DATABRICKS_HOST;
const token = process.env.DATABRICKS_TOKEN;
const genieSpaceId = process.env.GENIE_SPACE_ID;
const genieSpaceName = process.env.GENIE_SPACE_NAME || "NYC Taxi Trips Analytics";
const port = parseInt(process.env.PORT || '3000');

// Validar variáveis obrigatórias
if (!host || !token || !genieSpaceId) {
  console.error('❌ ERRO: Variáveis de ambiente obrigatórias não configuradas!');
  console.error('   Configure: DATABRICKS_HOST, DATABRICKS_TOKEN, GENIE_SPACE_ID');
  process.exit(1);
}

async function main() {
  console.log('='.repeat(60));
  console.log('🚕 Servidor MCP HTTP - Databricks NYC Taxi Analytics');
  console.log('='.repeat(60));

  console.log('\n📋 Configuração:');
  console.log(`   Host: ${host}`);
  console.log(`   Token: ***${token!.slice(-5)}`);
  console.log(`   Genie Space: ${genieSpaceName} (${genieSpaceId})`);
  console.log(`   Porta: ${port}`);

  try {
    // Criar cliente Databricks
    console.log('\n🔌 Conectando ao Databricks...');
    const databricksClient = new DatabricksClient({
      host: host!,
      token: token!,
      genieSpaceId: genieSpaceId!,
    });

    // Testar conexão
    const isConnected = await databricksClient.testConnection();
    if (!isConnected) {
      console.error('\n❌ Falha ao conectar com Databricks');
      process.exit(1);
    }
    console.log('✅ Conexão com Databricks estabelecida!');

    // Criar servidor MCP
    const mcpServer = new DatabricksMCPServer(databricksClient);

    // Criar servidor Express
    const app = express();
    
    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Rota de health check
    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'Databricks MCP Server',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });

    // Endpoint SSE para conexão MCP - URL RAIZ
    // O Orchestrate espera que a URL base seja o endpoint SSE
    app.get('/', async (req, res) => {
      console.log('📡 Nova conexão SSE recebida de:', req.ip);
      await mcpServer.handleSSEConnection(req, res);
    });

    // Endpoint SSE alternativo (para compatibilidade)
    app.get('/sse', async (req, res) => {
      console.log('📡 Nova conexão SSE recebida de:', req.ip, '(via /sse)');
      await mcpServer.handleSSEConnection(req, res);
    });

    // Endpoint para receber mensagens MCP
    app.post('/message', async (req, res) => {
      console.log('📨 Mensagem MCP recebida');
      await mcpServer.handleMessage(req, res);
    });

    // Iniciar servidor HTTP
    const server = app.listen(port, '0.0.0.0', () => {
      console.log('\n🚀 Servidor HTTP iniciado!');
      console.log(`   Porta: ${port}`);
      console.log(`   Host: 0.0.0.0 (todas as interfaces)`);
      console.log(`   Endpoint SSE: /`);
      console.log(`   Endpoint Health: /health`);
      console.log(`   Endpoint Message: /message`);
      console.log('\n✅ Servidor pronto para receber conexões do Orchestrate!\n');
    });

    // Configurar timeout para conexões
    server.timeout = 0; // Sem timeout para SSE
    server.keepAliveTimeout = 0;

  } catch (error: any) {
    console.error('\n❌ Erro ao iniciar servidor:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('\n❌ Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ Promise rejeitada não tratada:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Recebido SIGTERM, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Recebido SIGINT, encerrando servidor...');
  process.exit(0);
});

// Iniciar aplicação
main().catch((error) => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});

// Made with Bob
