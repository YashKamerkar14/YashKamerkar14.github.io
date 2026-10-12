"use client";

import { useEffect, useRef } from "react";

const clamp = (value: number, limit = 1) => Math.max(-limit, Math.min(limit, value));

/** Decorative motion only: native pointers, scrolling, and every action stay intact. */
export function PaperMotion() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const follower = cursor.current;
    const studio = follower?.closest<HTMLElement>(".paper-studio");
    if (!follower || !studio) return;
    const room = studio.querySelector<HTMLElement>(".paper-room");
    const characters = Array.from(studio.querySelectorAll<SVGSVGElement>(".agent-character"));
    const media = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 761px) and (prefers-reduced-motion: no-preference)");
    let frame = 0, active = false, dirty = false, hitTest = false;
    let target: Element | null = null;
    let targetX = 0, targetY = 0;
    let surface: HTMLElement | null = null;
    let geometry: { room?: DOMRect; surface?: DOMRect; gazes: { character: SVGSVGElement; rect: DOMRect }[] } | null = null;
    let scrollFrame = 0;
    const readScroll = () => {
      scrollFrame = 0;
      geometry = null;
      const distance = document.documentElement.scrollHeight - innerHeight;
      studio.style.setProperty("--reading-progress", String(distance > 0 ? Math.min(1,Math.max(0,scrollY/distance)) : 0));
      const bounds = room?.getBoundingClientRect();
      studio.style.setProperty("--room-scroll", bounds && media.matches ? String(Math.min(1,Math.max(0,-bounds.top/bounds.height))) : "0");
    };
    const queueScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(readScroll); };

    const clearSurface = () => {
      if (!surface) return;
      delete surface.dataset.hovering;
      for (const property of ["--hover-x", "--hover-y", "--hover-light-x", "--hover-light-y"]) surface.style.removeProperty(property);
      surface = null;
    };
    const rest = () => {
      active = false;
      geometry = null;
      dirty = false;
      hitTest = false;
      cancelAnimationFrame(frame); frame = 0;
      delete studio.dataset.pointer;
      delete follower.dataset.pressed;
      clearSurface();
      for (const property of ["--room-x", "--room-y", "--light-x", "--light-y", "--scene-x", "--scene-y", "--scene-light-x", "--scene-light-y"]) studio.style.removeProperty(property);
      characters.forEach(character => { character.style.removeProperty("--gaze-x"); character.style.removeProperty("--gaze-y"); });
    };
    const updateScene = (target: Element) => {
      // Read geometry together before writing styles; pointer events are batched per frame.
      const next = target.closest<HTMLElement>(".project-card, .paper-portrait, .agent-desk, .scout-walker, .employment-note, .toolkit-notes article, .primary-link, .social-icon-links a, .dock-launch");
      if (!geometry || surface !== next) geometry = { surface: next?.getBoundingClientRect(), room: room?.getBoundingClientRect(), gazes: characters.map(character => ({ character, rect: character.getBoundingClientRect() })) };
      const { surface:surfaceRect, room:roomRect } = geometry;
      const gazes=geometry.gazes.map(item=>item.character.dataset.scene === "walk" ? {...item,rect:item.character.getBoundingClientRect()} : item);
      studio.dataset.pointer = "active";
      studio.style.setProperty("--scene-x", clamp(targetX / innerWidth * 2 - 1).toFixed(3));
      studio.style.setProperty("--scene-y", clamp(targetY / innerHeight * 2 - 1).toFixed(3));
      studio.style.setProperty("--scene-light-x", `${targetX}px`);
      studio.style.setProperty("--scene-light-y", `${targetY}px`);
      const drawerHandle = target.closest(".drawer-handle");
      const label = drawerHandle ? drawerHandle.getAttribute("aria-expanded") === "true" ? "Close drawer" : "Open drawer" : target.closest(".project-preview") ? "View project" : target.closest(".agent-desk, .scout-walker, .dock-launch") ? "Ask the team" : target.closest("a[href^='mailto:']") ? "Say hello" : "";
      const text = follower.querySelector<HTMLElement>(".ink-cursor-label");
      if (text && text.textContent !== label) text.textContent = label;
      follower.dataset.action = target.closest("a, button, summary") ? "true" : "false";
      follower.dataset.label = label ? "true" : "false";
      follower.dataset.edge = targetX > innerWidth - 140 ? "left" : "right";
      if (surface !== next) { clearSurface(); surface = next; }
      if (surface && surfaceRect) {
        const localX = clamp((targetX - surfaceRect.left) / surfaceRect.width * 2 - 1);
        const localY = clamp((targetY - surfaceRect.top) / surfaceRect.height * 2 - 1);
        surface.dataset.hovering = "true";
        surface.style.setProperty("--hover-x", localX.toFixed(3));
        surface.style.setProperty("--hover-y", localY.toFixed(3));
        surface.style.setProperty("--hover-light-x", `${(localX + 1) * 50}%`);
        surface.style.setProperty("--hover-light-y", `${(localY + 1) * 50}%`);
      }
      if (roomRect) {
        const inside = targetY >= roomRect.top && targetY <= roomRect.bottom;
        studio.style.setProperty("--room-x", inside ? clamp(targetX / innerWidth * 2 - 1).toFixed(3) : "0");
        studio.style.setProperty("--room-y", inside ? clamp((targetY - roomRect.top) / roomRect.height * 2 - 1).toFixed(3) : "0");
        studio.style.setProperty("--light-x", `${targetX}px`);
        studio.style.setProperty("--light-y", `${targetY - roomRect.top}px`);
      }
      gazes.forEach(({character, rect}) => {
        if (!rect.width || rect.bottom < 0 || rect.top > innerHeight) return;
        character.style.setProperty("--gaze-x", `${clamp((targetX - rect.left - rect.width / 2) / 220) * 3}px`);
        character.style.setProperty("--gaze-y", `${clamp((targetY - rect.top - rect.height * .3) / 220) * 2}px`);
      });
    };
    const draw = () => {
      frame = 0;
      if (!active) return;
      if (document.querySelector("dialog[open]")) { rest(); return; }
      if (hitTest) { hitTest = false; target = document.elementFromPoint(targetX, targetY); }
      if (target?.closest("input, textarea, [contenteditable]")) { rest(); return; }
      if (dirty && target) { dirty = false; updateScene(target); }
      // One update per pointer frame; no delayed follower or perpetual easing loop.
      follower.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse" || document.querySelector("dialog[open]") || !(event.target instanceof Element) || event.target.closest("input, textarea, [contenteditable]")) { rest(); return; }
      active = true; dirty = true; target = event.target;
      targetX = event.clientX; targetY = event.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) rest(); };
    const down = () => { if (active) follower.dataset.pressed = "true"; };
    const up = () => { delete follower.dataset.pressed; };
    const visibility = () => { if (document.hidden) rest(); };
    const scroll = () => {
      queueScroll();
      if (!active) return;
      dirty = true; hitTest = true;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const resize = () => { rest(); queueScroll(); };
    const mediaChange = () => { rest(); queueScroll(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.addEventListener("keydown", rest);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", rest);
    document.addEventListener("scroll", scroll, { capture: true, passive: true });
    window.addEventListener("resize", resize);
    media.addEventListener("change", mediaChange);
    document.addEventListener("toggle", queueScroll, true);
    const layoutObserver = new ResizeObserver(queueScroll);
    layoutObserver.observe(studio);
    readScroll();

    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      const element = entry.target as HTMLElement;
      if (element === room) studio.dataset.roomVisible = String(entry.isIntersecting && entry.intersectionRatio >= .2);
      else if (entry.isIntersecting) { element.dataset.arrived = "true"; observer.unobserve(element); }
    }), { threshold: .2 });
    if (room) observer.observe(room);
    studio.querySelectorAll(".chapter-heading, .employment-note, .project-card, .about-story, .contact-chapter > h2, .toolkit-notes article").forEach(element => observer.observe(element));
    return () => {
      rest(); observer.disconnect(); layoutObserver.disconnect(); cancelAnimationFrame(scrollFrame); delete studio.dataset.roomVisible;
      document.removeEventListener("pointermove", move); document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", down); document.removeEventListener("pointerup", up);
      document.removeEventListener("keydown", rest); document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", rest); window.removeEventListener("resize", resize);
      document.removeEventListener("scroll", scroll, true); document.removeEventListener("toggle", queueScroll, true); media.removeEventListener("change", mediaChange);
    };
  }, []);
  return <div className="ink-pointer-layer" aria-hidden="true"><div ref={cursor} className="ink-cursor"><span className="ink-cursor-ring"/><span className="ink-cursor-label"/></div></div>;
}
