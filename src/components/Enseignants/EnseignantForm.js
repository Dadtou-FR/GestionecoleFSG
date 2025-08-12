import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Paper, Typography, Grid, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Book as BookIcon } from '@mui/icons-material';
import { createEnseignant, updateEnseignant, getEnseignant } from '../../services/enseignantService';
import { getCours } from '../../services/coursService';
import { useSnackbar } from 'notistack';

function EnseignantForm({ id, onSuccess }) {
  const [enseignant, setEnseignant] = useState({
    nomEnseignant: '',
    prenomEnseignant: '',
    specialite: '',
    telephone: '',
    email: ''
  });
  const [cours, setCours] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getCours().then(res => setCours(res.data));
    if (id) {
      getEnseignant(id).then(res => {
        setEnseignant({
          nomEnseignant: res.data.nomEnseignant || '',
          prenomEnseignant: res.data.prenomEnseignant || '',
          specialite: res.data.specialite || '',
          telephone: res.data.telephone || '',
          email: res.data.email || ''
        });
      });
    }
  }, [id]);

  const handleChange = e => {
    setEnseignant({ ...enseignant, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (id) {
      updateEnseignant(id, enseignant)
        .then(() => {
          enqueueSnackbar('Enseignant modifié avec succès !', { variant: 'success' });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de la modification.', { variant: 'error' }));
    } else {
      createEnseignant(enseignant)
        .then(() => {
          enqueueSnackbar('Enseignant ajouté avec succès !', { variant: 'success' });
          // Réinitialise tous les champs après ajout réussi
          setEnseignant({
            nomEnseignant: '',
            prenomEnseignant: '',
            specialite: '',
            telephone: '',
            email: ''
          });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de l\'ajout.', { variant: 'error' }));
    }
  };

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {id ? <EditIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} /> : <AddIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          {id ? 'Modifier l\'Enseignant' : 'Ajouter un Enseignant'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              name="nomEnseignant"
              label="Nom de l'enseignant"
              value={enseignant.nomEnseignant}
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
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="prenomEnseignant"
              label="Prénom de l'enseignant"
              value={enseignant.prenomEnseignant}
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
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              name="specialite"
              label="Spécialité"
              value={enseignant.specialite}
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
                <MenuItem key={cour.id} value={`${cour.nomCours} - ${cour.niveau}`}>
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
              name="telephone"
              label="Téléphone"
              value={enseignant.telephone}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: '#1a237e' }} />,
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
            <TextField
              name="email"
              label="Email"
              type="email"
              value={enseignant.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: '#1a237e' }} />,
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
                {id ? 'Modifier l\'Enseignant' : 'Ajouter l\'Enseignant'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default EnseignantForm; 