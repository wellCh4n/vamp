# Traditional Chinese instrument samples (chinese-traditional)

`strudel.json` is a Strudel sample map loaded by `src/lib/strudel.ts` at startup. Its `_base` points at this directory, and the mp3s ship with the project.

To add mappings that point at external URLs later, start a separate json file: superdough's `_base` is shared by the whole map, so local paths and remote URLs cannot be mixed.

## Beijing opera percussion `bangu` / `xiaoluo` / `daluo` / `naobo`

- Source: the Freesound pack [QMUL-BeijingOperaPercussion](https://freesound.org/people/ajaysm/packs/14056/), uploaded by ajaysm, CC BY 4.0.
  Performed by Ying Wan (London Jing Kun Opera Association), recorded by Mi Tian at the Centre for Digital Music, Queen Mary University of London, September 2013, with an AKG C414.
  Dataset description: http://compmusic.upf.edu/bo-perc-dataset. The authors ask that research use cite:
  Mi Tian, Ajay Srinivasamurthy, Mark Sandler and Xavier Serra, *A Study of Instrument-wise Onset Detection in Beijing Opera Percussion Ensembles*, Proc. IEEE ICASSP 2014.
- Single-stroke samples of four instruments: bangu drum `bangu` (59), small gong `xiaoluo` (65), large gong `daluo` (50) and cymbals `naobo` (62). Pick one with `n`; the order follows the source numbering.
- Processing: 32-bit float mono wav converted to mp3 (libmp3lame VBR q3), leading silence trimmed (2 ms kept), peak normalized to -1 dBFS (the source has many very quiet strokes, so normalizing flattens the dynamics — shape them yourself with `gain`).

```js
s("bangu*8").n("<0 5 12 20>*8").gain(".9 .5")
s("~ xiaoluo ~ daluo, naobo(3,8)").n(irand(40))
```

## Close-enough sounds already available (no extra loading)

- Guzheng: VCSL's `dantranh` (the Vietnamese zither, same family), `dantranh_tremolo`, `dantranh_vibrato`; GM `gm_koto`.
- Gongs and drums: VCSL `gong`, `gong2`, `woodblock`; GM `gm_taiko_drum`, `gm_woodblock`.
- Yangqin `gm_dulcimer`, suona `gm_shanai`, xiao `gm_shakuhachi`, dizi `gm_pan_flute`.
