import React, { useEffect, useState } from 'react';
import { getClasses, deleteClasse } from '../../services/classeService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, TextField, Paper, Chip } from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, Class as ClassIcon, School as SchoolIcon, Group as GroupIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function ClasseList() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getClasses().then(res => setClasses(res.data));
  }, []);

  const handleDelete = id => setDeleteId(id);
  const confirmDelete = () => {
    deleteClasse(deleteId)
      .then(() => {
        setClasses(classes.filter(c => c.id !== deleteId));
        enqueueSnackbar('Classe supprimée avec succès !', { variant: 'success' });
        setDeleteId(null);
      })
      .catch(() => enqueueSnackbar('Erreur lors de la suppression.', { variant: 'error' }));
  };

  const filteredClasses = classes.filter(c =>
    (c.nomClasse || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.niveau || '').toLowerCase().includes(search.toLowerCase())
  );

  const getNiveauColor = (niveau) => {
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

  const columns = [
    { 
      field: 'nomClasse', 
      headerName: 'Nom de la classe', 
      width: 250,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ClassIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              {params.value || <i style={{color:'#888'}}>Nom manquant</i>}
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {params.value ? (
            <Chip 
              label={params.value} 
              size="small" 
              sx={{ 
                backgroundColor: getNiveauColor(params.value),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }} 
            />
          ) : (
            <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
              Non défini
            </Typography>
          )}
        </div>
      )
    },
    { 
      field: 'capacite', 
      headerName: 'Capacité', 
      width: 120,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon sx={{ color: '#666', fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {params.value || 'Non défini'}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
            {params.value ? 
              (params.value.length > 30 ? `${params.value.substring(0, 30)}...` : params.value) : 
              <i style={{color:'#888'}}>Aucune description</i>
            }
          </Typography>
        </div>
      )
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
        <SchoolIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Liste des Classes ({filteredClasses.length})
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher une classe..."
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
          rows={filteredClasses.map(c => ({ ...c, id: c.id }))}
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
            Voulez-vous vraiment supprimer cette classe ? Cette action est irréversible.
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

export default ClasseList; 