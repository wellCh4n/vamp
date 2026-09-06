# Samba drum patterns

来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。

9 个鼓型。

## Samba1a

```js
stack(
  "[bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] ",
  "[cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] [cb ~ ~ ~] ",
  "[~ hh hh ~] [~ hh hh ~] [~ hh hh ~] [~ hh hh ~] ",
  "[~ ~ ~ ~] [~ ~ ~ lt] [~ ~ ~ ~] [~ ~ ~ lt] ",
  "[~ ~ ~ mt] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ sd] [~ ~ ~ ~] ",
).s().slow(2)
```

## Samba1b

```js
stack(
  "[bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] ",
  "[cb ~ cb ~] [cb cb ~ cb] [~ cb cb ~] [cb cb ~ cb] ",
  "[~ hh ~ hh] [~ ~ hh ~] [hh ~ ~ ~] [~ ~ hh ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ mt] [~ ~ ~ ~] ",
).s().slow(2)
```

## Samba1c

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ac ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ hh ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ lt lt] [lt ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ mt mt] [mt ~ ~ ~] [~ ~ ~ ~] ",
  "[sd ~ sd sd] [sd ~ ~ ~] [~ ~ ~ ~] [~ ~ sd ~] ",
).s().slow(2)
```

## Samba2a

```js
stack(
  "[bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] ",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ lt lt] ",
  "[~ ~ rim ~] [~ rim ~ ~] [rim ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ sd] [~ ~ ~ ~] ",
).s().slow(2)
```

## Samba2b

```js
stack(
  "[bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] ",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ lt] ",
  "[~ ~ ~ ~] [~ ~ ~ mt] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ rim ~ ~] [~ rim ~ ~] [~ rim ~ ~] [~ rim ~ ~] ",
  "[~ ~ ~ sd] [~ ~ ~ ~] [~ ~ ~ sd] [~ ~ ~ ~] ",
).s().slow(2)
```

## Samba2c

```js
stack(
  "[~ ~ ~ ~] [lt ~ ~ ~] [~ ~ lt ~] [~ ~ ~ ~] ",
  "[mt ~ ~ mt] [~ ~ mt ~] [~ mt ~ ~] [mt ~ ~ mt] ",
  "[~ sd sd ~] [~ ~ ~ sd] [sd ~ ~ ~] [~ sd sd ~] ",
).s().slow(2)
```

## Samba3a

```js
stack(
  "[ac ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] [ac ~ ~ ~] ",
  "[bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
).s().slow(2)
```

## Samba3b

```js
stack(
  "[~ ~ ~ ~] [~ ~ ~ ac] [~ ~ ~ ac] [~ ~ ~ ~] ",
  "[bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] ",
  "[~ hh ~ hh] [~ ~ hh ~] [hh ~ ~ hh] [~ ~ hh ~] ",
  "[sd ~ sd ~] [sd sd ~ sd] [~ sd sd ~] [sd sd ~ sd] ",
).s().slow(2)
```

## Samba3c

```js
stack(
  "[bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] [bd ~ ~ bd] ",
  "[hh hh ~ ~] [~ ~ hh hh] [~ ~ hh ~] [hh ~ ~ ~] ",
  "[~ ~ ht ~] [ht ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ lt] [~ ~ lt ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [mt ~ ~ ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ oh] ",
  "[~ ~ sd ~] [sd ~ ~ ~] [sd ~ ~ sd] [~ ~ sd ~] ",
).s().slow(2)
```
