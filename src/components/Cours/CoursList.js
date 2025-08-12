import React, { useEffect, useState } from 'react';
import { getCours, deleteCours } from '../../services/coursService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, TextField, Paper, Chip, Avatar } from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, Book as BookIcon, Schedule as ScheduleIcon, School as SchoolIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function CoursList() {
  const [cours, setCours] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getCours().then(res => setCours(res.data));
  }, []);

  const handleDelete = id => setDeleteId(id);
  const confirmDelete = () => {
    deleteCours(deleteId)
      .then(() => {
        setCours(cours.filter(c => c.id !== deleteId));
        enqueueSnackbar('Cours supprimé avec succès !', { variant: 'success' });
        setDeleteId(null);
      })
      .catch(() => enqueueSnackbar('Erreur lors de la suppression.', { variant: 'error' }));
  };

  const filteredCours = cours.filter(c =>
    (c.nomCours || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.classe || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.duree && c.duree.toString().includes(search))
  );

  const getInitials = (nom) => {
    return nom?.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || 'C';
  };

  const getClasseColor = (classe) => {
    const colors = {
      '6ème': '#e3f2fd',
      '5ème': '#f3e5f5',
      '4ème': '#e8f5e8',
      '3ème': '#fff3e0',
      '2nde': '#fce4ec',
      '1ère': '#f1f8e9',
      'Terminale': '#e0f2f1'
    };
    return colors[classe] || '#f5f5f5';
  };

  const columns = [
    { 
      field: 'nomCours', 
      headerName: 'Cours', 
      width: 250,
             renderCell: (params) => {
         if (!params || !params.row) return <div>Cours inconnu</div>;
         return (
           <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
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
                 {getInitials(params.value)}
               </Avatar>
               <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                 <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                   {params.value || 'Nom manquant'}
                 </Typography>
               </Box>
             </Box>
           </div>
         );
       }
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 300,
             renderCell: (params) => (
         <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <DescriptionIcon sx={{ color: '#666', fontSize: '1rem' }} />
             <Typography variant="body2" sx={{ 
               maxWidth: 250,
               overflow: 'hidden',
               textOverflow: 'ellipsis',
               whiteSpace: 'nowrap'
             }}>
               {params.value || 'Aucune description'}
             </Typography>
           </Box>
         </div>
       )
    },
    { 
      field: 'duree', 
      headerName: 'Durée', 
      width: 120,
      type: 'number',
             renderCell: (params) => (
         <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <ScheduleIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
             <Chip 
               label={`${params.value || 0}h`} 
               size="small" 
               sx={{ 
                 backgroundColor: '#1a237e', 
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
      field: 'classe', 
      headerName: 'Classe', 
      width: 150,
             renderCell: (params) => (
         <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <SchoolIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
             <Chip 
               label={params.value || 'Non défini'} 
               size="small" 
               variant="outlined"
               sx={{ 
                 fontSize: '0.8rem',
                 borderColor: params.value ? '#1a237e' : '#ccc',
                 color: params.value ? '#1a237e' : '#666',
                 backgroundColor: getClasseColor(params.value)
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
        <BookIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Liste des Cours ({filteredCours.length})
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un cours..."
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
          rows={filteredCours.map(c => ({ ...c, id: c.id }))}
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
            Voulez-vous vraiment supprimer ce cours ? Cette action est irréversible.
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

export default CoursList; 