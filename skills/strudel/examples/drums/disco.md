# Disco drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

15 个鼓型。

## Disco1a

```js
stack(
  "[ac ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco1b

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh hh ~ hh] [hh hh ~ hh] [hh ~ hh hh] [hh hh ~ hh] ",
  "[~ ~ oh ~] [~ ~ oh ~] [~ oh ~ ~] [~ ~ oh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ sd] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco1c

```js
stack(
  "[~ ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh hh ~ hh] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [lt ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ mt ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ oh ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd sd ~ sd] [~ sd sd sd] [sd sd ~ ~] ",
).s().slow(2)
```

## Disco2a

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] ",
  "[~ ~ hh ~] [~ ~ hh ~] [~ ~ hh ~] [~ ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco2b

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] ",
  "[hh ~ hh hh] [~ ~ hh hh] [~ ~ hh hh] [~ ~ hh hh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco2c

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh hh hh ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ sd] [sd ~ sd ~] [sd ~ sd ~] [sd sd sd ~] ",
).s().slow(2)
```

## Disco3a

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[~ ~ hh hh] [~ ~ hh hh] [~ ~ hh hh] [~ ~ hh hh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco3b

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco3c

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [cb ~ cb cb] ",
  "[hh hh hh hh] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [mt ~ ~ mt] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ sd sd] [~ sd sd ~] [~ ~ ~ ~] ",
).s().slow(2)
```

## Disco4a

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh hh hh ~] [~ hh hh ~] [hh hh hh ~] [~ hh hh ~] ",
  "[~ ~ ~ oh] [~ ~ ~ oh] [~ ~ ~ oh] [~ ~ ~ oh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco4b

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ bd] [bd ~ ~ ~] ",
  "[hh hh hh ~] [~ hh hh ~] [hh hh hh ~] [~ hh hh ~] ",
  "[~ ~ ~ oh] [~ ~ ~ oh] [~ ~ ~ ~] [~ ~ ~ oh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ sd] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco4c

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh hh ~ ~] [~ hh ~ ~] [~ hh ~ ~] [~ hh ~ ~] ",
  "[~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] ",
  "[~ ~ ~ sd] [sd ~ ~ sd] [sd ~ ~ sd] [sd ~ ~ sd] ",
).s().slow(2)
```

## Disco5a

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh hh ~ ~] [~ hh ~ hh] [hh hh ~ ~] [~ hh ~ hh] ",
  "[~ ~ oh oh] [~ ~ oh ~] [~ ~ oh oh] [~ ~ oh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco5b

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh hh hh ~] [~ hh hh hh] [hh hh hh hh] [~ hh hh ~] ",
  "[~ ~ ~ oh] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ oh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Disco5c

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh hh ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [lt lt lt lt] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [mt mt mt mt] [~ ~ ~ ~] ",
  "[~ ~ oh oh] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd sd sd sd] [~ ~ ~ ~] [~ ~ ~ ~] ",
).s().slow(2)
```
