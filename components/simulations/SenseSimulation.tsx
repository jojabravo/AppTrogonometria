import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock } from 'lucide-react';

export const SenseSimulation: React.FC = () => {
  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState<'cw' | 'ccw'>('ccw');

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle(prev => {
        const step = direction === 'ccw' ? 2 : -2;
        return (prev + step) % 360;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 200" className="w-64 h-64">
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2" strokeDasharray="5 5" />
          
          <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="text-5xl font-black fill-slate-100">
            {direction === 'ccw' ? '+' : '-'}
          </text>

          <g transform={`rotate(${-angle} 100 100)`}>
             <line x1="100" y1="100" x2="180" y2="100" stroke={direction === 'ccw' ? '#059669' : '#e11d48'} strokeWidth="5" strokeLinecap="round" />
             <path d="M 175 94 L 187 100 L 175 106 Z" fill={direction === 'ccw' ? '#059669' : '#e11d48'} />
          </g>
          <line x1="100" y1="100" x2="180" y2="100" stroke="#1e293b" strokeWidth="2" opacity="0.1" />
        </svg>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setDirection('ccw')}
            className={`p-6 rounded-2xl flex items-center gap-4 transition-all border-2 ${direction === 'ccw' ? 'bg-emerald-50 border-emerald-500 shadow-md' : 'bg-white border-slate-100 opacity-60'}`}
          >
            <div className={`p-3 rounded-xl ${direction === 'ccw' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <RefreshCw />
            </div>
            <div className="text-left">
              <p className={`font-black uppercase text-xs tracking-widest ${direction === 'ccw' ? 'text-emerald-700' : 'text-slate-400'}`}>Antihorario (POSITIVO)</p>
              <p className="text-xs text-slate-500 font-medium">Sentido matemático estándar.</p>
            </div>
          </button>

          <button 
            onClick={() => setDirection('cw')}
            className={`p-6 rounded-2xl flex items-center gap-4 transition-all border-2 ${direction === 'cw' ? 'bg-rose-50 border-rose-500 shadow-md' : 'bg-white border-slate-100 opacity-60'}`}
          >
            <div className={`p-3 rounded-xl ${direction === 'cw' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <Clock />
            </div>
            <div className="text-left">
              <p className={`font-black uppercase text-xs tracking-widest ${direction === 'cw' ? 'text-rose-700' : 'text-slate-400'}`}>Horario (NEGATIVO)</p>
              <p className="text-xs text-slate-500 font-medium">Como giran las manecillas del reloj.</p>
            </div>
          </button>
        </div>

        <p className="text-slate-600 text-sm italic p-5 bg-indigo-50 rounded-2xl border-l-8 border-indigo-500 font-medium">
          "Recuerda: subir es ganar (+), bajar es perder (-). Esta convención nos ayuda a navegar el círculo sin perdernos."
        </p>
      </div>
    </div>
  );
};