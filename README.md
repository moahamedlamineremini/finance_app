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
  - Statistiques détaillées (revenus totaux, dépenses totales, solde)

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
│   ├── StatsCards.tsx             # Cartes statistiques
│   ├── TransactionForm.tsx        # Formulaire transaction
│   └── TransactionList.tsx        # Liste des transactions
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
5. **Visualiser les statistiques** : Consultez vos revenus, dépenses et solde en temps réel

## 🎨 Personnalisation

### Ajouter des Catégories

Modifiez le fichier [components/TransactionForm.tsx](components/TransactionForm.tsx) :

```typescript
const CATEGORIES = {
  income: ['Salaire', 'Freelance', 'Investissement', 'Autre'],
  expense: ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Autre']
}
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

Cette application est un projet pérsonnel. N'hésitez pas à l'améliorer !

## 📄 Licence

MIT

---

Développé avec ❤️ en utilisant Next.js et TypeScript
