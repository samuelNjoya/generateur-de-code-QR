# QR Pro — Générateur de QR Codes Professionnel

Une PWA ultra-fluide pour la génération de QR Codes haute définition.

## 🚀 Installation & Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Build production
npm run build
```

## ✨ Fonctionnalités

### Types de QR Codes
- 🔗 **Web Link** — URL avec validation en temps réel
- 👤 **vCard Contact** — Standard vCard 3.0 complet
- 💬 **WhatsApp Direct** — Message pré-rempli + indicatif pays
- 📶 **WiFi** — Connexion automatique au réseau
- 📍 **GPS / Maps** — Localisation avec géolocalisation auto
- 📅 **Événement** — Format iCal/vEvent

### Design & UX
- 🌙 **Dark Mode** automatique + toggle manuel
- 📱 **PWA** installable sur mobile
- ⚡ **Mise à jour instantanée** du QR code
- 🎞️ **Animations Framer Motion** fluides
- 📐 **Layout adaptatif** Desktop (sidebar) / Mobile (tab bar)

### Personnalisation (optionnelle)
- 🎨 Couleurs QR + fond avec vérification contraste
- ⬜ Forme des modules : Carré / Arrondi / Ronds
- 👁️ Style des yeux (coins) : Carré / Arrondi / Cercle
- 🖼️ Logo central avec ECL "H" automatique
- 📏 Marge silencieuse ajustable

### Export
- 📸 **PNG 2000×2000px** (qualité imprimerie)
- 📄 **PDF vectoriel** avec titre
- 📤 **Web Share API** (partage natif mobile)

### Outils avancés
- 🕐 **Historique** 10 derniers QR avec miniatures
- 📦 **Batch** — Générer un ZIP de plusieurs QR codes
- 🔒 **ECL adaptatif** — H si logo ou >150 caractères

## 🏗️ Architecture

```
src/
├── App.jsx                    # App principale + layout
├── index.css                  # Design system complet
├── main.jsx
├── components/
│   ├── QRPreview.jsx          # Affichage + export
│   ├── Forms.jsx              # 6 formulaires métier
│   ├── CustomizationPanel.jsx # Panneau avancé (collapsible)
│   ├── HistoryPanel.jsx       # Historique localStorage
│   └── BatchPanel.jsx         # Génération multi-QR
├── hooks/
│   └── useQRGenerator.js      # Hook SVG custom
└── utils/
    └── helpers.js             # Utilitaires + encodeurs
```

## 📦 Stack Technique

| Package | Usage |
|---|---|
| React 18 | UI |
| Vite 5 | Build |
| qrcode | Génération matrice QR |
| framer-motion | Animations |
| lucide-react | Icônes |
| jsPDF | Export PDF |

## 💡 Commandes utiles

```bash
npm run dev      # Dev server sur localhost:5173
npm run build    # Build production dans /dist
npm run preview  # Prévisualiser le build
```
