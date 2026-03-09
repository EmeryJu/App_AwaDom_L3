# Guide de Test - AWA DOM

## Scénarios de test

### 1. Test d'inscription

#### Client
1. Ouvrir l'application
2. Cliquer sur "Créer un compte"
3. Remplir les champs:
   - Nom: Test Client
   - Email: client@test.com
   - Téléphone: 771234567
   - Mot de passe: test123
   - Type: Client
4. Cliquer sur "Créer le compte"
5. ✅ Vérifier la redirection vers HomeClient

#### Aide ménagère
1. Ouvrir l'application
2. Cliquer sur "Créer un compte"
3. Remplir les champs:
   - Nom: Fatou Diop
   - Email: aide@test.com
   - Téléphone: 771234568
   - Mot de passe: test123
   - Ville: Dakar
   - Compétences: Ménage, Cuisine, Repassage
   - Tarif: 2000
   - Type: Aide ménagère
4. Cliquer sur "Créer le compte"
5. ✅ Vérifier la redirection vers AideDashboard

### 2. Test de connexion

1. Entrer email et mot de passe
2. Cliquer sur "Se connecter"
3. ✅ Vérifier la redirection selon le type d'utilisateur

### 3. Test de récupération de mot de passe

1. Sur l'écran de connexion, cliquer sur "Mot de passe oublié ?"
2. Entrer l'email
3. Cliquer sur "Envoyer"
4. ✅ Vérifier la réception de l'email Firebase

### 4. Test de recherche (Client)

1. Se connecter en tant que client
2. Dans la barre de recherche, taper "Cuisine"
3. ✅ Vérifier que seules les aides avec "Cuisine" apparaissent

### 5. Test des filtres (Client)

1. Cliquer sur "Afficher les filtres"
2. Entrer:
   - Ville: Dakar
   - Prix max: 3000
3. ✅ Vérifier que les résultats sont filtrés correctement

### 6. Test de réservation

1. Cliquer sur une aide ménagère
2. Consulter le profil
3. Cliquer sur "Réserver"
4. Sélectionner une date
5. Sélectionner un créneau horaire
6. Cliquer sur "Confirmer"
7. ✅ Vérifier l'alerte de succès
8. ✅ Vérifier dans "Mes réservations"

### 7. Test de gestion des demandes (Aide)

1. Se connecter en tant qu'aide ménagère
2. Consulter les demandes reçues
3. Cliquer sur "Accepter" pour une demande
4. ✅ Vérifier que le statut passe à "Acceptée"
5. Cliquer sur "Refuser" pour une autre demande
6. ✅ Vérifier que le statut passe à "Refusée"

### 8. Test de gestion du profil (Aide)

1. Se connecter en tant qu'aide
2. Cliquer sur "Mon Profil"
3. Modifier les informations:
   - Compétences
   - Tarif
   - Disponibilité
4. Cliquer sur "Mettre à jour"
5. ✅ Vérifier l'alerte de succès
6. Se déconnecter et reconnecter
7. ✅ Vérifier que les modifications sont sauvegardées

### 9. Test de gestion du profil (Client)

1. Se connecter en tant que client
2. Cliquer sur "Mon Profil"
3. Modifier les informations
4. Cliquer sur "Mettre à jour"
5. ✅ Vérifier l'alerte de succès

### 10. Test de l'historique des réservations

1. Se connecter en tant que client
2. Cliquer sur "Mes réservations"
3. ✅ Vérifier que toutes les réservations apparaissent
4. ✅ Vérifier les statuts (En attente, Acceptée, Refusée)

## Tests de sécurité

### 1. Authentification requise
- Tenter d'accéder aux écrans sans être connecté
- ✅ Vérifier la redirection vers Login

### 2. Règles Firestore
- Tenter de modifier le profil d'un autre utilisateur
- ✅ Vérifier le refus d'accès

### 3. Validation des données
- Tenter de créer un compte sans remplir tous les champs
- ✅ Vérifier les messages d'erreur

## Tests de performance

### 1. Chargement des données
- Ouvrir HomeClient avec 50+ aides ménagères
- ✅ Vérifier que le chargement est fluide

### 2. Filtrage en temps réel
- Taper dans la barre de recherche
- ✅ Vérifier que les résultats se mettent à jour instantanément

### 3. Synchronisation temps réel
- Créer une réservation sur un appareil
- ✅ Vérifier qu'elle apparaît immédiatement sur l'autre appareil

## Bugs connus et limitations

1. Les notifications push nécessitent une configuration backend supplémentaire
2. La géolocalisation n'est pas encore implémentée
3. Le système de notation n'est pas encore disponible
4. Le chat en temps réel n'est pas implémenté

## Checklist de validation finale

- [ ] Inscription client fonctionne
- [ ] Inscription aide fonctionne
- [ ] Connexion fonctionne
- [ ] Récupération de mot de passe fonctionne
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent
- [ ] Réservation avec date/heure fonctionne
- [ ] Acceptation/Refus de demandes fonctionne
- [ ] Gestion du profil aide fonctionne
- [ ] Gestion du profil client fonctionne
- [ ] Historique des réservations fonctionne
- [ ] Déconnexion fonctionne
