# Accumulation Modifiers

## superimpose

Superimposes the result of the given function(s) on top of the original pattern:

```js
"<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
  .superimpose(x=>x.add(2))
  .scale('C minor').note()
```

## layer

Layers the result of the given function(s). Like `superimpose`, but without the original pattern:

```js
"<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
  .layer(x=>x.add("0,2"))
  .scale('C minor').note()
```

## off

Superimposes the function result on top of the original pattern, delayed by the given time.

- `time`: offset time
- `func`: function to apply

```js
"c3 eb3 g3".off(1/8, x=>x.add(7)).note()
```

## echo

Superimpose and offset multiple times, gradually decreasing the velocity

- `times`: how many times to repeat
- `time`: cycle offset between iterations
- `feedback`: velocity multiplicator for each iteration

```js
s("bd sd").echo(3, 1/6, .8)
```

## echoWith

Synonyms: `echowith`, `stutWith`, `stutwith`

Superimpose and offset multiple times, applying the given function each time.

- `times`: how many times to repeat
- `time`: cycle offset between iterations
- `func`: function to apply, given the pattern and the iteration index

```js
"<0 [2 4]>"
.echoWith(4, 1/8, (p,n) => p.add(n*2))
.scale("C:minor").note()
```

## stut

Deprecated. Like echo, but the last 2 parameters are flipped.

- `times`: how many times to repeat
- `feedback`: velocity multiplicator for each iteration
- `time`: cycle offset between iterations

```js
s("bd sd").stut(3, .8, 1/6)
```

There are also [Tonal Functions](learn/tonal.md).

---
Source: https://strudel.cc/learn/accumulation/ (AGPL-3.0, Strudel contributors)
