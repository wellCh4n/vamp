# Sample loading & sound aliases

Loading samples, aliases, polyphony settings and the like (@strudel/webaudio / superdough).

6 entries. Each one lists name, synonyms, description, parameters and examples.

## Other

### getDur

Returns the duration, in seconds, of the given sample.
Has optional param `n` (for instance, the `2` in `s("casio:2")`)

Note: `must` be called with await, otherwise you'll get a pending Promise object.

Params:
- `sampleName` (string)
- `(optional)` (number): n

```js
// Set a patterns cycle length to exactly the length of the sample
samples('github:tidalcycles/dirt-samples')
let k = await getDuration('sax')
s("sax").cps(1/k)
```

### samples

Loads a collection of samples to use with `s`

```js
samples('github:tidalcycles/dirt-samples');
s("[bd ~]*2, [~ hh]*2, ~ sd")
```

```js
samples({
 bd: '808bd/BD0000.WAV',
 sd: '808sd/SD0010.WAV'
 }, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/');
s("[bd ~]*2, [~ hh]*2, ~ sd")
```

### setMaxPolyphony

Set the max polyphony. If notes are ringing out via `release` then they will
start to die out in first-in-first-out order once the max polyphony has been hit

Params:
- `Max` (number): polyphony. Defaults to 128

```js
setMaxPolyphony(4)
n(irand(24).seg(8)).scale("C#3:minor").room(1).release(4).gain(0.5)
```

### setGainCurve

Apply a function to all gains provided in patterns. Can be used to rescale gain to be
quadratic, exponential, etc. rather than linear

Params:
- `function` (function): to apply to all gain values

```js
setGainCurve((x) => x * x) // quadratic gain
s("bd*4").gain(0.5) // equivalent to 0.25 gain normally
```

### aliasBank

Register an alias for a bank of sounds.
Optionally accepts a single argument map of bank aliases.
Optionally accepts a single argument string of a path to a JSON file containing bank aliases.

Params:
- `bank` (string): The bank to alias
- `alias` (string): The alias to use for the bank

### soundAlias

Register an alias for a sound.

Params:
- `original` (string): The original sound name
- `alias` (string): The alias to use for the sound
