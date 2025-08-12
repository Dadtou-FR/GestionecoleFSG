import React, { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../../services/noteService';
import { getEleves } from '../../services/eleveService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, TextField, Paper, Chip, Avatar } from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, Grade as GradeIcon, Book as BookIcon, CalendarToday as CalendarIcon, Assessment as AssessmentIcon, Comment as CommentIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getNotes().then(res => setNotes(res.data));
    getEleves().then(res => setEleves(res.data));
  }, []);

  const handleDelete = id => setDeleteId(id);
  const confirmDelete = () => {
    deleteNote(deleteId)
      .then(() => {
        setNotes(notes.filter(n => n.id !== deleteId));
        enqueueSnackbar('Note supprimée avec succès !', { variant: 'success' });
        setDeleteId(null);
      })
      .catch(() => enqueueSnackbar('Erreur lors de la suppression.', { variant: 'error' }));
  };

  const getEleveNom = (matricule) => {
    const eleve = eleves.find(e => e.matricule === matricule);
    return eleve ? `${eleve.nom} ${eleve.prenom}` : 'Élève inconnu';
  };

  const getEleveSexe = (matricule) => {
    const eleve = eleves.find(e => e.matricule === matricule);
    return eleve ? eleve.sexe : 'M';
  };

  const filteredNotes = notes.filter(n =>
    (n.matriculeEleve || '').toLowerCase().includes(search.toLowerCase()) ||
    (n.nomCours || '').toLowerCase().includes(search.toLowerCase()) ||
    (n.typeEvaluation || '').toLowerCase().includes(search.toLowerCase()) ||
    (n.valeur && n.valeur.toString().includes(search)) ||
    (getEleveNom(n.matriculeEleve) || '').toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (nom) => {
    return nom?.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || 'E';
  };

  const getSexeColor = (sexe) => {
    return sexe === 'F' ? '#e91e63' : '#2196f3';
  };

  const getNoteColor = (note) => {
    if (note >= 16) return '#4caf50'; // Excellent
    if (note >= 14) return '#8bc34a'; // Très bien
    if (note >= 12) return '#ff9800'; // Bien
    if (note >= 10) return '#ff5722'; // Passable
    return '#f44336'; // Insuffisant
  };

  const getNoteLabel = (note) => {
    if (note >= 16) return 'Excellent';
    if (note >= 14) return 'Très bien';
    if (note >= 12) return 'Bien';
    if (note >= 10) return 'Passable';
    return 'Insuffisant';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const columns = [
    { 
      field: 'eleve', 
      headerName: 'Élève', 
      width: 250,
      valueGetter: (params) => {
        if (!params || !params.row) return 'Élève inconnu';
        return getEleveNom(params.row.matriculeEleve);
      },
      renderCell: (params) => {
        if (!params || !params.row) return <div>Élève inconnu</div>;
        const eleveNom = getEleveNom(params.row.matriculeEleve);
        const sexe = getEleveSexe(params.row.matriculeEleve);
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  fontSize: '0.8rem',
                  backgroundColor: getSexeColor(sexe),
                  color: 'white'
                }}
              >
                {getInitials(eleveNom)}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                  {eleveNom}
                </Typography>
                <Chip 
                  label={params.row.matriculeEleve} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 20,
                    backgroundColor: '#f5f5f5',
                    color: '#666'
                  }} 
                />
              </Box>
            </Box>
          </div>
        );
      }
    },
    { 
      field: 'nomCours', 
      headerName: 'Cours', 
      width: 180,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              {params.value || 'Cours manquant'}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'valeur', 
      headerName: 'Note', 
      width: 180,
      type: 'number',
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GradeIcon sx={{ color: getNoteColor(params.value), fontSize: '1.2rem' }} />
            <Chip 
              label={`${params.value || 0}/20`} 
              size="small" 
              sx={{ 
                backgroundColor: getNoteColor(params.value), 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }} 
            />
            <Typography variant="caption" sx={{ color: getNoteColor(params.value), fontWeight: 'bold' }}>
              {getNoteLabel(params.value)}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'typeEvaluation', 
      headerName: 'Type', 
      width: 130,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
            <Chip 
              label={params.value || 'Non défini'} 
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
      field: 'dateEvaluation', 
      headerName: 'Date', 
      width: 130,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ color: '#666', fontSize: '1rem' }} />
            <Typography variant="body2">
              {formatDate(params.value)}
            </Typography>
          </Box>
        </div>
      )
    },
    { 
      field: 'observation', 
      headerName: 'Observation', 
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CommentIcon sx={{ color: '#666', fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ 
              maxWidth: 150,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: params.value ? '#333' : '#999'
            }}>
              {params.value || 'Aucune observation'}
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
        <GradeIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Liste des Notes ({filteredNotes.length})
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher une note..."
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
          rows={filteredNotes.map(n => ({ ...n, id: n.id }))}
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
            Voulez-vous vraiment supprimer cette note ? Cette action est irréversible.
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

export default NoteList; 