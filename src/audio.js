export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.humGain = null;
    this.volume = .65;
  }

  ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume * .22;
    this.master.connect(this.ctx.destination);
    this.#startHum();
  }

  resume() {
    this.ensure();
    if (this.ctx?.state === 'suspended') this.ctx.resume().catch(() => {});
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.master) this.master.gain.setTargetAtTime(this.volume * .22, this.ctx.currentTime, .03);
  }

  #startHum() {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    this.humGain = this.ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = 49;
    osc2.type = 'sine'; osc2.frequency.value = 61;
    this.humGain.gain.value = .055;
    osc.connect(this.humGain); osc2.connect(this.humGain); this.humGain.connect(this.master);
    osc.start(); osc2.start();
  }

  tone(freq = 420, duration = .045, gain = .14, type = 'square') {
    if (!this.ctx || !this.master || this.volume <= 0) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(.001, now + duration);
    osc.connect(g); g.connect(this.master);
    osc.start(now); osc.stop(now + duration + .02);
  }

  click() { this.tone(290, .035, .08, 'square'); }
  switch() { this.tone(95, .07, .14, 'sawtooth'); }
  alert() { this.tone(620, .10, .16, 'square'); setTimeout(() => this.tone(520, .08, .12, 'square'), 90); }
  flag() { this.tone(160, .13, .18, 'sawtooth'); }
}
