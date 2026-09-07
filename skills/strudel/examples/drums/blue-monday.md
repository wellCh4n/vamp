# BlueMonday drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## BlueMonday1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[~ ~ ~ ~] [cp ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~] ",
  "[~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] ",
).s().slow(2)
```

## BlueMonday2a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[~ ~ ~ ~] [cp ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~] ",
  "[hh ~ ~ hh] [hh ~ ~ hh] [hh ~ ~ hh] [hh ~ ~ hh] ",
  "[~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] ",
).s().slow(2)
```
