# Breakbeat drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

3 patterns.

## Breakbeat1

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Breakbeat2

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Breakbeat3

```js
stack(
  "[bd ~ bd ~] [~ ~ bd ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ sd ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```
