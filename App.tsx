import React, { useState, useEffect, useRef } from 'react';
import { Screen, Module } from './types';
import { Teacher } from './components/Teacher';
import { ModuleCard } from './components/ModuleCard';
import { AnglesModule } from './components/simulations/AnglesModule';
import { AngleExplorer } from './components/simulations/AngleExplorer';
import { RadianVisualizer } from './components/simulations/RadianVisualizer';
import { Converter } from './components/simulations/Converter';
import { ArcAndSector } from './components/simulations/ArcAndSector';
import { SenseSimulation } from './components/simulations/SenseSimulation';
import { FooterCredits } from './components/FooterCredits';
import { TrigRatiosModule } from './components/simulations/TrigRatiosModule';
import { SineLawModule } from './components/simulations/SineLawModule';
import { CosineLawModule } from './components/simulations/CosineLawModule';
import { TrianglesModule } from './components/simulations/TrianglesModule';
import { ScientificCalculator } from './components/ScientificCalculator';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { CompletionModal } from './components/CompletionModal';
import { 
  getStoredProgress, 
  markModuleComplete, 
  updateModuleProgress, 
  resetAllProgress, 
  isModuleUnlocked,
  AppProgress,
  AVAILABLE_MODULE_COUNT
} from './utils/progressStorage';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  BrainCircuit, 
  Award, 
  Pencil, 
  GraduationCap, 
  Calculator, 
  Sparkles, 
  Zap, 
  RotateCw, 
  Compass, 
  Radio, 
  Triangle,
  Trophy,
  RotateCcw,
  CheckCircle2,
  Lock,
  Flame,
  AlertCircle
} from 'lucide-react';

const MODULE_BASE_CONFIG: { id: string; title: string; description: string; unlockReq?: string }[] = [
  { id: 'module1', title: 'Ángulos', description: 'La esencia del giro y la dirección en el espacio.' },
  { id: 'triangles', title: 'Triángulos', description: 'Paralelas, tipos, Pitágoras y Teorema de Thales.', unlockReq: 'Completa "Ángulos" para desbloquear' },
  { id: 'trig-ratios', title: 'Razones Trig.', description: 'La conexión entre ángulos y lados.', unlockReq: 'Completa "Triángulos" para desbloquear' },
  { id: 'sine-law', title: 'Ley del Seno', description: 'Proporciones, rescate y el caso ambiguo.', unlockReq: 'Completa "Razones Trig." para desbloquear' },
  { id: 'cosine-law', title: 'Ley del Coseno', description: 'La generalización de Pitágoras.', unlockReq: 'Completa "Ley del Seno" para desbloquear' },
  { id: 'graphs', title: 'Gráficas', description: 'El ritmo de las ondas en el tiempo.' },
  { id: 'identities', title: 'Identidades', description: 'La danza de las equivalencias.' },
  { id: 'equations', title: 'Ecuaciones', description: 'Encontrando la incógnita del giro.' },
];

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [activeSubModule, setActiveSubModule] = useState(0);
  const [planetFlashing, setPlanetFlashing] = useState(false);
  const [torqueActive, setTorqueActive] = useState(false);

  // LocalStorage progress state
  const [progress, setProgress] = useState<AppProgress>(getStoredProgress);
  const [completionModalInfo, setCompletionModalInfo] = useState<{
    isOpen: boolean;
    completedName: string;
    nextName?: string;
    nextId?: Screen;
  }>({
    isOpen: false,
    completedName: ''
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Physics refs for orbit rotation, torque and inertia
  const orbitRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(36); // Base speed: 36 deg/s (10s full orbit)
  const isHoveredRef = useRef(false);

  // Listen to cross-tab / storage progress updates
  useEffect(() => {
    const handleProgressUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<AppProgress>;
      if (customEvent.detail) {
        setProgress(customEvent.detail);
      } else {
        setProgress(getStoredProgress());
      }
    };

    window.addEventListener('trigonometrica-progress-updated', handleProgressUpdated);
    window.addEventListener('storage', handleProgressUpdated);
    return () => {
      window.removeEventListener('trigonometrica-progress-updated', handleProgressUpdated);
      window.removeEventListener('storage', handleProgressUpdated);
    };
  }, []);

  // Physics animation loop with easing, inertia damping and torque
  useEffect(() => {
    if (screen !== 'welcome') return;

    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Base target orbital speed
      const targetVelocity = isHoveredRef.current ? 16 : 36;

      // Inercia / torque easing (exponential smoothing decay towards target velocity)
      const easingRate = 1.35; // Friction / restitution damping constant
      const dampingFactor = 1 - Math.exp(-easingRate * dt);
      velocityRef.current += (targetVelocity - velocityRef.current) * dampingFactor;

      // Update rotation angle
      angleRef.current = (angleRef.current + velocityRef.current * dt) % 360;

      if (orbitRef.current) {
        orbitRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [screen]);

  const handlePlanetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Apply torque impulse: increase angular velocity instantly
    velocityRef.current = Math.min(velocityRef.current + 240, 620);
    setPlanetFlashing(true);
    setTorqueActive(true);

    setTimeout(() => {
      setPlanetFlashing(false);
    }, 850);

    setTimeout(() => {
      setTorqueActive(false);
    }, 2800);
  };

  // Build dynamic modules list with unlock and completion status
  const dynamicModules: Module[] = MODULE_BASE_CONFIG.map((mod) => {
    const isUnlocked = isModuleUnlocked(mod.id, progress);
    const modData = progress.modules[mod.id];
    const isCompleted = progress.completedModules.includes(mod.id) || Boolean(modData?.completed);
    const progressPercent = modData?.percent || (isCompleted ? 100 : 0);

    return {
      id: mod.id,
      title: mod.title,
      description: mod.description,
      isLocked: !isUnlocked,
      isCompleted,
      progressPercent,
      unlockRequirement: !isUnlocked ? mod.unlockReq : undefined
    };
  });

  // Calculate overall course progress
  const completedCount = progress.completedModules.filter(id => 
    ['module1', 'triangles', 'trig-ratios', 'sine-law', 'cosine-law'].includes(id)
  ).length;
  const overallPercent = Math.round((completedCount / AVAILABLE_MODULE_COUNT) * 100);

  // Completion handlers for each module
  const handleFinishModule1 = () => {
    const updated = markModuleComplete('module1');
    setProgress(updated);
    setCompletionModalInfo({
      isOpen: true,
      completedName: 'Módulo 1: Ángulos',
      nextName: 'Módulo 2: Triángulos',
      nextId: 'triangles'
    });
  };

  const handleFinishTriangles = () => {
    const updated = markModuleComplete('triangles');
    setProgress(updated);
    setCompletionModalInfo({
      isOpen: true,
      completedName: 'Módulo 2: Triángulos',
      nextName: 'Módulo 3: Razones Trigonométricas',
      nextId: 'trig-ratios'
    });
  };

  const handleFinishTrigRatios = () => {
    const updated = markModuleComplete('trig-ratios');
    setProgress(updated);
    setCompletionModalInfo({
      isOpen: true,
      completedName: 'Módulo 3: Razones Trigonométricas',
      nextName: 'Módulo 4: Ley del Seno',
      nextId: 'sine-law'
    });
  };

  const handleFinishSineLaw = () => {
    const updated = markModuleComplete('sine-law');
    setProgress(updated);
    setCompletionModalInfo({
      isOpen: true,
      completedName: 'Módulo 4: Ley del Seno',
      nextName: 'Módulo 5: Ley del Coseno',
      nextId: 'cosine-law'
    });
  };

  const handleFinishCosineLaw = () => {
    const updated = markModuleComplete('cosine-law');
    setProgress(updated);
    setScreen('final');
  };

  const handleResetProgressConfirm = () => {
    const resetProg = resetAllProgress();
    setProgress(resetProg);
    setShowResetConfirm(false);
  };

  const renderWelcome = () => (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-y-auto">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12 gap-8 md:gap-12 pt-12 md:pt-16">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16">
          
          {/* Left: Portada Image with Hologram Effect */}
          <div className="order-2 lg:order-1 relative group">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-slate-100 transform hover:scale-[1.02] transition-transform duration-700">
               <img 
                 src="https://i.postimg.cc/9fFTMhSp/portadatrigono.png" 
                 alt="Trigonométria Portada" 
                 referrerPolicy="no-referrer"
                 className="w-full h-auto object-cover select-none"
               />
               
               {/* Hologram Effects */}
               <div className="absolute inset-0 pointer-events-none">
                 {/* Blue Overlay Tint */}
                 <div className="absolute inset-0 bg-cyan-500/15 mix-blend-overlay z-10"></div>
                 
                 {/* Orbit line overlay */}
                 <div className="absolute top-[35%] left-[50%] w-[160px] h-[160px] -ml-[80px] -mt-[80px] rounded-full border border-cyan-400/35 border-dashed z-20 pointer-events-none"></div>

                 {/* Orbiting Planet Effect with Torque Physics & Smooth Easing */}
                 <div className="absolute top-[35%] left-[50%] w-0 h-0 z-30 pointer-events-none">
                    <div 
                      ref={orbitRef}
                      className="orbit-container absolute flex items-center justify-center w-[160px] h-[160px] -ml-[80px] -mt-[80px] pointer-events-none transition-[filter] duration-300"
                    >
                       <button
                         type="button"
                         onClick={handlePlanetClick}
                         onMouseEnter={() => { isHoveredRef.current = true; }}
                         onMouseLeave={() => { isHoveredRef.current = false; }}
                         title="¡Haz clic para aplicar torque e impulso angular!"
                         className="pointer-events-auto absolute top-0 -mt-3.5 -ml-3.5 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer focus:outline-none transition-transform hover:scale-125 group z-40"
                       >
                         {/* Shockwave effect */}
                         {planetFlashing && (
                           <span className="absolute inset-0 rounded-full border-2 border-amber-300 planet-shockwave pointer-events-none"></span>
                         )}
                         {/* Glowing pulsating radar ring */}
                         <span className="absolute w-5 h-5 rounded-full bg-cyan-400/40 animate-ping"></span>
                         {/* Planet Core */}
                         <span className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                           planetFlashing 
                             ? 'bg-amber-300 scale-150 shadow-glow-amber planet-flash' 
                             : 'bg-cyan-300 shadow-glow-cyan group-hover:bg-amber-300'
                         }`}></span>
                       </button>
                    </div>
                 </div>
                 
                 {/* Wave Phenomena Overlay (SVG) */}
                 <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full z-15 hologram-wave">
                   <path 
                     d="M 0 150 Q 100 50 200 150 Q 300 250 400 150" 
                     fill="none" 
                     stroke="rgba(34, 211, 238, 0.9)" 
                     strokeWidth="6" 
                     strokeDasharray="12 6"
                     className="shadow-glow-cyan"
                   />
                   <path 
                     d="M 0 170 Q 100 70 200 170 Q 300 270 400 170" 
                     fill="none" 
                     stroke="rgba(147, 51, 234, 0.8)" 
                     strokeWidth="4" 
                     strokeDasharray="8 8"
                     className="shadow-glow-purple"
                   />
                 </svg>

                 {/* Rising Curves Effect */}
                 <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    {/* Rising Sines */}
                    <svg viewBox="0 0 200 100" className="absolute bottom-10 left-1/4 w-36 h-24 rise-sine opacity-0">
                       <path d="M0,50 C10,10 30,90 50,50 S90,10 100,50 S140,90 150,50 S190,10 200,50" fill="none" stroke="#22d3ee" strokeWidth="6" className="shadow-glow-cyan" />
                    </svg>
                    
                    {/* Rising Tangents */}
                    <svg viewBox="0 0 100 100" className="absolute bottom-16 right-1/4 w-28 h-28 rise-tangent opacity-0">
                       <path d="M20,100 Q30,50 20,0 M50,100 Q60,50 50,0 M80,100 Q90,50 80,0" fill="none" stroke="#9333ea" strokeWidth="5" strokeDasharray="6 6" className="shadow-glow-purple" />
                    </svg>
                 </div>
               </div>
            </div>
            
            {/* Interactive physics hint */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300">
              {torqueActive ? (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-300 rounded-full py-1.5 px-4 shadow-sm animate-pulse">
                  <Zap size={14} className="text-amber-500 fill-amber-400" />
                  <span>¡Torque aplicado! Aceleración con desaceleración por inercia</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-cyan-700 bg-cyan-50/90 border border-cyan-200 rounded-full py-1.5 px-4 shadow-sm hover:bg-cyan-100/90 transition-colors">
                  <RotateCw size={14} className="text-cyan-600" />
                  <span>Haz clic en el planeta para impulsarlo y observar el efecto de inercia</span>
                </div>
              )}
            </div>

            {/* Decorative background elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
          </div>

          {/* Right: Content */}
          <div className="text-center lg:text-left space-y-4 md:space-y-8 order-1 lg:order-2 flex flex-col items-center lg:items-start overflow-hidden">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-6 py-2.5 rounded-full text-indigo-700 font-black text-xs md:text-sm uppercase tracking-widest border border-indigo-100 shadow-sm">
               <GraduationCap size={18} /> I.E JOSEFA CAMPOS
            </div>
            {/* Título responsivo con ajuste de tamaño para evitar desbordamiento */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-[0.85] tracking-tight uppercase">
              TRIGONO<br className="block sm:hidden" />
              <span className="text-purple-600">METRÍA</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-700 font-bold leading-relaxed max-w-xl mx-auto lg:mx-0 px-4 lg:px-0">
              <span className="text-indigo-600">El Lenguaje del Universo.</span> Explora la belleza de los giros y las ondas con sentido humano y rigor pedagógico.
            </p>
            
            {/* Action buttons */}
            <div className="pt-2 md:pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => setScreen('menu')}
                className="group relative bg-purple-600 hover:bg-indigo-600 text-white px-8 md:px-14 py-6 md:py-8 rounded-3xl md:rounded-[2.5rem] text-xl md:text-2xl font-black shadow-2xl transition-all hover:-translate-y-2 active:scale-95 flex items-center gap-4 md:gap-6 mx-auto lg:mx-0 z-20 overflow-hidden"
              >
                🚀 ¡COMENZAR!
                <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
              </button>

              {completedCount > 0 && (
                <div className="flex items-center gap-2 bg-white/90 border-2 border-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-black text-emerald-900 shadow-sm">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Progreso guardado: {completedCount}/{AVAILABLE_MODULE_COUNT} ({overallPercent}%)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <FooterCredits />
    </div>
  );

  const renderMenu = () => (
    <div className="min-h-screen p-4 sm:p-8 md:p-12 max-w-7xl mx-auto space-y-8 flex flex-col justify-between">
      {/* Header & Teacher */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200">
              Ruta Progresiva de Aprendizaje
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Ruta de <span className="text-indigo-600">Aprendizaje</span>
          </h1>
          <p className="text-slate-500 mt-2 text-xs md:text-sm font-black uppercase tracking-widest bg-white border border-slate-200 px-4 py-1.5 rounded-xl shadow-xs inline-block">
            Completa cada módulo para desbloquear el siguiente nivel
          </p>
        </div>
        <div className="hidden lg:block max-w-md">
           <Teacher message="Cada módulo que completas desbloquea el siguiente paso en el mapa estelar. Tu progreso se guarda automáticamente." />
        </div>
      </div>

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Overall Progress Dashboard Card */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Trophy size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Tu Avance en el Curso
              </span>
              <h3 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>{completedCount} de {AVAILABLE_MODULE_COUNT} Módulos Completados</span>
                {completedCount === AVAILABLE_MODULE_COUNT && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                    ¡Curso Completado! 🎉
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700">
              <Sparkles size={15} className="text-amber-500" />
              <span>{completedCount * 100} Puntos</span>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200 text-xs font-bold flex items-center gap-1.5"
              title="Reiniciar progreso guardado"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-600">Dominio Global de Trigonometría</span>
            <span className="text-indigo-600 font-mono text-sm">{overallPercent}%</span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 transition-all duration-700 shadow-xs"
              style={{ width: `${Math.max(5, overallPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Dynamic Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 flex-1">
        {dynamicModules.map((mod) => (
          <ModuleCard 
            key={mod.id} 
            module={mod} 
            onClick={() => {
              if (!mod.isLocked) {
                setScreen(mod.id as Screen);
              }
            }} 
          />
        ))}
      </div>

      {/* Reset Progress Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-slate-900 space-y-4 shadow-2xl border-2 border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle size={26} />
            </div>
            <h3 className="text-lg font-black text-slate-900">¿Reiniciar todo el progreso?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Esto borrará tu avance en localStorage y volverá a bloquear los módulos hasta que los completes de nuevo.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetProgressConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Sí, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterCredits />
    </div>
  );

  const renderModule1 = () => (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-3 sm:px-6 py-2.5 sm:py-3.5 glass-vibrant border-b border-slate-200 sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <button 
              onClick={() => setScreen('menu')} 
              className="flex items-center gap-1 sm:gap-1.5 text-slate-800 hover:text-purple-600 transition-colors font-black uppercase text-xs md:text-sm tracking-wider group py-1.5 px-2 rounded-xl hover:bg-slate-100/80"
            >
              <ChevronLeft strokeWidth={3.5} className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden xs:inline">VOLVER</span>
            </button>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
            <h2 className="text-xs sm:text-base md:text-xl font-black text-purple-700 tracking-tight uppercase truncate max-w-full">
              Módulo 1: Ángulos
            </h2>
            <span className="text-[7.5px] sm:text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider md:tracking-[0.25em] font-black truncate max-w-full">
              Giro, Radianes, Arco &amp; Misiones
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2.5">
            <ScientificCalculator />
            <div className="hidden lg:flex w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 items-center justify-center text-white shadow-xs">
              <Compass size={18} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
        <AnglesModule onBack={() => setScreen('menu')} onFinish={handleFinishModule1} />
      </main>
      
      <FooterCredits />
    </div>
  );

  const renderTriangles = () => (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-3 sm:px-6 py-2.5 sm:py-3.5 glass-vibrant border-b border-slate-200 sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <button 
              onClick={() => setScreen('menu')} 
              className="flex items-center gap-1 sm:gap-1.5 text-slate-800 hover:text-amber-600 transition-colors font-black uppercase text-xs md:text-sm tracking-wider group py-1.5 px-2 rounded-xl hover:bg-slate-100/80"
            >
              <ChevronLeft strokeWidth={3.5} className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden xs:inline">VOLVER</span>
            </button>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
            <h2 className="text-xs sm:text-base md:text-xl font-black text-amber-700 tracking-tight uppercase truncate max-w-full">
              Módulo: Triángulos
            </h2>
            <span className="text-[7.5px] sm:text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider md:tracking-[0.25em] font-black truncate max-w-full">
              Paralelas, Tipos, Pitágoras &amp; Thales
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2.5">
            <ScientificCalculator />
            <div className="hidden lg:flex w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 items-center justify-center text-white shadow-xs">
              <Triangle size={18} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
         <TrianglesModule onBack={() => setScreen('menu')} onFinish={handleFinishTriangles} />
      </main>
      
      <FooterCredits />
    </div>
  );

  const renderTrigRatios = () => (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-3 sm:px-6 py-2.5 sm:py-3.5 glass-vibrant border-b border-slate-200 sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <button 
              onClick={() => setScreen('menu')} 
              className="flex items-center gap-1 sm:gap-1.5 text-slate-800 hover:text-indigo-600 transition-colors font-black uppercase text-xs md:text-sm tracking-wider group py-1.5 px-2 rounded-xl hover:bg-slate-100/80"
            >
              <ChevronLeft strokeWidth={3.5} className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden xs:inline">VOLVER</span>
            </button>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
            <h2 className="text-xs sm:text-base md:text-xl font-black text-indigo-700 tracking-tight uppercase truncate max-w-full">
              Razones Trigonométricas
            </h2>
            <span className="text-[7.5px] sm:text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider md:tracking-[0.25em] font-black truncate max-w-full">
              Aplicaciones y Práctica
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2.5">
            <ScientificCalculator />
            <div className="hidden lg:flex w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 items-center justify-center text-white shadow-xs">
              <Calculator size={18} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
         <TrigRatiosModule onBack={() => setScreen('menu')} onFinish={handleFinishTrigRatios} />
      </main>
      
      <FooterCredits />
    </div>
  );

  const renderSineLaw = () => (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-3 sm:px-6 py-2.5 sm:py-3.5 glass-vibrant border-b border-slate-200 sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <button 
              onClick={() => setScreen('menu')} 
              className="flex items-center gap-1 sm:gap-1.5 text-slate-800 hover:text-cyan-600 transition-colors font-black uppercase text-xs md:text-sm tracking-wider group py-1.5 px-2 rounded-xl hover:bg-slate-100/80"
            >
              <ChevronLeft strokeWidth={3.5} className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden xs:inline">VOLVER</span>
            </button>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
            <h2 className="text-xs sm:text-base md:text-xl font-black text-cyan-700 tracking-tight uppercase truncate max-w-full">
              Ley del Seno
            </h2>
            <span className="text-[7.5px] sm:text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider md:tracking-[0.25em] font-black truncate max-w-full">
              Proporciones, Rescate &amp; Caso Ambiguo
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2.5">
            <ScientificCalculator />
            <div className="hidden lg:flex w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 items-center justify-center text-white shadow-xs">
              <Radio size={18} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
         <SineLawModule onBack={() => setScreen('menu')} onFinish={handleFinishSineLaw} />
      </main>
      
      <FooterCredits />
    </div>
  );

  const renderCosineLaw = () => (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-3 sm:px-6 py-2.5 sm:py-3.5 glass-vibrant border-b border-slate-200 sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <button 
              onClick={() => setScreen('menu')} 
              className="flex items-center gap-1 sm:gap-1.5 text-slate-800 hover:text-indigo-600 transition-colors font-black uppercase text-xs md:text-sm tracking-wider group py-1.5 px-2 rounded-xl hover:bg-slate-100/80"
            >
              <ChevronLeft strokeWidth={3.5} className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden xs:inline">VOLVER</span>
            </button>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
            <h2 className="text-xs sm:text-base md:text-xl font-black text-indigo-700 tracking-tight uppercase truncate max-w-full">
              Ley del Coseno
            </h2>
            <span className="text-[7.5px] sm:text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider md:tracking-[0.25em] font-black truncate max-w-full">
              Pitágoras Generalizado &amp; Juegos
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2.5">
            <ScientificCalculator />
            <div className="hidden lg:flex w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 items-center justify-center text-white shadow-xs">
              <Compass size={18} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
         <CosineLawModule onBack={() => setScreen('menu')} onFinish={handleFinishCosineLaw} />
      </main>
      
      <FooterCredits />
    </div>
  );

  const renderFinal = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="max-w-4xl text-center space-y-12 md:space-y-16">
        <Teacher message="¡Misión cumplida! Has completado todos los módulos de este viaje de trigonometría. ¡El universo ahora es mucho más claro para ti!" />
        
        <div className="bg-white p-8 md:p-12 rounded-3xl md:rounded-[3rem] border-4 border-purple-500 shadow-2xl scale-100 md:scale-110 space-y-4">
           <Award size={80} className="text-purple-600 mx-auto mb-4 md:mb-6" />
           <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 md:mb-4">¡Gran Maestro de Trigonometría!</h2>
           <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] md:text-sm">
             Todos los 5 módulos interactivos completados
           </p>

           <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
             {['Ángulos', 'Triángulos', 'Razones Trigonométricas', 'Ley del Seno', 'Ley del Coseno'].map((m) => (
               <span key={m} className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                 <CheckCircle2 size={13} className="text-emerald-600" />
                 {m}
               </span>
             ))}
           </div>
        </div>

        <button 
          onClick={() => { setScreen('menu'); }}
          className="bg-slate-900 text-white px-10 md:px-14 py-4 md:py-6 rounded-2xl md:rounded-3xl text-[10px] md:text-sm uppercase tracking-[0.5em] font-black hover:bg-purple-600 transition-all shadow-xl"
        >
          VOLVER A LA RUTA DE APRENDIZAJE
        </button>
        
        <FooterCredits />
      </div>
    </div>
  );

  return (
    <div className="text-slate-900 selection:bg-purple-200 selection:text-purple-900 min-h-screen relative">
      {/* Module Completion Modal Dialog */}
      <CompletionModal
        isOpen={completionModalInfo.isOpen}
        completedModuleName={completionModalInfo.completedName}
        nextModuleName={completionModalInfo.nextName}
        nextModuleId={completionModalInfo.nextId}
        onContinueNext={() => {
          if (completionModalInfo.nextId) {
            setScreen(completionModalInfo.nextId);
          }
          setCompletionModalInfo(prev => ({ ...prev, isOpen: false }));
        }}
        onGoToMenu={() => {
          setScreen('menu');
          setCompletionModalInfo(prev => ({ ...prev, isOpen: false }));
        }}
      />

      {screen === 'welcome' && renderWelcome()}
      {screen === 'menu' && renderMenu()}
      {screen === 'module1' && renderModule1()}
      {screen === 'triangles' && renderTriangles()}
      {screen === 'trig-ratios' && renderTrigRatios()}
      {screen === 'sine-law' && renderSineLaw()}
      {screen === 'cosine-law' && renderCosineLaw()}
      {screen === 'final' && renderFinal()}
    </div>
  );
};

export default App;
