# 乐理检查清单（写曲前后各过一遍）

这套乐理资料的目的只有一个：让写出来的 Strudel 代码"听起来对"。每篇都给出规则、为什么、以及 Strudel 里的写法。本篇是总入口，先按下面的顺序把决定做完，再打开对应的篇目查细节。

## 写之前：先定五件事

1. **调**：一个根音 + 一种音阶，写成 `"C:major"` 这样的字符串，之后所有 `n().scale()` 都用它。默认选择：明亮用 `C:major` / `G:major`，忧郁用 `A:minor` / `D:minor`，中国风、电子、lofi 常用五声 `C:major:pentatonic` / `A:minor:pentatonic`。→ `music-theory/scales-and-keys.md`
2. **拍号与速度**：绝大多数曲子 4/4，`setcpm(bpm/4)` 让一个 cycle 正好是一小节。速度按曲风取值。→ `music-theory/rhythm-and-meter.md`
3. **和弦进行**：4 或 8 小节一轮，每小节 1 个和弦，写成 `chord("<C Am F G>")`。不知道选什么就用本篇下面的默认进行。→ `music-theory/chords-and-progressions.md`
4. **声部分工与音区**：鼓 / bass（2 八度）/ 和弦（3–4 八度）/ 旋律（4–5 八度）/ 装饰，各占各的位置。→ `music-theory/bass-and-voice-leading.md`
5. **结构**：至少 intro → 主段 → 变化段，用 `arrange` 或 `<>` 实现，别让一个 cycle 循环到底。→ `music-theory/arrangement.md`

## 默认方案（拿不准就用这个，不会出错）

```js
setcpm(100/4)
const key = "C:major"
const prog = "<C Am F G>"          // 每小节一个和弦，4 小节一轮

$: s("bd ~ sd ~, hh*8").bank("RolandTR909").gain(".9 .6")
$: chord(prog).voicing().s("gm_epiano1").room(.3).gain(.6)
$: chord(prog).rootNotes(2).note().s("gm_acoustic_bass").clip(.9)
$: n("<[0 2 4 2] [0 ~ 4 7] [2 4 5 4] [4 2 0 ~]>").scale(key).s("piano").add(note(12))
```

这段能成立的原因：和弦按小节走；bass 在每小节第一拍弹根音；旋律的每小节第一个音（0、0、2、4）都是当前和弦的和弦音；所有声部共用 `key`；音区分开。

## 写完之后：对照检查

- [ ] 所有旋律 / bass 都通过 `.scale(key)` 写度数？有没有手写的 `note("c# ...")` 混进别的调？
- [ ] 每小节开头 bass 弹的是那小节和弦的根音？
- [ ] 旋律每小节第一个音是和弦音（对主和弦是度数 0 / 2 / 4，对其他和弦见 chords 篇的对照表）？
- [ ] 乐句是 2 或 4 小节一句，最后一句回到主音（度数 0）或五音（度数 4）？
- [ ] 有没有两个声部挤在同一音区同时动？
- [ ] 同一时刻在动的声部不超过 3 个？hh 之类的填充是不是盖过了主旋律？
- [ ] 至少有一处 `<>`、`every`、`sometimes` 或 `arrange` 让第 2 遍和第 1 遍不一样？
- [ ] 速度、鼓型和用户点名的曲风匹配（见鼓型库和 rhythm 篇的速度表）？

## 用户反馈对应的修法

| 用户说 | 大概率原因 | 先改这里 |
|---|---|---|
| 不协和 / 有音不对 | 调外音、旋律强拍不在和弦音上、bass 没走根音 | 检查清单前三条 |
| 太乱 / 太吵 | 同时在动的声部太多，音区重叠，hh 太密太响 | 删声部、分音区、hh 降 gain |
| 单调 / 没起伏 | 一个 cycle 循环到底 | `<>` 变化、`arrange` 分段、加 `every` |
| 没有中国味 | 用了七声大调而不是五声，旋律大跳太多，没有落在徵 / 羽上 | `music-theory/chinese-modes.md` |
| 不像 XX 曲风 | 速度 / 鼓型 / 和弦类型不对 | rhythm 篇速度表 + 鼓型库 + chords 篇的曲风进行表 |
