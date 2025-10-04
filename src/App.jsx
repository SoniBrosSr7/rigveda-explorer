import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography, CssBaseline, Box } from '@mui/material';
import Header from './components/Header';
import Explorer from './pages/Explorer.jsx';
import Quiz from './pages/Quiz';
import Visualizations from './pages/Visualizations';
import { useRigvedaData } from './hooks/useRigvedaData';

const theme = createTheme({
  palette: {
    primary: { main: '#8B4513' }, // Sandalwood brown
    secondary: { main: '#DAA520' }, // Golden
    background: {
      default: '#FFF8DC', // Cornsilk
      paper: '#FFFEF7'
    },
    text: {
      primary: '#2F4F4F', // Dark slate gray
      secondary: '#8B4513'
    }
  },
  typography: {
    fontFamily: 'Georgia, serif',
    h1: { fontFamily: 'Noto Sans Devanagari, serif' }
  }
});

function App() {
  const [currentPage, setCurrentPage] = useState('explorer');
  const { data, loading, error } = useRigvedaData();

  if (loading) return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg,#fff8dc 0%, #e5c68b 100%)',
        zIndex: 1200
      }}
    >
      <Typography variant="h1" color="primary" sx={{
        fontSize: { xs: 64, sm: 92 },
        fontFamily: 'Noto Sans Devanagari, serif',
        mb: 2
      }}>
        🕉️
      </Typography>
      <Typography variant="h5" color="secondary" sx={{ fontWeight: 600, mb: 2 }}>
        Loading the Rigveda...
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="primary"
        sx={{
          fontFamily: 'Noto Sans Devanagari, serif',
          letterSpacing: 1.5
        }}
      >
        {'तत्स॑वि॒तुर्वरे॑ण्यं॒ भर्गो॑ दे॒वस्य॑ धीमहि | धियो॒ यो नः॑ प्रचो॒दया॑त्'}
      </Typography>
      <Box sx={{ mt: 4 }}>
        <span className="loader-veda" />
      </Box>
      <style>
        {`
        .loader-veda {
          display: inline-block;
          width: 64px;
          height: 64px;
          border: 6px solid #d2b465;
          border-top: 6px solid #925009;
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </Box>
  );
  if (error) return <Box p={4}>Error loading data: {error}</Box>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh">
        <Header currentPage={currentPage} onPageChange={setCurrentPage} />

        {currentPage === 'explorer' && <Explorer data={data} />}
        {currentPage === 'quiz' && <Quiz data={data} />}
        {currentPage === 'visualizations' && <Visualizations data={data} />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
