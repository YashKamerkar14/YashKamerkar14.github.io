# Yash Kamerkar — portfolio

Live portfolio: [yashkamerkar14.github.io](https://yashkamerkar14.github.io/).

A portfolio for backend software engineering and applied AI. An illustrated paper room leads into professional experience, compact visual projects, research, background, toolkit, and contact. The expressive Girtonian-inspired direction uses bold condensed typography, a perspective graph-paper floor, a taped current-role note, and original engineering artwork.

Built with Next.js 16.4, React 19.3, TypeScript 7, and Tailwind CSS 4.3. Native pointer events and CSS transforms handle motion. The site exports static HTML for GitHub Pages.

## Current design

- Floating navigation with a Home link and a scroll-progress line; the full name leads the hero, without a duplicate header name.
- Experience before projects, with prominent employer names, colored paper panels and highlighted resume outcomes. Native disclosures preserve all original contributions.
- All three selected projects share one workbench: illustrated app windows, concise summaries, small technology labels and direct demo/source/paper links. Every project is visible without clicking a selector, including without JavaScript.
- An opening drawer in the hero illustration reveals compact real project links; phones have an equivalent index below the gallery. Escape, outside click and a close button dismiss it.
- Raised paper buttons with small arrow movements and pressed feedback for experience, resume and project links.
- FlightSense's third project window includes paper, code, and research-case links.
- Project order: Context Window, Medical Bill Auditor, FlightSense. The auditor uses the supplied Streamlit demo and an original workflow illustration. Football was removed at the user's request. FlightSense spans the final desktop row; every card remains together in the gallery.
- A shared project catalog feeds both the gallery and drawer, ready for additional supplied projects; no invented placeholders.
- Bold display typography, teal accents, polaroid portrait, pastel toolkit notes, a dark contact section, and one visual mode.
- Scout walks back and forth inside the empty hero floor, stops to check a tablet, waves and looks around. Clicking him or the stationary invitation opens the chat. Browser-native animations pause for hover, focus, the shared motion toggle, dialog, hidden tab and offscreen floor; reduced motion cancels the routine. Scribe appears only in the chat. The wide-screen helper stays stationary and is hidden while the floor robot is visible.
- Responsive grid/floor depth, a small faint cursor light, window shadows, paper-note movement, project-preview and portrait tilt, magnetic links and contextual cursor labels. An occasional decorative packet connects backend and applied AI; its explanation supports hover, focus, click and Escape. Pointer updates run once per frame with cached geometry. Native wheel scrolling moves room layers and reading progress. Touch and reduced-motion preferences suppress decorative effects.
- Search with Ctrl/⌘ K, cross-page resume evidence, native disclosures, clipboard feedback, keyboard navigation, and essential reading without JavaScript.
- All 15 resume contributions, 54 skills, Stevens education, original portrait and unchanged resume PDF.
- Direct verified project links and Twitter/X at @Yashrooney14.
- Small LinkedIn, X, and email icons in the intro; locally served technology logos beside toolkit labels and project technologies.

The user's confirmed resume remains the source of truth. `Projects_Resume.docx` supplies Medical Bill Auditor and its exact demo/source links; its public README was reviewed. Detailed evaluation notes stay in the agent catalog rather than becoming long homepage case studies. FlightSense's case study explicitly attributes the paper-reported v3 ROC-AUC and co-authorship. See [new project audit](docs/medical-bill-auditor-audit.md).

## Run locally

Use Node.js 24 and npm.

~~~sh
npm ci
npm run dev
~~~

Open http://127.0.0.1:3000. For a production static export:

~~~sh
npm run typecheck
npm run build
npm run preview
~~~

Development and production preview use port 3000; run one at a time. Preview serves `out/` with compression, direct routes, cache headers, and the custom 404.

## Connect the AI agents

Scout's production backend is live at `https://yash-portfolio-scout.vercel.app`. The portfolio connects to it through the `NEXT_PUBLIC_SCOUT_API_ORIGIN` build setting. GitHub Actions supplies the matching public repository variable `SCOUT_API_ORIGIN`; local preview uses the ignored `.env.local`. See [backend setup, usage limits and verification](docs/scout-backend.md).

Copy `.env.example` to `.env.local`, add your private `OPENROUTER_API_KEY`, then restart the local server. Keep the key in this ignored server-only file; never use a `NEXT_PUBLIC_` variable. The default `OPENROUTER_MODEL` is `google/gemini-2.5-flash-lite`, a low-cost model. You can change that ID to another OpenRouter model that supports disabling reasoning. No key is included in this checkout.

On OpenRouter, Scout selects sources locally without a model call. Scribe makes **one streamed call per submitted question**, capped at **320 output tokens**, requesting reasoning off and at most 120 words. Context includes at most two README excerpts of 3,000 characters each, curated project notes and relevant resume contributions. No chat history is sent, no requests run while idle, and there are no automatic retries or additional model fallbacks. Four questions per minute per address are allowed in the local Node process. README fetching is cached for 15 minutes. Tests use mocked provider responses and spend no model credits. The input limit is in characters; actual token counts depend on the selected model.

Legacy `OPENAI_API_KEY` / `OPENAI_MODEL` configuration still works when there is no OpenRouter key. That route retains its original two-call Responses pipeline. OpenRouter takes priority when both keys are present. Provider failures and truncated answers remain visible; no fake answer is substituted. The dialog identifies the configured provider.

Development starts Next.js and a companion API on the next port. Preview serves the export and API together on port 3000. Without a key, the interface explains that the team is disconnected and keeps project links available. Idle robot movement is decorative, separate from actual API work.

## Add a project

Add the supplied project to `lib/projects.json` with its actual category, name, concise summary, verified repository and optional demo URL, and up to four preview technologies. Optional screenshot metadata uses `image` and `imageAlt`. The gallery, drawer, search, and agent source catalog use this shared data. Add an actual asset under `public/projects/` when available. All catalog entries appear together in their supplied order; research retains paper links and unavailable implementation is labeled honestly.

## Verify

With the production preview running:

~~~sh
npm run test:e2e
npm run test:agents
node scripts/capture-paper.cjs
~~~

Browser checks cover resume facts, experience ordering, compact project summaries, verified destinations, responsive layouts, disclosures, menu and search behavior, clipboard, reduced motion, zoom, no-JavaScript reading, robot interaction, and automated accessibility. Server checks use controlled provider responses; live model answers require a configured key.

Captures are generated under `.design-review/paper-*.png`. Use `node scripts/capture-paper.cjs --social` to regenerate the social image, then rebuild. Set `CHROME_PATH` if needed.

## Sources

- `lib/content.ts`: sourced profile, employers, contributions, and skills.
- `lib/projects.json`: shared project catalog and verified source/demo availability.
- `app/page.tsx`, `app/paper.css`: homepage composition and expressive paper-room treatment.
- `components/project-gallery.tsx`, `components/project-preview.tsx`, `components/project-artwork.tsx`, `app/project-gallery.css`: three project windows and original workflow illustrations.
- `components/project-drawer.tsx`, `app/project-workspace.css`: opening project index and tactile controls.
- `components/walking-scout.tsx`, `app/walking-scout.css`: bounded floor routine, browser-native animation, hover/focus/pause behavior and stationary chat invitation.
- `components/paper-studio.tsx`, `components/header.tsx`: reading position and navigation.
- `components/project-agents.tsx`, `app/agents.css`: accessible question dialog.
- `components/robot-character.tsx`: original SVG robots and desk routines.
- `components/robot-dock.tsx`, `components/robot-motion-toggle.tsx`, `app/robot-dock.css`: stationary desktop helper and synchronized pause controls.
- `components/engineering-illustration.tsx`, `components/research-cover.tsx`: original engineering artwork.
- `components/copy-email.tsx`, `components/architecture-explorer.tsx`: contact action and research interaction.
- `components/paper-motion.tsx`, `app/paper-motion.css`: pointer depth, native scroll reactions, section entrances, and agent gaze.
- `server/portfolio-agent.cjs`, `server/compact-context.cjs`: server-only agent API, local source selection, compact OpenRouter context and streaming.
- `app/work/flightsense/page.tsx`: sourced research case study.
- `components/portfolio-search.tsx`, `lib/search.ts`: evidence search.
- `public/Yash_Mahesh_Kamerkar_Resume.pdf`: unchanged supplied resume.
- [Content audit](docs/portfolio-content-audit.md), [design record](docs/portfolio-redesign-plan.md), [verification](docs/portfolio-verification.md), and [artwork provenance](docs/artwork-provenance.md).

The folder contains one active site: `app/` for routes/styles, `components/` for UI, `lib/` for content/search, `public/` for shipped assets, `server/` for the private AI API, `scripts/` for running/capturing the site, `tests/` for current checks, and `docs/` for content/provenance records. Replaced legacy HTML/assets/tests, duplicate resume and unused artwork/animation code have been removed. The single canonical resume is `public/Yash_Mahesh_Kamerkar_Resume.pdf`.

`.env` is private and Git-ignored; `.env.example` documents settings. `node_modules/`, `.next/` and `out/` are generated dependency/build folders. `out/` is required by the running production preview. Screenshot drafts, browser reports and temporary audit scripts are disposable and were cleaned after review.

## Deployment

The GitHub Actions workflow at `.github/workflows/deploy.yml` builds and publishes `out/` on push to main or a manual run. GitHub Pages uses the GitHub Actions build source. The canonical URL is `https://yashkamerkar14.github.io/`.

GitHub Pages serves the static portfolio. Scout runs in a separate Vercel Node function, with the private OpenRouter key and exact-origin CORS. The frontend's public backend origin comes from the GitHub Actions variable `SCOUT_API_ORIGIN`. The included companion local servers listen only on loopback.

To publish future updates, commit the source changes and push `main`. The workflow installs the locked dependencies, checks TypeScript, builds the static site, and deploys it to the same address. Check the repository's Actions tab for deployment status. Private environment files and generated build folders stay outside the commit.

The previous design is preserved in a private local checkpoint. See [rollback instructions](docs/design-rollback.md) to restore the exact version from before the drawer, shelf and button experiment.
