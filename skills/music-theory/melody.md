# Writing melody

The rule in one line: **build the skeleton from chord tones, move mostly by step, phrase in 2 or 4 bars, end phrases back on the tonic or the fifth, and shape it as a call and response of A A B A'.**

## A template

```js
const key = "C:major"
const prog = "<C Am F G>"
// A four-bar phrase, four beats per bar; the first note of each bar is a chord tone of that bar's chord
// (C: 0 2 4 / Am: 5 0 2 / F: 3 5 0 / G: 4 6 1)
$: n("<[0 2 4 2] [5 4 2 0] [3 5 3 2] [4 2 1 0]>").scale(key).add(note(12)).s("piano").clip(.9)
```

Check it: bar 1 opens on 0 (the root of C), bar 2 on 5 (the root of Am), bar 3 on 3 (the root of F), bar 4 on 4 (the root of G), and the phrase ends on 0, back at the tonic.

## Five rules

1. **Chord tones on strong beats**: the first note of each bar and of each beat lands on the root, third or fifth of the current chord (the degree table is in `music-theory/chords-and-progressions.md`). Weak beats can use any note in the key as a passing or neighbor tone.
2. **Mostly stepwise, and reverse after a leap**: adjacent notes should mostly move one or two degrees; after a leap of a third or more (0 -> 4, say), step back in the opposite direction (4 -> 3 or 4 -> 2). Consecutive leaps sound random.
3. **Phrase length**: short phrases of 2 bars or long ones of 4, with at least a beat of rest (`~`) or a held note between them so the line can breathe.
4. **Phrase endings**: the last phrase of a section ends on degree 0 (the tonic, the most settled) or 4 (the fifth, a half cadence that wants to continue). Interior phrases may stop on 1 or 2 — unstable, and pushing onward.
5. **Repetition and variation**: the most effective shape is A A B A'. Repeating A once makes it memorable, B starts somewhere else (higher, or with a different rhythm), and A' is A with a modified ending. Write it with `<>`:
   ```js
   $: n("<[0 2 4 2] [0 2 4 2] [5 7 5 4] [0 2 4 0]>").scale(key)
   ```

## Rhythm matters more than pitch

The same degrees with a different rhythm are a different melody. Give the melody a definite rhythm first, then fill in the notes:

```js
// Fix the rhythm first (x is a note, ~ a rest), then decide which degree goes on each x
$: n("0 ~ 2 4 ~ 2 0 ~").scale(key)         // eighth notes with syncopation
$: n("0 [2 4] ~ 2").scale(key)              // a short phrase with two notes on one beat
$: n("[0 2 4 5]*2 [4 2] 0@2").scale(key)   // a fast run upward that then settles
```

- Held notes and rests are part of the melody: use `0@2` and `~`.
- Starting on a weak beat (`~ 0 2 4`) pushes harder than starting on a strong one.
- Reusing one rhythm across phrases and changing only the pitches is the cheapest way to sound coherent.

## Motif development (so the melody is not random notes)

Take a motif of two to four notes, then:

| Technique | Strudel |
|---|---|
| repeat as is | `"<A A>"` |
| sequence it (up or down within the key) | `"0 2 4".add("<0 2 -3>")`, adding to the degrees |
| invert it (ascending becomes descending) | write it out: `"0 2 4"` -> `"0 -2 -4"` |
| augment / diminish the rhythm | `.slow(2)` / `.fast(2)`, or `.ply(2)` |
| extend the tail | `"<[0 2 4] [0 2 4 7]>"` |
| change the ending | `"<[0 2 4 2] [0 2 4 0]>"` |

## Register and timbre

- Melody sits at octaves 4–5: `.scale("C4:major")` or `.add(note(12))`.
- Keep the range within about an octave and a half, or the line sounds like it is wandering.
- Give the melody voice `clip(.8–.95)` for a little space, and use `room` / `delay` without going too wet.
- For a vocal, singing quality: slower, more stepwise motion, more held notes, and sounds like `gm_flute` / `gm_voice_oohs` / `gm_lead_6_voice`.

## Common mistakes

- Every note leaping at random: consecutive leaps — change to stepwise motion with the occasional leap.
- Running sixteenths without a rest: leave a beat of `~` every two bars.
- Melody and chords going their own ways: check the strong beats against the chord-tone table.
- Phrases always stopping on an unstable note: end sections on 0 or 4.
- One bar of melody looping forever: write at least four, as A A B A'.
