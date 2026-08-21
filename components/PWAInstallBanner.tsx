import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, X, Sparkles, Share2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSTip, setShowIOSTip] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone / installed mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSTip(true);
    } else {
      // Direct browser fallback hint
      alert("Para instalar en tu dispositivo, abre las opciones del navegador (⋮) y selecciona 'Instalar aplicación' o 'Agregar a la pantalla principal'.");
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-lg border border-purple-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-xs">
            <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px]">
                Modo App Móvil (PWA)
              </span>
              <span className="hidden md:inline text-xs font-bold text-purple-200">100% Offline</span>
            </div>
            <h4 className="text-sm md:text-base font-black text-white leading-tight mt-0.5">
              Instala Trigonométrica en tu Pantalla de Inicio
            </h4>
            <p className="text-xs text-purple-100 hidden sm:block">
              Acceso instantáneo, pantalla completa y guarda tu progreso sin conexión.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleInstallClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-amber-300 text-slate-900 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
          >
            <Download size={15} className="stroke-[3]" />
            <span>Instalar App</span>
          </button>
          
          <button
            onClick={() => setDismissed(true)}
            className="p-2 hover:bg-white/20 text-purple-200 hover:text-white rounded-xl transition-colors"
            title="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* iOS instructions popup */}
      {showIOSTip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-slate-900 space-y-4 shadow-2xl border-2 border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <Share2 size={24} />
            </div>
            <h3 className="text-lg font-black">Instalar en iPhone / iPad (Safari)</h3>
            <div className="text-xs text-slate-600 text-left space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p><strong>1.</strong> Toca el botón <strong>Compartir</strong> <span className="inline-block px-1.5 py-0.5 bg-slate-200 rounded font-mono">⎋</span> en la barra de Safari.</p>
              <p><strong>2.</strong> Desplázate hacia abajo y selecciona <strong>"Agregar al inicio"</strong> <span className="inline-block px-1.5 py-0.5 bg-slate-200 rounded font-mono">⊞</span>.</p>
              <p><strong>3.</strong> ¡Listo! Abre Trigonométrica como una app nativa.</p>
            </div>
            <button
              onClick={() => setShowIOSTip(false)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
