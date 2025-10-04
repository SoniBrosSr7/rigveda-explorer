import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from '@mui/material';

const Header = ({ currentPage, onPageChange }) => {
    const pages = [
        { key: 'explorer', label: 'Explorer' },
        { key: 'quiz', label: 'Quiz' },
        { key: 'visualizations', label: 'Visualizations' }
    ];

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    🕉️ Rigveda Explorer
                </Typography>

                <Box>
                    {pages.map((page) => (
                        <Button
                            key={page.key}
                            color="inherit"
                            onClick={() => onPageChange(page.key)}
                            sx={{
                                mx: 1,
                                fontWeight: currentPage === page.key ? 'bold' : 'normal',
                                textDecoration: currentPage === page.key ? 'underline' : 'none'
                            }}
                        >
                            {page.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
