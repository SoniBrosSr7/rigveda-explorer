import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
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

  if (loading) return <Box p={4}>Loading Rigveda...</Box>;
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
