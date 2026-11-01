// Picture-book scenes drawn in code: Meg (she), Ben (he), or both (they) doing an action.
// Each character is drawn from its feet up, in its own coordinates (feet at 0,0, head top near -300),
// then placed in a 400 × 400 scene. A pose sets where the hands and legs go; props hang off the hands.

const GROUND = 352;

const C = {
  ink: '#2E2A4F',
  cheek: '#F07A8A',
  white: '#FFFFFF',
  shoeLine: '#D9D2C8',
};

const MEG = {
  skin: '#8A5A3C', skinLine: '#6B4429',
  hair: '#2A1A14', bobble: '#FFD23F',
  top: '#FFC43D', stripe: '#F29E1B', dress: '#E8483B', dressLine: '#C7362B',
  shoe: '#FFFFFF', sole: '#E8E1D6',
};
const BEN = {
  skin: '#F6D2B5', skinLine: '#D9A98A',
  hair: '#F08A2E', hairLine: '#D06E18', freckle: '#D98A5F',
  top: '#2BB3A3', topLine: '#1E8F82', star: '#FFD23F', shorts: '#3D7FD9', shortsLine: '#2C62AE',
  shoe: '#E8483B', sole: '#FFFFFF',
};

// Hand positions for each arm pose, in the character's own coordinates.
const ARMS = {
  rest: [[-46, -110], [46, -110]],
  out: [[-82, -150], [82, -150]],
  cheer: [[-62, -232], [62, -232]],
  mouth: [[-46, -110], [14, -198]],
  front: [[-24, -132], [24, -132]],
  drum: [[-36, -128], [36, -150]],
  reach: [[-46, -110], [70, -96]],
  hug: [[-26, -140], [26, -140]],
  pan: [[-22, -126], [44, -136]],
};
const SHOULDER = [[-28, -176], [28, -176]];

const pt = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;

function arm(look, [sx, sy], [hx, hy], side) {
  // A gentle elbow bend outwards.
  const mx = (sx + hx) / 2 + side * 10;
  const my = (sy + hy) / 2 + 8;
  const d = `M${pt(sx, sy)} Q${pt(mx, my)} ${pt(hx, hy)}`;
  const t = 0.42;
  const ex = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * mx + t * t * hx;
  const ey = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * my + t * t * hy;
  const sleeve = `M${pt(sx, sy)} Q${pt((sx + ex) / 2 + side * 4, (sy + ey) / 2 + 3)} ${pt(ex, ey)}`;
  return `<path d="${d}" fill="none" stroke="${look.skinLine}" stroke-width="17" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${look.skin}" stroke-width="13" stroke-linecap="round"/>
    <path d="${sleeve}" fill="none" stroke="${look === MEG ? MEG.stripe : BEN.topLine}" stroke-width="24" stroke-linecap="round"/>
    <path d="${sleeve}" fill="none" stroke="${look.top}" stroke-width="20" stroke-linecap="round"/>
    <circle cx="${hx}" cy="${hy}" r="9.5" fill="${look.skin}" stroke="${look.skinLine}" stroke-width="2"/>`;
}

function shoe(look, x, y, flip = 1) {
  return `<path d="M${x - 17 * flip} ${y + 4} Q${x - 18 * flip} ${y - 10} ${x - 2 * flip} ${y - 10} Q${x + 14 * flip} ${y - 8} ${x + 20 * flip} ${y + 2} Q${x + 20 * flip} ${y + 7} ${x + 12 * flip} ${y + 7} L${x - 12 * flip} ${y + 7} Q${x - 17 * flip} ${y + 7} ${x - 17 * flip} ${y + 4} Z"
      fill="${look.shoe}" stroke="${look === MEG ? C.shoeLine : '#B82E24'}" stroke-width="2"/>
    <path d="M${x - 16 * flip} ${y + 4} L${x + 19 * flip} ${y + 4}" stroke="${look.sole}" stroke-width="3.5" stroke-linecap="round"/>`;
}

function leg(look, x, top, bottom) {
  return `<rect x="${x - 8}" y="${top}" width="16" height="${bottom - top}" rx="8" fill="${look.skin}" stroke="${look.skinLine}" stroke-width="2"/>`;
}

function legs(look, pose) {
  const top = look === MEG ? -82 : -88;
  if (pose === 'sit') {
    // Cross-legged on the floor.
    return `<path d="M-52 -14 Q-20 -34 18 -8" fill="none" stroke="${look.skinLine}" stroke-width="20" stroke-linecap="round"/>
      <path d="M-52 -14 Q-20 -34 18 -8" fill="none" stroke="${look.skin}" stroke-width="16" stroke-linecap="round"/>
      <path d="M52 -14 Q20 -34 -18 -8" fill="none" stroke="${look.skinLine}" stroke-width="20" stroke-linecap="round"/>
      <path d="M52 -14 Q20 -34 -18 -8" fill="none" stroke="${look.skin}" stroke-width="16" stroke-linecap="round"/>
      ${shoe(look, -60, -8, -1)}${shoe(look, 60, -8, 1)}`;
  }
  if (pose === 'bench') {
    return `${leg(look, -14, -46, -10)}${leg(look, 14, -46, -10)}${shoe(look, -16, -6, -1)}${shoe(look, 16, -6, 1)}`;
  }
  const left = `${leg(look, -14, top, -10)}${shoe(look, -16, -6, -1)}`;
  if (pose === 'kick') {
    return `${left}<g>
      <animateTransform attributeName="transform" type="rotate" values="15 14 ${top + 6}; 15 14 ${top + 6}; -50 14 ${top + 6}; 15 14 ${top + 6}" keyTimes="0; 0.4; 0.55; 1" dur="2s" repeatCount="indefinite"/>
      ${leg(look, 14, top, -10)}${shoe(look, 16, -6, 1)}</g>`;
  }
  if (pose === 'splash') {
    return `${leg(look, -14, top, -18)}${shoe(look, -16, -14, -1)}${leg(look, 14, top, -10)}${shoe(look, 16, -6, 1)}`;
  }
  return `${left}${leg(look, 14, top, -10)}${shoe(look, 16, -6, 1)}`;
}

function face(look, mouth) {
  const eyes = `<ellipse cx="-15" cy="-230" rx="6.5" ry="8.5" fill="${C.ink}"/><circle cx="-12.5" cy="-233.5" r="2.4" fill="#fff"/>
    <ellipse cx="15" cy="-230" rx="6.5" ry="8.5" fill="${C.ink}"/><circle cx="17.5" cy="-233.5" r="2.4" fill="#fff"/>`;
  const brows = `<path d="M-22 -246 Q-15 -251 -8 -247 M8 -247 Q15 -251 22 -246" fill="none" stroke="${look === MEG ? MEG.hair : BEN.hairLine}" stroke-width="3" stroke-linecap="round"/>`;
  const cheeks = `<ellipse cx="-28" cy="-212" rx="7.5" ry="4.5" fill="${C.cheek}" opacity=".5"/><ellipse cx="28" cy="-212" rx="7.5" ry="4.5" fill="${C.cheek}" opacity=".5"/>`;
  const freckles = look === BEN ? [[-30, -219], [-25, -222], [-33, -214], [30, -219], [25, -222], [33, -214]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${BEN.freckle}"/>`).join('') : '';
  const mouths = {
    smile: `<path d="M-13 -208 Q0 -193 13 -208 Z" fill="${C.ink}"/><path d="M-7 -201 Q0 -197 7 -201" fill="none" stroke="#FF8A9A" stroke-width="3" stroke-linecap="round"/>`,
    open: `<ellipse cx="0" cy="-203" rx="8.5" ry="10" fill="${C.ink}"/><ellipse cx="0" cy="-198" rx="5.5" ry="4" fill="#FF8A9A"/>`,
    lick: `<path d="M-11 -207 Q0 -197 11 -207 Z" fill="${C.ink}"/><ellipse cx="5" cy="-199" rx="5.5" ry="7" fill="#FF7A8A" stroke="#E25D6E" stroke-width="1.5"/>`,
    munch: `<ellipse cx="0" cy="-203" rx="6" ry="5" fill="${C.ink}"/><ellipse cx="-18" cy="-206" rx="6" ry="4" fill="${look.skinLine}" opacity=".25"/>`,
  };
  return `${eyes}${brows}${cheeks}${freckles}${mouths[mouth] || mouths.smile}`;
}

function head(look, mouth) {
  const ears = `<circle cx="-45" cy="-226" r="9" fill="${look.skin}" stroke="${look.skinLine}" stroke-width="2"/><circle cx="45" cy="-226" r="9" fill="${look.skin}" stroke="${look.skinLine}" stroke-width="2"/>`;
  const neck = `<rect x="-9" y="-196" width="18" height="16" rx="6" fill="${look.skinLine}"/>`;
  const skull = `<circle cx="0" cy="-232" r="45" fill="${look.skin}" stroke="${look.skinLine}" stroke-width="2"/>`;
  if (look === MEG) {
    return `<circle cx="-56" cy="-272" r="29" fill="${MEG.hair}"/><circle cx="56" cy="-272" r="29" fill="${MEG.hair}"/>
      <circle cx="-66" cy="-282" r="9" fill="#3A2820"/><circle cx="66" cy="-282" r="9" fill="#3A2820"/>
      <circle cx="-47" cy="-284" r="7" fill="#3A2820"/><circle cx="47" cy="-284" r="7" fill="#3A2820"/>
      ${neck}${ears}${skull}
      <path d="M-45 -236 Q-44 -284 0 -286 Q44 -284 45 -236 Q36 -262 18 -264 Q9 -254 0 -258 Q-10 -252 -20 -264 Q-36 -260 -45 -236 Z" fill="${MEG.hair}"/>
      <circle cx="-36" cy="-260" r="7.5" fill="${MEG.bobble}" stroke="#E8B21E" stroke-width="1.5"/><circle cx="36" cy="-260" r="7.5" fill="${MEG.bobble}" stroke="#E8B21E" stroke-width="1.5"/>
      ${face(look, mouth)}`;
  }
  return `${neck}${ears}${skull}
    <path d="M-47 -230 Q-52 -282 -12 -288 L-6 -302 L4 -288 L16 -300 L22 -285 Q34 -294 34 -280 Q52 -270 47 -230 Q42 -258 24 -262 Q8 -250 -6 -262 Q-30 -260 -47 -230 Z" fill="${BEN.hair}" stroke="${BEN.hairLine}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M-30 -270 Q-20 -276 -8 -272 M10 -276 Q20 -280 30 -272" fill="none" stroke="${BEN.hairLine}" stroke-width="2.5" stroke-linecap="round"/>
    ${face(look, mouth)}`;
}

function body(look) {
  if (look === MEG) {
    return `<rect x="-31" y="-190" width="62" height="46" rx="15" fill="${MEG.top}" stroke="${MEG.stripe}" stroke-width="2"/>
      <path d="M-29 -178 H29 M-30 -166 H30 M-30 -154 H30" stroke="${MEG.stripe}" stroke-width="4.5"/>
      <path d="M-26 -166 L26 -166 L52 -76 Q0 -64 -52 -76 Z" fill="${MEG.dress}" stroke="${MEG.dressLine}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-20 -188 L-16 -166 M20 -188 L16 -166" stroke="${MEG.dress}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="-16" cy="-160" r="3.8" fill="${MEG.bobble}"/><circle cx="16" cy="-160" r="3.8" fill="${MEG.bobble}"/>
      <path d="M-14 -126 h28 v14 a6 6 0 0 1 -6 6 h-16 a6 6 0 0 1 -6 -6 z" fill="#D63F35"/>`;
  }
  return `<path d="M-34 -124 L34 -124 L37 -84 L5 -84 L0 -98 L-5 -84 L-37 -84 Z" fill="${BEN.shorts}" stroke="${BEN.shortsLine}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M-33 -186 Q0 -194 33 -186 L37 -118 Q0 -112 -37 -118 Z" fill="${BEN.top}" stroke="${BEN.topLine}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M-12 -189 Q0 -180 12 -189" fill="none" stroke="${BEN.topLine}" stroke-width="3" stroke-linecap="round"/>
    <path d="M0 -168 l4.7 9.6 10.5 1.5 -7.6 7.4 1.8 10.5 -9.4 -5 -9.4 5 1.8 -10.5 -7.6 -7.4 10.5 -1.5z" fill="${BEN.star}" stroke="#E8B21E" stroke-width="1.5" stroke-linejoin="round"/>`;
}

// One child. who: 'meg' | 'ben'. Returns the SVG and where the hands ended up in scene coordinates.
function child(who, { x, s = 1, flip = false, legs: legPose = 'stand', arms = 'rest', mouth = 'smile', front = '', armAnim = '' }) {
  const look = who === 'meg' ? MEG : BEN;
  const drop = legPose === 'sit' ? 70 : legPose === 'bench' ? 44 : 0; // upper body sinks when sitting
  const fx = flip ? -1 : 1;
  const hands = ARMS[arms] || ARMS.rest;
  const world = hands.map(([hx, hy]) => [x + hx * s * fx, GROUND + (hy + drop) * s]);
  const armsSvg = hands.map((h, k) => {
    const a = arm(look, SHOULDER[k], h, k ? 1 : -1);
    return armAnim && k === 1 ? `<g>${armAnim}${a}</g>` : a;
  });
  const svg = `<g transform="translate(${x} ${GROUND}) scale(${s * fx} ${s})">
      <ellipse cx="0" cy="2" rx="58" ry="9" fill="#000" opacity=".1"/>
      ${legs(look, legPose)}
      <g transform="translate(0 ${drop})">${body(look)}${head(look, mouth)}${front}${armsSvg.join('')}</g>
    </g>`;
  return { svg, hands: world };
}

// --- Backgrounds ---

const cloud = (x, y, k = 1) => `<g fill="#fff" transform="translate(${x} ${y}) scale(${k})"><circle cx="0" cy="0" r="16"/><circle cx="20" cy="-7" r="20"/><circle cx="42" cy="1" r="14"/><rect x="-6" y="0" width="54" height="14" rx="7"/></g>`;
const tree = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-6" y="0" width="12" height="52" rx="5" fill="#9A6A42"/><circle cx="0" cy="-12" r="36" fill="#6CC067"/><circle cx="-18" cy="2" r="22" fill="#5DB35A"/><circle cx="16" cy="-24" r="16" fill="#7FD07A"/></g>`;
const tufts = (pts, col = '#7DC25C') => `<path d="${pts.map(([x, y]) => `M${x} ${y} l4 -9 l4 9`).join(' ')}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/>`;

const BG = {
  park: () => `<rect width="400" height="400" fill="#CDEBFA"/>${cloud(40, 60)}${cloud(280, 44, 0.8)}
    ${tree(56, 214)}${tree(352, 206, 0.85)}
    <path d="M0 262 Q200 236 400 262 V400 H0 Z" fill="#9AD877"/><path d="M0 300 Q200 286 400 304 V400 H0 Z" fill="#8FD16A"/>
    ${tufts([[30, 330], [120, 380], [300, 388], [360, 336], [70, 372]])}`,
  room: () => `<rect width="400" height="400" fill="#FFE9D6"/><rect x="250" y="44" width="106" height="92" rx="10" fill="#CDEBFA" stroke="#fff" stroke-width="8"/>
    <path d="M303 44 V136 M250 90 H356" stroke="#fff" stroke-width="6"/><rect x="18" y="150" width="100" height="70" rx="14" fill="#FFB8C6"/><rect x="18" y="138" width="44" height="26" rx="10" fill="#fff"/>
    <rect x="0" y="252" width="400" height="148" fill="#EBC79F"/><path d="M0 252 H400" stroke="#D9AE80" stroke-width="4"/>
    <ellipse cx="200" cy="344" rx="176" ry="40" fill="#FFD66B"/><ellipse cx="200" cy="344" rx="150" ry="30" fill="#FFE18F"/>`,
  kitchen: () => `<rect width="400" height="400" fill="#FFF3DC"/>
    <g stroke="#F3E1BF" stroke-width="2">${[60, 100, 140, 180].map((y) => `<path d="M0 ${y} H400"/>`).join('')}${[50, 100, 150, 200, 250, 300, 350].map((x) => `<path d="M${x} 40 V200"/>`).join('')}</g>
    <rect x="270" y="34" width="96" height="80" rx="10" fill="#CDEBFA" stroke="#fff" stroke-width="8"/>
    <rect x="0" y="200" width="400" height="76" fill="#F2C38C"/><rect x="0" y="196" width="400" height="12" rx="4" fill="#E6A866"/>
    <rect x="20" y="216" width="70" height="52" rx="8" fill="#F7D4A6"/><rect x="310" y="216" width="70" height="52" rx="8" fill="#F7D4A6"/>
    <circle cx="80" cy="242" r="4" fill="#C98A4B"/><circle cx="320" cy="242" r="4" fill="#C98A4B"/>
    <rect x="0" y="276" width="400" height="124" fill="#E3E8EF"/><path d="M0 276 H400" stroke="#CBD3DD" stroke-width="4"/>`,
  beach: () => `<rect width="400" height="400" fill="#CDEBFA"/><circle cx="330" cy="70" r="30" fill="#FFD23F"/>${cloud(50, 64, 0.9)}
    <path d="M0 196 H400 V262 H0 Z" fill="#6EC6E8"/><path d="M0 214 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none" stroke="#A8E0F5" stroke-width="4"/>
    <path d="M0 250 Q200 232 400 252 V400 H0 Z" fill="#F5D9A0"/><g fill="#E8C47F">${[[60, 320], [140, 380], [330, 330], [270, 390], [30, 380]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g>`,
  rain: () => `<rect width="400" height="400" fill="#B9C8D8"/>
    <g fill="#8EA1B6"><circle cx="70" cy="58" r="30"/><circle cx="110" cy="46" r="36"/><circle cx="152" cy="62" r="26"/><rect x="40" y="58" width="140" height="30" rx="15"/>
    <circle cx="270" cy="70" r="26"/><circle cx="306" cy="58" r="32"/><circle cx="344" cy="72" r="22"/><rect x="246" y="70" width="120" height="26" rx="13"/></g>
    <path d="M0 268 Q200 248 400 268 V400 H0 Z" fill="#8CC46A"/>
    <ellipse cx="200" cy="356" rx="120" ry="22" fill="#7FB3D9"/><ellipse cx="200" cy="356" rx="96" ry="14" fill="#9AC6E6"/>
    <g stroke="#6F8FB0" stroke-width="3" stroke-linecap="round">${Array.from({ length: 26 }, (_, k) => {
      const x = (k * 53) % 390 + 6;
      const y = 110 + ((k * 37) % 150);
      return `<path d="M${x} ${y} l-5 13"><animateTransform attributeName="transform" type="translate" values="0 -20; 0 40" dur="${0.9 + (k % 4) * 0.15}s" repeatCount="indefinite"/></path>`;
    }).join('')}</g>`,
  pond: () => `${BG.park()}<ellipse cx="300" cy="350" rx="130" ry="44" fill="#6EC6E8"/><ellipse cx="300" cy="350" rx="108" ry="32" fill="#8ED4EE"/>
    <path d="M190 330 l3 -16 M200 334 l-2 -18 M408 330 l-4 -16" stroke="#5DB35A" stroke-width="3" stroke-linecap="round"/>`,
  woods: () => `<rect width="400" height="400" fill="#D7EFD0"/>${tree(40, 190, 1.1)}${tree(130, 170, 0.8)}${tree(280, 176, 0.9)}${tree(370, 196, 1.1)}
    <path d="M0 262 Q200 244 400 262 V400 H0 Z" fill="#8FC860"/>${tufts([[30, 340], [110, 386], [300, 380], [360, 330]], '#76AE4C')}`,
};

// --- Props ---

const P = {
  ball: (x, y, s = 1, anim = false) => `<g>${anim ? '<animateTransform attributeName="transform" type="translate" values="0 0; 0 0; 0 0; 70 -110; 70 -110" keyTimes="0; 0.4; 0.52; 0.9; 1" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;1;0;0" keyTimes="0; 0.4; 0.52; 0.9; 1" dur="2s" repeatCount="indefinite"/>' : ''}
    <g transform="translate(${x} ${y}) scale(${s})"><circle r="19" fill="#fff" stroke="${C.ink}" stroke-width="2.5"/><path d="M0 -8 l7.6 5.5 -2.9 9 h-9.4 l-2.9 -9 z" fill="${C.ink}"/>
    <path d="M-17 -6 l7 3 M17 -6 l-7 3 M-6 17 l1.6 -6 M6 17 l-1.6 -6 M0 -19 v11" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/></g></g>`,
  book: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 4 L-40 -4 L-40 -38 L0 -30 Z" fill="#fff" stroke="#E25D3F" stroke-width="4" stroke-linejoin="round"/>
    <path d="M0 4 L40 -4 L40 -38 L0 -30 Z" fill="#fff" stroke="#E25D3F" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="-22" cy="-20" r="8" fill="#FFC43D"/><path d="M10 -14 l10 -12 10 12 z" fill="#2BB3A3"/><path d="M8 -10 h26" stroke="#7DC25C" stroke-width="3"/></g>`,
  glass: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-35)"><path d="M-11 -16 L11 -16 L9 22 Q0 26 -9 22 Z" fill="#DDF1FB" stroke="#9CC9E0" stroke-width="2.5"/><path d="M-10 -4 L10 -4 L9 22 Q0 26 -9 22 Z" fill="#fff"/></g>`,
  banana: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 6 Q-20 -18 -2 -36 Q-10 -14 6 2 Z" fill="#FFD23F" stroke="#E0A20F" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M-6 6 Q-18 4 -22 14 M-6 6 Q2 10 4 18" fill="none" stroke="#F5C430" stroke-width="5" stroke-linecap="round"/><path d="M-2 -36 l3 -4" stroke="#7A5A2A" stroke-width="3" stroke-linecap="round"/></g>`,
  drum: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-40" y="-26" width="80" height="54" rx="8" fill="#E8483B" stroke="#B82E24" stroke-width="2.5"/>
    <path d="M-40 -14 L-20 22 L0 -14 L20 22 L40 -14" fill="none" stroke="#FFD23F" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="0" cy="-26" rx="40" ry="11" fill="#FFF6E8" stroke="#B82E24" stroke-width="2.5"/></g>`,
  stick: (x, y, s = 1, tip = [0, 34]) => `<path d="M${x} ${y} l${tip[0] * s} ${tip[1] * s}" stroke="#C98A4B" stroke-width="${5 * s}" stroke-linecap="round"/><circle cx="${x + tip[0] * s}" cy="${y + tip[1] * s}" r="${5 * s}" fill="#FFF6E8" stroke="#C98A4B" stroke-width="2"/>`,
  lolly: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-6 34" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M0 0 L-6 34" stroke="#EADFD4" stroke-width="1.5"/>
    <circle cx="2" cy="-20" r="22" fill="#FF7A8A"/><path d="M2 -20 m-15 0 a15 15 0 1 1 15 15 a10 10 0 1 1 -10 -10 a5 5 0 1 1 5 5" fill="none" stroke="#FFD23F" stroke-width="5" stroke-linecap="round"/>
    <circle cx="2" cy="-20" r="22" fill="none" stroke="#E25D6E" stroke-width="2"/></g>`,
  notes: (x, y, s = 1) => [[0, 0, '#8F7CFF'], [34, -30, '#FF7A59'], [-30, -40, '#22B5A0']].map(([dx, dy, c], k) => `<g transform="translate(${x + dx * s} ${y + dy * s}) scale(${s})"><animateTransform attributeName="transform" type="translate" additive="sum" values="0 6; 0 -6; 0 6" dur="${1.4 + k * 0.3}s" repeatCount="indefinite"/>
    <path d="M0 0 V-26 l14 -5 V-8" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="-4" cy="0" rx="6" ry="4.5" fill="${c}"/><ellipse cx="10" cy="-8" rx="6" ry="4.5" fill="${c}"/></g>`).join(''),
  pan: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-28 10" stroke="#3A3A4A" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="-62" cy="22" rx="38" ry="13" fill="#4A4A5C"/><ellipse cx="-62" cy="19" rx="32" ry="9" fill="#5E5E72"/>
    <ellipse cx="-74" cy="19" rx="12" ry="5" fill="#fff"/><circle cx="-74" cy="18" r="3.6" fill="#FFB020"/><ellipse cx="-50" cy="20" rx="12" ry="5" fill="#fff"/><circle cx="-50" cy="19" r="3.6" fill="#FFB020"/></g>`,
  stove: (x, y) => `<rect x="${x - 70}" y="${y}" width="140" height="${GROUND - y + 6}" rx="10" fill="#F7F7FA" stroke="#CBD3DD" stroke-width="3"/>
    <rect x="${x - 70}" y="${y - 8}" width="140" height="14" rx="5" fill="#CBD3DD"/><rect x="${x - 46}" y="${y + 26}" width="92" height="50" rx="8" fill="#DCE2EA"/><circle cx="${x - 40}" cy="${y + 14}" r="4" fill="#E8483B"/><circle cx="${x + 40}" cy="${y + 14}" r="4" fill="#E8483B"/>`,
  dog: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-26" rx="34" ry="24" fill="#E3A469" stroke="#B9763F" stroke-width="2.5"/>
    <ellipse cx="6" cy="-20" rx="16" ry="12" fill="#FFF1DE"/><rect x="-26" y="-12" width="12" height="14" rx="6" fill="#E3A469" stroke="#B9763F" stroke-width="2"/><rect x="14" y="-12" width="12" height="14" rx="6" fill="#E3A469" stroke="#B9763F" stroke-width="2"/>
    <path d="M-32 -36 q-16 -12 -10 -26" fill="none" stroke="#B9763F" stroke-width="7" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-10 -32 -36; 14 -32 -36; -10 -32 -36" dur=".5s" repeatCount="indefinite"/></path>
    <circle cx="24" cy="-58" r="22" fill="#E3A469" stroke="#B9763F" stroke-width="2.5"/><ellipse cx="30" cy="-50" rx="11" ry="8" fill="#FFF1DE"/>
    <path d="M8 -74 q-14 4 -12 26 q10 -2 14 -16 z" fill="#9A5E2F"/><path d="M38 -76 q14 4 12 24 q-10 -2 -14 -16 z" fill="#9A5E2F"/>
    <circle cx="18" cy="-62" r="3.4" fill="${C.ink}"/><circle cx="34" cy="-62" r="3.4" fill="${C.ink}"/><ellipse cx="32" cy="-52" rx="5" ry="3.6" fill="${C.ink}"/><path d="M28 -46 q4 4 8 0" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/></g>`,
  duck: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-18" rx="28" ry="18" fill="#FFE07A" stroke="#E0B830" stroke-width="2.5"/><path d="M-26 -22 l-12 -8 4 14 z" fill="#FFE07A" stroke="#E0B830" stroke-width="2"/>
    <circle cx="20" cy="-42" r="15" fill="#FFE07A" stroke="#E0B830" stroke-width="2.5"/><path d="M32 -42 l14 3 -14 5 z" fill="#FF9A3D"/><circle cx="23" cy="-46" r="2.8" fill="${C.ink}"/>
    <path d="M-6 -20 q10 8 20 0" fill="none" stroke="#E0B830" stroke-width="2.5" stroke-linecap="round"/><path d="M-6 0 v-4 M8 0 v-4" stroke="#FF9A3D" stroke-width="4" stroke-linecap="round"/></g>`,
  crumbs: (x, y) => `<g fill="#D9A15F">${[[0, 0], [8, 14], [-6, 26], [6, 40]].map(([dx, dy], k) => `<circle cx="${x + dx}" cy="${y + dy}" r="3"><animate attributeName="cy" values="${y + dy};${y + dy + 30}" dur="${1 + k * 0.2}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="${1 + k * 0.2}s" repeatCount="indefinite"/></circle>`).join('')}</g>`,
  cat: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 0 Q-30 -40 0 -46 Q30 -40 22 0 Z" fill="#F5A04A" stroke="#C9762A" stroke-width="2.5"/>
    <path d="M22 -6 q26 -2 20 -30" fill="none" stroke="#C9762A" stroke-width="8" stroke-linecap="round"/><path d="M22 -6 q26 -2 20 -30" fill="none" stroke="#F5A04A" stroke-width="5" stroke-linecap="round"/>
    <circle cx="0" cy="-60" r="22" fill="#F5A04A" stroke="#C9762A" stroke-width="2.5"/><path d="M-18 -72 l-4 -20 16 10 z M18 -72 l4 -20 -16 10 z" fill="#F5A04A" stroke="#C9762A" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M-8 -66 q3 -3 6 0 M2 -66 q3 -3 6 0" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/><path d="M-3 -56 l3 3 3 -3 z" fill="#FF8A9A"/>
    <path d="M-14 -40 h10 M14 -40 h-10 M-12 -24 h8 M12 -24 h-8" stroke="#E08A3A" stroke-width="3" stroke-linecap="round"/></g>`,
  spade: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L10 30" stroke="#3D7FD9" stroke-width="6" stroke-linecap="round"/><path d="M2 28 L20 26 L20 44 Q12 52 4 46 Z" fill="#FFD23F" stroke="#E0A20F" stroke-width="2"/></g>`,
  sand: (x, y) => `<path d="M${x - 50} ${y} Q${x - 20} ${y - 34} ${x + 14} ${y - 30} Q${x + 44} ${y - 20} ${x + 54} ${y} Z" fill="#E8C47F"/>`,
  bucket: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-20 -36 L20 -36 L15 0 L-15 0 Z" fill="#FF7A59" stroke="#D9573A" stroke-width="2.5"/><path d="M-18 -36 Q0 -60 18 -36" fill="none" stroke="#D9573A" stroke-width="3"/></g>`,
  log: (x, y, w = 260) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="44" rx="22" fill="#B07A4A" stroke="#8A5A33" stroke-width="3"/>
    <ellipse cx="${x + w / 2 - 14}" cy="${y + 22}" rx="14" ry="20" fill="#E7C08F" stroke="#8A5A33" stroke-width="3"/><ellipse cx="${x + w / 2 - 14}" cy="${y + 22}" rx="6" ry="9" fill="none" stroke="#C99A62" stroke-width="2"/>
    <path d="M${x - w / 2 + 30} ${y + 14} h60 M${x - 20} ${y + 30} h70" stroke="#8A5A33" stroke-width="2.5" stroke-linecap="round"/>`,
  bench: (x, y, w = 260) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="14" rx="5" fill="#C98A4B" stroke="#9A6A42" stroke-width="2"/><rect x="${x - w / 2}" y="${y - 50}" width="${w}" height="12" rx="5" fill="#C98A4B" stroke="#9A6A42" stroke-width="2"/>
    <rect x="${x - w / 2}" y="${y - 30}" width="${w}" height="12" rx="5" fill="#C98A4B" stroke="#9A6A42" stroke-width="2"/><rect x="${x - w / 2 + 16}" y="${y + 12}" width="10" height="${GROUND - y - 12}" fill="#7A7A8A"/><rect x="${x + w / 2 - 26}" y="${y + 12}" width="10" height="${GROUND - y - 12}" fill="#7A7A8A"/>`,
  board: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-56" y="-10" width="112" height="20" rx="6" fill="#E3B47C" stroke="#B9844A" stroke-width="2.5"/>
    <g transform="translate(-20 -16) rotate(-8)"><path d="M-24 0 L18 -6 Q24 0 18 6 Z" fill="#FF8A2E" stroke="#D96A12" stroke-width="2"/><path d="M18 -4 l10 -8 M18 0 l12 -2 M18 4 l10 6" stroke="#5DB35A" stroke-width="3" stroke-linecap="round"/></g>
    <g fill="#FF8A2E" stroke="#D96A12" stroke-width="2"><ellipse cx="22" cy="-14" rx="6" ry="5"/><ellipse cx="36" cy="-13" rx="6" ry="5"/></g></g>`,
  table: (x, y, s = 1) => `<rect x="${x - 74 * s}" y="${y}" width="${148 * s}" height="${GROUND - y + 4}" rx="8" fill="#F2C38C" stroke="#D9A066" stroke-width="2.5"/><rect x="${x - 80 * s}" y="${y - 4}" width="${160 * s}" height="12" rx="5" fill="#E6A866"/>`,
  knife: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(30)"><rect x="-4" y="-6" width="8" height="22" rx="3" fill="#2BB3A3"/><path d="M-4 -6 L-4 -34 Q4 -30 4 -6 Z" fill="#DCE2EA" stroke="#A9B4C2" stroke-width="1.5"/></g>`,
};

// --- The scenes ---
// Each action: background, pose, and props drawn behind (back) or in front of (front) the children.
// make(c) gets one placed child (with hands) and returns { back, front } SVG.

const ACTIONS = {
  'kicking a ball': {
    bg: 'park', legs: 'kick', arms: 'out',
    prop: (c, they) => ({ front: they ? '' : P.ball(c.x + 52 * c.s * c.dir, GROUND - 18, c.s, true) }),
    shared: () => ({ front: P.ball(200, GROUND - 22, 0.9, false) }),
  },
  'looking at a book': {
    bg: 'room', legs: 'sit', arms: 'front',
    prop: (c, they) => ({ front: they ? '' : P.book((c.hands[0][0] + c.hands[1][0]) / 2, c.hands[0][1] + 10, c.s) }),
    shared: (cs) => ({ front: P.book(200, cs[0].hands[1][1] + 12, 0.95) }),
    pairArms: ['reach', 'reach'],
  },
  'drinking milk': {
    bg: 'kitchen', arms: 'mouth', mouth: 'smile',
    prop: (c) => ({ front: P.glass(c.hands[1][0] + 2 * c.dir, c.hands[1][1] - 6, c.s) }),
  },
  'munching a banana': {
    bg: 'park', legs: 'bench', arms: 'mouth', mouth: 'munch',
    prop: (c) => ({ front: P.banana(c.hands[1][0] + 4 * c.dir, c.hands[1][1] - 4, c.s) }),
    back: () => P.bench(200, GROUND - 52, 340),
  },
  'hitting the drum': {
    bg: 'room', arms: 'drum', mouth: 'open',
    armAnim: '<animateTransform attributeName="transform" type="rotate" values="0 28 -176; 10 28 -176; 0 28 -176" dur=".45s" repeatCount="indefinite"/>',
    prop: (c) => ({
      front: P.drum(c.x, GROUND - 74 * c.s, c.s) + P.stick(c.hands[0][0], c.hands[0][1], c.s, [16 * c.dir, 22]) + P.stick(c.hands[1][0], c.hands[1][1], c.s, [-14 * c.dir, 30]),
    }),
  },
  'licking a lollipop': {
    bg: 'park', arms: 'mouth', mouth: 'lick',
    prop: (c) => ({ front: P.lolly(c.hands[1][0] + 10 * c.dir, c.hands[1][1] - 2, c.s) }),
  },
  'getting wet': {
    bg: 'rain', legs: 'splash', arms: 'cheer', mouth: 'open',
    prop: () => ({}),
  },
  'singing a song': {
    bg: 'park', arms: 'out', mouth: 'open',
    prop: (c) => ({ front: P.notes(c.x + 66 * c.s * c.dir, GROUND - 270 * c.s, c.s) }),
  },
  'cooking eggs': {
    bg: 'kitchen', arms: 'pan',
    // The pan points away from the child, over a little cooker.
    prop: (c) => ({ front: P.pan(c.hands[1][0], c.hands[1][1], -c.s * c.dir) }),
    back: (cs) => cs.map((c) => P.stove(c.hands[1][0] + 62 * c.s * c.dir, c.hands[1][1] + 34 * c.s)).join(''),
  },
  'hugging a dog': {
    bg: 'park', arms: 'hug',
    prop: () => ({}),
    held: () => P.dog(-30, -94, 1.1), // between the body and the arms
  },
  'feeding the duck': {
    bg: 'pond', arms: 'reach',
    prop: (c) => ({ front: P.crumbs(c.hands[1][0], c.hands[1][1] + 10) + P.duck(c.hands[1][0] + 30 * c.dir * c.s, GROUND, c.s * c.dir) }),
  },
  'petting a cat': {
    bg: 'room', legs: 'sit', arms: 'reach',
    prop: (c) => ({ back: P.cat(c.hands[1][0] + 14 * c.dir * c.s, GROUND - 4, c.s) }),
  },
  'digging in the sand': {
    bg: 'beach', legs: 'sit', arms: 'reach',
    armAnim: '<animateTransform attributeName="transform" type="rotate" values="0 28 -176; -12 28 -176; 0 28 -176" dur="1s" repeatCount="indefinite"/>',
    prop: (c) => ({ back: P.sand(c.hands[1][0] + 28 * c.dir * c.s, GROUND + 4) + P.bucket(c.x - 74 * c.dir * c.s, GROUND, c.s), front: P.spade(c.hands[1][0], c.hands[1][1], c.s) }),
  },
  'sitting on a log': {
    bg: 'woods', legs: 'bench', arms: 'rest',
    prop: () => ({}),
    back: () => P.log(200, GROUND - 40, 330),
  },
  'chopping carrots': {
    bg: 'kitchen', arms: 'front',
    prop: (c) => ({ front: P.table(c.x, c.hands[0][1] + 26, c.s) + P.board(c.x, c.hands[0][1] + 18, c.s) + P.knife(c.hands[1][0], c.hands[1][1], c.s) }),
  },
};

export const hasScene = (key) => key in ACTIONS;

// Other sentences that show the same action.
const SAME = {
  'kick the ball': 'kicking a ball', 'dig in the sand': 'digging in the sand', 'sing songs': 'singing a song',
  'drink milk': 'drinking milk', 'cook eggs': 'cooking eggs', 'feed the duck': 'feeding the duck', 'hug the dog': 'hugging a dog',
  'look at books': 'looking at a book', 'sit on a log': 'sitting on a log', 'chop carrots': 'chopping carrots', 'lick lollipops': 'licking a lollipop',
  'kicked the ball': 'kicking a ball', 'cooked dinner': 'cooking eggs', 'licked a lollipop': 'licking a lollipop',
};
export const sceneKey = (words) => (words in ACTIONS ? words : SAME[words] || null);

// pron: 'he' | 'she' | 'they'
export function sceneFor(key, pron) {
  const a = ACTIONS[key];
  if (!a) return null;
  const they = pron === 'they';
  const cast = they
    ? [{ who: 'meg', x: 118, s: 0.8, dir: 1 }, { who: 'ben', x: 282, s: 0.8, dir: -1 }]
    : [{ who: pron === 'she' ? 'meg' : 'ben', x: 200, s: 1, dir: 1 }];
  const placed = cast.map((c, k) => {
    const arms = they && a.pairArms ? a.pairArms[k] : a.arms;
    const drawn = child(c.who, { x: c.x, s: c.s, flip: c.dir < 0, legs: a.legs, arms, mouth: a.mouth, armAnim: a.armAnim, front: a.held ? a.held() : '' });
    return { ...c, ...drawn };
  });
  const props = placed.map((c) => a.prop(c, they));
  const shared = they && a.shared ? a.shared(placed) : {};
  const back = (a.back ? a.back(placed) : '') + props.map((p) => p.back || '').join('') + (shared.back || '');
  const front = props.map((p) => p.front || '').join('') + (shared.front || '');
  return `<svg class="scene-art" viewBox="0 0 400 400" role="img" aria-label="${key}">
    <defs><clipPath id="round"><rect width="400" height="400" rx="34"/></clipPath></defs>
    <g clip-path="url(#round)">${BG[a.bg]()}${back}${placed.map((c) => c.svg).join('')}${front}</g></svg>`;
}
