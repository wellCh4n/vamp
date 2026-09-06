export interface CheatItem {
  syntax: string
  desc: string
}

export interface CheatSection {
  title: string
  items: CheatItem[]
}

// 精简版速查（界面右侧面板用），完整内容见 docs/strudel-notes.md 和 skills/strudel/
export const cheatsheet: CheatSection[] = [
  {
    title: 'Mini-notation',
    items: [
      { syntax: 'bd sd hh', desc: '空格分隔，平分一个 cycle' },
      { syntax: 'hh:2', desc: '选第 n 个采样' },
      { syntax: '~  或  -', desc: '休止' },
      { syntax: '[hh hh]', desc: '子序列，再细分' },
      { syntax: '<a b c>', desc: '每 cycle 播一个' },
      { syntax: 'hh*4  /  [a b]/2', desc: '加速 / 减速' },
      { syntax: 'bd*2, hh*4', desc: '并行 / 和弦' },
      { syntax: 'c@3 e  /  c!2 e', desc: '延长 / 重复' },
      { syntax: 'hh*8?  /  a | b', desc: '随机丢弃 / 随机选' },
      { syntax: 'bd(3,8)', desc: '欧几里得节奏' },
    ],
  },
  {
    title: 'Sound & Note',
    items: [
      { syntax: 's("bd").bank("RolandTR909")', desc: '采样 + 鼓机' },
      { syntax: 'n("0 2 4").scale("C:minor")', desc: '音阶度数' },
      { syntax: 'note("c e g")  /  note("48 52 55")', desc: '音名 / MIDI 号' },
      { syntax: 's("sawtooth square triangle sine")', desc: '合成器波形' },
      { syntax: 'setcpm(120/4)', desc: '速度：一小节一个 cycle' },
      { syntax: '$: ...   _$: ...', desc: '多轨 / 静音一轨' },
    ],
  },
  {
    title: 'Effects',
    items: [
      { syntax: '.lpf(800)  .hpf(200)  .vowel("a e")', desc: '滤波' },
      { syntax: '.adsr(".1:.1:.5:.2")', desc: '包络' },
      { syntax: '.gain("[.25 1]*4")', desc: '音量 / 重音' },
      { syntax: '.delay(".5:.125:.8")  .room(.5)', desc: '延迟 / 混响' },
      { syntax: '.pan(sine)  .speed(-1)', desc: '声像 / 变速' },
      { syntax: '.lpf(saw.range(200,4000).slow(4))', desc: 'LFO 自动化' },
    ],
  },
  {
    title: 'Pattern',
    items: [
      { syntax: '.rev()  .jux(rev)  .ply(2)', desc: '倒放 / 立体声 / 重复' },
      { syntax: '.off(1/8, x=>x.add(7))', desc: '错位叠加' },
      { syntax: '.every(4, x=>x.fast(2))', desc: '每 4 个 cycle' },
      { syntax: '.sometimes(x=>x.speed(2))', desc: '随机应用' },
      { syntax: '.add("<0 3 5>")', desc: '数值 / 移调' },
      { syntax: '.struct("x ~ x x")', desc: '按节奏结构触发' },
    ],
  },
]
