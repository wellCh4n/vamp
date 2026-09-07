# Keys and scales

The rule in one line: **use one `scale` string for the whole piece and write every melody and bass line as degrees with `n()`**. Nothing can then fall outside the key.

## How to write it in Strudel

```js
const key = "D:minor"
$: n("0 2 4 7").scale(key)                // degrees start at 0: 0 = tonic, 2 = third, 4 = fifth, 7 = tonic an octave up
$: n("0 2 4 7").scale(key).add(note(12))  // the whole line an octave up (added in semitones with note)
$: n("0 2 4".add("<0 -3>")).scale(key)    // adding to the degrees moves to another step, still inside the key
```

- Degrees may be negative (going down) or greater than 7 (crossing octaves upward).
- The root inside `.scale()` can carry an octave: `"D3:minor"`, with 3 as the default.
- `.transpose(n)` moves by semitones and can leave the key; `.scaleTranspose(n)` moves by degrees and cannot. To transpose the whole piece, change the root of `key`.
- Spell note names by hand with `note("c e g")` only when you are certain every note is in the key (chord tones, say). Mixing the two styles invites mistakes, so prefer degrees throughout.

## Common scales and their colors

| Name (as Strudel spells it) | Color | Good for |
|---|---|---|
| `major` | bright, stable | pop, children's songs, anything cheerful |
| `minor` | wistful, soft | pop ballads, electronic, lofi |
| `major:pentatonic` | clean, Chinese / folk | Chinese style, ambient, lofi, any melody that must not go wrong |
| `minor:pentatonic` | rock / blues flavor | rock, funk, hip hop, electronic |
| `dorian` | minor but less sad, slightly jazzy | funk, house, jazz, cinematic |
| `mixolydian` | major with a rock / folk roughness | rock, funk, blues rock |
| `lydian` | floating, dreamlike | film scoring, ambient |
| `phrygian` | dark, Spanish / Middle Eastern | techno, metal, exotic |
| `blues` | blues | blues, jazz improvisation |

A pentatonic scale has only five notes, so no path through it produces an ugly minor second — it is the safest choice. In a heptatonic scale the 4th and 7th degrees (F and B in C major) clash with chords easily, so keep them on weak beats.

## How major and minor relate

- Relative keys share the same set of notes: C major = A minor, G major = E minor. `n("0")` differs between `C:major` and `A:minor` (C versus A), but the note set is identical.
- To make the same melody wistful, change `key` from `"C:major"` to `"C:minor"` (the parallel minor) and leave the degrees alone.

## Degrees and their chords (major)

| Degree n | Note (C major) | Chord over it | Function |
|---|---|---|---|
| 0 | C | C (I) | tonic, the most stable |
| 1 | D | Dm (ii) | subdominant |
| 2 | E | Em (iii) | a tonic substitute |
| 3 | F | F (IV) | subdominant |
| 4 | G | G (V) | dominant, wants to return to the tonic |
| 5 | A | Am (vi) | a tonic substitute with a minor color |
| 6 | B | Bm7b5 (vii°) | a dominant substitute, rarely used |

Writing a melody, the chord tones of the current bar's chord are the degrees of its root, third and fifth: C = 0/2/4, Am = 5/0/2, F = 3/5/0, G = 4/6/1. Land on those at strong beats and use the other degrees as passing tones.

## Modulation (advanced, rarely needed)

- The simplest options: `.scaleTranspose(2)` across a section boundary, or moving `key` up a fifth (C -> G).
- The "key change" common in electronic and pop music: raise the root of `key` by a semitone or a tone for the final section and leave everything else alone.
- Modulate only at section boundaries (where `arrange` splits sections), never in the middle of one.
