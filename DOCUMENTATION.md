# Documentation Technique - AWA DOM

## Architecture de l'application

### Technologies utilisées
- **Framework**: React Native avec Expo
- **Langage**: TypeScript
- **Base de données**: Firebase Firestore
- **Authentification**: Firebase Auth
- **Notifications**: Firebase Cloud Messaging (FCM)

## Modèles de données

### Collection: users

```typescript
{
  id: string; // UID Firebase
  name: string;
  email: string;
  phone: string;
  type: "client" | "aide";
  createdAt: Date;
  
  // Champs spécifiques aux aides ménagères
  city?: string;
  skills?: string;
  price?: string;
  photoUrl?: string;
  availability?: string;
}
```

### Collection: bookings

```typescript
{
  id: string;
  helperId: string;
  helperName: string;
  helperPhoto: string;
  clientId: string;
  clientName: string;
  date: string;
  time?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}
```

## Structure des écrans

### Écrans d'authentification
1. **LoginScreen** - Connexion utilisateur
2. **RegisterScreen** - Inscription (client ou aide)
3. **PasswordResetScreen** - Récupération de mot de passe

### Écrans Client
1. **HomeClientScreen** - Recherche et filtres
2. **HelperDetailsScreen** - Détails d'une aide ménagère
3. **BookingConfirmationScreen** - Sélection date/heure
4. **ClientBookingsScreen** - Historique des réservations
5. **ClientProfileScreen** - Profil du client

### Écrans Aide Ménagère
1. **AideDashboardScreen** - Gestion des demandes
2. **HelperProfileScreen** - Gestion du profil professionnel

## Fonctionnalités implémentées

### Authentification
- ✅ Inscription avec email/mot de passe
- ✅ Connexion
- ✅ Récupération de mot de passe
- ✅ Distinction client/aide ménagère

### Recherche et filtrage
- ✅ Recherche par compétences
- ✅ Filtre par ville
- ✅ Filtre par prix maximum
- ✅ Affichage de la liste des aides

### Réservation
- ✅ Consultation du profil complet
- ✅ Sélection de date
- ✅ Sélection de créneau horaire
- ✅ Confirmation de réservation
- ✅ Historique des réservations

### Gestion des demandes (Aide)
- ✅ Réception des demandes
- ✅ Acceptation/Refus
- ✅ Statut en temps réel
- ✅ Gestion du profil professionnel

## Services Firebase

### firebase.ts
Configuration de base Firebase (Auth + Firestore)

### notifications.ts
Service de notifications push (FCM)

## Installation et déploiement

### Prérequis
```bash
Node.js >= 18
npm ou yarn
Expo CLI
```

### Installation
```bash
npm install
```

### Configuration
Créer un fichier `.env` avec:
```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_VAPID_KEY=
```

### Lancement
```bash
npm start
```

### Build
```bash
# Android
expo build:android

# iOS
expo build:ios
```

## Améliorations futures

### Priorité haute
- [ ] Système de notation et avis
- [ ] Chat en temps réel
- [ ] Paiement intégré (Wave, Orange Money)
- [ ] Géolocalisation avec carte

### Priorité moyenne
- [ ] Historique détaillé avec statistiques
- [ ] Notifications push complètes
- [ ] Mode hors ligne
- [ ] Photos multiples pour les profils

### Priorité basse
- [ ] Partage de profil
- [ ] Programme de fidélité
- [ ] Support multilingue (Wolof, Français)
