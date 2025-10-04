import React, { useState } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Stack } from '@mui/material';

// Helper: Create fill-in-the-blank questions and choices
function getBlankQuizItems(data, n = 10) {
    // Use entries with a deity and translation, replace deity in translation with "____"
    const candidates = data.filter(q => !!q.deity && !!q.translation && q.translation.includes(q.deity));
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n).map(q => ({
        ...q,
        blankTranslation: q.translation.replace(new RegExp(`\\b${q.deity}\\b`, 'gi'), "____"),
    }));
}

// Helper: Generate options for fill-in-the-blank (4 choices: correct deity + 3 random)
function getDeityChoices(data, correctDeity) {
    const allDeities = Array.from(new Set(data.map(q => q.deity).filter(Boolean)));
    const others = allDeities.filter(deity => deity !== correctDeity);
    const choices = [correctDeity, ...others.sort(() => 0.5 - Math.random()).slice(0, 3)];
    return choices.sort(() => 0.5 - Math.random());
}

const FillBlankQuiz = ({ data, onExit }) => {
    // NEW: This is your "quiz session"
    const [sessionKey, setSessionKey] = useState(0);

    const [quizItems, setQuizItems] = useState(() => getBlankQuizItems(data));
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    // When sessionKey changes, restart everything:
    React.useEffect(() => {
        setQuizItems(getBlankQuizItems(data));
        setIndex(0);
        setSelected(null);
        setExplanation(null);
        setScore(0);
        setFinished(false);
    }, [sessionKey, data]);

    if (!quizItems.length) return (
        <Box p={4}>
            Not enough fill-in-the-blank questions available in the dataset!
        </Box>
    );

    const cur = quizItems[index];
    const choices = getDeityChoices(data, cur.deity);

    const handleSelect = (choice) => {
        if (selected !== null) return;
        setSelected(choice);
        if (choice === cur.deity) setScore(s => s + 1);
        setExplanation(
            choice === cur.deity
                ? "Great! You chose the correct word/deity to fill the blank."
                : `Oops! The correct answer is "${cur.deity}".`
        );
    };

    const nextQuestion = () => {
        setSelected(null);
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
            <Typography variant="h5" sx={{ mb: 1 }}>
                Fill in the Blank Quiz
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
                    <Typography sx={{ mb: 2 }} fontWeight={600}>
                        <b>Question {index + 1} of {quizItems.length}</b>
                    </Typography>
                    <Card
                        variant="outlined"
                        sx={{
                            mb: 3,
                            mx: "auto",
                            borderRadius: 4,
                            boxShadow: 4,
                            maxWidth: 800,
                            border: "2px solid",
                            borderColor: "primary.main",
                            background: (theme) => theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.02)"
                                : "rgba(0,0,0,0.01)",
                            '&:hover': {
                                boxShadow: 6,
                                borderColor: "secondary.main"
                            }
                        }}
                    >
                        <CardContent sx={{ py: 3, px: { xs: 2, sm: 4 } }}>
                            <Typography
                                variant="body2"
                                sx={{ textAlign: "center", color: "info.main", fontWeight: 700, mx: 'auto', mb: 2 }}
                            >
                                Fill in the missing word in the translation below!
                            </Typography>
                            <Typography
                                variant="h5"
                                color="text.primary"
                                sx={{
                                    textAlign: "center",
                                    mb: 2,
                                    lineHeight: 1.25
                                }}
                            >
                                {/* Highlight the blank in the translation */}
                                {cur.blankTranslation}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    fontFamily: "Noto Sans Devanagari, serif",
                                    textAlign: "center",
                                    mb: 1,
                                    opacity: 0.85,
                                }}
                            >
                                {cur.sanskrit}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mb: 1.5,
                                    fontStyle: "italic",
                                    textAlign: "center"
                                }}
                            >
                                {cur.transliteration}
                            </Typography>
                            <Typography
                                color="text.secondary"
                                variant="caption"
                                sx={{ textAlign: "center", display: 'block', mt: 1 }}
                            >
                                Mandala {cur.mandala} • Sukta {cur.sukta} • Mantra {cur.mantra}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ mt: 2, maxWidth: 800, mx: 'auto', justifyContent: 'center' }}
                    >
                        {choices.map((choice, i) => {
                            const isCorrect = choice === cur.deity;
                            const showCorrect = selected && isCorrect;
                            const showWrong = selected === choice && !isCorrect;
                            return (
                                <Button
                                    key={choice}
                                    variant={
                                        selected
                                            ? showCorrect
                                                ? 'contained'
                                                : showWrong
                                                    ? 'outlined'
                                                    : 'text'
                                            : 'outlined'
                                    }
                                    color={
                                        selected
                                            ? showCorrect
                                                ? 'success'
                                                : showWrong
                                                    ? 'error'
                                                    : 'primary'
                                            : 'primary'
                                    }
                                    sx={{
                                        minWidth: 160,
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        px: 1,
                                        py: 1,
                                        fontSize: '1.1rem',
                                        boxShadow: selected && showCorrect ? 3 : undefined,
                                        textTransform: 'none',
                                    }}
                                    disabled={selected !== null}
                                    onClick={() => handleSelect(choice)}
                                >
                                    {String.fromCharCode(65 + i)}. {choice}
                                </Button>
                            );
                        })}
                    </Stack>

                    {explanation && (
                        <Box sx={{ mt: 3, maxWidth: 800, mx: 'auto', mb: 2 }}>
                            <Typography
                                variant="h6"
                                align="center"
                                color={explanation.startsWith("Great") ? "success.main" : "error.main"}
                                sx={{ fontWeight: 700, mb: 2 }}
                            >
                                {explanation}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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

export default FillBlankQuiz;
