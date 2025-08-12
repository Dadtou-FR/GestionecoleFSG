# Flux de Données - Champ Niveau

## Vue d'ensemble
Ce document explique comment le champ "Niveau" fonctionne dans l'application de gestion d'école.

## Flux de données

### 1. Saisie dans le formulaire (EleveForm.js)
- **Champ** : `TextField` avec `name="niveau"`
- **Valeur** : Sélectionnée depuis la liste déroulante des niveaux
- **Exemple** : "6ème", "5ème", "Ps(3ans)", etc.

### 2. Envoi au serveur
- **Service** : `eleveService.js` → `createEleve(eleve)` ou `updateEleve(id, eleve)`
- **Données envoyées** : `{ ..., niveau: "6ème", ... }`
- **Endpoint** : `POST/PUT http://localhost:8080/api/eleves`

### 3. Sauvegarde en base de données
- **Entité** : `Eleve.java`
- **Champ** : `private String niveau;`
- **Base de données** : MongoDB collection "eleves"

### 4. Récupération et affichage (EleveList.js)
- **Service** : `eleveService.js` → `getEleves()`
- **Données reçues** : `{ ..., niveau: "6ème", ... }`
- **Affichage** : Colonne "Niveau" dans le DataGrid

## Structure des données

### Frontend (React)
```javascript
// État du formulaire
const [eleve, setEleve] = useState({
  matricule: '',
  prenom: '',
  nom: '',
  sexe: '',
  dateNaissance: '',
  villeNaissance: '',
  telephone: '',
  niveau: '', // ← Champ niveau
});
```

### Backend (Java)
```java
@Document(collection = "eleves")
public class Eleve {
    @Id
    private String id;
    private String nom;
    private String prenom;
    private String sexe;
    private String nomClasse; // ← Ancien champ (compatibilité)
    private String niveau;    // ← Nouveau champ
    // ... autres champs
}
```

## Niveaux disponibles

### Primaire
- Ps(3ans) - Petite Section (3 ans)
- Ms - Moyenne Section
- Gs - Grande Section
- 11ème - 11ème année
- 10ème - 10ème année
- 9ème - 9ème année
- 8ème - 8ème année
- 7ème - 7ème année

### Collège
- 6ème, 5ème, 4ème, 3ème

### Lycée
- 2nde, 1ère, Terminale

### Université
- L1, L2, L3, M1, M2

## Couleurs d'affichage
Chaque niveau a une couleur distincte pour faciliter l'identification visuelle :
- Primaire : Couleurs chaudes (rouge, orange, jaune)
- Collège : Couleurs bleues
- Lycée : Couleurs violettes
- Université : Couleurs variées

## Compatibilité
- ✅ Les anciens élèves avec `nomClasse` restent fonctionnels
- ✅ Migration automatique : `niveau` prend la valeur de `nomClasse` si disponible
- ✅ Aucune perte de données lors de la transition 