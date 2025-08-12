import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Autocomplete,
  TextField,
  Chip,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Print as PrintIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Grade as GradeIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { getEleves } from '../../services/eleveService';
import { getNotes } from '../../services/noteService';
import { useSnackbar } from 'notistack';
import BulletinTemplate from './BulletinTemplate';

function BulletinPage() {
  const [eleves, setEleves] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [bulletinData, setBulletinData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getEleves().then(res => setEleves(res.data));
    getNotes().then(res => setNotes(res.data));
  }, []);

  const generateBulletin = async () => {
    if (!selectedEleve) {
      enqueueSnackbar('Veuillez sélectionner un élève', { variant: 'warning' });
      return;
    }

    setLoading(true);

    try {
      // Filtrer les notes de l'élève sélectionné
      const eleveNotes = notes.filter(note => note.matriculeEleve === selectedEleve.matricule);

      if (eleveNotes.length === 0) {
        enqueueSnackbar('Aucune note trouvée pour cet élève', { variant: 'info' });
        setBulletinData(null);
        return;
      }

      // Nettoyer et valider les notes
      const notesValidees = [];
      const coursTraites = new Set();

      eleveNotes.forEach(note => {
        // Éviter les doublons de cours
        if (!coursTraites.has(note.nomCours)) {
          coursTraites.add(note.nomCours);
          notesValidees.push(note);
        } else {
          console.warn(`Note dupliquée ignorée: ${note.nomCours} pour ${note.matriculeEleve}`);
        }
      });

      // Grouper les notes par classe (normalement une seule classe par élève)
      const notesParClasse = {};
      notesValidees.forEach(note => {
        // Utiliser la classe de l'élève comme classe principale
        const classe = selectedEleve.nomClasse || note.classe || 'Classe non définie';
        if (!notesParClasse[classe]) {
          notesParClasse[classe] = [];
        }
        notesParClasse[classe].push(note);
      });

      // Calculer les moyennes par cours pour chaque classe
      const resultatsParClasse = {};
      Object.keys(notesParClasse).forEach(classe => {
        const coursNotes = {};
        notesParClasse[classe].forEach(note => {
          if (!coursNotes[note.nomCours]) {
            coursNotes[note.nomCours] = [];
          }
          coursNotes[note.nomCours].push(parseFloat(note.valeur));
        });

        const moyennes = Object.keys(coursNotes).map(cours => ({
          cours: cours,
          notes: coursNotes[cours],
          moyenne: (coursNotes[cours].reduce((a, b) => a + b, 0) / coursNotes[cours].length).toFixed(2)
        }));

        resultatsParClasse[classe] = moyennes;
      });

      // Calculer la moyenne générale globale
      const toutesLesMoyennes = Object.values(resultatsParClasse).flat().map(m => parseFloat(m.moyenne));
      const moyenneGenerale = toutesLesMoyennes.length > 0
        ? (toutesLesMoyennes.reduce((sum, m) => sum + m, 0) / toutesLesMoyennes.length).toFixed(2)
        : 0;

      // Déterminer l'appréciation
      const appreciation = getAppreciation(moyenneGenerale);

      // Calculer les statistiques globales
      const notesReussies = toutesLesMoyennes.filter(m => m >= 10).length;
      const notesEchouees = toutesLesMoyennes.filter(m => m < 10).length;
      const meilleureNote = Math.max(...toutesLesMoyennes);
      const moinsBonneNote = Math.min(...toutesLesMoyennes);

      setBulletinData({
        eleve: selectedEleve,
        resultatsParClasse: resultatsParClasse,
        moyenneGenerale: moyenneGenerale,
        appreciation: appreciation,
        dateGeneration: new Date().toLocaleDateString('fr-FR'),
        statistiques: {
          notesReussies,
          notesEchouees,
          totalMatieres: toutesLesMoyennes.length,
          meilleureNote: meilleureNote.toFixed(2),
          moinsBonneNote: moinsBonneNote.toFixed(2),
          nombreClasses: Object.keys(resultatsParClasse).length
        }
      });

      enqueueSnackbar('Bulletin généré avec succès !', { variant: 'success' });
    } catch (error) {
      console.error('Erreur lors de la génération du bulletin:', error);
      enqueueSnackbar('Erreur lors de la génération du bulletin', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getAppreciation = (moyenne) => {
    const moy = parseFloat(moyenne);
    if (moy >= 16) return "Excellent - Félicitations !";
    if (moy >= 14) return "Très bien - Bon travail !";
    if (moy >= 12) return "Bien - Continuez ainsi !";
    if (moy >= 10) return "Assez bien - Peut mieux faire";
    if (moy >= 8) return "Passable - Efforts à fournir";
    return "Insuffisant - Travail à reprendre";
  };

  const getAppreciationColor = (moyenne) => {
    const moy = parseFloat(moyenne);
    if (moy >= 16) return '#4caf50';
    if (moy >= 14) return '#8bc34a';
    if (moy >= 12) return '#ff9800';
    if (moy >= 10) return '#ffc107';
    if (moy >= 8) return '#ff5722';
    return '#f44336';
  };

  const handlePrint = () => {
    if (bulletinData) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');

      // Générer le contenu des notes par classe
      let notesContent = '';
      Object.keys(bulletinData.resultatsParClasse).forEach(classe => {
        notesContent += `
          <div style="margin-bottom: 20px;">
            <h4 style="background-color: #f0f0f0; padding: 10px; margin: 10px 0; border-left: 4px solid #1a237e;">
              🏫 Classe: ${classe}
            </h4>
            <table style="width: 100%; margin-bottom: 15px;">
              <thead>
                <tr style="background-color: #e3f2fd;">
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">Matière</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">Notes</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">Moyenne</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">Appréciation</th>
                </tr>
              </thead>
              <tbody>
                ${bulletinData.resultatsParClasse[classe].map(matiere => `
                  <tr>
                    <td style="border: 1px solid black; padding: 8px; font-weight: bold;">${matiere.cours}</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: center;">${matiere.notes.join(', ')}</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold;">${matiere.moyenne}/20</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: center;">${parseFloat(matiere.moyenne) >= 10 ? '✅' : '❌'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="text-align: center; font-weight: bold; background-color: #f5f5f5; padding: 5px; border: 1px solid #ccc;">
              📊 Moyenne de la classe ${classe}: ${(bulletinData.resultatsParClasse[classe].reduce((sum, m) => sum + parseFloat(m.moyenne), 0) / bulletinData.resultatsParClasse[classe].length).toFixed(2)}/20
            </div>
          </div>
        `;
      });

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bulletin - ${bulletinData.eleve.nom} ${bulletinData.eleve.prenom}</title>
          <style>
            @media print {
              body { margin: 0; padding: 15px; }
              * { color: black !important; background: white !important; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid black; padding: 6px; text-align: center; }
              th { background-color: #f0f0f0 !important; }
              .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid black; padding-bottom: 8px; }
              .student-info { margin-bottom: 20px; }
              .student-info div { display: flex; justify-content: space-between; margin: 3px 0; }
              .notes-table { margin-bottom: 20px; }
              .results { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .result-box { border: 2px solid black; padding: 12px; text-align: center; width: 45%; }
              .footer { margin-top: 20px; border-top: 2px solid black; padding-top: 8px; }
              .signature { border: 1px solid black; display: inline-block; padding: 8px; }
            }
            body { font-family: Arial, sans-serif; }
            .header h1 { margin: 0; font-size: 22px; white-space: nowrap; }
            .header h2 { margin: 3px 0; font-size: 18px; }
            .header p { margin: 3px 0; }
            .student-info div { display: flex; justify-content: space-between; margin: 3px 0; }
            .result-box h4 { margin: 3px 0; }
            .result-box .average { font-size: 28px; font-weight: bold; margin: 8px 0; }
            .footer { display: flex; justify-content: space-between; }
            .signature { text-align: center; }
            .signature-line { width: 120px; height: 40px; border-bottom: 1px solid black; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎓 Ecole des Frères de Saint-Gabriel 🎓</h1>
            <h2>BULLETIN DE NOTES</h2>
            <p>Année Scolaire 2024-2025</p>
          </div>

          <div class="student-info">
            <div><strong>Nom :</strong> ${bulletinData.eleve.nom}</div>
            <div><strong>Prénom :</strong> ${bulletinData.eleve.prenom}</div>
            <div><strong>Matricule :</strong> ${bulletinData.eleve.matricule}</div>
            <div><strong>Classe principale :</strong> ${bulletinData.eleve.nomClasse}</div>
            <div><strong>Sexe :</strong> ${bulletinData.eleve.sexe}</div>
            <div><strong>Date de naissance :</strong> ${bulletinData.eleve.dateNaissance}</div>
          </div>

          <div class="notes-table">
            ${notesContent}
          </div>

          <div class="results">
            <div class="result-box">
              <h4>📈 Moyenne Générale</h4>
              <div class="average">${bulletinData.moyenneGenerale}/20</div>
            </div>
            <div class="result-box">
              <h4>💬 Appréciation Générale</h4>
              <div><strong>${bulletinData.appreciation}</strong></div>
            </div>
          </div>

          <div class="footer">
            <div>
              <strong>Date de génération :</strong> ${bulletinData.dateGeneration}
            </div>
            <div class="signature">
              <div>Signature du responsable</div>
              <div class="signature-line"></div>
            </div>
          </div>

          <div style="margin-top: 15px; padding: 8px; background-color: #f5f5f5; border: 1px solid #ccc; font-style: italic; font-size: 11px;">
            📝 Ce bulletin est généré automatiquement par le système de gestion de l'Ecole des Frères de Saint-Gabriel. Il présente les résultats académiques de l'élève pour la période en cours.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  const getInitials = (nom, prenom) => {
    return `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssessmentIcon sx={{ mr: 2, color: '#1a237e', fontSize: 36 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Gestion des Bulletins
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic' }}>
          Générez et imprimez les bulletins de notes de vos élèves avec un design professionnel.
        </Typography>
      </Paper>

      {/* Sélection de l'élève */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PersonIcon sx={{ mr: 2, color: '#1a237e', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Sélection de l'élève
          </Typography>
        </Box>

                 <Grid container spacing={3} alignItems="center">
           <Grid item xs={12} md={8}>
             <Autocomplete
               options={eleves}
               getOptionLabel={(option) => `${option.matricule} - ${option.nom} ${option.prenom} (${option.nomClasse})`}
               value={selectedEleve}
               onChange={(event, newValue) => setSelectedEleve(newValue)}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label="Sélectionner un élève"
                   required
                   fullWidth
                   variant="outlined"
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       '&:hover fieldset': { borderColor: '#1a237e' },
                       '&.Mui-focused fieldset': { borderColor: '#1a237e' },
                       minHeight: '60px',
                       '& input': {
                         padding: '16px 14px',
                         fontSize: '1rem'
                       }
                     },
                     '& .MuiInputLabel-root': {
                       fontSize: '1rem',
                       fontWeight: '500'
                     }
                   }}
                 />
               )}
               renderOption={(props, option) => (
                 <Box component="li" {...props} sx={{ 
                   borderBottom: '1px solid #f0f0f0',
                   '&:last-child': { borderBottom: 'none' },
                   '&:hover': {
                     backgroundColor: '#f8f9fa',
                     transform: 'translateX(4px)',
                     transition: 'all 0.2s ease'
                   }
                 }}>
                   <Box sx={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: 3, 
                     width: '100%', 
                     py: 2,
                     px: 1
                   }}>
                     <Avatar
                       sx={{
                         width: 50,
                         height: 50,
                         fontSize: '1.2rem',
                         background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                         color: 'white',
                         fontWeight: 'bold',
                         boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
                         border: '2px solid #fff'
                       }}
                     >
                       {getInitials(option.nom, option.prenom)}
                     </Avatar>
                     <Box sx={{ flexGrow: 1 }}>
                       <Typography variant="h6" sx={{ 
                         fontWeight: 'bold', 
                         fontSize: '1.2rem',
                         color: '#1a237e',
                         mb: 0.5,
                         display: 'flex',
                         alignItems: 'center',
                         gap: 1
                       }}>
                         <Box
                           component="span"
                           sx={{
                             backgroundColor: '#1a237e',
                             color: 'white',
                             px: 1.5,
                             py: 0.5,
                             borderRadius: '8px',
                             fontSize: '0.9rem',
                             fontWeight: 'bold',
                             boxShadow: '0 2px 8px rgba(26, 35, 126, 0.3)'
                           }}
                         >
                           {option.matricule}
                         </Box>
                         {option.nom} {option.prenom}
                       </Typography>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                         <Chip
                           label={option.nomClasse}
                           size="small"
                           sx={{
                             backgroundColor: '#f3e5f5',
                             color: '#7b1fa2',
                             fontWeight: 'bold',
                             fontSize: '0.8rem'
                           }}
                         />
                         {option.sexe && (
                           <Chip
                             label={option.sexe === 'M' ? 'Garçon' : 'Fille'}
                             size="small"
                             sx={{
                               backgroundColor: option.sexe === 'M' ? '#e3f2fd' : '#fce4ec',
                               color: option.sexe === 'M' ? '#1976d2' : '#c2185b',
                               fontWeight: 'bold',
                               fontSize: '0.8rem'
                             }}
                           />
                         )}
                       </Box>
                     </Box>
                     <Box sx={{ 
                       display: 'flex', 
                       flexDirection: 'column', 
                       alignItems: 'center',
                       color: '#666',
                       fontSize: '0.8rem'
                     }}>
                       <PersonIcon sx={{ fontSize: '1.2rem', mb: 0.5 }} />
                       <Typography variant="caption">Élève</Typography>
                     </Box>
                   </Box>
                 </Box>
               )}
               filterOptions={(options, { inputValue }) => {
                 const searchTerm = inputValue.toLowerCase();
                 // Prioriser la recherche par matricule
                 const filteredOptions = options.filter(option =>
                   option.matricule.toLowerCase().includes(searchTerm) ||
                   option.nom.toLowerCase().includes(searchTerm) ||
                   option.prenom.toLowerCase().includes(searchTerm) ||
                   option.nomClasse.toLowerCase().includes(searchTerm)
                 );
                 
                 // Trier pour mettre les matricules en premier
                 return filteredOptions.sort((a, b) => {
                   const aStartsWithMatricule = a.matricule.toLowerCase().startsWith(searchTerm);
                   const bStartsWithMatricule = b.matricule.toLowerCase().startsWith(searchTerm);
                   
                   if (aStartsWithMatricule && !bStartsWithMatricule) return -1;
                   if (!aStartsWithMatricule && bStartsWithMatricule) return 1;
                   
                   return a.matricule.localeCompare(b.matricule);
                 });
               }}
               sx={{
                 '& .MuiAutocomplete-paper': {
                   boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                   borderRadius: '12px',
                   border: '1px solid #e0e0e0',
                   maxHeight: '400px'
                 },
                 '& .MuiAutocomplete-listbox': {
                   padding: '8px 0'
                 }
               }}
             />
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={generateBulletin}
              disabled={!selectedEleve || loading}
              startIcon={<AssessmentIcon />}
              sx={{
                background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(45deg, #283593 30%, #3949ab 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(26, 35, 126, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Génération...' : 'Générer le Bulletin'}
            </Button>
            {bulletinData && (
              <Tooltip title="Imprimer le bulletin">
                <IconButton
                  onClick={handlePrint}
                  sx={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#45a049',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
                 </Grid>
       </Paper>

       {/* Informations de l'élève sélectionné */}
       {selectedEleve && (
         <Paper sx={{ 
           p: 3, 
           mb: 3, 
           background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)', 
           border: '2px solid #4caf50',
           boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
           borderRadius: '16px'
         }}>
           <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
             <PersonIcon sx={{ mr: 2, color: '#2e7d32', fontSize: 32 }} />
             <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
               Élève Sélectionné
             </Typography>
           </Box>
           <Grid container spacing={4}>
             <Grid item xs={12} md={6}>
               <Box sx={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: 3, 
                 p: 2,
                 background: 'rgba(255,255,255,0.7)',
                 borderRadius: '12px',
                 border: '1px solid rgba(76, 175, 80, 0.2)'
               }}>
                 <Avatar
                   sx={{
                     width: 80,
                     height: 80,
                     fontSize: '2rem',
                     background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                     color: 'white',
                     fontWeight: 'bold',
                     boxShadow: '0 6px 20px rgba(26, 35, 126, 0.3)',
                     border: '3px solid #fff'
                   }}
                 >
                   {getInitials(selectedEleve.nom, selectedEleve.prenom)}
                 </Avatar>
                 <Box>
                   <Typography variant="h4" sx={{ 
                     fontWeight: 'bold', 
                     color: '#1a237e',
                     mb: 1
                   }}>
                     {selectedEleve.nom} {selectedEleve.prenom}
                   </Typography>
                   <Typography variant="h6" sx={{ 
                     color: '#666', 
                     fontWeight: '500',
                     mb: 1
                   }}>
                     Matricule: {selectedEleve.matricule}
                   </Typography>
                   {selectedEleve.dateNaissance && (
                     <Typography variant="body1" sx={{ 
                       color: '#888',
                       fontStyle: 'italic'
                     }}>
                       Né(e) le {selectedEleve.dateNaissance}
                     </Typography>
                   )}
                 </Box>
               </Box>
             </Grid>
             <Grid item xs={12} md={6}>
               <Box sx={{ 
                 display: 'flex', 
                 flexDirection: 'column', 
                 gap: 2,
                 p: 2,
                 background: 'rgba(255,255,255,0.7)',
                 borderRadius: '12px',
                 border: '1px solid rgba(76, 175, 80, 0.2)'
               }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <SchoolIcon sx={{ color: '#2196f3', fontSize: '1.5rem' }} />
                   <Chip
                     label={`Classe: ${selectedEleve.nomClasse}`}
                     sx={{
                       backgroundColor: '#2196f3',
                       color: 'white',
                       fontWeight: 'bold',
                       fontSize: '1.1rem',
                       py: 1.5,
                       px: 2
                     }}
                   />
                 </Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <PersonIcon sx={{ color: '#ff9800', fontSize: '1.5rem' }} />
                   <Chip
                     label={`Sexe: ${selectedEleve.sexe === 'M' ? 'Garçon' : 'Fille'}`}
                     sx={{
                       backgroundColor: selectedEleve.sexe === 'M' ? '#2196f3' : '#e91e63',
                       color: 'white',
                       fontWeight: 'bold',
                       fontSize: '1.1rem',
                       py: 1.5,
                       px: 2
                     }}
                   />
                 </Box>
                 {selectedEleve.telephone && (
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <PhoneIcon sx={{ color: '#9c27b0', fontSize: '1.5rem' }} />
                     <Chip
                       label={`Tél: ${selectedEleve.telephone}`}
                       sx={{
                         backgroundColor: '#9c27b0',
                         color: 'white',
                         fontWeight: 'bold',
                         fontSize: '1.1rem',
                         py: 1.5,
                         px: 2
                       }}
                     />
                   </Box>
                 )}
               </Box>
             </Grid>
           </Grid>
         </Paper>
       )}

       {/* Affichage du bulletin */}
      {bulletinData && (
        <Box sx={{ mt: 3 }}>
          {/* Statistiques rapides */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {bulletinData.moyenneGenerale}
                  </Typography>
                  <Typography variant="body2">Moyenne Générale</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {bulletinData.statistiques.totalMatieres}
                  </Typography>
                  <Typography variant="body2">Matières</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {bulletinData.statistiques.nombreClasses}
                  </Typography>
                  <Typography variant="body2">Classes</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {bulletinData.statistiques.notesReussies}
                  </Typography>
                  <Typography variant="body2">Réussites</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {bulletinData.statistiques.notesEchouees}
                  </Typography>
                  <Typography variant="body2">Échecs</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Appréciation générale */}
          <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GradeIcon sx={{ mr: 2, color: getAppreciationColor(bulletinData.moyenneGenerale), fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                Appréciation Générale
              </Typography>
            </Box>
            <Chip
              label={bulletinData.appreciation}
              sx={{
                backgroundColor: getAppreciationColor(bulletinData.moyenneGenerale),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                py: 1
              }}
            />
          </Paper>

          {/* Bulletin Template */}
          <BulletinTemplate data={bulletinData} />
        </Box>
      )}

      {/* Message d'aide */}
      {!bulletinData && (
        <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', border: '1px solid #ffb74d' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 2, color: '#f57c00', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e65100' }}>
                Instructions
              </Typography>
              <Typography variant="body2" sx={{ color: '#bf360c' }}>
                1. Sélectionnez un élève dans la liste déroulante • 2. Cliquez sur "Générer le Bulletin" • 3. Consultez le bulletin généré • 4. Imprimez si nécessaire
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default BulletinPage; 