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
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}
                >
                    <img
                        src="/rigveda-logo.png"
                        alt="Rigveda Explorer Logo"
                        style={{ height: 50, width: 50, marginRight: 8, verticalAlign: 'middle' }}
                    />
                    Rigveda Explorer
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
                                textDecoration: currentPage === page.key ? 'none' : 'none'
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
