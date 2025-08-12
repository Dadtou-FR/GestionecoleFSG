import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
  Zoom,
  Slide
} from '@mui/material';
import {
  School as SchoolIcon,
  Group as GroupIcon,
  Class as ClassIcon,
  Book as BookIcon,
  Grade as GradeIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  MonetizationOn as MonetizationOnIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Notifications as NotificationsIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getStatistics, getQuickActionsStats } from '../services/statisticsService';

function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [quickActionsStats, setQuickActionsStats] = useState(null);
  const [dbStatus, setDbStatus] = useState('connecting');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Charger les statistiques depuis la base de données
    const loadStatistics = async () => {
      try {
        setDbStatus('connecting');
        const [statsData, quickStatsData] = await Promise.all([
          getStatistics(),
          getQuickActionsStats()
        ]);
        setStatistics(statsData);
        setQuickActionsStats(quickStatsData);
        setDbStatus('connected');
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        setDbStatus('error');
      } finally {
        setLoading(false);
      }
    };
    
    loadStatistics();
    
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    { 
      title: 'Gestion des Élèves', 
      icon: <GroupIcon sx={{ fontSize: 40 }} />, 
      path: '/eleves',
      color: '#1976d2',
      description: 'Gérer les informations des élèves',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      stats: quickActionsStats?.eleves || '0 élèves'
    },
    { 
      title: 'Gestion des Classes', 
      icon: <ClassIcon sx={{ fontSize: 40 }} />, 
      path: '/classes',
      color: '#388e3c',
      description: 'Organiser les classes et sections',
      gradient: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
      stats: quickActionsStats?.classes || '0 classes'
    },
    { 
      title: 'Gestion des Cours', 
      icon: <BookIcon sx={{ fontSize: 40 }} />, 
      path: '/cours',
      color: '#7b1fa2',
      description: 'Gérer les cours et matières',
      gradient: 'linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)',
      stats: quickActionsStats?.cours || '0 cours'
    },
    { 
      title: 'Gestion des Enseignants', 
      icon: <SchoolIcon sx={{ fontSize: 40 }} />, 
      path: '/enseignants',
      color: '#ff6f00',
      description: 'Gérer les enseignants',
      gradient: 'linear-gradient(135deg, #ff6f00 0%, #ffb74d 100%)',
      stats: quickActionsStats?.enseignants || '0 enseignants'
    },
    { 
      title: 'Gestion des Notes', 
      icon: <GradeIcon sx={{ fontSize: 40 }} />, 
      path: '/notes',
      color: '#f57c00',
      description: 'Saisir et consulter les notes',
      gradient: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
      stats: quickActionsStats?.notes || '0 notes'
    },
    { 
      title: 'Emplois du Temps', 
      icon: <CalendarTodayIcon sx={{ fontSize: 40 }} />, 
      path: '/emplois-du-temps',
      color: '#9c27b0',
      description: 'Planifier les horaires',
      gradient: 'linear-gradient(135deg, #9c27b0 0%, #ab47bc 100%)',
      stats: quickActionsStats?.emplois || '0 cours'
    },
    { 
      title: 'Émargements', 
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />, 
      path: '/emargements',
      color: '#d32f2f',
      description: 'Gérer les présences',
      gradient: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
      stats: quickActionsStats?.emargements || '0% présence'
    },
    { 
      title: 'Scolarité', 
      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />, 
      path: '/scolarite',
      color: '#388e3c',
      description: 'Gérer les paiements',
      gradient: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
      stats: quickActionsStats?.scolarite || '0% payé'
    }
  ];

  const stats = [
    { 
      title: 'Élèves Inscrits', 
      value: statistics?.eleves?.count?.toString() || '0', 
      icon: <GroupIcon />, 
      color: '#1976d2', 
      trend: statistics?.eleves?.trend || '+0',
      progress: statistics?.eleves?.progress || 0,
      subtitle: statistics?.eleves?.subtitle || 'Élèves inscrits'
    },
    { 
      title: 'Classes Actives', 
      value: statistics?.classes?.count?.toString() || '0', 
      icon: <ClassIcon />, 
      color: '#388e3c', 
      trend: statistics?.classes?.trend || '+0',
      progress: statistics?.classes?.progress || 0,
      subtitle: statistics?.classes?.subtitle || 'Classes actives'
    },
    { 
      title: 'Enseignants', 
      value: statistics?.enseignants?.count?.toString() || '0', 
      icon: <SchoolIcon />, 
      color: '#f57c00', 
      trend: statistics?.enseignants?.trend || '+0',
      progress: statistics?.enseignants?.progress || 0,
      subtitle: statistics?.enseignants?.subtitle || 'Enseignants'
    },
    { 
      title: 'Cours Dispensés', 
      value: statistics?.cours?.count?.toString() || '0', 
      icon: <BookIcon />, 
      color: '#7b1fa2', 
      trend: statistics?.cours?.trend || '+0',
      progress: statistics?.cours?.progress || 0,
      subtitle: statistics?.cours?.subtitle || 'Cours dispensés'
    },
    { 
      title: 'Numéros de Téléphone', 
      value: statistics?.telephones?.count?.toString() || '0', 
      icon: <PhoneIcon />, 
      color: '#e91e63', 
      trend: statistics?.telephones?.trend || '+0',
      progress: statistics?.telephones?.progress || 0,
      subtitle: statistics?.telephones?.subtitle || 'Liste des parents enregistrés'
    }
  ];

  const recentActivities = [
    { action: 'Nouvelle note ajoutée', time: 'Il y a 5 min', icon: <GradeIcon />, color: '#f57c00' },
    { action: 'Élève inscrit', time: 'Il y a 15 min', icon: <GroupIcon />, color: '#1976d2' },
    { action: 'Cours programmé', time: 'Il y a 30 min', icon: <CalendarTodayIcon />, color: '#7b1fa2' },
    { action: 'Paiement reçu', time: 'Il y a 1h', icon: <MonetizationOnIcon />, color: '#388e3c' }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 3,
                background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <SchoolIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2 }}>
              Chargement du Dashboard...
            </Typography>
            <LinearProgress 
              sx={{ 
                width: 300, 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(26, 35, 126, 0.2)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                  borderRadius: 4
                }
              }} 
            />
          </Box>
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Éléments décoratifs en arrière-plan */}
      <Box sx={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(26, 35, 126, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 6s ease-in-out infinite'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 200,
        height: 200,
        background: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite reverse'
      }} />

      {/* En-tête avec logo et informations */}
      <Slide direction="down" in={true} timeout={800}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
            color: 'white',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(26, 35, 126, 0.3)'
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
            <SchoolIcon sx={{ fontSize: 200, transform: 'rotate(15deg)' }} />
          </Box>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mr: 3,
                    background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                    color: '#1a237e',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1, 
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    🎓 Ecole des Frères de Saint-Gabriel
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontStyle: 'italic', mb: 1 }}>
                    Excellence • Innovation • Réussite
                  </Typography>
                  <Chip 
                    label="Système de Gestion Scolaire" 
                    sx={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 'bold',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, fontFamily: 'monospace' }}>
                  {formatTime(currentTime)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  {formatDate(currentTime)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Chip 
                    icon={dbStatus === 'connected' ? <CheckCircleIcon /> : dbStatus === 'connecting' ? <TrendingUpIcon /> : <ErrorIcon />} 
                    label={
                      dbStatus === 'connected' ? 'Base de données connectée' : 
                      dbStatus === 'connecting' ? 'Connexion...' : 
                      'Erreur de connexion'
                    } 
                    sx={{ 
                      background: dbStatus === 'connected' ? 'rgba(76, 175, 80, 0.8)' : 
                                dbStatus === 'connecting' ? 'rgba(255, 152, 0, 0.8)' : 
                                'rgba(244, 67, 54, 0.8)', 
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Tooltip title="Notifications">
                    <IconButton sx={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}>
                      <NotificationsIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rafraîchir les statistiques">
                    <IconButton 
                      sx={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const [statsData, quickStatsData] = await Promise.all([
                            getStatistics(),
                            getQuickActionsStats()
                          ]);
                          setStatistics(statsData);
                          setQuickActionsStats(quickStatsData);
                        } catch (error) {
                          console.error('Erreur lors du rafraîchissement:', error);
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      <TrendingUpIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Slide>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Zoom in={true} timeout={800 + index * 200}>
              <Card 
                elevation={4} 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    '& .stat-icon': {
                      transform: 'scale(1.1) rotate(5deg)'
                    }
                  }
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: stat.gradient || `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}dd 100%)`
                }} />
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar 
                      className="stat-icon"
                      sx={{ 
                        background: stat.color, 
                        width: 56, 
                        height: 56,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Chip 
                      label={stat.trend} 
                      size="small" 
                      sx={{ 
                        background: stat.trend.startsWith('+') ? '#4caf50' : '#f44336',
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          sx={{ 
                            width: 60, 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: stat.color,
                              borderRadius: 4
                            }
                          }} 
                        />
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Chargement...
                        </Typography>
                      </Box>
                    ) : (
                      stat.value
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500, mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 2 }}>
                    {stat.subtitle}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stat.progress} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: stat.gradient || `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                        borderRadius: 3
                      }
                    }} 
                  />
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Actions rapides */}
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold', 
        mb: 3, 
        color: '#1a237e', 
        textAlign: 'center',
        position: 'relative'
      }}>
         Actions Rapides
        <Box sx={{
          position: 'absolute',
          bottom: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 3,
          background: 'linear-gradient(90deg, #1a237e 0%, #3949ab 100%)',
          borderRadius: 2
        }} />
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Zoom in={true} timeout={1000 + index * 200}>
              <Card 
                elevation={4} 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                    '& .action-icon': {
                      transform: 'scale(1.1) rotate(5deg)'
                    },
                    '& .action-stats': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
                onClick={() => navigate(action.path)}
              >
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: action.gradient
                }} />
                <CardContent sx={{ p: 3, textAlign: 'center', position: 'relative' }}>
                  <Box 
                    className="action-icon"
                    sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      mb: 2,
                      borderRadius: '50%',
                      background: `${action.color}15`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box sx={{ color: action.color }}>
                      {action.icon}
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1a237e' }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {action.description}
                  </Typography>
                  <Box 
                    className="action-stats"
                    sx={{
                      opacity: 0,
                      transform: 'translateY(10px)',
                      transition: 'all 0.3s ease',
                      mb: 2
                    }}
                  >
                    <Chip 
                      label={action.stats} 
                      size="small" 
                      sx={{ 
                        background: action.color,
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  <Button 
                    variant="contained" 
                    size="small"
                    sx={{ 
                      background: action.gradient,
                      fontWeight: 'bold',
                      borderRadius: 2,
                      px: 3
                    }}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Section d'informations et activités récentes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Zoom in={true} timeout={1200}>
            <Card elevation={4} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StarIcon sx={{ color: '#ff9800', mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    Notre Mission
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555', mb: 2 }}>
                  Former des citoyens responsables, compétents et innovants, 
                  en offrant une éducation de qualité basée sur l'excellence académique 
                  et les valeurs humaines.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip 
                    icon={<PsychologyIcon />}
                    label="Excellence Académique" 
                    sx={{ background: '#e3f2fd', color: '#1976d2' }} 
                  />
                  <Chip 
                    icon={<LightbulbIcon />}
                    label="Innovation Pédagogique" 
                    sx={{ background: '#f3e5f5', color: '#7b1fa2' }} 
                  />
                  <Chip 
                    icon={<FavoriteIcon />}
                    label="Respect et Tolérance" 
                    sx={{ background: '#e8f5e8', color: '#388e3c' }} 
                  />
                  <Chip 
                    icon={<VisibilityIcon />}
                    label="Responsabilité Sociale" 
                    sx={{ background: '#fff3e0', color: '#f57c00' }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Zoom in={true} timeout={1400}>
            <Card elevation={4} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ color: '#4caf50', mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    Activités Récentes
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentActivities.map((activity, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        p: 1.5,
                        borderRadius: 2,
                        background: 'rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(0,0,0,0.05)',
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        width: 40, 
                        height: 40, 
                        background: activity.color,
                        fontSize: '1rem'
                      }}>
                        {activity.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                          {activity.action}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      {/* Footer informatif */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
          💡 Conseil : Utilisez le menu latéral pour naviguer rapidement entre les différentes sections de gestion.
        </Typography>
      </Box>

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
    </Box>
  );
}

export default Dashboard; 