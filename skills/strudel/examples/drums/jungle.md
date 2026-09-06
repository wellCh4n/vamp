# Jungle drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

4 个鼓型。

## Jungle

```js
stack(
  "[bd ~ ~ ~] [~ bd ~ ~] [bd ~ ~ bd] [~ ~ ~ ~] ",
  "[~ ~ sd ~] [~ ~ sd ~] [~ sd ~ ~] [~ sd ~ sd] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[~ ~ ~ oh] [~ ~ oh ~] [~ ~ ~ oh] [~ ~ oh ~] ",
).s().slow(2)
```

## Jungle1a

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ sd ~ ~] [~ ~ sd ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh hh]",
  "[oh ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
).s().slow(2)
```

## Jungle1b

```js
stack(
  "[~ bd bd ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ sd ~ ~] [sd ~ ~ sd] [~ sd ~ ~] [~ ~ sd ~]",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh hh]",
).s().slow(2)
```

## JungleAlt

```js
stack(
  "[bd ~ ~ ~] [~ bd ~ ~] [bd ~ ~ ~] [~ bd ~ ~] ",
  "[~ ~ sd ~] [~ ~ sd ~] [~ ~ sd ~] [~ ~ sd ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[~ ~ ~ ~] [~ ~ oh ~] [~ ~ ~ ~] [~ ~ oh ~] ",
).s().slow(2)
```
