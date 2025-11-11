const axios = require('axios');

class N8NClient {
  constructor(config) {
    this.baseURL = config.baseURL;
    this.apiKey = config.apiKey;
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('N8N API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        throw error;
      }
    );
  }

  /**
   * Create a new workflow in N8N
   * @param {Object} workflowData - The workflow definition
   * @returns {Promise<Object>} The created workflow
   */
  async createWorkflow(workflowData) {
    try {
      const response = await this.client.post('/api/v1/workflows', workflowData);
      console.log('Workflow created successfully:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('Failed to create workflow:', error.response?.data || error.message);
      throw new Error(`Failed to create workflow: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get all workflows from N8N
   * @returns {Promise<Array>} Array of workflows
   */
  async getWorkflows() {
    try {
      const response = await this.client.get('/api/v1/workflows');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch workflows:', error.response?.data || error.message);
      throw new Error(`Failed to fetch workflows: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get a specific workflow by ID
   * @param {string} workflowId - The workflow ID
   * @returns {Promise<Object>} The workflow data
   */
  async getWorkflow(workflowId) {
    try {
      const response = await this.client.get(`/api/v1/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch workflow ${workflowId}:`, error.response?.data || error.message);
      throw new Error(`Failed to fetch workflow: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Update an existing workflow
   * @param {string} workflowId - The workflow ID
   * @param {Object} workflowData - The updated workflow data
   * @returns {Promise<Object>} The updated workflow
   */
  async updateWorkflow(workflowId, workflowData) {
    try {
      const response = await this.client.put(`/api/v1/workflows/${workflowId}`, workflowData);
      console.log('Workflow updated successfully:', workflowId);
      return response.data;
    } catch (error) {
      console.error(`Failed to update workflow ${workflowId}:`, error.response?.data || error.message);
      throw new Error(`Failed to update workflow: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Delete a workflow
   * @param {string} workflowId - The workflow ID
   * @returns {Promise<void>}
   */
  async deleteWorkflow(workflowId) {
    try {
      await this.client.delete(`/api/v1/workflows/${workflowId}`);
      console.log('Workflow deleted successfully:', workflowId);
    } catch (error) {
      console.error(`Failed to delete workflow ${workflowId}:`, error.response?.data || error.message);
      throw new Error(`Failed to delete workflow: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Execute a workflow
   * @param {string} workflowId - The workflow ID
   * @param {Object} data - Input data for the workflow
   * @returns {Promise<Object>} The execution result
   */
  async executeWorkflow(workflowId, data = {}) {
    try {
      const response = await this.client.post(`/api/v1/workflows/${workflowId}/execute`, data);
      console.log('Workflow executed successfully:', workflowId);
      return response.data;
    } catch (error) {
      console.error(`Failed to execute workflow ${workflowId}:`, error.response?.data || error.message);
      throw new Error(`Failed to execute workflow: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get executions for a workflow
   * @param {string} workflowId - The workflow ID
   * @returns {Promise<Array>} Array of executions
   */
  async getExecutions(workflowId) {
    try {
      const response = await this.client.get(`/api/v1/executions`, {
        params: { workflowId }
      });
      return response.data.data || [];
    } catch (error) {
      console.error(`Failed to fetch executions for workflow ${workflowId}:`, error.response?.data || error.message);
      throw new Error(`Failed to fetch executions: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Activate a workflow
   * @param {string} workflowId - The workflow ID
   * @returns {Promise<Object>} The activated workflow
   */
  async activateWorkflow(workflowId) {
    try {
      // Get current workflow
      const workflow = await this.getWorkflow(workflowId);
      // Update with active: true
      workflow.active = true;
      const response = await this.updateWorkflow(workflowId, workflow);
      console.log('Workflow activated successfully:', workflowId);
      return response;
    } catch (error) {
      console.error(`Failed to activate workflow ${workflowId}:`, error.response?.data || error.message);
      throw new Error(`Failed to activate workflow: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Deactivate a workflow
   * @param {string} workflowId - The workflow ID
   * @returns {Promise<Object>} The deactivated workflow
   */
  async deactivateWorkflow(workflowId) {
    try {
      // Get current workflow
      const workflow = await this.getWorkflow(workflowId);
      // Update with active: false
      workflow.active = false;
      const response = await this.updateWorkflow(workflowId, workflow);
      console.log('Workflow deactivated successfully:', workflowId);
      return response;
    } catch (error) {
      console.error(`Failed to deactivate workflow ${workflowId}:`, error.response?.data || error.message);
      throw new Error(`Failed to deactivate workflow: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Test N8N API connection
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      await this.getWorkflows();
      console.log('✅ N8N API connection successful');
      return true;
    } catch (error) {
      console.error('❌ N8N API connection failed:', error.message);
      return false;
    }
  }
}

module.exports = N8NClient;
