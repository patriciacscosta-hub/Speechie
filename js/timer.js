// Daily play timer. Only time on the children's screens counts (not the grown-ups area),
// and it pauses while Speechie isn't on screen. Kept apart from progress so saving
// every second stays cheap.
import * as store from './store.js';

const KEY = 'speechie.time';
const day = (t = Date.now()) => new Date(t).toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved?.days) return saved;
  } catch {}
  return { days: {}, bonus: { day: '', secs: 0 } };
}

const data = load();
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
};

let running = false;
let last = Date.now();
let upFired = false;
const listeners = new Set();
let onUp = () => {};

export const usedToday = () => data.days[day()] || 0;
export const limited = () => store.get().settings.minutes > 0;
export function left() {
  if (!limited()) return Infinity;
  const bonus = data.bonus.day === day() ? data.bonus.secs : 0;
  return Math.max(0, store.get().settings.minutes * 60 + bonus - usedToday());
}
export const isUp = () => left() <= 0;

// Seconds played on each of the last n days, oldest first.
export function history(n = 7) {
  return Array.from({ length: n }, (_, k) => {
    const t = Date.now() - (n - 1 - k) * 864e5;
    return { t, secs: data.days[day(t)] || 0 };
  });
}

export function addMinutes(mins) {
  const today = day();
  if (data.bonus.day !== today) data.bonus = { day: today, secs: 0 };
  data.bonus.secs += mins * 60;
  upFired = false;
  save();
  changed();
}

export function resetToday() {
  delete data.days[day()];
  data.bonus = { day: '', secs: 0 };
  upFired = false;
  save();
  changed();
}

export const onChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const whenUp = (fn) => (onUp = fn);

export function run(on) {
  running = on;
  last = Date.now();
}

function changed() {
  listeners.forEach((fn) => fn());
}

setInterval(() => {
  const now = Date.now();
  const secs = (now - last) / 1000;
  last = now;
  // Big gaps mean the iPad was asleep: don't count them.
  if (!running || document.hidden || secs > 5) return;
  const today = day();
  data.days[today] = (data.days[today] || 0) + secs;
  for (const k of Object.keys(data.days)) if (k < day(now - 90 * 864e5)) delete data.days[k];
  save();
  changed();
  if (!isUp()) upFired = false;
  else if (!upFired) {
    upFired = true;
    onUp();
  }
}, 1000);

document.addEventListener('visibilitychange', () => (last = Date.now()));

// Shown as m:ss, e.g. 8:05.
export function format(secs) {
  const s = Math.ceil(secs);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
