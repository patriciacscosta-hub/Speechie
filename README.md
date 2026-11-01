# Speechie

A playful speech and language practice app for primary school children, used together with a grown-up at home. Designed for iPad first.

Version 1 focuses on **pronouns** (he / she / they) and **matching verbs** (she has / they have, he is / they are, she plays / they play, he was / they were).

## The games

The big **Let’s practise** button on the home screen plays a short mix of the games below, so children can press one button and go. Games can also be chosen one by one. During a game, the home button must be pressed and held to leave, so it can’t be tapped by accident.


| Game | What the child does |
| --- | --- |
| **Who is it?** | Looks at the picture and picks He, She or They. |
| **Pick the word** | Chooses the word that fits, e.g. *She ___ a cat* → has / have. A wrong choice is gently modelled the right way. |
| **Build it** | Taps colour-coded tiles into Who → Doing → What slots. |
| **Say it** | Hears the sentence, records their own try, plays it back. The grown-up taps *Got it / Nearly / Try again*. |

**Seasonal words** (the wide banner on the home screen) teaches topic vocabulary that follows the calendar: Halloween, Bonfire Night, Diwali, Christmas, Chinese New Year, Easter and back to school when they're near, otherwise the season. Each round mixes *find the picture*, *guess from a clue* and *say the word*, and shows each word split into claps (syllables). Grown-ups can pick a topic by hand in Settings. Festival dates that move each year are listed up to 2030 in `js/themes.js`.

**More games** (on the home screen) has four more grammar games: *One or lots?* (plurals), *Where is it?* (in / on / under), *Yesterday* (past tense with -ed) and *Who, what, where?* (question words). Grown-ups can switch each one on or off under Skills.

**Word of the day:** a topic word on the home screen that changes daily. Tap it to hear it and clap it.

**My stars:** a calendar with a star for every day your child finishes a round, and how many days in a row. Practising on more days unlocks things for Pip to wear (a bow, cap, top hat, flower, graduation hat and crown).

**Pictures:** action sentences show picture-book scenes of two characters, Meg (*she*), Ben (*he*) or both (*they*), drawn in code so there are no image files to download. Some actions move (kicking, drumming, rain). Sentences without a drawn scene yet still use emoji.

Each round is 6 turns and ends with a sticker for the sticker book. All instructions are spoken aloud, so children don't need to read.

## Play timer

A time-left pie shows on the home and game screens. When time runs out, your child finishes the turn they're on and Speechie says it's time for a break. Grown-ups can press and hold the lock to add 5 or 10 minutes. Time in the grown-ups area doesn't count, and the Progress tab shows minutes played each day.

## Grown-ups area

Press and hold the lock on the home screen to open it.

- **Progress:** accuracy per skill, practice days, Say it ratings.
- **Skills:** switch skills on and off as your child gets more confident.
- **Settings:** daily play time (10 minutes by default), text size, volume, British English voice and speed, sound effects, name and buddy.
- **Tips:** simple ways to help at home.

## Privacy

Everything is stored on the device (browser storage). There are no accounts, nothing is uploaded, and recordings are never saved.

## Running it

No build step is needed: it's plain HTML, CSS and JavaScript.

- **Locally:** `python3 -m http.server 8642`, then open http://localhost:8642
- **Online:** published with GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).
- **On iPad:** open the site in Safari → Share → **Add to Home Screen**. It then opens full screen and works offline.

When you change app files, bump `VERSION` in `sw.js` so installed copies update.

## Project layout

```
index.html            page shell
styles.css            all styling
js/app.js             screens and games
js/content.js         skills, pictures and sentence generator
js/audio.js           speech, recording, sound effects
js/store.js           progress saved on the device
js/timer.js           daily play timer
js/themes.js          seasonal topic words and calendar
js/grammar.js         plurals, in/on/under, past tense, question words
js/scenes.js          picture-book scenes of Meg (she) and Ben (he), drawn in code
js/art.js             Pip the mascot and icons
sw.js                 offline support
manifest.webmanifest  home-screen app details
```

Speechie is a practice tool for home. It doesn't replace advice from a speech and language therapist.
