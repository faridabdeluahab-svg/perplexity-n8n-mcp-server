# Serveur MCP Perplexity pour N8N

## Description

Ce serveur MCP (Model Context Protocol) permet à Perplexity de créer automatiquement des workflows N8N en fonction de vos besoins exprimés en langage naturel.

## Fonctionnalités

- 🤖 **Création automatique de workflows** : Décrivez ce que vous voulez automatiser, le serveur crée le workflow
- 🔗 **Intégration N8N** : Connexion directe avec votre instance N8N
- 🐳 **Docker ready** : Déploiement facile avec Docker
- ⚡ **API MCP** : Communication via le protocole MCP standard

## Prérequis

- Docker et Docker Compose installés
- Une instance N8N fonctionnelle
- Une clé API N8N

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/faridabdeluahab-svg/perplexity-n8n-mcp-server.git
cd perplexity-n8n-mcp-server
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
N8N_API_KEY=votre_cle_api_n8n
N8N_API_URL=https://n8n.srv1120261.hstgr.cloud
MCP_SERVER_PORT=3000
```

### 3. Récupérer votre clé API N8N

1. Connectez-vous à votre instance N8N
2. Allez dans **Paramètres** > **API n8n**
3. Cliquez sur **Créer une clé API**
4. Copiez la clé et ajoutez-la dans votre fichier `.env`

### 4. Démarrer le serveur avec Docker

```bash
docker-compose up -d
```

Le serveur sera accessible sur `http://localhost:3000`

## Utilisation

### Créer un workflow via l'API

Envoyez une requête POST au serveur MCP :

```bash
curl -X POST http://localhost:3000/create-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Je veux un workflow qui envoie un email chaque matin à 9h",
    "name": "Email Quotidien"
  }'
```

### Exemples de workflows que vous pouvez créer

- "Crée un workflow qui surveille mon site web toutes les 5 minutes"
- "Je veux automatiser l'envoi de rapports par email chaque vendredi"
- "Crée une intégration entre Google Sheets et Slack"

## Architecture

```
perplexity-n8n-mcp-server/
├── src/
│   ├── server.js           # Serveur principal MCP
│   ├── n8nClient.js        # Client pour l'API N8N
│   └── workflowGenerator.js # Générateur de workflows
├── Dockerfile
├── docker-compose.yml
├── package.json
└── .env.example
```

## Développement

### Installer les dépendances

```bash
npm install
```

### Démarrer en mode développement

```bash
npm run dev
```

## API Endpoints

### POST /create-workflow

Crée un nouveau workflow N8N

**Body:**
```json
{
  "description": "Description du workflow souhaité",
  "name": "Nom du workflow"
}
```

**Response:**
```json
{
  "success": true,
  "workflowId": "123",
  "message": "Workflow créé avec succès"
}
```

### GET /health

Vérifie l'état du serveur

## Configuration avancée

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|--------------------|
| `N8N_API_KEY` | Clé API N8N | - |
| `N8N_API_URL` | URL de votre instance N8N | - |
| `MCP_SERVER_PORT` | Port du serveur MCP | 3000 |

## Troubleshooting

### Le serveur ne se connecte pas à N8N

1. Vérifiez que votre clé API est correcte
2. Assurez-vous que l'URL N8N est accessible
3. Vérifiez les logs : `docker-compose logs -f`

### Les workflows ne se créent pas

1. Vérifiez que vous avez les permissions nécessaires sur N8N
2. Consultez les logs pour voir les erreurs détaillées

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT

## Support

Pour toute question, ouvrez une issue sur GitHub.
