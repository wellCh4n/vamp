---
name: strudel
description: 用 Strudel（Tidal Cycles 的 JavaScript 移植）写 live coding 音乐。本文件是速查 + 资料索引；详细语法、443 个函数的参数与示例、32 首示例曲、492 个按曲风分类的鼓型都在同目录下，用 read_doc / search_docs 工具按需读取。
---

# Strudel skill

## 怎么用这些资料（渐进式阅读）

本文件已经在你的上下文里，下面的速查覆盖了日常写曲的 90% 用法，**能直接写就直接写**。遇到下面这些情况再去查资料：

| 情况 | 做法 |
|---|---|
| 不确定某个函数的参数、别名或用法 | `search_docs("函数名")`，或 `read_doc("reference/controls.md", heading="lpf")` 这样只读一个标题 |
| 想知道有没有做某件事的函数 | `read_doc("reference/index.md")`（每个函数一行说明），或 `search_docs("关键词")` |
| 想用某个音色但不确定名字是否存在（gm_*、某个鼓机有没有 oh、Dirt-Samples 里有什么） | `read_doc("reference/sounds.md", heading="GM soundfonts")` 等，标题见文末索引 |
| 用户点名某个曲风（funk、house、dnb、bossa、reggaeton…） | 先看文末鼓型库列表挑曲风，`read_doc("examples/drums/<genre>.md")` 拿现成鼓型，再配 bass / 和弦 |
| 想参考整曲的编排、音色搭配、和声写法 | `read_doc("examples/tunes.md", heading="曲名")`，曲名见文末 |
| 某个专题想系统看（mini-notation 细节、采样、合成器、效果链、tonal、随机…） | `read_doc("learn/<topic>.md")`，文件列表见文末 |
| 节奏 / 琶音 / 微节奏的写法套路 | `read_doc("recipes/rhythms.md")` 等 |

规则：
- 查之前先想清楚要查什么，一轮里通常读 1～3 个文件就够了，不要把整个目录读一遍。
- 读到的示例代码可以改编使用，但要注意示例里用到的采样是否在本项目可用（见"本项目环境"）。
- 资料是英文的，回答用户时仍用用户的语言。

## 本项目环境

- 代码在浏览器里通过 Strudel REPL 运行，`set_code` 工具会整体替换编辑器内容并播放。
- 已预加载的音色：鼓机采样（`bank("RolandTR909")` 等）、`piano`、VCSL 乐器、uzu-drumkit、Dirt-Samples 杂项（`casio jazz metal insect wind east crow space numbers` 等）、GM soundfont（`gm_*`）。
- 不要调用 `samples()` 加载外部资源，除非用户明确要求；MIDI / OSC / 麦克风 / 鼠标信号不可用。
- 编辑器下方自带 pianoroll / 波形 / 频谱，代码里不需要 `_pianoroll()`、`_scope()` 之类的可视化调用。
- 触发时错误（比如音色不存在）会在 `set_code` 的结果里返回，读错误信息修正后再调一次。

## 核心概念

- **Pattern** 是时间的函数：查询某段时间，返回其中的事件。`note()`、`s()`、`.lpf()` 等都返回 Pattern，可以链式调用。
- **Cycle** 是时间单位，默认 1 cycle = 2 秒（30 cpm）。一个序列的所有内容会被压进一个 cycle，所以序列越长每个音越快。
- 效果参数在事件**触发那一刻**采样一次（ADSR、pitch env、vib、tremolo、phaser 等本身连续的除外）。想让信号连续变化，用 `.segment(n)` 增加事件数。
- `setcpm(bpm/4)` 让 1 cycle = 一小节 4/4；`setcps(1)` 是每秒 1 cycle。

## Mini-notation（双引号或反引号里的迷你语言）

| 语法 | 示例 | 说明 |
|---|---|---|
| 空格 | `"bd sd hh cp"` | 序列，平分一个 cycle |
| `:n` | `"hh:0 hh:1"` | 选第 n 个采样；`s` 里还能 `bd:1:0.5`（第三段是 gain） |
| `~` / `-` | `"bd ~ hh -"` | 休止 |
| `[ ]` | `"bd [hh hh] sd"` | 子序列，再细分它占的那一格 |
| `*n` / `/n` | `"hh*4"`, `"[c a f e]/2"` | 加速 / 减速，可小数 |
| `< >` | `"<bd sd hh>"`, `"<a b c d>*8"` | 每 cycle 播一个，等价 `"[bd sd hh]/3"` |
| `,` | `"bd*2, hh*4"`, `"[c,e,g]"` | 并行 / 和弦 |
| `@n` / `_` | `"c@3 eb"`, `"c _ _ eb"` | 延长 |
| `!n` / `!` | `"c!2 e"` | 重复但不加速 |
| `?` / `?0.2` | `"hh*8?"` | 随机丢弃（默认 50%） |
| `\|` | `"bd \| hh \| sd"` | 每 cycle 随机选一个 |
| `(k,n,r)` | `"bd(3,8)"`, `"bd(3,8,2)"` | 欧几里得节奏 |
| `{ }` / `{ }%n` | `"{c eb g, c2 g2}%4"` | 多拍子，按步对齐 |
| `.` | `"bd sd . hh hh hh"` | 分组，等价 `"[bd sd] [hh hh hh]"` |

对应函数：`*2`=`.fast(2)`，`/2`=`.slow(2)`，`(3,8)`=`.euclid(3,8)`，`?`=`.degrade()`，`a b, c d`=`stack()`，`<a b>`=`cat()`，`a b`=`seq()`，`a@3 b`=`stepcat([3,a],[1,b])`。

## 声音

- `s("bd hh sd oh")` / `sound()`。默认鼓件：`bd sd rim cp hh oh cr rd ht mt lt sh cb tb perc misc fx`；配 `.bank("RolandTR909")`（常用 `RolandTR808 RolandTR909 RolandTR707 RolandTR505 AkaiLinn RhythmAce ViscoSpaceDrum CasioRZ1`）。
- 杂项采样：`casio insect wind jazz metal east crow space numbers`；钢琴 `piano`；GM 乐器 `gm_electric_guitar_muted gm_acoustic_bass gm_synth_bass_1 gm_synth_strings_1 gm_xylophone gm_voice_oohs gm_accordion gm_flute gm_lead_6_voice gm_epiano1 gm_pad_2_warm` 等（`gm_` + GM 乐器名小写下划线）。
- 合成器：`sine sawtooth(saw) square triangle(tri) supersaw`，噪声 `white pink brown crackle`，ZZFX `z_sawtooth z_tan z_noise z_sine z_square`。只写 `note()` 不写 `s()` 默认 `triangle`。
- `n("0 1 [4 2]").s("jazz")` 选采样序号；对 `.scale()` 是音阶度数。
- 合成器参数：`.noise(.2)`；FM `.fm(4).fmh(1.5)` 加 `fmattack fmdecay fmsustain fmenv`；颤音 `.vib("4:.5")`；supersaw `.unison(7).detune(.2).spread(.5)`。

## 音高

- `note("c e g b")`，`#` 升 `b` 降，八度 `c2 e3`，不写默认 3；也可 MIDI 号 `note("48 52")`；`freq(440)`。
- 和弦 `note("[c,e,g]")`。
- 音阶：`n("0 2 4 6").scale("C:minor")`，写法 `根音[八度]:类型`，如 `"A2:minor:pentatonic"`，可 pattern 化 `.scale("<C:major D:mixolydian>/4")`。常用 `major minor dorian mixolydian lydian pentatonic minor:pentatonic major:pentatonic blues`。
- `.transpose(7)`、`.scaleTranspose(2)`、`.add("<0 5 7>")`。
- 和弦符号：`chord("<C^7 A7b13 Dm7 G7>").voicing()`，`.anchor("c5") .mode("below")`；`n("0 1 2 3").chord("<C Am F G>").voicing()` 当琶音；`"<C^7 Dm7>".rootNotes(2).note()` 取根音做 bass；`.arp("0 [0,2] 1")` 琶音。
- `.piano()`：钢琴音色加按音高自动 pan。

## 效果（参数都可传数字、mini-notation 或信号，多数支持 `a:b:c` 简写）

- 滤波：`lpf(freq)`（`"1000:10"` 第二段 lpq）、`lpq`、`hpf/hpq`、`bpf/bpq`、`ftype("12db|ladder|24db")`、`vowel("a e i o")`；滤波包络 `lpa lpd lps lpr lpenv`（hp*/bp* 同理）。
- 包络：`attack decay sustain release`（`att dec sus rel`）或 `.adsr(".1:.1:.5:.2")`；音高包络 `.penv(12).pdec(.5).pcurve(1)` 做 kick：`note("g1*4").s("sine").pdec(.5).penv(32)`。
- 动态：`gain`（`"[.25 1]*4"` 做重音）、`velocity`、`postgain`、`compressor("thresh:ratio:knee:att:rel")`。
- 空间：`pan(0..1)`、`jux(rev)` / `juxBy(.5, rev)`、`delay(level)`（`"0.8:0.125:0.8"` = level:time:feedback）、`delaytime delayfeedback`、`room(level)`（`"0.9:4"` 第二段 size）、`roomsize`、`dry`、`phaser`、`tremolo`。
- `orbit(n)`：同一 orbit 共用 delay / reverb，想用不同混响参数就分 orbit；`duckorbit duckattack duckdepth` 侧链。
- 失真：`distort("8:.4")`（`dist`）、`crush(4..16)`、`coarse(n)`。
- 采样控制：`speed`（负数倒放）、`begin/end`、`clip`（`legato`）、`cut(1)` 同组互斥（开镲被闭镲切断）、`loop loopBegin loopEnd`、`chop(n)`、`striate(n)`、`slice(n,"0 1 2 3")` / `splice`、`loopAt(cycles)` / `fit()`、`scrub`、`stretch`、`hurry`。
- 信号链顺序：gain/ADSR → lpf → hpf → bpf → vowel → coarse → crush → distort → tremolo → compressor → pan → phaser → postgain → delay/room → orbit → duck。同一效果写两次后者覆盖前者。

## 信号与随机

- 0..1：`sine cosine saw tri square rand perlin`；-1..1：`sine2 saw2 tri2 square2 rand2`；`irand(n)` 整数，`brand` 0/1。
- `run(n)` = `"0 1 … n-1"`，`binary(5)`。
- `.range(min,max)`、`.rangex(min,max)`（指数，频率用它）、`.segment(n)`、`.slow(4)` 改 LFO 速度。

```js
s("hh*16").gain(sine)
note("c2*8").s("sawtooth").lpf(sine.range(100, 2000).slow(4))
n(irand(8)).struct("x x*2 x x*3").scale("C:minor")
```

## 常用 Pattern 函数

- 时间：`fast slow early late rev palindrome iter ply segment euclid euclidRot swingBy(1/3, 4) linger zoom compress inside outside chunk ribbon press brak cpm`。
- 结构：`struct("x ~ x x")`、`mask("1 0 1 1")`、`beat("0,4,8,11",16)`、`shuffle(n)`、`scramble(n)`、`arrange([4, a],[2, b])`、`stack cat seq polymeter stepcat`、`silence`、`hush()`。
- 条件：`every(4, x=>x.rev())`（`firstOf`）、`lastOf`、`when`、`pick pickmod inhabit squeeze`。
- 叠加：`superimpose(fn)`、`layer(fn1, fn2)`、`off(1/8, x=>x.add(7))`、`echo(4, 1/8, .5)`、`echoWith`。
- 随机：`degrade degradeBy(p) sometimes often rarely almostNever almostAlways sometimesBy(p, fn) someCycles choose wchoose chooseCycles`。
- 数值：`add sub mul div round floor range rangex`，例 `n("0 2 4".add("<0 3 4 0>")).scale("C:major")`。

## 多轨与结构

```js
setcpm(90/4)   // 90 bpm，1 cycle = 1 小节

$: sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")
$: note("<[c2 c3]*4 [bb1 bb2]*4>").sound("gm_synth_bass_1").lpf(800)
_$: n("0 2 4").scale("C:minor").s("piano")   // 前面加 _ 静音这一轨
```

- `$:` 每行一个独立轨，也可以 `名字: pattern`；代码里也可以 `stack(a, b)`。
- 让音乐有起伏：`gain` 做重音、`< >` 做小节间变化、`every` / `sometimes` 加变化、`lpf` / `room` / `delay` 塑造空间、`arrange` 做段落。

完整示例：

```js
setcpm(60)
$: n("0 [2 4] <3 5> [~ <4 1>]".add("<0 [0,2,4]>"))
  .scale("C5:minor").sound("gm_xylophone").room(.4).delay(.125)
$: note("c2 [eb3,g3]".add("<0 <1 -1>>"))
  .adsr("[.1 0]:.2:[1 0]").sound("gm_acoustic_bass").room(.5)
$: n("0 1 [2 3] 2").sound("jazz").jux(rev)
```

```js
// 滤波包络 + 随机 + 鼓
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
## 文件索引（自动生成）

### 教程与专题（workshop 按顺序读；learn 按主题查）

- `workshop/getting-started.md` — Getting Started：Welcome to the Strudel documentation pages!
- `workshop/first-sounds.md` — First Sounds：This is the first chapter of the Strudel Workshop, nice to have you on board!
- `workshop/first-notes.md` — First Notes：Let's look at how we can play notes numbers and notes play notes with numbers Try out different numbers!
- `workshop/first-effects.md` — First Effects：We have sounds, we have notes, now let's look at effects!
- `workshop/pattern-effects.md` — Pattern Effects：Up until now, most of the functions we've seen are what other music programs are typically capable of: sequencing sounds, playing notes, con
- `workshop/recap.md` — Recap：This page is just a listing of all functions covered in the workshop!
- `learn/getting-started.md` — Getting Started：Welcome to the Strudel documentation pages!
- `learn/code.md` — Coding syntax：Let's take a step back and understand how the syntax in Strudel works.
- `learn/mini-notation.md` — Mini Notation：Just like [Tidal Cycles](https://tidalcycles.org/), Strudel uses a so called "Mini-Notation", which is a custom language that is designed fo
- `learn/notes.md` — Notes：Pitches are an important building block in many musical traditions.
- `learn/sounds.md` — Sounds：We can play sounds with s, in two different ways: - s can trigger audio samples, where a sound file is loaded in the background and played b
- `learn/samples.md` — Samples：Samples are the most common way to make sound with tidal and strudel.
- `learn/synths.md` — Synths：In addition to the sampling engine, strudel comes with a synthesizer to create sounds on the fly.
- `learn/effects.md` — Audio effects：Whether you're using a synth or a sample, you can apply any of the following built-in audio effects.
- `learn/lfo.md` — Low-frequency oscillators (LFO)：A low frequency oscillator (or short LFO) is a common way on synthesizers to continuously modulate various signals.
- `learn/signals.md` — Signals：Signals are patterns with continuous values, meaning they have theoretically infinite steps.
- `learn/time-modifiers.md` — Time Modifiers：The following functions modify a pattern temporal structure in some way.
- `learn/conditional-modifiers.md` — Conditional Modifiers：lastOf Applies the given function every n cycles, starting from the last cycle.
- `learn/random-modifiers.md` — Random Modifiers：These methods add random behavior to your Patterns.
- `learn/accumulation.md` — Accumulation Modifiers：superimpose Superimposes the result of the given function(s) on top of the original pattern: layer Layers the result of the given function(s
- `learn/factories.md` — Creating Patterns：The following functions will return a pattern.
- `learn/stepwise.md` — Stepwise patterning：This is a developing area of strudel, and behaviour might change or be renamed in future versions.
- `learn/tonal.md` — Tonal Functions：These functions use [tonaljs](https://github.com/tonaljs/tonal) to provide helpers for musical operations.
- `learn/visual-feedback.md` — Visual Feedback：There are several function that add visual feedback to your patterns.
- `learn/metadata.md` — Music metadata：You can optionally add some music metadata in your Strudel code, by using tags in code comments: Like other comments, those are ignored by S
- `learn/strudel-vs-tidal.md` — Strudel vs Tidal：This page is dedicated to exisiting tidal users, giving an overview of all the differences between Strudel and Tidal.
- `learn/faq.md` — Frequently Asked Questions：This page contains frequently asked questions, with answers.
- `recipes/recipes.md` — Recipes：This page shows possible ways to achieve common (or not so common) musical goals.
- `recipes/rhythms.md` — Build Rhythms：Note: - this has been (partly) translated from https://tidalcycles.org/docs/patternlib/howtos/buildrhythms - this only sounds good with samp
- `recipes/arpeggios.md` — Build Arpeggios：Note: This has been (partly) translated from https://tidalcycles.org/docs/patternlib/howtos/buildarpeggios Build Arpeggios This page will te
- `recipes/microrhythms.md` — Microrhythms：see https://strudel.cc/?zMEo5kowGrFc Microrhythms Inspired by this [Mini-Lecture on Microrhythm Notation](https://www.youtube.com/watch?v=or
- `understand/cycles.md` — Understanding Cycles：The concept of cycles is very central to be able to understand how Strudel works.
- `understand/pitch.md` — Understanding Pitch：Let's learn how pitch works!
- `understand/voicings.md` — Understanding Chord Voicings：Let's dig deeper into how chords and voicings work in strudel.
- `functions/intro.md` — JavaScript API：Let's learn all about functions to create and modify patterns.
- `functions/value-modifiers.md` — Control Parameters：Besides functions that control time, we saw earlier that functions like note and cutoff control different parameters (short params) of an ev

### 函数参考（reference/，先读 reference/index.md 或用 search_docs 搜函数名）

- `reference/controls.md`（208 项）：s, wt, wtenv, wtattack, wtdecay, wtsustain, wtrelease, wtrate, wtsync, wtdepth, wtshape, wtdc, wtskew, warp, warpattack, warpdecay, warpsustain, warprelease, warprate, warpdepth, warpshape, warpdc, warpskew, warpmode, wtphaserand, warpenv, warpsync, source, n, i, note, accelerate, velocity, gain, postgain, amp, fmh, fmi, fmenv, fmattack, fmwave, fmdecay, fmsustain, fmrelease, bank, chorus, attack, decay, sustain, release, bpf, bpq, begin, end, loop, loopBegin, loopEnd, crush, coarse, tremolo, tremolosync, tremolodepth, tremoloskew, tremolophase, tremoloshape, drive, duckorbit, duckdepth, duckonset, duckattack, byteBeatExpression, byteBeatStartTime, channels, pw, pwrate, pwsweep, phaser, phasersweep, phasercenter, phaserdepth, channel, cut, lpf, lpenv, hpenv, bpenv, lpattack, hpattack, bpattack, lpdecay, hpdecay, bpdecay, lpsustain, hpsustain, bpsustain, lprelease, hprelease, bprelease, ftype, fanchor, hpf, lprate, lpsync, lpdepth, lpdepthfrequency, lpshape, lpdc, lpskew, bprate, bpsync, bpdepth, bpdepthfrequency, bpshape, bpdc, bpskew, hprate, hpsync, hpdepth, hpdepthfrequency, hpshape, hpdc, hpskew, vib, noise, vibmod, hpq, lpq, djf, delay, delayfeedback, delayspeed, delaytime, delaysync, lock, detune, unison, spread, dry, fadeTime, freq, pattack, pdecay, prelease, penv, pcurve, panchor, leslie, lrate, lsize, label, octave, orbit, bus, busgain, pan, panspan, pansplay, chord, dictionary, anchor, offset, octaves, mode, room, roomlp, roomdim, roomfade, iresponse, irspeed, irbegin, roomsize, shape, distort, distortvol, distorttype, compressor, speed, stretch, unit, squiz, vowel, density, clip, duration, color, adsr, midichan, midiport, midicmd, control, ccn, ccv, nrpnn, nrpv, progNum, sysex, sysexid, sysexdata, midibend, miditouch, oschost, oscport, as, scrub, lfo, env, bmod, transient
- `reference/pattern.md`（151 项）：euclid, euclidRot, euclidLegato, euclidLegatoRot, euclidish, clearScope, layer, superimpose, log, logValues, into, arpWith, arp, add, sub, mul, div, setDefaultJoin, gap, silence, pure, sequenceP, stack, slowcat, slowcatPrime, cat, arrange, seqPLoop, sequence, seq, register, round, floor, ceil, toBipolar, fromBipolar, range, rangex, range2, ratio, compress, fastGap, focus, ply, fast, hurry, slow, inside, outside, lastOf, firstOf, every, apply, cpm, early, late, zoom, bite, linger, segment, swingBy, swing, invert, when, off, brak, rev, revv, pressBy, press, palindrome, juxBy, juxFlipBy, jux, juxFlip, echoWith, echo, stut, plyWith, plyForEach, iter, iterBack, repeatCycles, chunk, chunkBack, fastChunk, chunkInto, chunkBackInto, ribbon, tag, filter, filterWhen, within, pace, polymeter, stepcat, stepalt, take, drop, extend, replicate, expand, contract, shrink, grow, tour, zip, chop, striate, loopAt, slice, onTriggerTime, splice, fit, loopAtCps, xfade, beat, morph, soft, hard, cubic, diode, asym, fold, sinefold, chebyshev, parray, partials, phases, FX, K, worklet, base, pick, pickmod, pickF, pickmodF, pickOut, pickmodOut, pickRestart, pickmodRestart, pickReset, pickmodReset, inhabit, inhabitmod, squeeze, setcpm, all, each, getFreq, midi2note
- `reference/signals.md`（62 项）：saw, saw2, isaw, isaw2, sine2, sine, cosine, cosine2, square, square2, isquare, isquare2, tri, tri2, itri, itri2, time, mousex, mousey, useRNG, run, binary, binaryN, binaryL, binaryNL, randL, shuffle, scramble, withSeed, seed, rand, rand2, brandBy, brand, irand, chooseWith, chooseInWith, choose, chooseCycles, wchoose, wchooseCycles, perlin, berlin, degradeBy, degrade, undegradeBy, undegrade, sometimesBy, sometimes, someCyclesBy, someCycles, often, rarely, almostNever, almostAlways, never, always, whenKey, keyDown, cyclesPer, per, perx
- `reference/tonal.md`（7 项）：transpose, scaleTranspose, scale, addVoicings, voicings, rootNotes, voicing
- `reference/samples.md`（6 项）：getDur, samples, setMaxPolyphony, setGainCurve, aliasBank, soundAlias
- `reference/draw.md`（8 项）：drawLine, pianoroll, wordfall, pitchwheel, spiral, fscope, scope, spectrum
- `reference/sounds.md` — 本项目预加载的全部音色名：71 个鼓机 bank 及各自的鼓件、默认鼓组、Dirt-Samples 218 组、VCSL 128 组、GM soundfont 125 个（不确定某个音色名是否存在时查这里，heading 可用 "Drum machines" / "Dirt-Samples" / "GM soundfonts" 等）

### 示例曲（examples/tunes.md，32 首，heading = 曲名）

swimming（Koji Kondo - Swimming (Super Mario World)）；giantSteps（John Coltrane - Giant Steps）；zeldasRescue（Koji Kondo - Princess Zelda's Rescue）；caverave（"Caverave"）；sampleDrums；barryHarris（adapted from a Barry Harris excercise）；blippyRhodes（"Blippy Rhodes"）；wavyKalimba（"Wavy kalimba"）；festivalOfFingers（"Festival of fingers"）；undergroundPlumber（"Underground plumber"）；goodTimes（"Good times"）；echoPiano（"Echo piano"）；sml1（Hirokazu Tanaka - World 1-1）；randomBells（"Random bells"）；waa2（"Waa2"）；festivalOfFingers3（"Festival of fingers 3"）；meltingsubmarine（"Melting submarine"）；outroMusic（"Outro music"）；bassFuge（"Bass fuge"）；chop（"Chop"）；delay（"Delay"）；orbit（"Orbit"）；belldub（"Belldub"）；dinofunk（"Dinofunk"）；sampleDemo（"Sample demo"）；holyflute（"Holy flute"）；flatrave（"Flatrave"）；amensister（"Amensister"）；juxUndTollerei（"Jux und tollerei"）；csoundDemo（"CSound demo"）；loungeSponge（"Lounge sponge"）；arpoon（"Arpoon"）

### 鼓型库（examples/drums/<genre>.md，共 492 个，索引见 examples/drums/index.md）

afro(18), ageispolis(1), amen(1), amen-brother(1), ashleys-roach-clip(1), autobahn(2), ballad(15), big-beat(1), billy-jean(1), blue-monday(2), blues(2), book-of-moses(1), boots-ncats(1), bossa(6), bouton(1), break(2), breakbeat(3), brit-house(1), cha-cha-cha(3), chug-chug-chuga-lug(1), cissy-strut-long(1), cissy-strut-short(1), cold-sweat(1), cold-sweat-opening(1), come-dancing(1), contemporary-kick(7), contemporary-snare(6), cowd-bell(1), das-model(2), deeper-house(1), deep-house(1), dirty-house(1), disco(15), dnb(6), drumroll(19), dubstep(2), dubstep-ratcheted(1), electro(6), end(2), expensive-shit(1), express-yourself(1), footwork(2), four-on-the-floor(1), french-house(1), funk(43), funky-drummer(2), funky-president(1), generic-bossa-nova(1), generic-gahu(1), generic-rock(1), generic-rumba(1), generic-shiko(1), generic-son(1), generic-soukous(1), get-up(1), ghost-snare(4), good-to-go(1), groove-me(1), haitian-divorce(1), half-drop(1), haus(1), hiphop(15), hip-hop(1), hook-and-sling(1), hot-sweat(1), house(2), hybrid-kick(11), igot-the-feelin(1), igot-you(1), impeach-the-president(1), irregular(5), italo-disco(2), its-anew-day(1), juke(1), jungle(4), kick(1), kissing-my-love(1), knocks-off-my-feet(1), lady(1), lady-marmalade(1), let-awoman-be-awoman-let-aman-be-aman(1), looking-for-the-perfect-beat(2), lookkapypy(1), miami-bass(2), more-bounce-to-the-ounce(1), mother-popcorn(1), music-non-stop(3), new-wave(1), nico(1), numbers(2), one-drop(1), one-seven-five-thirteen(1), ooh-child(1), palm-grease(1), papa-was-too(1), pattern(64), planet-rock(1), poly(2), pop(15), poptech(1), reggae(13), reggaeton(1), respect-yourself(1), rnb(15), rock(15), rock-steady(1), rock-the-planet(1), rollin-break(1), rolling(18), sally(1), samba(9), shuffle(2), siberian-nights(1), ska(3), slow-deep-house(1), steppers(1), strbtsdcgogo(1), supersonic(4), superstition(1), swing(3), synthethic-substitution(1), synth-wave(1), take-me-to-mardi-gras(2), techno(1), the-fez(1), the-same-blood(1), the-trills-gone(1), tiny-house(1), trans-euro-express(1), trap(2), twist(6), two-drop(1), uk-garage(2), unconventional-snare(8), unknown-drummer(1), use-me(2), walk-this-way(1), we-will-rock-you(1), when-the-levee-breaks(1), ya-mama(1)
<!-- generated:end -->
