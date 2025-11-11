# 🚀 Guide de Déploiement - Serveur MCP Perplexity-N8N

## 📋 Prérequis

Vous avez mentionné avoir Docker installé sur votre PC. Parfait! Voici ce dont nous avons besoin:

- ✅ Docker Desktop installé et en cours d'exécution
- ✅ Git installé
- ✅ Accès à votre instance N8N: https://n8n.srv1120261.hstgr.cloud
- ✅ Clé API N8N (trouvée: "N8NKey")

## 🎯 Déploiement Rapide (Méthode Recommandée)

### Étape 1: Cloner le Repository

Ouvrez votre terminal (PowerShell, CMD, ou Git Bash) et exécutez:

```bash
# Cloner le projet
git clone https://github.com/faridabdeluahab-svg/perplexity-n8n-mcp-server.git

# Entrer dans le répertoire
cd perplexity-n8n-mcp-server
```

### Étape 2: Configurer les Variables d'Environnement

```bash
# Windows (PowerShell)
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

**Éditer le fichier .env** avec votre éditeur favori (Notepad++, VSCode, etc.):

```env
# N8N Configuration
N8N_API_URL=https://n8n.srv1120261.hstgr.cloud
N8N_API_KEY=N8NKey

# MCP Server Configuration
MCP_SERVER_PORT=3000

# Environment
NODE_ENV=production
```

### Étape 3: Démarrer avec Docker Compose

```bash
# Construire et démarrer le conteneur
docker-compose up -d

# Vérifier que le conteneur tourne
docker-compose ps

# Voir les logs
docker-compose logs -f
```

✅ **Le serveur est maintenant accessible sur http://localhost:3000**

### Étape 4: Tester l'Installation

#### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

**Réponse attendue:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-11T16:00:00.000Z"
}
```

#### Test 2: Créer un Workflow Simple

```bash
curl -X POST http://localhost:3000/mcp/create-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Create a simple webhook that receives data",
    "requirements": {
      "name": "Test Webhook Workflow"
    }
  }'
```

#### Test 3: Lister les Workflows

```bash
curl http://localhost:3000/mcp/workflows
```

## 🔧 Déploiement Sans Docker (Alternatif)

Si vous préférez exécuter directement avec Node.js:

### Prérequis
- Node.js 18+ installé
- npm installé

### Commandes

```bash
# Installer les dépendances
npm install

# Ajouter uuid comme dépendance manquante
npm install uuid

# Démarrer le serveur
npm start

# OU en mode développement avec redémarrage automatique
npm run dev
```

## 📝 Commandes Docker Utiles

```bash
# Arrêter le serveur
docker-compose down

# Redémarrer le serveur
docker-compose restart

# Voir les logs en temps réel
docker-compose logs -f mcp-server

# Reconstruire après modification du code
docker-compose up -d --build

# Arrêter et supprimer tout (volumes inclus)
docker-compose down -v
```

## 🌐 Exemples d'Utilisation

### 1. Créer un Workflow Webhook/API

```bash
curl -X POST http://localhost:3000/mcp/create-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Create a webhook API endpoint that processes user registration data",
    "requirements": {
      "name": "User Registration API",
      "webhookPath": "register-user"
    }
  }'
```

### 2. Créer un Workflow Planifié

```bash
curl -X POST http://localhost:3000/mcp/create-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Schedule a daily data sync from external API",
    "requirements": {
      "name": "Daily Data Sync",
      "url": "https://api.example.com/data"
    }
  }'
```

### 3. Créer un Workflow de Traitement de Données

```bash
curl -X POST http://localhost:3000/mcp/create-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Process and transform customer data",
    "requirements": {
      "name": "Customer Data Processor"
    }
  }'
```

### 4. Exécuter un Workflow Existant

```bash
curl -X POST http://localhost:3000/mcp/workflows/WORKFLOW_ID/execute \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "test": true
    }
  }'
```

## 🔍 Vérification dans N8N

Après avoir créé un workflow:

1. **Ouvrez votre N8N**: https://n8n.srv1120261.hstgr.cloud
2. **Allez dans "Workflows"**
3. **Vous devriez voir le nouveau workflow créé!**
4. **Cliquez dessus pour le visualiser et le modifier si nécessaire**

## 🐛 Dépannage

### Problème: Le conteneur ne démarre pas

```bash
# Vérifier les logs
docker-compose logs mcp-server

# Vérifier que Docker est en cours d'exécution
docker ps
```

### Problème: Erreur de connexion à N8N

1. Vérifiez que votre clé API est correcte dans le fichier `.env`
2. Testez l'accès à N8N:

```bash
curl -H "X-N8N-API-KEY: N8NKey" https://n8n.srv1120261.hstgr.cloud/api/v1/workflows
```

### Problème: Port 3000 déjà utilisé

Modifiez le port dans le fichier `.env`:

```env
MCP_SERVER_PORT=3001
```

Puis dans `docker-compose.yml`, changez:

```yaml
ports:
  - "3001:3001"
```

## 🎨 Configuration Avancée

### Changer le Port du Serveur

Dans `.env`:
```env
MCP_SERVER_PORT=8080
```

### Activer le Mode Production

Dans `.env`:
```env
NODE_ENV=production
```

### Logs Personnalisés

Les logs sont automatiquement créés dans le répertoire `logs/` (mappé dans docker-compose.yml).

## 🚀 Déploiement en Production

### Option 1: Sur un VPS (Recommandé)

```bash
# Sur votre serveur
ssh user@your-server.com

git clone https://github.com/faridabdeluahab-svg/perplexity-n8n-mcp-server.git
cd perplexity-n8n-mcp-server

# Configurer .env avec les bonnes valeurs
nano .env

# Démarrer
docker-compose up -d
```

### Option 2: Exposer Localement avec ngrok

Si vous voulez tester depuis l'extérieur sans VPS:

```bash
# Installer ngrok (https://ngrok.com/)
ngrok http 3000

# Vous obtiendrez une URL publique comme:
# https://abc123.ngrok.io -> http://localhost:3000
```

## 📊 Surveillance

### Vérifier l'État du Serveur

```bash
# Health check
curl http://localhost:3000/health

# Statistiques Docker
docker stats mcp-server

# Utilisation mémoire
docker-compose exec mcp-server node -e "console.log(process.memoryUsage())"
```

## 🔐 Sécurité

### Recommandations

1. **Ne jamais committer le fichier `.env`** (déjà dans .gitignore)
2. **Régénérer la clé API N8N** si elle a été exposée
3. **Utiliser HTTPS** en production avec un reverse proxy (nginx/traefik)
4. **Limiter l'accès réseau** avec un firewall

## 📚 Ressources

- **Repository**: https://github.com/faridabdeluahab-svg/perplexity-n8n-mcp-server
- **N8N Instance**: https://n8n.srv1120261.hstgr.cloud
- **N8N API Docs**: https://docs.n8n.io/api/
- **Docker Docs**: https://docs.docker.com/

## ✅ Checklist Post-Déploiement

- [ ] Le serveur démarre sans erreur
- [ ] Health check retourne "healthy"
- [ ] Connexion à N8N réussie
- [ ] Test de création de workflow réussi
- [ ] Le workflow apparaît dans N8N
- [ ] Les logs sont accessibles
- [ ] Documentation lue et comprise

## 🎉 Félicitations!

Votre serveur MCP est maintenant déployé et opérationnel! Vous pouvez maintenant créer des workflows N8N directement depuis Perplexity ou tout autre client compatible MCP.

**Questions ou problèmes?** Consultez les logs avec `docker-compose logs -f`
