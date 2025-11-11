FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port MCP
EXPOSE 3000

# Démarrer le serveur
CMD ["node", "src/server.js"]
