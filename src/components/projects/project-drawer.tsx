"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import projects from "@/lib/projects.json";

const selected = projects;

/** A small local disclosure of real projects; opening it never calls the AI service. */
export function ProjectDrawer({ scene = false, onOpenChange }: { scene?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const id = useId();
  function change(next: boolean, restoreFocus = false) {
    setOpen(next);
    onOpenChange?.(next);
    if (restoreFocus) handle.current?.focus();
  }
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) { setOpen(false); onOpenChange?.(false); }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, onOpenChange]);
  return <div ref={root} className={scene ? "scene-drawer" : "project-index"} data-open={open}
    onKeyDown={event => { if (event.key === "Escape" && open) { event.stopPropagation(); change(false,true); } }}>
    <button ref={handle} className={scene ? "drawer-handle" : "drawer-ticket"} type="button" aria-expanded={open} aria-controls={id+"-panel"} aria-label={open ? "Close project drawer" : "Open project drawer"} onClick={() => change(!open)}>
      {scene ? <><span className="drawer-label"><span>PROJECTS / {String(selected.length).padStart(2,"0")}</span><strong>{open ? "Close project drawer" : "Open project drawer"}</strong></span><span className="drawer-knob" aria-hidden="true">{open ? "−" : "+"}</span></> : <>{open ? "Close project drawer" : "Open project drawer"} <span aria-hidden="true">↗</span></>}
    </button>
    {open && <section id={id+"-panel"} className="project-drawer-panel" aria-labelledby={id+"-title"}>
      <div className="drawer-heading"><div><p>{selected.length} PROJECTS / SCROLL TO EXPLORE</p><h2 id={id+"-title"}>Project drawer</h2></div><button type="button" className="drawer-close" aria-label="Close drawer contents" onClick={() => change(false,true)}>×</button></div>
      <div className="drawer-projects">{selected.map(project => <article key={project.id}>
        <div className="drawer-project-title">{project.image && <Image src={project.image} alt="" width={80} height={60} loading="eager"/>}<div><span>{project.label}</span><h3>{project.name}</h3></div></div>
        <div className="drawer-project-links">{project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener" aria-label={project.name+" live demo from drawer"}>Live demo <span aria-hidden="true">↗</span></a>}<a href={project.url} target="_blank" rel="noopener" aria-label={project.name+" repository from drawer"}>GitHub <span aria-hidden="true">↗</span></a><a href={"#"+project.id} onClick={() => change(false)}>View project <span aria-hidden="true">↓</span></a></div>
      </article>)}</div>
    </section>}
  </div>;
}
