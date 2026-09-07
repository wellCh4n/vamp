# Swing drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

3 patterns.

## Swing1a

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ hh] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ sd sd] [sd sd sd sd] ",
).s().slow(2)
```

## Swing2a

```js
stack(
  "[bd bd bd ~] [bd bd bd ~] [bd ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ hh ~] ",
  "[~ ~ ~ sd] [~ ~ ~ sd] [~ sd sd ~] ",
).s().slow(2)
```

## Swing3a

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd ~] [~ bd ~ ~] ",
  "[cy ~ ~ cy] [~ ~ cy ~] [~ cy ~ ~] ",
  "[~ ~ ~ ~] [mt mt ~ ~] [~ ~ mt mt] ",
  "[oh ~ ~ oh] [~ ~ oh ~] [~ oh ~ ~] ",
  "[~ sd sd ~] [~ ~ ~ sd] [sd ~ ~ ~] ",
).s().slow(2)
```
