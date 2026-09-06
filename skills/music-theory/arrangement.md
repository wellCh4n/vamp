# 编排与结构

规则一句话：**分段，每段 4 或 8 小节，逐段加减声部，第二遍和第一遍不一样。**

## 最小结构

```
intro（4）→ A 主段（8）→ B 副歌 / 高潮（8）→ A'（8）→ outro（4）
```

- intro：一两个声部（鼓 + bass，或 pad + 旋律片段），让人知道速度和调。
- A：完整的鼓、bass、和弦，旋律可以只有一半。
- B：加东西——旋律翻高八度、和弦换七和弦、加副旋律、hh 变密、`room` 变大。
- A'：回到 A，但保留 B 的一两个元素。
- outro：逐个撤声部，或 `lpf` 慢慢关。

## Strudel 里怎么分段

### 方法一：`arrange`（最清楚）

```js
setcpm(110/4)
const key = "A:minor", prog = "<Am F C G>"
const drums = s("bd ~ sd ~, hh*8").bank("RolandTR909")
const bass = chord(prog).rootNotes(2).note().struct("x ~ x x").s("sawtooth").lpf(400)
const chords = chord(prog).voicing().s("gm_epiano1").room(.4).gain(.6)
const lead = n("<[0 2 4 2] [5 4 2 0]>").scale(key).add(note(12)).s("piano")

$: arrange(
  [4, stack(bass, chords)],                      // intro
  [8, stack(drums, bass, chords)],               // A
  [8, stack(drums, bass, chords, lead)],         // B
  [8, stack(drums, bass, chords, lead.add(note(12)))],   // B'：旋律翻高
  [4, stack(chords)],                            // outro
)
```

`arrange([小节数, pattern], ...)` 按顺序播放，播完从头循环。小节数用 4 的倍数。

### 方法二：每轨用 `<>` 或 `mask` 控制出现

```js
$: drums.mask("<0 1 1 1>/4")            // 前 4 小节没鼓
$: lead.mask("<0 0 1 1>/4")             // 第 9 小节起才有旋律
$: chords.gain("<.4 .4 .7 .7>/4")       // 副歌变响
```

`mask` 的字符串是每小节一个 0/1，`/4` 把它拉长到每格 4 小节。这种方式改一轨不影响别的，适合 live coding 时逐步加。

### 方法三：`every` / `sometimes` 做局部变化（不改结构）

```js
$: drums.every(4, x => x.fast(2))                   // 每 4 小节末尾加倍做 fill
$: lead.every(2, x => x.add(note(12)))              // 每 2 小节翻高一次
$: hh.sometimesBy(.25, x => x.ply(2))               // 随机双击
$: chords.lpf("<400 800 1600 4000>/4")              // 4 小节内滤波逐渐打开
```

## 加减声部的原则

- 一次只加或减一个声部，变化发生在 4 / 8 小节的边界上。
- 上升段（往高潮走）：加声部、hh 变密、`lpf` 打开、`room` 变大、旋律升八度。
- 下降段：先撤 kick（保留 hh 和 pad 会有"悬空"感），再撤 bass。
- 过渡：段落最后一小节做 fill（鼓 `fast(2)`、`ply`）、或整个一拍静音 `"~"`、或加 crash `cr`。
- 段落之间保留至少一个声部不变，让人知道还是同一首曲子。

## 音色和空间的编排

- 每个声部一种空间：鼓干（`room 0–.2`），pad 湿（`room .5+ size .8`），lead 中等 + `delay`。
- 全部声部都加大 `room` 会糊成一团。
- 频率位置：bass 低（`lpf`），pad 中（`lpf 2000` 左右），hh / 装饰高（`hpf`）。
- 高潮段可以把整体 `gain` 提高 10–20%，但先给前面留余地（主段 `gain .6–.8`）。

## 长度与循环

- Strudel 是无限循环的，`arrange` 播完会从 intro 重来，这是正常的。
- 用户说"太短 / 太快就重复了"：把 A、B 从 4 小节改成 8 小节，或在 `<>` 里多写几个变体。
- 用户说"太单调"：先检查有没有 B 段，再加 `every`。
