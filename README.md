# Description
Labshop est une application e-commerce de vente de produits de laboratoire dont le frontend est développé en Vue.js et déployé sur Vercel, puis le backend en Express.js  et déployé sur Render.

## 📸 Captues d'écran
Voici quelques aperçus de l'application :
### Sur mobile 
<img width="190" height="600" alt="mobile-home" src="https://github.com/user-attachments/assets/7081fbc5-2180-48fa-b847-222e6b28617e" />
<img width="190" height="600" alt="mobile-product-details " src="https://github.com/user-attachments/assets/c1c044ab-3db5-490d-9890-01513c537467" />
<img width="190" height="600" alt="mobile-cart" src="https://github.com/user-attachments/assets/df4ac1ad-9ce3-4d0a-9d2a-0b7021364604" />
<img width="190" height="600" alt="mobile-checkout" src="https://github.com/user-attachments/assets/a9ea8010-ad84-4055-805d-8bca9c908a93" />

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
> Attention : Faites l'installation dans l'odre d'apparition des éléments de cette section. ⚠️
### Backend
1. Tout d'abord, exécutez les commandes suivantes pour installer les dépendances:
```
cd Server
npm install
```
2. Installez et démarrez une base de données MongoDB localement en tant que service. L'installation de MongoDB Compass vous permet d'avoir une interface graphique pour visualiser les bases de données créées, les collections et les documents.
3. Dans ./Server/ ayez un fichier .env à la racine du répertoire dans lequel vous renseignez les variables d'environnement suivantes :
> Veillez à ajouter le **"/labstore-local"** après le **"mongodb_connection_string"** ⚠️
```
# API
PORT=3000

# DATABASE
MONGO_URI=mongodb_connection_string/labstore-local

# MAIL SERVER
SMTP_HOST=smtp_host
SMTP_PORT=465
SMTP_USER=email_username
SMTP_APP_PASS=email_application_password
```
4. Lancez maintenant le serveur d'API avec la commande suivante :
```
npm run dev
```

### Frontend
1. À la racine du répertoire de projet, exécutez ces commandes suivantes pour installer les dépendances :
```
cd Labshop
npm install
```
2. Créez un fichier .env à la racine du répertoire Labshop/ dans lequel vous collez l'url de l'API comme variable d'environnement :
```
VITE_API_URL=http://localhost:3000/api
```
3. Exécutez la commande :
```
npm run dev
```
Le frontend s'exécutera localement au : http://localhost:5173 et l'application sera prête à utiliser.
