# Jungle drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

4 patterns.

## Jungle

```js
stack(
  "[bd ~ ~ ~] [~ bd ~ ~] [bd ~ ~ bd] [~ ~ ~ ~] ",
  "[~ ~ sd ~] [~ ~ sd ~] [~ sd ~ ~] [~ sd ~ sd] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[~ ~ ~ oh] [~ ~ oh ~] [~ ~ ~ oh] [~ ~ oh ~] ",
).s().slow(2)
```

## Jungle1a

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ sd ~ ~] [~ ~ sd ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh hh]",
  "[oh ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
).s().slow(2)
```

## Jungle1b

```js
stack(
  "[~ bd bd ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ sd ~ ~] [sd ~ ~ sd] [~ sd ~ ~] [~ ~ sd ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh hh]",
).s().slow(2)
```

## JungleAlt

```js
stack(
  "[bd ~ ~ ~] [~ bd ~ ~] [bd ~ ~ ~] [~ bd ~ ~] ",
  "[~ ~ sd ~] [~ ~ sd ~] [~ ~ sd ~] [~ ~ sd ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[~ ~ ~ ~] [~ ~ oh ~] [~ ~ ~ ~] [~ ~ oh ~] ",
).s().slow(2)
```
