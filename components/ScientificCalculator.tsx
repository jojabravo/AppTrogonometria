import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  X, 
  RotateCcw, 
  Delete, 
  Copy, 
  Check, 
  ChevronDown, 
  Sparkles,
  Zap,
  CornerDownLeft
} from 'lucide-react';

interface ScientificCalculatorProps {
  className?: string;
  onResultCalculated?: (result: number) => void;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  className = '',
  onResultCalculated
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isShift, setIsShift] = useState<boolean>(false);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(() => {
    try {
      return typeof window !== 'undefined' ? sessionStorage.getItem('trig_calc_last_result') : null;
    } catch {
      return null;
    }
  });
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const saveLastResult = (val: string | null) => {
    setLastResult(val);
    try {
      if (typeof window !== 'undefined') {
        if (val) {
          sessionStorage.setItem('trig_calc_last_result', val);
        } else {
          sessionStorage.removeItem('trig_calc_last_result');
        }
      }
    } catch {
      // ignore storage errors
    }
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Robust Mathematical Expression Evaluator with full DEG/RAD support
  const evaluateMath = (expr: string, mode: 'deg' | 'rad'): { value: number | null; error: string | null } => {
    if (!expr.trim()) return { value: null, error: null };

    try {
      let sanitized = expr;

      // Replace visual signs with standard JS operators
      sanitized = sanitized.replace(/×/g, '*');
      sanitized = sanitized.replace(/÷/g, '/');
      sanitized = sanitized.replace(/π/g, `(${Math.PI})`);
      sanitized = sanitized.replace(/\be\b/g, `(${Math.E})`);
      sanitized = sanitized.replace(/\^/g, '**');

      // Add implicit multiplication (e.g. 25sin(30), 25 tan(62), 5(4), (2)(3), 2π)
      sanitized = sanitized.replace(/(\d)\s*([a-zA-Z(π])/g, '$1*$2');
      sanitized = sanitized.replace(/(\))\s*(\d|[a-zA-Z(π])/g, '$1*$2');

      const degFactor = mode === 'deg' ? Math.PI / 180 : 1;
      const invDegFactor = mode === 'deg' ? 180 / Math.PI : 1;

      // Safe scope functions
      const scope: Record<string, any> = {
        sin: (x: number) => Math.sin(x * degFactor),
        cos: (x: number) => Math.cos(x * degFactor),
        tan: (x: number) => {
          const cosVal = Math.cos(x * degFactor);
          if (Math.abs(cosVal) < 1e-11) throw new Error('Indefinido (tan 90°)');
          return Math.tan(x * degFactor);
        },
        asin: (x: number) => {
          if (x < -1.0000001 || x > 1.0000001) throw new Error('Dominio asin [-1, 1]');
          const clamped = Math.max(-1, Math.min(1, x));
          return Math.asin(clamped) * invDegFactor;
        },
        acos: (x: number) => {
          if (x < -1.0000001 || x > 1.0000001) throw new Error('Dominio acos [-1, 1]');
          const clamped = Math.max(-1, Math.min(1, x));
          return Math.acos(clamped) * invDegFactor;
        },
        atan: (x: number) => Math.atan(x) * invDegFactor,
        sqrt: (x: number) => {
          if (x < 0) throw new Error('Raíz negativa');
          return Math.sqrt(x);
        },
        log: (x: number) => {
          if (x <= 0) throw new Error('Dominio log (x > 0)');
          return Math.log10(x);
        },
        ln: (x: number) => {
          if (x <= 0) throw new Error('Dominio ln (x > 0)');
          return Math.log(x);
        },
        fact: (n: number) => {
          if (n < 0 || !Number.isInteger(n) || n > 170) throw new Error('Factorial no válido');
          let res = 1;
          for (let i = 2; i <= n; i++) res *= i;
          return res;
        },
        abs: Math.abs,
      };

      // Function alias replacements
      sanitized = sanitized.replace(/\bsin⁻¹\b/g, 'asin');
      sanitized = sanitized.replace(/\bcos⁻¹\b/g, 'acos');
      sanitized = sanitized.replace(/\btan⁻¹\b/g, 'atan');
      sanitized = sanitized.replace(/\barcsin\b/g, 'asin');
      sanitized = sanitized.replace(/\barccos\b/g, 'acos');
      sanitized = sanitized.replace(/\barctan\b/g, 'atan');
      sanitized = sanitized.replace(/√\s*(\d+(\.\d+)?|\([^)]+\))/g, 'sqrt($1)');
      sanitized = sanitized.replace(/\bsqrt\b/g, 'sqrt');

      // Auto-wrap bare function arguments (e.g. sin30 -> sin(30), tan 62 -> tan(62), sqrt 25 -> sqrt(25))
      sanitized = sanitized.replace(/\b(asin|acos|atan|arcsin|arccos|arctan|sin|cos|tan|sqrt|log|ln)\s*(\d+(\.\d+)?)\b/g, '$1($2)');

      // Factorial replacement (e.g. 5! -> fact(5))
      sanitized = sanitized.replace(/(\d+)!/g, 'fact($1)');

      // Character validation whitelist
      if (!/^[0-9+\-*/().,\s^a-zA-Z_]+$/.test(sanitized)) {
        return { value: null, error: 'Sintaxis inválida' };
      }

      // Safe Function evaluation
      const funcArgs = Object.keys(scope);
      const funcValues = Object.values(scope);
      const evaluator = new Function(...funcArgs, `"use strict"; return (${sanitized});`);
      const val = evaluator(...funcValues);

      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        // Round to remove 0.00000000000004 IEEE-754 precision artifacts
        const cleanVal = parseFloat(val.toFixed(10));
        return { value: cleanVal, error: null };
      } else {
        return { value: null, error: 'Operación indefinida' };
      }
    } catch (err: any) {
      return { value: null, error: err?.message || 'Error de sintaxis' };
    }
  };

  // Live calculation on typing
  useEffect(() => {
    if (!expression.trim()) {
      setResult(null);
      return;
    }
    const { value, error } = evaluateMath(expression, angleMode);
    if (value !== null) {
      const formatted = Number.isInteger(value) 
        ? value.toString() 
        : value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
      setResult(formatted);
    } else if (error) {
      setResult(null);
    }
  }, [expression, angleMode]);

  // Handle "=" or submit
  const handleCalculate = () => {
    if (!expression.trim()) return;
    const { value, error } = evaluateMath(expression, angleMode);
    if (value !== null) {
      const formatted = Number.isInteger(value) 
        ? value.toString() 
        : value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
      setResult(formatted);
      saveLastResult(formatted);
      if (onResultCalculated) {
        onResultCalculated(value);
      }
    } else {
      setResult(error || 'Error');
    }
  };

  const handleClose = () => {
    // If there is an active valid result from the expression, keep it as last result
    if (expression.trim()) {
      const { value } = evaluateMath(expression, angleMode);
      if (value !== null) {
        const formatted = Number.isInteger(value) 
          ? value.toString() 
          : value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
        saveLastResult(formatted);
      }
    }
    setIsOpen(false);
  };

  const insertToken = (token: string) => {
    setExpression(prev => prev + token);
  };

  const handleClear = () => {
    setExpression('');
    setResult(null);
  };

  const handleBackspace = () => {
    setExpression(prev => {
      const multiCharPatterns = ['sin⁻¹(', 'cos⁻¹(', 'tan⁻¹(', 'sin(', 'cos(', 'tan(', 'sqrt(', 'log(', 'ln('];
      for (const p of multiCharPatterns) {
        if (prev.endsWith(p)) {
          return prev.slice(0, -p.length);
        }
      }
      return prev.slice(0, -1);
    });
  };

  const handleCopyResult = () => {
    const valToCopy = result || lastResult;
    if (valToCopy) {
      navigator.clipboard.writeText(valToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <>
      {/* ALWAYS ACCESSIBLE TOGGLE BUTTON (ICON + LAST VALUE PILL IF CALCULATED) */}
      <div className={`relative inline-flex items-center select-none ${className}`}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(prev => !prev);
          }}
          id="anton-calculator-pill-button"
          aria-label="Calculadora Científica"
          title={lastResult ? `Último cálculo: ${lastResult}. Clic para abrir.` : 'Abrir Calculadora Científica'}
          className={`cursor-pointer group relative flex items-center transition-all shadow-xs active:scale-95 border-2 ${
            lastResult
              ? 'gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl bg-amber-50 hover:bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-400/20'
              : 'justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border-indigo-200 text-slate-800 hover:border-indigo-400'
          }`}
        >
          {lastResult ? (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Calculator size={13} />
              </div>
              <span className="font-mono font-black text-[11px] sm:text-xs md:text-sm text-amber-950 bg-amber-200/90 px-1.5 py-0.5 rounded-md border border-amber-300 max-w-[85px] sm:max-w-[120px] truncate">
                {lastResult}
              </span>
            </div>
          ) : (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Calculator size={15} />
            </div>
          )}
        </button>
      </div>

      {/* MODAL / SLIDE-UP CALCULATOR KEYPAD (RENDERED VIA PORTAL TO PREVENT PARENT OVERFLOW/BLUR CONFINEMENT) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
              {/* Backdrop click to close */}
              <div 
                className="fixed inset-0 cursor-pointer" 
                onClick={handleClose} 
              />

              {/* Calculator Card Container - Centered, Fully Visible and Scrollable if needed */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-slate-900 text-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-slate-700 overflow-hidden flex flex-col my-auto max-h-[96vh] z-10"
              >
              {/* Header Bar */}
              <div className="p-3 sm:p-3.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-inner">
                    <Calculator size={16} />
                  </div>
                  <div>
                    <h3 className="font-black text-xs sm:text-sm text-white tracking-wide uppercase">Calculadora Científica</h3>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block">Trigonometría &amp; Geometría</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* DEG / RAD Switcher */}
                  <div className="flex bg-slate-950 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setAngleMode('deg')}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-black transition-colors ${
                        angleMode === 'deg' 
                          ? 'bg-indigo-600 text-white shadow' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      DEG (°)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAngleMode('rad')}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-black transition-colors ${
                        angleMode === 'rad' 
                          ? 'bg-indigo-600 text-white shadow' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      RAD
                    </button>
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-600"
                    title="Cerrar calculadora"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Expression & Result Display Box */}
              <div className="p-3 sm:p-3.5 bg-slate-950/95 border-b border-slate-800 flex flex-col justify-end flex-shrink-0">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
                  <span className="text-slate-400 font-semibold text-[11px]">Expresión:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      MODO {angleMode.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                      title="Reiniciar pantalla"
                    >
                      <RotateCcw size={13} />
                    </button>
                  </div>
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCalculate();
                  }}
                  placeholder="Ej: 25 * tan(62)  o  sqrt(8^2 + 15^2)"
                  className="w-full bg-transparent font-mono text-base sm:text-lg text-white placeholder-slate-600 focus:outline-none tracking-wide"
                />

                {/* Evaluated Live Result */}
                <div className="mt-1.5 flex items-center justify-between pt-1.5 border-t border-slate-800/80">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase">Resultado:</span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className={`font-mono text-lg sm:text-xl font-black ${
                      result && result !== 'Error' && !result.includes('inválid') && !result.includes('Indefinido')
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}>
                      {result ? `= ${result}` : lastResult ? `[Anterior: ${lastResult}]` : '= 0'}
                    </span>
                    {(result || lastResult) && (
                      <button
                        type="button"
                        onClick={handleCopyResult}
                        className="p-1 rounded-md sm:rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                        title="Copiar resultado"
                      >
                        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Scientific Keypad Grid */}
              <div className="p-2 sm:p-3 grid grid-cols-5 gap-1 sm:gap-1.5 bg-slate-900 select-none overflow-y-auto flex-1">
                {/* ROW 1: Controls & Parens */}
                <button
                  type="button"
                  onClick={() => setIsShift(!isShift)}
                  className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-black text-[11px] sm:text-xs transition-colors flex items-center justify-center shadow-xs ${
                    isShift ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-300' : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                  }`}
                >
                  Shift {isShift ? '★' : ''}
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('(')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs sm:text-sm"
                >
                  (
                </button>
                <button
                  type="button"
                  onClick={() => insertToken(')')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs sm:text-sm"
                >
                  )
                </button>
                <button
                  type="button"
                  onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 font-black text-[10px] sm:text-xs"
                >
                  {angleMode === 'deg' ? 'deg' : 'rad'}
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 flex items-center justify-center"
                  title="Borrar carácter"
                >
                  <Delete size={15} />
                </button>

                {/* ROW 2: Trig Functions */}
                <button
                  type="button"
                  onClick={() => insertToken(isShift ? 'asin(' : 'sin(')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-xs sm:text-sm border border-slate-700"
                >
                  {isShift ? 'sin⁻¹' : 'sin'}
                </button>
                <button
                  type="button"
                  onClick={() => insertToken(isShift ? 'acos(' : 'cos(')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-xs sm:text-sm border border-slate-700"
                >
                  {isShift ? 'cos⁻¹' : 'cos'}
                </button>
                <button
                  type="button"
                  onClick={() => insertToken(isShift ? 'atan(' : 'tan(')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-xs sm:text-sm border border-slate-700"
                >
                  {isShift ? 'tan⁻¹' : 'tan'}
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('ln(')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  ln
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('log(')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  log
                </button>

                {/* ROW 3: Powers, Roots & Numbers */}
                <button
                  type="button"
                  onClick={() => insertToken(isShift ? '^3' : '^2')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs"
                >
                  {isShift ? 'x³' : 'x²'}
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('^')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs"
                >
                  xʸ
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('sqrt(')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs"
                >
                  √
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs col-span-2 shadow-xs"
                >
                  C (Limpiar)
                </button>

                {/* ROW 4: Numbers 7, 8, 9, ÷, × */}
                <button
                  type="button"
                  onClick={() => insertToken('7')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  7
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('8')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  8
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('9')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  9
                </button>
                <button
                  type="button"
                  onClick={() => insertToken(' / ')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-indigo-900/70 hover:bg-indigo-800 border border-indigo-700/60 text-indigo-200 font-black text-base"
                >
                  ÷
                </button>
                <button
                  type="button"
                  onClick={() => insertToken(' * ')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-indigo-900/70 hover:bg-indigo-800 border border-indigo-700/60 text-indigo-200 font-black text-base"
                >
                  ×
                </button>

                {/* ROW 5: Numbers 4, 5, 6, -, + */}
                <button
                  type="button"
                  onClick={() => insertToken('4')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  4
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('5')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  5
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('6')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  6
                </button>
                <button
                  type="button"
                  onClick={() => insertToken(' - ')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-indigo-900/70 hover:bg-indigo-800 border border-indigo-700/60 text-indigo-200 font-black text-base"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => insertToken(' + ')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-indigo-900/70 hover:bg-indigo-800 border border-indigo-700/60 text-indigo-200 font-black text-base"
                >
                  +
                </button>

                {/* ROW 6: Numbers 1, 2, 3, π, = */}
                <button
                  type="button"
                  onClick={() => insertToken('1')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('2')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('3')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('π')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 font-serif font-black text-sm border border-slate-700"
                >
                  π
                </button>
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl shadow-lg border border-emerald-400 row-span-2 flex items-center justify-center active:scale-95 transition-transform"
                >
                  =
                </button>

                {/* ROW 7: 0, ., Ans */}
                <button
                  type="button"
                  onClick={() => insertToken('0')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs col-span-2 text-center"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('.')}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base border border-slate-700 shadow-xs"
                >
                  .
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (lastResult) insertToken(lastResult);
                  }}
                  disabled={!lastResult}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 disabled:opacity-40"
                  title="Insertar respuesta previa"
                >
                  Ans
                </button>
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="p-2.5 sm:p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-shrink-0">
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate max-w-[160px] sm:max-w-[200px]">
                  {lastResult ? `Guardado: ${lastResult}` : 'Presiona "=" para calcular'}
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {lastResult && (
                    <button
                      type="button"
                      onClick={() => saveLastResult(null)}
                      className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-[10px] sm:text-[11px] transition-colors"
                      title="Borrar resultado guardado"
                    >
                      Borrar Guardado
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleCalculate();
                      handleClose();
                    }}
                    className="px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider transition-colors shadow flex items-center gap-1"
                  >
                    <span>Guardar y Cerrar</span>
                    <CornerDownLeft size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
  </>
);
};
