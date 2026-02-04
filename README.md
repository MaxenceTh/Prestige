# 🎬 CinemaTMDB Explorer

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Une plateforme immersive pour explorer l'univers du cinéma en temps réel, utilisant l'API **TMDB**. L'application propose une interface fluide, des performances optimisées et une gestion intelligente des données cinématographiques.

---

## ✨ Fonctionnalités

- **Exploration Multidimensionnelle** : Accès aux films populaires, les mieux notés et les tendances actuelles.
- **Profils de Stars (PersonDrawer)** : Un volet coulissant permettant de découvrir la biographie et la filmographie détaillée d'un acteur ou d'un réalisateur sans quitter la page.
- **Vue Profil Détaillée (`ViewActorProfil`)** : 
  - **Logique Métier** : Distinction automatique entre les carrières de réalisateur et d'acteur.
  - **Algorithme de Tri** : Affichage prioritaire des œuvres majeures basé sur le score de popularité et le nombre de votes.
- **Design Immersif** : Une interface moderne utilisant des effets de flou (backdrop-blur), des thèmes sombres profonds et des composants accessibles via **Shadcn/UI**.
- **Performance & SEO** : Architecture optimisée pour le référencement (Meta balises, Robots.txt) et un score Lighthouse élevé pour garantir une rétention utilisateur maximale.

---

## 🚀 Stack Technique

- **Frontend** : React 18 + Vite
- **Styling** : Tailwind CSS + Lucide React (Icônes)
- **UI Components** : Shadcn/UI (Radix UI)
- **API** : REST API de The Movie Database (TMDB)
- **Déploiement** : Optimisé pour Vercel / Netlify

---

## 🛠️ Installation

1. **Cloner le repository** :
```bash
git clone [https://github.com/votre-utilisateur/votre-repo.git](https://github.com/votre-utilisateur/votre-repo.git)
cd votre-repo
```

2. **Installer les dépendances**:
```bash
npm install
```

3. **Variables d'environnement : Créez un fichier .env à la racine** :
```bash
VITE_TMDB_API_KEY=votre_cle_api_ici
```

4. **Lancer le projet** :
```bash
npm run dev
```
