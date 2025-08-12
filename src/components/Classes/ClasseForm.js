import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Grid, Chip, MenuItem } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Class as ClassIcon, School as SchoolIcon } from '@mui/icons-material';
import { createClasse, updateClasse, getClasse } from '../../services/classeService';
import { useSnackbar } from 'notistack';

function ClasseForm({ id, onSuccess }) {
  const [classe, setClasse] = useState({ 
    nomClasse: '',
    niveau: '',
    capacite: '',
    description: ''
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      getClasse(id).then(res => {
        setClasse({
          nomClasse: res.data.nomClasse || '',
          niveau: res.data.niveau || '',
          capacite: res.data.capacite || '',
          description: res.data.description || ''
        });
      });
    }
  }, [id]);

  const handleChange = e => {
    setClasse({ ...classe, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (id) {
      updateClasse(id, classe)
        .then(() => {
          enqueueSnackbar('Classe modifiée avec succès !', { variant: 'success' });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de la modification.', { variant: 'error' }));
    } else {
      createClasse(classe)
        .then(() => {
          enqueueSnackbar('Classe ajoutée avec succès !', { variant: 'success' });
          // Réinitialise tous les champs après ajout réussi
          setClasse({
            nomClasse: '',
            niveau: '',
            capacite: '',
            description: ''
          });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de l\'ajout.', { variant: 'error' }));
    }
  };

  const niveaux = [
    // Niveaux de primaire
    { value: 'Ps(3ans)', label: 'Ps(3ans)', color: '#ff6b6b', category: 'Primaire' },
    { value: 'Ms', label: 'Ms', color: '#4ecdc4', category: 'Primaire' },
    { value: 'Gs', label: 'Gs', color: '#45b7d1', category: 'Primaire' },
    { value: '11ème', label: '11ème', color: '#96ceb4', category: 'Primaire' },
    { value: '10ème', label: '10ème', color: '#feca57', category: 'Primaire' },
    { value: '9ème', label: '9ème', color: '#ff9ff3', category: 'Primaire' },
    { value: '8ème', label: '8ème', color: '#54a0ff', category: 'Primaire' },
    { value: '7ème', label: '7ème', color: '#5f27cd', category: 'Primaire' },
    // Niveaux de collège
    { value: '6ème', label: '6ème', color: '#2196f3', category: 'Collège' },
    { value: '5ème', label: '5ème', color: '#4caf50', category: 'Collège' },
    { value: '4ème', label: '4ème', color: '#ff9800', category: 'Collège' },
    { value: '3ème', label: '3ème', color: '#f44336', category: 'Collège' },
    // Niveaux de lycée
    { value: '2nde', label: '2nde', color: '#9c27b0', category: 'Lycée' },
    { value: '1ère', label: '1ère', color: '#607d8b', category: 'Lycée' },
    { value: 'Terminale', label: 'Terminale', color: '#795548', category: 'Lycée' },
    // Niveaux universitaires
    { value: 'L1', label: 'L1', color: '#e91e63', category: 'Université' },
    { value: 'L2', label: 'L2', color: '#00bcd4', category: 'Université' },
    { value: 'L3', label: 'L3', color: '#8bc34a', category: 'Université' },
    { value: 'M1', label: 'M1', color: '#ff5722', category: 'Université' },
    { value: 'M2', label: 'M2', color: '#3f51b5', category: 'Université' }
  ];

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e', mb: 3 }}>
        {id ? <><EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Modifier une classe</> :
               <><AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Ajouter une nouvelle classe</>}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField 
              name="nomClasse" 
              label="Nom de la classe" 
              value={classe.nomClasse} 
              onChange={handleChange} 
              required 
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <ClassIcon sx={{ mr: 1, color: '#1a237e' }} />,
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
              name="niveau" 
              label="Niveau" 
              value={classe.niveau} 
              onChange={handleChange} 
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
              {niveaux.map((niveau) => (
                <MenuItem key={niveau.value} value={niveau.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Chip 
                      label={niveau.label} 
                      size="small" 
                      sx={{ 
                        backgroundColor: niveau.color, 
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                      }} 
                    />
                    <Typography variant="body2" sx={{ color: '#666', ml: 1 }}>
                      {niveau.category}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              name="capacite" 
              label="Capacité maximale" 
              type="number"
              value={classe.capacite} 
              onChange={handleChange} 
              fullWidth
              variant="outlined"
              inputProps={{ min: 1, max: 100 }}
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
              name="description" 
              label="Description (optionnel)" 
              value={classe.description} 
              onChange={handleChange} 
              fullWidth
              variant="outlined"
              multiline
              rows={1}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            />
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
              {id ? 'Modifier la classe' : 'Ajouter la classe'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default ClasseForm; 