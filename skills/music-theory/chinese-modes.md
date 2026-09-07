# Chinese pentatonic modes and writing in a Chinese style

The rule in one line: **use the pentatonic scale, move by step with a reversal after any leap, end phrases on gong / zhi / yu, keep thirds out of the harmony, alternate dense and sparse rhythms, and use dizi, zheng and percussion sounds.**

## The pentatonic scale and its five modes

The five notes are gong, shang, jue, zhi and yu, corresponding to degrees 0 1 2 3 4 of the major pentatonic (in C gong: C D E G A). In Strudel always write `scale("<gong note>:major:pentatonic")`; **the mode is decided by which note the melody lands on**, not by changing the scale.

| Mode | Tonic | Degree (gong = 0) | Color | How to write it |
|---|---|---|---|---|
| gong | gong | 0 | bright, upright | phrases end on 0, `scale("C:major:pentatonic")` |
| shang | shang | 1 | slightly dark, archaic | phrases end on 1 |
| jue | jue | 2 | rare, unmoored | phrases end on 2 |
| zhi | zhi | 3 | bright and open, the most common in folk song | phrases end on 3 |
| yu | yu | 4 | soft, melancholy, Jiangnan | phrases end on 4; equivalent to `A:minor:pentatonic` ending on 0 |

```js
const key = "D:major:pentatonic"           // the D gong system: D E F# A B
$: n("<[0 1 2 1] [3 2 1 0] [4 3 2 1] [2 1 0 ~]>").scale(key).add(note(12)).s("gm_flute").clip(.9)   // gong mode, phrases end on 0
$: n("<[3 4 5 4] [3 2 1 3] [4 5 7 5] [4 3 3 ~]>").scale(key).add(note(12)).s("gm_flute").clip(.9)   // zhi mode, phrases end on 3
```

- Degrees 5, 6 and 7 are gong, shang and jue an octave up; negative degrees go down.
- Changing the gong system (modulating) means changing the root of `key`, most often up a fifth (C gong -> G gong) or down a fifth (C gong -> F gong).

## Heptatonic scales (adding the auxiliary tones)

Adding two "auxiliary tones" to the pentatonic gives a heptatonic scale, and which two you add gives one of three traditional systems:

| System | Auxiliary tones | Equivalent to | Strudel |
|---|---|---|---|
| qingyue | qingjue (4) + biangong (7) | major | `scale("C:major")` |
| yayue | bianzhi (#4) + biangong (7) | Lydian | `scale("C:lydian")` |
| yanyue | qingjue (4) + run (b7) | Mixolydian | `scale("C:mixolydian")` |

Auxiliary tones work only as passing tones on weak beats — never on a strong beat or at the end of a phrase. Day to day, the pentatonic alone is enough; the auxiliary tones are there for flavor.

## Melodic traits

- **Mostly stepwise**: adjacent notes in the pentatonic are a major second or a minor third apart, so simply walking along it sounds Chinese; consecutive leaps turn it into some other style.
- **Reverse after a leap**: after a leap of a fourth or more, the next note moves back.
- **Typical structural motions**: zhi -> gong (3 -> 0 or 3 -> 5), yu -> gong (4 -> 5), shang -> gong (1 -> 0). Use these at phrase endings.
- **Ornaments**: slides and appoggiaturas are characteristic of Chinese instruments. In Strudel, approximate them with a short grace note: `n("[2 3]@1 ...")` puts a brief neighbor tone before the main note, and a dizi trill is `.vib("4:.2")`.
- **Rhythm**: a slow section wants long notes and a free feel (`@2`, `@3` to stretch, `~` for space), a fast one dense eighths and percussion strokes. Phrases usually come in fours — qi, cheng, zhuan, he — where the third varies and the fourth settles back.
- **Register**: write flute-like sounds higher (`.add(note(12))` or `scale("D5:...")`).

## Harmony

Traditional Chinese music is largely monophonic, so keep the harmony thin:

- Stack fourths and fifths, or use bare fifths, rather than third-stacked major and minor triads: `note("[c3,g3]")`, `note("[d3,a3,e4]")`.
- Or alternate just gong and zhi: `chord("<C G>")` — though removing the third before `.voicing()` is awkward, so it is simpler to write it out: `note("<[c3,g3,d4] [g2,d3,a3]>")`.
- Replace chords with a pentatonic arpeggio: `n("0 3 4 7").scale(key).s("gm_koto")` (a zheng figure).
- In the bass, a held gong or zhi (`clip(1)`) as a drone is enough.

## Sounds to use (available in this project)

| Role | Sound |
|---|---|
| lead melody | `gm_flute`, `gm_shakuhachi` (close to xiao), `gm_pan_flute` |
| plucked / zheng | `dantranh` (the Vietnamese zither, close to guzheng), `dantranh_tremolo`, `dantranh_vibrato`, `gm_koto`, `gm_dulcimer` (close to yangqin) |
| bowed | `gm_fiddle`, `gm_violin` (stand-ins where there is no erhu sample) |
| percussion | Beijing opera `bangu` (bangu drum), `xiaoluo` (small gong), `daluo` (large gong), `naobo` (cymbals); plus `gong`, `gong2`, `woodblock`, `gm_taiko_drum`, `gm_woodblock` |
| bed | `gm_pad_warm`, `gm_string_ensemble_1` at low volume |

## Luogu jing (writing the percussion)

Beijing opera percussion is in 2/4 or free meter, with four instruments dividing the work: the bangu drum (`bangu`) leads with a fine-grained rhythm, the small gong (`xiaoluo`) takes the weak beats, the large gong (`daluo`) the strong ones, and the cymbals (`naobo`) fall between the large gong strokes.

```js
setcpm(90/2)                                          // 2/4, two beats per cycle
$: s("bangu*8").n("<0 5 12 20>*8").gain("1 .5 .7 .5")   // the bangu, fine-grained
$: s("daluo ~ ~ ~").n(3)                               // the large gong on the strong beat
$: s("~ xiaoluo ~ xiaoluo").n("<7 12>")                // the small gong on weak beats
$: s("~ ~ naobo ~").n(10)                               // the cymbals in between
```

- The common "cang cai cang cai" figure: cang = large gong plus cymbals, cai = small gong. `s("[daluo,naobo] xiaoluo [daluo,naobo] xiaoluo")`.
- Each instrument's `n` picks a different stroke (force, position), so changing `n` changes the timbre.
- A single large gong stroke ends a section: `.mask("<0 0 0 1>")`.

## A complete skeleton

```js
setcpm(80/4)
const key = "D:major:pentatonic"
$: note("<[d2,a2] [d2,a2] [g2,d3] [a2,e3]>").s("gm_pad_warm").clip(1).gain(.4).room(.6)      // a bed of bare fifths
$: n("<[0 3 4 7] [0 3 4 7] [-2 0 3 4] [-1 1 3 4]>").scale(key).s("dantranh").gain(.5)        // a zheng figure
$: n("<[5 ~ 6 5] [4 3 ~ 3] [4 5 7 5] [4 3 3 ~]>").scale(key).add(note(12)).s("gm_flute").clip(.9).vib("4:.15").room(.4)   // a zhi-mode melody
$: s("~ xiaoluo ~ [xiaoluo daluo]").n("<7 12>").gain(.5).mask("<0 1 1 1>")                   // gongs entering from the second bar
```
