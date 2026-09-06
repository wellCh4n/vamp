# Swing drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

3 个鼓型。

## Swing1a

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[hh ~ ~ hh] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ sd sd] [sd sd sd sd] ",
).s().slow(2)
```

## Swing2a

```js
stack(
  "[bd bd bd ~] [bd bd bd ~] [bd ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ hh ~] ",
  "[~ ~ ~ sd] [~ ~ ~ sd] [~ sd sd ~] ",
).s().slow(2)
```

## Swing3a

```js
stack(
  "[bd ~ ~ bd] [~ ~ bd ~] [~ bd ~ ~] ",
  "[cy ~ ~ cy] [~ ~ cy ~] [~ cy ~ ~] ",
  "[~ ~ ~ ~] [mt mt ~ ~] [~ ~ mt mt] ",
  "[oh ~ ~ oh] [~ ~ oh ~] [~ oh ~ ~] ",
  "[~ sd sd ~] [~ ~ ~ sd] [sd ~ ~ ~] ",
).s().slow(2)
```
