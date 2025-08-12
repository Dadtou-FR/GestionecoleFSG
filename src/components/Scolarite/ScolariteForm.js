import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Typography, Paper, Grid, Chip, Autocomplete, Divider } from '@mui/material';
import { Edit as EditIcon, Payment as PaymentIcon, Person as PersonIcon, School as SchoolIcon, CalendarToday as CalendarIcon, AccountBalance as AccountIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { createScolarite, updateScolarite, getScolariteById } from '../../services/scolariteService';
import { getEleves } from '../../services/eleveService';

import { useSnackbar } from 'notistack';

function ScolariteForm({ id, onSuccess }) {
  const [scolarite, setScolarite] = useState({
    matriculeEleve: '',
    nomEleve: '',
    nomClasse: '',
    montantAnnuel: '',
    montantMensuel: '',
    mois: '',
    annee: new Date().getFullYear(),
    montantPaye: '',
    datePaiement: new Date().toISOString().split('T')[0],
    modePaiement: 'Espèces',
    statut: 'Payé',
    observation: ''
  });
  const [eleves, setEleves] = useState([]);

  const [selectedEleve, setSelectedEleve] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getEleves().then(res => setEleves(res.data));

    if (id) {
      getScolariteById(id).then(res => {
        setScolarite(res.data);
        const eleve = eleves.find(e => e.matricule === res.data.matriculeEleve);
        setSelectedEleve(eleve);
      });
    }
  }, [id, eleves]);

  const handleChange = e => {
    const { name, value } = e.target;
    setScolarite(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'montantAnnuel') {
        updated.montantMensuel = value ? (parseFloat(value) / 12).toFixed(2) : '';
      }
      return updated;
    });
  };

  const handleEleveChange = (event, newValue) => {
    setSelectedEleve(newValue);
    if (newValue) {
      setScolarite(prev => ({
        ...prev,
        matriculeEleve: newValue.matricule,
        nomEleve: `${newValue.nom} ${newValue.prenom}`,
        nomClasse: newValue.nomClasse || ''
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!selectedEleve) {
      enqueueSnackbar('Veuillez sélectionner un élève', { variant: 'warning' });
      return;
    }

    const paiementData = {
      ...scolarite,
      montantPaye: parseFloat(scolarite.montantPaye) || parseFloat(scolarite.montantMensuel),
      montantAnnuel: parseFloat(scolarite.montantAnnuel),
      montantMensuel: parseFloat(scolarite.montantMensuel)
    };

    if (id) {
      updateScolarite(id, paiementData)
        .then(() => {
          enqueueSnackbar('Paiement modifié avec succès !', { variant: 'success' });
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de la modification.', { variant: 'error' }));
    } else {
      createScolarite(paiementData)
        .then(() => {
          enqueueSnackbar('Paiement enregistré avec succès !', { variant: 'success' });
          // Réinitialise le formulaire après ajout
          setScolarite({
            matriculeEleve: '',
            nomEleve: '',
            nomClasse: '',
            montantAnnuel: '',
            montantMensuel: '',
            mois: '',
            annee: new Date().getFullYear(),
            montantPaye: '',
            datePaiement: new Date().toISOString().split('T')[0],
            modePaiement: 'Espèces',
            statut: 'Payé',
            observation: ''
          });
          setSelectedEleve(null);
          onSuccess();
        })
        .catch(() => enqueueSnackbar('Erreur lors de l\'enregistrement.', { variant: 'error' }));
    }
  };

  const mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const modesPaiement = ['Espèces', 'Chèque', 'Virement', 'Carte bancaire', 'Mobile Money'];
  const statuts = ['Payé', 'En attente', 'En retard', 'Annulé'];

  const getStatutColor = (statut) => {
    const colors = {
      'Payé': '#4caf50',
      'En attente': '#ff9800',
      'En retard': '#f44336',
      'Annulé': '#9e9e9e'
    };
    return colors[statut] || '#666';
  };

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {id ? <EditIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} /> : <PaymentIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          {id ? 'Modifier le Paiement' : 'Nouveau Paiement de Scolarité'}
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Sélection de l'élève */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={eleves}
              getOptionLabel={(option) => `${option.matricule} - ${option.nom} ${option.prenom} (${option.nomClasse})`}
              value={selectedEleve}
              onChange={handleEleveChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sélectionner l'élève"
                  required
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <PersonIcon sx={{ mr: 1, color: '#1a237e' }} />
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
                      label={option.matricule} 
                      size="small" 
                      sx={{ backgroundColor: '#1a237e', color: 'white', fontWeight: 'bold' }} 
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {option.nom} {option.prenom}
                    </Typography>
                    <Chip 
                      label={option.nomClasse} 
                      size="small" 
                      variant="outlined"
                      sx={{ borderColor: '#1a237e', color: '#1a237e' }} 
                    />
                  </Box>
                </Box>
              )}
            />
          </Grid>

          {/* Classe */}
          <Grid item xs={12} md={6}>
            <TextField
              name="nomClasse"
              label="Classe"
              value={scolarite.nomClasse}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <SchoolIcon sx={{ mr: 1, color: '#1a237e' }} />
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
            <Divider sx={{ my: 2 }}>
              <Chip label="Informations de paiement" sx={{ backgroundColor: '#1a237e', color: 'white' }} />
            </Divider>
          </Grid>

          {/* Montant annuel */}
          <Grid item xs={12} md={4}>
            <TextField
              name="montantAnnuel"
              label="Montant annuel (Ariary)"
              value={scolarite.montantAnnuel}
              onChange={handleChange}
              type="number"
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <ReceiptIcon sx={{ mr: 1, color: '#1a237e' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            />
          </Grid>

          {/* Montant mensuel (calculé automatiquement) */}
          <Grid item xs={12} md={4}>
            <TextField
              name="montantMensuel"
              label="Montant mensuel (Ariary)"
              value={scolarite.montantMensuel}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <AccountIcon sx={{ mr: 1, color: '#4caf50' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f0f8f0',
                  '& fieldset': { borderColor: '#4caf50' }
                }
              }}
            />
          </Grid>

          {/* Montant payé */}
          <Grid item xs={12} md={4}>
            <TextField
              name="montantPaye"
              label="Montant payé (Ariary)"
              value={scolarite.montantPaye}
              onChange={handleChange}
              type="number"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <PaymentIcon sx={{ mr: 1, color: '#4caf50' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            />
          </Grid>

          {/* Mois et année */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              name="mois"
              label="Mois"
              value={scolarite.mois}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: '#1a237e' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              {mois.map(mois => (
                <MenuItem key={mois} value={mois}>
                  <Chip 
                    label={mois} 
                    size="small" 
                    sx={{ backgroundColor: '#1a237e', color: 'white', fontWeight: 'bold' }} 
                  />
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="annee"
              label="Année"
              value={scolarite.annee}
              onChange={handleChange}
              type="number"
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: '#1a237e' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            />
          </Grid>

          {/* Mode de paiement et statut */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              name="modePaiement"
              label="Mode de paiement"
              value={scolarite.modePaiement}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <PaymentIcon sx={{ mr: 1, color: '#1a237e' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            >
              {modesPaiement.map(mode => (
                <MenuItem key={mode} value={mode}>
                  <Chip 
                    label={mode} 
                    size="small" 
                    sx={{ backgroundColor: '#1a237e', color: 'white', fontWeight: 'bold' }} 
                  />
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              name="statut"
              label="Statut"
              value={scolarite.statut}
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
              {statuts.map(statut => (
                <MenuItem key={statut} value={statut}>
                  <Chip 
                    label={statut} 
                    size="small" 
                    sx={{ 
                      backgroundColor: getStatutColor(statut), 
                      color: 'white', 
                      fontWeight: 'bold' 
                    }} 
                  />
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Date de paiement */}
          <Grid item xs={12} md={6}>
            <TextField
              name="datePaiement"
              label="Date de paiement"
              value={scolarite.datePaiement}
              onChange={handleChange}
              type="date"
              required
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: '#1a237e' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            />
          </Grid>

          {/* Observation */}
          <Grid item xs={12} md={6}>
            <TextField
              name="observation"
              label="Observation"
              value={scolarite.observation}
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

          {/* Bouton de soumission */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={id ? <EditIcon /> : <PaymentIcon />}
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
                {id ? 'Modifier le Paiement' : 'Enregistrer le Paiement'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default ScolariteForm; 