---
name: sound-design
description: Make the sounds themselves expressive rather than "MIDI-like": couple dynamics to timbre, give every note an attack transient, and build a voice's overtones with wavetables, additive synthesis or FM instead of reaching for a gm_* soundfont. This file holds the non-negotiables; the measurements, recipes and preset library are in the same directory, read with read_doc("sound-design/<file>").
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
   and 2 barely move them (about 1.3x). **Default to a wavetable (`s("wt_flute")`, 65 families,
   loaded at startup) for any voice that has to be expressive** — they carry instrument character
   yet respond to a filter envelope as fully as an oscillator (7.1x on `wt_flute` against 1.3x on
   `gm_flute`); add `postgain(2.6)`, since they render about 3x quiet. Plain oscillators,
   `partials` and FM are the other synth sources. Keep samples for what they are good at: drums,
   plucked and struck sounds, and non-harmonic instruments such as gongs and cymbals, whose
   overtones are not integer multiples and cannot be synthesized this way.

4. **Set `lpf` below the source's own harmonics.** A filter envelope can only sweep through content
   that exists. A base above it leaves nothing to reveal and the transient vanishes — the single
   most common way these rules fail.

5. **Do not apply this to drum samples.** They already carry their own transient.

## When to read the details

| Situation | Read |
|---|---|
| Writing any synth voice, or the user says it sounds fake / flat / like MIDI / lifeless | `read_doc("sound-design/dynamics-and-transients.md")`: the measurements, per-role parameter table, sample-source workarounds, common mistakes |
| Choosing a sound for a voice, or the user wants a specific instrument, a bell, metal, an organ, an e-piano | `read_doc("sound-design/synth-voices.md")`: the wavetable list, how `partials` / FM / `chebyshev` behave with measured spectra, and a preset library to paste from |

## File index

- `sound-design/dynamics-and-transients.md` — why overtones make a sound real, the two recipes with
  measured spectral centroids, a starting-parameter table per instrument role, what to do when the
  source is a sample, and the mistakes that flatten a track
- `sound-design/synth-voices.md` — building a voice's overtones: the 65 AKWF wavetable families,
  exact additive control with `partials`, harmonic and inharmonic FM, `chebyshev` waveshaping and
  where it sits in the signal chain, plus 13 measured drop-in presets
