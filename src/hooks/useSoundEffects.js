// Web Audio API Synthesizer for tactile luxury sound effects
// 100% native, zero dependencies, zero network requests, instant feedback

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
  }

  // Soft luxury chime when adding items to cart or saving
  playChime() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      // Golden harmonic frequencies (E6 -> G#6)
      osc1.frequency.setValueAtTime(1318.5, now); // E6
      osc1.frequency.exponentialRampToValueAtTime(1661.2, now + 0.15); // G#6

      osc2.frequency.setValueAtTime(659.25, now);
      osc2.frequency.exponentialRampToValueAtTime(830.6, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch {
      // AudioContext might be blocked until user interacts
    }
  }

  // Gentle bubble pop when clicking buttons or toggles
  playPop() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // Crisp and satisfying "Di-ding!" (Correct / Success Chime)
  playSuccess() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Note 1: "Di" - crisp mid-high chime (E5: 659.25 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.09, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Note 2: "Ding!" - bright high correct bell tone (B5 -> E6: 987.77 Hz -> 1318.5 Hz)
      const osc2 = this.ctx.createOscillator();
      const osc2Harmonic = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc2.type = 'sine';
      osc2Harmonic.type = 'triangle';

      const dingStart = now + 0.08;
      const dingDuration = 0.50;

      osc2.frequency.setValueAtTime(987.77, dingStart);
      osc2.frequency.exponentialRampToValueAtTime(1318.5, dingStart + 0.06);

      osc2Harmonic.frequency.setValueAtTime(1975.5, dingStart);
      osc2Harmonic.frequency.exponentialRampToValueAtTime(2637.0, dingStart + 0.06);

      gain2.gain.setValueAtTime(0.12, dingStart);
      gain2.gain.exponentialRampToValueAtTime(0.001, dingStart + dingDuration);

      osc2.connect(gain2);
      osc2Harmonic.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(dingStart);
      osc2Harmonic.start(dingStart);
      osc2.stop(dingStart + dingDuration);
      osc2Harmonic.stop(dingStart + dingDuration);
    } catch {
      // AudioContext might need user interaction first
    }
  }

  // Alias for playSuccess
  playCorrect() {
    this.playSuccess();
  }

  // Success fanfare when order or reservation is successfully placed
  playSuccessFanfare() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Sequence of 3 celebratory luxury notes (C5, G5, C6)
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.12 },
        { freq: 783.99, time: 0.12, dur: 0.14 },
        { freq: 1046.50, time: 0.26, dur: 0.35 }
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.07, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {}
  }

  // Ambient Lounge Synthesizer for 100% offline relaxing music
  startAmbientLounge(volume = 0.3) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      this.stopAmbientLounge();
      this.ambientActive = true;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.2, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.ambientMasterGain = masterGain;

      // Pentatonic Luxury Lounge Scale (D3, A3, D4, F#4, A4, B4, E5)
      const scale = [146.83, 220.00, 293.66, 369.99, 440.00, 493.88, 659.25];

      const playPadNote = () => {
        if (!this.ambientActive || !this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          const freq = scale[Math.floor(Math.random() * scale.length)];
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const duration = 4.0 + Math.random() * 3.0;
          noteGain.gain.setValueAtTime(0.0001, now);
          noteGain.gain.linearRampToValueAtTime(0.05, now + 1.2);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now);
          osc.stop(now + duration + 0.1);

          this.ambientTimer = setTimeout(playPadNote, 2000 + Math.random() * 2000);
        } catch {}
      };

      playPadNote();
      setTimeout(playPadNote, 1000);
      setTimeout(playPadNote, 2200);
    } catch {}
  }

  stopAmbientLounge() {
    this.ambientActive = false;
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
    if (this.ambientMasterGain && this.ctx) {
      try {
        this.ambientMasterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {}
    }
  }

  setAmbientVolume(vol) {
    if (this.ambientMasterGain && this.ctx) {
      try {
        this.ambientMasterGain.gain.setValueAtTime(Math.max(0, vol * 0.2), this.ctx.currentTime);
      } catch {}
    }
  }
}

export const soundFx = new SoundSynthesizer();
