# Ska drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

3 patterns.

## Ska1a

```js
stack(
  "[~ ~ ac ~] [~ ~ ac ~] [~ ~ ac ~] [~ ~ ac ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ska1b

```js
stack(
  "[~ ~ ac ~] [~ ~ ac ~] [~ ~ ac ~] [~ ~ ~ ~] ",
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ oh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ska1c

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [mt ~ mt ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[sd ~ sd sd] [~ ~ ~ ~] [sd ~ sd ~] [sd ~ ~ ~] ",
).s().slow(2)
```
