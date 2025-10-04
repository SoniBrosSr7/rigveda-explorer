import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Stack } from '@mui/material';

// Helper: Get N random questions with Mandala/Sukta/Mantra info
function getRandomQuizItems(data, n = 10) {
    const withInfo = data.filter(q => !!q.sanskrit && !!q.mandala && !!q.sukta);
    const shuffled = [...withInfo].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

// Helper: Options are real mandala/sukta numbers from data, plus correct one
function getMandalaChoices(data, correctMandala) {
    const allMandalas = Array.from(new Set(data.map(q => q.mandala).filter(Boolean)));
    const others = allMandalas.filter(num => num !== correctMandala);
    const choices = [correctMandala, ...others.sort(() => 0.5 - Math.random()).slice(0, 3)];
    return choices.sort(() => 0.5 - Math.random());
}

function getSuktaChoices(data, correctSukta, mandala) {
    const allSuktas = Array.from(new Set(
        data.filter(q => q.mandala === mandala).map(q => q.sukta).filter(Boolean)
    ));
    const others = allSuktas.filter(num => num !== correctSukta);
    const choices = [correctSukta, ...others.sort(() => 0.5 - Math.random()).slice(0, 3)];
    return choices.sort(() => 0.5 - Math.random());
}

const MandalaQuiz = ({ data, onExit }) => {
    const [sessionKey, setSessionKey] = useState(0);

    const [quizItems, setQuizItems] = useState(() => getRandomQuizItems(data));
    const [index, setIndex] = useState(0);
    const [selectedMandala, setSelectedMandala] = useState(null);
    const [selectedSukta, setSelectedSukta] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    // Add this!
    useEffect(() => {
        setQuizItems(getRandomQuizItems(data));
        setIndex(0);
        setSelectedMandala(null);
        setSelectedSukta(null);
        setExplanation(null);
        setScore(0);
        setFinished(false);
    }, [sessionKey, data]);

    if (!quizItems.length) return <Box p={4}>Not enough mantras for the quiz!</Box>;

    const cur = quizItems[index];
    const mandalaChoices = getMandalaChoices(data, cur.mandala);
    const suktaChoices = getSuktaChoices(data, cur.sukta, cur.mandala);

    const handleMandalaSelect = (choice) => {
        if (selectedMandala !== null) return;
        setSelectedMandala(choice);
        // Don't count score until Sukta part as both must be correct for a point.
    };

    const handleSuktaSelect = (choice) => {
        if (selectedSukta !== null) return;
        setSelectedSukta(choice);
        const mandalaCorrect = selectedMandala === cur.mandala;
        const suktaCorrect = choice === cur.sukta;
        if (mandalaCorrect && suktaCorrect) setScore(s => s + 1);
        setExplanation(
            mandalaCorrect && suktaCorrect
                ? "Correct! You matched both Mandala and Sukta numbers."
                : `Incorrect. The correct answer is Mandala ${cur.mandala}, Sukta ${cur.sukta}.`
        );
    };

    const nextQuestion = () => {
        setSelectedMandala(null);
        setSelectedSukta(null);
        setExplanation(null);
        if (index + 1 < quizItems.length) setIndex(i => i + 1);
        else setFinished(true);
    };

    const restartQuiz = () => setSessionKey(k => k + 1);

    return (
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 3, px: { xs: 1, md: 6 } }}>
            <Button variant="outlined" onClick={onExit} sx={{ mb: 1 }}>
                Back to Quiz Menu
            </Button>
            <Typography variant="h5" sx={{ mb: 1 }} textAlign={'center'}>
                Mandala/Sukta Trivia Quiz
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
                Score: {score} / {quizItems.length}
            </Typography>
            {finished ? (
                <Box textAlign="center" py={6}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        Quiz Finished!
                    </Typography>
                    <Typography color="success.main" variant="h6">
                        Your Score: {score} / {quizItems.length}
                    </Typography>
                    <Button variant="contained" size="large" sx={{ mt: 4 }} onClick={restartQuiz}>
                        Retake Quiz
                    </Button>
                </Box>
            ) : (
                <Box>
                    <Typography
                        variant="h6"
                        color="primary"
                        sx={{
                            mb: 3,
                            fontWeight: 600,
                            letterSpacing: 1
                        }}
                    >
                        Question {index + 1} of {quizItems.length}
                    </Typography>
                    <Card
                        variant="outlined"
                        sx={{
                            mb: 3,
                            borderRadius: 3,
                            boxShadow: 3,
                            maxWidth: 800,
                            mx: 'auto',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            '&:hover': {
                                borderColor: 'secondary.main',
                                boxShadow: 6
                            }
                        }}
                    >
                        <CardContent sx={{ py: 4, px: 5 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: 'Noto Sans Devanagari, serif',
                                    mb: 3,
                                    lineHeight: 1.6,
                                    fontWeight: 500,
                                    textAlign: 'center',
                                    color: 'text.primary'
                                }}
                            >
                                {cur.sanskrit}
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                    fontStyle: "italic",
                                    textAlign: 'center',
                                    lineHeight: 1.5
                                }}
                            >
                                {cur.transliteration}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 2,
                                    mt: 3,
                                    pt: 2,
                                    borderTop: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600 }}
                                >
                                    📜 Find the correct Mandala and Sukta for this mantra
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'center' }}>
                        Which Mandala?
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ mt: 1, maxWidth: 600, mx: 'auto' }}
                        justifyContent="center"
                    >
                        {mandalaChoices.map(num => {
                            const isCorrect = num === cur.mandala;
                            const showCorrect = selectedMandala && isCorrect;
                            const showWrong = selectedMandala === num && !isCorrect;
                            return (
                                <Button
                                    key={num}
                                    variant={selectedMandala ? (showCorrect ? 'contained' : showWrong ? 'outlined' : 'text') : 'outlined'}
                                    color={selectedMandala ? (showCorrect ? 'success' : showWrong ? 'error' : 'primary') : 'primary'}
                                    sx={{ minWidth: 120, fontWeight: 'bold', textTransform: 'none', borderRadius: 2 }}
                                    disabled={selectedMandala !== null}
                                    onClick={() => handleMandalaSelect(num)}
                                >
                                    Mandala {num}
                                </Button>
                            );
                        })}
                    </Stack>

                    {selectedMandala && (
                        <>
                            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, textAlign: 'center' }}>
                                Which Sukta?
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{ mt: 1, maxWidth: 600, mx: 'auto' }}
                                justifyContent="center"
                            >
                                {suktaChoices.map(num => {
                                    const isCorrect = num === cur.sukta;
                                    const showCorrect = selectedSukta && isCorrect;
                                    const showWrong = selectedSukta === num && !isCorrect;
                                    return (
                                        <Button
                                            key={num}
                                            variant={selectedSukta ? (showCorrect ? 'contained' : showWrong ? 'outlined' : 'text') : 'outlined'}
                                            color={selectedSukta ? (showCorrect ? 'success' : showWrong ? 'error' : 'primary') : 'primary'}
                                            sx={{ minWidth: 120, fontWeight: 'bold', textTransform: 'none', borderRadius: 2 }}
                                            disabled={selectedSukta !== null}
                                            onClick={() => handleSuktaSelect(num)}
                                        >
                                            Sukta {num}
                                        </Button>
                                    );
                                })}
                            </Stack>
                        </>
                    )}

                    {explanation && (
                        <Box sx={{ my: 4, maxWidth: 600, mx: 'auto' }}>
                            <Typography
                                variant="h6"
                                align="center"
                                color={explanation.startsWith("Correct") ? "success.main" : "error.main"}
                                sx={{ fontWeight: 700, mb: 2 }}
                            >
                                {explanation}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{ minWidth: 140, fontWeight: 700, py: 1.2, px: 4 }}
                                    onClick={nextQuestion}
                                >
                                    {index + 1 < quizItems.length ? "Next" : "Finish"}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default MandalaQuiz;
