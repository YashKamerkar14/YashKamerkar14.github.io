# Before the project drawer and shelf

The user explicitly requested a way to restore the previous design if this experiment is not preferred. The baseline was saved before implementation on 11 October 2026, after the header label changed to Home.

Local checkpoint: `.portfolio-history/before-project-drawer-and-shelf/source.zip`.

The archive contains 97 source, asset, configuration, documentation and test files. `manifest.json` alongside it records every baseline path and SHA-256. All 97 archived entries were read and their hashes verified against the manifest. The private `.env`, dependencies, build output, temporary captures and Git history are excluded. The checkpoint directory is Git-ignored.

To revert when requested, restore the archived versions of changed files, including the original `components/project-cards.tsx`, and remove only files introduced by this experiment: `app/project-workspace.css`, `components/project-drawer.tsx`, `components/project-preview.tsx`, `components/project-shelf.tsx`, any new drawer/shelf test, and this record. Restore any later touched documentation and preview assets from the same archive. Preserve the current `.env` and unrelated user changes. Confirm target paths stay inside the workspace, verify restored baseline hashes, then rebuild the export. Do not run Git reset, clean, or checkout against the older repository commit: the baseline includes the current uncommitted Next.js implementation.

The baseline is immutable. Do not replace it with an archive of the new design.

Later additions: the user subsequently supplied Medical Bill Auditor and requested Football analysis fourth after FlightSense. If asked to revert only this design experiment, preserve those new catalog entries, source notes and project links while restoring the previous presentation. A full exact baseline restore would remove later content; use it only when explicitly requested.

The subsequent floor-robot/all-projects-gallery update adds `components/walking-scout.tsx`, `app/walking-scout.css`, `components/project-gallery.tsx`, `components/project-artwork.tsx`, `app/project-gallery.css`, and `tests/e2e/walking-scout.spec.ts`, and removes the book selector. Include these in the set of introduced files when restoring the original design. Preserve the user's newer requirement to keep all four project links visible unless they explicitly request restoring the older project arrangement too.

Latest content instruction - 12 October 2026: the user removed Football analysis entirely. A presentation-only rollback must preserve its removal, the three current projects, and their real links. The earlier four-project instructions above are historical.
