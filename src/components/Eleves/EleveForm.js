import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Typography, Paper, Grid, Chip, Divider } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Person as PersonIcon, School as SchoolIcon, CalendarToday as CalendarIcon, Phone as PhoneIcon, LocationOn as LocationIcon, Wc as WcIcon, Upload as UploadIcon } from '@mui/icons-material';
import { createEleve, updateEleve, getEleve } from '../../services/eleveService';
import { getClasses } from '../../services/classeService';
import { useSnackbar } from 'notistack';
import Papa from 'papaparse';

function EleveForm({ id, onSuccess, onImport }) {
  const [eleve, setEleve] = useState({
    matricule: '',
    prenom: '',
    nom: '',
    sexe: '',
    dateNaissance: '',
    villeNaissance: '',
    telephone: '',
    niveau: '',
  });
  const [classes, setClasses] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getClasses().then(res => setClasses(res.data));
    if (id) {
      getEleve(id).then(res => {
        setEleve({
          matricule: res.data.matricule || '',
          prenom: res.data.prenom || '',
          nom: res.data.nom || '',
          sexe: res.data.sexe || '',
          dateNaissance: res.data.dateNaissance || '',
          villeNaissance: res.data.villeNaissance || '',
          telephone: res.data.telephone || '',
          niveau: res.data.niveau || res.data.nomClasse || '',
        });
      });
    }
  }, [id]);

  const handleChange = e => {
    setEleve({ ...eleve, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (id) {
      updateEleve(id, eleve)
        .then(() => {
          enqueueSnackbar('Élève modifié avec succès !', { variant: 'success' });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de la modification.', { variant: 'error' }));
    } else {
      createEleve(eleve)
        .then(() => {
          enqueueSnackbar('Élève ajouté avec succès !', { variant: 'success' });
          // Réinitialise tous les champs après ajout réussi
          setEleve({
            matricule: '',
            prenom: '',
            nom: '',
            sexe: '',
            dateNaissance: '',
            villeNaissance: '',
            telephone: '',
            niveau: '',
          });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de l\'ajout.', { variant: 'error' }));
    }
  };

  const getNiveauColor = (niveau) => {
    if (!niveau || niveau === 'Non assigné') return '#999';
    const colors = {
      // Niveaux de primaire
      'Ps(3ans)': '#ff6b6b', 'Ms': '#4ecdc4', 'Gs': '#45b7d1',
      '11ème': '#96ceb4', '10ème': '#feca57', '9ème': '#ff9ff3', '8ème': '#54a0ff', '7ème': '#5f27cd',
      // Niveaux de collège
      '6ème': '#2196f3', '5ème': '#4caf50', '4ème': '#ff9800', '3ème': '#f44336',
      // Niveaux de lycée
      '2nde': '#9c27b0', '1ère': '#607d8b', 'Terminale': '#795548',
      // Niveaux universitaires
      'L1': '#e91e63', 'L2': '#00bcd4', 'L3': '#8bc34a', 'M1': '#ff5722', 'M2': '#3f51b5'
    };
    return colors[niveau] || '#666';
  };

  const getNiveauCategory = (niveau) => {
    if (!niveau || niveau === 'Non assigné') return 'Non défini';
    const categories = {
      // Niveaux de primaire
      'Ps(3ans)': 'Primaire', 'Ms': 'Primaire', 'Gs': 'Primaire',
      '11ème': 'Primaire', '10ème': 'Primaire', '9ème': 'Primaire', '8ème': 'Primaire', '7ème': 'Primaire',
      // Niveaux de collège
      '6ème': 'Collège', '5ème': 'Collège', '4ème': 'Collège', '3ème': 'Collège',
      // Niveaux de lycée
      '2nde': 'Lycée', '1ère': 'Lycée', 'Terminale': 'Lycée',
      // Niveaux universitaires
      'L1': 'Université', 'L2': 'Université', 'L3': 'Université', 'M1': 'Université', 'M2': 'Université'
    };
    return categories[niveau] || 'Autre';
  };

  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        if (onImport) onImport(results.data);
        enqueueSnackbar('Import CSV terminé !', { variant: 'success' });
      },
      error: function() {
        enqueueSnackbar('Erreur lors de l\'import CSV.', { variant: 'error' });
      }
    });
  };

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e', mb: 3 }}>
        {id ? <><EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Modifier un élève</> :
               <><AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Ajouter un nouvel élève</>}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Informations personnelles */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon /> Informations personnelles
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField 
              name="matricule" 
              label="Matricule" 
              value={eleve.matricule} 
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
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField 
              name="prenom" 
              label="Prénom" 
              value={eleve.prenom} 
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
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField 
              name="nom" 
              label="Nom" 
              value={eleve.nom} 
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
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              select
              name="sexe"
              label="Sexe"
              value={eleve.sexe}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <WcIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              <MenuItem value="M">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label="M" size="small" sx={{ backgroundColor: '#2196f3', color: 'white', fontWeight: 'bold' }} />
                  <Typography>Masculin</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="F">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label="F" size="small" sx={{ backgroundColor: '#e91e63', color: 'white', fontWeight: 'bold' }} />
                  <Typography>Féminin</Typography>
                </Box>
              </MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              name="dateNaissance" 
              label="Date de naissance" 
              value={eleve.dateNaissance} 
              onChange={handleChange} 
              type="date" 
              InputLabelProps={{ shrink: true }}
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
              name="villeNaissance" 
              label="Ville de naissance" 
              value={eleve.villeNaissance} 
              onChange={handleChange} 
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: '#1a237e' }} />,
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
              name="telephone" 
              label="Téléphone" 
              value={eleve.telephone} 
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
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon /> Informations académiques
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <TextField
              select
              name="niveau"
              label="Niveau"
              value={eleve.niveau}
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
                <MenuItem key={classe.id} value={classe.niveau}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={classe.niveau || 'N/A'} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getNiveauColor(classe.niveau),
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {getNiveauCategory(classe.niveau)}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                borderColor: '#1a237e',
                color: '#1a237e',
                py: 1.5,
                '&:hover': {
                  borderColor: '#283593',
                  backgroundColor: 'rgba(26, 35, 126, 0.1)',
                }
              }}
              startIcon={<UploadIcon />}
            >
              Importer CSV
              <input type="file" accept=".csv" hidden onChange={handleImport} />
            </Button>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
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
              {id ? 'Modifier l\'élève' : 'Ajouter l\'élève'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default EleveForm; 