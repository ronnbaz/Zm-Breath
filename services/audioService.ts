
import { BreathPhase, SoundTheme, InstrumentType, SoundConfig } from '../types';

class ZenAudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  
  // Buffer de bruit blanc pour les sons naturels (vent, pluie)
  private whiteNoiseBuffer: AudioBuffer | null = null;

  // Élément audio pour l'ambiance
  private ambianceAudio: HTMLAudioElement | null = null;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
        // Smooth transition
        const t = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(t);
        this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, t, 0.1);
    }
    if (this.ambianceAudio) {
        this.ambianceAudio.muted = muted;
    }
  }

  public setTheme(theme: SoundTheme) {
    // Legacy support
  }

  public async init() {
    if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = this.isMuted ? 0 : 1;

        // Génération du buffer de bruit blanc (2 secondes suffisent pour looper ou filtrer)
        this.createWhiteNoiseBuffer();
    }
    
    // Initialisation du son d'ambiance
    if (!this.ambianceAudio) {
        const domAudio = document.getElementById('ambiance-audio') as HTMLAudioElement;
        if (domAudio) {
            this.ambianceAudio = domAudio;
            this.ambianceAudio.volume = 0.5; 
        } else {
            this.ambianceAudio = new Audio('https://cdn.jsdelivr.net/gh/Lirone-app/zen-sounds@latest/water_stream_loop.mp3');
            this.ambianceAudio.loop = true;
            this.ambianceAudio.volume = 0.5;
        }
    }

    if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
    }
    this.setupMediaSession();
  }

  private createWhiteNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    this.whiteNoiseBuffer = buffer;
  }

  public toggleAmbiance(enable: boolean) {
      if (!this.ambianceAudio) {
          this.init();
      }
      
      if (this.ambianceAudio) {
          if (enable) {
              this.resume(); 
              this.ambianceAudio.muted = this.isMuted;
              this.ambianceAudio.play().catch(e => console.warn("Ambiance play failed:", e));
          } else {
              this.ambianceAudio.pause();
          }
      }
  }

  public stop() {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
    }
  }

  public resume() {
     if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
     }
     if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
    }
  }

  public startBackground() {
      // To keep audio context alive
  }

  // --- MAIN PLAYBACK ROUTING ---

  public transitionToWithConfig(phase: BreathPhase, durationMs: number, config: SoundConfig) {
     let instrument: InstrumentType = 'NONE';
     
     switch(phase) {
         case BreathPhase.INHALE: instrument = config.inhale; break;
         case BreathPhase.HOLD_IN: instrument = config.holdIn; break;
         case BreathPhase.EXHALE: instrument = config.exhale; break;
         case BreathPhase.HOLD_OUT: instrument = config.holdOut; break;
     }

     if (instrument !== 'NONE') {
        this.playInstrument(instrument, phase);
     }
     
     this.updateLockScreen(phase);
  }

  // Méthode publique pour prévisualiser un son
  public previewSound(instrument: InstrumentType) {
      if (!this.ctx) {
        this.init();
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      // On utilise la phase d'inspiration comme référence pour la pré-écoute
      this.playInstrument(instrument, BreathPhase.INHALE);
  }

  // Son de fin (Gong long et profond)
  public playGongFinish() {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      // Corps principal (110 Hz, Triangle, Decay 4s)
      this.playSynthTone('triangle', 110, 0.05, 4.0, 0.6);
      
      // Harmonique (165 Hz, Sine, Decay plus court 2.5s)
      this.playSynthTone('sine', 165, 0.05, 2.5, 0.4);
  }

  // --- INSTRUMENT LOGIC ---

  private playInstrument(instrument: InstrumentType, phase: BreathPhase) {
      const isUp = (phase === BreathPhase.INHALE || phase === BreathPhase.HOLD_IN);

      switch (instrument) {
          // --- CLASSIQUES ---
          case 'BOWL': 
              this.playSynthTone('sine', isUp ? 261.6 : 196.0, 0.3, 3.5, 0.6);
              break;
          case 'FLUTE': 
              this.playSynthTone('sine', isUp ? 523.25 : 392.00, 0.1, 1.5, 0.4);
              break;
          case 'WOOD': 
              this.playSynthTone('triangle', isUp ? 880 : 660, 0.01, 0.1, 0.3);
              break;
          case 'DROP': 
              this.playWaterDrop(isUp ? 600 : 400);
              break;
          case 'GONG': 
              this.playSynthTone('triangle', isUp ? 146.8 : 110.0, 0.05, 3.0, 0.6);
              break;

          // --- NATURE & ZEN ---
          case 'PIANO': // Piano électrique doux
              this.playSynthTone('triangle', isUp ? 440.0 : 329.6, 0.05, 1.8, 0.4);
              this.playSynthTone('sine', isUp ? 440.0 : 329.6, 0.05, 2.2, 0.3);
              break;

          case 'HARP': // Harpe (Pluck filtré)
              this.playFilteredSaw(isUp ? 392.0 : 261.6, 0.01, 1.5, 800, 0.4);
              break;

          case 'KOTO': // Koto Japonais (Attaque rapide)
              this.playKoto(isUp ? 523.25 : 392.00);
              break;

          case 'CRYSTAL': // Cristal pur (très aigu)
              this.playSynthTone('sine', isUp ? 880.0 : 783.99, 0.5, 2.0, 0.2);
              break;

          case 'OM': // Chant Om (Sawtooth bas filtré)
              this.playFilteredSaw(isUp ? 130.8 : 98.0, 0.5, 3.0, 300, 0.5);
              break;

          case 'SPACE': // Espace (FM Synthesis simple)
              this.playSpaceDrone(isUp ? 300 : 200);
              break;

          case 'WIND': // Souffle (Bruit blanc filtré passe-bande qui bouge)
              this.playNoiseBurst(isUp ? 0.8 : 1.2, 400, 'lowpass', 0.15);
              break;

          case 'RAIN': // Pluie / Shaker (Bruit blanc Highpass court)
              this.playNoiseBurst(0.1, 3000, 'highpass', 0.1);
              break;

          case 'BUBBLE': // Bulle (Chirp montant sinus)
              this.playWaterDrop(isUp ? 300 : 200); 
              break;

          case 'GUITAR': // Guitare (Sawtooth pluck plus doux)
              this.playFilteredSaw(isUp ? 329.6 : 246.9, 0.02, 1.2, 1200, 0.4);
              break;

          // --- NOUVEAUX ---
          case 'CELLO': // Violoncelle (Sawtooth filtré lentement)
              this.playFilteredSaw(isUp ? 220.0 : 146.8, 0.4, 2.5, 600, 0.5);
              break;

          case 'CHIME': // Carillon (Hautes fréquences inharmoniques)
              this.playChime(isUp ? 1200 : 900);
              break;
          
          case 'WAVE': // Vague (Noise avec Lowpass modulant)
              this.playNoiseBurst(isUp ? 2.5 : 3.5, 400, 'lowpass', 0.3); // Plus long que le vent
              break;

          case 'CRICKET': // Criquet (FM rapide aiguë)
               // Simulé par des beeps très courts répétés ou un tone modulé
               this.playCricket();
               break;

          case 'BINAURAL': // Battement binaural (Simulation monophonique par interférence)
               // On joue deux fréquences très proches pour créer un battement de 5Hz (Theta)
               const freq = isUp ? 200 : 180;
               this.playSynthTone('sine', freq, 0.5, 3.0, 0.3);
               this.playSynthTone('sine', freq + 5, 0.5, 3.0, 0.3);
               break;
      }
  }

  // --- SYNTHESIS CORE FUNCTIONS ---

  // Oscillateur simple
  private playSynthTone(type: OscillatorType, freq: number, attack: number, decay: number, vol: number) {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, t + attack + decay);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + attack + decay + 0.1);
  }

  // Sawtooth avec filtre Lowpass (Pour cordes/Om/Cello)
  private playFilteredSaw(freq: number, attack: number, decay: number, cutoff: number, vol: number) {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoff, t);
      // Petite modulation du filtre pour le réalisme
      filter.frequency.exponentialRampToValueAtTime(cutoff * 0.5, t + decay);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, t + attack + decay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + attack + decay + 0.1);
  }

  // Simulation Koto
  private playKoto(freq: number) {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square'; // Son plus métallique
      osc.frequency.setValueAtTime(freq, t);

      // Enveloppe très "plucked"
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.7);
  }

  // Simulation Goutte / Bulle
  private playWaterDrop(startFreq: number) {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, t + 0.15);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.01); 
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25); 

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.3);
  }

  // Simulation Chime
  private playChime(baseFreq: number) {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      // Joue 2 notes aiguës inharmoniques
      this.playSynthTone('sine', baseFreq, 0.01, 1.5, 0.3);
      this.playSynthTone('sine', baseFreq * 1.58, 0.01, 1.2, 0.2); // Ratio non entier pour le métal
  }

  // Simulation Cricket (FM simple rapide)
  private playCricket() {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      // Une série de petits beeps modulés
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(4000, t); // Aigu
      
      // Tremolo rapide pour simuler le frottement
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(30, t);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.5, t);
      lfo.connect(lfoGain);
      lfoGain.connect(amp.gain);
      lfo.start(t);
      lfo.stop(t+0.5);

      amp.gain.setValueAtTime(0, t);
      amp.gain.linearRampToValueAtTime(0.1, t + 0.05);
      amp.gain.linearRampToValueAtTime(0, t + 0.5);

      osc.connect(amp);
      amp.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.5);
  }

  // Simulation Espace (FM)
  private playSpaceDrone(freq: number) {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      
      const carrier = this.ctx.createOscillator();
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const masterGain = this.ctx.createGain();

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(freq, t);

      modulator.type = 'sine';
      modulator.frequency.setValueAtTime(4, t); // Vibrato rapide
      
      modGain.gain.setValueAtTime(10, t); // Profondeur modulation

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);

      masterGain.gain.setValueAtTime(0, t);
      masterGain.gain.linearRampToValueAtTime(0.3, t + 1.0);
      masterGain.gain.linearRampToValueAtTime(0, t + 3.0);

      carrier.connect(masterGain);
      masterGain.connect(this.masterGain);

      carrier.start(t);
      modulator.start(t);
      carrier.stop(t + 3.1);
      modulator.stop(t + 3.1);
  }

  // Simulation Bruit (Vent, Pluie, Vague)
  private playNoiseBurst(duration: number, filterFreq: number, filterType: BiquadFilterType, vol: number) {
      if (this.isMuted || !this.ctx || !this.masterGain || !this.whiteNoiseBuffer) return;
      const t = this.ctx.currentTime;

      const source = this.ctx.createBufferSource();
      source.buffer = this.whiteNoiseBuffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(filterFreq, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.1);
      gain.gain.linearRampToValueAtTime(0, t + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(t);
      source.stop(t + duration + 0.1);
  }

  private setupMediaSession() {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Respiration Zen',
            artist: 'ZenMaster',
            album: 'Lirone',
            artwork: [
                { src: 'https://cdn-icons-png.flaticon.com/512/3663/3663335.png', sizes: '512x512', type: 'image/png' }
            ]
        });
        navigator.mediaSession.setActionHandler('play', () => { this.resume(); });
        navigator.mediaSession.setActionHandler('pause', () => { this.stop(); });
    }
  }

  private updateLockScreen(phase: BreathPhase) {
      if ('mediaSession' in navigator) {
          let label = "Respiration";
          if (phase === BreathPhase.INHALE) label = "Inspirez";
          if (phase === BreathPhase.EXHALE) label = "Expirez";
          if (phase === BreathPhase.HOLD_IN || phase === BreathPhase.HOLD_OUT) label = "Maintenez";
          
          navigator.mediaSession.metadata = new MediaMetadata({
            title: label, 
            artist: 'ZenMaster',
             artwork: [
                { src: 'https://cdn-icons-png.flaticon.com/512/3663/3663335.png', sizes: '512x512', type: 'image/png' }
            ]
        });
      }
  }
}

export const audioService = new ZenAudioService();
