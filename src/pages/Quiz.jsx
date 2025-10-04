import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Quiz = ({ data }) => {
    return (
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 4 }}>
            <Typography variant="h4" gutterBottom>
                🧠 Rigveda Quiz
            </Typography>
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                    Coming Soon! Interactive quizzes to test your Vedic knowledge.
                </Typography>
            </Box>
        </Container>
    );
};

export default Quiz;
