import React from 'react';

interface TeacherProps {
  message: string;
  showTools?: boolean;
}

export const Teacher: React.FC<TeacherProps> = ({ message, showTools }) => {
  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-2xl mx-auto w-full">
      <div className="relative group">
        <div className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-purple-700 to-blue-700 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500">
           <svg viewBox="0 0 100 100" className="w-20 h-20 text-white opacity-100">
             <circle cx="50" cy="35" r="20" fill="currentColor" />
             <path d="M20 80c0-15 15-25 30-25s30 10 30 25v5H20v-5z" fill="currentColor" />
           </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white shadow-lg animate-bounce"></div>
      </div>
      
      <div className="bg-white p-8 rounded-[2.5rem] relative shadow-2xl border-4 border-slate-100">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rotate-45 border-t-4 border-l-4 border-slate-100"></div>
        <p className="text-xl md:text-2xl text-slate-900 leading-tight text-center font-black italic">
          "{message}"
        </p>
      </div>
    </div>
  );
};