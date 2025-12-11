import React from 'react';

export enum BreathingMode {
  COHERENCE = 'COHERENCE', // 5-0-5-0 (Standard)
  RELAX_478 = 'RELAX_478', // 4-7-8-0
  AWAKE = 'AWAKE', // Éveillé 6-0-2-0
  ACTIVATE = 'ACTIVATE', // Activer 6-0-4-0
  CONCENTRATION = 'CONCENTRATION', // 5-0-2-0
  ENERGIZE = 'ENERGIZE', // Dynamiser 6-6-6-1
  BALANCE = 'BALANCE', // Équilibre 6-2-6-2
  REFRESH = 'REFRESH', // Rafraîchir 4-4-4-0
  PRANAYAMA = 'PRANAYAMA', // 7-4-8-4
  UJJAYI = 'UJJAYI', // 7-0-7-0
  LION = 'LION', // 4-0-7-0
  BUTEYKO = 'BUTEYKO', // 4-0-9-10
  MINDFULNESS = 'MINDFULNESS', // Pleine conscience 3-2-7-9
  RELAX_448 = 'RELAX_448', // 4-4-8-0
  ANXIETY = 'ANXIETY', // 6-4-6-0
  STRESS = 'STRESS', // 3-6-3-6
  SLEEP = 'SLEEP', // Dormir 4-4-8-4
  DIAPHRAGM = 'DIAPHRAGM', // 4-2-6-0
  DEEP_RELAX = 'DEEP_RELAX', // Vous allez vous détendre 4-0-8-8
  CUSTOM = 'CUSTOM', // Mode personnalisé
}

export enum BreathPhase {
  IDLE = 'IDLE',
  INHALE = 'INHALE',
  HOLD_IN = 'HOLD_IN',   // Hold after inhale (Poumons pleins)
  EXHALE = 'EXHALE',
  HOLD_OUT = 'HOLD_OUT', // Hold after exhale (Poumons vides)
}

export enum SoundTheme {
  WOOD = 'WOOD', // Sons boisés (origine)
  BELL = 'BELL', // Sons cloches/ting
}

// Nouveaux instruments synthétisés (Total 20 + NONE)
export type InstrumentType = 
  | 'WOOD' | 'BOWL' | 'FLUTE' | 'GONG' | 'DROP' 
  | 'PIANO' | 'HARP' | 'KOTO' | 'CRYSTAL' | 'OM' 
  | 'SPACE' | 'WIND' | 'RAIN' | 'BUBBLE' | 'GUITAR'
  | 'CELLO' | 'CHIME' | 'WAVE' | 'CRICKET' | 'BINAURAL'
  | 'NONE';

export interface SoundConfig {
  inhale: InstrumentType;
  holdIn: InstrumentType;
  exhale: InstrumentType;
  holdOut: InstrumentType;
}

export interface Reminder {
  id: string;
  time: string;
  enabled: boolean;
}

export interface BreathConfig {
  inhale: number;  // milliseconds
  holdIn: number;  // milliseconds
  exhale: number;  // milliseconds
  holdOut: number; // milliseconds
  label: string;
}

export interface ColorTheme {
  id: string;
  text: string;       // ex: text-sky-400
  textHover: string;  // ex: hover:text-sky-300
  bg: string;         // ex: bg-sky-500
  bgTrans: string;    // ex: bg-sky-500/20
  border: string;     // ex: border-sky-500
  ring: string;       // ex: ring-sky-500
  gradient: string;   // ex: from-sky-600 to-sky-500
  shadow: string;     // ex: shadow-sky-500/20
  stroke: string;     // ex: stroke-sky-400 (pour SVG)
}

export interface Wallpaper {
  id: string;
  name: string;
  style: React.CSSProperties;
}

export interface SessionData {
    id: string;
    date: number; // Timestamp de la fin de séance
    mode: BreathingMode; // Le mode utilisé
    durationSeconds: number; // Durée totale en secondes
    cyclesCompleted: number;
}

const sToMs = (s: number) => s * 1000;

export const MODES: Record<BreathingMode, BreathConfig> = {
  [BreathingMode.COHERENCE]: {
    inhale: sToMs(5), holdIn: 0, exhale: sToMs(5), holdOut: 0,
    label: "Cohérence Cardiaque (5s)"
  },
  [BreathingMode.RELAX_478]: {
    inhale: sToMs(4), holdIn: sToMs(7), exhale: sToMs(8), holdOut: 0,
    label: "Détente 4-7-8"
  },
  [BreathingMode.AWAKE]: {
    inhale: sToMs(6), holdIn: 0, exhale: sToMs(2), holdOut: 0,
    label: "Éveillé (6-0-2-0)"
  },
  [BreathingMode.ACTIVATE]: {
    inhale: sToMs(6), holdIn: 0, exhale: sToMs(4), holdOut: 0,
    label: "Activer (6-0-4-0)"
  },
  [BreathingMode.CONCENTRATION]: {
    inhale: sToMs(5), holdIn: 0, exhale: sToMs(2), holdOut: 0,
    label: "Concentration (5-0-2-0)"
  },
  [BreathingMode.ENERGIZE]: {
    inhale: sToMs(6), holdIn: sToMs(6), exhale: sToMs(6), holdOut: sToMs(1),
    label: "Dynamiser (6-6-6-1)"
  },
  [BreathingMode.BALANCE]: {
    inhale: sToMs(6), holdIn: sToMs(2), exhale: sToMs(6), holdOut: sToMs(2),
    label: "Équilibre (6-2-6-2)"
  },
  [BreathingMode.REFRESH]: {
    inhale: sToMs(4), holdIn: sToMs(4), exhale: sToMs(4), holdOut: 0,
    label: "Rafraîchir (4-4-4-0)"
  },
  [BreathingMode.PRANAYAMA]: {
    inhale: sToMs(7), holdIn: sToMs(4), exhale: sToMs(8), holdOut: sToMs(4),
    label: "Pranayama (7-4-8-4)"
  },
  [BreathingMode.UJJAYI]: {
    inhale: sToMs(7), holdIn: 0, exhale: sToMs(7), holdOut: 0,
    label: "Ujjayi (7-0-7-0)"
  },
  [BreathingMode.LION]: {
    inhale: sToMs(4), holdIn: 0, exhale: sToMs(7), holdOut: 0,
    label: "Respiration du Lion (4-0-7-0)"
  },
  [BreathingMode.BUTEYKO]: {
    inhale: sToMs(4), holdIn: 0, exhale: sToMs(9), holdOut: sToMs(10),
    label: "Buteyko (4-0-9-10)"
  },
  [BreathingMode.MINDFULNESS]: {
    inhale: sToMs(3), holdIn: sToMs(2), exhale: sToMs(7), holdOut: sToMs(9),
    label: "Pleine Conscience (3-2-7-9)"
  },
  [BreathingMode.RELAX_448]: {
    inhale: sToMs(4), holdIn: sToMs(4), exhale: sToMs(8), holdOut: 0,
    label: "Respiration 4-4-8"
  },
  [BreathingMode.ANXIETY]: {
    inhale: sToMs(6), holdIn: sToMs(4), exhale: sToMs(6), holdOut: 0,
    label: "Anxiété (6-4-6-0)"
  },
  [BreathingMode.STRESS]: {
    inhale: sToMs(3), holdIn: sToMs(6), exhale: sToMs(3), holdOut: sToMs(6),
    label: "Anti-Stress (3-6-3-6)"
  },
  [BreathingMode.SLEEP]: {
    inhale: sToMs(4), holdIn: sToMs(4), exhale: sToMs(8), holdOut: sToMs(4),
    label: "Dormir (4-4-8-4)"
  },
  [BreathingMode.DIAPHRAGM]: {
    inhale: sToMs(4), holdIn: sToMs(2), exhale: sToMs(6), holdOut: 0,
    label: "Diaphragmatique (4-2-6-0)"
  },
  [BreathingMode.DEEP_RELAX]: {
    inhale: sToMs(4), holdIn: 0, exhale: sToMs(8), holdOut: sToMs(8),
    label: "Relaxation Profonde (4-0-8-8)"
  },
  [BreathingMode.CUSTOM]: {
    inhale: sToMs(4), holdIn: sToMs(4), exhale: sToMs(4), holdOut: sToMs(4),
    label: "Personnalisé"
  }
};