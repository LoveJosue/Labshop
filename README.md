# Description
Labshop est une application e-commerce de vente de produits de laboratoire dont le frontend est développé en Vue.js et déployé sur Vercel, puis le backend en Express.js  et déployé sur Render.

## 📸 Captues d'écran
Voici quelques aperçus de l'application :
### Sur mobile 
>L'apparence de l'application sur desktop est présentée à la fin 👇
<img width="190" height="600" alt="mobile-home" src="https://github.com/user-attachments/assets/7081fbc5-2180-48fa-b847-222e6b28617e" />
<img width="190" height="600" alt="mobile-products-list" src="https://github.com/user-attachments/assets/c7582211-d7c7-4e9d-9dec-ae6b71442a8f" />
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

## Autres captures d'écran 
### Sur desktop
<img width="600" height="600" alt="desktop-home" src="https://github.com/user-attachments/assets/5d104af7-5926-415c-9d32-0bea3966a821" />
<img width="600" height="600" alt="desktop-products-list" src="https://github.com/user-attachments/assets/7d0cbca4-8ebe-4d6a-93e3-30ee93cba84a" />
<img width="600" height="600" alt="desktop-cart" src="https://github.com/user-attachments/assets/61d75ded-b92c-4ec5-81f5-61b9dfd8d19f" />
<img width="600" height="600" alt="desktop-checkout" src="https://github.com/user-attachments/assets/f18fbe31-1122-40b8-85c3-2c10a9b37851" />
