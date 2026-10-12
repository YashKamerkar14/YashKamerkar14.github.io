"use client";

import { AgentCharacter } from "@/components/agents/robot-character";
import { RobotMotionToggle } from "@/components/agents/robot-motion-toggle";

/** A stable desk in the wide-screen gutter; never chases the scroll position. */
export function RobotDock({ chapter }: { chapter: string }) {
  const captions: Record<string,string> = { experience: "Engineering notes", work: "Project questions", about: "Meet Yash", toolkit: "Tools & choices", contact: "Say hello" };
  return <aside className="robot-dock" data-chapter={chapter} aria-label="Robot help desk">
    <RobotMotionToggle/>
    <button className="dock-launch" type="button" onClick={() => window.dispatchEvent(new Event("portfolio:ask-agents"))} aria-label="Open robot help desk">
      <span className="dock-robots" aria-hidden="true"><AgentCharacter agent="scout"/></span>
      <span className="dock-caption">{captions[chapter] || "Project questions"}</span>
      <span className="dock-action">Ask the team ↗</span>
    </button>
  </aside>;
}
