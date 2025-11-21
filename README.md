# Your-Car (Ikhtar Sayartak)

Prototype Next.js (app router, Tailwind) to tester un conseiller voiture pour le marché marocain. Formulaire rapide et suggestions mock (neuf/occasion) triées selon budget, usage, carburant et places.

## Lancer en local
```bash
npm install    # déjà fait lors du scaffold
npm run dev
# puis ouvrir http://localhost:3000
```

## Ce qui est présent
- Form client-side avec filtres: budget, usage, carburant, neuf/occasion, places.
- Liste de 6 modèles mock (mix neuf/occ) filtrés + score simple.
- UI Tailwind avec gradient sombre, badges, cartes de suggestions et bloc explication.

## Pistes suivantes
- Remplacer les données mocks par catalogue Maroc (JSON/SQLite).
- Ajouter km/an pour calculer coût annuel carburant/énergie.
- Brancher des flux d’annonces occasion + déduplication/fiabilité.
- Ajouter bouton contact/lead + tracking des clics.
