
import React from 'react';
import { BreathConfig, SoundTheme, ColorTheme } from '../types';
import { Minus, Plus, Settings, Smartphone, Activity, Clock } from 'lucide-react';

interface ExerciseSetupProps {
  config: BreathConfig;
  onConfigChange: (newConfig: BreathConfig) => void;
  onStart: () => void;
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isVibrationEnabled: boolean;
  onToggleVibration: () => void;
  durationMinutes: number;
  onDurationChange: (minutes: number) => void;
  soundTheme: SoundTheme;
  onThemeChange: (theme: SoundTheme) => void;
  theme: ColorTheme;
}

const ControlRow: React.FC<{
  label: string;
  value: number; // in ms
  onChange: (val: number) => void;
  theme: ColorTheme;
}> = ({ label, value, onChange, theme }) => {
  const seconds = value / 1000;

  const handleDecrease = () => {
    if (seconds > 0) onChange((seconds - 1) * 1000);
  };

  const handleIncrease = () => {
    if (seconds < 60) onChange((seconds + 1) * 1000);
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
      <span className="text-lg text-slate-200">{label}</span>
      <div className="flex items-center gap-3">
        <button 
          onClick={handleDecrease}
          className={`w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center ${theme.text} hover:bg-white/5 active:scale-95 transition-all`}
        >
          <Minus size={20} />
        </button>
        <span className="w-8 text-center text-xl font-bold text-white">{seconds}</span>
        <button 
          onClick={handleIncrease}
          className={`w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center ${theme.text} hover:bg-white/5 active:scale-95 transition-all`}
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export const ExerciseSetup: React.FC<ExerciseSetupProps> = ({
  config,
  onConfigChange,
  onStart,
  onBack,
  isMuted,
  onToggleMute,
  isVibrationEnabled,
  onToggleVibration,
  durationMinutes,
  onDurationChange,
  theme
}) => {
  
  const updatePhase = (phase: 'inhale' | 'holdIn' | 'exhale' | 'holdOut', val: number) => {
    onConfigChange({ ...config, [phase]: val });
  };

  // Calcul de la cadence (Rythme)
  const totalCycleMs = config.inhale + config.holdIn + config.exhale + config.holdOut;
  const rpm = totalCycleMs > 0 ? (60000 / totalCycleMs).toFixed(1) : "0";
  
  // Estimation du nombre total de cycles
  const totalCycles = durationMinutes > 0 && totalCycleMs > 0 
    ? Math.floor((durationMinutes * 60000) / totalCycleMs) 
    : "∞";

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 overflow-y-auto custom-scrollbar pt-16 pb-8 px-6">
       
       {/* Card 1: Timings */}
       <div className={`bg-slate-800/40 border border-white/5 rounded-2xl p-4 mb-6 shadow-xl backdrop-blur-sm`}>
         <ControlRow 
            label="Inspirez" 
            value={config.inhale} 
            onChange={(v) => updatePhase('inhale', v)}
            theme={theme} 
         />
         <ControlRow 
            label="Maintien" 
            value={config.holdIn} 
            onChange={(v) => updatePhase('holdIn', v)}
            theme={theme} 
         />
         <ControlRow 
            label="Expirer" 
            value={config.exhale} 
            onChange={(v) => updatePhase('exhale', v)}
            theme={theme} 
         />
         <ControlRow 
            label="Attendez" 
            value={config.holdOut} 
            onChange={(v) => updatePhase('holdOut', v)}
            theme={theme} 
         />
       </div>

       {/* Card 2: Settings */}
       <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 mb-8 shadow-xl backdrop-blur-sm flex flex-col gap-4">
         
         {/* Duration */}
         <div className="flex items-center justify-between border-b border-white/10 pb-4">
           <span className="text-lg text-slate-200">Durée</span>
           <div className="relative">
             <select 
                value={durationMinutes}
                onChange={(e) => onDurationChange(Number(e.target.value))}
                className={`appearance-none bg-slate-900 border border-white/10 rounded-lg px-4 py-2 pr-8 text-white outline-none focus:${theme.border}`}
             >
               <option value={1}>1 minute</option>
               <option value={2}>2 minutes</option>
               <option value={3}>3 minutes</option>
               <option value={5}>5 minutes</option>
               <option value={10}>10 minutes</option>
               <option value={20}>20 minutes</option>
               <option value={0}>Infini</option>
             </select>
             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               ▼
             </div>
           </div>
         </div>

         {/* Cadence Info (New Replacement) */}
         <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-slate-400"/>
              <span className="text-lg text-slate-200">Cadence</span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-white font-bold">{rpm} cycles / min</span>
                {durationMinutes > 0 && (
                    <span className="text-xs text-slate-400">Total : ~{totalCycles} respirations</span>
                )}
            </div>
         </div>

         {/* Vibration */}
         <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-slate-400"/>
              <span className="text-lg text-slate-200">Vibrer</span>
            </div>
            <button 
              onClick={onToggleVibration}
              className={`w-12 h-6 rounded-full transition-colors relative ${isVibrationEnabled ? theme.bg : 'bg-slate-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isVibrationEnabled ? 'left-7' : 'left-1'}`} />
            </button>
         </div>

         {/* Sound Mute */}
         <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-slate-400"/>
              <span className="text-lg text-slate-200">Son</span>
            </div>
            <button 
              onClick={onToggleMute}
              className={`w-12 h-6 rounded-full transition-colors relative ${!isMuted ? theme.bg : 'bg-slate-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${!isMuted ? 'left-7' : 'left-1'}`} />
            </button>
         </div>

       </div>

       {/* Start Button */}
       <button 
         onClick={onStart}
         className={`w-full py-4 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-xl shadow-lg ${theme.shadow} active:scale-[0.98] transition-all`}
       >
         Commencer
       </button>
    </div>
  );
};
