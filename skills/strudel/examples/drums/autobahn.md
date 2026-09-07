# Autobahn drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

2 patterns.

## Autobahn1a

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [bd ~ bd ~] [~ ~ ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[rim ~ rim ~] [rim ~ rim rim] [~ rim ~ rim] [rim ~ rim ~] ",
  "[cp ~ cp ~] [cp ~ cp cp] [~ cp ~ cp] [cp ~ cp ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] ",
).s().slow(2)
```

## Autobahn1b

```js
stack(
  "[bd ~ bd ~] [~ ~ ~ ~] [bd ~ bd ~] [~ bd ~ ~] ",
  "[~ ~ ~ ~] [sd ~ ~ ~] [~ ~ ~ ~] [sd ~ ~ ~] ",
  "[rim ~ rim ~] [rim ~ rim rim] [~ rim ~ rim] [rim ~ rim ~] ",
  "[cp ~ cp ~] [cp ~ cp cp] [~ cp ~ cp] [cp ~ cp ~] ",
  "[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh hh hh] ",
  "[oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] [oh ~ oh ~] ",
).s().slow(2)
```
