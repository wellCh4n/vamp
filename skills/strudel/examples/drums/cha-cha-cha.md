# ChaChaCha drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

3 patterns.

## ChaChaCha1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] ",
  "[~ ~ ~ ~] [hh ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ht ~] [~ ~ ht ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [lt ~ lt ~] ",
).s().slow(2)
```

## ChaChaCha1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] ",
  "[~ ~ ~ ~] [hh ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ht ht] [~ ~ ~ ~] [~ ~ ht ht] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ lt lt] [~ ~ ~ ~] [~ ~ lt ~] ",
).s().slow(2)
```

## ChaChaCha1c

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ht ~] [~ ~ ~ ~] [ht ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [lt ~ lt ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```
