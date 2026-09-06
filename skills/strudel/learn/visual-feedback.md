# Visual Feedback

There are several function that add visual feedback to your patterns.

## Mini Notation Highlighting

When you write mini notation with "double quotes" or \`backticks\`, the active parts of the mini notation will be highlighted:

```js
n("<0 2 1 3 2>*8")
.scale("<A1 D2>/4:minor:pentatonic")
.s("supersaw").lpf(300).lpenv("<4 3 2>\*4")
```

You can change the color as well, even pattern it:

```js
n("<0 2 1 3 2>*8")
.scale("<A1 D2>/4:minor:pentatonic")
.s("supersaw").lpf(300).lpenv("<4 3 2>*4")
.color("cyan magenta")
```

## Global vs Inline Visuals

The following functions all come with in 2 variants.

**Without prefix**: renders the visual to the background of the page:

```js
note("c a f e").color("white").punchcard()
```

**With `_` prefix**: renders the visual inside the code. Allows for multiple visuals

```js
note("c a f e").color("white")._punchcard()
```

Here we see the 2 variants for `punchcard`. The same goes for all others below.
To improve readability the following demos will all use the inline variant.

## Punchcard / Pianoroll

These 2 functions render a pianoroll style visual.
The only difference between the 2 is that `pianoroll` will render the pattern directly,
while `punchcard` will also take the transformations into account that occur afterwards:

```js
note("c a f e").color("white")
._punchcard()
.color("cyan")
```

Here, the `color` is still visible in the visual, even if it is applied after `_punchcard`.
On the contrary, the color is not visible when using `_pianoroll`:

```js
note("c a f e").color("white")
._pianoroll()
.color("cyan")
```

`punchcard` is less resource intensive because it uses the same data as used for the mini notation highlighting.

The visual can be customized by passing options. Those options are the same for both functions.

What follows is the API doc of all the options you can pass:

Synonyms: `punchcard`

Visualises a pattern as a scrolling 'pianoroll', displayed in the background of the editor. To show a pianoroll for all running patterns, use `all(pianoroll)`. To have a pianoroll appear below
a pattern instead, prefix with `_`, e.g.: `sound("bd sd")._pianoroll()`.

- `options`: Object containing all the optional following parameters as key value pairs:
- `cycles`: number of cycles to be displayed at the same time - defaults to 4
- `playhead`: location of the active notes on the time axis - 0 to 1, defaults to 0.5
- `vertical`: displays the roll vertically - 0 by default
- `labels`: displays labels on individual notes (see the label function) - 0 by default
- `flipTime`: reverse the direction of the roll - 0 by default
- `flipValues`: reverse the relative location of notes on the value axis - 0 by default
- `overscan`: lookup X cycles outside of the cycles window to display notes in advance - 1 by default
- `hideNegative`: hide notes with negative time (before starting playing the pattern) - 0 by default
- `smear`: notes leave a solid trace - 0 by default
- `fold`: notes takes the full value axis width - 0 by default
- `active`: hexadecimal or CSS color of the active notes - defaults to #FFCA28
- `inactive`: hexadecimal or CSS color of the inactive notes - defaults to #7491D2
- `background`: hexadecimal or CSS color of the background - defaults to transparent
- `playheadColor`: hexadecimal or CSS color of the line representing the play head - defaults to white
- `fill`: notes are filled with color (otherwise only the label is displayed) - 0 by default
- `fillActive`: active notes are filled with color - 0 by default
- `stroke`: notes are shown with colored borders - 0 by default
- `strokeActive`: active notes are shown with colored borders - 0 by default
- `hideInactive`: only active notes are shown - 0 by default
- `colorizeInactive`: use note color for inactive notes - 1 by default
- `fontFamily`: define the font used by notes labels - defaults to 'monospace'
- `minMidi`: minimum note value to display on the value axis - defaults to 10
- `maxMidi`: maximum note value to display on the value axis - defaults to 90
- `autorange`: automatically calculate the minMidi and maxMidi parameters - 0 by default

```js
note("c2 a2 eb2")
.euclid(5,8)
.s('sawtooth')
.lpenv(4).lpf(300)
.pianoroll({ labels: 1 })
```

## Spiral

Displays a spiral visual.

- `options`: Object containing all the optional following parameters as key value pairs:
- `stretch`: controls the rotations per cycle ratio, where 1 = 1 cycle / 360 degrees
- `size`: the diameter of the spiral
- `thickness`: line thickness
- `cap`: style of line ends: butt (default), round, square
- `inset`: number of rotations before spiral starts (default 3)
- `playheadColor`: color of playhead, defaults to white
- `playheadLength`: length of playhead in rotations, defaults to 0.02
- `playheadThickness`: thickness of playheadrotations, defaults to thickness
- `padding`: space around spiral
- `steady`: steadyness of spiral vs playhead. 1 = spiral doesn't move, playhead does.
- `activeColor`: color of active segment. defaults to foreground of theme
- `inactiveColor`: color of inactive segments. defaults to gutterForeground of theme
- `colorizeInactive`: wether or not to colorize inactive segments, defaults to 0
- `fade`: wether or not past and future should fade out. defaults to 1
- `logSpiral`: wether or not the spiral should be logarithmic. defaults to 0

```js
note("c2 a2 eb2")
.euclid(5,8)
.s('sawtooth')
.lpenv(4).lpf(300)
._spiral({ steady: .96 })
```

## Scope

Synonyms: `tscope`

Renders an oscilloscope for the time domain of the audio signal.

- `config`: optional config with options:
- `align`: if 1, the scope will be aligned to the first zero crossing. defaults to 1
- `color`: line color as hex or color name. defaults to white.
- `thickness`: line thickness. defaults to 3
- `scale`: scales the y-axis. Defaults to 0.25
- `pos`: y-position relative to screen height. 0 = top, 1 = bottom of screen
- `trigger`: amplitude value that is used to align the scope. defaults to 0.

```js
s("sawtooth")._scope()
```

## Pitchwheel

Renders a pitch circle to visualize frequencies within one octave

- `hapcircles`: 
- `circle`: 
- `edo`: 
- `root`: 
- `thickness`: 
- `hapRadius`: 
- `mode`: 
- `margin`: 

```js
n("0 .. 12").scale("C:chromatic")
.s("sawtooth")
.lpf(500)
._pitchwheel()
```

## Spectrum

Renders a spectrum analyzer for the incoming audio signal.

- `config`: optional config with options:
- `thickness`: line thickness in px (default 3)
- `speed`: scroll speed (default 1)
- `min`: min db (default -80)
- `max`: max db (default 0)

```js
n("<0 4 <2 3> 1>*3")
.off(1/8, add(n(5)))
.off(1/5, add(n(7)))
.scale("d3:minor:pentatonic")
.s('sine')
.dec(.3).room(.5)
._spectrum()
```

## markcss

Overrides the css of highlighted events. Make sure to use single quotes!

```js
note("c a f e")
.markcss('text-decoration:underline')
```

---
Source: https://strudel.cc/learn/visual-feedback/ (AGPL-3.0, Strudel contributors)
