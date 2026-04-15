import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Define os tools disponíveis no servidor MCP
 */
export const tools: Tool[] = [
  {
    name: 'query_nyc_taxi',
    description: 'Faz perguntas sobre dados de táxis de NYC usando o Databricks Genie Agent. Retorna análises, estatísticas e insights sobre viagens de táxi.',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'Pergunta em linguagem natural sobre os dados de táxis de NYC (ex: "Quantas viagens foram feitas em janeiro?", "Qual a distância média das corridas?")'
        }
      },
      required: ['question']
    }
  },
  {
    name: 'list_genie_spaces',
    description: 'Lista todos os Genie Spaces disponíveis no workspace Databricks',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_conversation',
    description: 'Obtém detalhes de uma conversa específica do Genie',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'string',
          description: 'ID do Genie Space'
        },
        conversation_id: {
          type: 'string',
          description: 'ID da conversa'
        }
      },
      required: ['space_id', 'conversation_id']
    }
  },
  {
    name: 'test_connection',
    description: 'Testa a conexão com o Databricks para verificar se as credenciais estão funcionando',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
];

// Made with Bob
