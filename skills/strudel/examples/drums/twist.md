# Twist drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

6 个鼓型。

## Twist1a

```js
stack(
  "[~ ~ ~ ~] [~ ~ ac ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Twist1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[hh ~ hh hh] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Twist1c

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [mt ~ mt ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [sd sd sd sd] ",
).s().slow(2)
```

## Twist2a

```js
stack(
  "[~ ~ ~ ~] [~ ~ ac ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ hh ~] [hh ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Twist2b

```js
stack(
  "[~ ~ ~ ~] [~ ~ ac ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[hh ~ hh hh] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Twist2c

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [mt ~ mt ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ sd ~] [~ ~ ~ ~] [sd sd sd sd] ",
).s().slow(2)
```
