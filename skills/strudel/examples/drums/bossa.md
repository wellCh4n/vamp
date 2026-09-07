# Bossa drum patterns

Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.

6 patterns.

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
