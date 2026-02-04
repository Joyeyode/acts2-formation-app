import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, X, Users, Coffee, Heart, AlertCircle } from 'lucide-react';

const App = () => {
  const [selectedResource, setSelectedResource] = useState(null);

  // Content pulled directly from the Acts 2 Participant Manual [cite: 102, 112]
  const resourceData = {
    "OIAP Method Guide": {
      title: "The OIAP Method",
      tag: "Formation",
      description: "A master-level skill to engage with Scripture and drive application.",
      steps: [
        { label: "O - Observation", detail: "What does it say? Identify keywords, the setting, and the original audience." },
        { label: "I - Interpretation", detail: "What does it mean? Find the timeless spiritual principle before applying it." },
        { label: "A - Application", detail: "What does it mean for me? Create a specific 'I will' statement for today." },
        { label: "P - Prayer", detail: "Ask for God's power to live out the truth you've discovered." }
      ]
    },
    "Shabbat Rhythm": {
      title: "Shabbat Rhythm",
      tag: "Rhythm",
      description: "A 24-hour cycle of rest and delight starting Friday evening.",
      steps: [
        { label: "Stop", detail: "Cease from all productive labor and 'toil' to recognize God is the sustainer." },
        { label: "Rest", detail: "Physical and mental rest through sleep, nature, or quiet meditation." },
        { label: "Delight", detail: "Engage in holy play and enjoy a 'choice meal' to celebrate God's goodness." },
        { label: "Worship", detail: "A communal response of gratitude, usually involving lighting candles or prayer." }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 relative overflow-x-hidden">
      
      {/* DEBUG BADGE: If you see this, the app is running! */}
      <div className="fixed top-2 right-2 z-[10000] p-1 bg-red-500 rounded-full animate-pulse shadow-lg" title="App logic active" />

      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 border-b border-slate-200 sticky top-0 z-10">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Acts 2 Formation</h1>
        <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
          <span className="font-bold uppercase tracking-widest text-indigo-600">v2.9 Manual</span>
          <span>•</span>
          <span className="italic">Interactive Companion</span>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-xl mx-auto">
        
        {/* Weekly Journey Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Week</h2>
            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold">1 of 24</span>
          </div>
          <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-1">Week 1: The Call</h3>
              <p className="text-indigo-100 text-sm mb-6 opacity-90">Beginning the journey of spiritual formation and covenant community.</p>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors">
                Open Readings
              </button>
            </div>
            {/* Decorative background circle */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />
          </div>
        </section>

        {/* Resources Section (Interactive) */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Manual Tools</h2>
          <div className="grid gap-3">
            {Object.keys(resourceData).map((key) => (
              <button 
                key={key}
                onClick={() => {
                  console.log("Opening Modal for:", key);
                  setSelectedResource(resourceData[key]);
                }}
                className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 group-active:bg-indigo-100 text-slate-600 group-active:text-indigo-600 rounded-xl transition-colors">
                    {key.includes("OIAP") ? <BookOpen size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{key}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">View Instruction</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        </section>

        {/* Community Grid */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">My Community</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                <Users size={24} />
              </div>
              <p className="font-bold text-sm">Table Group</p>
            </div>
            <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3">
                <Coffee size={24} />
              </div>
              <p className="font-bold text-sm">Chavruta</p>
            </div>
          </div>
        </section>

      </main>

      {/* POPUP MODAL - THE FIX: High Z-Index and fixed position */}
      {selectedResource && (
        <div 
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
          onClick={() => setSelectedResource(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-8 pb-6 flex justify-between items-start border-b border-slate-50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1 block">
                  {selectedResource.tag} Guide
                </span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {selectedResource.title}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedResource(null)}
                className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-8 pt-6 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
              <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-indigo-100 pl-4 italic">
                "{selectedResource.description}"
              </p>
              
              <div className="space-y-6">
                {selectedResource.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-200">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base mb-1">{step.label}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 pt-4">
              <button 
                onClick={() => setSelectedResource(null)}
                className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-bold text-lg active:scale-95 transition-transform shadow-xl"
              >
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