# Footwork drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

2 个鼓型。

## Footwork1

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd ~] [bd ~ ~ bd] [~ ~ bd ~]",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~]",
  "[~ ~ hh ~] [~ ~ ~ ~] [~ ~ hh ~] [~ ~ ~ ~]",
  "[rim rim rim rim] [rim rim rim rim] [rim rim rim rim] [rim rim rim rim]",
).s().slow(2)
```

## Footwork2

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd ~] [bd ~ ~ bd] [~ ~ bd ~]",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~]",
  "[~ ~ hh ~] [~ ~ ~ hh] [hh ~ hh ~] [~ ~ hh ~]",
  "[rim rim rim rim] [rim rim rim rim] [rim rim rim rim] [rim rim rim rim]",
).s().slow(2)
```
