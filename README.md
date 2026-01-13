# Application de Gestion de Finances Personnelles

Application web moderne de gestion de finances personnelles construite avec Next.js 14, TypeScript, Prisma, PostgreSQL et NextAuth.js.

## 🚀 Fonctionnalités

- ✅ **Authentification sécurisée**
  - Création de compte avec email et mot de passe
  - Connexion/Déconnexion
  - Mots de passe hashés avec bcrypt
  - Sessions JWT sécurisées avec NextAuth.js

- 💰 **Gestion des finances**
  - Ajout de revenus et dépenses
  - Catégorisation des transactions
  - Visualisation du solde en temps réel
  - Statistiques détaillées (revenus totaux, dépenses totales, solde, épargne)
  - **Filtrage par mois** : Visualisez vos finances mois par mois
  - **Filtrage par catégorie** : Analysez vos dépenses par catégorie
  - **Navigation temporelle** : Parcourez facilement vos mois avec les flèches ◀ ▶

- 📊 **Dashboard Intelligent**
  - 4 cartes statistiques : Revenus, Dépenses, Solde, Livret A
  - Carte Livret A avec bordure colorée selon votre performance d'épargne
  - Widget d'épargne permanent affichant :
    - Montant disponible ce mois
    - Recommandation d'épargne intelligente
    - Taux d'épargne actuel avec barre de progression
    - Messages motivants personnalisés

- 🤖 **Système de Recommandation d'Épargne IA**
  - **Détection automatique** : Se déclenche après l'ajout d'un salaire
  - **4 stratégies proposées** :
    - Conservateur (10%) - Épargne de sécurité
    - Modéré (20%) - Épargne régulière
    - Ambitieux (30%) - Épargne maximale
    - Intelligent (recommandé) - Basé sur vos dépenses réelles
  - **Algorithme adaptatif** : Analyse vos 3 derniers mois de dépenses
  - **Création automatique** : Génère une transaction "Épargne Livret A" en un clic
  - **Persistance** : Mémorise votre dernier salaire même après fermeture du navigateur

- 🎨 **Interface utilisateur moderne**
  - Design responsive (mobile, tablette, desktop)
  - Code couleur intuitif : vert (revenus), rouge (dépenses), bleu/violet (épargne)
  - Feedback visuel intelligent selon vos objectifs d'épargne
  - Messages encouragants basés sur vos performances

- 🔒 **Sécurité**
  - Protection des routes avec middleware Next.js
  - Isolation des données utilisateur
  - Validation des données avec Zod
  - Sessions sécurisées

## 📦 Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Base de données**: PostgreSQL (Neon recommandé)
- **ORM**: Prisma
- **Authentification**: NextAuth.js v4
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Hashage**: bcrypt

## 🛠️ Installation

### Prérequis

- Node.js 18+ 
- PostgreSQL (ou compte Neon.tech gratuit)
- npm ou yarn

### Étapes d'installation

1. **Installer les dépendances**

```bash
npm install
```

2. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Puis modifiez `.env` avec vos valeurs :

```env
# Base de données PostgreSQL
# Pour Neon: postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-genere"
```

**Générer un secret pour NextAuth** :

```bash
openssl rand -base64 32
```

3. **Configurer la base de données**

```bash
# Créer les tables dans la base de données
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate
```

4. **Lancer le serveur de développement**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
projet-app-finance/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Configuration NextAuth
│   │   ├── register/              # API inscription
│   │   └── transactions/          # API transactions
│   ├── dashboard/                 # Page dashboard protégée
│   ├── login/                     # Page connexion
│   ├── register/                  # Page inscription
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Page d'accueil (redirection)
│   ├── providers.tsx              # Providers React
│   └── globals.css                # Styles globaux
├── components/
│   ├── StatsCards.tsx             # Cartes statistiques (4 cartes)
│   ├── TransactionForm.tsx        # Formulaire transaction
│   ├── TransactionList.tsx        # Liste des transactions
│   ├── MonthSelector.tsx          # Sélecteur de mois/année
│   ├── CategoryFilter.tsx         # Filtre par catégorie
│   ├── SavingsRecommendation.tsx  # Popup recommandation épargne
│   └── SavingsWidget.tsx          # Widget épargne permanent
├── lib/
│   └── prisma.ts                  # Client Prisma
├── prisma/
│   └── schema.prisma              # Schéma de base de données
├── types/
│   └── next-auth.d.ts             # Types TypeScript NextAuth
├── middleware.ts                  # Middleware de protection
├── .env.example                   # Exemple de variables d'env
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🗄️ Schéma de Base de Données

### User (Utilisateur)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashé avec bcrypt
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  transactions Transaction[]
}
```

### Transaction

```prisma
model Transaction {
  id          String   @id @default(cuid())
  type        TransactionType // "income" ou "expense"
  title       String
  amount      Float
  category    String
  date        DateTime @default(now())
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User @relation(fields: [userId], references: [id])
}
```

## 🔐 Sécurité et Bonnes Pratiques

### Authentification

- **Mots de passe hashés** : Utilisation de bcrypt avec un salt de 12 rounds
- **Sessions JWT** : Tokens signés avec un secret fort
- **Validation** : Schémas Zod pour valider toutes les entrées utilisateur

### Protection des Routes

Le middleware protège automatiquement :
- `/dashboard/*` - Dashboard et pages associées
- `/api/transactions/*` - API de gestion des transactions

### Isolation des Données

Chaque utilisateur ne peut :
- Voir que ses propres transactions
- Modifier/supprimer uniquement ses données
- Les requêtes API vérifient toujours l'ID utilisateur de la session

### Validation des Données

```typescript
// Exemple de validation Zod
const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Min 6 caractères'),
  name: z.string().optional(),
})
```

## 🚦 Routes API

### POST `/api/register`

Créer un nouveau compte utilisateur

```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "name": "John Doe"
}
```

### POST `/api/auth/signin`

Connexion (géré par NextAuth)

### GET `/api/transactions`

Récupérer toutes les transactions de l'utilisateur connecté

### POST `/api/transactions`

Créer une nouvelle transaction

```json
{
  "type": "expense",
  "title": "Courses",
  "amount": 45.50,
  "category": "Alimentation",
  "date": "2026-01-13",
  "description": "Courses du weekend"
}
```

### DELETE `/api/transactions?id={transactionId}`

Supprimer une transaction

## 📱 Utilisation

1. **Créer un compte** : Accédez à `/register` et créez votre compte
2. **Se connecter** : Utilisez vos identifiants sur `/login`
3. **Dashboard** : Vous serez redirigé vers le dashboard
4. **Ajouter des transactions** : Cliquez sur "Nouvelle transaction"
5. **Visualiser les statistiques** : Consultez vos revenus, dépenses, solde et épargne en temps réel
6. **Filtrer par mois** : Utilisez le sélecteur de mois pour naviguer dans vos finances
7. **Filtrer par catégorie** : Cliquez sur une catégorie pour affiner votre analyse
8. **Épargner intelligemment** : Ajoutez votre salaire et suivez les recommandations d'épargne

### 💡 Fonctionnement de l'Épargne Intelligente

1. **Ajoutez votre salaire** en tant que revenu avec la catégorie "Salaire"
2. **Une popup apparaît** automatiquement avec 4 recommandations d'épargne
3. **Choisissez une stratégie** ou définissez un montant personnalisé
4. **Votre épargne est créée** automatiquement dans la catégorie "Épargne"
5. **Le widget permanent** vous montre en continu :
   - Combien vous pouvez encore épargner ce mois
   - Votre taux d'épargne actuel
   - Des conseils personnalisés selon vos performances

### 🎯 Objectif d'Épargne

L'application recommande d'épargner **20% de vos revenus**. Le système vous guide avec :
- 🟢 **Bordure verte** sur la carte Livret A si vous atteignez 20%+
- 🔵 **Bordure bleue** si vous êtes entre 10-20%
- 🟠 **Bordure orange** si vous êtes entre 0-10%
- Messages motivants adaptés à votre progression

## 🎨 Personnalisation

### Ajouter des Catégories

Modifiez le fichier [components/TransactionForm.tsx](components/TransactionForm.tsx) :

```typescript
const CATEGORIES = {
  income: ['Salaire', 'Freelance', 'Investissement', 'Autre'],
  expense: ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Épargne', 'Autre']
}
```

### Personnaliser l'Algorithme d'Épargne

Modifiez [components/SavingsRecommendation.tsx](components/SavingsRecommendation.tsx) :

```typescript
// Ajustez les taux de recommandation
const conservativeRate = 0.10 // 10%
const moderateRate = 0.20 // 20%
const aggressiveRate = 0.30 // 30%

// Personnalisez la recommandation intelligente
const intelligentSuggestion = Math.max(
  salary - averageExpenses - (averageExpenses * 0.2), // 20% de marge
  salary * 0.10 // Minimum 10%
)
```

### Modifier les Couleurs

Éditez [tailwind.config.ts](tailwind.config.ts) pour personnaliser le thème

## 🧪 Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linting
npm run lint

# Prisma Studio (interface graphique BDD)
npx prisma studio

# Créer une migration
npx prisma migrate dev --name nom_migration

# Réinitialiser la BDD
npx prisma migrate reset
```

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation NextAuth.js](https://next-auth.js.org/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Neon PostgreSQL](https://neon.tech/)

## 🤝 Contribution

Cette application est un projet pérsonnel. N'hésitez pas à l'améliorer et à proposer vos idées !

### Fonctionnalités Futures Possibles

- 📈 Graphiques et visualisations avancées
- 📧 Notifications par email pour les objectifs d'épargne
- 🎯 Objectifs d'épargne personnalisés
- 📊 Export des données en CSV/PDF
- 🌍 Multi-devises
- 🔔 Rappels automatiques pour les dépenses récurrentes
- 🤝 Partage de budgets familiaux

## 📄 Licence

MIT

---

Développé avec ❤️ en utilisant Next.js et TypeScript
