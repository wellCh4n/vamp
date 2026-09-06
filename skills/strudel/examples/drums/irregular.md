# Irregular drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

5 个鼓型。

## Irregular1a

```js
stack(
  "[bd ~ bd bd] [~ ~ bd ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ sd] [~ ~ ~ ~] [sd ~ ~ sd]",
).s().slow(2)
```

## Irregular1b

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ bd] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ sd]",
).s().slow(2)
```

## Irregular2a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ bd] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ sd] [~ ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Irregular2b

```js
stack(
  "[bd ~ bd ~] [~ ~ bd ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ sd] [~ ~ ~ ~] [sd ~ ~ ~] [sd ~ ~ ~]",
).s().slow(2)
```

## Irregular3

```js
stack(
  "[bd ~ ~ bd] [~ ~ ~ ~] [bd ~ ~ ~] [~ ~ bd ~]",
  "[~ sd ~ ~] [sd ~ ~ ~] [~ ~ sd ~] [~ sd ~ ~]",
).s().slow(2)
```
