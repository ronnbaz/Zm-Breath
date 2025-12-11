
import React, { useState } from 'react';
import { ChevronRight, Star, ArrowLeft, Check, Image as ImageIcon, Music2, Eye, Moon, Play } from 'lucide-react';
import { Reminder, SoundTheme, Wallpaper, ColorTheme, InstrumentType, SoundConfig } from '../types';

interface SettingsScreenProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onUpdateReminderTime: (id: string, newTime: string) => void;
  
  defaultDuration: number;
  onDurationChange: (val: number) => void;

  showGuides: boolean;
  onToggleGuides: () => void;

  dimmingLevel: number; // 0 (Normal) à 0.8 (Très sombre)
  onDimmingChange: (val: number) => void;

  accentColor: string;
  theme: ColorTheme; 
  onColorChange: () => void; 

  soundConfig: SoundConfig;
  onSoundConfigChange: (newConfig: SoundConfig) => void;

  isVibrationEnabled: boolean;
  onVibrationChange: () => void;

  wallpapers: Wallpaper[];
  currentWallpaperId: string;
  onWallpaperChange: (id: string) => void;
  
  onPreviewSound?: (instrument: InstrumentType) => void;
}

// Composant pour les items de navigation simple
const NavItem: React.FC<{
  label: string;
  subLabel?: string;
  onClick?: () => void;
  theme: ColorTheme;
}> = ({ label, subLabel, onClick, theme }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between py-4 px-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors group"
  >
    <div className="flex flex-col items-start">
        <span className="text-lg text-slate-100 font-medium">{label}</span>
        {subLabel && <span className={`text-xs font-medium ${theme.text}`}>{subLabel}</span>}
    </div>
    <div className="flex items-center gap-2">
        <ChevronRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
    </div>
  </button>
);

// Composant pour les réglages avec valeur
const ConfigItem: React.FC<{
  label: string;
  value: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}> = ({ label, value, onClick, icon }) => (
  <div className="flex items-center justify-between py-4 px-4 border-b border-white/10 last:border-0">
    <div className="flex items-center gap-3">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="text-lg text-slate-200">{label}</span>
    </div>
    <button 
      onClick={onClick}
      className="px-4 py-1.5 rounded-lg border border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-all text-sm font-medium min-w-[100px] text-center"
    >
      {value}
    </button>
  </div>
);

// Composant pour choisir un son (SoundPicker)
const SoundPickerItem: React.FC<{
    label: string;
    value: InstrumentType;
    onChange: (val: InstrumentType) => void;
    onPreview: () => void;
    theme: ColorTheme;
}> = ({ label, value, onChange, onPreview, theme }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0 px-2">
        <span className="text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
            <button 
                onClick={onPreview}
                className={`p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors shadow-sm`}
                title="Pré-écouter"
            >
                <Play size={14} fill="currentColor" />
            </button>
            <div className="relative">
                <select 
                    value={value}
                    onChange={(e) => onChange(e.target.value as InstrumentType)}
                    className={`bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white outline-none focus:${theme.border} appearance-none pr-8 w-40`}
                >
                    <optgroup label="Classiques">
                    <option value="WOOD">Bois</option>
                    <option value="BOWL">Bol Tibétain</option>
                    <option value="FLUTE">Flûte Zen</option>
                    <option value="GONG">Gong</option>
                    <option value="DROP">Goutte d'eau</option>
                    </optgroup>
                    <optgroup label="Nature & Zen">
                    <option value="PIANO">Piano Zen</option>
                    <option value="HARP">Harpe</option>
                    <option value="KOTO">Koto Japonais</option>
                    <option value="CRYSTAL">Cristal</option>
                    <option value="OM">Chant Om</option>
                    <option value="SPACE">Espace</option>
                    <option value="WIND">Vent</option>
                    <option value="RAIN">Pluie</option>
                    <option value="BUBBLE">Bulle</option>
                    <option value="GUITAR">Guitare</option>
                    <option value="CELLO">Violoncelle</option>
                    <option value="CHIME">Carillon</option>
                    <option value="WAVE">Vague</option>
                    <option value="CRICKET">Criquet</option>
                    <option value="BINAURAL">Binaural</option>
                    </optgroup>
                    <optgroup label="Autre">
                    <option value="NONE">Silencieux</option>
                    </optgroup>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
            </div>
        </div>
    </div>
);

// Composant pour les rappels
const ReminderItem: React.FC<{
  time: string;
  enabled: boolean;
  onToggle: () => void;
  onChangeTime: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: ColorTheme;
}> = ({ time, enabled, onToggle, onChangeTime, theme }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/10 last:border-0 px-2">
    <div className="relative group">
       <input 
          type="time" 
          value={time}
          onChange={onChangeTime}
          className={`bg-transparent text-2xl font-light text-white outline-none border border-slate-700 rounded-lg px-3 py-1 hover:border-slate-500 focus:${theme.border} transition-colors cursor-pointer`}
       />
    </div>
    
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? theme.bg : 'bg-slate-600'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  reminders,
  onToggleReminder,
  onUpdateReminderTime,
  defaultDuration,
  onDurationChange,
  showGuides,
  onToggleGuides,
  dimmingLevel,
  onDimmingChange,
  accentColor,
  theme,
  onColorChange,
  soundConfig,
  onSoundConfigChange,
  isVibrationEnabled,
  onVibrationChange,
  wallpapers,
  currentWallpaperId,
  onWallpaperChange,
  onPreviewSound
}) => {

  const [view, setView] = useState<'MAIN' | 'WALLPAPER' | 'SOUNDS'>('MAIN');

  const getColorName = (c: string) => {
      if (c === 'sky') return 'Ciel';
      if (c === 'emerald') return 'Nature';
      if (c === 'rose') return 'Amour';
      if (c === 'amber') return 'Soleil';
      if (c === 'violet') return 'Esprit';
      if (c === 'sunset') return 'Coucher de soleil';
      return c;
  };

  const getDimmingLabel = (level: number) => {
      if (level <= 0.2) return "Clair";
      if (level <= 0.5) return "Tamisé";
      return "Nuit";
  };

  // VIEW: WALLPAPER SELECTION
  if (view === 'WALLPAPER') {
    return (
        <div className="w-full h-full pt-4 px-4 bg-transparent animate-in slide-in-from-right duration-300">
            <div className="flex items-center mb-6 px-2">
                <button 
                    onClick={() => setView('MAIN')} 
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-white tracking-wide ml-2">Fonds d'écran</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 pb-20">
                {wallpapers.map(wp => (
                    <button
                        key={wp.id}
                        onClick={() => onWallpaperChange(wp.id)}
                        className={`relative w-full h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                            currentWallpaperId === wp.id 
                            ? `border-white scale-[1.02] shadow-xl` 
                            : 'border-transparent opacity-80 hover:opacity-100 hover:scale-[1.01]'
                        }`}
                        style={wp.style}
                    >
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-between px-6">
                            <span className="font-bold text-white text-lg shadow-black/50 drop-shadow-md">{wp.name}</span>
                            {currentWallpaperId === wp.id && (
                                <div className={`w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center`}>
                                    <Check size={18} strokeWidth={3} />
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
  }

  // VIEW: SOUND CONFIG
  if (view === 'SOUNDS') {
      return (
        <div className="w-full h-full pt-4 px-4 bg-transparent animate-in slide-in-from-right duration-300">
            <div className="flex items-center mb-6 px-2">
                <button 
                    onClick={() => setView('MAIN')} 
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-white tracking-wide ml-2">Configuration Sonore</h2>
            </div>
            
            <div className="bg-slate-800/60 rounded-2xl overflow-hidden mb-6 backdrop-blur-sm border border-white/5 p-4">
                <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Sons par phase</h3>
                <SoundPickerItem 
                    label="Inspiration" 
                    value={soundConfig.inhale} 
                    onChange={(v) => onSoundConfigChange({...soundConfig, inhale: v})}
                    onPreview={() => onPreviewSound?.(soundConfig.inhale)}
                    theme={theme}
                />
                <SoundPickerItem 
                    label="Maintien (Plein)" 
                    value={soundConfig.holdIn} 
                    onChange={(v) => onSoundConfigChange({...soundConfig, holdIn: v})}
                    onPreview={() => onPreviewSound?.(soundConfig.holdIn)}
                    theme={theme}
                />
                <SoundPickerItem 
                    label="Expiration" 
                    value={soundConfig.exhale} 
                    onChange={(v) => onSoundConfigChange({...soundConfig, exhale: v})}
                    onPreview={() => onPreviewSound?.(soundConfig.exhale)}
                    theme={theme}
                />
                <SoundPickerItem 
                    label="Maintien (Vide)" 
                    value={soundConfig.holdOut} 
                    onChange={(v) => onSoundConfigChange({...soundConfig, holdOut: v})}
                    onPreview={() => onPreviewSound?.(soundConfig.holdOut)}
                    theme={theme}
                />
            </div>
            
            <div className="text-xs text-slate-500 px-4">
                Astuce : Cliquez sur le bouton Play pour tester le son.
            </div>
        </div>
      );
  }

  // VIEW: MAIN SETTINGS
  return (
    <div className="w-full h-full pb-8 pt-4 px-4 bg-transparent">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
         <div className="flex items-center gap-2">
             <div className="bg-white/10 p-2 rounded-full">
                 <Star size={16} className="text-white fill-white" />
             </div>
             <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-bold text-slate-300">PRO</span>
         </div>
         <h2 className="text-xl font-bold text-white tracking-wide">Paramètres</h2>
         <div className="w-10"></div>
      </div>

      {/* Section 1: Visuals & Audio */}
      <div className="bg-slate-800/60 rounded-2xl overflow-hidden mb-6 backdrop-blur-sm border border-white/5">
        <NavItem 
            label="Couleur du thème" 
            subLabel={getColorName(accentColor)}
            onClick={onColorChange} 
            theme={theme}
        />
        <NavItem 
            label="Fond d'écran" 
            subLabel="Choisir l'ambiance"
            onClick={() => setView('WALLPAPER')} 
            theme={theme}
        />
        <NavItem 
            label="Sons" 
            subLabel="Personnaliser les sons"
            onClick={() => setView('SOUNDS')} 
            theme={theme}
        />
        <NavItem 
            label="Vibrer" 
            subLabel={isVibrationEnabled ? 'Activé' : 'Désactivé'}
            onClick={onVibrationChange} 
            theme={theme}
        />
      </div>

      {/* Section 2: General Config (REMPLACEMENT ICI) */}
      <div className="bg-slate-800/60 rounded-2xl overflow-hidden mb-6 backdrop-blur-sm border border-white/5 p-2">
        {/* Option 1: Guides Visuels */}
        <ConfigItem 
            label="Guides Visuels" 
            value={showGuides ? 'Affichés' : 'Masqués'} 
            onClick={onToggleGuides}
            icon={<Eye size={20} />}
        />
        
        {/* Option 2: Obscurité (Dimmer) */}
        <ConfigItem 
            label="Obscurité" 
            value={getDimmingLabel(dimmingLevel)}
            onClick={() => {
                const next = dimmingLevel <= 0.2 ? 0.5 : dimmingLevel <= 0.5 ? 0.75 : 0.2;
                onDimmingChange(next);
            }} 
            icon={<Moon size={20} />}
        />

        {/* Durée conservée */}
        <ConfigItem 
            label="Durée" 
            value={`${defaultDuration} min`} 
            onClick={() => {
                const next = defaultDuration === 3 ? 5 : defaultDuration === 5 ? 10 : defaultDuration === 10 ? 20 : 3;
                onDurationChange(next);
            }} 
        />
      </div>

      {/* Section 3: Rappel */}
      <div className="bg-slate-800/60 rounded-2xl overflow-hidden mb-6 backdrop-blur-sm border border-white/5 p-4">
        <h3 className="text-lg text-slate-200 mb-2 font-medium">Rappel</h3>
        <div className="flex flex-col">
            {reminders.map(reminder => (
                <ReminderItem 
                    key={reminder.id}
                    time={reminder.time}
                    enabled={reminder.enabled}
                    onToggle={() => onToggleReminder(reminder.id)}
                    onChangeTime={(e) => onUpdateReminderTime(reminder.id, e.target.value)}
                    theme={theme}
                />
            ))}
        </div>
      </div>

      <div className="text-center text-slate-600 text-xs mt-8 mb-4">
        Version 2.7.0 • ZenMaster Lirone
      </div>

    </div>
  );
};
