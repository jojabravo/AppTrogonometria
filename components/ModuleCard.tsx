import React from 'react';
import { 
  Lock, 
  ChevronRight, 
  Compass, 
  Triangle, 
  Calculator, 
  Radio, 
  Activity, 
  Sparkles, 
  Variable, 
  Shapes,
  CheckCircle2,
  Play
} from 'lucide-react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

const getModuleIcon = (id: string, isLocked: boolean, isCompleted?: boolean) => {
  if (isCompleted) return <CheckCircle2 size={18} className="text-emerald-600" />;
  if (isLocked) return <Lock size={16} className="text-slate-400" />;
  switch (id) {
    case 'module1':
      return <Compass size={18} className="text-purple-600" />;
    case 'triangles':
      return <Triangle size={18} className="text-amber-600" />;
    case 'trig-ratios':
      return <Calculator size={18} className="text-indigo-600" />;
    case 'sine-law':
      return <Radio size={18} className="text-cyan-600" />;
    case 'cosine-law':
      return <Shapes size={18} className="text-purple-600" />;
    case 'graphs':
      return <Activity size={18} className="text-emerald-600" />;
    case 'identities':
      return <Sparkles size={18} className="text-pink-600" />;
    case 'equations':
      return <Variable size={18} className="text-blue-600" />;
    default:
      return <Shapes size={18} className="text-purple-600" />;
  }
};

const getModuleColorTheme = (id: string, isLocked: boolean, isCompleted?: boolean) => {
  if (isCompleted) return 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-500 hover:shadow-emerald-100/60';
  if (isLocked) return 'border-slate-200 bg-slate-50/70 hover:border-slate-200';
  switch (id) {
    case 'module1':
      return 'border-purple-200 bg-white hover:border-purple-500 hover:shadow-purple-100';
    case 'triangles':
      return 'border-amber-200 bg-white hover:border-amber-500 hover:shadow-amber-100';
    case 'trig-ratios':
      return 'border-indigo-200 bg-white hover:border-indigo-500 hover:shadow-indigo-100';
    case 'sine-law':
      return 'border-cyan-200 bg-white hover:border-cyan-500 hover:shadow-cyan-100';
    case 'cosine-law':
      return 'border-purple-200 bg-white hover:border-purple-500 hover:shadow-purple-100';
    default:
      return 'border-slate-200 bg-white hover:border-blue-500 hover:shadow-blue-100';
  }
};

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  const percent = module.progressPercent || (module.isCompleted ? 100 : 0);

  return (
    <button
      onClick={onClick}
      disabled={module.isLocked}
      className={`group relative p-5 md:p-6 rounded-2xl md:rounded-3xl transition-all duration-300 text-left overflow-hidden border-2 shadow-sm flex flex-col justify-between min-h-[185px] ${
        module.isLocked 
          ? 'bg-slate-100/60 border-slate-200 cursor-not-allowed opacity-75' 
          : `${getModuleColorTheme(module.id, module.isLocked, module.isCompleted)} hover:shadow-xl hover:-translate-y-1`
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${
          module.isCompleted
            ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
            : module.isLocked 
            ? 'bg-slate-200/80 border-slate-300 text-slate-400' 
            : 'bg-slate-50 border-slate-200 group-hover:scale-105 transition-transform'
        }`}>
          {getModuleIcon(module.id, module.isLocked, module.isCompleted)}
        </div>

        {module.isCompleted ? (
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <CheckCircle2 size={12} className="text-emerald-600" />
            ¡Completado!
          </span>
        ) : module.isLocked ? (
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Lock size={10} />
            {module.unlockRequirement ? 'Bloqueado' : 'Próximamente'}
          </span>
        ) : percent > 0 ? (
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            En Progreso {percent}%
          </span>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Desbloqueado
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center my-1">
        <h3 className={`text-base md:text-lg font-black tracking-tight mb-1.5 ${
          module.isCompleted 
            ? 'text-emerald-950 group-hover:text-emerald-700' 
            : module.isLocked 
            ? 'text-slate-600' 
            : 'text-slate-900 group-hover:text-indigo-600 transition-colors'
        }`}>
          {module.title}
        </h3>
        <p className="text-slate-600 text-xs md:text-[13px] font-medium leading-snug line-clamp-2">
          {module.description}
        </p>

        {/* Progress bar for unlocked active modules */}
        {!module.isLocked && (
          <div className="mt-3 w-full">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 mb-1">
              <span>Progreso</span>
              <span className={module.isCompleted ? 'text-emerald-600 font-bold' : 'text-slate-600'}>
                {percent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  module.isCompleted 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Row */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black">
        {module.isLocked ? (
          <span className="text-slate-500 text-[11px] font-bold">
            {module.unlockRequirement || 'Completa los anteriores'}
          </span>
        ) : module.isCompleted ? (
          <div className="flex items-center gap-1.5 text-emerald-700 group-hover:translate-x-1 transition-all">
            <span className="uppercase tracking-wider text-[11px]">Repasar Módulo</span>
            <ChevronRight size={14} strokeWidth={3} />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-indigo-600 group-hover:text-purple-600 group-hover:translate-x-1 transition-all">
            <span className="uppercase tracking-wider text-[11px]">
              {percent > 0 ? 'Continuar' : 'Comenzar'}
            </span>
            <ChevronRight size={14} strokeWidth={3} />
          </div>
        )}
      </div>
    </button>
  );
};
