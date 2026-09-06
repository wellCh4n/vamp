# 节奏、拍号与速度

规则一句话：**1 cycle = 1 小节；`setcpm(bpm/拍数)`；强拍在 1 和 3，backbeat 在 2 和 4；密的声部和疏的声部搭配。**

## Cycle 和拍号

Strudel 没有"拍号"，一个 cycle 里放几个平分的单位就是几拍。

| 拍号 | setcpm | 鼓的基本型 |
|---|---|---|
| 4/4（默认） | `setcpm(bpm/4)` | `s("bd ~ sd ~, hh*8")` |
| 3/4（华尔兹） | `setcpm(bpm/3)` | `s("bd hh hh")` 或 `s("bd ~ ~, ~ hh hh")` |
| 6/8（摇摆、民谣） | `setcpm(bpm/2)`，bpm 按附点四分计 | `s("[bd hh hh] [sd hh hh]")` |
| 2/4（进行曲、京剧锣鼓） | `setcpm(bpm/2)` | `s("bd sd")` |
| 5/4 | `setcpm(bpm/5)` | `s("bd hh sd hh hh")` |
| 7/8 | `setcpm(bpm/7)`，bpm 按八分计 | `s("bd hh sd hh bd hh hh")`（分组 3+2+2） |

- 多拍子（polymeter）：`"{bd sd hh}%4"` 让三个音按四拍步进，几个 cycle 后回到原位；只放在一个装饰声部上，主声部保持 4/4。
- 拍号在整首曲子里不变，除非用户明确要求。

## 速度表（bpm，4/4 时 `setcpm(bpm/4)`）

| 曲风 | bpm | 曲风 | bpm |
|---|---|---|---|
| ambient / downtempo | 60–90 | house | 120–128 |
| lofi hip hop | 70–90 | techno | 125–140 |
| hip hop / trap | 85–100（trap 常写 140 半速） | trance | 130–140 |
| R&B / neo-soul | 70–95 | dubstep | 140（半速感） |
| 流行 | 100–125 | drum and bass / jungle | 165–175 |
| funk / disco | 100–120 | footwork | 155–165 |
| reggae | 70–90 | 摇滚 | 110–140 |
| bossa nova | 120–140（感觉是半速） | punk / 金属 | 160–200 |
| 华尔兹 3/4 | 90–180（按四分音符） | 中国民乐 | 60–110 |

不知道用什么就 100–110。

## 强弱拍

4/4 一小节四拍：**强 弱 次强 弱**。

- kick 落 1 和 3（或所有正拍），snare / clap 落 2 和 4（backbeat）。这是几乎所有流行 / 电子的基础，先写它再加花。
- 旋律和和弦的重要音落在 1（其次 3）。
- 用 `gain` 做重音而不是靠加音：`s("hh*8").gain("1 .6 .8 .6 1 .6 .8 .6")` 或 `.gain(".9 .6")`（两个值会自动按事件循环）。
- 弱拍起、切分（音落在拍之间）产生推动感：`"~ bd ~ bd"`、`"bd ~ [~ bd] ~"`。

## 密度搭配

一个层次密、一个层次疏，是好听节奏的基本原理。

| 层 | 典型密度 |
|---|---|
| kick | 每拍或每两拍一个 |
| snare | 每两拍一个（2、4） |
| hh | 八分或十六分（最密的层） |
| bass | 跟 kick 或八分 |
| 和弦 | 每小节 1–2 次或长音 |
| 旋律 | 八分 + 休止 |

- 三个以上的层都在十六分上跑就是"乱"。
- hh 太密时用 `.gain(.4)` 或 `.hpf(6000)` 压下去，别让它盖住旋律。

## 有用的节奏手法

```js
$: s("bd*2, ~ sd, hh*8").bank("RolandTR909").swingBy(1/3, 4)   // swing：把偶数八分往后推，hip hop / house 常用
$: s("hh(5,8), bd(3,8)")                                        // 欧几里得节奏：k 个音平均分在 n 格里，天然好听
$: s("bd sd").every(4, x => x.fast(2))                          // 每 4 小节一次加倍，做 fill
$: s("hh*8").sometimesBy(.2, x => x.ply(2))                     // 偶尔 32 分双击
$: s("bd ~ sd ~").late(.01)                                     // 整轨微延迟，人性化
$: s("sd").struct("~ x ~ [x x]")                                // 节奏型和音色分开写
```

- 欧几里得数值参考：`(3,8)` 三连感 / tresillo，`(5,8)` cinquillo，`(7,16)` 密一点的拉丁感，`(3,4)` 简单强拍。
- 每 4 或 8 小节做一次变化（fill、去掉 kick 一拍、加 crash）：`every(4, ...)`、`"<... ...!3 fill>"`。

## 和曲风鼓型库配合

鼓型库 `examples/drums/<genre>.md` 是现成的、符合曲风的节奏，优先直接用，再按上表调速度和 swing。它们用 `bd sd hh oh cp rim` 这些默认鼓件，配 `.bank()` 换鼓机音色。
