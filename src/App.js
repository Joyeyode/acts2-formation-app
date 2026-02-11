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

// HEBREW/GREEK WORD WINDOWS (From PDF)
const wordWindows = {
    1: {
        hebrew: 'תַּלְמִיד',
        greek: 'μαθητής',
        transliteration: 'Talmid / mathētēs',
        meaning: 'Disciple/apprentice; learner who follows to become',
        formationQ: 'What is one way I will follow Jesus\' way (not just His words) this week?'
    },
    2: {
        hebrew: 'תּוֹרָה',
        transliteration: 'Torah',
        meaning: 'Instruction/teaching (not just "law")',
        formationQ: 'How is Scripture training me, not just informing me?'
    },
    3: {
        hebrew: 'כָּבוֹד',
        transliteration: 'Kāvôd',
        meaning: 'Glory/weightiness—God\'s "heaviness" of worth',
        formationQ: 'Where am I giving weight to things other than God?'
    },
    4: {
        greek: 'κοινωνία',
        transliteration: 'Koinōnia',
        meaning: 'Fellowship/partnership—deep communion',
        formationQ: 'How does the Trinity shape how I relate to others?'
    },
    5: {
        hebrew: 'צֶלֶם',
        transliteration: 'Tselem',
        meaning: 'Image—reflection/representation',
        formationQ: 'How am I reflecting God\'s character this week?'
    },
    6: {
        hebrew: 'חֶסֶד',
        transliteration: 'Ḥesed',
        meaning: 'Steadfast love/covenant mercy',
        formationQ: 'Where do I need to trust God\'s faithful care?'
    },
    7: {
        greek: 'μεταμορφόω',
        transliteration: 'Metamorphoō',
        meaning: 'Transform/transfigure—deep change',
        formationQ: 'What old pattern is God transforming in me?'
    },
    8: {
        greek: 'χάρις',
        transliteration: 'Charis',
        meaning: 'Grace—unearned favor and empowering presence',
        formationQ: 'Where am I living from performance instead of grace?'
    },
    9: {
        hebrew: 'כָּפַר',
        transliteration: 'Kāphar',
        meaning: 'Atonement—cover/reconcile',
        formationQ: 'What am I trying to atone for that Jesus already finished?'
    },
    10: {
        greek: 'σῴζω',
        transliteration: 'Sōzō',
        meaning: 'Save/heal/make whole',
        formationQ: 'What area of my life needs Jesus\' healing touch?'
    },
    11: {
        greek: 'καρπός',
        transliteration: 'Karpos',
        meaning: 'Fruit—evidence of life within',
        formationQ: 'What fruit is the Spirit growing in me right now?'
    },
    12: {
        greek: 'ἀγάπη',
        transliteration: 'Agapē',
        meaning: 'Love—sacrificial, covenant love',
        formationQ: 'How does love shape my words this week?'
    },
    13: {
        greek: 'χάρισμα',
        transliteration: 'Charisma',
        meaning: 'Gift of grace—Spirit-given ability',
        formationQ: 'How am I stewarding the gifts God has given me?'
    },
    14: {
        greek: 'προσευχή',
        transliteration: 'Proseuchē',
        meaning: 'Prayer—partnership with God',
        formationQ: 'Am I praying from striving or from rest?'
    },
    15: {
        hebrew: 'בְּרִית',
        transliteration: 'Berith',
        meaning: 'Covenant—binding relationship',
        formationQ: 'What does covenant community require of me this week?'
    },
    16: {
        greek: 'πάλη',
        transliteration: 'Palē',
        meaning: 'Struggle/wrestling—spiritual warfare',
        formationQ: 'Where am I fighting the wrong enemy?'
    },
    17: {
        greek: 'μάρτυς',
        transliteration: 'Martys',
        meaning: 'Witness—one who testifies',
        formationQ: 'Who needs to hear my story of Jesus this week?'
    },
    18: {
        greek: 'βασιλεία',
        transliteration: 'Basileia',
        meaning: 'Kingdom—reign and realm of God',
        formationQ: 'How does Kingdom citizenship change how I live today?'
    },
    19: {
        hebrew: 'שָׁמַע',
        transliteration: 'Shema',
        meaning: 'Hear/obey—attentive response',
        formationQ: 'How am I discipling those in my home?'
    },
    20: {
        greek: 'φωνή',
        transliteration: 'Phōnē',
        meaning: 'Voice—sound/utterance',
        formationQ: 'Am I listening for God\'s voice or just noise?'
    },
    21: {
        greek: 'παρατίθημι',
        transliteration: 'Paratithēmi',
        meaning: 'Entrust/deposit—pass on faithfully',
        formationQ: 'Who am I investing in as a spiritual mentor?'
    },
    22: {
        greek: 'δόμα',
        transliteration: 'Doma',
        meaning: 'Gift—given by God for the body',
        formationQ: 'How am I honoring the fivefold gifts in the church?'
    },
    23: {
        greek: 'ὑποτάσσω',
        transliteration: 'Hypotassō',
        meaning: 'Submit—voluntary alignment under authority',
        formationQ: 'Where is God calling me to servant leadership?'
    },
    24: {
        greek: 'ἀποστέλλω',
        transliteration: 'Apostellō',
        meaning: 'Send forth—commissioned with authority',
        formationQ: 'How am I living as one sent by Jesus?'
    }
};
const weeklyScripture = {
    1: { passage: "Genesis 12:1-3", focus: "Covenant & Identity" },
    2: { passage: "2 Timothy 3:16-17", focus: "Scripture's Power" },
    3: { passage: "Psalm 8", focus: "God's Majesty" },
    4: { passage: "Matthew 28:19", focus: "The Trinity" },
    5: { passage: "Genesis 1:26-28", focus: "Created Purpose" },
    6: { passage: "Romans 8:28-30", focus: "God's Providence" },
    7: { passage: "Colossians 3:9-10", focus: "New Self" },
    8: { passage: "Romans 8:1-2", focus: "No Condemnation" },
    9: { passage: "Isaiah 53:4-6", focus: "The Cross" },
    10: { passage: "1 Peter 2:24", focus: "Healing & Salvation" },
    11: { passage: "Galatians 5:22-23", focus: "Fruit of Spirit Part 1" },
    12: { passage: "Ephesians 4:29-32", focus: "Fruit of Spirit Part 2" },
    13: { passage: "1 Corinthians 12:4-11", focus: "Spiritual Gifts" },
    14: { passage: "Romans 8:26-27", focus: "Prayer in Spirit" },
    15: { passage: "Acts 2:42-47", focus: "Church Community" },
    16: { passage: "Ephesians 6:10-18", focus: "Armor of God" },
    17: { passage: "Matthew 28:18-20", focus: "Great Commission" },
    18: { passage: "Luke 4:18-19", focus: "Kingdom Living" },
    19: { passage: "Deuteronomy 6:4-9", focus: "Family Discipleship" },
    20: { passage: "John 10:27", focus: "Hearing God's Voice" },
    21: { passage: "2 Timothy 2:2", focus: "Multiplication" },
    22: { passage: "Ephesians 4:11-13", focus: "Fivefold Ministry" },
    23: { passage: "1 Peter 5:1-4", focus: "Servant Leadership" },
    24: { passage: "John 20:21", focus: "Sent Out" }
};

const getDailyTasks = (weekNum) => {
    const scripture = weeklyScripture[weekNum] || weeklyScripture[1];
    return {
        monday: [
            { id: 'm1', task: `Scripture Reading (OIAP): ${scripture.passage}`, time: '20 min', pillar: 'Presence' },
            { id: 'm2', task: 'Doctrine Reading', time: '15 min', pillar: 'Formation' }
        ],
        tuesday: [
            { id: 't1', task: `Scripture Reading (OIAP): ${scripture.passage}`, time: '20 min', pillar: 'Presence' },
            { id: 't2', task: 'Practice Rep', time: '10 min', pillar: 'Formation' }
        ],
        wednesday: [
            { id: 'w1', task: `Scripture Reading (OIAP): ${scripture.passage}`, time: '20 min', pillar: 'Presence' },
            { id: 'w2', task: `Chavruta Small Group - ${scripture.focus}`, time: '90 min', pillar: 'Connection' }
        ],
        thursday: [
            { id: 'th1', task: `Scripture Reading (OIAP): ${scripture.passage}`, time: '20 min', pillar: 'Presence' },
            { id: 'th2', task: 'Hebrew/Greek Study', time: '15 min', pillar: 'Formation' }
        ],
        friday: [
            { id: 'f1', task: 'Shabbat Preparation', time: '15 min', pillar: 'Presence' },
            { id: 'f3', task: 'Cease • Delight • Bless', time: 'Evening', pillar: 'Presence' }
        ],
        saturday: [
            { id: 's1', task: `Reflection: ${scripture.focus}`, time: '15 min', pillar: 'Formation' },
            { id: 's4', task: 'Journal + Prayer', time: '20 min', pillar: 'Presence' }
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

// PROGRAM START DATE - February 11, 2026 (Week 1, Day 3 = Tuesday)
const PROGRAM_START_DATE = new Date('2026-02-11');

// Calculate current week and day based on program start date
const getProgramWeekAndDay = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // Calculate days since program start
    const timeDiff = today.getTime() - PROGRAM_START_DATE.getTime();
    const daysSinceStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Program started on Tuesday (day 3 of week 1)
    // Week runs Sunday-Saturday, so we need to calculate which week we're in
    // Feb 11 (Tue) = Week 1, Day 3
    // Feb 15 (Sat) = Week 1, Day 7
    // Feb 16 (Sun) = Week 2, Day 1
    
    // Days before program start in week 1 (Sun, Mon = 2 days)
    const daysBeforeStart = 2; // Sunday and Monday before Feb 11
    
    // Adjusted days = daysSinceStart + daysBeforeStart (to account for partial first week)
    const adjustedDays = daysSinceStart + daysBeforeStart;
    
    // Calculate week number (0-indexed weeks, then add 1)
    let weekNum = Math.floor(adjustedDays / 7) + 1;
    
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

  // Fetch scripture when week changes
  useEffect(() => {
    const getScripture = async () => {
      setScriptureLoading(true);
      const passage = weeklyScripture[currentWeekNum]?.passage;
      console.log(`Fetching scripture for week ${currentWeekNum}:`, passage);
      if (passage) {
        const text = await fetchScripture(passage);
        console.log(`Scripture fetched:`, text ? `${text.substring(0, 100)}...` : 'null');
        setScriptureText(text || '');
      }
      setScriptureLoading(false);
    };
    getScripture();
  }, [currentWeekNum]);

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

                                    {/* Formation Question */}
                                    {wordWindows[currentWeekNum]?.formationQ && (
                                        <div style={{ background: colors.bgPrimary, padding: '12px', borderRadius: '8px', marginBottom: '12px', borderLeft: `3px solid ${colors.teal}` }}>
                                            <p style={{ margin: '0 0 6px 0', fontSize: '0.75rem', fontWeight: 'bold', color: colors.teal }}>
                                                FORMATION QUESTION
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic', color: colors.textSecondary }}>
                                                "{wordWindows[currentWeekNum].formationQ}"
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
                                            WEEKLY SCRIPTURE
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.5' }}>
                                        {scriptureLoading ? (
                                            <span style={{ opacity: 0.7 }}>Loading scripture...</span>
                                        ) : scriptureText ? (
                                            scriptureText
                                        ) : (
                                            <span style={{ opacity: 0.8 }}>
                                                {weeklyScripture[currentWeekNum]?.passage || 'Scripture unavailable'}
                                            </span>
                                        )}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', fontWeight: '600', margin: '8px 0 0 0', opacity: 0.9 }}>
                                        {weeklyScripture[currentWeekNum]?.focus || ''}
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
                                    <div key={task.id} onClick={() => toggleTask(task.id)} style={{
                                        background: colors.bgSecondary, padding: '15px', borderRadius: '12px', display: 'flex',
                                        alignItems: 'center', gap: '15px', cursor: 'pointer', borderLeft: `5px solid ${colors.teal}`,
                                        border: `1px solid ${colors.border}`
                                    }}>
                                        <div style={{ width: '20px', height: '20px', border: `2px solid ${colors.teal}`,
                                            borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: completedTasks[`${currentWeekNum}-${currentDay}-${task.id}`] ? colors.teal : 'transparent'
                                        }}>
                                            {completedTasks[`${currentWeekNum}-${currentDay}-${task.id}`] && <Check size={14} color="white" />}
                                        </div>
                                 <div style={{ flex: 1 }}>
                    <div style={{ 
                        fontWeight: 'bold', 
                        color: colors.textPrimary,
                        textDecoration: completedTasks[`${currentWeekNum}-${currentDay}-${task.id}`] ? 'line-through' : 'none'
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
        </div>
    );
}