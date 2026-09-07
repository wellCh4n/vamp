# Chords and progressions

The rule in one line: **a progression of four or eight bars with one chord per bar, written with `chord("<...>")`, that every other voice follows.**

## How to write it in Strudel

```js
const prog = "<C Am F G>"                       // one chord per bar; "<C@2 F G>" gives C two bars
$: chord(prog).voicing().s("gm_epiano1")         // voices the chords automatically, with smooth voice leading
$: chord(prog).voicing().anchor("c5").mode("below")   // keep every voiced note below c5
$: chord(prog).rootNotes(2).note().s("gm_acoustic_bass") // bass on the roots, octave 2
$: n("0 1 2 3").chord(prog).voicing()                    // as an arpeggio: 0 1 2 3 index the voiced notes
$: chord(prog).voicing().arp("0 [0,2] 1 2")              // another way to arpeggiate
```

- Two chords in a bar: `"<[C G] [Am F]>"`. Do not go denser than that — chords changing too fast leave the melody behind.
- Chord symbols: `C` major triad, `Cm` minor triad, `C7` dominant seventh, `C^7` major seventh, `Cm7` minor seventh, `Cm7b5` half-diminished, plus `Csus`, `Cadd9`, `C6`, `C9`. Use sevenths for a jazzy feel, triads for pop and rock, and `m7` / `^7` / `add9` for electronic and lofi.
- Triads by function: **tonic (T)** I, vi, iii are stable; **subdominant (S)** IV, ii move away; **dominant (D)** V, vii° are tense and want to return to I. The basic shape of a progression is T -> S -> D -> T.

## Common progressions by genre (copy them directly)

Written in C major / A minor; when changing key, move every chord by the same distance.

| Genre | Progression | Notes |
|---|---|---|
| pop / all-purpose | `<C G Am F>` | I–V–vi–IV, the most common of all |
| pop (wistful) | `<Am F C G>` | vi–IV–I–V |
| ballad / folk | `<C Am F G>` | I–vi–IV–V, the fifties progression |
| canon | `<C G Am Em F C F G>` | eight bars |
| jazz | `<Dm7 G7 C^7 C^7>` | ii–V–I with sevenths |
| jazz (minor) | `<Dm7b5 G7 Cm7 Cm7>` | ii°–V–i |
| blues (12 bars) | `<C7 C7 C7 C7 F7 F7 C7 C7 G7 F7 C7 G7>` | dominant sevenths throughout |
| lofi / neo-soul | `<C^7 Am7 Dm7 G7>` or `<F^7 Em7 Dm7 C^7>` | major and minor sevenths, slow |
| house / electronic | `<Am F C G>` or `<Am Am F G>` | few chords, the movement comes from the sounds |
| deep house | `<Am7 Dm7>` | two chords back and forth |
| rock | `<C F G F>` or `<Am C G D>` | triads, for power |
| Spanish / exotic | `<Am G F E>` | the Andalusian cadence |
| film / epic | `<Am F C G>` slow, or `<Am Em F C>` | add a string pad |
| Chinese style | see `music-theory/chinese-modes.md` | pentatonic, with thirds used sparingly |

## Chord tones (the degrees a melody should land on at strong beats)

Counted as degrees of C major, `scale("C:major")`:

| Chord | Chord-tone degrees | Degrees to avoid on strong beats |
|---|---|---|
| C | 0 2 4 | 3 |
| Dm | 1 3 5 | 0 |
| Em | 2 4 6 | 3 |
| F | 3 5 0 | 2, 6 |
| G | 4 6 1 | 0 (unless it is a G7 heading back to C) |
| Am | 5 0 2 | 6 |

The rule: the melody's first note in each bar and on each beat should be a chord tone; the degrees in the "avoid" column belong on weak beats as passing tones and must not be held.

## Giving chords momentum

- Rhythmize them: `chord(prog).voicing().struct("x ~ x x ~ x ~ x")` fires the chords on a rhythm rather than as one long note per bar.
- Change the voicing per bar: `.voicing()` already smooths the voice leading; for a more leaping feel use `.anchor("<c4 e4>")`.
- Add ornaments: `sometimesBy(.3, x => x.add(note(12)))` jumps an octave now and then, and `.off(1/8, x => x.add(note(7)))` adds a delayed fifth.
- Contrast the sections: triads in the main section, sevenths or add9 in the chorus; or an intro of bass and drums only, with the chords entering in the second section.

## Common mistakes

- Four chords per bar: too dense, the melody cannot keep up, and the result sounds cluttered.
- Chords and bass written independently: the bass must be derived from the same `prog` with `.rootNotes()`, or the two will clash.
- Ending the progression on I: a round that ends on the tonic comes to a halt and has no push when it loops back. End on V or IV instead (`<C Am F G>`, not `<G F Am C>`).
- A minor piece using a major V without resolving: in minor, V is often `E7` (harmonic minor) to strengthen the resolution, as in `<Am F Dm E7>`.
