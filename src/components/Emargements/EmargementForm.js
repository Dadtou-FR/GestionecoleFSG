import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Typography, Paper, Grid, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Person as PersonIcon, School as SchoolIcon, CalendarToday as CalendarIcon, CheckCircle as CheckIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { createEmargement, updateEmargement, getEmargementById } from '../../services/emargementService';
import { getEleves } from '../../services/eleveService';
import { getCours } from '../../services/coursService';
import { useSnackbar } from 'notistack';

function EmargementForm({ id, onSuccess }) {
  const [emargement, setEmargement] = useState({
    id_eleve: '',
    id_cours: '',
    date_cours: '',
    presence: false,
  });
  const [eleves, setEleves] = useState([]);
  const [cours, setCours] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getEleves().then(res => setEleves(res.data));
    getCours().then(res => setCours(res.data));
    if (id) {
      getEmargementById(id).then(res => setEmargement(res.data));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setEmargement({ ...emargement, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (id) {
      updateEmargement(id, emargement)
        .then(() => {
          enqueueSnackbar('Émargement modifié avec succès !', { variant: 'success' });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de la modification.', { variant: 'error' }));
    } else {
      createEmargement(emargement)
        .then(() => {
          enqueueSnackbar('Émargement ajouté avec succès !', { variant: 'success' });
          // Réinitialise tous les champs après ajout réussi
          setEmargement({
            id_eleve: '',
            id_cours: '',
            date_cours: '',
            presence: false,
          });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de l\'ajout.', { variant: 'error' }));
    }
  };

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e', mb: 3 }}>
        {id ? <><EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Modifier un émargement</> :
               <><AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Ajouter un nouvel émargement</>}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField 
              select 
              name="id_eleve" 
              label="Élève" 
              value={emargement.id_eleve} 
              onChange={handleChange} 
              required 
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                },
                '& .MuiSelect-select': {
                  fontSize: '1rem',
                  padding: '16px 14px 16px 40px'
                }
              }}
            >
              {eleves.map(eleve => (
                <MenuItem key={eleve.id} value={eleve.id} sx={{ fontSize: '1rem', py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: '1.2rem', color: '#1a237e' }} />
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                        {eleve.nom} {eleve.prenom}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`Matricule: ${eleve.matricule}`} 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontSize: '0.75rem' }}
                      />
                      <Chip 
                        label={`Classe: ${eleve.nomClasse}`} 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              select 
              name="id_cours" 
              label="Cours" 
              value={emargement.id_cours} 
              onChange={handleChange} 
              required 
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <SchoolIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                },
                '& .MuiSelect-select': {
                  fontSize: '1rem',
                  padding: '16px 14px 16px 40px'
                }
              }}
            >
              {cours.map(cour => (
                <MenuItem key={cour.id} value={cour.id} sx={{ fontSize: '1rem', py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon sx={{ fontSize: '1.2rem', color: '#1a237e' }} />
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                        {cour.nomCours}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`Niveau: ${cour.niveau}`} 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontSize: '0.75rem' }}
                      />
                      <Chip 
                        label={`Durée: ${cour.duree}h`} 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontSize: '0.75rem' }}
                      />
                      {cour.description && (
                        <Chip 
                          label={`Description: ${cour.description.substring(0, 20)}${cour.description.length > 20 ? '...' : ''}`} 
                          size="small" 
                          variant="outlined" 
                          sx={{ fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              name="date_cours" 
              label="Date du cours" 
              value={emargement.date_cours} 
              onChange={handleChange} 
              type="date" 
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              select 
              name="presence" 
              label="Présence" 
              value={emargement.presence} 
              onChange={handleChange} 
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              <MenuItem value={true} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckIcon sx={{ color: '#2e7d32' }} />
                <Typography sx={{ color: '#2e7d32', fontWeight: 'bold' }}>Présent</Typography>
              </MenuItem>
              <MenuItem value={false} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CancelIcon sx={{ color: '#d32f2f' }} />
                <Typography sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Absent</Typography>
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                color: 'white',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(45deg, #283593 30%, #3949ab 90%)',
                }
              }}
              startIcon={id ? <EditIcon /> : <AddIcon />}
            >
              {id ? 'Modifier l\'émargement' : 'Ajouter l\'émargement'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default EmargementForm; 