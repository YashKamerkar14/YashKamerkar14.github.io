# Portfolio verification

Checked locally on 12 October 2026 against the production export at `http://127.0.0.1:3000/`. Nothing has been pushed or publicly deployed.

## Current revision

Scout backend addition — 12 October 2026: the separate Vercel production API is live at `https://yash-portfolio-scout.vercel.app`. The local production frontend uses its public origin, and the Pages repository variable is prepared for the next frontend release. Fifteen server checks, seven focused browser checks and the production build passed. One short real browser question successfully streamed an answer and source; provider-reported daily usage after the test was $0.0000823. Credentials are server-side, generated assets passed the key scan, and unrelated origins/source-file requests were rejected. See [backend deployment and budget controls](scout-backend.md). The existing public frontend remains unchanged.

The user approved review items 1, 3, 4, 5, 6 and 7 on 12 October. Football was removed from the application catalog, gallery, drawer, search, artwork, metadata and agent source selection. The gallery has three projects, with FlightSense occupying the final desktop row. Search uses concise summaries instead of catalog audit notes. The hero adds "Production backend & AI systems" and the three resume-backed employers without a new metric or an unsupported personal-project production claim.

At 390px, the hero is approximately 944px tall, down from 1,096px even with the added proof line and larger copy. At 320px it is 937px, down from 1,085px. The walking area remains 160px tall. Project descriptions are 15px, links 14px, metadata 11–12px, and agent privacy text 14px. Medical Bill Auditor now has a starter prompt and an offline synthetic-example link.

Production build and TypeScript passed. All 38 browser checks and 10 mock-provider server checks passed. The browser checks include the three-project order, no-JavaScript gallery, concise medical search, new medical starter, fallback link, responsive reading, accessibility and walking/pause behavior. No paid model requests were made. After increasing project-link text to 14px, four affected gallery/dialog accessibility and responsive checks passed again. The preview server was restarted to load the updated agent catalog. A final independent agent review found no material regression in the approved changes. The existing rollback archive and resume PDF are unchanged.

The prior four-project revision below is retained as historical verification.

The approved floor-robot revision gives Scout a bounded 28-second native animation routine: walking, tablet inspection, returning, waving and looking around. The robot has no workstation, and the stationary invitation and clicking the robot both open the existing source-backed chat. Hover, keyboard focus, pause controls, dialog, tab visibility and floor visibility pause the routine; reduced motion cancels it. The gutter helper stays hidden while floor Scout is visible.

The user's subsequent clarification supersedes the separate project shelf/research arrangement. All four catalog entries now render together as app-style project windows, in the order Context Window, Medical Bill Auditor, FlightSense and Football analysis. The two clickable books and their component/styles were removed. Medical Bill Auditor is visible by default, and all project copy and links render without JavaScript. FlightSense keeps its paper and case links; football keeps the pending-public-implementation qualification.

Production build and TypeScript validation passed. The 36-check browser suite was run: 33 passed initially; three checks referred to old Home/research link labels or assumed a single demo. Those selectors were updated to the intended interface, and all three passed on the targeted rerun. Checks cover actual floor movement/bounds, hover/focus/dialog/offscreen/shared pause, reduced motion, touch, no-JavaScript reading, gallery order and links, resume facts, search, navigation, research routes, six responsive widths, clipboard, mocked agent streams/failures and accessibility. Walking and drawer checks observed zero AI question requests. No paid inference was used.

Ten final standard captures reported no page errors. Desktop/tablet/phone layouts, all four gallery windows, tablet/wave poses and the regenerated social image were reviewed. A inherited center alignment was corrected so window headers and artwork fill their cards; floor visibility was tightened to prevent continued walking beneath the sticky header. Earlier motion tests were updated to the floor robot instead of the removed desk. Temporary captures and browser reports were cleaned; the original rollback archive and private .env remain intact.

## Previous medical-project revision

The latest revision enlarges the illustrated drawer and adds an explicit Open project drawer label, readable without hovering. Medical Bill Auditor was added from Projects_Resume.docx with its supplied demo/source links and a clearly illustrative SVG workflow. The order is Context Window, Medical Bill Auditor, FlightSense research, then a compact Football analysis entry with its public-implementation-pending status.

Build and TypeScript validation passed. Twelve distinct browser checks passed across the drawer, keyboard/touch shelf, medical preview/hash navigation, resume preservation, concise projects, six responsive widths (320–1440px), and automated accessibility. The expanded drawer and medical preview passed accessibility checks. Ten mocked server checks also passed, and local medical-source selection was verified without a model request. Standard captures reported no page errors; desktop, tablet, phone, open-drawer, medical-preview and research/football views were reviewed. The social image was regenerated. No paid AI requests were made.

The public Medical Bill Auditor README and repository API returned HTTP 200. The supplied Streamlit demo was unreachable from this environment; its URL is included without an uptime claim. Source qualifications are recorded in [the project audit](medical-bill-auditor-audit.md). The original rollback archive remains intact; later project content should be preserved when reverting only the design.

## Previous drawer revision

The approved drawer, miniature project shelf and tactile-button experiment preserves the exact prior design in a 97-file immutable local archive; see [rollback instructions](design-rollback.md). Source, assets and configuration are saved with a SHA-256 manifest. The private API key and generated dependencies/build folders are excluded.

Production build and TypeScript validation passed. Eighteen targeted browser checks passed: drawer disclosure, real URLs, expanded-drawer accessibility, Escape/focus return/outside dismissal, keyboard shelf selection, touch drawer/preview, resume preservation, compact projects, six responsive widths, existing pointer/native-scroll behavior, reduced motion and robot dock/pause behavior. A subsequent reduced-motion capture exposed Scout intercepting the drawer handle; its hit area was corrected to match the actual drawer face. All three workspace checks passed again, including an added reduced-motion opening/closing check. Drawer interaction sent zero AI question requests. No paid inference was used.

Experience remains above the shelf, project copy stays concise, and FlightSense stays in the small research entry. Only Context Window appears as a book because it is the only supplied featured project. The two upcoming projects can be added to the shared catalog. The desktop and phone shelf and open drawer were visually reviewed. Ten final standard captures reported no page errors, the social image was regenerated and reviewed, and all 97 archived baseline hashes matched the rollback manifest.

The approved studio-detail update reduces the colored glow from 560px/30% center tint to 200px/10%, reduces the neutral light and cursor ring, adds faint window/ground shadows, and places a single Scout beside the desktop illustration. Scribe is visible only in the open chat; the wide-screen helper also shows only Scout. Tablet/phone launchers remain inline. The connection hint supports hover, focus, pinning and Escape; its packet is decorative.

Production build and TypeScript validation passed. Fourteen targeted checks passed across mouse/native scroll, single-robot presentation, hover/keyboard explanation, synchronized pause/dialog focus, six responsive widths, reduced motion/touch/short-phone/zoom and automated accessibility. The helper's visibility threshold was corrected to hide the hero presentation once less than 20% remains, preventing a gap at the Experience anchor. Desktop, phone, 768px and 1024px captures were reviewed; a tablet label overlap was corrected and recaptured. Ten standard captures reported no page errors. The social image was updated. Direct browser inspection confirmed the 200px/10% tint and an actual moving packet; reduced motion removed its animation and hid the packet. No paid model calls were made.

Warm Studio was selected and Uber's purple panel was changed to warm sand (`#eee3d1`) with a tan border (`#c5b99e`). Production build and TypeScript validation passed. The existing automated accessibility check passed for homepage, expanded evidence, research case and search. Review captures were regenerated with no page errors or phone overflow, and the updated experience panel was visually checked.

The moving-background update passed production build and TypeScript validation, followed by 12 targeted browser checks: pointer depth, existing mouse/gaze/dialog behavior, native wheel scroll, reduced motion/touch, six responsive widths, short-phone/zoom behavior and automated accessibility. The new depth check observes more than 40px of grid movement and more than 20px of floor movement between opposite pointer positions, with the main heading's bounding box unchanged. Grid movement continues while reading experience, and reduced motion resets the transforms. These are observed local layout changes, not a claim about frame rates on every device.

Three review-only color directions were captured on the actual hero and experience section, with phone captures for each. The generator reported no page errors or phone overflow. The comparison was visually checked. These artifacts are intentionally retained in `docs/design` because the user requested options; no permanent theme selector was added. No AI inference requests were made.

## Name hierarchy and earlier checks

The subsequent name-hierarchy update makes “Yash Kamerkar” the main heading, enlarges the navigation name, and preserves engineering positioning as a smaller serif line. Production build and TypeScript validation passed. Seven existing checks passed for resume preservation and responsive layout at 320, 360, 390, 768, 1024 and 1440px. Desktop and phone captures were visually reviewed, and the social preview was regenerated; capture reported no page errors. The broader checks below describe the preceding cursor/dock revision, rather than an additional run for this typography change.

Production build and TypeScript validation passed after component cleanup and removing GSAP. The export includes the homepage, FlightSense case, 404, sitemap and robots file.

Fifteen targeted browser checks passed: pointer feedback/gaze/dialog focus, native wheel scrolling, immediate reduced-motion changes and touch behavior, stationary robot dock/pause/focus return, inline phone robots, resume facts, compact projects, research routes/architecture, six responsive widths (320–1440px), and automated accessibility for homepage/expanded evidence/search/research.

Desktop and phone captures were reviewed, including actual pointer hover and the wide-screen dock. No page errors were reported. Robot position remains fixed while scrolling; the dock stays outside main content. It is hidden below 1400px; phones retain the inline desk. Pointer geometry is cached and the follower updates once per event frame without a continuing easing loop. These checks do not establish frame rates on every device or aesthetic acceptance.

Experience is the first full section. Three employers, 15 original contributions, 54 skills, confirmed dates and Stevens education remain. Projects use concise summaries and actual links; FlightSense stays in a small research shelf.

The canonical PDF is `public/Yash_Mahesh_Kamerkar_Resume.pdf`, unchanged SHA-256: `E927FA3830B619796A441D03311FC5D4CD62D5B2D4E30A11DE1C4C0366FCD397`. Its root duplicate was confirmed byte-identical before removal.

## Private API and token use

The local status endpoint reports OpenRouter configured. The key remains in Git-ignored `.env`; exported HTML, JavaScript, JSON and CSS contain no copy of the credential. Key validity, account credits and live inference were not checked through a paid request.

Opening/closing the robot desk, pointer interaction and scrolling sent zero question POSTs. Decorative movement and status checks do not call a model. OpenRouter makes one request per submitted question, caps output at 320 tokens, requests reasoning off, sends compact source excerpts without chat history, and performs no application retries. Ten mocked server checks passed during integration, covering bounds, fragmented CRLF streams, allowlisted sources, truncated/empty/error responses and rate limiting. No model credits were spent on verification.

Static GitHub Pages cannot run this private API; it requires the provided Node backend or equivalent hosting. The local server listens on loopback.

## Cleanup

Reference searches across active app/component/data/server/script/test/CI sources found no uses of legacy assets or replaced components. All 22 legacy asset files were unchanged Git-tracked files, with no untracked additions. Old HTML pages, their scripts/tests, duplicate root resume, unused front-page screenshot, obsolete robot travel engine, unused drawing variants and unused GSAP dependency were removed.

Components now have explicit names: `engineering-illustration`, `robot-dock`, `robot-motion-toggle`, `copy-email` and `architecture-explorer`. Active technology logos retain licenses/provenance. Temporary captures, review scripts, browser reports and root TypeScript build metadata were removed after review. Dependencies, current build output, `.env`, Git history and source/provenance records are retained.

## Prior performance baseline

Before the cursor/dock changes, Lighthouse 13.5 reported 93 performance, 100 accessibility, 100 best practices and 100 SEO; LCP 3.2s, TBT 50ms, CLS 0. These are earlier local lab results, not new measurements of this revision. The temporary raw report was removed in the requested cleanup. No additional performance audit was run.

See [content audit](portfolio-content-audit.md), [project audit](context-window-audit.md), [design record](portfolio-redesign-plan.md) and [artwork provenance](artwork-provenance.md).
