# Twist drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

6 patterns.

## Twist1a

```js
stack(
  "[~ ~ ~ ~] [~ ~ ac ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Twist1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[hh ~ hh hh] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Twist1c

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [mt ~ mt ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [sd sd sd sd] ",
).s().slow(2)
```

## Twist2a

```js
stack(
  "[~ ~ ~ ~] [~ ~ ac ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ hh ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Twist2b

```js
stack(
  "[~ ~ ~ ~] [~ ~ ac ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ hh hh] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Twist2c

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [mt ~ mt ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd sd sd sd] ",
).s().slow(2)
```
