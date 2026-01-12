# VintBoost

VintBoost est un SaaS qui permet aux vendeurs Vinted de générer automatiquement du contenu vidéo pour promouvoir leur vestiaire sur TikTok et Instagram.

## Fonctionnement

1. L'utilisateur colle le lien de son vestiaire Vinted
2. Récupération des données via l'API Vinted (articles, photos, prix, marques)
3. L'utilisateur sélectionne les articles à mettre en avant
4. Génération automatique d'une vidéo courte format vertical (9:16)
5. Téléchargement et publication sur les réseaux sociaux

## Stack Technique

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: Node.js + Express
- **Base de données**: Supabase
- **Auth**: Supabase Auth
- **Déploiement**: Coolify
- **Paiements**: Stripe

## Structure du Projet

```
.
├── api-server/          # API Backend
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── middlewares/ # Middlewares Express
│   │   ├── services/    # Logique métier
│   │   ├── controllers/ # Contrôleurs
│   │   ├── routes/      # Routes API
│   │   └── app.js       # Application Express
│   ├── server.js        # Point d'entrée
│   └── package.json
│
└── frontend/            # Frontend React
    ├── src/
    │   ├── components/  # Composants React
    │   ├── hooks/       # Hooks personnalisés
    │   └── types/       # Types TypeScript
    └── package.json
```

## Installation

### Backend

```bash
cd api-server
npm install
cp .env.example .env
npm start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Variables d'Environnement

### Backend (.env)

```env
PORT=3000
API_KEY=your_api_key_here
ALLOWED_ORIGINS=http://localhost:5173
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium  # Pour Coolify
```

### Frontend (.env)

```env
VITE_SCRAPER_API_URL=http://localhost:3000
```

## Monétisation

- **Gratuit**: 1 vidéo/mois avec watermark
- **Pro**: Vidéos illimitées, sans watermark, tous templates

## API Endpoints

### `GET /health`
Health check de l'API

### `POST /api/scrape-wardrobe`
Scrape un vestiaire Vinted

**Body:**
```json
{
  "wardrobeUrl": "https://www.vinted.fr/member/123456-username"
}
```

**Response:**
```json
{
  "success": true,
  "username": "username",
  "userId": "123456",
  "totalItems": 42,
  "scrapedAt": "2024-01-11T12:00:00.000Z",
  "items": [...]
}
```

## Développement

### Backend
```bash
cd api-server
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## Déploiement avec Coolify

1. Créer une nouvelle application dans Coolify
2. Lier votre repository GitHub
3. Configurer les variables d'environnement
4. Déployer

## Licence

Propriétaire
