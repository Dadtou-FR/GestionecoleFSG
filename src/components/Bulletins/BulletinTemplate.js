import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';

function BulletinTemplate({ data }) {
  if (!data) return null;

  return (
    <Box 
      sx={{ 
        '@media print': { 
          '@page': { margin: '1cm', size: 'A4' },
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          background: 'white'
        } 
      }} 
      className="bulletin-template"
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: '800px', 
          mx: 'auto', 
          background: '#fff', 
          '@media print': { 
            boxShadow: 'none', 
            border: '2px solid #000',
            maxWidth: '100%',
            margin: '0',
            padding: '20px'
          } 
        }}
      >
        {/* En-tête du bulletin */}
        <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '3px solid #1a237e', pb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', textTransform: 'uppercase', letterSpacing: 2, '@media print': { color: '#000' } }}>
            🎓 Ecole des Frères de Saint-Gabriel 🎓
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#283593', mt: 1, '@media print': { color: '#000' } }}>
            BULLETIN DE NOTES
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mt: 1, '@media print': { color: '#000' } }}>
            Année Scolaire 2024-2025
          </Typography>
        </Box>

        {/* Informations de l'élève */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, borderBottom: '2px solid #e3f2fd', pb: 1, '@media print': { color: '#000' } }}>
            📋 Informations de l'élève
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Nom :</Typography>
                <Typography variant="body1">{data.eleve.nom}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Prénom :</Typography>
                <Typography variant="body1">{data.eleve.prenom}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Matricule :</Typography>
                <Typography variant="body1">{data.eleve.matricule}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Classe :</Typography>
                <Typography variant="body1">{data.classe}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Sexe :</Typography>
                <Typography variant="body1">{data.eleve.sexe}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Date de naissance :</Typography>
                <Typography variant="body1">{data.eleve.dateNaissance}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Tableau des notes par classe */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, borderBottom: '2px solid #e3f2fd', pb: 1, '@media print': { color: '#000' } }}>
            📊 Notes par matière et par classe
          </Typography>
          
          {Object.keys(data.resultatsParClasse).map((classe, classeIndex) => (
            <Box key={classeIndex} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                color: '#1a237e', 
                mb: 2, 
                p: 1, 
                backgroundColor: '#e3f2fd',
                borderRadius: 1,
                '@media print': { color: '#000', backgroundColor: '#f0f0f0 !important' }
              }}>
                🏫 Classe: {classe}
              </Typography>
              
              <TableContainer sx={{ border: '2px solid #e3f2fd', borderRadius: 2, mb: 2, '@media print': { border: '2px solid #000' } }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#e3f2fd' }}>
                      <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', '@media print': { background: '#f0f0f0 !important', color: '#000 !important' } }}>
                        Matière
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', '@media print': { background: '#f0f0f0 !important', color: '#000 !important' } }}>
                        Notes
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', '@media print': { background: '#f0f0f0 !important', color: '#000 !important' } }}>
                        Moyenne
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', '@media print': { background: '#f0f0f0 !important', color: '#000 !important' } }}>
                        Appréciation
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.resultatsParClasse[classe].map((matiere, index) => (
                      <TableRow key={index} sx={{ '&:nth-of-type(odd)': { background: '#f8f9fa', '@media print': { background: '#f8f9fa !important' } } }}>
                        <TableCell sx={{ fontWeight: 'bold', '@media print': { color: '#000 !important' } }}>{matiere.cours}</TableCell>
                        <TableCell sx={{ textAlign: 'center', '@media print': { color: '#000 !important' } }}>{matiere.notes.join(', ')}</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: parseFloat(matiere.moyenne) >= 10 ? '#2e7d32' : '#d32f2f', '@media print': { color: '#000 !important', fontWeight: 'bold' } }}>{matiere.moyenne}/20</TableCell>
                        <TableCell sx={{ textAlign: 'center', '@media print': { color: '#000 !important' } }}>{parseFloat(matiere.moyenne) >= 10 ? '✅' : '❌'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Moyenne par classe */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 'bold', 
                  color: '#1a237e',
                  textAlign: 'center',
                  p: 1,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  '@media print': { color: '#000', backgroundColor: '#f0f0f0 !important' }
                }}>
                  📊 Moyenne de la classe {classe}: {
                    (data.resultatsParClasse[classe].reduce((sum, m) => sum + parseFloat(m.moyenne), 0) / data.resultatsParClasse[classe].length).toFixed(2)
                  }/20
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Résultats et appréciation */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)', border: '2px solid #4caf50', '@media print': { background: '#f0f0f0 !important', border: '2px solid #000' } }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', mb: 2, '@media print': { color: '#000 !important' } }}>
                  📈 Moyenne Générale
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', '@media print': { color: '#000 !important' } }}>
                  {data.moyenneGenerale}/20
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)', border: '2px solid #ff9800', '@media print': { background: '#f0f0f0 !important', border: '2px solid #000' } }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e65100', textAlign: 'center', mb: 2, '@media print': { color: '#000 !important' } }}>
                  💬 Appréciation Générale
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#e65100', '@media print': { color: '#000 !important' } }}>
                  {data.appreciation}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Pied de page */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '2px solid #e3f2fd', '@media print': { borderTop: '2px solid #000' } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#666', '@media print': { color: '#000 !important' } }}>
                <strong>Date de génération :</strong> {data.dateGeneration}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Box sx={{ border: '1px solid #ccc', display: 'inline-block', p: 2, borderRadius: 1, '@media print': { border: '1px solid #000' } }}>
                <Typography variant="body2" sx={{ color: '#666', '@media print': { color: '#000 !important' } }}>
                  Signature du responsable
                </Typography>
                <Box sx={{ width: '150px', height: '50px', borderBottom: '1px solid #ccc', mt: 1, '@media print': { borderBottom: '1px solid #000' } }} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Note de bas de page */}
        <Box sx={{ mt: 3, p: 2, background: '#f5f5f5', borderRadius: 1, '@media print': { background: '#f0f0f0 !important', border: '1px solid #000' } }}>
          <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic', '@media print': { color: '#000 !important' } }}>
            📝 Ce bulletin est généré automatiquement par le système de gestion de l'Ecole des Frères de Saint-Gabriel. Il présente les résultats académiques de l'élève pour la période en cours.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default BulletinTemplate; 