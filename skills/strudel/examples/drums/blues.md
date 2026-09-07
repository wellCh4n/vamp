# Blues drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## Blues1a

```js
stack(
  "[bd bd bd bd] [bd bd bd bd] [bd ~ ~ ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh ~ ~ ~] ",
  "[sd sd sd sd] [sd sd sd sd] [sd sd sd sd] ",
).s().slow(2)
```

## Blues2a

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd ~] [~ bd ~ ~] ",
  "[hh ~ ~ hh] [~ ~ hh ~] [~ hh ~ ~] ",
  "[~ sd sd ~] [sd sd ~ sd] [sd ~ sd sd] ",
).s().slow(2)
```
