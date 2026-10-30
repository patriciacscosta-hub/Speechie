// Topic words that follow the calendar: festivals when they're near, otherwise the season.
// Each word: w = word, e = picture, s = syllables (for clapping), c = clue, n = no "the" before it.
import { shuffle } from './content.js';

export const THEMES = [
  {
    id: 'halloween', name: 'Halloween', art: '🎃', colours: ['#FF8A3D', '#7B4FD0'],
    intro: 'It’s nearly Halloween! Let’s learn some spooky words.',
    words: [
      { w: 'pumpkin', e: '🎃', s: 'pump-kin', c: 'It’s big, round and orange. We carve a face in it.' },
      { w: 'ghost', e: '👻', s: 'ghost', c: 'It’s white and it floats. It says boo!' },
      { w: 'bat', e: '🦇', s: 'bat', c: 'It flies at night and hangs upside down.' },
      { w: 'spider', e: '🕷️', s: 'spi-der', c: 'It has eight legs and spins a web.' },
      { w: 'witch', e: '🧙‍♀️', s: 'witch', c: 'She wears a pointy hat and flies on a broomstick.' },
      { w: 'broomstick', e: '🧹', s: 'broom-stick', c: 'You sweep the floor with it.' },
      { w: 'black cat', e: '🐈‍⬛', s: 'black-cat', c: 'A pet with dark fur that says miaow.' },
      { w: 'owl', e: '🦉', s: 'owl', c: 'A bird that says twit-twoo at night.' },
      { w: 'moon', e: '🌕', s: 'moon', c: 'It shines in the sky at night.' },
      { w: 'sweets', e: '🍬', s: 'sweets', c: 'Yummy treats in shiny wrappers.' },
      { w: 'spider web', e: '🕸️', s: 'spi-der-web', c: 'A spider makes it to catch flies.' },
      { w: 'candle', e: '🕯️', s: 'can-dle', c: 'It has a little flame and gives light.' },
    ],
  },
  {
    id: 'bonfire', name: 'Bonfire Night', art: '🎆', colours: ['#3B3486', '#FF7A59'],
    intro: 'It’s Bonfire Night! Let’s learn some sparkly words.',
    words: [
      { w: 'fireworks', e: '🎆', s: 'fire-works', c: 'They whizz up high and go bang with bright colours.' },
      { w: 'sparkler', e: '🎇', s: 'spark-ler', c: 'You hold it and it fizzes with sparkly light.' },
      { w: 'fire', e: '🔥', s: 'fire', c: 'It’s hot and orange. Don’t touch it!' },
      { w: 'wood', e: '🪵', s: 'wood', c: 'It comes from trees. We burn it on the bonfire.' },
      { w: 'gloves', e: '🧤', s: 'gloves', c: 'They keep your hands warm.' },
      { w: 'scarf', e: '🧣', s: 'scarf', c: 'It wraps round your neck to keep you cosy.' },
      { w: 'hot chocolate', e: '☕', s: 'hot-choc-o-late', c: 'A warm, sweet drink in a mug.' },
      { w: 'star', e: '⭐', s: 'star', c: 'It twinkles in the night sky.' },
      { w: 'coat', e: '🧥', s: 'coat', c: 'You wear it over your clothes when it’s cold.' },
      { w: 'apple', e: '🍎', s: 'ap-ple', c: 'A crunchy fruit. It can be red or green.' },
    ],
  },
  {
    id: 'diwali', name: 'Diwali', art: '🪔', colours: ['#FF9F1C', '#D63F7A'],
    intro: 'It’s Diwali, the festival of lights! Let’s learn some bright words.',
    words: [
      { w: 'diya', e: '🪔', s: 'di-ya', c: 'A little clay lamp we light for Diwali.' },
      { w: 'fireworks', e: '🎆', s: 'fire-works', c: 'They whizz up high and go bang with bright colours.' },
      { w: 'sparkler', e: '🎇', s: 'spark-ler', c: 'You hold it and it fizzes with sparkly light.' },
      { w: 'sweets', e: '🍬', s: 'sweets', c: 'Treats we share with family and friends.' },
      { w: 'flowers', e: '🌼', s: 'flow-ers', c: 'They grow in the garden and smell lovely.' },
      { w: 'present', e: '🎁', s: 'pre-sent', c: 'A surprise wrapped up in paper, just for you.' },
      { w: 'candle', e: '🕯️', s: 'can-dle', c: 'It has a little flame and gives light.' },
      { w: 'paint', e: '🎨', s: 'paint', c: 'Bright colours for making rangoli patterns.' },
      { w: 'star', e: '⭐', s: 'star', c: 'It twinkles in the night sky.' },
      { w: 'family', e: '👨‍👩‍👧', s: 'fam-i-ly', c: 'The people who love you and look after you.' },
    ],
  },
  {
    id: 'christmas', name: 'Christmas', art: '🎄', colours: ['#1F9D6B', '#E2483D'],
    intro: 'It’s Christmas time! Let’s learn some festive words.',
    words: [
      { w: 'Christmas tree', e: '🎄', s: 'Christ-mas-tree', c: 'We put lights and baubles on it.' },
      { w: 'Father Christmas', e: '🎅', s: 'Fa-ther-Christ-mas', c: 'He has a red suit and a big white beard.', n: true },
      { w: 'present', e: '🎁', s: 'pre-sent', c: 'A surprise wrapped up in paper, just for you.' },
      { w: 'snowman', e: '⛄', s: 'snow-man', c: 'We build him out of snow and give him a carrot nose.' },
      { w: 'reindeer', e: '🦌', s: 'rein-deer', c: 'It has antlers and pulls the sleigh.' },
      { w: 'star', e: '⭐', s: 'star', c: 'It twinkles at the very top of the tree.' },
      { w: 'bell', e: '🔔', s: 'bell', c: 'It rings: ding dong!' },
      { w: 'stocking', e: '🧦', s: 'stock-ing', c: 'A big sock we hang up on Christmas Eve.' },
      { w: 'biscuit', e: '🍪', s: 'bis-cuit', c: 'A crunchy treat. Gingerbread ones look like little people.' },
      { w: 'sleigh', e: '🛷', s: 'sleigh', c: 'Father Christmas rides it across the sky.' },
      { w: 'mince pie', e: '🥧', s: 'mince-pie', c: 'A little pie with a sweet, fruity filling.' },
    ],
  },
  {
    id: 'lunar', name: 'Chinese New Year', art: '🏮', colours: ['#E2483D', '#F2A31B'],
    intro: 'Happy Chinese New Year! Let’s learn some new words.',
    words: [
      { w: 'dragon', e: '🐉', s: 'drag-on', c: 'A long, scaly creature that dances in the parade.' },
      { w: 'lantern', e: '🏮', s: 'lan-tern', c: 'A red light that glows and hangs up high.' },
      { w: 'firecracker', e: '🧨', s: 'fire-crack-er', c: 'It goes pop and bang to welcome the new year.' },
      { w: 'red envelope', e: '🧧', s: 'red-en-ve-lope', c: 'A red packet with a gift of money inside.' },
      { w: 'noodles', e: '🍜', s: 'noo-dles', c: 'Long and slurpy! We eat them from a bowl.' },
      { w: 'dumpling', e: '🥟', s: 'dump-ling', c: 'A little parcel of dough with a filling inside.' },
      { w: 'chopsticks', e: '🥢', s: 'chop-sticks', c: 'Two sticks we use to pick up food.' },
      { w: 'drum', e: '🥁', s: 'drum', c: 'You bang it to make a boom boom sound.' },
      { w: 'orange', e: '🍊', s: 'or-ange', c: 'A round, juicy fruit with a peel.' },
    ],
  },
  {
    id: 'easter', name: 'Easter', art: '🐣', colours: ['#F27BA8', '#7CC46A'],
    intro: 'It’s Easter! Let’s learn some springtime words.',
    words: [
      { w: 'egg', e: '🥚', s: 'egg', c: 'A hen lays it. It has a shell.' },
      { w: 'chocolate', e: '🍫', s: 'choc-late', c: 'A sweet brown treat. Easter eggs can be made of it.' },
      { w: 'bunny', e: '🐰', s: 'bun-ny', c: 'A fluffy animal with long ears that hops.' },
      { w: 'chick', e: '🐣', s: 'chick', c: 'A baby chicken that hatches from an egg.' },
      { w: 'basket', e: '🧺', s: 'bas-ket', c: 'We carry it on an egg hunt.' },
      { w: 'lamb', e: '🐑', s: 'lamb', c: 'A baby sheep that says baa.' },
      { w: 'tulip', e: '🌷', s: 'tu-lip', c: 'A spring flower shaped like a cup.' },
      { w: 'carrot', e: '🥕', s: 'car-rot', c: 'An orange vegetable that rabbits love.' },
      { w: 'nest', e: '🪺', s: 'nest', c: 'A bird builds it to keep its eggs safe.' },
      { w: 'butterfly', e: '🦋', s: 'but-ter-fly', c: 'It has beautiful wings and flutters by.' },
    ],
  },
  {
    id: 'school', name: 'Back to school', art: '🎒', colours: ['#4AA8FF', '#22B5A0'],
    intro: 'It’s back to school time! Let’s learn some school words.',
    words: [
      { w: 'school bag', e: '🎒', s: 'school-bag', c: 'You carry your books in it.' },
      { w: 'pencil', e: '✏️', s: 'pen-cil', c: 'You write and draw with it.' },
      { w: 'book', e: '📚', s: 'book', c: 'It has pages and a story inside.' },
      { w: 'crayon', e: '🖍️', s: 'cray-on', c: 'A colourful stick for drawing.' },
      { w: 'scissors', e: '✂️', s: 'scis-sors', c: 'We use them to cut paper.' },
      { w: 'ruler', e: '📏', s: 'ru-ler', c: 'A long, straight stick for measuring.' },
      { w: 'teacher', e: '🧑‍🏫', s: 'teach-er', c: 'The grown-up who helps you learn at school.' },
      { w: 'bus', e: '🚌', s: 'bus', c: 'A big vehicle that carries lots of people.' },
      { w: 'clock', e: '🕰️', s: 'clock', c: 'It tells us the time. Tick tock!' },
      { w: 'paint', e: '🎨', s: 'paint', c: 'Bright colours for making pictures.' },
    ],
  },
  {
    id: 'winter', name: 'Winter', art: '❄️', colours: ['#4AA8FF', '#8F7CFF'],
    intro: 'Brrr, it’s winter! Let’s learn some chilly words.',
    words: [
      { w: 'snowflake', e: '❄️', s: 'snow-flake', c: 'It falls from the sky. It’s cold and white.' },
      { w: 'snowman', e: '⛄', s: 'snow-man', c: 'We build him out of snow and give him a carrot nose.' },
      { w: 'scarf', e: '🧣', s: 'scarf', c: 'It wraps round your neck to keep you cosy.' },
      { w: 'gloves', e: '🧤', s: 'gloves', c: 'They keep your hands warm.' },
      { w: 'coat', e: '🧥', s: 'coat', c: 'You wear it over your clothes when it’s cold.' },
      { w: 'boots', e: '🥾', s: 'boots', c: 'You wear them on your feet to stomp through snow.' },
      { w: 'sledge', e: '🛷', s: 'sledge', c: 'You sit on it and slide down a snowy hill.' },
      { w: 'penguin', e: '🐧', s: 'pen-guin', c: 'A black and white bird that can’t fly but loves to swim.' },
      { w: 'polar bear', e: '🐻‍❄️', s: 'po-lar-bear', c: 'A big white bear that lives where it’s icy.' },
      { w: 'ice skates', e: '⛸️', s: 'ice-skates', c: 'Boots with blades for gliding on ice.' },
      { w: 'hot chocolate', e: '☕', s: 'hot-choc-o-late', c: 'A warm, sweet drink in a mug.' },
    ],
  },
  {
    id: 'spring', name: 'Spring', art: '🌷', colours: ['#7CC46A', '#4AA8FF'],
    intro: 'It’s spring! Let’s learn some words about things that grow.',
    words: [
      { w: 'flower', e: '🌷', s: 'flow-er', c: 'It grows in the garden and smells lovely.' },
      { w: 'butterfly', e: '🦋', s: 'but-ter-fly', c: 'It has beautiful wings and flutters by.' },
      { w: 'bee', e: '🐝', s: 'bee', c: 'It buzzes and makes honey.' },
      { w: 'ladybird', e: '🐞', s: 'la-dy-bird', c: 'A little red bug with black spots.' },
      { w: 'umbrella', e: '☂️', s: 'um-brel-la', c: 'It keeps you dry when it rains.' },
      { w: 'rainbow', e: '🌈', s: 'rain-bow', c: 'Lots of colours in the sky after the rain.' },
      { w: 'duck', e: '🦆', s: 'duck', c: 'It swims on the pond and says quack.' },
      { w: 'frog', e: '🐸', s: 'frog', c: 'It’s green and it hops. It says ribbit.' },
      { w: 'snail', e: '🐌', s: 'snail', c: 'It’s slow and carries its house on its back.' },
      { w: 'worm', e: '🪱', s: 'worm', c: 'It wriggles about in the soil.' },
    ],
  },
  {
    id: 'summer', name: 'Summer', art: '☀️', colours: ['#FFB020', '#22B5A0'],
    intro: 'It’s summer! Let’s learn some sunny words.',
    words: [
      { w: 'sun', e: '☀️', s: 'sun', c: 'It shines brightly and keeps us warm.' },
      { w: 'ice cream', e: '🍦', s: 'ice-cream', c: 'A cold treat on a cone.' },
      { w: 'bucket', e: '🪣', s: 'buck-et', c: 'We fill it with sand to build castles.' },
      { w: 'sunglasses', e: '🕶️', s: 'sun-glass-es', c: 'They keep the bright sun out of your eyes.' },
      { w: 'crab', e: '🦀', s: 'crab', c: 'It walks sideways and has big claws.' },
      { w: 'shell', e: '🐚', s: 'shell', c: 'You find it on the beach.' },
      { w: 'watermelon', e: '🍉', s: 'wa-ter-mel-on', c: 'A big fruit, green outside and pink inside.' },
      { w: 'boat', e: '⛵', s: 'boat', c: 'It floats on the water.' },
      { w: 'kite', e: '🪁', s: 'kite', c: 'It flies in the sky on a long string.' },
      { w: 'fish', e: '🐠', s: 'fish', c: 'It swims in the sea and has fins.' },
    ],
  },
  {
    id: 'autumn', name: 'Autumn', art: '🍂', colours: ['#E8833A', '#B5651D'],
    intro: 'It’s autumn! Let’s learn some crunchy words.',
    words: [
      { w: 'leaf', e: '🍂', s: 'leaf', c: 'It falls from the trees and goes crunch.' },
      { w: 'conker', e: '🌰', s: 'con-ker', c: 'A shiny brown nut from a horse chestnut tree.' },
      { w: 'mushroom', e: '🍄', s: 'mush-room', c: 'It grows on the ground in the woods.' },
      { w: 'squirrel', e: '🐿️', s: 'squir-rel', c: 'It has a bushy tail and hides nuts.' },
      { w: 'hedgehog', e: '🦔', s: 'hedge-hog', c: 'A small animal covered in prickles.' },
      { w: 'apple', e: '🍎', s: 'ap-ple', c: 'A crunchy fruit. It can be red or green.' },
      { w: 'umbrella', e: '☂️', s: 'um-brel-la', c: 'It keeps you dry when it rains.' },
      { w: 'wellies', e: '🥾', s: 'wel-lies', c: 'Boots for jumping in muddy puddles.' },
      { w: 'owl', e: '🦉', s: 'owl', c: 'A bird that says twit-twoo at night.' },
      { w: 'tractor', e: '🚜', s: 'trac-tor', c: 'A big farm machine with huge wheels.' },
    ],
  },
];

const byId = (id) => THEMES.find((t) => t.id === id);

// Easter Sunday (Gregorian calendar).
function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  return new Date(y, month - 1, ((h + l - 7 * m + 114) % 31) + 1);
}

// These move each year. After 2030 they're simply skipped and the season shows instead.
const LUNAR = { 2026: [1, 17], 2027: [1, 6], 2028: [0, 26], 2029: [1, 13], 2030: [1, 3] };
const DIWALI = { 2026: [10, 8], 2027: [9, 29], 2028: [9, 17], 2029: [10, 5], 2030: [9, 26] };
const on = (table) => (y) => (table[y] ? new Date(y, ...table[y]) : null);

// [theme, date of the day itself, days shown before, days shown after]
const FESTIVALS = [
  ['school', (y) => new Date(y, 8, 1), 0, 13],
  ['halloween', (y) => new Date(y, 9, 31), 21, 0],
  ['bonfire', (y) => new Date(y, 10, 5), 4, 3],
  ['diwali', on(DIWALI), 7, 3],
  ['christmas', (y) => new Date(y, 11, 25), 24, 6],
  ['lunar', on(LUNAR), 10, 7],
  ['easter', easter, 14, 7],
];

const SEASONS = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];

// The theme for a date: the nearest festival in range, otherwise the season.
export function themeFor(date = new Date()) {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  let best = null;
  for (const [id, when, before, after] of FESTIVALS) {
    const d = when(today.getFullYear());
    if (!d) continue;
    const diff = Math.round((d - today) / 864e5); // days until the festival
    if (diff <= before && -diff <= after && (!best || Math.abs(diff) < best.gap)) best = { id, gap: Math.abs(diff) };
  }
  return byId(best ? best.id : SEASONS[today.getMonth()]);
}

// choice: 'auto' or a theme id picked by a grown-up.
export const currentTheme = (choice = 'auto') => (choice !== 'auto' && byId(choice)) || themeFor();

export const the = (word) => (word.n ? word.w : `the ${word.w}`);

// A round mixes three games: find the picture, guess from a clue, and say the word.
export function makeWordRound(theme, length = 6) {
  const words = shuffle(theme.words);
  return Array.from({ length }, (_, k) => {
    const word = words[k % words.length];
    const others = shuffle(theme.words.filter((x) => x.w !== word.w)).slice(0, 3);
    return { type: ['find', 'guess', 'say'][k % 3], word, options: shuffle([word, ...others]) };
  });
}

