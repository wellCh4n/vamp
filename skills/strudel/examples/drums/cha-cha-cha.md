# ChaChaCha drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

3 个鼓型。

## ChaChaCha1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] ",
  "[~ ~ ~ ~] [hh ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ht ~] [~ ~ ht ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [lt ~ lt ~] ",
).s().slow(2)
```

## ChaChaCha1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [bd ~ ~ ~] [~ ~ bd ~] ",
  "[cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] ",
  "[~ ~ ~ ~] [hh ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ht ht] [~ ~ ~ ~] [~ ~ ht ht] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ lt lt] [~ ~ ~ ~] [~ ~ lt ~] ",
).s().slow(2)
```

## ChaChaCha1c

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [ac ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [hh ~ ~ ~] ",
  "[~ ~ ht ~] [~ ~ ~ ~] [ht ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [lt ~ lt ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```
