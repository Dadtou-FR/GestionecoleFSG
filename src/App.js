import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, Avatar, Chip, Divider } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import GradeIcon from '@mui/icons-material/Grade';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { SnackbarProvider } from 'notistack';
import Dashboard from './components/Dashboard';
import ElevePage from './components/Eleves/ElevePage';
import ClassePage from './components/Classes/ClassePage';

import EnseignantPage from './components/Enseignants/EnseignantPage';
import CoursPage from './components/Cours/CoursPage';
import NotePage from './components/Notes/NotePage';
import EmploiDuTempsPage from './components/EmploisDuTemps/EmploiDuTempsPage';
import EmargementPage from './components/Emargements/EmargementPage';
import ScolaritePage from './components/Scolarite/ScolaritePage';
import BulletinPage from './components/Bulletins/BulletinPage';

const drawerWidth = 240;

const menuItems = [
  { text: 'Classes', icon: <ClassIcon />, path: '/classes' },
  { text: 'Élèves', icon: <GroupIcon />, path: '/eleves' },
  { text: 'Cours', icon: <BookIcon />, path: '/cours' },
  { text: 'Enseignants', icon: <SchoolIcon />, path: '/enseignants' },
  { text: 'Notes', icon: <GradeIcon />, path: '/notes' },
  { text: 'Emplois du temps', icon: <CalendarTodayIcon />, path: '/emplois-du-temps' },
  { text: 'Émargements', icon: <CheckCircleIcon />, path: '/emargements' },
  { text: 'Scolarité', icon: <MonetizationOnIcon />, path: '/scolarite' },
  { text: 'Bulletins', icon: <GradeIcon />, path: '/bulletins' },
];

// Composant pour la navigation avec état actif
function NavigationDrawer() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box', 
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          color: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.3)'
        },
      }}
    >
      <Toolbar sx={{ 
        background: 'rgba(255,255,255,0.15)', 
        borderBottom: '2px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(15px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
          <SchoolIcon sx={{ fontSize: 80, transform: 'rotate(15deg)' }} />
        </Box>
        <Typography variant="h6" noWrap component="div" sx={{ 
          fontWeight: 'bold', 
          letterSpacing: 1.5,
          textShadow: '0 2px 4px rgba(0,0,0,0.4)',
          fontSize: '1.3rem',
          position: 'relative',
          zIndex: 1
        }}>
          🎓 Ecole des Frères de Saint-Gabriel
        </Typography>
      </Toolbar>
      <List sx={{ pt: 1 }}>
        <ListItem 
          button 
          component={Link} 
          to="/" 
          key="Accueil"
          sx={{
            margin: '4px 8px',
            borderRadius: '12px',
            background: isActive('/') ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: isActive('/') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255,255,255,0.15)',
              transform: 'translateX(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.4)'
            },
            '&.Mui-selected': {
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }
          }}
        >
          <ListItemIcon sx={{ 
            color: isActive('/') ? '#fff' : 'rgba(255,255,255,0.8)',
            transition: 'all 0.3s ease'
          }}>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText 
            primary={
              <span style={{ 
                fontWeight: isActive('/') ? 'bold' : '500', 
                color: '#fff',
                textShadow: isActive('/') ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                Accueil
              </span>
            } 
          />
        </ListItem>
        {menuItems.map(item => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            sx={{
              margin: '4px 8px',
              borderRadius: '12px',
              background: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: isActive(item.path) ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.15)',
                transform: 'translateX(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.4)'
              },
              '&.Mui-selected': {
                background: 'rgba(255,255,255,0.25)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.8)',
              transition: 'all 0.3s ease'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={
                <span style={{ 
                  fontWeight: isActive(item.path) ? 'bold' : '500', 
                  color: '#fff',
                  textShadow: isActive(item.path) ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {item.text}
                </span>
              } 
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

function App() {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3000} iconVariant={{ success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <NavigationDrawer />
          <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header fixe avec titre de l'application */}
            <Box sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
              color: '#fff',
              py: 3,
              px: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              borderBottom: '4px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(15px)',
              overflow: 'hidden'
            }}>
              {/* Éléments décoratifs en arrière-plan */}
              <Box sx={{
                position: 'absolute',
                top: -50,
                left: -50,
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 4s ease-in-out infinite'
              }} />
              <Box sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 150,
                height: 150,
                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 3s ease-in-out infinite reverse'
              }} />
              
              <Box sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}>
                {/* Logo et titre principal */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60,
                      background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                      color: '#1a237e',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      border: '3px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      sx={{
                        fontWeight: 'bold',
                        letterSpacing: 2,
                        textShadow: '0 4px 8px rgba(0,0,0,0.4)',
                        background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem' },
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        lineHeight: 1.2
                      }}
                    >
                      🎓 Ecole des Frères de Saint-Gabriel 🎓
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{
                        opacity: 0.95,
                        fontStyle: 'italic',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        fontWeight: 500,
                        letterSpacing: 1
                      }}
                    >
                      Excellence • Innovation • Réussite
                    </Typography>
                  </Box>
                </Box>

                {/* Informations système */}
                <Box sx={{ 
                  display: { xs: 'none', md: 'flex' }, 
                  alignItems: 'center', 
                  gap: 2,
                  background: 'rgba(255,255,255,0.1)',
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                      Statut Système
                    </Typography>
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label="Opérationnel" 
                      size="small"
                      sx={{ 
                        background: 'rgba(76, 175, 80, 0.9)', 
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                      Version
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                      v2.1.0
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Barre de progression subtile */}
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, #4caf50 0%, #2196f3 50%, #ff9800 100%)',
                animation: 'shimmer 3s ease-in-out infinite'
              }} />
            </Box>
            
            {/* Contenu principal avec padding */}
            <Box sx={{ p: 3 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/eleves" element={<ElevePage />} />
                <Route path="/classes" element={<ClassePage />} />

                <Route path="/enseignants" element={<EnseignantPage />} />
                <Route path="/cours" element={<CoursPage />} />
                <Route path="/notes" element={<NotePage />} />
                <Route path="/emplois-du-temps" element={<EmploiDuTempsPage />} />
                <Route path="/emargements" element={<EmargementPage />} />
                <Route path="/scolarite" element={<ScolaritePage />} />
                <Route path="/bulletins" element={<BulletinPage />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
