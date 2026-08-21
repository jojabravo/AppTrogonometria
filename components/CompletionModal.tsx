import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Trophy, ArrowRight, Sparkles, CheckCircle2, RotateCcw, Compass } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  completedModuleName: string;
  nextModuleName?: string;
  nextModuleId?: string;
  onContinueNext?: () => void;
  onGoToMenu: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  completedModuleName,
  nextModuleName,
  nextModuleId,
  onContinueNext,
  onGoToMenu
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 max-w-lg w-full text-center space-y-6 shadow-2xl border-4 border-emerald-400 relative overflow-hidden"
        >
          {/* Background confetti / sparkles effect */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-200 rounded-full blur-2xl opacity-60"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-60"></div>

          {/* Trophy Header */}
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center mx-auto shadow-lg border-2 border-amber-300">
              <Trophy size={48} className="text-amber-900 animate-bounce" />
            </div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-[11px] uppercase tracking-widest px-3.5 py-1 rounded-full mt-4">
              <Sparkles size={13} className="text-emerald-600" /> ¡Módulo Completado!
            </span>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              ¡Excelente Trabajo!
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
              Has dominado con éxito <strong className="text-slate-900">{completedModuleName}</strong> y tu progreso se ha guardado localmente.
            </p>
          </div>

          {/* Next Module Unlock Card */}
          {nextModuleName ? (
            <div className="p-4 md:p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-indigo-200 text-left flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm font-black text-sm">
                🔓
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
                  ¡Nuevo Módulo Desbloqueado!
                </span>
                <span className="text-sm font-black text-slate-900 block">
                  {nextModuleName}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-bold">
              🎉 ¡Has completado todos los módulos interactivos disponibles de trigonometría!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {nextModuleName && onContinueNext ? (
              <button
                onClick={onContinueNext}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-2xl font-black text-xs md:text-sm uppercase tracking-wider shadow-lg hover:shadow-indigo-200 transition-all hover:scale-[1.02]"
              >
                <span>Continuar a {nextModuleName}</span>
                <ArrowRight size={16} />
              </button>
            ) : null}

            <button
              onClick={onGoToMenu}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 px-6 rounded-2xl font-black text-xs md:text-sm uppercase tracking-wider transition-colors"
            >
              <span>Volver a la Ruta</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
