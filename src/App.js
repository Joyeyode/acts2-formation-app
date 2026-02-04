import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, X } from 'lucide-react';

const App = () => {
  const [selectedResource, setSelectedResource] = useState(null);

  const resourceData = {
    "OIAP Method Guide": {
      title: "The OIAP Method",
      tag: "Bible Study",
      description: "A master-level skill to prevent misinterpretation and drive application.",
      steps: [
        { label: "O - Observation", detail: "What does it say? Identify keywords, repeated commands, and the original audience[cite: 209]." },
        { label: "I - Interpretation", detail: "What does it mean? Look at the original, canonical, and timeless spiritual principles[cite: 210]." },
        { label: "A - Application", detail: "What does it mean for me? Create a specific, 'because of this truth, I will...' statement[cite: 209]." },
        { label: "P - Prayer", detail: "Align with God. Ask for the grace and power to live out the application today[cite: 109]." }
      ]
    },
    "Shabbat Rhythm": {
      title: "Shabbat Rhythm",
      tag: "Spiritual Rhythms",
      description: "Moving from a week of toil into a holy day of rest.",
      steps: [
        { label: "Stop", detail: "Cease from producing and 'toiling' to recognize you are a person, not just a worker[cite: 100]." },
        { label: "Rest", detail: "Engage in soul-restoring activities: sleep, nature, or meditation on God’s Word[cite: 101]." },
        { label: "Delight", detail: "Celebrate God's goodness through a 'choice meal' or meaningful play[cite: 101]." },
        { label: "Worship", detail: "A communal response of gratitude, acknowledging God as the sustainer of all[cite: 100]." }
      ]
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 pb-10">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-black tracking-tight">Resources</h1>
        <p className="text-slate-500 text-sm">Participant Manual Tools</p>
      </div>

      {/* Resource Cards */}
      <div className="p-6 space-y-4">
        {Object.keys(resourceData).map((key) => (
          <button 
            key={key}
            onClick={() => {
              console.log("Opening:", key); // Check your browser console to see if this fires
              setSelectedResource(resourceData[key]);
            }}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm active:bg-slate-50 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                {key.includes("OIAP") ? <BookOpen size={24} /> : <Clock size={24} />}
              </div>
              <div>
                <h3 className="font-bold">{key}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">{resourceData[key].tag}</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        ))}
      </div>

      {/* THE POPUP MODAL */}
      {selectedResource && (
        <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-end justify-center backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
            <div className="p-6 flex justify-between items-start border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black">{selectedResource.title}</h2>
                <p className="text-slate-500 text-sm">{selectedResource.description}</p>
              </div>
              <button 
                onClick={() => setSelectedResource(null)}
                className="p-2 bg-slate-100 rounded-full text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {selectedResource.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{step.label}</h4>
                    <p className="text-slate-600 text-sm">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100">
              <button 
                onClick={() => setSelectedResource(null)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold"
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