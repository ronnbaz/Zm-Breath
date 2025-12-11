
import React from 'react';
import { BreathPhase, ColorTheme } from '../types';

interface BreathingVisualProps {
  phase: BreathPhase;
  duration: number; // milliseconds for the transition
  text: string;
  countdown: number; // Temps restant en secondes
  showGuides?: boolean; // Afficher ou non le texte
  theme?: ColorTheme; // Thème de couleur actif
}

export const BreathingVisual: React.FC<BreathingVisualProps> = ({ 
  phase, 
  duration, 
  text, 
  countdown, 
  showGuides = true,
  theme 
}) => {
  // Determine scale based on phase
  let scaleClass = 'scale-100';
  
  switch (phase) {
    case BreathPhase.INHALE:
    case BreathPhase.HOLD_IN:
      scaleClass = 'scale-150'; // Expand/Expanded
      break;
    case BreathPhase.EXHALE:
    case BreathPhase.HOLD_OUT:
    case BreathPhase.IDLE:
    default:
      scaleClass = 'scale-100'; // Contract/Contracted
      break;
  }

  // Convert ms duration to CSS transition string
  const transitionStyle = {
    transition: `transform ${duration}ms ease-in-out`,
  };

  const themeText = theme?.text || 'text-white';
  const themeBorder = theme?.border || 'border-sky-400';
  const themeShadow = theme?.shadow || 'shadow-sky-500/40';

  // Logique de visibilité du minuteur : Masqué seulement si IDLE ET compteur à 0 (État "Prêt ?")
  // Si IDLE et compteur > 0, c'est la préparation, donc on affiche.
  const isTimerVisible = !(phase === BreathPhase.IDLE && countdown === 0);

  return (
    <div className="relative flex flex-col justify-center items-center h-[400px] w-[350px]">
      
      {/* Minuteur de phase (au-dessus du cercle) - CONDITIONNEL */}
      {showGuides && (
        <div className={`text-5xl font-light mb-8 transition-opacity duration-300 h-14 font-mono tracking-widest ${themeText} ${!isTimerVisible ? 'opacity-0' : 'opacity-100'}`}>
            {countdown > 0 ? countdown : ''}
        </div>
      )}
      
      {/* Si les guides sont masqués, on garde l'espace pour éviter le saut */}
      {!showGuides && <div className="h-14 mb-8" />}

      <div className="relative flex justify-center items-center h-[350px] w-[350px]">
        {/* Outer Glow Ring (Static) */}
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        
        {/* Outer Pulse Ring (Animated) */}
         <div 
          className={`absolute inset-0 rounded-full border ${themeBorder} opacity-30 ${phase === BreathPhase.IDLE ? '' : 'animate-pulse'}`}
        />

        {/* Main Breathing Circle */}
        <div
          className={`
              relative z-10 flex flex-col justify-center items-center
              h-64 w-64 rounded-full bg-white text-slate-900 shadow-2xl
              ${scaleClass}
          `}
          style={{ 
              ...transitionStyle,
              boxShadow: phase !== BreathPhase.IDLE ? `0 0 60px ${theme?.text.replace('text-', '') === 'sky-400' ? '#38bdf8' : 'currentColor'}` : 'none',
              color: '#0f172a' // Text inside circle always dark
          }}
        >
          {/* Contenu textuel - CONDITIONNEL */}
          {showGuides ? (
              <div className="text-center transform transition-transform duration-300 pointer-events-none select-none">
                <h1 className="text-2xl font-bold mb-1 tracking-wide uppercase">
                {text}
                </h1>
                {/* Affiche "Appuyez sur Démarrer" seulement si IDLE et pas en Préparation */}
                {phase === BreathPhase.IDLE && text !== "Préparation" && (
                <p className="text-sm text-slate-500 font-medium">Appuyez sur Démarrer</p>
                )}
            </div>
          ) : (
            /* Affichage minimaliste si IDLE seulement */
            phase === BreathPhase.IDLE && (
                <div className="text-center transform transition-transform duration-300 pointer-events-none select-none opacity-50">
                    <h1 className="text-2xl font-bold mb-1 tracking-wide uppercase">Prêt</h1>
                </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
