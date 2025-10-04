import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Card, CardContent, Stack, Container
} from '@mui/material';

function getRandomQuizItems(data, n = 10) {
    // Shuffle and return only items with deity
    const withDeity = data.filter(q => !!q.deity);
    const shuffled = [...withDeity].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

function getDeityChoices(data, correctDeity) {
    const allDeities = Array.from(new Set(data.map(q => q.deity).filter(Boolean)));
    const others = allDeities.filter(d => d !== correctDeity);
    // Pick 3 random others + add correct, shuffle
    const choices = [correctDeity, ...others.sort(() => 0.5 - Math.random()).slice(0, 3)];
    return choices.sort(() => 0.5 - Math.random());
}

// Short explanations about deities (customize this as needed)
const deityExplanations = {
    "Aditi": "Aditi is the mother of the gods, associated with unity, freedom, and vastness. She represents infinite space and is revered for her nurturing and protective nature.",
    "Adityas": "The Adityas are a group of solar deities, children of Aditi, who regulate cosmic order and uphold the principles of truth and justice.",
    "Agni": "Agni is the fire deity, the divine priest who mediates between the gods and humans in Vedic rituals. He carries offerings to the gods and brings divine blessings to mortals.",
    "Agni Saucika Gods": "A subgroup of Agni manifestations related to purity and sacred fire in ritual contexts.",
    "Agni and Others": "Agni together with other deities, reflecting collective invocations that emphasize teamwork among gods in fulfilling cosmic and ritual functions.",
    "Agni, Etc": "Agni alongside additional unnamed deities, signifying a broad invocation embracing Agni and others present.",
    "Agni, Maruts": "Agni and the Maruts, representing dynamic energy (fire and storm gods) working together.",
    "Agni-Sona": "Agni and Sona (the fire and Soma, the sacred drink) invoked together, combining transformative and invigorating powers.",
    "Agni. Gods": "Agni in conjunction with the gods, generally signifying all divine forces active through sacred fire.",
    "Andra": "Likely a form or aspect of Agni or another fire deity, invoked in specific mantras for special powers.",
    "April": "Apris are deities of ritual, invoked in specific hymns to ensure proper sacrificial order.",
    "Apris": "Apris are deities of ritual, invoked in specific hymns to ensure proper sacrificial order.",
    "Aranyani": "Aranyani is the forest goddess, who dwells in the wilds, symbolizing the mystery and fertility of forests.",
    "Asamati and Others": "Asamati, possibly a chieftain or minor deity, invoked with others—typically for protection or blessings.",
    "Asvins": "The Asvins are divine twin horsemen, healers, and rescuers who assist humanity with health, offspring, and travel.",
    "Asvins and Others": "The Asvins invoked along with additional deities, seeking both healing and general blessings.",
    "Bhaga": "Bhaga is the deity of fortune, who dispenses wealth, happiness, and prosperity among people.",
    "Bhavayavya": "A rare or lesser-known deity, possibly a guardian or protective spirit invoked in special contexts.",
    "Brahmanaspati": "Brahmanaspati (or Brihaspati) is the lord of prayer, wisdom, and sacred speech, guiding prayers to fruition.",
    "Brhaspati": "Brihaspati is the lord of prayer, wisdom, and sacred speech, guiding prayers to fruition and serving as the priest of the gods.",
    "Cows": "Cows represent abundance, nourishment, and sacredness; sometimes addressed directly for their essential role in Vedic livelihood.",
    "Creation": "Hymns to Creation invoke primordial forces and cosmic order—often not addressed to a personified deity but to universal principles.",
    "Dadhikras": "Dadhikravan is a divine horse—symbol of strength and speed, featured in Rigvedic victory and power hymns.",
    "Dadhikravan": "Dadhikravan is a divine horse—symbol of strength and speed, featured in Rigvedic victory and power hymns.",
    "Dadhikris": "Dadhikravan is a divine horse—symbol of strength and speed, featured in Rigvedic victory and power hymns.",
    "Daksina": "Daksina is the goddess of generosity and ritual gifts, associated with right action and ceremonial giving.",
    "Dawm": "Usas is the goddess of dawn, bringing light, renewal, and inspiration each morning.",
    "Dawn": "Usas is the goddess of dawn, bringing light, renewal, and inspiration each morning.",
    "Dice, Etc": "Ritual implements and ceremonial aspects personified, invoked for purity and success in sacrifice.",
    "Dream-charm": "Invocation for protection or insight related to dreams, not a personified deity but a ritual concept.",
    "Faith": "Faith as a personified quality, invoked to strengthen resolve and sanctity in ritual.",
    "Fathers": "Ancestral spirits (pitrs), honored and invoked for familial blessings, guidance, and continuity.",
    "Frogs": "Frog hymns celebrate rain and fertility; frogs are invoked as sacred participants in rituals following the monsoon.",
    "Ghrta": "Ghrta means clarified butter (ghee); personified in hymns as a sacred oblation and provider of nourishment.",
    "Gods": "Collective invocation of all deities, seeking universal support and protection.",
    "Havirdhanas": "Ritual vessels or deities connected to the offerings in Vedic sacrifices.",
    "Heaven and Earth": "Dyaus is the sky father, Prithivi is the earth mother; together they signify all-encompassing parental cosmic powers.",
    "I": "Self-referential hymns where the speaker identifies with cosmic principles or divine power.",
    "Indra": "Indra is the king of gods, lord of thunder and war, celebrated for his heroic deeds and rain-bringing victory.",
    "Indra Vaikuntha": "A specific role or place of Indra, possibly an epithet for high or victorious Indra.",
    "Indra and Others": "Indra combined with other deities, invoked for collective divine strength.",
    "Indra and Pusan": "Indra (king of gods) and Pusan (nourisher and protector) together, combining power and sustenance.",
    "Indra, Etc": "Indra with additional deities, seeking comprehensive divine support.",
    "Indra, Parvata, Etc": "Indra with Parvata (mountain deity) and others, often in hymns that seek strength and stability.",
    "Indra-Agni": "Joint worship of Indra (king of gods) and Agni (fire deity), emphasizing both might and ritual mediation.",
    "Indra-Angi": "Joint worship of Indra (king of gods) and Agni (fire deity), emphasizing both might and ritual mediation.",
    "Indra-Brhaspati": "Indra with Brihaspati, seeking victory guided by wisdom and prayer.",
    "Indra-Soma": "Indra and Soma invoked together, the warrior god coupled with the divine drink for courage and inspiration.",
    "Indra-Varuna": "Indra and Varuna—power and order combined to maintain cosmic balance.",
    "Indra-Visnu": "Indra with Vishnu, requesting protection, expansion, and prosperity.",
    "Indra. Asvins": "Indra invoked with the healing twin gods, combining royal power with divine medicine.",
    "Indra. Maruts": "Indra with the storm gods, emphasizing thunderous power and dynamic energy.",
    "Indra. Surya. Atri": "Indra with the sun god and sage Atri, seeking illuminated strength and wisdom.",
    "Indra. Vak": "Indra with Vak (goddess of speech), combining power with eloquent expression.",
    "Indra. Vasukra": "Indra with Vasukra, a minor deity or sage, for specific blessings.",
    "Indra. Visvedevas": "Indra with all the gods, seeking comprehensive divine support.",
    "Indri": "Likely a variant or aspect of Indra, the king of gods.",
    "Jnanam": "Jnanam means knowledge or wisdom, sometimes personified for blessings in spiritual pursuit.",
    "Ka": "Ka means 'who' or 'what'—referring to the unknown cosmic principle or supreme deity.",
    "Kapinjala": "Kapinjala is a bird, invoked as a symbol of omens or in ritual animal hymns.",
    "Kesins": "Kesins are mystic sages, possibly identified as horse-headed deities or spiritual ascetics in Vedic tradition.",
    "Ksetrapati, Etc": "Ksetrapati is the lord of fields and agriculture, invoked with others for fertility and harvest.",
    "Liberality": "Personified generosity and charitable giving, essential virtues in Vedic society.",
    "Manas or Spirit": "Personification of consciousness, mind, or spirit, invoked for inspiration and inner clarity.",
    "Manyu": "Manyu is the deity of wrath, invoked for righteous anger, energy, and overcoming obstacles.",
    "Maruts": "Maruts are the storm gods, companions of Indra. They symbolize dynamic weather and transformative power.",
    "Mayabheda": "A minor deity or concept related to illusion or divine mystery.",
    "Mitra": "Mitra, god of friendship, harmony, contracts, and social order, is honored for promoting unity and trust.",
    "Mitra and Varuna": "Mitra with Varuna—friendship and cosmic law governing both human and cosmic interactions.",
    "Mitra-Varuna": "Mitra with Varuna—friendship and cosmic law governing both human and cosmic interactions.",
    "Mitra. Varuna": "Mitra with Varuna—friendship and cosmic law governing both human and cosmic interactions.",
    "New Life": "Personification of renewal, birth, and fresh beginnings in cosmic and personal cycles.",
    "Night": "Night (Ratri) is the goddess who brings rest and protection, balancing the energy of day.",
    "Nirrti and Others": "Nirrti is the goddess of destruction and misfortune, invoked with others for protection from evil.",
    "Parjanya": "Parjanya is the rain god, nourishing earth and fostering growth through life-giving waters.",
    "Praise of Food": "Personification of nourishment and sustenance, celebrating the sacred nature of food.",
    "Praise of Herbs": "Celebration of medicinal plants and their healing properties, often personified as divine.",
    "Praskanva's Gift": "References to gifts or blessings associated with sage Praskanva.",
    "Praskanva's Go": "References to cattle or wealth associated with sage Praskanva.",
    "Press-stones": "Ritual implements used in Soma preparation, personified for their sacred function.",
    "Prthivi": "Prthivi is Mother Earth, provider of nourishment and foundation for all life.",
    "Purusa": "Purusa is the cosmic person—primordial being from which all creation emanates.",
    "Pusan": "Pusan is the nourisher and protector; guides travelers, herds, and souls on their journeys.",
    "Rati": "Rati represents pleasure, love, and the joy found in divine and earthly relationships.",
    "Rbhus": "Rbhus are three divine craftsmen celebrated for their innovation and transformation of matter into divine forms.",
    "Rtu": "Rtu represents the cosmic seasons and natural cycles that govern time and change.",
    "Rudra": "Rudra is the fierce god of storms and medicine, part protector and part destroyer, father of healing.",
    "Saci Paulomi": "Saci is Indra's consort, representing divine feminine power and victory.",
    "Sacrificial Post": "The ritual post used in sacrifices, personified as a sacred connector between earth and heaven.",
    "Sapatnanasanam": "Ritual or charm for overcoming rivals and enemies.",
    "Sapatnibadhanam": "Ritual or charm for binding or defeating adversaries.",
    "Sarama. Panis": "Sarama is Indra's divine messenger dog; Panis are demons who steal cattle—this represents the conflict between good and evil.",
    "Sarasvati": "Sarasvati is the goddess of wisdom, speech, learning, and the sacred river that flows with knowledge.",
    "Savitar": "Savitr is the impelling solar deity who awakens and inspires all activity and creation with divine energy.",
    "Soma": "Soma is both the sacred drink and its deity, bringing ecstasy, vision, and connection to the divine realm.",
    "Soma Pavamana": "Soma Pavamana is the purifying aspect of Soma, the sacred drink being filtered and refined for ritual use.",
    "Soma Pavamana,": "Soma Pavamana is the purifying aspect of Soma, the sacred drink being filtered and refined for ritual use.",
    "Soma Pavanana": "Soma Pavamana is the purifying aspect of Soma, the sacred drink being filtered and refined for ritual use.",
    "Soma and Others": "Soma invoked with other deities, seeking both divine inspiration and comprehensive blessings.",
    "Soma and Pusan": "Soma with Pusan, combining divine inspiration with nourishment and protection.",
    "Soma-Rudra": "Soma and Rudra together, representing both ecstasy and fierce protective power.",
    "Some Pavamana": "Soma Pavamana is the purifying aspect of Soma, the sacred drink being filtered and refined for ritual use.",
    "Son of Waters": "Agni in his aspect as born from waters, representing the divine fire that emerges from primordial elements.",
    "Surya": "Surya is the sun god, illuminating, sustaining, and regulating life and seasons with his radiant power.",
    "Surya's Bridal": "A hymn celebrating the marriage of Surya (the sun's daughter) representing cosmic harmony and union.",
    "Svanaya": "A minor deity or sage, possibly related to sound or sacred utterance.",
    "Tarksya": "Tarksya is a divine bird, often identified with Garuda, representing speed and celestial power.",
    "The Falcon": "The divine falcon that brought Soma from heaven, representing swift divine intervention.",
    "The Gods": "Collective invocation of all deities, seeking universal divine support and protection.",
    "The Horse": "The divine horse representing strength, speed, and sacrifice in cosmic and earthly realms.",
    "The King": "References to divine or earthly kingship, representing righteous rule and cosmic order.",
    "The Rivers": "Sacred rivers personified as goddesses, bringing life, purification, and fertility.",
    "The Sacrificer, Etc": "The one who performs sacrifice, often identified with cosmic principles and divine connection.",
    "Urvasi. Pururavas": "Urvasi is a celestial nymph and Pururavas a mortal king—their story represents the relationship between divine and human love.",
    "Usas": "Usas is the goddess of dawn, symbol of renewal, hope, and the daily victory of light over darkness.",
    "Vak": "Vak is the goddess of speech and sacred word, representing the power of divine utterance and cosmic sound.",
    "Various": "Multiple deities invoked together for comprehensive divine assistance.",
    "Various Deities": "Multiple deities invoked together for comprehensive divine assistance.",
    "Various Gods": "Multiple deities invoked together for comprehensive divine assistance.",
    "Varuna": "Varuna is the deity of cosmic order and the waters, the guardian of rita (cosmic law) who oversees moral order.",
    "Varuna and Others": "Varuna with other deities, seeking both cosmic order and additional divine blessings.",
    "Varuna, Mitra, Aryaman": "Three Adityas together—cosmic order, friendship, and hospitality—representing social and cosmic harmony.",
    "Vasistha": "Vasistha is a great sage and seer, representing wisdom, spiritual authority, and divine knowledge.",
    "Vastospati": "Vastospati is the lord of the dwelling, protector of homes and settlements.",
    "Vayu": "Vayu is the god of wind and vital breath, essential to life and movement throughout the cosmos.",
    "Vayu and Others": "Vayu with other deities, seeking both life-giving breath and comprehensive divine support.",
    "Vayu. Indra-Vayu": "Vayu alone or combined with Indra, representing the life-giving breath and royal power.",
    "Vena": "Vena represents longing or desire, sometimes personified as a cosmic principle of attraction and creation.",
    "Visnu": "Vishnu is the cosmic protector and preserver, taking great strides across the universe to maintain harmony.",
    "Visnu-Indra": "Vishnu with Indra, combining cosmic preservation with royal power and protection.",
    "Visvadevas": "The Visvadevas are the collective of all gods, called upon for universal blessings and comprehensive support.",
    "Visvakarman": "Visvakarman is the divine architect and craftsman who designed and built the universe and all its forms.",
    "Visvedevas": "The Visvedevas are the collective of all gods, called upon for universal blessings and comprehensive support.",
    "Visvedevas, Etc": "The Visvedevas with additional forces, seeking the most comprehensive divine assistance possible.",
    "Water. Grass. Sun": "Natural elements personified—water for life, grass for sustenance, sun for energy and light.",
    "Waters": "Sacred waters personified as goddesses, sources of life, purification, and cosmic fertility.",
    "Waters or Cows": "Waters and cows both representing abundance, nourishment, and the sustaining forces of life.",
    "Weapons of War": "Divine weapons personified, invoked for protection and victory in righteous battles.",
    "Yama": "Yama is the lord of death and justice, the first mortal who died and now guides souls to their afterlife.",
    "Yama Yami": "Yama and his sister Yami, representing the archetypal brother-sister pair and themes of mortality and ethics."
};

const DeityQuiz = ({ data, onExit }) => {
    const [sessionKey, setSessionKey] = useState(0);

    // Generate quiz questions for this session
    const [quizItems, setQuizItems] = useState(() => getRandomQuizItems(data));
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        setQuizItems(getRandomQuizItems(data));
        setIndex(0);
        setSelected(null);
        setExplanation(null);
        setScore(0);
        setFinished(false);
    }, [sessionKey, data]);

    if (!quizItems.length) return <Box p={4}>Not enough mantras for the quiz!</Box>;

    const cur = quizItems[index];
    const choices = getDeityChoices(data, cur.deity);

    const handleSelect = (choice) => {
        if (selected !== null) return; // Only answer once
        setSelected(choice);
        // Evaluate answer and show explanation
        const correct = choice === cur.deity;
        if (correct) setScore(s => s + 1);
        const deityExplain = deityExplanations[cur.deity] || "No summary available.";
        setExplanation(cor =>
            correct
                ? `Correct! ${deityExplain}`
                : `Incorrect. This mantra is addressed to ${cur.deity}. ${deityExplain}`
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
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', py: 3, px: 6 }}>
            <Button variant="outlined" onClick={onExit} sx={{ mb: 3 }}>
                Back to Quiz Menu
            </Button>
            <Typography variant="h5" sx={{ mb: 2 }} textAlign={'center'}>
                Deity Identification Quiz
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Score: {score} / {quizItems.length}
            </Typography>
            {finished ? (
                <Box textAlign="center" py={6}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
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
                    <Typography sx={{ mb: 2 }}>
                        <b>Question {index + 1} of {quizItems.length}</b>
                    </Typography>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontFamily: 'Noto Sans Devanagari, serif', mb: 2 }}>
                                {cur.sanskrit}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
                                {cur.transliteration}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {cur.translation}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Mandala {cur.mandala}, Sukta {cur.sukta}, Mantra {cur.mantra}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Typography variant="subtitle1">Which deity is this mantra addressed to?</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
                        {choices.map(deity => {
                            const isCorrect = deity === cur.deity;
                            const showCorrect = selected && isCorrect;
                            const showWrong = selected === deity && !isCorrect;
                            return (
                                <Button
                                    key={deity}
                                    variant={selected ? (showCorrect ? 'contained' : showWrong ? 'outlined' : 'text') : 'outlined'}
                                    color={selected ? (showCorrect ? 'success' : showWrong ? 'error' : 'primary') : 'primary'}
                                    sx={{ minWidth: 160, fontWeight: 'bold', mb: 1 }}
                                    disabled={selected !== null}
                                    onClick={() => handleSelect(deity)}
                                >
                                    {deity}
                                </Button>
                            );
                        })}
                    </Stack>
                    {explanation && (
                        <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}>
                            <Typography>{explanation}</Typography>
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

export default DeityQuiz;
