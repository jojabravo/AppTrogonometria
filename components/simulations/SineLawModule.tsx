import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Radio, 
  Trophy, 
  Play, 
  Flame, 
  RefreshCw, 
  Lightbulb, 
  BookOpen, 
  Gamepad2, 
  BrainCircuit, 
  Calculator, 
  Award,
  Navigation,
  Compass,
  Layers,
  AlertTriangle,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { MathFormula } from '../MathFormula';
import { Teacher } from '../Teacher';

interface SineLawModuleProps {
  onBack: () => void;
  onFinish?: () => void;
}

type TabType = 'concept' | 'lab-ala' | 'exercises' | 'rescue-game' | 'ambiguous-lab' | 'custom-solver';

export const SineLawModule: React.FC<SineLawModuleProps> = ({ onBack, onFinish }) => {
  const [activeTab, setActiveTab] = useState<TabType>('concept');
  
  // Concept Tab State (Interactive SVG Triangle & Formula Focus)
  const [conceptFormulaMode, setConceptFormulaMode] = useState<'sides' | 'angles' | 'all'>('sides');
  const [highlightedPair, setHighlightedPair] = useState<'A' | 'B' | 'C'>('A');

  // --- TAB 2: LAB ALA / AAL STATE ---
  const [labAngleA, setLabAngleA] = useState<number>(45);
  const [labAngleB, setLabAngleB] = useState<number>(65);
  const [labSideC, setLabSideC] = useState<number>(10); // side between A and B
  const [showCircumcircle, setShowCircumcircle] = useState<boolean>(false);

  // Derived Lab Values
  const labAngleC = Math.max(1, 180 - labAngleA - labAngleB);
  const radA = (labAngleA * Math.PI) / 180;
  const radB = (labAngleB * Math.PI) / 180;
  const radC = (labAngleC * Math.PI) / 180;
  
  // By Sine Law: c / sin(C) = k = 2R
  const ratioK = labSideC / Math.sin(radC);
  const labSideA = ratioK * Math.sin(radA);
  const labSideB = ratioK * Math.sin(radB);
  const circumDiameter = ratioK;
  const circumRadius = ratioK / 2;

  // --- TAB 3: STEP-BY-STEP EXERCISES STATE ---
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [exerciseStep, setExerciseStep] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<{ [key: string]: { ok: boolean; msg: string } }>({});
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  // 5 Progressive Exercises with Triangle SVGs and Unknowns
  const exercises = [
    {
      id: 0,
      title: "Nivel 1: Caso A-L-A (Ángulo-Lado-Ángulo)",
      type: "ALA",
      badge: "Básico - 2 Ángulos y Lado Intermedio",
      description: "En el triángulo ABC, conoces los ángulos A = 40°, B = 60° y el lado intermedio c = 12 cm. Encuentra la longitud del lado 'a'.",
      unknown: "Lado a = ?",
      given: { "Ángulo A": "40°", "Ángulo B": "60°", "Lado c (AB)": "12 cm" },
      svg: (
        <svg viewBox="0 0 340 200" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* A(40,165), B(300,165), C(195,45) */}
          <polygon points="40,165 300,165 195,45" fill="#ecfdf5" stroke="#059669" strokeWidth="3" strokeLinejoin="round" />
          {/* Angle A Arc */}
          <path d="M 75,165 A 35 35 0 0 0 63,138" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="75" y="155" className="text-xs font-black fill-cyan-600">40°</text>
          {/* Angle B Arc */}
          <path d="M 265,165 A 35 35 0 0 1 275,135" fill="none" stroke="#c084fc" strokeWidth="2.5" />
          <text x="245" y="155" className="text-xs font-black fill-purple-600">60°</text>
          {/* Angle C (uncalculated initially) */}
          <text x="195" y="32" textAnchor="middle" className="text-xs font-black fill-slate-500">C</text>
          {/* Side labels */}
          <text x="170" y="185" textAnchor="middle" className="text-xs font-black fill-slate-700">c = 12 cm</text>
          <text x="260" y="95" className="text-xs font-black fill-emerald-600 bg-emerald-100 px-1">a = ? (incógnita)</text>
          <text x="105" y="95" className="text-xs font-black fill-slate-400">b</text>
          {/* Vertices */}
          <circle cx="40" cy="165" r="4" fill="#059669" />
          <text x="25" y="172" className="text-xs font-black fill-slate-700">A</text>
          <circle cx="300" cy="165" r="4" fill="#059669" />
          <text x="310" y="172" className="text-xs font-black fill-slate-700">B</text>
          <circle cx="195" cy="45" r="4" fill="#059669" />
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Calcula el tercer ángulo C (recordando que la suma de ángulos internos es 180°).",
          question: "¿Cuánto vale el ángulo C?",
          formulaHint: "C = 180° - A - B",
          expectedKey: "angleC",
          correctVal: 80,
          tolerance: 0.5,
          unit: "°",
          explanation: "C = 180° - 40° - 60° = 80°"
        },
        {
          instruction: "Paso 2: Aplica la Ley del Seno relacionando a/sin(A) = c/sin(C) y despeja 'a'.",
          question: "Calcula el lado 'a' (redondea a 2 decimales):",
          formulaHint: "a = \\frac{c \\cdot \\sin(A)}{\\sin(C)} = \\frac{12 \\cdot \\sin(40°)}{\\sin(80°)}",
          expectedKey: "sideA",
          correctVal: 7.83, // 12 * sin(40°) / sin(80°) = 12 * 0.6428 / 0.9848 ≈ 7.83
          tolerance: 0.1,
          unit: "cm",
          explanation: "a = (12 × 0.6428) / 0.9848 ≈ 7.83 cm"
        }
      ]
    },
    {
      id: 1,
      title: "Nivel 2: Caso A-A-L (Ángulo-Ángulo-Lado Opuesto)",
      type: "AAL",
      badge: "Básico - Relación Directa",
      description: "En un triángulo, A = 35°, B = 75° y el lado opuesto al ángulo A mide a = 8 m. Encuentra la longitud del lado 'b'.",
      unknown: "Lado b = ?",
      given: { "Ángulo A": "35°", "Ángulo B": "75°", "Lado a (opuesto a A)": "8 m" },
      svg: (
        <svg viewBox="0 0 340 200" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* A(40,165), B(270,165), C(145,35) */}
          <polygon points="40,165 270,165 145,35" fill="#f0fdfa" stroke="#0d9488" strokeWidth="3" strokeLinejoin="round" />
          {/* Angle A Arc */}
          <path d="M 75,165 A 35 35 0 0 0 65,142" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="75" y="158" className="text-xs font-black fill-cyan-600">35°</text>
          {/* Angle B Arc */}
          <path d="M 235,165 A 35 35 0 0 1 248,132" fill="none" stroke="#c084fc" strokeWidth="2.5" />
          <text x="215" y="155" className="text-xs font-black fill-purple-600">75°</text>
          {/* Sides */}
          <text x="220" y="90" className="text-xs font-black fill-slate-700">a = 8 m</text>
          <text x="65" y="90" className="text-xs font-black fill-teal-700 font-bold">b = ? (incógnita)</text>
          <text x="155" y="185" textAnchor="middle" className="text-xs font-black fill-slate-400">c</text>
          {/* Vertices */}
          <circle cx="40" cy="165" r="4" fill="#0d9488" />
          <text x="25" y="172" className="text-xs font-black fill-slate-700">A</text>
          <circle cx="270" cy="165" r="4" fill="#0d9488" />
          <text x="280" y="172" className="text-xs font-black fill-slate-700">B</text>
          <circle cx="145" cy="35" r="4" fill="#0d9488" />
          <text x="145" y="24" textAnchor="middle" className="text-xs font-black fill-slate-700">C</text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Ya tienes la pareja completa (A, a) y el ángulo B. Aplica la Ley del Seno directamente:",
          question: "Calcula el lado 'b' despejando de b/sin(B) = a/sin(A):",
          formulaHint: "b = \\frac{a \\cdot \\sin(B)}{\\sin(A)} = \\frac{8 \\cdot \\sin(75°)}{\\sin(35°)}",
          expectedKey: "sideB",
          correctVal: 13.47, // 8 * sin(75°) / sin(35°) = 8 * 0.9659 / 0.5736 ≈ 13.47
          tolerance: 0.15,
          unit: "m",
          explanation: "b = (8 × 0.9659) / 0.5736 ≈ 13.47 m"
        }
      ]
    },
    {
      id: 2,
      title: "Nivel 3: Topografía Real - Altura de una Torre Lejana",
      type: "TOPOGRAPHY",
      badge: "Aplicación Práctica",
      description: "Dos topógrafos en puntos A y B separados por 50 metros observan la punta de una montaña C. El ángulo medido en A es 50° y en B es 70°. Encuentra la distancia desde A hasta la punta de la montaña (lado b).",
      unknown: "Distancia b (AC) = ?",
      given: { "Separación AB (c)": "50 m", "Ángulo A": "50°", "Ángulo B": "70°" },
      svg: (
        <svg viewBox="0 0 340 200" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* Mountain icon / ground */}
          <polygon points="120,40 180,40 220,165 80,165" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="50,165 290,165 160,40" fill="rgba(6, 182, 212, 0.08)" stroke="#0284c7" strokeWidth="2.5" />
          {/* Angle A Arc */}
          <path d="M 80,165 A 30 30 0 0 0 71,142" fill="none" stroke="#0284c7" strokeWidth="2.5" />
          <text x="82" y="156" className="text-xs font-black fill-cyan-700">50°</text>
          {/* Angle B Arc */}
          <path d="M 260,165 A 30 30 0 0 1 270,138" fill="none" stroke="#0284c7" strokeWidth="2.5" />
          <text x="240" y="156" className="text-xs font-black fill-cyan-700">70°</text>
          {/* Labels */}
          <text x="170" y="185" textAnchor="middle" className="text-xs font-black fill-slate-700">c = 50 m (base)</text>
          <text x="80" y="95" className="text-xs font-black fill-blue-600 font-bold">b = ? (distancia)</text>
          <text x="240" y="95" className="text-xs font-black fill-slate-400">a</text>
          {/* Mountain Peak C */}
          <circle cx="160" cy="40" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          <text x="160" y="26" textAnchor="middle" className="text-xs font-black fill-amber-600">🏔️ Cima (C)</text>
          {/* Observer points */}
          <circle cx="50" cy="165" r="4" fill="#0284c7" />
          <text x="35" y="172" className="text-xs font-black fill-slate-700">A</text>
          <circle cx="290" cy="165" r="4" fill="#0284c7" />
          <text x="300" y="172" className="text-xs font-black fill-slate-700">B</text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Calcula el ángulo en la cima de la montaña (C).",
          question: "¿Cuánto mide el ángulo C?",
          formulaHint: "C = 180° - 50° - 70°",
          expectedKey: "angleC_topo",
          correctVal: 60,
          tolerance: 0.5,
          unit: "°",
          explanation: "C = 180° - 120° = 60°"
        },
        {
          instruction: "Paso 2: Calcula la distancia desde el punto A hasta la cima (lado b = AC) usando la Ley del Seno.",
          question: "Calcula la distancia 'b' en metros:",
          formulaHint: "b = \\frac{c \\cdot \\sin(B)}{\\sin(C)} = \\frac{50 \\cdot \\sin(70°)}{\\sin(60°)}",
          expectedKey: "dist_b",
          correctVal: 54.25, // 50 * sin(70°) / sin(60°) = 50 * 0.9397 / 0.8660 ≈ 54.25
          tolerance: 0.2,
          unit: "m",
          explanation: "b = (50 × 0.9397) / 0.8660 ≈ 54.25 m"
        }
      ]
    },
    {
      id: 3,
      title: "Nivel 4: Despeje de un Ángulo Desconocido",
      type: "ANGLE_FIND",
      badge: "Intermedio - Uso de Arcsin",
      description: "En un triángulo, el lado a = 9 cm con ángulo opuesto A = 30°, y el lado b = 12 cm. Despeja y calcula el valor del ángulo agudo B.",
      unknown: "Ángulo B = ?",
      given: { "Lado a": "9 cm", "Ángulo A": "30°", "Lado b": "12 cm" },
      svg: (
        <svg viewBox="0 0 340 200" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* A(40,165), B(290,165), C(130,45) */}
          <polygon points="40,165 290,165 130,45" fill="#faf5ff" stroke="#9333ea" strokeWidth="3" strokeLinejoin="round" />
          {/* Angle A Arc */}
          <path d="M 75,165 A 35 35 0 0 0 68,145" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="75" y="158" className="text-xs font-black fill-cyan-600">30°</text>
          {/* Angle B (Unknown) */}
          <path d="M 255,165 A 35 35 0 0 1 268,138" fill="none" stroke="#9333ea" strokeWidth="2.5" strokeDasharray="3 3" />
          <text x="228" y="155" className="text-xs font-black fill-purple-700">∠B = ?</text>
          {/* Sides */}
          <text x="225" y="95" className="text-xs font-black fill-slate-700">a = 9 cm</text>
          <text x="65" y="95" className="text-xs font-black fill-slate-700">b = 12 cm</text>
          <text x="165" y="185" textAnchor="middle" className="text-xs font-black fill-slate-400">c</text>
          {/* Vertices */}
          <circle cx="40" cy="165" r="4" fill="#9333ea" />
          <text x="25" y="172" className="text-xs font-black fill-slate-700">A</text>
          <circle cx="290" cy="165" r="4" fill="#9333ea" />
          <text x="300" y="172" className="text-xs font-black fill-slate-700">B</text>
          <circle cx="130" cy="45" r="4" fill="#9333ea" />
          <text x="130" y="32" textAnchor="middle" className="text-xs font-black fill-slate-700">C</text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Aplica la fórmula para ángulos sin(B) = (b × sin(A)) / a.",
          question: "¿Cuál es el valor decimal de sin(B)?",
          formulaHint: "\\sin(B) = \\frac{12 \\cdot \\sin(30°)}{9} = \\frac{12 \\cdot 0.5}{9}",
          expectedKey: "sinB_val",
          correctVal: 0.67,
          tolerance: 0.03,
          unit: "",
          explanation: "sin(B) = 6 / 9 = 0.6667"
        },
        {
          instruction: "Paso 2: Aplica la función inversa arcsin(0.6667) para obtener el ángulo B en grados.",
          question: "¿Cuánto mide el ángulo B en grados? (redondea a 1 decimal):",
          formulaHint: "B = \\arcsin(0.6667)",
          expectedKey: "angleB_deg",
          correctVal: 41.8,
          tolerance: 0.4,
          unit: "°",
          explanation: "B = arcsin(0.6667) ≈ 41.81°"
        }
      ]
    },
    {
      id: 4,
      title: "Nivel 5: Desafío Maestro - El Caso Ambiguo (L-L-A)",
      type: "AMBIGUOUS_CHALLENGE",
      badge: "Avanzado - Las Dos Soluciones",
      description: "Tienes a = 7 cm, b = 9 cm y A = 40°. Sabemos que existen 2 triángulos posibles. Ya encontramos la primera solución aguda B₁ ≈ 55.7°. ¡Halla la segunda solución suplementaria B₂!",
      unknown: "Ángulo obtuso B₂ = ?",
      given: { "Lado a": "7 cm", "Lado b": "9 cm", "Ángulo A": "40°", "Solución 1 (B₁)": "55.7°" },
      svg: (
        <svg viewBox="0 0 340 200" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* Base ground */}
          <line x1="30" y1="165" x2="310" y2="165" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
          {/* A(40,165), C(160,50), B1(260,165), B2(120,165) */}
          <polygon points="40,165 160,50 260,165" fill="rgba(6, 182, 212, 0.12)" stroke="#06b6d4" strokeWidth="2" />
          <polygon points="40,165 160,50 120,165" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="2.5" />
          {/* Angle A Arc */}
          <path d="M 75,165 A 35 35 0 0 0 68,142" fill="none" stroke="#0284c7" strokeWidth="2" />
          <text x="75" y="155" className="text-xs font-black fill-cyan-700">40°</text>
          {/* Labels */}
          <text x="85" y="95" className="text-xs font-black fill-slate-700">b = 9 cm</text>
          <text x="215" y="100" className="text-[11px] font-black fill-cyan-600">a = 7</text>
          <text x="135" y="115" className="text-[11px] font-black fill-rose-600">a = 7</text>
          <text x="260" y="185" className="text-[11px] font-black fill-cyan-600">B₁ (55.7°)</text>
          <text x="105" y="185" className="text-[11px] font-black fill-rose-600 font-bold">B₂ = ? (obtuso)</text>
          {/* Vertices */}
          <circle cx="40" cy="165" r="4" fill="#0284c7" />
          <text x="25" y="172" className="text-xs font-black fill-slate-700">A</text>
          <circle cx="160" cy="50" r="4" fill="#f59e0b" />
          <text x="160" y="36" textAnchor="middle" className="text-xs font-black fill-amber-600">C</text>
          <circle cx="260" cy="165" r="4" fill="#06b6d4" />
          <circle cx="120" cy="165" r="4" fill="#f43f5e" />
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Los ángulos suplementarios tienen el mismo seno: sin(180° - θ) = sin(θ). Calcula el segundo ángulo posible B₂ (obtuso).",
          question: "¿Cuánto mide el ángulo obtuso B₂?",
          formulaHint: "B_2 = 180° - B_1 = 180° - 55.7°",
          expectedKey: "angleB2_obtuse",
          correctVal: 124.3,
          tolerance: 0.5,
          unit: "°",
          explanation: "B₂ = 180° - 55.7° = 124.3°"
        },
        {
          instruction: "Paso 2: Comprueba si este segundo triángulo es válido sumando A + B₂. ¿Cuánto le queda al tercer ángulo C₂?",
          question: "Calcula el tercer ángulo C₂:",
          formulaHint: "C_2 = 180° - A - B_2 = 180° - 40° - 124.3°",
          expectedKey: "angleC2",
          correctVal: 15.7,
          tolerance: 0.5,
          unit: "°",
          explanation: "C₂ = 180° - 40° - 124.3° = 15.7° > 0°, ¡por lo tanto el 2do triángulo es completamente válido!"
        }
      ]
    }
  ];

  // Handler for exercise input validation
  const handleCheckExerciseStep = (exerciseIdx: number, stepIdx: number) => {
    const ex = exercises[exerciseIdx];
    const step = ex.steps[stepIdx];
    const rawVal = userInputs[step.expectedKey];
    const numVal = parseFloat(rawVal);

    if (isNaN(numVal)) {
      setExerciseFeedback({
        ...exerciseFeedback,
        [step.expectedKey]: { ok: false, msg: "Por favor escribe un número válido." }
      });
      return;
    }

    const diff = Math.abs(numVal - step.correctVal);
    if (diff <= step.tolerance) {
      setExerciseFeedback({
        ...exerciseFeedback,
        [step.expectedKey]: { ok: true, msg: `¡Correcto! ${step.explanation}` }
      });

      // Advance step or complete exercise
      if (stepIdx < ex.steps.length - 1) {
        setExerciseStep(stepIdx + 1);
      } else {
        if (!completedExercises.includes(exerciseIdx)) {
          setCompletedExercises([...completedExercises, exerciseIdx]);
        }
      }
    } else {
      setExerciseFeedback({
        ...exerciseFeedback,
        [step.expectedKey]: { ok: false, msg: `No es exacto. Revisa el cálculo o redondeo. Pista: ${step.formulaHint}` }
      });
    }
  };

  // --- TAB 4: COASTAL RESCUE MINIGAME STATE ---
  const [gameScore, setGameScore] = useState(0);
  const [gameStreak, setGameStreak] = useState(0);
  const [gameRound, setGameRound] = useState(1);
  const [gameStatus, setGameStatus] = useState<'playing' | 'success' | 'failed'>('playing');
  const [shipAngleA, setShipAngleA] = useState(42);
  const [shipAngleB, setShipAngleB] = useState(68);
  const [towersDistance, setTowersDistance] = useState(15); // km
  const [targetShipDistFromA, setTargetShipDistFromA] = useState(0);
  const [userDistInput, setUserDistInput] = useState("");
  const [rescueDispatched, setRescueDispatched] = useState(false);

  // Generate new rescue round
  const generateRescueRound = () => {
    const angleA = Math.floor(Math.random() * 30) + 35; // 35 - 64
    const angleB = Math.floor(Math.random() * 35) + 40; // 40 - 74
    const distTowers = Math.floor(Math.random() * 12) + 10; // 10 - 22 km
    const angleC = 180 - angleA - angleB;

    const radA = (angleA * Math.PI) / 180;
    const radB = (angleB * Math.PI) / 180;
    const radC = (angleC * Math.PI) / 180;

    // Distance from Tower A to Ship is side 'b' opposite to angle B
    // b / sin(B) = c / sin(C) => b = (c * sin(B)) / sin(C)
    const distFromA = (distTowers * Math.sin(radB)) / Math.sin(radC);

    setShipAngleA(angleA);
    setShipAngleB(angleB);
    setTowersDistance(distTowers);
    setTargetShipDistFromA(parseFloat(distFromA.toFixed(2)));
    setUserDistInput("");
    setGameStatus('playing');
    setRescueDispatched(false);
  };

  // Init game on first load
  React.useEffect(() => {
    generateRescueRound();
  }, []);

  const handleLaunchRescue = () => {
    const val = parseFloat(userDistInput);
    if (isNaN(val)) return;

    setRescueDispatched(true);

    const diff = Math.abs(val - targetShipDistFromA);
    if (diff <= 0.35) {
      setGameStatus('success');
      setGameScore(prev => prev + 150 + gameStreak * 25);
      setGameStreak(prev => prev + 1);
    } else {
      setGameStatus('failed');
      setGameStreak(0);
    }
  };

  // --- TAB 5: AMBIGUOUS CASE LAB (L-L-A) STATE ---
  const [ambAngleA, setAmbAngleA] = useState<number>(30);
  const [ambSideB, setAmbSideB] = useState<number>(10);
  const [ambSideA, setAmbSideA] = useState<number>(7);

  // Height h = b * sin(A)
  const radAmbA = (ambAngleA * Math.PI) / 180;
  const ambH = ambSideB * Math.sin(radAmbA);

  // Determine number of solutions in LLA
  let ambSolutionCount = 0;
  let ambSolutionDesc = "";
  let angleB1 = 0;
  let angleB2 = 0;

  if (ambAngleA < 90) {
    if (ambSideA < ambH - 0.01) {
      ambSolutionCount = 0;
      ambSolutionDesc = "0 Triángulos: El lado 'a' es más corto que la altura 'h' (a < b·sin(A)). ¡No alcanza a tocar la base!";
    } else if (Math.abs(ambSideA - ambH) <= 0.05) {
      ambSolutionCount = 1;
      ambSolutionDesc = "1 Triángulo Rectángulo: El lado 'a' es exactamente igual a la altura 'h' (a = b·sin(A)). Forma un ángulo recto de 90°.";
      angleB1 = 90;
    } else if (ambSideA >= ambSideB) {
      ambSolutionCount = 1;
      ambSolutionDesc = "1 Triángulo Único: Como a ≥ b, el lado sólo puede cortar la base hacia la derecha (solución única).";
      const sinB = (ambSideB * Math.sin(radAmbA)) / ambSideA;
      angleB1 = (Math.asin(Math.min(1, Math.max(-1, sinB))) * 180) / Math.PI;
    } else {
      ambSolutionCount = 2;
      ambSolutionDesc = "¡2 Triángulos Posibles! (Caso Ambiguo): Como h < a < b, el péndulo corta la base en DOS lugares: uno agudo (B₁) y uno obtuso (B₂).";
      const sinB = (ambSideB * Math.sin(radAmbA)) / ambSideA;
      angleB1 = (Math.asin(Math.min(1, Math.max(-1, sinB))) * 180) / Math.PI;
      angleB2 = 180 - angleB1;
    }
  } else {
    // Obtuse A
    if (ambSideA <= ambSideB) {
      ambSolutionCount = 0;
      ambSolutionDesc = "0 Triángulos: Para ángulo obtuso, el lado opuesto 'a' DEBE ser estrictamente mayor que 'b'.";
    } else {
      ambSolutionCount = 1;
      ambSolutionDesc = "1 Triángulo Único (Obtusángulo): Como a > b, existe una única solución.";
    }
  }

  // --- TAB 6: CUSTOM PROBLEM SOLVER (TALLER DE EJERCICIO PROPIO) ---
  const [customCase, setCustomCase] = useState<'AAL' | 'ALA' | 'LLA'>('ALA');
  const [customAngleA, setCustomAngleA] = useState<number>(45);
  const [customAngleB, setCustomAngleB] = useState<number>(60);
  const [customSideC, setCustomSideC] = useState<number>(14);
  const [customSideA, setCustomSideA] = useState<number>(10);
  const [customSideB, setCustomSideB] = useState<number>(12);

  // Student intermediate inputs
  const [studentThirdAngle, setStudentThirdAngle] = useState<string>('');
  const [studentCalculatedSide, setStudentCalculatedSide] = useState<string>('');
  const [customFeedbackAngle, setCustomFeedbackAngle] = useState<{ ok: boolean; msg: string } | null>(null);
  const [customFeedbackSide, setCustomFeedbackSide] = useState<{ ok: boolean; msg: string } | null>(null);

  // Derived math for custom problem
  let customCalculatedAngleB = 0;
  let customCalculatedAngleC = 180 - customAngleA - customAngleB;
  let customSideA_calc = 0;
  let customSideB_calc = 0;
  let customSideC_calc = 0;
  let customLlaPossible = true;

  if (customCase === 'ALA') {
    customCalculatedAngleC = Math.max(1, 180 - customAngleA - customAngleB);
    const rC = (customCalculatedAngleC * Math.PI) / 180;
    const rA = (customAngleA * Math.PI) / 180;
    const rB = (customAngleB * Math.PI) / 180;
    const k = customSideC / Math.sin(rC);
    customSideA_calc = parseFloat((k * Math.sin(rA)).toFixed(2));
    customSideB_calc = parseFloat((k * Math.sin(rB)).toFixed(2));
  } else if (customCase === 'AAL') {
    // A, B and side a
    customCalculatedAngleC = Math.max(1, 180 - customAngleA - customAngleB);
    const rA = (customAngleA * Math.PI) / 180;
    const rB = (customAngleB * Math.PI) / 180;
    const rC = (customCalculatedAngleC * Math.PI) / 180;
    const k = customSideA / Math.sin(rA);
    customSideB_calc = parseFloat((k * Math.sin(rB)).toFixed(2));
    customSideC_calc = parseFloat((k * Math.sin(rC)).toFixed(2));
  } else {
    // LLA: side a, side b, angle A
    const rA = (customAngleA * Math.PI) / 180;
    const sinB = (customSideB * Math.sin(rA)) / customSideA;
    if (sinB <= 1 && sinB > 0) {
      customLlaPossible = true;
      const angleB_deg = (Math.asin(sinB) * 180) / Math.PI;
      customCalculatedAngleB = parseFloat(angleB_deg.toFixed(1));
      customCalculatedAngleC = parseFloat((180 - customAngleA - angleB_deg).toFixed(1));
      const rC = (customCalculatedAngleC * Math.PI) / 180;
      customSideC_calc = parseFloat(((customSideA / Math.sin(rA)) * Math.sin(rC)).toFixed(2));
    } else {
      customLlaPossible = false;
      customCalculatedAngleB = 0;
      customCalculatedAngleC = 0;
      customSideC_calc = 0;
    }
  }

  const handleVerifyCustomAngle = () => {
    const val = parseFloat(studentThirdAngle);
    if (isNaN(val)) {
      setCustomFeedbackAngle({ ok: false, msg: "Ingresa un valor numérico." });
      return;
    }
    const expected = customCase === 'LLA' ? customCalculatedAngleB : customCalculatedAngleC;
    if (Math.abs(val - expected) <= 0.6) {
      setCustomFeedbackAngle({
        ok: true,
        msg: customCase === 'LLA'
          ? `¡Excelente! Por la Ley del Seno, sin(B) = (${customSideB} · sin(${customAngleA}°)) / ${customSideA}, por lo tanto el ángulo B mide ${expected}°.`
          : `¡Excelente! El ángulo C mide exactamente ${expected}°.`
      });
    } else {
      setCustomFeedbackAngle({
        ok: false,
        msg: customCase === 'LLA'
          ? `Revisa la Ley del Seno: sin(B) = (b · sin(A)) / a. El ángulo B esperado es: ${expected}°.`
          : `Revisa la suma de ángulos internos (180° - A - B). Esperado: ${expected}°.`
      });
    }
  };

  const handleVerifyCustomSide = () => {
    const val = parseFloat(studentCalculatedSide);
    if (isNaN(val)) {
      setCustomFeedbackSide({ ok: false, msg: "Ingresa un valor numérico." });
      return;
    }
    const target = customCase === 'ALA' ? customSideA_calc : (customCase === 'AAL' ? customSideB_calc : customSideC_calc);
    if (Math.abs(val - target) <= 0.4) {
      setCustomFeedbackSide({ ok: true, msg: `¡Cálculo correcto! El lado mide aproximadamente ${target} unidades.` });
    } else {
      setCustomFeedbackSide({ ok: false, msg: `Revisa el despeje en la Ley del Seno. Valor esperado: ~${target}.` });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Navigation Tabs Header */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-3xl shadow-lg border-2 border-slate-200 sticky top-20 z-40">
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'concept'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={16} /> 1. Concepto &amp; Fórmulas
        </button>

        <button
          onClick={() => setActiveTab('lab-ala')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'lab-ala'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={16} /> 2. Laboratorio A-L-A &amp; A-A-L
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'exercises'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator size={16} /> 3. 5 Ejercicios Guiados
        </button>

        <button
          onClick={() => setActiveTab('rescue-game')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'rescue-game'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gamepad2 size={16} /> 4. Misión Rescate Costero
        </button>

        <button
          onClick={() => setActiveTab('ambiguous-lab')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'ambiguous-lab'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle size={16} /> 5. El Caso Ambiguo (L-L-A)
        </button>

        <button
          onClick={() => setActiveTab('custom-solver')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'custom-solver'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Edit3 size={16} /> 6. Crea tu Ejercicio
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONCEPTO INTERACTIVO Y CORRESPONDENCIA VISUAL DE FÓRMULAS */}
      {/* ========================================================================= */}
      {activeTab === 'concept' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Observa el triángulo de referencia! La Ley del Seno nos dice que la razón entre cualquier lado y el seno de su ángulo opuesto siempre es la misma constante." />

          {/* Master Reference Card: Triangle Drawing + Formulas */}
          <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 text-white p-6 md:p-10 rounded-3xl shadow-2xl border-4 border-cyan-500/40 relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/30 pb-6 relative z-10">
              <div>
                <span className="bg-cyan-500/30 text-cyan-300 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-cyan-400/30 inline-block mb-2">
                  Teorema Fundamental &amp; Proporciones
                </span>
                <h3 className="text-2xl md:text-4xl font-black tracking-tight">
                  La Ley del Seno
                </h3>
                <p className="text-slate-300 text-sm md:text-base mt-1">
                  Relaciona cada lado con el seno de su ángulo opuesto: <MathFormula formula="\frac{a}{\sin(A)} = \frac{b}{\sin(B)} = \frac{c}{\sin(C)}" />
                </p>
              </div>

              {/* Angle/Side Pair Selector for Interactive Learning */}
              <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-cyan-400/30">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">
                  Enfocar Pareja:
                </span>
                {(['A', 'B', 'C'] as const).map((pair) => (
                  <button
                    key={pair}
                    onClick={() => setHighlightedPair(pair)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                      highlightedPair === pair
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md scale-105'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Ángulo {pair} / Lado {pair.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Row: SVG Triangle Drawing & Formula Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* LEFT: Illustrative Triangle SVG Drawing with Direct Visual Correspondence */}
              <div className="lg:col-span-5 bg-slate-900/90 p-5 md:p-6 rounded-3xl border-2 border-cyan-400/40 shadow-inner flex flex-col items-center justify-center relative">
                <div className="w-full flex items-center justify-between text-xs font-black text-slate-300 mb-2 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Sparkles size={14} /> Triángulo Oblicuángulo
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Lados opuestos a vértices
                  </span>
                </div>

                <svg viewBox="0 0 360 250" className="w-full max-w-sm h-auto select-none drop-shadow-md">
                  <defs>
                    <linearGradient id="sineTriFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
                    </linearGradient>
                  </defs>

                  {/* Vertices coordinates: C(180, 35), A(45, 205), B(315, 205) */}
                  {/* Triangle Polygon */}
                  <polygon
                    points="45,205 315,205 180,35"
                    fill="url(#sineTriFillGrad)"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />

                  {/* Visual correspondence dashed highlight from highlighted angle to opposite side */}
                  {highlightedPair === 'A' && (
                    <line x1="45" y1="205" x2="247" y2="120" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.8" />
                  )}
                  {highlightedPair === 'B' && (
                    <line x1="315" y1="205" x2="112" y2="120" stroke="#c084fc" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.8" />
                  )}
                  {highlightedPair === 'C' && (
                    <line x1="180" y1="35" x2="180" y2="205" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.8" />
                  )}

                  {/* Angle Arc at Vertex A (Bottom-Left) */}
                  <path
                    d="M 85,205 A 40 40 0 0 0 68,176"
                    fill="none"
                    stroke={highlightedPair === 'A' ? "#38bdf8" : "#38bdf8"}
                    strokeWidth={highlightedPair === 'A' ? "4" : "2.5"}
                  />
                  <text x="92" y="195" className={`text-xs font-black ${highlightedPair === 'A' ? 'fill-cyan-300' : 'fill-cyan-400'}`}>
                    A (α)
                  </text>

                  {/* Angle Arc at Vertex B (Bottom-Right) */}
                  <path
                    d="M 275,205 A 40 40 0 0 1 292,176"
                    fill="none"
                    stroke={highlightedPair === 'B' ? "#c084fc" : "#c084fc"}
                    strokeWidth={highlightedPair === 'B' ? "4" : "2.5"}
                  />
                  <text x="250" y="195" className={`text-xs font-black ${highlightedPair === 'B' ? 'fill-purple-300' : 'fill-purple-400'}`}>
                    B (β)
                  </text>

                  {/* Angle Arc at Vertex C (Top) */}
                  <path
                    d="M 156,60 A 35 35 0 0 0 204,60"
                    fill="none"
                    stroke={highlightedPair === 'C' ? "#fbbf24" : "#fbbf24"}
                    strokeWidth={highlightedPair === 'C' ? "4" : "2.5"}
                  />
                  <text x="180" y="78" textAnchor="middle" className={`text-xs font-black ${highlightedPair === 'C' ? 'fill-amber-300' : 'fill-amber-400'}`}>
                    C (γ)
                  </text>

                  {/* Side a (Opposite to Vertex A, between C and B) */}
                  <line 
                    x1="180" y1="35" x2="315" y2="205" 
                    stroke={highlightedPair === 'A' ? "#38bdf8" : "#94a3b8"} 
                    strokeWidth={highlightedPair === 'A' ? "5" : "3"} 
                  />
                  <rect x="252" y="110" width="34" height="24" rx="6" fill="#0f172a" stroke={highlightedPair === 'A' ? "#38bdf8" : "#475569"} strokeWidth="1.5" />
                  <text x="269" y="126" textAnchor="middle" className={`text-xs font-black ${highlightedPair === 'A' ? 'fill-cyan-300' : 'fill-slate-200'}`}>
                    a
                  </text>

                  {/* Side b (Opposite to Vertex B, between C and A) */}
                  <line 
                    x1="180" y1="35" x2="45" y2="205" 
                    stroke={highlightedPair === 'B' ? "#c084fc" : "#94a3b8"} 
                    strokeWidth={highlightedPair === 'B' ? "5" : "3"} 
                  />
                  <rect x="74" y="110" width="34" height="24" rx="6" fill="#0f172a" stroke={highlightedPair === 'B' ? "#c084fc" : "#475569"} strokeWidth="1.5" />
                  <text x="91" y="126" textAnchor="middle" className={`text-xs font-black ${highlightedPair === 'B' ? 'fill-purple-300' : 'fill-slate-200'}`}>
                    b
                  </text>

                  {/* Side c (Opposite to Vertex C, Base between A and B) */}
                  <line 
                    x1="45" y1="205" x2="315" y2="205" 
                    stroke={highlightedPair === 'C' ? "#fbbf24" : "#94a3b8"} 
                    strokeWidth={highlightedPair === 'C' ? "5" : "3"} 
                  />
                  <rect x="163" y="215" width="34" height="24" rx="6" fill="#0f172a" stroke={highlightedPair === 'C' ? "#fbbf24" : "#475569"} strokeWidth="1.5" />
                  <text x="180" y="231" textAnchor="middle" className={`text-xs font-black ${highlightedPair === 'C' ? 'fill-amber-300' : 'fill-slate-200'}`}>
                    c
                  </text>

                  {/* Vertices Points */}
                  <circle cx="45" cy="205" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <text x="25" y="218" className="text-sm font-black fill-cyan-300">A</text>

                  <circle cx="315" cy="205" r="7" fill="#c084fc" stroke="#ffffff" strokeWidth="2" />
                  <text x="328" y="218" className="text-sm font-black fill-purple-300">B</text>

                  <circle cx="180" cy="35" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                  <text x="180" y="20" textAnchor="middle" className="text-sm font-black fill-amber-300">C</text>
                </svg>

                {/* Direct correlation reminder pill */}
                <div className="mt-3 bg-black/60 px-3 py-1.5 rounded-xl border border-cyan-400/30 text-[11px] text-center text-slate-300">
                  {highlightedPair === 'A' && (
                    <span>El lado <strong className="text-cyan-300">a</strong> se relaciona directamente con el seno de su ángulo opuesto <strong className="text-cyan-400">A</strong></span>
                  )}
                  {highlightedPair === 'B' && (
                    <span>El lado <strong className="text-purple-300">b</strong> se relaciona directamente con el seno de su ángulo opuesto <strong className="text-purple-400">B</strong></span>
                  )}
                  {highlightedPair === 'C' && (
                    <span>El lado <strong className="text-amber-300">c</strong> se relaciona directamente con el seno de su ángulo opuesto <strong className="text-amber-400">C</strong></span>
                  )}
                </div>
              </div>

              {/* RIGHT: Formula Cards & Mode Switcher */}
              <div className="lg:col-span-7 space-y-4">
                {/* View Mode Buttons */}
                <div className="flex flex-wrap items-center gap-2 bg-black/50 p-1.5 rounded-2xl border border-cyan-400/30">
                  <button
                    onClick={() => setConceptFormulaMode('sides')}
                    className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-black text-xs transition-all text-center ${
                      conceptFormulaMode === 'sides'
                        ? 'bg-cyan-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    1. Para Hallar Lados (L arriba)
                  </button>
                  <button
                    onClick={() => setConceptFormulaMode('angles')}
                    className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-black text-xs transition-all text-center ${
                      conceptFormulaMode === 'angles'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    2. Para Hallar Ángulos (Seno arriba)
                  </button>
                  <button
                    onClick={() => setConceptFormulaMode('all')}
                    className={`py-2 px-3 rounded-xl font-black text-xs transition-all text-center ${
                      conceptFormulaMode === 'all'
                        ? 'bg-amber-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Ver Ambas
                  </button>
                </div>

                {/* FORMULA VIEW: SIDES */}
                {(conceptFormulaMode === 'sides' || conceptFormulaMode === 'all') && (
                  <div className="bg-slate-900/90 p-5 rounded-2xl border-2 border-cyan-400/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-cyan-400" /> Forma 1: Para Calcular Lados Desconocidos (Casos A-L-A y A-A-L)
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded-md">
                        Lados en el numerador
                      </span>
                    </div>

                    <div className="bg-black/50 p-4 rounded-xl border border-cyan-500/40 text-center space-y-2">
                      <div className="text-base sm:text-xl font-bold text-cyan-300">
                        <MathFormula formula="\frac{a}{\sin(A)} = \frac{b}{\sin(B)} = \frac{c}{\sin(C)}" block={true} />
                      </div>
                      <div className="text-xs text-slate-300 pt-1 border-t border-slate-800">
                        {highlightedPair === 'A' && (
                          <MathFormula formula="a = \frac{b \cdot \sin(A)}{\sin(B)} \quad \text{ó} \quad a = \frac{c \cdot \sin(A)}{\sin(C)}" />
                        )}
                        {highlightedPair === 'B' && (
                          <MathFormula formula="b = \frac{a \cdot \sin(B)}{\sin(A)} \quad \text{ó} \quad b = \frac{c \cdot \sin(B)}{\sin(C)}" />
                        )}
                        {highlightedPair === 'C' && (
                          <MathFormula formula="c = \frac{a \cdot \sin(C)}{\sin(A)} \quad \text{ó} \quad c = \frac{b \cdot \sin(C)}{\sin(B)}" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* FORMULA VIEW: ANGLES */}
                {(conceptFormulaMode === 'angles' || conceptFormulaMode === 'all') && (
                  <div className="bg-slate-900/90 p-5 rounded-2xl border-2 border-purple-400/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                        <RotateCw size={14} className="text-purple-400" /> Forma 2: Para Encontrar Ángulos Desconocidos
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded-md">
                        Senos en el numerador
                      </span>
                    </div>

                    <div className="bg-black/50 p-4 rounded-xl border border-purple-500/40 text-center space-y-2">
                      <div className="text-base sm:text-xl font-bold text-purple-300">
                        <MathFormula formula="\frac{\sin(A)}{a} = \frac{\sin(B)}{b} = \frac{\sin(C)}{c}" block={true} />
                      </div>
                      <div className="text-xs text-purple-200 pt-1 border-t border-slate-800">
                        {highlightedPair === 'A' && (
                          <MathFormula formula="\sin(A) = \frac{a \cdot \sin(B)}{b} \implies A = \arcsin\left(\frac{a \cdot \sin(B)}{b}\right)" />
                        )}
                        {highlightedPair === 'B' && (
                          <MathFormula formula="\sin(B) = \frac{b \cdot \sin(A)}{a} \implies B = \arcsin\left(\frac{b \cdot \sin(A)}{a}\right)" />
                        )}
                        {highlightedPair === 'C' && (
                          <MathFormula formula="\sin(C) = \frac{c \cdot \sin(A)}{a} \implies C = \arcsin\left(\frac{c \cdot \sin(A)}{a}\right)" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pedagogical Tip */}
                <div className="bg-cyan-500/15 border border-cyan-400/40 p-3.5 rounded-2xl text-xs text-cyan-200 flex items-start gap-2.5">
                  <Lightbulb size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Consejo Pro:</strong> Coloca siempre la <em>incógnita en el numerador (arriba)</em> para que el despeje sea instantáneo simplemente pasando el denominador multiplicando al otro lado.
                  </p>
                </div>
              </div>

            </div>

            {/* When to use: Direct friendly cases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-cyan-500/20">
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span className="font-black text-cyan-300 text-xs uppercase tracking-wider">1. Caso A - L - A (Ángulo - Lado - Ángulo)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Conoces 2 ángulos y el lado comprendido entre ellos. Primero hallas el 3er ángulo con <MathFormula formula="C = 180° - A - B" /> y luego aplicas la Ley del Seno.
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span className="font-black text-purple-300 text-xs uppercase tracking-wider">2. Caso A - A - L (Ángulo - Ángulo - Lado)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Conoces 2 ángulos y un lado opuesto a uno de ellos. ¡Tienes una pareja completa desde el inicio para despejar directamente!
                </p>
              </div>
            </div>

          </div>

          {/* Real World Applications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <Radio size={24} />
              </div>
              <h4 className="font-black text-slate-800 text-base">Triangulación GPS &amp; Satélites</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Tu teléfono calcula tu posición exacta en la Tierra interceptando señales angulares desde 3 o más satélites orbitales usando la Ley del Seno.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Navigation size={24} />
              </div>
              <h4 className="font-black text-slate-800 text-base">Navegación y Rescate Marítimo</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Dos faros costeros miden los ángulos de rumbo hacia un barco en emergencia para calcular su distancia exacta sin necesidad de navegar a ciegas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Compass size={24} />
              </div>
              <h4 className="font-black text-slate-800 text-base">Topografía y Alturas Inaccesibles</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Los ingenieros miden la altura de volcanes, torres y cañones profundos midiendo dos ángulos desde una base plana accesible en el suelo.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LABORATORIO INTERACTIVO A-L-A & A-A-L (LA BALANZA DE RAZONES) */}
      {/* ========================================================================= */}
      {activeTab === 'lab-ala' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Mueve los deslizadores de los ángulos y la base! Observa cómo las tres razones a/sin(A), b/sin(B) y c/sin(C) se mantienen en perfecto equilibrio constante." />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Dynamic Triangle & Circumcircle Canvas */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg md:text-xl font-black text-slate-900">Geometría Dinámica en Vivo</h4>
                  <p className="text-xs text-slate-500 font-medium">Triángulo generado por ángulos A, B y base c</p>
                </div>

                <button
                  onClick={() => setShowCircumcircle(!showCircumcircle)}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
                    showCircumcircle 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Layers size={14} /> {showCircumcircle ? 'Ocultar Círculo Circunscrito' : 'Ver Círculo Circunscrito (2R)'}
                </button>
              </div>

              {/* Dynamic SVG Triangle Drawing */}
              <div className="bg-slate-950 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden min-h-[300px]">
                {/* Visual coordinate math for triangle */}
                {(() => {
                  // A at (70, 240), B at (330, 240) -> base = 260px corresponds to labSideC
                  const scale = 240 / Math.max(labSideC, labSideA, labSideB, 1);
                  const ax = 60;
                  const ay = 250;
                  const bx = 60 + labSideC * scale;
                  const by = 250;

                  // Vertex C position from angle A and side b
                  const cx = ax + labSideB * scale * Math.cos(radA);
                  const cy = ay - labSideB * scale * Math.sin(radA);

                  // Center of circumcircle calculation
                  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
                  const ux = ((ax*ax + ay*ay)*(by - cy) + (bx*bx + by*by)*(cy - ay) + (cx*cx + cy*cy)*(ay - by)) / d;
                  const uy = ((ax*ax + ay*ay)*(cx - bx) + (bx*bx + by*by)*(ax - cx) + (cx*cx + cy*cy)*(bx - ax)) / d;
                  const rPix = circumRadius * scale;

                  return (
                    <svg viewBox="0 0 420 320" className="w-full h-auto max-h-[320px] select-none">
                      {/* Circumcircle if active */}
                      {showCircumcircle && (
                        <circle
                          cx={ux}
                          cy={uy}
                          r={rPix}
                          fill="rgba(168, 85, 247, 0.08)"
                          stroke="#a855f7"
                          strokeWidth="2"
                          strokeDasharray="6 6"
                        />
                      )}

                      {/* Triangle filled polygon */}
                      <polygon
                        points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
                        fill="rgba(6, 182, 212, 0.15)"
                        stroke="#06b6d4"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />

                      {/* Angle A Arc */}
                      <path
                        d={`M ${ax + 30},${ay} A 30 30 0 0 0 ${ax + 30 * Math.cos(radA)},${ay - 30 * Math.sin(radA)}`}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                      />
                      <text x={ax + 38} y={ay - 10} className="text-[11px] font-black fill-cyan-300">
                        {labAngleA}°
                      </text>

                      {/* Angle B Arc */}
                      <path
                        d={`M ${bx - 30},${by} A 30 30 0 0 1 ${bx - 30 * Math.cos(radB)},${by - 30 * Math.sin(radB)}`}
                        fill="none"
                        stroke="#c084fc"
                        strokeWidth="3"
                      />
                      <text x={bx - 55} y={by - 10} className="text-[11px] font-black fill-purple-300">
                        {labAngleB}°
                      </text>

                      {/* Angle C Arc */}
                      <text x={cx} y={cy - 12} textAnchor="middle" className="text-[11px] font-black fill-amber-300">
                        C = {labAngleC}°
                      </text>

                      {/* Side a (between C and B) */}
                      <text x={(bx + cx) / 2 + 14} y={(by + cy) / 2} className="text-xs font-black fill-cyan-300">
                        a = {labSideA.toFixed(2)}
                      </text>

                      {/* Side b (between C and A) */}
                      <text x={(ax + cx) / 2 - 25} y={(ay + cy) / 2} className="text-xs font-black fill-purple-300">
                        b = {labSideB.toFixed(2)}
                      </text>

                      {/* Side c (Base) */}
                      <text x={(ax + bx) / 2} y={ay + 24} textAnchor="middle" className="text-xs font-black fill-amber-300">
                        c = {labSideC} (base)
                      </text>

                      {/* Vertices */}
                      <circle cx={ax} cy={ay} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                      <text x={ax - 18} y={ay + 5} className="text-xs font-black fill-cyan-300">A</text>

                      <circle cx={bx} cy={by} r="6" fill="#c084fc" stroke="#ffffff" strokeWidth="2" />
                      <text x={bx + 10} y={by + 5} className="text-xs font-black fill-purple-300">B</text>

                      <circle cx={cx} cy={cy} r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                      <text x={cx} y={cy - 24} textAnchor="middle" className="text-xs font-black fill-amber-300">C</text>
                    </svg>
                  );
                })()}
              </div>

              {/* Real-Time Mathematical Balance */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border-2 border-cyan-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} /> La Razón Constante k = 2R
                  </span>
                  <span className="text-xs font-bold text-amber-300 bg-black/50 px-2.5 py-1 rounded-lg">
                    k = {ratioK.toFixed(3)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-black/40 p-3 rounded-xl border border-cyan-400/30 space-y-1">
                    <span className="text-cyan-300 font-bold">Razón A:</span>
                    <div className="font-mono text-slate-200">
                      <MathFormula formula={`\\frac{${labSideA.toFixed(2)}}{\\sin(${labAngleA}°)}`} />
                    </div>
                    <div className="font-black text-cyan-400 text-sm">{ (labSideA / Math.sin(radA)).toFixed(3) }</div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-purple-400/30 space-y-1">
                    <span className="text-purple-300 font-bold">Razón B:</span>
                    <div className="font-mono text-slate-200">
                      <MathFormula formula={`\\frac{${labSideB.toFixed(2)}}{\\sin(${labAngleB}°)}`} />
                    </div>
                    <div className="font-black text-purple-400 text-sm">{ (labSideB / Math.sin(radB)).toFixed(3) }</div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-amber-400/30 space-y-1">
                    <span className="text-amber-300 font-bold">Razón C:</span>
                    <div className="font-mono text-slate-200">
                      <MathFormula formula={`\\frac{${labSideC}}{\\sin(${labAngleC}°)}`} />
                    </div>
                    <div className="font-black text-amber-400 text-sm">{ (labSideC / Math.sin(radC)).toFixed(3) }</div>
                  </div>
                </div>

                {showCircumcircle && (
                  <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-400/30 text-xs text-purple-200 text-center">
                    🌟 <strong>¡Propiedad Geométrica!:</strong> Esta razón constante <MathFormula formula="k \approx" /> <strong>{ratioK.toFixed(2)}</strong> es exactamente el <strong>diámetro ($2R$)</strong> del círculo que circunscribe al triángulo.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Interactive Controls & Step Calculator */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Calculator size={18} className="text-cyan-600" /> Controles del Triángulo
                </h4>

                {/* Slider Angle A */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-cyan-700">Ángulo A (α):</span>
                    <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md font-mono">{labAngleA}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max={160 - labAngleB}
                    value={labAngleA}
                    onChange={(e) => setLabAngleA(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>

                {/* Slider Angle B */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-purple-700">Ángulo B (β):</span>
                    <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-mono">{labAngleB}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max={160 - labAngleA}
                    value={labAngleB}
                    onChange={(e) => setLabAngleB(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Slider Side C */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-amber-700">Lado Base c:</span>
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-mono">{labSideC} u</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={labSideC}
                    onChange={(e) => setLabSideC(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                {/* Sum of Angles Checker */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between font-black text-slate-700">
                    <span>Suma de Ángulos:</span>
                    <span>{labAngleA}° + {labAngleB}° + {labAngleC}° = 180°</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    El 3er ángulo <MathFormula formula="C" /> se calcula automáticamente como <MathFormula formula="180° - A - B" />.
                  </p>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Casos de Estudio Rápidos:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setLabAngleA(60); setLabAngleB(60); setLabSideC(10); }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors"
                  >
                    Equilátero (60°-60°-60°)
                  </button>
                  <button
                    onClick={() => { setLabAngleA(45); setLabAngleB(45); setLabSideC(12); }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors"
                  >
                    Rectángulo Isósceles (45°-45°-90°)
                  </button>
                  <button
                    onClick={() => { setLabAngleA(30); setLabAngleB(30); setLabSideC(14); }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors"
                  >
                    Obtusángulo (30°-30°-120°)
                  </button>
                  <button
                    onClick={() => { setLabAngleA(35); setLabAngleB(75); setLabSideC(10); }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors"
                  >
                    Escaleno Estándar (35°-75°-70°)
                  </button>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 5 EJERCICIOS GUIADOS PASO A PASO (PROGRESIÓN DIDÁCTICA) */}
      {/* ========================================================================= */}
      {activeTab === 'exercises' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Entrena tu mente! Sigue los pasos estructurados para resolver cada caso con seguridad y precisión." />

          {/* Exercise Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {exercises.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => {
                  setCurrentExercise(idx);
                  setExerciseStep(0);
                }}
                className={`px-4 py-2 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
                  currentExercise === idx
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105'
                    : completedExercises.includes(idx)
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {completedExercises.includes(idx) ? <CheckCircle2 size={14} className="text-emerald-600" /> : idx + 1}
                <span>{ex.title.split(':')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Exercise Card */}
          {(() => {
            const ex = exercises[currentExercise];
            const isCompleted = completedExercises.includes(currentExercise);

            return (
              <div className="bg-white p-6 md:p-10 rounded-3xl border-2 border-slate-200 shadow-xl space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div className="space-y-1">
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block">
                      {ex.badge}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900">{ex.title}</h3>
                  </div>

                  {isCompleted && (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2">
                      <Award size={18} /> ¡Nivel Completado!
                    </div>
                  )}
                </div>

                {/* Problem Statement with Triangle Graphic and Target Unknown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-200">
                  
                  {/* Left: Enunciado, Datos e Incógnita */}
                  <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                          Enunciado
                        </span>
                        <span className="text-xs text-slate-500 font-bold">Lee con atención el problema</span>
                      </div>
                      <p className="text-slate-800 text-sm md:text-base font-semibold leading-relaxed">
                        {ex.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Target Unknown Callout */}
                      <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-3 rounded-2xl border-2 border-amber-400/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span className="text-xs font-black text-amber-900 uppercase tracking-wider">Incógnita a Encontrar:</span>
                        </div>
                        <span className="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-sm">
                          {ex.unknown}
                        </span>
                      </div>

                      {/* Given Data Chips */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                          Datos conocidos del triángulo:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {Object.entries(ex.given).map(([key, val]) => (
                            <span key={key} className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                              <span className="text-slate-500">{key}:</span>
                              <span className="text-emerald-700 font-black font-mono">{val}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Interactive SVG Triangle Figure */}
                  <div className="lg:col-span-5 bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-inner flex flex-col items-center justify-center space-y-2">
                    <div className="w-full flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">
                      <span>Figura Geométrica</span>
                      <span className="text-emerald-600">Representación Visual</span>
                    </div>
                    <div className="w-full py-2">
                      {ex.svg}
                    </div>
                  </div>

                </div>

                {/* Steps Accordion */}
                <div className="space-y-6">
                  {ex.steps.map((step, sIdx) => {
                    const isUnlocked = sIdx <= exerciseStep || isCompleted;
                    const feedback = exerciseFeedback[step.expectedKey];

                    return (
                      <div
                        key={sIdx}
                        className={`p-5 md:p-6 rounded-2xl border-2 transition-all space-y-4 ${
                          isUnlocked
                            ? 'bg-white border-emerald-300 shadow-sm'
                            : 'bg-slate-50 border-slate-200 opacity-60 pointer-events-none'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                            {step.instruction}
                          </span>
                          {feedback?.ok && (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 size={14} /> Resuelto
                            </span>
                          )}
                        </div>

                        <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs font-mono text-center">
                          <MathFormula formula={step.formulaHint} />
                        </div>

                        {/* Interactive Input Form */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                          <label className="text-xs font-black text-slate-700">{step.question}</label>
                          
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Tu resultado..."
                              value={userInputs[step.expectedKey] || ''}
                              onChange={(e) => setUserInputs({ ...userInputs, [step.expectedKey]: e.target.value })}
                              disabled={feedback?.ok}
                              className="px-3 py-2 rounded-xl border-2 border-slate-300 font-mono text-sm font-bold w-36 focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                            />
                            <span className="text-xs font-black text-slate-500">{step.unit}</span>

                            {!feedback?.ok && (
                              <button
                                onClick={() => handleCheckExerciseStep(currentExercise, sIdx)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-black text-xs transition-colors shadow-md"
                              >
                                Comprobar
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Feedback Banner */}
                        {feedback && (
                          <div className={`p-3 rounded-xl text-xs font-bold flex items-start gap-2 ${
                            feedback.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {feedback.ok ? <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" /> : <HelpCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />}
                            <span>{feedback.msg}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Next Exercise CTA */}
                {isCompleted && currentExercise < exercises.length - 1 && (
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setCurrentExercise(currentExercise + 1);
                        setExerciseStep(0);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center gap-2"
                    >
                      Siguiente Ejercicio <ArrowRight size={18} />
                    </button>
                  </div>
                )}

              </div>
            );
          })()}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MINIJUEGO OPERACIÓN RESCATE COSTERO */}
      {/* ========================================================================= */}
      {activeTab === 'rescue-game' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Emergencia marítima! Dos torres de guardacostas detectaron la señal de auxilio de un barco. Triangula la distancia con la Ley del Seno para enviar la lancha de rescate." />

          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-6 md:p-10 rounded-3xl shadow-2xl border-4 border-amber-500/40 relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Score & Streak Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-black">
                  <Trophy size={14} /> Puntos: {gameScore}
                </div>
                <div className="flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-400/30 px-3.5 py-1.5 rounded-full text-xs font-black">
                  <Flame size={14} /> Racha: {gameStreak}x
                </div>
              </div>

              <button
                onClick={generateRescueRound}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} /> Nueva Misión
              </button>
            </div>

            {/* Coastal Radar Canvas */}
            <div className="bg-slate-950/80 rounded-2xl border-2 border-cyan-500/30 p-4 relative min-h-[320px] flex items-center justify-center overflow-hidden">
              
              {/* SVG Radar Visualizer */}
              <svg viewBox="0 0 500 320" className="w-full h-auto max-h-[320px] select-none">
                {/* Sea Waves Gradient Background */}
                <rect x="0" y="0" width="500" height="320" fill="#030712" />

                {/* Radar Grid Circles */}
                <circle cx="250" cy="280" r="80" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
                <circle cx="250" cy="280" r="160" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
                <circle cx="250" cy="280" r="240" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />

                {/* Coastline (Bottom Base) */}
                <line x1="40" y1="280" x2="460" y2="280" stroke="#f59e0b" strokeWidth="4" />
                <text x="250" y="305" textAnchor="middle" className="text-[11px] font-black fill-amber-400">
                  Línea Costera: Base entre Torres = {towersDistance} km
                </text>

                {/* Tower A (Left: 90, 280) */}
                <circle cx="90" cy="280" r="9" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5" />
                <text x="90" y="260" textAnchor="middle" className="text-xs font-black fill-cyan-300">Torre Alfa (A)</text>
                <text x="90" y="240" textAnchor="middle" className="text-[11px] font-mono fill-cyan-400">∠A = {shipAngleA}°</text>

                {/* Tower B (Right: 410, 280) */}
                <circle cx="410" cy="280" r="9" fill="#c084fc" stroke="#ffffff" strokeWidth="2.5" />
                <text x="410" y="260" textAnchor="middle" className="text-xs font-black fill-purple-300">Torre Bravo (B)</text>
                <text x="410" y="240" textAnchor="middle" className="text-[11px] font-mono fill-purple-400">∠B = {shipAngleB}°</text>

                {/* Calculate Ship Position C based on angles */}
                {(() => {
                  const radA = (shipAngleA * Math.PI) / 180;
                  const radB = (shipAngleB * Math.PI) / 180;
                  const angleC = 180 - shipAngleA - shipAngleB;
                  const radC = (angleC * Math.PI) / 180;

                  // Base in pixels: 320 px = towersDistance
                  const scalePx = 320 / towersDistance;
                  const distFromAPx = targetShipDistFromA * scalePx;

                  const shipX = 90 + distFromAPx * Math.cos(radA);
                  const shipY = 280 - distFromAPx * Math.sin(radA);

                  return (
                    <>
                      {/* Triangle Sight Lines */}
                      <line x1="90" y1="280" x2={shipX} y2={shipY} stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" />
                      <line x1="410" y1="280" x2={shipX} y2={shipY} stroke="#c084fc" strokeWidth="2" strokeDasharray="5 5" />

                      {/* Ship in Distress */}
                      <circle cx={shipX} cy={shipY} r="14" fill="#ef4444" className="animate-pulse" />
                      <circle cx={shipX} cy={shipY} r="7" fill="#ffffff" />
                      <text x={shipX} y={shipY - 20} textAnchor="middle" className="text-xs font-black fill-rose-400">
                        🚢 ¡Barco S.O.S! (∠C = {angleC}°)
                      </text>

                      {/* Animated Rescue Boat if launched */}
                      {rescueDispatched && gameStatus === 'success' && (
                        <line
                          x1="90"
                          y1="280"
                          x2={shipX}
                          y2={shipY}
                          stroke="#10b981"
                          strokeWidth="4"
                          className="animate-pulse"
                        />
                      )}
                    </>
                  );
                })()}
              </svg>

            </div>

            {/* Input & Dispatch Controls */}
            <div className="bg-black/50 p-6 rounded-2xl border border-cyan-500/30 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Misión Táctica:
                  </span>
                  <p className="text-sm text-slate-200">
                    Calcula la distancia directa desde la <strong>Torre Alfa (A)</strong> hasta el barco (lado <MathFormula formula="b" />).
                  </p>
                  <div className="text-xs text-slate-400 font-mono">
                    Fórmula: <MathFormula formula="b = \frac{c \cdot \sin(B)}{\sin(180° - A - B)}" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Distancia en km..."
                      value={userDistInput}
                      onChange={(e) => setUserDistInput(e.target.value)}
                      disabled={gameStatus === 'success'}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border-2 border-cyan-400 text-white font-mono text-sm font-bold w-44 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">km</span>
                  </div>

                  {gameStatus === 'playing' ? (
                    <button
                      onClick={handleLaunchRescue}
                      className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center gap-2"
                    >
                      <Navigation size={16} /> ¡Enviar Rescate!
                    </button>
                  ) : (
                    <button
                      onClick={generateRescueRound}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center gap-2"
                    >
                      <RefreshCw size={16} /> Siguiente Misión
                    </button>
                  )}
                </div>
              </div>

              {/* Status Feedback Banner */}
              {gameStatus === 'success' && (
                <div className="bg-emerald-500/20 border border-emerald-400/40 p-4 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  <span>¡Misión Exitosa! La lancha de rescate llegó exactamente a las coordenadas a <strong>{targetShipDistFromA} km</strong>. (+150 pts)</span>
                </div>
              )}

              {gameStatus === 'failed' && (
                <div className="bg-rose-500/20 border border-rose-400/40 p-4 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-3">
                  <HelpCircle size={20} className="text-rose-400 shrink-0" />
                  <span>Cálculo descalibrado. La distancia real era <strong>{targetShipDistFromA} km</strong>. ¡Inténtalo de nuevo en la siguiente ronda!</span>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EL CASO AMBIGUO (L-L-A) - LABORATORIO DE INVESTIGACIÓN AVANZADO */}
      {/* ========================================================================= */}
      {activeTab === 'ambiguous-lab' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡El enigma del caso L-L-A! Como el seno es positivo en los cuadrantes I y II, un mismo valor de seno puede corresponder a dos ángulos: B₁ (agudo) y B₂ = 180° - B₁ (obtuso). Mueve el péndulo del lado 'a' para descubrir los 3 casos." />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Interactive Pendulum Canvas */}
            <div className="lg:col-span-7 bg-slate-900 text-white p-6 md:p-8 rounded-3xl border-2 border-purple-500/40 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle size={16} className="text-purple-400" /> El Péndulo Oscilante
                  </span>
                  <h4 className="text-lg font-black text-white">Visualizador del Caso L-L-A</h4>
                </div>

                <span className={`px-3 py-1.5 rounded-xl font-black text-xs ${
                  ambSolutionCount === 2 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : ambSolutionCount === 1 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {ambSolutionCount} {ambSolutionCount === 1 ? 'Triángulo' : 'Triángulos'}
                </span>
              </div>

              {/* Dynamic Pendulum SVG */}
              <div className="bg-slate-950 rounded-2xl p-4 flex items-center justify-center relative min-h-[300px] overflow-hidden">
                {(() => {
                  const originX = 70;
                  const originY = 250;
                  const scale = 18;

                  const radA = (ambAngleA * Math.PI) / 180;
                  const vertexCX = originX + ambSideB * scale * Math.cos(radA);
                  const vertexCY = originY - ambSideB * scale * Math.sin(radA);

                  const hPx = ambH * scale;
                  const aPx = ambSideA * scale;
                  const floorY = originY;

                  return (
                    <svg viewBox="0 0 460 300" className="w-full h-auto max-h-[300px] select-none">
                      {/* Base Line (Ground) */}
                      <line x1="30" y1={floorY} x2="430" y2={floorY} stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                      <text x="400" y={floorY + 20} className="text-[10px] font-mono fill-slate-400">Base</text>

                      {/* Altitude Height h (Dashed Red Line) */}
                      <line x1={vertexCX} y1={vertexCY} x2={vertexCX} y2={floorY} stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                      <text x={vertexCX + 8} y={(vertexCY + floorY) / 2} className="text-[11px] font-black fill-rose-400">
                        h = {ambH.toFixed(2)}
                      </text>

                      {/* Fixed Side b */}
                      <line x1={originX} y1={originY} x2={vertexCX} y2={vertexCY} stroke="#a855f7" strokeWidth="4" />
                      <text x={(originX + vertexCX) / 2 - 20} y={(originY + vertexCY) / 2} className="text-xs font-black fill-purple-300">
                        b = {ambSideB}
                      </text>

                      {/* Pendulum Arc of radius a */}
                      <circle
                        cx={vertexCX}
                        cy={vertexCY}
                        r={aPx}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity="0.4"
                      />

                      {/* Triangles based on solutions */}
                      {ambSolutionCount === 2 && (
                        <>
                          {/* Acute Solution Triangle */}
                          {(() => {
                            const dx = Math.sqrt(Math.max(0, aPx*aPx - hPx*hPx));
                            const b1X = vertexCX + dx;
                            const b2X = vertexCX - dx;

                            return (
                              <>
                                <polygon
                                  points={`${originX},${originY} ${vertexCX},${vertexCY} ${b1X},${floorY}`}
                                  fill="rgba(6, 182, 212, 0.15)"
                                  stroke="#06b6d4"
                                  strokeWidth="2.5"
                                />
                                <polygon
                                  points={`${originX},${originY} ${vertexCX},${vertexCY} ${b2X},${floorY}`}
                                  fill="rgba(244, 63, 94, 0.2)"
                                  stroke="#f43f5e"
                                  strokeWidth="2.5"
                                />

                                {/* Points */}
                                <circle cx={b1X} cy={floorY} r="5" fill="#06b6d4" />
                                <text x={b1X + 8} y={floorY - 8} className="text-xs font-black fill-cyan-300">
                                  B₁ ({angleB1.toFixed(1)}°)
                                </text>

                                <circle cx={b2X} cy={floorY} r="5" fill="#f43f5e" />
                                <text x={b2X - 25} y={floorY - 8} className="text-xs font-black fill-rose-400">
                                  B₂ ({angleB2.toFixed(1)}°)
                                </text>
                              </>
                            );
                          })()}
                        </>
                      )}

                      {ambSolutionCount === 1 && (
                        <>
                          {(() => {
                            const dx = Math.sqrt(Math.max(0, aPx*aPx - hPx*hPx));
                            const b1X = vertexCX + dx;
                            return (
                              <>
                                <polygon
                                  points={`${originX},${originY} ${vertexCX},${vertexCY} ${b1X},${floorY}`}
                                  fill="rgba(16, 185, 129, 0.2)"
                                  stroke="#10b981"
                                  strokeWidth="3"
                                />
                                <circle cx={b1X} cy={floorY} r="6" fill="#10b981" />
                                <text x={b1X + 8} y={floorY - 8} className="text-xs font-black fill-emerald-300">
                                  B ({angleB1.toFixed(1)}°)
                                </text>
                              </>
                            );
                          })()}
                        </>
                      )}

                      {ambSolutionCount === 0 && (
                        <>
                          {/* Hanging Pendulum that doesn't reach */}
                          <line x1={vertexCX} y1={vertexCY} x2={vertexCX} y2={vertexCY + aPx} stroke="#ef4444" strokeWidth="3.5" strokeDasharray="4 2" />
                          <circle cx={vertexCX} cy={vertexCY + aPx} r="7" fill="#ef4444" />
                          <text x={vertexCX + 12} y={vertexCY + aPx} className="text-xs font-black fill-rose-400">
                            ¡No alcanza la base!
                          </text>
                        </>
                      )}

                      {/* Vertex A and Angle Arc */}
                      <circle cx={originX} cy={originY} r="7" fill="#38bdf8" />
                      <text x={originX - 18} y={originY + 5} className="text-xs font-black fill-cyan-300">A</text>
                      <text x={originX + 30} y={originY - 10} className="text-xs font-black fill-cyan-300">
                        {ambAngleA}°
                      </text>

                      {/* Vertex C */}
                      <circle cx={vertexCX} cy={vertexCY} r="7" fill="#fbbf24" />
                      <text x={vertexCX} y={vertexCY - 14} textAnchor="middle" className="text-xs font-black fill-amber-300">C</text>
                    </svg>
                  );
                })()}
              </div>

              {/* Status Explanation Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-purple-400/30 text-xs leading-relaxed space-y-1.5">
                <span className="text-amber-300 font-black uppercase tracking-wider block">Diagnóstico Matemático:</span>
                <p className="text-slate-200">{ambSolutionDesc}</p>
              </div>

            </div>

            {/* Right: Interactive Controls & Explanation Guide */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
                <h4 className="font-black text-slate-900 text-base">Controles del Péndulo</h4>

                {/* Slider Side a (The swinging side) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-rose-700">Lado Oscilante 'a':</span>
                    <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md font-mono text-sm">{ambSideA} u</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="0.5"
                    value={ambSideA}
                    onChange={(e) => setAmbSideA(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Altura h = {ambH.toFixed(2)}</span>
                    <span>Lado b = {ambSideB}</span>
                  </div>
                </div>

                {/* Slider Side b */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-purple-700">Lado Adyacente 'b':</span>
                    <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-mono">{ambSideB} u</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="14"
                    value={ambSideB}
                    onChange={(e) => setAmbSideB(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Slider Angle A */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-cyan-700">Ángulo A:</span>
                    <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md font-mono">{ambAngleA}°</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={ambAngleA}
                    onChange={(e) => setAmbAngleA(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>
              </div>

              {/* Fast presets to explore the 3 cases */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Probar los 3 Casos del Teorema:
                </span>
                <div className="space-y-2">
                  <button
                    onClick={() => { setAmbAngleA(30); setAmbSideB(10); setAmbSideA(4); }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors flex items-center justify-between"
                  >
                    <span>1. Caso Imposible (a &lt; h)</span>
                    <span className="text-[10px] text-rose-600 font-mono">0 Soluciones</span>
                  </button>

                  <button
                    onClick={() => { setAmbAngleA(30); setAmbSideB(10); setAmbSideA(5); }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors flex items-center justify-between"
                  >
                    <span>2. Caso Rectángulo (a = h = 5)</span>
                    <span className="text-[10px] text-emerald-600 font-mono">1 Solución (90°)</span>
                  </button>

                  <button
                    onClick={() => { setAmbAngleA(30); setAmbSideB(10); setAmbSideA(7); }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors flex items-center justify-between"
                  >
                    <span>3. Caso Ambiguo (h &lt; a &lt; b)</span>
                    <span className="text-[10px] text-purple-600 font-mono">¡2 Soluciones!</span>
                  </button>

                  <button
                    onClick={() => { setAmbAngleA(30); setAmbSideB(10); setAmbSideA(12); }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors flex items-center justify-between"
                  >
                    <span>4. Caso Único (a ≥ b)</span>
                    <span className="text-[10px] text-cyan-600 font-mono">1 Solución</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CREA TU PROPIO EJERCICIO - TALLER INTERACTIVO GUIADO */}
      {/* ========================================================================= */}
      {activeTab === 'custom-solver' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Bienvenido al Taller de Ejercicio Propio! Primero elige el caso trigonométrico, ingresa tus datos y observa cómo se dibuja tu triángulo en tiempo real. Luego, calcula el paso intermedio para desbloquear la solución paso a paso y la conclusión final." />

          {/* Configuration Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="bg-rose-100 text-rose-800 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Paso 1: Elige el Caso y los Datos
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  Generador y Validador de Ejercicios de Ley del Seno
                </h3>
              </div>

              {/* Case selector */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  onClick={() => {
                    setCustomCase('ALA');
                    setStudentThirdAngle('');
                    setStudentCalculatedSide('');
                    setCustomFeedbackAngle(null);
                    setCustomFeedbackSide(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                    customCase === 'ALA'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Caso A-L-A (Ángulo-Lado-Ángulo)
                </button>
                <button
                  onClick={() => {
                    setCustomCase('AAL');
                    setStudentThirdAngle('');
                    setStudentCalculatedSide('');
                    setCustomFeedbackAngle(null);
                    setCustomFeedbackSide(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                    customCase === 'AAL'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Caso A-A-L (Ángulo-Ángulo-Lado)
                </button>
                <button
                  onClick={() => {
                    setCustomCase('LLA');
                    setStudentThirdAngle('');
                    setStudentCalculatedSide('');
                    setCustomFeedbackAngle(null);
                    setCustomFeedbackSide(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                    customCase === 'LLA'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Caso L-L-A (Lado-Lado-Ángulo)
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {customCase === 'ALA' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Ángulo A (grados):</span>
                      <span className="text-rose-600 font-mono">{customAngleA}°</span>
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="150"
                      value={customAngleA}
                      onChange={(e) => {
                        setCustomAngleA(Math.min(160, Math.max(1, Number(e.target.value) || 1)));
                        setCustomFeedbackAngle(null);
                        setCustomFeedbackSide(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Ángulo B (grados):</span>
                      <span className="text-purple-600 font-mono">{customAngleB}°</span>
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="150"
                      value={customAngleB}
                      onChange={(e) => {
                        setCustomAngleB(Math.min(160, Math.max(1, Number(e.target.value) || 1)));
                        setCustomFeedbackAngle(null);
                        setCustomFeedbackSide(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Lado intermedio c (AB):</span>
                      <span className="text-emerald-600 font-mono">{customSideC}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customSideC}
                      onChange={(e) => {
                        setCustomSideC(Math.max(1, Number(e.target.value) || 1));
                        setCustomFeedbackSide(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>
                </>
              )}

              {customCase === 'AAL' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Ángulo A (grados):</span>
                      <span className="text-rose-600 font-mono">{customAngleA}°</span>
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="150"
                      value={customAngleA}
                      onChange={(e) => {
                        setCustomAngleA(Math.min(160, Math.max(1, Number(e.target.value) || 1)));
                        setCustomFeedbackAngle(null);
                        setCustomFeedbackSide(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Ángulo B (grados):</span>
                      <span className="text-purple-600 font-mono">{customAngleB}°</span>
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="150"
                      value={customAngleB}
                      onChange={(e) => {
                        setCustomAngleB(Math.min(160, Math.max(1, Number(e.target.value) || 1)));
                        setCustomFeedbackAngle(null);
                        setCustomFeedbackSide(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Lado opuesto 'a' (BC):</span>
                      <span className="text-emerald-600 font-mono">{customSideA}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customSideA}
                      onChange={(e) => {
                        setCustomSideA(Math.max(1, Number(e.target.value) || 1));
                        setCustomFeedbackSide(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>
                </>
              )}

              {customCase === 'LLA' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Lado opuesto 'a' (BC):</span>
                      <span className="text-rose-600 font-mono">{customSideA}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customSideA}
                      onChange={(e) => {
                        setCustomSideA(Math.max(1, Number(e.target.value) || 1));
                        setCustomFeedbackSide(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Lado adyacente 'b' (AC):</span>
                      <span className="text-purple-600 font-mono">{customSideB}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customSideB}
                      onChange={(e) => {
                        setCustomSideB(Math.max(1, Number(e.target.value) || 1));
                        setCustomFeedbackSide(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Ángulo A (grados):</span>
                      <span className="text-emerald-600 font-mono">{customAngleA}°</span>
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="150"
                      value={customAngleA}
                      onChange={(e) => {
                        setCustomAngleA(Math.min(160, Math.max(1, Number(e.target.value) || 1)));
                        setCustomFeedbackAngle(null);
                        setCustomFeedbackSide(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Visual Triangle Representation and Interactive Process */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SVG Triangle with User's Data */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl border-2 border-indigo-500/40 text-white space-y-4 shadow-xl flex flex-col items-center">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30">
                Paso 2: Triángulo con tus Datos
              </span>

              <div className="w-full bg-slate-950/80 p-4 rounded-2xl border border-indigo-400/30 flex items-center justify-center">
                <svg viewBox="0 0 340 220" className="w-full max-w-sm h-auto select-none drop-shadow-md">
                  {/* Triangle points scaled */}
                  {(() => {
                    const ax = 45;
                    const ay = 180;
                    const bx = 295;
                    const by = 180;
                    // Angle A at A(45, 180), Angle B at B(295, 180)
                    const angleRadA = (customAngleA * Math.PI) / 180;
                    const angleRadB = ((customCase === 'LLA' ? (customCalculatedAngleB || 45) : customAngleB) * Math.PI) / 180;
                    // Calculate C vertex
                    const tanA = Math.tan(angleRadA);
                    const tanB = Math.tan(angleRadB);
                    let cx = 170;
                    let cy = 40;
                    if (tanA + tanB > 0 && (customAngleA + (customCase === 'LLA' ? customCalculatedAngleB : customAngleB) < 180)) {
                      cx = (ax * tanA + bx * tanB) / (tanA + tanB);
                      cy = ay - (bx - ax) * ((tanA * tanB) / (tanA + tanB));
                      cy = Math.max(30, Math.min(150, cy));
                    }

                    return (
                      <>
                        {/* Triangle Polygon */}
                        <polygon
                          points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
                          fill="#4f46e5"
                          fillOpacity="0.2"
                          stroke="#818cf8"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                        />

                        {/* Angle Arc A */}
                        <circle cx={ax} cy={ay} r="6" fill="#f43f5e" />
                        <text x={ax - 15} y={ay + 5} className="text-xs font-black fill-white">A</text>
                        <text x={ax + 20} y={ay - 10} className="text-[11px] font-bold fill-rose-300">{customAngleA}°</text>

                        {/* Angle Arc B */}
                        <circle cx={bx} cy={by} r="6" fill="#a855f7" />
                        <text x={bx + 10} y={by + 5} className="text-xs font-black fill-white">B</text>
                        <text x={bx - 40} y={by - 10} className="text-[11px] font-bold fill-purple-300">
                          {customCase === 'LLA'
                            ? (customFeedbackAngle?.ok ? `${customCalculatedAngleB}°` : 'B = ?')
                            : `${customAngleB}°`}
                        </text>

                        {/* Vertex C */}
                        <circle cx={cx} cy={cy} r="6" fill="#10b981" />
                        <text x={cx} y={cy - 12} textAnchor="middle" className="text-xs font-black fill-white">C</text>
                        <text x={cx} y={cy + 20} textAnchor="middle" className="text-[11px] font-bold fill-emerald-300">
                          {customCase === 'ALA' || customCase === 'AAL'
                            ? (customFeedbackAngle?.ok ? `${customCalculatedAngleC}°` : 'C = ?')
                            : (customFeedbackAngle?.ok ? `${customCalculatedAngleC}°` : 'C = ?')}
                        </text>

                        {/* Side c (AB) */}
                        <text x={(ax + bx) / 2} y={ay + 20} textAnchor="middle" className="text-xs font-bold fill-slate-300">
                          {customCase === 'ALA'
                            ? `c = ${customSideC}`
                            : (customCase === 'AAL'
                              ? (customFeedbackSide?.ok ? `c ≈ ${customSideC_calc}` : 'c = ?')
                              : (customFeedbackSide?.ok ? `c ≈ ${customSideC_calc}` : 'c = ?'))}
                        </text>

                        {/* Side a (BC) */}
                        <text x={(bx + cx) / 2 + 15} y={(by + cy) / 2} className="text-xs font-bold fill-rose-400">
                          {customCase === 'ALA'
                            ? (customFeedbackSide?.ok ? `a = ${customSideA_calc}` : 'a = ?')
                            : `a = ${customSideA}`}
                        </text>

                        {/* Side b (AC) */}
                        <text x={(ax + cx) / 2 - 25} y={(ay + cy) / 2} className="text-xs font-bold fill-purple-400">
                          {customCase === 'LLA'
                            ? `b = ${customSideB}`
                            : (customCase === 'AAL' ? (customFeedbackSide?.ok ? `b = ${customSideB_calc}` : 'b = ?') : `b = ?`)}
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="w-full text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-indigo-400/20">
                <span className="font-bold text-indigo-300">Resumen de Datos Ingresados:</span>
                <ul className="mt-1 space-y-0.5 font-mono text-[11px]">
                  {customCase === 'ALA' && (
                    <>
                      <li>• Ángulo A = {customAngleA}°</li>
                      <li>• Ángulo B = {customAngleB}°</li>
                      <li>• Lado c (intermedio) = {customSideC}</li>
                    </>
                  )}
                  {customCase === 'AAL' && (
                    <>
                      <li>• Ángulo A = {customAngleA}°</li>
                      <li>• Ángulo B = {customAngleB}°</li>
                      <li>• Lado a (opuesto a A) = {customSideA}</li>
                    </>
                  )}
                  {customCase === 'LLA' && (
                    <>
                      <li>• Lado a = {customSideA}</li>
                      <li>• Lado b = {customSideB}</li>
                      <li>• Ángulo A = {customAngleA}°</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Interactive Process with Student Inputs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 3: Student completes intermediate step */}
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
                <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Paso 3: Proceso Interactivo del Estudiante
                </span>

                <div className="space-y-4">
                  {/* Step A: Finding the angle */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-slate-800">
                          {customCase === 'LLA'
                            ? `Paso A: Aplica la Ley del Seno para hallar el ángulo B opuesto al lado b:`
                            : `Paso A: Encuentra el tercer ángulo 'C' sabiendo que los ángulos internos suman 180°:`}
                        </p>
                        <p className="text-xs font-mono text-slate-600 mt-0.5">
                          {customCase === 'LLA'
                            ? `Fórmula: sin(B) = (b · sin(A)) / a = (${customSideB} · sin(${customAngleA}°)) / ${customSideA}`
                            : `Fórmula: C = 180° - A - B = 180° - ${customAngleA}° - ${customAngleB}°`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="number"
                        step="0.1"
                        placeholder={customCase === 'LLA' ? "Tu respuesta para B (°)" : "Tu respuesta para C (°)"}
                        value={studentThirdAngle}
                        onChange={(e) => setStudentThirdAngle(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border-2 border-amber-300 font-bold font-mono text-sm bg-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={handleVerifyCustomAngle}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider transition-colors shadow"
                      >
                        {customCase === 'LLA' ? 'Verificar Ángulo B' : 'Verificar Ángulo C'}
                      </button>
                    </div>

                    {customFeedbackAngle && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        customFeedbackAngle.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {customFeedbackAngle.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span>{customFeedbackAngle.msg}</span>
                      </div>
                    )}
                  </div>

                  {/* Step B: Side Calculation */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                    <div className="flex items-start gap-2">
                      <Calculator size={18} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-slate-800">
                          {customCase === 'ALA' && `Paso B: Aplica la Ley del Seno para hallar el lado 'a':`}
                          {customCase === 'AAL' && `Paso B: Aplica la Ley del Seno para hallar el lado 'b':`}
                          {customCase === 'LLA' && `Paso B: Halla el lado restante 'c' usando C = 180° - A - B:`}
                        </p>
                        <p className="text-xs font-mono text-slate-600 mt-0.5">
                          {customCase === 'ALA' && `a = (c · sin(A)) / sin(C) = (${customSideC} · sin(${customAngleA}°)) / sin(${customCalculatedAngleC}°)`}
                          {customCase === 'AAL' && `b = (a · sin(B)) / sin(A) = (${customSideA} · sin(${customAngleB}°)) / sin(${customAngleA}°)`}
                          {customCase === 'LLA' && `c = (a · sin(C)) / sin(A) = (${customSideA} · sin(${customCalculatedAngleC}°)) / sin(${customAngleA}°)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Tu valor calculado (ej. 10.45)"
                        value={studentCalculatedSide}
                        onChange={(e) => setStudentCalculatedSide(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border-2 border-blue-300 font-bold font-mono text-sm bg-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleVerifyCustomSide}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-colors shadow"
                      >
                        Verificar Lado
                      </button>
                    </div>

                    {customFeedbackSide && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        customFeedbackSide.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {customFeedbackSide.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span>{customFeedbackSide.msg}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 4: Step-by-Step Formal Process & Final Conclusion */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl border-2 border-indigo-500/40 shadow-xl space-y-4">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  Paso 4: Conclusión y Solución Completa
                </span>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <span className="text-amber-400 font-black">1. Relación de la Ley del Seno:</span>
                    <p className="text-slate-300">
                      a / sin({customAngleA}°) = b / sin({customCase === 'LLA' ? customCalculatedAngleB : customAngleB}°) = c / sin({customCalculatedAngleC}°)
                    </p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <span className="text-cyan-400 font-black">2. Resultados Obtenidos del Triángulo:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Ángulo A</span>
                        <span className="text-sm font-black text-rose-300">{customAngleA}°</span>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Ángulo B</span>
                        <span className="text-sm font-black text-purple-300">
                          {customCase === 'LLA' ? `${customCalculatedAngleB}°` : `${customAngleB}°`}
                        </span>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Ángulo C</span>
                        <span className="text-sm font-black text-emerald-300">{customCalculatedAngleC}°</span>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Lado a</span>
                        <span className="text-sm font-black text-rose-300">{customCase === 'ALA' ? customSideA_calc : customSideA}</span>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Lado b</span>
                        <span className="text-sm font-black text-purple-300">
                          {customCase === 'AAL' ? customSideB_calc : customSideB}
                        </span>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Lado c</span>
                        <span className="text-sm font-black text-emerald-300">{customCase === 'ALA' ? customSideC : customSideC_calc}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-950/70 rounded-xl border border-emerald-500/40 text-emerald-200">
                    <span className="font-black text-emerald-400 block mb-1">💡 Conclusión Geométrica:</span>
                    {customCase === 'ALA' && (
                      <p className="font-sans leading-relaxed text-xs">
                        Conocidos dos ángulos ({customAngleA}° y {customAngleB}°) y el lado intermedio (c = {customSideC}), se determina unívocamente el triángulo. El tercer ángulo es de {customCalculatedAngleC}° y el lado buscado 'a' mide exactamente {customSideA_calc} unidades.
                      </p>
                    )}
                    {customCase === 'AAL' && (
                      <p className="font-sans leading-relaxed text-xs">
                        Al conocer los ángulos {customAngleA}° y {customAngleB}° junto al lado opuesto 'a' = {customSideA}, la proporción de la Ley del Seno permite calcular inmediatamente los lados restantes: b ≈ {customSideB_calc} y c ≈ {customSideC_calc}.
                      </p>
                    )}
                    {customCase === 'LLA' && (
                      <p className="font-sans leading-relaxed text-xs">
                        {customLlaPossible
                          ? `Para los lados a = ${customSideA} y b = ${customSideB} con ángulo opuesto A = ${customAngleA}°, la Ley del Seno determina que el ángulo B mide ${customCalculatedAngleB}°, el ángulo C es de ${customCalculatedAngleC}° y el lado restante c mide aproximadamente ${customSideC_calc} unidades.`
                          : `Con los valores ingresados (a = ${customSideA}, b = ${customSideB}, A = ${customAngleA}°), sin(B) > 1, lo cual es geométricamente imposible (el lado 'a' no alcanza a cerrar el triángulo).`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}

      {/* Completion Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <Award size={36} className="text-amber-300 shrink-0" />
          <div>
            <h4 className="font-black text-lg">¡Dominas la Ley del Seno y sus Proporciones!</h4>
            <p className="text-xs text-blue-100">Continúa tu viaje por la trigonometría universal.</p>
          </div>
        </div>
        <button
          onClick={onFinish || onBack}
          className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
        >
          Volver al Menú
        </button>
      </div>

    </div>
  );
};
