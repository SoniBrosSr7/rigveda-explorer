// pages/Quiz.jsx
import React, { useState } from 'react';
import { Container, CircularProgress, Typography, Box } from '@mui/material';

import { useRigvedaData } from '../hooks/useRigvedaData';
import QuizHub from '../components/QuizHub';
import DeityQuiz from '../components/quiz/DeityQuiz';
import TranslationQuiz from '../components/quiz/TranslationQuiz';

const Quiz = () => {
    const { data, loading, error } = useRigvedaData();
    const [selectedMode, setSelectedMode] = useState(null);

    if (loading) {
        return (
            <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 6, px: 0 }}>
                <Box sx={{ py: 0, px: { xs: 0, sm: 4, md: 8 } }}>
                    <Typography variant="h4" gutterBottom align="center">
                        🧠 Loading Quiz Modes...
                    </Typography>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 10 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography color="error" variant="h6">Error: {error}</Typography>
                </Box>
            </Container>
        );
    }

    // Render appropriate quiz mode
    if (selectedMode === "deity") {
        return (
            <DeityQuiz
                data={data}
                onExit={() => setSelectedMode(null)}
            />
        );
    }

    if (selectedMode === "translation") {
        return (
            <TranslationQuiz
                data={data}
                onExit={() => setSelectedMode(null)}
            />
        );
    }

    // Default: Show QuizHub (mode selection)
    return (
        <QuizHub
            data={data}
            onSelectMode={setSelectedMode}
        />
    );
};

export default Quiz;
