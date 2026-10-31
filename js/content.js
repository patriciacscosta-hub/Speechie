// Practice content. Sentences are generated from people × pictures so every
// round feels fresh without hand-writing hundreds of items.

export const SKILLS = [
  { id: 'hs', group: 'who', name: 'He & She', example: 'He is… / She is…', about: 'Choosing he or she for one person.' },
  { id: 'they', group: 'who', name: 'They', example: 'They are…', about: 'Using they for two or more people.' },
  { id: 'isare', group: 'verb', name: 'is / are', example: 'She is running. They are running.', about: 'is for one person, are for more.' },
  { id: 'hashave', group: 'verb', name: 'has / have', example: 'He has a dog. They have a dog.', about: 'has for he and she, have for they.' },
  { id: 'verbs', group: 'verb', name: 'Action words', example: 'She plays. They play.', about: 'Adding -s to the action for he and she.' },
  { id: 'waswere', group: 'verb', name: 'was / were', example: 'He was happy. They were happy.', about: 'Talking about the past.' },
  { id: 'plural', group: 'more', name: 'One or lots?', example: 'One cat. Three cats.', about: 'Adding -s when there’s more than one.' },
  { id: 'prep', group: 'more', name: 'in / on / under', example: 'The cat is under the table.', about: 'Words for where things are.' },
  { id: 'past', group: 'more', name: 'Yesterday (-ed)', example: 'Yesterday she played football.', about: 'Adding -ed for things that already happened.' },
  { id: 'question', group: 'more', name: 'Who, what, where?', example: 'Where is she reading? In bed.', about: 'Knowing what each question word asks for.' },
];

export const ACTIVITIES = [
  { id: 'who', name: 'Who is it?', art: '👧👦', colour: 'coral', intro: 'Who is it?' },
  { id: 'word', name: 'Pick the word', art: '🧩', colour: 'sun', intro: 'Pick the word.' },
  { id: 'build', name: 'Build it', art: '🧱', colour: 'teal', intro: 'Build the sentence. Start with who.' },
  { id: 'say', name: 'Say it', art: '🎤', colour: 'lilac', intro: 'Listen, then you say it.' },
];

export const AVATARS = ['🦊', '🐼', '🐯', '🐸', '🐵', '🦁', '🐰', '🐻', '🐨', '🦄'];

export const STICKERS = ['🦄', '🐙', '🦖', '🚀', '🌈', '🍩', '🦋', '🐢', '🌟', '🦊', '🐳', '🍉',
  '🦁', '🐝', '🎠', '🧁', '🐧', '🌻', '🦜', '🍓', '🐞', '🎡', '🐬', '🪐'];

export const PRAISE = ['Yes!', 'Brilliant!', 'Well done!', 'Super!', 'You got it!', 'Fantastic!'];

export const TONES = ['', '\u{1F3FB}', '\u{1F3FC}', '\u{1F3FD}', '\u{1F3FE}', '\u{1F3FF}'];

const PEOPLE = {
  she: ['👧', '👩', '👵'],
  he: ['👦', '👨', '👴'],
  they: [['👧', '👦'], ['👦', '👦'], ['👧', '👧'], ['👩', '👨'], ['👵', '👴'], ['👦', '👧', '👦']],
};

// [doing, what, picture]
const ING = [
  ['eating', 'an apple', '🍎'], ['kicking', 'a ball', '⚽'], ['reading', 'a book', '📖'],
  ['drinking', 'milk', '🥛'], ['riding', 'a bike', '🚲'], ['painting', 'a picture', '🎨'],
  ['eating', 'a banana', '🍌'], ['flying', 'a kite', '🪁'], ['playing', 'the drums', '🥁'],
  ['eating', 'cake', '🍰'], ['building', 'a snowman', '⛄'], ['holding', 'an umbrella', '☂️'],
  ['singing', 'a song', '🎵'], ['cooking', 'pancakes', '🥞'], ['watering', 'the flowers', '🌷'],
  ['playing', 'the guitar', '🎸'], ['eating', 'pizza', '🍕'], ['hugging', 'a teddy', '🧸'],
  ['feeding', 'the duck', '🦆'], ['catching', 'a fish', '🎣'],
];

// [what, picture]
const HAVE = [
  ['a cat', '🐱'], ['a dog', '🐶'], ['a balloon', '🎈'], ['an ice cream', '🍦'], ['a teddy', '🧸'],
  ['a present', '🎁'], ['a fish', '🐠'], ['a birthday cake', '🎂'], ['an umbrella', '☂️'],
  ['a rabbit', '🐰'], ['a red car', '🚗'], ['a lolly', '🍭'], ['a guitar', '🎸'], ['a kite', '🪁'],
  ['a crown', '👑'], ['a backpack', '🎒'],
];

// [they-form, he/she-form, what, picture]
const ACTIONS = [
  ['play', 'plays', 'football', '⚽'], ['eat', 'eats', 'carrots', '🥕'], ['like', 'likes', 'apples', '🍎'],
  ['read', 'reads', 'books', '📚'], ['drink', 'drinks', 'juice', '🧃'], ['watch', 'watches', 'TV', '📺'],
  ['wash', 'washes', 'the car', '🚗'], ['go', 'goes', 'to school', '🏫'], ['ride', 'rides', 'a scooter', '🛴'],
  ['love', 'loves', 'cats', '🐈'], ['catch', 'catches', 'the ball', '🏐'], ['fly', 'flies', 'a kite', '🪁'],
  ['bake', 'bakes', 'cakes', '🧁'], ['sing', 'sings', 'songs', '🎵'], ['brush', 'brushes', 'the dog', '🐕'],
  ['plant', 'plants', 'seeds', '🌱'],
];

// [what, picture]
const WAS = [
  ['happy', '😄'], ['at the beach', '🏖️'], ['sleepy', '😴'], ['in the garden', '🌻'],
  ['at the park', '🌳'], ['cold', '🥶'], ['at the zoo', '🦒'], ['wet', '🌧️'], ['hungry', '🍽️'],
  ['at the farm', '🐄'], ['excited', '🎉'], ['at the seaside', '🌊'],
];

export const pick = (list) => list[Math.floor(Math.random() * list.length)];

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Deal n values from a shuffled, repeating bag so a round stays balanced.
function deal(values, n) {
  let out = [];
  while (out.length < n) out = out.concat(shuffle(values));
  return out.slice(0, n);
}

const SUBJECT = { he: 'He', she: 'She', they: 'They' };

function people(pron) {
  const base = pron === 'they' ? pick(PEOPLE.they) : [pick(PEOPLE[pron])];
  return base.map((e) => e + pick(TONES));
}

export function makeItem(skill, pron) {
  const many = pron === 'they';
  const item = {
    skill,
    pron,
    people: people(pron),
    who: SUBJECT[pron],
    otherWho: pron === 'he' ? 'She' : pron === 'she' ? 'He' : pick(['He', 'She']),
    mid: '',
  };
  if (skill === 'hashave') {
    const [rest, thing] = pick(HAVE);
    return { ...item, thing, rest, verb: many ? 'have' : 'has', wrong: many ? 'has' : 'have' };
  }
  if (skill === 'verbs') {
    const [plain, s, rest, thing] = pick(ACTIONS);
    return { ...item, thing, rest, verb: many ? plain : s, wrong: many ? s : plain };
  }
  if (skill === 'waswere') {
    const [rest, thing] = pick(WAS);
    return { ...item, thing, rest, verb: many ? 'were' : 'was', wrong: many ? 'was' : 'were' };
  }
  // 'hs', 'they' and 'isare' all use "is/are + -ing" pictures.
  const [mid, rest, thing] = pick(ING);
  return { ...item, thing, mid, rest, verb: many ? 'are' : 'is', wrong: many ? 'is' : 'are' };
}

export const sentence = (it) => [it.who, it.verb, it.mid, it.rest].filter(Boolean).join(' ') + '.';

export const ROUND_LENGTH = 6;

export function makeRound(activity, skills) {
  const items = [];
  const seen = new Set();
  const add = (make) => {
    // Avoid showing the same picture twice in one round.
    for (let tries = 0; tries < 12; tries++) {
      const it = make();
      if (!seen.has(it.thing) || tries === 11) {
        seen.add(it.thing);
        items.push(it);
        return;
      }
    }
  };

  if (activity === 'who') {
    const withThey = skills.they;
    const prons = skills.hs || !withThey ? ['he', 'she'] : [];
    if (withThey) prons.push('they');
    const choices = withThey ? ['he', 'she', 'they'] : ['he', 'she'];
    for (const p of deal(prons, ROUND_LENGTH)) {
      add(() => ({ ...makeItem(p === 'they' ? 'they' : 'hs', p), choices }));
    }
    return items;
  }

  const verbSkills = SKILLS.filter((s) => s.group === 'verb' && skills[s.id]).map((s) => s.id);
  if (!verbSkills.length) verbSkills.push('isare');
  const skillOrder = deal(verbSkills, ROUND_LENGTH);
  // Half singular, half plural, so the contrast is always practised.
  const prons = deal(['he', 'she', 'they', 'they'], ROUND_LENGTH);
  skillOrder.forEach((skill, i) => add(() => makeItem(skill, prons[i])));
  return items;
}
