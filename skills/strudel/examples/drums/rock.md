# Rock drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

15 个鼓型。

## Rock1a

```js
stack(
  "[~ ~ ~ ~] [ac ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ bd ~] [~ ~ bd ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock1c

```js
stack(
  "[ac ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ac] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ht] [ht ~ ~ ht] [ht ~ ~ ht] [~ ~ ~ ~] ",
  "[~ ~ sd ~] [~ ~ sd ~] [~ ~ sd ~] [sd sd sd sd] ",
).s().slow(2)
```

## Rock2a

```js
stack(
  "[ac ~ ac ~] [ac ~ ac ~] [ac ~ ac ~] [ac ~ ac ~] ",
  "[bd ~ bd ~] [~ bd ~ ~] [bd ~ ~ ~] [~ ~ ~ bd] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ oh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock2b

```js
stack(
  "[bd ~ bd ~] [~ bd ~ ~] [bd ~ ~ ~] [~ ~ ~ bd] ",
  "[hh hh hh hh] [hh hh hh ~] [hh hh hh hh] [hh hh hh ~] ",
  "[~ ~ ~ ~] [~ ~ ~ oh] [~ ~ ~ ~] [~ ~ ~ oh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ sd ~] ",
).s().slow(2)
```

## Rock2c

```js
stack(
  "[bd ~ bd ~] [~ bd ~ ~] [bd ~ bd ~] [bd ~ bd ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [cy ~ cy ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [lt lt lt lt] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [mt mt mt mt] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[sd sd sd sd] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
).s().slow(2)
```

## Rock3a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ bd ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock3b

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock3c

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] ",
  "[~ ~ sd ~] [~ ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock4a

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock4b

```js
stack(
  "[~ ~ ~ ~] [ac ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[sd ~ ~ ~] [sd ~ ~ ~] [sd ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock4c

```js
stack(
  "[ac ~ ~ ac] [ac ~ ~ ac] [ac ~ ~ ac] [ac ~ ~ ac] ",
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] ",
  "[sd sd sd sd] [sd sd sd sd] [sd sd sd sd] [sd sd sd sd] ",
).s().slow(2)
```

## Rock5a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock5b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Rock5c

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ac] [~ ~ ac ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ ~ sd ~] [sd ~ ~ ~] ",
).s().slow(2)
```
