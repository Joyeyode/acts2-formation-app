import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, X, Users, Coffee, Heart } from 'lucide-react';

const App = () => {
  const [selectedResource, setSelectedResource] = useState(null);

  const resourceData = {
    "OIAP Method Guide": {
      title: "The OIAP Method",
      tag: "Formation",
      description: "The primary framework for engaging with Scripture.",
      steps: [
        { label: "O - Observation", detail: "What does it say? Note facts and repeated words." },
        { label: "I - Interpretation", detail: "What does it mean? Look for the timeless principle." },
        { label: "A - Application", detail: "What does it mean for me? Create a specific 'I will' statement." },
        { label: "P - Prayer", detail: "Ask for God's power to live out the application." }
      ]
    },
    "Shabbat Rhythm": {
      title: "Shabbat Rhythm",
      tag: "Rhythm",
      description: "A 24-hour cycle of rest and delight.",
      steps: [
        { label: "Stop", detail: "Cease from all toil and productive labor." },
        { label: "Rest", detail: "Engage in soul-restoring activities like sleep or nature." },
        { label: "Delight", detail: "Celebrate God's goodness with a choice meal." },
        { label: "Worship", detail: "Respond in gratitude to God as your sustainer." }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 relative">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-black tracking-tight">Acts 2 Formation</h1>
        <p className="text-slate-500 text-sm italic">Participant Manual v2.9</p>
      </div>

      {/* Main Sections */}
      <div className="p-6 space-y-8">
        
        {/* Weekly Journey Section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">The Journey</h2>
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold">Week 1: The Call</h3>
            <p className="text-indigo-100 text-sm mb-4">Start your 24-week formation journey.</p>
            <button className="bg-white/20 hover:bg-white/30 py-2 px-4 rounded-xl text-sm font-bold transition-colors">
              View Readings
            </button>
          </div>
        </section>

        {/* Resources Section (Interactive) */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Tools & Guides</h2>
          <div className="space-y-3">
            {Object.keys(resourceData).map((key) => (
              <button 
                key={key}
                onClick={() => setSelectedResource(resourceData[key])}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm active:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    {key.includes("OIAP") ? <BookOpen size={20} /> : <Clock size={20} />}
                  </div>
                  <p className="font-bold text-slate-800">{key}</p>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>
            ))}
          </div>
        </section>

        {/* Community Section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Community</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <Users className="text-blue-500 mb-2" size={20} />
              <p className="font-bold text-sm">Table Group</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <Coffee className="text-orange-500 mb-2" size={20} />
              <p className="font-bold text-sm">Connection</p>
            </div>
          </div>
        </section>

      </div>

      {/* POPUP MODAL (The hidden part that slides up) */}
      {selectedResource && (
        <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setSelectedResource(null)}>
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 flex justify-between items-start border-b border-slate-100 bg-slate-50">
              <div>
                <h2 className="text-xl font-black text-slate-900">{selectedResource.title}</h2>
                <p className="text-slate-500 text-sm">{selectedResource.description}</p>
              </div>
              <button onClick={() => setSelectedResource(null)} className="p-2 bg-white border border-slate-200 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
              {selectedResource.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">{step.label}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6">
              <button onClick={() => setSelectedResource(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg">
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;