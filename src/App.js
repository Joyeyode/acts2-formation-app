import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, X, Info, Heart, CheckCircle2 } from 'lucide-react';

const App = () => {
  const [selectedResource, setSelectedResource] = useState(null);

  const resourceData = {
    "OIAP Method Guide": {
      title: "The OIAP Method",
      tag: "Bible Study",
      description: "A 4-step framework for deep scripture engagement.",
      steps: [
        { label: "O - Observation", detail: "What does it say? Note facts, repeated words, and the setting without interpreting yet." },
        { label: "I - Interpretation", text: "What did it mean to the original audience? Look for the timeless spiritual principle." },
        { label: "A - Application", detail: "What does it mean for me? Be specific: 'Because of this truth, I will...' today." },
        { label: "P - Prayer", detail: "Turn the text back to God. Ask for the grace and power to live out the application." }
      ]
    },
    "Shabbat Rhythm": {
      title: "Shabbat Rhythm",
      tag: "Spiritual Rhythms",
      description: "Transitioning from a week of 'toil' into a day of 'tasting'.",
      steps: [
        { label: "Stop", detail: "Cease from all 'toil'—the work that makes you feel like a producer rather than a person." },
        { label: "Rest", detail: "Engage in soul-restoring activities: sleep, nature, or quiet meditation on God’s Word." },
        { label: "Delight", detail: "Eat good food, enjoy beauty, and celebrate God's provision with 'holy play'." },
        { label: "Worship", detail: "Turn your heart toward the Father in gratitude, recognizing He sustains you." }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resources</h1>
        <p className="text-slate-500 text-sm">Tools for your Acts 2 journey</p>
      </div>

      {/* Resource Cards */}
      <div className="p-6 space-y-4">
        {Object.keys(resourceData).map((key) => (
          <button 
            key={key}
            onClick={() => setSelectedResource(resourceData[key])}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-active:bg-indigo-100">
                {key.includes("OIAP") ? <BookOpen size={24} /> : <Clock size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{key}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                  {resourceData[key].tag}
                </span>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        ))}
      </div>

      {/* Bottom Sheet Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-end justify-center backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md rounded-t-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-6 flex justify-between items-start border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900">{selectedResource.title}</h2>
                <p className="text-slate-500 text-sm">{selectedResource.description}</p>
              </div>
              <button 
                onClick={() => setSelectedResource(null)}
                className="p-2 bg-white shadow-sm border border-slate-200 rounded-full text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
              {selectedResource.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 leading-none">{step.label}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.detail || step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 pt-2">
              <button 
                onClick={() => setSelectedResource(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg active:bg-slate-800 transition-colors"
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