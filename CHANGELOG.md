# Changelog - Gestion École

## [1.2.0] - 2024-01-XX

### Modifié
- **Page Élèves** : Modification du champ "Classe" pour afficher seulement le niveau :
  - Le champ affiche maintenant le niveau (ex: "6ème", "5ème", "Ps(3ans)") au lieu du nom complet de la classe
  - Évite l'ambiguïté lors de l'inscription, de l'arrangement des salles et des bulletins
  - Affichage avec couleurs distinctes selon le niveau
  - Organisation par catégories (Primaire, Collège, Lycée, Université)

### Technique
- **Frontend** : 
  - Mise à jour de `EleveForm.js` : champ `nomClasse` remplacé par `niveau`
  - Mise à jour de `EleveList.js` : affichage du niveau avec couleurs
  - Ajout des fonctions `getNiveauColor()` et `getNiveauCategory()`
- **Backend** : 
  - Ajout du champ `niveau` dans l'entité `Eleve.java`
  - Compatibilité avec l'ancien champ `nomClasse`

### Compatibilité
- ✅ Compatible avec l'ancienne structure de données
- ✅ Les anciens élèves avec `nomClasse` restent fonctionnels
- ✅ Migration automatique : `niveau` prend la valeur de `nomClasse` si disponible

## [1.1.0] - 2024-01-XX

### Ajouté
- **Niveaux de primaire** : Ajout des niveaux suivants dans la liste déroulante des classes :
  - Ps(3ans) - Petite Section (3 ans)
  - Ms - Moyenne Section
  - Gs - Grande Section
  - 11ème - 11ème année
  - 10ème - 10ème année
  - 9ème - 9ème année
  - 8ème - 8ème année
  - 7ème - 7ème année

### Modifié
- **Interface utilisateur** : Amélioration de l'affichage des niveaux avec :
  - Couleurs distinctes pour chaque niveau
  - Organisation par catégories (Primaire, Collège, Lycée, Université)
  - Affichage de la catégorie dans la liste déroulante

### Technique
- **Frontend** : Mise à jour de `ClasseForm.js` et `ClasseList.js`
- **Backend** : Aucune modification nécessaire (le champ `niveau` est déjà de type String)
- **Base de données** : Compatible avec les nouveaux niveaux sans migration

### Compatibilité
- ✅ Compatible avec l'ancienne structure de données
- ✅ Les anciens niveaux restent fonctionnels
- ✅ Aucune migration de base de données requise 