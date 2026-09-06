# Blues drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

2 个鼓型。

## Blues1a

```js
stack(
  "[bd bd bd bd] [bd bd bd bd] [bd ~ ~ ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh ~ ~ ~] ",
  "[sd sd sd sd] [sd sd sd sd] [sd sd sd sd] ",
).s().slow(2)
```

## Blues2a

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd ~] [~ bd ~ ~] ",
  "[hh ~ ~ hh] [~ ~ hh ~] [~ hh ~ ~] ",
  "[~ sd sd ~] [sd sd ~ sd] [sd ~ sd sd] ",
).s().slow(2)
```
