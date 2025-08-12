import React, { useEffect, useState } from 'react';
import { getEmargements, deleteEmargement } from '../../services/emargementService';
import { getEleves } from '../../services/eleveService';
import { getCours } from '../../services/coursService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, TextField, Paper } from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function EmargementList() {
  const [emargements, setEmargements] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [cours, setCours] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getEmargements().then(res => setEmargements(res.data));
    getEleves().then(res => setEleves(res.data));
    getCours().then(res => setCours(res.data));
  }, []);

  const handleDelete = (id) => setDeleteId(id);
  
  const confirmDelete = () => {
    deleteEmargement(deleteId)
      .then(() => {
        setEmargements(emargements.filter(e => e.id !== deleteId));
        enqueueSnackbar('Émargement supprimé avec succès !', { variant: 'success' });
        setDeleteId(null);
      })
      .catch(() => enqueueSnackbar('Erreur lors de la suppression.', { variant: 'error' }));
  };

  const getEleveNom = (id) => {
    const eleve = eleves.find(e => e.id === id);
    return eleve ? `${eleve.nom} ${eleve.prenom} (${eleve.matricule})` : 'Élève inconnu';
  };
  
  const getCoursNom = (id) => {
    const cour = cours.find(c => c.id === id);
    return cour ? `${cour.nomCours} - ${cour.niveau}` : 'Cours inconnu';
  };

  const filtered = emargements.filter(e =>
    getEleveNom(e.id_eleve).toLowerCase().includes(search.toLowerCase()) ||
    getCoursNom(e.id_cours).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      field: 'date_cours', 
      headerName: 'Date du cours', 
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {new Date(params.value).toLocaleDateString('fr-FR')}
        </div>
      )
    },
    { 
      field: 'eleve', 
      headerName: 'Élève', 
      width: 250, 
      valueGetter: params => {
        if (!params || !params.row) return 'Élève inconnu';
        return getEleveNom(params.row.id_eleve);
      },
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'cours', 
      headerName: 'Cours', 
      width: 250, 
      valueGetter: params => {
        if (!params || !params.row) return 'Cours inconnu';
        return getCoursNom(params.row.id_cours);
      },
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'presence', 
      headerName: 'Présence', 
      width: 120, 
      valueGetter: params => {
        if (!params || !params.row) return 'Inconnu';
        return params.row.presence ? 'Présent' : 'Absent';
      },
      renderCell: (params) => {
        if (!params || !params.row) return <div>Inconnu</div>;
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <span style={{ 
              color: params.row.presence ? '#2e7d32' : '#d32f2f',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: params.row.presence ? '#e8f5e8' : '#ffebee'
            }}>
              {params.row.presence ? '✅ Présent' : '❌ Absent'}
            </span>
          </div>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => {
        if (!params || !params.row) return <div></div>;
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
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
        <AssignmentIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Liste des Émargements ({filtered.length})
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un émargement..."
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
          rows={filtered.map(e => ({ ...e, id: e.id }))}
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
            Voulez-vous vraiment supprimer cet émargement ? Cette action est irréversible.
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

export default EmargementList; 