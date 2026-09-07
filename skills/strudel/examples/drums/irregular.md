# Irregular drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

5 patterns.

## Irregular1a

```js
stack(
  "[bd ~ bd bd] [~ ~ bd ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ ~ ~ ~] [sd ~ ~ sd]",
).s().slow(2)
```

## Irregular1b

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ bd] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ sd]",
).s().slow(2)
```

## Irregular2a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ sd] [~ ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Irregular2b

```js
stack(
  "[bd ~ bd ~] [~ ~ bd ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ sd] [~ ~ ~ ~] [sd ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Irregular3

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ bd ~]",
  "[~ sd ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [~ sd ~ ~]",
).s().slow(2)
```
