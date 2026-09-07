# Dynamics and attack transients

The rule in one line: **loud must mean bright, not just loud; and every note must start brighter
than it ends.**

## Why overtones decide whether a sound reads as real

A pitched instrument does not produce one frequency. It produces a fundamental `f` plus a series of
overtones at `2f, 3f, 4f…`. Pitch comes from the fundamental, but **timbre comes entirely from the
relative strength of the overtones** — a flute is nearly pure fundamental, a clarinet is mostly odd
overtones, a bowed string is dense in high overtones.

What makes a synthesized note sound fake is almost never the static spectrum. It is that the
spectrum does not *move*:

- On a real instrument, playing harder adds overtones. It gets brighter, not merely louder.
- Every note begins with a burst of high overtones — bow scratch, breath noise, hammer strike —
  that dies away within tens of milliseconds. Ears use this transient more than anything else to
  judge whether a sound is real.

In Strudel, both are produced with the lowpass filter envelope. Everything below was measured by
rendering the pattern offline and computing the spectral centroid (the amplitude-weighted mean
frequency, which is independent of volume) over a 46 ms window.

## Recipe 1 — couple dynamics to timbre

`velocity` is documented as "multiplied together with gain", so it only scales amplitude. To make
loud notes brighter, derive the filter envelope depth from the same pattern that drives gain:

```js
const dyn = "1 .55 .8 .55"          // one dynamics pattern, reused

$: n("0 2 4 2").scale("C:minor").s("sawtooth")
  .gain(dyn)
  .lpf(500).lpenv(dyn.mul(6))       // louder -> deeper sweep -> brighter
  .lpa(.005).lpd(.14).lps(0).lpr(.1)
  .release(.15)
```

`lpenv` is a depth in **octaves** above the `lpf` base, so `lpf(500).lpenv(6)` opens to about
32 kHz at the peak, and `lpenv(3.3)` to about 5 kHz. Measured over loud versus soft notes:

| | loud centroid | soft centroid | ratio |
|---|---|---|---|
| `gain` alone, `lpenv(4)` fixed | 1248 Hz | 1115 Hz | 1.1x |
| `gain` + `lpenv` linked | 2242 Hz | 591 Hz | **3.8x** |

Energy above 2 kHz went from 20% / 17% to 36% / 3%. The first row is a volume change; the second is
a change of timbre.

Any pattern works as `dyn` — `"1 .55 .8 .55"` for per-note accents, `"<1 .7>"` for bar-to-bar
dynamics. Use `.mul()` to scale it into the range each control needs.

## Recipe 2 — give every note an attack transient

```js
.lpf(400).lpenv(5).lpa(.005).lpd(.18).lps(0)
```

The envelope opens the filter 5 octaves in 5 ms and closes it again over 180 ms, so the note starts
bright and settles dark. `lps(0)` is what makes it fall all the way back to the base cutoff; without
it the filter stays open and the effect disappears.

| Same note, measured at the attack and in the sustain | attack | sustain | ratio |
|---|---|---|---|
| static `lpf(1200)` | 696 Hz | 697 Hz | **1.00x** |
| `lpf(400).lpenv(5).lpa(.005).lpd(.18).lps(0)` | 2545 Hz | 330 Hz | **7.7x** |

A static filter is measurably, exactly flat. That is the signature of a lifeless sound.

Add `.noise(.05–.15)` on an oscillator for breath or bow noise. It is subtle by design — it moved
the attack centroid from 2545 Hz to 2698 Hz — so use it for texture, not for brightness.

## Starting parameters by role

Numbers to start from, then adjust by ear. `lpenv` is in octaves above `lpf`.

| Role | Sound | lpf | lpenv | lpa | lpd | lps |
|---|---|---|---|---|---|---|
| bass | `sawtooth`, `square` | 250–400 | 2–4 | .005 | .10–.15 | 0 |
| pluck / lead | `sawtooth`, `supersaw` | 400–700 | 4–7 | .005 | .10–.20 | 0 |
| pad | `supersaw`, `sawtooth` | 300–600 | 3–5 | .10–.40 | .50–1.0 | .3–.6 |
| stab / chord | `sawtooth` | 500–900 | 4–6 | .005 | .08–.12 | 0 |

A pad is the one case where a slow `lpa` is right: the sound should swell rather than strike. Every
other role wants `lpa` at about .005 so the transient is immediate.

## When the source is a sample

A filter can only remove overtones. It cannot add ones the recording does not contain, so the same
recipes give much less on sampled sources:

| Source, attack -> sustain centroid | static | with `lpenv(5)` |
|---|---|---|
| `sawtooth` | 696 -> 697 Hz | 2545 -> 330 Hz |
| `piano` (sampled) | 375 -> 424 Hz | 473 -> 289 Hz |
| `gm_flute` (soundfont) | 258 -> 405 Hz | 378 -> 289 Hz |

`gm_*` comes from webaudiofont: one mono sample per pitch range, pitch-shifted by playback rate,
with a looped sustain and **no velocity layers**. Under 1.5% of its energy sits above 2 kHz even
wide open. So:

- Do not expect rules 1 and 2 to rescue a `gm_*` voice. If a part has to be expressive, write it on
  a synth source instead.
- Sampled sounds already carry their own attack, so a filter envelope on top mostly just dulls
  them. Use a gentle one (`lpenv` 1–2) or none.
- To add bite to a sampled voice, layer a separate short transient rather than filtering:
  ```js
  $: s("gm_acoustic_bass").note("<c2 ab1>").gain(.8)
  $: s("white").struct("x ~ ~ ~").decay(.02).sustain(0).gain(.15).hpf(2000)
  ```
- Keep samples for what synthesis cannot do: drums, plucked and struck sounds, and non-harmonic
  instruments. Gongs, cymbals and bells have overtones that are *not* integer multiples of the
  fundamental, which is why `daluo`, `naobo` and `gong` must stay samples.

## Common mistakes

- **Accents written with `gain` only.** The most common cause of a track sounding mechanical. Every
  `gain` pattern on a synth voice should have a matching `lpenv`.
- **Forgetting `lps(0)`.** The filter opens and never closes, so there is no transient at all.
- **`lpa` too long on a non-pad.** Anything above about .02 smears the attack and the note loses its
  edge.
- **A filter envelope on drum samples.** They have their own transient; filtering only removes it.
- **`lpf` base set too high.** With the base already at 2000 Hz there is little room left to sweep,
  and the envelope stops being audible. Put the base low and let `lpenv` do the work.
- **The same envelope on every voice.** If bass, chords and lead all open and close together the
  track pumps. Vary `lpd` per voice.
