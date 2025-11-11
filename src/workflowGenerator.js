const { v4: uuidv4 } = require('uuid');

class WorkflowGenerator {
  constructor() {
    this.nodeTemplates = this.initializeNodeTemplates();
  }

  /**
   * Initialize common node templates
   */
  initializeNodeTemplates() {
    return {
      manualTrigger: {
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [250, 300]
      },
      webhook: {
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          path: '',
          httpMethod: 'POST',
          responseMode: 'onReceived'
        }
      },
      httpRequest: {
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 3,
        position: [450, 300],
        parameters: {
          url: '',
          method: 'GET',
          options: {}
        }
      },
      code: {
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [650, 300],
        parameters: {
          mode: 'runOnceForAllItems',
          jsCode: 'return items;'
        }
      },
      set: {
        type: 'n8n-nodes-base.set',
        typeVersion: 3.2,
        position: [650, 300],
        parameters: {
          assignments: {
            assignments: []
          }
        }
      },
      respondToWebhook: {
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1,
        position: [850, 300],
        parameters: {
          options: {}
        }
      }
    };
  }

  /**
   * Generate workflow from natural language description
   * @param {string} description - Natural language description
   * @param {Object} requirements - Additional requirements
   * @returns {Object} N8N workflow definition
   */
  generateFromDescription(description, requirements = {}) {
    console.log('Generating workflow from description:', description);
    
    // Analyze description to determine workflow type
    const workflowType = this.analyzeDescription(description);
    
    // Generate workflow based on type
    switch (workflowType) {
      case 'webhook_api':
        return this.generateWebhookAPIWorkflow(description, requirements);
      case 'scheduled':
        return this.generateScheduledWorkflow(description, requirements);
      case 'data_processing':
        return this.generateDataProcessingWorkflow(description, requirements);
      default:
        return this.generateBasicWorkflow(description, requirements);
    }
  }

  /**
   * Analyze description to determine workflow type
   */
  analyzeDescription(description) {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('webhook') || lowerDesc.includes('api') || lowerDesc.includes('endpoint')) {
      return 'webhook_api';
    }
    if (lowerDesc.includes('schedule') || lowerDesc.includes('every') || lowerDesc.includes('daily')) {
      return 'scheduled';
    }
    if (lowerDesc.includes('process') || lowerDesc.includes('transform') || lowerDesc.includes('data')) {
      return 'data_processing';
    }
    
    return 'basic';
  }

  /**
   * Generate a webhook/API workflow
   */
  generateWebhookAPIWorkflow(description, requirements) {
    const workflowName = requirements.name || this.generateWorkflowName(description);
    const webhookPath = requirements.webhookPath || workflowName.toLowerCase().replace(/\s+/g, '-');
    
    const webhookNode = this.createNode('webhook', {
      name: 'Webhook',
      parameters: {
        path: webhookPath,
        httpMethod: 'POST',
        responseMode: 'onReceived'
      }
    });
    
    const codeNode = this.createNode('code', {
      name: 'Process Data',
      position: [450, 300],
      parameters: {
        mode: 'runOnceForAllItems',
        jsCode: `// Process incoming webhook data\nconst items = $input.all();\n\n// Add your processing logic here\nconst processedItems = items.map(item => ({\n  json: {\n    ...item.json,\n    processed: true,\n    timestamp: new Date().toISOString()\n  }\n}));\n\nreturn processedItems;`
      }
    });
    
    const respondNode = this.createNode('respondToWebhook', {
      name: 'Respond',
      position: [650, 300]
    });
    
    return {
      name: workflowName,
      nodes: [webhookNode, codeNode, respondNode],
      connections: {
        [webhookNode.name]: {
          main: [[{ node: codeNode.name, type: 'main', index: 0 }]]
        },
        [codeNode.name]: {
          main: [[{ node: respondNode.name, type: 'main', index: 0 }]]
        }
      },
      active: false,
      settings: {
        executionOrder: 'v1'
      },
      staticData: null
    };
  }

  /**
   * Generate a scheduled workflow
   */
  generateScheduledWorkflow(description, requirements) {
    const workflowName = requirements.name || this.generateWorkflowName(description);
    
    const scheduleNode = {
      id: uuidv4(),
      name: 'Schedule',
      type: 'n8n-nodes-base.scheduleTrigger',
      typeVersion: 1.1,
      position: [250, 300],
      parameters: {
        rule: {
          interval: [{
            field: 'hours',
            hoursInterval: 1
          }]
        }
      }
    };
    
    const httpNode = this.createNode('httpRequest', {
      name: 'Fetch Data',
      position: [450, 300],
      parameters: {
        url: requirements.url || 'https://api.example.com/data',
        method: 'GET'
      }
    });
    
    const codeNode = this.createNode('code', {
      name: 'Process Data',
      position: [650, 300]
    });
    
    return {
      name: workflowName,
      nodes: [scheduleNode, httpNode, codeNode],
      connections: {
        [scheduleNode.name]: {
          main: [[{ node: httpNode.name, type: 'main', index: 0 }]]
        },
        [httpNode.name]: {
          main: [[{ node: codeNode.name, type: 'main', index: 0 }]]
        }
      },
      active: false,
      settings: {
        executionOrder: 'v1'
      },
      staticData: null
    };
  }

  /**
   * Generate a data processing workflow
   */
  generateDataProcessingWorkflow(description, requirements) {
    const workflowName = requirements.name || this.generateWorkflowName(description);
    
    const manualNode = this.createNode('manualTrigger', {
      name: 'Manual Trigger'
    });
    
    const codeNode1 = this.createNode('code', {
      name: 'Load Data',
      position: [450, 300],
      parameters: {
        jsCode: `// Load your data here\nreturn [\n  { json: { id: 1, name: 'Item 1' } },\n  { json: { id: 2, name: 'Item 2' } }\n];`
      }
    });
    
    const codeNode2 = this.createNode('code', {
      name: 'Transform Data',
      position: [650, 300],
      parameters: {
        jsCode: `// Transform your data here\nconst items = $input.all();\nreturn items.map(item => ({\n  json: {\n    ...item.json,\n    transformed: true\n  }\n}));`
      }
    });
    
    return {
      name: workflowName,
      nodes: [manualNode, codeNode1, codeNode2],
      connections: {
        [manualNode.name]: {
          main: [[{ node: codeNode1.name, type: 'main', index: 0 }]]
        },
        [codeNode1.name]: {
          main: [[{ node: codeNode2.name, type: 'main', index: 0 }]]
        }
      },
      active: false,
      settings: {
        executionOrder: 'v1'
      },
      staticData: null
    };
  }

  /**
   * Generate a basic workflow
   */
  generateBasicWorkflow(description, requirements) {
    const workflowName = requirements.name || this.generateWorkflowName(description);
    
    const manualNode = this.createNode('manualTrigger', {
      name: 'When clicking Test workflow'
    });
    
    const codeNode = this.createNode('code', {
      name: 'Code',
      position: [450, 300],
      parameters: {
        jsCode: `// ${description}\nreturn [{ json: { success: true, message: 'Workflow executed' } }];`
      }
    });
    
    return {
      name: workflowName,
      nodes: [manualNode, codeNode],
      connections: {
        [manualNode.name]: {
          main: [[{ node: codeNode.name, type: 'main', index: 0 }]]
        }
      },
      active: false,
      settings: {
        executionOrder: 'v1'
      },
      staticData: null
    };
  }

  /**
   * Create a node with default values
   */
  createNode(type, overrides = {}) {
    const template = this.nodeTemplates[type] || {};
    
    return {
      id: uuidv4(),
      name: overrides.name || type.charAt(0).toUpperCase() + type.slice(1),
      type: template.type || type,
      typeVersion: template.typeVersion || 1,
      position: overrides.position || template.position || [250, 300],
      parameters: {
        ...template.parameters,
        ...overrides.parameters
      }
    };
  }

  /**
   * Generate a workflow name from description
   */
  generateWorkflowName(description) {
    const truncated = description.substring(0, 50);
    return truncated.charAt(0).toUpperCase() + truncated.slice(1);
  }
}

module.exports = WorkflowGenerator;
