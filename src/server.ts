import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { DatabricksClient } from './databricks.js';
import { tools } from './tools.js';

export class DatabricksMCPServer {
  private server: Server;
  private databricksClient: DatabricksClient;

  constructor(databricksClient: DatabricksClient) {
    this.databricksClient = databricksClient;

    this.server = new Server(
      {
        name: 'databricks-genie-nyc-taxi',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    console.log('Servidor MCP Databricks NYC Taxi inicializado');
  }

  private setupHandlers() {
    // Handler para listar tools disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.log('Listando tools disponíveis...');
      return { tools };
    });

    // Handler para executar tools
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      console.log(`Executando tool: ${name}`, args);

      try {
        switch (name) {
          case 'query_nyc_taxi':
            return await this.handleQueryNYCTaxi(args);

          case 'list_genie_spaces':
            return await this.handleListGenieSpaces();

          case 'get_conversation':
            return await this.handleGetConversation(args);

          case 'test_connection':
            return await this.handleTestConnection();

          default:
            throw new Error(`Tool desconhecido: ${name}`);
        }
      } catch (error: any) {
        console.error(`Erro ao executar tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `❌ Erro: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async handleQueryNYCTaxi(args: any) {
    const { question } = args;

    if (!question) {
      throw new Error('Parâmetro "question" é obrigatório');
    }

    console.log(`Consultando Genie sobre NYC Taxi: "${question}"`);
    const result = await this.databricksClient.queryGenie(question);

    return {
      content: [
        {
          type: 'text',
          text: `🚕 Resposta do Genie sobre NYC Taxi:\n\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  private async handleListGenieSpaces() {
    console.log('Listando Genie Spaces...');
    const spaces = await this.databricksClient.listGenieSpaces();

    const spacesList = spaces.map((space: any) =>
      `- ${space.name || 'Sem nome'} (ID: ${space.space_id || space.id})`
    ).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `📊 Genie Spaces disponíveis:\n\n${spacesList || 'Nenhum space encontrado'}`,
        },
      ],
    };
  }

  private async handleGetConversation(args: any) {
    const { space_id, conversation_id } = args;

    if (!space_id || !conversation_id) {
      throw new Error('Parâmetros "space_id" e "conversation_id" são obrigatórios');
    }

    console.log(`Obtendo conversa ${conversation_id} do space ${space_id}`);
    const conversation = await this.databricksClient.getConversation(space_id, conversation_id);

    return {
      content: [
        {
          type: 'text',
          text: `💬 Detalhes da conversa:\n\n${JSON.stringify(conversation, null, 2)}`,
        },
      ],
    };
  }

  private async handleTestConnection() {
    console.log('Testando conexão com Databricks...');
    const isConnected = await this.databricksClient.testConnection();

    return {
      content: [
        {
          type: 'text',
          text: isConnected
            ? '✅ Conexão com Databricks OK! Credenciais válidas.'
            : '❌ Falha na conexão com Databricks. Verifique as credenciais.',
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('🚀 Servidor MCP Databricks NYC Taxi iniciado e pronto para receber requisições');
  }
}

// Made with Bob
