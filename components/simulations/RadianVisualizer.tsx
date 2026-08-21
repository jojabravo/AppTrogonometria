import React, { useState } from 'react';
import { MathFormula } from '../MathFormula';

export const RadianVisualizer: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const radius = 95;
  const currentAngle = progress * Math.PI * 2;

  const milestones = [
    { label: '1 rad', val: 1 },
    { label: '2 rad', val: 2 },
    { label: '3 rad', val: 3 },
    { label: 'π rad', val: Math.PI },
    { label: '4 rad', val: 4 },
    { label: '5 rad', val: 5 },
    { label: '6 rad', val: 6 },
    { label: '2π rad', val: Math.PI * 2 },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="relative flex justify-center bg-slate-50 p-12 rounded-full border-2 border-slate-100 shadow-inner">
           <svg viewBox="0 0 320 320" className="w-full max-w-[350px]">
             {/* Main background Circle */}
             <circle cx="160" cy="160" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5 5" />
             
             {/* Milestones markers */}
             {milestones.map((m, i) => {
               const isActive = Math.abs(currentAngle - m.val) < 0.1;
               return (
                 <g key={i}>
                   <line 
                     x1={160 + radius * Math.cos(-m.val)} 
                     y1={160 + radius * Math.sin(-m.val)} 
                     x2={160 + (radius + 15) * Math.cos(-m.val)} 
                     y2={160 + (radius + 15) * Math.sin(-m.val)} 
                     stroke={isActive ? "#a855f7" : "#cbd5e1"} 
                     strokeWidth={isActive ? "4" : "2"} 
                   />
                   <text 
                     x={160 + (radius + 35) * Math.cos(-m.val)} 
                     y={160 + (radius + 35) * Math.sin(-m.val)} 
                     fill={isActive ? "#7c3aed" : "#94a3b8"} 
                     fontSize="14" 
                     fontWeight="900"
                     textAnchor="middle" 
                     dominantBaseline="middle"
                     className="math-font"
                   >
                     {m.label}
                   </text>
                 </g>
               );
             })}

             {/* Radius Line */}
             <line x1="160" y1="160" x2={160 + radius} y2="160" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
             
             {/* The Dynamic Arc */}
             <path 
               d={`M ${160 + radius} 160 A ${radius} ${radius} 0 ${currentAngle > Math.PI ? 1 : 0} 0 ${160 + radius * Math.cos(-currentAngle)} ${160 + radius * Math.sin(-currentAngle)}`}
               fill="none"
               stroke={currentAngle > 0.01 ? "#a855f7" : "transparent"}
               strokeWidth="10"
               strokeLinecap="round"
               className="shadow-lg"
             />

             <circle cx="160" cy="160" r="6" fill="#1e293b" />
           </svg>
        </div>

        <div className="space-y-8">
          <div className="glass p-10 rounded-[2.5rem] border-purple-200">
            <div className="flex justify-between items-end mb-6">
              <h4 className="text-2xl font-black text-slate-900">Explorador de Radianes</h4>
              <span className="text-purple-600 font-black text-3xl">{(currentAngle).toFixed(2)} rad</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.001" value={progress} 
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between mt-6 text-xs text-slate-500 uppercase font-black tracking-[0.2em]">
              <span>Inicia el Giro</span>
              <span>1 Vuelta Completa</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={`p-6 rounded-3xl border-4 transition-all duration-500 ${Math.abs(currentAngle - Math.PI) < 0.15 ? 'bg-purple-100 border-purple-600 scale-105' : 'bg-slate-50 border-slate-100'}`}>
               <MathFormula formula="\pi \text{ rad} \approx 3.14" block />
               <p className="text-xs font-black text-center mt-3 uppercase tracking-widest text-purple-700">Media Vuelta</p>
            </div>
            <div className={`p-6 rounded-3xl border-4 transition-all duration-500 ${Math.abs(currentAngle - Math.PI*2) < 0.1 ? 'bg-indigo-100 border-indigo-600 scale-105' : 'bg-slate-50 border-slate-100'}`}>
               <MathFormula formula="2\pi \text{ rad} \approx 6.28" block />
               <p className="text-xs font-black text-center mt-3 uppercase tracking-widest text-indigo-700">Vuelta Completa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Relacion Perimetro/Diametro */}
      <div className="glass p-12 rounded-[3.5rem] border-l-[12px] border-emerald-500 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">La Proporción Sagrada de Pi (π)</h3>
          <p className="text-xl text-slate-700 leading-relaxed font-bold italic">
            "Imagina que tomas el diámetro de un círculo y tratas de 'envolverlo' alrededor de su orilla. Verás que cabe exactamente <span className="text-emerald-600 font-black">3 veces y un pequeño residuo</span>. Ese residuo es el famoso 0.1416..."
          </p>
          <div className="flex flex-wrap items-center gap-10 pt-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-slate-100">
               <MathFormula formula="\pi = \frac{\text{Perímetro}}{\text{Diámetro}}" block />
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-slate-100">
               <MathFormula formula="P = 2\pi r" block />
            </div>
          </div>
        </div>
        <div className="w-full md:w-80 aspect-square bg-indigo-50 rounded-[2.5rem] border-4 border-indigo-100 flex items-center justify-center p-8 text-center shadow-xl">
           <p className="text-indigo-800 text-lg font-black leading-tight">
             Pi es la relación constante entre lo largo de una línea curva y lo ancho de su círculo.
           </p>
        </div>
      </div>
    </div>
  );
};