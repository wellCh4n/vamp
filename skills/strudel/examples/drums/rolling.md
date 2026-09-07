# Rolling drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

18 patterns.

## Rolling1

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling10

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [~ ~ ~ bd] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling11

```js
stack(
  "[bd ~ ~ ~] [~ bd bd ~] [~ bd bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling2

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ bd ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling3a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [bd ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [~ ~ ~ ~]",
).s().slow(2)
```

## Rolling3b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [bd ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [~ ~ sd ~]",
).s().slow(2)
```

## Rolling4a

```js
stack(
  "[bd bd ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling4b

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [~ bd bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling5a

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling5b

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling6a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ bd] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling7a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [bd ~ ~ bd] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling7b

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ bd] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling7c

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling7d

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ bd] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling8

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling9a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Rolling9b

```js
stack(
  "[bd bd ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```
