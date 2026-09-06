# 中国传统乐器采样（chinese-traditional）

`strudel.json` 是 Strudel 采样映射，由 `src/lib/strudel.ts` 在启动时加载，`_base` 指向本目录，mp3 随项目发布。

如果以后要加指向外部 URL 的映射，另开一份 json：superdough 的 `_base` 是整份映射共用的，本地路径和远程 URL 不能混。

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
