import * as store from './store.js';
import { speak, stopSpeaking, britishVoices, onVoicesChanged, recorder, sfx, unlockAudio } from './audio.js';
import { SKILLS, ACTIVITIES, AVATARS, STICKERS, PRAISE, makeRound, sentence, pick, shuffle } from './content.js';
import { pip, icon } from './art.js';
import * as timer from './timer.js';
import { THEMES, currentTheme, themeFor, makeWordRound, the } from './themes.js';

const app = document.getElementById('app');
const fx = document.getElementById('fx');
const $ = (sel, root = app) => root.querySelector(sel);
const $$ = (sel, root = app) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Screen plumbing ---

let teardown = null;
// timed: the play timer only counts on the children's screens.
function mount(html, setup, { timed = false } = {}) {
  teardown?.();
  teardown = null;
  stopSpeaking();
  timer.run(timed);
  app.innerHTML = html;
  window.scrollTo(0, 0);
  paintTime();
  teardown = setup?.() || null;
}

const applyTextSize = () => (document.documentElement.dataset.text = store.get().settings.textSize);

// --- Play timer ---

const timePill = () =>
  timer.limited()
    ? `<div class="time-pill" id="timepill" role="timer" aria-label="Time left"><span class="time-pie"></span><span class="time-text"></span></div>`
    : '';

function paintTime() {
  const pill = $('#timepill');
  if (!pill) return;
  const left = timer.left();
  pill.style.setProperty('--left', left / (left + timer.usedToday() || 1));
  $('.time-text', pill).textContent = left > 0 ? timer.format(left) : 'Last one!';
  pill.classList.toggle('low', left <= 120);
  pill.classList.toggle('last', left <= 60);
}
timer.onChange(paintTime);

// When time runs out, a game in progress finishes its current turn first.
timer.whenUp(() => {
  if ($('.home, .stickers')) timeUp();
});

const lockBtn = () => `<button class="lock" id="lock" aria-label="Grown-ups: press and hold">
    <svg class="lock-ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/></svg>${icon('lock')}
  </button>`;

function timeUp() {
  const name = store.get().child.name;
  mount(
    `<section class="screen timeup">
      <span class="pip-big">${pip('calm')}</span>
      <h1>Time for a break!</h1>
      <p class="lead">Great practising today, ${esc(name)}. See you next time!</p>
      <div class="timeup-lock">${lockBtn()}<p class="fine">Grown-ups: press and hold the lock to add more time.</p></div>
      <div class="row" id="more" hidden>
        <button class="btn btn-primary btn-big" data-add="5">${icon('plus')} 5 minutes</button>
        <button class="btn btn-big" data-add="10">${icon('plus')} 10 minutes</button>
        <button class="btn btn-big" id="grown">Grown-ups area</button>
      </div>
    </section>`,
    () => {
      speak(`Time for a break! Great practising today, ${name}.`);
      holdToOpen($('#lock'), () => {
        $('.timeup-lock').hidden = true;
        $('#more').hidden = false;
      });
      $$('[data-add]').forEach((b) =>
        b.addEventListener('click', () => {
          sfx.tap();
          timer.addMinutes(Number(b.dataset.add));
          home(true);
        }),
      );
      $('#grown').addEventListener('click', () => grownups('settings'));
    },
  );
}

function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  fx.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colours = ['#FF7A59', '#FFC43D', '#22B5A0', '#8F7CFF', '#4AA8FF', '#FF8FB8'];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    p.className = 'confetti';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = pick(colours);
    p.style.animationDelay = Math.random() * 0.5 + 's';
    p.style.animationDuration = 1.8 + Math.random() * 1.4 + 's';
    p.style.setProperty('--spin', (Math.random() * 720 - 360).toFixed(0) + 'deg');
    p.style.setProperty('--drift', (Math.random() * 30 - 15).toFixed(1) + 'vw');
    fx.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

function shake(el) {
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

// --- Start ---

function splash() {
  mount(
    `<section class="screen splash">
      <button class="splash-btn" id="start" aria-label="Start Speechie">
        <span class="pip-big bob">${pip('happy')}</span>
        <span class="logo">Speechie</span>
        <span class="tap-hint">Tap to start</span>
      </button>
    </section>`,
    () => {
      $('#start').addEventListener('click', () => {
        unlockAudio();
        sfx.tap();
        store.get().child ? home(true) : setup();
      });
    },
  );
}

function setup() {
  const s = store.get();
  let avatar = s.child?.avatar || AVATARS[0];
  mount(
    `<section class="screen setup">
      <form class="card setup-card" id="form" novalidate>
        <div class="steps" aria-label="Step 1 of 2"><span class="on"></span><span></span></div>
        <span class="pip-mid">${pip('wow')}</span>
        <h1>Hello, grown-up!</h1>
        <p class="lead">Speechie helps your child practise <b>he</b>, <b>she</b> and <b>they</b>, and the words that go with them, like <b>she has</b> and <b>they have</b>.</p>
        <label class="field">
          <span>Your child’s name</span>
          <input id="name" maxlength="20" autocomplete="off" autocapitalize="words" placeholder="e.g. Sam" value="${esc(s.child?.name || '')}">
        </label>
        <fieldset class="field">
          <legend>Pick a buddy</legend>
          <div class="avatar-grid">${AVATARS.map((a) => `<button type="button" class="avatar-opt ${a === avatar ? 'on' : ''}" data-a="${a}" aria-pressed="${a === avatar}">${a}</button>`).join('')}</div>
        </fieldset>
        <button class="btn btn-primary btn-big" type="submit">Next ${icon('arrow')}</button>
        <p class="fine">Everything stays on this device.</p>
      </form>
    </section>`,
    () => {
      $$('.avatar-opt').forEach((b) =>
        b.addEventListener('click', () => {
          sfx.tap();
          avatar = b.dataset.a;
          $$('.avatar-opt').forEach((o) => {
            o.classList.toggle('on', o === b);
            o.setAttribute('aria-pressed', o === b);
          });
        }),
      );
      $('#form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#name').value.trim();
        if (!name) {
          shake($('#name'));
          $('#name').focus();
          return;
        }
        setupPlan(name, avatar);
      });
    },
  );
}

// Welcome, step 2: daily time and where to start. Both can be changed later in Settings.
const FOCUS = [
  { id: 'who', name: 'He, she and they', about: 'Choosing the right word for the person in the picture.', skills: { hs: true, they: true, isare: false, hashave: false } },
  { id: 'both', name: 'He, she, they + matching words', about: 'Also “she has / they have” and “he is / they are”.', skills: { hs: true, they: true, isare: true, hashave: true } },
];

function setupPlan(name, avatar) {
  let minutes = store.get().settings.minutes;
  let focus = 'both';
  mount(
    `<section class="screen setup">
      <div class="card setup-card">
        <div class="steps" aria-label="Step 2 of 2"><span class="on"></span><span class="on"></span></div>
        <h1>A little each day</h1>
        <p class="lead">Short, regular practice works best. Speechie shows a timer and gently stops when time is up.</p>
        <div class="field"><span>Play time each day</span>${seg('minutes', MINUTES.filter(([m]) => m !== 30), minutes)}</div>
        <div class="field"><span>Start with</span>
          <div class="focus-opts" role="radiogroup">${FOCUS.map(
            (f) => `<button type="button" role="radio" class="focus-opt" data-f="${f.id}" aria-checked="${f.id === focus}"><b>${f.name}</b><small>${f.about}</small></button>`,
          ).join('')}</div>
        </div>
        <div class="row">
          <button class="btn btn-big" id="back">${icon('back')} Back</button>
          <button class="btn btn-primary btn-big" id="done">Let’s play ${icon('arrow')}</button>
        </div>
        <p class="fine">You can change these any time: press and hold the lock on the home screen.</p>
      </div>
    </section>`,
    () => {
      onSeg(app, 'minutes', (v) => (minutes = Number(v)));
      $$('.focus-opt').forEach((b) =>
        b.addEventListener('click', () => {
          sfx.tap();
          focus = b.dataset.f;
          $$('.focus-opt').forEach((o) => o.setAttribute('aria-checked', o === b));
        }),
      );
      $('#back').addEventListener('click', () => {
        store.update((st) => (st.child = { name, avatar }));
        setup();
      });
      $('#done').addEventListener('click', () => {
        store.update((st) => {
          st.child = { name, avatar };
          st.settings.minutes = minutes;
          Object.assign(st.skills, FOCUS.find((f) => f.id === focus).skills);
        });
        home(true);
      });
    },
  );
}

// --- Child home ---

function home(greet = false) {
  if (timer.isUp()) return timeUp();
  const s = store.get();
  const c = s.child;
  const hello = `Hi ${c.name}! Ready to practise?`;
  const theme = currentTheme(s.settings.theme);
  mount(
    `<section class="screen home">
      <header class="topbar">
        <div class="hello"><span class="hello-avatar">${c.avatar}</span><span class="hello-text"><small>Hello</small>${esc(c.name)}!</span></div>
        <div class="top-actions">
          ${timePill()}
          <button class="chip" id="stickers" aria-label="My stickers">${icon('star')}<span>${s.stickers.length}</span></button>
          ${lockBtn()}
        </div>
      </header>
      <div class="home-hero">
        <button class="pip-btn bob" id="pip" aria-label="Hear Pip">${pip('happy')}</button>
        <div class="hero-side">
          <div class="bubble">Ready to practise?</div>
          <button class="btn-go" data-act="mix">${icon('play')} Let’s practise</button>
        </div>
      </div>
      <p class="section-label">Or choose a game</p>
      <div class="tiles">
        <button class="tile tile-theme" data-act="words" style="--t1:${theme.colours[0]};--t2:${theme.colours[1]}">
          <span class="tile-art">${theme.art}</span>
          <span class="theme-text"><span class="tile-name">${theme.name} words</span><span class="theme-peek">${theme.words.slice(0, 5).map((w) => w.e).join(' ')}</span></span>
        </button>
        ${ACTIVITIES.map(
        (a) => `<button class="tile tile-${a.colour}" data-act="${a.id}">
            <span class="tile-art">${a.art}</span><span class="tile-name">${a.name}</span>
          </button>`,
      ).join('')}</div>
    </section>`,
    () => {
      $$('[data-act]').forEach((b) =>
        b.addEventListener('click', () => {
          sfx.tap();
          play(b.dataset.act);
        }),
      );
      $('#stickers').addEventListener('click', () => {
        sfx.tap();
        stickerBook();
      });
      $('#pip').addEventListener('click', () => speak(hello));
      holdToOpen($('#lock'), () => grownups());
      if (greet) speak(hello);
    },
    { timed: true },
  );
}

// Press-and-hold for things little fingers shouldn't do by accident:
// opening the grown-up area, or leaving a game halfway through.
function holdToOpen(btn, open, hint = 'Grown-ups: press and hold the lock') {
  let timer = null;
  let opened = false;
  const start = (e) => {
    e.preventDefault();
    btn.classList.add('holding');
    timer = setTimeout(() => {
      opened = true;
      sfx.tap();
      open();
    }, 1500);
  };
  const cancel = () => {
    clearTimeout(timer);
    btn.classList.remove('holding');
  };
  btn.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, cancel));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  btn.addEventListener('click', () => {
    if (!opened) toast(hint);
  });
}

// --- Playing a round ---

const PRON_ART = { he: '👦', she: '👧', they: '👧👦' };

const sceneHTML = (item) => `
  <div class="scene ${item.people.length > 1 ? 'many' : ''}">
    <span class="scene-people">${item.people.map((p) => `<span>${p}</span>`).join('')}</span>
    <span class="scene-thing">${item.thing}</span>
  </div>`;

function sentenceHTML(item, { gap = false } = {}) {
  const verb = gap ? '<span class="w doing gap" data-gap>?</span>' : `<span class="w doing">${item.verb}</span>`;
  const mid = item.mid ? ` <span class="w doing">${item.mid}</span>` : '';
  return `<p class="sentence"><span class="w who">${item.who}</span> ${verb}${mid} <span class="w what">${item.rest}</span></p>`;
}

const record = (activity, item, extra) => store.logAttempt({ activity, skill: item.skill, pron: item.pron, ...extra });

function showNext(stage, go) {
  const slot = $('.next-slot', stage);
  slot.innerHTML = `<button class="next-btn" aria-label="Next">${icon('arrow')}</button>`;
  slot.firstChild.addEventListener('click', () => {
    sfx.tap();
    go();
  });
}

const GAMES = { who: playWho, word: playWord, build: playBuild, say: playSay, words: playVocab };

// Let's practise: a short mix of games, so children can just press one button and go.
function makeMix(skills, theme) {
  const tag = (play) => (it) => ({ ...it, play });
  const [who1, who2, who3] = makeRound('who', skills).map(tag('who'));
  const [find1, guess, find2] = makeWordRound(theme).filter((it) => it.type !== 'say').map(tag('words'));
  // Matching words only once a grown-up has switched them on.
  if (!SKILLS.some((sk) => sk.group === 'verb' && skills[sk.id])) return [who1, find1, who2, guess, who3, find2];
  const [word1, word2] = makeRound('word', skills).map(tag('word'));
  const [build] = makeRound('build', skills).map(tag('build'));
  return [who1, word1, find1, build, word2, guess];
}

function roundFor(activityId, theme) {
  const skills = store.get().skills;
  if (activityId === 'mix') return { intro: 'Let’s practise!', items: makeMix(skills, theme) };
  if (activityId === 'words') return { intro: theme.intro, items: makeWordRound(theme) };
  return { intro: ACTIVITIES.find((a) => a.id === activityId).intro, items: makeRound(activityId, skills) };
}

// Pip sits in the play bar and reacts to answers.
let pipReset = null;
function react(mood) {
  const guide = $('#guide');
  if (!guide) return;
  guide.innerHTML = pip(mood);
  guide.classList.remove('jump');
  void guide.offsetWidth;
  if (mood === 'wow') guide.classList.add('jump');
  clearTimeout(pipReset);
  pipReset = setTimeout(() => $('#guide') && ($('#guide').innerHTML = pip('happy')), 1800);
}
const cheer = () => {
  sfx.good();
  react('wow');
};
const oops = () => {
  sfx.oops();
  react('calm');
};

function play(activityId) {
  if (timer.isUp()) return timeUp();
  const theme = currentTheme(store.get().settings.theme);
  const { intro, items } = roundFor(activityId, theme);
  let index = 0;
  let roundStars = 0;

  mount(
    `<section class="screen play play-${activityId}">
      <header class="playbar">
        <button class="round-btn" id="home" aria-label="Leave the game: press and hold">
          <svg class="lock-ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/></svg>${icon('home')}
        </button>
        <div class="bar-mid">
          <button class="guide" id="guide" aria-label="Hear it again">${pip('happy')}</button>
          <div class="dots" aria-label="Progress">${items.map(() => '<span class="dot"></span>').join('')}</div>
        </div>
        <div class="bar-end">${timePill()}<button class="round-btn" id="replay" aria-label="Hear it again">${icon('speaker')}</button></div>
      </header>
      <div class="stage" id="stage"></div>
    </section>`,
    () => {
      let itemTeardown = null;
      let replay = () => {};
      holdToOpen($('#home'), () => home(), 'Hold the home button to leave the game');
      $('#replay').addEventListener('click', () => replay());
      $('#guide').addEventListener('click', () => replay());

      const next = (firstTry) => {
        if (firstTry) {
          roundStars++;
          store.update((s) => s.stars++);
        }
        $$('.dot')[index].classList.add(firstTry ? 'star' : 'done');
        index++;
        if (index >= items.length) celebrate(activityId, roundStars, items.length);
        else if (timer.isUp()) timeUp();
        else show();
      };

      const show = () => {
        itemTeardown?.();
        $$('.dot').forEach((d, k) => d.classList.toggle('now', k === index));
        const stage = $('#stage');
        stage.classList.remove('enter');
        void stage.offsetWidth;
        stage.classList.add('enter');
        const item = items[index];
        itemTeardown = GAMES[item.play || activityId](stage, item, {
          intro: index === 0 ? intro + ' ' : '',
          theme,
          setReplay: (fn) => (replay = fn),
          next,
        });
      };
      show();
      return () => {
        itemTeardown?.();
        recorder.release();
      };
    },
    { timed: true },
  );
}

// Who is it? — choose he / she / they from the picture.
function playWho(stage, item, ctx) {
  const question = `Who is ${item.mid} ${item.rest}?`;
  stage.innerHTML = `${sceneHTML(item)}
    <div class="prompt"><p class="question">${question}</p></div>
    <div class="choices">${item.choices
      .map((p) => `<button class="choice pron" data-p="${p}"><span class="choice-art">${PRON_ART[p]}</span><span class="choice-word">${cap(p)}</span></button>`)
      .join('')}</div>
    <div class="next-slot"></div>`;
  ctx.setReplay(() => speak(question));
  speak(ctx.intro + question);

  let tries = 0;
  let done = false;
  $$('.choice', stage).forEach((b) =>
    b.addEventListener('click', () => {
      if (done || b.classList.contains('tried')) return;
      if (b.dataset.p === item.pron) {
        done = true;
        const first = tries === 0;
        const line = sentence(item);
        b.classList.add('right');
        $$('.choice', stage).forEach((o) => o !== b && o.classList.add('faded'));
        $('.prompt', stage).innerHTML = sentenceHTML(item);
        cheer();
        ctx.setReplay(() => speak(line));
        speak(first ? `${pick(PRAISE)} ${line}` : line);
        record('who', item, { ok: first });
        showNext(stage, () => ctx.next(first));
      } else {
        tries++;
        oops();
        b.classList.add('tried');
        shake(b);
        if (tries === 1) speak('Have another look.');
        else {
          $(`.choice[data-p="${item.pron}"]`, stage).classList.add('hint');
          speak(`Try ${item.pron}.`);
        }
      }
    }),
  );
}

// Pick the word — has or have, is or are… If it's wrong, we model it the right way.
function playWord(stage, item, ctx) {
  const options = shuffle([item.verb, item.wrong]);
  const ask = `Which word fits? ${options[0]}, or ${options[1]}?`;
  stage.innerHTML = `${sceneHTML(item)}
    <div class="prompt">${sentenceHTML(item, { gap: true })}</div>
    <div class="choices">${options.map((v) => `<button class="choice word" data-v="${v}"><span class="choice-word">${v}</span></button>`).join('')}</div>
    <div class="next-slot"></div>`;
  ctx.setReplay(() => speak(ask));
  speak(ctx.intro + ask);

  let done = false;
  $$('.choice', stage).forEach((b) =>
    b.addEventListener('click', () => {
      if (done) return;
      done = true;
      const ok = b.dataset.v === item.verb;
      const line = sentence(item);
      const gap = $('[data-gap]', stage);
      gap.textContent = item.verb;
      gap.classList.add(ok ? 'filled' : 'fixed');
      if (ok) {
        b.classList.add('right');
        cheer();
        speak(`${pick(PRAISE)} ${line}`);
      } else {
        b.classList.add('wrong');
        shake(b);
        $(`.choice[data-v="${item.verb}"]`, stage).classList.add('hint');
        oops();
        speak(`Nearly! We say: ${line}`);
      }
      ctx.setReplay(() => speak(line));
      record('word', item, { ok });
      showNext(stage, () => ctx.next(ok));
    }),
  );
}

// Build it — tap colour-coded word tiles into Who / Doing / What.
function playBuild(stage, item, ctx) {
  const ORDER = ['who', 'doing', 'what'];
  const LABEL = { who: 'Who', doing: 'Doing', what: 'What' };
  const doing = (v) => [v, item.mid].filter(Boolean).join(' ');
  const tiles = shuffle([
    { role: 'who', text: item.who, ok: true },
    { role: 'who', text: item.otherWho, ok: false },
    { role: 'doing', text: doing(item.verb), ok: true },
    { role: 'doing', text: doing(item.wrong), ok: false },
    { role: 'what', text: item.rest, ok: true },
  ]);
  stage.innerHTML = `${sceneHTML(item)}
    <div class="slots">${ORDER.map(
      (r, k) => `<div class="slot slot-${r} ${k === 0 ? 'active' : ''}" data-role="${r}"><span class="slot-label">${LABEL[r]}</span><span class="slot-fill"></span></div>`,
    ).join('')}</div>
    <div class="tray">${tiles.map((t, k) => `<button class="word-tile w-${t.role}" data-k="${k}">${t.text}</button>`).join('')}</div>
    <div class="next-slot"></div>`;
  const line = sentence(item);
  ctx.setReplay(() => speak(pos < ORDER.length ? 'Tap the words to build the sentence.' : line));
  speak(ctx.intro || 'Start with who.');

  let pos = 0;
  let mistakes = 0;
  let slotMistakes = 0;
  const slots = $$('.slot', stage);
  $$('.word-tile', stage).forEach((b) =>
    b.addEventListener('click', () => {
      if (pos >= ORDER.length) return;
      const t = tiles[b.dataset.k];
      if (t.role === ORDER[pos] && t.ok) {
        const slot = slots[pos];
        $('.slot-fill', slot).textContent = t.text;
        slot.classList.remove('active');
        slot.classList.add('filled');
        b.classList.add('used');
        b.disabled = true;
        $$('.word-tile.hint', stage).forEach((h) => h.classList.remove('hint'));
        slotMistakes = 0;
        pos++;
        if (pos < ORDER.length) {
          sfx.tap();
          slots[pos].classList.add('active');
          speak(t.text);
        } else {
          const ok = mistakes === 0;
          $$('.word-tile:not(.used)', stage).forEach((o) => o.classList.add('faded'));
          stage.querySelector('.slots').classList.add('complete');
          cheer();
          speak(`${ok ? pick(PRAISE) + ' ' : ''}${line}`);
          record('build', item, { ok });
          showNext(stage, () => ctx.next(ok));
        }
      } else {
        mistakes++;
        slotMistakes++;
        oops();
        shake(b);
        if (t.role !== ORDER[pos]) shake(slots[pos]);
        if (slotMistakes >= 2) {
          const k = tiles.findIndex((x) => x.role === ORDER[pos] && x.ok);
          $(`.word-tile[data-k="${k}"]`, stage).classList.add('hint');
        }
      }
    }),
  );
}

const judgeHTML = () => `<div class="judge">
    <p class="judge-title">${icon('lock')} Grown-up: how did it sound?</p>
    <div class="judge-row">
      <button class="judge-btn got" data-r="got">${icon('check')} Got it</button>
      <button class="judge-btn nearly" data-r="nearly">Nearly</button>
      <button class="judge-btn again" data-r="again">${icon('again')} Try again</button>
    </div>
  </div>`;

// Say it — hear the model, record a try, play it back, grown-up gives a rating.
function playSay(stage, item, ctx) {
  const line = sentence(item);
  const canRecord = recorder.supported;
  stage.innerHTML = `${sceneHTML(item)}
    <div class="prompt">${sentenceHTML(item)}</div>
    <div class="say-row">
      <button class="say-btn listen" id="listen">${icon('speaker')}<span>Listen</span></button>
      ${canRecord ? `<button class="say-btn rec" id="rec">${icon('mic')}<span>Say it</span></button>
      <button class="say-btn mine" id="mine" disabled>${icon('play')}<span>Hear me</span></button>` : ''}
    </div>
    ${canRecord ? '' : '<p class="note">Say it out loud together, then a grown-up taps below.</p>'}
    ${judgeHTML()}`;
  const model = () => speak(line, { rate: store.get().settings.rate * 0.95 });
  ctx.setReplay(model);
  speak(ctx.intro + line);

  $('#listen', stage).addEventListener('click', () => {
    sfx.tap();
    model();
  });

  let recording = false;
  let clip = null;
  let autoStop = null;
  let player = null;
  const recBtn = $('#rec', stage);
  const mineBtn = $('#mine', stage);

  const playClip = () => {
    if (!clip) return;
    player?.pause();
    player = new Audio(clip);
    mineBtn.classList.add('on');
    player.onended = () => mineBtn.classList.remove('on');
    player.play().catch(() => mineBtn.classList.remove('on'));
  };

  const stopRec = async () => {
    clearTimeout(autoStop);
    if (!recording) return;
    recording = false;
    recBtn.classList.remove('on');
    recBtn.innerHTML = `${icon('mic')}<span>Say it</span>`;
    clip = await recorder.stop();
    mineBtn.disabled = !clip;
    playClip();
  };

  recBtn?.addEventListener('click', async () => {
    if (recording) return stopRec();
    stopSpeaking();
    try {
      await recorder.start();
    } catch {
      toast('Speechie can’t use the microphone. On iPad: Settings › Apps › Safari › Microphone.');
      return;
    }
    recording = true;
    recBtn.classList.add('on');
    recBtn.innerHTML = `${icon('stop')}<span>Stop</span>`;
    autoStop = setTimeout(stopRec, 7000);
  });
  mineBtn?.addEventListener('click', playClip);

  $$('.judge-btn', stage).forEach((b) =>
    b.addEventListener('click', async () => {
      await stopRec();
      const rating = b.dataset.r;
      record('say', item, { rating });
      if (rating === 'again') {
        clip = null;
        if (mineBtn) mineBtn.disabled = true;
        speak(`Let's try again. Listen. ${line}`);
        return;
      }
      if (rating === 'got') cheer();
      else sfx.tap();
      ctx.next(rating === 'got');
    }),
  );

  return () => {
    clearTimeout(autoStop);
    player?.pause();
    recorder.release();
  };
}

// Topic words — find the picture, guess it from a clue, or say its name.
// Each new word is shown split into claps (syllables), which helps children say it.
function playVocab(stage, item, ctx) {
  const { word } = item;
  const log = (extra) => store.logAttempt({ activity: 'words', skill: 'vocab', theme: ctx.theme.id, word: word.w, type: item.type, ...extra });
  const claps = word.s.split('-');
  const clapLine = `${cap(word.w)}. Let’s clap it: ${claps.length === 1 ? 'one clap' : `${claps.length} claps`}.`;
  const wordCard = () => `<div class="word-card">
      <p class="vword">${claps.map((c) => `<span>${esc(c)}</span>`).join('')}</p>
      <p class="claps" aria-label="${claps.length} claps">${'👏'.repeat(claps.length)}</p>
    </div>`;

  if (item.type === 'say') {
    const ask = 'What’s this? Can you say it?';
    stage.innerHTML = `<div class="scene solo"><span class="scene-thing">${word.e}</span></div>
      <div class="prompt" id="reveal"><p class="question">${ask}</p></div>
      <div class="say-row"><button class="say-btn listen" id="listen">${icon('speaker')}<span>Hear it</span></button></div>
      ${judgeHTML()}`;
    const reveal = (before = '') => {
      $('#reveal', stage).innerHTML = wordCard();
      speak(before + clapLine);
      ctx.setReplay(() => speak(clapLine));
    };
    ctx.setReplay(() => speak(ask));
    speak(ctx.intro + ask);
    $('#listen', stage).addEventListener('click', () => {
      sfx.tap();
      reveal();
    });
    $$('.judge-btn', stage).forEach((b) =>
      b.addEventListener('click', () => {
        const rating = b.dataset.r;
        log({ rating });
        if (rating === 'again') return reveal('Let’s listen again. ');
        if (rating === 'got') cheer();
        else sfx.tap();
        ctx.next(rating === 'got');
      }),
    );
    return;
  }

  const find = item.type === 'find';
  const ask = find ? `Find ${the(word)}.` : `${word.c} What is it?`;
  stage.innerHTML = `<div class="scene pics">${item.options
      .map((o, k) => `<button class="pic" data-k="${k}" aria-label="${esc(o.w)}">${o.e}</button>`)
      .join('')}</div>
    <div class="prompt" id="reveal"><p class="question">${esc(find ? `Find ${the(word)}` : word.c)}</p></div>
    <div class="next-slot"></div>`;
  ctx.setReplay(() => speak(ask));
  speak(ctx.intro + ask);

  let tries = 0;
  let done = false;
  $$('.pic', stage).forEach((b) =>
    b.addEventListener('click', () => {
      if (done || b.classList.contains('tried')) return;
      const picked = item.options[b.dataset.k];
      if (picked === word) {
        done = true;
        const first = tries === 0;
        b.classList.add('right');
        $$('.pic', stage).forEach((o) => o !== b && o.classList.add('faded'));
        $('#reveal', stage).innerHTML = wordCard();
        cheer();
        speak(`${first ? pick(PRAISE) + ' ' : ''}${clapLine}`);
        ctx.setReplay(() => speak(clapLine));
        log({ ok: first });
        showNext(stage, () => ctx.next(first));
      } else {
        // Naming the wrong picture teaches that word too.
        tries++;
        oops();
        b.classList.add('tried');
        shake(b);
        speak(`That’s ${the(picked)}. ${find ? ask : 'Try again.'}`);
        if (tries >= 2) $(`.pic[data-k="${item.options.indexOf(word)}"]`, stage).classList.add('hint');
      }
    }),
  );
}

// --- End of round ---

function celebrate(activityId, roundStars, total) {
  const s = store.get();
  const missing = STICKERS.filter((x) => !s.stickers.includes(x));
  const sticker = missing.length ? pick(missing) : pick(STICKERS);
  const isNew = missing.length > 0;
  store.update((st) => {
    if (isNew) st.stickers.push(sticker);
    st.rounds++;
  });
  const name = s.child.name;
  const message = isNew ? 'You won a new sticker!' : 'You’ve collected every sticker!';
  mount(
    `<section class="screen celebrate">
      <div class="sticker-reveal"><span class="sticker-big">${sticker}</span></div>
      <h1>Brilliant, ${esc(name)}!</h1>
      <p class="lead">${message}</p>
      <div class="round-stars" aria-label="${roundStars} stars">${Array.from({ length: total }, (_, k) => `<span class="${k < roundStars ? 'lit' : ''}">${icon('star')}</span>`).join('')}</div>
      <div class="row">
        <button class="btn btn-primary btn-big" id="again">${icon('again')} Play again</button>
        <button class="btn btn-big" id="home">${icon('home')} Home</button>
      </div>
    </section>`,
    () => {
      sfx.win();
      confetti();
      speak(`Brilliant, ${name}! ${message}`);
      $('#again').addEventListener('click', () => {
        sfx.tap();
        play(activityId);
      });
      $('#home').addEventListener('click', () => {
        sfx.tap();
        home();
      });
    },
    { timed: true },
  );
}

function stickerBook() {
  if (timer.isUp()) return timeUp();
  const s = store.get();
  mount(
    `<section class="screen stickers">
      <header class="playbar">
        <button class="round-btn" id="home" aria-label="Home">${icon('home')}</button>
        <h1 class="bar-title">My stickers</h1>
        <span class="chip static">${icon('star')}<span>${s.stickers.length}/${STICKERS.length}</span></span>
      </header>
      <div class="sticker-grid">${STICKERS.map((x) =>
        s.stickers.includes(x) ? `<button class="sticker" aria-label="Sticker">${x}</button>` : '<span class="sticker empty">?</span>',
      ).join('')}</div>
    </section>`,
    () => {
      $('#home').addEventListener('click', () => {
        sfx.tap();
        home();
      });
      $$('.sticker:not(.empty)').forEach((b) =>
        b.addEventListener('click', () => {
          sfx.good();
          shake(b);
        }),
      );
      const n = s.stickers.length;
      speak(n ? `You have ${n} sticker${n === 1 ? '' : 's'}!` : 'Play a game to win your first sticker!');
    },
    { timed: true },
  );
}

// --- Grown-ups area ---

const TABS = [
  ['progress', 'Progress'],
  ['skills', 'Skills'],
  ['settings', 'Settings'],
  ['tips', 'Tips'],
];

function grownups(tab = 'progress') {
  const s = store.get();
  mount(
    `<section class="screen grown">
      <header class="grown-head">
        <div><p class="eyebrow">Grown-ups</p><h1>${esc(s.child.name)}’s practice</h1></div>
        <button class="btn" id="back">${icon('back')} Back to games</button>
      </header>
      <nav class="tabs" role="tablist">${TABS.map(
        ([id, label]) => `<button role="tab" class="tab ${id === tab ? 'on' : ''}" data-tab="${id}" aria-selected="${id === tab}">${label}</button>`,
      ).join('')}</nav>
      <div class="grown-body" id="body"></div>
    </section>`,
    () => {
      $('#back').addEventListener('click', () => home());
      $$('.tab').forEach((t) => t.addEventListener('click', () => grownups(t.dataset.tab)));
      return { progress: progressTab, skills: skillsTab, settings: settingsTab, tips: tipsTab }[tab]($('#body'));
    },
  );
}

const DAY = 864e5;
const dayKey = (t) => new Date(t).toDateString();

function skillStats(log, skillId) {
  const tries = log.filter((e) => e.skill === skillId && e.activity !== 'say');
  const recent = tries.slice(-20);
  const accuracy = recent.length ? Math.round((100 * recent.filter((e) => e.ok).length) / recent.length) : null;
  const byDay = new Map();
  for (const e of tries) {
    const k = dayKey(e.t);
    const d = byDay.get(k) || { t: e.t, n: 0, ok: 0 };
    d.n++;
    if (e.ok) d.ok++;
    byDay.set(k, d);
  }
  const days = [...byDay.values()].slice(-7);
  const says = log.filter((e) => e.skill === skillId && e.activity === 'say');
  const count = (r) => says.filter((e) => e.rating === r).length;
  return { total: tries.length, recentCount: recent.length, accuracy, days, said: { got: count('got'), nearly: count('nearly'), again: count('again') } };
}

const minutes = (secs) => {
  const m = Math.round(secs / 60);
  return secs > 0 && m === 0 ? 'under 1 min' : `${m} min`;
};

function progressTab(body) {
  const s = store.get();
  const week = s.log.filter((e) => e.t >= Date.now() - 7 * DAY);
  const daysThisWeek = new Set(week.map((e) => dayKey(e.t))).size;

  if (!s.log.length) {
    body.innerHTML = `<div class="card empty-state">
      <span class="pip-mid">${pip('calm')}</span>
      <h2>No practice yet</h2>
      <p class="muted">Hand the iPad to ${esc(s.child.name)} and pick a game together. Progress will appear here.</p>
    </div>`;
    return;
  }

  const cards = SKILLS.map((sk) => ({ sk, st: skillStats(s.log, sk.id) }))
    .filter(({ sk, st }) => s.skills[sk.id] || st.total || st.said.got + st.said.nearly)
    .map(({ sk, st }) => {
      const confident = st.accuracy >= 80 && st.recentCount >= 15;
      const learning = st.accuracy !== null && st.accuracy < 50 && st.recentCount >= 10;
      const sayTotal = st.said.got + st.said.nearly + st.said.again;
      return `<article class="card skill-card">
        <header><h3>${sk.name}</h3><span class="tag ${s.skills[sk.id] ? 'on' : ''}">${s.skills[sk.id] ? 'On' : 'Off'}</span></header>
        <p class="muted">${sk.example}</p>
        ${
          st.accuracy === null
            ? '<p class="muted small">No tapping games yet.</p>'
            : `<div class="meter"><div class="meter-fill ${confident ? 'great' : learning ? 'low' : ''}" style="width:${st.accuracy}%"></div></div>
               <p><b class="big-num">${st.accuracy}%</b> right first time <span class="muted small">(last ${st.recentCount} of ${st.total})</span></p>
               <div class="bars" aria-hidden="true">${st.days
                 .map((d) => `<span class="bar"><i style="height:${Math.max(6, Math.round((100 * d.ok) / d.n))}%"></i><small>${new Date(d.t).toLocaleDateString('en-GB', { weekday: 'short' })}</small></span>`)
                 .join('')}</div>`
        }
        ${sayTotal ? `<p class="small">Say it: <b>${st.said.got}</b> got it · <b>${st.said.nearly}</b> nearly · <b>${st.said.again}</b> try again</p>` : ''}
        ${confident ? '<p class="badge good">Looking confident!</p>' : ''}
        ${learning ? '<p class="badge">Still learning: keep modelling it in everyday chat.</p>' : ''}
      </article>`;
    })
    .join('');

  const ready = SKILLS.filter((sk) => s.skills[sk.id]).every((sk) => {
    const st = skillStats(s.log, sk.id);
    return st.accuracy >= 80 && st.recentCount >= 15;
  });
  const nextSkill = SKILLS.find((sk) => !s.skills[sk.id]);

  const played = timer.history(7);
  const weekMins = Math.round(played.reduce((n, d) => n + d.secs, 0) / 60);
  const rated = SKILLS.filter((sk) => s.skills[sk.id])
    .map((sk) => ({ sk, st: skillStats(s.log, sk.id) }))
    .filter(({ st }) => st.recentCount >= 5)
    .sort((a, b) => b.st.accuracy - a.st.accuracy);
  const strong = rated.filter(({ st }) => st.accuracy >= 75).slice(0, 2);
  const work = rated.filter(({ st }) => st.accuracy < 60).slice(-2);
  const weekCard = `<div class="card week-card">
      <h2>This week</h2>
      <p>${esc(s.child.name)} practised on <b>${daysThisWeek} ${daysThisWeek === 1 ? 'day' : 'days'}</b>${weekMins ? `, for about <b>${weekMins} ${weekMins === 1 ? 'minute' : 'minutes'}</b> in total` : ''}.</p>
      ${strong.length || work.length ? `<ul class="week-list">
        ${strong.map(({ sk, st }) => `<li>Going well: <b>${sk.name}</b> (${st.accuracy}% right first time)</li>`).join('')}
        ${work.map(({ sk, st }) => `<li class="work">Still learning: <b>${sk.name}</b> (${st.accuracy}%). Try saying it back the right way in everyday chat, e.g. “${sk.example}”</li>`).join('')}
      </ul>` : '<p class="muted">After a few more games, this will show what’s going well and what to keep practising.</p>'}
    </div>`;
  const topMins = Math.max(...played.map((d) => d.secs / 60), s.settings.minutes || 10);
  body.innerHTML = `
    ${weekCard}
    <div class="summary">
      <div class="card stat"><b>${week.length}</b><span>tries this week</span></div>
      <div class="card stat"><b>${daysThisWeek}<small>/7</small></b><span>days practised</span></div>
      <div class="card stat"><b>${weekMins}<small> min</small></b><span>played this week</span></div>
      <div class="card stat"><b>${s.stickers.length}<small>/${STICKERS.length}</small></b><span>stickers</span></div>
    </div>
    <div class="card">
      <h2>Time played</h2>
      <p class="muted">Today: <b>${minutes(timer.usedToday())}</b>${timer.limited() ? ` of ${s.settings.minutes} min` : ''}. Little and often works best.</p>
      <div class="bars" aria-hidden="true">${played
        .map((d) => `<span class="bar"><i style="height:${Math.max(4, Math.round((100 * d.secs) / 60 / topMins))}%"></i><small>${new Date(d.t).toLocaleDateString('en-GB', { weekday: 'short' })}</small></span>`)
        .join('')}</div>
    </div>
    ${ready && nextSkill ? `<div class="card suggest">${icon('star')}<p><b>Ready for more?</b> ${esc(s.child.name)} is doing well. Try switching on <b>${nextSkill.name}</b> in Skills.</p></div>` : ''}
    <div class="skill-grid">${cards}</div>
    ${wordsCard(s)}`;
}

function wordsCard(s) {
  const tries = s.log.filter((e) => e.activity === 'words');
  if (!tries.length) return '';
  const taps = tries.filter((e) => e.type !== 'say').slice(-20);
  const accuracy = taps.length ? Math.round((100 * taps.filter((e) => e.ok).length) / taps.length) : null;
  const known = new Map();
  for (const e of tries) {
    if (!(e.ok || e.rating === 'got')) continue;
    const w = THEMES.find((t) => t.id === e.theme)?.words.find((x) => x.w === e.word);
    if (w) known.set(w.w, w);
  }
  return `<article class="card">
      <h2>Topic words</h2>
      <p class="muted">Finding pictures, guessing from clues and saying the names of seasonal words.</p>
      ${accuracy === null ? '' : `<div class="meter"><div class="meter-fill" style="width:${accuracy}%"></div></div>
        <p><b class="big-num">${accuracy}%</b> found first time <span class="muted small">(last ${taps.length})</span></p>`}
      ${known.size ? `<p class="small">Words ${esc(s.child.name)} has got right (${known.size}):</p>
        <div class="known">${[...known.values()].map((w) => `<span>${w.e} ${esc(w.w)}</span>`).join('')}</div>` : ''}
    </article>`;
}

function skillsTab(body) {
  const s = store.get();
  const row = (sk) => `<label class="toggle-row">
      <span><b>${sk.name}</b><small>${sk.example}</small></span>
      <input type="checkbox" class="switch" data-skill="${sk.id}" ${s.skills[sk.id] ? 'checked' : ''}>
    </label>`;
  body.innerHTML = `
    <div class="card">
      <h2>Who is it?</h2>
      <p class="muted">Choosing the right word for the person in the picture.</p>
      <div class="toggle-list">${SKILLS.filter((x) => x.group === 'who').map(row).join('')}</div>
    </div>
    <div class="card">
      <h2>Matching words</h2>
      <p class="muted">Used in Pick the word, Build it and Say it. Start with one or two, then add more as your child grows in confidence.</p>
      <div class="toggle-list">${SKILLS.filter((x) => x.group === 'verb').map(row).join('')}</div>
    </div>`;
  $$('.switch', body).forEach((sw) =>
    sw.addEventListener('change', () => store.update((st) => (st.skills[sw.dataset.skill] = sw.checked))),
  );
}

// A row of big buttons where one is chosen.
const seg = (id, options, current) =>
  `<div class="seg" id="${id}" role="radiogroup">${options
    .map(([v, label]) => `<button type="button" role="radio" class="seg-opt" data-v="${v}" aria-checked="${String(v) === String(current)}">${label}</button>`)
    .join('')}</div>`;

function onSeg(root, id, fn) {
  const opts = $$(`#${id} .seg-opt`, root);
  opts.forEach((b) =>
    b.addEventListener('click', () => {
      opts.forEach((o) => o.setAttribute('aria-checked', o === b));
      fn(b.dataset.v);
    }),
  );
}

const MINUTES = [[0, 'No limit'], [5, '5 min'], [10, '10 min'], [15, '15 min'], [20, '20 min'], [30, '30 min']];
const TEXT_SIZES = [['normal', 'Normal'], ['large', 'Large'], ['xl', 'Extra large']];

function settingsTab(body) {
  const draw = () => {
    const s = store.get();
    const voices = britishVoices();
    body.innerHTML = `
      <section class="group"><p class="group-title">Play</p>
      <div class="card">
        <h2>Play time</h2>
        <p class="muted">How long ${esc(s.child.name)} can play each day. Time in this grown-ups area doesn’t count. When time is up, Speechie lets them finish the turn they’re on, then says it’s time for a break.</p>
        ${seg('minutes', MINUTES, s.settings.minutes)}
        <p class="time-today" id="today"></p>
        <div class="row left">
          <button class="btn" id="add5">${icon('plus')} 5 more minutes today</button>
          <button class="btn" id="restart">${icon('again')} Start today’s time again</button>
        </div>
      </div>
      </section>
      <section class="group"><p class="group-title">Display</p>
      <div class="card">
        <h2>Text size</h2>
        ${seg('text', TEXT_SIZES, s.settings.textSize)}
        <p class="muted">Makes words and buttons bigger across Speechie.</p>
      </div>
      </section>
      <section class="group"><p class="group-title">Words game</p>
      <div class="card">
        <h2>Topic words</h2>
        <p class="muted">The words game follows the calendar: festivals like Halloween, Diwali, Christmas, Chinese New Year and Easter when they’re near, and the season the rest of the time. Right now that’s <b>${themeFor().name}</b>.</p>
        <label class="field"><span>Topic</span><select id="theme">
          <option value="auto">Automatic (follows the calendar)</option>
          ${THEMES.map((t) => `<option value="${t.id}" ${t.id === s.settings.theme ? 'selected' : ''}>${t.art} ${t.name}</option>`).join('')}
        </select></label>
      </div>
      </section>
      <section class="group"><p class="group-title">Sound</p>
      <div class="card">
        <h2>Volume</h2>
        <label class="field"><span>Pip’s voice</span>
          <input type="range" id="volume" min="0.2" max="1" step="0.1" value="${s.settings.volume}">
          <span class="range-labels"><small>Quieter</small><small>Louder</small></span>
        </label>
        <label class="toggle-row"><span><b>Sound effects</b><small>Chimes for right answers and celebrations</small></span>
          <input type="checkbox" class="switch" id="sfx" ${s.settings.sfx ? 'checked' : ''}></label>
        <label class="field" ${s.settings.sfx ? '' : 'hidden'} id="sfx-volume-field"><span>Sound effects volume</span>
          <input type="range" id="sfx-volume" min="0.1" max="1" step="0.1" value="${s.settings.sfxVolume}">
          <span class="range-labels"><small>Quieter</small><small>Louder</small></span>
        </label>
        <p class="muted small">These set how loud Speechie is compared with the iPad’s own volume buttons.</p>
      </div>
      <div class="card">
        <h2>Voice</h2>
        ${
          voices.length
            ? `<label class="field"><span>British English voice</span><select id="voice"><option value="">Automatic</option>${voices
                .map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.settings.voiceURI ? 'selected' : ''}>${esc(v.name)}</option>`)
                .join('')}</select></label>
               <p class="muted small">Tip: on iPad, Settings › Accessibility › Spoken Content › Voices › English (UK) lets you download clearer “Enhanced” voices.</p>`
            : '<p class="muted">No British English voice was found on this device, so the default voice is used.</p>'
        }
        <label class="field"><span>Speaking speed</span>
          <input type="range" id="rate" min="0.6" max="1.05" step="0.05" value="${s.settings.rate}">
          <span class="range-labels"><small>Slower</small><small>Normal</small></span>
        </label>
        <button class="btn" id="test">${icon('speaker')} Test the voice</button>
      </div>
      </section>
      <section class="group"><p class="group-title">Your child</p>
      <div class="card">
        <h2>Name and buddy</h2>
        <label class="field"><span>Name</span><input id="name" maxlength="20" autocomplete="off" value="${esc(s.child.name)}"></label>
        <fieldset class="field"><legend>Buddy</legend><div class="avatar-grid">${AVATARS.map(
          (a) => `<button type="button" class="avatar-opt ${a === s.child.avatar ? 'on' : ''}" data-a="${a}" aria-pressed="${a === s.child.avatar}">${a}</button>`,
        ).join('')}</div></fieldset>
      </div>
      </section>
      <section class="group"><p class="group-title">This device</p>
      <div class="card">
        <h2>Use it like an app</h2>
        <p class="muted">On iPad, open Speechie in Safari, tap the Share button, then <b>Add to Home Screen</b>. It opens full screen and works offline.</p>
      </div>
      <div class="card danger">
        <h2>Start fresh</h2>
        <p class="muted">Clears progress, stars and stickers. Name, skills and settings are kept.</p>
        <button class="btn btn-danger" id="reset">Reset progress</button>
      </div>
      </section>`;

    paintToday();
    onSeg(body, 'minutes', (v) => {
      store.update((st) => (st.settings.minutes = Number(v)));
      paintToday();
    });
    $('#add5', body).addEventListener('click', () => {
      timer.addMinutes(5);
      toast('5 minutes added for today');
    });
    $('#restart', body).addEventListener('click', () => {
      timer.resetToday();
      toast('Today’s play time starts again');
    });
    onSeg(body, 'text', (v) => {
      store.update((st) => (st.settings.textSize = v));
      applyTextSize();
    });
    $('#theme', body).addEventListener('change', (e) => store.update((st) => (st.settings.theme = e.target.value)));
    $('#volume', body).addEventListener('change', (e) => {
      store.update((st) => (st.settings.volume = Number(e.target.value)));
      speak('Hello! This is how loud I am.');
    });
    $('#sfx', body).addEventListener('change', (e) => {
      store.update((st) => (st.settings.sfx = e.target.checked));
      $('#sfx-volume-field', body).hidden = !e.target.checked;
    });
    $('#sfx-volume', body).addEventListener('change', (e) => {
      store.update((st) => (st.settings.sfxVolume = Number(e.target.value)));
      sfx.good();
    });
    $('#voice', body)?.addEventListener('change', (e) => store.update((st) => (st.settings.voiceURI = e.target.value)));
    $('#rate', body).addEventListener('change', (e) => store.update((st) => (st.settings.rate = Number(e.target.value))));
    $('#test', body).addEventListener('click', () => speak(`She has a cat. They have a dog.`));
    $('#name', body).addEventListener('change', (e) => {
      const name = e.target.value.trim();
      if (name) store.update((st) => (st.child.name = name));
    });
    $$('.avatar-opt', body).forEach((b) =>
      b.addEventListener('click', () => {
        store.update((st) => (st.child.avatar = b.dataset.a));
        $$('.avatar-opt', body).forEach((o) => {
          o.classList.toggle('on', o === b);
          o.setAttribute('aria-pressed', o === b);
        });
      }),
    );
    $('#reset', body).addEventListener('click', () => {
      if (confirm('Reset all progress, stars and stickers? This can’t be undone.')) {
        store.resetProgress();
        toast('Progress reset');
      }
    });
  };

  const paintToday = () => {
    const el = $('#today', body);
    if (!el) return;
    const used = `Played today: <b>${minutes(timer.usedToday())}</b>`;
    el.innerHTML = timer.limited() ? `${used} · Left: <b>${timer.format(timer.left())}</b>` : used;
  };

  draw();
  const stopTime = timer.onChange(paintToday);
  // Voices can load a moment after the page; redraw once if they arrive.
  const stopVoices = onVoicesChanged(() => {
    if (!$('#voice', body) && britishVoices().length) draw();
  });
  return () => {
    stopTime();
    stopVoices();
  };
}

function tipsTab(body) {
  body.innerHTML = `
    <div class="tips">
      <article class="card tip"><span class="tip-num">1</span><div><h3>Little and often</h3><p>5–10 minutes on most days helps more than one long session. Stop while it’s still fun.</p></div></article>
      <article class="card tip"><span class="tip-num">2</span><div><h3>Say it back the right way</h3><p>If your child says <i>“she have a dog”</i>, reply warmly with the right version: <i>“Yes! She <b>has</b> a dog.”</i> Stress the word a little. There’s no need to ask them to repeat it. Hearing it lots is what helps.</p></div></article>
      <article class="card tip"><span class="tip-num">3</span><div><h3>Talk about what you see</h3><p>Out and about, describe people: <i>“Look, <b>he</b> is running. <b>They</b> are playing.”</i> Books and photos of family are great too.</p></div></article>
      <article class="card tip"><span class="tip-num">4</span><div><h3>Use the picture clues</h3><p>One boy or man → <b>he</b>. One girl or woman → <b>she</b>. More than one person → <b>they</b>.</p></div></article>
      <article class="card tip"><span class="tip-num">5</span><div><h3>Praise the trying</h3><p>Celebrate effort as much as right answers. Speechie never says “wrong”, and you don’t need to either.</p></div></article>
      <article class="card tip"><span class="tip-num">6</span><div><h3>Share with the therapist</h3><p>Show your child’s speech and language therapist the Progress tab. They can tell you which skills to switch on next.</p></div></article>
    </div>
    <p class="muted small disclaimer">Speechie is a practice tool for home. It doesn’t replace advice from a speech and language therapist.</p>`;
}

// --- Go ---

if ('serviceWorker' in navigator && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

applyTextSize();
splash();
