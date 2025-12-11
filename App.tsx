
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingVisual } from './components/BreathingVisual';
import { Controls } from './components/Controls';
import { ZenWisdom } from './components/ZenWisdom';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseSetup } from './components/ExerciseSetup';
import { BottomNav } from './components/BottomNav'; // Agit maintenant comme TopNav
import { SettingsScreen } from './components/SettingsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ChatScreen } from './components/ChatScreen';
import { BreathingMode, BreathPhase, MODES, BreathConfig, SoundTheme, Reminder, Wallpaper, ColorTheme, SoundConfig, SessionData } from './types';
import { 
  Wind, ChevronLeft, Star, Heart, Cloud, Shield, Sun, Zap, Target, 
  Battery, Scale, RefreshCw, Activity, Coffee, Brain, Moon, Smile, Bed, Play, Clock
} from 'lucide-react';
import { audioService } from './services/audioService';

// View State
type View = 'LIST' | 'SETUP' | 'PRACTICE' | 'SETTINGS' | 'GUIDE' | 'HISTORY' | 'CHAT';

// --- DATA: Guide Content ---
const GUIDE_CONTENT = [
  {
    mode: BreathingMode.COHERENCE,
    title: "Cohérence Cardiaque (5-0-5-0)",
    icon: Heart,
    color: "rose",
    desc: "Une technique qui synchronise votre rythme cardiaque avec votre respiration (fréquence de résonance ~0.1Hz).",
    benefit: "Réduit le cortisol, équilibre le système nerveux et améliore la clarté mentale."
  },
  {
    mode: BreathingMode.RELAX_478,
    title: "Détente 4-7-8 (4-7-8-0)",
    icon: Cloud,
    color: "sky",
    desc: "Développée par le Dr. Andrew Weil, cette méthode agit comme un tranquillisant naturel pour le système nerveux.",
    benefit: "Idéal pour s'endormir rapidement ou calmer une crise d'anxiété."
  },
  {
    mode: BreathingMode.STRESS,
    title: "Anti-Stress (3-6-3-6)",
    icon: Shield,
    color: "emerald",
    desc: "La respiration carrée est utilisée par les Navy SEALs pour garder leur calme sous pression extrême.",
    benefit: "Augmente la concentration et la tolérance au CO2 grâce aux phases de rétention."
  },
  {
    mode: BreathingMode.SLEEP,
    title: "Dormir Profondément (4-4-8-4)",
    icon: Moon,
    color: "indigo",
    desc: "Une cadence lente avec une expiration prolongée pour signaler au corps qu'il est temps de se reposer.",
    benefit: "Active le système parasympathique et prépare au sommeil réparateur."
  },
  {
    mode: BreathingMode.AWAKE,
    title: "Éveil Matinal (6-0-2-0)",
    icon: Sun,
    color: "amber",
    desc: "Une inspiration longue et une expiration rapide pour oxygéner le cerveau dès le réveil.",
    benefit: "Stimule la vigilance sans la nervosité de la caféine."
  },
  {
    mode: BreathingMode.ACTIVATE,
    title: "Activer (6-0-4-0)",
    icon: Zap,
    color: "yellow",
    desc: "Un rythme dynamique pour augmenter le niveau d'énergie avant une activité physique.",
    benefit: "Prépare le corps à l'action et augmente le flux sanguin."
  },
  {
    mode: BreathingMode.CONCENTRATION,
    title: "Concentration (5-0-2-0)",
    icon: Target,
    color: "blue",
    desc: "Une respiration stable avec une courte rétention pour focaliser l'esprit sur une tâche unique.",
    benefit: "Améliore l'attention soutenue et réduit la dispersion mentale."
  },
  {
    mode: BreathingMode.ENERGIZE,
    title: "Dynamiser (6-6-6-1)",
    icon: Battery,
    color: "lime",
    desc: "Des cycles puissants pour recharger vos batteries mentales et physiques.",
    benefit: "Combat la fatigue de l'après-midi et la léthargie."
  },
  {
    mode: BreathingMode.BALANCE,
    title: "Équilibre (6-2-6-2)",
    icon: Scale,
    color: "teal",
    desc: "Des temps égaux pour l'inspiration, l'expiration et les rétentions. Le juste milieu.",
    benefit: "Harmonise les hémisphères du cerveau et stabilise l'humeur."
  },
  {
    mode: BreathingMode.REFRESH,
    title: "Rafraîchir (4-4-4-0)",
    icon: RefreshCw,
    color: "cyan",
    desc: "Une respiration rapide et rythmée pour nettoyer les poumons et l'esprit (proche du Kapalabhati doux).",
    benefit: "Donne une sensation de propreté mentale et de renouveau."
  },
  {
    mode: BreathingMode.PRANAYAMA,
    title: "Pranayama (7-4-8-4)",
    icon: Wind,
    color: "violet",
    desc: "Basé sur les traditions yogiques anciennes, ce rythme complexe maîtrise l'énergie vitale (Prana).",
    benefit: "Favorise une méditation profonde et une conscience spirituelle."
  },
  {
    mode: BreathingMode.UJJAYI,
    title: "Ujjayi (7-0-7-0)",
    icon: Wind,
    color: "sky",
    desc: "Souvent appelée 'Respiration de l'Océan'. On respire par le nez en contractant légèrement la glotte.",
    benefit: "Réchauffe le corps de l'intérieur et calme le mental durant le yoga."
  },
  {
    mode: BreathingMode.LION,
    title: "Respiration du Lion (4-0-7-0)",
    icon: Coffee,
    color: "orange",
    desc: "Une expiration forte par la bouche, souvent réalisée en tirant la langue (Simhasana).",
    benefit: "Libère les tensions de la mâchoire et du visage, excellent pour évacuer la frustration."
  },
  {
    mode: BreathingMode.BUTEYKO,
    title: "Buteyko (4-0-9-10)",
    icon: Activity,
    color: "slate",
    desc: "Méthode axée sur la respiration nasale et la réduction du volume respiratoire avec de longues pauses.",
    benefit: "Améliore l'asthme, débouche le nez et optimise l'oxygénation cellulaire."
  },
  {
    mode: BreathingMode.MINDFULNESS,
    title: "Pleine Conscience (3-2-7-9)",
    icon: Brain,
    color: "fuchsia",
    desc: "Un rythme asymétrique conçu pour vous ancrer dans l'instant présent.",
    benefit: "Brise les boucles de pensées négatives et favorise l'acceptation."
  },
  {
    mode: BreathingMode.ANXIETY,
    title: "Anti-Anxiété (6-4-6-0)",
    icon: Smile,
    color: "emerald",
    desc: "Une variante douce qui met l'accent sur la régularité pour rassurer le cerveau limbique.",
    benefit: "Stoppe le début de panique et procure un sentiment de sécurité."
  },
  {
    mode: BreathingMode.DEEP_RELAX,
    title: "Relaxation Profonde (4-0-8-8)",
    icon: Bed,
    color: "indigo",
    desc: "Des rétentions poumons vides très longues pour une sédation maximale.",
    benefit: "À utiliser uniquement en position allongée pour un lâcher-prise total."
  },
  {
    mode: BreathingMode.DIAPHRAGM,
    title: "Diaphragmatique (4-2-6-0)",
    icon: Activity,
    color: "rose",
    desc: "Focalise l'attention sur le mouvement du ventre plutôt que de la poitrine.",
    benefit: "Renforce le muscle diaphragmatique et améliore l'efficacité respiratoire."
  }
];

// --- DATA: Wallpapers (15 Thèmes) ---
const WALLPAPERS: Wallpaper[] = [
    { id: 'zen_garden', name: 'Jardin Zen', style: { background: 'radial-gradient(circle at center, #2c3e50, #000000)', backgroundSize: 'cover' } },
    { id: 'ocean_depth', name: 'Océan Profond', style: { background: 'linear-gradient(to bottom, #1e3a8a, #0f172a, #020617)' } },
    { id: 'sunset_glow', name: 'Coucher de Soleil', style: { background: 'linear-gradient(180deg, #fb923c 0%, #be185d 60%, #2e1065 100%)' } },
    { id: 'forest_mist', name: 'Forêt Mystique', style: { background: 'linear-gradient(to bottom right, #064e3b, #14532d, #022c22)' } },
    { id: 'northern_lights', name: 'Aurore Boréale', style: { background: 'radial-gradient(at top left, #4c1d95, transparent), radial-gradient(at bottom right, #059669, transparent), #0f172a' } },
    { id: 'morning_dew', name: 'Rosée Matinale', style: { background: 'linear-gradient(to top, #a8e063, #56ab2f)' } },
    { id: 'lavender_dream', name: 'Rêve Lavande', style: { background: 'linear-gradient(to top, #7F7FD5, #86A8E7, #91EAE4)' } },
    { id: 'volcano', name: 'Magma', style: { background: 'linear-gradient(to right, #cb2d3e, #ef473a)' } },
    { id: 'deep_space', name: 'Espace Lointain', style: { background: 'radial-gradient(circle, #000000, #434343)' } },
    { id: 'cherry_blossom', name: 'Sakura', style: { background: 'linear-gradient(to bottom, #ffdde1, #ee9ca7)' } },
    { id: 'desert_dusk', name: 'Crépuscule Désert', style: { background: 'linear-gradient(to bottom, #ff5f6d, #ffc371)' } },
    { id: 'arctic_ice', name: 'Glace Arctique', style: { background: 'linear-gradient(to bottom, #e0eafc, #cfdef3)' } },
    { id: 'royal_gold', name: 'Or Royal', style: { background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' } },
    { id: 'midnight_city', name: 'Ville Minuit', style: { background: 'linear-gradient(to bottom, #232526, #414345)' } },
    { id: 'tropical_lagoon', name: 'Lagon Tropical', style: { background: 'linear-gradient(to bottom, #43cea2, #185a9d)' } }
];

// --- DATA: Color Themes Mapping ---
const COLOR_THEMES: Record<string, ColorTheme> = {
    // THÈMES DE BASE
    'sky': {
        id: 'sky', text: 'text-sky-400', textHover: 'text-sky-300', 
        bg: 'bg-sky-500', bgTrans: 'bg-sky-500/20', border: 'border-sky-500', 
        ring: 'ring-sky-500', gradient: 'from-sky-600 to-sky-500', shadow: 'shadow-sky-500/20', stroke: 'stroke-sky-400'
    },
    'emerald': {
        id: 'emerald', text: 'text-emerald-400', textHover: 'text-emerald-300', 
        bg: 'bg-emerald-500', bgTrans: 'bg-emerald-500/20', border: 'border-emerald-500', 
        ring: 'ring-emerald-500', gradient: 'from-emerald-600 to-emerald-500', shadow: 'shadow-emerald-500/20', stroke: 'stroke-emerald-400'
    },
    'rose': {
        id: 'rose', text: 'text-rose-400', textHover: 'text-rose-300', 
        bg: 'bg-rose-500', bgTrans: 'bg-rose-500/20', border: 'border-rose-500', 
        ring: 'ring-rose-500', gradient: 'from-rose-600 to-rose-500', shadow: 'shadow-rose-500/20', stroke: 'stroke-rose-400'
    },
    'amber': {
        id: 'amber', text: 'text-amber-400', textHover: 'text-amber-300', 
        bg: 'bg-amber-500', bgTrans: 'bg-amber-500/20', border: 'border-amber-500', 
        ring: 'ring-amber-500', gradient: 'from-amber-600 to-amber-500', shadow: 'shadow-amber-500/20', stroke: 'stroke-amber-400'
    },
    'violet': {
        id: 'violet', text: 'text-violet-400', textHover: 'text-violet-300', 
        bg: 'bg-violet-500', bgTrans: 'bg-violet-500/20', border: 'border-violet-500', 
        ring: 'ring-violet-500', gradient: 'from-violet-600 to-violet-500', shadow: 'shadow-violet-500/20', stroke: 'stroke-violet-400'
    },
    'sunset': {
        id: 'sunset', text: 'text-orange-400', textHover: 'text-orange-300', 
        bg: 'bg-orange-500', bgTrans: 'bg-orange-500/20', border: 'border-orange-500', 
        ring: 'ring-orange-500', gradient: 'from-orange-600 to-orange-500', shadow: 'shadow-orange-500/20', stroke: 'stroke-orange-400'
    },

    // NOUVEAUX THÈMES ASSORTIS AUX WALLPAPERS
    'zen-garden-match': { // Assorti à 'zen_garden'
        id: 'zen-garden-match', text: 'text-teal-300', textHover: 'text-teal-200',
        bg: 'bg-teal-500', bgTrans: 'bg-teal-500/20', border: 'border-teal-500', 
        ring: 'ring-teal-500', gradient: 'from-teal-600 to-teal-500', shadow: 'shadow-teal-500/20', stroke: 'stroke-teal-300'
    },
    'ocean-match': { // Assorti à 'ocean_depth'
        id: 'ocean-match', text: 'text-cyan-400', textHover: 'text-cyan-300',
        bg: 'bg-cyan-600', bgTrans: 'bg-cyan-600/20', border: 'border-cyan-600',
        ring: 'ring-cyan-600', gradient: 'from-cyan-700 to-cyan-600', shadow: 'shadow-cyan-600/20', stroke: 'stroke-cyan-400'
    },
    'sunset-match': { // Assorti à 'sunset_glow'
        id: 'sunset-match', text: 'text-fuchsia-400', textHover: 'text-fuchsia-300',
        bg: 'bg-fuchsia-700', bgTrans: 'bg-fuchsia-700/20', border: 'border-fuchsia-700',
        ring: 'ring-fuchsia-700', gradient: 'from-fuchsia-800 to-fuchsia-700', shadow: 'shadow-fuchsia-700/20', stroke: 'stroke-fuchsia-400'
    },
    'forest-match': { // Assorti à 'forest_mist'
        id: 'forest-match', text: 'text-lime-300', textHover: 'text-lime-200',
        bg: 'bg-lime-700', bgTrans: 'bg-lime-700/20', border: 'border-lime-700',
        ring: 'ring-lime-700', gradient: 'from-lime-800 to-lime-700', shadow: 'shadow-lime-700/20', stroke: 'stroke-lime-300'
    },
    'aurora-match': { // Assorti à 'northern_lights'
        id: 'aurora-match', text: 'text-violet-300', textHover: 'text-violet-200',
        bg: 'bg-violet-500', bgTrans: 'bg-violet-500/20', border: 'border-violet-500',
        ring: 'ring-violet-500', gradient: 'from-violet-600 to-violet-500', shadow: 'shadow-violet-500/20', stroke: 'stroke-violet-300'
    },
};

// Map pour lier les fonds d'écran aux ID de couleurs assortis
const wallpaperColorMap: Record<string, string> = {
    'zen_garden': 'zen-garden-match',
    'ocean_depth': 'ocean-match',
    'sunset_glow': 'sunset-match',
    'forest_mist': 'forest-match',
    'northern_lights': 'aurora-match',
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('LIST');
  
  // Settings State
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbianceOn, setIsAmbianceOn] = useState(false);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(3);
  const [soundTheme, setSoundTheme] = useState<SoundTheme>(SoundTheme.WOOD);
  
  const [showGuides, setShowGuides] = useState(true); 
  const [dimmingLevel, setDimmingLevel] = useState(0.2); 

  const [accentColor, setAccentColor] = useState('sky');
  const [wallpaperId, setWallpaperId] = useState('zen_garden');
  
  const [soundConfig, setSoundConfig] = useState<SoundConfig>({
      inhale: 'BOWL',
      holdIn: 'WOOD',
      exhale: 'BOWL',
      holdOut: 'WOOD'
  });

  // Reminders State
  const [reminders, setReminders] = useState<Reminder[]>([
      { id: '1', time: '11:00', enabled: true },
      { id: '2', time: '14:00', enabled: false }
  ]);
  
  // Practice State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [mode, setMode] = useState<BreathingMode>(BreathingMode.COHERENCE);
  const [customConfig, setCustomConfig] = useState<BreathConfig>(MODES[BreathingMode.COHERENCE]);
  
  const [phase, setPhase] = useState<BreathPhase>(BreathPhase.IDLE);
  const [phaseDuration, setPhaseDuration] = useState(0);
  const [text, setText] = useState("Prêt ?");
  const [cycles, setCycles] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [phaseCountdown, setPhaseCountdown] = useState(0);

  // History State
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>([]);
  
  // Refs
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null); 
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null); 
  const startTimeRef = useRef<number>(0);
  const wakeLockRef = useRef<any>(null);

  // Derived State
  const currentTheme = COLOR_THEMES[accentColor] || COLOR_THEMES['sky'];
  const currentWallpaper = WALLPAPERS.find(w => w.id === wallpaperId) || WALLPAPERS[0];
  
  // Progress Calculation
  const totalTargetSeconds = targetDurationMinutes * 60;
  const progressPercent = targetDurationMinutes > 0 ? Math.min(100, (elapsedTime / totalTargetSeconds) * 100) : 0;
  const radius = 130; 
  const circumference = 2 * Math.PI * radius;

  // --- PERSISTENCE: LOAD ---
  useEffect(() => {
    try {
        // History
        const storedHistory = localStorage.getItem('zenmaster_history');
        if (storedHistory) {
            setSessionHistory(JSON.parse(storedHistory));
        }

        // Settings
        const storedSettings = localStorage.getItem('zenmaster_settings');
        if (storedSettings) {
            const parsed = JSON.parse(storedSettings);
            if (parsed.targetDurationMinutes !== undefined) setTargetDurationMinutes(parsed.targetDurationMinutes);
            if (parsed.isMuted !== undefined) {
                 setIsMuted(parsed.isMuted);
                 audioService.setMuted(parsed.isMuted);
            }
            if (parsed.isVibrationEnabled !== undefined) setIsVibrationEnabled(parsed.isVibrationEnabled);
            if (parsed.accentColor) setAccentColor(parsed.accentColor);
            if (parsed.wallpaperId) setWallpaperId(parsed.wallpaperId);
            if (parsed.dimmingLevel !== undefined) setDimmingLevel(parsed.dimmingLevel);
            if (parsed.showGuides !== undefined) setShowGuides(parsed.showGuides);
            if (parsed.soundConfig) setSoundConfig(parsed.soundConfig);
            if (parsed.reminders) setReminders(parsed.reminders);
        }
    } catch (e) {
        console.error("Erreur chargement données:", e);
    }
  }, []);

  // --- PERSISTENCE: SAVE ---
  useEffect(() => {
      const settingsToSave = {
          targetDurationMinutes,
          isMuted,
          isVibrationEnabled,
          accentColor,
          wallpaperId,
          dimmingLevel,
          showGuides,
          soundConfig,
          reminders
      };
      localStorage.setItem('zenmaster_settings', JSON.stringify(settingsToSave));
  }, [
      targetDurationMinutes, isMuted, isVibrationEnabled, 
      accentColor, wallpaperId, dimmingLevel, 
      showGuides, soundConfig, reminders
  ]);

  const saveHistory = (history: SessionData[]) => {
    try {
        localStorage.setItem('zenmaster_history', JSON.stringify(history));
    } catch (e) {
        console.error("Erreur sauvegarde historique:", e);
    }
  };

  const clearCurrentTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch (err) {
      console.log('Wake Lock Error:', err);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        console.log('Wake Lock Release Error:', err);
      }
    }
  };

  const triggerPhaseVibration = (phase: BreathPhase) => {
    if (!isVibrationEnabled || !navigator.vibrate) return;
    
    switch(phase) {
      case BreathPhase.INHALE:
        navigator.vibrate([80, 50, 80]); 
        break;
      case BreathPhase.EXHALE:
        navigator.vibrate(300); 
        break;
      case BreathPhase.HOLD_IN:
      case BreathPhase.HOLD_OUT:
        navigator.vibrate(50);
        break;
      default:
        break;
    }
  };

  // --- Handlers ---

  const handleSelectMode = (selectedMode: BreathingMode) => {
    setMode(selectedMode);
    setCustomConfig({ ...MODES[selectedMode] });
    setView('SETUP');
  };

  const handleCustomClick = () => {
    setMode(BreathingMode.CUSTOM);
    setCustomConfig({ ...MODES[BreathingMode.CUSTOM] });
    setView('SETUP');
  };

  const handleStartPractice = () => {
    setView('PRACTICE');
    // Phase de préparation
    setIsPreparing(true);
    setText("Préparation");
    setPhaseCountdown(3); 
    setPhase(BreathPhase.IDLE);
    setIsPlaying(true); // Active le useEffect principal
    
    setCycles(0);
    setElapsedTime(0);
    startTimeRef.current = 0;
  };

  const handleExitPractice = () => {
    setIsPlaying(false);
    setIsPreparing(false);
    clearCurrentTimeout();
    audioService.stop();
    releaseWakeLock();

    // Save history if session > 30s
    if (startTimeRef.current > 0) {
        const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (durationSeconds >= 30) {
             const newSession: SessionData = {
                id: Date.now().toString(),
                date: Date.now(),
                mode: mode,
                durationSeconds: durationSeconds,
                cyclesCompleted: cycles,
            };
            const newHistory = [newSession, ...sessionHistory];
            setSessionHistory(newHistory);
            saveHistory(newHistory);
        }
    }

    startTimeRef.current = 0;
    setView('SETUP'); 
  };
  
  const handleBackToMenu = () => {
    setView('LIST');
  };

  const handleNavChange = (newView: 'LIST' | 'SETTINGS' | 'GUIDE' | 'HISTORY' | 'CHAT') => {
      if (view === 'PRACTICE') return; 
      setView(newView as View);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioService.setMuted(newMutedState);
  };
  
  const toggleAmbiance = () => {
    const newState = !isAmbianceOn;
    setIsAmbianceOn(newState);
    audioService.toggleAmbiance(newState);
  };

  const handleThemeChange = (theme: SoundTheme) => {
    setSoundTheme(theme);
    audioService.setTheme(theme);
  };
  
  const cycleColor = () => {
      const colors = ['sky', 'emerald', 'rose', 'amber', 'violet', 'sunset'];
      const idx = colors.indexOf(accentColor);
      setAccentColor(colors[(idx + 1) % colors.length]);
  };

  const handleWallpaperChange = (id: string) => {
      setWallpaperId(id);
      const match = wallpaperColorMap[id];
      if (match) {
          setAccentColor(match);
      }
  };

  const toggleReminder = async (id: string) => {
      const reminderToToggle = reminders.find(r => r.id === id);
      if (reminderToToggle && !reminderToToggle.enabled) {
          if ('Notification' in window && Notification.permission !== 'granted') {
              try {
                  const permission = await Notification.requestPermission();
                  if (permission !== 'granted') {
                      alert("Les notifications doivent être autorisées pour activer le rappel.");
                      return; 
                  }
              } catch (e) {
                  console.error("Erreur permission notification:", e);
              }
          }
      }
      setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const updateReminderTime = (id: string, newTime: string) => {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, time: newTime } : r));
  };

  const ensureAudioInitialized = async () => {
    await audioService.init();
    audioService.resume();
  };

  useEffect(() => {
    if (isPlaying && !isPreparing) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1); 
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isPlaying, isPreparing]);

  const runSequence = useCallback(() => {
    const config = customConfig;
    
    const nextStep = (nextPhase: BreathPhase) => {
      if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
      }

      let baseDuration = 0;
      let label = "";
      
      switch (nextPhase) {
        case BreathPhase.INHALE: baseDuration = config.inhale; label = "Inspirez"; break;
        case BreathPhase.HOLD_IN: baseDuration = config.holdIn; label = "Maintien"; break;
        case BreathPhase.EXHALE: baseDuration = config.exhale; label = "Expirer"; break;
        case BreathPhase.HOLD_OUT: baseDuration = config.holdOut; label = "Attendez"; break;
        default: return;
      }

      if (baseDuration <= 0) {
        let skipToPhase = BreathPhase.IDLE;
        if (nextPhase === BreathPhase.INHALE) skipToPhase = BreathPhase.HOLD_IN;
        else if (nextPhase === BreathPhase.HOLD_IN) skipToPhase = BreathPhase.EXHALE;
        else if (nextPhase === BreathPhase.EXHALE) skipToPhase = BreathPhase.HOLD_OUT;
        else if (nextPhase === BreathPhase.HOLD_OUT) {
          setCycles(c => c + 1);
          skipToPhase = BreathPhase.INHALE;
        }
        nextStep(skipToPhase);
        return;
      }

      const durationMs = baseDuration;
      const durationSec = Math.ceil(durationMs / 1000);

      setPhase(nextPhase);
      setPhaseDuration(durationMs);
      setText(label);
      setPhaseCountdown(durationSec);

      audioService.transitionToWithConfig(nextPhase, durationMs, soundConfig);
      triggerPhaseVibration(nextPhase);

      let countdown = durationSec;
      countdownIntervalRef.current = setInterval(() => {
          countdown -= 1;
          if (countdown >= 0) {
            setPhaseCountdown(countdown);
          } else {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
      }, 1000);

      timeoutRef.current = setTimeout(() => {
        if (targetDurationMinutes > 0 && startTimeRef.current > 0) {
           const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
           if (elapsedSec >= targetDurationMinutes * 60) {
             audioService.playGongFinish();
             setIsPlaying(false);
             return;
           }
        }

        if (nextPhase === BreathPhase.INHALE) nextStep(BreathPhase.HOLD_IN);
        else if (nextPhase === BreathPhase.HOLD_IN) nextStep(BreathPhase.EXHALE);
        else if (nextPhase === BreathPhase.EXHALE) nextStep(BreathPhase.HOLD_OUT);
        else if (nextPhase === BreathPhase.HOLD_OUT) {
          setCycles(c => c + 1);
          nextStep(BreathPhase.INHALE);
        }
      }, durationMs);
    };

    if (startTimeRef.current === 0) startTimeRef.current = Date.now();
    nextStep(BreathPhase.INHALE);
  }, [customConfig, targetDurationMinutes, soundConfig]); 

  useEffect(() => {
    if (isPlaying) {
      ensureAudioInitialized().then(() => {
        audioService.startBackground(); 
        requestWakeLock(); 
        
        if (isPreparing) {
           clearCurrentTimeout();
           let prepCount = 3;
           setPhaseCountdown(3);
           setText("Préparation");
           countdownIntervalRef.current = setInterval(() => {
               prepCount--;
               if (prepCount > 0) {
                   setPhaseCountdown(prepCount);
               } else {
                   if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                   countdownIntervalRef.current = null;
                   setIsPreparing(false);
               }
           }, 1000);
        } else {
           runSequence();
        }
      });
    } else {
      clearCurrentTimeout();
      setPhase(BreathPhase.IDLE);
      setText("Prêt ?");
      setPhaseDuration(300);
      setPhaseCountdown(0);
      audioService.stop(); 
      releaseWakeLock(); 
    }
    return () => {
      clearCurrentTimeout();
      audioService.stop();
      releaseWakeLock();
    };
  }, [isPlaying, isPreparing, runSequence]);

  return (
    <div className="relative h-screen w-full text-white overflow-hidden font-quicksand bg-slate-900">
      
      {/* Wallpaper Layer */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={currentWallpaper.style}
      >
         <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
         <div className="absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none" style={{ opacity: dimmingLevel }}></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* VIEW: EXERCISE LIST */}
        {view === 'LIST' && (
          <>
            {/* Top Navigation - FIRST */}
            <BottomNav 
                activeView={view} 
                onViewChange={handleNavChange} 
                theme={currentTheme}
            />

            {/* Header - SECOND */}
            <header className="px-6 py-4 flex items-center justify-between bg-slate-900/10 backdrop-blur-sm border-b border-white/5">
               <div className="flex items-center gap-2">
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-colors ${currentTheme.bg}`}>Z</div>
                 <h1 className="text-xl font-bold tracking-wide">ZenMaster</h1>
               </div>
               <div className={`px-2 py-1 rounded bg-white/10 text-xs font-bold tracking-wider ${currentTheme.text}`}>Lirone</div>
            </header>

            {/* Content List - WRAPPED for correct scrolling */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <ExerciseList 
                    onSelect={handleSelectMode} 
                    onCustomClick={handleCustomClick} 
                    theme={currentTheme}
                />
            </div>
          </>
        )}

        {/* VIEW: CHAT */}
        {view === 'CHAT' && (
           <>
              <BottomNav 
                    activeView={view} 
                    onViewChange={handleNavChange} 
                    theme={currentTheme}
              />
              <ChatScreen theme={currentTheme} />
           </>
        )}

        {/* VIEW: HISTORY */}
        {view === 'HISTORY' && (
          <>
             <BottomNav 
                activeView={view} 
                onViewChange={handleNavChange} 
                theme={currentTheme}
            />
             <div className="h-full relative">
                <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-slate-900/10 backdrop-blur-md border-b border-white/5 h-16">
                     <button onClick={handleBackToMenu} className={`hover:text-white transition-colors ${currentTheme.text}`}>
                        <ChevronLeft size={28} />
                     </button>
                     <h3 className="font-bold text-lg text-white">Historique</h3>
                     <div className="w-8"></div>
                 </div>
                 <div className="pt-16 h-full">
                    <HistoryScreen history={sessionHistory} theme={currentTheme} />
                 </div>
             </div>
          </>
        )}

        {/* VIEW: SETTINGS */}
        {view === 'SETTINGS' && (
           <>
             <BottomNav 
                activeView={view} 
                onViewChange={handleNavChange} 
                theme={currentTheme}
             />
             <div className="flex-1 overflow-y-auto w-full pb-4 scrollbar-hide">
                 <SettingsScreen 
                    reminders={reminders}
                    onToggleReminder={toggleReminder}
                    onUpdateReminderTime={updateReminderTime}
                    
                    defaultDuration={targetDurationMinutes}
                    onDurationChange={setTargetDurationMinutes}
                    
                    showGuides={showGuides}
                    onToggleGuides={() => setShowGuides(!showGuides)}
                    dimmingLevel={dimmingLevel}
                    onDimmingChange={setDimmingLevel}
                    
                    accentColor={accentColor}
                    onColorChange={cycleColor}
                    theme={currentTheme}

                    soundConfig={soundConfig} 
                    onSoundConfigChange={setSoundConfig} 

                    isVibrationEnabled={isVibrationEnabled}
                    onVibrationChange={() => setIsVibrationEnabled(!isVibrationEnabled)}

                    wallpapers={WALLPAPERS}
                    currentWallpaperId={wallpaperId}
                    onWallpaperChange={handleWallpaperChange}
                    
                    onPreviewSound={(instr) => audioService.previewSound(instr)}
                 />
             </div>
           </>
        )}

        {/* VIEW: GUIDE (All Modes) */}
        {view === 'GUIDE' && (
            <div className="flex flex-col h-full">
                <BottomNav 
                    activeView={view} 
                    onViewChange={handleNavChange} 
                    theme={currentTheme}
                />
                <div className="w-full flex-1 overflow-y-auto pb-4 pt-4 px-4 custom-scrollbar">
                    <header className="mb-6 px-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Guide Zen</h2>
                        <p className="text-slate-400 text-sm mt-1">L'art de bien respirer.</p>
                    </header>
                    
                    <div className="grid gap-4 animate-in slide-in-from-bottom-4 duration-500">
                        {GUIDE_CONTENT.map((item, idx) => {
                             let iconColorClass = 'text-sky-400';
                             if (item.color === 'rose') iconColorClass = 'text-rose-400';
                             if (item.color === 'emerald') iconColorClass = 'text-emerald-400';
                             if (item.color === 'amber') iconColorClass = 'text-amber-400';
                             if (item.color === 'violet') iconColorClass = 'text-violet-400';
                             if (item.color === 'indigo') iconColorClass = 'text-indigo-400';
                             if (item.color === 'yellow') iconColorClass = 'text-yellow-400';
                             if (item.color === 'blue') iconColorClass = 'text-blue-400';
                             if (item.color === 'lime') iconColorClass = 'text-lime-400';
                             if (item.color === 'teal') iconColorClass = 'text-teal-400';
                             if (item.color === 'cyan') iconColorClass = 'text-cyan-400';
                             if (item.color === 'orange') iconColorClass = 'text-orange-400';
                             if (item.color === 'fuchsia') iconColorClass = 'text-fuchsia-400';

                            return (
                                <div key={idx} className="bg-slate-800/60 p-5 rounded-xl border border-white/5 relative overflow-hidden group hover:bg-slate-800/80 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                         <item.icon size={64} />
                                    </div>
                                    <div className="flex items-center gap-2 mb-2 relative z-10">
                                         <item.icon size={20} className={iconColorClass} />
                                         <h3 className="text-white font-bold text-lg">{item.title}</h3>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                                        {item.desc}
                                        <br/><br/>
                                        <span className={`font-semibold ${iconColorClass} brightness-110`}>Bienfaits :</span> {item.benefit}
                                    </p>
                                    
                                    <div className="relative z-10 mt-4">
                                      <button
                                          onClick={() => handleSelectMode(item.mode)}
                                          className={`py-2 px-4 rounded-lg bg-slate-900/40 hover:bg-slate-900/60 border border-white/10 flex items-center gap-2 transition-all text-sm font-bold ${iconColorClass}`}
                                      >
                                          <Play size={14} fill="currentColor" />
                                          Pratiquer
                                      </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}

        {/* VIEW: SETUP */}
        {view === 'SETUP' && (
           <>
              <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-slate-900/10 backdrop-blur-md border-b border-white/5 h-16">
                 <button onClick={handleBackToMenu} className={`hover:text-white transition-colors ${currentTheme.text}`}>
                    <ChevronLeft size={28} />
                 </button>
                 <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{customConfig.label.split('(')[0]}</h3>
                    <div className="border border-white/30 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">i</div>
                 </div>
                 <div className="flex gap-4">
                    <Star size={24} className="text-white/50" />
                    <button onClick={handleCustomClick} className="text-white">
                        <span className="text-2xl font-light leading-none">+</span>
                    </button>
                 </div>
              </div>
              
              <ExerciseSetup 
                config={customConfig}
                onConfigChange={setCustomConfig}
                onStart={handleStartPractice}
                onBack={handleBackToMenu}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                isVibrationEnabled={isVibrationEnabled}
                onToggleVibration={() => setIsVibrationEnabled(!isVibrationEnabled)}
                durationMinutes={targetDurationMinutes}
                onDurationChange={setTargetDurationMinutes}
                soundTheme={soundTheme}
                onThemeChange={handleThemeChange}
                theme={currentTheme}
              />
           </>
        )}

        {/* VIEW: PRACTICE */}
        {view === 'PRACTICE' && (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-300">
            
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20">
               <button onClick={handleExitPractice} className="text-white/60 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronLeft size={20} /> Retour
               </button>
               <h3 className="font-semibold text-white/90">{customConfig.label.split('(')[0]}</h3>
               <div className="w-16"></div> 
            </div>

            <main className="flex flex-col items-center gap-8 -mt-20 relative">
              
              {/* CERCLE DE PROGRESSION SVG */}
              <div className="relative flex items-center justify-center">
                  
                  {targetDurationMinutes > 0 && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
                       <svg className="w-[380px] h-[380px]" viewBox="0 0 300 300">
                         {/* Fond du cercle */}
                         <circle
                           cx="150"
                           cy="150"
                           r={radius}
                           fill="none"
                           stroke="#ffffff10"
                           strokeWidth="3"
                         />
                         {/* Progression */}
                         <circle
                           cx="150"
                           cy="150"
                           r={radius}
                           fill="none"
                           stroke="currentColor"
                           className={`transition-all duration-1000 ${currentTheme.text}`}
                           strokeWidth="4"
                           strokeDasharray={circumference}
                           strokeDashoffset={circumference - (progressPercent / 100) * circumference}
                           strokeLinecap="round"
                           style={{ 
                               transform: 'rotate(-90deg)', 
                               transformOrigin: '50% 50%' 
                           }}
                         />
                       </svg>
                     </div>
                  )}

                  <BreathingVisual 
                    phase={phase} 
                    duration={phaseDuration} 
                    text={text}
                    countdown={phaseCountdown}
                    showGuides={showGuides}
                    theme={currentTheme}
                  />
              </div>
              
              <div className="flex items-center gap-4 text-slate-200 font-medium tracking-widest uppercase text-xs">
                 <div className="flex items-center gap-2">
                     <Clock size={14} className={currentTheme.text} />
                     <span>{formatTime(elapsedTime)}</span>
                 </div>
                 
                 <div className="w-px h-3 bg-white/20"></div>

                 <div className="flex items-center gap-2">
                    <Wind size={14} />
                    <span>Cycles : {cycles}</span>
                 </div>
              </div>
            </main>

            <Controls 
              isPlaying={isPlaying} 
              onToggle={() => setIsPlaying(!isPlaying)}
              onExit={handleExitPractice}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              isAmbianceOn={isAmbianceOn}
              onToggleAmbiance={toggleAmbiance}
              theme={currentTheme}
            />

            <ZenWisdom />
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
