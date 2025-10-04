import React, { useState, useMemo, useEffect } from 'react';
import {
    Container, TextField, Box, Typography, FormControl,
    InputLabel, Select, MenuItem, Grid, Button, Pagination
} from '@mui/material';
import MantraCard from '../components/MantraCard';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PAGE_SIZE = 20;

function removeDiacritics(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const Explorer = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDeity, setSelectedDeity] = useState('');
    const [selectedMandala, setSelectedMandala] = useState('');
    const [selectedSukta, setSelectedSukta] = useState('');
    const [randomMantra, setRandomMantra] = useState(null);
    const [page, setPage] = useState(1);

    // Unique deities, mandalas, suktas for dropdowns
    const deities = useMemo(() =>
        [...new Set(data.map(i => i.deity).filter(Boolean))].sort()
        , [data]);
    const mandalas = useMemo(() =>
        [...new Set(data.map(i => i.mandala))].sort((a, b) => a - b)
        , [data]);
    const suktas = useMemo(() =>
        selectedMandala
            ? [...new Set(data.filter(i => i.mandala === parseInt(selectedMandala)).map(i => i.sukta))].sort((a, b) => a - b)
            : []
        , [data, selectedMandala]);

    /**
     * It will search for any part of transliteration and with, without, or partial diacritics
     */
    const filteredData = useMemo(() => {
        const normalizedSearch = removeDiacritics(searchTerm.toLowerCase());

        return data.filter(item => {
            // Check in Sanskrit as-is
            const matchesSanskrit =
                item.sanskrit && item.sanskrit.toLowerCase().includes(searchTerm.toLowerCase());

            // Check in transliteration, stripped of diacritics
            const translit = removeDiacritics(item.transliteration || '').toLowerCase();
            const matchesTranslit =
                translit.includes(normalizedSearch);

            // Check translation as usual
            const matchesTranslation =
                item.translation && item.translation.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSearch =
                !searchTerm || matchesSanskrit || matchesTranslit || matchesTranslation;

            const matchesDeity = !selectedDeity || item.deity === selectedDeity;
            const matchesMandala = !selectedMandala || item.mandala === parseInt(selectedMandala);
            const matchesSukta = !selectedSukta || item.sukta === parseInt(selectedSukta);

            return matchesSearch && matchesDeity && matchesMandala && matchesSukta;
        });
    }, [data, searchTerm, selectedDeity, selectedMandala, selectedSukta]);

    // Paginate results
    const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);
    const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Reset page whenever filters/search change
    useEffect(() => {
        setPage(1);
    }, [searchTerm, selectedDeity, selectedMandala, selectedSukta]);

    const getRandomMantra = () => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomMantra(data[randomIndex]);
    };

    const filterStyle = { minWidth: 200 };

    return (
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 6, px: 6 }}>
            {/* Search and Filters */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    label="Search mantras"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={3} md={3}>
                        <FormControl fullWidth sx={{ ...filterStyle }}>
                            <InputLabel>Deity</InputLabel>
                            <Select
                                value={selectedDeity}
                                onChange={(e) => setSelectedDeity(e.target.value)}
                                label="Deity"
                                sx={filterStyle}
                            >
                                <MenuItem value="">All Deities</MenuItem>
                                {deities.map(deity => (
                                    <MenuItem key={deity} value={deity}>{deity}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        <FormControl fullWidth sx={{ ...filterStyle }}>
                            <InputLabel>Mandala</InputLabel>
                            <Select
                                value={selectedMandala}
                                onChange={e => {
                                    setSelectedMandala(e.target.value);
                                    setSelectedSukta('');
                                }}
                                label="Mandala"
                                sx={{ ...filterStyle }}
                            >
                                <MenuItem value="">All Mandalas</MenuItem>
                                {mandalas.map(mandala => (
                                    <MenuItem key={mandala} value={mandala}>Mandala {mandala}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        <FormControl fullWidth sx={{ ...filterStyle }} disabled={!selectedMandala}>
                            <InputLabel>Sukta</InputLabel>
                            <Select
                                value={selectedSukta}
                                onChange={e => setSelectedSukta(e.target.value)}
                                label="Sukta"
                                sx={{ ...filterStyle }}
                            >
                                <MenuItem value="">All Suktas</MenuItem>
                                {suktas.map(sukta => (
                                    <MenuItem key={sukta} value={sukta}>Sukta {sukta}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={getRandomMantra}
                            startIcon={<VisibilityIcon />}
                            sx={{ height: '56px', fontWeight: 'bold' }}
                        >
                            Reveal a Mantra
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Random Mantra */}
            {randomMantra && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>✨ Revealed Mantra ✨</Typography>
                    <MantraCard mantra={randomMantra} highlighted />
                </Box>
            )}
            <Typography variant="h5" gutterBottom>
                {searchTerm || selectedDeity || selectedMandala || selectedSukta ?
                    `Found ${filteredData.length} mantras` :
                    `Explore ${data.length} mantras`
                }
            </Typography>
            <Box>
                {paginatedData.map(mantra => (
                    <MantraCard key={`${mantra.mandala}-${mantra.sukta}-${mantra.mantra}`} mantra={mantra} />
                ))}
            </Box>
            {/* Pagination Control */}
            {pageCount > 1 && (
                <Box textAlign="center" sx={{ mt: 2 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        color="primary"
                        size="large"
                    />
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Page {page} of {pageCount}
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default Explorer;
