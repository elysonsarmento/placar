// Web Audio API & Web Speech API for Placar Pro Sound Effects

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Som de Ponto (+1)
export function playPointSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.error('Audio play error:', e);
  }
}

// 2. Som de Subtração (-1)
export function playMinusSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(349.23, ctx.currentTime); // F4
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12); // A3

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.error('Audio play error:', e);
  }
}

// 3. Apito de Juiz / Fim de Set ou Partida (Referee Whistle)
export function playWhistleSound(duration = 0.8) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Duas frequências combinadas produzem o trinado característico do apito
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    // Oscilador de trinado (LFO) para vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(2800, now);
    osc2.frequency.setValueAtTime(3150, now);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(24, now); // 24Hz vibrato trill
    lfoGain.gain.setValueAtTime(150, now);

    lfo.connect(osc1.frequency);
    lfo.connect(osc2.frequency);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
    gain.gain.setValueAtTime(0.4, now + duration - 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);

    lfo.stop(now + duration);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch (e) {
    console.error('Whistle play error:', e);
  }
}

// 4. Locutor / Narração de Placar por Voz em Português
export function speakScore(team1Score: number, team2Score: number, team1Name = 'Time A', team2Name = 'Time B') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Para falas anteriores
    const text = `${team1Score} a ${team2Score}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1; // Velocidade dinâmica
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Speech error:', e);
  }
}

// 5. Anúncio em Texto (Ex: "Fim de Set! Vitória do Time A")
export function speakText(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Speech text error:', e);
  }
}
