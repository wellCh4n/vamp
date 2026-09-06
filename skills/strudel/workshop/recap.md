# Workshop Recap

This page is just a listing of all functions covered in the workshop!

## Mini Notation

| Concept           | Syntax   | Example                                                               |
| ----------------- | -------- | --------------------------------------------------------------------- |
| Sequence          | space    | 
```js
sound("bd bd sd hh bd cp sd hh")
```
 |
| Sample Number     | :x       | 
```js
sound("hh:0 hh:1 hh:2 hh:3")
```
     |
| Rests             | ~        | 
```js
sound("metal ~ jazz jazz:1")
```
     |
| Sub-Sequences     | \[\]     | 
```js
sound("bd wind [metal jazz] hh")
```
 |
| Sub-Sub-Sequences | \[\[\]\] | 
```js
sound("bd [metal [jazz sd]]")
```
    |
| Speed up          | \*       | 
```js
sound("bd sd*2 cp*3")
```
            |
| Parallel          | ,        | 
```js
sound("bd*2, hh*2 [hh oh]")
```
      |
| Slow down         | \/       | 
```js
note("[c a f e]/2")
```
              |
| Alternate         | \<\>     | 
```js
note("c <e g>")
```
                  |
| Elongate          | @        | 
```js
note("c@3 e")
```
                    |
| Replicate         | !        | 
```js
note("c!3 e")
```
                    |

## Sounds

| Name  | Description                       | Example                                                                 |
| ----- | --------------------------------- | ----------------------------------------------------------------------- |
| sound | plays the sound of the given name | 
```js
sound("bd sd")
```
                     |
| bank  | selects the sound bank            | 
```js
sound("bd sd").bank("RolandTR909")
```
 |
| n     | select sample number              | 
```js
n("0 1 4 2").sound("jazz")
```
         |

## Notes

| Name      | Description                   | Example                                                                           |
| --------- | ----------------------------- | --------------------------------------------------------------------------------- |
| note      | set pitch as number or letter | 
```js
note("b g e c").sound("piano")
```
               |
| n + scale | set note in scale             | 
```js
n("6 4 2 0").scale("C:minor").sound("piano")
```
 |
| $:        | play patterns in parallel     | 
```js
note("c2 c3 c2 c3").s("sawtooth").lpf("400 2000")
```
  |
| vowel | 
```js
note("c3 eb3 g3").s("sawtooth").vowel("<a e i o>")
```
 |
| gain  | 
```js
s("hh*16").gain("[.25 1]*4")
```
                       |
| delay | 
```js
s("bd rim bd cp").delay(.5)
```
                        |
| room  | 
```js
s("bd rim bd cp").room(.5)
```
                         |
| pan   | 
```js
s("bd rim bd cp").pan("0 1")
```
                       |
| speed | 
```js
s("bd rim bd cp").speed("<1 2 -1 -2>")
```
             |
| range | 
```js
s("hh*32").lpf(saw.range(200,4000))
```
                |

## Pattern Effects

| name   | description                         | example                                                                             |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------------- |
| setcpm | sets the tempo in cycles per minute | 
```js
setcpm(45); sound("bd sd [~ bd] sd")
```
           |
| fast   | speed up                            | 
```js
sound("bd sd [~ bd] sd").fast(2)
```
               |
| slow   | slow down                           | 
```js
sound("bd sd [~ bd] sd").slow(2)
```
               |
| rev    | reverse                             | 
```js
n("0 2 4 6").scale("C:minor").rev()
```
            |
| jux    | split left/right, modify right      | 
```js
n("0 2 4 6").scale("C:minor").jux(rev)
```
         |
| add    | add numbers / notes                 | 
```js
n("0 2 4 6".add("<0 1 2 1>")).scale("C:minor")
```
 |
| ply    | speed up each event n times         | 
```js
s("bd sd").ply("<1 2 3>")
```
                      |
| off    | copy, shift time & modify           | 
```js
s("bd sd, hh*4").off(1/8, x=>x.speed(2))
```
       |

---
Source: https://strudel.cc/workshop/recap/ (AGPL-3.0, Strudel contributors)
