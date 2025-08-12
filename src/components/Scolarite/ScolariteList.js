import React, { useEffect, useState } from 'react';
import { getScolarites, deleteScolarite } from '../../services/scolariteService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, TextField, Paper, Chip, Avatar, CircularProgress, Alert, Grid, Card, CardContent, Divider } from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, Payment as PaymentIcon, School as SchoolIcon, CalendarToday as CalendarIcon, AccountBalance as AccountIcon, Receipt as ReceiptIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon, Cancel as CancelIcon, Refresh as RefreshIcon, Person as PersonIcon, TrendingUp as TrendingUpIcon, AttachMoney as MoneyIcon, Schedule as ScheduleIcon, Close as CloseIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function ScolariteList() {
  const [scolarites, setScolarites] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEleve, setSelectedEleve] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const loadScolarites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getScolarites();
      setScolarites(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des paiements:', err);
      setError('Erreur lors du chargement des paiements. Veuillez réessayer.');
      enqueueSnackbar('Erreur lors du chargement des paiements', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScolarites();
  }, []);

  const handleDelete = id => setDeleteId(id);
  const confirmDelete = async () => {
    try {
      await deleteScolarite(deleteId);
      setScolarites(scolarites.filter(s => s.id !== deleteId));
      enqueueSnackbar('Paiement supprimé avec succès !', { variant: 'success' });
      setDeleteId(null);
    } catch (err) {
      enqueueSnackbar('Erreur lors de la suppression.', { variant: 'error' });
    }
  };

  const handleRefresh = () => {
    loadScolarites();
  };

  const handleEleveClick = (eleveData) => {
    setSelectedEleve(eleveData);
  };

  const clearSelectedEleve = () => {
    setSelectedEleve(null);
  };

  const getEleveStats = (matriculeEleve) => {
    const elevePaiements = scolarites.filter(s => s.matriculeEleve === matriculeEleve);
    if (elevePaiements.length === 0) return null;

    const totalPaye = elevePaiements.reduce((sum, p) => sum + (parseFloat(p.montantPaye) || 0), 0);
    const totalAttendu = elevePaiements.reduce((sum, p) => sum + (parseFloat(p.montantAnnuel) || 0), 0);
    const paiementsPayes = elevePaiements.filter(p => p.statut === 'Payé').length;
    const paiementsEnRetard = elevePaiements.filter(p => p.statut === 'En retard').length;
    const paiementsEnAttente = elevePaiements.filter(p => p.statut === 'En attente').length;
    const dernierPaiement = elevePaiements.sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))[0];
    const moisPaiements = [...new Set(elevePaiements.map(p => p.mois))].sort();

    return {
      totalPaye,
      totalAttendu,
      paiementsPayes,
      paiementsEnRetard,
      paiementsEnAttente,
      totalPaiements: elevePaiements.length,
      dernierPaiement,
      moisPaiements,
      resteAPayer: totalAttendu - totalPaye,
      pourcentagePaye: totalAttendu > 0 ? ((totalPaye / totalAttendu) * 100).toFixed(1) : 0
    };
  };

  const filteredScolarites = scolarites.filter(scolarite =>
    (scolarite.nomEleve || '').toLowerCase().includes(search.toLowerCase()) ||
    (scolarite.matriculeEleve || '').toLowerCase().includes(search.toLowerCase()) ||
    (scolarite.nomClasse || '').toLowerCase().includes(search.toLowerCase()) ||
    (scolarite.mois || '').toLowerCase().includes(search.toLowerCase()) ||
    (scolarite.modePaiement || '').toLowerCase().includes(search.toLowerCase())
  );

  const getStatutColor = (statut) => {
    const colors = {
      'Payé': '#4caf50',
      'En attente': '#ff9800',
      'En retard': '#f44336',
      'Annulé': '#9e9e9e'
    };
    return colors[statut] || '#666';
  };

  const getStatutIcon = (statut) => {
    const icons = {
      'Payé': <CheckCircleIcon sx={{ color: '#4caf50' }} />,
      'En attente': <WarningIcon sx={{ color: '#ff9800' }} />,
      'En retard': <ErrorIcon sx={{ color: '#f44336' }} />,
      'Annulé': <CancelIcon sx={{ color: '#9e9e9e' }} />
    };
    return icons[statut] || <WarningIcon />;
  };

  const getInitials = (nom) => {
    return nom?.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || 'E';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const columns = [
    { 
      field: 'nomEleve', 
      headerName: 'Élève', 
      width: 250,
      renderCell: (params) => (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'flex-start', 
            alignItems: 'center', 
            width: '100%', 
            paddingLeft: '8px',
            cursor: 'pointer'
          }}
          onClick={() => handleEleveClick(params.row)}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            '&:hover': {
              backgroundColor: 'rgba(26, 35, 126, 0.1)',
              borderRadius: '8px',
              padding: '4px',
              transition: 'all 0.2s ease'
            }
          }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                fontSize: '0.8rem',
                backgroundColor: '#1a237e',
                color: 'white'
              }}
            >
              {getInitials(params.value)}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ 
                fontWeight: 'bold', 
                color: '#1a237e',
                textDecoration: 'underline',
                '&:hover': {
                  color: '#283593'
                }
              }}>
                {params.value || 'Élève inconnu'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {params.row?.matriculeEleve || 'Matricule manquant'}
              </Typography>
            </Box>
          </Box>
        </div>
      )
    },
    { 
      field: 'nomClasse', 
      headerName: 'Classe', 
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Chip 
              label={params.value || 'Classe manquante'} 
              size="small" 
              variant="outlined"
              sx={{ 
                fontSize: '0.8rem',
                borderColor: params.value ? '#1a237e' : '#ccc',
                color: params.value ? '#1a237e' : '#666'
              }} 
            />
          </Box>
        </div>
      )
    },
    { 
      field: 'montantAnnuel', 
      headerName: 'Montant Annuel', 
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              {formatCurrency(params.value)}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'montantMensuel', 
      headerName: 'Mensuel', 
      width: 130,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              {formatCurrency(params.value)}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'montantPaye', 
      headerName: 'Payé', 
      width: 130,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              {formatCurrency(params.value)}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'mois', 
      headerName: 'Mois', 
      width: 120,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Chip 
              label={params.value || 'Mois manquant'} 
              size="small" 
              sx={{ 
                fontSize: '0.8rem',
                backgroundColor: '#1a237e',
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          </Box>
        </div>
      )
    },
    { 
      field: 'annee', 
      headerName: 'Année', 
      width: 100,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            {params.value || 'N/A'}
          </Typography>
        </div>
      )
    },
    { 
      field: 'modePaiement', 
      headerName: 'Mode', 
      width: 140,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Chip 
            label={params.value || 'Mode manquant'} 
            size="small" 
            variant="outlined"
            sx={{ 
              fontSize: '0.8rem',
              borderColor: params.value ? '#1a237e' : '#ccc',
              color: params.value ? '#1a237e' : '#666'
            }} 
          />
        </div>
      )
    },
    { 
      field: 'statut', 
      headerName: 'Statut', 
      width: 130,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatutIcon(params.value)}
            <Chip 
              label={params.value || 'Statut manquant'} 
              size="small" 
              sx={{ 
                fontSize: '0.8rem',
                backgroundColor: getStatutColor(params.value),
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          </Box>
        </div>
      )
    },
    { 
      field: 'datePaiement', 
      headerName: 'Date Paiement', 
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ color: '#666' }}>
              {formatDate(params.value)}
            </Typography>
          </Box>
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => {
        if (!params || !params.row) return <div></div>;
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <IconButton 
              color="error" 
              onClick={() => handleDelete(params.row?.id)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
      sortable: false,
      filterable: false,
    },
  ];

  // Calcul des statistiques
  const totalPaye = scolarites.reduce((sum, s) => sum + (parseFloat(s.montantPaye) || 0), 0);
  const totalAttendu = scolarites.reduce((sum, s) => sum + (parseFloat(s.montantAnnuel) || 0), 0);
  const paiementsPayes = scolarites.filter(s => s.statut === 'Payé').length;
  const paiementsEnRetard = scolarites.filter(s => s.statut === 'En retard').length;

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PaymentIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Liste des Paiements de Scolarité ({filteredScolarites.length})
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            borderColor: '#1a237e',
            color: '#1a237e',
            '&:hover': {
              borderColor: '#283593',
              backgroundColor: 'rgba(26, 35, 126, 0.1)'
            }
          }}
        >
          {loading ? 'Chargement...' : 'Actualiser'}
        </Button>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Affichage du chargement */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress size={60} sx={{ color: '#1a237e' }} />
        </Box>
      )}

      {/* Statistiques - affichage conditionnel selon l'élève sélectionné */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {selectedEleve ? (
          // Statistiques de l'élève sélectionné
          (() => {
            const stats = getEleveStats(selectedEleve.matriculeEleve);
            if (!stats) {
              return (
                <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic' }}>
                  Aucune donnée de paiement trouvée pour cet élève.
                </Typography>
              );
            }
            return (
              <>
                <Chip 
                  icon={<PaymentIcon />} 
                  label={`Total payé: ${formatCurrency(stats.totalPaye)}`} 
                  sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }} 
                />
                <Chip 
                  icon={<ReceiptIcon />} 
                  label={`Total attendu: ${formatCurrency(stats.totalAttendu)}`} 
                  sx={{ backgroundColor: '#1a237e', color: 'white', fontWeight: 'bold' }} 
                />
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label={`Paiements payés: ${stats.paiementsPayes}`} 
                  sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }} 
                />
                <Chip 
                  icon={<ErrorIcon />} 
                  label={`En retard: ${stats.paiementsEnRetard}`} 
                  sx={{ backgroundColor: '#f44336', color: 'white', fontWeight: 'bold' }} 
                />
                <Chip 
                  icon={<CloseIcon />} 
                  label="Fermer" 
                  onClick={clearSelectedEleve}
                  sx={{ backgroundColor: '#666', color: 'white', fontWeight: 'bold', cursor: 'pointer' }} 
                />
              </>
            );
          })()
        ) : (
          // Statistiques globales
          <>
            <Chip 
              icon={<PaymentIcon />} 
              label={`Total payé: ${formatCurrency(totalPaye)}`} 
              sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }} 
            />
            <Chip 
              icon={<ReceiptIcon />} 
              label={`Total attendu: ${formatCurrency(totalAttendu)}`} 
              sx={{ backgroundColor: '#1a237e', color: 'white', fontWeight: 'bold' }} 
            />
            <Chip 
              icon={<CheckCircleIcon />} 
              label={`Paiements payés: ${paiementsPayes}`} 
              sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }} 
            />
            <Chip 
              icon={<ErrorIcon />} 
              label={`En retard: ${paiementsEnRetard}`} 
              sx={{ backgroundColor: '#f44336', color: 'white', fontWeight: 'bold' }} 
            />
          </>
        )}
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un paiement..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: '#666' }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#1a237e' },
              '&.Mui-focused fieldset': { borderColor: '#1a237e' }
            }
          }}
        />
      </Box>

      {!loading && (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid 
            rows={filteredScolarites.map(s => ({ ...s, id: s.id }))} 
            columns={columns} 
            pageSize={8} 
            rowsPerPageOptions={[8, 16, 32]} 
            components={{ Toolbar: GridToolbar }} 
            disableSelectionOnClick 
            autoHeight
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #e0e0e0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #1a237e',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: '#ffffff',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '2px solid #1a237e',
                backgroundColor: '#f5f5f5',
              },
            }}
          />
        </Box>
      )}

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          ⚠️ Confirmation de suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer ce paiement ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

             
    </Paper>
  );
}

export default ScolariteList; 