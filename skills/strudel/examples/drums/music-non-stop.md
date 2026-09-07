# MusicNonStop drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

3 patterns.

## MusicNonStop1a

```js
stack(
  "[bd bd ~ ~] [~ ~ bd bd] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] ",
).s().slow(2)
```

## MusicNonStop2a

```js
stack(
  "[bd bd ~ ~] [~ ~ bd bd] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[rim rim rim ~] [~ rim ~ ~] [rim ~ ~ rim] [~ rim rim ~] ",
  "[~ hh ~ hh] [~ hh ~ hh] [~ hh ~ hh] [~ hh ~ hh] ",
  "[oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] ",
).s().slow(2)
```

## MusicNonStop2b

```js
stack(
  "[bd bd ~ ~] [~ ~ bd bd] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[rim ~ rim ~] [rim rim ~ ~] [rim ~ ~ rim] [~ rim rim rim] ",
  "[~ hh ~ hh] [~ hh ~ hh] [~ hh ~ hh] [~ hh ~ hh] ",
  "[oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] ",
).s().slow(2)
```
