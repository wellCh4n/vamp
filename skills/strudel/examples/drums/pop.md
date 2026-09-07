# Pop drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

15 patterns.

## Pop1a

```js
stack(
  "[~ ~ ~ ~] [ac ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Pop1b

```js
stack(
  "[~ ~ ~ ~] [ac ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [~ ~ ~ ~] ",
).s().slow(2)
```

## Pop1c

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ lt ~] [lt ~ lt ~] [lt ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ sd ~] [sd ~ sd ~] [sd ~ sd sd] [sd ~ ~ ~] ",
).s().slow(2)
```

## Pop2a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ bd ~] [~ bd ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ sd] [~ ~ ~ ~] [sd ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Pop2b

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ac ~ ~] ",
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [bd ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ sd] [~ ~ ~ ~] [~ ~ sd ~] [~ sd ~ ~] ",
).s().slow(2)
```

## Pop2c

```js
stack(
  "[~ ~ ~ ac] [~ ~ ~ ~] [~ ac ~ ~] [~ ~ ~ ~] ",
  "[bd ~ ~ ~] [bd ~ bd ~] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [mt mt ~ ~] [~ ~ ~ ~] ",
  "[~ ~ sd sd] [~ ~ ~ ~] [~ ~ ~ ~] [sd sd sd sd] ",
).s().slow(2)
```

## Pop3a

```js
stack(
  "[~ ~ ~ ~] [bd ~ bd bd] [~ bd ~ ~] [bd ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[sd ~ ~ sd] [~ ~ ~ ~] [sd ~ ~ sd] [~ ~ ~ ~] ",
).s().slow(2)
```

## Pop3b

```js
stack(
  "[bd ~ bd bd] [~ bd ~ ~] [bd ~ bd bd] [~ bd ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Pop3c

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ac] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ mt] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[sd ~ ~ ~] [~ ~ ~ ~] [~ ~ sd sd] [~ ~ ~ ~] ",
).s().slow(2)
```

## Pop4a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Pop4b

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [bd ~ bd bd] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Pop4c

```js
stack(
  "[ac ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ac] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [sd ~ ~ ~] [sd ~ sd sd] ",
).s().slow(2)
```

## Pop5a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ bd ~] [~ bd ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ sd] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Pop5b

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ac ~ ~] ",
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [~ bd ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh hh ~ ~] ",
  "[~ ~ ~ sd] [~ ~ ~ ~] [~ ~ sd ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Pop5c

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[oh ~ ~ ~] [oh ~ ~ ~] [oh ~ ~ ~] [oh ~ ~ ~] ",
  "[~ sd sd sd] [sd ~ sd sd] [sd sd sd ~] [sd sd sd sd] ",
).s().slow(2)
```
