---
name: music-theory
description: 让写出来的音乐符合乐理：调与音阶、和弦进行、bass 与声部、旋律、节奏拍号与速度、编排、中国五声调式。本文件是底线 + 索引；细则在同目录下，用 read_doc("music-theory/<文件>") 按需读取。
---

# Music theory skill（乐理）

## 底线（写任何旋律、和声、bass 之前都要满足）

1. **先定调、拍号、速度**：`setcpm(bpm/4)` 让 1 cycle = 一小节 4/4；速度按曲风（lofi 70–90、流行 100–125、house 120–128、techno 125–140、dnb 170–175）。
2. **旋律和 bass 用度数写**：`n("0 2 4").scale("<根音>:<音阶>")`，不要在 `note()` 里手拼音名；整首曲子用同一个 scale 根音，这样不会出调外音。五声（`major:pentatonic` / `minor:pentatonic`）最不容易错。
3. **和声按小节走**：`chord("<C Am F G>").voicing()`，4 或 8 小节一轮，每小节 1 个（最多 2 个）和弦；一轮的最后一个和弦不要是 I，用 V 或 IV 推回开头。
4. **bass 走根音**：从同一个进行派生 `chord(prog).rootNotes(2).note()`，和弦切换那一拍必须弹根音；节奏跟 kick。
5. **旋律强拍落和弦音**：每小节和每拍的第一个音是当前和弦的根 / 三 / 五音（C 大调：C=0 2 4，Am=5 0 2，F=3 5 0，G=4 6 1），其他音只做弱拍经过音；级进为主，大跳后反向；乐句 2 或 4 小节，段尾回到度数 0 或 4；A A B A'。
6. **分音区、控密度**：bass 2 八度、和弦 3–4、旋律 4–5、装饰 5–6；同一时刻在动的声部不超过 3 个，一个密（hh / 琶音）其他就疏。
7. **有结构**：至少 intro → 主段 → 变化段，用 `arrange` 或每轨 `mask("<0 1 1 1>/4")` 逐段加减声部，第二遍和第一遍不一样。

## 什么时候读细则

| 情况 | 读 |
|---|---|
| 要写一首完整的曲子，或用户说"不好听 / 不协和 / 太乱 / 单调" | `read_doc("music-theory/checklist.md")`：写前决定、默认方案、写后检查、用户反馈对应的修法 |
| 选调、选音阶，或想换色彩 / 转调 | `music-theory/scales-and-keys.md` |
| 选和弦进行、按曲风找进行、旋律该落哪些音 | `music-theory/chords-and-progressions.md` |
| 写 bass、安排音区、声部太挤 | `music-theory/bass-and-voice-leading.md` |
| 写旋律、动机发展、旋律像随机音 | `music-theory/melody.md` |
| 拍号不是 4/4、定速度、强弱拍、swing、欧几里得 | `music-theory/rhythm-and-meter.md` |
| 分段、加减声部、做高潮和过渡 | `music-theory/arrangement.md` |
| 中国风、五声调式、宫商角徵羽、锣鼓经 | `music-theory/chinese-modes.md` |

一轮里通常读 1～2 篇就够；底线里已经有的不用再查。资料里的代码用的是本项目可用的音色和函数，可直接改编。

## 文件索引

- `music-theory/checklist.md` — 乐理检查清单：写前定五件事、拿不准就用的默认方案、写后对照、用户反馈对应修法
- `music-theory/scales-and-keys.md` — 调与音阶：度数写法、常用音阶色彩表、大小调关系、度数与和弦对应、转调
- `music-theory/chords-and-progressions.md` — 和弦与进行：符号、功能、按曲风的进行表、旋律强拍该落的度数、让和弦有动感、常见错误
- `music-theory/bass-and-voice-leading.md` — bass 三个层次、bass 与 kick、音区分配表、声部连接、密度控制
- `music-theory/melody.md` — 旋律五条规则、节奏优先、动机发展手法表、音区音色、常见错误
- `music-theory/rhythm-and-meter.md` — cycle 与拍号对照、按曲风的速度表、强弱拍、密度搭配、swing / 欧几里得 / fill
- `music-theory/arrangement.md` — 最小结构、`arrange` / `mask` / `every` 三种分段方法、加减声部原则、空间与频率编排
- `music-theory/chinese-modes.md` — 宫商角徵羽五种调式、三种七声、旋律特征、薄和声、可用音色、锣鼓经写法、完整骨架
