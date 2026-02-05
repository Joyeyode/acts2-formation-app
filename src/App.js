import React from 'react';
import { Calendar, BookOpen, Users, Clock, ChevronRight } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900">Acts 2 Formation</h1>
        <p className="text-slate-500 text-sm font-medium">Participant Companion v1.0</p>
      </div>

      <div className="p-6 space-y-6 max-w-md mx-auto w-full">
        {/* Weekly Progress Card */}
        <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Current Week</p>
              <h2 className="text-2xl font-bold">Week 1: The Call</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl">
              <Calendar size={24} />
            </div>
          </div>
          <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-transform">
            View Daily Readings
          </button>
        </div>

        {/* Resources Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Manual Resources</h3>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 leading-none mb-1">OIAP Method Guide</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Formation</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 leading-none mb-1">Shabbat Rhythm</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Presence</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-center active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users size={24} />
            </div>
            <p className="text-sm font-bold text-slate-900">Table Group</p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-center active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen size={24} />
            </div>
            <p className="text-sm font-bold text-slate-900">Scripture</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;