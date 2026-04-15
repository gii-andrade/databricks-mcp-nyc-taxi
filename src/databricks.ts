import axios, { AxiosInstance } from 'axios';

export interface DatabricksConfig {
  host: string;
  token: string;
  genieSpaceId?: string;
}

export class DatabricksClient {
  private client: AxiosInstance;
  private genieSpaceId?: string;

  constructor(config: DatabricksConfig) {
    this.client = axios.create({
      baseURL: config.host,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    this.genieSpaceId = config.genieSpaceId;
  }

  /**
   * Envia uma query para o Genie Agent
   */
  async queryGenie(question: string, spaceId?: string): Promise<any> {
    const targetSpaceId = spaceId || this.genieSpaceId;
    
    if (!targetSpaceId) {
      throw new Error('Genie Space ID não configurado');
    }

    try {
      console.log(`Enviando query para Genie Space ${targetSpaceId}: ${question}`);
      
      // Endpoint para criar uma conversa no Genie
      const response = await this.client.post(`/api/2.0/genie/spaces/${targetSpaceId}/start-conversation`, {
        content: question
      });
      
      console.log('Resposta do Genie:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('Erro ao consultar Genie:', error.response?.data || error.message);
      throw new Error(`Erro ao consultar Genie: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Lista Genie Spaces disponíveis
   */
  async listGenieSpaces(): Promise<any[]> {
    try {
      console.log('Listando Genie Spaces...');
      const response = await this.client.get('/api/2.0/genie/spaces');
      console.log('Spaces encontrados:', response.data.spaces?.length || 0);
      return response.data.spaces || [];
    } catch (error: any) {
      console.error('Erro ao listar Genie Spaces:', error.response?.data || error.message);
      throw new Error(`Erro ao listar Genie Spaces: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Obtém detalhes de uma conversa do Genie
   */
  async getConversation(spaceId: string, conversationId: string): Promise<any> {
    try {
      console.log(`Obtendo conversa ${conversationId} do space ${spaceId}`);
      const response = await this.client.get(
        `/api/2.0/genie/spaces/${spaceId}/conversations/${conversationId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter conversa:', error.response?.data || error.message);
      throw new Error(`Erro ao obter conversa: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Executa SQL diretamente (alternativa ao Genie)
   */
  async executeSQL(query: string, warehouseId: string): Promise<any> {
    try {
      console.log(`Executando SQL no warehouse ${warehouseId}`);
      const response = await this.client.post('/api/2.0/sql/statements', {
        statement: query,
        warehouse_id: warehouseId,
        wait_timeout: '30s'
      });
      
      console.log('SQL executado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao executar SQL:', error.response?.data || error.message);
      throw new Error(`Erro ao executar SQL: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Testa a conexão com o Databricks
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testando conexão com Databricks via Genie Spaces...');
      await this.client.get('/api/2.0/genie/spaces');
      console.log('✅ Conexão com Databricks OK (Genie acessível)');
      return true;
    } catch (error: any) {
      console.error('❌ Erro na conexão com Databricks:', error.response?.data || error.message);
      return false;
    }
  }
}

// Made with Bob
