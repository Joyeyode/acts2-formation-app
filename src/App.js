import React, { useState } from 'react';
import { Calendar, Check, BookOpen, Users, Heart, Clock, ChevronRight, Star, Menu, X } from 'lucide-react';

// Acts 2 Formation Companion App - Digital Discipleship Tool
const App = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentDay, setCurrentDay] = useState('monday');
  const [completedTasks, setCompletedTasks] = useState({});
  const [notifications, setNotifications] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('today');

  // COL Brand Colors
  const colors = {
    teal: '#1B9AAA',
    darkBlue: '#2C3E50',
    lightTeal: '#E8F4F5',
    accent: '#F4D35E',
    text: '#2C3E50',
    white: '#FFFFFF'
  };

  // Weekly data structure
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

  // Daily tasks structure
  const dailyTasks = {
    monday: [
      { id: 'm1', task: 'Scripture Reading (OIAP)', time: '20 min', pillar: 'Presence' },
      { id: 'm2', task: 'Doctrine Reading (Jones/Pearlman)', time: '15 min', pillar: 'Formation' },
      { id: 'm3', task: 'Practice Rep', time: '10 min', pillar: 'Formation' }
    ],
    tuesday: [
      { id: 't1', task: 'Scripture Reading (OIAP)', time: '20 min', pillar: 'Presence' },
      { id: 't2', task: 'Spiritual Disciplines Reading', time: '15 min', pillar: 'Formation' },
      { id: 't3', task: 'Practice Rep', time: '10 min', pillar: 'Formation' }
    ],
    wednesday: [
      { id: 'w1', task: 'Scripture Reading (OIAP)', time: '20 min', pillar: 'Presence' },
      { id: 'w2', task: 'Chavruta Small Group', time: '90 min', pillar: 'Connection' },
      { id: 'w3', task: 'Group Discussion Prep', time: '15 min', pillar: 'Formation' }
    ],
    thursday: [
      { id: 'th1', task: 'Scripture Reading (OIAP)', time: '20 min', pillar: 'Presence' },
      { id: 'th2', task: 'Hebrew/Greek Word Study', time: '15 min', pillar: 'Formation' },
      { id: 'th3', task: 'Practice Rep', time: '10 min', pillar: 'Formation' }
    ],
    friday: [
      { id: 'f1', task: 'Shabbat Preparation', time: '15 min', pillar: 'Presence' },
      { id: 'f2', task: 'Weekly Review', time: '20 min', pillar: 'Formation' },
      { id: 'f3', task: 'Cease • Delight • Bless', time: 'Evening', pillar: 'Presence' }
    ],
    saturday: [
      { id: 's1', task: 'Reflection Question 1', time: '15 min', pillar: 'Formation' },
      { id: 's2', task: 'Reflection Question 2', time: '15 min', pillar: 'Formation' },
      { id: 's3', task: 'Reflection Question 3', time: '15 min', pillar: 'Formation' },
      { id: 's4', task: 'Journal + Prayer', time: '20 min', pillar: 'Presence' }
    ],
    sunday: [
      { id: 'su1', task: 'Gathered Worship', time: '90 min', pillar: 'Presence' },
      { id: 'su2', task: 'Response Step', time: '15 min', pillar: 'Formation' },
      { id: 'su3', task: 'Weekly Checklist Review', time: '10 min', pillar: 'Formation' }
    ]
  };

  const toggleTask = (day, taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [`${currentWeek}-${day}-${taskId}`]: !prev[`${currentWeek}-${day}-${taskId}`]
    }));
  };

  const getWeekProgress = () => {
    const totalTasks = Object.values(dailyTasks).flat().length;
    const completed = Object.keys(completedTasks).filter(
      key => key.startsWith(`${currentWeek}-`) && completedTasks[key]
    ).length;
    return Math.round((completed / totalTasks) * 100);
  };

  const getDayProgress = (day) => {
    const dayTasks = dailyTasks[day];
    const completed = dayTasks.filter(
      task => completedTasks[`${currentWeek}-${day}-${task.id}`]
    ).length;
    return Math.round((completed / dayTasks.length) * 100);
  };

  // Render Home/Today View
  const TodayView = () => {
    const currentWeekData = weeks[currentWeek - 1];
    const todayTasks = dailyTasks[currentDay];
    const todayProgress = getDayProgress(currentDay);

    return (
      <div className="space-y-6">
        {/* Current Week Card */}
        <div className="week-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: colors.teal }}>
                Week {currentWeek} • Phase {currentWeekData.phase}
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.darkBlue }}>
                {currentWeekData.title}
              </h2>
              <p className="text-sm italic" style={{ color: colors.darkBlue, opacity: 0.7 }}>
                "{currentWeekData.theme}"
              </p>
            </div>
            <div className="progress-circle">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  fill="none"
                  stroke={colors.lightTeal}
                  strokeWidth="6"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  fill="none"
                  stroke={colors.teal}
                  strokeWidth="6"
                  strokeDasharray={`${(getWeekProgress() / 100) * 157} 157`}
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                />
                <text
                  x="30"
                  y="35"
                  textAnchor="middle"
                  style={{ fontSize: '14px', fontWeight: 'bold', fill: colors.darkBlue }}
                >
                  {getWeekProgress()}%
                </text>
              </svg>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
              className="nav-btn"
              style={{ opacity: currentWeek === 1 ? 0.3 : 1 }}
            >
              ← Previous
            </button>
            <div className="text-sm" style={{ color: colors.darkBlue }}>
              {currentWeek} of 24
            </div>
            <button
              onClick={() => setCurrentWeek(Math.min(24, currentWeek + 1))}
              disabled={currentWeek === 24}
              className="nav-btn"
              style={{ opacity: currentWeek === 24 ? 0.3 : 1 }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Today's Date and Progress */}
        <div className="day-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold capitalize" style={{ color: colors.darkBlue }}>
                {currentDay}
              </h3>
              <p className="text-sm mt-1" style={{ color: colors.darkBlue, opacity: 0.6 }}>
                {todayTasks.length} practices today
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: colors.teal }}>
                {todayProgress}%
              </div>
              <div className="text-xs" style={{ color: colors.darkBlue, opacity: 0.6 }}>
                Complete
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="space-y-3">
          {todayTasks.map((task) => {
            const isCompleted = completedTasks[`${currentWeek}-${currentDay}-${task.id}`];
            return (
              <div
                key={task.id}
                className="task-card"
                onClick={() => toggleTask(currentDay, task.id)}
                style={{
                  opacity: isCompleted ? 0.6 : 1,
                  borderLeft: `4px solid ${colors.teal}`
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="checkbox"
                    style={{
                      backgroundColor: isCompleted ? colors.teal : colors.white,
                      borderColor: colors.teal
                    }}
                  >
                    {isCompleted && <Check size={16} color={colors.white} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4
                          className="font-semibold mb-1"
                          style={{
                            color: colors.darkBlue,
                            textDecoration: isCompleted ? 'line-through' : 'none'
                          }}
                        >
                          {task.task}
                        </h4>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1" style={{ color: colors.darkBlue, opacity: 0.6 }}>
                            <Clock size={14} />
                            {task.time}
                          </span>
                          <span
                            className="pillar-badge"
                            style={{ backgroundColor: colors.lightTeal, color: colors.teal }}
                          >
                            {task.pillar}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Day Navigation */}
        <div className="grid grid-cols-7 gap-2 mt-6">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
            const dayProgress = getDayProgress(day);
            const isActive = day === currentDay;
            return (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className="day-pill"
                style={{
                  backgroundColor: isActive ? colors.teal : colors.lightTeal,
                  color: isActive ? colors.white : colors.darkBlue
                }}
              >
                <div className="text-xs font-semibold">{day.slice(0, 3).toUpperCase()}</div>
                <div className="text-xs mt-1">{dayProgress}%</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Progress Overview
  const ProgressView = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.darkBlue }}>
            Your Formation Journey
          </h2>
          <p className="text-sm mb-6" style={{ color: colors.darkBlue, opacity: 0.7 }}>
            24 weeks • 2 phases • Kingdom socialization
          </p>
        </div>

        {/* Phase 1 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="phase-badge"
              style={{ backgroundColor: colors.teal, color: colors.white }}
            >
              Phase 1
            </div>
            <h3 className="font-bold" style={{ color: colors.darkBlue }}>
              Becoming a Disciple
            </h3>
          </div>
          <div className="space-y-2">
            {weeks.filter(w => w.phase === 1).map((week) => {
              const weekTasks = Object.values(dailyTasks).flat().length;
              const completedCount = Object.keys(completedTasks).filter(
                key => key.startsWith(`${week.week}-`) && completedTasks[key]
              ).length;
              const progress = Math.round((completedCount / weekTasks) * 100);

              return (
                <div
                  key={week.week}
                  className="progress-week-card"
                  onClick={() => {
                    setCurrentWeek(week.week);
                    setActiveTab('today');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1" style={{ color: colors.darkBlue }}>
                        Week {week.week}: {week.title}
                      </div>
                      <div className="text-xs italic" style={{ color: colors.darkBlue, opacity: 0.6 }}>
                        {week.theme}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: colors.teal }}>
                          {progress}%
                        </div>
                      </div>
                      <ChevronRight size={20} style={{ color: colors.darkBlue, opacity: 0.3 }} />
                    </div>
                  </div>
                  <div className="progress-bar mt-2">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: colors.teal
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase 2 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="phase-badge"
              style={{ backgroundColor: colors.accent, color: colors.darkBlue }}
            >
              Phase 2
            </div>
            <h3 className="font-bold" style={{ color: colors.darkBlue }}>
              Making Disciples
            </h3>
          </div>
          <div className="space-y-2">
            {weeks.filter(w => w.phase === 2).map((week) => {
              const weekTasks = Object.values(dailyTasks).flat().length;
              const completedCount = Object.keys(completedTasks).filter(
                key => key.startsWith(`${week.week}-`) && completedTasks[key]
              ).length;
              const progress = Math.round((completedCount / weekTasks) * 100);

              return (
                <div
                  key={week.week}
                  className="progress-week-card"
                  onClick={() => {
                    setCurrentWeek(week.week);
                    setActiveTab('today');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1" style={{ color: colors.darkBlue }}>
                        Week {week.week}: {week.title}
                      </div>
                      <div className="text-xs italic" style={{ color: colors.darkBlue, opacity: 0.6 }}>
                        {week.theme}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: colors.teal }}>
                          {progress}%
                        </div>
                      </div>
                      <ChevronRight size={20} style={{ color: colors.darkBlue, opacity: 0.3 }} />
                    </div>
                  </div>
                  <div className="progress-bar mt-2">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: colors.accent
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render Resources View
  const ResourcesView = () => {
    const resources = [
      {
        title: 'OIAP Method Guide',
        desc: 'Observe • Interpret • Apply • Proclaim',
        icon: BookOpen,
        pillar: 'Formation'
      },
      {
        title: 'Chavruta Discussion Questions',
        desc: 'Text-based, question-driven learning',
        icon: Users,
        pillar: 'Connection'
      },
      {
        title: 'Shabbat Rhythm',
        desc: 'Cease • Delight • Bless',
        icon: Heart,
        pillar: 'Presence'
      },
      {
        title: 'Hebrew/Greek Word Studies',
        desc: 'Talmid-style deep dives',
        icon: BookOpen,
        pillar: 'Formation'
      },
      {
        title: 'Spiritual Disciplines Practices',
        desc: 'Prayer, fasting, solitude, service',
        icon: Star,
        pillar: 'Formation'
      },
      {
        title: 'Weekly Reflection Questions',
        desc: 'Journal prompts for transformation',
        icon: BookOpen,
        pillar: 'Formation'
      }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.darkBlue }}>
            Formation Resources
          </h2>
          <p className="text-sm" style={{ color: colors.darkBlue, opacity: 0.7 }}>
            Tools and guides for your discipleship journey
          </p>
        </div>

        <div className="space-y-3">
          {resources.map((resource, idx) => (
            <div key={idx} className="resource-card">
              <div className="flex items-start gap-4">
                <div
                  className="icon-circle"
                  style={{ backgroundColor: colors.lightTeal }}
                >
                  <resource.icon size={24} style={{ color: colors.teal }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1" style={{ color: colors.darkBlue }}>
                    {resource.title}
                  </h4>
                  <p className="text-sm mb-2" style={{ color: colors.darkBlue, opacity: 0.6 }}>
                    {resource.desc}
                  </p>
                  <span
                    className="pillar-badge"
                    style={{ backgroundColor: colors.lightTeal, color: colors.teal }}
                  >
                    {resource.pillar}
                  </span>
                </div>
                <ChevronRight size={20} style={{ color: colors.darkBlue, opacity: 0.3 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Key Scripture */}
        <div className="scripture-card">
          <div className="text-xs font-semibold mb-2" style={{ color: colors.teal }}>
            FOUNDATION SCRIPTURE
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: colors.darkBlue }}>
            "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer."
          </p>
          <div className="text-xs font-semibold" style={{ color: colors.darkBlue, opacity: 0.6 }}>
            Acts 2:42
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: colors.white }}>
              Acts 2 Formation
            </h1>
            <p className="text-xs mt-1" style={{ color: colors.white, opacity: 0.9 }}>
              Center of Life Church
            </p>
          </div>
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Settings Menu Overlay */}
        {menuOpen && (
          <div className="settings-menu">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold" style={{ color: colors.darkBlue }}>
                Daily Reminders
              </span>
              <button
                onClick={() => setNotifications(!notifications)}
                className="toggle-btn"
                style={{
                  backgroundColor: notifications ? colors.teal : '#ccc'
                }}
              >
                <div
                  className="toggle-circle"
                  style={{
                    transform: notifications ? 'translateX(20px)' : 'translateX(0)'
                  }}
                />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm" style={{ color: colors.darkBlue, opacity: 0.7 }}>
                Get daily notifications for your formation practices
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Tab Navigation */}
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
          style={{
            color: activeTab === 'today' ? colors.teal : colors.darkBlue,
            borderBottomColor: activeTab === 'today' ? colors.teal : 'transparent'
          }}
        >
          <Calendar size={20} />
          Today
        </button>
        <button
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
          style={{
            color: activeTab === 'progress' ? colors.teal : colors.darkBlue,
            borderBottomColor: activeTab === 'progress' ? colors.teal : 'transparent'
          }}
        >
          <Check size={20} />
          Progress
        </button>
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
          style={{
            color: activeTab === 'resources' ? colors.teal : colors.darkBlue,
            borderBottomColor: activeTab === 'resources' ? colors.teal : 'transparent'
          }}
        >
          <BookOpen size={20} />
          Resources
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-content">
        {activeTab === 'today' && <TodayView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'resources' && <ResourcesView />}
      </main>

      {/* Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: linear-gradient(135deg, ${colors.lightTeal} 0%, ${colors.white} 100%);
          min-height: 100vh;
        }

        .app-container {
          max-width: 480px;
          margin: 0 auto;
          background: ${colors.white};
          min-height: 100vh;
          box-shadow: 0 0 40px rgba(0,0,0,0.1);
          position: relative;
        }

        .app-header {
          background: linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkBlue} 100%);
          color: ${colors.white};
          padding: 20px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .menu-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: ${colors.white};
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .menu-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .settings-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: ${colors.white};
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border-radius: 0 0 12px 12px;
          overflow: hidden;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .toggle-btn {
          width: 50px;
          height: 30px;
          border-radius: 15px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.3s;
        }

        .toggle-circle {
          width: 26px;
          height: 26px;
          background: ${colors.white};
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
        }

        .tab-nav {
          display: flex;
          background: ${colors.white};
          border-bottom: 1px solid ${colors.lightTeal};
          position: sticky;
          top: 74px;
          z-index: 90;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
          opacity: 0.6;
        }

        .tab-btn.active {
          opacity: 1;
        }

        .app-content {
          padding: 20px;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .week-card {
          background: linear-gradient(135deg, ${colors.lightTeal} 0%, ${colors.white} 100%);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(27, 154, 170, 0.1);
          border: 1px solid ${colors.lightTeal};
        }

        .progress-circle {
          animation: scaleIn 0.5s ease;
        }

        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        .nav-btn {
          background: ${colors.white};
          border: 2px solid ${colors.teal};
          color: ${colors.teal};
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .nav-btn:hover:not(:disabled) {
          background: ${colors.teal};
          color: ${colors.white};
        }

        .nav-btn:disabled {
          cursor: not-allowed;
        }

        .day-header {
          background: ${colors.white};
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid ${colors.lightTeal};
        }

        .task-card {
          background: ${colors.white};
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid ${colors.lightTeal};
        }

        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(27, 154, 170, 0.15);
        }

        .checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s;
        }

        .pillar-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .day-pill {
          padding: 12px 8px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
        }

        .day-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(27, 154, 170, 0.2);
        }

        .phase-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .progress-week-card {
          background: ${colors.white};
          border-radius: 12px;
          padding: 16px;
          border: 1px solid ${colors.lightTeal};
          cursor: pointer;
          transition: all 0.3s;
        }

        .progress-week-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(27, 154, 170, 0.15);
        }

        .progress-bar {
          height: 6px;
          background: ${colors.lightTeal};
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.6s ease;
        }

        .resource-card {
          background: ${colors.white};
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid ${colors.lightTeal};
          cursor: pointer;
          transition: all 0.3s;
        }

        .resource-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(27, 154, 170, 0.15);
        }

        .icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .scripture-card {
          background: linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkBlue} 100%);
          color: ${colors.white};
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(27, 154, 170, 0.2);
          margin-top: 8px;
        }

        .space-y-6 > * + * {
          margin-top: 1.5rem;
        }

        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }

        .space-y-2 > * + * {
          margin-top: 0.5rem;
        }

        .flex {
          display: flex;
        }

        .items-start {
          align-items: flex-start;
        }

        .items-center {
          align-items: center;
        }

        .justify-between {
          justify-content: space-between;
        }

        .gap-2 {
          gap: 0.5rem;
        }

        .gap-3 {
          gap: 0.75rem;
        }

        .gap-4 {
          gap: 1rem;
        }

        .flex-1 {
          flex: 1;
        }

        .grid {
          display: grid;
        }

        .grid-cols-7 {
          grid-template-columns: repeat(7, 1fr);
        }

        .border-t {
          border-top: 1px solid ${colors.lightTeal};
        }

        .border-b {
          border-bottom: 1px solid ${colors.lightTeal};
        }

        @media (max-width: 480px) {
          .app-container {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
