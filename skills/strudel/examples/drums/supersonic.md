# Supersonic drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

4 patterns.

## Supersonic1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] ",
).s().slow(2)
```

## Supersonic1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ bd ~] [~ bd ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] ",
).s().slow(2)
```

## Supersonic2a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[cb ~ cb cb] [cb ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[rim rim rim rim] [rim rim rim rim] [rim rim rim rim] [rim rim rim rim] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
).s().slow(2)
```

## Supersonic2b

```js
stack(
  "[bd ~ bd ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [sd ~ ~ ~] ",
  "[cb ~ cb cb] [cb ~ cb ~] [cb ~ ~ ~] [~ ~ ~ ~] ",
  "[rim rim rim rim] [rim rim rim rim] [rim rim rim rim] [rim rim rim rim] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
).s().slow(2)
```
