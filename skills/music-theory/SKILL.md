---
name: music-theory
description: Keep the music you write musically sound: keys and scales, chord progressions, bass and voice leading, melody, rhythm/meter/tempo, arrangement, and Chinese pentatonic modes. This file holds the non-negotiables plus an index; the details live in the same directory, read on demand with read_doc("music-theory/<file>").
---

# Music theory skill

## The non-negotiables (satisfy these before writing any melody, harmony or bass)

1. **Fix the key, meter and tempo first**: `setcpm(bpm/4)` makes one cycle a bar of 4/4; pick the tempo by genre (lofi 70–90, pop 100–125, house 120–128, techno 125–140, dnb 170–175).
2. **Write melody and bass as degrees**: `n("0 2 4").scale("<root>:<scale>")`. Do not spell note names by hand inside `note()`. Use the same scale root for the whole piece and nothing falls outside the key. Pentatonic (`major:pentatonic` / `minor:pentatonic`) is the hardest to get wrong.
3. **Move harmony by the bar**: `chord("<C Am F G>").voicing()`, four or eight bars per round, one chord per bar (two at most). Do not end a round on I — use V or IV to push back to the top.
4. **Bass follows the roots**: derive it from the same progression with `chord(prog).rootNotes(2).note()`. The beat where the chord changes must play the root, and the rhythm follows the kick.
5. **Melody lands on chord tones on strong beats**: the first note of each bar and each beat is the root, third or fifth of the current chord (in C major: C = 0 2 4, Am = 5 0 2, F = 3 5 0, G = 4 6 1); everything else is a passing tone on a weak beat. Move mostly by step, and reverse direction after a leap. Phrases are 2 or 4 bars, a section ends back on degree 0 or 4, and the shape is A A B A'.
6. **Separate registers, control density**: bass at octave 2, chords at 3–4, melody at 4–5, ornaments at 5–6. No more than three voices move at once, and when one is dense (hats, an arpeggio) the others stay sparse.
7. **Have a structure**: at least intro -> main section -> variation, built with `arrange` or a per-track `mask("<0 1 1 1>/4")` that adds and removes voices section by section, so the second pass differs from the first.

## When to read the details

| Situation | Read |
|---|---|
| Writing a complete piece, or the user says it sounds bad / dissonant / messy / monotonous | `read_doc("music-theory/checklist.md")`: decisions to make first, a default arrangement, checks afterwards, and the fix for each kind of feedback |
| Choosing a key or scale, changing color, or modulating | `music-theory/scales-and-keys.md` |
| Choosing a progression, finding one by genre, or deciding which notes a melody should land on | `music-theory/chords-and-progressions.md` |
| Writing bass, assigning registers, or untangling crowded voices | `music-theory/bass-and-voice-leading.md` |
| Writing melody, developing a motif, or fixing a melody that sounds random | `music-theory/melody.md` |
| Meters other than 4/4, setting tempo, strong and weak beats, swing, Euclidean rhythms | `music-theory/rhythm-and-meter.md` |
| Sectioning, adding and removing voices, building a climax or a transition | `music-theory/arrangement.md` |
| Chinese style, pentatonic modes, gong-shang-jue-zhi-yu, percussion patterns | `music-theory/chinese-modes.md` |

One or two files per turn is usually enough, and there is no need to look up what the non-negotiables already say. The code in these files uses sounds and functions available in this project, so it can be adapted directly.

## File index

- `music-theory/checklist.md` — the theory checklist: five decisions to make first, a default arrangement for when you are unsure, checks to run afterwards, and the fix for each kind of user feedback
- `music-theory/scales-and-keys.md` — keys and scales: writing degrees, a table of scale colors, major/minor relationships, degrees to chords, modulation
- `music-theory/chords-and-progressions.md` — chords and progressions: symbols, function, progressions by genre, which degrees a melody should land on, giving chords momentum, common mistakes
- `music-theory/bass-and-voice-leading.md` — the three levels of bass, bass against the kick, a register table, voice leading, density control
- `music-theory/melody.md` — five melody rules, rhythm first, a table of motif-development techniques, register and timbre, common mistakes
- `music-theory/rhythm-and-meter.md` — cycles against meters, a tempo table by genre, strong and weak beats, pairing densities, swing / Euclidean rhythms / fills
- `music-theory/arrangement.md` — the minimum structure, three ways to section (`arrange` / `mask` / `every`), principles for adding and removing voices, arranging space and frequency
- `music-theory/chinese-modes.md` — the five pentatonic modes, the three heptatonic scales, melodic traits, thin harmony, usable sounds, writing percussion patterns, a complete skeleton
