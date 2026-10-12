# Portfolio verification

## Published portfolio

The redesigned portfolio was published on 12 October 2026 at https://yashkamerkar14.github.io/. GitHub Actions run 38222391670 passed dependency installation, TypeScript checking, static build and Pages deployment for commit a29819a.

Anonymous browser checks confirmed the three project cards, desktop and 390px mobile layouts without horizontal overflow, Scout's configured OpenRouter connection, its enabled dialog and Medical Bill Auditor starter, the resume PDF and FlightSense case-study route. No browser errors or failed requests were observed. No model questions were submitted during publication checks.

## Content and interface

The supplied resume remains the source of truth: all three employers, 15 contributions, 54 skills, Stevens education and the canonical PDF are retained. The user confirmed the August 2026 Uber start and San Jose location. Context Window, Medical Bill Auditor and FlightSense share one gallery; Football was removed from the application at the user's request.

Before publication, all 38 browser checks passed. The checks cover resume content, project links and order, concise search, navigation, no-JavaScript reading, keyboard controls, accessibility, robot pause behavior, reduced motion and widths from 320 to 1440px. Project copy and agent privacy information were enlarged; the mobile hero was shortened while preserving the 160px walking area.

Resume PDF SHA-256: E927FA3830B619796A441D03311FC5D4CD62D5B2D4E30A11DE1C4C0366FCD397.

## Scout backend

The production API is https://yash-portfolio-scout.vercel.app. Fifteen mocked server checks and seven focused browser checks passed during backend integration. The one short real question used to verify initial deployment made one completion request, returned a sourced Uber role and produced $0.0000823 in provider-reported daily usage. Additional deployment and cleanup checks use mocks or the free status endpoint.

Generated frontend and backend artifacts were scanned for the actual configured API key values and had no matches. Private environment files are excluded from Git and backend uploads. CORS rejects unrelated browser origins; private source and environment URLs return 404. See [backend operation and spending limits](operations/scout-backend.md).

## Folder cleanup

The 12 October cleanup groups active application code under src/, components by feature, server checks under tests/server and deployment tools under scripts/scout. Stylesheet order, public URLs, source facts, private keys, Vercel linkage and the immutable local rollback archive are preserved. Superseded palette captures, their generator and an unused Lighthouse dependency were removed; prior artifacts remain in Git history.

Validation of the reorganized source: route-type generation and TypeScript passed, the production static build passed, all 15 mocked server checks passed, and the standalone Scout package generated successfully. The project catalog remained byte-identical after line-ending normalization, the resume hash matched, all local documentation links resolved, and 88 generated frontend/backend files had no matches for the actual configured API key values. All 38 browser checks passed after reorganization, including accessibility, responsive layouts, search, project links, mocked agent answers and Scout motion. No paid model questions were submitted. Historical redesign discussions remain available in Git history rather than mixing with current operating instructions.
