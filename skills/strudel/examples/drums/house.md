# House drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## House1a

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh]",
  "[cy ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
  "[~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~] [~ ~ oh ~]",
).s().slow(2)
```

## House1b

```js
stack(
  "[bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~] [bd ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh]",
  "[~ ~ oh ~] [~ oh ~ ~] [~ ~ oh ~] [~ oh ~ ~]",
).s().slow(2)
```
