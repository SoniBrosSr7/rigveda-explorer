import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button
} from '@mui/material';

const QUIZ_MODES = [
    {
        id: 'deity',
        title: 'Deity Identification',
        description: 'Identify the deity addressed by the mantra.',
    },
    {
        id: 'translation',
        title: 'Translation Matching',
        description: 'Match Sanskrit mantras to their English translations.',
    },
    {
        id: 'mandala',
        title: 'Mandala/Sukta Trivia',
        description: 'Guess the mandala or sukta to which a mantra belongs.',
    },
    {
        id: 'fillblank',
        title: 'Fill-in-the-Blank',
        description: 'Choose the missing word or deity in a translation.',
    },
    {
        id: 'mixed',
        title: 'Mixed Quiz',
        description: 'Challenge yourself with questions from all types!',
    },
];

const QuizModeSelect = ({ onSelect }) => (
    <Box sx={{ py: 0, px: { xs: 0, sm: 4, md: 8 } }}>
        <Typography variant="h4" gutterBottom align="center">
            🧠 Choose Your Rigveda Quiz Mode
        </Typography>
        <Grid container spacing={6} justifyContent="center">
            {QUIZ_MODES.map(mode => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={mode.id}>
                    <Card
                        variant="outlined"
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 2,
                            borderRadius: 3,
                            minHeight: 175,
                            transition: 'transform 0.1s',
                            '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 6 },
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                {mode.title}
                            </Typography>
                            <Typography color="text.secondary">
                                {mode.description}
                            </Typography>
                        </CardContent>
                        <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={() => onSelect(mode.id)}
                                sx={{ borderRadius: 2, fontWeight: 700 }}
                            >
                                Start Quiz
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Box>
);

const QuizHub = ({ data, onSelectMode }) => {
    const [selectedMode, setSelectedMode] = useState(null);

    if (selectedMode) {
        // For modes not implemented, fallback
        return (
            <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 6, px: 0 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Coming Soon!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        The <b>{QUIZ_MODES.find(m => m.id === selectedMode).title}</b> quiz is under development.
                    </Typography>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => setSelectedMode(null)}
                        sx={{ mt: 2 }}
                    >
                        Back to Quiz Menu
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 6, px: 0 }}>
            <QuizModeSelect onSelect={mode => {
                setSelectedMode(mode);
                onSelectMode(mode); // Notify parent (Quiz.jsx)
            }}
            />
        </Container>
    );
};

export default QuizHub;
