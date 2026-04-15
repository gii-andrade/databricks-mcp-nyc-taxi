import dotenv from 'dotenv';
import { DatabricksClient } from './databricks.js';
import { DatabricksMCPServer } from './server.js';

// Carregar variáveis de ambiente
dotenv.config();

async function main() {
  console.log('='.repeat(60));
  console.log('🚕 Servidor MCP - Databricks NYC Taxi Analytics');
  console.log('='.repeat(60));
  
  // Configuração com valores padrão
  const host = process.env.DATABRICKS_HOST || "https://dbc-c163c494-7b8e.cloud.databricks.com";
  const token = process.env.DATABRICKS_TOKEN;
  const genieSpaceId = process.env.GENIE_SPACE_ID || "01f1382acaba1875bcdaafad34670d36";
  const genieSpaceName = process.env.GENIE_SPACE_NAME || "NYC Taxi Trips Analytics";

  console.log('\n📋 Configuração:');
  console.log(`   Host: ${host}`);
  console.log(`   Token: ***${token ? token.slice(-4) : 'NÃO CONFIGURADO'}`);
  console.log(`   Genie Space: ${genieSpaceName} (${genieSpaceId})`);

  if (!token) {
    console.error('\n❌ ERRO: DATABRICKS_TOKEN não configurado');
    console.error('   Configure a variável de ambiente DATABRICKS_TOKEN no arquivo .env');
    process.exit(1);
  }

  if (!genieSpaceId) {
    console.warn('\n⚠️  AVISO: GENIE_SPACE_ID não configurado');
    console.warn('   Você precisará especificar o space_id em cada query');
  }

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
      console.error('   Verifique suas credenciais no arquivo .env');
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
