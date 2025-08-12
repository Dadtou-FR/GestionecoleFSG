import React, { useEffect, useState } from 'react';
import { getEleves, deleteEleve, createEleve } from '../../services/eleveService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, TextField, Paper, Chip, Avatar } from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, Group as GroupIcon, Wc as WcIcon, CalendarToday as CalendarIcon, LocationOn as LocationIcon, Phone as PhoneIcon, School as SchoolIcon, Upload as UploadIcon } from '@mui/icons-material';
import Papa from 'papaparse';
import { useSnackbar } from 'notistack';

function EleveList({ onImport }) {
  const [eleves, setEleves] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getEleves().then(res => setEleves(res.data));
  }, []);

  const handleDelete = id => setDeleteId(id);
  const confirmDelete = () => {
    deleteEleve(deleteId)
      .then(() => {
        setEleves(eleves.filter(e => e.id !== deleteId));
        enqueueSnackbar('Élève supprimé avec succès !', { variant: 'success' });
        setDeleteId(null);
      })
      .catch(() => enqueueSnackbar('Erreur lors de la suppression.', { variant: 'error' }));
  };

  const handleImportMass = data => {
    Promise.all(data.map(eleve => createEleve(eleve)))
      .then(() => {
        enqueueSnackbar('Import CSV terminé !', { variant: 'success' });
        getEleves().then(res => setEleves(res.data));
      })
      .catch(() => enqueueSnackbar('Erreur lors de l\'import.', { variant: 'error' }));
  };

  const filteredEleves = eleves.filter(e =>
    Object.values(e).some(val => val && val.toString().toLowerCase().includes(search.toLowerCase()))
  );

  const getSexeColor = (sexe) => {
    return sexe === 'M' ? '#2196f3' : '#e91e63';
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

  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };

  const columns = [
    { 
      field: 'matricule', 
      headerName: 'Matricule', 
      width: 120,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Chip 
            label={params.value} 
            size="small" 
            variant="outlined"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '0.8rem',
              borderColor: '#1a237e',
              color: '#1a237e'
            }} 
          />
        </div>
      )
    },
    { 
      field: 'nomComplet', 
      headerName: 'Élève', 
      width: 200,
      valueGetter: (params) => {
        if (!params || !params.row) return 'Élève inconnu';
        return `${params.row.prenom || ''} ${params.row.nom || ''}`;
      },
              renderCell: (params) => {
          if (!params || !params.row) return <div>Élève inconnu</div>;
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    fontSize: '0.8rem',
                    backgroundColor: getSexeColor(params.row.sexe || 'M'),
                    color: 'white'
                  }}
                >
                  {getInitials(params.row.prenom || '', params.row.nom || '')}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    {params.row.prenom || ''} {params.row.nom || ''}
                  </Typography>
                </Box>
              </Box>
            </div>
          );
        }
    },
    { 
      field: 'sexe', 
      headerName: 'Sexe', 
      width: 100,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WcIcon sx={{ color: getSexeColor(params.value), fontSize: '1.2rem' }} />
            <Chip 
              label={params.value === 'M' ? 'M' : 'F'} 
              size="small" 
              sx={{ 
                backgroundColor: getSexeColor(params.value),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }} 
            />
          </Box>
        </div>
      )
    },
    { 
      field: 'dateNaissance', 
      headerName: 'Date de naissance', 
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ color: '#666', fontSize: '1rem' }} />
            <Typography variant="body2">
              {params.value ? new Date(params.value).toLocaleDateString('fr-FR') : 'Non défini'}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'villeNaissance', 
      headerName: 'Ville de naissance', 
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon sx={{ color: '#666', fontSize: '1rem' }} />
            <Typography variant="body2">
              {params.value || 'Non défini'}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'telephone', 
      headerName: 'Téléphone', 
      width: 130,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon sx={{ color: '#666', fontSize: '1rem' }} />
            <Typography variant="body2">
              {params.value || 'Non défini'}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'niveau', 
      headerName: 'Niveau', 
      width: 150,
      renderCell: (params) => {
        const niveauValue = params.row?.niveau || 'Non assigné';
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
              <Chip 
                label={niveauValue} 
                size="small" 
                sx={{ 
                  backgroundColor: getNiveauColor(niveauValue),
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }} 
              />
            </Box>
          </div>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
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
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <GroupIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Liste des Élèves ({filteredEleves.length})
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un élève..."
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

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredEleves.map(e => ({ ...e, id: e.id }))}
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

      {onImport && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            component="label" 
            sx={{
              borderColor: '#1a237e',
              color: '#1a237e',
              '&:hover': {
                borderColor: '#283593',
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
              }
            }}
            startIcon={<UploadIcon />}
          >
            Importer CSV (en masse)
            <input 
              type="file" 
              accept=".csv" 
              hidden 
              onChange={e => { 
                if (e.target.files[0]) { 
                  Papa.parse(e.target.files[0], { 
                    header: true, 
                    skipEmptyLines: true, 
                    complete: results => handleImportMass(results.data), 
                    error: () => enqueueSnackbar('Erreur lors de l\'import CSV.', { variant: 'error' }) 
                  }); 
                } 
              }} 
            />
          </Button>
        </Box>
      )}

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          ⚠️ Confirmation de suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer cet élève ? Cette action est irréversible.
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

export default EleveList; 