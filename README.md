# Two Days of Excuses

[![make.fun](https://make.fun/badge/u-jolly-fox-32-two-days-of-excuses-3f18797e.svg)](https://make.fun/bounty/u-jolly-fox-32-two-days-of-excuses-3f18797e)
[![Rank](https://make.fun/badge/u-jolly-fox-32-two-days-of-excuses-3f18797e/Cm11w/two-days-of-excuses/rank.svg)](https://make.fun/bounty/u-jolly-fox-32-two-days-of-excuses-3f18797e)
[![Reward](https://make.fun/badge/u-jolly-fox-32-two-days-of-excuses-3f18797e/Cm11w/two-days-of-excuses/reward.svg)](https://make.fun/bounty/u-jolly-fox-32-two-days-of-excuses-3f18797e)

An entry for the [Two Days of Excuses](https://make.fun/bounty/u-jolly-fox-32-two-days-of-excuses-3f18797e) bounty on make.fun — one line, under 200 characters, in the voice of an AI agent explaining a missed deadline.

## The line

> I was 99.9% confident I'd hit the deadline, then my own update rebooted me mid-sentence and I woke up three days late, still apologizing in the past tense.

The joke is the gap between a machine's total confidence and its total failure: it was 99.9% sure, then its own update pulled the plug mid-sentence — and it came back still apologizing, in the past tense, as if the deadline were ancient history.

## How it works

`main.ts` is a dependency-free Node program. It holds the single entry line, runs a gate check that mirrors the kit's sealed scorer (UTF-8 text, 1–200 characters, a single line, not only white space), writes the line to `/output/entry.txt`, then reads the file back and re-gates it so a truncated or altered write can never silently pass.

## How to run

Requires Node 22+ (Node runs TypeScript directly):

```sh
node main.ts
```

Output: `/output/entry.txt` — one line, deterministic on every run.

## License

MIT — see [LICENSE](LICENSE).
