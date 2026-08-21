import React from 'react';

export const FooterCredits: React.FC = () => {
  return (
    <footer className="w-full py-12 md:py-16 border-t border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Decorative Divider */}
        <div className="w-12 h-1 bg-indigo-600 rounded-full mb-8"></div>

        {/* Name - Adjusted Size */}
        <h3 className="text-slate-900 font-black text-xl md:text-2xl tracking-tight mb-6">
          Jorge Armando Jaramillo Bravo
        </h3>

        {/* Academic Degrees in Pills - Adjusted Sizes */}
        <div className="flex flex-col gap-3 items-center mb-10">
          <div className="bg-slate-50 border border-slate-200 px-6 py-2 rounded-full shadow-sm">
            <p className="text-slate-600 font-bold text-xs md:text-sm">
              Lic. Matemáticas y Física (UdeA)
            </p>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 px-6 py-2 rounded-full shadow-sm">
            <p className="text-slate-600 font-bold text-xs md:text-sm">
              Mag. En enseñanza de las ciencias exactas y naturales (UNAL)
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-6 py-2 rounded-full shadow-sm">
            <p className="text-slate-600 font-bold text-xs md:text-sm">
              Doctorante en Educación (UTEL)
            </p>
          </div>
        </div>

        {/* Laboratory Copyright & Slogan */}
        <div className="pt-6 border-t border-slate-100 w-full max-w-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            © 2026 LABORATORIO INTERACTIVO JOSEFA CAMPOS
          </p>
          </div>
      </div>
    </footer>
  );
};