# Bouton drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

1 patterns.

## Bouton

```js
stack(
  "[bd ~ ~ ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ bd ~]",
  "[~ ~ ~ rim] [~ ~ rim ~] [~ ~ ~ ~] [rim ~ ~ ~]",
  "[hh ~ hh hh] [hh ~ hh ~] [hh ~ hh ~] [hh ~ hh ~]",
).s().slow(2)
```
