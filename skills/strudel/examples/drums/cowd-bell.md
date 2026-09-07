# CowdBell drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

1 patterns.

## CowdBell

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd bd] [~ ~ bd bd] [~ bd ~ bd] ",
  "[~ sd ~ sd] [sd sd ~ sd] [~ sd ~ sd] [sd sd ~ sd] ",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] ",
  "[cb ~ cb cb] [cb ~ cb cb] [cb ~ cb cb] [cb ~ cb cb] ",
).s().slow(2)
```
