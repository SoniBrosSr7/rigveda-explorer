import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Stack } from '@mui/material';

// Helpers for each quiz mode
function getDeityQuestions(data, n = 3) {
    // Question: Sanskrit shown, pick deity from choices.
    const candidates = data.filter(q => !!q.deity);
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n).map(q => ({
        ...q,
        type: "deity",
    }));
}

function getTranslationQuestions(data, n = 3) {
    // Show Sanskrit, pick translation.
    const candidates = data.filter(q => !!q.sanskrit && !!q.translation);
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n).map(q => ({
        ...q,
        type: "translation",
    }));
}

function getMandalaQuestions(data, n = 2) {
    // Show Sanskrit, pick Mandala/Sukta.
    const candidates = data.filter(q => !!q.mandala && !!q.sukta);
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n).map(q => ({
        ...q,
        type: "mandala",
    }));
}

function getBlankQuestions(data, n = 2) {
    // Fill-in-the-blank (deity missing in translation)
    const candidates = data.filter(q => !!q.deity && !!q.translation && q.translation.includes(q.deity));
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n).map(q => ({
        ...q,
        type: "fillblank",
        blankTranslation: q.translation.replace(new RegExp(`\\b${q.deity}\\b`, 'gi'), "____"),
    }));
}

// Utility for choices per mode
function getDeityChoices(data, correctDeity) {
    const allDeities = Array.from(new Set(data.map(q => q.deity).filter(Boolean)));
    const others = allDeities.filter(d => d !== correctDeity);
    const choices = [correctDeity, ...others.sort(() => 0.5 - Math.random()).slice(0, 3)];
    return choices.sort(() => 0.5 - Math.random());
}

function getTranslationChoices(data, correctTranslation) {
    const allTranslations = Array.from(new Set(data.map(q => q.translation).filter(Boolean)));
    const others = allTranslations.filter(tr => tr !== correctTranslation);
    const choices = [correctTranslation, ...others.sort(() => 0.5 - Math.random()).slice(0, 3)];
    return choices.sort(() => 0.5 - Math.random());
}

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

const MixedQuiz = ({ data, onExit }) => {
    const [sessionKey, setSessionKey] = useState(0);

    // Compose question pool
    const [quizItems, setQuizItems] = useState(() =>
        [...getDeityQuestions(data, 3),
        ...getTranslationQuestions(data, 3),
        ...getMandalaQuestions(data, 2),
        ...getBlankQuestions(data, 2)
        ].sort(() => 0.5 - Math.random())
    );

    const [index, setIndex] = useState(0);
    // General for all modes except Mandala
    const [selected, setSelected] = useState(null);
    // For Mandala mode only
    const [selectedMandala, setSelectedMandala] = useState(null);
    const [selectedSukta, setSelectedSukta] = useState(null);

    const [explanation, setExplanation] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        setQuizItems(
            [...getDeityQuestions(data, 3),
            ...getTranslationQuestions(data, 3),
            ...getMandalaQuestions(data, 2),
            ...getBlankQuestions(data, 2)
            ].sort(() => 0.5 - Math.random())
        );
        setIndex(0);
        setSelected(null);
        setSelectedMandala(null);
        setSelectedSukta(null);
        setExplanation(null);
        setScore(0);
        setFinished(false);
    }, [sessionKey, data]);

    if (!quizItems.length) return <Box p={4}>Not enough data for a mixed quiz!</Box>;

    const cur = quizItems[index];

    // General next logic
    const nextQuestion = () => {
        setSelected(null);
        setSelectedMandala(null);
        setSelectedSukta(null);
        setExplanation(null);
        if (index + 1 < quizItems.length) setIndex(i => i + 1);
        else setFinished(true);
    };

    const restartQuiz = () => setSessionKey(k => k + 1);

    // ============ Per-question layouts below ============

    // Deity Mode:
    if (cur.type === "deity") {
        const choices = getDeityChoices(data, cur.deity);
        return (
            <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 3, px: 6 }}>
                <Button variant="outlined" onClick={onExit} sx={{ mb: 3 }}>
                    Back to Quiz Menu
                </Button>
                <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>Mixed Quiz</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Score: {score} / {quizItems.length}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                    <b>Question {index + 1} of {quizItems.length}</b>
                </Typography>
                <Card variant="outlined" sx={{ mb: 3, mx: "auto", borderRadius: 4, boxShadow: 4, maxWidth: 800, border: "2px solid", borderColor: "primary.main" }}>
                    <CardContent sx={{ py: 4, px: 5 }}>
                        <Typography variant="body2" color="info.main" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
                            Which deity is addressed by this mantra?
                        </Typography>
                        <Typography variant="h4" sx={{ fontFamily: 'Noto Sans Devanagari, serif', mb: 2, textAlign: "center" }}>{cur.sanskrit}</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontStyle: "italic", textAlign: "center", mb: 2 }}>{cur.transliteration}</Typography>
                        <Typography color="text.secondary" variant="caption" sx={{ textAlign: "center", display: 'block', mt: 1 }}>
                            Mandala {cur.mandala} • Sukta {cur.sukta} • Mantra {cur.mantra}
                        </Typography>
                    </CardContent>
                </Card>
                <Stack direction="row" spacing={2} sx={{ mt: 2, maxWidth: 600, mx: 'auto' }} justifyContent="center">
                    {choices.map((choice, i) => {
                        const isCorrect = choice === cur.deity;
                        const showCorrect = selected && isCorrect;
                        const showWrong = selected === choice && !isCorrect;
                        return (
                            <Button
                                key={choice}
                                variant={selected ? (showCorrect ? 'contained' : showWrong ? 'outlined' : 'text') : 'outlined'}
                                color={selected ? (showCorrect ? 'success' : showWrong ? 'error' : 'primary') : 'primary'}
                                sx={{ minWidth: 160, fontWeight: 'bold', borderRadius: 2, px: 3, py: 2, fontSize: '1.1rem', textTransform: 'none' }}
                                disabled={selected !== null}
                                onClick={() => {
                                    if (selected) return;
                                    setSelected(choice);
                                    if (choice === cur.deity) setScore(s => s + 1);
                                    setExplanation(choice === cur.deity ? "Correct!" : `Incorrect, it's ${cur.deity}.`);
                                }}
                            >
                                {String.fromCharCode(65 + i)}. {choice}
                            </Button>
                        );
                    })}
                </Stack>
                {explanation && (
                    <Box sx={{ my: 4, maxWidth: 600, mx: 'auto' }}>
                        <Typography variant="h6" align="center" color={explanation.startsWith("Correct") ? "success.main" : "error.main"} sx={{ fontWeight: 700, mb: 2 }}>
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
                {finished && (
                    <Box textAlign="center" py={6}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Quiz Finished!</Typography>
                        <Typography color="success.main" variant="h6">
                            Your Score: {score} / {quizItems.length}
                        </Typography>
                        <Button variant="contained" size="large" sx={{ mt: 4 }} onClick={restartQuiz}>Retake Quiz</Button>
                    </Box>
                )}
            </Container>
        );
    }

    // Translation Matching Mode
    if (cur.type === "translation") {
        const choices = getTranslationChoices(data, cur.translation);
        return (
            <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 3, px: 6 }}>
                <Button variant="outlined" onClick={onExit} sx={{ mb: 2 }}>
                    Back to Quiz Menu
                </Button>
                <Typography variant="h5" sx={{ mb: 1, textAlign: 'center' }}>Mixed Quiz</Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                    Score: {score} / {quizItems.length}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                    <b>Question {index + 1} of {quizItems.length}</b>
                </Typography>
                <Card variant="outlined" sx={{ mb: 3, mx: "auto", borderRadius: 4, boxShadow: 4, maxWidth: 800, border: "2px solid", borderColor: "primary.main" }}>
                    <CardContent sx={{ py: 4, px: 5 }}>
                        <Typography variant="body2" color="info.main" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
                            Match the correct English translation to this mantra.
                        </Typography>
                        <Typography variant="h4" sx={{ fontFamily: 'Noto Sans Devanagari, serif', mb: 2, textAlign: "center" }}>{cur.sanskrit}</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontStyle: "italic", textAlign: "center", mb: 2 }}>{cur.transliteration}</Typography>
                        <Typography color="text.secondary" variant="caption" sx={{ textAlign: "center", display: 'block', mt: 1 }}>
                            Mandala {cur.mandala} • Sukta {cur.sukta} • Mantra {cur.mantra}
                        </Typography>
                    </CardContent>
                </Card>
                <Stack direction="column" spacing={2} sx={{ mt: 2, maxWidth: 700, mx: 'auto', alignItems: 'center' }}>
                    {choices.map((tr, i) => {
                        const isCorrect = tr === cur.translation;
                        const showCorrect = selected && isCorrect;
                        const showWrong = selected === tr && !isCorrect;
                        return (
                            <Button
                                key={tr}
                                variant={selected ? (showCorrect ? 'contained' : showWrong ? 'outlined' : 'text') : 'outlined'}
                                color={selected ? (showCorrect ? 'success' : showWrong ? 'error' : 'primary') : 'primary'}
                                sx={{ minWidth: 500, fontWeight: 'bold', borderRadius: 2, px: 3, py: 2, fontSize: '1.1rem', textAlign: 'left', textTransform: 'none' }}
                                disabled={selected !== null}
                                onClick={() => {
                                    if (selected) return;
                                    setSelected(tr);
                                    if (tr === cur.translation) setScore(s => s + 1);
                                    setExplanation(tr === cur.translation ? "Correct!" : `Incorrect, it's "${cur.translation}".`);
                                }}
                            >
                                {String.fromCharCode(65 + i)}. {tr}
                            </Button>
                        );
                    })}
                </Stack>
                {explanation && (
                    <Box sx={{ my: 4, maxWidth: 700, mx: 'auto' }}>
                        <Typography variant="h6" align="center" color={explanation.startsWith("Correct") ? "success.main" : "error.main"} sx={{ fontWeight: 700, mb: 2 }}>
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
                {finished && (
                    <Box textAlign="center" py={6}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Quiz Finished!</Typography>
                        <Typography color="success.main" variant="h6">
                            Your Score: {score} / {quizItems.length}
                        </Typography>
                        <Button variant="contained" size="large" sx={{ mt: 4 }} onClick={restartQuiz}>Retake Quiz</Button>
                    </Box>
                )}
            </Container>
        );
    }

    // Mandala Mode
    if (cur.type === "mandala") {
        const mandalaChoices = getMandalaChoices(data, cur.mandala);
        const suktaChoices = getSuktaChoices(data, cur.sukta, cur.mandala);
        return (
            <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 3, px: 6 }}>
                <Button variant="outlined" onClick={onExit} sx={{ mb: 3 }}>
                    Back to Quiz Menu
                </Button>
                <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>Mixed Quiz</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Score: {score} / {quizItems.length}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                    <b>Question {index + 1} of {quizItems.length}</b>
                </Typography>
                <Card variant="outlined" sx={{ mb: 3, mx: "auto", borderRadius: 4, boxShadow: 4, maxWidth: 800, border: "2px solid", borderColor: "primary.main" }}>
                    <CardContent sx={{ py: 4, px: 5 }}>
                        <Typography variant="body2" color="info.main" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
                            Find the correct Mandala and Sukta for this mantra
                        </Typography>
                        <Typography variant="h4" sx={{ fontFamily: 'Noto Sans Devanagari, serif', mb: 2, textAlign: "center" }}>{cur.sanskrit}</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontStyle: "italic", textAlign: "center", mb: 2 }}>{cur.transliteration}</Typography>
                        <Typography color="text.secondary" variant="caption" sx={{ textAlign: "center", display: 'block', mt: 1 }}>
                            Mantra {cur.mantra}
                        </Typography>
                    </CardContent>
                </Card>
                <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'center' }}>Which Mandala?</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1, maxWidth: 600, mx: 'auto' }} justifyContent="center">
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
                                onClick={() => setSelectedMandala(num)}
                            >
                                Mandala {num}
                            </Button>
                        );
                    })}
                </Stack>
                {selectedMandala && (
                    <>
                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, textAlign: 'center' }}>Which Sukta?</Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 1, maxWidth: 600, mx: 'auto' }} justifyContent="center">
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
                                        onClick={() => {
                                            if (selectedSukta) return;
                                            setSelectedSukta(num);
                                            const mandalaCorrect = selectedMandala === cur.mandala;
                                            const suktaCorrect = num === cur.sukta;
                                            if (mandalaCorrect && suktaCorrect) setScore(s => s + 1);
                                            setExplanation(
                                                mandalaCorrect && suktaCorrect
                                                    ? "Correct! You matched both Mandala and Sukta."
                                                    : `Incorrect! Correct was Mandala ${cur.mandala}, Sukta ${cur.sukta}.`
                                            );
                                        }}
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
                        <Typography variant="h6" align="center" color={explanation.startsWith("Correct") ? "success.main" : "error.main"} sx={{ fontWeight: 700, mb: 2 }}>
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
                {finished && (
                    <Box textAlign="center" py={6}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Quiz Finished!</Typography>
                        <Typography color="success.main" variant="h6">
                            Your Score: {score} / {quizItems.length}
                        </Typography>
                        <Button variant="contained" size="large" sx={{ mt: 4 }} onClick={restartQuiz}>Retake Quiz</Button>
                    </Box>
                )}
            </Container>
        );
    }

    // Fill in the Blank Mode
    if (cur.type === "fillblank") {
        const choices = getDeityChoices(data, cur.deity);
        return (
            <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 6, px: 0 }}>
                <Button variant="outlined" onClick={onExit} sx={{ mb: 3, ml: 6 }}>
                    Back to Quiz Menu
                </Button>
                <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>Mixed Quiz</Typography>
                <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                    Score: {score} / {quizItems.length} &nbsp; • &nbsp; Question {index + 1} of {quizItems.length}
                </Typography>
                <Card variant="outlined" sx={{ mb: 3, mx: "auto", borderRadius: 4, boxShadow: 4, maxWidth: 800, border: "2px solid", borderColor: "primary.main" }}>
                    <CardContent sx={{ py: 4, px: 5 }}>
                        <Typography variant="body2" color="info.main" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
                            Fill in the missing word or deity in the translation!
                        </Typography>
                        <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
                            {cur.blankTranslation}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontStyle: "italic", textAlign: "center", mb: 2 }}>{cur.transliteration}</Typography>
                        <Typography color="text.secondary" variant="caption" sx={{ textAlign: "center", display: 'block', mt: 1 }}>
                            Mandala {cur.mandala} • Sukta {cur.sukta} • Mantra {cur.mantra}
                        </Typography>
                    </CardContent>
                </Card>
                <Stack direction="row" spacing={2} sx={{ mt: 2, maxWidth: 700, mx: 'auto' }} justifyContent="center">
                    {choices.map((choice, i) => {
                        const isCorrect = choice === cur.deity;
                        const showCorrect = selected && isCorrect;
                        const showWrong = selected === choice && !isCorrect;
                        return (
                            <Button
                                key={choice}
                                variant={selected ? (showCorrect ? 'contained' : showWrong ? 'outlined' : 'text') : 'outlined'}
                                color={selected ? (showCorrect ? 'success' : showWrong ? 'error' : 'primary') : 'primary'}
                                sx={{ minWidth: 160, fontWeight: 'bold', borderRadius: 2, px: 3, py: 2, fontSize: '1.1rem', textTransform: 'none' }}
                                disabled={selected !== null}
                                onClick={() => {
                                    if (selected) return;
                                    setSelected(choice);
                                    if (choice === cur.deity) setScore(s => s + 1);
                                    setExplanation(choice === cur.deity ? "Correct!" : `Incorrect, it was "${cur.deity}".`);
                                }}
                            >
                                {String.fromCharCode(65 + i)}. {choice}
                            </Button>
                        );
                    })}
                </Stack>
                {explanation && (
                    <Box sx={{ my: 4, maxWidth: 700, mx: 'auto' }}>
                        <Typography variant="h6" align="center" color={explanation.startsWith("Correct") ? "success.main" : "error.main"} sx={{ fontWeight: 700, mb: 2 }}>
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
                {finished && (
                    <Box textAlign="center" py={6}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Quiz Finished!</Typography>
                        <Typography color="success.main" variant="h6">
                            Your Score: {score} / {quizItems.length}
                        </Typography>
                        <Button variant="contained" size="large" sx={{ mt: 4 }} onClick={restartQuiz}>Retake Quiz</Button>
                    </Box>
                )}
            </Container>
        );
    }
};

export default MixedQuiz;
