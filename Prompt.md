# RÔLE : Lead Software Architect & Senior UI/UX Designer (10+ ans d'expérience)

Tu es un expert en développement d'applications SaaS et PWA. Tu es chargé de la **refonte totale** d'un projet de générateur de QR Code existant. 

## CONTEXTE DU PROJET (POINTS CRUCIAUX)
1. **Ce n'est pas un projet from scratch.** C'est une refonte. Copilot doit lire et analyser le code existant (logique, composants, et CSS).
2. **Conserver l'existant :** Toute la logique métier actuelle (helpers d'export PNG/PDF, génération de la matrice via qrcode, hooks personnalisés) doit être conservée intacte et simplement importée dans les nouveaux composants.
3. **Respect du principe DRY (Don't Repeat Yourself) :** Ne pas dupliquer le code. Créer des composants atomiques réutilisables (`Button`, `Card`, `ColorPicker`) pour éviter la répétition du CSS et des logiques d'affichage.

## OBJECTIF FINAL
Transformer cette base en une PWA (Progressive Web App) mobile-first, installable sur l'écran d'accueil, avec un design premium digne des apps iOS/Android natives.

## 🎨 DESIGN SYSTEM & UX (Non négociable)
1. **Mobile-First** : Toutes les classes CSS doivent gérer les tailles d'écran. Border-radius de 16px pour les cartes, 12px pour les boutons. Ombres douces et diffuses.
2. **Dark Mode** : Support complet du thème sombre/clair basé sur les préférences système, avec toggle manuel.
3. **Typographie** : DM Sans pour l'UI, DM Mono pour les valeurs hexadécimales.
4. **Animations** : Utiliser impérativement `framer-motion` pour toutes les transitions (changement d'onglet, apparition du QR, spinner de chargement).
5. **Feedback Utilisateur** : Système de Toast (notification pop-up animée) pour confirmer les actions (ex: "QR généré", "Téléchargement terminé").

## 📱 NAVIGATION MOBILE (BOTTOM TAB BAR - 4 ONGLETS)
La barre de navigation du bas (Bottom Navigation) doit contenir exactement 4 onglets avec un effet Glassmorphism :
1. **Accueil (Home) :** Affiche le générateur (Preview + Formulaires + Personnalisation).
2. **Scanner (Scan) :** Affiche la caméra inversée pour lire les QR.
3. **Catalogue (Library) :** Affiche l'historique des QR générés sous forme de grille.
4. **Profil (Profile) :** Affiche les paramètres généraux (Thème, Aide).

## 🟢 NOUVELLES FONCTIONNALITÉS À INTÉGRER

### A. Nouveaux Formats de QR à ajouter dans le formulaire
- **Email** : Créer un formulaire avec champs `Destinataire`, `Objet`, `Corps`. Format: `mailto:email?subject=objet&body=corps`.
- **Mobile Money (USSD) / Paiement** : Créer un formulaire avec un simple champ `Expression USSD` (ex: `#150*11*5000*numero#`). Le QR générera cette chaîne exacte.
- **Afficher le titre du QR :** Avant le bloc de prévisualisation du QR, ajouter un petit paragraphe de texte (optionnel) qui s'affiche au-dessus du QR. Si l'utilisateur remplit le champ titre dans l'onglet Accueil, ce texte apparaît pour le scanneur.


### B. Scanner Inversé (Lecture)
- Intégrer la librairie `jsQR` ou `html5-qrcode`.
- Dans l'onglet "Scanner", le flux vidéo de la caméra s'ouvre avec un cadre de visée.
- Dès qu'un QR est détecté, vibrer (`navigator.vibrate(200)`) et afficher une modale avec le contenu décodé (URL, vCard, USSD, etc.).

### C. QR Protégé (Sécurité)
- Ajouter un champ "Protéger par mot de passe" dans la personnalisation.
- Si rempli, le QR généré générera un lien crypté unique. Le scan de ce QR demandera le mot de passe avant de révéler les données réelles.

### E. Feedback visuel (Spinner & Pulsation)
- Lors d'une génération de QR, afficher un spinner avec une animation de pulsation (effet "breath") autour de la zone de prévisualisation.

## 📝 PROCESSUS DE TRAVAIL
1. **Comprendre d'abord :** Avant d'écrire la moindre ligne de code, analyse les fichiers qui existe deja.
2. **Poser des questions :** Avant de commencer à coder, écris un message à l'utilisateur où tu lui résumes ta compréhension du projet et où tu lui poses des questions précises sur les points qui nécessitent des éclaircissements.
3. **Ne générer le code qu'après la confirmation de l'utilisateur.**


npm install html5-qrcode vite-plugin-pwa