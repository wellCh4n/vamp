# RNB drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

15 个鼓型。

## RNB1a

```js
stack(
  "[bd ~ bd ~] [~ ~ bd ~] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ sd] ",
).s().slow(2)
```

## RNB1b

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [bd ~ bd bd] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ sd ~ ~] [sd ~ ~ sd] ",
).s().slow(2)
```

## RNB1c

```js
stack(
  "[~ ~ ~ ~] [lt ~ ~ ~] [~ ~ lt ~] [~ ~ ~ ~] ",
  "[~ ~ mt ~] [~ ~ ~ ~] [mt ~ ~ ~] [~ ~ ~ ~] ",
  "[sd sd ~ sd] [~ sd sd sd] [~ sd ~ sd] [sd sd sd sd] ",
).s().slow(2)
```

## RNB2a

```js
stack(
  "[bd ~ bd ~] [~ bd ~ bd] [~ ~ bd bd] [~ bd ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## RNB2b

```js
stack(
  "[~ ~ ~ bd] [~ bd bd ~] [~ bd ~ bd] [~ bd bd ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[sd ~ ~ ~] [sd ~ ~ ~] [sd ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## RNB2c

```js
stack(
  "[~ ~ bd bd] [~ ~ bd bd] [~ ~ bd bd] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [lt lt ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [mt mt ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[sd sd ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [sd sd sd sd] ",
).s().slow(2)
```

## RNB3a

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ bd] [~ bd ~ bd] [~ bd ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## RNB3b

```js
stack(
  "[bd ~ bd bd] [~ ~ ~ ~] [bd ~ ~ bd] [~ ~ ~ ~] ",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] ",
  "[~ ~ ~ ~] [sd ~ sd sd] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## RNB3c

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ bd] [~ ~ ~ ~] [~ ~ ~ bd] ",
  "[hh ~ ~ hh] [hh ~ ~ hh] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [ht ht ~ ~] ",
  "[~ ~ ~ ~] [~ lt ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ sd ~] [~ ~ ~ ~] [sd ~ sd sd] [~ ~ sd ~] ",
).s().slow(2)
```

## RNB4a

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [bd ~ bd bd] [~ ~ ~ ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ sd ~ ~] [sd ~ ~ sd] ",
).s().slow(2)
```

## RNB4b

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh hh ~ hh] [hh hh ~ hh] [hh hh ~ hh] [hh hh ~ hh] ",
  "[~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ sd] ",
).s().slow(2)
```

## RNB4c

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ ~] [~ bd ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ hh] [~ ~ ~ ~] [~ ~ hh ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ mt mt] [mt ~ ~ ~] [mt ~ mt mt] ",
  "[~ sd sd ~] [sd ~ ~ ~] [~ ~ sd ~] [~ ~ ~ ~] ",
).s().slow(2)
```

## RNB5a

```js
stack(
  "[bd ~ ~ ~] [bd bd ~ bd] [bd ~ bd ~] [bd bd ~ bd] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ sd ~] [~ ~ sd ~] [~ ~ ~ sd] [~ ~ sd ~] ",
).s().slow(2)
```

## RNB5b

```js
stack(
  "[bd ~ bd bd] [~ ~ ~ bd] [bd ~ bd bd] [~ bd ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## RNB5c

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ bd] [~ ~ ~ bd] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [lt lt lt ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [mt mt mt ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ sd sd ~] [~ ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```
