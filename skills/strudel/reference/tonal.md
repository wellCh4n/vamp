# Tonal (scales, chords, voicings)

来自 @strudel/tonal：音阶、和弦、voicing。

共 7 项。每项：名称、同义名、说明、参数、示例。

## Other

### transpose
Synonyms: `trans`

Change the pitch of each value by the given amount. Expects numbers or note strings as values.
The amount can be given as a number of semitones or as a string in interval short notation.
If you don't care about enharmonic correctness, just use numbers. Otherwise, pass the interval of
the form: ST where S is the degree number and T the type of interval with

- M = major
- m = minor
- P = perfect
- A = augmented
- d = diminished

Examples intervals:

- 1P = unison
- 3M = major third
- 3m = minor third
- 4P = perfect fourth
- 4A = augmented fourth
- 5P = perfect fifth
- 5d = diminished fifth

Params:
- `amount` (string | number): Either number of semitones or interval string.

```js
"c2 c3".fast(2).transpose("<0 -2 5 3>".slow(2)).note()
```

```js
"c2 c3".fast(2).transpose("<1P -2M 4P 3m>".slow(2)).note()
```

### scaleTranspose
Synonyms: `scaleTrans`, `strans`

Transposes notes inside the scale by the number of steps.
Expected to be called on a Pattern which already has a `Pattern#scale`

Params:
- `offset` (offset): number of steps inside the scale

```js
"-8 [2,4,6]"
.scale('C4 bebop major')
.scaleTranspose("<0 -1 -2 -3 -4 -5 -6 -4>")
.note()
```

### scale

Turns numbers into notes in the scale (zero indexed) or quantizes notes to a scale.

When describing notes via numbers, note that negative numbers can be used to wrap backwards
in the scale as well as sharps or flats to produce notes outside of the scale.

Also sets scale for other scale operations, like `Pattern#scaleTranspose`.

A scale consists of a root note (e.g. `c4`, `c`, `f#`, `bb4`) followed by semicolon (':') and then a [scale type](https://github.com/tonaljs/tonal/blob/main/packages/scale-type/data.ts).

The scale name must be written without spaces (because it would be interpreted as a multi-step pattern otherwise).
If your scale name includes spaces, replace them with colons.

The root note defaults to octave 3, if no octave number is given.

Params:
- `scale` (string): Name of scale

```js
n("0 2 4 6 4 2").scale("C:major")
```

```js
n("[0,7] 4 [2,7] 4")
.scale("C:<major minor>/2")
.s("piano")
```

```js
n(rand.range(0,12).segment(8))
.scale("C:ritusen")
.s("piano")
```

```js
n("<[0,7b] [-4# -4] [-2,7##] 4 [0,7] [-4# -4b] [-2,7###] 4b>*4")
.scale("C:<major minor>/2")
.s("piano")
```

```js
note("C1*16").transpose(irand(36)).scale('Cb2 major').scaleTranspose(3)
```

```js
n("[0 0] [1 2] [3 4] [5 6]").scale("C:major:blues")
```

### addVoicings

Adds a new custom voicing dictionary.

Params:
- `name` (string): identifier for the voicing dictionary
- `dictionary` (Object): maps chord symbol to possible voicings
- `range` (Array): min, max note

```js
addVoicings('cookie', {
  7: ['3M 7m 9M 12P 15P', '7m 10M 13M 16M 19P'],
  '^7': ['3M 6M 9M 12P 14M', '7M 10M 13M 16M 19P'],
  m7: ['8P 11P 14m 17m 19P', '5P 8P 11P 14m 17m'],
  m7b5: ['3m 5d 8P 11P 14m', '5d 8P 11P 14m 17m'],
  o7: ['3m 6M 9M 11A 15P'],
  '7alt': ['3M 7m 10m 13m 15P'],
  '7#11': ['7m 10m 13m 15P 17m'],
}, ['C3', 'C6'])
"<C^7 A7 Dm7 G7>".voicings('cookie').note()
```

### voicings

DEPRECATED: still works, but it is recommended you use .voicing instead (without s).
Turns chord symbols into voicings, using the smoothest voice leading possible.
Uses [chord-voicings package](https://github.com/felixroos/chord-voicings#chord-voicings).

Params:
- `dictionary` (string): which voicing dictionary to use.

```js
stack("<C^7 A7 Dm7 G7>".voicings('lefthand'), "<C3 A2 D3 G2>").note()
```

### rootNotes

Maps the chords of the incoming pattern to root notes in the given octave.

Params:
- `octave` (octave): octave to use

```js
"<C^7 A7 Dm7 G7>".rootNotes(2).note()
```

### voicing

Turns chord symbols into voicings. You can use the following control params:

- `chord`: Note, followed by chord symbol, e.g. C Am G7 Bb^7
- `dict`: voicing dictionary to use, falls back to default dictionary
- `anchor`: the note that is used to align the chord
- `mode`: how the voicing is aligned to the anchor
  - `below`: top note <= anchor
  - `duck`: top note <= anchor, anchor excluded
  - `above`: bottom note >= anchor
  - `root`: bottom note is the lowest root of the chord >= anchor
  - `oldabove` : old (buggy) behavior of above, kept for legacy reason
  - `oldroot` : old (buggy) behavior of root, kept for legacy reason
- `offset`: whole number that shifts the voicing up or down to the next voicing
- `n`: if set, the voicing is played like a scale. Overshooting numbers will be octaved

All of the above controls are optional, except `chord`.
If you pass a pattern of strings to voicing, they will be interpreted as chords.

```js
n("0 1 2 3").chord("<C Am F G>").voicing()
```
