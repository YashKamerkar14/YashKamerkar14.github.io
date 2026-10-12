# Mettle project sources

Added on 12 October 2026 from the user's supplied project summary and card copy.

- [Live benchmark](https://yashkamerkar14.github.io/mettle/)
- [Repository and README](https://github.com/YashKamerkar14/mettle)
- [Published findings](https://github.com/YashKamerkar14/mettle/blob/main/docs/findings.md)
- [Frozen analysis plan](https://github.com/YashKamerkar14/mettle/blob/main/docs/analysis-plan.md)
- [Speed protocol](https://github.com/YashKamerkar14/mettle/blob/main/eval/results/speed-v1/speed.md)
- [Scorer audit](https://github.com/YashKamerkar14/mettle/blob/main/eval/audit/audit.md)

The live page returned HTTP 200, rendered without browser errors and required no model download for inspection. The project preview is a screenshot of the actual live hero, captured after its animated counters settled at their published values. No benchmark, evaluation, dataset submission or Mettle model inference was run during this portfolio update.

## Study scope

The public findings describe SmolLM2-360M-Instruct on an RTX 4080 Laptop GPU in Chrome 154. The frozen evaluation contains 500 questions. The generation-speed comparison uses a separate ten-session ABBA protocol: 1.12x as fast, 95% confidence interval 1.11-1.14. The portfolio rounds this to 12% faster and names the reference hardware.

Instruction-following is 48.0% for the full-precision build and 8.6% for the 4-bit build, rounded to 9% in the card. The reported primary accuracy difference is -0.4 percentage points, 95% confidence interval -5.8 to +5.0. The findings call this inconclusive; it is not evidence of equivalence. The arithmetic loss of 19 points and capitals gain of 21 points are exploratory per-category results. The blinded audit covers 472 outputs and reports 99.2% scorer agreement; no human-judge claim is introduced.

These are project-reported results, not independently reproduced measurements. They do not establish performance for other models, GPUs, browsers or workloads. The screenshot's accuracy wording is part of the actual demo; Scout retains the more precise inconclusive qualification.

## Implementation and presentation

The README separates the WebLLM runtime from Mettle's original WGSL matrix-multiply score, timing harness, question generator, shared answer runner, statistical analysis and crowd-submission backend. Supabase source includes Postgres RLS and an edge function with Turnstile and rate limiting. Inference runs on a compatible visitor GPU; opt-in crowd submission uses a server. Free-tier hosting is not a guarantee of future zero cost.

Mettle is fourth after FlightSense in the unified gallery. The card has one concise, hardware-qualified summary, four technology labels, and Live demo and GitHub links matching the other project cards. Search uses only the summary; the detailed study qualifications stay in this audit and Scout's source catalog. A starter question and offline fallback link are included in the chat. The canonical resume PDF is unchanged.
