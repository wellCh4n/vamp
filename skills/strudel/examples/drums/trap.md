# Trap drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## Trap1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [bd ~ ~ ~]",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ sd ~ ~] [~ ~ ~ ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~]",
).s().slow(2)
```

## Trap1b

```js
stack(
  "[~ ~ bd ~] [bd ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ sd ~ ~] [~ ~ ~ ~]",
  "[[hh hh hh] ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [[hh hh hh] ~ hh ~]",
).s().slow(2)
```
