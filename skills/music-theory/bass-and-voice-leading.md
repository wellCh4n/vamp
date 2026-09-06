# Bass 与声部安排

规则一句话：**bass 走根音、跟着 kick；各声部分音区；同一时刻在动的声部不超过 3 个。**

## Bass 的三个层次

1. **根音长音**（最安全）：
   ```js
   $: chord(prog).rootNotes(2).note().s("gm_acoustic_bass").clip(.95)
   ```
2. **根音节奏化**（大多数曲风）：让 bass 跟 kick 的位置走。
   ```js
   $: chord(prog).rootNotes(2).note().struct("x ~ x ~ ~ x ~ x").s("sawtooth").lpf(400)
   $: chord(prog).rootNotes(2).note().ply("<2 4>").s("gm_synth_bass_1").clip(.5)   // 八分 / 十六分律动
   ```
3. **根音 + 五音 / 八度 / 经过音**（有旋律感的 bass）：用度数写，五音是 +4，八度是 +7，进入下一个和弦前用经过音。
   ```js
   // 以度数写：每小节根音度数是 0 5 3 4（对应 C Am F G），在此基础上加 0 / 4 / 7
   $: n("<0 5 3 4>".add("0 ~ 4 7 0 ~ 4 [7 6]")).scale("C2:major").s("gm_electric_bass_finger").clip(.8)
   ```
   注意最后一格的 `6` 是走向下一小节根音的经过音，放在小节最后一个弱拍。

- 和弦切换的那一拍（通常是小节第一拍）**必须**弹根音，中间怎么走都行。
- bass 音区：`rootNotes(2)` 或 `scale("C2:...")`，即 C2–C3 附近。再低听不清，再高会撞和弦。
- bass 一次只有一个音，不要叠和弦。`.lpf(300–600)` 去掉高频毛刺，electronic bass 用 `sawtooth` / `square` 加 `lpf` + `lpenv`。

## Bass 和 kick 的关系

- 同步：bass 的 `struct` 和 kick 的 pattern 用同一个节奏字符串，或让 bass 只在 kick 上。
- 错开（funk / house）：kick 在正拍，bass 在反拍或十六分后半，`"~ x ~ x"` 之类，但小节第一拍仍要有一个（bass 或 kick 至少一个）。
- 不要让 bass 和 kick 都在密集的十六分上同时动，低频会糊，二选一密、另一个疏。

## 音区分配

| 声部 | 八度 | Strudel |
|---|---|---|
| kick / bass | 1–2 | `rootNotes(2)`、`scale("C2:…")` |
| 和弦 / pad | 3–4 | `voicing()` 默认；`.anchor("c5").mode("below")` 压低 |
| 旋律 / lead | 4–5 | `scale("C4:…")` 或 `.add(note(12))` |
| 装饰 / 琶音 / hh | 5–6 | `.add(note(24))` |

- 两个声部不要在同一八度同时动：旋律 4–5，则和弦压在 3–4 或做成琶音靠高一点（5–6）。
- pad 和 lead 用不同音色类型（一个 pad / 弦乐 / epiano，一个 pluck / lead / piano），否则听不出谁是谁。

## 声部连接（voice leading）

- `.voicing()` 已经自动选择离上一个和弦最近的配置，平滑连接，正常情况不用管。
- 自己用 `note("[c,e,g]")` 手写和弦时，相邻和弦尽量只动一两个音：C `[c,e,g]` → Am `[c,e,a]` → F `[c,f,a]` → G `[b,d,g]`，而不是每个都从根音堆起来。
- 旋律和 bass 不要长时间平行（同方向同度数），偶尔反向（旋律上行时 bass 下行）会更好听。

## 密度控制

- 一个时刻最多 3 个"在动"的声部（鼓算一个，pad 长音不算）。
- 一个声部密（十六分 hh 或琶音），其他声部就要疏（长音、每拍一次）。
- 最容易犯的错是 hh、琶音、旋律三个都是十六分：留一个。
- 副歌加声部，主歌减声部，intro 只留一两个。见 `music-theory/arrangement.md`。
