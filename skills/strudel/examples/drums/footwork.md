# Footwork drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## Footwork1

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd ~] [bd ~ ~ bd] [~ ~ bd ~]",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~]",
  "[~ ~ hh ~] [~ ~ ~ ~] [~ ~ hh ~] [~ ~ ~ ~]",
  "[rim rim rim rim] [rim rim rim rim] [rim rim rim rim] [rim rim rim rim]",
).s().slow(2)
```

## Footwork2

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd ~] [bd ~ ~ bd] [~ ~ bd ~]",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~]",
  "[~ ~ hh ~] [~ ~ ~ hh] [hh ~ hh ~] [~ ~ hh ~]",
  "[rim rim rim rim] [rim rim rim rim] [rim rim rim rim] [rim rim rim rim]",
).s().slow(2)
```
