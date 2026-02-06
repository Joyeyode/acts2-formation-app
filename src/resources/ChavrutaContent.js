export const ChavrutaContent = {
    title: 'Chavruta Discussion Guide',
    subtitle: 'Text-based, question-driven learning',
    intro: 'Chavruta (Hebrew: חַבְרוּתָא) means "friendship" or "companionship." It\'s a traditional Jewish method of learning in pairs or small groups, where partners actively engage the text through dialogue, debate, and collaborative discovery.',
    
    // This matches the .map((step, idx) => ...) in your App.js
    steps: [
        {
            icon: '📖',
            step: '1. Read Together',
            description: 'Both partners read the assigned passage aloud or silently.',
            details: [
                'Identify key words or recurring themes.',
                'Note where the text surprises or confuses you.'
            ]
        },
        {
            icon: '❓',
            step: '2. Question Everything',
            description: 'Ask deep questions of the text and each other.',
            details: [
                'What does this mean? Why did the author say it this way?',
                'What are we supposed to do with this truth?'
            ]
        },
        {
            icon: '🤝',
            step: '3. Debate Respectfully',
            description: 'Iron sharpens iron through healthy friction.',
            details: [
                'Disagree, push back, and test ideas.',
                'Always speak with humility and respect.'
            ]
        },
        {
            icon: '💡',
            step: '4. Discover Together',
            description: 'Value the process over having the "right" answer.',
            details: [
                'You’ll go deeper than you ever could alone.',
                'The goal is transformation, not just information.'
            ]
        }
    ],

    // This matches the Question Types section we added to App.js
    questionTypes: [
        {
            type: 'Text Questions',
            icon: '📖',
            examples: [
                'What word stood out most?',
                'What surprised you?',
                'Where did you get stuck?'
            ]
        },
        {
            type: 'Life Questions',
            icon: '💭',
            examples: [
                'How did this challenge you?',
                'How will you obey this?',
                'Where do you see this in your life?'
            ]
        },
        {
            type: 'Community Questions',
            icon: '👥',
            examples: [
                'How can we pray for each other?',
                'Who needs to hear this?',
                'How can we live this out together?'
            ]
        }
    ],

    // This matches the Guidelines section we added to App.js
    guidelines: [
        {
            title: 'Listen Actively',
            description: 'Give your full attention. Put away phones. Be present.'
        },
        {
            title: 'Ask Good Questions',
            description: "Don't just wait for your turn to talk. Dig deeper into what others share."
        },
        {
            title: 'Be Vulnerable',
            description: 'Share honestly about your struggles and growth. Authenticity creates safety for others.'
        },
        {
            title: 'Protect Confidentiality',
            description: "What's shared in Chavruta stays in Chavruta."
        },
        {
            title: 'Challenge with Grace',
            description: "It's okay to disagree, but do so with humility and love."
        },
        {
            title: 'Commit to the Group',
            description: 'Show up every week. Your presence matters.'
        }
    ],

    scripture: {
        text: 'As iron sharpens iron, so one person sharpens another.',
        reference: 'Proverbs 27:17'
    }
};