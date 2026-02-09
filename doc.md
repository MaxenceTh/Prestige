# 🧠 Comprendre les Accolades {} et le return en React
En React, le passage du "code" au "visuel" suit des règles précises. Voici comment ne plus jamais se tromper.

## 1. La "Porte de Sortie" : Les Accolades {}
Dès que tu es dans ton HTML (JSX) et que tu veux écrire du JavaScript, tu dois ouvrir une accolade. C'est comme dire à React : "Attention, ce qui suit n'est pas du texte, c'est du calcul".

## 2. Les deux types de fonctions dans un .map()

### 🟢 Le Retour Implicite (Parenthèses)
On l'utilise quand on veut "Transformer" une donnée directement en visuel, sans calcul intermédiaire.

- Signe particulier : Utilise des parenthèses ().

- Action : Tout ce qui est dedans est "balancé" directement à l'écran.

```tsx
{movies.map((movie) => (
  <p>{movie.title}</p> // Directement envoyé au navigateur
))}
```

### 🟠 Le Bloc de Logique (Accolades + Return)
On l'utilise quand on a besoin de "Préparer" la donnée avant de l'afficher (ex: calculer un rang, formater une date, créer une variable).

- Signe particulier : Utilise des accolades {}.

- Action : Tu es en mode "Cerveau" (JS pur). Rien ne s'affichera tant que tu ne tapes pas explicitement return.

```tsx
{movies.map((movie, index) => {
  // --- ZONE CERVEAU (JS) ---
  const globalRank = (page - 1) * 20 + index + 1; // Calcul
  const isTopThree = globalRank <= 3;            // Logique

  // --- ZONE VISUELLE (JSX) ---
  return (
    <div className={isTopThree ? "gold-border" : ""}>
      <span>#{globalRank}</span>
      <h2>{movie.title}</h2>
    </div>
  );
})}
```

## ⚙️ Optimisations React : `useMemo` vs `useEffect`

Dans ce projet, une attention particulière a été portée à la gestion des **états dérivés** (comme le tri et le filtrage des filmographies). Privilégisation de l'utilisation de `useMemo` plutôt que `useEffect` pour transformer les données de l'API TMDB.

### Pourquoi ce choix ?

| Concept | `useEffect` + `useState` | `useMemo` |
| :--- | :--- | :--- |
| **Exécution** | **Asynchrone (Après-coup)** : Le composant s'affiche "vide", l'effet se lance, modifie l'état, et force un **deuxième rendu**. | **Synchrone (Pendant)** : La valeur est calculée pendant que React prépare le rendu. Aucun cycle inutile. |
| **Performance** | Provoque des "re-renders" en cascade à chaque mise à jour de l'état. | Mémorise le résultat et ne le recalcule **que** si les données sources changent. |
| **Complexité** | Nécessite de gérer un état supplémentaire (`movies`), augmentant le risque de désynchronisation. | Déclare une variable simple basée sur l'état existant (`actor`), garantissant une source de vérité unique. |



### 💡 Exemple d'implémentation
Plutôt que de déclencher un effet après la réception des données, on calcule dynamiquement la liste triée :

```tsx
// La variable 'sortedMovies' est toujours synchronisée avec 'director'
const sortedMovies = useMemo(() => {
  if (!director?.movie_credits?.crew) return [];
  
  return formatDirectorCredits(director.movie_credits.crew);
}, [director]); // Ne se recalcule que si l'ID de la personne change
```

# 🛠 Guide de Contribution Git
---

## 🔄 Le Cycle de Vie d'une Modification

### 1️⃣ Le Commit (`git commit`)
C'est votre **sauvegarde locale**. Vous figez vos modifications sur votre ordinateur.
- **Commande :** ```bash
  git add .
  git commit -m "Description concise du changement"

  ### 2️⃣ Le Push (`git push`)
C'est l'envoi de votre travail vers le serveur distant (GitHub, GitLab, etc.).

* **Commande :**
    ```bash
    git push origin nom-de-votre-branche
    ```
* **Pourquoi :** Pour que votre code soit sauvegardé en ligne et devienne visible par les autres membres de l'équipe.

---

### 3️⃣ La Pull Request (`PR`)
Cette étape s'effectue sur l'**interface web** de votre hébergeur Git (en haut de la page de votre dépôt).

* **Action :** Cliquer sur le bouton **"New Pull Request"** ou **"Compare & pull request"**.
* **Pourquoi :** C'est une invitation à discuter de vos changements, à effectuer une relecture de code (*code review*) et à vérifier que tout fonctionne avant l'intégration finale.

---

### 4️⃣ Le Merge (`git merge`)
C'est l'aboutissement. Vos modifications sont officiellement fusionnées dans la branche principale (souvent `main` ou `master`).

* **Action :** Généralement validé en cliquant sur le bouton **"Merge pull request"** directement sur la page de la PR.
* **Pourquoi :** Votre fonctionnalité est maintenant intégrée et fait officiellement partie du produit.

---

npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
vitest : Le lanceur de tests (ton "moteur").

jsdom : Simule un navigateur (DOM) dans ton terminal pour que React puisse s'y "afficher".

@testing-library/react : L'outil principal pour manipuler tes composants (render, findByText, etc.).

@testing-library/jest-dom : Ajoute des comparateurs très pratiques comme .toBeInTheDocument() ou .toHaveClass().

@testing-library/user-event : Plus précis que fireEvent, il simule de vrais clics et saisies clavier comme un humain.