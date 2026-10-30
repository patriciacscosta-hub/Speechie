# Speechie

A playful speech and language practice app for primary school children, used together with a grown-up at home. Designed for iPad first.

Version 1 focuses on **pronouns** (he / she / they) and **matching verbs** (she has / they have, he is / they are, she plays / they play, he was / they were).

## The games

| Game | What the child does |
| --- | --- |
| **Who is it?** | Looks at the picture and picks He, She or They. |
| **Pick the word** | Chooses the word that fits, e.g. *She ___ a cat* → has / have. A wrong choice is gently modelled the right way. |
| **Build it** | Taps colour-coded tiles into Who → Doing → What slots. |
| **Say it** | Hears the sentence, records their own try, plays it back. The grown-up taps *Got it / Nearly / Try again*. |

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
js/art.js             Pip the mascot and icons
sw.js                 offline support
manifest.webmanifest  home-screen app details
```

Speechie is a practice tool for home. It doesn't replace advice from a speech and language therapist.
