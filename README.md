# Description
Labshop est une application e-commerce de vente de produits de laboratoire dont le frontend est développé en Vue.js et déployé sur Vercel, puis le backend en Express.js  et déployé sur Render.

## Fonctionnalités
### Déjà présentes
* Catalogue de produits
* Page de détails du produit
* Ajout au panier
* Gestion du pannier
### À venir très prochainement
* Passation de commande avec courriel de confirmation
* Paiement
* Authentification

## Architecture du projet
```bash
Labshop/
├── Labshop/          # Frontend Vue.js
├── Server/           # Backend Express.js
└── vercel.json       # Configuration du déploiement (vercel)
```

## Technologies utilisées
### Frontend
* Vue.js 3
* TailwindCSS
* Axios
### Backend
* Node.js
* Express.js
* Mongoose pour MongoDB
### Déploiement
* Vercel -> Frontend
* Render -> API
### DNS
* Hébergeur DNS : Namecheap
* Client e-mail : Zoho

## Installation et exécution locale
### Backend
```
cd Server
npm install
npm run dev
```
### Frontend
```
cd Labshop
npm install
npm run dev

```
Le frontend s'exécutera localement à l'url suivant : http://localhost:5173

## Configuration des variables d'environnement
### Frontend
Ayez un fichier .env à la racine du répertoire Labshop/ dans lequel vous collez cette ligne :
```
VITE_API_URL=http://localhost:3000/api
```



