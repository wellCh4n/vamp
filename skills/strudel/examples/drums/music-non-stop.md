# MusicNonStop drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

3 个鼓型。

## MusicNonStop1a

```js
stack(
  "[bd bd ~ ~] [~ ~ bd bd] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] ",
).s().slow(2)
```

## MusicNonStop2a

```js
stack(
  "[bd bd ~ ~] [~ ~ bd bd] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[rim rim rim ~] [~ rim ~ ~] [rim ~ ~ rim] [~ rim rim ~] ",
  "[~ hh ~ hh] [~ hh ~ hh] [~ hh ~ hh] [~ hh ~ hh] ",
  "[oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] ",
).s().slow(2)
```

## MusicNonStop2b

```js
stack(
  "[bd bd ~ ~] [~ ~ bd bd] [~ ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[rim ~ rim ~] [rim rim ~ ~] [rim ~ ~ rim] [~ rim rim rim] ",
  "[~ hh ~ hh] [~ hh ~ hh] [~ hh ~ hh] [~ hh ~ hh] ",
  "[oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] ",
).s().slow(2)
```
