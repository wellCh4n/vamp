# Signals & randomness

Continuous signals (sine, saw, perlin, …) and random functions (rand, choose, degradeBy, sometimes, …). A signal is sampled when an event fires, so pair it with `segment` for continuous movement.

62 entries. Each one lists name, synonyms, description, parameters and examples.

## Signals

### saw

A sawtooth signal between 0 and 1.

```js
note("<c3 [eb3,g3] g2 [g3,bb3]>*8")
.clip(saw.slow(2))
```

```js
n(saw.range(0,8).segment(8))
.scale('C major')
```

### saw2

A sawtooth signal between -1 and 1 (like `saw`, but bipolar).

### isaw

A sawtooth signal between 1 and 0 (like `saw`, but flipped).

```js
note("<c3 [eb3,g3] g2 [g3,bb3]>*8")
.clip(isaw.slow(2))
```

```js
n(isaw.range(0,8).segment(8))
.scale('C major')
```

### isaw2

A sawtooth signal between 1 and -1 (like `saw2`, but flipped).

### sine2

A sine signal between -1 and 1 (like `sine`, but bipolar).

### sine

A sine signal between 0 and 1.

```js
n(sine.segment(16).range(0,15))
.scale("C:minor")
```

### cosine

A cosine signal between 0 and 1.

```js
n(stack(sine,cosine).segment(16).range(0,15))
.scale("C:minor")
```

### cosine2

A cosine signal between -1 and 1 (like `cosine`, but bipolar).

### square

A square signal between 0 and 1.

```js
n(square.segment(4).range(0,7)).scale("C:minor")
```

### square2

A square signal between -1 and 1 (like `square`, but bipolar).

### isquare

A square signal between 1 and 0 (like `square` but flipped).

### isquare2

A square signal between 1 and -1 (like `isquare`, but bipolar).

### tri

A triangle signal between 0 and 1.

```js
n(tri.segment(8).range(0,7)).scale("C:minor")
```

### tri2

A triangle signal between -1 and 1 (like `tri`, but bipolar).

### itri

An inverted triangle signal between 1 and 0 (like `tri`, but flipped).

```js
n(itri.segment(8).range(0,7)).scale("C:minor")
```

### itri2

An inverted triangle signal between -1 and 1 (like `itri`, but bipolar).

### time

A signal representing the cycle time.

### useRNG

Sets which random number generator to use. Historically Strudel would
use `useRNG('legacy')`, which remains the default. To use a new more statistically
precise RNG, try `useRNG('precise')`.

Params:
- `mod` (string): Mode. One of 'legacy', 'precise'

```js
useRNG('legacy')
// Repeats every 300 cycles
$: n(irand(50)).seg(16).scale("C:minor").ribbon(88, 32)
$: n(irand(50)).seg(16).scale("C:minor").ribbon(388, 32)
```

### run

A discrete pattern of numbers from 0 to n-1

```js
n(run(4)).scale("C4:pentatonic")
// n("0 1 2 3").scale("C4:pentatonic")
```

### binary

Creates a binary pattern from a number.

Params:
- `n` (number): input number to convert to binary

```js
"hh".s().struct(binary(5))
// "hh".s().struct("1 0 1")
```

### binaryN

Creates a binary pattern from a number, padded to n bits long.

Params:
- `n` (number): input number to convert to binary
- `nBits` (number): pattern length, defaults to 16

```js
"hh".s().struct(binaryN(55532, 16))
// "hh".s().struct("1 1 0 1 1 0 0 0 1 1 1 0 1 1 0 0")
```

### binaryL

Creates a binary list pattern from a number.

Params:
- `n` (number): input number to convert to binary
s("saw").seg(8)
.partials(binaryL(irand(4096).add(1)))

### binaryNL

Creates a binary list pattern from a number, padded to n bits long.

Params:
- `n` (number): input number to convert to binary
- `nBits` (number): pattern length, defaults to 16

### randL

Creates a list of random numbers of the given length

Params:
- `n` (number): Number of random numbers to sample

```js
s("saw").seg(16).n(irand(12)).scale("F1:minor")
  .partials(randL(8))
```

### rand

A continuous pattern of random numbers, between 0 and 1.

```js
// randomly change the cutoff
s("bd*4,hh*8").cutoff(rand.range(500,8000))
```

### rand2

A continuous pattern of random numbers, between -1 and 1

### brandBy

A continuous pattern of 0 or 1 (binary random), with a probability for the value being 1

Params:
- `probability` (number): a number between 0 and 1

```js
s("hh*10").pan(brandBy(0.2))
```

### brand

A continuous pattern of 0 or 1 (binary random)

```js
s("hh*10").pan(brand)
```

### irand

A continuous pattern of random integers, between 0 and n-1.

Params:
- `n` (number): max value (exclusive)

```js
// randomly select scale notes from 0 - 7 (= C to C)
n(irand(8)).struct("x x*2 x x*3").scale("C:minor")
```

### perlin

Generates a continuous pattern of [perlin noise](https://en.wikipedia.org/wiki/Perlin_noise), in the range 0..1.

```js
// randomly change the cutoff
s("bd*4,hh*8").cutoff(perlin.range(500,8000))
```

### berlin

Generates a continuous pattern of [berlin noise](conceived by Jame Coyne and Jade Rowland as a joke but turned out to be surprisingly cool and useful,
like perlin noise but with sawtooth waves), in the range 0..1.

```js
// ascending arpeggios
n("0!16".add(berlin.fast(4).mul(14))).scale("d:minor")
```

## Randomness in time

### shuffle

Slices a pattern into the given number of parts, then plays those parts in random order.
Each part will be played exactly once per cycle.

```js
note("c d e f").sound("piano").shuffle(4)
```

```js
seq("c d e f".shuffle(4), "g").note().sound("piano")
```

### scramble

Slices a pattern into the given number of parts, then plays those parts at random. Similar to `shuffle`,
but parts might be played more than once, or not at all, per cycle.

```js
note("c d e f").sound("piano").scramble(4)
```

```js
seq("c d e f".scramble(4), "g").note().sound("piano")
```

### chooseWith

Choose from the list of values (or patterns of values) using the given
pattern of numbers, which should be in the range of 0..1

Params:
- `pat` (Pattern)
- `xs` (*)

```js
note("c2 g2!2 d2 f1").s(chooseWith(sine.fast(2), ["sawtooth", "triangle", "bd:6"]))
```

### chooseInWith

As with {chooseWith}, but the structure comes from the chosen values, rather
than the pattern you're using to choose with.

Params:
- `pat` (Pattern)
- `xs` (*)

### choose

Chooses randomly from the given list of elements.

Params:
- `xs` (any): values / patterns to choose from.

```js
note("c2 g2!2 d2 f1").s(choose("sine", "triangle", "bd:6"))
```

### chooseCycles
Synonyms: `randcat`

Picks one of the elements at random each cycle.

```js
chooseCycles("bd", "hh", "sd").s().fast(8)
```

```js
s("bd | hh | sd").fast(8)
```

### wchoose

Chooses randomly from the given list of elements by giving a probability to each element

Params:
- `pairs` (any): arrays of value and weight

```js
note("c2 g2!2 d2 f1").s(wchoose(["sine",10], ["triangle",1], ["bd:6",1]))
```

### wchooseCycles
Synonyms: `wrandcat`

Picks one of the elements at random each cycle by giving a probability to each element

```js
wchooseCycles(["bd",10], ["hh",1], ["sd",1]).s().fast(8)
```

```js
wchooseCycles(["c c c",5], ["a a a",3], ["f f f",1]).fast(4).note()
```

```js
// The probability can itself be a pattern
wchooseCycles(["bd(3,8)","<5 0>"], ["hh hh hh",3]).fast(4).s()
```

### degradeBy

Randomly removes events from the pattern by a given amount.
0 = 0% chance of removal
1 = 100% chance of removal

Params:
- `amount` (number): a number between 0 and 1

```js
s("hh*8").degradeBy(0.2)
```

```js
s("[hh?0.2]*8")
```

```js
//beat generator
s("bd").segment(16).degradeBy(.5).ribbon(16,1)
```

### degrade

Randomly removes 50% of events from the pattern. Shorthand for `.degradeBy(0.5)`

```js
s("hh*8").degrade()
```

```js
s("[hh?]*8")
```

### undegradeBy

Inverse of `degradeBy`: Randomly removes events from the pattern by a given amount.
0 = 100% chance of removal
1 = 0% chance of removal
Events that would be removed by degradeBy are let through by undegradeBy and vice versa (see second example).

Params:
- `amount` (number): a number between 0 and 1

```js
s("hh*8").undegradeBy(0.2)
```

```js
s("hh*10").layer(
  x => x.degradeBy(0.2).pan(0),
  x => x.undegradeBy(0.8).pan(1)
)
```

### undegrade

Inverse of `degrade`: Randomly removes 50% of events from the pattern. Shorthand for `.undegradeBy(0.5)`
Events that would be removed by degrade are let through by undegrade and vice versa (see second example).

```js
s("hh*8").undegrade()
```

```js
s("hh*10").layer(
  x => x.degrade().pan(0),
  x => x.undegrade().pan(1)
)
```

### sometimesBy

Randomly applies the given function by the given probability.
Similar to `someCyclesBy`

Params:
- `probability` (number | Pattern): a number between 0 and 1
- `function` (function): the transformation to apply

```js
s("hh*8").sometimesBy(.4, x=>x.speed("0.5"))
```

### sometimes

Applies the given function with a 50% chance

Params:
- `function` (function): the transformation to apply

```js
s("hh*8").sometimes(x=>x.speed("0.5"))
```

### someCyclesBy

Randomly applies the given function by the given probability on a cycle by cycle basis.
Similar to `sometimesBy`

Params:
- `probability` (number | Pattern): a number between 0 and 1
- `function` (function): the transformation to apply

```js
s("bd,hh*8").someCyclesBy(.3, x=>x.speed("0.5"))
```

### someCycles

Shorthand for `.someCyclesBy(0.5, fn)`

```js
s("bd,hh*8").someCycles(x=>x.speed("0.5"))
```

### often

Shorthand for `.sometimesBy(0.75, fn)`

```js
s("hh*8").often(x=>x.speed("0.5"))
```

### rarely

Shorthand for `.sometimesBy(0.25, fn)`

```js
s("hh*8").rarely(x=>x.speed("0.5"))
```

### almostNever

Shorthand for `.sometimesBy(0.1, fn)`

```js
s("hh*8").almostNever(x=>x.speed("0.5"))
```

### almostAlways

Shorthand for `.sometimesBy(0.9, fn)`

```js
s("hh*8").almostAlways(x=>x.speed("0.5"))
```

### never

Shorthand for `.sometimesBy(0, fn)` (never calls fn)

```js
s("hh*8").never(x=>x.speed("0.5"))
```

### always

Shorthand for `.sometimesBy(1, fn)` (always calls fn)

```js
s("hh*8").always(x=>x.speed("0.5"))
```

### cyclesPer

A pattern measuring the duration of events,
in cycles per event. `cyclesPer` doesn't have structure itself, but takes structure, and therefore
event durations, from the pattern that it is combined with.
For example `cyclesPer.struct("1 1 [1 1] 1")` would give the same as `"0.25 0.25 [0.125 0.125] 0.25"`.
See also its reciprocal, `per`, also known as `perCycle`.

```js
// Shorter events are lower in pitch
sound("saw saw [saw saw] saw")
  .note(cyclesPer.range(50, 100))
```

```js
sound("bd sd [bd bd] sd*4 [- sd] [bd [bd bd]]")
  .note(cyclesPer.add(20))
```

### per
Synonyms: `perCycle`

A pattern measuring the 'shortness' of events, or in other words, the duration of pattern events,
in events per cycle. `per` doesn't have structure itself, but takes structure, and therefore
event durations, from the pattern that it is combined with.
For example `per.struct("1 1 [1 1] 1")` would give the same as `"4 4 [8 8] 4"`.
See also its reciprocal, `cyclesPer`.

```js
// Shorter events are more distorted
n("0 0*2 0 0*2 0 [0 0 0]@2").sound("bd")
 .distort(per.div(2))
```

### perx

Like `per` but measures the shortness of events according to an exponential curve. In
particular, where the event duration halves, the
returned value increases by one. `perx.struct("1 1 [1 [1 1]] 1")` would therefore be
the same as `"3 3 [4 [5 5]] 3"`.

## Math

### withSeed

Modify a pattern by applying a function to the `randomSeed` control if present

Params:
- `func` (function): Function from seed (or undefined) to seed (or undefined)
- `pat` (Pattern): Pattern to update

### seed

Change the seed for random signals. Normally, random signals depend on time,
so two patterns at the same time will have the same random values. Specifying
a new seed changes the signal output by `rand`. This also affects other functions
that use randomness, like `shuffle` and `sometimes`.

Params:
- `n` (number): A new seed. Can be any number.

```js
$: s("hh*4").degrade();
$: s("bd*4").degrade().seed(1); // Will degrade different events from the hi-hat
```

## Other

### mousex

The mouse's x position value ranges from 0 to 1.

```js
n(mousex.segment(4).range(0,7)).scale("C:minor")
```

### mousey

The mouse's y position value ranges from 0 to 1.

```js
n(mousey.segment(4).range(0,7)).scale("C:minor")
```

### whenKey

Do something on a keypress, or array of keypresses
[Key name reference](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

```js
s("bd(5,8)").whenKey("Control:j", x => x.segment(16).color("red")).whenKey("Control:i", x => x.fast(2).color("blue"))
```

### keyDown

returns true when a key or array of keys is held
[Key name reference](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

```js
keyDown("Control:j").pick([s("bd(5,8)"), s("cp(3,8)")])
```
