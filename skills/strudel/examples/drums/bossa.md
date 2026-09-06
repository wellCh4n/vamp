# Bossa drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

6 个鼓型。

## Bossa1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[rim ~ ~ ~] [~ ~ rim ~] [~ ~ ~ ~] [rim ~ ~ ~] ",
).s().slow(2)
```

## Bossa1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~] ",
  "[~ ~ ~ ~] [rim ~ ~ ~] [~ ~ rim ~] [~ ~ ~ ~] ",
).s().slow(2)
```

## Bossa1c

```js
stack(
  "[~ ~ bd ~] [bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] ",
  "[~ ~ hh ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [cy ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [lt ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [mt ~ mt ~] [~ ~ ~ ~] ",
  "[rim ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
).s().slow(2)
```

## Bossa2a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[~ ~ ~ ~] [hh ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[cy ~ cy ~] [cy ~ cy ~] [cy ~ cy ~] [cy ~ cy ~] ",
  "[~ ~ rim ~] [~ rim ~ ~] [rim ~ ~ rim] [~ ~ ~ ~] ",
).s().slow(2)
```

## Bossa2b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[~ ~ ~ ~] [hh ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[cy ~ cy ~] [cy ~ cy ~] [cy ~ cy ~] [cy ~ cy ~] ",
  "[~ ~ rim rim] [~ ~ rim rim] [~ ~ rim rim] [~ ~ rim rim] ",
).s().slow(2)
```

## Bossa2c

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ lt ~] [lt ~ ~ ~] ",
  "[~ ~ mt ~] [~ ~ mt ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
).s().slow(2)
```
