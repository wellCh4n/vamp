# Ballad drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

15 个鼓型。

## Ballad1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ballad1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ballad1c

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ac] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [lt lt lt lt] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [mt mt mt ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ sd sd] [~ ~ ~ ~] [~ ~ ~ ~] ",
).s().slow(2)
```

## Ballad2a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh hh ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ oh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ballad2b

```js
stack(
  "[bd bd ~ ~] [~ ~ ~ bd] [bd ~ bd ~] [~ bd ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ballad2c

```js
stack(
  "[~ ~ ~ ~] [ac ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [lt lt lt lt] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [mt ~ mt ~] [~ ~ ~ ~] ",
  "[~ ~ sd sd] [sd ~ sd ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
).s().slow(2)
```

## Ballad3a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] [~ oh ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd sd] ",
).s().slow(2)
```

## Ballad3b

```js
stack(
  "[bd bd ~ ~] [~ ~ bd bd] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ballad3c

```js
stack(
  "[bd ~ ~ ~] [bd bd ~ ~] [bd bd ~ ~] [bd bd ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ht ht] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ lt lt] [~ ~ ~ ~] ",
  "[~ ~ sd sd] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ sd sd] ",
).s().slow(2)
```

## Ballad4a

```js
stack(
  "[ac ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ bd ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ballad4b

```js
stack(
  "[ac ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ballad4c

```js
stack(
  "[~ ~ ~ ~] [~ ac ~ ~] [~ ~ ~ ~] [~ ac ~ ~] ",
  "[bd ~ ~ ~] [~ bd ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ hh ~ ~] [hh ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ mt mt ~] [~ ~ ~ ~] [~ ~ mt ~] [mt mt ~ ~] ",
  "[~ ~ ~ sd] [sd ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
).s().slow(2)
```

## Ballad5a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ bd] ",
  "[hh hh hh hh] [hh hh hh ~] [hh hh hh hh] [hh hh hh ~] ",
  "[~ ~ ~ ~] [~ ~ ~ oh] [~ ~ ~ ~] [~ ~ ~ oh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ballad5b

```js
stack(
  "[bd bd ~ ~] [~ ~ ~ bd] [~ ~ bd ~] [~ bd ~ ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Ballad5c

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[hh hh hh hh] [hh hh hh ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [ht ht ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ lt lt] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ mt mt] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ oh] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [sd sd ~ ~] [~ ~ ~ ~] ",
).s().slow(2)
```
