// Procedural Web Audio API Sound Synthesizer for Soft Coffee Ambiance

export interface SoundState {
  isPlaying: boolean;
  masterVolume: number; // 0 to 1
  cafeVolume: number;   // 0 to 1
  rainVolume: number;   // 0 to 1
  brewVolume: number;   // 0 to 1
  spoonVolume: number;  // 0 to 1
}

class CoffeeSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Layer Gain Nodes
  private cafeGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private brewGain: GainNode | null = null;
  private spoonGain: GainNode | null = null;

  // Active Sound Generators
  private cafeSource: AudioBufferSourceNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private brewTimer: number | null = null;
  private spoonTimer: number | null = null;

  private state: SoundState = {
    isPlaying: false,
    masterVolume: 0.2, // Default soft background volume
    cafeVolume: 0.6,
    rainVolume: 0.4,
    brewVolume: 0.5,
    spoonVolume: 0.3,
  };

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.state.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Initialize Layer Gains
      this.cafeGain = this.ctx.createGain();
      this.cafeGain.gain.setValueAtTime(this.state.cafeVolume, this.ctx.currentTime);
      this.cafeGain.connect(this.masterGain);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(this.state.rainVolume, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);

      this.brewGain = this.ctx.createGain();
      this.brewGain.gain.setValueAtTime(this.state.brewVolume, this.ctx.currentTime);
      this.brewGain.connect(this.masterGain);

      this.spoonGain = this.ctx.createGain();
      this.spoonGain.gain.setValueAtTime(this.state.spoonVolume, this.ctx.currentTime);
      this.spoonGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Café Ambience Generator (Warm Low-Frequency Brown Noise)
  private createCafeNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not initialized');
    const bufferSize = 5 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 1.8;
    }
    return buffer;
  }

  // 2. Soft Rain Generator (Low-Pass Filtered Pink Noise with Gentle Modulation)
  private createRainNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not initialized');
    const bufferSize = 5 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.04;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // 3. Coffee Brewing Trickle Generator
  private triggerBrewDrip() {
    if (!this.ctx || !this.brewGain || !this.state.isPlaying) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const freq = 400 + Math.random() * 600;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);

    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 5;

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.03, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.brewGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // 4. Ceramic Spoon Clink Sound Generator
  private triggerSpoonClink() {
    if (!this.ctx || !this.spoonGain || !this.state.isPlaying) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(2100 + (Math.random() * 200 - 100), now);
    osc2.frequency.setValueAtTime(3400 + (Math.random() * 300 - 150), now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.spoonGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  public start() {
    this.initCtx();
    if (!this.ctx) return;

    this.state.isPlaying = true;

    // Start Café Ambience
    if (this.cafeGain) {
      const cafeBuf = this.createCafeNoiseBuffer();
      this.cafeSource = this.ctx.createBufferSource();
      this.cafeSource.buffer = cafeBuf;
      this.cafeSource.loop = true;

      const cafeFilter = this.ctx.createBiquadFilter();
      cafeFilter.type = 'lowpass';
      cafeFilter.frequency.value = 350;

      this.cafeSource.connect(cafeFilter);
      cafeFilter.connect(this.cafeGain);
      this.cafeSource.start();
    }

    // Start Rain Layer
    if (this.rainGain) {
      const rainBuf = this.createRainNoiseBuffer();
      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = rainBuf;
      this.rainSource.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 750;

      this.rainSource.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainSource.start();
    }

    // Start Brewing Drips loop
    const brewInterval = () => {
      if (!this.state.isPlaying) return;
      this.triggerBrewDrip();
      const delay = 120 + Math.random() * 250;
      this.brewTimer = window.setTimeout(brewInterval, delay);
    };
    brewInterval();

    // Start Spoon Clink loop
    const spoonInterval = () => {
      if (!this.state.isPlaying) return;
      this.triggerSpoonClink();
      const delay = 6000 + Math.random() * 9000;
      this.spoonTimer = window.setTimeout(spoonInterval, delay);
    };
    this.spoonTimer = window.setTimeout(spoonInterval, 2000);
  }

  public stop() {
    this.state.isPlaying = false;

    if (this.cafeSource) {
      try { this.cafeSource.stop(); } catch { /* ignore */ }
      this.cafeSource = null;
    }

    if (this.rainSource) {
      try { this.rainSource.stop(); } catch { /* ignore */ }
      this.rainSource = null;
    }

    if (this.brewTimer !== null) {
      clearTimeout(this.brewTimer);
      this.brewTimer = null;
    }

    if (this.spoonTimer !== null) {
      clearTimeout(this.spoonTimer);
      this.spoonTimer = null;
    }
  }

  public toggle(): boolean {
    if (this.state.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.state.isPlaying;
  }

  public setMasterVolume(vol: number) {
    this.state.masterVolume = vol;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public setCafeVolume(vol: number) {
    this.state.cafeVolume = vol;
    if (this.cafeGain && this.ctx) {
      this.cafeGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public setRainVolume(vol: number) {
    this.state.rainVolume = vol;
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public setBrewVolume(vol: number) {
    this.state.brewVolume = vol;
    if (this.brewGain && this.ctx) {
      this.brewGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public setSpoonVolume(vol: number) {
    this.state.spoonVolume = vol;
    if (this.spoonGain && this.ctx) {
      this.spoonGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public getState(): SoundState {
    return { ...this.state };
  }
}

export const soundEngine = new CoffeeSoundEngine();
