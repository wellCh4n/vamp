# Rhythm, meter and tempo

The rule in one line: **one cycle is one bar; `setcpm(bpm/beats)`; strong beats on 1 and 3, backbeat on 2 and 4; pair dense voices with sparse ones.**

## Cycles and meter

Strudel has no notion of a time signature: however many equal units you put in a cycle is how many beats it has.

| Meter | setcpm | Basic drum pattern |
|---|---|---|
| 4/4 (default) | `setcpm(bpm/4)` | `s("bd ~ sd ~, hh*8")` |
| 3/4 (waltz) | `setcpm(bpm/3)` | `s("bd hh hh")` or `s("bd ~ ~, ~ hh hh")` |
| 6/8 (swung, folk) | `setcpm(bpm/2)`, with bpm counted in dotted quarters | `s("[bd hh hh] [sd hh hh]")` |
| 2/4 (marches, Beijing opera percussion) | `setcpm(bpm/2)` | `s("bd sd")` |
| 5/4 | `setcpm(bpm/5)` | `s("bd hh sd hh hh")` |
| 7/8 | `setcpm(bpm/7)`, with bpm counted in eighths | `s("bd hh sd hh bd hh hh")` (grouped 3+2+2) |

- Polymeter: `"{bd sd hh}%4"` steps three notes across four beats, returning to the start after a few cycles. Use it on one ornamental voice only and keep the main voices in 4/4.
- The meter stays the same for the whole piece unless the user asks otherwise.

## Tempo table (bpm; in 4/4 use `setcpm(bpm/4)`)

| Genre | bpm | Genre | bpm |
|---|---|---|---|
| ambient / downtempo | 60–90 | house | 120–128 |
| lofi hip hop | 70–90 | techno | 125–140 |
| hip hop / trap | 85–100 (trap is often written at 140 half-time) | trance | 130–140 |
| R&B / neo-soul | 70–95 | dubstep | 140 (half-time feel) |
| pop | 100–125 | drum and bass / jungle | 165–175 |
| funk / disco | 100–120 | footwork | 155–165 |
| reggae | 70–90 | rock | 110–140 |
| bossa nova | 120–140 (it feels half that) | punk / metal | 160–200 |
| waltz in 3/4 | 90–180 (counted in quarters) | Chinese folk | 60–110 |

When in doubt, 100–110.

## Strong and weak beats

Four beats to a bar of 4/4: **strong, weak, medium, weak**.

- The kick lands on 1 and 3 (or on every downbeat), the snare or clap on 2 and 4 (the backbeat). This underpins nearly all pop and electronic music: write it first, then decorate.
- The important notes of the melody and the chords land on 1, and secondarily on 3.
- Make accents with `gain` rather than by adding notes: `s("hh*8").gain("1 .6 .8 .6 1 .6 .8 .6")` or `.gain(".9 .6")` (two values cycle across events automatically).
- Weak-beat entries and syncopation (notes falling between beats) create push: `"~ bd ~ bd"`, `"bd ~ [~ bd] ~"`.

## Pairing densities

One dense layer against one sparse layer is the basic principle of a good groove.

| Layer | Typical density |
|---|---|
| kick | once per beat or every two beats |
| snare | once every two beats (2 and 4) |
| hats | eighths or sixteenths (the densest layer) |
| bass | with the kick, or eighths |
| chords | once or twice per bar, or held |
| melody | eighths with rests |

- Three or more layers running sixteenths is what "messy" means.
- When the hats are too dense, push them down with `.gain(.4)` or `.hpf(6000)` so they do not cover the melody.

## Useful rhythmic techniques

```js
$: s("bd*2, ~ sd, hh*8").bank("RolandTR909").swingBy(1/3, 4)   // swing: push the even eighths later; common in hip hop and house
$: s("hh(5,8), bd(3,8)")                                        // Euclidean rhythm: k onsets spread evenly over n slots, naturally musical
$: s("bd sd").every(4, x => x.fast(2))                          // double up every fourth bar as a fill
$: s("hh*8").sometimesBy(.2, x => x.ply(2))                     // an occasional thirty-second double
$: s("bd ~ sd ~").late(.01)                                     // nudge a whole track late to humanize it
$: s("sd").struct("~ x ~ [x x]")                                // keep the rhythm and the sound in separate expressions
```

- Euclidean values worth knowing: `(3,8)` for a triplet feel / tresillo, `(5,8)` for cinquillo, `(7,16)` for a denser Latin feel, `(3,4)` for simple downbeats.
- Change something every 4 or 8 bars (a fill, dropping a kick, adding a crash): `every(4, ...)`, `"<... ...!3 fill>"`.

## Working with the genre drum library

The drum library at `examples/drums/<genre>.md` holds ready-made, genre-accurate rhythms — reach for those first, then adjust tempo and swing with the table above. They use the default drums `bd sd hh oh cp rim`, so `.bank()` swaps the drum-machine sound.
