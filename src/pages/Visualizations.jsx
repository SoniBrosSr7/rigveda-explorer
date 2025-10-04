import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Visualizations = ({ data }) => {
    return (
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 4 }}>
            <Typography variant="h4" gutterBottom>
                📊 Rigveda Insights
            </Typography>
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                    Coming Soon! Beautiful visualizations of Rigveda patterns and insights.
                </Typography>
            </Box>
        </Container>
    );
};

export default Visualizations;
