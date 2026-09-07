# Dnb drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

6 patterns.

## Dnb1a

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ bd] [~ bd bd ~] [~ ~ ~ bd]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~]",
).s().slow(2)
```

## Dnb1b

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ bd] [bd bd bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~]",
).s().slow(2)
```

## Dnb2a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ bd] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh hh]",
).s().slow(2)
```

## Dnb3

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh]",
  "[~ ~ ~ ~] [~ ~ oh oh] [oh oh ~ ~] [~ ~ ~ ~]",
).s().slow(2)
```

## Dnb4a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [sd ~ ~ ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh hh]",
  "[oh ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
).s().slow(2)
```

## Dnb4b

```js
stack(
  "[~ ~ ~ ~] [bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh hh]",
  "[oh ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
).s().slow(2)
```
