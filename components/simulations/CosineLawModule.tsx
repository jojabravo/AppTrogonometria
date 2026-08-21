import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  PlaneTakeoff, 
  Radio, 
  Radar, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
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
  Edit3,
  Lightbulb
} from 'lucide-react';
import { MathFormula } from '../MathFormula';
import { Teacher } from '../Teacher';

interface CosineLawModuleProps {
  onBack: () => void;
  onFinish: () => void;
}

type TabType = 'concept' | 'lab' | 'exercises' | 'radar-game' | 'arcade-game' | 'custom-solver';

export const CosineLawModule: React.FC<CosineLawModuleProps> = ({ onBack, onFinish }) => {
  const [activeTab, setActiveTab] = useState<TabType>('concept');
  const [conceptFormulaMode, setConceptFormulaMode] = useState<'sides' | 'angles' | 'all'>('sides');
  const [highlightedPair, setHighlightedPair] = useState<'C' | 'A' | 'B'>('C');

  // --- LAB STATE (Acordeón de Pitágoras) ---
  const [labSideA, setLabSideA] = useState<number>(6);
  const [labSideB, setLabSideB] = useState<number>(8);
  const [labAngleC, setLabAngleC] = useState<number>(60); // en grados

  // Calculations for Lab
  const angleRad = (labAngleC * Math.PI) / 180;
  const cosVal = Math.cos(angleRad);
  const a2 = labSideA * labSideA;
  const b2 = labSideB * labSideB;
  const term2abCos = 2 * labSideA * labSideB * cosVal;
  const c2 = a2 + b2 - term2abCos;
  const sideC = Math.sqrt(Math.max(0.0001, c2));

  // --- EXERCISES STATE ---
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [stepErrors, setStepErrors] = useState<{ [key: string]: boolean }>({});
  const [stepSuccess, setStepSuccess] = useState<{ [key: string]: boolean }>({});
  const [showHint, setShowHint] = useState<boolean>(false);

  // --- RADAR GAME STATE ---
  const [radarA, setRadarA] = useState(12);
  const [radarB, setRadarB] = useState(16);
  const [radarAngle, setRadarAngle] = useState(60);
  const [radarInput, setRadarInput] = useState('');
  const [radarLaserFired, setRadarLaserFired] = useState(false);
  const [radarResult, setRadarResult] = useState<'idle' | 'hit' | 'miss'>('idle');
  const [radarScore, setRadarScore] = useState(0);
  const [radarRound, setRadarRound] = useState(1);

  // --- ARCADE GAME (¿Seno o Coseno?) STATE ---
  const [arcadeRound, setArcadeRound] = useState(0);
  const [arcadeScore, setArcadeScore] = useState(0);
  const [arcadeStreak, setArcadeStreak] = useState(0);
  const [arcadeFeedback, setArcadeFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [arcadeGameOver, setArcadeGameOver] = useState(false);

  // --- TAB 6: CUSTOM PROBLEM SOLVER (TALLER DE EJERCICIO PROPIO) ---
  const [customCase, setCustomCase] = useState<'LAL' | 'LLL'>('LAL');
  const [customSideA, setCustomSideA] = useState<number>(7);
  const [customSideB, setCustomSideB] = useState<number>(10);
  const [customAngleC, setCustomAngleC] = useState<number>(55);
  const [customSideC, setCustomSideC] = useState<number>(9);

  // Student intermediate inputs
  const [studentIntermediateVal, setStudentIntermediateVal] = useState<string>('');
  const [studentFinalVal, setStudentFinalVal] = useState<string>('');
  const [customFeedbackStep1, setCustomFeedbackStep1] = useState<{ ok: boolean; msg: string } | null>(null);
  const [customFeedbackFinal, setCustomFeedbackFinal] = useState<{ ok: boolean; msg: string } | null>(null);

  // Derived math for custom problem
  // LAL: sides a, b, angle C -> find side c
  const radC = (customAngleC * Math.PI) / 180;
  const a2_plus_b2 = customSideA * customSideA + customSideB * customSideB;
  const term_2abCosC = 2 * customSideA * customSideB * Math.cos(radC);
  const c2_calc = Math.max(0.01, a2_plus_b2 - term_2abCosC);
  const sideC_calc = parseFloat(Math.sqrt(c2_calc).toFixed(2));

  // LLL: sides a, b, c -> find angle C
  // cos(C) = (a^2 + b^2 - c^2) / (2ab)
  const num_cosC = (customSideA * customSideA + customSideB * customSideB - customSideC * customSideC);
  const den_cosC = (2 * customSideA * customSideB);
  const raw_cosC = den_cosC > 0 ? num_cosC / den_cosC : 0;
  const clamped_cosC = Math.max(-1, Math.min(1, raw_cosC));
  const angleC_deg_calc = parseFloat(((Math.acos(clamped_cosC) * 180) / Math.PI).toFixed(1));

  const handleVerifyStep1 = () => {
    const val = parseFloat(studentIntermediateVal);
    if (isNaN(val)) {
      setCustomFeedbackStep1({ ok: false, msg: "Por favor ingresa un número válido." });
      return;
    }
    if (customCase === 'LAL') {
      // Expected: a^2 + b^2
      const target = a2_plus_b2;
      if (Math.abs(val - target) <= 1) {
        setCustomFeedbackStep1({ ok: true, msg: `¡Correcto! a² + b² = ${target}.` });
      } else {
        setCustomFeedbackStep1({ ok: false, msg: `Calcula (${customSideA})² + (${customSideB})² = ${target}.` });
      }
    } else {
      // Expected: cos(C) decimal or numerator
      if (Math.abs(val - clamped_cosC) <= 0.05 || Math.abs(val - num_cosC) <= 1) {
        setCustomFeedbackStep1({ ok: true, msg: `¡Correcto! cos(C) ≈ ${clamped_cosC.toFixed(4)}.` });
      } else {
        setCustomFeedbackStep1({ ok: false, msg: `Valor esperado de cos(C) = (a² + b² - c²) / (2ab) ≈ ${clamped_cosC.toFixed(4)}.` });
      }
    }
  };

  const handleVerifyFinal = () => {
    const val = parseFloat(studentFinalVal);
    if (isNaN(val)) {
      setCustomFeedbackFinal({ ok: false, msg: "Por favor ingresa un número válido." });
      return;
    }
    if (customCase === 'LAL') {
      if (Math.abs(val - sideC_calc) <= 0.3) {
        setCustomFeedbackFinal({ ok: true, msg: `¡Excelente cálculo! El lado c mide exactamente ~${sideC_calc} unidades.` });
      } else {
        setCustomFeedbackFinal({ ok: false, msg: `Revisa la raíz cuadrada √(c²). Valor esperado: ~${sideC_calc}.` });
      }
    } else {
      if (Math.abs(val - angleC_deg_calc) <= 0.8) {
        setCustomFeedbackFinal({ ok: true, msg: `¡Excelente cálculo! El ángulo C mide exactamente ~${angleC_deg_calc}°.` });
      } else {
        setCustomFeedbackFinal({ ok: false, msg: `Revisa el arccos. Ángulo esperado: ~${angleC_deg_calc}°.` });
      }
    }
  };

  // List of real world applications
  const applications = [
    {
      icon: <PlaneTakeoff className="text-sky-500" size={32} />,
      title: "Aviación y Rumbos de Vuelo",
      desc: "Cuando un avión viaja con viento cruzado que desvía su trayectoria original, la Ley del Coseno permite calcular la velocidad resultante y la posición exacta sin requerir ángulos rectos."
    },
    {
      icon: <Compass className="text-emerald-500" size={32} />,
      title: "Topografía y Medición de Terrenos",
      desc: "Permite medir la distancia entre dos cerros o puntos separados por ríos o lagos infranqueables, colocando la estación de teodolito en un tercer punto accesible."
    },
    {
      icon: <Radio className="text-purple-500" size={32} />,
      title: "Redes Satelitales y Robótica",
      desc: "Los brazos robóticos y las constelaciones de satélites GPS usan la ley del coseno para calcular articulaciones angulares y triangular posiciones espaciales 3D."
    }
  ];

  // 5 Step-by-step Exercises
  const exerciseData = [
    {
      id: 1,
      tag: "Caso L-A-L Estándar",
      title: "Cálculo del Lado Desconocido (Ángulo Agudo)",
      story: "En un triángulo con lados a = 8 cm, b = 11 cm y ángulo comprendido C = 48°, deseamos hallar la longitud del lado c.",
      svg: (
        <svg viewBox="0 0 360 220" className="w-full max-w-xs mx-auto drop-shadow-md">
          <polygon points="40,180 300,180 180,50" fill="#f8fafc" stroke="#4f46e5" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 70,180 A 30 30 0 0 0 65,155" fill="none" stroke="#e11d48" strokeWidth="2.5" />
          <text x="75" y="165" className="text-xs font-bold fill-rose-600">48°</text>
          <text x="160" y="198" className="text-xs font-black fill-slate-700">b = 11 cm</text>
          <text x="85" y="105" className="text-xs font-black fill-slate-700">a = 8 cm</text>
          <text x="250" y="105" className="text-xs font-black fill-indigo-600">c = ?</text>
          <circle cx="40" cy="180" r="4" fill="#4f46e5" />
          <text x="25" y="195" className="text-xs font-bold fill-slate-500">C</text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Calcula la suma de los cuadrados de los lados conocidos (a² + b² = 8² + 11²).",
          hint: "8² = 64 y 11² = 121. Suma 64 + 121.",
          expected: ["185"],
          prefix: "a^2 + b^2 = "
        },
        {
          instruction: "Paso 2: Con cos(48°) ≈ 0.6691, calcula el término corrector 2 · a · b · cos(48°). (Redondea a 2 decimales)",
          hint: "2 * 8 * 11 * 0.6691 = 176 * 0.6691 ≈ 117.76",
          expected: ["117.76", "117.8", "117.7"],
          prefix: "2ab\\cos(48°) \\approx "
        },
        {
          instruction: "Paso 3: Resta: c² = 185 - 117.76. ¿Cuál es el valor de c²?",
          hint: "185 - 117.76 = 67.24",
          expected: ["67.24", "67.2"],
          prefix: "c^2 \\approx "
        },
        {
          instruction: "Paso 4: Extrae la raíz cuadrada para obtener el lado c = √67.24. (Aproxima a 1 o 2 decimales)",
          hint: "√67.24 ≈ 8.2",
          expected: ["8.2", "8.20", "8.19"],
          prefix: "c \\approx "
        }
      ]
    },
    {
      id: 2,
      tag: "Caso L-A-L con Ángulo Obtuso",
      title: "El Secreto del Coseno Negativo (C > 90°)",
      story: "Un dron vuela desde un punto central. Se aleja 5 km en una dirección y 9 km en otra con un ángulo de apertura C = 120°. ¡Cuidado con el signo de cos(120°)!",
      svg: (
        <svg viewBox="0 0 360 200" className="w-full max-w-xs mx-auto drop-shadow-md">
          <polygon points="120,160 320,160 30,70" fill="#fdf4ff" stroke="#9333ea" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 120,160 M 100,145 A 25 25 0 0 1 145,160" fill="none" stroke="#db2777" strokeWidth="2.5" />
          <text x="110" y="140" className="text-xs font-bold fill-pink-600">120°</text>
          <text x="210" y="180" className="text-xs font-black fill-slate-700">b = 9 km</text>
          <text x="55" y="110" className="text-xs font-black fill-slate-700">a = 5 km</text>
          <text x="190" y="100" className="text-xs font-black fill-purple-600">c = ?</text>
          <circle cx="120" cy="160" r="4" fill="#9333ea" />
        </svg>
      ),
      steps: [
        {
          instruction: "¿Cuál es el valor exacto de cos(120°)? Recuerda que en el 2° cuadrante el coseno es negativo.",
          hint: "cos(120°) = -cos(60°) = -0.5",
          expected: ["-0.5", "-1/2"],
          prefix: "\\cos(120°) = "
        },
        {
          instruction: "Calcula -2ab·cos(120°) = -2(5)(9)(-0.5). Al multiplicar menos por menos, ¿qué valor positivo obtienes?",
          hint: "-2 * 5 * 9 * (-0.5) = +45",
          expected: ["45", "+45"],
          prefix: "-2ab\\cos(120°) = "
        },
        {
          instruction: "Calcula c² = a² + b² - 2ab·cos(120°) = 5² + 9² + 45 = 25 + 81 + 45. ¿Cuánto da?",
          hint: "25 + 81 + 45 = 151",
          expected: ["151"],
          prefix: "c^2 = "
        },
        {
          instruction: "Obtén la distancia c = √151 en km. (Redondea a 1 o 2 decimales)",
          hint: "√151 ≈ 12.29 o 12.3",
          expected: ["12.3", "12.29", "12.28"],
          prefix: "c \\approx "
        }
      ]
    },
    {
      id: 3,
      tag: "Caso L-L-L (3 Lados Conocidos)",
      title: "Despejando un Ángulo Desconocido",
      story: "Una estructura triangular tiene lados de a = 7 m, b = 10 m y c = 13 m. Queremos hallar el ángulo mayor C opuesto al lado c.",
      svg: (
        <svg viewBox="0 0 360 200" className="w-full max-w-xs mx-auto drop-shadow-md">
          <polygon points="40,160 310,160 170,40" fill="#f0fdf4" stroke="#059669" strokeWidth="3" strokeLinejoin="round" />
          <text x="165" y="180" className="text-xs font-black fill-slate-700">c = 13 m</text>
          <text x="85" y="90" className="text-xs font-black fill-slate-700">a = 7 m</text>
          <text x="250" y="90" className="text-xs font-black fill-slate-700">b = 10 m</text>
          <text x="160" y="30" className="text-xs font-black fill-emerald-600">Ángulo C = ?</text>
        </svg>
      ),
      steps: [
        {
          instruction: "Usando el despeje cos(C) = (a² + b² - c²) / (2ab). Primero calcula el numerador: 7² + 10² - 13².",
          hint: "49 + 100 - 169 = 149 - 169 = -20",
          expected: ["-20"],
          prefix: "a^2 + b^2 - c^2 = "
        },
        {
          instruction: "Ahora calcula el denominador: 2 · a · b = 2 · 7 · 10.",
          hint: "2 * 7 * 10 = 140",
          expected: ["140"],
          prefix: "2ab = "
        },
        {
          instruction: "Calcula la fracción decimal cos(C) = -20 / 140. (Redondea a 4 decimales: ej. -0.1429)",
          hint: "-20/140 = -1/7 ≈ -0.1429",
          expected: ["-0.1429", "-0.143", "-0.14"],
          prefix: "\\cos(C) \\approx "
        },
        {
          instruction: "Calcula C = arccos(-0.1429) en grados. (Aproxima al entero o 1 decimal, ej. 98.2°)",
          hint: "arccos(-0.1429) ≈ 98.2°",
          expected: ["98.2", "98.21", "98", "98.19"],
          prefix: "C \\approx "
        }
      ]
    },
    {
      id: 4,
      tag: "Aplicación: Topografía",
      title: "El Puente sobre el Lago Inaccesible",
      story: "Un equipo de ingenieros debe construir un puente entre los puntos A y B a través de un lago. Desde un mirador C, miden CA = 120 m, CB = 150 m y el ángulo ACB = 65°.",
      svg: (
        <svg viewBox="0 0 360 210" className="w-full max-w-xs mx-auto drop-shadow-md">
          {/* Lake shape */}
          <path d="M 80,120 Q 180,80 270,130 Q 220,180 80,120 Z" fill="#cffafe" opacity="0.6" />
          <polygon points="50,150 290,150 160,40" fill="none" stroke="#0891b2" strokeWidth="2.5" strokeDasharray="4 4" />
          <line x1="50" y1="150" x2="290" y2="150" stroke="#f59e0b" strokeWidth="4" />
          <text x="145" y="165" className="text-xs font-black fill-amber-600">Puente (c = ?)</text>
          <text x="80" y="85" className="text-xs font-black fill-slate-700">120 m</text>
          <text x="240" y="85" className="text-xs font-black fill-slate-700">150 m</text>
          <text x="155" y="32" className="text-xs font-black fill-cyan-700">Mirador C (65°)</text>
        </svg>
      ),
      steps: [
        {
          instruction: "Calcula a² + b² = 120² + 150² (en m²).",
          hint: "14400 + 22500 = 36900",
          expected: ["36900"],
          prefix: "120^2 + 150^2 = "
        },
        {
          instruction: "Con cos(65°) ≈ 0.4226, calcula 2 · 120 · 150 · cos(65°). (Redondea a 1 decimal)",
          hint: "2 * 120 * 150 * 0.4226 = 36000 * 0.4226 ≈ 15213.6",
          expected: ["15213.6", "15214", "15213"],
          prefix: "2ab\\cos(65°) \\approx "
        },
        {
          instruction: "Calcula c² = 36900 - 15213.6 = 21686.4. ¿Cuál es la longitud del puente c = √21686.4 en metros? (Aproxima a 1 decimal)",
          hint: "√21686.4 ≈ 147.3 m",
          expected: ["147.3", "147.26", "147"],
          prefix: "c \\approx "
        }
      ]
    },
    {
      id: 5,
      tag: "Aplicación: Navegación Marítima",
      title: "Rumbos Divergentes en Alta Mar",
      story: "Dos barcos zarpan del mismo muelle al mismo tiempo. El Barco A navega 40 millas náuticas y el Barco B navega 60 millas náuticas. Sus trayectorias forman un ángulo de 80°. ¿A qué distancia están uno del otro?",
      svg: (
        <svg viewBox="0 0 360 210" className="w-full max-w-xs mx-auto drop-shadow-md">
          <polygon points="50,170 190,50 310,160" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.5" />
          <path d="M 50,170 M 80,150 A 40 40 0 0 1 75,170" fill="none" stroke="#dc2626" strokeWidth="2" />
          <text x="75" y="155" className="text-xs font-bold fill-red-600">80°</text>
          <text x="90" y="100" className="text-xs font-black fill-slate-700">40 mn</text>
          <text x="170" y="185" className="text-xs font-black fill-slate-700">60 mn</text>
          <text x="260" y="95" className="text-xs font-black fill-blue-600">d = ?</text>
          <circle cx="50" cy="170" r="5" fill="#2563eb" />
          <text x="30" y="188" className="text-xs font-black fill-slate-700">Muelle</text>
        </svg>
      ),
      steps: [
        {
          instruction: "Plantea d² = 40² + 60² - 2(40)(60)·cos(80°). Primero calcula 40² + 60².",
          hint: "1600 + 3600 = 5200",
          expected: ["5200"],
          prefix: "40^2 + 60^2 = "
        },
        {
          instruction: "Sabiendo que cos(80°) ≈ 0.1736, calcula 2(40)(60)(0.1736) = 4800 · 0.1736.",
          hint: "4800 * 0.1736 ≈ 833.3",
          expected: ["833.3", "833.28", "833"],
          prefix: "2(40)(60)\\cos(80°) \\approx "
        },
        {
          instruction: "Resta: d² = 5200 - 833.3 = 4366.7. ¿Cuál es la distancia final d = √4366.7 en millas? (Aproxima a 1 decimal)",
          hint: "√4366.7 ≈ 66.1 millas",
          expected: ["66.1", "66.08", "66"],
          prefix: "d \\approx "
        }
      ]
    }
  ];

  // Arcade Questions
  const arcadeCards = [
    {
      caseType: "L - A - L",
      data: "Lado a = 10, Lado b = 14, Ángulo C = 50° (comprendido entre ellos)",
      target: "Hallar lado c",
      correct: "coseno",
      explanation: "¡Correcto! Tienes dos lados y el ángulo entre ellos (LAL), el caso clásico de la Ley del Coseno."
    },
    {
      caseType: "A - A - L",
      data: "Ángulo A = 40°, Ángulo B = 75°, Lado a = 12",
      target: "Hallar lado b",
      correct: "seno",
      explanation: "¡Correcto! Tienes una pareja ángulo-lado opuesto conocida (A y a), se resuelve directamente con la Ley del Seno."
    },
    {
      caseType: "L - L - L",
      data: "Lado a = 7, Lado b = 9, Lado c = 12",
      target: "Hallar el ángulo B",
      correct: "coseno",
      explanation: "¡Exacto! Cuando se conocen los 3 lados sin ningún ángulo (LLL), la única vía directa es la Ley del Coseno."
    },
    {
      caseType: "A - L - A",
      data: "Ángulo A = 35°, Lado c = 20, Ángulo B = 65°",
      target: "Hallar lado a",
      correct: "seno",
      explanation: "¡Bien! Calculas el 3er ángulo (C = 180 - 35 - 65 = 80°) y aplicas la Ley del Seno con la pareja (c, C)."
    },
    {
      caseType: "Triángulo Rectángulo",
      data: "Ángulo C = 90°, Lado a = 3, Lado b = 4",
      target: "Hallar hipotenusa c",
      correct: "coseno",
      explanation: "¡Genial! Aunque es Pitágoras, Pitágoras es simplemente la Ley del Coseno cuando cos(90°) = 0."
    },
    {
      caseType: "L - L - A (No comprendido)",
      data: "Lado a = 15, Lado b = 10, Ángulo A = 45°",
      target: "Hallar ángulo B",
      correct: "seno",
      explanation: "¡Correcto! Tienes la pareja (a, A) y el lado b, aplicas sen(B)/b = sen(A)/a (Ley del Seno)."
    }
  ];

  // Helper validation for exercise steps
  const handleValidateStep = (stepIdx: number) => {
    const key = `${currentExercise}-${stepIdx}`;
    const userVal = (userInputs[key] || '').trim().replace(',', '.');
    const currentEx = exerciseData[currentExercise];
    const currentStepObj = currentEx.steps[stepIdx];

    const isMatch = currentStepObj.expected.some(exp => {
      if (userVal === exp) return true;
      const numUser = parseFloat(userVal);
      const numExp = parseFloat(exp);
      if (!isNaN(numUser) && !isNaN(numExp)) {
        return Math.abs(numUser - numExp) < 0.25;
      }
      return false;
    });

    if (isMatch) {
      setStepSuccess(prev => ({ ...prev, [key]: true }));
      setStepErrors(prev => ({ ...prev, [key]: false }));
      setShowHint(false);
      if (stepIdx < currentEx.steps.length - 1) {
        setCurrentStep(stepIdx + 1);
      }
    } else {
      setStepErrors(prev => ({ ...prev, [key]: true }));
    }
  };

  // Radar Game Handler
  const handleRadarFire = () => {
    const angleR = (radarAngle * Math.PI) / 180;
    const exactDist = Math.sqrt(radarA * radarA + radarB * radarB - 2 * radarA * radarB * Math.cos(angleR));
    const userVal = parseFloat(radarInput.replace(',', '.'));

    setRadarLaserFired(true);

    if (!isNaN(userVal) && Math.abs(userVal - exactDist) < 1.0) {
      setRadarResult('hit');
      setRadarScore(prev => prev + 150);
    } else {
      setRadarResult('miss');
    }
  };

  const nextRadarRound = () => {
    const nextA = Math.floor(Math.random() * 10) + 8; // 8 to 18
    const nextB = Math.floor(Math.random() * 12) + 10; // 10 to 22
    const angles = [30, 45, 60, 90, 120, 135, 150];
    const nextAng = angles[Math.floor(Math.random() * angles.length)];

    setRadarA(nextA);
    setRadarB(nextB);
    setRadarAngle(nextAng);
    setRadarInput('');
    setRadarLaserFired(false);
    setRadarResult('idle');
    setRadarRound(prev => prev + 1);
  };

  // Arcade Game Handler
  const handleArcadeChoice = (choice: 'seno' | 'coseno') => {
    if (arcadeGameOver) return;
    const currentCard = arcadeCards[arcadeRound];
    const isCorrect = choice === currentCard.correct;

    if (isCorrect) {
      setArcadeScore(prev => prev + 100 + arcadeStreak * 20);
      setArcadeStreak(prev => prev + 1);
      setArcadeFeedback({ isCorrect: true, message: currentCard.explanation });
    } else {
      setArcadeStreak(0);
      setArcadeFeedback({ 
        isCorrect: false, 
        message: `¡Incorrecto! Para este caso corresponde la Ley del ${currentCard.correct === 'coseno' ? 'Coseno' : 'Seno'}. ${currentCard.explanation}` 
      });
    }
  };

  const handleNextArcade = () => {
    setArcadeFeedback(null);
    if (arcadeRound < arcadeCards.length - 1) {
      setArcadeRound(prev => prev + 1);
    } else {
      setArcadeGameOver(true);
    }
  };

  const resetArcade = () => {
    setArcadeRound(0);
    setArcadeScore(0);
    setArcadeStreak(0);
    setArcadeFeedback(null);
    setArcadeGameOver(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Navigation tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-2xl md:rounded-[2rem] border-2 border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'concept'
              ? 'bg-indigo-600 text-white shadow-lg scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={18} />
          <span>1. Concepto &amp; Vida Real</span>
        </button>

        <button
          onClick={() => setActiveTab('lab')}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'lab'
              ? 'bg-indigo-600 text-white shadow-lg scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders size={18} />
          <span>2. Acordeón de Pitágoras</span>
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'exercises'
              ? 'bg-indigo-600 text-white shadow-lg scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator size={18} />
          <span>3. Ejercicios Guiados (5)</span>
        </button>

        <button
          onClick={() => setActiveTab('radar-game')}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'radar-game'
              ? 'bg-cyan-600 text-white shadow-lg scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radar size={18} />
          <span>4. Misión Radar LAL</span>
        </button>

        <button
          onClick={() => setActiveTab('arcade-game')}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'arcade-game'
              ? 'bg-purple-600 text-white shadow-lg scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gamepad2 size={18} />
          <span>5. Arcade: ¿Seno o Coseno?</span>
        </button>

        <button
          onClick={() => setActiveTab('custom-solver')}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'custom-solver'
              ? 'bg-rose-600 text-white shadow-lg scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Edit3 size={18} />
          <span>6. Crea tu Ejercicio</span>
        </button>
      </div>

      {/* TAB 1: CONCEPT & REAL LIFE */}
      {activeTab === 'concept' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Observa el triángulo de referencia! La clave de la Ley del Coseno es la relación entre un ángulo y su lado opuesto, tanto para hallar lados como para despejar ángulos." />

          {/* Master Reference Card: Triangle Drawing + Formulas */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 md:p-10 rounded-3xl shadow-2xl border-4 border-indigo-500/40 relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-500/30 pb-6 relative z-10">
              <div>
                <span className="bg-indigo-500/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-indigo-400/30 inline-block mb-2">
                  Teorema Fundamental &amp; Fórmulas
                </span>
                <h3 className="text-2xl md:text-4xl font-black tracking-tight">
                  La Ley del Coseno
                </h3>
                <p className="text-slate-300 text-sm md:text-base mt-1">
                  Relaciona los 3 lados (<MathFormula formula="a, b, c" />) y sus ángulos opuestos (<MathFormula formula="A, B, C" />).
                </p>
              </div>

              {/* Angle/Side Pair Selector for Interactive Learning */}
              <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-indigo-400/30">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">
                  Enfocar Pareja:
                </span>
                {(['C', 'A', 'B'] as const).map((pair) => (
                  <button
                    key={pair}
                    onClick={() => setHighlightedPair(pair)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                      highlightedPair === pair
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md scale-105'
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
              <div className="lg:col-span-5 bg-slate-900/90 p-5 md:p-6 rounded-3xl border-2 border-indigo-400/40 shadow-inner flex flex-col items-center justify-center relative">
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
                    <linearGradient id="triFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.08" />
                    </linearGradient>
                  </defs>

                  {/* Vertices coordinates: C(175, 40), A(45, 205), B(315, 205) */}
                  {/* Triangle Polygon */}
                  <polygon
                    points="45,205 315,205 175,40"
                    fill="url(#triFillGrad)"
                    stroke="#818cf8"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />

                  {/* Visual correspondence dashed highlight from highlighted angle to opposite side */}
                  {highlightedPair === 'C' && (
                    <line x1="175" y1="40" x2="180" y2="205" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
                  )}
                  {highlightedPair === 'A' && (
                    <line x1="45" y1="205" x2="245" y2="122" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
                  )}
                  {highlightedPair === 'B' && (
                    <line x1="315" y1="205" x2="110" y2="122" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
                  )}

                  {/* Angle Arc at Vertex C (Top) */}
                  <path
                    d="M 152,65 A 35 35 0 0 0 198,65"
                    fill="none"
                    stroke={highlightedPair === 'C' ? "#f43f5e" : "#f59e0b"}
                    strokeWidth={highlightedPair === 'C' ? "4" : "2.5"}
                  />
                  <text x="175" y="82" textAnchor="middle" className={`text-xs font-black ${highlightedPair === 'C' ? 'fill-rose-400' : 'fill-amber-300'}`}>
                    C (γ)
                  </text>

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

                  {/* Side a (Opposite to Vertex A, between C and B) */}
                  <line 
                    x1="175" y1="40" x2="315" y2="205" 
                    stroke={highlightedPair === 'A' ? "#38bdf8" : "#94a3b8"} 
                    strokeWidth={highlightedPair === 'A' ? "4.5" : "3"} 
                  />
                  <rect x="252" y="110" width="34" height="24" rx="6" fill="#0f172a" stroke={highlightedPair === 'A' ? "#38bdf8" : "#475569"} strokeWidth="1.5" />
                  <text x="269" y="126" textAnchor="middle" className={`text-xs font-black ${highlightedPair === 'A' ? 'fill-cyan-300' : 'fill-slate-200'}`}>
                    a
                  </text>

                  {/* Side b (Opposite to Vertex B, between C and A) */}
                  <line 
                    x1="175" y1="40" x2="45" y2="205" 
                    stroke={highlightedPair === 'B' ? "#c084fc" : "#94a3b8"} 
                    strokeWidth={highlightedPair === 'B' ? "4.5" : "3"} 
                  />
                  <rect x="74" y="110" width="34" height="24" rx="6" fill="#0f172a" stroke={highlightedPair === 'B' ? "#c084fc" : "#475569"} strokeWidth="1.5" />
                  <text x="91" y="126" textAnchor="middle" className={`text-xs font-black ${highlightedPair === 'B' ? 'fill-purple-300' : 'fill-slate-200'}`}>
                    b
                  </text>

                  {/* Side c (Opposite to Vertex C, Base between A and B) */}
                  <line 
                    x1="45" y1="205" x2="315" y2="205" 
                    stroke={highlightedPair === 'C' ? "#f43f5e" : "#f59e0b"} 
                    strokeWidth={highlightedPair === 'C' ? "5" : "3"} 
                  />
                  <rect x="163" y="215" width="34" height="24" rx="6" fill="#0f172a" stroke={highlightedPair === 'C' ? "#f43f5e" : "#f59e0b"} strokeWidth="1.5" />
                  <text x="180" y="231" textAnchor="middle" className={`text-xs font-black ${highlightedPair === 'C' ? 'fill-rose-400' : 'fill-amber-300'}`}>
                    c
                  </text>

                  {/* Vertices Points with Labels */}
                  {/* Vertex C */}
                  <circle cx="175" cy="40" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="175" y="24" textAnchor="middle" className="text-sm font-black fill-amber-300">C</text>

                  {/* Vertex A */}
                  <circle cx="45" cy="205" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <text x="25" y="218" className="text-sm font-black fill-cyan-300">A</text>

                  {/* Vertex B */}
                  <circle cx="315" cy="205" r="7" fill="#c084fc" stroke="#ffffff" strokeWidth="2" />
                  <text x="328" y="218" className="text-sm font-black fill-purple-300">B</text>
                </svg>

                {/* Direct correlation reminder pill */}
                <div className="mt-3 bg-black/60 px-3 py-1.5 rounded-xl border border-indigo-400/30 text-[11px] text-center text-slate-300">
                  {highlightedPair === 'C' && (
                    <span>El lado <strong className="text-rose-400">c</strong> está al frente del ángulo <strong className="text-amber-300">C</strong></span>
                  )}
                  {highlightedPair === 'A' && (
                    <span>El lado <strong className="text-cyan-300">a</strong> está al frente del ángulo <strong className="text-cyan-400">A</strong></span>
                  )}
                  {highlightedPair === 'B' && (
                    <span>El lado <strong className="text-purple-300">b</strong> está al frente del ángulo <strong className="text-purple-400">B</strong></span>
                  )}
                </div>
              </div>

              {/* RIGHT: Formula Cards & Tab Mode Switcher */}
              <div className="lg:col-span-7 space-y-4">
                {/* View Mode Buttons */}
                <div className="flex flex-wrap items-center gap-2 bg-black/50 p-1.5 rounded-2xl border border-indigo-400/30">
                  <button
                    onClick={() => setConceptFormulaMode('sides')}
                    className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-black text-xs transition-all text-center ${
                      conceptFormulaMode === 'sides'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    1. Para Hallar Lados (LAL)
                  </button>
                  <button
                    onClick={() => setConceptFormulaMode('angles')}
                    className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-black text-xs transition-all text-center ${
                      conceptFormulaMode === 'angles'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    2. Para Hallar Ángulos (LLL)
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

                {/* FORMULA VIEW: SIDES (LAL) */}
                {(conceptFormulaMode === 'sides' || conceptFormulaMode === 'all') && (
                  <div className="bg-slate-900/90 p-5 rounded-2xl border-2 border-indigo-400/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-indigo-400" /> Forma 1: Calcular Lado Desconocido (Caso L-A-L)
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded-md">
                        2 lados + ángulo comprendido
                      </span>
                    </div>

                    {/* Active highlighted formula */}
                    <div className="bg-black/50 p-4 rounded-xl border border-indigo-500/40 text-center space-y-2">
                      {highlightedPair === 'C' && (
                        <>
                          <div className="text-base sm:text-xl font-bold text-rose-300">
                            <MathFormula formula="c^2 = a^2 + b^2 - 2ab\cos(C)" block={true} />
                          </div>
                          <div className="text-xs text-slate-300 pt-1 border-t border-slate-800">
                            <MathFormula formula="c = \sqrt{a^2 + b^2 - 2ab\cos(C)}" />
                          </div>
                        </>
                      )}
                      {highlightedPair === 'A' && (
                        <>
                          <div className="text-base sm:text-xl font-bold text-cyan-300">
                            <MathFormula formula="a^2 = b^2 + c^2 - 2bc\cos(A)" block={true} />
                          </div>
                          <div className="text-xs text-slate-300 pt-1 border-t border-slate-800">
                            <MathFormula formula="a = \sqrt{b^2 + c^2 - 2bc\cos(A)}" />
                          </div>
                        </>
                      )}
                      {highlightedPair === 'B' && (
                        <>
                          <div className="text-base sm:text-xl font-bold text-purple-300">
                            <MathFormula formula="b^2 = a^2 + c^2 - 2ac\cos(B)" block={true} />
                          </div>
                          <div className="text-xs text-slate-300 pt-1 border-t border-slate-800">
                            <MathFormula formula="b = \sqrt{a^2 + c^2 - 2ac\cos(B)}" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* FORMULA VIEW: ANGLES (LLL) */}
                {(conceptFormulaMode === 'angles' || conceptFormulaMode === 'all') && (
                  <div className="bg-slate-900/90 p-5 rounded-2xl border-2 border-purple-400/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                        <RotateCw size={14} className="text-purple-400" /> Forma 2: Despeje para Encontrar un Ángulo (Caso L-L-L)
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded-md">
                        3 lados conocidos
                      </span>
                    </div>

                    {/* Active highlighted angle formula */}
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-500/40 text-center space-y-2">
                      {highlightedPair === 'C' && (
                        <>
                          <div className="text-base sm:text-xl font-bold text-amber-300">
                            <MathFormula formula="\cos(C) = \frac{a^2 + b^2 - c^2}{2ab}" block={true} />
                          </div>
                          <div className="text-xs text-purple-200 pt-1 border-t border-slate-800">
                            <MathFormula formula="C = \arccos\left(\frac{a^2 + b^2 - c^2}{2ab}\right)" />
                          </div>
                        </>
                      )}
                      {highlightedPair === 'A' && (
                        <>
                          <div className="text-base sm:text-xl font-bold text-cyan-300">
                            <MathFormula formula="\cos(A) = \frac{b^2 + c^2 - a^2}{2bc}" block={true} />
                          </div>
                          <div className="text-xs text-cyan-200 pt-1 border-t border-slate-800">
                            <MathFormula formula="A = \arccos\left(\frac{b^2 + c^2 - a^2}{2bc}\right)" />
                          </div>
                        </>
                      )}
                      {highlightedPair === 'B' && (
                        <>
                          <div className="text-base sm:text-xl font-bold text-purple-300">
                            <MathFormula formula="\cos(B) = \frac{a^2 + c^2 - b^2}{2ac}" block={true} />
                          </div>
                          <div className="text-xs text-purple-200 pt-1 border-t border-slate-800">
                            <MathFormula formula="B = \arccos\left(\frac{a^2 + c^2 - b^2}{2ac}\right)" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Educational Mnemonic Tip Box */}
                <div className="bg-amber-500/15 border border-amber-400/40 p-3.5 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
                  <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Regla mnemotécnica visual:</strong> En el despeje del ángulo, el <em>único lado que resta en el numerador</em> (<MathFormula formula="- c^2" />) es siempre el <strong>lado opuesto</strong> al ángulo que buscas (<MathFormula formula="C" />). Los dos lados que suman son los adyacentes que forman dicho ángulo.
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Cases Visualizer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-indigo-500/20">
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span className="font-black text-cyan-300 text-xs uppercase tracking-wider">1. Caso L - A - L (Lado - Ángulo - Lado)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Conoces dos lados y el ángulo que está <em>encerrado entre ellos</em>. Usas la <strong>Forma 1</strong> para calcular la longitud del tercer lado.
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span className="font-black text-purple-300 text-xs uppercase tracking-wider">2. Caso L - L - L (Lado - Lado - Lado)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Conoces los 3 lados y no tienes ningún ángulo. Usas la <strong>Forma 2 (Despeje de Coseno)</strong> para encontrar cualquiera de los tres ángulos.
                </p>
              </div>
            </div>

          </div>

          {/* Real world cards */}
          <div>
            <h4 className="text-xl md:text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Compass className="text-indigo-600" /> Aplicaciones en Carreras &amp; Vida Diaria
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {applications.map((app, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-lg transition-shadow space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center shadow-inner">
                    {app.icon}
                  </div>
                  <h5 className="font-black text-lg text-slate-900">{app.title}</h5>
                  <p className="text-slate-600 text-sm leading-relaxed">{app.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action to proceed */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setActiveTab('lab')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-2xl text-base shadow-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
            >
              Explorar el Acordeón Interactivo <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* TAB 2: INTERACTIVE LAB (ACORDEÓN DE PITÁGORAS) */}
      {activeTab === 'lab' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="Mueve el ángulo C. Observa cómo al llegar exactamente a 90°, el término -2ab·cos(C) se extingue a CERO y renace el Teorema de Pitágoras." />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls & Math Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
                <h4 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Sliders size={20} className="text-indigo-600" /> Parámetros del Triángulo
                </h4>

                {/* Angle Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-700">Ángulo Comprendido (C):</span>
                    <span className={`px-3 py-1 rounded-xl text-sm font-black ${
                      labAngleC === 90 
                        ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400' 
                        : labAngleC > 90 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {labAngleC}° {labAngleC === 90 ? '(Rectángulo)' : labAngleC > 90 ? '(Obtuso)' : '(Agudo)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="165"
                    value={labAngleC}
                    onChange={(e) => setLabAngleC(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>15°</span>
                    <button 
                      onClick={() => setLabAngleC(90)}
                      className="text-emerald-700 underline font-black hover:text-emerald-800"
                    >
                      Fijar a 90° (Pitágoras)
                    </button>
                    <span>165°</span>
                  </div>
                </div>

                {/* Side A Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-700">Lado a:</span>
                    <span className="text-indigo-600 font-black">{labSideA} u</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={labSideA}
                    onChange={(e) => setLabSideA(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Side B Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-700">Lado b:</span>
                    <span className="text-indigo-600 font-black">{labSideB} u</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={labSideB}
                    onChange={(e) => setLabSideB(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              {/* Dynamic Math Inspector */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 font-mono text-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Desglose de Términos</span>
                  <span className="text-xs text-slate-400 font-sans">En tiempo real</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>a² + b² = {labSideA}² + {labSideB}²</span>
                    <span className="font-bold text-white">{a2 + b2}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>cos({labAngleC}°)</span>
                    <span className="font-bold text-cyan-300">{cosVal.toFixed(4)}</span>
                  </div>

                  <div className={`flex justify-between p-2 rounded-xl border ${
                    labAngleC === 90 
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                      : labAngleC > 90
                        ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                        : 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                  }`}>
                    <span>- 2ab·cos(C):</span>
                    <span className="font-black">
                      {term2abCos >= 0 ? `- ${term2abCos.toFixed(2)}` : `+ ${Math.abs(term2abCos).toFixed(2)}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-base">
                    <span className="text-indigo-400 font-black">c² =</span>
                    <span className="text-yellow-400 font-black">{c2.toFixed(2)}</span>
                  </div>

                  <div className="bg-indigo-600/30 p-3 rounded-2xl border border-indigo-400/40 flex justify-between items-center text-lg font-sans">
                    <span className="font-black text-indigo-200">Lado c = √c²</span>
                    <span className="font-black text-white text-xl">{sideC.toFixed(2)} u</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Geometric SVG Canvas */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center relative min-h-[380px]">
              <div className="absolute top-4 left-4 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" /> Geometría Euclidiana
              </div>

              {/* Dynamic SVG Triangle */}
              {(() => {
                // Coordinate origin at vertex C: (100, 240)
                const scale = 14;
                const ox = 90;
                const oy = 250;
                // Side b extends along the horizontal x-axis: (ox + b*scale, oy)
                const ax = ox + labSideB * scale;
                const ay = oy;
                // Side a rotates around C by angle labAngleC:
                const bx = ox + labSideA * scale * Math.cos(angleRad);
                const by = oy - labSideA * scale * Math.sin(angleRad);

                return (
                  <svg viewBox="0 0 380 300" className="w-full max-w-md h-auto select-none">
                    {/* Grid lines background */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Angle arc at C */}
                    <path
                      d={`M ${ox + 35} ${oy} A 35 35 0 0 0 ${ox + 35 * Math.cos(angleRad)} ${oy - 35 * Math.sin(angleRad)}`}
                      fill="none"
                      stroke={labAngleC === 90 ? "#10b981" : "#6366f1"}
                      strokeWidth="3"
                    />
                    <text
                      x={ox + 42 * Math.cos(angleRad / 2)}
                      y={oy - 42 * Math.sin(angleRad / 2)}
                      className="text-xs font-black fill-indigo-700"
                    >
                      {labAngleC}°
                    </text>

                    {/* Triangle Filled Area */}
                    <polygon
                      points={`${ox},${oy} ${ax},${ay} ${bx},${by}`}
                      fill={labAngleC === 90 ? "rgba(16, 185, 129, 0.12)" : "rgba(99, 102, 241, 0.12)"}
                      stroke={labAngleC === 90 ? "#10b981" : "#4f46e5"}
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />

                    {/* Side a */}
                    <text
                      x={(ox + bx) / 2 - 18}
                      y={(oy + by) / 2 - 8}
                      className="text-xs font-black fill-slate-700"
                    >
                      a = {labSideA}
                    </text>

                    {/* Side b */}
                    <text
                      x={(ox + ax) / 2}
                      y={oy + 22}
                      className="text-xs font-black fill-slate-700"
                    >
                      b = {labSideB}
                    </text>

                    {/* Side c (Hypotenuse / Opposite) */}
                    <text
                      x={(ax + bx) / 2 + 10}
                      y={(ay + by) / 2}
                      className="text-sm font-black fill-rose-600"
                    >
                      c = {sideC.toFixed(2)}
                    </text>

                    {/* Vertices */}
                    <circle cx={ox} cy={oy} r="6" fill="#4f46e5" />
                    <text x={ox - 18} y={oy + 6} className="text-xs font-black fill-slate-600">C</text>

                    <circle cx={ax} cy={ay} r="5" fill="#4f46e5" />
                    <text x={ax + 8} y={ay + 5} className="text-xs font-black fill-slate-600">A</text>

                    <circle cx={bx} cy={by} r="5" fill="#4f46e5" />
                    <text x={bx} y={by - 10} className="text-xs font-black fill-slate-600">B</text>
                  </svg>
                );
              })()}

              <p className="mt-4 text-xs font-bold text-slate-600 text-center max-w-sm">
                Al variar el ángulo <span className="text-indigo-600 font-bold">C</span>, el lado opuesto <span className="text-rose-600 font-bold">c</span> se expande o contrae siguiendo la curva del coseno.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: STEP-BY-STEP GUIDED EXERCISES */}
      {activeTab === 'exercises' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Exercise Selector Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {exerciseData.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => {
                  setCurrentExercise(idx);
                  setCurrentStep(0);
                  setShowHint(false);
                }}
                className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 ${
                  currentExercise === idx
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                Ejercicio {idx + 1}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Problem description & SVG */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-100">
                  {exerciseData[currentExercise].tag}
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-2">
                  {exerciseData[currentExercise].title}
                </h4>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {exerciseData[currentExercise].story}
                </p>
              </div>

              <div className="py-2">
                {exerciseData[currentExercise].svg}
              </div>
            </div>

            {/* Right Column: Step-by-Step Inputs */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h5 className="font-black text-slate-800 text-base md:text-lg flex items-center gap-2">
                  <CheckCircle2 className="text-indigo-600" size={20} />
                  Resolución Paso a Paso
                </h5>
                <span className="text-xs font-black text-slate-400">
                  Paso {currentStep + 1} de {exerciseData[currentExercise].steps.length}
                </span>
              </div>

              <div className="space-y-6">
                {exerciseData[currentExercise].steps.map((st, sIdx) => {
                  const key = `${currentExercise}-${sIdx}`;
                  const isDone = stepSuccess[key];
                  const hasErr = stepErrors[key];
                  const isUnlocked = sIdx <= currentStep;

                  return (
                    <div
                      key={sIdx}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : isUnlocked
                            ? 'bg-indigo-50/40 border-indigo-200 shadow-sm'
                            : 'bg-slate-50 border-slate-200 opacity-50 pointer-events-none'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                          isDone ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                        }`}>
                          {isDone ? '✓' : sIdx + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <p className="text-sm font-bold text-slate-800 leading-snug">
                            {st.instruction}
                          </p>

                          {/* Input Row */}
                          <div className="flex flex-wrap items-center gap-3">
                            {st.prefix && (
                              <div className="text-sm font-bold text-slate-600">
                                <MathFormula formula={st.prefix} />
                              </div>
                            )}
                            <input
                              type="text"
                              disabled={isDone}
                              value={userInputs[key] || ''}
                              onChange={(e) => setUserInputs(prev => ({ ...prev, [key]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleValidateStep(sIdx);
                              }}
                              placeholder="Escribe tu respuesta..."
                              className={`px-4 py-2 rounded-xl text-sm font-black border-2 outline-none w-48 transition-all ${
                                isDone
                                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                                  : hasErr
                                    ? 'border-red-400 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-300'
                                    : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                              }`}
                            />

                            {!isDone && (
                              <button
                                onClick={() => handleValidateStep(sIdx)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-transform active:scale-95"
                              >
                                Comprobar
                              </button>
                            )}

                            {isDone && (
                              <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                <CheckCircle2 size={14} /> ¡Correcto!
                              </span>
                            )}
                          </div>

                          {/* Error & Hint */}
                          {hasErr && !isDone && (
                            <div className="text-xs text-red-600 flex items-center gap-2 pt-1">
                              <AlertCircle size={14} />
                              <span>Valor incorrecto. ¿Necesitas una pista?</span>
                              <button
                                onClick={() => setShowHint(true)}
                                className="underline font-black text-indigo-600 hover:text-indigo-800"
                              >
                                Ver pista
                              </button>
                            </div>
                          )}

                          {showHint && !isDone && sIdx === currentStep && (
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800 font-medium">
                              💡 <strong>Pista:</strong> {st.hint}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion of current exercise */}
              {exerciseData[currentExercise].steps.every((_, i) => stepSuccess[`${currentExercise}-${i}`]) && (
                <div className="bg-emerald-100/80 border-2 border-emerald-400 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="text-emerald-600" size={28} />
                    <div>
                      <h6 className="font-black text-emerald-900 text-sm">¡Ejercicio Completado con Éxito!</h6>
                      <p className="text-xs text-emerald-700 font-bold">Has dominado cada paso de este cálculo.</p>
                    </div>
                  </div>
                  {currentExercise < exerciseData.length - 1 ? (
                    <button
                      onClick={() => {
                        setCurrentExercise(prev => prev + 1);
                        setCurrentStep(0);
                        setShowHint(false);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
                    >
                      Siguiente Ejercicio <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('radar-game')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
                    >
                      Ir a los Minijuegos <Gamepad2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: RADAR RESCUE GAME (LAL MISSION) */}
      {activeTab === 'radar-game' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Teacher message="¡Alerta de Operador! Dos naves aliadas están en órbita. Calcula la distancia directa entre ellas para calibrar el rayo de transferencia de energía con la Ley del Coseno." />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Mission Radar Screen */}
            <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border-4 border-cyan-500/40 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
              {/* Radar Rings Background */}
              <svg viewBox="0 0 400 400" className="w-full max-w-sm h-auto select-none">
                <defs>
                  <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#083344" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                  </radialGradient>
                </defs>
                <rect width="400" height="400" fill="url(#radarGrad)" rx="24" />

                {/* Radar Grid Circles */}
                <circle cx="200" cy="200" r="50" fill="none" stroke="#0e7490" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="#0e7490" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="#0891b2" strokeWidth="1.5" opacity="0.6" />
                <circle cx="200" cy="200" r="185" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.4" />

                {/* Radar Axis */}
                <line x1="200" y1="15" x2="200" y2="385" stroke="#0891b2" strokeWidth="1" opacity="0.4" />
                <line x1="15" y1="200" x2="385" y2="200" stroke="#0891b2" strokeWidth="1" opacity="0.4" />

                {/* Center Station (Base) */}
                <circle cx="200" cy="200" r="8" fill="#06b6d4" className="shadow-glow-cyan" />
                <text x="200" y="222" textAnchor="middle" className="text-[10px] font-black fill-cyan-300">BASE CENTRAL</text>

                {/* Calculations for Ship 1 and Ship 2 positions */}
                {(() => {
                  const scale = 7.5;
                  // Ship 1 fixed on angle 0 (horizontal right)
                  const s1x = 200 + radarA * scale;
                  const s1y = 200;

                  // Ship 2 at radarAngle
                  const rad = (radarAngle * Math.PI) / 180;
                  const s2x = 200 + radarB * scale * Math.cos(-rad);
                  const s2y = 200 + radarB * scale * Math.sin(-rad);

                  return (
                    <>
                      {/* Trajectories from base */}
                      <line x1="200" y1="200" x2={s1x} y2={s1y} stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="200" y1="200" x2={s2x} y2={s2y} stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />

                      {/* Angular Arc */}
                      <path
                        d={`M ${200 + 40} 200 A 40 40 0 0 0 ${200 + 40 * Math.cos(-rad)} ${200 + 40 * Math.sin(-rad)}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                      />
                      <text x={200 + 55 * Math.cos(-rad / 2)} y={200 + 55 * Math.sin(-rad / 2)} className="text-xs font-black fill-amber-400">
                        {radarAngle}°
                      </text>

                      {/* Ship 1 */}
                      <circle cx={s1x} cy={s1y} r="7" fill="#06b6d4" className="animate-pulse" />
                      <text x={s1x} y={s1y + 16} textAnchor="middle" className="text-[10px] font-black fill-cyan-200">
                        Nave Alfa ({radarA} UA)
                      </text>

                      {/* Ship 2 */}
                      <circle cx={s2x} cy={s2y} r="7" fill="#c084fc" className="animate-pulse" />
                      <text x={s2x} y={s2y - 12} textAnchor="middle" className="text-[10px] font-black fill-purple-200">
                        Nave Beta ({radarB} UA)
                      </text>

                      {/* Laser connection line when fired */}
                      {radarLaserFired && (
                        <line
                          x1={s1x}
                          y1={s1y}
                          x2={s2x}
                          y2={s2y}
                          stroke={radarResult === 'hit' ? '#22c55e' : '#ef4444'}
                          strokeWidth={radarResult === 'hit' ? '5' : '2'}
                          strokeDasharray={radarResult === 'hit' ? 'none' : '5 5'}
                          className={radarResult === 'hit' ? 'shadow-glow-cyan' : ''}
                        />
                      )}
                    </>
                  );
                })()}
              </svg>

              {/* Status Banner */}
              <div className="mt-4 flex items-center justify-between w-full px-4 text-xs font-mono">
                <span className="text-cyan-400 flex items-center gap-1">
                  <Radio size={14} /> RADAR ONLINE
                </span>
                <span className="text-amber-400 font-bold">Puntuación: {radarScore} pts</span>
                <span className="text-slate-400">Ronda #{radarRound}</span>
              </div>
            </div>

            {/* Firing & Calculation Control Center */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  Misión de Telemetría
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-2">
                  Calibrar Enlace Láser
                </h4>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Aplica: <MathFormula formula="d = \sqrt{a^2 + b^2 - 2ab\cos(\theta)}" />
                </p>
              </div>

              {/* Data Dashboard */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400">Dist. Nave Alfa (a)</span>
                  <p className="text-lg font-black text-cyan-600">{radarA} UA</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400">Dist. Nave Beta (b)</span>
                  <p className="text-lg font-black text-purple-600">{radarB} UA</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400">Ángulo (θ)</span>
                  <p className="text-lg font-black text-amber-600">{radarAngle}°</p>
                </div>
              </div>

              {/* Input & Firing Button */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-700 uppercase">
                  Distancia de enlace calculada (UA):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={radarLaserFired && radarResult === 'hit'}
                    value={radarInput}
                    onChange={(e) => setRadarInput(e.target.value)}
                    placeholder="Ej. 14.5"
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-300 font-black text-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                  <button
                    onClick={handleRadarFire}
                    disabled={radarLaserFired && radarResult === 'hit'}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-black px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <Zap size={18} /> ¡Disparar!
                  </button>
                </div>
              </div>

              {/* Feedback messages */}
              {radarLaserFired && (
                <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${
                  radarResult === 'hit'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                  <div>
                    <h6 className="font-black text-sm">
                      {radarResult === 'hit' ? '🎯 ¡ENLACE EXITOSO! (+150 PTS)' : '💥 CALIBRACIÓN FALLIDA'}
                    </h6>
                    <p className="text-xs mt-0.5">
                      {radarResult === 'hit'
                        ? 'La energía se ha transferido entre ambas naves con precisión matemática.'
                        : `Tu cálculo no coincide con la trayectoria. Valor real: ${Math.sqrt(radarA * radarA + radarB * radarB - 2 * radarA * radarB * Math.cos((radarAngle * Math.PI) / 180)).toFixed(2)} UA`}
                    </p>
                  </div>
                  <button
                    onClick={nextRadarRound}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-4 py-2.5 rounded-xl ml-3 shrink-0"
                  >
                    Siguiente Misión
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: ARCADE GAME (¿SENO O COSENO?) */}
      {activeTab === 'arcade-game' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <Teacher message="¿Cuándo usar la Ley del Seno y cuándo la Ley del Coseno? ¡Pon a prueba tu agilidad mental y crea tu racha de maestría!" />

          {/* Score Header */}
          <div className="bg-white p-4 md:p-6 rounded-3xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                <Gamepad2 size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base md:text-lg">Desafío Táctico</h4>
                <p className="text-xs text-slate-500 font-bold">Ronda {arcadeRound + 1} de {arcadeCards.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Racha</span>
                <span className="text-lg font-black text-amber-500 flex items-center gap-1 justify-end">
                  <Flame size={18} className="fill-amber-500" /> {arcadeStreak}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Puntos</span>
                <span className="text-2xl font-black text-indigo-600">{arcadeScore}</span>
              </div>
            </div>
          </div>

          {!arcadeGameOver ? (
            <div className="bg-white p-6 md:p-10 rounded-3xl border-2 border-slate-200 shadow-lg space-y-8 text-center relative overflow-hidden">
              <div className="inline-block bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-purple-200">
                Caso: {arcadeCards[arcadeRound].caseType}
              </div>

              <div className="space-y-4 max-w-xl mx-auto">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">
                  {arcadeCards[arcadeRound].data}
                </h3>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 inline-block">
                  Objetivo: <span className="text-indigo-600">{arcadeCards[arcadeRound].target}</span>
                </div>
              </div>

              {/* Big Choice Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
                <button
                  disabled={arcadeFeedback !== null}
                  onClick={() => handleArcadeChoice('seno')}
                  className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white p-6 rounded-2xl md:rounded-3xl shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex flex-col items-center gap-2"
                >
                  <span className="text-xs uppercase tracking-widest font-bold opacity-80">Opción A</span>
                  <span className="text-xl font-black">LEY DEL SENO</span>
                </button>

                <button
                  disabled={arcadeFeedback !== null}
                  onClick={() => handleArcadeChoice('coseno')}
                  className="bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white p-6 rounded-2xl md:rounded-3xl shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex flex-col items-center gap-2"
                >
                  <span className="text-xs uppercase tracking-widest font-bold opacity-80">Opción B</span>
                  <span className="text-xl font-black">LEY DEL COSENO</span>
                </button>
              </div>

              {/* Feedback Dialog */}
              {arcadeFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-5 rounded-2xl border-2 text-left space-y-3 ${
                    arcadeFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-base">
                    {arcadeFeedback.isCorrect ? (
                      <>
                        <CheckCircle2 className="text-emerald-600" /> ¡Respuesta Impecable!
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-red-600" /> ¡Cuidado con los datos!
                      </>
                    )}
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{arcadeFeedback.message}</p>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextArcade}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2"
                    >
                      {arcadeRound < arcadeCards.length - 1 ? 'Siguiente Tarjeta' : 'Ver Resultados'} <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Game Over Screen */
            <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-purple-500 shadow-2xl text-center space-y-6">
              <Trophy size={64} className="text-amber-500 mx-auto animate-bounce" />
              <h3 className="text-3xl font-black text-slate-900">¡Desafío Arcade Completado!</h3>
              <p className="text-slate-600 font-bold text-lg">
                Puntaje Final: <span className="text-purple-600 font-black text-2xl">{arcadeScore} pts</span>
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={resetArcade}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-6 py-3 rounded-2xl text-sm transition-all"
                >
                  Jugar de Nuevo
                </button>
                <button
                  onClick={onFinish}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-2xl text-sm transition-all shadow-lg"
                >
                  Finalizar Módulo <Award className="inline ml-1" size={18} />
                </button>
              </div>
            </div>
          )}
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
          <Teacher message="¡Bienvenido al Taller de Ejercicio Propio de la Ley del Coseno! Elige si tienes el caso L-A-L (dos lados y el ángulo comprendido) o el caso L-L-L (los tres lados). Ingresa tus datos, calcula el paso intermedio y descubre la conclusión analítica completa." />

          {/* Configuration Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="bg-rose-100 text-rose-800 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Paso 1: Elige el Caso y los Datos
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  Generador y Validador de la Ley del Coseno
                </h3>
              </div>

              {/* Case selector */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  onClick={() => {
                    setCustomCase('LAL');
                    setStudentIntermediateVal('');
                    setStudentFinalVal('');
                    setCustomFeedbackStep1(null);
                    setCustomFeedbackFinal(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                    customCase === 'LAL'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Caso L-A-L (Lado-Ángulo-Lado)
                </button>
                <button
                  onClick={() => {
                    setCustomCase('LLL');
                    setStudentIntermediateVal('');
                    setStudentFinalVal('');
                    setCustomFeedbackStep1(null);
                    setCustomFeedbackFinal(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                    customCase === 'LLL'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Caso L-L-L (Lado-Lado-Lado)
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {customCase === 'LAL' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Lado a:</span>
                      <span className="text-rose-600 font-mono">{customSideA}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customSideA}
                      onChange={(e) => {
                        setCustomSideA(Math.max(1, Number(e.target.value) || 1));
                        setCustomFeedbackStep1(null);
                        setCustomFeedbackFinal(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Lado b:</span>
                      <span className="text-purple-600 font-mono">{customSideB}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customSideB}
                      onChange={(e) => {
                        setCustomSideB(Math.max(1, Number(e.target.value) || 1));
                        setCustomFeedbackStep1(null);
                        setCustomFeedbackFinal(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Ángulo comprendido C (°):</span>
                      <span className="text-emerald-600 font-mono">{customAngleC}°</span>
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="175"
                      value={customAngleC}
                      onChange={(e) => {
                        setCustomAngleC(Math.min(175, Math.max(5, Number(e.target.value) || 5)));
                        setCustomFeedbackStep1(null);
                        setCustomFeedbackFinal(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Lado a:</span>
                      <span className="text-rose-600 font-mono">{customSideA}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customSideA}
                      onChange={(e) => {
                        setCustomSideA(Math.max(1, Number(e.target.value) || 1));
                        setCustomFeedbackStep1(null);
                        setCustomFeedbackFinal(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Lado b:</span>
                      <span className="text-purple-600 font-mono">{customSideB}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customSideB}
                      onChange={(e) => {
                        setCustomSideB(Math.max(1, Number(e.target.value) || 1));
                        setCustomFeedbackStep1(null);
                        setCustomFeedbackFinal(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Lado opuesto c:</span>
                      <span className="text-emerald-600 font-mono">{customSideC}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customSideC}
                      onChange={(e) => {
                        setCustomSideC(Math.max(1, Number(e.target.value) || 1));
                        setCustomFeedbackStep1(null);
                        setCustomFeedbackFinal(null);
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
                  {(() => {
                    const cx = 50;
                    const cy = 180;
                    // Lado b extends horizontally to A
                    const scale = 140 / Math.max(customSideA, customSideB, customCase === 'LAL' ? sideC_calc : customSideC);
                    const ax = cx + customSideB * scale;
                    const ay = cy;
                    // Lado a extends at angle C from C to B
                    const displayAngle = customCase === 'LAL' ? customAngleC : angleC_deg_calc;
                    const dispRad = (displayAngle * Math.PI) / 180;
                    const bx = cx + customSideA * scale * Math.cos(dispRad);
                    const by = cy - customSideA * scale * Math.sin(dispRad);

                    return (
                      <>
                        {/* Triangle Polygon */}
                        <polygon
                          points={`${cx},${cy} ${ax},${ay} ${bx},${by}`}
                          fill="#4f46e5"
                          fillOpacity="0.2"
                          stroke="#818cf8"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                        />

                        {/* Vertex C (Angle C) */}
                        <circle cx={cx} cy={cy} r="6" fill="#10b981" />
                        <text x={cx - 15} y={cy + 5} className="text-xs font-black fill-white">C</text>
                        <text x={cx + 18} y={cy - 12} className="text-[11px] font-bold fill-emerald-300">
                          {customCase === 'LAL'
                            ? `${customAngleC}°`
                            : (customFeedbackFinal?.ok ? `${angleC_deg_calc}°` : 'C = ?')}
                        </text>

                        {/* Vertex A */}
                        <circle cx={ax} cy={ay} r="6" fill="#a855f7" />
                        <text x={ax + 10} y={ay + 5} className="text-xs font-black fill-white">A</text>

                        {/* Vertex B */}
                        <circle cx={bx} cy={by} r="6" fill="#f43f5e" />
                        <text x={bx} y={by - 12} textAnchor="middle" className="text-xs font-black fill-white">B</text>

                        {/* Side b (CA) */}
                        <text x={(cx + ax) / 2} y={cy + 18} textAnchor="middle" className="text-xs font-bold fill-purple-300">
                          b = {customSideB}
                        </text>

                        {/* Side a (CB) */}
                        <text x={(cx + bx) / 2 - 20} y={(cy + by) / 2} className="text-xs font-bold fill-rose-300">
                          a = {customSideA}
                        </text>

                        {/* Side c (AB) */}
                        <text x={(ax + bx) / 2 + 15} y={(ay + by) / 2} className="text-xs font-bold fill-indigo-300">
                          {customCase === 'LAL'
                            ? (customFeedbackFinal?.ok ? `c ≈ ${sideC_calc}` : 'c = ?')
                            : `c = ${customSideC}`}
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="w-full text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-indigo-400/20">
                <span className="font-bold text-indigo-300">Resumen de Datos Ingresados:</span>
                <ul className="mt-1 space-y-0.5 font-mono text-[11px]">
                  {customCase === 'LAL' ? (
                    <>
                      <li>• Lado a = {customSideA}</li>
                      <li>• Lado b = {customSideB}</li>
                      <li>• Ángulo C = {customAngleC}°</li>
                    </>
                  ) : (
                    <>
                      <li>• Lado a = {customSideA}</li>
                      <li>• Lado b = {customSideB}</li>
                      <li>• Lado c = {customSideC}</li>
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
                  {/* Step A: Intermediate calculation */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-slate-800">
                          {customCase === 'LAL'
                            ? `Paso A: Calcula la suma de cuadrados a² + b² = (${customSideA})² + (${customSideB})²:`
                            : `Paso A: Calcula el valor de cos(C) usando la fórmula cos(C) = (a² + b² - c²) / (2ab):`}
                        </p>
                        <p className="text-xs font-mono text-slate-600 mt-0.5">
                          {customCase === 'LAL'
                            ? `(${customSideA})² + (${customSideB})² = ${customSideA * customSideA} + ${customSideB * customSideB}`
                            : `cos(C) = (${customSideA}² + ${customSideB}² - ${customSideC}²) / (2 · ${customSideA} · ${customSideB})`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="number"
                        step="0.01"
                        placeholder={customCase === 'LAL' ? "Tu respuesta (ej. 149)" : "Tu respuesta (ej. 0.45)"}
                        value={studentIntermediateVal}
                        onChange={(e) => setStudentIntermediateVal(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border-2 border-amber-300 font-bold font-mono text-sm bg-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={handleVerifyStep1}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider transition-colors shadow"
                      >
                        Verificar Paso A
                      </button>
                    </div>

                    {customFeedbackStep1 && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        customFeedbackStep1.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {customFeedbackStep1.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span>{customFeedbackStep1.msg}</span>
                      </div>
                    )}
                  </div>

                  {/* Step B: Final Value Calculation */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                    <div className="flex items-start gap-2">
                      <Calculator size={18} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-slate-800">
                          {customCase === 'LAL'
                            ? `Paso B: Aplica la raíz cuadrada para hallar el lado 'c' = √(a² + b² - 2ab · cos(C)):`
                            : `Paso B: Aplica la función inversa arccos para hallar la medida del ángulo C (°):`}
                        </p>
                        <p className="text-xs font-mono text-slate-600 mt-0.5">
                          {customCase === 'LAL'
                            ? `c = √(${a2_plus_b2} - ${term_2abCosC.toFixed(2)}) ≈ √(${c2_calc.toFixed(2)})`
                            : `C = arccos(${clamped_cosC.toFixed(4)})`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="number"
                        step="0.01"
                        placeholder={customCase === 'LAL' ? "Tu lado c (ej. 8.12)" : "Tu ángulo C en ° (ej. 55.4)"}
                        value={studentFinalVal}
                        onChange={(e) => setStudentFinalVal(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border-2 border-blue-300 font-bold font-mono text-sm bg-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleVerifyFinal}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-colors shadow"
                      >
                        {customCase === 'LAL' ? 'Verificar Lado c' : 'Verificar Ángulo C'}
                      </button>
                    </div>

                    {customFeedbackFinal && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        customFeedbackFinal.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {customFeedbackFinal.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span>{customFeedbackFinal.msg}</span>
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
                    <span className="text-amber-400 font-black">1. Fórmula Aplicada:</span>
                    <p className="text-slate-300">
                      {customCase === 'LAL'
                        ? `c² = a² + b² - 2ab · cos(C)`
                        : `cos(C) = (a² + b² - c²) / (2ab)`}
                    </p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <span className="text-cyan-400 font-black">2. Resultados Calculados:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Lado a</span>
                        <span className="text-sm font-black text-rose-300">{customSideA}</span>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Lado b</span>
                        <span className="text-sm font-black text-purple-300">{customSideB}</span>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Lado c</span>
                        <span className="text-sm font-black text-emerald-300">{customCase === 'LAL' ? sideC_calc : customSideC}</span>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">Ángulo C</span>
                        <span className="text-sm font-black text-amber-300">{customCase === 'LAL' ? `${customAngleC}°` : `${angleC_deg_calc}°`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-950/70 rounded-xl border border-emerald-500/40 text-emerald-200">
                    <span className="font-black text-emerald-400 block mb-1">💡 Conclusión Geométrica:</span>
                    {customCase === 'LAL' ? (
                      <p className="font-sans leading-relaxed text-xs">
                        Con los lados adyacentes a = {customSideA} y b = {customSideB} que forman un ángulo de {customAngleC}°, la Ley del Coseno compensa la abertura no recta (-2ab·cos({customAngleC}°)) y determina con exactitud una longitud de lado opuesto c ≈ {sideC_calc} unidades.
                      </p>
                    ) : (
                      <p className="font-sans leading-relaxed text-xs">
                        Conocidas las tres longitudes de los lados (a = {customSideA}, b = {customSideB}, c = {customSideC}), la Ley del Coseno despeja unívocamente el coseno del ángulo comprendido C ({clamped_cosC.toFixed(4)}), produciendo una abertura angular de C ≈ {angleC_deg_calc}°.
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
};
