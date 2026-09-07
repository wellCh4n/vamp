# Theory checklist (run it once before writing and once after)

This material exists for one reason: to make the Strudel code you write *sound right*. Every file gives the rule, the reason, and the Strudel spelling. This one is the entry point: make the decisions below in order, then open the file that covers the details.

## Before writing: decide five things

1. **Key**: one root plus one scale, written as a string like `"C:major"`, and used by every `n().scale()` afterwards. Defaults: `C:major` / `G:major` for something bright, `A:minor` / `D:minor` for something wistful, and the pentatonics `C:major:pentatonic` / `A:minor:pentatonic` for Chinese style, electronic and lofi. -> `music-theory/scales-and-keys.md`
2. **Meter and tempo**: almost everything is 4/4, and `setcpm(bpm/4)` makes one cycle exactly one bar. Pick the tempo by genre. -> `music-theory/rhythm-and-meter.md`
3. **Chord progression**: four or eight bars per round, one chord per bar, written as `chord("<C Am F G>")`. When in doubt use the default progression below. -> `music-theory/chords-and-progressions.md`
4. **Voices and registers**: drums / bass (octave 2) / chords (octaves 3–4) / melody (octaves 4–5) / ornaments, each in its own space. -> `music-theory/bass-and-voice-leading.md`
5. **Structure**: at least intro -> main section -> variation, built with `arrange` or `<>`. Never loop one cycle from start to finish. -> `music-theory/arrangement.md`

## The default arrangement (use it when unsure; it will not go wrong)

```js
setcpm(100/4)
const key = "C:major"
const prog = "<C Am F G>"          // one chord per bar, four bars per round

$: s("bd ~ sd ~, hh*8").bank("RolandTR909").gain(".9 .6")
$: chord(prog).voicing().s("gm_epiano1").room(.3).gain(.6)
$: chord(prog).rootNotes(2).note().s("gm_acoustic_bass").clip(.9)
$: n("<[0 2 4 2] [0 ~ 4 7] [2 4 5 4] [4 2 0 ~]>").scale(key).s("piano").add(note(12))
```

Why it holds together: the harmony moves by the bar; the bass plays the root on the first beat of each bar; the first melody note of each bar (0, 0, 2, 4) is a chord tone of that bar's chord; every voice shares `key`; and the registers are separated.

## After writing: check against this list

- [ ] Is every melody and bass line written as degrees through `.scale(key)`? Has a hand-written `note("c# ...")` from another key slipped in?
- [ ] Does the bass play the root of the bar's chord at the start of each bar?
- [ ] Is the melody's first note in each bar a chord tone (degrees 0 / 2 / 4 over the tonic; see the table in the chords file for the others)?
- [ ] Are phrases 2 or 4 bars long, with the last one returning to the tonic (degree 0) or the fifth (degree 4)?
- [ ] Are two voices crowded into the same register while both moving?
- [ ] Are at most three voices moving at any moment? Is a filler like hats drowning the melody?
- [ ] Is there at least one `<>`, `every`, `sometimes` or `arrange` making the second pass differ from the first?
- [ ] Do the tempo and drum pattern match the genre the user named (see the drum library and the tempo table in the rhythm file)?

## The fix for each kind of feedback

| The user says | Most likely cause | Fix this first |
|---|---|---|
| dissonant / a note sounds wrong | notes outside the key, melody not on chord tones at strong beats, bass not following the roots | the first three items of the checklist |
| messy / too noisy | too many voices moving at once, overlapping registers, hats too dense or too loud | drop voices, separate registers, lower the hat gain |
| monotonous / no shape | one cycle looping from start to finish | vary with `<>`, section with `arrange`, add `every` |
| does not sound Chinese | a heptatonic major instead of a pentatonic, too many leaps, phrases not landing on zhi / yu | `music-theory/chinese-modes.md` |
| does not sound like <genre> | wrong tempo / drum pattern / chord types | the tempo table in the rhythm file + the drum library + the genre progressions in the chords file |
