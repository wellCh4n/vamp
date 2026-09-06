# Sound & effect controls

声音参数和效果器参数。每个控制既可以当函数调用（`lpf(1000)`），也可以当 pattern 方法链式调用（`.lpf("<500 2000>")`），参数都可以是 pattern / mini-notation。

共 208 项。每项：名称、同义名、说明、参数、示例。

## Sound & samples

### s
Synonyms: `sound`

Select a sound / sample by name. When using mininotation, you can also optionally supply 'n' and 'gain' parameters
separated by ':'.

Params:
- `sound` (string | Pattern): The sound / pattern of sounds to pick

```js
s("bd hh")
```

```js
s("bd:0 bd:1 bd:0:0.3 bd:1:1.4")
```

### n

Selects the given index:
 - for samples, it picks the sample by index, with wrap around
 - for scales, it picks the scale degree
 - for voicings, it picks the voice index

Params:
- `value` (number | Pattern): sample index starting from 0

```js
s("bd sd [~ bd] sd,hh*6").n("<0 1>")
```

### accelerate

A pattern of numbers that speed up (or slow down) samples while they play. Currently only supported by osc / superdirt.

Params:
- `amount` (number | Pattern): acceleration.

```js
s("sax").accelerate("<0 1 2 4 8 16>").slow(2).osc()
```

### bank

Select the sound bank to use. To be used together with `s`. The bank name (+ "_") will be prepended to the value of `s`.

Params:
- `bank` (string | Pattern): the name of the bank

```js
s("bd sd [~ bd] sd").bank('RolandTR909') // = s("RolandTR909_bd RolandTR909_sd")
```

### begin

A pattern of numbers from 0 to 1. Skips the beginning of each sample, e.g. `0.25` to cut off the first quarter from each sample.

Params:
- `amount` (number | Pattern): between 0 and 1, where 1 is the length of the sample

```js
samples({ rave: 'rave/AREUREADY.wav' }, 'github:tidalcycles/dirt-samples')
s("rave").begin("<0 .25 .5 .75>").fast(2)
```

### end

The same as .begin, but cuts off the end off each sample.

Params:
- `length` (number | Pattern): 1 = whole sample, .5 = half sample, .25 = quarter sample etc..

```js
s("bd*2,oh*4").end("<.1 .2 .5 1>").fast(2)
```

### loop

Loops the sample.
Note that the tempo of the loop is not synced with the cycle tempo.
To change the loop region, use loopBegin / loopEnd.

Params:
- `on` (number | Pattern): If 1, the sample is looped

```js
s("casio").loop(1)
```

### loopBegin
Synonyms: `loopb`

Begin to loop at a specific point in the sample (inbetween `begin` and `end`).
Note that the loop point must be inbetween `begin` and `end`, and before `loopEnd`!
Note: Samples starting with wt_ will automatically loop! (wt = wavetable)

Params:
- `time` (number | Pattern): between 0 and 1, where 1 is the length of the sample

```js
s("space").loop(1)
.loopBegin("<0 .125 .25>")._scope()
```

### loopEnd
Synonyms: `loope`

End the looping section at a specific point in the sample (inbetween `begin` and `end`).
Note that the loop point must be inbetween `begin` and `end`, and after `loopBegin`!

Params:
- `time` (number | Pattern): between 0 and 1, where 1 is the length of the sample

```js
s("space").loop(1)
.loopEnd("<1 .75 .5 .25>")._scope()
```

### speed

Changes the speed of sample playback, i.e. a cheap way of changing pitch.

Params:
- `speed` (number | Pattern): inf to inf, negative numbers play the sample backwards.

```js
s("bd*6").speed("1 2 4 1 -2 -4")
```

```js
speed("1 1.5*2 [2 1.1]").s("piano").clip(1)
```

### stretch

Changes the pitch of the sample without changing its speed.
The frequencies are multiplied by (factor + 1) for positive numbers
and by max(factor / 4 + 1, 0) for negative numbers.
So tuning up by octaves can be done with 1, 3, 7, ...
and tuning down by octaves with -2, -3, -3.5...

Params:
- `factor` (number | Pattern): between `-4` and `inf`. Positive increases pitch, 0 does nothing, negative decreases the pitch.

```js
s("gm_flute").stretch("<2 1 0 -2>")
```

### scrub

Allows you to scrub an audio file like a tape loop by passing values that represents the position in the audio file
in the optional array syntax ex: "0.5:2", the second value controls the speed of playback

```js
samples('github:switchangel/pad')
s("swpad:0").scrub("{0.1!2 .25@3 0.7!2 <0.8:1.5>}%8")
```

```js
samples('github:yaxu/clean-breaks/main');
s("amen/4").fit().scrub("{0@3 0@2 4@3}%8".div(16))
```

## Pitch

### chorus

mix control for the chorus effect

Params:
- `chorus` (string | Pattern): mix amount between 0 and 1

```js
note("d d a# a").s("sawtooth").chorus(.5)
```

### vib
Synonyms: `vibrato`, `v`

Applies a vibrato to the frequency of the oscillator.

Params:
- `frequency` (number | Pattern): of the vibrato in hertz

```js
note("a e")
.vib("<.5 1 2 4 8 16>")
._scope()
```

```js
// change the modulation depth with ":"
note("a e")
.vib("<.5 1 2 4 8 16>:12")
._scope()
```

### vibmod
Synonyms: `vmod`

Sets the vibrato depth in semitones. Only has an effect if `vibrato` | `vib` | `v` is is also set

Params:
- `depth` (number | Pattern): of vibrato (in semitones)

```js
note("a e").vib(4)
.vibmod("<.25 .5 1 2 12>")
._scope()
```

```js
// change the vibrato frequency with ":"
note("a e")
.vibmod("<.25 .5 1 2 12>:8")
._scope()
```

### detune
Synonyms: `det`

Set detune for stacked voices of supported oscillators.

Params:
- `amount` (number | Pattern)

```js
note("d f a a# a d3").fast(2).s("supersaw").detune("<.1 .2 .5 24.1>")
```

### freq

Set frequency of sound.

Params:
- `frequency` (number | Pattern): in Hz. the audible range is between 20 and 20000 Hz

```js
freq("220 110 440 110").s("superzow").osc()
```

```js
freq("110".mul.out(".5 1.5 .6 [2 3]")).s("superzow").osc()
```

### pattack
Synonyms: `patt`

Attack time of pitch envelope.

Params:
- `time` (number | Pattern): time in seconds

```js
note("c eb g bb").pattack("0 .1 .25 .5").slow(2)
```

### pdecay
Synonyms: `pdec`

Decay time of pitch envelope.

Params:
- `time` (number | Pattern): time in seconds

```js
note("<c eb g bb>").pdecay("<0 .1 .25 .5>")
```

### prelease
Synonyms: `prel`

Release time of pitch envelope

Params:
- `time` (number | Pattern): time in seconds

```js
note("<c eb g bb> ~")
.release(.5) // to hear the pitch release
.prelease("<0 .1 .25 .5>")
```

### penv

Amount of pitch envelope. Negative values will flip the envelope.
If you don't set other pitch envelope controls, `pattack:.2` will be the default.

Params:
- `semitones` (number | Pattern): change in semitones

```js
note("c")
.penv("<12 7 1 .5 0 -1 -7 -12>")
```

### pcurve

Curve of envelope. Defaults to linear. exponential is good for kicks

Params:
- `type` (number | Pattern): 0 = linear, 1 = exponential

```js
note("g1*4")
.s("sine").pdec(.5)
.penv(32)
.pcurve("<0 1>")
```

### panchor

Sets the range anchor of the envelope:
- anchor 0: range = [note, note + penv]
- anchor 1: range = [note - penv, note]
If you don't set an anchor, the value will default to the psustain value.

Params:
- `anchor` (number | Pattern): anchor offset

```js
note("c c4").penv(12).panchor("<0 .5 1 .5>")
```

## Amplitude & dynamics

### velocity
Synonyms: `vel`

Sets the velocity from 0 to 1. Is multiplied together with gain.

```js
s("hh*8")
.gain(".4!2 1 .4!2 1 .4 1")
.velocity(".4 1")
```

### gain

Controls the gain by an exponential amount.

Params:
- `amount` (number | Pattern): gain.

```js
s("hh*8").gain(".4!2 1 .4!2 1 .4 1").fast(2)
```

### postgain

Gain applied after all effects have been processed.

```js
s("bd sd [~ bd] sd,hh*8")
.compressor("-20:20:10:.002:.02").postgain(1.5)
```

### amp

Like `gain`, but linear.

Params:
- `amount` (number | Pattern): gain.

```js
s("bd*8").amp(".1*2 .5 .1*2 .5 .1 .5").osc()
```

### attack
Synonyms: `att`

Amplitude envelope attack time: Specifies how long it takes for the sound to reach its peak value, relative to the onset.

Params:
- `attack` (number | Pattern): time in seconds.

```js
note("c3 e3 f3 g3").attack("<0 .1 .5>")
```

### decay
Synonyms: `dec`

Amplitude envelope decay time: the time it takes after the attack time to reach the sustain level.
Note that the decay is only audible if the sustain value is lower than 1.

Params:
- `time` (number | Pattern): decay time in seconds

```js
note("c3 e3 f3 g3").decay("<.1 .2 .3 .4>").sustain(0)
```

### sustain
Synonyms: `sus`

Amplitude envelope sustain level: The level which is reached after attack / decay, being sustained until the offset.

Params:
- `gain` (number | Pattern): sustain level between 0 and 1

```js
note("c3 e3 f3 g3").decay(.2).sustain("<0 .1 .4 .6 1>")
```

### release
Synonyms: `rel`

Amplitude envelope release time: The time it takes after the offset to go from sustain level to zero.

Params:
- `time` (number | Pattern): release time in seconds

```js
note("c3 e3 g3 c4").release("<0 .1 .4 .6 1>/2")
```

### tremolo
Synonyms: `trem`

Modulate the amplitude of a sound with a continuous waveform

Params:
- `speed` (number | Pattern): modulation speed in HZ

```js
note("d d d# d".fast(4)).s("supersaw").tremolo("<3 2 100> ").tremoloskew("<.5>")
```

### tremolosync
Synonyms: `tremsync`

Modulate the amplitude of a sound with a continuous waveform

Params:
- `cycles` (number | Pattern): modulation speed in cycles

```js
note("d d d# d".fast(4)).s("supersaw").tremolosync("4").tremoloskew("<1 .5 0>")
```

### tremolodepth
Synonyms: `tremdepth`

Depth of amplitude modulation

Params:
- `depth` (number | Pattern)

```js
note("a1 a1 a#1 a1".fast(4)).s("pulse").tremsync(4).tremolodepth("<1 2 .7>")
```

### tremoloskew
Synonyms: `tremskew`

Alter the shape of the modulation waveform

Params:
- `amount` (number | Pattern): between 0 & 1, the shape of the waveform

```js
note("{f a c e}%16").s("sawtooth").tremsync(4).tremoloskew("<.5 0 1>")
```

### tremolophase
Synonyms: `tremphase`

Alter the phase of the modulation waveform

Params:
- `offset` (number | Pattern): the offset in cycles of the modulation

```js
note("{f a c e}%16").s("sawtooth").tremsync(4).tremolophase("<0 .25 .66>")
```

### tremoloshape
Synonyms: `tremshape`

Shape of amplitude modulation

Params:
- `shape` (number | Pattern): tri | square | sine | saw | ramp

```js
note("{f g c d}%16").tremsync(4).tremoloshape("<sine tri square>").s("sawtooth")
```

### duckorbit
Synonyms: `duck`

Modulate the amplitude of an orbit to create a "sidechain" like effect.

Can be applied to multiple orbits with the ':' mininotation, e.g. `duckorbit("2:3")`

Params:
- `orbit` (number | Pattern): target orbit

```js
$: n(run(16)).scale("c:minor:pentatonic").s("sawtooth").delay(.7).orbit(2)
$: s("bd:4!4").beat("0,4,8,11,14",16).duckorbit(2).duckattack(0.2).duckdepth(1)
```

```js
$: n(run(16)).scale("c:minor:pentatonic").s("sawtooth").delay(.7).orbit(2)
$: s("hh*16").orbit(3)
$: s("bd:4!4").beat("0,4,8,11,14",16).duckorbit("2:3").duckattack(0.2).duckdepth(1)
```

### duckdepth

The amount of ducking applied to target orbit

Can vary across orbits with the ':' mininotation, e.g. `duckdepth("0.3:0.1")`.
Note: this requires first applying the effect to multiple orbits with e.g. `duckorbit("2:3")`.

Params:
- `depth` (number | Pattern): depth of modulation from 0 to 1

```js
stack( n(run(8)).scale("c:minor").s("sawtooth").delay(.7).orbit(2), s("bd:4!4").beat("0,4,8,11,14",16).duckorbit(2).duckattack(0.2).duckdepth("<1 .9 .6 0>"))
```

```js
$: n(run(16)).scale("c:minor:pentatonic").s("sawtooth").delay(.7).orbit(2)
$: s("hh*16").orbit(3)
$: s("bd:4!4").beat("0,4,8,11,14",16).duckorbit("2:3").duckattack(0.2).duckdepth("1:0.5")
```

### duckonset
Synonyms: `duckons`

The time required for the ducked signal(s) to reach their lowest volume.
Can be used to prevent clicking or for creative rhythmic effects.

Can vary across orbits with the ':' mininotation, e.g. `duckonset("0:0.003")`.
Note: this requires first applying the effect to multiple orbits with e.g. `duckorbit("2:3")`.

Params:
- `time` (number | Pattern): The onset time in seconds

```js
// Clicks
sound: freq("63.2388").s("sine").orbit(2).gain(4)
duckerWithClick: s("bd*4").duckorbit(2).duckattack(0.3).duckonset(0).postgain(0)
```

```js
// No clicks
sound: freq("63.2388").s("sine").orbit(2).gain(4)
duckerWithoutClick: s("bd*4").duckorbit(2).duckattack(0.3).duckonset(0.01).postgain(0)
```

```js
// Rhythmic
noise: s("pink").distort("2:1").orbit(4) // used rhythmically with 0.3 onset below
hhat: s("hh*16").orbit(7)
ducker: s("bd*4").bank("tr909").duckorbit("4:7").duckonset("0.3:0.003").duckattack(0.25)
```

### duckattack
Synonyms: `duckatt`, `datt`

The time required for the ducked signal(s) to return to their normal volume.

Can vary across orbits with the ':' mininotation, e.g. `duckonset("0:0.003")`.
Note: this requires first applying the effect to multiple orbits with e.g. `duckorbit("2:3")`.

Params:
- `time` (number | Pattern): The attack time in seconds

```js
sound: n(run(8)).scale("c:minor").s("sawtooth").delay(.7).orbit(2)
ducker: s("bd:4!4").beat("0,4,8,11,14",16).duckorbit(2).duckattack("<0.2 0 0.4>").duckdepth(1)
```

```js
moreduck: n(run(8)).scale("c:minor").s("sawtooth").delay(.7).orbit(2)
lessduck: s("hh*16").orbit(5)
ducker: s("bd:4!4").beat("0,4,8,11,14",16).duckorbit("2:5").duckattack("0.4:0.1")
```

### adsr

ADSR envelope: Combination of Attack, Decay, Sustain, and Release.

Params:
- `time` (number | Pattern): attack time in seconds
- `time` (number | Pattern): decay time in seconds
- `gain` (number | Pattern): sustain level (0 to 1)
- `time` (number | Pattern): release time in seconds

```js
note("[c3 bb2 f3 eb3]*2").sound("sawtooth").lpf(600).adsr(".1:.1:.5:.2")
```

## Envelopes

### wtenv

Amount of envelope applied wavetable oscillator's position envelope

Params:
- `amount` (number | Pattern): between 0 and 1

### wtattack
Synonyms: `wtatt`

Attack time of the wavetable oscillator's position envelope

Params:
- `time` (number | Pattern): attack time in seconds

### wtdecay
Synonyms: `wtdec`

Decay time of the wavetable oscillator's position envelope

Params:
- `time` (number | Pattern): decay time in seconds

### wtsustain
Synonyms: `wtsus`

Sustain time of the wavetable oscillator's position envelope

Params:
- `gain` (number | Pattern): sustain level (0 to 1)

### wtrelease
Synonyms: `wtrel`

Release time of the wavetable oscillator's position envelope

Params:
- `time` (number | Pattern): release time in seconds

### warpattack
Synonyms: `warpatt`

Attack time of the wavetable oscillator's warp envelope

Params:
- `time` (number | Pattern): attack time in seconds

### warpdecay
Synonyms: `warpdec`

Decay time of the wavetable oscillator's warp envelope

Params:
- `time` (number | Pattern): decay time in seconds

### warpsustain
Synonyms: `warpsus`

Sustain time of the wavetable oscillator's warp envelope

Params:
- `gain` (number | Pattern): sustain level (0 to 1)

### warprelease
Synonyms: `warprel`

Release time of the wavetable oscillator's warp envelope

Params:
- `time` (number | Pattern): release time in seconds

### warpenv

Amount of envelope applied wavetable oscillator's position envelope

Params:
- `amount` (number | Pattern): between 0 and 1

### fmenv
Synonyms: `fme`

Ramp type of fm envelope. Exp might be a bit broken..

A number may be added afterwards to control the envelope of
any of the 8 individual FMs (e.g. `fmenv4`)

Params:
- `type` (number | Pattern): lin | exp

```js
note("c e g b g e")
.fm(4)
.fmdecay(.2)
.fmsustain(0)
.fmenv("<exp lin>")
._scope()
```

### fmattack
Synonyms: `fmatt`

Attack time for the FM envelope: time it takes to reach maximum modulation

A number may be added afterwards to control the attack of the envelope of
any of the 8 individual FMs (e.g. `fmatt5`)

Params:
- `time` (number | Pattern): attack time

```js
note("c e g b g e")
.fm(4)
.fmattack("<0 .05 .1 .2>")
._scope()
```

### fmdecay
Synonyms: `fmdec`

Decay time for the FM envelope: seconds until the sustain level is reached after the attack phase.

A number may be added afterwards to control the decay of the envelope of
any of the 8 individual FMs (e.g. `fmdec6`)

Params:
- `time` (number | Pattern): decay time

```js
note("c e g b g e")
.fm(4)
.fmdecay("<.01 .05 .1 .2>")
.fmsustain(.4)
._scope()
```

### fmsustain
Synonyms: `fmsus`

Sustain level for the FM envelope: how much modulation is applied after the decay phase

A number may be added afterwards to control the sustain of the envelope of
any of the 8 individual FMs (e.g. `fmsus7`)

Params:
- `level` (number | Pattern): sustain level

```js
note("c e g b g e")
.fm(4)
.fmdecay(.1)
.fmsustain("<1 .75 .5 0>")
._scope()
```

### fmrelease
Synonyms: `fmrel`

Release time for the FM envelope: how much modulation is applied after the note is released

A number may be added afterwards to control the release of the envelope of
any of the 8 individual FMs (e.g. `fmrel8`)

Params:
- `time` (number | Pattern): release time

### lpenv
Synonyms: `lpe`

Sets the lowpass filter envelope modulation depth.

Params:
- `modulation` (number | Pattern): depth of the lowpass filter envelope between 0 and *n*

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.lpf(300)
.lpa(.5)
.lpenv("<4 2 1 0 -1 -2 -4>/4")
```

### hpenv
Synonyms: `hpe`

Sets the highpass filter envelope modulation depth.

Params:
- `modulation` (number | Pattern): depth of the highpass filter envelope between 0 and *n*

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.hpf(500)
.hpa(.5)
.hpenv("<4 2 1 0 -1 -2 -4>/4")
```

### bpenv
Synonyms: `bpe`

Sets the bandpass filter envelope modulation depth.

Params:
- `modulation` (number | Pattern): depth of the bandpass filter envelope between 0 and *n*

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.bpf(500)
.bpa(.5)
.bpenv("<4 2 1 0 -1 -2 -4>/4")
```

### lpattack
Synonyms: `lpa`

Sets the attack duration for the lowpass filter envelope.

Params:
- `attack` (number | Pattern): time of the filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.lpf(300)
.lpa("<.5 .25 .1 .01>/4")
.lpenv(4)
```

### hpattack
Synonyms: `hpa`

Sets the attack duration for the highpass filter envelope.

Params:
- `attack` (number | Pattern): time of the highpass filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.hpf(500)
.hpa("<.5 .25 .1 .01>/4")
.hpenv(4)
```

### bpattack
Synonyms: `bpa`

Sets the attack duration for the bandpass filter envelope.

Params:
- `attack` (number | Pattern): time of the bandpass filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.bpf(500)
.bpa("<.5 .25 .1 .01>/4")
.bpenv(4)
```

### lpdecay
Synonyms: `lpd`

Sets the decay duration for the lowpass filter envelope.

Params:
- `decay` (number | Pattern): time of the filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.lpf(300)
.lpd("<.5 .25 .1 0>/4")
.lpenv(4)
```

### hpdecay
Synonyms: `hpd`

Sets the decay duration for the highpass filter envelope.

Params:
- `decay` (number | Pattern): time of the highpass filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.hpf(500)
.hpd("<.5 .25 .1 0>/4")
.hps(0.2)
.hpenv(4)
```

### bpdecay
Synonyms: `bpd`

Sets the decay duration for the bandpass filter envelope.

Params:
- `decay` (number | Pattern): time of the bandpass filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.bpf(500)
.bpd("<.5 .25 .1 0>/4")
.bps(0.2)
.bpenv(4)
```

### lpsustain
Synonyms: `lps`

Sets the sustain amplitude for the lowpass filter envelope.

Params:
- `sustain` (number | Pattern): amplitude of the lowpass filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.lpf(300)
.lpd(.5)
.lps("<0 .25 .5 1>/4")
.lpenv(4)
```

### hpsustain
Synonyms: `hps`

Sets the sustain amplitude for the highpass filter envelope.

Params:
- `sustain` (number | Pattern): amplitude of the highpass filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.hpf(500)
.hpd(.5)
.hps("<0 .25 .5 1>/4")
.hpenv(4)
```

### bpsustain
Synonyms: `bps`

Sets the sustain amplitude for the bandpass filter envelope.

Params:
- `sustain` (number | Pattern): amplitude of the bandpass filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.bpf(500)
.bpd(.5)
.bps("<0 .25 .5 1>/4")
.bpenv(4)
```

### lprelease
Synonyms: `lpr`

Sets the release time for the lowpass filter envelope.

Params:
- `release` (number | Pattern): time of the filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.clip(.5)
.lpf(300)
.lpenv(4)
.lpr("<.5 .25 .1 0>/4")
.release(.5)
```

### hprelease
Synonyms: `hpr`

Sets the release time for the highpass filter envelope.

Params:
- `release` (number | Pattern): time of the highpass filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.clip(.5)
.hpf(500)
.hpenv(4)
.hpr("<.5 .25 .1 0>/4")
.release(.5)
```

### bprelease
Synonyms: `bpr`

Sets the release time for the bandpass filter envelope.

Params:
- `release` (number | Pattern): time of the bandpass filter envelope

```js
note("c2 e2 f2 g2")
.sound('sawtooth')
.clip(.5)
.bpf(500)
.bpenv(4)
.bpr("<.5 .25 .1 0>/4")
.release(.5)
```

### fanchor

controls the center of the filter envelope. 0 is unipolar positive, .5 is bipolar, 1 is unipolar negative

Params:
- `center` (number | Pattern): 0 to 1

```js
note("{f g g c d a a#}%8").s("sawtooth").lpf("{1000}%2")
.lpenv(8).fanchor("<0 .5 1>")
```

### env

Configures an envelope. Can be called in sequence like pat.env(...).env(...) to set up multiple envelopes
There are two ways to declare which control will be modulated:
1. Explicitly put `control` in the config (e.g. `env({ c: "lpf" })`)
2. If the control parameter is absent, the control _immediately before_ the `env` call will be used
  (e.g. `s("saw").lpf(500).env({ a: 1 })` to modulate `lpf`)

Modulators can be referred to by `id` so that they can be updated later e.g. inside
a `sometimes`. See example below.

Params:
- `config` (Object): Envelope configuration.
- `config.control` (string | Pattern): Node to modulate. Aliases: c
- `config.subControl` (string | Pattern): Sub-control name to append to the control key. Aliases: sc
- `config.depth` (number | Pattern): Relative modulation depth. Aliases: dep, dr
- `config.depthabs` (number | Pattern): Absolute modulation depth. Aliases: da
- `config.attack` (number | Pattern): Time to reach depth. Aliases: att, a
- `config.decay` (number | Pattern): Time to reach sustain. Aliases: dec, d
- `config.sustain` (number | Pattern): Sustain depth. Aliases: sus, s
- `config.release` (number | Pattern): Time to return to nominal value. Aliases: rel, r
- `config.acurve` (number | Pattern): Snappiness of attack curve (-1 = relaxed, 1 = snappy). Aliases: ac
- `config.dcurve` (number | Pattern): Snappiness of decay curve (-1 = relaxed, 1 = snappy). Aliases: dc
- `config.rcurve` (number | Pattern): Snappiness of release curve (-1 = relaxed, 1 = snappy). Aliases: rc
- `config.fxi` (number | Pattern): FX index to target
- `id` (string | Pattern): ID to use for this modulator

```js
s("saw").note("F1").lpf(500).env({ a: 1 })
```

```js
s("saw").env({ d: 1 }).note("F1")
  .lpq(4).lpf(50)
  .env({ a: 0.1, d: 1, ac: 0.8, dc: 0.3, depth: 50 })
```

```js
s("saw").lpf(500).diode(0.3)
  .env({ c: "lpf", a: 0.5, d: 0.5 })
```

```js
s("pulse").lpf(500).env({ a: 1 })
  .env({ c: "s", a: 1 })
  .diode(0.3)
  .sometimes(x => x.env({ a: "0.5" }, 1)) // envelope #1 (0-indexed)
```

```js
s("pulse").lpf(500).env({ a: 1 }, 'lpf_mod')
  .env({ c: "s", a: 1 })
  .diode(0.3)
  .sometimes(x => x.env({ a: "0.5" }, 'lpf_mod'))
```

## Filters

### bpf
Synonyms: `bandf`, `bp`

Sets the center frequency of the **b**and-**p**ass **f**ilter. When using mininotation, you
can also optionally supply the 'bpq' parameter separated by ':'.

Params:
- `frequency` (number | Pattern): center frequency

```js
s("bd sd [~ bd] sd,hh*6").bpf("<1000 2000 4000 8000>")
```

### bpq
Synonyms: `bandq`

Sets the **b**and-**p**ass **q**-factor (resonance).

Params:
- `q` (number | Pattern): q factor

```js
s("bd sd [~ bd] sd").bpf(500).bpq("<0 1 2 3>")
```

### drive

Filter overdrive for supported filter types

Params:
- `amount` (number | Pattern)

```js
note("{f g g c d a a#}%16".sub(17)).s("supersaw").lpenv(8).lpf(150).lpq(.8).ftype('ladder').drive("<.5 4>")
```

### lpf
Synonyms: `cutoff`, `ctf`, `lp`

Applies the cutoff frequency of the **l**ow-**p**ass **f**ilter.

When using mininotation, you can also optionally add the 'lpq' parameter, separated by ':'.

Params:
- `frequency` (number | Pattern): audible between 0 and 20000

```js
s("bd sd [~ bd] sd,hh*6").lpf("<4000 2000 1000 500 200 100>")
```

```js
s("bd*16").lpf("1000:0 1000:10 1000:20 1000:30")
```

### ftype

Sets the filter type. The ladder filter is more aggressive. More types might be added in the future.

Params:
- `type` (number | Pattern): 12db (0), ladder (1), or 24db (2)

```js
note("{f g g c d a a#}%8").s("sawtooth").lpenv(4).lpf(500).ftype("<0 1 2>").lpq(1)
```

```js
note("c f g g a c d4").fast(2)
.sound('sawtooth')
.lpf(200).fanchor(0)
.lpenv(3).lpq(1)
.ftype("<ladder 12db 24db>")
```

### hpf
Synonyms: `hp`, `hcutoff`

Applies the cutoff frequency of the **h**igh-**p**ass **f**ilter.

When using mininotation, you can also optionally add the 'hpq' parameter, separated by ':'.

Params:
- `frequency` (number | Pattern): audible between 0 and 20000

```js
s("bd sd [~ bd] sd,hh*8").hpf("<4000 2000 1000 500 200 100>")
```

```js
s("bd sd [~ bd] sd,hh*8").hpf("<2000 2000:25>")
```

### lprate

Rate of the LFO for the lowpass filter

Params:
- `rate` (number | Pattern): rate in hertz

```js
note("<c c c# c c c4>*16").s("sawtooth").lpf(600).lprate("<4 8 2 1>")
```

### lpsync

Cycle-synced rate of the LFO for the lowpass filter

Params:
- `rate` (number | Pattern): rate in cycles

```js
note("<c c c# c c c4>*16").s("sawtooth").lpf(600).lpsync("<4 8 2 1>")
```

### lpdepth

Depth of the LFO for the lowpass filter

Params:
- `depth` (number | Pattern): depth of modulation

```js
note("<c c c# c c c4>*16").s("sawtooth").lpf(600).lpdepth("<1 .5 1.8 0>")
```

### lpdepthfrequency
Synonyms: `lpdepthfreq`

Depth of the LFO for the lowpass filter, in HZ

Params:
- `depth` (number | Pattern): depth of modulation

```js
note("<c c c# c c c4>*16").s("sawtooth").lpf(600).lpdepthfrequency("<200 500 100 0>")
```

### lpshape

Shape of the LFO for the lowpass filter

Params:
- `shape` (number | Pattern): Shape of the lfo (0, 1, 2, ..)

### lpdc

DC offset of the LFO for the lowpass filter

Params:
- `dcoffset` (number | Pattern): dc offset. set to 0 for unipolar

### lpskew

Skew of the LFO for the lowpass filter

Params:
- `skew` (number | Pattern): How much to bend the LFO shape

### bprate

Rate of the LFO for the bandpass filter

Params:
- `rate` (number | Pattern): rate in hertz

### bpsync

Cycle-synced rate of the LFO for the bandpass filter

Params:
- `rate` (number | Pattern): rate in cycles

### bpdepth

Depth of the LFO for the bandpass filter

Params:
- `depth` (number | Pattern): depth of modulation

### bpdepthfrequency
Synonyms: `bpdepthfreq`

Depth of the LFO for the bandpass filter, in HZ

Params:
- `depth` (number | Pattern): depth of modulation

```js
note("<c c c# c c c4>*16").s("sawtooth").lpf(600).bpdepthfrequency("<200 500 100 0>")
```

### bpshape

Shape of the LFO for the bandpass filter

Params:
- `shape` (number | Pattern): Shape of the lfo (0, 1, 2, ..)

### bpdc

DC offset of the LFO for the bandpass filter

Params:
- `dcoffset` (number | Pattern): dc offset. set to 0 for unipolar

### bpskew

Skew of the LFO for the bandpass filter

Params:
- `skew` (number | Pattern): How much to bend the LFO shape

### hprate

Rate of the LFO for the highpass filter

Params:
- `rate` (number | Pattern): rate in hertz

### hpsync

Cycle-synced rate of the LFO for the highpass filter

Params:
- `rate` (number | Pattern): rate in cycles

### hpdepth

Depth of the LFO for the highpass filter

Params:
- `depth` (number | Pattern): depth of modulation

### hpdepthfrequency
Synonyms: `hpdepthfreq`

Depth of the LFO for the hipass filter, in hz

Params:
- `depth` (number | Pattern): depth of modulation

```js
note("<c c c# c c c4>*16").s("sawtooth").lpf(600).hpdepthfrequency("<200 500 100 0>")
```

### hpshape

Shape of the LFO for the highpass filter

Params:
- `shape` (number | Pattern): Shape of the lfo (0, 1, 2, ..)

### hpdc

DC offset of the LFO for the highpass filter

Params:
- `dcoffset` (number | Pattern): dc offset. set to 0 for unipolar

### hpskew

Skew of the LFO for the highpass filter

Params:
- `skew` (number | Pattern): How much to bend the LFO shape

### hpq
Synonyms: `hresonance`

Controls the **h**igh-**p**ass **q**-value.

Params:
- `q` (number | Pattern): resonance factor between 0 and 50

```js
s("bd sd [~ bd] sd,hh*8").hpf(2000).hpq("<0 10 20 30>")
```

### lpq
Synonyms: `resonance`

Controls the **l**ow-**p**ass **q**-value.

Params:
- `q` (number | Pattern): resonance factor between 0 and 50

```js
s("bd sd [~ bd] sd,hh*8").lpf(2000).lpq("<0 10 20 30>")
```

### djf

DJ filter, below 0.5 is low pass filter, above is high pass filter.

Params:
- `cutoff` (number | Pattern): below 0.5 is low pass filter, above is high pass filter

```js
n(irand(16).seg(8)).scale("d:phrygian").s("supersaw").djf("<.5 .3 .2 .75>")
```

## LFO / modulation

### wtrate

Rate of the LFO for the wavetable oscillator's position

Params:
- `rate` (number | Pattern): rate in hertz

### wtsync

cycle synced rate of the LFO for the wavetable oscillator's position

Params:
- `rate` (number | Pattern): rate in cycles

### wtdepth

Depth of the LFO for the wavetable oscillator's position

Params:
- `depth` (number | Pattern): depth of modulation

### wtshape

Shape of the LFO for the wavetable oscillator's position

Params:
- `shape` (number | Pattern): Shape of the lfo (0, 1, 2, ..)

### wtdc

DC offset of the LFO for the wavetable oscillator's position

Params:
- `dcoffset` (number | Pattern): dc offset. set to 0 for unipolar

### wtskew

Skew of the LFO for the wavetable oscillator's position

Params:
- `skew` (number | Pattern): How much to bend the LFO shape

### warprate

Rate of the LFO for the wavetable oscillator's warp

Params:
- `rate` (number | Pattern): rate in hertz

### warpdepth

Depth of the LFO for the wavetable oscillator's warp

Params:
- `depth` (number | Pattern): depth of modulation

### warpshape

Shape of the LFO for the wavetable oscillator's warp

Params:
- `shape` (number | Pattern): Shape of the lfo (0, 1, 2, ..)

### warpdc

DC offset of the LFO for the wavetable oscillator's warp

Params:
- `dcoffset` (number | Pattern): dc offset. set to 0 for unipolar

### warpskew

Skew of the LFO for the wavetable oscillator's warp

Params:
- `skew` (number | Pattern): How much to bend the LFO shape

### warpsync

cycle synced rate of the LFO for the wavetable warp position

Params:
- `rate` (number | Pattern): rate in cycles

### pwrate
Synonyms: `pwr`

Controls the lfo rate for the pulsewidth of the pulse oscillator

Params:
- `rate` (number | Pattern)

```js
n(run(8)).scale("D:pentatonic").s("pulse").pw("0.5").pwrate("<5 .1 25>").pwsweep("<0.3 .8>")
```

### pwsweep
Synonyms: `pws`

Controls the lfo sweep for the pulsewidth of the pulse oscillator

Params:
- `sweep` (number | Pattern)

```js
n(run(8)).scale("D:pentatonic").s("pulse").pw("0.5").pwrate("<5 .1 25>").pwsweep("<0.3 .8>")
```

### phasersweep
Synonyms: `phs`

The frequency sweep range of the lfo for the phaser effect. Defaults to 2000

Params:
- `phasersweep` (number | Pattern): most useful values are between 0 and 4000

```js
n(run(8)).scale("D:pentatonic").s("sawtooth").release(0.5)
.phaser(2).phasersweep("<800 2000 4000>")
```

### lfo

Configures an LFO. Can be called in sequence like pat.lfo(...).lfo(...) to set up multiple LFOs.
There are two ways to declare which control will be modulated:
1. Explicitly put `control` in the config (e.g. `lfo({ c: "lpf" })`)
2. If the control parameter is absent, the control _immediately before_ the `lfo` call will be used
  (e.g. `s("saw").lpf(500).lfo()` to modulate `lpf`)

Modulators can be referred to by `id` so that they can be updated later e.g. inside
a `sometimes`. See example below.

Params:
- `config` (Object): LFO configuration.
- `config.control` (string | Pattern): Node to modulate. Aliases: c
- `config.subControl` (string | Pattern): Sub-control name to append to the control key. Aliases: sc
- `config.rate` (number | Pattern): Modulation rate. Aliases: r
- `config.sync` (number | Pattern): Tempo-synced modulation rate. Aliases: s
- `config.depth` (number | Pattern): Relative modulation depth. Aliases: dep, dr
- `config.depthabs` (number | Pattern): Absolute modulation depth. Aliases: da
- `config.dcoffset` (number | Pattern): DC offset / bias for the waveform. Aliases: dc
- `config.shape` (number | Pattern): Shape index. Aliases: sh
- `config.skew` (number | Pattern): Skew amount. Aliases: sk
- `config.curve` (number | Pattern): Exponential curve amount. Aliases: cu
- `config.retrig` (number | Pattern): If > 0.5, the LFO will retrigger on each event. Aliases: rt
- `config.fxi` (number | Pattern): FX index to target
- `id` (string | Pattern): ID to use for this modulator

```js
s("saw").note("F1").lpf(500).lfo()
```

```js
s("saw").lfo().lpf(500).lfo({ s: 0.3 })
```

```js
s("saw").lpf(500).diode(0.3)
  .lfo({ c: "lpf" })
```

```js
s("pulse").lpf(500).lfo()
  .lfo({ c: "s" })
  .diode(0.3)
  .sometimes(x => x.lfo({ s: "8" }, 1)) // lfo #1 (0-indexed)
```

```js
s("pulse").lpf(500).lfo({ depth: 4 }, 'lpf_mod')
  .lfo({ c: "s" })
  .diode(0.3)
  .sometimes(x => x.lfo({ s: "8" }, 'lpf_mod'))
```

## FM synthesis

### fmh

Sets the Frequency Modulation Harmonicity Ratio.
Controls the timbre of the sound.
Whole numbers and simple ratios sound more natural,
while decimal numbers and complex ratios sound metallic.

A number may be added afterwards to control the harmonicity of
any of the 8 individual FMs (e.g. `fmh2`)

Params:
- `harmonicity` (number | Pattern)

```js
note("c e g b g e")
.fm(4)
.fmh("<1 2 1.5 1.61>")
._scope()
```

### fmi
Synonyms: `fm`

Sets the Frequency Modulation of the synth.
Controls the modulation index, which defines the brightness of the sound.

A number may be added afterwards to control the modulation index of
any of the 8 individual FMs (e.g. `fm3`). Also, FMs may be routed into
each other with matrix commands like `fm13`, which would send `fm1` back into
`fm3`

Params:
- `brightness` (number | Pattern): modulation index

```js
note("c e g b g e")
.fm("<0 1 2 8 32>")
._scope()
```

```js
s("sine").note("F1").seg(8)
 .fm(4).fm2(rand.mul(4)).fm3(saw.mul(8).slow(8))
 .fmh(1.06).fmh2(10).fmh3(0.1)
```

### fmwave

Waveform of the fm modulator

A number may be added afterwards to control the waveform
any of the 8 individual FMs (e.g. `fmwave6`)

Params:
- `wave` (number | Pattern): waveform

```js
n("0 1 2 3".fast(4)).scale("d:minor").s("sine").fmwave("<sine square sawtooth crackle>").fm(4).fmh(2.01)
```

```js
n("0 1 2 3".fast(4)).chord("<Dm Am F G>").voicing().s("sawtooth").fmwave("brown").fm(.6)
```

## Wavetable / synth

### wt
Synonyms: `wavetablePosition`

Position in the wavetable of the wavetable oscillator

Params:
- `position` (number | Pattern): Position in the wavetable from 0 to 1

```js
s("squelch").bank("wt_digital").seg(8).note("F1").wt("0 0.25 0.5 0.75 1")
```

### warp
Synonyms: `wavetableWarp`

Amount of warp (alteration of the waveform) to apply to the wavetable oscillator

Params:
- `amount` (number | Pattern): Warp of the wavetable from 0 to 1

```js
s("basique").bank("wt_digital").seg(8).note("F1").warp("0 0.25 0.5 0.75 1")
  .warpmode("spin")
```

### warpmode
Synonyms: `wavetableWarpMode`

Type of warp (alteration of the waveform) to apply to the wavetable oscillator.

The current options are: none, asym, bendp, bendm, bendmp, sync, quant, fold, pwm, orbit,
spin, chaos, primes, binary, brownian, reciprocal, wormhole, logistic, sigmoid, fractal, flip

Params:
- `mode` (number | string | Pattern): Warp mode

```js
s("morgana").bank("wt_digital").seg(8).note("F1").warp("0 0.25 0.5 0.75 1")
  .warpmode("<asym bendp spin logistic sync wormhole brownian>*2")
```

### wtphaserand
Synonyms: `wavetablePhaseRand`

Amount of randomness of the initial phase of the wavetable oscillator.

Params:
- `amount` (number | Pattern): Randomness of the initial phase. Between 0 (not random) and 1 (fully random)

```js
s("basique").bank("wt_digital").seg(16).wtphaserand("<0 1>")
```

## Distortion

### shape

(Deprecated) Wave shaping distortion. WARNING: can suddenly get unpredictably loud.
Please use distort instead, which has a more predictable response curve
second option in optional array syntax (ex: ".9:.5") applies a postgain to the output

Params:
- `distortion` (number | Pattern): between 0 and 1

```js
s("bd sd [~ bd] sd,hh*8").shape("<0 .2 .4 .6 .8>")
```

### distort
Synonyms: `dist`

Wave shaping distortion. CAUTION: it can get loud.
Second option in optional array syntax (ex: ".9:.5") applies a postgain to the output. Third option sets the waveshaping type.
Most useful values are usually between 0 and 10 (depending on source gain). If you are feeling adventurous, you can turn it up to 11 and beyond ;)

Params:
- `distortion` (number | Pattern): amount of distortion to apply
- `volume` (number | Pattern): linear postgain of the distortion
- `type` (number | string | Pattern): type of distortion to apply

```js
s("bd sd [~ bd] sd,hh*8").distort("<0 2 3 10:.5>")
```

```js
note("d1!8").s("sine").penv(36).pdecay(.12).decay(.23).distort("8:.4")
```

```js
s("bd:4*4").bank("tr808").distort("3:0.5:diode")
```

### distorttype
Synonyms: `disttype`

Type of waveshaping distortion to apply.

Params:
- `type` (number | string | Pattern): type of distortion to apply

```js
s("bd*4").bank("tr909").distort(2).distorttype("<0 1 2>")
```

```js
s("sine").note("F1*2").release(1)
  .penv(24).pdecay(0.05)
  .distort(rand.range(1, 8))
  .distorttype("<fold chebyshev scurve diode asym sinefold>")
```

## Global effects (orbit, delay, reverb)

### delay

Sets the level of the delay signal.

When using mininotation, you can also optionally add the 'delaytime' and 'delayfeedback' parameter,
separated by ':'.

Params:
- `level` (number | Pattern): between 0 and 1

```js
s("bd bd").delay("<0 .25 .5 1>")
```

```js
s("bd bd").delay("0.65:0.25:0.9 0.65:0.125:0.7")
```

### delayfeedback
Synonyms: `delayfb`, `dfb`

Sets the level of the signal that is fed back into the delay.
Caution: Values >= 1 will result in a signal that gets louder and louder! Don't do it

Params:
- `feedback` (number | Pattern): between 0 and 1

```js
s("bd").delay(.25).delayfeedback("<.25 .5 .75 1>")
```

### delaytime
Synonyms: `delayt`, `dt`

Sets the time of the delay effect in seconds.

Params:
- `delay` (number | Pattern): in seconds

```js
note("d d a# a".fast(2))
.s("sawtooth")
.delay(.8)
.delaytime(1/2)
.delayspeed("<2 .5 -1 -2>")
```

### delaysync
Synonyms: `delays`, `ds`

Sets the time of the delay effect in cycles.

Params:
- `cycles` (number | Pattern): delay length in cycles

```js
s("bd bd").delay(.25).delaysync("<1 2 3 5>".div(8))
```

### room

Sets the level of reverb.

When using mininotation, you can also optionally add the 'size' parameter, separated by ':'.

Params:
- `level` (number | Pattern): between 0 and 1

```js
s("bd sd [~ bd] sd").room("<0 .2 .4 .6 .8 1>")
```

```js
s("bd sd [~ bd] sd").room("<0.9:1 0.9:4>")
```

### roomlp
Synonyms: `rlp`

Reverb lowpass starting frequency (in hertz).
When this property is changed, the reverb will be recaculated, so only change this sparsely..

Params:
- `frequency` (number): between 0 and 20000hz

```js
s("bd sd [~ bd] sd").room(0.5).rlp(10000)
```

```js
s("bd sd [~ bd] sd").room(0.5).rlp(5000)
```

### roomdim
Synonyms: `rdim`

Reverb lowpass frequency at -60dB (in hertz).
When this property is changed, the reverb will be recaculated, so only change this sparsely..

Params:
- `frequency` (number): between 0 and 20000hz

```js
s("bd sd [~ bd] sd").room(0.5).rlp(10000).rdim(8000)
```

```js
s("bd sd [~ bd] sd").room(0.5).rlp(5000).rdim(400)
```

### roomfade
Synonyms: `rfade`

Reverb fade time (in seconds).
When this property is changed, the reverb will be recaculated, so only change this sparsely..

Params:
- `seconds` (number): for the reverb to fade

```js
s("bd sd [~ bd] sd").room(0.5).rlp(10000).rfade(0.5)
```

```js
s("bd sd [~ bd] sd").room(0.5).rlp(5000).rfade(4)
```

### iresponse
Synonyms: `ir`

Sets the sample to use as an impulse response for the reverb.

Params:
- `sample` (string | Pattern): to use as an impulse response

```js
s("bd sd [~ bd] sd").room(.8).ir("<shaker_large:0 shaker_large:2>")
```

### irspeed

Sets speed of the sample for the impulse response.

Params:
- `speed` (string | Pattern)

```js
samples('github:switchangel/pad')
$: s("brk/2").fit().scrub(irand(16).div(16).seg(8)).ir("swpad:4").room(.2).irspeed("<2 1 .5>/2").irbegin(.5).roomsize(.5)
```

### irbegin
Synonyms: `ir`

Sets the beginning of the IR response sample

Params:
- `begin` (string | Pattern): between 0 and 1

```js
samples('github:switchangel/pad')
$: s("brk/2").fit().scrub(irand(16).div(16).seg(8)).ir("swpad:4").room(.65).irspeed("-2").irbegin("<0 .5 .75>/2").roomsize(.6)
```

### roomsize
Synonyms: `rsize`, `sz`, `size`

Sets the room size of the reverb, see `room`.
When this property is changed, the reverb will be recaculated, so only change this sparsely..

Params:
- `size` (number | Pattern): between 0 and 10

```js
s("bd sd [~ bd] sd").room(.8).rsize(1)
```

```js
s("bd sd [~ bd] sd").room(.8).rsize(4)
```

## SuperDirt

### phaserdepth
Synonyms: `phd`, `phasdp`

The amount the signal is affected by the phaser effect. Defaults to 0.75

Params:
- `depth` (number | Pattern): number between 0 and 1

```js
n(run(8)).scale("D:pentatonic").s("sawtooth").release(0.5)
.phaser(2).phaserdepth("<0 .5 .75 1>")
```

### lock

Specifies whether delaytime is calculated relative to cps.

Params:
- `enable` (number | Pattern): When set to 1, delaytime is a direct multiple of a cycle.

```js
s("sd").delay().lock(1).osc()
```

### dry

Set dryness of reverb. See `room` and `size` for more information about reverb.

Params:
- `dry` (number | Pattern): 0 = wet, 1 = dry

```js
n("[0,3,7](3,8)").s("superpiano").room(.7).dry("<0 .5 .75 1>").osc()
```

### fadeTime
Synonyms: `fadeOutTime`

Used when using `begin`/`end` or `chop`/`striate` and friends, to change the fade out time of the 'grain' envelope.

Params:
- `time` (number | Pattern): between 0 and 1

```js
s("oh*4").end(.1).fadeTime("<0 .2 .4 .8>").osc()
```

### leslie

Emulation of a Leslie speaker: speakers rotating in a wooden amplified cabinet.

Params:
- `wet` (number | Pattern): between 0 and 1

```js
n("0,4,7").s("supersquare").leslie("<0 .4 .6 1>").osc()
```

### lrate

Rate of modulation / rotation for leslie effect

Params:
- `rate` (number | Pattern): 6.7 for fast, 0.7 for slow

```js
n("0,4,7").s("supersquare").leslie(1).lrate("<1 2 4 8>").osc()
```

### lsize

Physical size of the cabinet in meters. Be careful, it might be slightly larger than your computer. Affects the Doppler amount (pitch warble)

Params:
- `meters` (number | Pattern): somewhere between 0 and 1

```js
n("0,4,7").s("supersquare").leslie(1).lrate(2).lsize("<.1 .5 1>").osc()
```

### octave
Synonyms: `oct`

Sets the default octave of a synth.

Params:
- `octave` (number | Pattern): octave number

```js
n("0,4,7").scale("F:minor").s('supersaw').octave("<0 1 2 3>")
```

### bus

A `bus` is a send which can be used for mixing patterns. It combines with..
  s("bus") to play that bus through another pattern (for, say, applying non-linear
  effects like distortion to multiple signals)

  otherPat.bmod(..) (to modulate another pattern with the bus)

Params:
- `number` (number | Pattern)

### busgain
Synonyms: `bgain`

Postgain multiplier prior to sending the signal to the audio bus.

Params:
- `number` (number | Pattern)

### panspan

Controls how much multichannel output is fanned out

Params:
- `span` (number | Pattern): between -inf and inf, negative is backwards ordering

```js
s("[bd hh]*2").pan("<.5 1 .5 0>").panspan("<0 .5 1>").osc()
```

### pansplay

Controls how much multichannel output is spread

Params:
- `spread` (number | Pattern): between 0 and 1

```js
s("[bd hh]*2").pan("<.5 1 .5 0>").pansplay("<0 .5 1>").osc()
```

### unit

Used in conjunction with `speed`, accepts values of "r" (rate, default behavior), "c" (cycles), or "s" (seconds). Using `unit "c"` means `speed` will be interpreted in units of cycles, e.g. `speed "1"` means samples will be stretched to fill a cycle. Using `unit "s"` means the playback speed will be adjusted so that the duration is the number of seconds specified by `speed`.

Params:
- `unit` (number | string | Pattern): see description above

```js
speed("1 2 .5 3").s("bd").unit("c").osc()
```

### squiz

Made by Calum Gunn. Reminiscent of some weird mixture of filter, ring-modulator and pitch-shifter. The SuperCollider manual defines Squiz as:

"A simplistic pitch-raising algorithm. It's not meant to sound natural; its sound is reminiscent of some weird mixture of filter, ring-modulator and pitch-shifter, depending on the input. The algorithm works by cutting the signal into fragments (delimited by upwards-going zero-crossings) and squeezing those fragments in the time domain (i.e. simply playing them back faster than they came in), leaving silences inbetween. All the parameters apart from memlen can be modulated."

Params:
- `squiz` (number | Pattern): Try passing multiples of 2 to it - 2, 4, 8 etc.

```js
squiz("2 4/2 6 [8 16]").s("bd").osc()
```

## External IO (MIDI / OSC)

### source
Synonyms: `src`

Define a custom webaudio node to use as a sound source.

Params:
- `getSource` (function)

### channels
Synonyms: `ch`

Allows you to set the output channels on the interface

Params:
- `channels` (number | Pattern): pattern the output channels

```js
note("e a d b g").channels("3:4")
```

### midichan

MIDI channel: Sets the MIDI channel for the event.

Params:
- `channel` (number | Pattern): MIDI channel number (0-15)

```js
note("c4").midichan(1).midi()
```

### midiport

MIDI port: Sets the MIDI port for the event.

Params:
- `port` (number | Pattern): MIDI port

```js
note("c a f e").midiport("<0 1 2 3>").midi()
```

### midicmd

MIDI command: Sends a MIDI command message.

Params:
- `command` (number | Pattern): MIDI command

```js
midicmd("clock*48,<start stop>/2").midi()
```

### control

MIDI control: Sends a MIDI control change message.

Params:
- `MIDI` (number | Pattern): control number (0-127)
- `MIDI` (number | Pattern): controller value (0-127)

### ccn

MIDI control number: Sends a MIDI control change message.

Params:
- `MIDI` (number | Pattern): control number (0-127)

### ccv

MIDI control value: Sends a MIDI control change message.

Params:
- `MIDI` (number | Pattern): control value (0-127)

### nrpnn

MIDI NRPN non-registered parameter number: Sends a MIDI NRPN non-registered parameter number message.

Params:
- `nrpnn` (number | Pattern): MIDI NRPN non-registered parameter number (0-127)

```js
note("c4").nrpnn("1:8").nrpv("123").midichan(1).midi()
```

### nrpv

MIDI NRPN non-registered parameter value: Sends a MIDI NRPN non-registered parameter value message.

Params:
- `nrpv` (number | Pattern): MIDI NRPN non-registered parameter value (0-127)

```js
note("c4").nrpnn("1:8").nrpv("123").midichan(1).midi()
```

### progNum

MIDI program number: Sends a MIDI program change message.

Params:
- `program` (number | Pattern): MIDI program number (0-127)

```js
note("c4").progNum(10).midichan(1).midi()
```

### sysex

MIDI sysex: Sends a MIDI sysex message.

Params:
- `id` (number | Pattern): Sysex ID
- `data` (number | Pattern): Sysex data

```js
note("c4").sysex(["0x77", "0x01:0x02:0x03:0x04"]).midichan(1).midi()
```

### sysexid

MIDI sysex ID: Sends a MIDI sysex identifier message.

Params:
- `id` (number | Pattern): Sysex ID

```js
note("c4").sysexid("0x77").sysexdata("0x01:0x02:0x03:0x04").midichan(1).midi()
```

### sysexdata

MIDI sysex data: Sends a MIDI sysex message.

Params:
- `data` (number | Pattern): Sysex data

```js
note("c4").sysexid("0x77").sysexdata("0x01:0x02:0x03:0x04").midichan(1).midi()
```

### midibend

MIDI pitch bend: Sends a MIDI pitch bend message.

Params:
- `midibend` (number | Pattern): MIDI pitch bend (-1 - 1)

```js
note("c4").midibend(sine.slow(4).range(-0.4,0.4)).midi()
```

### miditouch

MIDI key after touch: Sends a MIDI key after touch message.

Params:
- `miditouch` (number | Pattern): MIDI key after touch (0-1)

```js
note("c4").miditouch(sine.slow(4).range(0,1)).midi()
```

### oschost

The host to send open sound control messages to. Requires running the OSC bridge.

Params:
- `oschost` (string | Pattern): e.g. 'localhost'

```js
note("c4").oschost('127.0.0.1').oscport(57120).osc();
```

### oscport

The port to send open sound control messages to. Requires running the OSC bridge.

Params:
- `oscport` (number | Pattern): e.g. 57120

```js
note("c4").oschost('127.0.0.1').oscport(57120).osc();
```

## Other

### i

Selects the given degree. Currently used in `xen` and `tune`:

Params:
- `value` (number | Pattern)

```js
i("0 1 2 3 4 5 6 7").xen("<5edo 10edo 15edo hexany15>")
```

### note

Plays the given note name or midi number. A note name consists of

- a letter (a-g or A-G)
- optional accidentals (b or #)
- optional (possibly negative) octave number (0-9). Defaults to 3

Examples of valid note names: `c`, `bb`, `Bb`, `f#`, `c3`, `A4`, `Eb2`, `c#5`

You can also use midi numbers instead of note names, where 69 is mapped to A4 440Hz in 12EDO.

```js
note("c a f e")
```

```js
note("c4 a4 f4 e4")
```

```js
note("60 69 65 64")
```

```js
note("fbb1 a#0 cbbb-1 e##-2").sound("saw")
```

### crush

Bit crusher effect.

Params:
- `depth` (number | Pattern): between 1 (for drastic reduction in bit-depth) to 16 (for barely no reduction).

```js
s("<bd sd>,hh*3").fast(2).crush("<16 8 7 6 5 4 3 2>")
```

### coarse

Fake-resampling for lowering the sample rate. Caution: This effect seems to only work in chromium based browsers

Params:
- `factor` (number | Pattern): 1 for original 2 for half, 3 for a third and so on.

```js
s("bd sd [~ bd] sd,hh*8").coarse("<1 4 8 16 32>")
```

### byteBeatExpression
Synonyms: `bbexpr`, `bb`

Create byte beats with custom expressions

Params:
- `byteBeatExpression` (number | Pattern): bitwise expression for creating bytebeat

```js
s("bytebeat").bbexpr('t*(t>>15^t>>66)')
```

### byteBeatStartTime
Synonyms: `bbst`

Create byte beats with custom expressions

Params:
- `byteBeatStartTime` (number | Pattern): in samples (t)

```js
note("c3!8".add("{0 0 12 0 7 5 3}%8")).s("bytebeat:5").bbst("<3 1>".mul(10000))._scope()
```

### pw

Controls the pulsewidth of the pulse oscillator

Params:
- `pulsewidth` (number | Pattern)

```js
note("{f a c e}%16").s("pulse").pw(".8:1:.2")
```

```js
n(run(8)).scale("D:pentatonic").s("pulse").pw("0 .75 .5 1")
```

### phaser
Synonyms: `ph`

Phaser audio effect that approximates popular guitar pedals.

Params:
- `speed` (number | Pattern): speed of modulation

```js
n(run(8)).scale("D:pentatonic").s("sawtooth").release(0.5)
.phaser("<1 2 4 8>")
```

### phasercenter
Synonyms: `phc`

The center frequency of the phaser in HZ. Defaults to 1000

Params:
- `centerfrequency` (number | Pattern): in HZ

```js
n(run(8)).scale("D:pentatonic").s("sawtooth").release(0.5)
.phaser(2).phasercenter("<800 2000 4000>")
```

### channel

Choose the channel the pattern is sent to

Params:
- `channel` (number | Pattern): channel number

### cut

In the style of classic drum-machines, `cut` will stop a playing sample as soon as another samples with in same cutgroup is to be played. An example would be an open hi-hat followed by a closed one, essentially muting the open.

Params:
- `group` (number | Pattern): cut group number

```js
s("[oh hh]*4").cut(1)
```

### noise

Adds pink noise to the mix

Params:
- `wet` (number | Pattern): wet amount

```js
sound("<white pink brown>/2")
```

### delayspeed
Synonyms: `delayt`, `dt`

Sets the time of the delay effect.

Params:
- `delayspeed` (number | Pattern): controls the pitch of the delay feedback

```js
note("d d a# a".fast(2)).s("sawtooth").delay(.8).delaytime(1/2).delayspeed("<2 .5 -1 -2>")
```

### unison

Set number of stacked voices for supported oscillators.

Params:
- `numvoices` (number | Pattern)

```js
note("d f a a# a d3").fast(2).s("supersaw").unison("<1 2 7>")
```

### spread

Set the stereo pan spread for supported oscillators

Params:
- `spread` (number | Pattern): between 0 and 1

```js
note("d f a a# a d3").fast(2).s("supersaw").spread("<0 .3 1>")
```

### label

Sets the displayed text for an event on the pianoroll

Params:
- `label` (string): text to display

### orbit
Synonyms: `o`

An `orbit` is a global parameter context for patterns. Patterns with the same orbit will share the same global effects.

Params:
- `number` (number | Pattern)

```js
stack(
  s("hh*6").delay(.5).delaytime(.25).orbit(1),
  s("~ sd ~ sd").delay(.5).delaytime(.125).orbit(2)
)
```

### pan

Sets position in stereo.

Params:
- `pan` (number | Pattern): between 0 and 1, from left to right (assuming stereo), once round a circle (assuming multichannel)

```js
s("[bd hh]*2").pan("<.5 1 .5 0>")
```

```js
s("bd rim sd rim bd ~ cp rim").pan(sine.slow(2))
```

### chord

The chord to voice

Params:
- `symbols` (string | Pattern): chord symbols to voice e.g., C, Eb, Fm7, G7. The symbols can be defined via addVoicings

```js
chord("<Am C D F Am E Am E>").voicing()
```

### dictionary

Which dictionary to use for the voicings. This falls back to the default dictionary if not provided

Params:
- `dictionaryName` (string): which dictionary (having been defined with `addVoicings`) to use

```js
addVoicings('house', {
'': ['7 12 16', '0 7 16', '4 7 12'],
'm': ['0 3 7']
})
chord("<Am C D F Am E Am E>")
.dict('house').anchor(66)
.voicing().room(.5)
```

### anchor

The top note to align the voicing to. Defaults to c5

Params:
- `anchorNote` (string | Pattern): the note to align the voicing or scale to

```js
anchor("<c4 g4 c5 g5>").chord("C").voicing()
```

```js
n("0 .. 7").anchor("<c4 g4 c5 g5>").scale("<C:major F:minor>")
```

### offset

Sets how the voicing is offset from the anchored position

Params:
- `shift` (number | Pattern): the amount to shift the voicing up or down

```js
chord("<Am C D F Am E Am E>").offset("<0 1 2 3 4 5>") // alter the voicing each time
```

### octaves

How many octaves are voicing steps spread apart, defaults to 1

Params:
- `count` (number | Pattern): the number of octaves

```js
chord("<Am C D F Am E Am E>").octaves("<2 4>").voicing()
```

### mode

How the voicing is aligned to the anchor
  - `below`: top note <= anchor
  - `duck`: top note <= anchor, anchor excluded
  - `above`: bottom note >= anchor
  - `root`: bottom note is the lowest root of the chord >= anchor

  - `oldabove` : old (buggy) behavior of above, kept for legacy reason
  - `oldroot` : old (buggy) behavior of root, kept for legacy reason

Params:
- `modeName` (string | Pattern): one of {below | above | duck | root | oldabove | oldroot}

```js
mode("<below above duck root>").chord("C").voicing()
```

### distortvol
Synonyms: `distortion`, `distvol`

Postgain for waveshaping distortion.

Params:
- `volume` (number | Pattern): linear postgain of the distortion

```js
s("bd*4").bank("tr909").distort(2).distortvol(0.8)
```

### compressor

Dynamics Compressor. The params are `compressor("threshold:ratio:knee:attack:release")`
More info [here](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode?retiredLocale=de#instance_properties)

```js
s("bd sd [~ bd] sd,hh*8")
.compressor("-20:20:10:.002:.02")
```

### vowel

Formant filter to make things sound like vowels.

Params:
- `vowel` (string | Pattern): You can use a e i o u ae aa oe ue y uh un en an on, corresponding to [a] [e] [i] [o] [u] [æ] [ɑ] [ø] [y] [ɯ] [ʌ] [œ̃] [ɛ̃] [ɑ̃] [ɔ̃]. Aliases: aa = å = ɑ, oe = ø = ö, y = ı, ae = æ.

```js
note("[c2 <eb2 <g2 g1>>]*2").s('sawtooth')
.vowel("<a e i <o u>>")
```

```js
s("bd sd mt ht bd [~ cp] ht lt").vowel("[a|e|i|o|u]")
```

### density

crackle noise density

Params:
- `density` (number | Pattern): between 0 and x

```js
s("crackle*4").density("<0.01 0.04 0.2 0.5>".slow(4))
```

### clip
Synonyms: `legato`

Multiplies the duration with the given number. Also cuts samples off at the end if they exceed the duration.

Params:
- `factor` (number | Pattern): = 0

```js
note("c a f e").s("piano").clip("<.5 1 2>")
```

### duration
Synonyms: `dur`

Sets the duration of the event in cycles. Similar to clip / legato, it also cuts samples off at the end if they exceed the duration.

Params:
- `seconds` (number | Pattern): = 0

```js
note("c a f e").s("piano").dur("<.5 1 2>")
```

### color
Synonyms: `colour`

Sets the color of the hap in visualizations like pianoroll or highlighting.

Params:
- `color` (string): Hexadecimal or CSS color name

### as

Sets properties in a batch.

Params:
- `mapping` (String | Array): the control names that are set

```js
"c:.5 a:1 f:.25 e:.8".as("note:clip")
```

```js
"{0@2 0.25 0 0.5 .3 .5}%8".as("begin").s("sax_vib").clip(1)
```

### bmod

Modulates with the output from a given `bus`.
Can be called in sequence like pat.bmod(...).bmod(...) to set up multiple modulators

Send to an audio bus with `otherPat.bus(..)`.

There are two ways to declare which control will be modulated:
1. Explicitly put `control` in the config (e.g. `bmod({ id: 2, c: "lpf" })`)
2. If the control parameter is absent, the control _immediately before_ the `bmod` call will be used
  (e.g. `s("saw").lpf(500).bmod({ id: 2 })` to modulate `lpf`)

Modulators can be referred to by `id` so that they can be updated later e.g. inside
a `sometimes`. See example below.

Params:
- `config` (Object): Bus modulation configuration.
- `config.bus` (string | Pattern): Bus to get modulation signal from
- `config.control` (string | Pattern): Node to modulate. Aliases: c
- `config.subControl` (string | Pattern): Sub-control name to append to the control key. Aliases: sc
- `config.depth` (number | Pattern): Relative modulation depth. Aliases: dep, dr
- `config.depthabs` (number | Pattern): Absolute modulation depth. Aliases: da
- `config.dc` (number | Pattern): DC offset prior to application
- `config.fxi` (number | Pattern): FX index to target
- `id` (string | Pattern): ID to use for this modulator

```js
modulator: s("one").seg(64).gain(slider(0, 0, 1)).bus(1).dry(0)
carrier: s("saw").bmod({ b: 1 })
```

### transient

Transient shaper. Gives independent control over the emphasis on transients
and sustains

Params:
- `attack` (number | Pattern): Emphasis on transients; between -1 (deaccentuate) and 1 (accentuate)
- `sustain` (number | Pattern): Emphasis on the sustains; between -1 (deaccentuate) and 1 (accentuate)

```js
s("bd").transient("<-1 -0.5 0 0.5 1>")
```

```js
s("hh*16").bank("tr909").transient("<-1:1 1:-1>")
```
