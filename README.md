# AI Book Explorer

> 📚 Une application web moderne pour explorer et visualiser les livres via l'API Google Books

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

---

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Utilisation](#utilisation)
- [Filtres disponibles](#filtres-disponibles)
- [API et visualisations](#api-et-visualisations)
- [Déploiement](#déploiement)
- [Contribution](#contribution)

---

## 🎯 À propos

**AI Book Explorer** est une application web interactive qui permet de :
- 🔍 Rechercher des livres en temps réel via l'API Google Books
- 📊 Visualiser les données avec des graphiques dynamiques (Timeline, Top Auteurs)
- 🎨 Profiter d'une interface moderne et responsive
- ⚡ Filtrer les résultats par auteur, catégorie, année de publication, etc.

L'application est déployée sur **Netlify** et offre une expérience utilisateur fluide et intuitive.

---

## ✨ Fonctionnalités

### 🔍 Recherche avancée
- **Barre de recherche intelligente** : Cherchez des livres en tapant des mots-clés
- **Pagination** : Naviguez facilement dans les résultats (12 livres par page)
- **Status en temps réel** : Suivez l'état de votre recherche avec des messages informatifs
- **Gestion des erreurs** : Messages clairs en cas d'erreur ou pas de résultats

### 🎛️ Système de filtres avancé
- 👤 **Filtrer par auteur** : Trouvez tous les livres d'un auteur spécifique
- 📂 **Filtrer par catégorie** : Fiction, Science-fiction, Romance, Histoire, et plus
- 📅 **Filtrer par année** : Définissez une année minimum de publication
- 📕 **Filtrer par type** : Livres ou Magazines
- ⭐ **Filtrer par note** : 3+ ou 4+ étoiles minimales

### 📊 Visualisations et graphiques
- **Timeline des publications** : Visualisez le nombre de livres publiés par année
- **Top Auteurs** : Découvrez les auteurs les plus prolixes
- **Graphiques interactifs** : Rendus avec Chart.js, responsifs et dynamiques
- **Page dédiée** : `visualizations.html` pour des graphiques détaillés

### 🎨 Design moderne et fluide
- **Background animé** : Particules animées et calques en arrière-plan
- 📱 **Responsive design** : Fonctionne sur mobile, tablette et desktop
- ✨ **Animations fluides** : Transitions CSS optimisées et lisses
- ♿ **Accessibilité** : Support complet ARIA labels et navigation au clavier
- 🌈 **Interface intuitive** : Toggle mobile pour les filtres, mise en page adaptative

### 📄 Pages bonus
- 📊 **visualizations.html** : Page dédiée aux graphiques détaillés

---

## 🛠️ Technologies

| Technologie | Usage |
|-------------|-------|
| **HTML5** | Structure sémantique et accessible |
| **CSS3** | Styling moderne (Flexbox, Grid, Animations) |
| **JavaScript (ES6+)** | Logique applicative et manipulation du DOM |
| **Google Books API** | Source de données des livres |
| **Chart.js v3** | Visualisations de données interactives |
| **Netlify** | Déploiement et hosting statique |

---

## 📥 Installation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- VS Code (optionnel, pour développer)
- Extension Live Server pour VS Code (optionnel)

### Étapes d'installation

#### Option 1 : Avec Live Server (Recommandé)
1. **Cloner le repository**
   ```bash
   git clone https://github.com/YasminaEL20/ai-book-explorer2.git
   cd ai-book-explorer2
   ```

2. **Ouvrir dans VS Code**
   ```bash
   code .
   ```

3. **Lancer Live Server**
   - Clic-droit sur `index.html`
   - Sélectionnez **"Open with Live Server"**
   - L'application s'ouvrira à `http://127.0.0.1:5500`

#### Option 2 : Ouverture directe
1. Cloner ou télécharger le projet
2. Double-cliquer sur `index.html`
3. Ou glisser-déposer `index.html` dans le navigateur

#### Option 3 : Via serveur local Python
```bash
# Python 3
python -m http.server 8000

# Puis ouvrir http://localhost:8000 dans le navigateur
```

---

## 📂 Structure du projet

```
AI-Book-Explorer_v1/
├── index.html                 # Page principale
├── visualizations.html        # Page des graphiques détaillés
├── README.md                  # Ce fichier
├── netlify.toml              # Configuration Netlify
│
├── assets/
│   ├── CSS/
│   │   ├── style.css         # Styles globaux et responsive
│   │   └── filters.css       # Styles des filtres
│   │
│   ├── img/
│   │   └── icone.png         # Logo de l'application
│   │
│   └── js/
│       ├── app.js            # Logique principale (recherche, pagination)
│       ├── api.js            # Fonctions API (utilité)
│       ├── charts.js         # Gestion des graphiques Chart.js
│       ├── filters-ui.js     # Gestion de l'interface des filtres
│       ├── search-filters.js # Logique de filtrage avancée
│       ├── ui.js             # Fonctions utilitaires UI
│       ├── anim.js           # Animations et effets visuels
│       ├── bg.js             # Gestion du background animé
│       └── readingAnim.js    # Animations de lecture
```

---

## 🚀 Utilisation

### Rechercher des livres

1. **Saisir un terme de recherche**
   - Entrez un mot-clé dans la barre de recherche (ex: "Robots", "Intelligence Artificielle", "Love")
   - Appuyez sur **Entrée** ou cliquez sur l'icône 🔎

2. **Naviguer dans les résultats**
   - Les résultats s'affichent par page (12 livres maximum)
   - Utilisez les boutons **Précédent** et **Suivant** pour naviguer
   - L'indicateur de page vous montre votre position

3. **Voir les détails d'un livre**
   - Cliquez sur une carte de livre pour voir plus de détails
   - Une modal s'ouvrira avec : titre, auteur, description, note, lien

### Utiliser les filtres

1. **Ouvrir le panneau de filtres**
   - Sur mobile : Cliquez sur le bouton **Filtres**
   - Sur desktop : Le panneau est toujours visible à gauche

2. **Appliquer des filtres**
   - **Auteur** : Tapez le nom de l'auteur
   - **Catégorie** : Sélectionnez parmi les catégories proposées
   - **Année minimum** : Entrez une année (ex: 2000)
   - **Type** : Choisissez Livres ou Magazines
   - **Note minimale** : Filtrez par 3+ ou 4+ étoiles

3. **Combinaison de filtres**
   - Tous les filtres peuvent être utilisés ensemble
   - Les résultats s'actualisent automatiquement

### Consulter les visualisations

1. **Page visualisations**
   - Rendez-vous sur `visualizations.html`
   - Voyez les graphiques de timeline et top auteurs
   - Les données se mettent à jour selon vos recherches

---

## 📊 Filtres disponibles

### Catégories disponibles
- Fiction
- Science-fiction
- Romance
- Histoire
- Et bien d'autres via l'API Google Books

### Critères de filtrage
| Critère | Type | Exemple |
|---------|------|---------|
| Auteur | Texte libre | "Isaac Asimov" |
| Catégorie | Sélection | "Science-fiction" |
| Année min. | Nombre | "2000" |
| Type | Sélection | "Livres" ou "Magazines" |
| Note min. | Sélection | "4 étoiles" |

---

## 🔌 API et visualisations

### Google Books API
- **Endpoint** : `https://www.googleapis.com/books/v1/volumes`
- **Requête** : Basée sur des mots-clés avec paramètres optionnels
- **Réponse** : JSON contenant titre, auteur, description, image, note, etc.

### Chart.js
- **Timeline** : Graphique en ligne/barre montrant les livres par année
- **Top Auteurs** : Graphique montrant les auteurs les plus représentés
- **Mise à jour dynamique** : Les graphiques se mettent à jour après chaque recherche

### Structure des données de livre
```javascript
{
  volumeInfo: {
    title: "Livre title",
    authors: ["Auteur 1", "Auteur 2"],
    publishedDate: "2020-01-01",
    description: "Description du livre",
    categories: ["Fiction"],
    imageLinks: { thumbnail: "url" },
    averageRating: 4.5,
    ratingsCount: 100,
    previewLink: "url"
  }
}
```

---

## 🌐 Déploiement

### Netlify (Configuration actuelle)

L'application est configurée pour Netlify via `netlify.toml` :

```toml
[build]
  publish = "/"        # Racine du site
  command = ""         # Pas de build pour site statique

[context.production.environment]
  NODE_VERSION = "18"
```

### Déployer sur Netlify

1. **Push votre code sur GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connectez votre repo Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Cliquez sur "New site from Git"
   - Sélectionnez votre repo GitHub
   - Les paramètres par défaut conviennent

3. **Déployer**
   - Netlify déploiera automatiquement à chaque push sur `main`
   - Votre site sera accessible via l'URL fournie

### Déployer ailleurs
- **Vercel** : Drag & drop du dossier
- **GitHub Pages** : Activez dans les paramètres du repo
- **Tout serveur web** : Copyez les fichiers sur le serveur

---

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. **Fork le projet**
   ```bash
   git clone https://github.com/YasminaEL20/ai-book-explorer2.git
   ```

2. **Créez une branche pour votre feature**
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

3. **Commitez vos changements**
   ```bash
   git commit -m "Ajouter ma fonctionnalité"
   ```

4. **Poussez vers votre fork**
   ```bash
   git push origin feature/ma-fonctionnalite
   ```

5. **Ouvrez une Pull Request**
   - Décrivez vos changements
   - Expliquez pourquoi c'est une amélioration

### Idées d'amélioration
- 🌙 Mode sombre
- 🌍 Support multilingue
- 💾 Sauvegarde des favoris (localStorage)
- 📥 Export des résultats (CSV, PDF)
- 🔖 Système de favoris et collections
- 🎯 Recommandations personnalisées
- 🧠 IA pour des suggestions intelligentes

---

## 📞 Support et Contact

- **Issues GitHub** : [Ouvrir une issue](https://github.com/YasminaEL20/ai-book-explorer2/issues)
- **Email** : [Contact via GitHub](https://github.com/YasminaEL20)
- **Discussions** : Utilisez l'onglet Discussions du repo

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

---

## 🙏 Remerciements

- **Google Books API** pour les données
- **Chart.js** pour les visualisations
- **Netlify** pour l'hébergement gratuit
- Tous les contributeurs et utilisateurs

---

## 📈 Roadmap

- [x] Recherche de base
- [x] Filtres avancés
- [x] Visualisations (Timeline, Top Auteurs)
- [x] Design responsive
- [x] Animations
- [ ] Mode sombre
- [ ] Favoris (localStorage)
- [ ] Export des résultats
- [ ] Recherche par ISBN
- [ ] Intégration réseaux sociaux

---

## 🔍 Statistiques

- **Livres disponibles** : Millions via Google Books API
- **Temps de réponse** : < 1 seconde en moyenne
- **Résultats par page** : 12 livres
- **Catégories** : 20+ catégories
- **Note minimale** : Filtre 3+ et 4+ étoiles

---

**Créé avec ❤️ par [Yasmina EL, SalsabilEL Khlouf](https://github.com/YasminaEL20)**

*Dernière mise à jour : Décembre 2024*
