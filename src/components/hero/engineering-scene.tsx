"use client";

import { useState } from "react";
import { EngineeringIllustration } from "@/components/hero/engineering-illustration";
import { ProjectDrawer } from "@/components/projects/project-drawer";

/** A local explanation of the illustration; no model calls or simulated system status. */
export function EngineeringScene() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const shown = !drawerOpen && (hovered || focused || pinned);
  return <figure className="room-art" data-drawer-open={drawerOpen} aria-label="Backend and applied AI working together"
    onKeyDown={event => { if (event.key === "Escape") { setHovered(false); setFocused(false); setPinned(false); } }}>
    <EngineeringIllustration/>
    <ProjectDrawer scene onOpenChange={setDrawerOpen}/>
    <figcaption className="connection-detail" onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={() => setFocused(false)}>
      <button type="button" aria-describedby="connection-note" aria-controls="connection-note" aria-expanded={shown} onClick={() => setPinned(!pinned)}>Backend ↔ Applied AI</button>
      <p id="connection-note" role="tooltip" hidden={!shown}>Reliable backend services power useful AI applications. I build both, with careful connections between them.</p>
    </figcaption>
  </figure>;
}
