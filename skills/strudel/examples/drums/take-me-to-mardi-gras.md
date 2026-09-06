# TakeMeToMardiGras drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

2 个鼓型。

## TakeMeToMardiGras

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ bd ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[hh ~ hh ~] [hh ~ hh hh] [hh ~ hh ~] [hh ~ hh hh] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[cp ~ cp ~] [~ cp ~ ~] [~ cp ~ ~] [cp ~ ~ ~] ",
  "[~ ~ ~ ~] [cy ~ ~ cy] [~ ~ cy ~] [~ cy ~ cy] ",
).s().slow(2)
```

## TakeMeToMardiGrasAlt

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ sd ~ ~] [sd ~ ~ ~] ",
  "[hh ~ ~ ~] [hh ~ hh hh] [hh ~ hh ~] [hh ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ oh ~] ",
  "[cp ~ cp ~] [~ cp ~ ~] [~ cp ~ ~] [cp ~ ~ ~] ",
  "[~ ~ ~ ~] [cy ~ ~ cy] [~ ~ cy ~] [~ cy ~ cy] ",
).s().slow(2)
```
