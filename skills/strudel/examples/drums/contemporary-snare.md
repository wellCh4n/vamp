# ContemporarySnare drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

6 patterns.

## ContemporarySnare1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ sd ~ ~] [~ ~ sd ~]",
).s().slow(2)
```

## ContemporarySnare1b

```js
stack(
  "[~ ~ bd ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [~ ~ sd ~] [~ sd ~ ~] [~ sd ~ ~]",
).s().slow(2)
```

## ContemporarySnare2a

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## ContemporarySnare2b

```js
stack(
  "[~ ~ bd ~] [~ ~ ~ ~] [~ ~ bd bd] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ sd ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## ContemporarySnare3a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ bd ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [~ sd ~ sd]",
).s().slow(2)
```

## ContemporarySnare3b

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ bd ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [~ ~ ~ ~]",
).s().slow(2)
```
