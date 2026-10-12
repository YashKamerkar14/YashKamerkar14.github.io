"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { PaperMotion } from "@/components/hero/paper-motion";
import { RobotDock } from "@/components/agents/robot-dock";

const chapters = ["start", "experience", "work", "about", "toolkit", "contact"];

export function PaperStudio({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("start");
  useEffect(() => {
    let frame = 0;
    const readPosition = () => {
      frame = 0;
      let current = "start";
      chapters.forEach(id => { const element = document.getElementById(id); if (element && element.getBoundingClientRect().top <= innerHeight * .35) current = id; });
      if (scrollY > 0 && document.documentElement.scrollHeight - innerHeight - scrollY <= 4) current = "contact";
      setActive(current);
    };
    const queuePosition = () => { if (!frame) frame = requestAnimationFrame(readPosition); };
    readPosition();
    window.addEventListener("scroll", queuePosition, { passive: true });
    window.addEventListener("resize", queuePosition);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", queuePosition); window.removeEventListener("resize", queuePosition); };
  }, []);
  return <div className="paper-studio"><div className="studio-atmosphere" aria-hidden="true"><span className="studio-grid"/><span className="studio-glow"/></div><span className="reading-progress" aria-hidden="true"/><PaperMotion/><RobotDock chapter={active}/><Header active={active}/>{children}</div>;
}
