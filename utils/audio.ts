
// Audio Context Singleton
let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

type SoundType = 'flip' | 'match' | 'error' | 'start' | 'win' | 'lose';

export const playCyberSound = (type: SoundType) => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;

  switch (type) {
    case 'flip':
      // Distinct "Select" sound - High tech sharp chirp
      {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        // Fast sweep up then down
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(4000, now + 0.02);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
      }
      break;

    case 'match':
      // "Rewarding" sound - Ethereal Cyber Chord
      // Staggered Major 9th chord: C, E, G, B, D
      {
        const frequencies = [523.25, 659.25, 783.99, 987.77, 1174.66];
        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'triangle';
          osc.frequency.value = freq;

          // Slight detune for sci-fi feel
          osc.detune.value = (Math.random() - 0.5) * 10;

          // Stagger start slightly for arpeggio/strum effect
          const start = now + (i * 0.03);
          const duration = 0.8 + (i * 0.1);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.05, start + 0.05); // Attack
          gain.gain.exponentialRampToValueAtTime(0.001, start + duration); // Long Decay

          osc.start(start);
          osc.stop(start + duration);
        });
      }
      break;

    case 'error':
      // "Flicker" sound - Glitchy static & spark
      {
        // 1. Noise burst for the "spark"
        const bufferSize = ctx.sampleRate * 0.2; // 200ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          // White noise with random gaps to simulate sputtering/flickering
          data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.6 ? 1 : 0);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const nGain = ctx.createGain();
        noise.connect(nGain);
        nGain.connect(ctx.destination);

        nGain.gain.setValueAtTime(0.08, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        noise.start(now);

        // 2. Underlying dissonant tone that drops
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.connect(bGain);
        bGain.connect(ctx.destination);

        bOsc.type = 'sawtooth';
        bOsc.frequency.setValueAtTime(150, now);
        bOsc.frequency.linearRampToValueAtTime(50, now + 0.2); // Pitch drop

        bGain.gain.setValueAtTime(0.05, now);
        bGain.gain.linearRampToValueAtTime(0, now + 0.2);

        bOsc.start(now);
        bOsc.stop(now + 0.2);
      }
      break;

    case 'start':
      // Cyber power up sweep
      {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);
      }
      break;

    case 'win':
      // Victory Fanfare - High speed arpeggio
      {
        const winNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        winNotes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'sawtooth';
          osc.frequency.value = freq;

          const start = now + (i * 0.08);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.03, start + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

          osc.start(start);
          osc.stop(start + 0.6);
        });
      }
      break;

    case 'lose':
      // System Failure - Power down wobble
      {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.8);

        // Simulate LFO via frequency modulation manually for simplicity or just rapid ramps
        // Here we just drop pitch and volume
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.start(now);
        osc.stop(now + 0.8);
      }
      break;
  }
};
