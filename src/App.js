import React from 'react';
import { Calendar, BookOpen, Users, Clock, ChevronRight } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-gray-100 text-slate-900">
        <h1 className="text-2xl font-bold">Acts 2 Formation</h1>
        <p className="text-gray-500 text-sm italic">Back to Basics v1.0</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Weekly Progress Card */}
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Current Week</p>
              <h2 className="text-2xl font-bold">Week 1: The Call</h2>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <Calendar size={24} />
            </div>
          </div>
          <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm">
            View Daily Readings
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resources</h3>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 text-slate-900">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <BookOpen size={20} />
              </div>
              <span className="font-semibold">OIAP Method Guide</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 text-slate-900">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Clock size={20} />
              </div>
              <span className="font-semibold">Shabbat Rhythm</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;