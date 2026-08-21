
import React, { useState } from 'react';
/* Added Pencil from lucide-react */
import { Pencil } from 'lucide-react';
import { MathFormula } from '../MathFormula';

export const Converter: React.FC = () => {
  const [deg, setDeg] = useState('90');

  const degToRadSteps = (d: string) => {
    const val = parseFloat(d) || 0;
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const common = gcd(val, 180);
    const num = val / common;
    const den = 180 / common;
    
    return {
      simplified: `${num === 1 ? '' : num}\\pi / ${den}`,
      decimal: (val * Math.PI / 180).toFixed(4)
    };
  };

  const steps = degToRadSteps(deg);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border-4 border-slate-100 space-y-8">
        <h3 className="text-2xl font-black text-slate-900 border-b-4 border-purple-600 pb-4 inline-block">Grados a Radianes</h3>
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Ingresa el valor en grados (°):</label>
          <input 
            type="number" 
            value={deg} 
            onChange={(e) => setDeg(e.target.value)}
            className="w-full bg-slate-50 border-4 border-slate-200 rounded-3xl p-6 text-4xl font-black text-slate-900 focus:border-purple-600 outline-none transition-colors"
          />
        </div>
        
        <div className="bg-purple-50 p-8 rounded-[2rem] space-y-6 border-2 border-purple-100">
          <p className="text-purple-800 text-sm font-black uppercase tracking-widest">Procedimiento Matemático:</p>
          <div className="flex flex-col gap-6">
             <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-200 flex justify-center">
                <MathFormula formula={`${deg}^\\circ \\times \\frac{\\pi}{180^\\circ}`} block />
             </div>
             <div className="flex flex-col gap-2">
               <span className="text-xs uppercase font-black text-slate-500">Resultado Simplificado:</span>
               <div className="text-3xl font-black text-purple-700 bg-white p-4 rounded-xl shadow-sm border border-purple-200 text-center">
                  <MathFormula formula={steps.simplified} />
               </div>
             </div>
             <div className="text-slate-700 text-sm font-bold bg-white/50 p-4 rounded-xl border border-purple-100 text-center">
               Valor decimal exacto ≈ <span className="text-blue-600 font-black">{steps.decimal}</span> rad
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border-4 border-slate-100 space-y-8 flex flex-col justify-center items-center text-center">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
           <Pencil size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Radianes a Grados</h3>
        <p className="text-slate-600 font-bold leading-relaxed max-w-xs">
          Estamos preparando la herramienta inversa para que puedas viajar en ambos sentidos del círculo.
        </p>
        <div className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest animate-pulse">
           Próximamente en Clase
        </div>
      </div>
    </div>
  );
};
