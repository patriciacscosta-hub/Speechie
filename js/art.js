// Pip the speech-bubble mascot, and the line icons used around the app.

const MOUTHS = {
  happy: '<path d="M47 62 Q60 76 73 62" fill="none" stroke="#2E2A4F" stroke-width="4.5" stroke-linecap="round"/>',
  wow: '<ellipse cx="60" cy="67" rx="7.5" ry="8.5" fill="#2E2A4F"/><ellipse cx="60" cy="70" rx="4" ry="3" fill="#FF5A7A"/>',
  calm: '<path d="M50 66 Q60 71 70 66" fill="none" stroke="#2E2A4F" stroke-width="4.5" stroke-linecap="round"/>',
};

export function pip(mood = 'happy') {
  return `<svg class="pip" viewBox="0 0 120 112" aria-hidden="true">
    <path d="M60 6c29 0 52 19 52 43S89 92 60 92c-6 0-12-.8-17.6-2.3L20 105l5.8-20.6C14.4 76.6 8 63.4 8 49 8 25 31 6 60 6z" fill="#FF7A59"/>
    <path d="M60 13c-22 0-40 13-44 31 9-11 25-18 44-18s35 7 44 18C100 26 82 13 60 13z" fill="#fff" opacity=".22"/>
    <g class="pip-eyes">
      <ellipse cx="44" cy="46" rx="6.5" ry="8.5" fill="#2E2A4F"/><circle cx="46.6" cy="42.4" r="2.4" fill="#fff"/>
      <ellipse cx="76" cy="46" rx="6.5" ry="8.5" fill="#2E2A4F"/><circle cx="78.6" cy="42.4" r="2.4" fill="#fff"/>
    </g>
    <ellipse cx="32" cy="60" rx="7" ry="4.5" fill="#FF4F86" opacity=".4"/>
    <ellipse cx="88" cy="60" rx="7" ry="4.5" fill="#FF4F86" opacity=".4"/>
    ${MOUTHS[mood] || MOUTHS.happy}
  </svg>`;
}

const PATHS = {
  home: '<path d="M3.5 11.5 12 4.5l8.5 7"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
  speaker: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18.3 6.5a8 8 0 0 1 0 11"/>',
  mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v2.5"/>',
  stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.5" fill="currentColor"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
  again: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  star: '<path d="m12 3.8 2.5 5.2 5.6.7-4.1 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.7z" fill="currentColor"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  arrow: '<path d="M5 12h13"/><path d="M13 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
};

export const icon = (name) =>
  `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]}</svg>`;
