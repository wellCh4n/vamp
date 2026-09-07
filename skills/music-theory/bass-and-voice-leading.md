# Bass and voice leading

The rule in one line: **the bass follows the roots and the kick; each voice takes its own register; no more than three voices move at once.**

## Three levels of bass

1. **Held roots** (the safest):
   ```js
   $: chord(prog).rootNotes(2).s("gm_acoustic_bass").clip(.95)
   ```
2. **Rhythmized roots** (most genres): follow the kick's placement.
   ```js
   $: chord(prog).rootNotes(2).struct("x ~ x ~ ~ x ~ x").s("sawtooth").lpf(400)
   $: chord(prog).rootNotes(2).ply("<2 4>").s("gm_synth_bass_1").clip(.5)   // an eighth- or sixteenth-note groove
   ```
3. **Root plus fifth / octave / passing tones** (a melodic bass): write it as degrees, where the fifth is +4 and the octave +7, and use a passing tone before the next chord.
   ```js
   // As degrees: the root degree of each bar is 0 5 3 4 (for C Am F G), with 0 / 4 / 7 added on top
   $: n("<0 5 3 4>".add("0 ~ 4 7 0 ~ 4 [7 6]")).scale("C2:major").s("gm_electric_bass_finger").clip(.8)
   ```
   Note that the `6` in the last slot is a passing tone leading to the next bar's root, placed on the bar's final weak beat.

- The beat where the chord changes (usually the first of the bar) **must** play the root; anything goes in between.
- Bass register: `rootNotes(2)` or `scale("C2:...")`, so around C2–C3. Lower is inaudible, higher collides with the chords.
- The bass plays one note at a time — never stack chords on it. `.lpf(300–600)` removes the high-frequency fuzz, and an electronic bass wants `sawtooth` / `square` with `lpf` plus `lpenv`.

## The bass against the kick

- In sync: use the same rhythm string for the bass's `struct` and the kick's pattern, or put the bass only where the kick is.
- Offset (funk / house): the kick on the beat, the bass off the beat or on the second half of a sixteenth, something like `"~ x ~ x"` — but the first beat of the bar still needs one of the two (bass or kick).
- Never let the bass and the kick both run dense sixteenths at once; the low end turns to mud. Pick one to be dense and keep the other sparse.

## Register assignment

| Voice | Octave | Strudel |
|---|---|---|
| kick / bass | 1–2 | `rootNotes(2)`, `scale("C2:…")` |
| chords / pad | 3–4 | the `voicing()` default; `.anchor("c5").mode("below")` to push it down |
| melody / lead | 4–5 | `scale("C4:…")` or `.add(note(12))` |
| ornaments / arpeggio / hats | 5–6 | `.add(note(24))` |

- Two voices should not move in the same octave at the same time: with the melody at 4–5, keep the chords down at 3–4, or turn them into an arpeggio placed higher (5–6).
- Give the pad and the lead different kinds of sound (one a pad / strings / epiano, the other a pluck / lead / piano), or they blur into each other.

## Voice leading

- `.voicing()` already picks the voicing closest to the previous chord and connects them smoothly, so normally there is nothing to do.
- Writing chords by hand with `note("[c,e,g]")`, move only one or two notes between adjacent chords: C `[c,e,g]` -> Am `[c,e,a]` -> F `[c,f,a]` -> G `[b,d,g]`, rather than stacking each one up from its root.
- Do not let the melody and the bass run parallel for long (same direction, same intervals); moving in contrary motion now and then (melody up, bass down) sounds better.

## Density control

- At most three voices "moving" at any moment (drums count as one; a held pad does not).
- When one voice is dense (sixteenth hats or an arpeggio), the others must be sparse (long notes, one per beat).
- The easiest mistake is hats, arpeggio and melody all running sixteenths: keep one.
- Add voices for the chorus, remove them for the verse, leave one or two in the intro. See `music-theory/arrangement.md`.
