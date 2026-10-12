# Portfolio design record

Latest approved review pass - 12 October 2026: the portfolio now has three projects after the user removed Football analysis. All remaining projects stay together, with FlightSense filling the final desktop gallery row. Concise search summaries replace visible audit prose. The hero includes a resume-backed production backend/AI line and its three employers. Mobile role notes and spacing are smaller; the walking area remains 160px tall. Body copy and actions are larger, metadata is 11-12px, and chat privacy copy is 14px. Scout offers a Medical Bill Auditor question and a synthetic-example fallback link. The following earlier four-project design notes are historical and superseded where they conflict with this pass.

Updated locally on 11 October 2026 after the user preferred the expressive earlier version over the quiet redesign. The current edition restores that visual personality while making work experience more prominent and reducing project text.

## Composition

The graph-paper room, perspective floor, original connected engineering objects and taped current-role note return. A large condensed “Yash Kamerkar” headline leads the first screen, with a teal surname and the smaller italic positioning line “Turning complexity into clarity.” The role and location sit above the name. The note prominently identifies Uber, the confirmed current role, and San Jose. The floating toolbar uses a simple Home link instead of repeating the full name and puts Experience first among section links.

Professional experience remains the first full section. Large company names, sand/lime/blue paper panels and inline highlights make the resume's outcomes easier to scan. The user selected Warm Studio and requested removing purple from Uber; its panel now uses warm sand (`#eee3d1`) with a muted tan border (`#c5b99e`). Two original contributions per role are visible; native disclosures retain every remaining bullet. No resume metrics are changed or invented.

The user clarified that all four projects should appear together, replacing the book selector and separate lower entries. A single workbench shows four app-style windows in a two-column desktop gallery and one column on phones. Context Window, Medical Bill Auditor, FlightSense and Football analysis are visible without selecting anything, including without JavaScript. Each has one sentence, at most four technology labels and direct source/demo/paper links. Context Window uses its actual screenshot; the other windows use original illustrative diagrams. Restrained preview tilt and raised arrow buttons provide local reactions.

A larger cream drawer face and a prominent 220px-wide Open project drawer control remain in the hero. Its disclosure links all four windows in order; phones have an equivalent project index below the gallery. It does not substitute for visible project cards. Additional supplied entries appear automatically from the shared catalog.

The experience, resume and project buttons have raised edges, restrained arrow movements and pressed feedback. The original design is preserved in the immutable local checkpoint described in [rollback instructions](design-rollback.md).

FlightSense is third within the same gallery, with paper, source and research-case links. Football analysis is fourth, with its repository link and a public-implementation-pending label. The portrait returns to a taped polaroid treatment, toolkit summaries become pastel notes, and contact provides a dark contrast to the cream paper room.

## Mouse and scrolling

Mouse movement shifts the actual grid on its own fixed background layer across the page. The formerly large colored glow is now 200px at a 10% center tint, with a separate 220px faint neutral light in the hero. The cursor ring is 16px, expanding to 26px over actions. The perspective floor and engineering illustration move at different depths, while headings and reading text stay stationary. Faint warm window shadows and a stronger grounding shadow give the illustration depth. Movement changes the illustration's perspective, shifts paper notes, tilts previews/portrait, and steers robot gaze. Magnetic links move a few pixels within their targets. The cursor responds in one pointer frame, with contextual labels for project previews, the AI desk and email. Geometry is cached until a scroll, resize or target change. Passive, batched handlers preserve ordinary pointer and wheel behavior.

A tiny decorative packet occasionally travels along the backend-to-AI connection rather than continuously animating all dashed lines. Hovering its small connection label reveals an explanation; the label also supports keyboard focus, click to pin, and Escape to dismiss. Opening the project drawer hides the explanation and stabilizes the illustration so its links remain easy to select. The description is local portfolio positioning, not a live system status. Packet movement stops offscreen, with reduced motion, or when the shared pause control is used.

Native mouse-wheel scrolling moves the room artwork and floor at different rates, updates the reading-progress line, and introduces section headings/panels with short movements at full opacity. Scroll is not captured or replaced. Reduced-motion preferences immediately suppress parallax, tilt and decorative animation. Touch keeps native scrolling and tap actions.

Scout now walks on the empty hero floor without his workstation. The 28-second routine walks right, checks a handheld tablet, walks back, waves and looks around. Alternating legs, swinging arms and a small body bounce are coordinated with the path. Keyframes are generated once and played by the browser; no continuous JavaScript/React frame loop is used. The path is bounded by the floor width and recalculated on resize without restarting the routine. The chat invitation stays stationary, and clicking Scout also opens the existing dialog.

Hover/focus stop the robot so it is easy to select. The shared motion toggle, open dialog, hidden tab and less-than-half-visible floor pause the routine; resuming continues from the same point. Reduced motion cancels it and retains a static clickable Scout. Pointer gaze uses the moving robot's current bounds. Scribe remains inside the chat. The stationary wide-screen helper stays hidden while floor Scout is visible, and never walks through reading content. No GSAP dependency remains. These idle actions are decorative, separate from the chat's real source-backed API stages.

The local OpenRouter key is detected through the server's status endpoint. Status checks and decorative movement do not call a model. One streamed model request is made only for a submitted question, with a 320-output-token cap, compact evidence and no automatic retries. This update was tested with mocks and no paid inference.

## Content boundaries

Three review palettes are shown on the actual hero and experience layouts in [color options](design/color-options.html): Warm studio (cream/teal), Lilac atelier (lilac/violet/butter yellow), and Midnight lab (navy/ice cyan). The comparison and individual desktop/mobile captures live in `docs/design`; `node scripts/preview-colors.cjs` regenerates them from the local preview. Palette CSS is injected only during capture and is not imported by the portfolio. The user selected Warm Studio; the portfolio keeps its single cream/teal presentation with Uber on a warm sand panel.

The confirmed resume PDF remains the source of truth, including Uber from August 2026 and San Jose. All three employers, 15 original contributions, 54 skills and Stevens education remain available. Equal backend and AI emphasis is preserved.

Context Window uses the supplied real demo and source links; detailed evaluation qualifiers remain in the agent source catalog. Medical Bill Auditor was supplied in Projects_Resume.docx and checked against its public README. Its synthetic evaluation qualifiers and rules-only demo scope stay in the agent catalog. The supplied demo URL was unreachable from this review environment, so uptime is unverified. FlightSense's case study attributes co-authorship and paper-reported v3 ROC-AUC. Football's empty repository is presented as pending public implementation, without a fabricated demo. One further project awaits user-supplied content.

## Review

Desktop, phone, 768px and 1024px captures were visually checked, along with live pointer and wheel reactions. Build, browser, accessibility and integration evidence is documented in [verification](portfolio-verification.md). No UX-agent approval is claimed for this update.

Local result: `http://127.0.0.1:3000/`. Nothing has been pushed or publicly deployed.
