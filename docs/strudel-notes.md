# Strudel 学习笔记

> 来源：strudel.cc 官方 workshop / learn 文档 + 源码 JSDoc（仓库现已迁到 https://codeberg.org/uzu/strudel ）。整理日期 2026-09-06。
> 目的：作为 Vamp 项目的基础参考（给人看）。Agent 用的资料在 skills/strudel/（`npm run skill:build` 生成），速查部分见 skills/strudel/SKILL.md。

---

## 1. Strudel 是什么

- Tidal Cycles（Haskell 的 live coding 音乐语言）的官方 JavaScript 移植版，在浏览器里用 Web Audio 直接发声。
- 用途：live coding、算法作曲、教学、作为 MIDI/OSC 音序器。
- 在线 REPL：https://strudel.cc/
  - `Ctrl+Enter` 运行/更新，`Ctrl+.` 停止，`//` 注释掉一行。
- **许可证：AGPL-3.0**。用 Strudel 做的程序（包括读源码后的"仿写"）必须以兼容的开源许可证发布，并提供源码。做 Vamp 时要注意。

### 核心概念

- **Pattern（模式）**：一个时间函数。查询某个时间区间，返回这段时间内的事件（Hap/event）。所有 `note()`、`s()`、`.lpf()` 等都返回 Pattern，可以链式调用。
- **Cycle（周期）**：时间的基本单位。默认 **30 cpm（cycles per minute）= 1 cycle 每 2 秒**。一个序列的所有内容会被"压进"一个 cycle。
- **越长的序列跑得越快**：`"bd sd"` 每个音占半个 cycle；`"bd sd hh cp"` 每个占 1/4。
- 事件触发后，效果参数只在"触发那一刻"被采样（除 ADSR、pitch env、vib、tremolo、phaser 等本身是连续的）。想让 LFO 连续变化，要用 `.segment(n)` 增加事件数。

---

## 2. Mini-Notation（引号里的迷你语言）

写在**双引号 `"..."`** 或 **反引号 `` `...` ``（可多行）** 里会被解析；**单引号 `'...'`** 是普通 JS 字符串不解析。

| 概念 | 语法 | 示例 | 说明 |
|---|---|---|---|
| 序列 | 空格 | `"bd sd hh cp"` | 平分一个 cycle |
| 选样本编号 | `:n` | `"hh:0 hh:1 hh:2"` | 不写等于 `:0`；`s` 里还能 `bd:1:0.5`（第三个是 gain） |
| 休止 | `~` 或 `-` | `"bd ~ hh -"` | |
| 子序列 | `[ ]` | `"bd [hh hh] sd"` | 括号内再平分它所占的那一格，可无限嵌套 |
| 加速 | `*n` | `"hh*4"`, `"[bd sd]*2"`, `"hh*1.5"` | 可用小数 |
| 减速 | `/n` | `"[c a f e]/2"` | 跨 n 个 cycle 播完 |
| 每 cycle 一个 | `< >` | `"<bd sd hh>"` | 等价 `"[bd sd hh]/3"`，加减元素不改变速度；常配 `*n`：`"<a b c d>*8"` |
| 并行/和弦 | `,` | `"bd*2, hh*4"`, `"[c,e,g]"` | 多层同时播 |
| 延长 | `@n` | `"c@3 eb"` | 权重，默认 `@1` |
| 延长（另一种） | `_` | `"c _ _ eb"` | 每个 `_` 把前一个音延长一格 |
| 重复 | `!n` / `!` | `"c!2 e"`, `"c ! e"` | 复制事件但不加速 |
| 随机丢弃 | `?` / `?0.1` | `"hh*8?"`, `"hh*8?0.2"` | 默认 50% 概率被去掉 |
| 随机选一 | `\|` | `"bd \| hh \| sd"` | 每 cycle 随机选一个分支 |
| 欧几里得节奏 | `(beats,segments,offset)` | `"bd(3,8)"`, `"bd(3,8,2)"` | 3 个击点均匀分布在 8 格里 |
| 多拍子 polymeter | `{ }` / `{ }%n` | `"{c eb g, c2 g2}%4"` | 大括号内各层按"步"对齐而不是按 cycle；`%n` 指定每 cycle 几步 |
| 分组 | `.` | `"bd sd . hh hh hh"` | 用点把序列分成等长的"脚"，等价 `"[bd sd] [hh hh hh]"` |
| 取样本 gain | 在 `s()` 里 `:` 第三段 | `"bd:0:0.3"` | |

多行写法：

```js
sound(`
[-  -  oh - ] [-  -  -  - ] [-  -  -  - ] [-  -  -  - ],
[hh hh -  - ] [hh -  hh - ] [hh -  hh - ] [hh -  hh - ],
[-  -  -  - ] [cp -  -  - ] [-  -  -  - ] [cp -  -  - ],
[bd -  -  - ] [-  -  -  bd] [-  -  bd - ] [-  -  -  bd]
`)
```

对应的函数写法（Mini-notation ⇔ 函数）：

| mini | 函数 |
|---|---|
| `"x*2"` | `.fast(2)` |
| `"x/2"` | `.slow(2)` |
| `"x(3,8)"` | `.euclid(3,8)` |
| `"x(3,8,1)"` | `.euclidRot(3,8,1)` |
| `"hh?"` | `.degrade()` / `.degradeBy(.5)` |
| `"a \| b"` | `chooseCycles("a","b")` |
| `"a b, c d"` | `stack("a b","c d")` |
| `"<a b>"` | `cat("a","b")` / `slowcat` |
| `"a b"` | `seq("a","b")` / `fastcat` |
| `"a@3 b"` | `stepcat([3,"a"],[1,"b"])` |

---

## 3. 声音（Sound / Samples / Synth）

### `s()` / `sound()`
- 按名字选采样或合成器：`s("bd hh sd oh")`。
- 默认自带的音色（无需加载）：
  - 鼓：`bd`(kick) `sd`(snare) `rim` `cp`(clap) `hh`(closed hat) `oh`(open hat) `cr`(crash) `rd`(ride) `ht` `mt` `lt`(toms) `sh`(shaker) `cb`(cowbell) `tb`(tambourine) `perc` `misc` `fx`
  - 杂项采样：`casio insect wind jazz metal east crow space numbers num`
  - 钢琴：`piano`
  - GM 乐器（VCSL / soundfont）：`gm_electric_guitar_muted` `gm_acoustic_bass` `gm_synth_bass_1` `gm_synth_strings_1` `gm_xylophone` `gm_voice_oohs` `gm_blown_bottle` `gm_accordion` `gm_flute` `gm_lead_6_voice` ...（REPL 的 sounds 面板可查完整列表）
  - 合成器波形：`sine` `sawtooth`(`saw`) `square` `triangle`(`tri`)、`supersaw`、噪声 `white` `pink` `brown` `crackle`、ZZFX：`z_sawtooth z_tan z_noise z_sine z_square`、波表：`wt_*`
- **只写 `note()` 不写 `s()` 时默认用 `triangle`**。
- 采样是惰性加载的：第一次触发可能听不到（还在下载）。

### `bank()`
- 选鼓机：`s("bd sd hh").bank("RolandTR909")`。原理是把名字拼成 `RolandTR909_bd`。
- 常用：`RolandTR808` `RolandTR909` `RolandTR707` `RolandTR505` `AkaiLinn` `RhythmAce` `ViscoSpaceDrum` `CasioRZ1` `RolandCompurhythm1000`。
- 可以 pattern 化：`.bank("<RolandTR808 RolandTR909>")`。

### `n()`
- 对采样：选第几个样本（越界会 wrap）：`n("0 1 [4 2] 3*2").s("jazz")`。
- 对 `.scale()`：音阶度数。对 `.voicing()`：声部索引。

### 加载自定义采样 `samples()`
```js
// 1. 对象 + base URL
samples({
  bassdrum: 'bd/BT0AADA.wav',
  snaredrum: ['sd/rytm-01-classic.wav', 'sd/rytm-00-hard.wav'], // 数组 → n 选择
}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/');

// 2. strudel.json 的 URL（json 里可用 "_base" 指定基址）
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')

// 3. github 快捷方式  github:<user>/<repo>/<branch>（branch 默认 main）
samples('github:tidalcycles/dirt-samples')

// 4. 带音高的采样（自动挑最接近的）
samples({ moog: { g2: 'moog/004.wav', g3: 'moog/005.wav' } }, 'github:tidalcycles/dirt-samples')
note("g2 c3").s('moog')

// 5. 本地：npx @strudel/sampler  → samples('http://localhost:5432/')
// 6. shabda（freesound 搜索 / TTS）：samples('shabda:bass:4,hihat:4') / samples('shabda/speech:hello')
```
- `soundAlias('RolandTR808_bd', 'kick')` 起别名。
- 官方 REPL 默认加载的 CDN（可在自己项目里复用）：`https://strudel.b-cdn.net/` 下的 `piano.json`、`vcsl.json`、`tidal-drum-machines.json`、`uzu-drumkit.json`、`uzu-wavetables.json`、`mridangam.json`、`Dirt-Samples/`。

### 合成器参数
- 波形选择通过 `s()`；`.noise(0.2)` 加粉噪；`.density()` 控制 crackle。
- 加法合成：`.partials([1,0,0.3,0,0.1])` `.phases([...])`（配 `s("user")` 可造新波形；`randL(n)` 生成随机列表）。
- FM：`.fm(4)`（=fmi 调制指数）`.fmh(1.5)`（谐波比）`.fmattack .fmdecay .fmsustain .fmenv("lin|exp")`。
- 颤音：`.vib(4)` Hz，`.vibmod(0.5)` 半音深度；简写 `.vib("4:.5")`。
- supersaw：`.unison(7)` `.detune(.2)` `.spread(.5)`。
- 波表：`samples('bubo:waveforms'); s('wt_flute')`，`wt_` 前缀自动 loop。
- ZZFX 参数：`zrand curve slide deltaSlide zmod zcrush zdelay pitchJump pitchJumpTime lfo tremolo`。

---

## 4. 音高（Notes）

- `note("48 52 55 59")` MIDI 号（69 = A4 440Hz，可用小数做微分音）。
- `note("c e g b")` 字母（a–g，大小写皆可），`#` 升 `b` 降：`"c# eb"`；八度：`"c2 e3 g4"`，**不写八度默认 3**。
- `freq("220 275 330 440")` 直接给频率。
- 和弦：`note("[c,e,g]")` 或 `note("c,e,g")`。
- **音阶** `n("0 2 4 6").scale("C:minor")`：数字是音阶度数（可负、可越界自动升八度）。写法 `根音[八度]:类型`，多词类型用冒号连接：`"A2:minor:pentatonic"` `"C4:bebop:major"`。可 pattern 化：`.scale("<C:major D:mixolydian>/4")`。常用：`major minor dorian mixolydian lydian pentatonic minor:pentatonic major:pentatonic blues`。
- 移调：`.transpose(7)` 或音程记法 `.transpose("<1P -2M 4P 3m>")`；`.scaleTranspose(2)` 在音阶内移动。
- `.add(n)` 对 note 也生效（内部转成 MIDI 号）：`note("c2 e3".add("<0 5 7>"))`。
- 和弦符号 → 声部：`chord("<C^7 A7b13 Dm7 G7>").voicing()`，可加 `.dict('ireal')` `.anchor("c5")` `.mode("below|above|duck|root")` `.offset(1)`，`n("0 1 2 3").chord("<C Am F G>").voicing()` 当琶音用；`"<C^7 Dm7>".rootNotes(2).note()` 取根音做 bass。
- `.arp("0 [0,2] 1")` 对叠置和弦做琶音。
- `.piano()` 快捷：钢琴音色 + 按音高自动 pan。

---

## 5. 效果（Audio Effects）

参数都可以传数字、mini-notation 字符串或信号。大多数支持 `a:b:c` 的冒号简写。

### 滤波器
| 函数 | 别名 | 说明 |
|---|---|---|
| `lpf(freq)` | `cutoff`, `lp`, `ctf` | 低通截止频率；`"1000:10"` 第二段是 lpq |
| `lpq(q)` | `resonance` | 低通共振 0–50 |
| `hpf(freq)` / `hpq` | `hp`, `hcutoff` / `hresonance` | 高通 |
| `bpf(freq)` / `bpq` | `bandf`, `bp` / `bandq` | 带通 |
| `ftype("12db\|ladder\|24db")` | | 滤波器类型 |
| `vowel("a e i o u")` | | 元音共振峰滤波，还有 `ae aa oe ue y uh un en an on` |
| 滤波包络 | `lpattack/lpa lpdecay/lpd lpsustain/lps lprelease/lpr lpenv/lpe`（hp*/bp* 同理） | `lpenv` 是深度 |

### 包络
- `.attack(.1) .decay(.1) .sustain(.25) .release(.2)`，别名 `att dec sus rel`。
- 简写 `.adsr(".1:.1:.5:.2")`。
- 音高包络：`.penv(12)`（半音）`.pattack .pdecay .prelease .pcurve(0|1) .panchor`。做 kick：`note("g1*4").s("sine").pdec(.5).penv(32).pcurve(1)`。

### 动态 / 空间
| 函数 | 说明 |
|---|---|
| `gain(x)` | 音量（指数），`"[.25 1]*4"` 做重音 |
| `velocity(x)` | 0–1，与 gain 相乘 |
| `postgain(x)` | 所有效果之后的增益 |
| `compressor("thresh:ratio:knee:att:rel")` | 压缩 |
| `pan(0..1)` | 声像，可用 `sine` 等信号 |
| `jux(fn)` | 左声道原样，右声道应用 fn：`.jux(rev)` |
| `juxBy(0.5, fn)` | 可调立体声宽度；`juxFlip` 每 cycle 交换左右 |
| `delay(level)` | 延迟量 0–1；简写 `"0.8:0.125:0.8"` = level:time:feedback |
| `delaytime(s)` / `delayfeedback(0..1)` | feedback ≥1 会越来越响 |
| `room(level)` | 混响量；`"0.9:4"` 第二段是 size |
| `roomsize(0..10)` `roomfade` `roomlp` `roomdim` | 混响细节（改变会重算，别频繁改） |
| `dry(x)` | 混响干湿 |
| `phaser(speed)` `phaserdepth phasercenter phasersweep` | 相位器 |
| `tremolo(hz)` / `tremolosync(cycles)` `tremolodepth tremoloskew` | 颤音（音量） |
| `orbit(n)` | 全局效果总线，**同一 orbit 共用一套 delay/reverb**，不同 pattern 想用不同混响参数要分 orbit |
| `duckorbit(n) duckattack duckdepth` | 侧链闪避（kick 压其他 orbit） |
| `xfade(patA, "0..1", patB)` | 交叉淡化 |

### 失真 / 降质
- `distort(amount)`（别名 `dist`，可 `"8:.4"` 带 postgain）；`crush(1..16)` 位压缩；`coarse(n)` 降采样；`shape` 已弃用。

### 采样播放控制
| 函数 | 说明 |
|---|---|
| `speed(x)` | 播放速度（改音高），负数倒放：`"<1 2 -1 -2>"` |
| `begin(0..1)` / `end(0..1)` | 截头/截尾 |
| `clip(x)` / `legato` | 事件时长乘以 x，超出会切掉；采样默认播完整个文件，`clip(1)` 让它跟随事件长度 |
| `cut(group)` | 同组互斥（开镲被闭镲切断）：`s("[oh hh]*4").cut(1)` |
| `loop(1)` `loopBegin` `loopEnd` | 循环 |
| `chop(n)` | 切成 n 段依次播（粒子感） |
| `striate(n)` | 每次播采样的下一段 |
| `slice(n, "0 1 2 3")` / `splice` | 切片重排；splice 会变速适配格长 |
| `loopAt(cycles)` / `fit()` | 让采样长度适配 n 个 cycle / 事件长度（做 break 循环） |
| `scrub("0.25:2")` | 像磁带一样拖动播放位置 |
| `stretch(x)` | 变调不变速 |
| `hurry(x)` | 同时 fast + speed |

信号链顺序（每个效果只能出现一次，后写的覆盖前面的）：source → gain/ADSR → lpf → hpf → bpf → vowel → coarse → crush → distort → tremolo → compressor → pan → phaser → postgain → dry/delay/room → orbit → duck → mixer。

---

## 6. 信号（Signals）——连续值，用来做自动化

- 0..1 范围：`sine` `cosine` `saw` `tri` `square` `rand` `perlin`（平滑随机）
- -1..1 范围：`sine2 cosine2 saw2 tri2 square2 rand2`
- 离散随机：`irand(n)` 0..n-1 整数，`brand` 0/1，`brandBy(p)`
- 序列：`run(n)` = `"0 1 ... n-1"`；`binary(5)` / `binaryN(55532,16)` 二进制节奏；`randL(n)` 随机列表
- 鼠标：`mousex` `mousey`
- 变换：`.range(min,max)`（线性）`.rangex(min,max)`（指数，频率用它）`.range2`（给 -1..1 的）`.segment(n)` 把连续信号采样成每 cycle n 个事件；`.slow(4)` 改变 LFO 速度。

```js
s("hh*16").gain(sine)
s("hh*16").lpf(saw.range(500, 2000))
note("c2*8").s("sawtooth").lpf(sine.range(100, 2000).slow(4))
n(sine.segment(16).range(0,15)).scale("C:minor")
n(irand(8)).struct("x x*2 x x*3").scale("C:minor")
```

---

## 7. Pattern 变换函数

### 时间
| 函数 | 说明 |
|---|---|
| `fast(n)` / `slow(n)` | `*` / `/`，可 pattern 化 `.fast("<1 [2 4]>")`；`.slow("0.5,1,1.5")` 同时多个速度叠加 |
| `early(t)` / `late(t)` | 提前/延后 t 个 cycle |
| `rev()` | 每个 cycle 内倒放；`palindrome()` 正反交替 |
| `iter(n)` / `iterBack(n)` | 每 cycle 起点往后/前移一格 |
| `ply(n)` | 每个事件重复 n 次（`"<1 2 3>"`） |
| `segment(n)` | 采样为每 cycle n 个事件 |
| `euclid(k,n)` `euclidRot(k,n,r)` `euclidLegato` | 欧几里得 |
| `swingBy(x, n)` / `swing(n)` | 摇摆（swing = swingBy(1/3, n)） |
| `linger(frac)` | 取前面一部分反复填满 cycle |
| `zoom(a,b)` | 只放 a..b 这一段拉伸到整 cycle |
| `compress(a,b)` / `fastGap(n)` | 压进一段留空 |
| `inside(n, fn)` / `outside(n, fn)` | 在 n 倍 cycle 内/外做变换 |
| `chunk(n, fn)` / `chunkBack` / `fastChunk` | 分 n 块，每 cycle 轮流对一块应用 fn |
| `ribbon(offset, cycles)` | 截取时间带循环（固定随机结果很有用） |
| `press()` / `pressBy(x)` | 把事件推后半格（切分感） |
| `brak()` | breakbeat 感 |
| `cpm(n)` | 单个 pattern 的速度 |

### 结构
| 函数 | 说明 |
|---|---|
| `struct("x ~ x x")` | 用布尔/`x` 模式给内容定节奏：`note("c,e,g").struct("x ~ x*2")` |
| `mask("1 0 1 1")` | 用 1/0 遮罩 |
| `beat("0,4,8,11", 16)` | 按 16 分位置指定击点 |
| `invert()` | 1/0 互换 |
| `euclid`、`shuffle(n)`、`scramble(n)` | 切 n 块随机重排（shuffle 每块一次，scramble 可重复） |
| `arrange([4, patA], [2, patB])` | 编排多个 pattern 各占几 cycle |
| `stack(...)` / `cat(...)` / `seq(...)` / `polymeter(...)` / `stepcat([w,pat],...)` | 组合 |
| `silence` / `.hush()` | 静音 |
| `set(pat)` / `keep(pat)` | 合并参数（后者/前者优先） |

### 条件
| 函数 | 说明 |
|---|---|
| `every(n, fn)` = `firstOf(n, fn)` | 每 n 个 cycle 的第一个应用 fn：`.every(4, x=>x.rev())` |
| `lastOf(n, fn)` | 每 n 个 cycle 的最后一个 |
| `when("<0 1>", fn)` | 条件为真时应用 |
| `pick` / `pickmod` / `inhabit` / `squeeze` | 按索引从 pattern 列表里挑 |

### 叠加
| 函数 | 说明 |
|---|---|
| `superimpose(fn)` | 原样 + fn 结果 |
| `layer(fn1, fn2, ...)` | 只要 fn 的结果 |
| `off(t, fn)` | 复制、延后 t、应用 fn：`.off(1/8, x=>x.add(7))`，可嵌套 |
| `echo(times, t, feedback)` | 回声式叠加，音量递减 |
| `echoWith(times, t, (p,i)=>...)` | 每次不同变换 |
| `jux(fn)` | 见效果 |

### 随机
| 函数 | 说明 |
|---|---|
| `degrade()` / `degradeBy(p)` / `undegrade` | 随机丢事件 |
| `sometimes(fn)` = 50%，`sometimesBy(p, fn)`，`often` 75%，`rarely` 25%，`almostNever` 10%，`almostAlways` 90% | 按事件随机应用 |
| `someCycles(fn)` / `someCyclesBy(p, fn)` | 按 cycle 随机 |
| `choose(a,b,c)` / `wchoose([a,10],[b,1])` / `chooseCycles(...)` | 随机选值 |

### 数值运算
`add sub mul div round floor ceil range rangex range2`，例：`n("0 2 4".add("<0 3 4 0>")).scale("C:major")`；`"<1 1.5 2>".mul(150).freq()`。

### 可视化 / 调试
`.color("cyan")` `.label("x")` `.log()` `.tag("id")` `._scope()` `._pianoroll()` `._punchcard()`。

---

## 8. 组合多轨 & 速度

```js
setcpm(90/4)   // 90 bpm 4/4：一个 cycle = 一小节；setcps(1) 是每秒 1 cycle

$: sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")
$: note("<[c2 c3]*4 [bb1 bb2]*4>").sound("gm_synth_bass_1").lpf(800)
_$: n("0 2 4").scale("C:minor").s("piano")   // 前面加 _ 静音这一轨
```

- `$:` 每行一个独立轨（REPL/transpiler 语法糖，等价于 `stack(...)`）。也可 `名字: pattern`。
- 代码里也可以 `stack(a, b, c)` 或 `a.stack(b)`。
- `hush()` 全停。

### 完整示例（workshop 结尾）

```js
setcpm(60)
$: n("0 [2 4] <3 5> [~ <4 1>]".add("<0 [0,2,4]>"))
  .scale("C5:minor").sound("gm_xylophone").room(.4).delay(.125)
$: note("c2 [eb3,g3]".add("<0 <1 -1>>"))
  .adsr("[.1 0]:.2:[1 0]").sound("gm_acoustic_bass").room(.5)
$: n("0 1 [2 3] 2").sound("jazz").jux(rev)
```

```js
// 官方示例风格：滤波包络 + 随机 + 鼓
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

---

## 9. 在自己的项目里使用 Strudel（Vamp 关键）

### 方案对比
| 方式 | 包 | 特点 |
|---|---|---|
| iframe | `<iframe src="https://strudel.cc/?<share-id>">` 或 `#<base64 code>` | 最简单，UI 是官方的 |
| `@strudel/embed` | `<strudel-repl><!-- code --></strudel-repl>` | iframe 封装 |
| `@strudel/repl` | `<strudel-editor><!-- code --></strudel-editor>` | 内嵌官方 CodeMirror 编辑器，无 iframe，可锁版本 |
| **`@strudel/web`** | `initStrudel()` + `.play()` / `evaluate()` | **自己做 UI 用这个**（推荐给 Vamp） |
| 细粒度 npm | `@strudel/core` `@strudel/mini` `@strudel/webaudio` `@strudel/transpiler` `@strudel/tonal` `@strudel/soundfonts` `@strudel/codemirror` ... | 需要 Vite 之类的打包器 |

### `@strudel/web` 用法（当前版本 1.3.0）

```html
<script src="https://unpkg.com/@strudel/web@1.3.0"></script>
<button id="play">play</button><button id="stop">stop</button>
<script>
  initStrudel({
    prebake: () => samples('github:tidalcycles/dirt-samples'),  // 默认不加载任何外部采样！
  });
  play.onclick = () => note('<c a f e>(3,8)').jux(rev).play();
  stop.onclick = () => hush();
</script>
```

```js
// npm / Vite
import { initStrudel, evaluate, hush, samples } from '@strudel/web';
await initStrudel({ prebake: () => samples('github:tidalcycles/dirt-samples') });
await evaluate('note("c a f e").jux(rev)');        // 字符串代码 → 转译 → 播放（第二参数 autoplay=true）
hush();                                            // 停止
```

要点：
- `initStrudel()` 后所有函数挂到全局；返回一个 Promise（初始化完成）。内部做了 `initAudioOnFirstClick()`，**浏览器 autoplay 策略要求先有用户点击**。
- 默认只注册合成器音色（`registerSynthSounds`），**采样需要在 `prebake` 里自己 `samples()`**。要跟官方 REPL 一样的音色，可加载 `https://strudel.b-cdn.net/tidal-drum-machines.json`、`piano.json`、`vcsl.json` 等（见第 3 节）。
- `evaluate(code)` 行为与 REPL 完全一致（双引号=mini-notation，支持 `$:`）。直接写 JS 时，字符串上不能直接 `.slow(2)`，要用 `m("1 2 3").slow(2)` 或包在控制函数里 `n("1 2 3")`；`miniAllStrings` 默认开启，把所有字符串当 mini-notation。
- `initStrudel` 的其余选项透传给 `webaudioRepl` → `repl()`，可用的回调：
  - `onToggle(started)` 播放/停止状态
  - `beforeEval({code})` / `afterEval({code, pattern, meta})` / `onEvalError(err)`
  - `editPattern(pat => pat)` 对每次设置的 pattern 做统一处理（例如全局加效果）
  - `onUpdateState(state)`（含 `started`, `error`, `pattern`, `code`）
  - `sync: true` 多标签页同步调度（SharedWorker）
  - `audioContext` 自定义 AudioContext
- `initStrudel()` resolve 的对象就是 repl：`{ scheduler, evaluate, evaluateBlock, start, stop, pause, toggle, setCps, setPattern, setCode, state }`。`scheduler.cps` 当前速度，`scheduler.now()` 当前时间；`setcpm(n)`/`setcps(n)` 在代码里改速度。
- 每个事件（Hap）可以通过 `pattern.onTrigger((hap, currentTime, cps, targetTime) => ...)` 挂回调，做可视化/灯光联动；`hap.value` 是参数对象（note、s、gain…），`hap.whole.begin/end` 是时间。
- 需要高亮当前播放代码位置时，`meta`/`hap.context.locations` 里有源码位置信息（官方编辑器就是这么做的）。
- 采样 URL 需可跨域（CORS）访问。

---

## 10. 对 Vamp 的几点想法

- 最小可行架构：Vite + `@strudel/web`，一个文本区（或 `@strudel/codemirror`）+ play/stop + `evaluate()`；用 `prebake` 加载官方 CDN 的鼓机和钢琴采样，就能跑 workshop 里所有示例。
- 如果想让 AI 生成音乐代码，Strudel 代码本身就是提示词友好的文本，`evaluate()` 直接执行；`onEvalError` 能把错误喂回去修正。
- 用 `onToggle` / `onTrigger` 做可视化（punchcard/pianoroll 官方有 `@strudel/draw`）。
- 记得 AGPL：项目需开源。

## 附：本地留存的原始资料
`/private/tmp/claude-501/-Users-chenweihao-Code-vibe-music/189a0e3d-a3ef-4ace-9965-edaed6f8f54d/scratchpad/strudel/` 下有 workshop 各章 mdx、learn 各页 mdx、`controls.mjs`/`pattern.mjs`/`signal.mjs`/`tonal.mjs` 源码、`web.mjs`/`repl.mjs`、`krill.pegjs`（mini-notation 语法）以及提取出的 `jsdoc.json`。（scratchpad 是会话级临时目录，需要时从 codeberg 重新拉取。）
