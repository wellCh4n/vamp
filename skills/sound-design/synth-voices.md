# Synth voices: designing timbre instead of picking a preset

The rule in one line: **when a voice needs character, build its overtones — with a wavetable, with
`partials`, or with FM — rather than reaching for a `gm_*` soundfont.**

Every number below was measured by rendering the sound offline and running an FFT: harmonic
strengths are relative to the strongest harmonic, and "atk/sus" is the ratio of spectral centroids
at 4 ms and at 300 ms, which is how much attack transient the voice has.

## Which technique to use

| Technique | What it gives you | Reach for it when |
|---|---|---|
| **Wavetables** `s("wt_*")` | 65 instrument-shaped waveforms, and they drive the synth engine, so filter envelopes work fully | **The default choice.** Instrument character plus full expressiveness |
| **Additive** `s("user").partials([…])` | Exact control of each overtone's strength | You want a specific spectrum: hollow, odd-only, organ-like |
| **FM** `.fm(i).fmh(ratio)` | Dense harmonic or *inharmonic* spectra | Bells, metal, e-pianos, anything a filter cannot make |
| **Waveshaping** `.chebyshev(n)` | Adds odd overtones, amount is playable | Drive and grit that follows the playing |

## Wavetables — start here

`wt_*` names come from the AKWF set, 65 families loaded at startup (the manifest only; a waveform
file downloads on first trigger). `n` picks a waveform inside the family.

They matter because they are the only source that has both instrument character *and* synth
expressiveness. The same filter envelope applied to different sources:

| Source | atk/sus with a static filter | atk/sus with `lpenv(5)` |
|---|---|---|
| `sawtooth` | 1.0x | 7.7x |
| `wt_flute` | 1.0x | **7.1x** |
| `wt_violin` | 1.0x | 3.4x |
| `piano` (sampled) | 0.9x | 1.6x |
| `gm_flute` (soundfont) | 0.6x | 1.3x |

`wt_flute` also carries far more overtone content than its soundfont equivalent — spectral centroid
2830 Hz against 669 Hz, and 28.3% of its energy above 2 kHz against 4.4%.

Wavetables render about 3x quieter than the oscillators, so add `postgain(2.6)` to match levels.

Useful families: `wt_flute wt_violin wt_cello wt_oboe wt_clarinett wt_altosax wt_aguitar wt_eguitar
wt_epiano wt_piano wt_dbass wt_ebass wt_eorgan wt_theremin wt_hvoice wt_birds wt_overtone
wt_sinharm wt_bw_saw wt_bw_squ`. The full list is in `reference/sounds.md` under "Wavetables".

## Additive — writing the overtones directly

`s("user").partials([…])` sets the strength of each harmonic, the first entry being the
fundamental. It does exactly what it says — declared against measured:

| `partials([…])` | measured harmonics 1–7 |
|---|---|
| `[1]` | 100, 0, 0, 0, 0, 0, 0 |
| `[1,0,.6,0,.4,0,.25]` | 100, 0, 65, 0, 44, 0, 27 |
| `[1,.5,.9,.3,.6,.2,.4]` | 100, 54, 97, 30, 67, 20, 43 |
| `[1,1,1,1,1,1,1,1]` | 90, 97, 97, 90, 100, 90, 98 |

Two things follow. Odd-only arrays give the hollow, clarinet-like colour; and harmonics beyond the
end of the array are exactly zero, so a short array is a dark sound.

**Set `lpf` below the harmonics you declared.** An additive voice has no content above its last
partial, so a filter base above it leaves the envelope nothing to sweep. Moving `hollow-lead` from
`lpf(700)` to `lpf(160)` took its attack ratio from 1.1x to 2.7x — the same fix, and the same
mistake, as putting a filter envelope on a soundfont.

`.phases([…])` rotates each harmonic. It does not change the spectrum, only the waveform shape, so
use it for subtle depth, not for brightness.

## FM — the only way to get inharmonic overtones

`.fm(index)` sets the modulation depth and `.fmh(ratio)` the harmonicity. Integer ratios stay
harmonic; fractional ratios do not, which is what bells and metal need:

| Settings | harmonics 1–8 | energy at 1.5x / 2.5x / 3.5x f0 | above 2 kHz |
|---|---|---|---|
| `fm(3).fmh(1)` | 34, 13, 100, 39, 31, 2, 3, 3 | 0, 0, 0 | 8.2% |
| `fm(4).fmh(2)` | 42, 0, 40, 0, 13, 0, 100, 0 | 0, 0, 0 | 17.3% |
| `fm(6).fmh(3.5)` | 57, 2, 1, 0, 2, 92, 2, 100 | 2, **99**, 0 | 52.9% |
| `fm(8).fmh(1.41)` | 83, 2, 3, 6, 0, 100, 0, 97 | 1, 3, 1 | 22.5% |

The 99 at 2.5x the fundamental is a partial that sits between harmonics — no filter or sample can
produce that. `fmdecay` / `fmsustain` shape the modulation over time, which is what makes an FM
e-piano bright at the strike and pure afterwards.

There are 8 independent operators; append a number to address one (`fmh2`, `fmwave6`, `fmenv4`).

## Waveshaping — and a trap

`.chebyshev(n)` adds odd overtones: `chebyshev(3)` measures 100, 0, 35, 0, 19 and `chebyshev(6)`
measures 100, 0, 61, 0, 45.

**Waveshaping sits after the filter in the signal chain, so a filter envelope cannot shape it.**
Putting `lpenv` on a `chebyshev` voice measured an attack *darker* than its sustain (0.7x) — the
distortion re-adds the overtones the filter just removed. Drive the distortion amount from the
dynamics pattern instead:

```js
const dyn = "1 .35"
.s("sine").chebyshev(dyn.mul(7)).postgain(.25).gain(dyn)   // loud 3559 Hz vs soft 1819 Hz, 2.0x
```

`chebyshev` is loud — it measured a peak of 0.96 where the oscillators sit near 0.25. Always add
`postgain(.2–.3)`.

## Preset library

Drop-in voices, all measured. `atk/sus` is the attack transient ratio; anything at 1.0x is flat.
Pair each with a dynamics pattern as described in `sound-design/dynamics-and-transients.md`.

### Wavetable (default choice, all need `postgain(2.6)`)

```js
// flute / lead, breathy                                        atk/sus 2.3x
.s("wt_flute").postgain(2.6).lpf(220).lpenv(4).lpa(.02).lpd(.25).lps(.25)
// bowed string, sustained                                      atk/sus 1.1x
.s("wt_violin").postgain(2.6).lpf(200).lpenv(4).lpa(.04).lpd(.35).lps(.3)
// double reed, nasal and cutting                               atk/sus 1.6x
.s("wt_oboe").postgain(2.6).lpf(200).lpenv(4).lpa(.02).lpd(.22).lps(.2)
// electric piano, percussive                                   atk/sus 3.2x
.s("wt_epiano").postgain(2.6).lpf(250).lpenv(4).lpa(.005).lpd(.2).lps(0)
// upright / synth bass                                         atk/sus 1.9x
.s("wt_dbass").postgain(2.6).lpf(120).lpenv(3).lpa(.005).lpd(.14).lps(0)
```

### Additive

```js
// hollow lead, clarinet-like (odd harmonics only)              atk/sus 2.7x
.s("user").partials([1,0,.6,0,.4,0,.25,0,.15]).lpf(160).lpenv(4).lpa(.005).lpd(.16).lps(0)
// drawbar organ pad, swells in (a pad should measure below 1x) atk/sus 0.5x
.s("user").partials([1,.5,.9,.3,.6,.2,.4]).lpf(150).lpenv(3).lpa(.25).lpd(.7).lps(.45)
// soft round bass, three partials                              atk/sus 1.3x
.s("user").partials([1,.25,.1]).lpf(90).lpenv(2.5).lpa(.005).lpd(.11).lps(0)
// bright sustained string                                      atk/sus 1.4x
.s("user").partials([1,.8,.65,.5,.4,.35,.3,.25]).lpf(170).lpenv(4).lpa(.01).lpd(.2).lps(.1)
```

### FM

```js
// electric piano, bright strike into a pure tail               atk/sus 2.2x
.fm(3).fmh(1).fmdecay(.2).fmsustain(0).lpf(900).lpenv(3).lpa(.005).lpd(.2).lps(0)
// bell, inharmonic                                             atk/sus 2.2x
.fm(6).fmh(3.5).fmdecay(.6).fmsustain(.15).lpf(1200).lpenv(2).lpa(.002).lpd(.5).lps(0)
// metallic gong wash                                           atk/sus 1.4x
.fm(8).fmh(1.41).fmdecay(1.2).fmsustain(.2).lpf(800).lpenv(3).lpa(.002).lpd(1).lps(.1)
// punchy FM bass                                               atk/sus 2.0x
.fm(2).fmh(1).fmdecay(.12).fmsustain(0).lpf(280).lpenv(2.5).lpa(.005).lpd(.12).lps(0)
```

## Choosing

- Any voice that carries the tune: a wavetable first, then additive or FM if the character is not
  there.
- Bass: `wt_dbass`, the additive soft bass, or the FM bass. Keep `lpf` low and `lpenv` modest — a
  bass that opens too far loses its weight.
- Bells, gongs, anything metallic: FM with a fractional `fmh`. Nothing else can make those partials.
- Percussion, plucked and struck sounds, and real gongs and cymbals: stay on samples. Their
  overtones are not integer multiples of anything and cannot be synthesized this way.
- `gm_*` is still fine for a voice that only has to sit in the background and never change.

## Common mistakes

- **`lpf` above the source's own harmonics.** The envelope has nothing to sweep and the transient
  disappears. Applies to additive voices as much as to samples.
- **A filter envelope on a `chebyshev` or `distort` voice.** They sit after the filter; drive their
  amount from the dynamics pattern instead.
- **Forgetting `postgain`.** Wavetables come in about 3x quiet, `chebyshev` about 4x loud.
- **Fractional `fmh` on a voice that should sound in tune.** Inharmonic partials read as "out of
  tune" on a lead or a bass. Keep those on integer ratios.
- **One wavetable for everything.** `n` selects among dozens of waveforms in a family; vary it
  between sections rather than switching instrument.
