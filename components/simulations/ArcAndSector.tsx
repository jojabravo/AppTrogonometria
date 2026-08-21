import React, { useState } from 'react';
import { MathFormula } from '../MathFormula';

export const ArcAndSector: React.FC = () => {
  const [radius, setRadius] = useState(5);
  const [angleDeg, setAngleDeg] = useState(60);

  const angleRad = angleDeg * Math.PI / 180;
  const arcLength = radius * angleRad;
  const sectorArea = 0.5 * Math.pow(radius, 2) * angleRad;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-10 rounded-[3rem] shadow-xl border-4 border-slate-100">
        <div className="space-y-10">
           <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Radio del Círculo (r):</label>
                <span className="text-2xl font-black text-blue-600 bg-blue-50 px-4 py-1 rounded-xl">{radius} u</span>
              </div>
              <input 
                type="range" min="1" max="10" step="0.5" value={radius} 
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Apertura Angular (θ):</label>
                <span className="text-2xl font-black text-purple-600 bg-purple-50 px-4 py-1 rounded-xl">{angleDeg}°</span>
              </div>
              <input 
                type="range" min="1" max="359" value={angleDeg} 
                onChange={(e) => setAngleDeg(parseFloat(e.target.value))}
                className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
           </div>
        </div>

        <div className="flex justify-center bg-slate-50 rounded-[2.5rem] p-12 shadow-inner border-2 border-slate-100">
          <svg viewBox="0 0 300 300" className="w-full max-w-[280px]">
             {/* Main background Circle guide */}
             <circle cx="150" cy="150" r={10 * 14} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
             
             {/* The Sector */}
             <path 
               d={`M 150 150 L ${150 + radius * 14} 150 A ${radius * 14} ${radius * 14} 0 ${angleDeg > 180 ? 1 : 0} 0 ${150 + radius * 14 * Math.cos(-angleRad)} ${150 + radius * 14 * Math.sin(-angleRad)} Z`}
               fill="rgba(37, 99, 235, 0.15)"
               stroke="rgb(37, 99, 235)"
               strokeWidth="4"
               strokeLinecap="round"
             />
             <circle cx="150" cy="150" r="6" fill="#1e293b" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-[12px] border-blue-600 space-y-6">
           <h4 className="text-2xl font-black text-slate-900">Longitud de Arco (L)</h4>
           <div className="bg-blue-50 p-4 rounded-2xl flex justify-center">
             <MathFormula formula="L = r \cdot \theta \text{ (en radianes)}" block />
           </div>
           <div className="bg-slate-900 p-8 rounded-[2rem] flex flex-col items-center gap-2 shadow-lg">
             <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Resultado Final</span>
             <span className="text-4xl font-black text-white">{arcLength.toFixed(2)} <span className="text-blue-400">unidades</span></span>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-[12px] border-purple-600 space-y-6">
           <h4 className="text-2xl font-black text-slate-900">Área del Sector (A)</h4>
           <div className="bg-purple-50 p-4 rounded-2xl flex justify-center">
             <MathFormula formula="A = \frac{1}{2} r^2 \theta" block />
           </div>
           <div className="bg-slate-900 p-8 rounded-[2rem] flex flex-col items-center gap-2 shadow-lg">
             <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Resultado Final</span>
             <span className="text-4xl font-black text-white">{sectorArea.toFixed(2)} <span className="text-purple-400">u²</span></span>
           </div>
        </div>
      </div>
    </div>
  );
};