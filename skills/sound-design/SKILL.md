---
name: sound-design
description: Make the sounds themselves expressive rather than "MIDI-like": couple dynamics to timbre, give every note an attack transient, and choose between synth and sampled sources by what each can actually do. This file holds the non-negotiables; the measurements and recipes are in dynamics-and-transients.md, read with read_doc("sound-design/<file>").
---

# Sound design skill

A real instrument played harder does not just get louder — it gets **brighter**, because more
overtones appear. And every note starts with a burst of high overtones (the bow, the breath, the
hammer) that fades within a fraction of a second. Music that lacks both of these is what people
mean when they call a track "MIDI-like". Both are cheap to add in Strudel.

## The non-negotiables

1. **Never express dynamics with `gain` alone on a synth voice.** `velocity` is documented as
   "multiplied together with gain" — it is pure amplitude and changes no timbre. Drive the filter
   envelope from the same pattern that drives gain:
   ```js
   const dyn = "1 .55 .8 .55"
   $: n("0 2 4 2").scale("C:minor").s("sawtooth")
     .gain(dyn).lpf(500).lpenv(dyn.mul(6)).lpa(.005).lpd(.14).lps(0)
   ```
   Measured: `gain` alone moves the spectral centroid 1.1x between loud and soft; linked to
   `lpenv` it moves it 3.8x.

2. **Every sustained synth voice gets an attack transient.** `.lpf(<base>).lpenv(<octaves>)`
   with a short `.lpa` and `.lpd`, and `.lps(0)` so it falls back to the base cutoff:
   ```js
   .lpf(400).lpenv(5).lpa(.005).lpd(.18).lps(0)
   ```
   Measured: a static `lpf` gives a centroid of 696 Hz at the attack and 697 Hz in the sustain —
   completely flat. With the envelope: 2545 Hz falling to 330 Hz.

3. **Pick the source by what it can do.** Filters can only remove overtones, never add ones the
   source lacks. `gm_*` soundfonts are spectrally poor and have no velocity layers, so rules 1
   and 2 barely move them (about 1.5x). Use a synth (`sawtooth` / `square` / `supersaw`) for any
   voice that has to be expressive — bass, lead, pad — and keep samples for what they are good
   at: drums, plucked and struck sounds, and non-harmonic instruments such as gongs and cymbals,
   whose overtones are not integer multiples and cannot be synthesized this way.

4. **Do not apply this to drum samples.** They already carry their own transient.

## When to read the details

| Situation | Read |
|---|---|
| Writing any synth voice, or the user says it sounds fake / flat / like MIDI / lifeless | `read_doc("sound-design/dynamics-and-transients.md")`: the measurements, per-instrument parameter table, sample-source workarounds, common mistakes |

## File index

- `sound-design/dynamics-and-transients.md` — why overtones make a sound real, the two recipes with
  measured spectral centroids, a starting-parameter table per instrument role, what to do when the
  source is a sample, and the mistakes that flatten a track
