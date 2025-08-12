import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Paper, Typography, Grid, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Book as BookIcon, Description as DescriptionIcon, Schedule as ScheduleIcon, School as SchoolIcon } from '@mui/icons-material';
import { createCours, updateCours, getCoursById } from '../../services/coursService';
import { getClasses } from '../../services/classeService';
import { useSnackbar } from 'notistack';

function CoursForm({ id, onSuccess }) {
  const [cours, setCours] = useState({
    nomCours: '',
    description: '',
    duree: '',
    classe: ''
  });
  const [classes, setClasses] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getClasses().then(res => setClasses(res.data));
    if (id) {
      getCoursById(id).then(res => {
        setCours({
          nomCours: res.data.nomCours || '',
          description: res.data.description || '',
          duree: res.data.duree || '',
          classe: res.data.classe || ''
        });
      });
    }
  }, [id]);

  const handleChange = e => {
    setCours({ ...cours, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (id) {
      updateCours(id, cours)
        .then(() => {
          enqueueSnackbar('Cours modifié avec succès !', { variant: 'success' });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de la modification.', { variant: 'error' }));
    } else {
      createCours(cours)
        .then(() => {
          enqueueSnackbar('Cours ajouté avec succès !', { variant: 'success' });
          // Réinitialise tous les champs après ajout réussi
          setCours({
            nomCours: '',
            description: '',
            duree: '',
            classe: ''
          });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de l\'ajout.', { variant: 'error' }));
    }
  };

  const getClasseColor = (classe) => {
    const colors = {
      '6ème': '#e3f2fd',
      '5ème': '#f3e5f5',
      '4ème': '#e8f5e8',
      '3ème': '#fff3e0',
      '2nde': '#fce4ec',
      '1ère': '#f1f8e9',
      'Terminale': '#e0f2f1'
    };
    return colors[classe] || '#f5f5f5';
  };

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {id ? <EditIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} /> : <AddIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          {id ? 'Modifier le Cours' : 'Ajouter un Cours'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              name="nomCours"
              label="Nom du cours"
              value={cours.nomCours}
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
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="duree"
              label="Durée (heures)"
              type="number"
              value={cours.duree}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <ScheduleIcon sx={{ mr: 1, color: '#1a237e' }} />,
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
              name="classe"
              label="Classe"
              value={cours.classe}
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
                        backgroundColor: getClasseColor(classe.nomClasse), 
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

          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description du cours"
              value={cours.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <DescriptionIcon sx={{ mr: 1, color: '#1a237e', alignSelf: 'flex-start', mt: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            />
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
                {id ? 'Modifier le Cours' : 'Ajouter le Cours'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default CoursForm; 