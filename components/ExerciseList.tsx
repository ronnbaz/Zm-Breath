
import React from 'react';
import { BreathingMode, MODES, ColorTheme } from '../types';
import { 
  Cloud, Sun, Moon, Battery, Scale, RefreshCw, 
  Target, Wind, Zap, Bed, Activity, Heart, 
  Smile, Shield, Coffee, Brain
} from 'lucide-react';

interface ExerciseListProps {
  onSelect: (mode: BreathingMode) => void;
  onCustomClick: () => void;
  theme: ColorTheme;
}

const getIcon = (mode: BreathingMode) => {
  switch (mode) {
    case BreathingMode.AWAKE: return <Sun size={28} />;
    case BreathingMode.SLEEP: return <Moon size={28} />;
    case BreathingMode.ENERGIZE: return <Battery size={28} />;
    case BreathingMode.ACTIVATE: return <Zap size={28} />;
    case BreathingMode.BALANCE: return <Scale size={28} />;
    case BreathingMode.REFRESH: return <RefreshCw size={28} />;
    case BreathingMode.CONCENTRATION: return <Target size={28} />;
    case BreathingMode.COHERENCE: return <Heart size={28} />;
    case BreathingMode.RELAX_478: return <Cloud size={28} />;
    case BreathingMode.STRESS: return <Shield size={28} />;
    case BreathingMode.ANXIETY: return <Smile size={28} />;
    case BreathingMode.DEEP_RELAX: return <Bed size={28} />;
    case BreathingMode.MINDFULNESS: return <Brain size={28} />;
    case BreathingMode.DIAPHRAGM: return <Activity size={28} />;
    case BreathingMode.LION: return <Coffee size={28} />;
    default: return <Wind size={28} />;
  }
};

const formatTiming = (config: any) => {
    const i = config.inhale / 1000;
    const hi = config.holdIn / 1000;
    const e = config.exhale / 1000;
    const ho = config.holdOut / 1000;
    return `${i}-${hi}-${e}-${ho}`;
};

export const ExerciseList: React.FC<ExerciseListProps> = ({ onSelect, onCustomClick, theme }) => {
  return (
    <div className="w-full h-full overflow-y-auto pb-4 px-4 pt-4 custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Exercices</h2>
        <button 
          onClick={onCustomClick}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 text-white hover:bg-slate-600 transition-colors border border-white/10"
        >
          +
        </button>
      </div>

      <div className="grid gap-3">
        {Object.entries(MODES).map(([key, config]) => {
          if (key === 'CUSTOM') return null;
          const modeKey = key as BreathingMode;
          return (
            <button
              key={key}
              onClick={() => onSelect(modeKey)}
              className="group relative flex items-center p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:bg-slate-700/50 hover:border-white/10 transition-all duration-200 active:scale-[0.98] text-left shadow-sm hover:shadow-md"
            >
              {/* Icon Container */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-slate-700/50 ${theme.text} group-hover:${theme.textHover} group-hover:bg-slate-600/50 flex items-center justify-center mr-4 transition-colors`}>
                {getIcon(modeKey)}
              </div>

              {/* Text Info */}
              <div className="flex-grow">
                <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-slate-100 transition-colors">
                  {config.label.split('(')[0].trim()}
                </h3>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  {formatTiming(config)}
                </p>
              </div>

              {/* Arrow Indicator (subtle) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
                👉
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
