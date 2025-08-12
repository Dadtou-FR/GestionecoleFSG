import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Service pour récupérer les statistiques depuis la base de données
export const getStatistics = async () => {
  try {
    // Récupérer toutes les données en parallèle
    const [elevesResponse, classesResponse, enseignantsResponse, coursResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/eleves`),
      axios.get(`${API_BASE_URL}/classes`),
      axios.get(`${API_BASE_URL}/enseignants`),
      axios.get(`${API_BASE_URL}/cours`)
    ]);

    // Calculer les statistiques
    const eleves = elevesResponse.data;
    const classes = classesResponse.data;
    const enseignants = enseignantsResponse.data;
    const cours = coursResponse.data;

    // Calculer les tendances (simulation basée sur les données existantes)
    const calculateTrend = (count) => {
      if (count === 0) return '+0';
      const trend = Math.floor(Math.random() * 10) + 1; // Simulation de tendance
      return `+${trend}`;
    };

    // Calculer les pourcentages de progression (simulation)
    const calculateProgress = (count) => {
      if (count === 0) return 0;
      return Math.min(95, Math.max(60, Math.floor((count / 50) * 100))); // Simulation de progression
    };

    // Compter les numéros de téléphone uniques
    const telephonesUniques = new Set();
    eleves.forEach(eleve => {
      if (eleve.telephone && eleve.telephone.trim() !== '') {
        telephonesUniques.add(eleve.telephone.trim());
      }
    });

    return {
      eleves: {
        count: eleves.length,
        trend: calculateTrend(eleves.length),
        progress: calculateProgress(eleves.length),
        subtitle: 'Élèves inscrits'
      },
      classes: {
        count: classes.length,
        trend: calculateTrend(classes.length),
        progress: calculateProgress(classes.length),
        subtitle: 'Classes actives'
      },
      enseignants: {
        count: enseignants.length,
        trend: calculateTrend(enseignants.length),
        progress: calculateProgress(enseignants.length),
        subtitle: 'Enseignants'
      },
      cours: {
        count: cours.length,
        trend: calculateTrend(cours.length),
        progress: calculateProgress(cours.length),
        subtitle: 'Cours dispensés'
      },
      telephones: {
        count: telephonesUniques.size,
        trend: calculateTrend(telephonesUniques.size),
        progress: calculateProgress(telephonesUniques.size),
        subtitle: 'Liste des parents enregistrés'
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    // Retourner des valeurs par défaut en cas d'erreur
    return {
      eleves: { count: 0, trend: '+0', progress: 0, subtitle: 'Élèves inscrits' },
      classes: { count: 0, trend: '+0', progress: 0, subtitle: 'Classes actives' },
      enseignants: { count: 0, trend: '+0', progress: 0, subtitle: 'Enseignants' },
      cours: { count: 0, trend: '+0', progress: 0, subtitle: 'Cours dispensés' },
      telephones: { count: 0, trend: '+0', progress: 0, subtitle: 'Liste des parents enregistrés' }
    };
  }
};

// Service pour récupérer les statistiques des actions rapides
export const getQuickActionsStats = async () => {
  try {
    const [elevesResponse, classesResponse, notesResponse, emploisResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/eleves`),
      axios.get(`${API_BASE_URL}/classes`),
      axios.get(`${API_BASE_URL}/notes`),
      axios.get(`${API_BASE_URL}/emplois-du-temps`)
    ]);

    return {
      eleves: `${elevesResponse.data.length} élèves`,
      classes: `${classesResponse.data.length} classes`,
      notes: `${notesResponse.data.length} notes`,
      emplois: `${emploisResponse.data.length} cours`,
      emargements: `${Math.floor(Math.random() * 10) + 90}% présence`, // Simulation
      scolarite: `${Math.floor(Math.random() * 10) + 85}% payé` // Simulation
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des stats des actions rapides:', error);
    return {
      eleves: '0 élèves',
      classes: '0 classes',
      notes: '0 notes',
      emplois: '0 cours',
      emargements: '0% présence',
      scolarite: '0% payé'
    };
  }
}; 