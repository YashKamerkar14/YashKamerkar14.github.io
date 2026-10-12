# Scout backend

Deployed on 12 October 2026 to the separate Vercel project `yash-0406/yash-portfolio-scout`.

Production origin: https://yash-portfolio-scout.vercel.app

- `GET /api/agents/status`: connection presence, without model requests or credential values.
- `POST /api/agents`: source-backed, streamed answers.
- `OPTIONS`: exact-origin browser preflight, without provider requests.

The public API serves the GitHub Pages portfolio and local preview. The OpenRouter key is a production Vercel Secret, transferred over stdin. It is excluded from the source upload, frontend configuration and GitHub repository variables. `SCOUT_API_ORIGIN` in the portfolio repository is a public GitHub Actions variable containing only the backend URL. The local `.env.local` contains the same public origin; the existing `.env` key is unchanged.

## Usage controls

Source selection stays local. Each submitted question makes one OpenRouter completion call, with a maximum of 320 output tokens, reasoning disabled, no chat history, no model fallback and no automatic retry. Context includes at most two short README excerpts and source-backed portfolio facts. The public adapter uses OpenRouter only. Status checks and robot animations do not invoke a model.

Four questions per minute per client address are allowed in each warm function instance. Vercel's `x-vercel-forwarded-for` supplies the client address; local HTTP servers use the socket address. These per-instance counters are not a distributed global quota.

Before every public question, a non-billable OpenRouter key-information request checks provider-reported daily usage. New completions stop at `SCOUT_DAILY_BUDGET_USD=0.25`. Unreachable, malformed, unlimited or exhausted key budgets fail closed. This shared provider-usage check survives new function instances, but concurrent requests and delayed usage reporting can exceed the early-stop threshold. OpenRouter's own key spending limit is the hard cap. The supplied key was valid with a $100 limit; this deployment did not change that limit. A dedicated Scout key with a small provider credit limit is recommended when separating portfolio usage from other applications.

See [OpenRouter key information](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key) and [key spending limits](https://openrouter.ai/docs/api-reference/authentication).

The function aborts provider work after 45 seconds and listens for visitor cancellation. Vercel's function duration is 60 seconds, with cancellation support enabled. Origin checks restrict ordinary browser callers; they are not authentication and cannot prevent clients from forging headers. Provider cost limits remain necessary for this public endpoint.

## Updating

Run from the portfolio root using Node.js 24:

```powershell
npm run build:scout
npx --yes --cache node_modules/.cache/npm vercel@63.1.2 deploy --prod --yes --scope yash-0406 --cwd .scout-deployment
```

The packager copies an explicit allowlist of server modules and public portfolio data, generating a standalone backend with no frontend dependencies. `.scout-deployment` and its Vercel project-link metadata are ignored by Git. `.env*` and credential files are excluded from uploads. The Vercel project is deployed directly; it is not connected to GitHub automatic deployments.

To rotate the key or change the low-usage settings, edit the ignored local environment and run:

```powershell
node scripts/configure-scout-vercel.cjs
npm run build:scout
npx --yes --cache node_modules/.cache/npm vercel@63.1.2 deploy --prod --yes --scope yash-0406 --cwd .scout-deployment
```

`SCOUT_ALLOWED_ORIGINS` is an exact comma-separated origin list. Its configured values are `https://yashkamerkar14.github.io`, `http://127.0.0.1:3000` and `http://localhost:3000`. Add a future custom portfolio domain here before using it.

`NEXT_PUBLIC_SCOUT_API_ORIGIN` is the only public frontend configuration. It must be an HTTPS origin without a path or credentials; loopback HTTP is accepted for local development. Leave it empty to use the companion local API. The Pages workflow reads the public repository variable when building. Publishing the new portfolio source remains a separate step.

## Verification

- Production function deployed successfully; anonymous status returned 200 and `configured: true`.
- Portfolio preflight returned 204 with the exact allowed origin; unrelated origins returned 403.
- Fifteen mocked server checks passed, including CORS, platform-parsed bodies, streamed responses, budgets across fresh handler instances, malformed requests, rate limits and provider failures. They incurred no model charges.
- One short live question was submitted from the actual portfolio browser. It streamed the correct Uber role with a source link, completed without errors and made exactly one completion request.
- OpenRouter reported $0.0000823 in daily key usage after that single live test. No additional live questions were used for verification.
- The frontend production build and TypeScript check passed with the real backend origin.
- Seven focused browser checks passed with mocked answers. A credential scan passed across 84 generated frontend/backend files; environment files were excluded from the upload. Public requests for server source, data JSON and `.env` returned 404.

Implementation follows [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js), [trusted request headers](https://vercel.com/docs/headers/request-headers) and [function configuration](https://vercel.com/docs/project-configuration/vercel-json).
