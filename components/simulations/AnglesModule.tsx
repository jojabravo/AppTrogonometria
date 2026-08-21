import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  RotateCcw,
  Trophy, 
  Flame, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Target,
  Zap,
  Sliders,
  BookOpen,
  Gamepad2,
  BrainCircuit,
  Calculator,
  Award,
  Clock,
  Radar,
  Radio,
  PieChart,
  Layers,
  Edit3,
  Lightbulb,
  CornerDownRight,
  RefreshCw,
  Eye,
  Check,
  Divide,
  Hash
} from 'lucide-react';
import { MathFormula } from '../MathFormula';
import { Teacher } from '../Teacher';
import { 
  parseMathExpression, 
  formatRadianToPiLatex, 
  formatDegreeToLatex, 
  inputToLatexPreview,
  approximateFraction,
  gcd
} from '../../utils/mathParser';

interface AnglesModuleProps {
  onBack: () => void;
  onFinish?: () => void;
}

type TabType = 'concept' | 'radians-lab' | 'arc-sector' | 'exercises' | 'challenges' | 'solver';

export const AnglesModule: React.FC<AnglesModuleProps> = ({ onBack, onFinish }) => {
  const [activeTab, setActiveTab] = useState<TabType>('concept');

  // ==========================================
  // TAB 1: EXPLORADOR DE ÁNGULOS & SENTIDO
  // ==========================================
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const [isNegativeSense, setIsNegativeSense] = useState<boolean>(false);
  const [showReferenceAngle, setShowReferenceAngle] = useState<boolean>(true);
  const [showCoterminal, setShowCoterminal] = useState<boolean>(true);
  const isDraggingDial = useRef<boolean>(false);
  const dialRef = useRef<SVGSVGElement>(null);

  // Normalization & math for Tab 1
  const effectiveAngle = isNegativeSense ? -Math.abs(angleDeg) : Math.abs(angleDeg);
  
  // Normalized in [0, 360)
  const norm360 = ((effectiveAngle % 360) + 360) % 360;
  
  // Quadrant
  let quadrant = 'QI';
  if (norm360 === 0 || norm360 === 360) quadrant = 'Eje +X (0°)';
  else if (norm360 === 90) quadrant = 'Eje +Y (90°)';
  else if (norm360 === 180) quadrant = 'Eje -X (180°)';
  else if (norm360 === 270) quadrant = 'Eje -Y (270°)';
  else if (norm360 > 0 && norm360 < 90) quadrant = 'Cuadrante I (QI)';
  else if (norm360 > 90 && norm360 < 180) quadrant = 'Cuadrante II (QII)';
  else if (norm360 > 180 && norm360 < 270) quadrant = 'Cuadrante III (QIII)';
  else if (norm360 > 270 && norm360 < 360) quadrant = 'Cuadrante IV (QIV)';

  // Reference angle
  let refAngle = norm360;
  if (norm360 > 90 && norm360 <= 180) refAngle = 180 - norm360;
  else if (norm360 > 180 && norm360 <= 270) refAngle = norm360 - 180;
  else if (norm360 > 270 && norm360 < 360) refAngle = 360 - norm360;
  if (refAngle > 90) refAngle = 90;

  // Classification
  let classification = {
    name: 'Agudo',
    desc: 'Mayor a 0° y menor a 90°',
    color: 'bg-emerald-500 text-white',
    badge: 'border-emerald-300 bg-emerald-50 text-emerald-800'
  };
  const positiveMag = Math.abs(effectiveAngle);
  if (positiveMag === 0) {
    classification = { name: 'Nulo', desc: 'Apertura de 0° (los rayos coinciden)', color: 'bg-slate-500 text-white', badge: 'border-slate-300 bg-slate-50 text-slate-700' };
  } else if (positiveMag === 90) {
    classification = { name: 'Recto', desc: 'Exactamente 90° (rayos perpendiculares)', color: 'bg-blue-600 text-white', badge: 'border-blue-300 bg-blue-50 text-blue-800' };
  } else if (positiveMag > 0 && positiveMag < 90) {
    classification = { name: 'Agudo', desc: 'Apertura menor a un ángulo recto (< 90°)', color: 'bg-emerald-600 text-white', badge: 'border-emerald-300 bg-emerald-50 text-emerald-800' };
  } else if (positiveMag > 90 && positiveMag < 180) {
    classification = { name: 'Obtuso', desc: 'Mayor a 90° y menor a 180°', color: 'bg-amber-500 text-white', badge: 'border-amber-300 bg-amber-50 text-amber-800' };
  } else if (positiveMag === 180) {
    classification = { name: 'Llano / Plano', desc: 'Exactamente 180° (media vuelta)', color: 'bg-purple-600 text-white', badge: 'border-purple-300 bg-purple-50 text-purple-800' };
  } else if (positiveMag > 180 && positiveMag < 360) {
    classification = { name: 'Reflejo / Cóncavo', desc: 'Mayor a 180° y menor a 360°', color: 'bg-rose-500 text-white', badge: 'border-rose-300 bg-rose-50 text-rose-800' };
  } else if (positiveMag === 360) {
    classification = { name: 'Completo / Perigonal', desc: 'Exactamente 360° (giro entero)', color: 'bg-indigo-600 text-white', badge: 'border-indigo-300 bg-indigo-50 text-indigo-800' };
  } else if (positiveMag > 360) {
    classification = { name: `Múltiple Giro (${(positiveMag / 360).toFixed(1)} vueltas)`, desc: `Ángulo coterminal con ${norm360.toFixed(0)}°`, color: 'bg-cyan-600 text-white', badge: 'border-cyan-300 bg-cyan-50 text-cyan-800' };
  }

  // Dial drag interaction handler
  const handleDialPointer = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let angleRad = Math.atan2(-dy, dx); // in math Cartesian (up is positive Y)
    if (angleRad < 0) angleRad += 2 * Math.PI;
    let deg = Math.round((angleRad * 180) / Math.PI);
    setAngleDeg(deg);
  };

  // ==========================================
  // TAB 2: LABORATORIO DE RADIANES & PI
  // ==========================================
  const [radianStep, setRadianStep] = useState<number>(1); // 1 = 1 rad, 2 = 2 rad, 3 = 3 rad, 4 = pi rad (180°), 5 = 2pi rad (360°)
  const [selectedNotable, setSelectedNotable] = useState<number>(45);

  const notableAngles = [
    { deg: 0, radFrac: '0', radDecimal: '0.00', label: '0 rad' },
    { deg: 30, radFrac: '\\frac{\\pi}{6}', radDecimal: '0.52', label: 'π/6' },
    { deg: 45, radFrac: '\\frac{\\pi}{4}', radDecimal: '0.79', label: 'π/4' },
    { deg: 60, radFrac: '\\frac{\\pi}{3}', radDecimal: '1.05', label: 'π/3' },
    { deg: 90, radFrac: '\\frac{\\pi}{2}', radDecimal: '1.57', label: 'π/2' },
    { deg: 120, radFrac: '\\frac{2\\pi}{3}', radDecimal: '2.09', label: '2π/3' },
    { deg: 135, radFrac: '\\frac{3\\pi}{4}', radDecimal: '2.36', label: '3π/4' },
    { deg: 150, radFrac: '\\frac{5\\pi}{6}', radDecimal: '2.62', label: '5π/6' },
    { deg: 180, radFrac: '\\pi', radDecimal: '3.14', label: 'π' },
    { deg: 270, radFrac: '\\frac{3\\pi}{2}', radDecimal: '4.71', label: '3π/2' },
    { deg: 360, radFrac: '2\\pi', radDecimal: '6.28', label: '2π' },
  ];

  // ==========================================
  // TAB 3: LONGITUD DE ARCO & SECTOR
  // ==========================================
  const [arcRadius, setArcRadius] = useState<number>(10); // in meters / cm
  const [arcAngleDeg, setArcAngleDeg] = useState<number>(60);
  const [arcContext, setArcContext] = useState<'abstract' | 'pizza' | 'sprinkler' | 'pendulum'>('abstract');

  const arcAngleRad = (arcAngleDeg * Math.PI) / 180;
  const arcLengthS = arcRadius * arcAngleRad;
  const sectorAreaA = 0.5 * arcRadius * arcRadius * arcAngleRad;
  const sectorPerimeter = 2 * arcRadius + arcLengthS;

  // ==========================================
  // TAB 4: EJERCICIOS GUIADOS PASO A PASO
  // ==========================================
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [exerciseStep, setExerciseStep] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<{ [key: string]: { ok: boolean; msg: string } }>({});
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const exercisesData = [
    {
      id: 0,
      title: "Nivel 1: Conversión de Grados a Radianes",
      badge: "Básico - Factor de Conversión",
      description: "Convierte un ángulo de 150° a radianes exactos (en términos de π) y a su aproximación decimal.",
      unknown: "θ en radianes = ?",
      given: { "Ángulo en grados": "150°", "Fórmula": "\\theta_{\\text{rad}} = \\theta° \\cdot \\frac{\\pi}{180°}" },
      steps: [
        {
          instruction: "Paso 1: Simplifica la fracción 150 / 180 dividiendo numerador y denominador entre su máximo común divisor (30).",
          question: "¿Cuál es el numerador simplificado frente a π? (ejemplo: si es 5π/6, ingresa 5):",
          formulaHint: "\\frac{150}{180} = \\frac{150 \\div 30}{180 \\div 30} = \\frac{?}{6}",
          expectedKey: "numerator",
          correctVal: 5,
          tolerance: 0,
          unit: "",
          explanation: "150 / 30 = 5, y 180 / 30 = 6, por lo que 150° = 5π/6 rad."
        },
        {
          instruction: "Paso 2: Calcula el valor decimal aproximado de 5π / 6 tomando π ≈ 3.14159 (redondea a 2 decimales).",
          question: "Valor en radianes decimales:",
          formulaHint: "\\theta = \\frac{5 \\cdot 3.14159}{6}",
          expectedKey: "decimalRad",
          correctVal: 2.62,
          tolerance: 0.05,
          unit: "rad",
          explanation: "5 × 3.14159 / 6 ≈ 2.618 ≈ 2.62 rad."
        }
      ]
    },
    {
      id: 1,
      title: "Nivel 2: Ángulos Complementarios y Coterminales",
      badge: "Intermedio - Relaciones Angulares",
      description: "Un ángulo α mide 38°. Encuentra su ángulo complementario β, su suplementario γ y su ángulo coterminal positivo más cercano.",
      unknown: "β (comp), γ (sup), α_cot = ?",
      given: { "Ángulo dado": "α = 38°" },
      steps: [
        {
          instruction: "Paso 1: Dos ángulos son complementarios si suman 90°. Calcula el complemento β = 90° - 38°.",
          question: "Ángulo complementario β:",
          formulaHint: "\\beta = 90° - 38°",
          expectedKey: "complement",
          correctVal: 52,
          tolerance: 0,
          unit: "°",
          explanation: "90° - 38° = 52°."
        },
        {
          instruction: "Paso 2: Dos ángulos son suplementarios si suman 180°. Calcula el suplemento γ = 180° - 38°.",
          question: "Ángulo suplementario γ:",
          formulaHint: "\\gamma = 180° - 38°",
          expectedKey: "supplement",
          correctVal: 142,
          tolerance: 0,
          unit: "°",
          explanation: "180° - 38° = 142°."
        },
        {
          instruction: "Paso 3: Un ángulo coterminal se obtiene sumando un giro completo (+360°).",
          question: "Ángulo coterminal positivo:",
          formulaHint: "\\alpha_{\\text{cot}} = 38° + 360°",
          expectedKey: "coterminal",
          correctVal: 398,
          tolerance: 0,
          unit: "°",
          explanation: "38° + 360° = 398°."
        }
      ]
    },
    {
      id: 2,
      title: "Nivel 3: Longitud de Arco en una Pista Circular",
      badge: "Aplicado - s = r · θ",
      description: "Un ciclista recorre una curva circular con radio r = 24 metros. El arco recorrido subtiende un ángulo central de 75°. ¿Cuántos metros recorrió?",
      unknown: "Longitud de arco s = ?",
      given: { "Radio r": "24 m", "Ángulo central θ": "75°", "Fórmula": "s = r \\cdot \\theta_{\\text{rad}}" },
      steps: [
        {
          instruction: "Paso 1: Convierte el ángulo central de 75° a radianes decimales.",
          question: "Ángulo en radianes (redondea a 3 decimales):",
          formulaHint: "\\theta_{\\text{rad}} = 75° \\cdot \\frac{\\pi}{180°}",
          expectedKey: "arcRad",
          correctVal: 1.309,
          tolerance: 0.02,
          unit: "rad",
          explanation: "75 × π / 180 = 5π/12 ≈ 1.309 rad."
        },
        {
          instruction: "Paso 2: Multiplica el radio por el ángulo en radianes: s = r · θ.",
          question: "Distancia recorrida s en metros (redondea a 2 decimales):",
          formulaHint: "s = 24 \\cdot 1.309",
          expectedKey: "arcLength",
          correctVal: 31.42,
          tolerance: 0.2,
          unit: "m",
          explanation: "s = 24 × (5π/12) = 10π ≈ 31.42 metros."
        }
      ]
    },
    {
      id: 3,
      title: "Nivel 4: Área de Cobertura de un Aspersor",
      badge: "Avanzado - Área de Sector Circular",
      description: "Un aspersor automático riega un jardín en un sector de ángulo θ = 120° alcanzando una distancia máxima de radio r = 9 metros. Calcula el área total de césped regada.",
      unknown: "Área del sector A = ?",
      given: { "Radio de alcance": "9 m", "Apertura de giro": "120°", "Fórmula": "A = \\frac{1}{2} r^2 \\theta_{\\text{rad}}" },
      steps: [
        {
          instruction: "Paso 1: Convierte 120° a radianes exactos en términos de π.",
          question: "¿Cuál es el factor que multiplica a π en 120° = (?·π / 3)? Ingresa el número:",
          formulaHint: "120° = \\frac{120\\pi}{180} = \\frac{2\\pi}{3}",
          expectedKey: "radFactor",
          correctVal: 2,
          tolerance: 0,
          unit: "",
          explanation: "120° = 2π/3 rad."
        },
        {
          instruction: "Paso 2: Aplica la fórmula del área A = 0.5 × r² × θ_rad.",
          question: "Área regada en m² (redondea a 1 decimal):",
          formulaHint: "A = \\frac{1}{2} \\cdot 9^2 \\cdot \\left(\\frac{2\\pi}{3}\\right) = \\frac{1}{2} \\cdot 81 \\cdot 2.0944",
          expectedKey: "sectorArea",
          correctVal: 84.82,
          tolerance: 0.8,
          unit: "m²",
          explanation: "A = 0.5 × 81 × (2π/3) = 27π ≈ 84.82 m²."
        }
      ]
    }
  ];

  const handleVerifyExerciseStep = (exerciseIdx: number, stepIdx: number) => {
    const ex = exercisesData[exerciseIdx];
    const step = ex.steps[stepIdx];
    const userValStr = userInputs[`ex_${exerciseIdx}_step_${stepIdx}`] || '';
    const parsed = parseMathExpression(userValStr);
    const userVal = parsed.isValid ? parsed.value : parseFloat(userValStr.replace(',', '.'));

    if (isNaN(userVal)) {
      setExerciseFeedback(prev => ({
        ...prev,
        [`${exerciseIdx}_${stepIdx}`]: { ok: false, msg: "Ingresa una cantidad numérica, fracción o múltiplo de π válido." }
      }));
      return;
    }

    const isOk = Math.abs(userVal - step.correctVal) <= step.tolerance;
    setExerciseFeedback(prev => ({
      ...prev,
      [`${exerciseIdx}_${stepIdx}`]: {
        ok: isOk,
        msg: isOk 
          ? `¡Excelente! ${step.explanation}` 
          : `Casi. Revisa la fórmula hint: respuesta esperada aprox. ${step.correctVal} ${step.unit}.`
      }
    }));

    if (isOk) {
      if (stepIdx + 1 < ex.steps.length) {
        setExerciseStep(stepIdx + 1);
      } else {
        if (!completedExercises.includes(exerciseIdx)) {
          setCompletedExercises(prev => [...prev, exerciseIdx]);
        }
      }
    }
  };

  // ==========================================
  // TAB 5: MISIONES DEL MUNDO REAL
  // ==========================================
  const [activeMission, setActiveMission] = useState<'radar' | 'clock' | 'satellite'>('radar');

  // Mission 1: Radar
  const [radarTargetAngle, setRadarTargetAngle] = useState<number>(135);
  const [radarUserAngle, setRadarUserAngle] = useState<number>(45);
  const [radarScore, setRadarScore] = useState<number>(0);
  const [radarMessage, setRadarMessage] = useState<string | null>(null);

  const handleCheckRadar = () => {
    const diff = Math.abs(radarUserAngle - radarTargetAngle);
    if (diff <= 5 || diff >= 355) {
      setRadarScore(prev => prev + 100);
      setRadarMessage(`¡BLANCO FIJADO! Rumbo interceptado con precisión a ${radarUserAngle}°. (+100 PTS)`);
      setTimeout(() => {
        const nextAngles = [30, 60, 90, 120, 150, 210, 240, 300, 315, 330];
        const randomTarget = nextAngles[Math.floor(Math.random() * nextAngles.length)];
        setRadarTargetAngle(randomTarget);
        setRadarMessage(null);
      }, 1800);
    } else {
      setRadarMessage(`Desviación de ${diff}°. Corrige el dial hacia ${radarTargetAngle > radarUserAngle ? 'sentido antihorario (aumentar)' : 'sentido horario (disminuir)'}.`);
    }
  };

  // Mission 2: Reloj
  const [clockHour, setClockHour] = useState<number>(3);
  const [clockMinute, setClockMinute] = useState<number>(20);
  const [clockUserGuess, setClockUserGuess] = useState<string>('');
  const [clockFeedback, setClockFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  // Exact angle between hands at HH:MM
  // Minute hand = minute * 6°
  // Hour hand = (hour % 12) * 30° + minute * 0.5°
  const minuteAngle = clockMinute * 6;
  const hourAngle = (clockHour % 12) * 30 + clockMinute * 0.5;
  const rawDiff = Math.abs(hourAngle - minuteAngle);
  const exactHandAngle = rawDiff > 180 ? 360 - rawDiff : rawDiff;

  const handleVerifyClock = () => {
    const val = parseFloat(clockUserGuess.replace(',', '.'));
    if (isNaN(val)) {
      setClockFeedback({ ok: false, msg: "Por favor ingresa un número en grados." });
      return;
    }
    if (Math.abs(val - exactHandAngle) <= 1) {
      setClockFeedback({
        ok: true,
        msg: `¡Perfecto! A las ${clockHour}:${clockMinute.toString().padStart(2, '0')}, la manecilla de la hora está en ${hourAngle}° y el minutero en ${minuteAngle}°. Ángulo menor = ${exactHandAngle.toFixed(1)}°.`
      });
    } else {
      setClockFeedback({
        ok: false,
        msg: `No exactamente. Horario = (${clockHour}×30° + ${clockMinute}×0.5°) = ${hourAngle}°. Minutero = ${clockMinute}×6° = ${minuteAngle}°. Ángulo interior = ${exactHandAngle.toFixed(1)}°.`
      });
    }
  };

  // ==========================================
  // TAB 6: SOLUCIONADOR UNIVERSAL DE ÁNGULOS
  // ==========================================
  const [solverInput, setSolverInput] = useState<string>('3pi/4');
  const [solverUnit, setSolverUnit] = useState<'deg' | 'rad'>('rad');
  const [solverRadius, setSolverRadius] = useState<number>(10);

  // Parse expressions with π and fractions safely
  const parsedSolver = parseMathExpression(solverInput);
  const rawNum = parsedSolver.isValid ? parsedSolver.value : (parseFloat(solverInput.replace(',', '.')) || 0);
  const solverDeg = solverUnit === 'deg' ? rawNum : (rawNum * 180) / Math.PI;
  const solverRad = solverUnit === 'rad' ? rawNum : (rawNum * Math.PI) / 180;
  
  const solverNorm360 = ((solverDeg % 360) + 360) % 360;
  let solverRef = solverNorm360;
  if (solverNorm360 > 90 && solverNorm360 <= 180) solverRef = 180 - solverNorm360;
  else if (solverNorm360 > 180 && solverNorm360 <= 270) solverRef = solverNorm360 - 180;
  else if (solverNorm360 > 270 && solverNorm360 < 360) solverRef = 360 - solverNorm360;
  if (solverRef > 90) solverRef = 90;

  const solverRefRad = (solverRef * Math.PI) / 180;
  const solverArc = solverRadius * solverRad;
  const solverSector = 0.5 * solverRadius * solverRadius * solverRad;

  // Insert helper for π and fraction symbols
  const handleInsertSolverSymbol = (sym: string) => {
    setSolverInput(prev => prev + sym);
  };

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Teacher Assistant Intro */}
      <Teacher 
        message="¡Bienvenido al universo de los Ángulos! Aquí exploraremos desde el giro elemental y su sentido hasta la belleza del radián y el cálculo de arcos en satélites y radares." 
      />

      {/* Anton-Style Tab Navigation Pills */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {[
          { id: 'concept', label: '1. Explorador & Giro', icon: Compass },
          { id: 'radians-lab', label: '2. Lab Radianes & π', icon: RotateCw },
          { id: 'arc-sector', label: '3. Arco & Sector', icon: PieChart },
          { id: 'exercises', label: '4. Ejercicios Guiados', icon: BookOpen },
          { id: 'challenges', label: '5. Misiones Reales', icon: Gamepad2 },
          { id: 'solver', label: '6. Solucionador Universal', icon: Calculator },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3.5 rounded-2xl md:rounded-3xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all whitespace-nowrap border-2 shadow-xs active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 border-purple-400 text-white shadow-purple-500/30 ring-2 ring-purple-400/30 scale-102'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50/50'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white animate-pulse' : 'text-purple-600'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EXPLORADOR DE ÁNGULOS, SENTIDO Y CLASIFICACIÓN                     */}
      {/* ========================================================================= */}
      {activeTab === 'concept' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Left / Main: Interactive Dial & Visual Canvas */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Simulador de Giro
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-1">
                  Dial Circular Interactivo
                </h3>
              </div>

              {/* Sense switch: Positive (Counter-clockwise) vs Negative (Clockwise) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setIsNegativeSense(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                    !isNegativeSense 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-purple-600'
                  }`}
                  title="Sentido Antihorario (+)"
                >
                  <RotateCcw size={13} />
                  <span>Antihorario (+)</span>
                </button>
                <button
                  onClick={() => setIsNegativeSense(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                    isNegativeSense 
                      ? 'bg-rose-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-rose-600'
                  }`}
                  title="Sentido Horario (-)"
                >
                  <RotateCw size={13} />
                  <span>Horario (-)</span>
                </button>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative flex items-center justify-center p-2 sm:p-4 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-inner">
              {/* Polar Coordinates Grid background */}
              <svg
                ref={dialRef}
                viewBox="-160 -160 320 320"
                className="w-full max-w-[320px] sm:max-w-[360px] select-none cursor-crosshair touch-none"
                onPointerDown={(e) => {
                  isDraggingDial.current = true;
                  handleDialPointer(e.clientX, e.clientY);
                }}
                onPointerMove={(e) => {
                  if (isDraggingDial.current) {
                    handleDialPointer(e.clientX, e.clientY);
                  }
                }}
                onPointerUp={() => { isDraggingDial.current = false; }}
                onPointerLeave={() => { isDraggingDial.current = false; }}
              >
                {/* Concentric grid circles */}
                <circle cx="0" cy="0" r="130" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="0" cy="0" r="90" fill="none" stroke="#1e293b" strokeWidth="1" />
                <circle cx="0" cy="0" r="50" fill="none" stroke="#1e293b" strokeWidth="1" />

                {/* Cartesian Axes */}
                <line x1="-145" y1="0" x2="145" y2="0" stroke="#475569" strokeWidth="1.5" />
                <line x1="0" y1="-145" x2="0" y2="145" stroke="#475569" strokeWidth="1.5" />
                
                {/* Axis Labels */}
                <text x="140" y="-6" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">0° (+X)</text>
                <text x="6" y="-135" fill="#94a3b8" fontSize="10" fontWeight="bold">90° (+Y)</text>
                <text x="-140" y="-6" fill="#94a3b8" fontSize="10" fontWeight="bold">180° (-X)</text>
                <text x="6" y="142" fill="#94a3b8" fontSize="10" fontWeight="bold">270° (-Y)</text>

                {/* Quadrant Roman Numerals */}
                <text x="70" y="-70" fill="#334155" fontSize="22" fontWeight="900" textAnchor="middle">I</text>
                <text x="-70" y="-70" fill="#334155" fontSize="22" fontWeight="900" textAnchor="middle">II</text>
                <text x="-70" y="80" fill="#334155" fontSize="22" fontWeight="900" textAnchor="middle">III</text>
                <text x="70" y="80" fill="#334155" fontSize="22" fontWeight="900" textAnchor="middle">IV</text>

                {/* Filled Angle Arc Wedge */}
                {(() => {
                  const rad = (norm360 * Math.PI) / 180;
                  const r = 120;
                  const endX = r * Math.cos(isNegativeSense ? rad : -rad);
                  const endY = isNegativeSense ? r * Math.sin(rad) : -r * Math.sin(rad);
                  const largeArc = norm360 > 180 ? 1 : 0;
                  const sweep = isNegativeSense ? 1 : 0;
                  const pathD = `M 0 0 L ${r} 0 A ${r} ${r} 0 ${largeArc} ${sweep} ${endX} ${endY} Z`;

                  return (
                    <path
                      d={pathD}
                      fill={isNegativeSense ? 'rgba(244, 63, 94, 0.25)' : 'rgba(168, 85, 247, 0.25)'}
                      stroke={isNegativeSense ? '#f43f5e' : '#a855f7'}
                      strokeWidth="2"
                    />
                  );
                })()}

                {/* Initial Ray (Green on +X) */}
                <line x1="0" y1="0" x2="135" y2="0" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                <circle cx="135" cy="0" r="4" fill="#10b981" />

                {/* Terminal Ray */}
                {(() => {
                  const rad = (norm360 * Math.PI) / 180;
                  const r = 135;
                  const endX = r * Math.cos(isNegativeSense ? rad : -rad);
                  const endY = isNegativeSense ? r * Math.sin(rad) : -r * Math.sin(rad);

                  return (
                    <g>
                      <line 
                        x1="0" 
                        y1="0" 
                        x2={endX} 
                        y2={endY} 
                        stroke={isNegativeSense ? '#f43f5e' : '#38bdf8'} 
                        strokeWidth="4.5" 
                        strokeLinecap="round" 
                      />
                      {/* Draggable knob */}
                      <circle 
                        cx={endX} 
                        cy={endY} 
                        r="11" 
                        fill={isNegativeSense ? '#f43f5e' : '#38bdf8'} 
                        stroke="#ffffff" 
                        strokeWidth="3" 
                        className="drop-shadow-lg animate-pulse" 
                      />
                    </g>
                  );
                })()}

                {/* Vertex Origin */}
                <circle cx="0" cy="0" r="6" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
              </svg>

              {/* Central Angle Badge Overlay */}
              <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-700 px-3 py-1.5 rounded-xl text-center backdrop-blur-sm shadow-md">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Ángulo θ</span>
                <span className="font-mono font-black text-xl text-cyan-300">
                  {effectiveAngle > 0 ? `+${effectiveAngle}°` : `${effectiveAngle}°`}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-700 px-3 py-1.5 rounded-xl text-center backdrop-blur-sm shadow-md">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Radianes</span>
                <span className="font-mono font-black text-sm text-purple-300">
                  {((effectiveAngle * Math.PI) / 180).toFixed(3)} rad
                </span>
              </div>
            </div>

            {/* Slider & Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>0°</span>
                <span className="text-purple-700 font-black">Arrastra el deslizador o el dial: {angleDeg}°</span>
                <span>360°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={angleDeg}
                onChange={(e) => setAngleDeg(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />

              {/* Quick Angle Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Ángulos clave:</span>
                {[0, 30, 45, 60, 90, 120, 135, 180, 270, 360].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setAngleDeg(deg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      angleDeg === deg
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-purple-50'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Properties & Mathematical Breakdown */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            {/* Classification Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm uppercase tracking-wider text-slate-700">
                  Clasificación por Medida
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${classification.badge} border`}>
                  {classification.name}
                </span>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                {classification.desc}
              </div>

              {/* Angle Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase block">Posición Estándar</span>
                  <span className="font-black text-sm text-indigo-950">{quadrant}</span>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200">
                  <span className="text-[10px] font-bold text-cyan-700 uppercase block">Ángulo de Referencia</span>
                  <span className="font-mono font-black text-sm text-cyan-950">θ_ref = {refAngle.toFixed(1)}°</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Complementario (90°-θ)</span>
                  <span className="font-mono font-black text-sm text-emerald-950">
                    {effectiveAngle >= 0 && effectiveAngle <= 90 ? `${(90 - effectiveAngle).toFixed(0)}°` : 'No aplica'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-700 uppercase block">Suplementario (180°-θ)</span>
                  <span className="font-mono font-black text-sm text-purple-950">
                    {effectiveAngle >= 0 && effectiveAngle <= 180 ? `${(180 - effectiveAngle).toFixed(0)}°` : 'No aplica'}
                  </span>
                </div>
              </div>
            </div>

            {/* Coterminal Angles Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <h4 className="font-black text-sm uppercase tracking-wider text-slate-800">
                  Ángulos Coterminales
                </h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tienen el mismo lado inicial y lado terminal, diferenciándose por vueltas completas de <MathFormula formula="360° \cdot k" />:
              </p>
              
              <div className="space-y-1.5 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex justify-between items-center text-slate-800">
                  <span>+1 Vuelta (k = +1):</span>
                  <span className="font-black text-purple-700">{effectiveAngle + 360}°</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex justify-between items-center text-slate-800">
                  <span>-1 Vuelta (k = -1):</span>
                  <span className="font-black text-rose-700">{effectiveAngle - 360}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LABORATORIO DE RADIANES & PI                                       */}
      {/* ========================================================================= */}
      {activeTab === 'radians-lab' && (
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Concepto Fundamental
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                  ¿Qué es exactamente un Radián?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Un radián es el ángulo central que subtiende un arco cuya longitud es exactamente igual al <strong>radio (r)</strong> de la circunferencia.
                </p>
              </div>

              {/* Radian Visual Step Control Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {[
                  { step: 1, label: '1 Radián (~57.3°)' },
                  { step: 2, label: '2 Radianes' },
                  { step: 3, label: '3 Radianes' },
                  { step: 4, label: 'π rad = 180°' },
                  { step: 5, label: '2π rad = 360°' }
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setRadianStep(s.step)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                      radianStep === s.step
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Radian Wrapping Simulation Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 flex justify-center p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner">
                <svg viewBox="-140 -140 280 280" className="w-full max-w-[280px] sm:max-w-[320px] select-none">
                  {/* Full Circle Guide */}
                  <circle cx="0" cy="0" r="100" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  
                  {/* Circumference arc for current step */}
                  {(() => {
                    let angleInRad = 1;
                    if (radianStep === 1) angleInRad = 1; // 57.3°
                    else if (radianStep === 2) angleInRad = 2; // 114.6°
                    else if (radianStep === 3) angleInRad = 3; // 171.9°
                    else if (radianStep === 4) angleInRad = Math.PI; // 180°
                    else if (radianStep === 5) angleInRad = 2 * Math.PI; // 360°

                    const r = 100;
                    const endX = r * Math.cos(-angleInRad);
                    const endY = r * Math.sin(-angleInRad);
                    const largeArc = angleInRad > Math.PI ? 1 : 0;
                    const pathD = `M 0 0 L ${r} 0 A ${r} ${r} 0 ${largeArc} 0 ${endX} ${endY} Z`;

                    return (
                      <g>
                        <path d={pathD} fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="3" />
                        {/* Curved arc highlight */}
                        <path
                          d={`M ${r} 0 A ${r} ${r} 0 ${largeArc} 0 ${endX} ${endY}`}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                        {/* Terminal ray */}
                        <line x1="0" y1="0" x2={endX} y2={endY} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                      </g>
                    );
                  })()}

                  {/* Initial Radius (r) */}
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  <text x="50" y="-8" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle">Radio r</text>

                  {/* Origin */}
                  <circle cx="0" cy="0" r="5" fill="#ffffff" />
                </svg>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={18} className="text-blue-600" />
                    <h4 className="font-black text-sm uppercase tracking-wider text-blue-900">
                      {radianStep === 1 && "Paso 1: El Radio se dobla en el perímetro"}
                      {radianStep === 2 && "Paso 2: Dos radios sobre la curva"}
                      {radianStep === 3 && "Paso 3: Tres radios casi completan media vuelta"}
                      {radianStep === 4 && "Paso 4: ¡Aparece π! Exactamente 3.14159... radios"}
                      {radianStep === 5 && "Paso 5: Vuelta completa (2π radianes = 360°)"}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {radianStep === 1 && "Si tomas una cuerda con la misma longitud que el radio r y la curvas sobre el borde del círculo, el ángulo que se abre en el centro es 1 radián ≈ 57.2958°."}
                    {radianStep === 2 && "Con 2 radios doblados cubres 2 radianes ≈ 114.59° (un ángulo obtuso)."}
                    {radianStep === 3 && "Con 3 radios cubres ≈ 171.89°. Falta un pequeñísimo pedazo de 0.14159... radios para llegar a los 180° exactos."}
                    {radianStep === 4 && "Media vuelta (180°) equivale exactamente a π radianes (3.14159... radios). Por esto: 180° = π rad."}
                    {radianStep === 5 && "Una circunferencia completa mide 2πr de perímetro, por lo que una vuelta entera (360°) equivale exactamente a 2π radianes."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
                  <div className="text-purple-300 font-bold uppercase text-[10px]">Fórmula de Conversión Universal</div>
                  <MathFormula formula="\text{De Grados a Radianes: } \theta_{\text{rad}} = \theta° \cdot \frac{\pi}{180°}" block />
                  <MathFormula formula="\text{De Radianes a Grados: } \theta° = \theta_{\text{rad}} \cdot \frac{180°}{\pi}" block />
                </div>
              </div>
            </div>

            {/* Interactive Notable Angles Wheel / Grid */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <h4 className="font-black text-sm uppercase tracking-wider text-slate-800">
                  Rueda de Ángulos Notables (Fracciones de π)
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {notableAngles.map((na) => (
                  <button
                    key={na.deg}
                    onClick={() => setSelectedNotable(na.deg)}
                    className={`p-3 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      selectedNotable === na.deg
                        ? 'bg-purple-50 border-purple-500 shadow-md ring-2 ring-purple-400/20'
                        : 'bg-white border-slate-200 hover:border-purple-200'
                    }`}
                  >
                    <span className="font-black text-sm text-slate-800">{na.deg}°</span>
                    <span className="font-mono font-bold text-xs text-purple-700">
                      <MathFormula formula={na.radFrac} />
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">≈ {na.radDecimal} rad</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LONGITUD DE ARCO & SECTOR CIRCULAR                                 */}
      {/* ========================================================================= */}
      {activeTab === 'arc-sector' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Controls & Contexts */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-md space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Parámetros de Entrada
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-1">
                Ajuste de Radio &amp; Ángulo
              </h3>
            </div>

            {/* Context Selector */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'abstract', label: 'Geométrico', icon: Compass },
                { id: 'pizza', label: 'Rebanada Pizza', icon: PieChart },
                { id: 'sprinkler', label: 'Aspersor Riego', icon: Radar },
                { id: 'pendulum', label: 'Péndulo', icon: Clock },
              ].map((ctx) => (
                <button
                  key={ctx.id}
                  onClick={() => {
                    setArcContext(ctx.id as any);
                    if (ctx.id === 'pizza') { setArcRadius(15); setArcAngleDeg(45); }
                    if (ctx.id === 'sprinkler') { setArcRadius(8); setArcAngleDeg(120); }
                    if (ctx.id === 'pendulum') { setArcRadius(2); setArcAngleDeg(40); }
                  }}
                  className={`flex items-center gap-1.5 p-2.5 rounded-xl text-xs font-black border transition-all ${
                    arcContext === ctx.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ctx.icon size={14} className={arcContext === ctx.id ? 'text-emerald-600' : 'text-slate-400'} />
                  <span>{ctx.label}</span>
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Radio (r):</span>
                  <span className="font-mono font-black text-emerald-700">{arcRadius} {arcContext === 'pizza' ? 'cm' : 'm'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={arcRadius}
                  onChange={(e) => setArcRadius(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Ángulo Central (θ):</span>
                  <span className="font-mono font-black text-purple-700">{arcAngleDeg}° ({arcAngleRad.toFixed(2)} rad)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="360"
                  step="5"
                  value={arcAngleDeg}
                  onChange={(e) => setArcAngleDeg(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>

            {/* Mathematical Formulas Card */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2.5 border border-slate-800 shadow-inner">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Fórmulas Aplicadas (con θ en rad)</span>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <MathFormula formula="s = r \cdot \theta_{\text{rad}}" block />
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <MathFormula formula="A_{\text{sector}} = \frac{1}{2} r^2 \cdot \theta_{\text{rad}}" block />
              </div>
            </div>
          </div>

          {/* Visual Canvas & Calculation Results */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm uppercase tracking-wider text-slate-700">
                Visualización Gráfica del Sector
              </h4>
              <span className="text-xs font-bold text-slate-500">Escala dinámica</span>
            </div>

            {/* SVG Arc and Sector Visualizer */}
            <div className="flex items-center justify-center p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner min-h-[260px]">
              <svg viewBox="-140 -140 280 280" className="w-full max-w-[280px] sm:max-w-[320px] select-none">
                {/* Sector wedge */}
                {(() => {
                  const r = 110;
                  const endX = r * Math.cos(-arcAngleRad);
                  const endY = r * Math.sin(-arcAngleRad);
                  const largeArc = arcAngleRad > Math.PI ? 1 : 0;
                  const pathD = `M 0 0 L ${r} 0 A ${r} ${r} 0 ${largeArc} 0 ${endX} ${endY} Z`;

                  return (
                    <g>
                      {/* Shaded Area */}
                      <path d={pathD} fill="rgba(168, 85, 247, 0.35)" stroke="#a855f7" strokeWidth="2" />
                      {/* Arc Boundary (Cyan) */}
                      <path
                        d={`M ${r} 0 A ${r} ${r} 0 ${largeArc} 0 ${endX} ${endY}`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      {/* Terminal Ray */}
                      <line x1="0" y1="0" x2={endX} y2={endY} stroke="#a855f7" strokeWidth="2.5" />
                    </g>
                  );
                })()}

                {/* Base Initial Ray */}
                <line x1="0" y1="0" x2="110" y2="0" stroke="#10b981" strokeWidth="3" />

                {/* Radius dimension label */}
                <text x="55" y="16" fill="#10b981" fontSize="11" fontWeight="black" textAnchor="middle">
                  r = {arcRadius}
                </text>

                {/* Origin */}
                <circle cx="0" cy="0" r="4" fill="#ffffff" />
              </svg>
            </div>

            {/* Calculated Values Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 block">Longitud de Arco (s)</span>
                <span className="font-mono font-black text-lg sm:text-xl text-cyan-950">
                  {arcLengthS.toFixed(2)} {arcContext === 'pizza' ? 'cm' : 'm'}
                </span>
                <span className="text-[10px] text-cyan-600 block mt-0.5 font-mono">s = {arcRadius} × {arcAngleRad.toFixed(3)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Área del Sector (A)</span>
                <span className="font-mono font-black text-lg sm:text-xl text-purple-950">
                  {sectorAreaA.toFixed(2)} {arcContext === 'pizza' ? 'cm²' : 'm²'}
                </span>
                <span className="text-[10px] text-purple-600 block mt-0.5 font-mono">A = ½ · {arcRadius}² · {arcAngleRad.toFixed(3)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Perímetro Total (P)</span>
                <span className="font-mono font-black text-lg sm:text-xl text-emerald-950">
                  {sectorPerimeter.toFixed(2)} {arcContext === 'pizza' ? 'cm' : 'm'}
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-mono">P = 2r + s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EJERCICIOS GUIADOS PASO A PASO                                     */}
      {/* ========================================================================= */}
      {activeTab === 'exercises' && (
        <div className="space-y-6 md:space-y-8">
          {/* Level Selector Header */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                Entrenamiento Gradual
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-1">
                Ejercicios con Validación y Pistas
              </h3>
            </div>

            {/* Exercise Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {exercisesData.map((ex, idx) => {
                const isCompleted = completedExercises.includes(idx);
                const isCurrent = currentExercise === idx;
                return (
                  <button
                    key={ex.id}
                    onClick={() => {
                      setCurrentExercise(idx);
                      setExerciseStep(0);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs transition-all border-2 ${
                      isCurrent
                        ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                        : isCompleted
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-purple-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Edit3 size={14} />}
                    <span>Nivel {idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Exercise Detail Card */}
          {(() => {
            const ex = exercisesData[currentExercise];
            return (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      {ex.badge}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      {ex.title}
                    </h4>
                    <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                      {ex.description}
                    </p>
                  </div>
                </div>

                {/* Given Data Box */}
                <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-500">Datos proporcionados:</span>
                  {Object.entries(ex.given).map(([k, v]) => (
                    <span key={k} className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 font-mono font-bold text-slate-800">
                      {k}: <MathFormula formula={v} />
                    </span>
                  ))}
                </div>

                {/* Steps Accordion */}
                <div className="space-y-4">
                  {ex.steps.map((step, sIdx) => {
                    const isStepUnlocked = sIdx <= exerciseStep;
                    const feedback = exerciseFeedback[`${currentExercise}_${sIdx}`];
                    const inputKey = `ex_${currentExercise}_step_${sIdx}`;

                    return (
                      <div
                        key={sIdx}
                        className={`p-4 sm:p-6 rounded-3xl border-2 transition-all ${
                          isStepUnlocked 
                            ? 'bg-slate-50/80 border-slate-200' 
                            : 'bg-slate-50/30 border-dashed border-slate-200 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                            feedback?.ok ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'
                          }`}>
                            {sIdx + 1}
                          </span>
                          <h5 className="font-black text-sm text-slate-800">
                            {step.instruction}
                          </h5>
                        </div>

                        {isStepUnlocked && (
                          <div className="mt-3 space-y-3 pl-8">
                            <p className="text-xs sm:text-sm font-semibold text-slate-700">
                              {step.question}
                            </p>

                            {/* LaTeX Formula Hint */}
                            <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-950 text-xs font-mono">
                              <span className="text-[10px] font-bold text-purple-600 uppercase block mb-0.5">Pista de cálculo:</span>
                              <MathFormula formula={step.formulaHint} />
                            </div>

                            {/* User Input & Verify Button */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Ej: 5 o 2.62"
                                  value={userInputs[inputKey] || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setUserInputs(prev => ({ ...prev, [inputKey]: val }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleVerifyExerciseStep(currentExercise, sIdx);
                                  }}
                                  className="px-4 py-2 rounded-xl bg-white border-2 border-slate-300 font-mono text-sm font-bold text-slate-800 focus:outline-none focus:border-purple-500 w-36 shadow-inner"
                                />
                                {step.unit && (
                                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                                    {step.unit}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleVerifyExerciseStep(currentExercise, sIdx)}
                                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
                              >
                                <span>Verificar</span>
                                <Check size={14} />
                              </button>
                            </div>

                            {/* Feedback Toast */}
                            {feedback && (
                              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                feedback.ok 
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                                  : 'bg-rose-50 text-rose-800 border border-rose-300'
                              }`}>
                                {feedback.ok ? <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" /> : <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />}
                                <span>{feedback.msg}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MISIONES REALES & DESAFÍOS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'challenges' && (
        <div className="space-y-6 md:space-y-8">
          {/* Mission Selector */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'radar', title: 'Misión 1: Radar de Control Aéreo', icon: Radar },
              { id: 'clock', title: 'Misión 2: El Enigma del Reloj', icon: Clock },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMission(m.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider border-2 transition-all ${
                  activeMission === m.id
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <m.icon size={16} />
                <span>{m.title}</span>
              </button>
            ))}
          </div>

          {/* MISSION 1: RADAR */}
          {activeMission === 'radar' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    Navegación Aeronáutica
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-1">
                    Interceptación en Radar de Vuelo
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Gira el dial angular para apuntar la antena al rumbo del avión detectado a <strong>{radarTargetAngle}°</strong>.
                  </p>
                </div>

                <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-white font-mono text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Puntuación Radar</span>
                  <span className="font-black text-lg text-emerald-400">{radarScore} PTS</span>
                </div>
              </div>

              {/* Radar Simulation Display */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-3xl border border-slate-800 shadow-inner relative overflow-hidden">
                <svg viewBox="-140 -140 280 280" className="w-full max-w-[280px] sm:max-w-[320px] select-none">
                  {/* Radar Circles */}
                  <circle cx="0" cy="0" r="120" fill="#022c22" stroke="#059669" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="80" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="0" cy="0" r="40" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="-130" y1="0" x2="130" y2="0" stroke="#059669" strokeWidth="1" />
                  <line x1="0" y1="-130" x2="0" y2="130" stroke="#059669" strokeWidth="1" />

                  {/* Target Blip */}
                  {(() => {
                    const targetRad = (radarTargetAngle * Math.PI) / 180;
                    const tx = 95 * Math.cos(-targetRad);
                    const ty = 95 * Math.sin(-targetRad);
                    return (
                      <g>
                        <circle cx={tx} cy={ty} r="7" fill="#ef4444" className="animate-ping opacity-75" />
                        <circle cx={tx} cy={ty} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                        <text x={tx + 10} y={ty - 5} fill="#fca5a5" fontSize="10" fontWeight="black">AVIÓN #{radarTargetAngle}°</text>
                      </g>
                    );
                  })()}

                  {/* Player Beam Angle */}
                  {(() => {
                    const userRad = (radarUserAngle * Math.PI) / 180;
                    const ux = 120 * Math.cos(-userRad);
                    const uy = 120 * Math.sin(-userRad);
                    return (
                      <g>
                        <line x1="0" y1="0" x2={ux} y2={uy} stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
                        <circle cx={ux} cy={uy} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                      </g>
                    );
                  })()}

                  {/* Origin */}
                  <circle cx="0" cy="0" r="4" fill="#ffffff" />
                </svg>
              </div>

              {/* Slider & Action */}
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Rumbo de la antena:</span>
                  <span className="font-mono font-black text-cyan-600 text-sm">{radarUserAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="359"
                  step="1"
                  value={radarUserAngle}
                  onChange={(e) => setRadarUserAngle(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleCheckRadar}
                    className="px-8 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <Target size={16} />
                    <span>Enganchar Blanco ({radarUserAngle}°)</span>
                  </button>
                </div>

                {radarMessage && (
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-cyan-300 font-mono text-xs text-center border border-slate-700 shadow-md">
                    {radarMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MISSION 2: RELOJ */}
          {activeMission === 'clock' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                    Geometría Cronológica
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-1">
                    El Ángulo entre las Manecillas
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    A las <strong>{clockHour}:{clockMinute.toString().padStart(2, '0')}</strong>, ¿cuál es el ángulo menor formado entre el horario y el minutero?
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Cambiar hora:</span>
                  {[
                    { h: 3, m: 20 },
                    { h: 8, m: 15 },
                    { h: 10, m: 10 },
                    { h: 2, m: 45 },
                  ].map((t) => (
                    <button
                      key={`${t.h}_${t.m}`}
                      onClick={() => {
                        setClockHour(t.h);
                        setClockMinute(t.m);
                        setClockFeedback(null);
                        setClockUserGuess('');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 border border-slate-200"
                    >
                      {t.h}:{t.m.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clock Canvas */}
              <div className="flex justify-center p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner">
                <svg viewBox="-120 -120 240 240" className="w-full max-w-[240px] sm:max-w-[280px] select-none">
                  {/* Clock Face */}
                  <circle cx="0" cy="0" r="100" fill="#0f172a" stroke="#6366f1" strokeWidth="4" />
                  
                  {/* Clock Hour Numbers (12, 1..11) */}
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
                    const numRad = ((num % 12) * 30 * Math.PI) / 180;
                    const nx = 80 * Math.sin(numRad);
                    const ny = -80 * Math.cos(numRad) + 4;
                    return (
                      <text key={num} x={nx} y={ny} fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">
                        {num}
                      </text>
                    );
                  })}

                  {/* Hour Hand (Purple) */}
                  {(() => {
                    const hRad = (hourAngle * Math.PI) / 180;
                    const hx = 55 * Math.sin(hRad);
                    const hy = -55 * Math.cos(hRad);
                    return <line x1="0" y1="0" x2={hx} y2={hy} stroke="#c084fc" strokeWidth="5" strokeLinecap="round" />;
                  })()}

                  {/* Minute Hand (Cyan) */}
                  {(() => {
                    const mRad = (minuteAngle * Math.PI) / 180;
                    const mx = 80 * Math.sin(mRad);
                    const my = -80 * Math.cos(mRad);
                    return <line x1="0" y1="0" x2={mx} y2={my} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />;
                  })()}

                  {/* Center pin */}
                  <circle cx="0" cy="0" r="5" fill="#ffffff" />
                </svg>
              </div>

              {/* Input Form */}
              <div className="space-y-4 max-w-md mx-auto">
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-1">
                  <span className="font-bold block">💡 Pista de cálculo:</span>
                  <span>• Cada hora avanza 30° + 0.5° por cada minuto.</span>
                  <span className="block">• Cada minuto avanza 6°.</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ángulo en grados (ej: 20)"
                    value={clockUserGuess}
                    onChange={(e) => setClockUserGuess(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleVerifyClock(); }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-300 font-mono text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                  <button
                    onClick={handleVerifyClock}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95"
                  >
                    Verificar
                  </button>
                </div>

                {clockFeedback && (
                  <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    clockFeedback.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}>
                    {clockFeedback.ok ? <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" /> : <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />}
                    <span>{clockFeedback.msg}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SOLUCIONADOR UNIVERSAL DE ÁNGULOS                                  */}
      {/* ========================================================================= */}
      {activeTab === 'solver' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                Herramienta Universal
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                Solucionador y Desglosador de Ángulos
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ingresa ángulos como números, fracciones (ej: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-600">3/4</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-600">135/2</code>) o múltiplos de <MathFormula formula="\pi" /> (ej: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-600">3pi/4</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-600">2pi/3</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-600">pi/2</code>).
              </p>
            </div>

            {/* Input Form with Pi & Fraction Tools */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-100 p-2.5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                <input
                  type="text"
                  value={solverInput}
                  onChange={(e) => setSolverInput(e.target.value)}
                  placeholder="Ej: 3pi/4, 5/6, 135"
                  className="w-32 sm:w-36 px-1.5 py-1 bg-transparent font-mono font-bold text-sm sm:text-base text-slate-900 focus:outline-none"
                />
                {/* Keyboard Symbol Buttons */}
                <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5">
                  <button
                    type="button"
                    title="Insertar el número Pi (π)"
                    onClick={() => handleInsertSolverSymbol('π')}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 font-serif font-black text-sm transition-colors cursor-pointer active:scale-95 shadow-xs"
                  >
                    π
                  </button>
                  <button
                    type="button"
                    title="Insertar barra de fracción (/)"
                    onClick={() => handleInsertSolverSymbol('/')}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-mono font-black text-sm transition-colors cursor-pointer active:scale-95 shadow-xs"
                  >
                    /
                  </button>
                  {solverInput && (
                    <button
                      type="button"
                      title="Borrar entrada"
                      onClick={() => setSolverInput('')}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold text-xs transition-colors cursor-pointer active:scale-95"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Unit Toggle Switch */}
              <div className="flex bg-slate-200 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSolverUnit('deg')}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    solverUnit === 'deg' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Grados (°)
                </button>
                <button
                  type="button"
                  onClick={() => setSolverUnit('rad')}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    solverUnit === 'rad' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Radianes (rad)
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Formula Interpretation & Quick Preset Chips */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-600" />
                <span>Interpretación matemática:</span>
              </span>
              <div className="bg-white px-3 py-1 rounded-xl border border-purple-300 font-mono text-sm font-bold text-purple-950 shadow-xs">
                <MathFormula 
                  formula={`\\theta = ${inputToLatexPreview(solverInput || '0', solverUnit)} \\;\\approx\\; ${solverUnit === 'rad' ? `${solverRad.toFixed(4)}\\text{ rad} = ${solverDeg.toFixed(2)}^\\circ` : `${solverDeg.toFixed(2)}^\\circ = ${formatRadianToPiLatex(solverRad)}`}`} 
                />
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Ángulos frecuentes:</span>
              {solverUnit === 'rad' ? (
                ['π/6', 'π/4', 'π/3', 'π/2', '2π/3', '3π/4', '5π/6', 'π', '3π/2', '2π'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSolverInput(p)}
                    className="px-2 py-0.5 rounded-lg bg-white hover:bg-purple-600 hover:text-white border border-purple-200 text-purple-700 font-mono text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    {p}
                  </button>
                ))
              ) : (
                ['30', '45', '60', '90', '120', '135', '150', '180', '270', '360'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSolverInput(p)}
                    className="px-2 py-0.5 rounded-lg bg-white hover:bg-purple-600 hover:text-white border border-purple-200 text-purple-700 font-mono text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    {p}°
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 shadow-2xs">
              <span className="text-[10px] font-bold text-purple-700 uppercase block">En Grados (°)</span>
              <span className="font-mono font-black text-xl text-purple-950 block my-1">{solverDeg.toFixed(2)}°</span>
              <div className="text-[11px] text-slate-600 flex flex-col gap-0.5">
                <span>Normalizado: <strong>{solverNorm360.toFixed(1)}°</strong></span>
                <span>Vueltas: <strong>{(solverDeg / 360).toFixed(2)} rev</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-2xs">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">En Radianes (rad)</span>
              <div className="font-mono font-black text-lg text-blue-950 my-1">
                <MathFormula formula={formatRadianToPiLatex(solverRad)} />
              </div>
              <span className="text-[11px] text-slate-600 block">
                Decimal: <strong>{solverRad.toFixed(4)} rad</strong>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 shadow-2xs">
              <span className="text-[10px] font-bold text-cyan-700 uppercase block">Ángulo de Referencia</span>
              <span className="font-mono font-black text-xl text-cyan-950 block my-1">θ_ref = {solverRef.toFixed(2)}°</span>
              <div className="text-[11px] text-slate-600 flex flex-col gap-0.5">
                <span>En Radianes: <MathFormula formula={formatRadianToPiLatex(solverRefRad)} /></span>
                <span>Respecto al eje X más cercano</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Ángulos Coterminales</span>
              <div className="font-mono font-bold text-xs text-emerald-950 space-y-1 my-1">
                <div className="flex justify-between">
                  <span>+1 Giro (+360°):</span>
                  <span className="font-black">{(solverDeg + 360).toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span>-1 Giro (-360°):</span>
                  <span className="font-black">{(solverDeg - 360).toFixed(1)}°</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 block border-t border-emerald-100 pt-1 mt-1">
                Mismo lado terminal en el plano
              </span>
            </div>
          </div>

          {/* Detailed Step-by-Step Mathematical Explanation */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen size={18} className="text-purple-400" />
              <h4 className="font-black text-sm uppercase tracking-wider text-purple-300">
                Procedimiento Matemático Desglosado Paso a Paso
              </h4>
            </div>

            {solverUnit === 'rad' ? (
              /* Radian to Degree procedure */
              <div className="space-y-4 font-mono text-xs sm:text-sm">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-purple-400 font-bold text-xs uppercase font-sans">
                    Paso 1: Identificar la Fórmula de Conversión a Grados
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Multiplicamos el valor en radianes por el factor <MathFormula formula="\frac{180^\circ}{\pi}" />:
                  </p>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl text-center">
                    <MathFormula formula="\theta^\circ = \theta_{\text{rad}} \cdot \frac{180^\circ}{\pi}" block />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-cyan-400 font-bold text-xs uppercase font-sans">
                    Paso 2: Sustitución y Cancelación de Factores
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Sustituyendo <MathFormula formula={`\\theta_{\\text{rad}} = ${inputToLatexPreview(solverInput || '0', 'rad')}`} />:
                  </p>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl text-center space-y-1">
                    <MathFormula 
                      formula={`\\theta^\\circ = \\left(${inputToLatexPreview(solverInput || '0', 'rad')}\\right) \\cdot \\frac{180^\\circ}{\\pi} = \\frac{(${rawNum.toFixed(4)}) \\cdot 180^\\circ}{\\pi}`} 
                      block 
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-emerald-400 font-bold text-xs uppercase font-sans">
                    Paso 3: Resultado Final en Grados
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-around gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Valor Exacto / Decimal:</span>
                      <span className="text-emerald-400 font-black text-base">{solverDeg.toFixed(2)}°</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Ángulo Coterminal [0°, 360°):</span>
                      <span className="text-cyan-400 font-black text-base">{solverNorm360.toFixed(2)}°</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Degree to Radian procedure */
              <div className="space-y-4 font-mono text-xs sm:text-sm">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-purple-400 font-bold text-xs uppercase font-sans">
                    Paso 1: Identificar la Fórmula de Conversión a Radianes
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Multiplicamos el ángulo en grados por el factor <MathFormula formula="\frac{\pi}{180^\circ}" />:
                  </p>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl text-center">
                    <MathFormula formula="\theta_{\text{rad}} = \theta^\circ \cdot \frac{\pi}{180^\circ}" block />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-cyan-400 font-bold text-xs uppercase font-sans">
                    Paso 2: Sustitución y Simplificación de la Fracción
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Sustituyendo <MathFormula formula={`\\theta^\\circ = ${solverDeg.toFixed(2)}^\\circ`} /> y simplificando con el MCD:
                  </p>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl text-center">
                    <MathFormula 
                      formula={`\\theta_{\\text{rad}} = ${solverDeg.toFixed(2)}^\\circ \\cdot \\frac{\\pi}{180^\\circ} = \\frac{${solverDeg.toFixed(2)}\\pi}{180} = ${formatRadianToPiLatex(solverRad)}`} 
                      block 
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-emerald-400 font-bold text-xs uppercase font-sans">
                    Paso 3: Expresión Exacta y Aproximación Decimal
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-around gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Fracción Exacta con π:</span>
                      <span className="text-emerald-400 font-black text-base">
                        <MathFormula formula={formatRadianToPiLatex(solverRad)} />
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Aproximación Decimal:</span>
                      <span className="text-cyan-400 font-black text-base">{solverRad.toFixed(4)} rad</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Arc & Sector Section for Given Radius */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PieChart size={18} className="text-cyan-400" />
                <h4 className="font-black text-sm uppercase tracking-wider text-white">
                  Cálculo de Arco y Sector Circular (Radio Personalizado)
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Radio (r):</span>
                <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    min="0.1"
                    max="500"
                    step="0.5"
                    value={solverRadius}
                    onChange={(e) => setSolverRadius(parseFloat(e.target.value) || 1)}
                    className="w-16 bg-transparent font-mono text-xs font-bold text-white text-center focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-bold">m</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase block tracking-wider">
                  Longitud de Arco (s = r · θ_rad)
                </span>
                <span className="font-mono font-black text-xl text-white block">
                  s = {solverArc.toFixed(3)} m
                </span>
                <p className="text-[11px] text-slate-400 font-mono">
                  {solverRadius} m × {solverRad.toFixed(4)} rad = <strong>{solverArc.toFixed(3)} m</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase block tracking-wider">
                  Área del Sector Circular (A = ½ r² · θ_rad)
                </span>
                <span className="font-mono font-black text-xl text-white block">
                  A = {solverSector.toFixed(3)} m²
                </span>
                <p className="text-[11px] text-slate-400 font-mono">
                  0.5 × ({solverRadius} m)² × {solverRad.toFixed(4)} = <strong>{solverSector.toFixed(3)} m²</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
