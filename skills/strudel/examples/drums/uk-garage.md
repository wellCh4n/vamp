# UkGarage drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## UkGarage1a

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [cp ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~]",
  "[~ ~ hh hh] [~ ~ hh ~] [~ ~ hh ~] [~ ~ hh hh]",
  "[~ rim ~ ~] [~ ~ ~ rim] [~ ~ ~ ~] [~ rim ~ ~]",
  "[~ ~ ~ ~] [~ mt ~ ~] [~ ~ ~ mt] [~ ~ ~ ~]",
).s().slow(2)
```

## UkGarage1b

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [cp ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~]",
  "[~ ~ hh ~] [~ ~ hh ~] [~ ~ hh ~] [~ ~ hh ~]",
  "[~ rim ~ ~] [~ ~ ~ rim] [~ ~ ~ ~] [~ rim ~ ~]",
  "[~ ~ ~ ~] [~ mt ~ ~] [~ ~ ~ mt] [~ ~ ~ ~]",
).s().slow(2)
```
