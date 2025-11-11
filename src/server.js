const express = require('express');
const axios = require('axios');
require('dotenv').config();
const N8NClient = require('./n8nClient');
const WorkflowGenerator = require('./workflowGenerator');

const app = express();
const PORT = process.env.MCP_SERVER_PORT || 3000;

// Initialize N8N client
const n8nClient = new N8NClient({
  baseURL: process.env.N8N_API_URL,
  apiKey: process.env.N8N_API_KEY
});

const workflowGenerator = new WorkflowGenerator();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// MCP protocol endpoint - Create workflow from natural language
app.post('/mcp/create-workflow', async (req, res) => {
  try {
    const { description, requirements } = req.body;
    
    if (!description) {
      return res.status(400).json({ 
        error: 'Description is required',
        message: 'Please provide a description of the workflow you want to create'
      });
    }

    console.log('Generating workflow from description:', description);
    
    // Generate workflow JSON from natural language description
    const workflowDefinition = workflowGenerator.generateFromDescription(description, requirements);
    
    // Create the workflow in N8N
    const createdWorkflow = await n8nClient.createWorkflow(workflowDefinition);
    
    res.json({
      success: true,
      message: 'Workflow created successfully',
      workflow: {
        id: createdWorkflow.id,
        name: createdWorkflow.name,
        url: `${process.env.N8N_API_URL}/workflow/${createdWorkflow.id}`,
        nodes: createdWorkflow.nodes.length,
        createdAt: createdWorkflow.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || error.toString()
    });
  }
});

// Get all workflows
app.get('/mcp/workflows', async (req, res) => {
  try {
    const workflows = await n8nClient.getWorkflows();
    res.json({
      success: true,
      count: workflows.length,
      workflows: workflows
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific workflow by ID
app.get('/mcp/workflows/:id', async (req, res) => {
  try {
    const workflow = await n8nClient.getWorkflow(req.params.id);
    res.json({
      success: true,
      workflow: workflow
    });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Execute a workflow
app.post('/mcp/workflows/:id/execute', async (req, res) => {
  try {
    const execution = await n8nClient.executeWorkflow(req.params.id, req.body);
    res.json({
      success: true,
      execution: execution
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 MCP Server for Perplexity-N8N Integration`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔗 N8N Instance: ${process.env.N8N_API_URL}`);
  console.log(`\nEndpoints:`);
  console.log(`  - POST /mcp/create-workflow - Create workflow from description`);
  console.log(`  - GET  /mcp/workflows - List all workflows`);
  console.log(`  - GET  /mcp/workflows/:id - Get specific workflow`);
  console.log(`  - POST /mcp/workflows/:id/execute - Execute a workflow`);
  console.log(`  - GET  /health - Health check\n`);
});

module.exports = app;
