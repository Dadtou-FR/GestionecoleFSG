import React, { useEffect, useState } from 'react';
import { getEmploisDuTemps, deleteEmploiDuTemps } from '../../services/emploiDuTempsService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, TextField, Paper, Chip, Avatar } from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, Schedule as ScheduleIcon, Today as TodayIcon, AccessTime as AccessTimeIcon, Room as RoomIcon, School as SchoolIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function EmploiDuTempsList() {
  const [emploisDuTemps, setEmploisDuTemps] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getEmploisDuTemps().then(res => setEmploisDuTemps(res.data));
  }, []);

  const handleDelete = id => setDeleteId(id);
  const confirmDelete = () => {
    deleteEmploiDuTemps(deleteId)
      .then(() => {
        setEmploisDuTemps(emploisDuTemps.filter(edt => edt.id !== deleteId));
        enqueueSnackbar('Emploi du temps supprimé avec succès !', { variant: 'success' });
        setDeleteId(null);
      })
      .catch(() => enqueueSnackbar('Erreur lors de la suppression.', { variant: 'error' }));
  };

  const filteredEmploisDuTemps = emploisDuTemps.filter(edt =>
    (edt.jour || '').toLowerCase().includes(search.toLowerCase()) ||
    (edt.nomCours || '').toLowerCase().includes(search.toLowerCase()) ||
    (edt.niveau || '').toLowerCase().includes(search.toLowerCase()) ||
    (edt.nomClasse || '').toLowerCase().includes(search.toLowerCase())
  );

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

  const getInitials = (nom) => {
    return nom?.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || 'E';
  };

  const formatTime = (time) => {
    if (!time) return 'Non définie';
    return time.length === 5 ? time : `${time}:00`;
  };

  const columns = [
    { 
      field: 'jour', 
      headerName: 'Jour', 
      width: 140,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TodayIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Chip 
              label={params.value || 'Jour manquant'} 
              size="small" 
              sx={{ 
                fontSize: '0.8rem',
                borderColor: params.value ? '#1a237e' : '#ccc',
                color: params.value ? '#1a237e' : '#666',
                backgroundColor: getJourColor(params.value),
                fontWeight: 'bold'
              }} 
            />
          </Box>
        </div>
      )
    },
    { 
      field: 'heureDebut', 
      headerName: 'Début', 
      width: 120,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
            <Chip 
              label={formatTime(params.value)} 
              size="small" 
              sx={{ 
                backgroundColor: '#4caf50', 
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
      field: 'heureFin', 
      headerName: 'Fin', 
      width: 120,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ color: '#f44336', fontSize: '1.2rem' }} />
            <Chip 
              label={formatTime(params.value)} 
              size="small" 
              sx={{ 
                backgroundColor: '#f44336', 
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
      field: 'nomCours', 
      headerName: 'Cours', 
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ 
                width: 28, 
                height: 28, 
                fontSize: '0.7rem',
                backgroundColor: '#1a237e',
                color: 'white'
              }}
            >
              {getInitials(params.value)}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              {params.value || 'Cours manquant'}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'niveau', 
      headerName: 'Niveau', 
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RoomIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Chip 
              label={params.value || 'Niveau manquant'} 
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
                color: params.value ? '#1a237e' : '#666',
                backgroundColor: getJourColor(params.value)
              }} 
            />
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

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ScheduleIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Liste des Emplois du Temps ({filteredEmploisDuTemps.length})
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un emploi du temps..."
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
          rows={filteredEmploisDuTemps.map(edt => ({ ...edt, id: edt.id }))} 
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

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          ⚠️ Confirmation de suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer cet emploi du temps ? Cette action est irréversible.
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

export default EmploiDuTempsList; 