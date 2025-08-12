import React, { useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import EmargementForm from './EmargementForm';
import EmargementList from './EmargementList';

function EmargementPage() {
  const [refresh, setRefresh] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const handleSuccess = () => {
    setRefresh(!refresh);
    setEditId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          ✅ Gestion des Émargements
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={showForm ? "contained" : "outlined"}
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{
              background: showForm ? 'linear-gradient(45deg, #1a237e 30%, #283593 90%)' : 'transparent',
              color: showForm ? 'white' : '#1a237e',
              borderColor: '#1a237e',
              '&:hover': {
                background: showForm ? 'linear-gradient(45deg, #283593 30%, #3949ab 90%)' : 'rgba(26, 35, 126, 0.1)',
              }
            }}
          >
            Ajouter
          </Button>
          <Button
            variant={!showForm ? "contained" : "outlined"}
            startIcon={<ListIcon />}
            onClick={() => setShowForm(false)}
            sx={{
              background: !showForm ? 'linear-gradient(45deg, #1a237e 30%, #283593 90%)' : 'transparent',
              color: !showForm ? 'white' : '#1a237e',
              borderColor: '#1a237e',
              '&:hover': {
                background: !showForm ? 'linear-gradient(45deg, #283593 30%, #3949ab 90%)' : 'rgba(26, 35, 126, 0.1)',
              }
            }}
          >
            Liste
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {showForm && (
          <Grid item xs={12} lg={5}>
            <EmargementForm id={editId} onSuccess={handleSuccess} />
          </Grid>
        )}
        <Grid item xs={12} lg={showForm ? 7 : 12}>
          <EmargementList key={refresh} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmargementPage; 