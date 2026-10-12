# Artwork provenance

The expressive portfolio uses original code-native engineering and robot artwork, Yash's portrait and his own project screenshots.

- `components/engineering-illustration.tsx`, `components/engineering-scene.tsx`: original connected backend/AI objects with a grounding shadow, an occasional decorative connection packet and an accessible local explanation. The packet does not represent live data or a running project.
- `app/page.tsx`, `app/paper.css`: code-native graph-paper room, perspective SVG floor, torn/taped current-role note, colored employer panels, paper browser frame, polaroid and toolkit notes.
- `components/robot-character.tsx`: original mechanical Scout and Scribe SVG robots with shaded shells, screens, screws, articulated limbs and workstations. Desk routines are decorative; dialog work states follow actual API events.
- `components/robot-dock.tsx`, `components/robot-motion-toggle.tsx`, `app/robot-dock.css`: stationary wide-screen helper and shared pause controls. SVG desk gestures are decorative; model work states follow real requests.
- `components/paper-motion.tsx`, `app/paper-motion.css`: original pointer depth, paper/preview/portrait motion, cursor ring, eye tracking and native scroll reactions.
- `components/project-gallery.tsx`, `components/project-artwork.tsx`, `components/project-drawer.tsx`, `app/project-gallery.css`, `app/project-workspace.css`: original app-window workbench, illustrative FlightSense data/model/dashboard (the football artwork was removed on 12 October), a code-native sliding drawer face, native project disclosure and raised button treatments. Only Context Window uses an actual project screenshot. Other artwork is illustrative, with no invented measurements or live results. The clickable books were removed.
- `components/walking-scout.tsx`, `app/walking-scout.css`: original articulated walking, tablet checking, waving and looking-around routine on the hero floor. Browser-native keyframes are generated once, with no per-frame React or JavaScript update loop. Idle motions are decorative; real API work remains confined to the chat's sourced stages.
- `components/medical-audit-preview.tsx`: original code-native bill/check/evidence workflow illustration, not a demo screenshot, real medical document, or live result.
- `components/research-cover.tsx`: original FlightSense case cover. Illustrative curves are not the paper's actual ROC plot.
- `public/images/yash.webp`: the existing portrait.
- `public/projects/context-window-newsroom.png`: actual repository screenshot (`docs/images/newsroom-floor.png`), shown in the project showcase. It is a screenshot, not a live embedded run.
- `public/favicon.svg`: original simple Y icon, replacing the blue YK flag.
- `public/images/og.png`: browser capture of the current hero. Regenerate with `node scripts/capture-paper.cjs --social`, then rebuild.

No reference-site images, mascots, custom font files or artwork were downloaded. Anton, DM Sans, Instrument Serif and IBM Plex Mono are self-hosted through Next.js's Google font integration. No aircraft imagery or image-generation output is used.
