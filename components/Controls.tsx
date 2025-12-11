
import React from 'react';
import { Play, Pause, Volume2, VolumeX, Square, Droplets } from 'lucide-react';
import { ColorTheme } from '../types';

interface ControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  onExit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isAmbianceOn: boolean;
  onToggleAmbiance: () => void;
  theme: ColorTheme;
}

export const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onToggle, 
  onExit,
  isMuted,
  onToggleMute,
  isAmbianceOn,
  onToggleAmbiance,
  theme
}) => {
  return (
    <div className="absolute bottom-28 z-20 flex items-center justify-center gap-6 w-full px-4 max-w-lg">
      
      {/* Groupe Gauche : Sons */}
      <div className="flex gap-3">
          {/* Bouton Ambiance (Water Stream) */}
          <button
            onClick={onToggleAmbiance}
            className={`
              group flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-300 border shadow-lg
              ${!isAmbianceOn
                ? 'bg-slate-900/60 border-slate-700 text-slate-500 hover:text-slate-300' // OFF
                : `${theme.bgTrans} ${theme.border} ${theme.text} shadow-sky-500/10` // ON
              }
            `}
            title={isAmbianceOn ? "Couper l'ambiance" : "Activer l'ambiance"}
          >
            <Droplets size={20} className="transition-transform group-active:scale-90" />
          </button>

          {/* Bouton Mute (Guide) */}
          <button
            onClick={onToggleMute}
            className={`
              group flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-300 border shadow-lg
              ${isMuted
                ? 'bg-slate-900/60 border-slate-700 text-slate-500 hover:text-slate-300' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-sky-500/10'
              }
            `}
            title={isMuted ? "Activer les sons guides" : "Couper les sons guides"}
          >
            {isMuted ? (
              <VolumeX size={20} className="transition-transform group-active:scale-90" />
            ) : (
              <Volume2 size={20} className="transition-transform group-active:scale-90" />
            )}
          </button>
      </div>

      {/* Bouton Principal Play/Pause (Centre) */}
      <button
        onClick={onToggle}
        className={`
          relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl border-4 mx-2
          ${isPlaying 
            ? 'bg-white border-white text-slate-900 shadow-[0_0_50px_rgba(255,255,255,0.25)]' // En lecture
            : `${theme.bg} ${theme.border} text-white ${theme.shadow}` // En pause (Thème)
          }
        `}
        title={isPlaying ? "Mettre en pause" : "Démarrer"}
      >
        <div className={`transition-all duration-300 ${isPlaying ? 'opacity-100' : 'opacity-90 ml-1'}`}>
          {isPlaying ? (
            <Pause size={36} fill="currentColor" strokeWidth={0} />
          ) : (
            <Play size={36} fill="currentColor" strokeWidth={0} />
          )}
        </div>
        
        {/* Anneau d'animation subtil quand en lecture */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-20 pointer-events-none"></span>
        )}
      </button>

      {/* Bouton Quitter (Droite) */}
      <button
        onClick={onExit}
        className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/70 backdrop-blur-xl hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-200 transition-all duration-300 shadow-lg"
        title="Arrêter la session"
      >
        <Square size={18} fill="currentColor" className="transition-transform group-active:scale-90" />
      </button>
    </div>
  );
};
