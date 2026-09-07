---
name: strudel
description: Write live-coding music with Strudel (the JavaScript port of Tidal Cycles). This file is a cheatsheet plus a doc index; the detailed syntax, the parameters and examples of 443 functions, 32 example tunes and 492 drum patterns sorted by genre all live in the same directory, read on demand with the read_doc / search_docs tools.
---

# Strudel skill

## How to use this material (progressive reading)

This file is already in your context, and the cheatsheet below covers 90% of everyday writing, so **write directly whenever you can**. Look something up only in these situations:

| Situation | What to do |
|---|---|
| Unsure about a function's parameters, aliases or usage | `search_docs("<function name>")`, or read a single heading with `read_doc("reference/controls.md", heading="lpf")` |
| Wondering whether a function for something exists | `read_doc("reference/index.md")` (one line per function), or `search_docs("<keyword>")` |
| Want a sound but are unsure the name exists (a `gm_*`, whether a drum machine has an `oh`, what is in Dirt-Samples) | `read_doc("reference/sounds.md", heading="GM soundfonts")` and friends; the headings are listed in the index at the end |
| The user names a genre (funk, house, dnb, bossa, reggaeton, …) | Pick the genre from the drum-pattern list at the end, take a ready-made pattern with `read_doc("examples/drums/<genre>.md")`, then add bass and chords |
| Want a reference for a whole arrangement, sound choices or harmony | `read_doc("examples/tunes.md", heading="<tune name>")`; the tune names are listed at the end |
| Want to work through a topic systematically (mini-notation details, samples, synths, effect chains, tonal, randomness, …) | `read_doc("learn/<topic>.md")`; the file list is at the end |
| Idiomatic patterns for rhythm / arpeggios / microrhythms | `read_doc("recipes/rhythms.md")` and friends |

Rules:
- Decide what you are looking for before looking; one to three files per turn is usually enough. Do not read the whole directory.
- Example code can be adapted freely, but check whether the samples it uses are available in this project (see "This project's environment").
- Reply in the user's language.

## This project's environment

- The code runs in the browser through the Strudel REPL. The `set_code` tool replaces the whole editor content and plays it.
- Preloaded sounds: drum-machine samples (`bank("RolandTR909")` and the like), `piano`, VCSL instruments, uzu-drumkit, the Dirt-Samples miscellany (`casio jazz metal insect wind east crow space numbers`, …), GM soundfonts (`gm_*`), and Beijing opera percussion (`bangu xiaoluo daluo naobo`).
- Do not call `samples()` to load external resources unless the user asks for it. MIDI, OSC, microphone and mouse signals are unavailable.
- A pianoroll / scope / spectrum is already shown below the editor, so the code needs no `_pianoroll()`, `_scope()` or similar visualization calls.
- Trigger-time errors (a missing sound, say) come back in the `set_code` result; read the message, fix it, and call the tool again.

## Core concepts

- A **pattern** is a function of time: query a span and it returns the events in it. `note()`, `s()`, `.lpf()` and the rest all return patterns, so calls chain.
- A **cycle** is the unit of time, one cycle being 2 seconds by default (30 cpm). Everything in a sequence is squeezed into one cycle, so a longer sequence makes each event faster.
- Effect parameters are sampled once, **at the instant the event fires** (except continuous things like ADSR, pitch env, vib, tremolo and phaser). To make a signal move continuously, add events with `.segment(n)`.
- `setcpm(bpm/4)` makes one cycle a bar of 4/4; `setcps(1)` means one cycle per second.

## Mini-notation (the little language inside double quotes or backticks)

| Syntax | Example | Meaning |
|---|---|---|
| space | `"bd sd hh cp"` | a sequence, splitting one cycle evenly |
| `:n` | `"hh:0 hh:1"` | pick sample n; inside `s` you can also write `bd:1:0.5` (the third field is gain) |
| `~` / `-` | `"bd ~ hh -"` | rest |
| `[ ]` | `"bd [hh hh] sd"` | a sub-sequence, subdividing the slot it occupies |
| `*n` / `/n` | `"hh*4"`, `"[c a f e]/2"` | speed up / slow down, fractions allowed |
| `< >` | `"<bd sd hh>"`, `"<a b c d>*8"` | one per cycle, same as `"[bd sd hh]/3"` |
| `,` | `"bd*2, hh*4"`, `"[c,e,g]"` | parallel / chord |
| `@n` / `_` | `"c@3 eb"`, `"c _ _ eb"` | elongate |
| `!n` / `!` | `"c!2 e"` | replicate without speeding up |
| `?` / `?0.2` | `"hh*8?"` | drop at random (50% by default) |
| `\|` | `"bd \| hh \| sd"` | pick one per cycle at random |
| `(k,n,r)` | `"bd(3,8)"`, `"bd(3,8,2)"` | Euclidean rhythm |
| `{ }` / `{ }%n` | `"{c eb g, c2 g2}%4"` | polymeter, aligned by step |
| `.` | `"bd sd . hh hh hh"` | grouping, same as `"[bd sd] [hh hh hh]"` |

The function equivalents: `*2` = `.fast(2)`, `/2` = `.slow(2)`, `(3,8)` = `.euclid(3,8)`, `?` = `.degrade()`, `a b, c d` = `stack()`, `<a b>` = `cat()`, `a b` = `seq()`, `a@3 b` = `stepcat([3,a],[1,b])`.

## Sound

- `s("bd hh sd oh")` / `sound()`. The default drums: `bd sd rim cp hh oh cr rd ht mt lt sh cb tb perc misc fx`, with `.bank("RolandTR909")` (commonly `RolandTR808 RolandTR909 RolandTR707 RolandTR505 AkaiLinn RhythmAce ViscoSpaceDrum CasioRZ1`).
- Miscellaneous samples: `casio insect wind jazz metal east crow space numbers`; piano `piano`; GM instruments such as `gm_electric_guitar_muted gm_acoustic_bass gm_synth_bass_1 gm_synth_strings_1 gm_xylophone gm_voice_oohs gm_accordion gm_flute gm_lead_6_voice gm_epiano1 gm_pad_2_warm` (`gm_` plus the GM instrument name, lowercase with underscores).
- Beijing opera percussion `bangu` (bangu drum), `xiaoluo` (small gong), `daluo` (large gong), `naobo` (cymbals) are single-stroke samples picked with `n`, e.g. `s("bangu*4, ~ xiaoluo ~ daluo").n("<0 3 7>")`. For a guzheng, use the Vietnamese zither `dantranh` (`dantranh_tremolo`, `dantranh_vibrato`) or `gm_koto`; for gongs and drums `gong gong2 woodblock gm_taiko_drum`; yangqin `gm_dulcimer`, suona `gm_shanai`, xiao `gm_shakuhachi`, dizi `gm_pan_flute`. Chinese pentatonic: `.scale("D:major:pentatonic")`.
- Synths: `sine sawtooth(saw) square triangle(tri) supersaw`, noise `white pink brown crackle`, ZZFX `z_sawtooth z_tan z_noise z_sine z_square`. `note()` without `s()` defaults to `triangle`.
- `n("0 1 [4 2]").s("jazz")` picks the sample index; with `.scale()` it is a scale degree.
- Synth parameters: `.noise(.2)`; FM `.fm(4).fmh(1.5)` with `fmattack fmdecay fmsustain fmenv`; vibrato `.vib("4:.5")`; supersaw `.unison(7).detune(.2).spread(.5)`.

## Pitch

- `note("c e g b")`, with `#` to sharpen and `b` to flatten, octaves as `c2 e3` (3 when omitted). MIDI numbers work too: `note("48 52")`; and `freq(440)`.
- Chords: `note("[c,e,g]")`.
- Scales: `n("0 2 4 6").scale("C:minor")`, spelled `root[octave]:type`, e.g. `"A2:minor:pentatonic"`, and patternable as `.scale("<C:major D:mixolydian>/4")`. Common ones: `major minor dorian mixolydian lydian pentatonic minor:pentatonic major:pentatonic blues`.
- `.transpose(7)`, `.scaleTranspose(2)`, `.add("<0 5 7>")`.
- Chord symbols: `chord("<C^7 A7b13 Dm7 G7>").voicing()`, with `.anchor("c5")` and `.mode("below")`; `n("0 1 2 3").chord("<C Am F G>").voicing()` as an arpeggio; `"<C^7 Dm7>".rootNotes(2).note()` for a bass line — `chord()` and `.note()` are alternative wrappers, so use exactly one: `chord(prog).rootNotes(2)` or `prog.rootNotes(2).note()`. Combining them double-wraps the value into `{note:{note:"C2"}}`, which makes no sound; `.arp("0 [0,2] 1")` to arpeggiate.
- `.piano()`: the piano sound plus automatic panning by pitch.

## Effects (every parameter takes a number, mini-notation or a signal; most support the `a:b:c` shorthand)

- Filters: `lpf(freq)` (the second field of `"1000:10"` is lpq), `lpq`, `hpf/hpq`, `bpf/bpq`, `ftype("12db|ladder|24db")`, `vowel("a e i o")`; filter envelope `lpa lpd lps lpr lpenv` (same for hp* and bp*).
- Envelopes: `attack decay sustain release` (`att dec sus rel`) or `.adsr(".1:.1:.5:.2")`; a pitch envelope `.penv(12).pdec(.5).pcurve(1)` makes a kick: `note("g1*4").s("sine").pdec(.5).penv(32)`.
- Dynamics: `gain` (`"[.25 1]*4"` for accents), `velocity`, `postgain`, `compressor("thresh:ratio:knee:att:rel")`.
- Space: `pan(0..1)`, `jux(rev)` / `juxBy(.5, rev)`, `delay(level)` (`"0.8:0.125:0.8"` = level:time:feedback), `delaytime delayfeedback`, `room(level)` (the second field of `"0.9:4"` is size), `roomsize`, `dry`, `phaser`, `tremolo`.
- `orbit(n)`: one orbit shares a single delay / reverb, so use separate orbits for different reverb settings; `duckorbit duckattack duckdepth` for sidechaining.
- Distortion: `distort("8:.4")` (`dist`), `crush(4..16)`, `coarse(n)`.
- Sample control: `speed` (negative plays backwards), `begin/end`, `clip` (`legato`), `cut(1)` for mutual exclusion within a group (a closed hat cutting an open one), `loop loopBegin loopEnd`, `chop(n)`, `striate(n)`, `slice(n,"0 1 2 3")` / `splice`, `loopAt(cycles)` / `fit()`, `scrub`, `stretch`, `hurry`.
- Signal chain order: gain/ADSR -> lpf -> hpf -> bpf -> vowel -> coarse -> crush -> distort -> tremolo -> compressor -> pan -> phaser -> postgain -> delay/room -> orbit -> duck. Writing the same effect twice means the later one wins.

## Signals and randomness

- Ranged 0..1: `sine cosine saw tri square rand perlin`; ranged -1..1: `sine2 saw2 tri2 square2 rand2`; `irand(n)` for integers, `brand` for 0/1.
- `run(n)` = `"0 1 … n-1"`, `binary(5)`.
- `.range(min,max)`, `.rangex(min,max)` (exponential — use it for frequencies), `.segment(n)`, and `.slow(4)` to change the LFO rate.

```js
s("hh*16").gain(sine)
note("c2*8").s("sawtooth").lpf(sine.range(100, 2000).slow(4))
n(irand(8)).struct("x x*2 x x*3").scale("C:minor")
```

## Common pattern functions

- Time: `fast slow early late rev palindrome iter ply segment euclid euclidRot swingBy(1/3, 4) linger zoom compress inside outside chunk ribbon press brak cpm`.
- Structure: `struct("x ~ x x")`, `mask("1 0 1 1")`, `beat("0,4,8,11",16)`, `shuffle(n)`, `scramble(n)`, `arrange([4, a],[2, b])`, `stack cat seq polymeter stepcat`, `silence`, `hush()`.
- Conditionals: `every(4, x=>x.rev())` (`firstOf`), `lastOf`, `when`, `pick pickmod inhabit squeeze`.
- Layering: `superimpose(fn)`, `layer(fn1, fn2)`, `off(1/8, x=>x.add(7))`, `echo(4, 1/8, .5)`, `echoWith`.
- Randomness: `degrade degradeBy(p) sometimes often rarely almostNever almostAlways sometimesBy(p, fn) someCycles choose wchoose chooseCycles`.
- Arithmetic: `add sub mul div round floor range rangex`, e.g. `n("0 2 4".add("<0 3 4 0>")).scale("C:major")`.

## Multiple tracks and structure

```js
setcpm(90/4)   // 90 bpm, one cycle = one bar

$: sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")
$: note("<[c2 c3]*4 [bb1 bb2]*4>").sound("gm_synth_bass_1").lpf(800)
_$: n("0 2 4").scale("C:minor").s("piano")   // a leading _ mutes this track
```

- `$:` starts an independent track per line, and `name: pattern` works too; in plain code you can also write `stack(a, b)`.
- Give the music some shape: `gain` for accents, `< >` for bar-to-bar variation, `every` / `sometimes` for change, `lpf` / `room` / `delay` for space, and `arrange` for sections.

A full example:

```js
setcpm(60)
$: n("0 [2 4] <3 5> [~ <4 1>]".add("<0 [0,2,4]>"))
  .scale("C5:minor").sound("gm_xylophone").room(.4).delay(.125)
$: note("c2 [eb3,g3]".add("<0 <1 -1>>"))
  .adsr("[.1 0]:.2:[1 0]").sound("gm_acoustic_bass").room(.5)
$: n("0 1 [2 3] 2").sound("jazz").jux(rev)
```

```js
// Filter envelope + randomness + drums
note("[c eb g <f bb>](3,8,<0 1>)".sub(12))
  .s("<sawtooth>/64")
  .lpf(sine.range(300,2000).slow(16))
  .lpa(0.005).lpd(perlin.range(.02,.2)).lps(perlin.range(0,.5).slow(3))
  .lpq(sine.range(2,10).slow(32)).lpenv(perlin.range(1,8).slow(2))
  .release(.5).ftype('24db').room(1)
  .juxBy(.5,rev).sometimes(add(note(12)))
  .stack(s("bd*2").bank('RolandTR909'))
  .gain(.5).fast(2)
```

<!-- generated:start -->
## File index (generated)

### Tutorials and topics (read workshop in order; look up learn by topic)

- `workshop/getting-started.md` — Getting Started: Welcome to the Strudel documentation pages!
- `workshop/first-sounds.md` — First Sounds: This is the first chapter of the Strudel Workshop, nice to have you on board!
- `workshop/first-notes.md` — First Notes: Let's look at how we can play notes numbers and notes play notes with numbers Try out different numbers!
- `workshop/first-effects.md` — First Effects: We have sounds, we have notes, now let's look at effects!
- `workshop/pattern-effects.md` — Pattern Effects: Up until now, most of the functions we've seen are what other music programs are typically capable of: sequencing sounds, playing notes, con
- `workshop/recap.md` — Recap: This page is just a listing of all functions covered in the workshop!
- `learn/getting-started.md` — Getting Started: Welcome to the Strudel documentation pages!
- `learn/code.md` — Coding syntax: Let's take a step back and understand how the syntax in Strudel works.
- `learn/mini-notation.md` — Mini Notation: Just like [Tidal Cycles](https://tidalcycles.org/), Strudel uses a so called "Mini-Notation", which is a custom language that is designed fo
- `learn/notes.md` — Notes: Pitches are an important building block in many musical traditions.
- `learn/sounds.md` — Sounds: We can play sounds with s, in two different ways: - s can trigger audio samples, where a sound file is loaded in the background and played b
- `learn/samples.md` — Samples: Samples are the most common way to make sound with tidal and strudel.
- `learn/synths.md` — Synths: In addition to the sampling engine, strudel comes with a synthesizer to create sounds on the fly.
- `learn/effects.md` — Audio effects: Whether you're using a synth or a sample, you can apply any of the following built-in audio effects.
- `learn/lfo.md` — Low-frequency oscillators (LFO): A low frequency oscillator (or short LFO) is a common way on synthesizers to continuously modulate various signals.
- `learn/signals.md` — Signals: Signals are patterns with continuous values, meaning they have theoretically infinite steps.
- `learn/time-modifiers.md` — Time Modifiers: The following functions modify a pattern temporal structure in some way.
- `learn/conditional-modifiers.md` — Conditional Modifiers: lastOf Applies the given function every n cycles, starting from the last cycle.
- `learn/random-modifiers.md` — Random Modifiers: These methods add random behavior to your Patterns.
- `learn/accumulation.md` — Accumulation Modifiers: superimpose Superimposes the result of the given function(s) on top of the original pattern: layer Layers the result of the given function(s
- `learn/factories.md` — Creating Patterns: The following functions will return a pattern.
- `learn/stepwise.md` — Stepwise patterning: This is a developing area of strudel, and behaviour might change or be renamed in future versions.
- `learn/tonal.md` — Tonal Functions: These functions use [tonaljs](https://github.com/tonaljs/tonal) to provide helpers for musical operations.
- `learn/visual-feedback.md` — Visual Feedback: There are several function that add visual feedback to your patterns.
- `learn/metadata.md` — Music metadata: You can optionally add some music metadata in your Strudel code, by using tags in code comments: Like other comments, those are ignored by S
- `learn/strudel-vs-tidal.md` — Strudel vs Tidal: This page is dedicated to exisiting tidal users, giving an overview of all the differences between Strudel and Tidal.
- `learn/faq.md` — Frequently Asked Questions: This page contains frequently asked questions, with answers.
- `recipes/recipes.md` — Recipes: This page shows possible ways to achieve common (or not so common) musical goals.
- `recipes/rhythms.md` — Build Rhythms: Note: - this has been (partly) translated from https://tidalcycles.org/docs/patternlib/howtos/buildrhythms - this only sounds good with samp
- `recipes/arpeggios.md` — Build Arpeggios: Note: This has been (partly) translated from https://tidalcycles.org/docs/patternlib/howtos/buildarpeggios Build Arpeggios This page will te
- `recipes/microrhythms.md` — Microrhythms: see https://strudel.cc/?zMEo5kowGrFc Microrhythms Inspired by this [Mini-Lecture on Microrhythm Notation](https://www.youtube.com/watch?v=or
- `understand/cycles.md` — Understanding Cycles: The concept of cycles is very central to be able to understand how Strudel works.
- `understand/pitch.md` — Understanding Pitch: Let's learn how pitch works!
- `understand/voicings.md` — Understanding Chord Voicings: Let's dig deeper into how chords and voicings work in strudel.
- `functions/intro.md` — JavaScript API: Let's learn all about functions to create and modify patterns.
- `functions/value-modifiers.md` — Control Parameters: Besides functions that control time, we saw earlier that functions like note and cutoff control different parameters (short params) of an ev

### Function reference (reference/; start with reference/index.md, or search a function name with search_docs)

- `reference/controls.md` (208 entries): s, wt, wtenv, wtattack, wtdecay, wtsustain, wtrelease, wtrate, wtsync, wtdepth, wtshape, wtdc, wtskew, warp, warpattack, warpdecay, warpsustain, warprelease, warprate, warpdepth, warpshape, warpdc, warpskew, warpmode, wtphaserand, warpenv, warpsync, source, n, i, note, accelerate, velocity, gain, postgain, amp, fmh, fmi, fmenv, fmattack, fmwave, fmdecay, fmsustain, fmrelease, bank, chorus, attack, decay, sustain, release, bpf, bpq, begin, end, loop, loopBegin, loopEnd, crush, coarse, tremolo, tremolosync, tremolodepth, tremoloskew, tremolophase, tremoloshape, drive, duckorbit, duckdepth, duckonset, duckattack, byteBeatExpression, byteBeatStartTime, channels, pw, pwrate, pwsweep, phaser, phasersweep, phasercenter, phaserdepth, channel, cut, lpf, lpenv, hpenv, bpenv, lpattack, hpattack, bpattack, lpdecay, hpdecay, bpdecay, lpsustain, hpsustain, bpsustain, lprelease, hprelease, bprelease, ftype, fanchor, hpf, lprate, lpsync, lpdepth, lpdepthfrequency, lpshape, lpdc, lpskew, bprate, bpsync, bpdepth, bpdepthfrequency, bpshape, bpdc, bpskew, hprate, hpsync, hpdepth, hpdepthfrequency, hpshape, hpdc, hpskew, vib, noise, vibmod, hpq, lpq, djf, delay, delayfeedback, delayspeed, delaytime, delaysync, lock, detune, unison, spread, dry, fadeTime, freq, pattack, pdecay, prelease, penv, pcurve, panchor, leslie, lrate, lsize, label, octave, orbit, bus, busgain, pan, panspan, pansplay, chord, dictionary, anchor, offset, octaves, mode, room, roomlp, roomdim, roomfade, iresponse, irspeed, irbegin, roomsize, shape, distort, distortvol, distorttype, compressor, speed, stretch, unit, squiz, vowel, density, clip, duration, color, adsr, midichan, midiport, midicmd, control, ccn, ccv, nrpnn, nrpv, progNum, sysex, sysexid, sysexdata, midibend, miditouch, oschost, oscport, as, scrub, lfo, env, bmod, transient
- `reference/pattern.md` (151 entries): euclid, euclidRot, euclidLegato, euclidLegatoRot, euclidish, clearScope, layer, superimpose, log, logValues, into, arpWith, arp, add, sub, mul, div, setDefaultJoin, gap, silence, pure, sequenceP, stack, slowcat, slowcatPrime, cat, arrange, seqPLoop, sequence, seq, register, round, floor, ceil, toBipolar, fromBipolar, range, rangex, range2, ratio, compress, fastGap, focus, ply, fast, hurry, slow, inside, outside, lastOf, firstOf, every, apply, cpm, early, late, zoom, bite, linger, segment, swingBy, swing, invert, when, off, brak, rev, revv, pressBy, press, palindrome, juxBy, juxFlipBy, jux, juxFlip, echoWith, echo, stut, plyWith, plyForEach, iter, iterBack, repeatCycles, chunk, chunkBack, fastChunk, chunkInto, chunkBackInto, ribbon, tag, filter, filterWhen, within, pace, polymeter, stepcat, stepalt, take, drop, extend, replicate, expand, contract, shrink, grow, tour, zip, chop, striate, loopAt, slice, onTriggerTime, splice, fit, loopAtCps, xfade, beat, morph, soft, hard, cubic, diode, asym, fold, sinefold, chebyshev, parray, partials, phases, FX, K, worklet, base, pick, pickmod, pickF, pickmodF, pickOut, pickmodOut, pickRestart, pickmodRestart, pickReset, pickmodReset, inhabit, inhabitmod, squeeze, setcpm, all, each, getFreq, midi2note
- `reference/signals.md` (62 entries): saw, saw2, isaw, isaw2, sine2, sine, cosine, cosine2, square, square2, isquare, isquare2, tri, tri2, itri, itri2, time, mousex, mousey, useRNG, run, binary, binaryN, binaryL, binaryNL, randL, shuffle, scramble, withSeed, seed, rand, rand2, brandBy, brand, irand, chooseWith, chooseInWith, choose, chooseCycles, wchoose, wchooseCycles, perlin, berlin, degradeBy, degrade, undegradeBy, undegrade, sometimesBy, sometimes, someCyclesBy, someCycles, often, rarely, almostNever, almostAlways, never, always, whenKey, keyDown, cyclesPer, per, perx
- `reference/tonal.md` (7 entries): transpose, scaleTranspose, scale, addVoicings, voicings, rootNotes, voicing
- `reference/samples.md` (6 entries): getDur, samples, setMaxPolyphony, setGainCurve, aliasBank, soundAlias
- `reference/draw.md` (8 entries): drawLine, pianoroll, wordfall, pitchwheel, spiral, fscope, scope, spectrum
- `reference/sounds.md` — every sound name this project preloads: 71 drum-machine banks with their drums, the default kit, 218 Dirt-Samples groups, 128 VCSL groups, 4 traditional Chinese groups and 125 GM soundfonts (check here whenever you are unsure a sound name exists; useful headings are "Drum machines" / "Dirt-Samples" / "Chinese traditional" / "GM soundfonts")

### Example tunes (examples/tunes.md, 32 of them, heading = tune name)

swimming (Koji Kondo - Swimming (Super Mario World)); giantSteps (John Coltrane - Giant Steps); zeldasRescue (Koji Kondo - Princess Zelda's Rescue); caverave ("Caverave"); sampleDrums; barryHarris (adapted from a Barry Harris excercise); blippyRhodes ("Blippy Rhodes"); wavyKalimba ("Wavy kalimba"); festivalOfFingers ("Festival of fingers"); undergroundPlumber ("Underground plumber"); goodTimes ("Good times"); echoPiano ("Echo piano"); sml1 (Hirokazu Tanaka - World 1-1); randomBells ("Random bells"); waa2 ("Waa2"); festivalOfFingers3 ("Festival of fingers 3"); meltingsubmarine ("Melting submarine"); outroMusic ("Outro music"); bassFuge ("Bass fuge"); chop ("Chop"); delay ("Delay"); orbit ("Orbit"); belldub ("Belldub"); dinofunk ("Dinofunk"); sampleDemo ("Sample demo"); holyflute ("Holy flute"); flatrave ("Flatrave"); amensister ("Amensister"); juxUndTollerei ("Jux und tollerei"); csoundDemo ("CSound demo"); loungeSponge ("Lounge sponge"); arpoon ("Arpoon")

### Drum pattern library (examples/drums/<genre>.md, 492 in total, indexed in examples/drums/index.md)

afro(18), ageispolis(1), amen(1), amen-brother(1), ashleys-roach-clip(1), autobahn(2), ballad(15), big-beat(1), billy-jean(1), blue-monday(2), blues(2), book-of-moses(1), boots-ncats(1), bossa(6), bouton(1), break(2), breakbeat(3), brit-house(1), cha-cha-cha(3), chug-chug-chuga-lug(1), cissy-strut-long(1), cissy-strut-short(1), cold-sweat(1), cold-sweat-opening(1), come-dancing(1), contemporary-kick(7), contemporary-snare(6), cowd-bell(1), das-model(2), deeper-house(1), deep-house(1), dirty-house(1), disco(15), dnb(6), drumroll(19), dubstep(2), dubstep-ratcheted(1), electro(6), end(2), expensive-shit(1), express-yourself(1), footwork(2), four-on-the-floor(1), french-house(1), funk(43), funky-drummer(2), funky-president(1), generic-bossa-nova(1), generic-gahu(1), generic-rock(1), generic-rumba(1), generic-shiko(1), generic-son(1), generic-soukous(1), get-up(1), ghost-snare(4), good-to-go(1), groove-me(1), haitian-divorce(1), half-drop(1), haus(1), hiphop(15), hip-hop(1), hook-and-sling(1), hot-sweat(1), house(2), hybrid-kick(11), igot-the-feelin(1), igot-you(1), impeach-the-president(1), irregular(5), italo-disco(2), its-anew-day(1), juke(1), jungle(4), kick(1), kissing-my-love(1), knocks-off-my-feet(1), lady(1), lady-marmalade(1), let-awoman-be-awoman-let-aman-be-aman(1), looking-for-the-perfect-beat(2), lookkapypy(1), miami-bass(2), more-bounce-to-the-ounce(1), mother-popcorn(1), music-non-stop(3), new-wave(1), nico(1), numbers(2), one-drop(1), one-seven-five-thirteen(1), ooh-child(1), palm-grease(1), papa-was-too(1), pattern(64), planet-rock(1), poly(2), pop(15), poptech(1), reggae(13), reggaeton(1), respect-yourself(1), rnb(15), rock(15), rock-steady(1), rock-the-planet(1), rollin-break(1), rolling(18), sally(1), samba(9), shuffle(2), siberian-nights(1), ska(3), slow-deep-house(1), steppers(1), strbtsdcgogo(1), supersonic(4), superstition(1), swing(3), synthethic-substitution(1), synth-wave(1), take-me-to-mardi-gras(2), techno(1), the-fez(1), the-same-blood(1), the-trills-gone(1), tiny-house(1), trans-euro-express(1), trap(2), twist(6), two-drop(1), uk-garage(2), unconventional-snare(8), unknown-drummer(1), use-me(2), walk-this-way(1), we-will-rock-you(1), when-the-levee-breaks(1), ya-mama(1)
<!-- generated:end -->
