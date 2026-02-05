import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, X, Users, Coffee } from 'lucide-react';

export default function App() {
  const [selectedResource, setSelectedResource] = useState(null);

  // Content data
  const resourceData = {
    "OIAP Method Guide": {
      title: "The OIAP Method",
      tag: "Bible Study",
      steps: [
        { l: "Observation", d: "What does the text say?" },
        { l: "Interpretation", d: "What does it mean?" },
        { l: "Application", d: "What do I do?" },
        { l: "Prayer", d: "Talk to God about it." }
      ]
    },
    "Shabbat Rhythm": {
      title: "Shabbat Rhythm",
      tag: "Spiritual Rhythms",
      steps: [
        { l: "Stop", d: "Cease from all labor." },
        { l: "Rest", d: "Physical and soul rest." },
        { l: "Delight", d: "Celebrate God's goodness." },
        { l: "Worship", d: "Gratitude to the Provider." }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-10">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-black">Acts 2 Formation</h1>
        <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-1">Version 3.0 Live</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Weekly Section */}
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg">
          <h2 className="text-xl font-bold">Week 1: The Call</h2>
          <p className="text-indigo-100 text-sm mt-1 opacity-90">Your 24-week journey starts here.</p>
        </div>

        {/* Resources Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manual Resources</h3>
          {Object.keys(resourceData).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedResource(resourceData[key])}
              className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-200 shadow-sm active:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  {key.includes("OIAP") ? <BookOpen size={20} /> : <Clock size={20} />}
                </div>
                <span className="font-bold">{key}</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          ))}
        </div>

        {/* Community Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center">
            <Users className="mx-auto text-blue-500 mb-2" size={24} />
            <p className="text-sm font-bold">Groups</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center">
            <Coffee className="mx-auto text-orange-500 mb-2" size={24} />
            <p className="text-sm font-bold">Coffee</p>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {selectedResource && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4" onClick={() => setSelectedResource(null)}>
          <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-black text-xl">{selectedResource.title}</h2>
              <button onClick={() => setSelectedResource(null)} className="p-2 bg-gray-100 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              {selectedResource.steps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{i+1}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{s.l}</h4>
                    <p className="text-gray-500 text-sm">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6">
              <button onClick={() => setSelectedResource(null)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}