import React, { useEffect, useState } from 'react';
import { getEnseignants, deleteEnseignant } from '../../services/enseignantService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, TextField, Paper, Chip, Avatar } from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, School as SchoolIcon, Email as EmailIcon, Phone as PhoneIcon, Book as BookIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function EnseignantList() {
  const [enseignants, setEnseignants] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getEnseignants().then(res => setEnseignants(res.data));
  }, []);

  const handleDelete = id => setDeleteId(id);
  const confirmDelete = () => {
    deleteEnseignant(deleteId)
      .then(() => {
        setEnseignants(enseignants.filter(e => e.id !== deleteId));
        enqueueSnackbar('Enseignant supprimé avec succès !', { variant: 'success' });
        setDeleteId(null);
      })
      .catch(() => enqueueSnackbar('Erreur lors de la suppression.', { variant: 'error' }));
  };

  const filteredEnseignants = enseignants.filter(e =>
    (e.nomEnseignant || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.prenomEnseignant || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.specialite || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.telephone || '').toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };

  const columns = [
    { 
      field: 'enseignant', 
      headerName: 'Enseignant', 
      width: 250,
      valueGetter: (params) => {
        if (!params || !params.row) return 'Enseignant inconnu';
        return `${params.row.prenomEnseignant || ''} ${params.row.nomEnseignant || ''}`;
      },
      renderCell: (params) => {
        if (!params || !params.row) return <div>Enseignant inconnu</div>;
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  fontSize: '0.8rem',
                  backgroundColor: '#1a237e',
                  color: 'white'
                }}
              >
                {getInitials(params.row.prenomEnseignant, params.row.nomEnseignant)}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                  {params.row.prenomEnseignant || ''} {params.row.nomEnseignant || ''}
                </Typography>
              </Box>
            </Box>
          </div>
        );
      }
    },
    { 
      field: 'specialite', 
      headerName: 'Spécialité', 
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Chip 
              label={params.value || 'Non définie'} 
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
      field: 'telephone', 
      headerName: 'Téléphone', 
      width: 150,
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
      field: 'email', 
      headerName: 'Email', 
      width: 220,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ color: '#666', fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ 
              color: params.value ? '#1a237e' : '#666',
              textDecoration: params.value ? 'underline' : 'none',
              cursor: params.value ? 'pointer' : 'default'
            }}>
              {params.value || 'Non défini'}
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

  return (
    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SchoolIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Liste des Enseignants ({filteredEnseignants.length})
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un enseignant..."
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
          rows={filteredEnseignants.map(e => ({ ...e, id: e.id }))}
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
            Voulez-vous vraiment supprimer cet enseignant ? Cette action est irréversible.
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

export default EnseignantList; 