import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Triangle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCw, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Sparkles, 
  Layers, 
  Sun, 
  Compass, 
  ShieldCheck, 
  Maximize2,
  Minimize2,
  Eye,
  BookOpen,
  Trophy,
  ArrowRight,
  Flame,
  Zap,
  Sliders,
  Calculator
} from 'lucide-react';
import { MathFormula } from '../MathFormula';
import { Teacher } from '../Teacher';

interface TrianglesModuleProps {
  onBack: () => void;
  onFinish?: () => void;
}

type TabType = 'parallel-angles' | 'triangle-lab' | 'pythagoras' | 'thales' | 'challenges';

export const TrianglesModule: React.FC<TrianglesModuleProps> = ({ onBack, onFinish }) => {
  const [activeTab, setActiveTab] = useState<TabType>('parallel-angles');

  // -------------------------------------------------------------
  // TAB 1: PARALELAS & ÁNGULOS (180°) STATE
  // -------------------------------------------------------------
  const [transversalAngle, setTransversalAngle] = useState<number>(55);
  const [highlightAngleType, setHighlightAngleType] = useState<'all' | 'alternate-int' | 'alternate-ext' | 'corresponding' | 'vertical'>('all');
  const [triangleSumAngleA, setTriangleSumAngleA] = useState<number>(65);
  const [triangleSumAngleB, setTriangleSumAngleB] = useState<number>(45);
  const triangleSumAngleC = 180 - triangleSumAngleA - triangleSumAngleB;

  // -------------------------------------------------------------
  // TAB 2: TRIANGLE LAB (DRAGGABLE VERTICES & CLASSIFICATION)
  // -------------------------------------------------------------
  // Coordinates in SVG space [0..400] x [0..300]
  const [vertexA, setVertexA] = useState<{ x: number; y: number }>({ x: 200, y: 50 });
  const [vertexB, setVertexB] = useState<{ x: number; y: number }>({ x: 70, y: 240 });
  const [vertexC, setVertexC] = useState<{ x: number; y: number }>({ x: 330, y: 240 });
  const [draggingVertex, setDraggingVertex] = useState<'A' | 'B' | 'C' | null>(null);
  const svgLabRef = useRef<SVGSVGElement>(null);

  // Compute side lengths (in arbitrary units, scaled)
  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y) / 18; // scale
  };

  const sideA = dist(vertexB, vertexC); // opposite to A (BC)
  const sideB = dist(vertexA, vertexC); // opposite to B (AC)
  const sideC = dist(vertexA, vertexB); // opposite to C (AB)

  // Compute angles using Law of Cosines
  const calcAngle = (opp: number, adj1: number, adj2: number) => {
    const cosVal = (adj1 ** 2 + adj2 ** 2 - opp ** 2) / (2 * adj1 * adj2);
    const clamped = Math.max(-1, Math.min(1, cosVal));
    return (Math.acos(clamped) * 180) / Math.PI;
  };

  const angleA = calcAngle(sideA, sideB, sideC);
  const angleB = calcAngle(sideB, sideA, sideC);
  const angleC = calcAngle(sideC, sideA, sideB);

  // Classification by sides
  const getSideClassification = () => {
    const diffAB = Math.abs(sideA - sideB);
    const diffBC = Math.abs(sideB - sideC);
    const diffCA = Math.abs(sideC - sideA);
    const tol = 0.4;
    if (diffAB < tol && diffBC < tol && diffCA < tol) return { name: 'Equilátero', desc: '3 lados y 3 ángulos iguales (60° c/u)', color: 'text-amber-600 bg-amber-50 border-amber-300' };
    if (diffAB < tol || diffBC < tol || diffCA < tol) return { name: 'Isósceles', desc: '2 lados iguales y 2 ángulos iguales en su base', color: 'text-blue-600 bg-blue-50 border-blue-300' };
    return { name: 'Escaleno', desc: '3 lados de longitudes distintas y 3 ángulos distintos', color: 'text-purple-600 bg-purple-50 border-purple-300' };
  };

  // Classification by angles
  const getAngleClassification = () => {
    const maxAngle = Math.max(angleA, angleB, angleC);
    if (Math.abs(maxAngle - 90) < 2) return { name: 'Rectángulo', desc: 'Tiene 1 ángulo exactamente recto (90°)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (maxAngle > 90.5) return { name: 'Obtusángulo', desc: 'Tiene 1 ángulo obtuso (> 90°)', color: 'text-rose-700 bg-rose-50 border-rose-300' };
    return { name: 'Acutángulo', desc: 'Sus 3 ángulos son agudos (< 90°)', color: 'text-indigo-700 bg-indigo-50 border-indigo-300' };
  };

  // Drag handlers
  const handleLabPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingVertex || !svgLabRef.current) return;
    const rect = svgLabRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(380, ((e.clientX - rect.left) / rect.width) * 400));
    const y = Math.max(20, Math.min(280, ((e.clientY - rect.top) / rect.height) * 300));

    if (draggingVertex === 'A') setVertexA({ x, y });
    if (draggingVertex === 'B') setVertexB({ x, y });
    if (draggingVertex === 'C') setVertexC({ x, y });
  };

  const stopDragging = () => setDraggingVertex(null);

  // Preset Triangle Setters
  const setPreset = (type: 'equilateral' | 'right' | 'isosceles' | 'obtuse') => {
    if (type === 'equilateral') {
      setVertexA({ x: 200, y: 46 });
      setVertexB({ x: 80, y: 254 });
      setVertexC({ x: 320, y: 254 });
    } else if (type === 'right') {
      setVertexA({ x: 90, y: 50 });
      setVertexB({ x: 90, y: 250 });
      setVertexC({ x: 330, y: 250 });
    } else if (type === 'isosceles') {
      setVertexA({ x: 200, y: 40 });
      setVertexB({ x: 120, y: 250 });
      setVertexC({ x: 280, y: 250 });
    } else if (type === 'obtuse') {
      setVertexA({ x: 70, y: 110 });
      setVertexB({ x: 170, y: 250 });
      setVertexC({ x: 350, y: 250 });
    }
  };

  // -------------------------------------------------------------
  // TAB 3: PITÁGORAS (a² + b² = c²)
  // -------------------------------------------------------------
  const [pythA, setPythA] = useState<number>(3); // Cateto A
  const [pythB, setPythB] = useState<number>(4); // Cateto B
  const [showProofGrid, setShowProofGrid] = useState<boolean>(true);
  const [pythMode, setPythMode] = useState<'hypotenuse' | 'leg'>('hypotenuse');
  
  const pythC = Math.sqrt(pythA ** 2 + pythB ** 2);
  const pythA2 = pythA ** 2;
  const pythB2 = pythB ** 2;
  const pythC2 = pythC ** 2;

  // -------------------------------------------------------------
  // TAB 4: TEOREMA DE THALES (Pirámide de Egipto & Sombras)
  // -------------------------------------------------------------
  const [sunAngle, setSunAngle] = useState<number>(40); // Solar altitude angle in degrees
  const [stickHeight, setStickHeight] = useState<number>(2); // meters
  const pyramidRealHeight = 146.6; // Gran Pirámide de Guiza in meters
  
  const radSun = (sunAngle * Math.PI) / 180;
  const stickShadow = stickHeight / Math.tan(radSun);
  const pyramidShadow = pyramidRealHeight / Math.tan(radSun);

  // -------------------------------------------------------------
  // TAB 5: DESAFÍOS PASO A PASO
  // -------------------------------------------------------------
  const [currentChallenge, setCurrentChallenge] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: { ok: boolean; msg: string } }>({});
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  const challenges = [
    {
      id: 0,
      title: "Desafío 1: El Ángulo Faltante en el Triángulo",
      category: "Suma de Ángulos Interiores (180°)",
      description: "En un triángulo de navegación náutica, dos de los faros detectan ángulos interiores de α = 68° y β = 47°. ¿Cuál es el valor del tercer ángulo γ en el vértice del barco?",
      formula: "\\gamma = 180^\\circ - (\\alpha + \\beta)",
      given: { "Ángulo α": "68°", "Ángulo β": "47°", "Suma Total": "180°" },
      svg: (
        <svg viewBox="0 0 420 220" className="w-full max-w-md mx-auto select-none drop-shadow-sm">
          <defs>
            <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="lightBeamA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lightBeamB" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sky & Sea Background */}
          <rect x="10" y="10" width="400" height="200" rx="16" fill="#f8fafc" />
          <path d="M 10 155 Q 110 148 210 155 T 410 155 L 410 210 L 10 210 Z" fill="url(#seaGrad)" />
          <path d="M 10 170 Q 110 165 210 170 T 410 170 L 410 210 L 10 210 Z" fill="#7dd3fc" opacity="0.4" />

          {/* Light Beams from lighthouses */}
          <polygon points="65,125 180,60 170,105" fill="url(#lightBeamA)" opacity="0.5" />
          <polygon points="355,125 240,60 250,105" fill="url(#lightBeamB)" opacity="0.5" />

          {/* Triangle Polygon connecting Faro A (65, 145), Faro B (355, 145), Barco (210, 52) */}
          <polygon points="65,145 355,145 210,52" fill="#3b82f6" fillOpacity="0.08" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5 3" />
          <line x1="65" y1="145" x2="355" y2="145" stroke="#0284c7" strokeWidth="3" />

          {/* Angle Arcs */}
          {/* Alpha at Faro A (65,145) */}
          <path d="M 100 145 A 35 35 0 0 0 88 120" fill="none" stroke="#d97706" strokeWidth="3" />
          <text x="96" y="138" className="text-xs font-black fill-amber-700 font-mono">α = 68°</text>

          {/* Beta at Faro B (355,145) */}
          <path d="M 320 145 A 35 35 0 0 1 332 120" fill="none" stroke="#4f46e5" strokeWidth="3" />
          <text x="272" y="138" className="text-xs font-black fill-indigo-700 font-mono">β = 47°</text>

          {/* Gamma at Ship (210,52) */}
          <path d="M 193 72 A 28 28 0 0 0 227 72" fill="none" stroke="#e11d48" strokeWidth="3" />
          <rect x="185" y="80" width="50" height="20" rx="6" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="210" y="94" textAnchor="middle" className="text-[11px] font-black fill-rose-700 font-mono">γ = ?</text>

          {/* Faro A (Left) */}
          <g transform="translate(45, 105)">
            <ellipse cx="20" cy="46" rx="26" ry="8" fill="#64748b" />
            <polygon points="12,45 28,45 24,18 16,18" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />
            <polygon points="13,38 27,38 26,30 14,30" fill="#ef4444" />
            <rect x="15" y="12" width="10" height="7" fill="#fef08a" stroke="#334155" strokeWidth="1.2" />
            <polygon points="14,12 26,12 20,6" fill="#ef4444" />
            <circle cx="20" cy="40" r="4" fill="#d97706" />
          </g>
          <text x="65" y="178" textAnchor="middle" className="text-[11px] font-black fill-slate-800">Faro Alfa</text>

          {/* Faro B (Right) */}
          <g transform="translate(335, 105)">
            <ellipse cx="20" cy="46" rx="26" ry="8" fill="#64748b" />
            <polygon points="12,45 28,45 24,18 16,18" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />
            <polygon points="13,38 27,38 26,30 14,30" fill="#3b82f6" />
            <rect x="15" y="12" width="10" height="7" fill="#fef08a" stroke="#334155" strokeWidth="1.2" />
            <polygon points="14,12 26,12 20,6" fill="#3b82f6" />
            <circle cx="20" cy="40" r="4" fill="#4f46e5" />
          </g>
          <text x="355" y="178" textAnchor="middle" className="text-[11px] font-black fill-slate-800">Faro Beta</text>

          {/* Ship / Barco (Apex) at (210, 52) */}
          <g transform="translate(190, 24)">
            <polygon points="5,24 35,24 30,32 10,32" fill="#0f172a" />
            <line x1="20" y1="24" x2="20" y2="6" stroke="#475569" strokeWidth="2" />
            <polygon points="21,7 21,22 34,22" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <polygon points="19,10 19,22 9,22" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="20" cy="28" r="4" fill="#e11d48" />
          </g>
          <text x="210" y="22" textAnchor="middle" className="text-[11px] font-black fill-slate-900">Barco (Vértice γ)</text>
        </svg>
      ),
      steps: [
        { label: "Suma de los dos ángulos conocidos (68 + 47):", key: "sum", answer: 115, unit: "°" },
        { label: "Valor del tercer ángulo γ (180 - 115):", key: "gamma", answer: 65, unit: "°" }
      ],
      explanation: "Como los 3 ángulos interiores de cualquier triángulo siempre suman exactamente 180°, restamos 180° - 68° - 47° = 65°."
    },
    {
      id: 1,
      title: "Desafío 2: La Escalera de Rescate (Pitágoras)",
      category: "Cálculo de Hipotenusa",
      description: "Un cuerpo de bomberos necesita apoyar una escalera contra un edificio para alcanzar una ventana situada a una altura a = 12 metros. La base del camión de bomberos se estaciona a b = 5 metros de la pared. ¿Qué longitud 'c' debe tener la escalera?",
      formula: "c = \\sqrt{a^2 + b^2}",
      given: { "Altura de la pared (a)": "12 m", "Distancia al edificio (b)": "5 m", "Ángulo en la base": "90° (Rectángulo)" },
      svg: (
        <svg viewBox="0 0 420 220" className="w-full max-w-md mx-auto select-none drop-shadow-sm">
          <defs>
            <pattern id="brickPattern" width="16" height="10" patternUnits="userSpaceOnUse">
              <rect width="16" height="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="0" y1="5" x2="16" y2="5" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="8" y1="0" x2="8" y2="5" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="0" y1="5" x2="0" y2="10" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="16" y1="5" x2="16" y2="10" stroke="#cbd5e1" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background container */}
          <rect x="10" y="10" width="400" height="200" rx="16" fill="#f8fafc" />

          {/* Ground */}
          <line x1="20" y1="180" x2="400" y2="180" stroke="#334155" strokeWidth="3" />

          {/* Building */}
          <rect x="270" y="28" width="120" height="152" fill="url(#brickPattern)" stroke="#64748b" strokeWidth="2" />
          
          {/* Target Window at height a=12m (y=45) */}
          <rect x="285" y="42" width="36" height="42" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
          <line x1="303" y1="42" x2="303" y2="84" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="285" y1="63" x2="321" y2="63" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="285" cy="48" r="4" fill="#ef4444" />

          {/* Other Windows */}
          <rect x="340" y="42" width="30" height="42" rx="4" fill="#94a3b8" opacity="0.5" />
          <rect x="285" y="102" width="36" height="42" rx="4" fill="#94a3b8" opacity="0.5" />
          <rect x="340" y="102" width="30" height="42" rx="4" fill="#94a3b8" opacity="0.5" />

          {/* Right Angle Symbol at (270, 180) */}
          <rect x="252" y="162" width="18" height="18" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <circle cx="261" cy="171" r="2" fill="#ef4444" />
          <text x="246" y="156" className="text-[10px] font-black fill-rose-600 font-mono">90°</text>

          {/* Fire Truck at b=5m (x=80, y=180) */}
          <g transform="translate(45, 136)">
            <rect x="0" y="15" width="55" height="24" rx="4" fill="#dc2626" />
            <rect x="38" y="19" width="15" height="11" rx="2" fill="#bae6fd" />
            <rect x="12" y="10" width="8" height="5" rx="1" fill="#38bdf8" />
            <circle cx="14" cy="39" r="6" fill="#1e293b" />
            <circle cx="14" cy="39" r="2.5" fill="#cbd5e1" />
            <circle cx="44" cy="39" r="6" fill="#1e293b" />
            <circle cx="44" cy="39" r="2.5" fill="#cbd5e1" />
            <circle cx="48" cy="15" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Ladder (Hipotenusa c) from (95, 180) to (285, 48) */}
          <line x1="95" y1="180" x2="285" y2="48" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
          {/* Ladder rungs */}
          {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t, idx) => {
            const rx = 95 + (285 - 95) * t;
            const ry = 180 + (48 - 180) * t;
            return (
              <line
                key={idx}
                x1={rx - 4}
                y1={ry - 5}
                x2={rx + 4}
                y2={ry + 5}
                stroke="#475569"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* Dimension a: Height = 12m (Vertical Cateto) */}
          <rect x="330" y="8" width="75" height="18" rx="5" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
          <text x="367" y="21" textAnchor="middle" className="text-[10px] font-black fill-blue-800 font-mono">
            a = 12 m
          </text>

          {/* Dimension b: Distance = 5m (Horizontal Cateto) */}
          <line x1="95" y1="196" x2="270" y2="196" stroke="#16a34a" strokeWidth="2" />
          <rect x="150" y="188" width="65" height="18" rx="5" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
          <text x="182" y="201" textAnchor="middle" className="text-[10px] font-black fill-emerald-800 font-mono">
            b = 5 m
          </text>

          {/* Hypotenuse Label c = ? */}
          <rect x="140" y="86" width="105" height="24" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="192" y="102" textAnchor="middle" className="text-xs font-black fill-amber-900 font-mono">
            c = ? (Escalera)
          </text>
        </svg>
      ),
      steps: [
        { label: "Calcula a² + b² = 12² + 5² = 144 + 25:", key: "c2", answer: 169, unit: "" },
        { label: "Longitud de la escalera c = √169:", key: "c", answer: 13, unit: "m" }
      ],
      explanation: "Por Pitágoras: c² = 12² + 5² = 144 + 25 = 169. Luego, c = √169 = 13 metros."
    },
    {
      id: 2,
      title: "Desafío 3: Altura de un Mástil con Cable Tensor",
      category: "Despeje de Cateto con Pitágoras",
      description: "Un mástil de telecomunicaciones está sujeto por un cable tensor de longitud c = 17 metros anclado a una distancia horizontal de b = 8 metros de la base. ¿Cuál es la altura 'a' del mástil?",
      formula: "a = \\sqrt{c^2 - b^2}",
      given: { "Longitud del cable (Hipotenusa c)": "17 m", "Distancia horizontal (Cateto b)": "8 m" },
      svg: (
        <svg viewBox="0 0 420 220" className="w-full max-w-md mx-auto select-none drop-shadow-sm">
          {/* Background */}
          <rect x="10" y="10" width="400" height="200" rx="16" fill="#f8fafc" />

          {/* Ground */}
          <line x1="20" y1="180" x2="400" y2="180" stroke="#334155" strokeWidth="3" />
          
          {/* Grass tufts */}
          <path d="M 40 180 L 43 173 L 46 180 M 150 180 L 153 174 L 156 180 M 360 180 L 363 172 L 366 180" stroke="#16a34a" strokeWidth="1.5" fill="none" />

          {/* Telecom Mast / Antenna Tower at x=310 from y=30 to 180 */}
          <g transform="translate(305, 30)">
            <polygon points="5,0 15,0 18,150 2,150" fill="#f1f5f9" stroke="#dc2626" strokeWidth="1.5" />
            <rect x="4" y="25" width="12" height="25" fill="#dc2626" />
            <rect x="3" y="75" width="14" height="25" fill="#dc2626" />
            <rect x="2" y="125" width="16" height="25" fill="#dc2626" />
            {[0, 25, 50, 75, 100, 125].map((py, idx) => (
              <g key={idx}>
                <line x1="4" y1={py} x2="16" y2={py + 25} stroke="#64748b" strokeWidth="1" />
                <line x1="16" y1={py} x2="4" y2={py + 25} stroke="#64748b" strokeWidth="1" />
              </g>
            ))}
            <line x1="10" y1="0" x2="10" y2="-12" stroke="#dc2626" strokeWidth="2.5" />
            <circle cx="10" cy="-12" r="3" fill="#dc2626" />
            <path d="M 2 -16 A 10 10 0 0 1 18 -16" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M -4 -20 A 16 16 0 0 1 24 -20" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>

          {/* Right Angle at Tower Base (310, 180) */}
          <rect x="292" y="162" width="18" height="18" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <circle cx="301" cy="171" r="2" fill="#ef4444" />
          <text x="286" y="156" className="text-[10px] font-black fill-rose-600 font-mono">90°</text>

          {/* Ground Anchor Peg at x=90 */}
          <polygon points="86,180 94,180 90,168" fill="#475569" />
          <circle cx="90" cy="168" r="4" fill="#0284c7" />
          <text x="90" y="196" textAnchor="middle" className="text-[10px] font-black fill-slate-600">Anclaje</text>

          {/* Guy-Wire Cable (Hipotenusa c = 17m) from (90, 168) to (315, 30) */}
          <line x1="90" y1="168" x2="315" y2="30" stroke="#2563eb" strokeWidth="3" />
          <circle cx="170" cy="115" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />

          {/* Cable Dimension Badge c = 17m */}
          <rect x="130" y="78" width="95" height="24" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="177" y="94" textAnchor="middle" className="text-xs font-black fill-blue-900 font-mono">
            c = 17 m (Cable)
          </text>

          {/* Base Distance b = 8m (Horizontal Cateto) */}
          <line x1="90" y1="180" x2="310" y2="180" stroke="#16a34a" strokeWidth="3" />
          <rect x="165" y="188" width="65" height="18" rx="5" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
          <text x="197" y="201" textAnchor="middle" className="text-[10px] font-black fill-emerald-800 font-mono">
            b = 8 m
          </text>

          {/* Height Dimension a = ? (Vertical Cateto) */}
          <rect x="330" y="90" width="75" height="24" rx="6" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="367" y="106" textAnchor="middle" className="text-xs font-black fill-rose-900 font-mono">
            a = ? (Altura)
          </text>
        </svg>
      ),
      steps: [
        { label: "Calcula c² - b² = 17² - 8² = 289 - 64:", key: "a2", answer: 225, unit: "" },
        { label: "Altura del mástil a = √225:", key: "a", answer: 15, unit: "m" }
      ],
      explanation: "Despejamos el cateto: a² = c² - b² = 289 - 64 = 225. La altura es a = √225 = 15 metros."
    },
    {
      id: 3,
      title: "Desafío 4: El Teorema de Thales y la Sombra del Árbol",
      category: "Proporcionalidad y Semejanza de Triángulos",
      description: "Para medir la altura 'H' de un pino gigantesco sin treparlo, clavas verticalmente una vara de h = 2 metros que proyecta una sombra de s = 3 metros. En ese mismo instante, la sombra del pino mide S = 24 metros. ¿Cuál es la altura 'H' del pino?",
      formula: "\\frac{H}{S} = \\frac{h}{s} \\implies H = \\frac{h \\cdot S}{s}",
      given: { "Altura de la vara (h)": "2 m", "Sombra de la vara (s)": "3 m", "Sombra del árbol (S)": "24 m" },
      svg: (
        <svg viewBox="0 0 420 220" className="w-full max-w-md mx-auto select-none drop-shadow-sm">
          <defs>
            <linearGradient id="sunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect x="10" y="10" width="400" height="200" rx="16" fill="#f8fafc" />

          {/* Ground */}
          <line x1="20" y1="180" x2="400" y2="180" stroke="#334155" strokeWidth="3" />

          {/* Golden Sun at top-left (45, 35) */}
          <g transform="translate(45, 35)">
            <circle cx="0" cy="0" r="16" fill="url(#sunGlow)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={Math.cos(rad) * 20}
                  y1={Math.sin(rad) * 20}
                  x2={Math.cos(rad) * 25}
                  y2={Math.sin(rad) * 25}
                  stroke="#f59e0b"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Parallel Sun Rays (Dashed Amber Lines) */}
          <line x1="45" y1="100" x2="135" y2="180" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
          <line x1="160" y1="-10" x2="375" y2="180" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 3" />

          {/* 1. Small Object: Vara (h = 2m) at x=80 */}
          <line x1="80" y1="180" x2="130" y2="180" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
          <line x1="80" y1="180" x2="80" y2="135" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
          <circle cx="80" cy="135" r="3" fill="#f59e0b" />
          
          {/* Stick Labels */}
          <text x="65" y="158" className="text-[10px] font-black fill-amber-900 font-mono">h = 2m</text>
          <text x="105" y="196" textAnchor="middle" className="text-[10px] font-black fill-slate-700 font-mono">s = 3m</text>

          {/* 2. Large Object: Gran Pino (H = ?) at x=220 */}
          <line x1="220" y1="180" x2="370" y2="180" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          
          {/* Tree Trunk */}
          <rect x="214" y="140" width="12" height="40" fill="#78350f" rx="2" />
          {/* Tree Foliage Layers */}
          <polygon points="220,40 185,90 255,90" fill="#15803d" />
          <polygon points="220,70 175,120 265,120" fill="#16a34a" />
          <polygon points="220,100 165,150 275,150" fill="#22c55e" />
          <circle cx="220" cy="40" r="3.5" fill="#fbbf24" />

          {/* Tree Labels */}
          <rect x="280" y="25" width="95" height="24" rx="6" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="327" y="41" textAnchor="middle" className="text-xs font-black fill-rose-900 font-mono">
            H = ? (Pino)
          </text>

          {/* Tree Shadow Label S = 24m */}
          <rect x="265" y="188" width="75" height="18" rx="5" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
          <text x="302" y="201" textAnchor="middle" className="text-[10px] font-black fill-slate-800 font-mono">
            S = 24 m
          </text>

          {/* Thales Ratio Badge */}
          <rect x="135" y="15" width="115" height="22" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1" />
          <text x="192" y="30" textAnchor="middle" className="text-[10px] font-black fill-indigo-900 font-mono">
            H / 24 = 2 / 3
          </text>
        </svg>
      ),
      steps: [
        { label: "Multiplica h · S = 2 · 24:", key: "num", answer: 48, unit: "" },
        { label: "Divide por la sombra de la vara (48 ÷ 3):", key: "height", answer: 16, unit: "m" }
      ],
      explanation: "Por Thales: H / 24 = 2 / 3 -> H = (2 · 24) / 3 = 48 / 3 = 16 metros."
    }
  ];

  const handleVerifyStep = (challengeId: number, stepKey: string, expectedAnswer: number) => {
    const rawVal = userInputs[`${challengeId}_${stepKey}`] || '';
    const cleanVal = parseFloat(rawVal.replace(',', '.').trim());

    if (isNaN(cleanVal)) {
      setFeedbacks(prev => ({
        ...prev,
        [`${challengeId}_${stepKey}`]: { ok: false, msg: 'Introduce un número válido.' }
      }));
      return;
    }

    const isCorrect = Math.abs(cleanVal - expectedAnswer) < 0.25;
    setFeedbacks(prev => ({
      ...prev,
      [`${challengeId}_${stepKey}`]: {
        ok: isCorrect,
        msg: isCorrect ? '¡Correcto! Excelente deducción geométrica.' : `No coincide. Revisa la operación (esperado: ${expectedAnswer}).`
      }
    }));

    // Check if challenge is complete
    const current = challenges[challengeId];
    const allCorrect = current.steps.every(s => {
      if (s.key === stepKey) return isCorrect;
      const f = feedbacks[`${challengeId}_${s.key}`];
      return f && f.ok;
    });

    if (allCorrect && !completedChallenges.includes(challengeId)) {
      setCompletedChallenges(prev => [...prev, challengeId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 no-scrollbar border-b border-slate-200">
        {[
          { id: 'parallel-angles', label: '1. Paralelas & 180°', icon: Compass },
          { id: 'triangle-lab', label: '2. Laboratorio & Tipos', icon: Triangle },
          { id: 'pythagoras', label: '3. Pitágoras (a²+b²=c²)', icon: Layers },
          { id: 'thales', label: '4. Teorema de Thales', icon: Sun },
          { id: 'challenges', label: '5. Desafíos Prácticos', icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-2xl font-black text-xs md:text-sm uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
                isActive
                  ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-200 scale-105 z-10'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PARALELAS Y LA SUMA DE 180°                                        */}
      {/* ========================================================================= */}
      {activeTab === 'parallel-angles' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Teacher 
            message="¿Alguna vez te has preguntado por qué los 3 ángulos de TODO triángulo plano suman exactamente 180°? La respuesta se esconde en las rectas paralelas cortadas por una secante."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Parallel Lines Interactive SVG */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Rectas Paralelas &amp; Secante</h3>
                  <p className="text-xs text-slate-500 font-bold">Gira la secante para ver cómo los ángulos se trasladan idénticamente</p>
                </div>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono font-black text-xs px-3 py-1 rounded-full">
                  θ = {transversalAngle}°
                </span>
              </div>

              {/* Slider for Transversal Angle */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-xs font-black text-slate-700">
                  <span>Ángulo de Inclinación de la Secante:</span>
                  <span className="text-amber-600 font-mono">{transversalAngle}° / {180 - transversalAngle}°</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="155"
                  value={transversalAngle}
                  onChange={(e) => setTransversalAngle(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Interactive SVG */}
              <div className="bg-slate-900 rounded-2xl p-4 overflow-hidden shadow-inner flex items-center justify-center">
                <svg viewBox="0 0 420 280" className="w-full max-w-md h-auto select-none">
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid-par" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="420" height="280" fill="url(#grid-par)" />

                  {/* Parallel Line L1 */}
                  <line x1="30" y1="80" x2="390" y2="80" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <text x="400" y="85" fill="#38bdf8" fontSize="13" fontWeight="900">L₁</text>

                  {/* Parallel Line L2 */}
                  <line x1="30" y1="200" x2="390" y2="200" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <text x="400" y="205" fill="#38bdf8" fontSize="13" fontWeight="900">L₂</text>

                  {/* Parallel markers */}
                  <path d="M 330 75 L 340 80 L 330 85" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                  <path d="M 330 195 L 340 200 L 330 205" fill="none" stroke="#38bdf8" strokeWidth="2.5" />

                  {/* Transversal Line S */}
                  {(() => {
                    const rad = (transversalAngle * Math.PI) / 180;
                    const cx1 = 210, cy1 = 140;
                    const len = 160;
                    const dx = len * Math.cos(rad);
                    const dy = len * Math.sin(rad);
                    const x1 = cx1 - dx;
                    const y1 = cy1 + dy;
                    const x2 = cx1 + dx;
                    const y2 = cy1 - dy;

                    // Intersection 1 with L1 (y = 80)
                    const int1X = cx1 + (80 - cy1) / Math.tan(-rad);
                    // Intersection 2 with L2 (y = 200)
                    const int2X = cx1 + (200 - cy1) / Math.tan(-rad);

                    return (
                      <g>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                        <text x={x2 + 10} y={y2} fill="#f59e0b" fontSize="13" fontWeight="900">S (Secante)</text>

                        {/* Angle Arcs at Intersection 1 (L1) */}
                        <circle cx={int1X} cy="80" r="5" fill="#f59e0b" />
                        {/* Acute angle α */}
                        <path d={`M ${int1X + 26} 80 A 26 26 0 0 0 ${int1X + 26 * Math.cos(rad)} ${80 - 26 * Math.sin(rad)}`} fill="rgba(245, 158, 11, 0.25)" stroke="#fbbf24" strokeWidth="2" />
                        <text x={int1X + 32} y="72" fill="#fbbf24" fontSize="11" fontWeight="bold">α = {transversalAngle}°</text>

                        {/* Alternate Internal Angle α at Intersection 2 (L2) */}
                        <circle cx={int2X} cy="200" r="5" fill="#f59e0b" />
                        <path d={`M ${int2X - 26} 200 A 26 26 0 0 0 ${int2X - 26 * Math.cos(rad)} ${200 + 26 * Math.sin(rad)}`} fill="rgba(245, 158, 11, 0.25)" stroke="#fbbf24" strokeWidth="2" />
                        <text x={int2X - 75} y="222" fill="#fbbf24" fontSize="11" fontWeight="bold">α = {transversalAngle}°</text>

                        {/* Corresponding angle α at L2 */}
                        <path d={`M ${int2X + 26} 200 A 26 26 0 0 0 ${int2X + 26 * Math.cos(rad)} ${200 - 26 * Math.sin(rad)}`} fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="2" />
                        <text x={int2X + 32} y="192" fill="#38bdf8" fontSize="11" fontWeight="bold">α = {transversalAngle}°</text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Angle Relationships Explanations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-black text-amber-900 block mb-1">Alternos Internos</span>
                  <p className="text-slate-600 font-medium leading-relaxed">Están entre las paralelas a lados opuestos de la secante. <strong>Son exactamente iguales</strong>.</p>
                </div>
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                  <span className="font-black text-sky-900 block mb-1">Correspondientes</span>
                  <p className="text-slate-600 font-medium leading-relaxed">Están en la misma posición relativa en cada intersección. <strong>Son exactamente iguales</strong>.</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <span className="font-black text-indigo-900 block mb-1">Suplementarios</span>
                  <p className="text-slate-600 font-medium leading-relaxed">Los ángulos consecutivos sobre una misma recta siempre suman <strong>180°</strong>.</p>
                </div>
              </div>
            </div>

            {/* Right: The 180° Proof on Triangles */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  Demostración Universal
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">¿Por qué α + β + γ = 180°?</h3>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Si trazamos una <strong>línea auxiliar paralela a la base</strong> que pase justo por el vértice superior de cualquier triángulo, los ángulos de la base se proyectan arriba por alternos internos:
              </p>

              {/* Triangle Sum Visual Diagram */}
              <div className="bg-slate-950 rounded-2xl p-4 flex flex-col items-center">
                <svg viewBox="0 0 320 200" className="w-full max-w-xs select-none">
                  {/* Auxiliary Parallel Line at top vertex */}
                  <line x1="20" y1="50" x2="300" y2="50" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />
                  <text x="240" y="42" fill="#f59e0b" fontSize="10" fontWeight="bold">Paralela a la base</text>

                  {/* Triangle Base */}
                  <line x1="50" y1="160" x2="270" y2="160" stroke="#38bdf8" strokeWidth="3" />
                  {/* Left Side */}
                  <line x1="50" y1="160" x2="160" y2="50" stroke="#cbd5e1" strokeWidth="3" />
                  {/* Right Side */}
                  <line x1="270" y1="160" x2="160" y2="50" stroke="#cbd5e1" strokeWidth="3" />

                  {/* Angle Arcs at Base */}
                  <text x="75" y="152" fill="#38bdf8" fontSize="12" fontWeight="black">α</text>
                  <text x="235" y="152" fill="#a855f7" fontSize="12" fontWeight="black">β</text>
                  <text x="154" y="85" fill="#10b981" fontSize="12" fontWeight="black">γ</text>

                  {/* Projected Angles at Top Vertex */}
                  <text x="110" y="42" fill="#38bdf8" fontSize="12" fontWeight="black">α</text>
                  <text x="195" y="42" fill="#a855f7" fontSize="12" fontWeight="black">β</text>

                  {/* Straight line arc symbol at top */}
                  <path d="M 100 50 A 60 60 0 0 1 220 50" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                </svg>

                <div className="mt-2 font-mono font-black text-sm text-amber-400 bg-slate-900 px-4 py-1.5 rounded-xl border border-slate-700 text-center">
                  α + γ + β = 180° (Línea recta llana)
                </div>
              </div>

              {/* Dynamic Angle Sum Calculator */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Simulador de los 3 Ángulos:
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500">Ángulo α: {triangleSumAngleA}°</label>
                    <input
                      type="range"
                      min="15"
                      max="120"
                      value={triangleSumAngleA}
                      onChange={(e) => {
                        const newA = Number(e.target.value);
                        if (newA + triangleSumAngleB < 170) setTriangleSumAngleA(newA);
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg accent-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500">Ángulo β: {triangleSumAngleB}°</label>
                    <input
                      type="range"
                      min="15"
                      max="120"
                      value={triangleSumAngleB}
                      onChange={(e) => {
                        const newB = Number(e.target.value);
                        if (triangleSumAngleA + newB < 170) setTriangleSumAngleB(newB);
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg accent-purple-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>Tercer Ángulo γ = 180° - ({triangleSumAngleA}° + {triangleSumAngleB}°):</span>
                  <span className="text-emerald-700 font-mono font-black text-sm">{triangleSumAngleC}°</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LABORATORIO Y CLASIFICACIÓN DE TRIÁNGULOS                          */}
      {/* ========================================================================= */}
      {activeTab === 'triangle-lab' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Teacher 
            message="¡Arrastra los vértices A, B y C! Observa cómo cambian en tiempo real las longitudes de los lados, las aperturas de los ángulos y la clasificación del triángulo."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Draggable Interactive Triangle Canvas */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Laboratorio Geométrico</h3>
                  <p className="text-xs text-slate-500 font-bold">Haz clic y arrastra los círculos naranja para deformar el triángulo</p>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button onClick={() => setPreset('equilateral')} className="px-2.5 py-1 text-xs font-black bg-amber-50 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-100">Equilátero</button>
                  <button onClick={() => setPreset('right')} className="px-2.5 py-1 text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg hover:bg-emerald-100">Rectángulo</button>
                  <button onClick={() => setPreset('isosceles')} className="px-2.5 py-1 text-xs font-black bg-blue-50 text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-100">Isósceles</button>
                  <button onClick={() => setPreset('obtuse')} className="px-2.5 py-1 text-xs font-black bg-rose-50 text-rose-800 border border-rose-300 rounded-lg hover:bg-rose-100">Obtusángulo</button>
                </div>
              </div>

              {/* Interactive Draggable SVG Canvas */}
              <div className="bg-slate-950 rounded-2xl p-2 border-2 border-slate-800 overflow-hidden relative shadow-inner">
                <svg
                  ref={svgLabRef}
                  viewBox="0 0 400 300"
                  className="w-full h-auto cursor-crosshair touch-none select-none"
                  onPointerMove={handleLabPointerMove}
                  onPointerUp={stopDragging}
                  onPointerLeave={stopDragging}
                >
                  <defs>
                    <pattern id="lab-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="400" height="300" fill="url(#lab-grid)" />

                  {/* Filled Triangle Body */}
                  <polygon
                    points={`${vertexA.x},${vertexA.y} ${vertexB.x},${vertexB.y} ${vertexC.x},${vertexC.y}`}
                    fill="rgba(99, 102, 241, 0.18)"
                    stroke="#818cf8"
                    strokeWidth="3"
                  />

                  {/* Side Length Labels */}
                  {/* Side a (BC) */}
                  <text
                    x={(vertexB.x + vertexC.x) / 2}
                    y={(vertexB.y + vertexC.y) / 2 + 18}
                    fill="#38bdf8"
                    fontSize="12"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    a = {sideA.toFixed(1)} u
                  </text>
                  {/* Side b (AC) */}
                  <text
                    x={(vertexA.x + vertexC.x) / 2 + 15}
                    y={(vertexA.y + vertexC.y) / 2}
                    fill="#a855f7"
                    fontSize="12"
                    fontWeight="black"
                  >
                    b = {sideB.toFixed(1)} u
                  </text>
                  {/* Side c (AB) */}
                  <text
                    x={(vertexA.x + vertexB.x) / 2 - 25}
                    y={(vertexA.y + vertexB.y) / 2}
                    fill="#f59e0b"
                    fontSize="12"
                    fontWeight="black"
                  >
                    c = {sideC.toFixed(1)} u
                  </text>

                  {/* Angle labels near vertices */}
                  <text x={vertexA.x - 10} y={vertexA.y - 12} fill="#e2e8f0" fontSize="11" fontWeight="bold">
                    A ({angleA.toFixed(0)}°)
                  </text>
                  <text x={vertexB.x - 20} y={vertexB.y + 22} fill="#e2e8f0" fontSize="11" fontWeight="bold">
                    B ({angleB.toFixed(0)}°)
                  </text>
                  <text x={vertexC.x + 10} y={vertexC.y + 22} fill="#e2e8f0" fontSize="11" fontWeight="bold">
                    C ({angleC.toFixed(0)}°)
                  </text>

                  {/* Draggable Vertex Handles */}
                  <circle
                    cx={vertexA.x}
                    cy={vertexA.y}
                    r={draggingVertex === 'A' ? 14 : 10}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="3"
                    className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                    onPointerDown={(e) => { e.stopPropagation(); setDraggingVertex('A'); }}
                  />
                  <circle
                    cx={vertexB.x}
                    cy={vertexB.y}
                    r={draggingVertex === 'B' ? 14 : 10}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="3"
                    className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                    onPointerDown={(e) => { e.stopPropagation(); setDraggingVertex('B'); }}
                  />
                  <circle
                    cx={vertexC.x}
                    cy={vertexC.y}
                    r={draggingVertex === 'C' ? 14 : 10}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="3"
                    className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                    onPointerDown={(e) => { e.stopPropagation(); setDraggingVertex('C'); }}
                  />
                </svg>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span>Perímetro: <strong>{(sideA + sideB + sideC).toFixed(1)} u</strong></span>
                <span>Suma de Ángulos: <strong className="text-emerald-600">{(angleA + angleB + angleC).toFixed(0)}°</strong></span>
                <span>Desigualdad Triangular: <strong className="text-indigo-600">Válida (a+b &gt; c)</strong></span>
              </div>
            </div>

            {/* Right: Live Classification Diagnostics */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
                  Diagnóstico en Tiempo Real
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Clasificación Activa</h3>
              </div>

              {/* Classification Cards */}
              <div className="space-y-4">
                {/* Side classification */}
                {(() => {
                  const sClass = getSideClassification();
                  return (
                    <div className={`p-4 rounded-2xl border-2 ${sClass.color} space-y-1`}>
                      <span className="text-[10px] uppercase font-black tracking-widest block opacity-75">Por la Longitud de sus Lados:</span>
                      <h4 className="text-lg font-black">{sClass.name}</h4>
                      <p className="text-xs font-medium leading-relaxed">{sClass.desc}</p>
                    </div>
                  );
                })()}

                {/* Angle classification */}
                {(() => {
                  const aClass = getAngleClassification();
                  return (
                    <div className={`p-4 rounded-2xl border-2 ${aClass.color} space-y-1`}>
                      <span className="text-[10px] uppercase font-black tracking-widest block opacity-75">Por la Medida de sus Ángulos:</span>
                      <h4 className="text-lg font-black">{aClass.name}</h4>
                      <p className="text-xs font-medium leading-relaxed">{aClass.desc}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Educational Reference Table */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Propiedad Fundamental:</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  <strong>Desigualdad Triangular:</strong> Para que tres segmentos formen un triángulo cerrado, cualquier lado debe ser menor que la suma de los otros dos:
                </p>
                <div className="font-mono text-[11px] font-black text-indigo-800 bg-white p-2 rounded-xl border border-slate-200 text-center">
                  a + b &gt; c &nbsp;|&nbsp; a + c &gt; b &nbsp;|&nbsp; b + c &gt; a
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TEOREMA DE PITÁGORAS (a² + b² = c²)                                */}
      {/* ========================================================================= */}
      {activeTab === 'pythagoras' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Teacher 
            message="El Teorema de Pitágoras no es solo una fórmula algebraica: ¡es una igualdad de áreas geométricas! El área de los cuadrados construidos sobre los catetos cabe exactamente en el cuadrado de la hipotenusa."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Visual Geometric Proof SVG */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Demostración Visual de Áreas</h3>
                  <p className="text-xs text-slate-500 font-bold">Cateto a² ({pythA2}) + Cateto b² ({pythB2}) = Hipotenusa c² ({pythC2.toFixed(0)})</p>
                </div>
                <button
                  onClick={() => setShowProofGrid(!showProofGrid)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-colors ${
                    showProofGrid ? 'bg-indigo-50 border-indigo-300 text-indigo-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  {showProofGrid ? 'Ocultar Cuadrícula' : 'Ver Cuadrícula'}
                </button>
              </div>

              {/* Visual Pythagoras Canvas */}
              <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center shadow-inner overflow-hidden">
                <svg viewBox="0 0 440 400" className="w-full max-w-md h-auto select-none">
                  {/* Origin is at (140, 245) */}
                  {(() => {
                    const ox = 140, oy = 245;
                    const scale = 20;
                    const w = pythB * scale; // horizontal leg b (to right)
                    const h = pythA * scale; // vertical leg a (upwards)

                    const pC = { x: ox, y: oy };           // Right angle vertex
                    const pA = { x: ox, y: oy - h };       // Top vertex
                    const pB = { x: ox + w, y: oy };       // Right vertex

                    // Outward perpendicular vector for hypotenuse square (pointing outside the triangle towards top-right)
                    const vx = pB.x - pA.x; // = w > 0
                    const vy = pB.y - pA.y; // = h > 0
                    const px = vy;          // = h > 0 (to the right)
                    const py = -vx;         // = -w < 0 (upwards)
                    const p3 = { x: pB.x + px, y: pB.y + py };
                    const p4 = { x: pA.x + px, y: pA.y + py };

                    // Center of hypotenuse square for label
                    const centerHypX = (pA.x + pB.x + p3.x + p4.x) / 4;
                    const centerHypY = (pA.y + pB.y + p3.y + p4.y) / 4;

                    return (
                      <g>
                        {/* Square on Leg a (to left) */}
                        <rect
                          x={ox - h}
                          y={oy - h}
                          width={h}
                          height={h}
                          fill="rgba(56, 189, 248, 0.25)"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                        />
                        {/* Optional grid on square a */}
                        {showProofGrid && Array.from({ length: pythA - 1 }).map((_, i) => (
                          <g key={`grida-${i}`} opacity="0.35">
                            <line x1={ox - h} y1={oy - (i + 1) * scale} x2={ox} y2={oy - (i + 1) * scale} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                            <line x1={ox - (i + 1) * scale} y1={oy - h} x2={ox - (i + 1) * scale} y2={oy} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                          </g>
                        ))}
                        <text x={ox - h / 2} y={oy - h / 2 + 5} fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">
                          a² = {pythA2}
                        </text>

                        {/* Square on Leg b (downwards) */}
                        <rect
                          x={ox}
                          y={oy}
                          width={w}
                          height={w}
                          fill="rgba(168, 85, 247, 0.25)"
                          stroke="#a855f7"
                          strokeWidth="2.5"
                        />
                        {/* Optional grid on square b */}
                        {showProofGrid && Array.from({ length: pythB - 1 }).map((_, i) => (
                          <g key={`gridb-${i}`} opacity="0.35">
                            <line x1={ox} y1={oy + (i + 1) * scale} x2={ox + w} y2={oy + (i + 1) * scale} stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
                            <line x1={ox + (i + 1) * scale} y1={oy} x2={ox + (i + 1) * scale} y2={oy + w} stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
                          </g>
                        ))}
                        <text x={ox + w / 2} y={oy + w / 2 + 5} fill="#a855f7" fontSize="13" fontWeight="900" textAnchor="middle">
                          b² = {pythB2}
                        </text>

                        {/* Hypotenuse square (projected OUTWARDS on side c) */}
                        <polygon
                          points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
                          fill="rgba(16, 185, 129, 0.25)"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />
                        {/* Optional grid diagonals/lines on hypotenuse square */}
                        {showProofGrid && (
                          <g opacity="0.25">
                            <line x1={pA.x} y1={pA.y} x2={p3.x} y2={p3.y} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1={pB.x} y1={pB.y} x2={p4.x} y2={p4.y} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                          </g>
                        )}
                        <text
                          x={centerHypX}
                          y={centerHypY + 5}
                          fill="#10b981"
                          fontSize="14"
                          fontWeight="900"
                          textAnchor="middle"
                        >
                          c² = {pythC2.toFixed(0)}
                        </text>

                        {/* Main Right Triangle */}
                        <polygon
                          points={`${pC.x},${pC.y} ${pA.x},${pA.y} ${pB.x},${pB.y}`}
                          fill="rgba(245, 158, 11, 0.4)"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                        />

                        {/* Right angle marker at pC */}
                        <rect x={ox} y={oy - 14} width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <circle cx={ox + 7} cy={oy - 7} r="2" fill="#f59e0b" />

                        {/* Labels on Triangle */}
                        <text x={ox + 8} y={oy - h / 2 + 4} fill="#38bdf8" fontSize="12" fontWeight="black">a = {pythA}</text>
                        <text x={ox + w / 2} y={oy - 8} fill="#a855f7" fontSize="12" fontWeight="black" textAnchor="middle">b = {pythB}</text>
                        <text x={(pA.x + pB.x) / 2 + 10} y={(pA.y + pB.y) / 2 - 12} fill="#10b981" fontSize="13" fontWeight="black">c = {pythC.toFixed(2)}</text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Sliders to Adjust Catetos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-black text-slate-700">
                    <span>Cateto a (Vertical):</span>
                    <span className="text-sky-600 font-mono font-black">{pythA} u (a² = {pythA2})</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="1"
                    value={pythA}
                    onChange={(e) => setPythA(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg accent-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-black text-slate-700">
                    <span>Cateto b (Horizontal):</span>
                    <span className="text-purple-600 font-mono font-black">{pythB} u (b² = {pythB2})</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="1"
                    value={pythB}
                    onChange={(e) => setPythB(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg accent-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Right: Formulas and Step-by-Step Clears */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Fórmulas &amp; Despejes
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Cálculo de Lados</h3>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setPythMode('hypotenuse')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-colors ${
                    pythMode === 'hypotenuse' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Hallar Hipotenusa (c)
                </button>
                <button
                  onClick={() => setPythMode('leg')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-colors ${
                    pythMode === 'leg' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Hallar Cateto (a ó b)
                </button>
              </div>

              {/* Step By Step Formula Card */}
              {pythMode === 'hypotenuse' ? (
                <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-3">
                  <span className="text-xs font-black uppercase text-emerald-900 tracking-wider block">Fórmula de Hipotenusa:</span>
                  <div className="text-center font-mono text-lg font-black text-emerald-800 bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                    c = √(a² + b²)
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                    <p>1. Elevar al cuadrado los catetos: {pythA}² = <strong>{pythA2}</strong> y {pythB}² = <strong>{pythB2}</strong></p>
                    <p>2. Sumar las áreas: {pythA2} + {pythB2} = <strong>{pythA2 + pythB2}</strong></p>
                    <p>3. Extraer la raíz cuadrada: c = √{pythA2 + pythB2} = <strong className="text-emerald-700 text-sm font-black">{pythC.toFixed(4)}</strong></p>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-sky-50 rounded-2xl border-2 border-sky-300 space-y-3">
                  <span className="text-xs font-black uppercase text-sky-900 tracking-wider block">Fórmula de Despeje de Cateto:</span>
                  <div className="text-center font-mono text-lg font-black text-sky-800 bg-white p-3 rounded-xl border border-sky-200 shadow-xs">
                    a = √(c² - b²)
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                    <p>1. Elevar al cuadrado la hipotenusa: {pythC.toFixed(2)}² = <strong>{pythC2.toFixed(0)}</strong></p>
                    <p>2. Restar el cateto conocido: {pythC2.toFixed(0)} - {pythB2} = <strong>{(pythC2 - pythB2).toFixed(0)}</strong></p>
                    <p>3. Extraer raíz: a = √{(pythC2 - pythB2).toFixed(0)} = <strong className="text-sky-700 text-sm font-black">{pythA}</strong></p>
                  </div>
                </div>
              )}

              {/* Real World Note */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1 text-xs text-amber-950 font-medium">
                <span className="font-black block text-amber-900">💡 Ternas Pitagóricas Famosas:</span>
                <p>Las combinaciones de números enteros más usadas en arquitectura y pruebas son <strong>(3, 4, 5)</strong>, <strong>(5, 12, 13)</strong> y <strong>(8, 15, 17)</strong>.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TEOREMA DE THALES (Pirámide de Egipto & Sombras)                    */}
      {/* ========================================================================= */}
      {activeTab === 'thales' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Teacher 
            message="Hace más de 2.600 años, Thales de Mileto calculó la altura exacta de la Gran Pirámide de Egipto sin escalarla, comparando la sombra de un bastón con la sombra de la pirámide. ¡Así nació la trigonometría!"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Desert Simulation SVG */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">El Desafío de Thales en Egipto</h3>
                  <p className="text-xs text-slate-500 font-bold">Ajusta la altura del Sol para ver cómo las sombras crecen de forma proporcional</p>
                </div>
                <span className="bg-amber-100 text-amber-950 border border-amber-300 font-mono font-black text-xs px-3 py-1 rounded-full">
                  Sol = {sunAngle}°
                </span>
              </div>

              {/* Sun Angle Slider */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-black text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Sun size={15} className="text-amber-500" /> Ángulo de Elevación Solar (θ):
                  </span>
                  <span className="text-amber-600 font-mono font-black">{sunAngle}°</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="65"
                  value={sunAngle}
                  onChange={(e) => setSunAngle(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg accent-amber-500"
                />
              </div>

              {/* Interactive Thales Desert Scene */}
              <div className="bg-gradient-to-b from-sky-950 via-indigo-950 to-amber-950 rounded-2xl p-4 shadow-inner overflow-hidden relative">
                <svg viewBox="0 0 460 260" className="w-full h-auto select-none">
                  {/* Sun Position */}
                  {(() => {
                    const sunR = (sunAngle * Math.PI) / 180;
                    const sunX = 40 + (1 - Math.cos(sunR)) * 60;
                    const sunY = 40 + (1 - Math.sin(sunR)) * 40;
                    return (
                      <g>
                        <circle cx={sunX} cy={sunY} r="22" fill="#fbbf24" filter="drop-shadow(0 0 16px rgba(251,191,36,0.8))" />
                        <circle cx={sunX} cy={sunY} r="15" fill="#fef08a" />
                        {/* Sun rays dashed */}
                        <line x1={sunX} y1={sunY} x2="160" y2="190" stroke="rgba(251,191,36,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1={sunX} y1={sunY} x2="380" y2="190" stroke="rgba(251,191,36,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                      </g>
                    );
                  })()}

                  {/* Desert Ground */}
                  <line x1="10" y1="190" x2="450" y2="190" stroke="#d97706" strokeWidth="4" />
                  <path d="M 0 190 Q 230 195 460 190 L 460 260 L 0 260 Z" fill="#78350f" opacity="0.5" />

                  {/* 1. THE GREAT PYRAMID */}
                  {/* Height is scaled to 110px */}
                  <polygon points="120,80 50,190 190,190" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                  {/* Shadow of Pyramid to the right */}
                  {(() => {
                    const shadowLen = 110 / Math.tan(radSun);
                    return (
                      <polygon
                        points={`190,190 120,80 ${190 + shadowLen},190`}
                        fill="rgba(0, 0, 0, 0.45)"
                      />
                    );
                  })()}
                  {/* Height line inside pyramid */}
                  <line x1="120" y1="80" x2="120" y2="190" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 3" />
                  <text x="125" y="140" fill="#ffffff" fontSize="12" fontWeight="black">H = 146.6 m</text>
                  <text x="120" y="210" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">Pirámide</text>

                  {/* 2. THALES' STICK (BASTÓN) */}
                  {/* Placed at x = 360, height = 35px */}
                  <line x1="360" y1="155" x2="360" y2="190" stroke="#38bdf8" strokeWidth="4" />
                  {/* Shadow of stick */}
                  {(() => {
                    const stickShadowLen = 35 / Math.tan(radSun);
                    return (
                      <g>
                        <line x1="360" y1="190" x2={360 + stickShadowLen} y2="190" stroke="rgba(0,0,0,0.6)" strokeWidth="6" />
                        <line x1="360" y1="155" x2={360 + stickShadowLen} y2="190" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                      </g>
                    );
                  })()}
                  <text x="365" y="175" fill="#38bdf8" fontSize="11" fontWeight="black">h = {stickHeight} m</text>
                  <text x="360" y="210" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Bastón</text>

                  {/* Angle θ markers */}
                  <text x="75" y="182" fill="#fbbf24" fontSize="10" fontWeight="bold">θ = {sunAngle}°</text>
                  <text x="385" y="182" fill="#38bdf8" fontSize="10" fontWeight="bold">θ = {sunAngle}°</text>
                </svg>
              </div>

              {/* Proportions Bar */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold block">Sombra de la Pirámide (S):</span>
                  <span className="font-mono font-black text-amber-700 text-sm">{pyramidShadow.toFixed(1)} metros</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Sombra del Bastón (s):</span>
                  <span className="font-mono font-black text-sky-700 text-sm">{stickShadow.toFixed(2)} metros</span>
                </div>
              </div>
            </div>

            {/* Right: The Theorem Formula and Math Explanation */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  Principio de Semejanza
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">La Proporción de Thales</h3>
              </div>

              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Como los rayos del sol llegan con el mismo ángulo (theta: <MathFormula formula="\theta" />) a ambos objetos, los triángulos formados por la altura y la sombra son <strong>semejantes</strong>:
              </p>

              {/* Main Proportions Box */}
              <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 text-center space-y-4">
                <span className="text-xs font-black uppercase text-amber-900 tracking-wider block">Razón de Proporcionalidad:</span>
                
                {/* Word Ratio Fraction */}
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs text-slate-900 flex items-center justify-center overflow-x-auto">
                  <MathFormula 
                    formula="\frac{\textit{Altura Pirámide}}{\textit{Sombra Pirámide}} = \frac{\textit{Altura Bastón}}{\textit{Sombra Bastón}}" 
                    block={true}
                  />
                </div>

                {/* Algebraic Ratio Formula with Arrow */}
                <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 text-indigo-950 flex items-center justify-center overflow-x-auto">
                  <MathFormula 
                    formula="\frac{H}{S} = \frac{h}{s} \rightarrow H = \frac{h \cdot S}{s}" 
                    block={true}
                  />
                </div>
              </div>

              {/* Live Evaluation Check */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700 font-medium">
                <span className="font-black text-slate-900 block">Comprobación con los datos actuales:</span>
                <p>• Razón del bastón: {stickHeight} m ÷ {stickShadow.toFixed(2)} m = <strong>{(stickHeight / stickShadow).toFixed(4)}</strong></p>
                <p>• Razón de la pirámide: 146.6 m ÷ {pyramidShadow.toFixed(1)} m = <strong>{(146.6 / pyramidShadow).toFixed(4)}</strong></p>
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-900 font-bold text-center">
                  ¡Las proporciones son exactamente idénticas! (tan {sunAngle}° = {(Math.tan(radSun)).toFixed(4)})
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DESAFÍOS PASO A PASO CON CALCULADORA                               */}
      {/* ========================================================================= */}
      {activeTab === 'challenges' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Teacher 
            message="¡Hora de poner en práctica lo aprendido! Resuelve los siguientes problemas paso a paso. Recuerda que tienes la calculadora científica disponible arriba para hacer cualquier cálculo rápido."
          />

          {/* Challenge Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {challenges.map((c, idx) => {
              const isCompleted = completedChallenges.includes(c.id);
              const isCurrent = currentChallenge === idx;
              return (
                <button
                  key={c.id}
                  onClick={() => setCurrentChallenge(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border-2 whitespace-nowrap ${
                    isCurrent
                      ? 'bg-indigo-600 border-indigo-700 text-white shadow-md'
                      : isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={15} className="text-emerald-600" /> : <span>{idx + 1}.</span>}
                  <span>Desafío {idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Current Challenge Card */}
          {(() => {
            const ch = challenges[currentChallenge];
            const isCompleted = completedChallenges.includes(ch.id);

            return (
              <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-slate-200 shadow-sm space-y-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
                      {ch.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">{ch.title}</h3>
                  </div>

                  {isCompleted && (
                    <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-400 text-emerald-800 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider shadow-sm animate-bounce">
                      <Award size={18} className="text-emerald-600" />
                      <span>¡Desafío Superado!</span>
                    </div>
                  )}
                </div>

                {/* Problem Statement */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-6">
                    {/* Visual Drawing / Illustration */}
                    {ch.svg && (
                      <div className="bg-slate-50/80 p-3 md:p-5 rounded-3xl border-2 border-slate-200 flex items-center justify-center shadow-xs overflow-hidden">
                        {ch.svg}
                      </div>
                    )}

                    <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
                      {ch.description}
                    </p>

                    {/* Given data tags */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(ch.given).map(([k, v]) => (
                        <div key={k} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
                          <span className="text-slate-400">{k}:</span> <strong className="text-slate-900">{v}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Formula Highlight */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-amber-900">Fórmula Guía:</span>
                      <div className="font-mono text-base font-black text-amber-950">
                        <MathFormula formula={ch.formula} />
                      </div>
                    </div>
                  </div>

                  {/* Right: Step-by-Step Inputs */}
                  <div className="lg:col-span-5 bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 space-y-6">
                    <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Calculator size={16} className="text-indigo-600" />
                      <span>Pasos de Resolución</span>
                    </h4>

                    <div className="space-y-4">
                      {ch.steps.map((step, sIdx) => {
                        const inputKey = `${ch.id}_${step.key}`;
                        const fb = feedbacks[inputKey];
                        const val = userInputs[inputKey] || '';

                        return (
                          <div key={step.key} className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                            <label className="text-xs font-bold text-slate-700 block">
                              {sIdx + 1}. {step.label}
                            </label>
                            
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => setUserInputs(prev => ({ ...prev, [inputKey]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleVerifyStep(ch.id, step.key, step.answer);
                                }}
                                placeholder="Escribe el resultado..."
                                className="flex-1 px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl font-mono text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                              />
                              {step.unit && (
                                <span className="font-bold text-xs text-slate-500">{step.unit}</span>
                              )}
                              <button
                                onClick={() => handleVerifyStep(ch.id, step.key, step.answer)}
                                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-xs"
                              >
                                Verificar
                              </button>
                            </div>

                            {fb && (
                              <p className={`text-xs font-bold ${fb.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {fb.msg}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {isCompleted && (
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                        <span className="font-black block text-emerald-900">Explicación Paso a Paso:</span>
                        <p>{ch.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    disabled={currentChallenge === 0}
                    onClick={() => setCurrentChallenge(prev => prev - 1)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={16} strokeWidth={3} /> Desafío Anterior
                  </button>

                  {currentChallenge < challenges.length - 1 ? (
                    <button
                      onClick={() => setCurrentChallenge(prev => prev + 1)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
                    >
                      Siguiente Desafío <ChevronRight size={16} strokeWidth={3} />
                    </button>
                  ) : (
                    <button
                      onClick={onFinish}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                    >
                      ¡Completar Módulo! <Award size={16} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};
