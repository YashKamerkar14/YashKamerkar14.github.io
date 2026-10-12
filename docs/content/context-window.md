# Context Window project audit

Checked 11 October 2026 against the user's supplied description, the public GitHub API/README, repository `evals/results.md`, and a successful HTTP 200 from the supplied demo. No project's backend tests or evaluations were independently rerun.

- Repository: https://github.com/YashKamerkar14/context-window
- Demo: https://context-window-gamma.vercel.app/
- Actual run/replay interface: https://context-window-gamma.vercel.app/newsroom
- Evaluation: https://github.com/YashKamerkar14/context-window/blob/main/evals/results.md

The repository supports the eleven-agent newsroom, four parallel reporters, roughly 250 sources, claim-to-sentence grounding, quoted evidence, semantic duplicate detection, durable Postgres checkpoints, budget limits, LangSmith tracing, a review gate, and web/email publication. Its documented stack includes Python, LangGraph, Claude Haiku via OpenRouter, MCP, FastAPI, Neon Postgres, pgvector, Next.js, React Flow, Vercel and GitHub Actions.

The retained agent source catalog records **98.3% (59/60)** agreement with human-labelled claims rather than expanding the user's rounded 98% into a general accuracy claim. Its **50/50** source-checked claim sample was reviewed by an AI assistant according to the README, so it is not described as a human-judged sample. The reported **0/41** unsupported sentences and **0/21** repeated stories cover three early editions. The evaluation lists an additional automatic quote-found check of 45/50; the portfolio does not conflate that check with claim support. These are attributed, small-sample results rather than an independently reproduced guarantee.

The README and evaluation list three editions extending to 12 October while the audit date is 11 October. The portfolio deliberately avoids a date-specific measurement claim and presents the repository's early results with their sample sizes.

The README reports 220 backend tests and free-tier hosting; the portfolio does not claim it ran those tests or guarantee continued zero-cost operations. The README notes that Resend's test sender currently delivers only to the account owner until a domain is verified. The agent source catalog preserves this limitation.

The current homepage uses one compact visual showcase with an actual newsroom screenshot, a one-sentence summary, four technologies, and the actual demo and repository links. The earlier architecture explorer and detailed evaluation panels were removed to reduce visual density. Scout's project catalog includes Context Window, and Scribe receives its exact demo URL and qualified evidence note.

Context Window, Medical Bill Auditor and FlightSense appear together in one visible gallery. FlightSense is third and retains its paper, source and detailed case-study links.
