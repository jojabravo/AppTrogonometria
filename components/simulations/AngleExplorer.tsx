import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AngleType } from '../../types';
import { Rocket, Moon, Play, Pause, RefreshCw } from 'lucide-react';

export const AngleExplorer: React.FC = () => {
  const [angle, setAngle] = useState(45);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const containerRef = useRef<SVGSVGElement>(null);

  // Animación de órbita
  useEffect(() => {
    let requestRef: number;
    const animate = () => {
      if (isOrbiting) {
        setAngle((prev) => (prev + 1) % 360);
      }
      requestRef = requestAnimationFrame(animate);
    };
    requestRef = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef);
  }, [isOrbiting]);

  const getAngleType = (deg: number): AngleType => {
    if (deg === 0) return 'nulo';
    if (deg < 90) return 'agudo';
    if (deg === 90) return 'recto';
    if (deg < 180) return 'obtuso';
    if (deg === 180) return 'llano';
    if (deg < 360) return 'reflejo';
    return 'completo';
  };

  const getNarrative = (type: AngleType) => {
    switch (type) {
      case 'nulo': return 'Misión en plataforma: 0°. Listos para el despegue.';
      case 'agudo': return 'Ascenso inicial: Ángulo agudo. Ganando altura.';
      case 'recto': return 'Maniobra perpendicular: 90°. Cambio de trayectoria.';
      case 'obtuso': return 'Apertura amplia: Explorando el lado lejano.';
      case 'llano': return 'Alineación perfecta: 180°. El horizonte lunar.';
      case 'reflejo': return 'Retorno orbital: Rodeando la cara oculta.';
      case 'completo': return 'Órbita completada: 360°. ¡Misión exitosa!';
      default: return '';
    }
  };

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isOrbiting) setIsOrbiting(false); // Detener órbita si el usuario interactúa
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    let deg = Math.atan2(-y, x) * (180 / Math.PI);
    if (deg < 0) deg += 360;
    setAngle(Math.round(deg));
  }, [isOrbiting]);

  const type = getAngleType(angle);
  const rad = -angle * Math.PI / 180;
  const rocketX = 200 + 170 * Math.cos(rad);
  const rocketY = 200 + 170 * Math.sin(rad);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-900 p-6 md:p-10 rounded-[3rem] shadow-2xl overflow-hidden relative border-4 border-slate-800">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center relative z-10">
        <div className="absolute top-0 right-0 flex gap-2">
           <button 
             onClick={() => setIsOrbiting(!isOrbiting)}
             className={`p-4 rounded-full transition-all shadow-lg ${isOrbiting ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}
             title={isOrbiting ? "Detener Órbita" : "Iniciar Órbita"}
           >
             {isOrbiting ? <Pause size={24} /> : <Play size={24} />}
           </button>
        </div>

        <svg 
          ref={containerRef}
          viewBox="0 0 400 400" 
          className="w-full max-w-[400px] aspect-square cursor-crosshair touch-none select-none"
          onMouseMove={(e) => e.buttons === 1 && handleInteraction(e)}
          onMouseDown={handleInteraction}
          onTouchMove={handleInteraction}
        >
          {/* Guía de órbita */}
          <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="10 5" />
          
          {/* Transportador espacial */}
          {[...Array(12)].map((_, i) => {
            const d = i * 30;
            const r = d * Math.PI / 180;
            return (
              <text 
                key={i}
                x={200 + 140 * Math.cos(-r)} 
                y={200 + 140 * Math.sin(-r)} 
                fill="rgba(255,255,255,0.2)" 
                fontSize="10" 
                textAnchor="middle" 
                className="math-font font-bold"
              >
                {d}°
              </text>
            );
          })}
          
          {/* Área del ángulo iluminada */}
          <path 
            d={`M 200 200 L 370 200 A 170 170 0 ${angle > 180 ? 1 : 0} 0 ${rocketX} ${rocketY} Z`}
            fill="rgba(99, 102, 241, 0.1)"
            stroke="rgba(99, 102, 241, 0.3)"
            strokeWidth="2"
          />

          {/* Lado Inicial (Plataforma) */}
          <line x1="200" y1="200" x2="370" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Trayectoria / Lado Terminal */}
          <line 
            x1="200" y1="200" 
            x2={rocketX} 
            y2={rocketY} 
            stroke="rgba(168, 85, 247, 0.4)" 
            strokeWidth="2"
          />

          {/* El Cohete */}
          <g transform={`translate(${rocketX - 15}, ${rocketY - 15}) rotate(${-angle + 90} 15 15)`}>
            <Rocket size={30} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </g>
          
          {/* La Luna (Vértice) */}
          <g transform="translate(175, 175)">
            <circle cx="25" cy="25" r="28" fill="#f1f5f9" className="animate-pulse" />
            <circle cx="25" cy="25" r="25" fill="#e2e8f0" />
            {/* Cráteres */}
            <circle cx="15" cy="15" r="4" fill="#cbd5e1" />
            <circle cx="35" cy="22" r="6" fill="#cbd5e1" />
            <circle cx="22" cy="38" r="3" fill="#cbd5e1" />
          </g>
        </svg>
        
        <p className="mt-4 text-slate-400 text-xs font-black uppercase tracking-widest animate-pulse">
           {isOrbiting ? "Órbita activa..." : "Arrastra el cohete o usa el joystick"}
        </p>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-indigo-400 font-black uppercase tracking-widest text-xs">Telemetría de Vuelo</span>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isOrbiting ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
              {isOrbiting ? 'En Órbita' : 'Estacionario'}
            </div>
          </div>
          
          <div className="flex flex-col gap-1 mb-6">
             <span className="text-7xl font-black text-white tracking-tighter drop-shadow-lg">{angle}°</span>
             <span className="text-xl text-cyan-400 font-black uppercase tracking-[0.2em]">{type}</span>
          </div>
          
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-slate-300 leading-tight font-bold italic">
              "{getNarrative(type)}"
            </p>
            
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-[10px] font-black text-cyan-500 mb-2 uppercase tracking-widest">Estado del Sistema:</h4>
              <ul className="text-sm text-slate-400 space-y-2 font-bold">
                <li className="flex justify-between"><span>Posición Angular:</span> <span className="text-white">θ = {angle}°</span></li>
                <li className="flex justify-between"><span>Radianes:</span> <span className="text-white">{(angle * Math.PI / 180).toFixed(3)} rad</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={() => setAngle(0)}
             className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-slate-700"
           >
             Reiniciar
           </button>
           <button 
             onClick={() => setAngle(90)}
             className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-slate-700"
           >
             90° (Lanzamiento)
           </button>
        </div>
      </div>
    </div>
  );
};