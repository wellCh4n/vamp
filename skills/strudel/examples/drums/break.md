# Break drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## Break1

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh hh hh ~] [hh ~ hh ~]",
).s().slow(2)
```

## Break2

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[hh ~ hh ~] [hh ~ hh hh] [hh ~ hh ~] [~ ~ hh ~]",
).s().slow(2)
```
