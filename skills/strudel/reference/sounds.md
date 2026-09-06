# Available sounds

本项目启动时预加载的全部音色名（由 scripts/build-strudel-skill.mjs 从官方 CDN 清单生成）。`s("name")` 只能用这里出现的名字；`n` 或 `name:n` 选同名采样里的第几个。

## Synths（无需加载）

`sine sawtooth(saw) square triangle(tri) supersaw` · 噪声 `white pink brown crackle` · ZZFX `z_sawtooth z_tan z_noise z_sine z_square`。只写 `note()` 不写 `s()` 默认 `triangle`。

## Drum machines

用 `s("bd sd hh").bank("RolandTR909")`，或直接 `s("RolandTR909_bd")`。别名（如 `bank("tr909")`）也可用。每个 bank 后面列出它有的鼓件：

- **AJKPercusyn**（别名 Percysyn）: bd cb ht sd
- **AkaiLinn**（别名 Linn）: bd cb cp cr hh ht lt mt oh rd sd sh tb
- **AkaiMPC60**（别名 MPC60）: bd cp cr hh ht lt misc mt oh perc rd rim sd
- **AkaiXR10**（别名 XR10）: bd cb cp cr hh ht lt misc mt oh perc rd rim sd sh tb
- **AlesisHR16**（别名 HR16）: bd cp hh ht lt oh perc rim sd sh
- **AlesisSR16**（别名 SR16）: bd cb cp cr hh misc oh perc rd rim sd sh tb
- **BossDR110**（别名 DR110）: bd cp cr hh oh rd sd
- **BossDR220**（别名 DR220）: bd cp cr hh ht lt mt oh perc rd sd
- **BossDR55**（别名 DR55）: bd hh rim sd
- **BossDR550**（别名 DR550）: bd cb cp cr hh ht lt misc mt oh perc rd rim sd sh tb
- **CasioRZ1**（别名 RZ1）: bd cb cp cr hh ht lt mt rd rim sd
- **CasioSK1**（别名 SK1）: bd hh ht mt oh sd
- **CasioVL1**（别名 VL1）: bd hh sd
- **DoepferMS404**（别名 MS404）: bd hh lt oh sd
- **EmuDrumulator**（别名 Drumulator）: bd cb cp cr hh ht lt mt oh perc rim sd
- **EmuModular**: bd misc perc
- **EmuSP12**（别名 SP12）: bd cb cp cr hh ht lt misc mt oh perc rd rim sd
- **KorgDDM110**（别名 DDM110）: bd cp cr hh ht lt oh rim sd
- **KorgKPR77**（别名 KPR77）: bd cp hh oh sd
- **KorgKR55**（别名 KR55）: bd cb cr hh ht oh perc rim sd
- **KorgKRZ**（别名 KRZ）: bd cr fx hh ht lt misc oh rd sd
- **KorgM1**（别名 M1）: bd cb cp cr hh ht misc mt oh perc rd rim sd sh tb
- **KorgMinipops**（别名 Minipops）: bd hh misc oh sd
- **KorgPoly800**（别名 Poly800）: bd
- **KorgT3**（别名 T3）: bd cp hh misc oh perc rim sd sh
- **Linn9000**（别名 9000）: bd cb cr hh ht lt mt oh perc rd rim sd tb
- **LinnDrum**: bd cb cp cr hh ht lt mt oh perc rd rim sd sh tb
- **LinnLM1**（别名 LM1）: bd cb cp hh ht lt oh perc rim sd sh tb
- **LinnLM2**（别名 LM2）: bd cb cp cr hh ht lt mt oh rd rim sd sh tb
- **MFB512**: bd cp cr hh ht lt mt oh sd
- **MoogConcertMateMG1**（别名 ConcertMateMG1）: bd sd
- **MPC1000**: bd cp hh oh perc sd sh
- **OberheimDMX**（别名 DMX）:  bd cp cr hh ht lt mt oh rd rim sd sh tb
- **RhodesPolaris**（别名 Polaris）: bd misc sd
- **RhythmAce**（别名 Ace）: bd hh ht lt oh perc sd
- **RolandCompurhythm1000**（别名 Compurhythm1000）: bd cb cp cr hh ht lt mt oh perc rd rim sd
- **RolandCompurhythm78**（别名 Compurhythm78）: bd cb hh misc oh perc sd tb
- **RolandCompurhythm8000**（别名 Compurhythm8000）: bd cb cp cr hh ht lt mt oh perc rim sd
- **RolandD110**（别名 D110）: bd cb cr hh lt oh perc rd rim sd sh tb
- **RolandD70**（别名 D70）: bd cb cp cr hh lt mt oh perc rd rim sd sh
- **RolandDDR30**（别名 DDR30）: bd ht lt sd
- **RolandJD990**（别名 JD990）: bd cb cp cr hh ht lt misc mt oh perc rd sd tb
- **RolandMC202**（别名 MC202）: bd ht perc
- **RolandMC303**（别名 MC303）: bd cb cp fx hh ht lt misc mt oh perc rd rim sd sh tb
- **RolandMT32**（别名 MT32）: bd cb cp cr hh ht lt mt oh perc rd rim sd sh tb
- **RolandR8**（别名 R8）: bd cb cp cr hh ht lt mt oh perc rd rim sd sh tb
- **RolandS50**（别名 S50）: bd cb cp cr ht lt misc mt oh perc rd sd sh tb
- **RolandSH09**（别名 SH09）: bd
- **RolandSystem100**（别名 System100）: bd hh misc oh perc sd
- **RolandTR505**（别名 TR505）: bd cb cp cr hh ht lt mt oh perc rd rim sd
- **RolandTR606**（别名 TR606）: bd cr hh ht lt oh sd
- **RolandTR626**（别名 TR626）: bd cb cp cr hh ht lt mt oh perc rd rim sd sh tb
- **RolandTR707**（别名 TR707）: bd cb cp cr hh ht lt mt oh rim sd tb
- **RolandTR727**（别名 TR727）: perc sh
- **RolandTR808**（别名 TR808）: bd cb cp cr hh ht lt mt oh perc rim sd sh
- **RolandTR909**（别名 TR909）: bd cp cr hh ht lt mt oh rd rim sd
- **SakataDPM48**（别名 DPM48）: bd cp cr hh ht lt mt oh perc rd rim sd sh
- **SequentialCircuitsDrumtracks**（别名 CircuitsDrumtracks）: bd cb cp cr hh ht oh rd rim sd sh tb
- **SequentialCircuitsTom**（别名 CircuitsTom）: bd cp cr hh ht oh sd
- **SergeModular**: bd misc perc
- **SimmonsSDS400**（别名 SDS400）: ht lt mt sd
- **SimmonsSDS5**（别名 SDS5）: bd hh ht lt mt oh rim sd
- **SoundmastersR88**（别名 R88）: bd cr hh oh sd
- **UnivoxMicroRhythmer12**（别名 MicroRhythmer12）: bd hh oh sd
- **ViscoSpaceDrum**（别名 SpaceDrum）: bd cb hh ht lt misc mt oh perc rim sd
- **XdrumLM8953**（别名 LM8953）: bd cr hh ht lt mt oh rd rim sd tb
- **YamahaRM50**（别名 RM50）: bd cb cp cr hh ht lt misc mt oh perc rd sd sh tb
- **YamahaRX21**（别名 RX21）: bd cp cr hh ht lt mt oh sd
- **YamahaRX5**（别名 RX5）: bd cb fx hh lt oh rim sd sh tb
- **YamahaRY30**（别名 RY30）: bd cb cp cr hh ht lt misc mt oh perc rd rim sd sh tb
- **YamahaTG33**（别名 TG33）: bd cb cp cr fx ht lt misc mt oh perc rd rim sd sh tb

## Default drum kit（不带 bank 时的 bd sd hh …，来自 uzu-drumkit）

bd(8), brk, cb, cp(2), cr(2), hh(5), ht, lt, misc(5), mt, oh(4), rd, rim(2), sd(5), sh, tb

## Piano

piano（按音高）

`note("c e g").s("piano")` 或 `.piano()`。

## Dirt-Samples（Tidal 经典采样包，括号里是同名采样个数，用 `n` 选择）

808(6), 808bd(25), 808cy(25), 808hc(5), 808ht(5), 808lc(5), 808lt(5), 808mc(5), 808mt(5), 808oh(5), 808sd(25), 909, ab(12), ade(10), ades2(9), ades3(7), ades4(6), alex(2), alphabet(26), amencutup(32), armora(7), arp(2), arpy(11), auto(11), baa(7), baa2(7), bass(4), bass0(3), bass1(30), bass2(5), bass3(11), bassdm(24), bassfoo(3), battles(2), bd(24), bend(4), bev(2), bin(2), birds(10), birds3(19), bleep(13), blip(2), blue(2), bottle(13), breaks125(2), breaks152, breaks157, breaks165, breath, bubble(8), can(14), casio(3), cb, cc(6), chin(4), circus(3), clak(2), click(4), clubkick(5), co(4), coins, control(2), cosmicg(15), cp(2), cr(6), crow(4), d(4), db(13), diphone(38), diphone2(12), dist(16), dork2(4), dorkbot(2), dr(42), dr_few(8), dr2(6), dr55(4), drum(6), drumtraks(13), e(8), east(9), electro1(13), em2(6), erk, f, feel(7), feelfx(8), fest, fire, flick(17), fm(17), foo(27), future(17), gab(10), gabba(4), gabbaloud(4), gabbalouder(4), glasstap(3), glitch(8), glitch2(8), gretsch(24), gtr(3), h(7), hand(17), hardcore(12), hardkick(6), haw(6), hc(6), hh(13), hh27(13), hit(6), hmm, ho(6), hoover(6), house(8), ht(16), if(5), ifdrums(3), incoming(8), industrial(32), insect(3), invaders(18), jazz(8), jungbass(20), jungle(13), juno(12), jvbass(13), kicklinn, koy(2), kurt(7), latibro(8), led, less(4), lighter(33), linnhats(6), lt(16), made(7), made2, mash(2), mash2(4), metal(10), miniyeah(4), monsterb(6), moog(7), mouth(15), mp3(4), msg(9), mt(16), mute(28), newnotes(15), noise, noise2(8), notes(15), num(21), numbers(9), oc(4), odx(15), off, outdoor(6), pad(3), padlong, pebbles, perc(6), peri(15), pluck(17), popkick(10), print(11), proc(2), procshort(8), psr(30), rave(8), rave2(4), ravemono(2), realclaps(4), reverbkick, rm(2), rs, sax(22), sd(2), seawolf(3), sequential(8), sf(18), sheffield, short(5), sid(12), simplesine(6), sitar(8), sn(52), space(18), speakspell(12), speech(7), speechless(10), speedupdown(9), stab(23), stomp(10), subroc3d(11), sugar(2), sundance(6), tabla(26), tabla2(46), tablex(3), tacscan(22), tech(13), techno(7), tink(5), tok(4), toys(13), trump(11), ul(10), ulgab(5), uxay(3), v(6), voodoo(5), wind(10), wobble, world(3), xmas, yeah(31)

## VCSL（Versilian 乐器采样，多为打击乐 / 民族乐器）

agogo(5), anvil(9), balafon（按音高）, balafon_hard（按音高）, balafon_soft（按音高）, ballwhistle(2), bassdrum1(8), bassdrum2(30), belltree（按音高）, bongo(28), brakedrum(17), cabasa(6), cajon(18), clap(10), clash(10), clash2(5), clave(6), clavisynth（按音高）, conga(34), cowbell(13), dantranh（按音高）, dantranh_tremolo（按音高）, dantranh_vibrato（按音高）, darbuka(20), didgeridoo(12), fingercymbal, flexatone(8), fmpiano（按音高）, folkharp（按音高）, framedrum(18), glockenspiel（按音高）, gong(7), gong2(6), guiro(5), handbells(3), handchimes（按音高）, harmonica（按音高）, harmonica_soft（按音高）, harmonica_vib（按音高）, harp（按音高）, hihat(15), kalimba（按音高）, kalimba2（按音高）, kalimba3（按音高）, kalimba4（按音高）, kalimba5（按音高）, kawai（按音高）, marimba（按音高）, marktrees(6), ocarina（按音高）, ocarina_small（按音高）, ocarina_small_stacc（按音高）, ocarina_vib（按音高）, oceandrum(3), organ_4inch（按音高）, organ_8inch（按音高）, organ_full（按音高）, piano1（按音高）, pipeorgan_loud（按音高）, pipeorgan_loud_pedal（按音高）, pipeorgan_quiet（按音高）, pipeorgan_quiet_pedal（按音高）, psaltery_bow（按音高）, psaltery_pluck（按音高）, psaltery_spiccato（按音高）, ratchet(8), recorder_alto_stacc（按音高）, recorder_alto_sus（按音高）, recorder_alto_vib（按音高）, recorder_bass_stacc（按音高）, recorder_bass_sus（按音高）, recorder_bass_vib（按音高）, recorder_soprano_stacc（按音高）, recorder_soprano_sus（按音高）, recorder_tenor_stacc（按音高）, recorder_tenor_sus（按音高）, recorder_tenor_vib（按音高）, sax（按音高）, sax_stacc（按音高）, sax_vib（按音高）, saxello（按音高）, saxello_stacc（按音高）, saxello_vib（按音高）, shaker_large(6), shaker_small(16), siren(5), slapstick(5), sleighbells(6), slitdrum(6), snare_hi(8), snare_low(20), snare_modern(72), snare_rim(4), steinway（按音高）, strumstick（按音高）, super64（按音高）, super64_acc（按音高）, super64_vib（按音高）, sus_cymbal(25), sus_cymbal2(23), tambourine(7), tambourine2(7), timpani(30), timpani_roll(10), timpani2(204), tom_mallet(8), tom_rim(6), tom_stick(8), tom2_mallet(8), tom2_rim(6), tom2_stick(8), trainwhistle(6), triangles(37), tubularbells（按音高）, tubularbells2（按音高）, vibraphone（按音高）, vibraphone_bowed（按音高）, vibraphone_soft（按音高）, vibraslap(4), wineglass（按音高）, wineglass_slow（按音高）, woodblock(10), xylophone_hard_ff（按音高）, xylophone_hard_pp（按音高）, xylophone_medium_ff（按音高）, xylophone_medium_pp（按音高）, xylophone_soft_ff（按音高）, xylophone_soft_pp（按音高）

## Chinese traditional

本项目自带（public/samples/chinese-traditional）。京剧锣鼓（单击采样，`n` 选第几个）：板鼓 `bangu`、小锣 `xiaoluo`、大锣 `daluo`、铙钹 `naobo`。来源与授权见 public/samples/chinese-traditional/README.md。

bangu(59), daluo(50), naobo(62), xiaoluo(65)

## GM soundfonts（125 个，按需从 CDN 加载，第一次触发会稍有延迟）

用 `note("c e g").s("gm_epiano1")`。

gm_piano, gm_epiano1, gm_epiano2, gm_harpsichord, gm_clavinet, gm_celesta, gm_glockenspiel, gm_music_box, gm_vibraphone, gm_marimba, gm_xylophone, gm_tubular_bells, gm_dulcimer, gm_drawbar_organ, gm_percussive_organ, gm_rock_organ, gm_church_organ, gm_reed_organ, gm_accordion, gm_harmonica, gm_bandoneon, gm_acoustic_guitar_nylon, gm_acoustic_guitar_steel, gm_electric_guitar_jazz, gm_electric_guitar_clean, gm_electric_guitar_muted, gm_overdriven_guitar, gm_distortion_guitar, gm_guitar_harmonics, gm_acoustic_bass, gm_electric_bass_finger, gm_electric_bass_pick, gm_fretless_bass, gm_slap_bass_1, gm_slap_bass_2, gm_synth_bass_1, gm_synth_bass_2, gm_violin, gm_viola, gm_cello, gm_contrabass, gm_tremolo_strings, gm_pizzicato_strings, gm_orchestral_harp, gm_timpani, gm_string_ensemble_1, gm_string_ensemble_2, gm_synth_strings_1, gm_synth_strings_2, gm_choir_aahs, gm_voice_oohs, gm_synth_choir, gm_orchestra_hit, gm_trumpet, gm_trombone, gm_tuba, gm_muted_trumpet, gm_french_horn, gm_brass_section, gm_synth_brass_1, gm_synth_brass_2, gm_soprano_sax, gm_alto_sax, gm_tenor_sax, gm_baritone_sax, gm_oboe, gm_english_horn, gm_bassoon, gm_clarinet, gm_piccolo, gm_flute, gm_recorder, gm_pan_flute, gm_blown_bottle, gm_shakuhachi, gm_whistle, gm_ocarina, gm_lead_1_square, gm_lead_2_sawtooth, gm_lead_3_calliope, gm_lead_4_chiff, gm_lead_5_charang, gm_lead_6_voice, gm_lead_7_fifths, gm_lead_8_bass_lead, gm_pad_new_age, gm_pad_warm, gm_pad_poly, gm_pad_choir, gm_pad_bowed, gm_pad_metallic, gm_pad_halo, gm_pad_sweep, gm_fx_rain, gm_fx_soundtrack, gm_fx_crystal, gm_fx_atmosphere, gm_fx_brightness, gm_fx_goblins, gm_fx_echoes, gm_fx_sci_fi, gm_sitar, gm_banjo, gm_shamisen, gm_koto, gm_kalimba, gm_bagpipe, gm_fiddle, gm_shanai, gm_tinkle_bell, gm_agogo, gm_steel_drums, gm_woodblock, gm_taiko_drum, gm_melodic_tom, gm_synth_drum, gm_reverse_cymbal, gm_guitar_fret_noise, gm_breath_noise, gm_seashore, gm_bird_tweet, gm_telephone, gm_helicopter, gm_applause, gm_gunshot
