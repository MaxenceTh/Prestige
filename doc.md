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