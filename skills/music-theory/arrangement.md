# Arrangement and structure

The rule in one line: **split it into sections of 4 or 8 bars, add and remove voices section by section, and make the second pass differ from the first.**

## The minimum structure

```
intro (4) -> A main section (8) -> B chorus / climax (8) -> A' (8) -> outro (4)
```

- intro: one or two voices (drums + bass, or a pad plus a fragment of the melody) to establish the tempo and the key.
- A: full drums, bass and chords; the melody may be only half present.
- B: add something — the melody an octave up, sevenths instead of triads, a counter-melody, denser hats, a bigger `room`.
- A': back to A, but keeping one or two elements from B.
- outro: pull the voices out one at a time, or close the `lpf` slowly.

## How to section it in Strudel

### Option 1: `arrange` (the clearest)

```js
setcpm(110/4)
const key = "A:minor", prog = "<Am F C G>"
const drums = s("bd ~ sd ~, hh*8").bank("RolandTR909")
const bass = chord(prog).rootNotes(2).note().struct("x ~ x x").s("sawtooth").lpf(400)
const chords = chord(prog).voicing().s("gm_epiano1").room(.4).gain(.6)
const lead = n("<[0 2 4 2] [5 4 2 0]>").scale(key).add(note(12)).s("piano")

$: arrange(
  [4, stack(bass, chords)],                      // intro
  [8, stack(drums, bass, chords)],               // A
  [8, stack(drums, bass, chords, lead)],         // B
  [8, stack(drums, bass, chords, lead.add(note(12)))],   // B': the melody an octave up
  [4, stack(chords)],                            // outro
)
```

`arrange([bars, pattern], ...)` plays the sections in order and loops back to the start. Use multiples of 4 for the bar counts.

### Option 2: control each track's entry with `<>` or `mask`

```js
$: drums.mask("<0 1 1 1>/4")            // no drums for the first four bars
$: lead.mask("<0 0 1 1>/4")             // the melody only from bar 9
$: chords.gain("<.4 .4 .7 .7>/4")       // louder in the chorus
```

A `mask` string is one 0/1 per bar, and `/4` stretches each slot to four bars. Changing one track leaves the others alone, which suits live coding as you build up.

### Option 3: `every` / `sometimes` for local variation (no structural change)

```js
$: drums.every(4, x => x.fast(2))                   // a doubled fill at the end of every fourth bar
$: lead.every(2, x => x.add(note(12)))              // an octave jump every two bars
$: hh.sometimesBy(.25, x => x.ply(2))               // random doubles
$: chords.lpf("<400 800 1600 4000>/4")              // the filter opening across four bars
```

## Principles for adding and removing voices

- Add or remove one voice at a time, and only at a 4- or 8-bar boundary.
- Rising toward a climax: add voices, densify the hats, open the `lpf`, enlarge the `room`, take the melody up an octave.
- Coming down: drop the kick first (keeping hats and pad gives a suspended feeling), then the bass.
- Transitions: a fill in the last bar of a section (drums with `fast(2)` or `ply`), a whole beat of silence `"~"`, or a crash `cr`.
- Keep at least one voice unchanged across a section boundary, so the listener knows it is still the same piece.

## Arranging timbre and space

- One kind of space per voice: dry drums (`room 0–.2`), a wet pad (`room .5+`, size .8), and a lead in between plus `delay`.
- Raising `room` on every voice turns the mix to mush.
- Frequency placement: bass low (`lpf`), pad in the middle (`lpf` around 2000), hats and ornaments high (`hpf`).
- The climax can lift the overall `gain` by 10–20%, but leave headroom earlier (`gain .6–.8` in the main section).

## Length and looping

- Strudel loops forever, so `arrange` returns to the intro when it finishes. That is expected.
- If the user says it is too short or repeats too soon: grow A and B from 4 bars to 8, or write more variants inside the `<>`.
- If the user says it is monotonous: check that there is a B section at all, then add `every`.
