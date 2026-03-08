// Web Audio API mood-based music generator
// Generates ambient soundscapes without external dependencies

type Mood = 'sad' | 'calm' | 'joyful' | 'energetic' | 'anxious' | 'sleepy';

interface MoodConfig {
  label: string;
  emoji: string;
  description: string;
  color: string;
  bpm: number;
  scale: number[];
  baseFreq: number;
  noteLength: number;
  reverbDecay: number;
  waveform: OscillatorType;
  padWaveform: OscillatorType;
  padVolume: number;
  melodyVolume: number;
  filterFreq: number;
}

export const moodConfigs: Record<Mood, MoodConfig> = {
  sad: {
    label: 'Sad',
    emoji: '😢',
    description: 'Gentle, melancholic ambient tones to process emotions',
    color: 'hsl(var(--fitness))',
    bpm: 55,
    scale: [0, 3, 5, 7, 10, 12, 15], // minor pentatonic
    baseFreq: 220,
    noteLength: 1.8,
    reverbDecay: 3,
    waveform: 'sine',
    padWaveform: 'sine',
    padVolume: 0.08,
    melodyVolume: 0.12,
    filterFreq: 800,
  },
  calm: {
    label: 'Calm',
    emoji: '😌',
    description: 'Peaceful ambient sounds for relaxation & meditation',
    color: 'hsl(var(--wellness))',
    bpm: 60,
    scale: [0, 2, 4, 7, 9, 12, 14], // major pentatonic
    baseFreq: 261,
    noteLength: 1.5,
    reverbDecay: 2.5,
    waveform: 'sine',
    padWaveform: 'triangle',
    padVolume: 0.06,
    melodyVolume: 0.1,
    filterFreq: 1200,
  },
  joyful: {
    label: 'Joyful',
    emoji: '😊',
    description: 'Bright, uplifting melodies to boost your mood',
    color: 'hsl(var(--nutrition))',
    bpm: 110,
    scale: [0, 2, 4, 5, 7, 9, 11, 12], // major scale
    baseFreq: 330,
    noteLength: 0.4,
    reverbDecay: 1.5,
    waveform: 'triangle',
    padWaveform: 'sine',
    padVolume: 0.05,
    melodyVolume: 0.15,
    filterFreq: 3000,
  },
  energetic: {
    label: 'Energetic',
    emoji: '🔥',
    description: 'Rhythmic, driving beats for workouts & motivation',
    color: 'hsl(var(--destructive))',
    bpm: 130,
    scale: [0, 2, 3, 5, 7, 8, 10, 12], // natural minor
    baseFreq: 196,
    noteLength: 0.25,
    reverbDecay: 0.8,
    waveform: 'sawtooth',
    padWaveform: 'square',
    padVolume: 0.04,
    melodyVolume: 0.12,
    filterFreq: 4000,
  },
  anxious: {
    label: 'Anxious Relief',
    emoji: '🧘',
    description: 'Soothing drone tones to ease anxiety & stress',
    color: 'hsl(var(--accent))',
    bpm: 50,
    scale: [0, 2, 4, 7, 9, 12], // pentatonic major
    baseFreq: 174, // Solfeggio frequency
    noteLength: 2.5,
    reverbDecay: 4,
    waveform: 'sine',
    padWaveform: 'sine',
    padVolume: 0.1,
    melodyVolume: 0.06,
    filterFreq: 600,
  },
  sleepy: {
    label: 'Sleepy',
    emoji: '💤',
    description: 'Ultra-gentle lullaby tones to drift into sleep',
    color: 'hsl(var(--cycle))',
    bpm: 45,
    scale: [0, 2, 4, 7, 9, 12, 14], // major pentatonic
    baseFreq: 196,
    noteLength: 2.0,
    reverbDecay: 5,
    waveform: 'sine',
    padWaveform: 'sine',
    padVolume: 0.05,
    melodyVolume: 0.04,
    filterFreq: 500,
  },
};

export type { Mood };

export class MoodMusicEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private intervalId: number | null = null;
  private isPlaying = false;
  private currentMood: Mood | null = null;

  private getCtx(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  private semitonesToFreq(base: number, semitones: number): number {
    return base * Math.pow(2, semitones / 12);
  }

  private createReverb(ctx: AudioContext, decay: number): ConvolverNode {
    const length = ctx.sampleRate * decay;
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  play(mood: Mood) {
    if (this.isPlaying) this.stop();

    const ctx = this.getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const config = moodConfigs[mood];
    this.currentMood = mood;
    this.isPlaying = true;

    // Master gain
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.5;
    
    // Reverb
    const reverb = this.createReverb(ctx, config.reverbDecay);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.3;
    
    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = config.filterFreq;
    filter.Q.value = 1;

    // Chain: source → filter → master → (dry + reverb) → destination
    filter.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);
    this.masterGain.connect(reverb);
    reverb.connect(reverbGain);
    reverbGain.connect(ctx.destination);

    // Ambient pad (continuous drone)
    const padFreqs = [config.baseFreq, this.semitonesToFreq(config.baseFreq, 7)]; // root + fifth
    padFreqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = config.padWaveform;
      osc.frequency.value = freq;
      const padGain = ctx.createGain();
      padGain.gain.value = 0;
      padGain.gain.linearRampToValueAtTime(config.padVolume, ctx.currentTime + 3);
      osc.connect(padGain);
      padGain.connect(filter);
      osc.start();
      this.activeOscillators.push(osc);
    });

    // Melody loop
    const beatInterval = 60000 / config.bpm;
    let noteIndex = 0;

    const playNote = () => {
      if (!this.isPlaying) return;
      
      const semitone = config.scale[noteIndex % config.scale.length];
      const octaveShift = Math.random() > 0.7 ? 12 : 0;
      const freq = this.semitonesToFreq(config.baseFreq, semitone + octaveShift);

      const osc = ctx.createOscillator();
      osc.type = config.waveform;
      osc.frequency.value = freq;

      const noteGain = ctx.createGain();
      const now = ctx.currentTime;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(config.melodyVolume, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + config.noteLength);

      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.start(now);
      osc.stop(now + config.noteLength + 0.1);

      // Random walk through scale
      if (Math.random() > 0.3) {
        noteIndex += Math.random() > 0.5 ? 1 : -1;
        if (noteIndex < 0) noteIndex = config.scale.length - 1;
      } else {
        noteIndex = Math.floor(Math.random() * config.scale.length);
      }
    };

    playNote();
    this.intervalId = window.setInterval(playNote, beatInterval);
  }

  stop() {
    this.isPlaying = false;
    this.currentMood = null;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.activeOscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.activeOscillators = [];

    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.getCtx().currentTime + 0.5);
      setTimeout(() => {
        this.masterGain?.disconnect();
        this.masterGain = null;
      }, 600);
    }
  }

  setVolume(v: number) {
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(v, this.getCtx().currentTime + 0.1);
    }
  }

  getIsPlaying() { return this.isPlaying; }
  getCurrentMood() { return this.currentMood; }

  destroy() {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
