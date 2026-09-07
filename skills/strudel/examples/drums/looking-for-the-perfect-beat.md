# LookingForThePerfectBeat drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## LookingForThePerfectBeat1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [bd ~ bd ~] [~ bd ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[rim rim rim rim] [rim rim ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [cp ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~] ",
  "[cb ~ cb ~] [~ cb ~ cb] [~ ~ ~ cb] [~ ~ cb ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
).s().slow(2)
```

## LookingForThePerfectBeat1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [sd ~ sd sd] ",
  "[rim rim rim rim] [rim rim ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [cp ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~] ",
  "[cb ~ cb ~] [~ cb ~ cb] [~ ~ ~ cb] [~ ~ cb ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
).s().slow(2)
```
