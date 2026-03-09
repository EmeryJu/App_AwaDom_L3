# AWA DOM - Application de recherche d'aide ménagère

## 📱 Présentation

AWA DOM est une application mobile qui facilite la mise en relation entre particuliers et aides ménagères au Sénégal. Elle permet de rechercher, filtrer et réserver des services d'aide ménagère en quelques clics.

## ✨ Fonctionnalités principales

### Pour les clients
- 🔍 Recherche d'aides ménagères par compétences
- 🗺️ Filtrage par localisation et tarif
- 📅 Réservation avec sélection de date et créneau
- 📋 Historique des réservations
- 👤 Gestion du profil

### Pour les aides ménagères
- 📝 Création de profil professionnel
- 📸 Ajout de photo et compétences
- 📬 Réception et gestion des demandes
- ✅ Acceptation/Refus des réservations
- ⏰ Gestion de la disponibilité

## 🛠️ Technologies

- **React Native** avec Expo
- **TypeScript**
- **Firebase** (Auth, Firestore, Cloud Messaging)
- **React Navigation**

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn
- Expo CLI

### Étapes

1. Cloner le projet
```bash
cd AwaDom
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer Firebase
Créer un fichier `.env` à la racine avec vos clés Firebase:
```
EXPO_PUBLIC_FIREBASE_API_KEY=votre_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

4. Lancer l'application
```bash
npm start
```

## 📱 Utilisation

### Inscription
1. Ouvrir l'application
2. Cliquer sur "Créer un compte"
3. Choisir le type de compte (Client ou Aide ménagère)
4. Remplir les informations requises

### Recherche (Client)
1. Se connecter en tant que client
2. Utiliser la barre de recherche pour trouver des compétences
3. Appliquer des filtres (ville, prix)
4. Consulter les profils et réserver

### Gestion des demandes (Aide)
1. Se connecter en tant qu'aide ménagère
2. Consulter les demandes reçues
3. Accepter ou refuser les réservations
4. Gérer son profil professionnel

## 📂 Structure du projet

```
AwaDom/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── PasswordResetScreen.tsx
│   │   ├── HomeClientScreen.tsx
│   │   ├── HelperDetailsScreen.tsx
│   │   ├── BookingConfirmationScreen.tsx
│   │   ├── ClientBookingsScreen.tsx
│   │   ├── ClientProfileScreen.tsx
│   │   ├── AideDashboardScreen.tsx
│   │   └── HelperProfileScreen.tsx
│   └── services/
│       ├── firebase.ts
│       └── notifications.ts
├── assets/
├── firebaseConfig.ts
├── App.tsx
└── package.json
```

## 🔐 Sécurité

- Authentification sécurisée via Firebase Auth
- Données stockées dans Firestore avec règles de sécurité
- Variables d'environnement pour les clés sensibles

## 📄 Documentation

Consultez [DOCUMENTATION.md](./DOCUMENTATION.md) pour plus de détails techniques.

## 🚀 Déploiement

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## 👥 Équipe

Projet de soutenance L3 - AWA DOM

## 📝 Licence

Ce projet est développé dans le cadre d'un projet académique.
