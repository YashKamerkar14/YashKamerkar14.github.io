"use client";

import { useEffect, useState } from "react";

/** Synchronize the two controls without running a render loop for decorative motion. */
export function RobotMotionToggle() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const sync = () => setPaused(document.querySelector<HTMLElement>(".paper-studio")?.dataset.robotsPaused === "true");
    sync();
    window.addEventListener("portfolio:robot-motion", sync);
    return () => window.removeEventListener("portfolio:robot-motion", sync);
  }, []);
  function toggle() {
    const studio = document.querySelector<HTMLElement>(".paper-studio");
    if (!studio) return;
    studio.dataset.robotsPaused = String(studio.dataset.robotsPaused !== "true");
    window.dispatchEvent(new Event("portfolio:robot-motion"));
  }
  return <button className="robot-motion-toggle" type="button" onClick={toggle} aria-label={paused ? "Resume robot animation" : "Pause robot animation"} aria-pressed={paused} title={paused ? "Resume robots" : "Pause robots"}>
    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">{paused ? <path d="m6 3 11 7-11 7Z"/> : <path d="M5 4h3v12H5Zm7 0h3v12h-3Z"/>}</svg>
  </button>;
}
