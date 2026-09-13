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
* Passation de commande avec courriel de confirmation
* Choix du mode de réception : expédition ou retrait en magasin (Click & Collect)
* Suivi d'une commande à partir de son numéro
* Authentification (JWT en cookie httpOnly) et espace client avec historique des commandes
* Récupération de mot de passe oublié par lien à usage unique envoyé par courriel
### À venir très prochainement
* Paiement en ligne via un prestataire
* Création de produits par un administrateur (la route existe, son contrôleur reste à écrire)

## Architecture du projet
```bash
Labshop/
├── Labshop/          # Frontend Vue.js
├── Server/           # Backend Express.js
└── vercel.json       # Configuration du déploiement (vercel)
```

## Technologies utilisées
### Frontend
* Vue.js 3 + Vue Router
* Vite
* TailwindCSS
* PrimeVue
* Axios
### Backend
* Node.js
* Express.js 5
* Mongoose pour MongoDB
* jsonwebtoken + bcrypt pour l'authentification
* Helmet et express-rate-limit pour la sécurité
* Nodemailer + Handlebars pour les courriels transactionnels
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
NODE_ENV='production' ou 'development' selon l'environnement

# DATABASE
MONGO_URI=mongodb_connection_string/labstore-local

# MAIL SERVER
SMTP_HOST=smtp_host
SMTP_PORT=465
SMTP_USER=email_username
SMTP_APP_PASS=email_application_password

# FRONT-END
# Origine autorisée par CORS, et base de tous les liens envoyés par courriel
# (suivi de commande, réinitialisation de mot de passe, pied de page)
FRONT_END_URL=http://localhost:5173

# AUTH
JWT_SECRET=chaine_aleatoire_longue
JWT_EXPIRES_IN=7d
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

## API Documentation
Toutes les routes sont préfixées par `/api`.

### Produits
| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/products` | Retourner la liste des produits | public |
| GET | `/api/products/:id` | Retourner les détails d'un produit | public |
| POST | `/api/products` | Créer un produit — ⚠️ route protégée mais contrôleur non implémenté | administrateur |

### Commandes
| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/api/order` | Créer une nouvelle commande | public (rattachée au compte si connecté) |
| GET | `/api/order/:orderNumber` | Suivre une commande par son numéro | public |
| GET | `/api/orders` | Historique des commandes du client | connecté |

### Authentification
| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/api/auth/register` | Créer un compte | public |
| POST | `/api/auth/login` | Se connecter | public (limité en fréquence) |
| POST | `/api/auth/logout` | Se déconnecter | public |
| GET | `/api/auth/me` | Retourner la session courante | public |

### Mot de passe oublié
| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/api/auth/forgot-password` | Envoyer le lien de réinitialisation | public (limité à 5 / 15 min) |
| POST | `/api/auth/reset-password/verify` | Vérifier qu'un lien est encore valide | public (limité en fréquence) |
| POST | `/api/auth/reset-password` | Appliquer le nouveau mot de passe | public (limité en fréquence) |

Le jeton d'authentification est un JWT déposé dans un cookie `httpOnly` nommé
`labstore_token` (`SameSite=Lax`, et `Secure` dès que `NODE_ENV=production`).
Les appels du frontend doivent donc être faits avec `withCredentials: true`.

Le parcours de récupération démarre par le lien « Mot de passe oublié ? » de la
modale de connexion. Le courriel envoyé pointe vers la page `/reset-password` du
frontend, qui reçoit le jeton en paramètre d'URL puis ne le transmet à l'API que
dans le corps des requêtes — jamais dans une URL d'API, que le serveur journalise.

## Sécurité
* Toutes les communications sont en HTTPS en production : le frontend appelle l'API via `VITE_API_URL`, et l'API n'autorise que l'origine `FRONT_END_URL` en CORS.
* L'API ajoute ses propres en-têtes de sécurité avec Helmet, dont HSTS, plutôt que de dépendre uniquement de l'hébergeur.
* Les tentatives de connexion sont limitées en fréquence (`express-rate-limit`).
* Les mots de passe sont hachés avec bcrypt.
* Le courriel transactionnel part en TLS implicite (port 465, certificat vérifié).

### Réinitialisation de mot de passe
* La demande renvoie toujours la même réponse, que l'adresse corresponde à un compte ou non : l'endpoint ne peut pas servir à découvrir qui est client.
* Le jeton fait 256 bits et n'est **jamais stocké en clair** — seule son empreinte SHA-256 est conservée, de sorte qu'une fuite de la base ne permet pas de forger un lien valide.
* Il expire au bout de 10 minutes, ne sert qu'une seule fois, et une nouvelle demande invalide le lien précédent.
* Changer le mot de passe révoque toutes les sessions ouvertes (`tokenVersion`) : un cookie volé cesse aussitôt de fonctionner. Aucune reconnexion automatique n'a lieu.
* Un courriel d'avertissement est envoyé après coup, pour alerter le titulaire si le changement ne vient pas de lui.
