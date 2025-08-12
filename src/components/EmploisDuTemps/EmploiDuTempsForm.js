import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Typography, Paper, Grid, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Today as TodayIcon, AccessTime as AccessTimeIcon, Book as BookIcon, Room as RoomIcon, School as SchoolIcon } from '@mui/icons-material';
import { createEmploiDuTemps, updateEmploiDuTemps, getEmploiDuTempsById } from '../../services/emploiDuTempsService';
import { getCours } from '../../services/coursService';

import { getClasses } from '../../services/classeService';
import { useSnackbar } from 'notistack';

function EmploiDuTempsForm({ id, onSuccess }) {
  const [edt, setEdt] = useState({
    jour: '',
    heureDebut: '',
    heureFin: '',
    nomCours: '',
    niveau: '',
    nomClasse: '',
  });
  const [cours, setCours] = useState([]);
  const [classes, setClasses] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getCours().then(res => setCours(res.data));
    getClasses().then(res => setClasses(res.data));
    if (id) {
      getEmploiDuTempsById(id).then(res => setEdt(res.data));
    }
  }, [id]);

  const handleChange = e => {
    setEdt({ ...edt, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (id) {
      updateEmploiDuTemps(id, edt)
        .then(() => {
          enqueueSnackbar('Emploi du temps modifié avec succès !', { variant: 'success' });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de la modification.', { variant: 'error' }));
    } else {
      createEmploiDuTemps(edt)
        .then(() => {
          enqueueSnackbar('Emploi du temps ajouté avec succès !', { variant: 'success' });
          // Réinitialise tous les champs après ajout réussi
          setEdt({
            jour: '',
            heureDebut: '',
            heureFin: '',
            nomCours: '',
            niveau: '',
            nomClasse: '',
          });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de l\'ajout.', { variant: 'error' }));
    }
  };

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const getJourColor = (jour) => {
    const colors = {
      'Lundi': '#e3f2fd',
      'Mardi': '#f3e5f5',
      'Mercredi': '#e8f5e8',
      'Jeudi': '#fff3e0',
      'Vendredi': '#fce4ec',
      'Samedi': '#f1f8e9',
      'Dimanche': '#e0f2f1'
    };
    return colors[jour] || '#f5f5f5';
  };

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {id ? <EditIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} /> : <AddIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          {id ? 'Modifier l\'Emploi du Temps' : 'Ajouter un Emploi du Temps'}
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField 
              select
              name="jour" 
              label="Jour de la semaine" 
              value={edt.jour} 
              onChange={handleChange} 
              required 
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <TodayIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              {jours.map(jour => (
                <MenuItem key={jour} value={jour}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                    <Chip 
                      label={jour} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getJourColor(jour), 
                        color: '#1a237e', 
                        fontWeight: 'bold', 
                        fontSize: '0.75rem',
                        border: '1px solid #1a237e'
                      }} 
                    />
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField 
              name="heureDebut" 
              label="Heure de début" 
              value={edt.heureDebut} 
              onChange={handleChange} 
              type="time" 
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#4caf50' }} />,
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
              name="heureFin" 
              label="Heure de fin" 
              value={edt.heureFin} 
              onChange={handleChange} 
              type="time" 
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#f44336' }} />,
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
              name="nomCours" 
              label="Cours" 
              value={edt.nomCours} 
              onChange={handleChange} 
              required 
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <BookIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              {cours.map(cour => (
                <MenuItem key={cour.id} value={cour.nomCours}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                    <Chip 
                      label={cour.nomCours} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#1a237e', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        fontSize: '0.75rem' 
                      }} 
                    />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {cour.niveau}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField 
              select 
              name="niveau" 
              label="Niveau" 
              value={edt.niveau} 
              onChange={handleChange} 
              required 
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <RoomIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              {Array.from(new Set(classes.map(classe => classe.niveau))).map(niveau => (
                <MenuItem key={niveau} value={niveau}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                    <Chip 
                      label={niveau} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#1a237e', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        fontSize: '0.75rem' 
                      }} 
                    />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {classes.filter(classe => classe.niveau === niveau).length} classe(s)
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField 
              select 
              name="nomClasse" 
              label="Classe" 
              value={edt.nomClasse} 
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
                }
              }}
            >
              {classes.map(classe => (
                <MenuItem key={classe.id} value={classe.nomClasse}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                    <Chip 
                      label={classe.nomClasse} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getJourColor(classe.nomClasse), 
                        color: '#1a237e', 
                        fontWeight: 'bold', 
                        fontSize: '0.75rem',
                        border: '1px solid #1a237e'
                      }} 
                    />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Niveau: {classe.niveau}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={id ? <EditIcon /> : <AddIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #283593 30%, #3949ab 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(26, 35, 126, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {id ? 'Modifier l\'Emploi du Temps' : 'Ajouter l\'Emploi du Temps'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default EmploiDuTempsForm; 