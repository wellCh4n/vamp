# TakeMeToMardiGras drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## TakeMeToMardiGras

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ bd ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh hh] [hh ~ hh ~] [hh ~ hh hh] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[cp ~ cp ~] [~ cp ~ ~] [~ cp ~ ~] [cp ~ ~ ~] ",
  "[~ ~ ~ ~] [cy ~ ~ cy] [~ ~ cy ~] [~ cy ~ cy] ",
).s().slow(2)
```

## TakeMeToMardiGrasAlt

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ sd ~ ~] [sd ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ hh hh] [hh ~ hh ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ oh ~] ",
  "[cp ~ cp ~] [~ cp ~ ~] [~ cp ~ ~] [cp ~ ~ ~] ",
  "[~ ~ ~ ~] [cy ~ ~ cy] [~ ~ cy ~] [~ cy ~ cy] ",
).s().slow(2)
```
