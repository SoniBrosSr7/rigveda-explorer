import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Collapse,
    IconButton,
    Stack
} from '@mui/material';
import { ExpandMore, Share, ContentCopy } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';

const MantraCard = ({ mantra, highlighted = false }) => {
    const [showTransliteration, setShowTransliteration] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);

    const copyToClipboard = async () => {
        const text = `${mantra.sanskrit}\n\n${mantra.translation}\n\n— Rigveda ${mantra.reference}`;
        await navigator.clipboard.writeText(text);
    };

    const shareMantra = async () => {
        if (navigator.share) {
            await navigator.share({
                title: `Rigveda ${mantra.reference}`,
                text: `${mantra.sanskrit}\n\n${mantra.translation}`,
                url: window.location.href
            });
        } else {
            copyToClipboard();
        }
    };

    return (
        <Card
            sx={{
                mb: 2,
                border: highlighted ? '2px solid gold' : '1px solid #ddd',
                boxShadow: highlighted ? 3 : 1
            }}
        >
            <CardContent>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip
                            title={`Maṇḍala ${mantra.mandala}, Sūkta ${mantra.sukta}, Mantra ${mantra.mantra}`}
                            arrow
                            placement="top"
                        >
                            <Typography variant="subtitle2" color="primary" sx={{ cursor: 'help' }}>
                                {mantra.reference}
                            </Typography>
                        </Tooltip>
                        {mantra.deity && (
                            <Chip label={mantra.deity} size="small" color="secondary" />
                        )}
                    </Box>
                    <Box>
                        <IconButton size="small" onClick={copyToClipboard}>
                            <ContentCopy fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={shareMantra}>
                            <Share fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Sanskrit */}
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: 'Noto Sans Devanagari, serif',
                        lineHeight: 1.6,
                        mb: 2
                    }}
                >
                    {mantra.sanskrit}
                </Typography>

                {/* Button Row: Transliteration and Translation, side-by-side */}
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Button
                        size="small"
                        variant={showTransliteration ? "contained" : "outlined"}
                        onClick={() => setShowTransliteration(!showTransliteration)}
                    >
                        {showTransliteration ? "Hide Transliteration" : "Show Transliteration"}
                    </Button>
                    <Button
                        size="small"
                        variant={showTranslation ? "contained" : "outlined"}
                        color="secondary"
                        onClick={() => setShowTranslation(!showTranslation)}
                    >
                        {showTranslation ? "Hide Translation" : "Show Translation"}
                    </Button>
                </Stack>

                {/* Transliteration */}
                <Collapse in={showTransliteration}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontStyle: 'italic',
                            color: 'text.secondary',
                            mb: 2
                        }}
                    >
                        {mantra.transliteration}
                    </Typography>
                </Collapse>

                {/* Translation */}
                <Collapse in={showTranslation}>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {mantra.translation}
                    </Typography>
                    {/* Attribution */}
                    <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 2, color: 'text.secondary' }}
                    >
                        Sanskrit: {mantra.source?.sanskrit} | Translation: {mantra.source?.translation}
                    </Typography>
                </Collapse>
            </CardContent>
        </Card>
    );
};

export default MantraCard;
