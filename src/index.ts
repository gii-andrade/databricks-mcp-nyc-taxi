import dotenv from 'dotenv';
import { DatabricksClient } from './databricks.js';
import { DatabricksMCPServer } from './server.js';

// SOLUÇÃO DEFINITIVA - Valores diretos para Railway
const host = "https://dbc-c163c494-7b8e.cloud.databricks.com";
const token = "dapie52433d3a451c248f68be3366cc848cb";
const genieSpaceId = "01f1382acaba1875bcdaafad34670d36";
const genieSpaceName = "NYC Taxi Trips Analytics";

async function main() {
  console.log('='.repeat(60));
  console.log('🚕 Servidor MCP - Databricks NYC Taxi Analytics');
  console.log('='.repeat(60));

  console.log('\n📋 Configuração:');
  console.log(`   Host: ${host}`);
  console.log(`   Token: ***${token.slice(-4)}`);
  console.log(`   Genie Space: ${genieSpaceName} (${genieSpaceId})`);

  try {
    // Criar cliente Databricks
    console.log('\n🔌 Conectando ao Databricks...');
    const databricksClient = new DatabricksClient({
      host,
      token,
      genieSpaceId,
    });

    // Testar conexão
    const isConnected = await databricksClient.testConnection();
    if (!isConnected) {
      console.error('\n❌ Falha ao conectar com Databricks');
      process.exit(1);
    }

    // Criar e iniciar servidor MCP
    console.log('\n🚀 Iniciando servidor MCP...');
    const server = new DatabricksMCPServer(databricksClient);
    await server.start();

    console.log('\n✅ Servidor pronto para receber requisições!');
    console.log('   Aguardando comandos via stdio...\n');

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

// Iniciar aplicação
main().catch((error) => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});

// Made with Bob
