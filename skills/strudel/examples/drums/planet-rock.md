# PlanetRock drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

1 patterns.

## PlanetRock

```js
stack(
  "[bd ~ ~ ~] [~ ~ bd ~] [~ ~ ~ ~] [~ ~ ~ ~]",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~]",
  "[~ ~ ~ ~] [cp ~ ~ ~] [~ ~ ~ ~] [cp ~ ~ ~]",
  "[cb ~ cb ~] [cb ~ cb cb] [~ cb ~ cb] [cb ~ cb ~]",
  "[rim ~ rim ~] [rim ~ rim rim] [~ rim ~ rim] [rim ~ rim ~]",
  "[hh ~ hh hh] [hh ~ hh hh] [hh ~ hh hh] [hh hh hh hh]",
).s().slow(2)
```
