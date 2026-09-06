# Supersonic drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

4 个鼓型。

## Supersonic1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] ",
).s().slow(2)
```

## Supersonic1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ bd ~] [~ bd ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] ",
).s().slow(2)
```

## Supersonic2a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[cb ~ cb cb] [cb ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[rim rim rim rim] [rim rim rim rim] [rim rim rim rim] [rim rim rim rim] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
).s().slow(2)
```

## Supersonic2b

```js
stack(
  "[bd ~ bd ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [sd ~ ~ ~] ",
  "[cb ~ cb cb] [cb ~ cb ~] [cb ~ ~ ~] [~ ~ ~ ~] ",
  "[rim rim rim rim] [rim rim rim rim] [rim rim rim rim] [rim rim rim rim] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
).s().slow(2)
```
