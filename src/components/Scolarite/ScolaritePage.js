import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { Add as AddIcon, List as ListIcon, Payment as PaymentIcon } from '@mui/icons-material';
import ScolariteForm from './ScolariteForm';
import ScolariteList from './ScolariteList';

function ScolaritePage() {
  const [showForm, setShowForm] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setShowForm(false);
    // Forcer le rafraîchissement de la liste
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', minHeight: '100vh' }}>
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ mr: 2, color: '#1a237e', fontSize: 36 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              Gestion de la Scolarité
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={showForm ? "contained" : "outlined"}
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{
                background: showForm ? 'linear-gradient(45deg, #1a237e 30%, #283593 90%)' : 'transparent',
                color: showForm ? 'white' : '#1a237e',
                borderColor: '#1a237e',
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                '&:hover': {
                  background: showForm ? 'linear-gradient(45deg, #283593 30%, #3949ab 90%)' : 'rgba(26, 35, 126, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(26, 35, 126, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Nouveau Paiement
            </Button>
            <Button
              variant={!showForm ? "contained" : "outlined"}
              startIcon={<ListIcon />}
              onClick={() => setShowForm(false)}
              sx={{
                background: !showForm ? 'linear-gradient(45deg, #1a237e 30%, #283593 90%)' : 'transparent',
                color: !showForm ? 'white' : '#1a237e',
                borderColor: '#1a237e',
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                '&:hover': {
                  background: !showForm ? 'linear-gradient(45deg, #283593 30%, #3949ab 90%)' : 'rgba(26, 35, 126, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(26, 35, 126, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Voir les Paiements
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic' }}>
          Gérez les paiements de scolarité mensuels de vos élèves avec facilité. Suivez les paiements, les retards et les statistiques financières.
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        {showForm && (
          <Grid item xs={12} lg={5}>
            <ScolariteForm onSuccess={handleSuccess} />
          </Grid>
        )}
        <Grid item xs={12} lg={showForm ? 7 : 12}>
          <ScolariteList key={refreshKey} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ScolaritePage; 