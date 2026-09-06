# Pattern functions

Pattern 变换函数：时间、结构、条件、叠加、随机、数值运算等。大多数既是 `Pattern` 方法，也可以作为独立函数调用。

共 151 项。每项：名称、同义名、说明、参数、示例。

## Time

### euclid

Changes the structure of the pattern to form an Euclidean rhythm.
Euclidean rhythms are rhythms obtained using the greatest common
divisor of two numbers.  They were described in 2004 by Godfried
Toussaint, a Canadian computer scientist.  Euclidean rhythms are
really useful for computer/algorithmic music because they can
describe a large number of rhythms with a couple of numbers.

Params:
- `pulses` (number): the number of onsets/beats
- `steps` (number): the number of steps to fill

```js
// The Cuban tresillo pattern.
note("c3").euclid(3,8)
```

### euclidRot

Like `euclid`, but has an additional parameter for 'rotating' the resulting sequence.

Params:
- `pulses` (number): the number of onsets/beats
- `steps` (number): the number of steps to fill
- `rotation` (number): offset in steps

```js
// A Samba rhythm necklace from Brazil
note("c3").euclidRot(3,16,14)
```

### euclidLegato

Similar to `euclid`, but each pulse is held until the next pulse,
so there will be no gaps.

Params:
- `pulses` (number): the number of onsets/beats
- `steps` (number): the number of steps to fill
- `rotation`: offset in steps
- `pat`

```js
note("c3").euclidLegato(3,8)
```

### euclidLegatoRot

Similar to `euclid`, but each pulse is held until the next pulse,
so there will be no gaps, and has an additional parameter for 'rotating'
the resulting sequence

Params:
- `pulses` (number): the number of onsets/beats
- `steps` (number): the number of steps to fill
- `rotation` (number): offset in steps

```js
note("c3").euclidLegatoRot(3,5,2)
```

### euclidish
Synonyms: `eish`

A 'euclid' variant with an additional parameter that morphs the resulting
rhythm from 0 (no morphing) to 1 (completely 'even'). For example
`sound("bd").euclidish(3,8,0)` would be the same as
`sound("bd").euclid(3,8)`, and `sound("bd").euclidish(3,8,1)` would be the
same as `sound("bd bd bd")`. `sound("bd").euclidish(3,8,0.5)` would have a
groove somewhere between.
Inspired by the work of Malcom Braff.

Params:
- `pulses` (number): the number of onsets
- `steps` (number): the number of steps to fill
- `groove` (number): exists between the extremes of 0 (straight euclidian) and 1 (straight pulse)

```js
sound("hh").euclidish(7,12,sine.slow(8))
.pan(sine.slow(8))
```

### into

Breaks a pattern into pieces according to the structure of a given pattern.
True values in the given pattern cause the corresponding subcycle of the
source pattern to be looped, and for an (optional) given function to be
applied. False values result in the corresponding part of the source pattern
to be played unchanged.

```js
sound("bd sd ht lt").into("1 0", hurry(2))
```

### arpWith

Selects indices in in stacked notes.

```js
note("<[c,eb,g]!2 [c,f,ab] [d,f,ab]>")
.arpWith(haps => haps[2])
```

### arp

Selects indices in in stacked notes.

```js
note("<[c,eb,g]!2 [c,f,ab] [d,f,ab]>")
.arp("0 [0,2] 1 [0,2]")
```

### sequenceP

Takes a list of patterns, and returns a pattern of lists.

### stack
Synonyms: `polyrhythm`, `pr`

The given items are played at the same time at the same length.

```js
stack("g3", "b3", ["e4", "d4"]).note()
// "g3,b3,[e4 d4]".note()
```

```js
// As a chained function:
s("hh*4").stack(
  note("c4(5,8)")
)
```

### compress

Compress each cycle into the given timespan, leaving a gap

```js
cat(
  s("bd sd").compress(.25,.75),
  s("~ bd sd ~")
)
```

### fastGap
Synonyms: `fastgap`

speeds up a pattern like fast, but rather than it playing multiple times as fast would it instead leaves a gap in the remaining space of the cycle. For example, the following will play the sound pattern "bd sn" only once but compressed into the first half of the cycle, i.e. twice as fast.

```js
s("bd sd").fastGap(2)
```

### focus

Similar to `compress`, but doesn't leave gaps, and the 'focus' can be bigger than a cycle

```js
s("bd hh sd hh").focus(1/4, 3/4)
```

### ply

The ply function repeats each event the given number of times.

```js
s("bd ~ sd cp").ply("<1 2 3>")
```

### fast
Synonyms: `density`

Speed up a pattern by the given factor. Used by "*" in mini notation.

Params:
- `factor` (number | Pattern): speed up factor

```js
s("bd hh sd hh").fast(2) // s("[bd hh sd hh]*2")
```

### hurry

Both speeds up the pattern (like 'fast') and the sample playback (like 'speed').

```js
s("bd sd:2").hurry("<1 2 4 3>").slow(1.5)
```

### slow
Synonyms: `sparsity`

Slow down a pattern over the given number of cycles. Like the "/" operator in mini notation.

Params:
- `factor` (number | Pattern): slow down factor

```js
s("bd hh sd hh").slow(2) // s("[bd hh sd hh]/2")
```

### inside

Carries out an operation 'inside' a cycle.

```js
"0 1 2 3 4 3 2 1".inside(4, rev).scale('C major').note()
// "0 1 2 3 4 3 2 1".slow(4).rev().fast(4).scale('C major').note()
```

### outside

Carries out an operation 'outside' a cycle.

```js
"<[0 1] 2 [3 4] 5>".outside(4, rev).scale('C major').note()
// "<[0 1] 2 [3 4] 5>".fast(4).rev().slow(4).scale('C major').note()
```

### lastOf

Applies the given function every n cycles, starting from the last cycle.

Params:
- `n` (number): how many cycles
- `func` (function): function to apply

```js
note("c3 d3 e3 g3").lastOf(4, x=>x.rev())
```

### firstOf

Applies the given function every n cycles, starting from the first cycle.

Params:
- `n` (number): how many cycles
- `func` (function): function to apply

```js
note("c3 d3 e3 g3").firstOf(4, x=>x.rev())
```

### every

An alias for `firstOf`

Params:
- `n` (number): how many cycles
- `func` (function): function to apply

```js
note("c3 d3 e3 g3").every(4, x=>x.rev())
```

### cpm

Plays the pattern at the given cycles per minute.

```js
s("<bd sd>,hh*2").cpm(90) // = 90 bpm
```

### early

Nudge a pattern to start earlier in time. Equivalent of Tidal's <~ operator

Params:
- `cycles` (number | Pattern): number of cycles to nudge left

```js
"bd ~".stack("hh ~".early(.1)).s()
```

### late

Nudge a pattern to start later in time. Equivalent of Tidal's ~> operator

Params:
- `cycles` (number | Pattern): number of cycles to nudge right

```js
"bd ~".stack("hh ~".late(.1)).s()
```

### zoom

Plays a portion of a pattern, specified by the beginning and end of a time span. The new resulting pattern is played over the time period of the original pattern:

```js
s("bd*2 hh*3 [sd bd]*2 perc").zoom(0.25, 0.75)
// s("hh*3 [sd bd]*2") // equivalent
```

### bite

Splits a pattern into the given number of slices, and plays them according to a pattern of slice numbers.
Similar to `slice`, but slices up patterns rather than sound samples.

Params:
- `number` (number): of slices
- `slices` (number): to play

```js
note("0 1 2 3 4 5 6 7".scale('c:mixolydian'))
.bite(4, "3 2 1 0")
```

```js
sound("bd - bd bd*2, - sd:6 - sd:5 sd:1 - [- sd:2] -, hh [- cp:7]")
  .bank("RolandTR909").speed(1.2)
  .bite(4, "0 0 [1 2] <3 2> 0 0 [2 1] 3")
```

### linger

Selects the given fraction of the pattern and repeats that part to fill the remainder of the cycle.

Params:
- `fraction` (number): fraction to select

```js
s("lt ht mt cp, [hh oh]*2").linger("<1 .5 .25 .125>")
```

### segment
Synonyms: `seg`

Samples the pattern at a rate of n events per cycle. Useful for turning a continuous pattern into a discrete one.

Params:
- `segments` (number): number of segments per cycle

```js
note(saw.range(40,52).segment(24))
```

### swingBy

The function `swingBy x n` breaks each cycle into `n` slices, and then delays events in the second half of each slice by the amount `x`, which is relative to the size of the (half) slice. So if `x` is 0 it does nothing, `0.5` delays for half the note duration, and 1 will wrap around to doing nothing again. The end result is a shuffle or swing-like rhythm

Params:
- `subdivision` (number)
- `offset` (number)

```js
s("hh*8").swingBy(1/3, 4)
```

### swing

Shorthand for swingBy with 1/3:

Params:
- `subdivision` (number)

```js
s("hh*8").swing(4)
// s("hh*8").swingBy(1/3, 4)
```

### invert
Synonyms: `inv`

Swaps 1s and 0s in a binary pattern.

```js
s("bd").struct("1 0 0 1 0 0 1 0".lastOf(4, invert))
```

### when

Applies the given function whenever the given pattern is in a true state.

Params:
- `binary_pat` (Pattern)
- `func` (function)

```js
"c3 eb3 g3".when("<0 1>/2", x=>x.sub("5")).note()
```

### off

Superimposes the function result on top of the original pattern, delayed by the given time.

Params:
- `time` (Pattern | number): offset time
- `func` (function): function to apply

```js
"c3 eb3 g3".off(1/8, x=>x.add(7)).note()
```

### brak

Returns a new pattern where every other cycle is played once, twice as
fast, and offset in time by one quarter of a cycle. Creates a kind of
breakbeat feel.

### rev

Reverse all cycles in a pattern. See also `revv` for reversing a whole pattern.

```js
note("c d e g").rev()
```

### revv

Reverse a whole pattern. See also `rev` for reversing each cycle.

```js
// This is the same as `<[g e] [d c]>`. If `rev()` is used, you get
// the same as `<[d c] [g e]>`, where each cycle reverses, but the order of
// cycles stays the same.
note("<[c d] [e g]>").revv()
```

### pressBy

Like press, but allows you to specify the amount by which each
event is shifted. pressBy(0.5) is the same as press, while
pressBy(1/3) shifts each event by a third of its timespan.

```js
stack(s("hh*4"),
      s("bd mt sd ht").pressBy("<0 0.5 0.25>")
     ).slow(2)
```

### press

Syncopates a rhythm, by shifting each event halfway into its timespan.

```js
stack(s("hh*4"),
      s("bd mt sd ht").every(4, press)
     ).slow(2)
```

### palindrome

Applies `rev` to a pattern every other cycle, so that the pattern alternates between forwards and backwards.

```js
note("c d e g").palindrome()
```

### juxBy
Synonyms: `juxby`

Jux with adjustable stereo width. 0 = mono, 1 = full stereo.

```js
s("bd lt [~ ht] mt cp ~ bd hh").juxBy("<0 .5 1>/2", rev)
```

### jux

The jux function creates strange stereo effects, by applying a function to a pattern, but only in the right-hand channel.

```js
s("bd lt [~ ht] mt cp ~ bd hh").jux(rev)
```

```js
s("bd lt [~ ht] mt cp ~ bd hh").jux(press)
```

```js
s("bd lt [~ ht] mt cp ~ bd hh").jux(iter(4))
```

### echoWith
Synonyms: `echowith`, `stutWith`, `stutwith`

Superimpose and offset multiple times, applying the given function each time.

Params:
- `times` (number): how many times to repeat
- `time` (number): cycle offset between iterations
- `func` (function): function to apply, given the pattern and the iteration index

```js
"<0 [2 4]>"
.echoWith(4, 1/8, (p,n) => p.add(n*2))
.scale("C:minor").note()
```

### echo

Superimpose and offset multiple times, gradually decreasing the velocity

Params:
- `times` (number): how many times to repeat
- `time` (number): cycle offset between iterations
- `feedback` (number): velocity multiplicator for each iteration

```js
s("bd sd").echo(3, 1/6, .8)
```

### stut

Deprecated. Like echo, but the last 2 parameters are flipped.

Params:
- `times` (number): how many times to repeat
- `feedback` (number): velocity multiplicator for each iteration
- `time` (number): cycle offset between iterations

```js
s("bd sd").stut(3, .8, 1/6)
```

### plyWith
Synonyms: `plywith`

The plyWith function repeats each event the given number of times, applying the given function to each event.\n

Params:
- `factor` (number): how many times to repeat
- `func` (function): function to apply, given the pattern

```js
"<0 [2 4]>"
.plyWith(4, (p) => p.add(2))
.scale("C:minor").note()
```

### plyForEach
Synonyms: `plyforeach`

The plyForEach function repeats each event the given number of times, applying the given function to each event.
This version of ply uses the iteration index as an argument to the function, similar to echoWith.

Params:
- `factor` (number): how many times to repeat
- `func` (function): function to apply, given the pattern and the iteration index

```js
"<0 [2 4]>"
.plyForEach(4, (p,n) => p.add(n*2))
.scale("C:minor").note()
```

### iter

Divides a pattern into a given number of subdivisions, plays the subdivisions in order, but increments the starting subdivision each cycle. The pattern wraps to the first subdivision after the last subdivision is played.

```js
note("0 1 2 3".scale('A minor')).iter(4)
```

### iterBack
Synonyms: `iterback`

Like `iter`, but plays the subdivisions in reverse order. Known as iter' in tidalcycles

```js
note("0 1 2 3".scale('A minor')).iterBack(4)
```

### repeatCycles

Repeats each cycle the given number of times.

```js
note(irand(12).add(34)).segment(4).repeatCycles(2).s("gm_acoustic_guitar_nylon")
```

### chunk
Synonyms: `slowChunk`, `slowchunk`

Divides a pattern into a given number of parts, then cycles through those parts in turn, applying the given function to each part in turn (one part per cycle).

```js
"0 1 2 3".chunk(4, x=>x.add(7))
.scale("A:minor").note()
```

### chunkBack
Synonyms: `chunkback`

Like `chunk`, but cycles through the parts in reverse order. Known as chunk' in tidalcycles

```js
"0 1 2 3".chunkBack(4, x=>x.add(7))
.scale("A:minor").note()
```

### fastChunk
Synonyms: `fastchunk`

Like `chunk`, but the cycles of the source pattern aren't repeated
for each set of chunks.

```js
"<0 8> 1 2 3 4 5 6 7"
.scale("C2:major").note()
.fastChunk(4, x => x.color('red')).slow(2)
```

### chunkInto
Synonyms: `chunkinto`

Like `chunk`, but the function is applied to a looped subcycle of the source pattern.

```js
sound("bd sd ht lt bd - cp lt").chunkInto(4, hurry(2))
  .bank("tr909")
```

### chunkBackInto
Synonyms: `chunkbackinto`

Like `chunkInto`, but moves backwards through the chunks.

```js
sound("bd sd ht lt bd - cp lt").chunkInto(4, hurry(2))
  .bank("tr909")
```

### ribbon
Synonyms: `rib`

Loops the pattern inside an `offset` for `cycles`.
If you think of the entire span of time in cycles as a ribbon, you can cut a single piece and loop it.

Params:
- `offset` (number): start point of loop in cycles
- `cycles` (number): loop length in cycles

```js
note("<c d e f>").ribbon(1, 2)
```

```js
// Looping a portion of randomness
n(irand(8).segment(4)).scale("c:pentatonic").ribbon(1337, 2)
```

```js
// rhythm generator
s("bd!16?").ribbon(29,.5)
```

### tag

Tags each Hap with an identifier. Good for filtering. The function populates Hap.context.tags (Array).

Params:
- `tag` (string): anything unique

```js
s("saw!16").note("F1")
  .lpf(tri.range(40, 80).slow(4)).lpenv(5).lpq(4).lpd(0.15)
  .when(rand.late(0.1).gte(0.5), x => x.transpose("12").tag('altered'))
  .when(rand.late(0.2).gte(0.5), x => x.s("square").tag('altered'))
  .when("<0 1>", x => x.filter((hap) => hap.hasTag('altered')))
```

### filter

Filters haps using the given function

Params:
- `test` (function): function to test Hap

```js
s("hh!7 oh").filter(hap => hap.value.s === 'hh')
```

### filterWhen

Filters haps by their begin time

Params:
- `test` (function): function to test Hap.whole.begin

```js
oneCycle: s("bd*4").filterWhen((t) => t < 1)
```

### within

Use within to apply a function to only a part of a pattern.

Params:
- `start` (number): start within cycle (0 - 1)
- `end` (number): end within cycle (0 - 1). Must be > start
- `func` (function): function to be applied to the sub-pattern

### beat

creates a structure pattern from divisions of a cycle
especially useful for creating rhythms

```js
s("bd").beat("0,7,10", 16)
```

```js
s("sd").beat("4,12", 16)
```

### morph

Takes two binary rhythms represented as lists of 1s and 0s, and a number
between 0 and 1 that morphs between them. The two lists should contain the same
number of true values.

```js
sound("hh").struct(morph([1,0,1,0,1,0,1,0], // straight rhythm
                         [1,1,0,1,0,1,0], // wonky rhythm
                         0.25 // creates a slightly wonky rhythm
                        )
                  )
```

```js
sound("hh").struct(morph("1:0:1:0:1:0:1:0", // straight rhythm
                         "1:1:0:1:0:1:0", // wonky rhythm
                         sine.slow(8) // slowly morph between the rhythms
                        )
                  )
```

### setcpm

Changes the global tempo to the given cycles per minute

Params:
- `cpm` (number): cycles per minute

```js
setcpm(140/4) // =140 bpm in 4/4
$: s("bd*4,[- sd]*2").bank('tr707')
```

## Combining patterns

### layer

Layers the result of the given function(s). Like `superimpose`, but without the original pattern:

```js
"<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
  .layer(x=>x.add("0,2"))
  .scale('C minor').note()
```

### superimpose

Superimposes the result of the given function(s) on top of the original pattern:

```js
"<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
  .superimpose(x=>x.add(2))
  .scale('C minor').note()
```

### setDefaultJoin

Sets the default method of combining events from two patterns (aka [alignment](https://strudel.cc/technical-manual/alignment/)) in Strudel.
The default method is 'in', meaning that patterns to the left will (typically) dictate the event timings when combined with patterns to the right.
By changing alignment to 'out', the opposite will happen. With 'mix', they will combine their event timings.

Note that we say the _default_ method, because alignments can also be set explicitly with calls like
'add.mix', 'set.squeeze', etc.

Params:
- `method` (string): Default join method to use. Options: 'in', 'out', 'mix', 'squeeze', 'squeezeout', 'reset', 'restart', 'poly'

```js
setDefaultJoin('mix') // also try 'in', 'out', 'squeeze', etc.
s("saw").vel("1 0.5").note("F A C E").delay("0 0.2 0.3")
```

### slowcat
Synonyms: `cat`

Concatenation: combines a list of patterns, switching between them successively, one per cycle.

```js
slowcat("e5", "b4", ["d5", "c5"])
```

### slowcatPrime

Concatenation: combines a list of patterns, switching between them successively, one per cycle. Unlike slowcat, this version will skip cycles.

Params:
- `items` (any): The items to concatenate

### cat
Synonyms: `slowcat`

The given items are con**cat**enated, where each one takes one cycle.

Params:
- `items` (any): The items to concatenate

```js
cat("e5", "b4", ["d5", "c5"]).note()
// "<e5 b4 [d5 c5]>".note()
```

```js
// As a chained function:
s("hh*4").cat(
   note("c4(5,8)")
)
```

### arrange

Allows to arrange multiple patterns together over multiple cycles.
Takes a variable number of arrays with two elements specifying the number of cycles and the pattern to use.

```js
arrange(
  [4, "<c a f e>(3,8)"],
  [2, "<g a>(5,8)"]
).note()
```

### seqPLoop

Similarly to `arrange`, allows you to arrange multiple patterns together over multiple cycles.
Unlike `arrange`, you specify a start and stop time for each pattern rather than duration, which
means that patterns can overlap.

```js
seqPLoop(
  [0, 2, "bd(3,8)"],
  [1, 3, "cp(3,8)"]
).sound()
```

### sequence

See `fastcat`

### seq
Synonyms: `fastcat`

Like **cat**, but the items are crammed into one cycle.

```js
seq("e5", "b4", ["d5", "c5"]).note()
// "e5 b4 [d5 c5]".note()
```

```js
// As a chained function:
s("hh*4").seq(
  note("c4(5,8)")
)
```

### apply

Applies the given function to the pattern. Like layer, but with a single function:

```js
"<c3 eb3 g3>".scale('C minor').apply(scaleTranspose("0,2,4")).note()
```

### parray

Turns a list of patterns into a single pattern which outputs list-values

### pick

Picks patterns (or plain values) either from a list (by index) or a lookup table (by name).
Similar to `inhabit`, but maintains the structure of the original patterns.

Params:
- `pat` (Pattern)
- `xs` (*)

```js
note("<0 1 2!2 3>".pick(["g a", "e f", "f g f g" , "g c d"]))
```

```js
sound("<0 1 [2,0]>".pick(["bd sd", "cp cp", "hh hh"]))
```

```js
sound("<0!2 [0,1] 1>".pick(["bd(3,8)", "sd sd"]))
```

```js
s("<a!2 [a,b] b>".pick({a: "bd(3,8)", b: "sd sd"}))
```

### pickmod

The same as `pick`, but if you pick a number greater than the size of the list,
it wraps around, rather than sticking at the maximum value.
For example, if you pick the fifth pattern of a list of three, you'll get the
second one.

Params:
- `pat` (Pattern)
- `xs` (*)

### pickF

pickF lets you use a pattern of numbers to pick which function to apply to another pattern.

Params:
- `pat` (Pattern)
- `lookup` (Pattern): a pattern of indices or names
- `lookup` (Array.<function()> | object): the array or lookup object of functions from which to pull

```js
s("bd [rim hh]").pickF("<0 1 2>", [rev,jux(rev),fast(2)])
```

```js
note("<c2 d2>(3,8)").s("square")
.pickF("<0 2> 1", [jux(rev), fast(2), x=>x.lpf(800)])
```

```js
note("<c2 d2>(3,8)").s("square")
.pickF("<jr l> f", { jr:jux(rev), f:fast(2), l:x=>x.lpf(800) })
```

### pickmodF

The same as `pickF`, but if you pick a number greater than the size of the functions list,
it wraps around, rather than sticking at the maximum value.

Params:
- `pat` (Pattern)
- `lookup` (Pattern): a pattern of indices or names
- `lookup` (Array.<function()> | object): the array or lookup object of functions from which to pull

### pickOut

Similar to `pick`, but it applies an outerJoin instead of an innerJoin.

Params:
- `pat` (Pattern)
- `xs` (*)

### pickmodOut

The same as `pickOut`, but if you pick a number greater than the size of the list,
it wraps around, rather than sticking at the maximum value.

Params:
- `pat` (Pattern)
- `xs` (*)

### pickRestart

Similar to `pick`, but the choosen pattern is restarted when its index is triggered.

Params:
- `pat` (Pattern)
- `xs` (*)

### pickmodRestart

The same as `pickRestart`, but if you pick a number greater than the size of the list,
it wraps around, rather than sticking at the maximum value.

Params:
- `pat` (Pattern)
- `xs` (*)

```js
"<a@2 b@2 c@2 d@2>".pickRestart({
        a: n("0 1 2 0"),
        b: n("2 3 4 ~"),
        c: n("[4 5] [4 3] 2 0"),
        d: n("0 -3 0 ~")
      }).scale("C:major").s("piano")
```

### pickReset

Similar to `pick`, but the choosen pattern is reset when its index is triggered.

Params:
- `pat` (Pattern)
- `xs` (*)

### pickmodReset

The same as `pickReset`, but if you pick a number greater than the size of the list,
it wraps around, rather than sticking at the maximum value.

Params:
- `pat` (Pattern)
- `xs` (*)

### inhabit
Synonyms: `pickSqueeze`

Picks patterns (or plain values) either from a list (by index) or a lookup table (by name).
Similar to `pick`, but cycles are squeezed into the target ('inhabited') pattern.

Params:
- `pat` (Pattern)
- `xs` (*)

```js
let a = s("bd(3,8)")
let b = s("cp sd")
"<a b [a,b]>".inhabit({ a, b })
```

```js
s("a@2 [a b] a"
.inhabit({a: "bd(3,8)", b: "sd sd"}))
.slow(4)
```

### inhabitmod
Synonyms: `pickmodSqueeze`

The same as `inhabit`, but if you pick a number greater than the size of the list,
it wraps around, rather than sticking at the maximum value.
For example, if you pick the fifth pattern of a list of three, you'll get the
second one.

Params:
- `pat` (Pattern)
- `xs` (*)

### squeeze

Pick from the list of values (or patterns of values) via the index using the given
pattern of integers. The selected pattern will be compressed to fit the duration of the selecting event

Params:
- `pat` (Pattern)
- `xs` (*)

```js
note(squeeze("<0@2 [1!2] 2>", ["g a", "f g f g" , "g a c d"]))
```

### all

Applies a function to all the running patterns. Note that the patterns are grouped together into a single `stack` before the function is applied. This is probably what you want, but see `each` for
a version that applies the function to each pattern separately.

**Note:** Patterns must be labeled (e.g. with `$:`) to be picked up by `all`. An unlabeled
pattern such as `note("c4")` is not registered and will produce no audio when `all` is present.
Use `$: note("c4")` instead.
```
$: sound("bd - cp sd")
$: sound("hh*8")
all(fast("<2 3>"))
```
```
$: sound("bd - cp sd")
$: sound("hh*8")
all(x => x.pianoroll())
```

### each

Applies a function to each of the running patterns separately. This is intended for future use with upcoming 'stepwise' features. See `all` for a version that applies the function to all the patterns stacked together into a single pattern.

**Note:** Patterns must be labeled (e.g. with `$:`) to be picked up by `each`. An unlabeled
pattern such as `note("c4")` is not registered and will produce no audio when `each` is present.
Use `$: note("c4")` instead.
```
$: sound("bd - cp sd")
$: sound("hh*8")
each(fast("<2 3>"))
```

## Creating patterns

### gap

Does absolutely nothing, but with a given metrical 'steps'

Params:
- `steps` (number)

```js
gap(3) // "~@3"
```

### silence

Does absolutely nothing..

```js
silence // "~"
```

### pure

A discrete value that repeats once per cycle.

```js
pure('e4') // "e4"
```

### K

Produces a [Kabelsalat](https://kabel.salat.dev/) modular sound engine.
This can be used as either an effect (by including `audioin()` at the beginning
of your kabel expression) or as a sound source (via any expression which doesn't
start with `audioin()`).

Some helpers you have available to you:
  * Strudel mini notation works fine in K(..) via "" or ``
  * More complex Strudel expressions (like "0 1 2".fast(4) or irand(24)) can be
    written by wrapping them in `S(..)` inside your Kabel code
  * We expose Strudel's note frequency under `sFreq` and Strudel's gate
    information under `sGate`
  * You can use more complex multi-line expressions (like `let x = a; let y = b; x.lpf(y);`)
    by wrapping them inside a function in K (see example).

Params:
- `expr` (KabelsalatExpression | function): Kabelsalat graph definition

```js
note("A c e".fast(4)).transpose("<0 2 4 6 8>")
  .scale("F:minor").transpose("12")
  .s("saw")
  .K(
    // audioin().mul(sGate.adsr(0.001, 0.3, 0, 0.2)) // as effect
    saw(saw(sFreq / "2!3 16").mul(8).add(sFreq).lag("0!3 0.1")).mul(0.3) // as source
    .mul(sGate.adsr(0, 0.15, 0.5, "0.1!3 1"))
    .lpf(sGate.adsr(0, 0.2, 0.3, 0.2).mul(1).add(0))
    .add(x => x.delay(S("0.3 0.2".fast(2))).mul(0.7))
    .add(x => x.delay("0.03 [0.08 0.01] 0.01 0.013").mul(0.77)).mul(0.7)
    .add(x => x.delay(.13).mul(0.7))
    .out()
  )
```

```js
n("<0 1 <2 3 2 4>>*16")
  .scale("G#2:minor").sometimes(x => x.transpose("12 | 24"))
  .K(() => {
    const att = S(rand.range(0, 0.05))
    const dec = S(rand.range(0.05, 0.2))
    let f = n(sFreq);
    const mod = sine(f).mul("0.1 | 0.2 | 0.3")
      .add("[[1.5 1] | 1 | 2 | 4 | [6 4@3]]*2")
    saw(f.mul(mod))
    .mul(sGate.ad(att, dec))
    .add(x => x.delay(0.4).mul(0.3))
    .out()
  }).fxr(1).room(0.3)
```

### base

Creates a pattern of numbers in base b from a number or pattern of numbers
limited to d digits long from the right

Params:
- `n` (number): number to convert (can be a pattern or array)
- `b` (number): base to convert to (defaults to 10) (can be a pattern)
- `d` (number): max number of digits to produce for each n (defaults to 0 for all) (can be a pattern)

```js
$: note(base("7175 543", 10, 3)).scale("c:major").s("saw")
// $: note("1 7 5 5 4 3").scale("c:major").s("saw")
```

## Functional

### register

Registers a new pattern method. The method is added to the Pattern class + the standalone function is returned from register.

Params:
- `name` (string | Array.<string>): name of the function, or an array of names to be used as synonyms
- `func` (function): function with 1 or more params, where last is the current pattern
- `patternify` (bool): defaults to true; if set to false, you will have more control over the arguments to `func` as they will be
in their raw form and it will be up to you to patternify them and/or query them for values

```js
const vlpf = register('vlpf', (freq, pat) => {
  return pat.fmap((v) => ({...v, cutoff: freq * (v.velocity ?? 1) }));
})
s("saw").seg(8).velocity(rand).vlpf(800)
```

## Stepwise

### pace

*Experimental*

Speeds a pattern up or down, to fit to the given number of steps per cycle.

```js
sound("bd sd cp").pace(4)
// The same as sound("{bd sd cp}%4") or sound("<bd sd cp>*4")
```

### polymeter
Synonyms: `pm`

*Experimental*

Aligns the steps of the patterns, creating polymeters. The patterns are repeated until they all fit the cycle. For example, in the below the first pattern is repeated twice, and the second is repeated three times, to fit the lowest common multiple of six steps.

```js
// The same as note("{c eb g, c2 g2}%6")
polymeter("c eb g", "c2 g2").note()
```

### stepcat
Synonyms: `timeCat`, `timecat`

'Concatenates' patterns like `fastcat`, but proportional to a number of steps per cycle.
The steps can either be inferred from the pattern, or provided as a [length, pattern] pair.
Has the alias `timecat`.

```js
stepcat([3,"e3"],[1, "g3"]).note()
// the same as "e3@3 g3".note()
```

```js
stepcat("bd sd cp","hh hh").sound()
// the same as "bd sd cp hh hh".sound()
```

### stepalt

*Experimental*

Concatenates patterns stepwise, according to an inferred 'steps per cycle'.
Similar to `stepcat`, but if an argument is a list, the whole pattern will alternate between the elements in the list.

```js
stepalt(["bd cp", "mt"], "bd").sound()
// The same as "bd cp bd mt bd".sound()
```

### take

*Experimental*

Takes the given number of steps from a pattern (dropping the rest).
A positive number will take steps from the start of a pattern, and a negative number from the end.

```js
"bd cp ht mt".take("2").sound()
// The same as "bd cp".sound()
```

```js
"bd cp ht mt".take("1 2 3").sound()
// The same as "bd bd cp bd cp ht".sound()
```

```js
"bd cp ht mt".take("-1 -2 -3").sound()
// The same as "mt ht mt cp ht mt".sound()
```

### drop

*Experimental*

Drops the given number of steps from a pattern.
A positive number will drop steps from the start of a pattern, and a negative number from the end.

```js
"tha dhi thom nam".drop("1").sound().bank("mridangam")
```

```js
"tha dhi thom nam".drop("-1").sound().bank("mridangam")
```

```js
"tha dhi thom nam".drop("0 1 2 3").sound().bank("mridangam")
```

```js
"tha dhi thom nam".drop("0 -1 -2 -3").sound().bank("mridangam")
```

### extend

*Experimental*

`extend` is similar to `fast` in that it increases its density, but it also increases the step count
accordingly. So `stepcat("a b".extend(2), "c d")` would be the same as `"a b a b c d"`, whereas
`stepcat("a b".fast(2), "c d")` would be the same as `"[a b] [a b] c d"`.

```js
stepcat(
  sound("bd bd - cp").extend(2),
  sound("bd - sd -")
).pace(8)
```

### replicate

*Experimental*

`replicate` is similar to `fast` in that it increases its density, but it also increases the step count
accordingly. So `stepcat("a b".replicate(2), "c d")` would be the same as `"a b a b c d"`, whereas
`stepcat("a b".fast(2), "c d")` would be the same as `"[a b] [a b] c d"`.

TODO: find out how this function differs from extend

```js
stepcat(
  sound("bd bd - cp").replicate(2),
  sound("bd - sd -")
).pace(8)
```

### expand

*Experimental*

Expands the step size of the pattern by the given factor.

```js
sound("tha dhi thom nam").bank("mridangam").expand("3 2 1 1 2 3").pace(8)
```

### contract

*Experimental*

Contracts the step size of the pattern by the given factor. See also `expand`.

```js
sound("tha dhi thom nam").bank("mridangam").contract("3 2 1 1 2 3").pace(8)
```

### shrink

*Experimental*

Progressively shrinks the pattern by 'n' steps until there's nothing left, or if a second value is given (using mininotation list syntax with `:`),
that number of times.
A positive number will progressively drop steps from the start of a pattern, and a negative number from the end.

```js
"tha dhi thom nam".shrink("1").sound()
.bank("mridangam")
```

```js
"tha dhi thom nam".shrink("-1").sound()
.bank("mridangam")
```

```js
"tha dhi thom nam".shrink("1 -1").sound().bank("mridangam").pace(4)
```

```js
note("0 1 2 3 4 5 6 7".scale("C:ritusen")).sound("folkharp")
   .shrink("1 -1").pace(8)
```

### grow

*Experimental*

Progressively grows the pattern by 'n' steps until the full pattern is played, or if a second value is given (using mininotation list syntax with `:`),
that number of times.
A positive number will progressively grow steps from the start of a pattern, and a negative number from the end.

```js
"tha dhi thom nam".grow("1").sound()
.bank("mridangam")
```

```js
"tha dhi thom nam".grow("-1").sound()
.bank("mridangam")
```

```js
"tha dhi thom nam".grow("1 -1").sound().bank("mridangam").pace(4)
```

```js
note("0 1 2 3 4 5 6 7".scale("C:ritusen")).sound("folkharp")
   .grow("1 -1").pace(8)
```

### tour

*Experimental*

Inserts a pattern into a list of patterns. On the first repetition it will be inserted at the end of the list, then moved backwards through the list 
on successive repetitions. The patterns are added together stepwise, with all repetitions taking place over a single cycle. Using `pace` to set the 
number of steps per cycle is therefore usually recommended.

```js
"[c g]".tour("e f", "e f g", "g f e c").note()
   .sound("folkharp")
   .pace(8)
```

### zip

*Experimental*

'zips' together the steps of the provided patterns. This can create a long repetition, taking place over a single, dense cycle. 
Using `pace` to set the number of steps per cycle is therefore usually recommended.

```js
zip("e f", "e f g", "g [f e] a f4 c").note()
   .sound("folkharp")
   .pace(8)
```

## Math

### add

Assumes a pattern of numbers. Adds the given number to each item in the pattern.

```js
// Here, the triad 0, 2, 4 is shifted by different amounts
n("0 2 4".add("<0 3 4 0>")).scale("C:major")
// Without add, the equivalent would be:
// n("<[0 2 4] [3 5 7] [4 6 8] [0 2 4]>").scale("C:major")
```

```js
// You can also use add with notes:
note("c3 e3 g3".add("<0 5 7 0>"))
// Behind the scenes, the notes are converted to midi numbers:
// note("48 52 55".add("<0 5 7 0>"))
```

### sub

Like add, but the given numbers are subtracted.

```js
n("0 2 4".sub("<0 1 2 3>")).scale("C4:minor")
// See add for more information.
```

### mul

Multiplies each number by the given factor.

```js
"<1 1.5 [1.66, <2 2.33>]>*4".mul(150).freq()
```

### div

Divides each number by the given factor.

### round

Assumes a numerical pattern. Returns a new pattern with all values rounded
to the nearest integer.

```js
n("0.5 1.5 2.5".round()).scale("C:major")
```

### floor

Assumes a numerical pattern. Returns a new pattern with all values set to
their mathematical floor. E.g. `3.7` replaced with to `3`, and `-4.2`
replaced with `-5`.

```js
note("42 42.1 42.5 43".floor())
```

### ceil

Assumes a numerical pattern. Returns a new pattern with all values set to
their mathematical ceiling. E.g. `3.2` replaced with `4`, and `-4.2`
replaced with `-4`.

```js
note("42 42.1 42.5 43".ceil())
```

### toBipolar

Assumes a numerical pattern, containing unipolar values in the range 0 ..
1. Returns a new pattern with values scaled to the bipolar range -1 .. 1

### fromBipolar

Assumes a numerical pattern, containing bipolar values in the range -1 .. 1
Returns a new pattern with values scaled to the unipolar range 0 .. 1

### range

Assumes a numerical pattern, containing unipolar values in the range 0 .. 1.
Returns a new pattern with values scaled to the given min/max range.
Most useful in combination with continuous patterns.

```js
s("[bd sd]*2,hh*8")
.cutoff(sine.range(500,4000))
```

### rangex

Assumes a numerical pattern, containing unipolar values in the range 0 .. 1
Returns a new pattern with values scaled to the given min/max range,
following an exponential curve.

```js
s("[bd sd]*2,hh*8")
.cutoff(sine.rangex(500,4000))
```

### range2

Assumes a numerical pattern, containing bipolar values in the range -1 .. 1
Returns a new pattern with values scaled to the given min/max range.

```js
s("[bd sd]*2,hh*8")
.cutoff(sine2.range2(500,4000))
```

### ratio

Allows dividing numbers via list notation using ":".
Returns a new pattern with just numbers.

```js
ratio("1, 5:4, 3:2").mul(110)
.freq().s("piano")
```

## Visualization / debugging

### log

Writes the content of the current event to the console (visible in the side menu).

```js
s("bd sd").log()
```

### logValues

A simplified version of `log` which writes all "values" (various configurable parameters)
within the event to the console (visible in the side menu).

```js
s("bd sd").gain("0.25 0.5 1").n("2 1 0").logValues()
```

## Other

### clearScope

Clears all user-defined variables and functions from the scope.
This removes variables created during block-based evaluation.

```js
// After defining variables in blocks:
// let myVar = 5
// function myFunc() { return 10; }
clearScope() // removes myVar and myFunc from scope
```

### juxFlipBy
Synonyms: `juxflipby`, `fluxBy`, `fluxby`

Like juxBy, except it flips the ears each cycle.

```js
s("bd lt [~ ht] mt cp ~ bd hh").juxFlipBy(".8", rev)
```

### juxFlip
Synonyms: `juxflip`, `flux`

Like jux, but flips the ears each cycle.

```js
s("bd lt [~ ht] mt cp ~ bd hh").juxFlip(rev)
```

```js
s("bd lt [~ ht] mt cp ~ bd hh").juxFlip(press)
```

```js
s("bd lt [~ ht] mt cp ~ bd hh").juxFlip(iter(4))
```

### chop

Cuts each sample into the given number of parts, allowing you to explore a technique known as 'granular synthesis'.
It turns a pattern of samples into a pattern of parts of samples.

```js
samples({ rhodes: 'https://cdn.freesound.org/previews/132/132051_316502-lq.mp3' })
s("rhodes")
 .chop(4)
 .rev() // reverse order of chops
 .loopAt(2) // fit sample into 2 cycles
```

### striate

Cuts each sample into the given number of parts, triggering progressive portions of each sample at each loop.

```js
s("numbers:0 numbers:1 numbers:2").striate(6).slow(3)
```

### loopAt

Makes the sample fit the given number of cycles by changing the speed.

```js
samples({ rhodes: 'https://cdn.freesound.org/previews/132/132051_316502-lq.mp3' })
s("rhodes").loopAt(2)
```

### slice

Chops samples into the given number of slices, triggering those slices with a given pattern of slice numbers.
Instead of a number, it also accepts a list of numbers from 0 to 1 to slice at specific points.

```js
samples('github:tidalcycles/dirt-samples')
s("breaks165").slice(8, "0 1 <2 2*2> 3 [4 0] 5 6 7".every(3, rev)).slow(0.75)
```

```js
samples('github:tidalcycles/dirt-samples')
s("breaks125").fit().slice([0,.25,.5,.75], "0 1 1 <2 3>")
```

### onTriggerTime

make something happen on event time
uses browser timeout which is innacurate for audio tasks

```js
s("bd!8").onTriggerTime((hap) => {console.log(hap)})
```

### splice

Works the same as slice, but changes the playback speed of each slice to match the duration of its step.

```js
samples('github:tidalcycles/dirt-samples')
s("breaks165")
.splice(8,  "0 1 [2 3 0]@2 3 0@2 7")
```

### fit

Makes the sample fit its event duration. Good for rhythmical loops like drum breaks.
Similar to `loopAt`.

```js
samples({ rhodes: 'https://cdn.freesound.org/previews/132/132051_316502-lq.mp3' })
s("rhodes/2").fit()
```

### loopAtCps

Makes the sample fit the given number of cycles and cps value, by
changing the speed. deprecated: use loopAt or fit instead, together with setCps / setCpm.

```js
samples({ rhodes: 'https://cdn.freesound.org/previews/132/132051_316502-lq.mp3' })
s("rhodes").loopAtCps(4,1.5).cps(1.5)
```

### xfade

Cross-fades between left and right from 0 to 1:
- 0 = (full left, no right)
- .5 = (both equal)
- 1 = (no left, full right)

```js
xfade(s("bd*2"), "<0 .25 .5 .75 1>", s("hh*8"))
```

### soft

Soft-clipping distortion

Params:
- `distortion` (number | Pattern): amount of distortion to apply
- `volume` (number | Pattern): linear postgain of the distortion

### hard

Hard-clipping distortion

Params:
- `distortion` (number | Pattern): amount of distortion to apply
- `volume` (number | Pattern): linear postgain of the distortion

### cubic

Cubic polynomial distortion

Params:
- `distortion` (number | Pattern): amount of distortion to apply
- `volume` (number | Pattern): linear postgain of the distortion

### diode

Diode-emulating distortion

Params:
- `distortion` (number | Pattern): amount of distortion to apply
- `volume` (number | Pattern): linear postgain of the distortion

### asym

Asymmetrical diode distortion

Params:
- `distortion` (number | Pattern): amount of distortion to apply
- `volume` (number | Pattern): linear postgain of the distortion

### fold

Wavefolding distortion

Params:
- `distortion` (number | Pattern): amount of distortion to apply
- `volume` (number | Pattern): linear postgain of the distortion

### sinefold

Wavefolding distortion composed with sinusoid

Params:
- `distortion` (number | Pattern): amount of distortion to apply
- `volume` (number | Pattern): linear postgain of the distortion

### chebyshev

Distortion via Chebyshev polynomials

Params:
- `distortion` (number | Pattern): amount of distortion to apply
- `volume` (number | Pattern): linear postgain of the distortion

### partials

Scale the magnitude of the harmonics of one of the core synths ('sine', 'tri', 'saw', ..)

Can also be used to create a new synth via `s('user').partials(...)`

Params:
- `magnitudes` (Array.<number> | Pattern): List of [0, 1] magnitudes for partials. 0th entry is the fundamental harmonic (i.e. DC offset is skipped)

```js
s("user").seg(16).n(irand(8)).scale("A:major")
  .partials([1, 0, 1, 0, 0, 1])
```

```js
s("saw").seg(8).n(irand(12)).scale("G#:minor")
  .partials(binaryL(irand(256).add("1")))
```

### phases

Rotates the harmonics of one of the core synths ('sine', 'tri', 'saw', 'user', ..) by a list of phases

Params:
- `phases` (Array.<number> | Pattern): List of [0, 1) phases for partials. 0th entry is the fundamental phase (i.e. DC offset is skipped)

```js
// Phase cancellation
s("saw").seg(8).n(irand(12)).scale("G#1:minor")
  .partials(partials([1, 1, 1]))
  .superimpose(x => x.phases([0.5, 0.5, 0.5]))
```

### FX

Establishes an FX chain. Can be called by chaining .FX(fx1).FX(fx2)..
calls and/or in a single .FX(fx1, fx2, ..) call. The fx1, .. are _patterns_ which
establish the controls of the given effect. See examples.

```js
$: s("[sbd <hh [bd | lt | oh]>]*4").dec(.4)
  .FX(
    phaser(0.5).gain(2),
    bpf(800),
    distort(1.3),
    room(0.2),
    delay(0.5).gain(1.25),
    distort(0.3),
  ).fxr(1.7) // sets release time of effects (like delay)
```

```js
$: s("saw").fm(0.5)
  .delay(0.3) // outer effects are applied *last*
  .FX(coarse(4)) // first coarse
  .FX(lpf(500).lpe(4).lpa(1).lpd(2)) // then lpf
  .FX(distort(1)) // then distort
```

### worklet

Creates a worklet effect. Typically derived by writing K(...) in the REPL which will parse
Kabelsalat code.

Params:
- `src` (string): Source code of the worklet update function
- `inputs` (number | Pattern): Worklet inputs

### getFreq

### midi2note
