// More grammar games: one or lots (plurals), in / on / under, yesterday (-ed), and who / what / where.
// Every turn is a picture, a question, and a few big choices.
import { pick, shuffle, TONES, ROUND_LENGTH } from './content.js';

export const GRAMMAR = [
  { id: 'plural', name: 'One or lots?', art: '🐱🐱', intro: 'One or lots? Count, then pick the word.' },
  { id: 'prep', name: 'Where is it?', art: '📦', intro: 'Where is it? In, on or under?' },
  { id: 'past', name: 'Yesterday', art: '📅', intro: 'These things happened yesterday.' },
  { id: 'question', name: 'Who, what, where?', art: '❓', intro: 'Listen to the question, then pick the answer.' },
];

const tone = () => pick(TONES);
const NUMBERS = ['', 'one', 'two', 'three', 'four', 'five'];

// [one, more than one, picture]
const NOUNS = [
  ['cat', 'cats', '🐱'], ['dog', 'dogs', '🐶'], ['duck', 'ducks', '🦆'], ['apple', 'apples', '🍎'],
  ['ball', 'balls', '⚽'], ['star', 'stars', '⭐'], ['car', 'cars', '🚗'], ['bee', 'bees', '🐝'],
  ['frog', 'frogs', '🐸'], ['cake', 'cakes', '🧁'], ['bus', 'buses', '🚌'], ['fox', 'foxes', '🦊'],
  ['box', 'boxes', '📦'], ['flower', 'flowers', '🌷'], ['sock', 'socks', '🧦'], ['egg', 'eggs', '🥚'],
];

function plural() {
  const [one, many, art] = pick(NOUNS);
  const n = Math.random() < 0.4 ? 1 : 2 + Math.floor(Math.random() * 4);
  const answer = n === 1 ? one : many;
  return {
    skill: 'plural',
    scene: `<div class="scene count ${n > 3 ? 'lots' : ''}">${Array(n).fill(`<span>${art}</span>`).join('')}</div>`,
    before: `I can see ${NUMBERS[n]}`,
    after: '',
    options: shuffle([one, many]).map((label) => ({ label })),
    answer,
    ask: `How many? Pick the word. I can see ${NUMBERS[n]}…`,
    line: `I can see ${NUMBERS[n]} ${answer}.`,
  };
}

// [name, picture]
const CRITTERS = [['cat', '🐱'], ['dog', '🐶'], ['rabbit', '🐰'], ['frog', '🐸'], ['mouse', '🐭'], ['teddy', '🧸'], ['duck', '🦆'], ['ball', '⚽']];

function prep() {
  const where = pick(['in', 'on', 'under']);
  // A box for "in", a table for "under", either for "on".
  const thing = where === 'in' ? 'box' : where === 'under' ? 'table' : pick(['box', 'table']);
  const [name, art] = pick(CRITTERS);
  const scene =
    thing === 'box'
      ? `<div class="scene prep at-${where}"><span class="box-back"></span><span class="critter"><i>${art}</i></span><span class="box-front"></span></div>`
      : `<div class="scene prep at-${where}"><span class="table-top"></span><span class="leg l"></span><span class="leg r"></span><span class="critter"><i>${art}</i></span></div>`;
  return {
    skill: 'prep',
    scene,
    before: `The ${name} is`,
    after: `the ${thing}.`,
    options: ['in', 'on', 'under'].map((label) => ({ label })),
    answer: where,
    ask: `Where is the ${name}? In, on, or under the ${thing}?`,
    line: `The ${name} is ${where} the ${thing}.`,
  };
}

// [now, yesterday, what, picture] — regular verbs only, so the -ed ending is always the clue.
const PAST = [
  ['play', 'played', 'football', '⚽'], ['paint', 'painted', 'a picture', '🎨'], ['cook', 'cooked', 'dinner', '🍳'],
  ['wash', 'washed', 'the car', '🚗'], ['watch', 'watched', 'TV', '📺'], ['bake', 'baked', 'cakes', '🧁'],
  ['plant', 'planted', 'seeds', '🌱'], ['climb', 'climbed', 'a tree', '🌳'], ['brush', 'brushed', 'the dog', '🐕'],
  ['walk', 'walked', 'to school', '🏫'], ['jump', 'jumped', 'in puddles', '💦'], ['open', 'opened', 'a present', '🎁'],
];
const PEOPLE = { she: ['👧', '👩'], he: ['👦', '👨'], they: [['👧', '👦'], ['👦', '👦'], ['👩', '👨']] };
const WHO = { he: 'He', she: 'She', they: 'They' };
const people = (pron) => (pron === 'they' ? pick(PEOPLE.they) : [pick(PEOPLE[pron])]).map((e) => e + tone());

function past() {
  const [now, then, what, art] = pick(PAST);
  const pron = pick(['he', 'she', 'they']);
  return {
    skill: 'past',
    scene: `<div class="scene ${pron === 'they' ? 'many' : ''}"><span class="when">📅 Yesterday</span>
      <span class="scene-people">${people(pron).map((p) => `<span>${p}</span>`).join('')}</span><span class="scene-thing">${art}</span></div>`,
    before: `Yesterday, ${WHO[pron].toLowerCase()}`,
    after: `${what}.`,
    options: shuffle([now, then]).map((label) => ({ label })),
    answer: then,
    ask: `Yesterday… which word fits? ${now}, or ${then}?`,
    line: `Yesterday, ${WHO[pron].toLowerCase()} ${then} ${what}.`,
  };
}

// [doing, what, picture, where, picture]
const SCENES = [
  ['reading', 'a book', '📖', 'in bed', '🛏️'], ['eating', 'an apple', '🍎', 'in the park', '🏞️'],
  ['building', 'a sandcastle', '🏰', 'at the beach', '🏖️'], ['painting', 'a picture', '🎨', 'at school', '🏫'],
  ['kicking', 'a ball', '⚽', 'in the garden', '🌳'], ['singing', 'a song', '🎵', 'in the car', '🚗'],
  ['riding', 'a bike', '🚲', 'in the park', '🏞️'], ['flying', 'a kite', '🪁', 'on the hill', '⛰️'],
  ['eating', 'ice cream', '🍦', 'at the seaside', '🌊'], ['drinking', 'milk', '🥛', 'at home', '🏠'],
];
const PERSON = { she: 'the girl', he: 'the boy', they: 'the children' };
const KIND = { who: 'Who asks about a person.', what: 'What asks about a thing.', where: 'Where asks about a place.' };

function question(kind) {
  const [doing, what, whatArt, where, whereArt] = pick(SCENES);
  const pron = pick(['he', 'she', 'they']);
  const be = pron === 'they' ? 'are' : 'is';
  const kids = { she: ['👧'], he: ['👦'], they: [pick(['👧', '👦']), pick(['👧', '👦'])] }[pron].map((e) => e + tone()).join('');
  const ask = {
    who: `Who ${be} ${doing} ${what}?`,
    what: `What ${be} ${pron} ${doing}?`,
    where: `Where ${be} ${pron} ${doing} ${what}?`,
  }[kind];
  const options = [
    { label: PERSON[pron], kind: 'who' },
    { label: what, kind: 'what' },
    { label: where, kind: 'where' },
  ];
  return {
    skill: 'question',
    scene: `<div class="scene q-scene"><span class="scene-place">${whereArt}</span><span class="scene-people">${kids}</span><span class="scene-thing">${whatArt}</span></div>`,
    prompt: ask,
    options: shuffle(options),
    answer: options.find((o) => o.kind === kind).label,
    ask,
    line: `${pron === 'they' ? 'They are' : `${pron === 'he' ? 'He' : 'She'} is`} ${doing} ${what} ${where}. ${KIND[kind]}`,
  };
}

export function makeGrammarRound(id) {
  if (id === 'question') return shuffle(['who', 'what', 'where', 'who', 'what', 'where']).map(question);
  const make = { plural, prep, past }[id];
  const items = [];
  // Avoid the same picture twice in a row.
  while (items.length < ROUND_LENGTH) {
    const it = make();
    if (!items.length || it.scene !== items[items.length - 1].scene) items.push(it);
  }
  return items;
}
