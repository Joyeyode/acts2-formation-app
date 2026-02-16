import React, { useState, useEffect } from 'react';
import { Calendar, Check, BookOpen, Users, Star, ChevronRight, Heart, ArrowLeft, BookMarked, Moon, Sun, Bell, Settings, X } from 'lucide-react';
import { OIAPContent } from './resources/OIAPContent';
import { ChavrutaContent } from './resources/ChavrutaContent';
import { ShabbatContent } from './resources/ShabbatContent';
import { HebrewContent } from './resources/HebrewContent';
import { DisciplinesContent } from './resources/DisciplinesContent';
import { ReflectionContent } from './resources/ReflectionContent';
import { fetchScripture } from './services/bibleService';
import { getNotificationPrefs, saveNotificationPrefs, requestNotificationPermission, scheduleReminder, isNotificationSupported } from './services/notificationService';
import { submitUserProfile } from './services/firebaseService';
import { AdminDashboard } from './AdminDashboard';
import { Analytics } from '@vercel/analytics/react';

// --- STATIC DATA ---
// Updated to match PDF Workbook v56
const weeks = [
    // PHASE 1: Becoming a Disciple (Weeks 1-12)
    { week: 1, title: "Covenant & Identity", theme: "I belong on purpose", phase: 1, pillars: "Formation • Presence" },
    { week: 2, title: "Scripture & Revelation", theme: "The Word shapes me", phase: 1, pillars: "Formation" },
    { week: 3, title: "God: Attributes & Awe", theme: "God we worship", phase: 1, pillars: "Formation" },
    { week: 4, title: "The Trinity: God We Worship", theme: "God we worship", phase: 1, pillars: "Formation • Presence" },
    { week: 5, title: "Creation: Identity + Purpose", theme: "Made with meaning", phase: 1, pillars: "Formation • Presence" },
    { week: 6, title: "Providence: Trusting God's Care", theme: "He holds tomorrow", phase: 1, pillars: "Formation" },
    { week: 7, title: "Image of God + Maturity", theme: "Reflecting Jesus", phase: 1, pillars: "Formation" },
    { week: 8, title: "Grace Identity vs Shame", theme: "I am who He says", phase: 1, pillars: "Formation • Presence" },
    { week: 9, title: "Atonement: The Cross", theme: "Finished work", phase: 1, pillars: "Formation" },
    { week: 10, title: "Salvation + Healing", theme: "Wholeness is here", phase: 1, pillars: "Formation" },
    { week: 11, title: "Holy Spirit: Fruit Part 1", theme: "Character forming", phase: 1, pillars: "Presence" },
    { week: 12, title: "Fruit Part 2 + Communication", theme: "Love speaks truth", phase: 1, pillars: "Presence • Connection • Formation" },
    
    // PHASE 2: Making Disciples (Weeks 13-24)
    { week: 13, title: "Gifts of the Spirit", theme: "Empowered to serve", phase: 2, pillars: "Equipping" },
    { week: 14, title: "Prayer + Tongues", theme: "Spirit language", phase: 2, pillars: "Presence" },
    { week: 15, title: "Covenant Community", theme: "Church as family", phase: 2, pillars: "Connection" },
    { week: 16, title: "Spiritual Warfare", theme: "Armed with truth", phase: 2, pillars: "Presence • Connection • Formation" },
    { week: 17, title: "Mission + Witness", theme: "Love tells the story", phase: 2, pillars: "Outreach" },
    { week: 18, title: "Kingdom Living", theme: "My story matters", phase: 2, pillars: "Equipping • Outreach • Formation" },
    { week: 19, title: "Discipleship in the Home", theme: "Investing in others", phase: 2, pillars: "Equipping • Outreach • Formation" },
    { week: 20, title: "Hearing God", theme: "Walking together", phase: 2, pillars: "Formation" },
    { week: 21, title: "Mentoring + Multiplication", theme: "Generations forming", phase: 2, pillars: "Equipping • Outreach • Formation" },
    { week: 22, title: "Fivefold Gifts", theme: "All for His glory", phase: 2, pillars: "Equipping" },
    { week: 23, title: "Leadership Under Authority", theme: "Sent out with power", phase: 2, pillars: "Equipping" },
    { week: 24, title: "Commissioning + Sending", theme: "Go and make disciples", phase: 2, pillars: "Outreach" }
];

// "SAY IT OUT LOUD" DECLARATIONS (From PDF)
const sayItOutLoud = {
    1: "I don't heal in hiding. I belong before I behave. I'm not performing for family—I'm forming in family.",
    2: "Scripture is God's voice, not my mirror. I read to be transformed, not to be right.",
    3: "God is worthy of my worship, wonder, and whole life. I anchor in His character, not my circumstances.",
    4: "The Trinity is not a puzzle to solve—it's a family to enter. Father, Son, Spirit: I am invited in.",
    5: "I am made in God's image with divine purpose. My worth is not earned; it is embedded.",
    6: "God holds my past, present, and future. I trust His providence even when I can't see His plan.",
    7: "I am being conformed to the image of Christ. Maturity is becoming like Jesus, not just knowing about Him.",
    8: "Grace defines me—not shame, not performance, not past failure. I am who God says I am.",
    9: "The Cross is finished. I don't add to it; I live from it.",
    10: "Jesus didn't just save my soul—He heals my whole life. Salvation brings wholeness.",
    11: "The Spirit's fruit grows in me through surrender, not striving. I cooperate with His work.",
    12: "Love speaks truth. My words build up or tear down. I choose life-giving communication.",
    13: "The Spirit empowers me with gifts to serve the body. I steward what He gives.",
    14: "Prayer is partnership with God. Tongues are my Spirit-language—bold, unfiltered access.",
    15: "I am family, not just attender. Covenant community is where I belong and grow.",
    16: "I fight from victory, not for victory. The battle is real, but Christ has won.",
    17: "Mission is not a program—it's my life. I witness with presence, story, and love.",
    18: "The Kingdom is here and coming. I live as a citizen of Heaven now.",
    19: "My home is a discipleship lab. I don't just attend church—I build it at my table.",
    20: "God still speaks. I tune my heart to hear His voice above the noise.",
    21: "I invest in others so they invest in others. Discipleship multiplies generations.",
    22: "God gifts His church with apostles, prophets, evangelists, shepherds, teachers. I honor and activate my role.",
    23: "I lead by serving. Authority flows from submission to Christ and care for people.",
    24: "I am sent. This isn't the end—it's the beginning of a life on mission."
};

// WEEK EXPECTATIONS (What to Expect This Week)
const weekExpectations = {
    1: "This week is orientation, not overload. We are building the covenant foundation that holds everything else. Because discipleship without covenant becomes performance—and performance always burns out. So we're establishing three anchors: (1) God adopts you into a family, (2) Scripture forms you like a mirror and a map, and (3) community is not optional—it's the environment where formation happens.",
    2: "This week we build the backbone of discipleship: a Word-centered life. Not random verses. Not vibes. A formed mind, a trained heart, and a disciplined reading practice. You'll learn the difference between reading the Bible for information and letting the Bible read you for transformation—and you'll practice OIAP with hermeneutical integrity (exegesis, not eisegesis).",
    3: "This week is about upgrading your picture of God. Many believers love God, but relate to Him through a distorted lens—projecting pain, authority wounds, or shame onto the Father. Doctrine corrects distortion. Worship grows when God is seen clearly.",
    4: "This week we don't 'figure God out'—we learn to worship God rightly. The Trinity is not a puzzle; it's a revelation. When you see Father, Son, and Spirit working together, you stop treating God like a vending machine and start relating to Him as covenant love. Trinity doctrine also heals attachment wounds.",
    5: "This week we go back to the beginning—not for trivia, but for identity. If you don't know what you are, you won't know what you're for. Creation doctrine tells you: you are made, named, and sent. It also clarifies warfare: the enemy attacks image, purpose, and peace.",
    6: "You'll sit in Matthew 6 and Joseph's story and practice a new internal script: from anxiety-driven control to covenantal trust. You'll also learn a core family systems lens—because God often forms us inside relationships, patterns, and pressures, not outside of them.",
    7: "We're going to ground your identity in Scripture (Genesis 1, Psalm 139, Ephesians 2) and then connect that identity to maturity—how humans actually grow over time. We'll practice the discipline of silence (not emptiness—presence), and we'll use a developmental lens (Erikson) to name where you may be stuck and how discipleship repairs what life interrupted.",
    8: "We're going to watch shame enter the human story (Genesis 3), then watch Jesus dismantle shame with love (Luke 15). We'll anchor your heart in Romans 8:1 (no condemnation) and Hebrews 4:14–16 (bold access). Then we'll practice solitude—not isolation, but intentional presence with God—so you can hear grace louder than accusation.",
    9: "We will read Isaiah 53 and Mark 15 with sober honesty and deep gratitude. You'll learn what atonement means, why the cross is necessary, and how Jesus' suffering heals more than your record—it heals your identity. Then we'll practice Scripture memorization as a discipline for replacing strongholds with truth you can actually carry when life hits.",
    10: "We'll read John 3 and Ephesians 2 and let grace reset the foundation. Then we'll practice fasting (not religious punishment—training the will and the appetites). We'll also use a Life Model lens (Type A / Type B trauma) to name how pain shapes patterns—and how God restores you to relational maturity. Finally, we'll take a leadership baseline (MLQ-informed) to identify your default drift under stress.",
    11: "We'll sit in Galatians 5 and John 15 and learn the difference between striving and abiding. We'll practice gratitude as a discipline that reorients your attention from scarcity to God's presence. And we'll use an Emotional Intelligence framework to build awareness: naming emotions, reading signals, and responding with wisdom instead of impulse.",
    12: "We'll build a biblical communication framework from Ephesians 4 and James 1, then practice the discipline of control of the tongue. You'll learn assertive communication (not passive, not passive-aggressive) and you'll write a repair script you can actually use. This week also includes a leadership checkpoint: building your personal leadership micro Rule of Life—follow-through + repair as a lifestyle.",
    13: "We'll read 1 Corinthians 12 and Acts 6 and learn why gifts require love, order, and maturity. You'll practice compassion as a discipline—because discipleship without compassion becomes control. You'll also build your '3 Names List' and identify one 'Person of Peace' (Luke 10) as your first outreach rep in Phase 2.",
    14: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Prayer as formation with traction - not hype, but reps. Learning to walk in the Spirit with order and love.",
    15: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Church as covenant family, not just organization. Hospitality/table rep - inviting your Person of Peace to connection.",
    16: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Enemy Mode vs Relational Mode. Learning to fight lies, not people.",
    17: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Sharing a 2-3 minute testimony and offering a simple prayer. Permission-based witness with clear next steps.",
    18: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Integrating holiness, justice, and mercy as Kingdom lifestyle. Boaz models righteousness, generosity, and covenant faithfulness.",
    19: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Parenting styles and discipleship within the home. Encouragement/blessing others.",
    20: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Discernment grid for hearing God's voice without hype or manipulation.",
    21: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Mentor map - identifying one person to disciple for 90 days. Making the ask.",
    22: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Fivefold markers (apostle, prophet, evangelist, shepherd, teacher) for equipping the body.",
    23: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. Leadership styles assessment. Rest and Sabbath review. Leading under love, not control.",
    24: "This week is about formation with traction: Scripture in your hands, Jesus in your center, and one clear practice you can actually repeat. You're not just learning information—you're rehearsing a new way of living. 90-day Rule of Life. Disciple-making plan submission. Finishing faithful with hope fixed on Christ's return."
};

// HEBREW/GREEK WORD WINDOWS (From Acts 2 Formation PDF)
const wordWindows = {
    1: {
        hebrew: 'תַּלְמִיד',
        greek: 'μαθητής',
        transliteration: 'Talmid / mathētēs',
        meaning: 'Disciple/apprentice; learner who follows to become.',
        formationQ: 'What is one way I will follow Jesus\' way (not just His words) this week?'
    },
    2: {
        hebrew: 'תְּשׁוּבָה',
        greek: 'μετάνοια',
        transliteration: 'Teshuvah / metanoia',
        meaning: 'Return/repent; a changed mind that turns the body.',
        formationQ: 'Where am I returning to Jesus in a concrete choice?'
    },
    3: {
        hebrew: 'אֱמוּנָה',
        greek: 'πίστις',
        transliteration: 'Emunah / pistis',
        meaning: 'Faithfulness/trust; reliance that shows up in action.',
        formationQ: 'What would obedience look like if I trusted Jesus here?'
    },
    4: {
        hebrew: 'חֶסֶד',
        greek: 'ἀγάπη',
        transliteration: 'Hesed / agapē',
        meaning: 'Covenant love; loyal love that moves first.',
        formationQ: 'Who do I need to love with covenant consistency this week?'
    },
    5: {
        hebrew: 'קָדוֹשׁ',
        greek: 'ἅγιος',
        transliteration: 'Kadosh / hagios',
        meaning: 'Holy/set-apart; distinct for God\'s purposes.',
        formationQ: 'What boundary or practice sets me apart to God this week?'
    },
    6: {
        hebrew: 'שָׁלוֹם',
        greek: 'εἰρήνη',
        transliteration: 'Shalom / eirēnē',
        meaning: 'Wholeness/peace; integration under God.',
        formationQ: 'Where do I need peace through repair rather than avoidance?'
    },
    7: {
        hebrew: 'עוֹל',
        greek: 'ζυγός',
        transliteration: 'Yoke / zygos',
        meaning: 'A way of life under a teacher.',
        formationQ: 'What is Jesus\' \'easy yoke\' inviting me to release and receive?'
    },
    8: {
        hebrew: 'חַבְרוּתָא',
        transliteration: 'Chavruta',
        meaning: 'Paired learning through dialogue and holy wrestling.',
        formationQ: 'What question do I need to bring into community instead of hiding?'
    },
    9: {
        hebrew: 'ַרוּח',
        greek: 'πνεῦμα',
        transliteration: 'Ruach / pneuma',
        meaning: 'Spirit/breath; God\'s empowering presence.',
        formationQ: 'Where do I need the Spirit\'s power instead of my striving?'
    },
    10: {
        greek: 'ἐκκλησία',
        transliteration: 'Ekklesia',
        meaning: 'The called-out assembly; the church as a people on mission.',
        formationQ: 'How will I show up as the church—not just attend church?'
    },
    11: {
        greek: 'χαρίσματα',
        transliteration: 'Charismata',
        meaning: 'Grace-gifts for building up the Body.',
        formationQ: 'Which gift might God be stirring—and how will I use it in love?'
    },
    12: {
        greek: 'διακονία',
        transliteration: 'Diakonia',
        meaning: 'Service/ministry; love in action.',
        formationQ: 'Where is my next act of service meant to be worship?'
    },
    13: {
        greek: 'εὐαγγέλιον',
        transliteration: 'Euangelion',
        meaning: 'Good news; the announcement of Jesus\' reign.',
        formationQ: 'How will I speak and show the gospel with clarity and compassion?'
    },
    14: {
        greek: 'μαθητεύσατε',
        transliteration: 'Matheteusate',
        meaning: 'Make disciples; apprentice others into Jesus\' way.',
        formationQ: 'Who is one person I will intentionally invest in this week?'
    },
    15: {
        greek: 'παρακαλέω',
        transliteration: 'Parakaleo',
        meaning: 'Encourage/exhort/comfort; strengthening others\' courage.',
        formationQ: 'Who needs strengthening—and what will I actually say/do?'
    },
    16: {
        greek: 'κοινωνία',
        transliteration: 'Koinonia',
        meaning: 'Fellowship/participation; shared life.',
        formationQ: 'What does covenant community require of me this week?'
    },
    17: {
        greek: 'σωφροσύνη',
        transliteration: 'Sōphrosynē',
        meaning: 'Sound mind/self-control; Spirit-led restraint.',
        formationQ: 'Where is self-control a form of love in my relationships?'
    },
    18: {
        greek: 'δύναμις',
        transliteration: 'Dunamis',
        meaning: 'Power; capacity supplied by God.',
        formationQ: 'Where do I need power for witness, not performance?'
    },
    19: {
        greek: 'λογισμοί',
        transliteration: 'Logismoi',
        meaning: 'Thought patterns/reasonings.',
        formationQ: 'Which thought pattern must be replaced with truth this week?'
    },
    20: {
        greek: 'νικάω',
        transliteration: 'Nikaō',
        meaning: 'To overcome/conquer.',
        formationQ: 'What am I overcoming this week—and what is my next faithful step?'
    },
    21: {
        greek: 'πίστις + πρᾶξις',
        transliteration: 'Pistis + Praxis',
        meaning: 'Trust that becomes practice.',
        formationQ: 'What is one repeatable rep that will shape me over time?'
    },
    22: {
        greek: 'οἶκος',
        transliteration: 'Oikos',
        meaning: 'Household network; relational field for ministry.',
        formationQ: 'Where is God sending me within my natural relationships?'
    },
    23: {
        hebrew: 'מָרַנָא תָּא',
        greek: 'μαρὰν ἀθά',
        transliteration: 'Maranatha',
        meaning: '\'Our Lord, come\'—hope that fuels holiness.',
        formationQ: 'How does hope change the way I endure and lead today?'
    },
    24: {
        hebrew: 'ַשָׁלִיח',
        greek: 'ἀπόστολος',
        transliteration: 'Shaliach / apostolos',
        meaning: 'Sent one; commissioned representative.',
        formationQ: 'Where am I being sent—and how will I carry Jesus well?'
    }
};
const dailyScripture = {
    1: { monday: "Acts 2:42-47", tuesday: "1 Peter 2:9-10", wednesday: "Deuteronomy 6:4-9", thursday: "John 15:1-11", focus: "Covenant & Identity" },
    2: { monday: "2 Timothy 3:14-17", tuesday: "Psalm 119:9-16", wednesday: "Acts 17:10-12", thursday: "John 17:17", focus: "Scripture & Revelation" },
    3: { monday: "Exodus 34:6-7", tuesday: "Psalm 145", wednesday: "Isaiah 6:1-8", thursday: "Romans 11:33-36", focus: "God: Attributes & Awe" },
    4: { monday: "Matthew 3:13-17", tuesday: "John 1:1-18", wednesday: "2 Corinthians 13:14", thursday: "Ephesians 1:3-14", focus: "The Trinity" },
    5: { monday: "Genesis 1:26-28", tuesday: "Psalm 19", wednesday: "Colossians 1:15-20", thursday: "Romans 8:18-25", focus: "Creation & Purpose" },
    6: { monday: "Matthew 6:25-34", tuesday: "Genesis 50:20", wednesday: "Romans 8:28", thursday: "James 1:2-5", focus: "Providence" },
    7: { monday: "Psalm 139", tuesday: "Genesis 1:26-28", wednesday: "Ephesians 2:1-10", thursday: "2 Corinthians 5:17", focus: "Image of God & Maturity" },
    8: { monday: "Genesis 3", tuesday: "Luke 15", wednesday: "Romans 8:1", thursday: "Hebrews 4:14-16", focus: "Grace vs Shame" },
    9: { monday: "Isaiah 53", tuesday: "Mark 15", wednesday: "Hebrews 9", thursday: "1 Peter 2:24", focus: "Atonement: The Cross" },
    10: { monday: "John 3", tuesday: "Ephesians 2:8-10", wednesday: "Titus 3:4-7", thursday: "Romans 5:1-5", focus: "Salvation & Stabilization" },
    11: { monday: "Galatians 5:16-26", tuesday: "John 15", wednesday: "Romans 12", thursday: "Psalm 1", focus: "Fruit of Spirit Part 1" },
    12: { monday: "Ephesians 4:25-32", tuesday: "James 1:19-27", wednesday: "Proverbs 15", thursday: "Colossians 3:12-17", focus: "Fruit Part 2: Speech" },
    13: { monday: "1 Corinthians 12", tuesday: "Romans 12:3-8", wednesday: "1 Peter 4:10-11", thursday: "Acts 6", focus: "Gifts of the Spirit" },
    14: { monday: "Acts 2:1-21", tuesday: "1 Corinthians 14", wednesday: "Jude 20-21", thursday: "1 Thessalonians 5:16-18", focus: "Prayer & Tongues" },
    15: { monday: "Acts 2:42-47", tuesday: "Ephesians 4:1-16", wednesday: "1 Peter 2:4-10", thursday: "Hebrews 10:24-25", focus: "Covenant Community" },
    16: { monday: "Ephesians 6:10-18", tuesday: "2 Corinthians 10:3-5", wednesday: "James 4:7-8", thursday: "1 Peter 5:8-10", focus: "Spiritual Warfare" },
    17: { monday: "Matthew 28:18-20", tuesday: "Acts 8", wednesday: "Romans 10", thursday: "2 Corinthians 5:17-21", focus: "Mission & Witness" },
    18: { monday: "Micah 6:8", tuesday: "Matthew 5-7", wednesday: "James 2", thursday: "Isaiah 58", focus: "Kingdom Living" },
    19: { monday: "Deuteronomy 6", tuesday: "Ephesians 6:1-4", wednesday: "Proverbs 4", thursday: "Colossians 3:12-17", focus: "Discipleship in Home" },
    20: { monday: "John 10", tuesday: "1 Kings 19", wednesday: "Acts 13:1-3", thursday: "Romans 8:14", focus: "Hearing God's Voice" },
    21: { monday: "2 Timothy 2:1-2", tuesday: "Titus 2", wednesday: "Colossians 1:28-29", thursday: "Acts 18", focus: "Mentoring & Multiplication" },
    22: { monday: "Ephesians 4:7-16", tuesday: "1 Corinthians 12", wednesday: "Acts 11-13", thursday: "1 Peter 4:10-11", focus: "Fivefold Gifts" },
    23: { monday: "Mark 10:42-45", tuesday: "Philippians 2:1-11", wednesday: "1 Peter 5:1-4", thursday: "Proverbs 11:14", focus: "Leadership Under Love" },
    24: { monday: "Revelation 21", tuesday: "Hebrews 12:1-2", wednesday: "2 Timothy 4:6-8", thursday: "1 Peter 1:3-9", focus: "Commissioning & Hope" }
};

const requiredReadings = {
    1: { title: "Week 1 - Covenant & Identity", readings: ["Jones Intro pp. 1–10", "Pearlman: Introduction — The Nature/Value/Classification/System of Doctrine", "Calhoun: Rule for Life pp. 37–41"] },
    2: { title: "Week 2 - Scripture & Revelation", readings: ["Jones (2nd ed.) — Ch. 2: Knowing God: Doctrines of Revelation and Scripture (pp. 31–54)", "Pearlman — Ch. 1: The Scriptures (I. Need p.17; II. Inspiration p.19; III. Verification p.25)", "Calhoun: Fixed-Hour Prayer (pp. 250–253), Listening Prayer (pp. 266–268)"] },
    3: { title: "Week 3 - God: Attributes & Awe", readings: ["Jones (2nd ed.) — Ch. 2: Knowing God (pp. 31–54)", "Pearlman — Ch. 2: God (I. Existence p.33; II. Nature p.50; III. Attributes p.57)", "Calhoun: Celebration (pp. 28–30)"] },
    4: { title: "Week 4 - The Trinity", readings: ["Jones (2nd ed.) — Ch. 3: Doctrine of the Trinity (pp. 55–76)", "Pearlman — Ch. 2: God (IV. Trinity p.68)", "Calhoun: Holy Communion (pp. 34–36)"] },
    5: { title: "Week 5 - Creation & Purpose", readings: ["Jones (2nd ed.) — Ch. 4: Doctrines of Creation and Providence (pp. 77–86)", "Pearlman — Ch. 3: Angels (I. Angels p.81; II. Satan p.85; III. Wicked Spirits p.91)", "Calhoun: Discernment (pp. 109–113)"] },
    6: { title: "Week 6 - Providence", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.) — Chapter 4, pp. 87–96", "Myer Pearlman — Chapter 4: Man (Origin p.97; Nature p.101; God's Image p.115)", "Calhoun (Spiritual Disciplines Handbook) — Confession & Self-Examination, pp. 101–104"] },
    7: { title: "Week 7 - Image of God & Maturity", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.) — Chapter 5, pp. 97–116", "Myer Pearlman — Chapter 5: Sin (Fact p.121; Origin p.124; Nature p.129; Consequences p.134)", "Calhoun (Spiritual Disciplines Handbook) — Silence, pp. 121–124"] },
    8: { title: "Week 8 - Grace vs Shame", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.) — Chapter 6, pp. 117–140", "Myer Pearlman — Chapter 6: The Lord Jesus Christ (Nature p.141; Offices p.165; Work p.171)", "Calhoun (Spiritual Disciplines Handbook) — Solitude, pp. 128–131"] },
    9: { title: "Week 9 - Atonement: The Cross", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.) — Chapter 7, pp. 141–153", "Myer Pearlman — Chapter 7: The Atonement (OT p.185; NT p.195)", "Calhoun (Spiritual Disciplines Handbook) — Memorization, pp. 194–196"] },
    10: { title: "Week 10 - Salvation & Stabilization", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.) — Chapter 7, pp. 154–166", "Myer Pearlman — Chapter 8: Salvation (Nature p.219; Justification p.227; Regeneration p.242; Sanctification p.249; Security p.267)", "Calhoun (Spiritual Disciplines Handbook) — Fasting, pp. 245–249"] },
    11: { title: "Week 11 - Holy Spirit: Fruit Part 1", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.) — Chapter 8, pp. 167–178", "Myer Pearlman — Chapter 9: The Holy Spirit (Nature p.281; OT p.290; In Christ p.298; Human Experience p.303)", "Calhoun (Spiritual Disciplines Handbook) — Gratitude, pp. 31–33"] },
    12: { title: "Week 12 - Fruit Part 2: Speech", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.) — Chapter 8, pp. 179–190", "Myer Pearlman — Chapter 9: The Holy Spirit (Gifts p.320; In the Church p.335)", "Calhoun (Spiritual Disciplines Handbook) — Control of the Tongue, pp. 208–211"] },
    13: { title: "Week 13 - Gifts of the Spirit", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.) — Chapter 9, pp. 191–202", "Myer Pearlman — Chapter 9: The Holy Spirit (Gifts p.320)", "Calhoun (Spiritual Disciplines Handbook) — Compassion, pp. 205–207"] },
    14: { title: "Week 14 - Prayer & Tongues", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.): Jones Ch9 pp. 203–214", "Pearlman: Ch. 9 — The Holy Spirit", "Calhoun (Spiritual Disciplines Handbook): Praying Scripture pp. 278–280"] },
    15: { title: "Week 15 - Covenant Community", readings: ["Jones Ch10 pp. 215–226", "Pearlman — Ch. 10: The Church (Nature p.345; Founding p.348; Membership p.349)", "Calhoun: Community pp. 149–151"] },
    16: { title: "Week 16 - Spiritual Warfare", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.): Jones Ch10 pp. 227–236", "Pearlman: Ch. 3 — Angels", "Calhoun (Spiritual Disciplines Handbook): Intercessory Prayer pp. 258–261"] },
    17: { title: "Week 17 - Mission & Witness", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.): Jones Benediction pp. 237–238", "Pearlman: Ch. 10 — The Church", "Calhoun (Spiritual Disciplines Handbook): Witness pp. 180–182"] },
    18: { title: "Week 18 - Kingdom Living", readings: ["Jones review (Creation/Providence ethics)", "Pearlman — Ch. 8: Salvation (Sanctification p.249)", "Calhoun: Justice pp. 218–220"] },
    19: { title: "Week 19 - Discipleship in Home", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.): Jones review (Image of God)", "Pearlman: Ch. 4 — Man", "Calhoun (Spiritual Disciplines Handbook): Encouragement/Blessing Others pp. 198–201"] },
    20: { title: "Week 20 - Hearing God", readings: ["Jones (Practicing Christian Doctrine, 2nd ed.): Jones review (Pneumatology)", "Pearlman: Ch. 9 — The Holy Spirit", "Calhoun (Spiritual Disciplines Handbook): Listening Prayer pp. 266–268"] },
    21: { title: "Week 21 - Mentoring & Multiplication", readings: ["Jones review (theology shapes life)", "Pearlman — Ch. 10: The Church (Organization p.359)", "Calhoun: Mentoring pp. 164–166"] },
    22: { title: "Week 22 - Fivefold Gifts", readings: ["Pearlman — Ch. 10: The Church (Work p.351)", "Calhoun: Discipling pp. 155–157"] },
    23: { title: "Week 23 - Leadership Under Love", readings: ["Jones review (Trinity shapes leadership)", "Pearlman — Ch. 2: God (Attributes p.57)", "Calhoun: Rest pp. 74–76 + Sabbath review pp. 42–45"] },
    24: { title: "Week 24 - Commissioning & Hope", readings: ["Jones Ch10 review pp. 215–236 + Benediction pp. 237–238", "Pearlman — Ch. 11: The Last Things (Death p.361; Resurrection p.370; Second Coming p.385)", "Calhoun: Prayer of Recollection pp. 281–283"] }
};

const getDailyTasks = (weekNum) => {
    const dailyReading = dailyScripture[weekNum] || dailyScripture[1];
    return {
        monday: [
            { id: 'm1', task: `Scripture Reading (OIAP): ${dailyReading.monday}`, time: '20 min', pillar: 'Presence' },
            { id: 'm2', task: 'Required Reading', time: '15 min', pillar: 'Formation', isRequired: true, weekNum }
        ],
        tuesday: [
            { id: 't1', task: `Scripture Reading (OIAP): ${dailyReading.tuesday}`, time: '20 min', pillar: 'Presence' },
            { id: 't2', task: 'Practice Rep', time: '10 min', pillar: 'Formation' }
        ],
        wednesday: [
            { id: 'w1', task: `Scripture Reading (OIAP): ${dailyReading.wednesday}`, time: '20 min', pillar: 'Presence' },
            { id: 'w2', task: `Chavruta Small Group - ${dailyReading.focus}`, time: '90 min', pillar: 'Connection', isCharvruta: true }
        ],
        thursday: [
            { id: 'th1', task: `Scripture Reading (OIAP): ${dailyReading.thursday}`, time: '20 min', pillar: 'Presence' },
            { id: 'th2', task: 'Hebrew/Greek Study', time: '15 min', pillar: 'Formation', isWordWindow: true, weekNum }
        ],
        friday: [
            { id: 'f1', task: 'Shabbat Preparation', time: '15 min', pillar: 'Presence', isShabbat: true },
            { id: 'f3', task: 'Cease • Delight • Bless', time: 'Evening', pillar: 'Presence' }
        ],
        saturday: [
            { id: 's1', task: `Reflection: ${dailyReading.focus}`, time: '15 min', pillar: 'Formation' },
            { id: 's4', task: 'Journal + Prayer', time: '20 min', pillar: 'Presence', isReflection: true }
        ],
        sunday: [
            { id: 'su1', task: 'Gathered Worship', time: '90 min', pillar: 'Presence' },
            { id: 'su2', task: 'Response Step', time: '15 min', pillar: 'Formation' }
        ]
    };
};

const resourceContent = {
    oiap: OIAPContent,
    chavruta: ChavrutaContent,
    shabbat: ShabbatContent,
    hebrew: HebrewContent,
    disciplines: DisciplinesContent,
    reflection: ReflectionContent
};

const resources = [
    { title: 'OIAP Method Guide', desc: 'Observe • Interpret • Apply • Proclaim', icon: BookOpen, key: 'oiap' },
    { title: 'Chavruta Discussion', desc: 'Text-based, question-driven learning', icon: Users, key: 'chavruta' },
    { title: 'Shabbat Rhythm', desc: 'Cease • Delight • Bless', icon: Heart, key: 'shabbat' },
    { title: 'Hebrew/Greek Studies', desc: 'Talmid-style deep dives', icon: BookOpen, key: 'hebrew' },
    { title: 'Spiritual Disciplines', desc: 'Prayer, fasting, solitude, service', icon: Star, key: 'disciplines' },
    { title: 'Reflection Questions', desc: 'Journal prompts for transformation', icon: BookOpen, key: 'reflection' }
];

// RESOURCE DETAIL COMPONENT
// COMPLETE ResourceDetailView - handles ALL content types
const ResourceDetailView = ({ resourceKey, onBack, darkMode }) => {
    const resource = resourceContent[resourceKey];
    const colors = darkMode ? {
      teal: '#1B9AAA',
      darkBlue: '#0F172A',
      lightTeal: '#1E3A3A',
      white: '#FFFFFF',
      bgPrimary: '#0F172A',
      bgSecondary: '#1A2332',
      textPrimary: '#F1F5F9',
      textSecondary: '#CBD5E1',
      border: '#334155'
    } : {
      teal: '#1B9AAA',
      darkBlue: '#2C3E50',
      lightTeal: '#E8F4F5',
      white: '#FFFFFF',
      bgPrimary: '#F8FAFB',
      bgSecondary: '#FFFFFF',
      textPrimary: '#2C3E50',
      textSecondary: '#64748B',
      border: '#E2E8F0'
    };
    
    if (!resource) return null;

    return (
        <div style={{ padding: '20px', paddingBottom: '100px', overflowY: 'auto', maxHeight: 'calc(100vh - 160px)', backgroundColor: colors.bgPrimary, color: colors.textPrimary }}>
            {/* Back Button */}
            <button onClick={onBack} style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', background: 'none', 
                border: 'none', color: colors.teal, fontSize: '16px', fontWeight: '600', 
                cursor: 'pointer', padding: '16px 0', marginBottom: '16px' 
            }}>
                <ArrowLeft size={20} /> Back to Resources
            </button>

            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkBlue} 100%)`,
                color: colors.white, padding: '32px 24px', borderRadius: '16px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                    {resource.title}
                </h1>
                <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>{resource.subtitle}</p>
            </div>

            {/* Intro */}
            {resource.intro && (
                <div style={{ background: colors.lightTeal, padding: '20px', borderRadius: '12px',
                    marginBottom: '24px', borderLeft: `4px solid ${colors.teal}` }}>
                    <p style={{ color: colors.textPrimary, lineHeight: '1.6', margin: 0 }}>{resource.intro}</p>
                </div>
            )}

            {/* STEPS (OIAP) */}
            {resource.steps && resource.steps.map((step, idx) => (
                <div key={idx} style={{ background: colors.bgSecondary, border: `2px solid ${colors.teal}`,
                    borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '32px' }}>{step.icon}</span>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.teal, margin: 0 }}>
                            {step.step}
                        </h3>
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '16px' }}>
                        {step.description}
                    </p>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {step.details.map((detail, dIdx) => (
                            <li key={dIdx} style={{ color: colors.textSecondary, opacity: 0.8, marginBottom: '8px', lineHeight: '1.5' }}>
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* MOVEMENTS (Shabbat) */}
            {resource.movements && resource.movements.map((movement, idx) => (
                <div key={idx} style={{ background: colors.bgSecondary, border: `2px solid ${colors.teal}`,
                    borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '32px' }}>{movement.icon}</span>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.teal, margin: 0 }}>
                            {movement.movement}
                        </h3>
                    </div>
                    <p style={{ fontSize: '14px', fontStyle: 'italic', color: colors.textSecondary, marginBottom: '12px' }}>
                        {movement.subtitle}
                    </p>
                    <p style={{ color: colors.textPrimary, lineHeight: '1.6', marginBottom: '16px' }}>
                        {movement.description}
                    </p>
                    <div style={{ background: colors.lightTeal, padding: '16px', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: colors.teal, marginBottom: '12px', marginTop: 0 }}>
                            PRACTICES:
                        </h4>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {movement.practices.map((practice, pIdx) => (
                                <li key={pIdx} style={{ color: colors.textPrimary, marginBottom: '8px', lineHeight: '1.5' }}>
                                    {practice}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}

            {/* SECTIONS (Chavruta - general sections with heading and content/steps) */}
            {resource.sections && resource.sections.map((section, idx) => (
                <div key={idx} style={{ marginBottom: '24px' }}>
                    <h3 style={{ color: colors.textPrimary, fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
                        {section.heading}
                    </h3>
                    {section.content && (
                        <p style={{ color: colors.textSecondary, lineHeight: '1.6', marginBottom: '16px' }}>
                            {section.content}
                        </p>
                    )}
                    {section.steps && section.steps.map((step, sIdx) => (
                        <div key={sIdx} style={{ background: colors.bgSecondary, padding: '16px', borderRadius: '12px', 
                            marginBottom: '12px', border: `1px solid ${colors.border}` }}>
                            <div style={{ fontWeight: 'bold', color: colors.teal, marginBottom: '6px' }}>
                                {step.title}
                            </div>
                            <div style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: '1.5' }}>
                                {step.description}
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {/* EXAMPLES (Hebrew) */}
            {resource.examples && (
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '16px' }}>
                        Example Word Studies
                    </h2>
                    {resource.examples.map((example, idx) => (
                        <div key={idx} style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}`,
                            borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.teal, marginBottom: '4px', marginTop: 0 }}>
                                {example.word}
                            </h3>
                            <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '12px' }}>
                                {example.language} • "{example.englishTranslation}"
                            </div>
                            <p style={{ color: colors.textPrimary, lineHeight: '1.6', marginBottom: '12px' }}>
                                <strong>Full Meaning:</strong> {example.fullMeaning}
                            </p>
                            <div style={{ background: colors.lightTeal, padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: colors.teal, marginBottom: '4px', marginTop: 0 }}>
                                    💡 INSIGHT:
                                </p>
                                <p style={{ fontSize: '14px', color: colors.textPrimary, lineHeight: '1.5', margin: 0 }}>
                                    {example.insight}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CATEGORIES (Disciplines & Reflection) */}
            {resource.categories && resource.categories.map((category, idx) => (
                <div key={idx} style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '8px' }}>
                        {category.type || category.category}
                    </h2>
                    {category.subtitle && (
                        <p style={{ fontSize: '14px', fontStyle: 'italic', color: colors.textSecondary, marginBottom: '16px' }}>
                            {category.subtitle}
                        </p>
                    )}
                    {category.practices && category.practices.map((practice, pIdx) => (
                        <div key={pIdx} style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}`,
                            borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.teal, marginBottom: '8px', marginTop: 0 }}>
                                {practice.name}
                            </h3>
                            <p style={{ color: colors.textPrimary, lineHeight: '1.6', marginBottom: '12px' }}>
                                {practice.description}
                            </p>
                            <div style={{ background: colors.lightTeal, padding: '12px', borderRadius: '8px' }}>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: colors.teal, marginBottom: '4px', marginTop: 0 }}>
                                    Why It Matters:
                                </p>
                                <p style={{ fontSize: '14px', color: colors.textPrimary, lineHeight: '1.5', margin: 0 }}>
                                    {practice.why}
                                </p>
                            </div>
                        </div>
                    ))}
                    {category.questions && (
                        <div style={{ background: colors.lightTeal, padding: '20px', borderRadius: '12px', marginTop: '16px' }}>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {category.questions.map((question, qIdx) => (
                                    <li key={qIdx} style={{ color: colors.textPrimary, marginBottom: '12px', lineHeight: '1.5', fontSize: '15px' }}>
                                        {question}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}

            {/* QUESTION TYPES (Chavruta) */}
            {resource.questionTypes && (
                <div style={{ marginTop: '32px' }}>
                    <h3 style={{ color: colors.textPrimary, fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Discussion Starters
                    </h3>
                    {resource.questionTypes.map((qt, idx) => (
                        <div key={idx} style={{ background: colors.bgSecondary, padding: '16px', borderRadius: '12px', 
                            marginBottom: '12px', border: `1px solid ${colors.border}` }}>
                            <div style={{ fontWeight: 'bold', color: colors.teal, display: 'flex', 
                                alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span>{qt.icon}</span> {qt.type}
                            </div>
                            <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'none' }}>
                                {qt.examples.map((ex, eIdx) => (
                                    <li key={eIdx} style={{ fontSize: '14px', color: colors.textSecondary, 
                                        marginBottom: '6px', paddingLeft: '0' }}>
                                        • {ex}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* GUIDELINES (Chavruta) */}
            {resource.guidelines && (
                <div style={{ marginTop: '32px' }}>
                    <h3 style={{ color: colors.textPrimary, fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Guidelines for Success
                    </h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {resource.guidelines.map((guide, idx) => (
                            <div key={idx} style={{ background: colors.bgSecondary, padding: '16px', borderRadius: '12px', 
                                border: `1px solid ${colors.border}` }}>
                                <div style={{ fontWeight: 'bold', color: colors.teal, marginBottom: '4px' }}>
                                    {guide.title}
                                </div>
                                <div style={{ fontSize: '14px', color: colors.textSecondary }}>
                                    {guide.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SCHEDULE (Shabbat) */}
            {resource.schedule && (
                <div style={{ marginTop: '32px', background: colors.bgSecondary, padding: '20px', borderRadius: '16px', 
                    border: `1px solid ${colors.border}` }}>
                    <h3 style={{ color: colors.teal, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', marginTop: 0 }}>
                        {resource.schedule.title}
                    </h3>
                    {resource.schedule.timeline.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '12px', padding: '8px 0', 
                            borderBottom: idx !== resource.schedule.timeline.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                            <span style={{ fontWeight: 'bold', minWidth: '80px', color: colors.teal, fontSize: '14px' }}>
                                {item.time}
                            </span>
                            <span style={{ color: colors.textPrimary, fontSize: '14px' }}>{item.activity}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* FAQ (Shabbat) */}
            {resource.faqs && (
                <div style={{ marginTop: '32px' }}>
                    <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Common Questions
                    </h3>
                    {resource.faqs.map((faq, idx) => (
                        <div key={idx} style={{ marginBottom: '16px' }}>
                            <div style={{ fontWeight: 'bold', color: colors.teal, fontSize: '14px', marginBottom: '4px' }}>
                                Q: {faq.question}
                            </div>
                            <div style={{ color: colors.textSecondary, fontSize: '14px', lineHeight: '1.4' }}>
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SCRIPTURE FOUNDATION */}
            {resource.scripture && (
                <div style={{ background: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkBlue} 100%)`,
                    color: colors.white, padding: '24px', borderRadius: '16px', marginTop: '32px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', opacity: 0.9 }}>
                        FOUNDATION SCRIPTURE
                    </div>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '12px', fontStyle: 'italic' }}>
                        "{resource.scripture.text}"
                    </p>
                    <div style={{ fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>
                        — {resource.scripture.reference}
                    </div>
                </div>
            )}
        </div>
    );
};

// SHABBAT REMINDER COMPONENT
const ShabbatReminder = ({ currentDay, colors }) => {
    if (currentDay !== 'friday') return null;
    
    return (
        <div style={{ 
            background: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkBlue} 100%)`,
            color: 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(27, 154, 170, 0.3)'
        }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🕯️</div>
            <h3 style={{ 
                margin: 0, 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '8px'
            }}>
                Shabbat Begins Tonight
            </h3>
            <p style={{ 
                margin: '0', 
                fontSize: '0.9rem',
                opacity: 0.95,
                letterSpacing: '1px'
            }}>
                Cease • Delight • Bless
            </p>
            <p style={{
                margin: '12px 0 0 0',
                fontSize: '0.8rem',
                opacity: 0.85,
                fontStyle: 'italic'
            }}>
                Step out of the chaos of doing and into the peace of being
            </p>
        </div>
    );
};

// PILLAR BADGE COMPONENT
// eslint-disable-next-line no-unused-vars
const PillarBadge = ({ pillars, colors }) => {
    if (!pillars) return null;
    
    return (
        <div style={{
            display: 'inline-block',
            background: colors.lightTeal,
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: colors.teal,
            marginTop: '8px'
        }}>
            🏛️ {pillars}
        </div>
    );
};

// PHASE BANNER COMPONENT
const PhaseBanner = ({ phase, title, description, colors }) => {
    return (
        <div style={{ 
            background: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkBlue} 100%)`,
            color: 'white', 
            padding: '24px', 
            borderRadius: '16px', 
            marginBottom: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
        }}>
            <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600',
                opacity: 0.9,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px'
            }}>
                Phase {phase}
            </div>
            <h2 style={{ 
                margin: 0, 
                fontSize: '1.4rem',
                fontWeight: 'bold',
                marginBottom: '8px'
            }}>
                {title}
            </h2>
            <p style={{ 
                margin: 0, 
                fontSize: '0.9rem', 
                opacity: 0.9,
                lineHeight: '1.4'
            }}>
                {description}
            </p>
        </div>
    );
};

// PROGRAM START DATE - February 16, 2026 (Week 1, Day 1 = Monday)
const PROGRAM_START_DATE = new Date('2026-02-16');

// Calculate current week and day based on program start date
const getProgramWeekAndDay = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // Calculate days since program start
    const timeDiff = today.getTime() - PROGRAM_START_DATE.getTime();
    const daysSinceStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Program started on Monday Feb 16, 2026 (Week 1, Day 1)
    // Week runs Monday-Sunday
    // Feb 16 (Mon) = Week 1, Day 1
    // Feb 22 (Sun) = Week 1, Day 7
    // Feb 23 (Mon) = Week 2, Day 1
    
    // Adjusted days = daysSinceStart + 1 (to make day 0 = day 1 of week)
    const adjustedDays = daysSinceStart + 1;
    
    // Calculate week number (0-indexed weeks, then add 1)
    let weekNum = Math.floor((adjustedDays - 1) / 7) + 1;
    
    // Clamp to valid range (1-24)
    if (weekNum < 1) weekNum = 1;
    if (weekNum > 24) weekNum = 24;
    
    // If before program start, default to week 1
    if (daysSinceStart < 0) weekNum = 1;
    
    return {
        weekNum,
        dayName: days[dayOfWeek]
    };
};

// MAIN APP COMPONENT
export default function App() {
  // Get program-calculated week and day
  const programSchedule = getProgramWeekAndDay();
  
  // Initialize state
  const [currentWeekNum, setCurrentWeekNum] = useState(() => {
    // Use program-calculated week (ignoring saved value to always sync with actual date)
    return programSchedule.weekNum;
  });

  const [currentDay, setCurrentDay] = useState(() => {
    return programSchedule.dayName;
});
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('acts2_activeTab');
    return saved || 'today';
});
  const [activeResource, setActiveResource] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('acts2_completedTasks');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [scriptureText, setScriptureText] = useState('');
  const [scriptureLoading, setScriptureLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('acts2_darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [notificationPrefs, setNotificationPrefs] = useState(getNotificationPrefs);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsSupported] = useState(isNotificationSupported());
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('acts2_userProfile');
    return saved ? JSON.parse(saved) : { name: '', email: '', phone: '' };
  });
  const [submissionStatus, setSubmissionStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [submissionError, setSubmissionError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(() => {
    return localStorage.getItem('acts2_profileSubmitted') === 'true';
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const [showRequiredReading, setShowRequiredReading] = useState(false);
  const [selectedRequiredWeek, setSelectedRequiredWeek] = useState(null);
  const [showWordWindow, setShowWordWindow] = useState(false);
  const [selectedWordWindow, setSelectedWordWindow] = useState(null);

    useEffect(() => {
    localStorage.setItem('acts2_currentWeek', currentWeekNum.toString());
    localStorage.setItem('acts2_completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('acts2_activeTab', activeTab);
    localStorage.setItem('acts2_darkMode', JSON.stringify(darkMode));
    localStorage.setItem('acts2_userProfile', JSON.stringify(userProfile));
}, [currentWeekNum, completedTasks, activeTab, darkMode, userProfile]);

  // Initialize notifications when component mounts
  useEffect(() => {
    if (notificationsSupported && notificationPrefs.enabled) {
      scheduleReminder(currentWeekNum, currentDay);
    }
  }, [notificationPrefs.enabled, notificationsSupported, currentWeekNum, currentDay]);

  // Fetch scripture when week or day changes
  useEffect(() => {
    const getScripture = async () => {
      setScriptureLoading(true);
      const dailyReading = dailyScripture[currentWeekNum];
      // Only fetch for Mon-Thu
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday'];
      const passage = validDays.includes(currentDay) && dailyReading ? dailyReading[currentDay] : null;
      console.log(`Fetching scripture for week ${currentWeekNum}, day ${currentDay}:`, passage);
      if (passage) {
        const text = await fetchScripture(passage);
        console.log(`Scripture fetched:`, text ? `${text.substring(0, 100)}...` : 'null');
        setScriptureText(text || '');
      } else {
        setScriptureText('');
      }
      setScriptureLoading(false);
    };
    getScripture();
  }, [currentWeekNum, currentDay]);

    const colors = darkMode ? {
      teal: '#1B9AAA',
      darkBlue: '#0F172A',
      lightTeal: '#1E3A3A',
      white: '#FFFFFF',
      bgPrimary: '#0F172A',
      bgSecondary: '#1A2332',
      textPrimary: '#F1F5F9',
      textSecondary: '#CBD5E1',
      border: '#334155'
    } : {
      teal: '#1B9AAA',
      darkBlue: '#2C3E50',
      lightTeal: '#E8F4F5',
      white: '#FFFFFF',
      bgPrimary: '#F8FAFB',
      bgSecondary: '#FFFFFF',
      textPrimary: '#2C3E50',
      textSecondary: '#64748B',
      border: '#E2E8F0'
    };
    const currentWeekData = weeks.find(w => w.week === currentWeekNum) || weeks[0];
    const dailyTasks = getDailyTasks(currentWeekNum);

    // eslint-disable-next-line no-unused-vars
    const getWeekProgress = () => {
        const total = Object.values(dailyTasks).flat().length;
        const completed = Object.keys(completedTasks).filter(k => k.startsWith(`${currentWeekNum}-`)).length;
        return Math.round((completed / total) * 100) || 0;
    };

    const toggleTask = (taskId) => {
        const key = `${currentWeekNum}-${currentDay}-${taskId}`;
        setCompletedTasks(prev => {
            const newSet = { ...prev };
            if (newSet[key]) delete newSet[key];
            else newSet[key] = true;
            return newSet;
        });
    };

    if (showAdmin) {
        return <AdminDashboard onBack={() => setShowAdmin(false)} />;
    }

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: colors.bgPrimary, 
            position: 'relative', paddingBottom: '80px', fontFamily: 'sans-serif', color: colors.textPrimary }}>
            
            <header style={{ backgroundColor: colors.teal, color: 'white', padding: '20px', 
    borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
    <button onClick={() => setDarkMode(!darkMode)} style={{ 
      position: 'absolute', top: '20px', right: '80px', background: 'white', 
      border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' 
    }}>
      {darkMode ? <Sun size={20} color="#FFB800" /> : <Moon size={20} color="#0F172A" />}
    </button>
    <button onClick={() => setShowAdmin(!showAdmin)} style={{ 
      position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.2)', 
      border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' 
    }} title="Admin Dashboard">
      <Users size={20} color="white" />
    </button>
    <button onClick={() => setShowSettings(!showSettings)} style={{ 
      position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', 
      border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' 
    }}>
      {showSettings ? <X size={20} color="white" /> : <Settings size={20} color="white" />}
    </button>
    <img 
    src="/images/col-logo.png" 
    alt="Center of Life Church" 
    style={{ width: '80%', maxWidth: '400px', height: 'auto', marginBottom: '12px' }}
/>
    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Acts 2 Formation</h1>
    <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.8 }}>Center of Life Church</p>
</header>

            <main style={{ padding: '20px' }}>
                {activeResource ? (
                    <ResourceDetailView resourceKey={activeResource} onBack={() => setActiveResource(null)} darkMode={darkMode} />
                ) : (
                    <>
                        {activeTab === 'today' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ background: colors.bgSecondary, padding: '20px', borderRadius: '15px', 
                                    boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}` }}>
                                    <span style={{ color: colors.teal, fontWeight: 'bold', fontSize: '0.8rem' }}>
                                        WEEK {currentWeekNum} • {currentWeekData.pillars}
                                    </span>
                                    <h2 style={{ margin: '5px 0 10px 0', color: colors.teal }}>{currentWeekData.title}</h2>
                                    <p style={{ fontStyle: 'italic', margin: '0 0 12px 0', opacity: 0.7, color: colors.textSecondary }}>"{currentWeekData.theme}"</p>
                                    
                                    {/* Say It Out Loud Declaration */}
                                    <div style={{ background: colors.bgPrimary, padding: '12px', borderRadius: '8px', marginBottom: '12px', borderLeft: `3px solid ${colors.teal}` }}>
                                        <p style={{ margin: '0 0 6px 0', fontSize: '0.75rem', fontWeight: 'bold', color: colors.teal }}>
                                            SAY IT OUT LOUD
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: colors.textPrimary, fontWeight: '500', fontStyle: 'italic' }}>
                                            "{sayItOutLoud[currentWeekNum]}"
                                        </p>
                                    </div>

                                    {/* Word Window */}
                                    {wordWindows[currentWeekNum] && (
                                        <div style={{ background: colors.bgPrimary, padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                                            <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 'bold', color: colors.teal }}>
                                                WORD WINDOW
                                            </p>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: colors.textPrimary }}>
                                                {wordWindows[currentWeekNum].hebrew && <span style={{ fontFamily: 'serif' }}>{wordWindows[currentWeekNum].hebrew} </span>}
                                                {wordWindows[currentWeekNum].greek && <span style={{ fontFamily: 'serif' }}>{wordWindows[currentWeekNum].greek}</span>}
                                            </p>
                                            <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: colors.textPrimary }}>
                                                <em>{wordWindows[currentWeekNum].transliteration}</em>
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: colors.textSecondary }}>
                                                {wordWindows[currentWeekNum].meaning}
                                            </p>
                                        </div>
                                    )}

                                    {/* What to Expect This Week */}
                                    {weekExpectations[currentWeekNum] && (
                                        <div style={{ background: colors.bgPrimary, padding: '12px', borderRadius: '8px', marginBottom: '12px', borderLeft: `3px solid ${colors.teal}` }}>
                                            <p style={{ margin: '0 0 6px 0', fontSize: '0.75rem', fontWeight: 'bold', color: colors.teal }}>
                                                WHAT TO EXPECT THIS WEEK
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5', color: colors.textPrimary }}>
                                                {weekExpectations[currentWeekNum]}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {/* Scripture Card */}
                                <div style={{ background: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkBlue} 100%)`,
                                    color: 'white', padding: '20px', borderRadius: '15px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <BookMarked size={18} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', opacity: 0.9 }}>
                                            {['monday', 'tuesday', 'wednesday', 'thursday'].includes(currentDay) ? 'TODAY\'S SCRIPTURE' : 'WEEKLY FOCUS'}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.5' }}>
                                        {scriptureLoading ? (
                                            <span style={{ opacity: 0.7 }}>Loading scripture...</span>
                                        ) : scriptureText ? (
                                            scriptureText
                                        ) : (
                                            <span style={{ opacity: 0.8 }}>
                                                {['monday', 'tuesday', 'wednesday', 'thursday'].includes(currentDay) 
                                                    ? dailyScripture[currentWeekNum]?.[currentDay] || 'Scripture unavailable'
                                                    : 'Reflect on this week\'s theme during rest, worship, and prayer'}
                                            </span>
                                        )}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', fontWeight: '600', margin: '8px 0 0 0', opacity: 0.9 }}>
                                        {dailyScripture[currentWeekNum]?.focus || ''}
                                    </p>
                                </div>

                                {/* Shabbat Reminder - shows on Friday */}
                                <ShabbatReminder currentDay={currentDay} colors={colors} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(d => (
                                        <button key={d} onClick={() => setCurrentDay(d)} style={{
                                            flex: 1, padding: '8px 0', fontSize: '10px', borderRadius: '8px', border: 'none',
                                            backgroundColor: currentDay === d ? colors.teal : colors.bgSecondary,
                                            color: currentDay === d ? 'white' : colors.textPrimary, cursor: 'pointer',
                                            borderBottom: currentDay === d ? 'none' : `1px solid ${colors.border}`
                                        }}>
                                            {d.slice(0,3).toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                {dailyTasks[currentDay].map(task => (
                                    <div key={task.id} onClick={() => {
                                        if (task.isRequired) {
                                            setSelectedRequiredWeek(task.weekNum);
                                            setShowRequiredReading(true);
                                        } else if (task.isCharvruta) {
                                            setActiveResource('chavruta');
                                            setActiveTab('resources');
                                        } else if (task.isShabbat) {
                                            setActiveResource('shabbat');
                                            setActiveTab('resources');
                                        } else if (task.isReflection) {
                                            setActiveResource('reflection');
                                            setActiveTab('resources');
                                        } else if (task.isWordWindow) {
                                            setSelectedWordWindow(task.weekNum);
                                            setShowWordWindow(true);
                                        } else {
                                            toggleTask(task.id);
                                        }
                                    }} style={{
                                        background: colors.bgSecondary, padding: '15px', borderRadius: '12px', display: 'flex',
                                        alignItems: 'center', gap: '15px', cursor: 'pointer', borderLeft: `5px solid ${colors.teal}`,
                                        border: `1px solid ${colors.border}`
                                    }}>
                                        <div style={{ width: '20px', height: '20px', border: `2px solid ${colors.teal}`,
                                            borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: (task.isRequired || task.isCharvruta || task.isShabbat || task.isReflection || task.isWordWindow) ? 'transparent' : (completedTasks[`${currentWeekNum}-${currentDay}-${task.id}`] ? colors.teal : 'transparent')
                                        }}>
                                            {!task.isRequired && !task.isCharvruta && !task.isShabbat && !task.isReflection && !task.isWordWindow && completedTasks[`${currentWeekNum}-${currentDay}-${task.id}`] && <Check size={14} color="white" />}
                                            {task.isRequired && <BookOpen size={14} color={colors.teal} />}
                                            {task.isCharvruta && <Users size={14} color={colors.teal} />}
                                            {task.isShabbat && <Heart size={14} color={colors.teal} />}
                                            {task.isReflection && <Heart size={14} color={colors.teal} />}
                                            {task.isWordWindow && <BookMarked size={14} color={colors.teal} />}
                                        </div>
                                 <div style={{ flex: 1 }}>
                    <div style={{ 
                        fontWeight: 'bold', 
                        color: colors.textPrimary,
                        textDecoration: !task.isRequired && completedTasks[`${currentWeekNum}-${currentDay}-${task.id}`] ? 'line-through' : 'none'
                    }}>
                        {task.task}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, color: colors.textSecondary }}>
                        {task.time} • {task.pillar}
                    </div>
                  </div>
		</div>
    		))}
   		</div>
)}

{activeTab === 'progress' && (
    <div style={{ padding: '20px' }}>
                                <PhaseBanner 
                                    phase={1}
                                    title="Becoming a Disciple"
                                    description="Weeks 1-12 • Foundations, Identity, Healing, Doctrine"
                                    colors={colors}
                                />
                                {weeks.filter(w => w.phase === 1).map(w => (
                                    <div key={w.week} onClick={() => {setCurrentWeekNum(w.week); setActiveTab('today');}}
                                        style={{ background: colors.bgSecondary, padding: '15px', borderRadius: '10px', marginBottom: '10px',
                                        border: `1px solid ${colors.border}`, cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold', color: colors.textPrimary }}>Week {w.week}: {w.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: colors.teal, fontWeight: '600', marginTop: '4px' }}>
                                                    {w.pillars}
                                                </div>
                                            </div>
                                            <ChevronRight size={18} color={colors.textSecondary} />
                                        </div>
                                    </div>
                                ))}
                                <PhaseBanner 
                                    phase={2}
                                    title="Making Disciples"
                                    description="Weeks 13-24 • Gifts, Mission, Multiplication, Commissioning"
                                    colors={colors}
                                />
                                {weeks.filter(w => w.phase === 2).map(w => (
                                    <div key={w.week} onClick={() => {setCurrentWeekNum(w.week); setActiveTab('today');}}
                                        style={{ background: colors.bgSecondary, padding: '15px', borderRadius: '10px', marginBottom: '10px',
                                        border: `1px solid ${colors.border}`, cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold', color: colors.textPrimary }}>Week {w.week}: {w.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: colors.teal, fontWeight: '600', marginTop: '4px' }}>
                                                    {w.pillars}
                                                </div>
                                            </div>
                                            <ChevronRight size={18} color={colors.textSecondary} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div>
                                <h2 style={{ color: colors.textPrimary, marginBottom: '10px' }}>Formation Resources</h2>
                                <p style={{ fontSize: '0.9rem', color: colors.textSecondary, opacity: 0.7, marginBottom: '20px' }}>
                                    Tools and guides for your discipleship journey
                                </p>
                               {resources.map((resource, idx) => (
                                    <div key={idx} onClick={() => setActiveResource(resource.key)} style={{
                                        background: colors.bgSecondary, padding: '20px', borderRadius: '12px', marginBottom: '12px',
                                        cursor: 'pointer', borderLeft: `5px solid ${colors.teal}`, textAlign: 'center', border: `1px solid ${colors.border}`
                                    }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px',
                                            background: darkMode ? colors.lightTeal : colors.lightTeal, display: 'inline-flex', alignItems: 'center', 
                                            justifyContent: 'center', marginBottom: '12px'
                                        }}>
                                            <resource.icon size={24} color={colors.teal} />
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: colors.textPrimary, marginBottom: '4px' }}>
                                            {resource.title}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: colors.textSecondary }}>{resource.desc}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', backgroundColor: colors.bgSecondary,
                display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: `1px solid ${colors.border}`,
                maxWidth: '480px', margin: '0 auto' }}>
                <button onClick={() => {
                    // Sync to current program week and day when Today is clicked
                    const schedule = getProgramWeekAndDay();
                    setCurrentWeekNum(schedule.weekNum);
                    setCurrentDay(schedule.dayName);
                    setActiveTab('today'); 
                    setActiveResource(null);
                }} style={{
                    background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    color: activeTab === 'today' && !activeResource ? colors.teal : colors.textSecondary, cursor: 'pointer'
                }}>
                    <Calendar size={20} /> <span style={{ fontSize: '10px', color: activeTab === 'today' && !activeResource ? colors.teal : colors.textSecondary }}>Today</span>
                </button>
                <button onClick={() => {setActiveTab('progress'); setActiveResource(null);}} style={{
                    background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    color: activeTab === 'progress' && !activeResource ? colors.teal : colors.textSecondary, cursor: 'pointer'
                }}>
                    <Check size={20} /> <span style={{ fontSize: '10px', color: activeTab === 'progress' && !activeResource ? colors.teal : colors.textSecondary }}>Progress</span>
                </button>
                <button onClick={() => {setActiveTab('resources'); setActiveResource(null);}} style={{
                    background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    color: activeTab === 'resources' || activeResource ? colors.teal : colors.textSecondary, cursor: 'pointer'
                }}>
                    <BookOpen size={20} /> <span style={{ fontSize: '10px', color: activeTab === 'resources' || activeResource ? colors.teal : colors.textSecondary }}>Resources</span>
                </button>
            </nav>

            {/* Settings Modal */}
            {showSettings && (
                <div style={{ 
                    position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto',
                    backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.border}`, 
                    padding: '20px', maxHeight: '50vh', overflowY: 'auto', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                    zIndex: 1000
                }}>
                    {/* User Profile Section */}
                    <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: `1px solid ${colors.border}` }}>
                        <h3 style={{ color: colors.textPrimary, marginTop: 0, marginBottom: '16px' }}>👤 User Profile</h3>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', color: colors.textPrimary, fontWeight: '600', fontSize: '14px' }}>Name</label>
                            <input 
                                type="text" 
                                value={userProfile.name}
                                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                                placeholder="Enter your name"
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '8px',
                                    backgroundColor: colors.bgPrimary, color: colors.textPrimary,
                                    border: `1px solid ${colors.border}`, fontSize: '14px',
                                    boxSizing: 'border-box', fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', color: colors.textPrimary, fontWeight: '600', fontSize: '14px' }}>Email</label>
                            <input 
                                type="email" 
                                value={userProfile.email}
                                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                                placeholder="Enter your email"
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '8px',
                                    backgroundColor: colors.bgPrimary, color: colors.textPrimary,
                                    border: `1px solid ${colors.border}`, fontSize: '14px',
                                    boxSizing: 'border-box', fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', color: colors.textPrimary, fontWeight: '600', fontSize: '14px' }}>Phone (optional)</label>
                            <input 
                                type="tel" 
                                value={userProfile.phone}
                                onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                                placeholder="Enter your phone number"
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '8px',
                                    backgroundColor: colors.bgPrimary, color: colors.textPrimary,
                                    border: `1px solid ${colors.border}`, fontSize: '14px',
                                    boxSizing: 'border-box', fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        
                        {/* Submit Profile Button */}
                        <button
                            onClick={async () => {
                                if (!userProfile.name || !userProfile.email) {
                                    setSubmissionError('Name and email are required');
                                    setSubmissionStatus('error');
                                    return;
                                }
                                
                                setSubmissionStatus('loading');
                                setSubmissionError('');
                                
                                try {
                                    await submitUserProfile(userProfile);
                                    setSubmissionStatus('success');
                                    localStorage.setItem('acts2_profileSubmitted', 'true');
                                    setHasSubmitted(true);
                                    setTimeout(() => setSubmissionStatus(null), 3000);
                                } catch (error) {
                                    setSubmissionStatus('error');
                                    setSubmissionError(error.message || 'Failed to submit profile');
                                    console.error('Submission error:', error);
                                }
                            }}
                            disabled={submissionStatus === 'loading' || hasSubmitted}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px',
                                backgroundColor: hasSubmitted ? colors.teal : colors.teal,
                                color: 'white', border: 'none', cursor: submissionStatus === 'loading' ? 'not-allowed' : 'pointer',
                                fontSize: '14px', fontWeight: '600', opacity: submissionStatus === 'loading' ? 0.7 : 1,
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {submissionStatus === 'loading' ? '⏳ Submitting...' : hasSubmitted ? '✅ Profile Submitted' : '📤 Submit Profile'}
                        </button>
                        
                        {submissionStatus === 'success' && (
                            <p style={{ color: colors.teal, fontSize: '14px', marginTop: '12px', marginBottom: 0 }}>
                                ✅ Profile submitted successfully!
                            </p>
                        )}
                        
                        {submissionStatus === 'error' && (
                            <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '12px', marginBottom: 0 }}>
                                ❌ {submissionError}
                            </p>
                        )}
                    </div>

                    <h3 style={{ color: colors.textPrimary, marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={20} /> Notification Settings
                    </h3>

                    {!notificationsSupported ? (
                        <p style={{ color: colors.textSecondary, fontSize: '14px' }}>
                            📱 Push notifications are not supported in your browser.
                        </p>
                    ) : (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={notificationPrefs.enabled} 
                                        onChange={async (e) => {
                                            if (e.target.checked) {
                                                const granted = await requestNotificationPermission();
                                                if (granted) {
                                                    const newPrefs = { ...notificationPrefs, enabled: true };
                                                    setNotificationPrefs(newPrefs);
                                                    saveNotificationPrefs(newPrefs);
                                                }
                                            } else {
                                                const newPrefs = { ...notificationPrefs, enabled: false };
                                                setNotificationPrefs(newPrefs);
                                                saveNotificationPrefs(newPrefs);
                                            }
                                        }}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span style={{ color: colors.textPrimary, fontWeight: '600' }}>Enable Daily Reminders</span>
                                </label>
                            </div>

                            {notificationPrefs.enabled && (
                                <>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: colors.textPrimary, fontWeight: '600' }}>
                                            Reminder Time
                                        </label>
                                        <input 
                                            type="time" 
                                            value={notificationPrefs.time}
                                            onChange={(e) => {
                                                const newPrefs = { ...notificationPrefs, time: e.target.value };
                                                setNotificationPrefs(newPrefs);
                                                saveNotificationPrefs(newPrefs);
                                            }}
                                            style={{
                                                width: '100%', padding: '8px', borderRadius: '8px',
                                                backgroundColor: colors.bgPrimary, color: colors.textPrimary,
                                                border: `1px solid ${colors.border}`, fontSize: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <p style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '4px' }}>
                                            Get a reminder at {notificationPrefs.time} every day
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '12px' }}>
                                        <p style={{ color: colors.textPrimary, fontWeight: '600', marginBottom: '8px' }}>Reminder Days</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                                <button
                                                    key={day}
                                                    onClick={() => {
                                                        const days = notificationPrefs.days.includes(day)
                                                            ? notificationPrefs.days.filter(d => d !== day)
                                                            : [...notificationPrefs.days, day];
                                                        const newPrefs = { ...notificationPrefs, days };
                                                        setNotificationPrefs(newPrefs);
                                                        saveNotificationPrefs(newPrefs);
                                                    }}
                                                    style={{
                                                        padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                        backgroundColor: notificationPrefs.days.includes(day) ? colors.teal : colors.bgPrimary,
                                                        color: notificationPrefs.days.includes(day) ? 'white' : colors.textSecondary,
                                                        fontSize: '12px', fontWeight: '600',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {day.slice(0, 3).toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Required Reading Modal */}
            {showRequiredReading && selectedRequiredWeek && requiredReadings[selectedRequiredWeek] && (
                <div style={{ 
                    position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto',
                    backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.border}`, 
                    padding: '20px', maxHeight: '70vh', overflowY: 'auto', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                    zIndex: 1000, borderRadius: '16px 16px 0 0'
                }}>
                    {/* Close Button */}
                    <button onClick={() => setShowRequiredReading(false)} style={{
                        position: 'absolute', top: '12px', right: '12px', background: 'none', 
                        border: 'none', color: colors.teal, fontSize: '24px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center'
                    }}>
                        <X size={24} color={colors.teal} />
                    </button>

                    <h2 style={{ color: colors.textPrimary, marginTop: 0, marginBottom: '12px', paddingRight: '32px' }}>
                        📚 {requiredReadings[selectedRequiredWeek].title}
                    </h2>
                    
                    <div style={{ marginTop: '20px' }}>
                        <h3 style={{ color: colors.teal, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                            Required Readings:
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {requiredReadings[selectedRequiredWeek].readings.map((reading, idx) => (
                                <div key={idx} style={{
                                    background: colors.bgPrimary, padding: '16px', borderRadius: '12px',
                                    borderLeft: `4px solid ${colors.teal}`
                                }}>
                                    <p style={{
                                        color: colors.textPrimary, fontSize: '14px', lineHeight: '1.6', 
                                        margin: 0
                                    }}>
                                        {reading}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', paddingBottom: '12px' }}>
                        <button onClick={() => setShowRequiredReading(false)} style={{
                            width: '100%', padding: '12px', borderRadius: '8px',
                            backgroundColor: colors.teal, color: 'white', border: 'none',
                            cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                        }}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Word Window (Hebrew/Greek Study) Modal */}
            {showWordWindow && selectedWordWindow && wordWindows[selectedWordWindow] && (
                <div style={{ 
                    position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto',
                    backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.border}`, 
                    padding: '20px', maxHeight: '70vh', overflowY: 'auto', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                    zIndex: 1000, borderRadius: '16px 16px 0 0'
                }}>
                    {/* Close Button */}
                    <button onClick={() => setShowWordWindow(false)} style={{
                        position: 'absolute', top: '12px', right: '12px', background: 'none', 
                        border: 'none', color: colors.teal, fontSize: '24px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center'
                    }}>
                        <X size={24} color={colors.teal} />
                    </button>

                    <h2 style={{ color: colors.textPrimary, marginTop: 0, marginBottom: '16px', paddingRight: '32px' }}>
                        📖 Word Window - Week {selectedWordWindow}
                    </h2>
                    
                    <div style={{ marginTop: '20px' }}>
                        {/* Hebrew/Greek Word */}
                        <div style={{ background: colors.bgPrimary, padding: '20px', borderRadius: '12px', marginBottom: '16px', border: `2px solid ${colors.teal}` }}>
                            <div style={{ marginBottom: '12px' }}>
                                {wordWindows[selectedWordWindow].hebrew && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <p style={{ color: colors.teal, fontSize: '12px', fontWeight: '600', margin: '0 0 4px 0' }}>Hebrew:</p>
                                        <p style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
                                            {wordWindows[selectedWordWindow].hebrew}
                                        </p>
                                    </div>
                                )}
                                {wordWindows[selectedWordWindow].greek && (
                                    <div>
                                        <p style={{ color: colors.teal, fontSize: '12px', fontWeight: '600', margin: '0 0 4px 0' }}>Greek:</p>
                                        <p style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
                                            {wordWindows[selectedWordWindow].greek}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <p style={{ color: colors.textSecondary, fontSize: '13px', fontStyle: 'italic', margin: '12px 0 0 0' }}>
                                {wordWindows[selectedWordWindow].transliteration}
                            </p>
                        </div>

                        {/* Meaning */}
                        <div style={{ background: colors.bgPrimary, padding: '16px', borderRadius: '12px', marginBottom: '16px', borderLeft: `4px solid ${colors.teal}` }}>
                            <p style={{ color: colors.teal, fontSize: '12px', fontWeight: '600', margin: '0 0 8px 0' }}>Meaning:</p>
                            <p style={{ color: colors.textPrimary, fontSize: '15px', lineHeight: '1.6', margin: '0' }}>
                                {wordWindows[selectedWordWindow].meaning}
                            </p>
                        </div>

                        {/* Formation Question */}
                        <div style={{ background: `linear-gradient(135deg, ${colors.teal}15 0%, ${colors.teal}08 100%)`, padding: '16px', borderRadius: '12px', borderLeft: `4px solid ${colors.teal}` }}>
                            <p style={{ color: colors.teal, fontSize: '12px', fontWeight: '600', margin: '0 0 8px 0' }}>Formation Question:</p>
                            <p style={{ color: colors.textPrimary, fontSize: '15px', lineHeight: '1.6', margin: '0', fontStyle: 'italic' }}>
                                {wordWindows[selectedWordWindow].formationQ}
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', paddingBottom: '12px' }}>
                        <button onClick={() => setShowWordWindow(false)} style={{
                            width: '100%', padding: '12px', borderRadius: '8px',
                            backgroundColor: colors.teal, color: 'white', border: 'none',
                            cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                        }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
            <Analytics />
        </div>
    );
}
