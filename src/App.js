import React, { useState, useEffect } from 'react';
import { Calendar, Check, BookOpen, Users, Star, ChevronRight, Heart, ArrowLeft } from 'lucide-react';
import { OIAPContent } from './resources/OIAPContent';
import { ChavrutaContent } from './resources/ChavrutaContent';
import { ShabbatContent } from './resources/ShabbatContent';
import { HebrewContent } from './resources/HebrewContent';
import { DisciplinesContent } from './resources/DisciplinesContent';
import { ReflectionContent } from './resources/ReflectionContent';

// --- STATIC DATA ---
const weeks = [
    { week: 1, title: "Covenant & Identity", theme: "I belong on purpose", phase: 1 },
    { week: 2, title: "Safety & Belonging", theme: "Trust builds here", phase: 1 },
    { week: 3, title: "Scripture as Formation", theme: "The Word shapes me", phase: 1 },
    { week: 4, title: "The Trinity", theme: "God we worship", phase: 1 },
    { week: 5, title: "Creation: Identity + Purpose", theme: "Made with meaning", phase: 1 },
    { week: 6, title: "Providence: Trusting God's Care", theme: "He holds tomorrow", phase: 1 },
    { week: 7, title: "Image of God + Maturity", theme: "Reflecting Jesus", phase: 1 },
    { week: 8, title: "Grace Identity vs Shame", theme: "I am who He says", phase: 1 },
    { week: 9, title: "Atonement: The Cross", theme: "Finished work", phase: 1 },
    { week: 10, title: "Salvation + Healing", theme: "Wholeness is here", phase: 1 },
    { week: 11, title: "Holy Spirit: Fruit Part 1", theme: "Character forming", phase: 1 },
    { week: 12, title: "Fruit Part 2 + Communication", theme: "Love speaks truth", phase: 1 },
    { week: 13, title: "Gifts of the Spirit", theme: "Empowered to serve", phase: 2 },
    { week: 14, title: "Prayer + Tongues", theme: "Spirit language", phase: 2 },
    { week: 15, title: "Covenant Community", theme: "Church as family", phase: 2 },
    { week: 16, title: "Spiritual Warfare", theme: "Armed with truth", phase: 2 },
    { week: 17, title: "Identity in Battle", theme: "Standing firm", phase: 2 },
    { week: 18, title: "Evangelism Foundations", theme: "Love tells the story", phase: 2 },
    { week: 19, title: "Testimony + Witness", theme: "My story matters", phase: 2 },
    { week: 20, title: "Disciple-Making Begins", theme: "Investing in others", phase: 2 },
    { week: 21, title: "Mentoring Relationships", theme: "Walking together", phase: 2 },
    { week: 22, title: "Multiplication Mindset", theme: "Generations forming", phase: 2 },
    { week: 23, title: "Stewardship + Calling", theme: "All for His glory", phase: 2 },
    { week: 24, title: "Commissioning + Sending", theme: "Go and make disciples", phase: 2 }
];

const weeklyScripture = {
    1: { passage: "Genesis 12:1-3", focus: "Covenant & Identity" },
    2: { passage: "Psalm 91", focus: "Safety in God" },
    3: { passage: "2 Timothy 3:16-17", focus: "Scripture's Power" },
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
    17: { passage: "2 Corinthians 10:3-5", focus: "Spiritual Battle" },
    18: { passage: "Matthew 28:18-20", focus: "Great Commission" },
    19: { passage: "Acts 1:8", focus: "Witnesses" },
    20: { passage: "2 Timothy 2:2", focus: "Disciple-Making" },
    21: { passage: "Titus 2:3-5", focus: "Mentoring" },
    22: { passage: "Acts 2:41-47", focus: "Multiplication" },
    23: { passage: "1 Peter 4:10-11", focus: "Stewardship" },
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
const ResourceDetailView = ({ resourceKey, onBack }) => {
    const resource = resourceContent[resourceKey];
    const colors = { teal: '#1B9AAA', darkBlue: '#2C3E50', lightTeal: '#E8F4F5', white: '#FFFFFF' };
    
    if (!resource) return null;

    return (
        <div style={{ padding: '20px', paddingBottom: '100px', overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
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
                    <p style={{ color: colors.darkBlue, lineHeight: '1.6', margin: 0 }}>{resource.intro}</p>
                </div>
            )}

            {/* STEPS (OIAP) */}
            {resource.steps && resource.steps.map((step, idx) => (
                <div key={idx} style={{ background: 'white', border: `2px solid ${colors.teal}`,
                    borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '32px' }}>{step.icon}</span>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.teal, margin: 0 }}>
                            {step.step}
                        </h3>
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: colors.darkBlue, marginBottom: '16px' }}>
                        {step.description}
                    </p>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {step.details.map((detail, dIdx) => (
                            <li key={dIdx} style={{ color: colors.darkBlue, opacity: 0.8, marginBottom: '8px', lineHeight: '1.5' }}>
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* MOVEMENTS (Shabbat) */}
            {resource.movements && resource.movements.map((movement, idx) => (
                <div key={idx} style={{ background: 'white', border: `2px solid ${colors.teal}`,
                    borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '32px' }}>{movement.icon}</span>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.teal, margin: 0 }}>
                            {movement.movement}
                        </h3>
                    </div>
                    <p style={{ fontSize: '14px', fontStyle: 'italic', color: colors.darkBlue, marginBottom: '12px' }}>
                        {movement.subtitle}
                    </p>
                    <p style={{ color: colors.darkBlue, lineHeight: '1.6', marginBottom: '16px' }}>
                        {movement.description}
                    </p>
                    <div style={{ background: colors.lightTeal, padding: '16px', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: colors.teal, marginBottom: '12px', marginTop: 0 }}>
                            PRACTICES:
                        </h4>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {movement.practices.map((practice, pIdx) => (
                                <li key={pIdx} style={{ color: colors.darkBlue, marginBottom: '8px', lineHeight: '1.5' }}>
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
                    <h3 style={{ color: colors.darkBlue, fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
                        {section.heading}
                    </h3>
                    {section.content && (
                        <p style={{ color: colors.darkBlue, lineHeight: '1.6', marginBottom: '16px' }}>
                            {section.content}
                        </p>
                    )}
                    {section.steps && section.steps.map((step, sIdx) => (
                        <div key={sIdx} style={{ background: 'white', padding: '16px', borderRadius: '12px', 
                            marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontWeight: 'bold', color: colors.teal, marginBottom: '6px' }}>
                                {step.title}
                            </div>
                            <div style={{ fontSize: '14px', color: colors.darkBlue, opacity: 0.8, lineHeight: '1.5' }}>
                                {step.description}
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {/* EXAMPLES (Hebrew) */}
            {resource.examples && (
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.darkBlue, marginBottom: '16px' }}>
                        Example Word Studies
                    </h2>
                    {resource.examples.map((example, idx) => (
                        <div key={idx} style={{ background: 'white', border: `1px solid ${colors.lightTeal}`,
                            borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.teal, marginBottom: '4px', marginTop: 0 }}>
                                {example.word}
                            </h3>
                            <div style={{ fontSize: '14px', color: colors.darkBlue, opacity: 0.7, marginBottom: '12px' }}>
                                {example.language} • "{example.englishTranslation}"
                            </div>
                            <p style={{ color: colors.darkBlue, lineHeight: '1.6', marginBottom: '12px' }}>
                                <strong>Full Meaning:</strong> {example.fullMeaning}
                            </p>
                            <div style={{ background: colors.lightTeal, padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: colors.teal, marginBottom: '4px', marginTop: 0 }}>
                                    💡 INSIGHT:
                                </p>
                                <p style={{ fontSize: '14px', color: colors.darkBlue, lineHeight: '1.5', margin: 0 }}>
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
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.darkBlue, marginBottom: '8px' }}>
                        {category.type || category.category}
                    </h2>
                    {category.subtitle && (
                        <p style={{ fontSize: '14px', fontStyle: 'italic', color: colors.darkBlue, opacity: 0.7, marginBottom: '16px' }}>
                            {category.subtitle}
                        </p>
                    )}
                    {category.practices && category.practices.map((practice, pIdx) => (
                        <div key={pIdx} style={{ background: 'white', border: `1px solid ${colors.lightTeal}`,
                            borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.teal, marginBottom: '8px', marginTop: 0 }}>
                                {practice.name}
                            </h3>
                            <p style={{ color: colors.darkBlue, lineHeight: '1.6', marginBottom: '12px' }}>
                                {practice.description}
                            </p>
                            <div style={{ background: colors.lightTeal, padding: '12px', borderRadius: '8px' }}>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: colors.teal, marginBottom: '4px', marginTop: 0 }}>
                                    Why It Matters:
                                </p>
                                <p style={{ fontSize: '14px', color: colors.darkBlue, lineHeight: '1.5', margin: 0 }}>
                                    {practice.why}
                                </p>
                            </div>
                        </div>
                    ))}
                    {category.questions && (
                        <div style={{ background: colors.lightTeal, padding: '20px', borderRadius: '12px', marginTop: '16px' }}>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {category.questions.map((question, qIdx) => (
                                    <li key={qIdx} style={{ color: colors.darkBlue, marginBottom: '12px', lineHeight: '1.5', fontSize: '15px' }}>
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
                    <h3 style={{ color: colors.darkBlue, fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Discussion Starters
                    </h3>
                    {resource.questionTypes.map((qt, idx) => (
                        <div key={idx} style={{ background: 'white', padding: '16px', borderRadius: '12px', 
                            marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontWeight: 'bold', color: colors.teal, display: 'flex', 
                                alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span>{qt.icon}</span> {qt.type}
                            </div>
                            <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'none' }}>
                                {qt.examples.map((ex, eIdx) => (
                                    <li key={eIdx} style={{ fontSize: '14px', color: colors.darkBlue, 
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
                    <h3 style={{ color: colors.darkBlue, fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Guidelines for Success
                    </h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {resource.guidelines.map((guide, idx) => (
                            <div key={idx} style={{ background: 'white', padding: '16px', borderRadius: '12px', 
                                border: '1px solid #e2e8f0' }}>
                                <div style={{ fontWeight: 'bold', color: colors.teal, marginBottom: '4px' }}>
                                    {guide.title}
                                </div>
                                <div style={{ fontSize: '14px', color: colors.darkBlue, opacity: 0.8 }}>
                                    {guide.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SCHEDULE (Shabbat) */}
            {resource.schedule && (
                <div style={{ marginTop: '32px', background: 'white', padding: '20px', borderRadius: '16px', 
                    border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: colors.teal, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', marginTop: 0 }}>
                        {resource.schedule.title}
                    </h3>
                    {resource.schedule.timeline.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '12px', padding: '8px 0', 
                            borderBottom: idx !== resource.schedule.timeline.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <span style={{ fontWeight: 'bold', minWidth: '80px', color: colors.teal, fontSize: '14px' }}>
                                {item.time}
                            </span>
                            <span style={{ color: colors.darkBlue, fontSize: '14px' }}>{item.activity}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* FAQ (Shabbat) */}
            {resource.faqs && (
                <div style={{ marginTop: '32px' }}>
                    <h3 style={{ color: colors.darkBlue, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Common Questions
                    </h3>
                    {resource.faqs.map((faq, idx) => (
                        <div key={idx} style={{ marginBottom: '16px' }}>
                            <div style={{ fontWeight: 'bold', color: colors.teal, fontSize: '14px', marginBottom: '4px' }}>
                                Q: {faq.question}
                            </div>
                            <div style={{ color: colors.darkBlue, opacity: 0.8, fontSize: '14px', lineHeight: '1.4' }}>
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

// MAIN APP COMPONENT
export default function App() {
  // Initialize state
  const [currentWeekNum, setCurrentWeekNum] = useState(() => {
    const saved = localStorage.getItem('acts2_currentWeek');
    return saved ? parseInt(saved) : 1;
  });

  const [currentDay, setCurrentDay] = useState(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    return days[today];
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

    useEffect(() => {
    localStorage.setItem('acts2_currentWeek', currentWeekNum.toString());
    localStorage.setItem('acts2_completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('acts2_activeTab', activeTab);
}, [currentWeekNum, completedTasks, activeTab]);

    const colors = { teal: '#1B9AAA', darkBlue: '#2C3E50', lightTeal: '#E8F4F5', white: '#FFFFFF' };
    const currentWeekData = weeks.find(w => w.week === currentWeekNum) || weeks[0];
    const dailyTasks = getDailyTasks(currentWeekNum);

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

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFB', 
            position: 'relative', paddingBottom: '80px', fontFamily: 'sans-serif' }}>
            
            <header style={{ backgroundColor: colors.teal, color: 'white', padding: '20px', 
    borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', textAlign: 'center' }}>
    <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Acts 2 Formation</h1>
    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Center of Life Church</p>
</header>

            <main style={{ padding: '20px' }}>
                {activeResource ? (
                    <ResourceDetailView resourceKey={activeResource} onBack={() => setActiveResource(null)} />
                ) : (
                    <>
                        {activeTab === 'today' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', 
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                    <span style={{ color: colors.teal, fontWeight: 'bold', fontSize: '0.8rem' }}>
                                        WEEK {currentWeekNum} • PROGRESS {getWeekProgress()}%
                                    </span>
                                    <h2 style={{ margin: '5px 0', color: colors.darkBlue }}>{currentWeekData.title}</h2>
                                    <p style={{ fontStyle: 'italic', margin: 0, opacity: 0.7 }}>"{currentWeekData.theme}"</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(d => (
                                        <button key={d} onClick={() => setCurrentDay(d)} style={{
                                            flex: 1, padding: '8px 0', fontSize: '10px', borderRadius: '8px', border: 'none',
                                            backgroundColor: currentDay === d ? colors.teal : 'white',
                                            color: currentDay === d ? 'white' : colors.darkBlue, cursor: 'pointer'
                                        }}>
                                            {d.slice(0,3).toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                {dailyTasks[currentDay].map(task => (
                                    <div key={task.id} onClick={() => toggleTask(task.id)} style={{
                                        background: 'white', padding: '15px', borderRadius: '12px', display: 'flex',
                                        alignItems: 'center', gap: '15px', cursor: 'pointer', borderLeft: `5px solid ${colors.teal}`
                                    }}>
                                        <div style={{ width: '20px', height: '20px', border: `2px solid ${colors.teal}`,
                                            borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: completedTasks[`${currentWeekNum}-${currentDay}-${task.id}`] ? colors.teal : 'transparent'
                                        }}>
                                            {completedTasks[`${currentWeekNum}-${currentDay}-${task.id}`] && <Check size={14} color="white" />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', color: colors.darkBlue,
                                                textDecoration: completedTasks[`${currentWeekNum}-${currentDay}-${task.id}`] ? 'line-through' : 'none'
                                            }}>{task.task}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{task.time} • {task.pillar}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'progress' && (
                            <div>
                                <h2 style={{ color: colors.darkBlue }}>Phase 1: Becoming a Disciple</h2>
                                {weeks.filter(w => w.phase === 1).map(w => (
                                    <div key={w.week} onClick={() => {setCurrentWeekNum(w.week); setActiveTab('today');}}
                                        style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px',
                                        border: '1px solid #eee', cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: 'bold' }}>Week {w.week}: {w.title}</span>
                                            <ChevronRight size={18} opacity={0.3} />
                                        </div>
                                    </div>
                                ))}
                                <h2 style={{ color: colors.darkBlue, marginTop: '30px' }}>Phase 2: Making Disciples</h2>
                                {weeks.filter(w => w.phase === 2).map(w => (
                                    <div key={w.week} onClick={() => {setCurrentWeekNum(w.week); setActiveTab('today');}}
                                        style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px',
                                        border: '1px solid #eee', cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: 'bold' }}>Week {w.week}: {w.title}</span>
                                            <ChevronRight size={18} opacity={0.3} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div>
                                <h2 style={{ color: colors.darkBlue, marginBottom: '10px' }}>Formation Resources</h2>
                                <p style={{ fontSize: '0.9rem', color: colors.darkBlue, opacity: 0.7, marginBottom: '20px' }}>
                                    Tools and guides for your discipleship journey
                                </p>
                                {resources.map((resource, idx) => (
                                    <div key={idx} onClick={() => setActiveResource(resource.key)} style={{
                                        background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '12px',
                                        cursor: 'pointer', borderLeft: `5px solid ${colors.teal}`, display: 'flex',
                                        alignItems: 'center', gap: '15px'
                                    }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px',
                                            background: colors.lightTeal, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <resource.icon size={24} color={colors.teal} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', color: colors.darkBlue, marginBottom: '4px' }}>
                                                {resource.title}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{resource.desc}</div>
                                        </div>
                                        <ChevronRight size={20} style={{ color: colors.darkBlue, opacity: 0.3 }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', backgroundColor: 'white',
                display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #eee',
                maxWidth: '480px', margin: '0 auto' }}>
                <button onClick={() => {setActiveTab('today'); setActiveResource(null);}} style={{
                    background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    color: activeTab === 'today' && !activeResource ? colors.teal : '#94a3b8', cursor: 'pointer'
                }}>
                    <Calendar size={20} /> <span style={{ fontSize: '10px' }}>Today</span>
                </button>
                <button onClick={() => {setActiveTab('progress'); setActiveResource(null);}} style={{
                    background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    color: activeTab === 'progress' && !activeResource ? colors.teal : '#94a3b8', cursor: 'pointer'
                }}>
                    <Check size={20} /> <span style={{ fontSize: '10px' }}>Progress</span>
                </button>
                <button onClick={() => {setActiveTab('resources'); setActiveResource(null);}} style={{
                    background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    color: activeTab === 'resources' || activeResource ? colors.teal : '#94a3b8', cursor: 'pointer'
                }}>
                    <BookOpen size={20} /> <span style={{ fontSize: '10px' }}>Resources</span>
                </button>
            </nav>
        </div>
    );
}