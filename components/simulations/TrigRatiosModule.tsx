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
  Building,
  Compass,
  PlaneTakeoff,
  Eye,
  Crosshair,
  Layers,
  ChevronRight,
  TrendingUp,
  Maximize2
} from 'lucide-react';
import { MathFormula } from '../MathFormula';
import { Teacher } from '../Teacher';

interface TrigRatiosModuleProps {
  onBack: () => void;
  onFinish?: () => void;
}

type TabType = 'concept' | 'lab-triangle' | 'exercises' | 'sniper-game' | 'special-angles';

export const TrigRatiosModule: React.FC<TrigRatiosModuleProps> = ({ onBack, onFinish }) => {
  const [activeTab, setActiveTab] = useState<TabType>('concept');

  // --- TAB 1: CONCEPT STATE ---
  const [focusAngle, setFocusAngle] = useState<'alpha' | 'beta'>('alpha');
  const [selectedRatio, setSelectedRatio] = useState<'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot'>('sin');
  const [solveTarget, setSolveTarget] = useState<'ratio' | 'opposite' | 'adjacent' | 'hypotenuse' | 'angle'>('ratio');

  // --- TAB 2: INTERACTIVE TRIANGLE LAB STATE ---
  const [labAngle, setLabAngle] = useState<number>(35); // in degrees
  const [labHypotenuse, setLabHypotenuse] = useState<number>(12); // scale length

  const radLab = (labAngle * Math.PI) / 180;
  const labOpposite = labHypotenuse * Math.sin(radLab);
  const labAdjacent = labHypotenuse * Math.cos(radLab);

  const labSin = Math.sin(radLab);
  const labCos = Math.cos(radLab);
  const labTan = Math.tan(radLab);
  const labCsc = 1 / labSin;
  const labSec = 1 / labCos;
  const labCot = 1 / labTan;

  // --- TAB 3: 5 CONTEXTUALIZED STEP-BY-STEP EXERCISES STATE ---
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [exerciseStep, setExerciseStep] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<{ [key: string]: { ok: boolean; msg: string } }>({});
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  // 6 Progressive Contextualized Real-World Exercises
  const exercises = [
    {
      id: 0,
      title: "Problema 1: Altura Inaccesible de un Rascacielos con Teodolito",
      category: "Cálculo de Alturas",
      badge: "Uso de Tangente (Opuesto / Adyacente)",
      description: "Un topógrafo se encuentra a una distancia horizontal de 30 metros de la base de un rascacielos. Usando un teodolito a nivel del suelo, mide un ángulo de elevación de 52° hacia la punta del edificio. ¿Cuál es la altura 'h' del edificio?",
      unknown: "Altura del Edificio (h) = ?",
      given: { "Distancia Horizontal (Adyacente)": "30 m", "Ángulo de Elevación (θ)": "52°", "Cateto Opuesto": "Altura (h)" },
      svg: (
        <svg viewBox="0 0 360 210" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* Ground */}
          <line x1="30" y1="175" x2="330" y2="175" stroke="#64748b" strokeWidth="2.5" />
          
          {/* Building */}
          <rect x="250" y="30" width="65" height="145" fill="#e2e8f0" stroke="#334155" strokeWidth="2.5" />
          {/* Building Windows */}
          <rect x="260" y="45" width="15" height="15" fill="#38bdf8" />
          <rect x="290" y="45" width="15" height="15" fill="#38bdf8" />
          <rect x="260" y="75" width="15" height="15" fill="#38bdf8" />
          <rect x="290" y="75" width="15" height="15" fill="#38bdf8" />
          <rect x="260" y="105" width="15" height="15" fill="#38bdf8" />
          <rect x="290" y="105" width="15" height="15" fill="#38bdf8" />
          <rect x="260" y="135" width="15" height="15" fill="#38bdf8" />
          <rect x="290" y="135" width="15" height="15" fill="#38bdf8" />

          {/* Right Angle Symbol at (250, 175) */}
          <rect x="235" y="160" width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" />
          <circle cx="242.5" cy="167.5" r="2" fill="#ef4444" />

          {/* Sight Line (Hypotenuse) */}
          <line x1="60" y1="175" x2="250" y2="30" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="4 3" />

          {/* Angle Arc at Observer */}
          <path d="M 100,175 A 40 40 0 0 0 88,153" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          <text x="105" y="166" className="text-xs font-black fill-amber-600">52°</text>

          {/* Observer Point */}
          <circle cx="60" cy="175" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
          <text x="55" y="195" className="text-[11px] font-black fill-slate-700">Teodolito</text>

          {/* Dimensions */}
          <text x="155" y="193" textAnchor="middle" className="text-xs font-black fill-slate-700">
            Adyacente = 30 m
          </text>
          <text x="215" y="25" className="text-xs font-black fill-rose-600 bg-rose-50 px-1 font-mono">
            h = ? (Opuesto)
          </text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Identifica la razón trigonométrica que relaciona el cateto opuesto (h) con el cateto adyacente (30 m).",
          question: "¿Cuál es el valor de tan(52°)? (Calcula o busca con tu calculadora, redondea a 4 decimales):",
          formulaHint: "\\tan(52°) = \\frac{\\text{Opuesto}}{\\text{Adyacente}} = \\frac{h}{30}",
          expectedKey: "tan52_val",
          correctVal: 1.28,
          tolerance: 0.03,
          unit: "",
          explanation: "tan(52°) ≈ 1.2799"
        },
        {
          instruction: "Paso 2: Despeja la altura multiplicando la distancia por la tangente: h = 30 · tan(52°).",
          question: "Calcula la altura 'h' en metros (redondea a 1 o 2 decimales):",
          formulaHint: "h = 30 \\cdot \\tan(52°) = 30 \\cdot 1.2799",
          expectedKey: "height_building",
          correctVal: 38.4,
          tolerance: 0.4,
          unit: "m",
          explanation: "h = 30 × 1.2799 ≈ 38.4 m de altura."
        }
      ]
    },
    {
      id: 1,
      title: "Problema 2: Altura de un Edificio con la Estatura del Observador",
      category: "Alturas con Altura de Ojos",
      badge: "Clásico de Examen - Suma de Estatura (h = y + h_ojo)",
      description: "Una persona de 1.70 metros de estatura se encuentra a 25 metros de la base de un edificio. Al mirar la cúspide (punta) del edificio, su línea visual forma un ángulo de elevación de 40° con la horizontal de sus ojos. ¿Cuál es la altura total 'H' del edificio?",
      unknown: "Altura Total del Edificio (H = y + 1.70 m) = ?",
      given: { "Estatura del Observador (h_ojo)": "1.70 m", "Distancia Horizontal (x)": "25 m", "Ángulo de Elevación (θ)": "40°" },
      svg: (
        <svg viewBox="0 0 380 230" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* Ground */}
          <line x1="20" y1="200" x2="360" y2="200" stroke="#475569" strokeWidth="2.5" />
          
          {/* Person / Observer (Height 1.70m -> 35px scaled) */}
          {/* Head & Eye at (60, 165) */}
          <circle cx="60" cy="155" r="7" fill="#f59e0b" stroke="#334155" strokeWidth="1.5" />
          {/* Eye marker */}
          <circle cx="63" cy="154" r="1.5" fill="#1e293b" />
          {/* Body & legs */}
          <line x1="60" y1="162" x2="60" y2="185" stroke="#334155" strokeWidth="3" />
          <line x1="60" y1="185" x2="52" y2="200" stroke="#334155" strokeWidth="2.5" />
          <line x1="60" y1="185" x2="68" y2="200" stroke="#334155" strokeWidth="2.5" />
          <line x1="50" y1="172" x2="70" y2="172" stroke="#334155" strokeWidth="2" />
          
          {/* Person Height Indicator */}
          <line x1="38" y1="155" x2="38" y2="200" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="34" y1="155" x2="42" y2="155" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="34" y1="200" x2="42" y2="200" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="32" y="180" textAnchor="end" className="text-[10px] font-black fill-amber-700">1.70 m</text>

          {/* Building */}
          <rect x="270" y="25" width="70" height="175" fill="#e2e8f0" stroke="#334155" strokeWidth="2.5" />
          {/* Windows */}
          <rect x="282" y="40" width="16" height="14" fill="#38bdf8" />
          <rect x="312" y="40" width="16" height="14" fill="#38bdf8" />
          <rect x="282" y="70" width="16" height="14" fill="#38bdf8" />
          <rect x="312" y="70" width="16" height="14" fill="#38bdf8" />
          <rect x="282" y="100" width="16" height="14" fill="#38bdf8" />
          <rect x="312" y="100" width="16" height="14" fill="#38bdf8" />
          <rect x="282" y="130" width="16" height="14" fill="#38bdf8" />
          <rect x="312" y="130" width="16" height="14" fill="#38bdf8" />
          <rect x="282" y="165" width="16" height="14" fill="#38bdf8" />
          <rect x="312" y="165" width="16" height="14" fill="#38bdf8" />

          {/* Horizontal Eye Level Line (Base of the Triangle) from (60, 155) to (270, 155) */}
          <line x1="60" y1="155" x2="270" y2="155" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
          <text x="165" y="150" textAnchor="middle" className="text-[11px] font-black fill-slate-600">
            Línea horizontal visual = 25 m
          </text>

          {/* Right Angle at (270, 155) */}
          <rect x="255" y="140" width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" />
          <circle cx="262.5" cy="147.5" r="1.5" fill="#ef4444" />

          {/* Sight Line to top of Building (60, 155) -> (270, 25) */}
          <line x1="60" y1="155" x2="270" y2="25" stroke="#0284c7" strokeWidth="3" />

          {/* Angle Arc at Eye (60, 155) */}
          <path d="M 105,155 A 45 45 0 0 0 95,130" fill="none" stroke="#0284c7" strokeWidth="2.5" />
          <text x="108" y="145" className="text-xs font-black fill-cyan-700">40°</text>

          {/* Triangle Height 'y' Indicator */}
          <line x1="348" y1="25" x2="348" y2="155" stroke="#0284c7" strokeWidth="2" />
          <line x1="344" y1="25" x2="352" y2="25" stroke="#0284c7" strokeWidth="2" />
          <line x1="344" y1="155" x2="352" y2="155" stroke="#0284c7" strokeWidth="2" />
          <text x="354" y="90" className="text-[11px] font-black fill-cyan-700">y (Triángulo)</text>

          {/* Lower Height (Person) at Building */}
          <line x1="348" y1="155" x2="348" y2="200" stroke="#f59e0b" strokeWidth="2" />
          <line x1="344" y1="200" x2="352" y2="200" stroke="#f59e0b" strokeWidth="2" />
          <text x="354" y="180" className="text-[10px] font-black fill-amber-700">1.70 m</text>

          {/* Ground Distance */}
          <text x="165" y="218" textAnchor="middle" className="text-xs font-black fill-slate-700">
            Distancia al edificio = 25 m
          </text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Calcula la altura 'y' del triángulo formado por encima de los ojos con tan(40°) = y / 25.",
          question: "¿Cuál es el valor de la altura parcial 'y' en metros? (tan(40°) ≈ 0.8391, redondea a 2 decimales):",
          formulaHint: "y = 25 \\cdot \\tan(40°) = 25 \\cdot 0.8391",
          expectedKey: "height_y_partial",
          correctVal: 20.98, // 25 * 0.8391 = 20.9775
          tolerance: 0.25,
          unit: "m",
          explanation: "y = 25 × 0.8391 ≈ 20.98 metros (altura del triángulo por encima de los ojos)."
        },
        {
          instruction: "Paso 2: ¡El paso clave! Suma la altura del triángulo (20.98 m) más la estatura de la persona (1.70 m) para obtener la altura total H.",
          question: "¿Cuál es la altura total 'H' del edificio en metros?",
          formulaHint: "H = y + h_{\\text{ojo}} = 20.98 + 1.70",
          expectedKey: "height_total_building",
          correctVal: 22.68,
          tolerance: 0.3,
          unit: "m",
          explanation: "H = 20.98 + 1.70 = 22.68 metros de altura total del edificio."
        }
      ]
    },
    {
      id: 2,
      title: "Problema 3: Longitud de una Escalera de Bomberos",
      category: "Longitudes de Escaleras",
      badge: "Uso de Seno (Opuesto / Hipotenusa)",
      description: "Un camión de bomberos debe rescatar a una persona atrapada en una ventana situada a 14 metros de altura. Por normas de seguridad, la escalera telescópica debe formar un ángulo de elevación de 65° con el suelo. ¿Qué longitud 'L' debe extenderse la escalera?",
      unknown: "Longitud de la Escalera (L = Hipotenusa) = ?",
      given: { "Altura de la Ventana (Opuesto)": "14 m", "Ángulo con el Suelo (θ)": "65°", "Escalera": "Hipotenusa (L)" },
      svg: (
        <svg viewBox="0 0 360 210" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* Ground */}
          <line x1="30" y1="175" x2="330" y2="175" stroke="#64748b" strokeWidth="2.5" />
          
          {/* Wall */}
          <rect x="250" y="35" width="40" height="140" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
          
          {/* Window at (250, 45) */}
          <rect x="255" y="45" width="22" height="28" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
          <text x="282" y="60" className="text-[10px] font-black fill-amber-700">Ventana</text>

          {/* Right Angle */}
          <rect x="235" y="160" width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" />

          {/* Ladder (Hypotenuse) */}
          <line x1="80" y1="175" x2="250" y2="45" stroke="#dc2626" strokeWidth="4" />
          
          {/* Ladder Rungs */}
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((t, i) => {
            const rx = 80 + (250 - 80) * t;
            const ry = 175 + (45 - 175) * t;
            return <circle key={i} cx={rx} cy={ry} r="2.5" fill="#ffffff" />;
          })}

          {/* Angle at ground */}
          <path d="M 120,175 A 40 40 0 0 0 102,158" fill="none" stroke="#16a34a" strokeWidth="2.5" />
          <text x="122" y="166" className="text-xs font-black fill-emerald-700">65°</text>

          {/* Dimensions */}
          <text x="295" y="115" className="text-xs font-black fill-slate-700">Opuesto = 14 m</text>
          <text x="130" y="95" className="text-xs font-black fill-rose-600 font-mono">
            Escalera L = ? (Hipotenusa)
          </text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Relaciona el ángulo de 65°, el cateto opuesto (14 m) y la hipotenusa (L): sin(65°) = 14 / L.",
          question: "¿Cuál es el valor decimal de sin(65°)?",
          formulaHint: "\\sin(65°) = \\frac{\\text{Opuesto}}{\\text{Hipotenusa}} = \\frac{14}{L}",
          expectedKey: "sin65_val",
          correctVal: 0.91,
          tolerance: 0.03,
          unit: "",
          explanation: "sin(65°) ≈ 0.9063"
        },
        {
          instruction: "Paso 2: Despeja la longitud de la escalera: L = 14 / sin(65°).",
          question: "Calcula la longitud 'L' de la escalera en metros:",
          formulaHint: "L = \\frac{14}{\\sin(65°)} = \\frac{14}{0.9063}",
          expectedKey: "ladder_length",
          correctVal: 15.45,
          tolerance: 0.3,
          unit: "m",
          explanation: "L = 14 / 0.9063 ≈ 15.45 m de escalera."
        }
      ]
    },
    {
      id: 3,
      title: "Problema 4: Separación Horizontal de una Rampa de Acceso",
      category: "Medidas Horizontales",
      badge: "Uso de Coseno (Adyacente / Hipotenusa)",
      description: "Para construir una rampa para sillas de ruedas, se utilizará un riel inclinado de 18 metros de longitud (hipotenusa) con un ángulo suave de inclinación de 10° respecto al suelo. ¿Qué distancia horizontal 'd' sobre el suelo abarcará la rampa?",
      unknown: "Distancia Horizontal (d = Adyacente) = ?",
      given: { "Longitud de la Rampa (Hipotenusa)": "18 m", "Ángulo de Inclinación (θ)": "10°", "Distancia Suelo": "Cateto Adyacente (d)" },
      svg: (
        <svg viewBox="0 0 360 210" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* Ground */}
          <line x1="30" y1="170" x2="330" y2="170" stroke="#64748b" strokeWidth="2.5" />

          {/* Elevated Platform */}
          <rect x="290" y="125" width="40" height="45" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
          
          {/* Ramp Triangle */}
          <polygon points="50,170 290,170 290,125" fill="#f8fafc" stroke="#2563eb" strokeWidth="2" />
          <line x1="50" y1="170" x2="290" y2="125" stroke="#2563eb" strokeWidth="4" />

          {/* Right Angle at (290, 170) */}
          <rect x="275" y="155" width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" />

          {/* Angle Arc */}
          <path d="M 100,170 A 50 50 0 0 0 97,160" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          <text x="105" y="163" className="text-xs font-black fill-amber-600">10°</text>

          {/* Labels */}
          <text x="160" y="135" className="text-xs font-black fill-blue-700">Rampa = 18 m (Hipotenusa)</text>
          <text x="170" y="192" textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
            d = ? (Distancia Horizontal / Adyacente)
          </text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Plantea la razón de coseno: cos(10°) = Adyacente / Hipotenusa = d / 18.",
          question: "¿Cuál es el valor decimal de cos(10°)?",
          formulaHint: "\\cos(10°) = \\frac{d}{18}",
          expectedKey: "cos10_val",
          correctVal: 0.98,
          tolerance: 0.02,
          unit: "",
          explanation: "cos(10°) ≈ 0.9848"
        },
        {
          instruction: "Paso 2: Despeja la distancia horizontal multiplicando la hipotenusa por el coseno: d = 18 · cos(10°).",
          question: "Calcula la distancia horizontal 'd' en metros:",
          formulaHint: "d = 18 \\cdot \\cos(10°) = 18 \\cdot 0.9848",
          expectedKey: "dist_ramp",
          correctVal: 17.73,
          tolerance: 0.2,
          unit: "m",
          explanation: "d = 18 × 0.9848 ≈ 17.73 metros en el suelo."
        }
      ]
    },
    {
      id: 4,
      title: "Problema 5: Separación de la Base de una Escalera Doméstica",
      category: "Longitudes y Distancias",
      badge: "Cálculo de Adyacente & Inversa Arctan",
      description: "Una escalera de pintor mide 5 metros de largo (hipotenusa) y se apoya en una pared vertical alcanzando 4 metros de altura (opuesto). ¿A qué distancia horizontal 'b' de la pared debe estar la base de la escalera, y qué ángulo de inclinación tiene?",
      unknown: "Distancia base (b) y Ángulo (θ) = ?",
      given: { "Escalera (Hipotenusa)": "5 m", "Altura Alcanzada (Opuesto)": "4 m", "Separación Pared": "Adyacente (b)" },
      svg: (
        <svg viewBox="0 0 360 210" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* Ground */}
          <line x1="30" y1="175" x2="330" y2="175" stroke="#64748b" strokeWidth="2.5" />
          
          {/* Wall */}
          <rect x="250" y="35" width="30" height="140" fill="#f1f5f9" stroke="#334155" strokeWidth="2.5" />
          
          {/* Right Angle */}
          <rect x="235" y="160" width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" />

          {/* Ladder 3-4-5 */}
          <line x1="100" y1="175" x2="250" y2="35" stroke="#9333ea" strokeWidth="4" />
          
          {/* Angle at ground */}
          <path d="M 140,175 A 40 40 0 0 0 126,152" fill="none" stroke="#9333ea" strokeWidth="2.5" />
          <text x="142" y="165" className="text-xs font-black fill-purple-700">θ = ?</text>

          {/* Labels */}
          <text x="285" y="110" className="text-xs font-black fill-slate-700">Altura = 4 m</text>
          <text x="140" y="95" className="text-xs font-black fill-purple-700 font-bold">Escalera = 5 m</text>
          <text x="175" y="195" textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
            b = ? (Separación Base)
          </text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Por el Teorema de Pitágoras, b² + 4² = 5². Calcula la distancia 'b' de la base a la pared.",
          question: "¿Cuánto mide el cateto adyacente 'b' en metros?",
          formulaHint: "b = \\sqrt{5^2 - 4^2} = \\sqrt{25 - 16} = \\sqrt{9}",
          expectedKey: "base_pythagoras",
          correctVal: 3,
          tolerance: 0.1,
          unit: "m",
          explanation: "b = √9 = 3 metros (¡La famosa terna pitagórica 3-4-5!)."
        },
        {
          instruction: "Paso 2: Con sin(θ) = 4/5 = 0.8, aplica la función inversa arcsin(0.8) para encontrar el ángulo de inclinación.",
          question: "¿Cuál es el ángulo θ en grados? (redondea a 1 decimal):",
          formulaHint: "\\theta = \\arcsin(0.8)",
          expectedKey: "angle_ladder_deg",
          correctVal: 53.1,
          tolerance: 0.4,
          unit: "°",
          explanation: "θ = arcsin(0.8) ≈ 53.13°"
        }
      ]
    },
    {
      id: 5,
      title: "Problema 6: Altura de un Faro y Distancia de un Barco en el Mar",
      category: "Alturas y Distancias Combinadas",
      badge: "Desafío de Ángulo de Depresión",
      description: "Desde la cima de un faro costero de 45 metros de altura sobre el nivel del mar, el vigía observa un barco con un ángulo de depresión de 28°. ¿A qué distancia horizontal 'x' de la base del faro se encuentra el barco?",
      unknown: "Distancia Horizontal del Barco (x) = ?",
      given: { "Altura del Faro (Opuesto)": "45 m", "Ángulo de Depresión / Elevación (θ)": "28°", "Distancia en el Mar": "Adyacente (x)" },
      svg: (
        <svg viewBox="0 0 360 210" className="w-full max-w-xs mx-auto select-none drop-shadow-md">
          {/* Sea */}
          <rect x="20" y="165" width="320" height="35" fill="#e0f2fe" opacity="0.8" />
          <line x1="20" y1="165" x2="340" y2="165" stroke="#0284c7" strokeWidth="2" />

          {/* Lighthouse at (40, 165) */}
          <polygon points="50,165 70,165 65,45 55,45" fill="#f8fafc" stroke="#dc2626" strokeWidth="2.5" />
          <rect x="52" y="35" width="16" height="10" fill="#fef08a" stroke="#ca8a04" />
          {/* Light beam */}
          <line x1="60" y1="40" x2="300" y2="165" stroke="#eab308" strokeWidth="2" strokeDasharray="4 3" />
          
          {/* Ship at (300, 165) */}
          <polygon points="290,165 315,165 310,155 285,155" fill="#334155" />
          <line x1="298" y1="155" x2="298" y2="145" stroke="#dc2626" strokeWidth="2" />
          <polygon points="298,145 306,150 298,153" fill="#dc2626" />

          {/* Angle at ship */}
          <path d="M 260,165 A 40 40 0 0 1 270,147" fill="none" stroke="#eab308" strokeWidth="2.5" />
          <text x="238" y="156" className="text-xs font-black fill-amber-700">28°</text>

          {/* Labels */}
          <text x="25" y="105" className="text-xs font-black fill-slate-700">Faro = 45 m</text>
          <text x="180" y="188" textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
            x = ? (Distancia Horizontal en el Mar)
          </text>
        </svg>
      ),
      steps: [
        {
          instruction: "Paso 1: Por ángulos alternos internos, el ángulo en el barco es 28°. La relación es tan(28°) = 45 / x.",
          question: "¿Cuál es el valor decimal de tan(28°)?",
          formulaHint: "\\tan(28°) = \\frac{\\text{Opuesto}}{\\text{Adyacente}} = \\frac{45}{x}",
          expectedKey: "tan28_val",
          correctVal: 0.53,
          tolerance: 0.03,
          unit: "",
          explanation: "tan(28°) ≈ 0.5317"
        },
        {
          instruction: "Paso 2: Despeja la distancia horizontal del barco: x = 45 / tan(28°).",
          question: "Calcula la distancia 'x' en metros (redondea a 1 decimal):",
          formulaHint: "x = \\frac{45}{\\tan(28°)} = \\frac{45}{0.5317}",
          expectedKey: "dist_ship",
          correctVal: 84.6,
          tolerance: 0.8,
          unit: "m",
          explanation: "x = 45 / 0.5317 ≈ 84.63 metros de distancia en el mar."
        }
      ]
    }
  ];

  // Step check handler
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

  // --- TAB 4: RADAR SNIPER GAME STATE ---
  const [gameScore, setGameScore] = useState(0);
  const [gameStreak, setGameStreak] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'success' | 'failed'>('playing');
  const [targetBuildingDist, setTargetBuildingDist] = useState(40); // base
  const [targetElevationAngle, setTargetElevationAngle] = useState(38); // angle
  const [targetCalcHeight, setTargetCalcHeight] = useState(0);
  const [userLaserInput, setUserLaserInput] = useState("");
  const [laserShot, setLaserShot] = useState(false);

  const generateNewSniperRound = () => {
    const dist = Math.floor(Math.random() * 35) + 25; // 25 - 59 m
    const angle = Math.floor(Math.random() * 35) + 25; // 25 - 59 deg
    const rad = (angle * Math.PI) / 180;
    const h = dist * Math.tan(rad);

    setTargetBuildingDist(dist);
    setTargetElevationAngle(angle);
    setTargetCalcHeight(parseFloat(h.toFixed(1)));
    setUserLaserInput("");
    setGameStatus('playing');
    setLaserShot(false);
  };

  React.useEffect(() => {
    generateNewSniperRound();
  }, []);

  const handleFireLaser = () => {
    const val = parseFloat(userLaserInput);
    if (isNaN(val)) return;

    setLaserShot(true);
    const diff = Math.abs(val - targetCalcHeight);
    if (diff <= 0.6) {
      setGameStatus('success');
      setGameScore(prev => prev + 120 + gameStreak * 20);
      setGameStreak(prev => prev + 1);
    } else {
      setGameStatus('failed');
      setGameStreak(0);
    }
  };

  // --- TAB 5: SPECIAL ANGLES STATE (30°, 45°, 60°) ---
  const [selectedSpecialAngle, setSelectedSpecialAngle] = useState<30 | 45 | 60>(30);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top 5-Tab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-3xl shadow-lg border-2 border-slate-200 sticky top-20 z-40">
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'concept'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={16} /> 1. Concepto SOH-CAH-TOA
        </button>

        <button
          onClick={() => setActiveTab('lab-triangle')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'lab-triangle'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={16} /> 2. Laboratorio Dinámico
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'exercises'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator size={16} /> 3. 6 Problemas Contextualizados
        </button>

        <button
          onClick={() => setActiveTab('sniper-game')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'sniper-game'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gamepad2 size={16} /> 4. Misión Láser de Alturas
        </button>

        <button
          onClick={() => setActiveTab('special-angles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm tracking-wide transition-all ${
            activeTab === 'special-angles'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award size={16} /> 5. Ángulos Notables (30°, 45°, 60°)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONCEPTO INTERACTIVO SOH-CAH-TOA */}
      {/* ========================================================================= */}
      {activeTab === 'concept' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡El secreto de la trigonometría plana! Un ángulo en un triángulo rectángulo define la proporción exacta entre sus lados. ¡Cambia el ángulo de enfoque entre α y β para ver cómo se intercambian el cateto opuesto y el adyacente!" />

          {/* Master Interactive Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-6 md:p-10 rounded-3xl shadow-2xl border-4 border-blue-500/40 relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header with Angle Switcher */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
              <div>
                <span className="bg-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-blue-400/30 inline-block mb-2">
                  Fundamento SOH - CAH - TOA
                </span>
                <h3 className="text-2xl md:text-4xl font-black tracking-tight">
                  Las 6 Razones Trigonométricas
                </h3>
              </div>

              {/* Angle Focus Switcher */}
              <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-2xl border border-blue-400/30">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">
                  Ángulo de Enfoque:
                </span>
                <button
                  onClick={() => setFocusAngle('alpha')}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
                    focusAngle === 'alpha'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md scale-105'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Ángulo Base α (Inferior)
                </button>
                <button
                  onClick={() => setFocusAngle('beta')}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
                    focusAngle === 'beta'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Ángulo Superior β
                </button>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* LEFT: SVG Triangle with Reactive Labels based on focusAngle */}
              <div className="lg:col-span-5 bg-slate-900/90 p-5 rounded-3xl border-2 border-blue-400/30 shadow-inner flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between text-xs font-black text-slate-300 mb-2 border-b border-slate-800 pb-2">
                  <span className="text-cyan-300 flex items-center gap-1">
                    <Crosshair size={14} /> Triángulo Rectángulo (90°)
                  </span>
                  <span className="text-[11px] text-amber-400">
                    Foco: {focusAngle === 'alpha' ? 'Ángulo α (Base)' : 'Ángulo β (Superior)'}
                  </span>
                </div>

                <svg viewBox="0 0 340 240" className="w-full max-w-xs h-auto select-none drop-shadow-md">
                  {/* Triangle A(40,200), C(280,200), B(280,40) */}
                  <polygon
                    points="40,200 280,200 280,40"
                    fill="rgba(59, 130, 246, 0.12)"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />

                  {/* Right Angle Symbol at C(280, 200) */}
                  <rect x="260" y="180" width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  <circle cx="270" cy="190" r="2.5" fill="#ef4444" />
                  <text x="288" y="215" className="text-[10px] font-black fill-rose-400">90°</text>

                  {/* Angle Alpha Arc at Vertex A(40, 200) */}
                  <path
                    d="M 80,200 A 40 40 0 0 0 74,174"
                    fill="none"
                    stroke={focusAngle === 'alpha' ? "#38bdf8" : "#64748b"}
                    strokeWidth={focusAngle === 'alpha' ? "4" : "2"}
                  />
                  <text x="88" y="192" className={`text-xs font-black ${focusAngle === 'alpha' ? 'fill-cyan-300' : 'fill-slate-500'}`}>
                    α
                  </text>

                  {/* Angle Beta Arc at Vertex B(280, 40) */}
                  <path
                    d="M 280,80 A 40 40 0 0 1 254,74"
                    fill="none"
                    stroke={focusAngle === 'beta' ? "#c084fc" : "#64748b"}
                    strokeWidth={focusAngle === 'beta' ? "4" : "2"}
                  />
                  <text x="260" y="98" className={`text-xs font-black ${focusAngle === 'beta' ? 'fill-purple-300' : 'fill-slate-500'}`}>
                    β
                  </text>

                  {/* Side Labels dynamically changing */}
                  {/* Base (40 to 280) */}
                  <line x1="40" y1="200" x2="280" y2="200" stroke={focusAngle === 'alpha' ? "#3b82f6" : "#ec4899"} strokeWidth="4" />
                  <text x="160" y="222" textAnchor="middle" className={`text-xs font-black ${focusAngle === 'alpha' ? 'fill-blue-400' : 'fill-pink-400'}`}>
                    {focusAngle === 'alpha' ? 'Cateto Adyacente (a)' : 'Cateto Opuesto (a)'}
                  </text>

                  {/* Vertical Side (280, 200 to 280, 40) */}
                  <line x1="280" y1="200" x2="280" y2="40" stroke={focusAngle === 'alpha' ? "#ec4899" : "#3b82f6"} strokeWidth="4" />
                  <text x="290" y="125" className={`text-xs font-black ${focusAngle === 'alpha' ? 'fill-pink-400' : 'fill-blue-400'}`}>
                    {focusAngle === 'alpha' ? 'Cateto Opuesto (b)' : 'Cateto Adyacente (b)'}
                  </text>

                  {/* Hypotenuse (40, 200 to 280, 40) */}
                  <line x1="40" y1="200" x2="280" y2="40" stroke="#f59e0b" strokeWidth="4.5" />
                  <text x="140" y="105" className="text-xs font-black fill-amber-300">
                    Hipotenusa (h)
                  </text>

                  {/* Vertices */}
                  <circle cx="40" cy="200" r="5" fill="#38bdf8" />
                  <text x="25" y="215" className="text-xs font-black fill-cyan-300">A</text>
                  <circle cx="280" cy="40" r="5" fill="#c084fc" />
                  <text x="290" y="35" className="text-xs font-black fill-purple-300">B</text>
                </svg>

                <div className="mt-3 bg-black/60 px-3 py-1.5 rounded-xl border border-blue-400/30 text-[11px] text-center text-slate-300">
                  {focusAngle === 'alpha' ? (
                    <span>Para <strong className="text-cyan-300">α</strong>: El opuesto está al frente vertical y el adyacente abajo.</span>
                  ) : (
                    <span>Para <strong className="text-purple-300">β</strong>: ¡Se invierten! El opuesto queda abajo y el adyacente vertical.</span>
                  )}
                </div>
              </div>

              {/* RIGHT: SOH-CAH-TOA Ratios and Clearing Equations */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Ratio Selector Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-blue-400/30">
                  {(['sin', 'cos', 'tan', 'csc', 'sec', 'cot'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setSelectedRatio(ratio)}
                      className={`py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all text-center ${
                        selectedRatio === ratio
                          ? 'bg-blue-600 text-white shadow-lg scale-105'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>

                {/* Primary Ratio Display Card */}
                <div className="bg-slate-900/90 p-5 rounded-2xl border-2 border-blue-400/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-cyan-400" /> Definición Matemática
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded-md">
                      {selectedRatio === 'sin' && 'SOH: Seno = Opuesto / Hipotenusa'}
                      {selectedRatio === 'cos' && 'CAH: Coseno = Adyacente / Hipotenusa'}
                      {selectedRatio === 'tan' && 'TOA: Tangente = Opuesto / Adyacente'}
                      {selectedRatio === 'csc' && 'Recíproca del Seno (1/sin)'}
                      {selectedRatio === 'sec' && 'Recíproca del Coseno (1/cos)'}
                      {selectedRatio === 'cot' && 'Recíproca de la Tangente (1/tan)'}
                    </span>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-blue-500/40 text-center space-y-2">
                    <div className="text-lg sm:text-2xl font-bold text-cyan-300">
                      {selectedRatio === 'sin' && <MathFormula formula="\sin(\theta) = \frac{\text{Cateto Opuesto}}{\text{Hipotenusa}}" block={true} />}
                      {selectedRatio === 'cos' && <MathFormula formula="\cos(\theta) = \frac{\text{Cateto Adyacente}}{\text{Hipotenusa}}" block={true} />}
                      {selectedRatio === 'tan' && <MathFormula formula="\tan(\theta) = \frac{\text{Cateto Opuesto}}{\text{Cateto Adyacente}}" block={true} />}
                      {selectedRatio === 'csc' && <MathFormula formula="\csc(\theta) = \frac{\text{Hipotenusa}}{\text{Cateto Opuesto}} = \frac{1}{\sin(\theta)}" block={true} />}
                      {selectedRatio === 'sec' && <MathFormula formula="\sec(\theta) = \frac{\text{Hipotenusa}}{\text{Cateto Adyacente}} = \frac{1}{\cos(\theta)}" block={true} />}
                      {selectedRatio === 'cot' && <MathFormula formula="\cot(\theta) = \frac{\text{Cateto Adyacente}}{\text{Cateto Opuesto}} = \frac{1}{\tan(\theta)}" block={true} />}
                    </div>
                  </div>
                </div>

                {/* Practical Clearing Formulas (What are you solving for?) */}
                <div className="bg-slate-900/90 p-5 rounded-2xl border-2 border-indigo-400/30 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-300 block">
                    ¿Cómo despejar según lo que necesitas encontrar?
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                      <span className="text-amber-300 font-bold block">1. Para hallar un Cateto:</span>
                      <p className="text-slate-300 font-mono text-[11px]">
                        <MathFormula formula="\text{Op} = \text{Hip} \cdot \sin(\theta)" />
                      </p>
                      <p className="text-slate-300 font-mono text-[11px]">
                        <MathFormula formula="\text{Op} = \text{Ady} \cdot \tan(\theta)" />
                      </p>
                    </div>

                    <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                      <span className="text-cyan-300 font-bold block">2. Para la Hipotenusa:</span>
                      <p className="text-slate-300 font-mono text-[11px]">
                        <MathFormula formula="\text{Hip} = \frac{\text{Opuesto}}{\sin(\theta)}" />
                      </p>
                      <p className="text-slate-300 font-mono text-[11px]">
                        <MathFormula formula="\text{Hip} = \frac{\text{Adyacente}}{\cos(\theta)}" />
                      </p>
                    </div>

                    <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                      <span className="text-purple-300 font-bold block">3. Para hallar el Ángulo:</span>
                      <p className="text-slate-300 font-mono text-[11px]">
                        <MathFormula formula="\theta = \arctan\left(\frac{\text{Op}}{\text{Ady}}\right)" />
                      </p>
                      <p className="text-slate-300 font-mono text-[11px]">
                        <MathFormula formula="\theta = \arcsin\left(\frac{\text{Op}}{\text{Hip}}\right)" />
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Careers & Real World Applications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building size={24} />
              </div>
              <h4 className="font-black text-slate-800 text-base">Arquitectura e Ingeniería Civil</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Permite calcular alturas de rascacielos sin escalarlos, pendientes de techos para drenaje y longitudes óptimas de rampas de acceso vehicular.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <PlaneTakeoff size={24} />
              </div>
              <h4 className="font-black text-slate-800 text-base">Aviación y Rutas de Despegue</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Los aviones usan el seno y coseno para calcular la tasa de ascenso seguro sobre montañas y corregir la deriva causada por el viento lateral.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Compass size={24} />
              </div>
              <h4 className="font-black text-slate-800 text-base">Topografía y Medición Óptica</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Los teodolitos y estaciones totales disparan rayos láser para medir ángulos verticales y calcular distancias inaccesibles mediante la tangente.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LABORATORIO DINÁMICO (TRIÁNGULO Y LAS 6 RAZONES EN VIVO) */}
      {/* ========================================================================= */}
      {activeTab === 'lab-triangle' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Mueve el ángulo de elevación y la hipotenusa! Comprueba cómo cambian las longitudes de los catetos y cómo las 6 razones trigonométricas se recalculan al instante." />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Interactive Canvas */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg md:text-xl font-black text-slate-900">Geometría a Escala Exacta</h4>
                  <p className="text-xs text-slate-500 font-medium">Ángulo actual: {labAngle}° | Hipotenusa: {labHypotenuse} m</p>
                </div>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-black border border-blue-200">
                  θ = {labAngle}°
                </span>
              </div>

              {/* Dynamic SVG Drawing */}
              <div className="bg-slate-950 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden min-h-[300px]">
                {(() => {
                  const scale = 14;
                  const originX = 50;
                  const originY = 240;
                  
                  const adjPx = labAdjacent * scale;
                  const oppPx = labOpposite * scale;

                  const cornerX = originX + adjPx;
                  const cornerY = originY;
                  const topX = cornerX;
                  const topY = originY - oppPx;

                  return (
                    <svg viewBox="0 0 380 280" className="w-full h-auto max-h-[280px] select-none">
                      {/* Grid background lines */}
                      <line x1="30" y1={originY} x2="350" y2={originY} stroke="#334155" strokeWidth="1.5" />
                      
                      {/* Triangle Shape */}
                      <polygon
                        points={`${originX},${originY} ${cornerX},${cornerY} ${topX},${topY}`}
                        fill="rgba(59, 130, 246, 0.15)"
                        stroke="#38bdf8"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />

                      {/* Right Angle Box */}
                      <rect x={cornerX - 16} y={cornerY - 16} width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2" />
                      <circle cx={cornerX - 8} cy={cornerY - 8} r="2" fill="#ef4444" />

                      {/* Angle Arc at Origin */}
                      <path
                        d={`M ${originX + 35},${originY} A 35 35 0 0 0 ${originX + 35 * Math.cos(radLab)},${originY - 35 * Math.sin(radLab)}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                      />
                      <text x={originX + 42} y={originY - 10} className="text-xs font-black fill-amber-400">
                        {labAngle}°
                      </text>

                      {/* Side Labels */}
                      {/* Adjacent (Base) */}
                      <text x={(originX + cornerX) / 2} y={originY + 22} textAnchor="middle" className="text-xs font-black fill-cyan-300">
                        Adyacente = {labAdjacent.toFixed(2)} m
                      </text>

                      {/* Opposite (Vertical) */}
                      <text x={cornerX + 10} y={(cornerY + topY) / 2} className="text-xs font-black fill-pink-400">
                        Opuesto = {labOpposite.toFixed(2)} m
                      </text>

                      {/* Hypotenuse (Slope) */}
                      <text x={(originX + topX) / 2 - 20} y={(originY + topY) / 2 - 12} className="text-xs font-black fill-amber-300">
                        Hipotenusa = {labHypotenuse} m
                      </text>

                      {/* Vertices */}
                      <circle cx={originX} cy={originY} r="5" fill="#f59e0b" />
                      <circle cx={cornerX} cy={cornerY} r="5" fill="#ef4444" />
                      <circle cx={topX} cy={topY} r="5" fill="#38bdf8" />
                    </svg>
                  );
                })()}
              </div>

              {/* 6 Ratios Calculation Grid */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border-2 border-blue-500/40 space-y-4">
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wider block">
                  Cálculo en Vivo de las 6 Razones Trigonométricas:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-black/40 p-3 rounded-xl border border-cyan-400/30">
                    <span className="text-slate-400 font-bold block">sen({labAngle}°) = Op / Hip</span>
                    <span className="text-cyan-400 font-black text-sm font-mono">{labSin.toFixed(4)}</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-blue-400/30">
                    <span className="text-slate-400 font-bold block">cos({labAngle}°) = Ady / Hip</span>
                    <span className="text-blue-400 font-black text-sm font-mono">{labCos.toFixed(4)}</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-amber-400/30">
                    <span className="text-slate-400 font-bold block">tan({labAngle}°) = Op / Ady</span>
                    <span className="text-amber-400 font-black text-sm font-mono">{labTan.toFixed(4)}</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-purple-400/30">
                    <span className="text-slate-400 font-bold block">csc({labAngle}°) = Hip / Op</span>
                    <span className="text-purple-400 font-black text-sm font-mono">{labCsc.toFixed(4)}</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-indigo-400/30">
                    <span className="text-slate-400 font-bold block">sec({labAngle}°) = Hip / Ady</span>
                    <span className="text-indigo-400 font-black text-sm font-mono">{labSec.toFixed(4)}</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-pink-400/30">
                    <span className="text-slate-400 font-bold block">cot({labAngle}°) = Ady / Op</span>
                    <span className="text-pink-400 font-black text-sm font-mono">{labCot.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sliders & Controls */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Calculator size={18} className="text-blue-600" /> Controles del Laboratorio
                </h4>

                {/* Slider Angle */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-amber-700">Ángulo de Elevación (θ):</span>
                    <span className="text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md font-mono text-sm">{labAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={labAngle}
                    onChange={(e) => setLabAngle(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>10° (Rampa suave)</span>
                    <span>80° (Escarpado)</span>
                  </div>
                </div>

                {/* Slider Hypotenuse */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-blue-700">Longitud Hipotenusa (h):</span>
                    <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md font-mono text-sm">{labHypotenuse} m</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="20"
                    value={labHypotenuse}
                    onChange={(e) => setLabHypotenuse(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Pitágoras Verification */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-black text-slate-700 block">Comprobación Pitagórica:</span>
                  <div className="font-mono text-slate-600 text-[11px]">
                    {labAdjacent.toFixed(2)}² + {labOpposite.toFixed(2)}² = {(labAdjacent**2 + labOpposite**2).toFixed(1)} ≈ {labHypotenuse}²
                  </div>
                  <p className="text-[10px] text-slate-500">
                    ¡La suma de los cuadrados de los catetos siempre equivale exactamente al cuadrado de la hipotenusa!
                  </p>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Casos de Estudio Típicos:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setLabAngle(30); setLabHypotenuse(10); }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors"
                  >
                    Notable 30° (sen = 0.5)
                  </button>
                  <button
                    onClick={() => { setLabAngle(45); setLabHypotenuse(14); }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors"
                  >
                    Notable 45° (Op = Ady)
                  </button>
                  <button
                    onClick={() => { setLabAngle(60); setLabHypotenuse(12); }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors"
                  >
                    Notable 60° (cos = 0.5)
                  </button>
                  <button
                    onClick={() => { setLabAngle(53); setLabHypotenuse(15); }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-bold text-slate-700 text-left transition-colors"
                  >
                    Aproximado 3-4-5 (53.1°)
                  </button>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 5 PROBLEMAS CONTEXTUALIZADOS (ALTURAS, ESCALERAS, DISTANCIAS) */}
      {/* ========================================================================= */}
      {activeTab === 'exercises' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Problemas del mundo real! Resuelve situaciones contextualizadas calculando alturas, escaleras y distancias horizontales con su diagrama geométrico correspondiente." />

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
                <span>{ex.category}</span>
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
                      <Award size={18} /> ¡Problema Resuelto!
                    </div>
                  )}
                </div>

                {/* Problem Statement with SVG Illustration and Unknown Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-200">
                  
                  {/* Left: Description & Knowns */}
                  <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                          Situación Problemática
                        </span>
                        <span className="text-xs text-slate-500 font-bold">Contexto real</span>
                      </div>
                      <p className="text-slate-800 text-sm md:text-base font-semibold leading-relaxed">
                        {ex.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Unknown Highlight Callout */}
                      <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-3 rounded-2xl border-2 border-amber-400/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span className="text-xs font-black text-amber-900 uppercase tracking-wider">Incógnita a Encontrar:</span>
                        </div>
                        <span className="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-sm font-mono">
                          {ex.unknown}
                        </span>
                      </div>

                      {/* Known Data Chips */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                          Datos dados en el problema:
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

                  {/* Right: SVG Triangle Drawing */}
                  <div className="lg:col-span-5 bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-inner flex flex-col items-center justify-center space-y-2">
                    <div className="w-full flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">
                      <span>Diagrama Trigonométrico</span>
                      <span className="text-emerald-600">Representación a Escala</span>
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
                      Siguiente Problema <ArrowRight size={18} />
                    </button>
                  </div>
                )}

              </div>
            );
          })()}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MINIJUEGO MISIÓN LÁSER DE ALTURAS */}
      {/* ========================================================================= */}
      {activeTab === 'sniper-game' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Misión táctica de calibración láser! Un dron en el suelo mide la distancia horizontal al rascacielos y el ángulo de elevación a la antena. Calcula la altura exacta con la tangente para conectar el enlace láser." />

          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-6 md:p-10 rounded-3xl shadow-2xl border-4 border-amber-500/40 relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Score Header */}
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
                onClick={generateNewSniperRound}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} /> Nueva Diana
              </button>
            </div>

            {/* Laser Target Canvas */}
            <div className="bg-slate-950/90 rounded-2xl border-2 border-cyan-500/30 p-4 relative min-h-[300px] flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 500 280" className="w-full h-auto max-h-[280px] select-none">
                {/* Ground */}
                <line x1="40" y1="240" x2="460" y2="240" stroke="#475569" strokeWidth="3" />
                
                {/* Building at right */}
                <rect x="360" y="40" width="90" height="200" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <rect x="380" y="55" width="20" height="15" fill="#38bdf8" opacity="0.7" />
                <rect x="415" y="55" width="20" height="15" fill="#38bdf8" opacity="0.7" />
                <rect x="380" y="90" width="20" height="15" fill="#38bdf8" opacity="0.7" />
                <rect x="415" y="90" width="20" height="15" fill="#38bdf8" opacity="0.7" />
                <rect x="380" y="125" width="20" height="15" fill="#38bdf8" opacity="0.7" />
                <rect x="415" y="125" width="20" height="15" fill="#38bdf8" opacity="0.7" />

                {/* Antenna / Target Bullseye at (360, 40) */}
                <circle cx="360" cy="40" r="12" fill="none" stroke="#ef4444" strokeWidth="2.5" className="animate-pulse" />
                <circle cx="360" cy="40" r="4" fill="#ef4444" />
                <text x="360" y="24" textAnchor="middle" className="text-xs font-black fill-rose-400">
                  🎯 Antena Receptora (h = ?)
                </text>

                {/* Laser Station (Drone) at (80, 240) */}
                <circle cx="80" cy="240" r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <text x="80" y="265" textAnchor="middle" className="text-xs font-black fill-amber-400">
                  Emisor Láser (θ = {targetElevationAngle}°)
                </text>

                {/* Sightline / Laser */}
                {laserShot && gameStatus === 'success' ? (
                  <line x1="80" y1="240" x2="360" y2="40" stroke="#10b981" strokeWidth="4" className="animate-pulse" />
                ) : (
                  <line x1="80" y1="240" x2="360" y2="40" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.4" />
                )}

                {/* Base Distance Label */}
                <text x="220" y="230" textAnchor="middle" className="text-xs font-black fill-slate-300">
                  Distancia Horizontal Base = {targetBuildingDist} m
                </text>
              </svg>
            </div>

            {/* Input & Firing Controls */}
            <div className="bg-black/50 p-6 rounded-2xl border border-cyan-500/30 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Instrucción de Disparo:
                  </span>
                  <p className="text-sm text-slate-200">
                    Aplica la tangente: <MathFormula formula="\text{Altura } h = \text{Distancia} \cdot \tan(\theta) = " /> <strong>{targetBuildingDist} · tan({targetElevationAngle}°)</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Altura en metros..."
                      value={userLaserInput}
                      onChange={(e) => setUserLaserInput(e.target.value)}
                      disabled={gameStatus === 'success'}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border-2 border-cyan-400 text-white font-mono text-sm font-bold w-44 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">m</span>
                  </div>

                  {gameStatus === 'playing' ? (
                    <button
                      onClick={handleFireLaser}
                      className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center gap-2"
                    >
                      <Crosshair size={16} /> ¡Disparar Láser!
                    </button>
                  ) : (
                    <button
                      onClick={generateNewSniperRound}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center gap-2"
                    >
                      <RefreshCw size={16} /> Siguiente Objetivo
                    </button>
                  )}
                </div>
              </div>

              {/* Status Feedback */}
              {gameStatus === 'success' && (
                <div className="bg-emerald-500/20 border border-emerald-400/40 p-4 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  <span>¡Impacto Perfecto! La antena se encuentra exactamente a <strong>{targetCalcHeight} m</strong> de altura. (+120 pts)</span>
                </div>
              )}

              {gameStatus === 'failed' && (
                <div className="bg-rose-500/20 border border-rose-400/40 p-4 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-3">
                  <HelpCircle size={20} className="text-rose-400 shrink-0" />
                  <span>El rayo pasó de largo. La altura exacta era <strong>{targetCalcHeight} m</strong>. ¡Inténtalo en el siguiente rascacielos!</span>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ÁNGULOS NOTABLES (30°, 45°, 60°) Y DEDUCCIÓN GEOMÉTRICA */}
      {/* ========================================================================= */}
      {activeTab === 'special-angles' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Teacher message="¡Los ángulos más famosos del universo! Descubre de dónde nacen las fracciones exactas con raíces cuadradas al dividir un triángulo equilátero o un cuadrado por su diagonal." />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Geometric Proofs Card */}
            <div className="lg:col-span-6 bg-slate-900 text-white p-6 md:p-8 rounded-3xl border-2 border-purple-500/40 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-black text-purple-300 uppercase tracking-wider block">Deducción Geométrica</span>
                  <h4 className="text-lg font-black text-white">¿De dónde vienen los valores exactos?</h4>
                </div>

                <div className="flex items-center gap-2">
                  {[30, 45, 60].map((ang) => (
                    <button
                      key={ang}
                      onClick={() => setSelectedSpecialAngle(ang as any)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                        selectedSpecialAngle === ang
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ang}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Geometric Deduction Figure */}
              <div className="bg-slate-950 rounded-2xl p-4 flex items-center justify-center min-h-[260px]">
                {selectedSpecialAngle === 45 ? (
                  // Square cut in half for 45°
                  <svg viewBox="0 0 300 220" className="w-full h-auto max-h-[220px] select-none">
                    <rect x="60" y="40" width="140" height="140" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
                    <polygon points="60,180 200,180 200,40" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="3" />
                    <text x="130" y="198" textAnchor="middle" className="text-xs font-black fill-purple-300">Cateto = 1</text>
                    <text x="210" y="115" className="text-xs font-black fill-purple-300">Cateto = 1</text>
                    <text x="110" y="100" className="text-xs font-black fill-amber-300">Hip = √2</text>
                    <text x="90" y="172" className="text-xs font-black fill-cyan-400">45°</text>
                  </svg>
                ) : (
                  // Equilateral cut in half for 30° and 60°
                  <svg viewBox="0 0 300 220" className="w-full h-auto max-h-[220px] select-none">
                    <polygon points="40,180 260,180 150,30" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                    <polygon points="150,180 260,180 150,30" fill="rgba(59, 130, 246, 0.2)" stroke="#38bdf8" strokeWidth="3" />
                    <text x="205" y="198" textAnchor="middle" className="text-xs font-black fill-cyan-300">Base = 1</text>
                    <text x="95" y="115" className="text-xs font-black fill-pink-400">Altura = √3</text>
                    <text x="215" y="105" className="text-xs font-black fill-amber-300">Hip = 2</text>
                    <text x="220" y="172" className="text-xs font-black fill-amber-400">60°</text>
                    <text x="160" y="55" className="text-xs font-black fill-cyan-400">30°</text>
                  </svg>
                )}
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-purple-400/30 text-xs text-slate-300 space-y-1">
                {selectedSpecialAngle === 45 ? (
                  <p>
                    Para <strong>45°</strong>: Nace de un cuadrado de lado 1 cortado por su diagonal. Por Pitágoras: <MathFormula formula="h = \sqrt{1^2 + 1^2} = \sqrt{2}" />. Por tanto <MathFormula formula="\sin(45°) = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}" />.
                  </p>
                ) : (
                  <p>
                    Para <strong>30° y 60°</strong>: Nacen de un triángulo equilátero de lado 2 partido a la mitad. Su altura es <MathFormula formula="h = \sqrt{2^2 - 1^2} = \sqrt{3}" />. Por tanto <MathFormula formula="\sin(30°) = \frac{1}{2}" /> y <MathFormula formula="\sin(60°) = \frac{\sqrt{3}}{2}" />.
                  </p>
                )}
              </div>

            </div>

            {/* Right: Master Table of Exact Values */}
            <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-6">
              <h4 className="font-black text-slate-900 text-lg">Tabla de Valores Notables Exactos</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black">
                      <th className="p-3 border border-slate-200 rounded-tl-xl">Razón</th>
                      <th className="p-3 border border-slate-200">30° (π/6)</th>
                      <th className="p-3 border border-slate-200">45° (π/4)</th>
                      <th className="p-3 border border-slate-200 rounded-tr-xl">60° (π/3)</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold text-slate-800">
                    <tr className="hover:bg-blue-50/50">
                      <td className="p-3 border border-slate-200 font-black text-blue-700">sen(θ)</td>
                      <td className="p-3 border border-slate-200 font-mono"><MathFormula formula="\frac{1}{2}" /></td>
                      <td className="p-3 border border-slate-200 font-mono"><MathFormula formula="\frac{\sqrt{2}}{2}" /></td>
                      <td className="p-3 border border-slate-200 font-mono"><MathFormula formula="\frac{\sqrt{3}}{2}" /></td>
                    </tr>
                    <tr className="hover:bg-blue-50/50">
                      <td className="p-3 border border-slate-200 font-black text-indigo-700">cos(θ)</td>
                      <td className="p-3 border border-slate-200 font-mono"><MathFormula formula="\frac{\sqrt{3}}{2}" /></td>
                      <td className="p-3 border border-slate-200 font-mono"><MathFormula formula="\frac{\sqrt{2}}{2}" /></td>
                      <td className="p-3 border border-slate-200 font-mono"><MathFormula formula="\frac{1}{2}" /></td>
                    </tr>
                    <tr className="hover:bg-blue-50/50">
                      <td className="p-3 border border-slate-200 font-black text-emerald-700">tan(θ)</td>
                      <td className="p-3 border border-slate-200 font-mono"><MathFormula formula="\frac{\sqrt{3}}{3}" /></td>
                      <td className="p-3 border border-slate-200 font-mono">1</td>
                      <td className="p-3 border border-slate-200 font-mono"><MathFormula formula="\sqrt{3}" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-black flex items-center gap-1.5 text-amber-800">
                  <Lightbulb size={16} /> Mnemotecnia de la Raíz para Seno:
                </span>
                <p className="leading-relaxed">
                  Para recordar el seno de 0°, 30°, 45°, 60°, 90° cuenta del 0 al 4:
                  <span className="block font-mono text-center pt-2 font-bold text-amber-950">
                    <MathFormula formula="\frac{\sqrt{0}}{2}=0, \quad \frac{\sqrt{1}}{2}=\frac{1}{2}, \quad \frac{\sqrt{2}}{2}, \quad \frac{\sqrt{3}}{2}, \quad \frac{\sqrt{4}}{2}=1" />
                  </span>
                </p>
              </div>

            </div>

          </div>
        </motion.div>
      )}

      {/* Completion Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <Award size={36} className="text-amber-300 shrink-0" />
          <div>
            <h4 className="font-black text-lg">¡Dominas las Razones Trigonométricas y sus Aplicaciones!</h4>
            <p className="text-xs text-blue-100">Estás listo para resolver cualquier triángulo en el espacio y en la tierra.</p>
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
