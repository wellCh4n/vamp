# 中国传统乐器采样（chinese-traditional）

两份 Strudel 采样映射，都由 `src/lib/strudel.ts` 在启动时加载：

- `strudel.json`：随项目发布的 mp3（笛子、京剧锣鼓），`_base` 指向本目录。
- `erhu.json`：二胡，`_base` 指向来源仓库的 raw.githubusercontent.com 地址（带 CORS 头），音频不在仓库里、按需加载。
  分成两个文件是因为 superdough 的 `_base` 是整份映射共用的，本地路径和远程 URL 不能混在一份里。

Strudel 用科学音高记法（c4 = MIDI 60）；下面两个来源的文件名八度都比科学记法高 1，映射里已按实测音高修正。

## 二胡 `erhu` / `erhu_stacc` / `erhu_soft`

- 来源：[sfzinstruments/aliexpress-erhu](https://github.com/sfzinstruments/aliexpress-erhu)，CC0 1.0（公有领域）。
  一把 AliExpress 买的便宜二胡，近距立体声录音，演奏者是小提琴手。
- `erhu`：长音（sus），`erhu_stacc`：短音（stac），`erhu_soft`：弱奏 sul tasto（st）。
  每个音 2 个轮替（`erhu_stacc` 4 个），用 `n("0 1")` 切换。
- 音域 D4 到 A5（`erhu_soft` 到 D6），半音全齐，超出范围会变速取最近的采样。
- 来源文件 `erhu_d5` 实测约 293 Hz，即 D4。

```js
note("d4 e4 g4 a4 d5").s("erhu").clip(1).room(.4)
```

## 笛子 `dizi`

- 来源：Freesound pack [Flute Dizi C all notes + pitched semitones](https://freesound.org/people/Hypnotriod/packs/21613/)，作者 Hypnotriod，CC0 1.0。
- C 调笛，25 个半音，G4 到 G6（来源文件按 MIDI 号 67–91 命名，实测音高与 MIDI 号一致）。
  自然音是实录，半音是作者移调得到的。
- 处理：16-bit 单声道 wav 转 mp3（libmp3lame VBR q3），峰值归一到 -1 dBFS。每个音约 8 秒，用 `clip` / `release` 控制长度。

```js
note("g5 a5 b5 d6 e6").s("dizi").clip(1).delay(.3)
```

## 京剧锣鼓 `bangu` / `xiaoluo` / `daluo` / `naobo`

- 来源：Freesound pack [QMUL-BeijingOperaPercussion](https://freesound.org/people/ajaysm/packs/14056/)，上传者 ajaysm，CC BY 4.0。
  演奏 Ying Wan（London Jing Kun Opera Association），录音 Mi Tian，Centre for Digital Music, Queen Mary University of London，2013 年 9 月，AKG C414。
  数据集说明：http://compmusic.upf.edu/bo-perc-dataset 。作者要求在研究中使用时引用：
  Mi Tian, Ajay Srinivasamurthy, Mark Sandler and Xavier Serra, *A Study of Instrument-wise Onset Detection in Beijing Opera Percussion Ensembles*, Proc. IEEE ICASSP 2014.
- 四件乐器的单击采样：板鼓 `bangu`（59 个）、小锣 `xiaoluo`（65 个）、大锣 `daluo`（50 个）、铙钹 `naobo`（62 个），用 `n` 选第几个，顺序同来源编号。
- 处理：32-bit float 单声道 wav 转 mp3（libmp3lame VBR q3），裁掉起始静音（保留 2 ms），峰值归一到 -1 dBFS（来源里有很多极弱的击打，归一后力度差异变小，靠 `gain` 自己做强弱）。

```js
s("bangu*8").n("<0 5 12 20>*8").gain(".9 .5")
s("~ xiaoluo ~ daluo, naobo(3,8)").n(irand(40))
```

## 已有的近似音色（无需额外加载）

- 古筝：VCSL 的 `dantranh`（越南筝，同族）、`dantranh_tremolo`、`dantranh_vibrato`；GM `gm_koto`。
- 锣鼓：VCSL `gong`、`gong2`、`woodblock`；GM `gm_taiko_drum`、`gm_woodblock`。
- 扬琴 `gm_dulcimer`、唢呐 `gm_shanai`、箫 `gm_shakuhachi`、笛 `gm_pan_flute`。
