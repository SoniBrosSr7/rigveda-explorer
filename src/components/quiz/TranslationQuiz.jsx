// src/components/quiz/TranslationQuiz.jsx
import React, { useState } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Stack } from '@mui/material';

// Helper: Get N random questions from data, with translation and sanskrit
function getRandomQuizItems(data, n = 10) {
    const withTranslation = data.filter(q => !!q.translation && !!q.sanskrit);
    const shuffled = [...withTranslation].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

// Helper: For each question, build 1 correct + 3 random wrong translations
function getTranslationChoices(data, correctTranslation) {
    const allTranslations = Array.from(new Set(data.map(q => q.translation).filter(Boolean)));
    const others = allTranslations.filter(tr => tr !== correctTranslation);
    const choices = [correctTranslation, ...others.sort(() => 0.5 - Math.random()).slice(0, 3)];
    // Shuffle
    return choices.sort(() => 0.5 - Math.random());
}

const TranslationQuiz = ({ data, onExit }) => {
    const [quizItems] = useState(() => getRandomQuizItems(data));
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    if (!quizItems.length) return <Box p={4}>Not enough mantras for the quiz!</Box>;

    const cur = quizItems[index];
    const choices = getTranslationChoices(data, cur.translation);

    const handleSelect = (choice) => {
        if (selected !== null) return; // Only answer once
        setSelected(choice);
        // Evaluate answer and show explanation
        const correct = choice === cur.translation;
        if (correct) setScore(s => s + 1);
        setExplanation(
            correct
                ? "Correct! This is the proper English translation for the mantra."
                : `Incorrect. The correct translation is:\n\n${cur.translation}`
        );
    };

    const nextQuestion = () => {
        setSelected(null);
        setExplanation(null);
        if (index + 1 < quizItems.length) setIndex(i => i + 1);
        else setFinished(true);
    };

    const restartQuiz = () => window.location.reload();

    return (
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 3, px: 6 }}>
            <Button variant="outlined" onClick={onExit} sx={{ mb: 1 }}>
                Back to Quiz Menu
            </Button>
            <Typography variant="h5" sx={{ mb: 0 }}>
                Translation Matching Quiz
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
                    <Box sx={{ mb: 0 }}>
                        <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                            Question {index + 1} of {quizItems.length}
                        </Typography>
                        <Card
                            variant="outlined"
                            sx={{
                                mb: 2,
                                borderRadius: 3,
                                border: '2px solid',
                                borderColor: 'divider',
                                boxShadow: 2,
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontFamily: 'Noto Sans Devanagari, serif',
                                        mb: 1,
                                        lineHeight: 1,
                                        fontWeight: 500,
                                        color: 'text.primary'
                                    }}
                                >
                                    {cur.sanskrit}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                        fontStyle: "italic",
                                        fontSize: '1.1rem',
                                        lineHeight: 1.5
                                    }}
                                >
                                    {cur.transliteration}
                                </Typography>
                                <Box
                                    sx={{
                                        pt: 2,
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        📖 Mandala {cur.mandala} • Sukta {cur.sukta} • Mantra {cur.mantra}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    <Typography variant="subtitle1">Which is the correct English translation?</Typography>
                    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                        {choices.map((tr, choiceIndex) => {
                            const isCorrect = tr === cur.translation;
                            const showCorrect = selected && isCorrect;
                            const showWrong = selected === tr && !isCorrect;
                            return (
                                <Button
                                    key={tr}
                                    variant={selected ? (showCorrect ? 'contained' : showWrong ? 'outlined' : 'text') : 'outlined'}
                                    color={selected ? (showCorrect ? 'success' : showWrong ? 'error' : 'primary') : 'primary'}
                                    sx={{
                                        minHeight: 60,
                                        fontWeight: 'bold',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        whiteSpace: "normal",
                                        textTransform: 'none',
                                        px: 3,
                                        py: 2,
                                        borderRadius: 2,
                                        '&:hover': {
                                            transform: selected ? 'none' : 'translateY(-1px)',
                                            boxShadow: selected ? 'none' : 2
                                        }
                                    }}
                                    disabled={selected !== null}
                                    onClick={() => handleSelect(tr)}
                                >
                                    <Box sx={{ textAlign: 'left', width: '100%' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'inherit' }}>
                                            {String.fromCharCode(65 + choiceIndex)}. {tr}
                                        </Typography>
                                    </Box>
                                </Button>
                            );
                        })}
                    </Stack>
                    {explanation && (
                        <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}>
                            <Typography style={{ whiteSpace: "pre-line" }}>{explanation}</Typography>
                            <Button
                                variant="contained"
                                sx={{ mt: 2 }}
                                onClick={nextQuestion}
                            >
                                {index + 1 < quizItems.length ? 'Next' : 'Finish'}
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default TranslationQuiz;
