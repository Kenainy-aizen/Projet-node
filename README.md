# 🏗️ Gestion Matériel

Application web **SPA** de gestion de matériels, développée avec **React**, **Node.js/Express** et **MariaDB**.

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Architecture du projet](#-architecture-du-projet)
- [Prérequis](#-prérequis)
- [Installation et démarrage](#-installation-et-démarrage)
- [Configuration](#-configuration)
- [API REST](#-api-rest)
- [Captures d'écran](#-captures-décran)
- [Auteur](#-auteur)

---

## 👁️ Aperçu

**Gestion Matériel** est une application fullstack permettant de gérer un inventaire de matériels. Elle propose une interface moderne avec authentification sécurisée, des opérations CRUD complètes, ainsi qu'un tableau de bord de bilan avec visualisations graphiques.

---

## ✨ Fonctionnalités

| # | Fonctionnalité | Détail |
|---|---|---|
| 🔐 | **Authentification** | Inscription / Connexion sécurisée avec JWT (validité 24h) |
| ➕ | **Ajout de matériel** | Formulaire avec désignation, état et quantité |
| 📋 | **Liste & Gestion** | Tableau avec recherche, édition inline et suppression |
| 📊 | **Bilan & Graphes** | Statistiques + histogramme + camembert (recharts) |
| 💬 | **Messages serveur** | Retour en temps réel : *"Insertion/Modification/Suppression réussie ou échouée"* |
| 🛡️ | **Routes protégées** | Toutes les routes API nécessitent un token JWT valide |

---

## 🛠️ Technologies utilisées

### Backend
| Package | Version | Rôle |
|---|---|---|
| [Node.js](https://nodejs.org) | ≥ 18 | Environnement d'exécution |
| [Express](https://expressjs.com) | ^4.18 | Framework serveur HTTP |
| [mysql2](https://github.com/sidorares/node-mysql2) | ^3.6 | Driver MariaDB/MySQL avec Promises |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | ^9.0 | Authentification JWT |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | ^2.4 | Hachage des mots de passe |
| [cors](https://github.com/expressjs/cors) | ^2.8 | Gestion des origines croisées |
| [dotenv](https://github.com/motdotla/dotenv) | ^16.3 | Variables d'environnement |
| [nodemon](https://nodemon.io) | ^3.0 | Rechargement automatique (dev) |

### Frontend
| Package | Version | Rôle |
|---|---|---|
| [React](https://react.dev) | ^18.2 | Bibliothèque UI |
| [React Router DOM](https://reactrouter.com) | ^6.16 | Routage SPA |
| [Axios](https://axios-http.com) | ^1.5 | Requêtes HTTP + intercepteurs JWT |
| [Recharts](https://recharts.org) | ^2.8 | Graphiques (BarChart, PieChart) |

### Base de données
| | |
|---|---|
| **SGBD** | MariaDB (compatible MySQL) |
| **Charset** | utf8mb4 (support des caractères accentués) |

---

## 📁 Architecture du projet

```
gestion-materiel/
│
├── backend/
│   ├── config/
│   │   └── db.js               # Pool de connexions MariaDB (mysql2)
│   ├── middleware/
│   │   └── auth.js             # Middleware de vérification JWT
│   ├── routes/
│   │   ├── auth.js             # POST /api/auth/login  |  /register
│   │   └── materiel.js         # GET/POST/PUT/DELETE /api/materiel
│   ├── .env                    # Variables d'environnement (ignoré par git)
│   ├── init.sql                # Script de création BDD + tables
│   ├── package.json
│   └── server.js               # Point d'entrée Express
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Login.jsx        # Page d'authentification (Login/Inscription)
│       │   ├── MainLayout.jsx   # Layout principal avec sidebar 3 menus
│       │   ├── AddMateriel.jsx  # Menu 1 : Formulaire d'ajout
│       │   ├── ListMateriel.jsx # Menu 2 : Tableau + édition + suppression
│       │   └── Bilan.jsx        # Menu 3 : Statistiques + Graphiques
│       ├── services/
│       │   └── api.js           # Instance Axios + toutes les fonctions API
│       ├── App.js               # Routeur principal + PrivateRoute
│       ├── App.css              # Styles globaux
│       └── index.js             # Point d'entrée React
│
├── .gitignore
└── README.md
```

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **[Node.js](https://nodejs.org)** v18 ou supérieur
- **[npm](https://www.npmjs.com)** v9 ou supérieur
- **[MariaDB](https://mariadb.org)** v10.5 ou supérieur (ou MySQL v8+)
- **[Git](https://git-scm.com)** (optionnel)

---

## 🚀 Installation et démarrage

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/gestion-materiel.git
cd gestion-materiel
```

### 2. Initialiser la base de données

Connectez-vous à MariaDB et exécutez le script d'initialisation :

```bash
mariadb -u root -p < backend/init.sql
```

> Cela crée la base `materiel_db` et les tables `users` et `materiel`.

### 3. Configurer le Backend

```bash
cd backend
cp .env.example .env   # ou éditez directement .env
```

Éditez `.env` avec vos informations de connexion MariaDB :

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=materiel_db
JWT_SECRET=changez_cette_valeur_en_production
```

Installez les dépendances et démarrez :

```bash
npm install
npm run dev        # Mode développement (nodemon)
# ou
npm start          # Mode production
```

> ✅ Serveur disponible sur **http://localhost:5000**

### 4. Démarrer le Frontend

Ouvrez un **nouveau terminal** :

```bash
cd frontend
npm install
npm start
```

> ✅ Application disponible sur **http://localhost:3000**

---

## ⚙️ Configuration

### Variables d'environnement (`backend/.env`)

| Variable | Valeur par défaut | Description |
|---|---|---|
| `PORT` | `5000` | Port du serveur Express |
| `DB_HOST` | `localhost` | Hôte MariaDB |
| `DB_PORT` | `3306` | Port MariaDB |
| `DB_USER` | `root` | Utilisateur MariaDB |
| `DB_PASSWORD` | *(vide)* | Mot de passe MariaDB |
| `DB_NAME` | `materiel_db` | Nom de la base de données |
| `JWT_SECRET` | `gestion_materiel_secret_key_2024` | Clé secrète JWT (**à changer en prod**) |

### Schéma de la base de données

```sql
-- Table des utilisateurs
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,           -- bcrypt hash
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des matériels
CREATE TABLE materiel (
  n_materiel INT AUTO_INCREMENT PRIMARY KEY,
  design     VARCHAR(100) NOT NULL,
  etat       ENUM('Bon', 'Mauvais', 'Abîmé') NOT NULL,
  quantite   INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API REST

> Toutes les routes `/api/materiel` nécessitent le header :
> `Authorization: Bearer <token>`

### Authentification

| Méthode | Route | Description | Body |
|---|---|---|---|
| `POST` | `/api/auth/register` | Créer un compte | `{ username, password }` |
| `POST` | `/api/auth/login` | Se connecter | `{ username, password }` |

### Matériels

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/materiel` | Récupérer tous les matériels |
| `POST` | `/api/materiel` | Ajouter un matériel |
| `PUT` | `/api/materiel/:id` | Modifier un matériel |
| `DELETE` | `/api/materiel/:id` | Supprimer un matériel |
| `GET` | `/api/materiel/bilan` | Obtenir le bilan statistique |

### Exemple de réponses

**POST** `/api/materiel` — Succès :
```json
{ "message": "Insertion réussie" }
```

**PUT** `/api/materiel/1` — Succès :
```json
{ "message": "Modification réussie" }
```

**DELETE** `/api/materiel/1` — Succès :
```json
{ "message": "Suppression réussie" }
```

**GET** `/api/materiel/bilan` :
```json
{
  "total": 150,
  "parEtat": [
    { "etat": "Bon",     "nb_articles": 5, "total_quantite": 80 },
    { "etat": "Mauvais", "nb_articles": 3, "total_quantite": 40 },
    { "etat": "Abîmé",  "nb_articles": 2, "total_quantite": 30 }
  ]
}
```

---

## 🖼️ Captures d'écran

| Page | Description |
|---|---|
| 🔐 **Login** | Page d'authentification avec onglets Connexion / Inscription |
| ➕ **Ajouter** | Formulaire d'ajout avec message de confirmation serveur |
| 📋 **Liste** | Tableau interactif avec recherche, édition inline et suppression |
| 📊 **Bilan** | Cartes statistiques + histogramme + camembert par état |

---

## 🌐 Navigation de l'application

```
/login          → Page d'authentification
/app/ajouter    → Menu 1 : Ajouter un matériel
/app/liste      → Menu 2 : Liste, modifier, supprimer
/app/bilan      → Menu 3 : Bilan statistique et graphes
```

---

## 👤 Auteur

Développé dans le cadre d'un projet web fullstack **Node.js / React / MariaDB**.

---

> 💡 **Note** : Pour la production, pensez à sécuriser le `JWT_SECRET`, activer HTTPS et configurer un reverse proxy (nginx).

---

## 🐳 Déploiement avec Docker

### Prérequis

- [Docker](https://www.docker.com/) installé
- [Docker Compose](https://docs.docker.com/compose/) installé (inclus avec Docker Desktop)

### Lancement rapide avec Docker Compose (recommandé)

1. **Cloner le dépôt**

```bash
cd gestion-materiel
```

2. **Construire et lancer les conteneurs**

```bash
docker-compose up -d --build
```

Cette commande va :
- Construire l'image Docker de l'application (frontend + backend)
- Démarrer un conteneur MariaDB avec la base de données initialisée
- Démarrer l'application sur le port 5000

3. **Accéder à l'application**

Ouvrez votre navigateur et allez sur : **http://localhost:5000**

### Commandes Docker utiles

| Commande | Description |
|---|---|
| `docker-compose up -d --build` | Construire et lancer en arrière-plan |
| `docker-compose up` | Lancer en mode interactif (voir les logs) |
| `docker-compose down` | Arrêter et supprimer les conteneurs |
| `docker-compose down -v` | Arrêter et supprimer les conteneurs + volumes (⚠️ supprime les données) |
| `docker-compose logs -f` | Voir les logs en temps réel |
| `docker-compose ps` | Voir l'état des conteneurs |
| `docker-compose restart app` | Redémarrer uniquement l'application |

### Configuration des variables d'environnement

Vous pouvez modifier les variables dans `docker-compose.yml` ou créer un fichier `.env` à la racine :

```env
# .env
DB_PASSWORD=votre_mot_de_passe_securise
JWT_SECRET=votre_cle_secrete_super_securisee
DB_ROOT_PASSWORD=rootpassword
```

### Structure des services Docker

```
├── app (gestion-materiel-app)
│   ├── Backend Node.js/Express sur port 5000
│   └── Frontend React (servi par le backend)
│
└── db (gestion-materiel-db)
    └── MariaDB 10.5 avec base materiel_db initialisée
```

### Dépannage

**Si l'application ne démarre pas :**

1. Vérifiez que les ports 5000 et 3306 ne sont pas déjà utilisés
2. Consultez les logs : `docker-compose logs -f app`
3. Assurez-vous que MariaDB est prêt : `docker-compose logs db`

**Si la base de données ne s'initialise pas :**

```bash
# Supprimer les volumes et recommencer
docker-compose down -v
docker-compose up -d --build
```

### Build manuel (sans Docker Compose)

```bash
# Construire l'image
docker build -t gestion-materiel .

# Lancer avec une base de données existante
docker run -p 5000:5000 \
  -e DB_HOST=votre_host_db \
  -e DB_PASSWORD=votre_mot_de_passe \
  -e JWT_SECRET=votre_secret \
  gestion-materiel
```

> ⚠️ **Production** : En production, assurez-vous de :
> - Changer le `JWT_SECRET` par une chaîne aléatoire sécurisée
> - Utiliser un mot de passe fort pour MariaDB
> - Configurer un reverse proxy (nginx) avec HTTPS
> - Limiter l'accès au port 3306 (base de données)
