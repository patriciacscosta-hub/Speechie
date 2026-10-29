// Speaking (built-in British voice), recording the child, and little sound effects.
import * as store from './store.js';

const synth = window.speechSynthesis;
let voices = [];
const voiceListeners = new Set();

function loadVoices() {
  voices = synth ? synth.getVoices() : [];
  voiceListeners.forEach((fn) => fn());
}
if (synth) {
  loadVoices();
  synth.addEventListener?.('voiceschanged', loadVoices);
}

export const onVoicesChanged = (fn) => {
  voiceListeners.add(fn);
  return () => voiceListeners.delete(fn);
};

export const britishVoices = () => voices.filter((v) => /en[-_]GB/i.test(v.lang));

function chooseVoice() {
  const chosen = store.get().settings.voiceURI;
  const gb = britishVoices();
  return (
    (chosen && voices.find((v) => v.voiceURI === chosen)) ||
    gb.find((v) => /premium|enhanced/i.test(v.name)) ||
    gb.find((v) => /daniel|kate|serena|martha|arthur/i.test(v.name)) ||
    gb[0] ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    null
  );
}

export function speak(text, { rate } = {}) {
  return new Promise((resolve) => {
    if (!synth || !text.trim()) return resolve();
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = chooseVoice();
    if (voice) u.voice = voice;
    u.lang = voice?.lang || 'en-GB';
    u.rate = rate ?? store.get().settings.rate;
    u.pitch = 1.05;
    let finished = false;
    const done = () => {
      if (!finished) {
        finished = true;
        resolve();
      }
    };
    u.onend = done;
    u.onerror = done;
    synth.speak(u);
    setTimeout(done, 1500 + text.length * 110);
  });
}

export const stopSpeaking = () => synth?.cancel();

// --- Sound effects (generated, no files needed) ---

let ctx = null;
function audioContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// iPad only allows sound after a tap, so call this from the first tap.
export function unlockAudio() {
  audioContext();
  if (synth) {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    synth.speak(u);
  }
}

function tone(freq, at, dur, type = 'sine', vol = 0.16) {
  if (!store.get().settings.sfx) return;
  const c = audioContext();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const t = c.currentTime + at;
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export const sfx = {
  tap: () => tone(720, 0, 0.08, 'triangle', 0.08),
  good: () => {
    tone(660, 0, 0.14, 'triangle');
    tone(990, 0.11, 0.26, 'triangle');
  },
  oops: () => {
    tone(320, 0, 0.12, 'sine', 0.1);
    tone(250, 0.1, 0.2, 'sine', 0.1);
  },
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.1, 0.32, 'triangle', 0.14)),
};

// --- Recording the child's voice ---
// The microphone is released after every recording so iPad playback stays loud
// (iOS quietens speakers while a mic is open).

let stream = null;
let rec = null;
let chunks = [];
let lastUrl = null;

export const recorder = {
  supported: !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder),

  async start() {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    chunks = [];
    rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.start();
  },

  stop() {
    return new Promise((resolve) => {
      if (!rec || rec.state === 'inactive') return resolve(null);
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/mp4' });
        if (lastUrl) URL.revokeObjectURL(lastUrl);
        lastUrl = blob.size ? URL.createObjectURL(blob) : null;
        this.release();
        resolve(lastUrl);
      };
      rec.stop();
    });
  },

  release() {
    if (rec && rec.state !== 'inactive') {
      rec.onstop = null;
      rec.stop();
    }
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    rec = null;
  },
};
