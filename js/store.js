// Everything is saved on this device only (localStorage). No accounts, no uploads.

const KEY = 'speechie.v1';

const defaults = () => ({
  child: null, // { name, avatar }
  skills: { hs: true, they: true, isare: true, hashave: true, verbs: false, waswere: false },
  settings: {
    voiceURI: '',
    rate: 0.85,
    volume: 1, // Pip's voice, 0.2–1
    sfx: true,
    sfxVolume: 0.8,
    minutes: 10, // daily play time; 0 = no limit
    textSize: 'normal', // normal | large | xl
    theme: 'auto', // topic words: 'auto' follows the calendar, or a theme id
  },
  stars: 0,
  stickers: [],
  rounds: 0,
  log: [], // { t, activity, skill, pron, ok?, rating? }
});

function load() {
  const d = defaults();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) {
      return { ...d, ...saved, skills: { ...d.skills, ...saved.skills }, settings: { ...d.settings, ...saved.settings } };
    }
  } catch {}
  return d;
}

let state = load();

// Ask the browser not to clear our data when space runs low.
navigator.storage?.persist?.().catch(() => {});

export const get = () => state;

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export function update(fn) {
  fn(state);
  save();
}

export function logAttempt(entry) {
  state.log.push({ t: Date.now(), ...entry });
  if (state.log.length > 5000) state.log = state.log.slice(-5000);
  save();
}

export function resetProgress() {
  const { child, settings, skills } = state;
  state = { ...defaults(), child, settings, skills };
  save();
}
