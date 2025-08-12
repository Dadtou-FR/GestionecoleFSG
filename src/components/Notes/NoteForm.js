import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Autocomplete, Paper, Typography, Grid, Chip, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Grade as GradeIcon, Person as PersonIcon, Book as BookIcon, CalendarToday as CalendarIcon, Assessment as AssessmentIcon, Comment as CommentIcon, School as SchoolIcon, Class as ClassIcon } from '@mui/icons-material';
import { createNote, updateNote, getNoteById } from '../../services/noteService';
import { getEleves } from '../../services/eleveService';
import { getCoursByClasse } from '../../services/coursService';
import { getClasses } from '../../services/classeService';
import { useSnackbar } from 'notistack';

function NoteForm({ id, onSuccess }) {
  const [note, setNote] = useState({
    matriculeEleve: '',
    nomCours: '',
    classe: '',
    valeur: '',
    typeEvaluation: '',
    dateEvaluation: '',
    observation: ''
  });
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredCours, setFilteredCours] = useState([]);
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [loadingCours, setLoadingCours] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getEleves().then(res => setEleves(res.data));
    getClasses().then(res => setClasses(res.data));
    if (id) {
      getNoteById(id).then(res => {
        setNote({
          matriculeEleve: res.data.matriculeEleve || '',
          nomCours: res.data.nomCours || '',
          classe: res.data.classe || '', // Ajout de la classe
          valeur: res.data.valeur || '',
          typeEvaluation: res.data.typeEvaluation || '',
          dateEvaluation: res.data.dateEvaluation || '',
          observation: res.data.observation || ''
        });
        // Trouver l'élève correspondant
        const eleve = eleves.find(e => e.matricule === res.data.matriculeEleve);
        if (eleve) {
          setSelectedEleve(eleve);
        }
      });
    }
  }, [id]);

  const loadCoursForClasse = async (classe) => {
    if (!classe) return;
    
    setLoadingCours(true);
    try {
      const response = await getCoursByClasse(classe);
      setFilteredCours(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      enqueueSnackbar('Erreur lors du chargement des cours', { variant: 'error' });
      setFilteredCours([]);
    } finally {
      setLoadingCours(false);
    }
  };

  const handleChange = e => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleEleveChange = (event, newValue) => {
    setSelectedEleve(newValue);
    setNote({ 
      ...note, 
      matriculeEleve: newValue ? newValue.matricule : '',
      nomCours: '' // Réinitialiser le cours quand l'élève change
    });
    // Réinitialiser la classe sélectionnée quand l'élève change
    setSelectedClasse(null);
    setFilteredCours([]);
  };

  const handleClasseChange = async (event, newValue) => {
    setSelectedClasse(newValue);
    setNote({ 
      ...note, 
      classe: newValue ? newValue.nomClasse : '',
      nomCours: '' // Réinitialiser le cours quand la classe change
    });
    
    // Charger les cours pour la classe sélectionnée
    if (newValue && newValue.nomClasse) {
      await loadCoursForClasse(newValue.nomClasse);
    } else {
      setFilteredCours([]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (id) {
      updateNote(id, note)
        .then(() => {
          enqueueSnackbar('Note modifiée avec succès !', { variant: 'success' });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de la modification.', { variant: 'error' }));
    } else {
      createNote(note)
        .then(() => {
          enqueueSnackbar('Note ajoutée avec succès !', { variant: 'success' });
          // Réinitialise tous les champs après ajout réussi
          setNote({
            matriculeEleve: '',
            nomCours: '',
            classe: '', // Réinitialiser la classe
            valeur: '',
            typeEvaluation: '',
            dateEvaluation: '',
            observation: ''
          });
          setSelectedEleve(null);
          setSelectedClasse(null);
          setFilteredCours([]);
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de l\'ajout.', { variant: 'error' }));
    }
  };

  const getNoteColor = (note) => {
    if (note >= 16) return '#4caf50';
    if (note >= 14) return '#8bc34a';
    if (note >= 12) return '#ff9800';
    if (note >= 10) return '#ff5722';
    return '#f44336';
  };

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {id ? <EditIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} /> : <AddIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          {id ? 'Modifier la Note' : 'Ajouter une Note'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Sélection de l'élève */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={eleves}
              getOptionLabel={(option) => `${option.matricule} - ${option.nom} ${option.prenom}`}
              value={selectedEleve}
              onChange={handleEleveChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Élève (Matricule)"
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <PersonIcon sx={{ mr: 1, color: '#1a237e' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#1a237e' },
                      '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                    }
                  }}
                />
              )}
              filterOptions={(options, { inputValue }) => {
                const searchTerm = inputValue.toLowerCase();
                return options.filter(option => 
                  option.matricule.toLowerCase().includes(searchTerm) ||
                  option.nom.toLowerCase().includes(searchTerm) ||
                  option.prenom.toLowerCase().includes(searchTerm)
                );
              }}
              isOptionEqualToValue={(option, value) => option.matricule === value.matricule}
            />
          </Grid>

          {/* Sélection de la classe */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={classes}
              getOptionLabel={(option) => option.nomClasse}
              value={selectedClasse}
              onChange={handleClasseChange}
              disabled={!selectedEleve}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Classe"
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <ClassIcon sx={{ mr: 1, color: '#1a237e' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#1a237e' },
                      '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={option.nomClasse} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#1a237e', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        fontSize: '0.75rem' 
                      }} 
                    />
                    {option.niveau && (
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Niveau: {option.niveau}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/* Informations de l'élève sélectionné */}
          {selectedEleve && (
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                border: '2px solid #4caf50',
                mb: 2
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#2e7d32', mb: 2, fontWeight: 'bold' }}>
                    📋 Informations de l'élève sélectionné
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon sx={{ color: '#2e7d32' }} />
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Niveau : <Chip label={selectedEleve.niveau} color="success" size="small" />
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: '#2e7d32' }} />
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Élève : {selectedEleve.nom} {selectedEleve.prenom}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Cours disponibles pour la classe sélectionnée */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              name="nomCours"
              label="Cours disponibles"
              value={note.nomCours}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              disabled={!selectedClasse}
              InputProps={{
                startAdornment: loadingCours ? 
                  <CircularProgress size={20} sx={{ mr: 1, color: '#1a237e' }} /> : 
                  <BookIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              {filteredCours.map(cour => (
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
                      {cour.classe} - {cour.duree}h
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            {selectedClasse && !loadingCours && filteredCours.length === 0 && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Aucun cours disponible pour la classe {selectedClasse.nomClasse}
              </Alert>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="valeur"
              label="Note (/20)"
              type="number"
              value={note.valeur}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              inputProps={{ min: 0, max: 20, step: 0.5 }}
              InputProps={{
                startAdornment: <GradeIcon sx={{ mr: 1, color: getNoteColor(note.valeur) }} />,
              }}
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
              select
              name="typeEvaluation"
              label="Type d'évaluation"
              value={note.typeEvaluation}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <AssessmentIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              <MenuItem value="Contrôle">Contrôle</MenuItem>
              <MenuItem value="Examen">Examen</MenuItem>
              <MenuItem value="TP">TP</MenuItem>
              <MenuItem value="Devoir">Devoir</MenuItem>
              <MenuItem value="Oral">Oral</MenuItem>
              <MenuItem value="Autre">Autre</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="dateEvaluation"
              label="Date d'évaluation"
              type="date"
              value={note.dateEvaluation}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
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

          <Grid item xs={12}>
            <TextField
              select
              name="observation"
              label="Observation"
              value={note.observation}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <CommentIcon sx={{ mr: 1, color: '#1a237e' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              <MenuItem value="">Aucune observation</MenuItem>
              <MenuItem value="Excellent travail">Excellent travail</MenuItem>
              <MenuItem value="Bon travail">Bon travail</MenuItem>
              <MenuItem value="Travail satisfaisant">Travail satisfaisant</MenuItem>
              <MenuItem value="Travail à améliorer">Travail à améliorer</MenuItem>
              <MenuItem value="Absence justifiée">Absence justifiée</MenuItem>
              <MenuItem value="Absence non justifiée">Absence non justifiée</MenuItem>
              <MenuItem value="Retard">Retard</MenuItem>
              <MenuItem value="Copie">Copie</MenuItem>
              <MenuItem value="Tricherie">Tricherie</MenuItem>
              <MenuItem value="Participation active">Participation active</MenuItem>
              <MenuItem value="Manque de participation">Manque de participation</MenuItem>
              <MenuItem value="Autre">Autre</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={id ? <EditIcon /> : <AddIcon />}
                disabled={!selectedEleve || !selectedClasse}
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
                  '&:disabled': {
                    background: '#ccc',
                    transform: 'none',
                    boxShadow: 'none'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {id ? 'Modifier la Note' : 'Ajouter la Note'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default NoteForm; 