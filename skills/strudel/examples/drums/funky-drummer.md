# FunkyDrummer drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

2 个鼓型。

## FunkyDrummer

```js
stack(
  "[bd ~ bd ~] [~ ~ bd ~] [~ ~ bd ~] [~ bd ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ sd ~ sd] [sd ~ ~ sd] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
).s().slow(2)
```

## FunkyDrummerAlt

```js
stack(
  "[bd ~ bd ~] [~ ~ bd ~] [~ ~ bd ~] [~ bd ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ sd ~ sd] [sd ~ ~ sd] ",
  "[hh hh hh hh] [hh hh hh ~] [hh hh hh hh] [hh ~ hh hh] ",
  "[~ ~ ~ ~] [~ ~ ~ oh] [~ ~ ~ ~] [~ oh ~ ~] ",
).s().slow(2)
```
