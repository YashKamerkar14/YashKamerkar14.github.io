"use client";

import { useRef } from "react";

export function MobileMenu({ prefix }: { prefix: string }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return <details className="mobile-menu" ref={menu} onKeyDown={event => {
    if (event.key === "Escape") { menu.current?.removeAttribute("open"); menu.current?.querySelector("summary")?.focus(); }
  }}><summary aria-label="Navigation menu"><span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation" onClick={event => {
    if ((event.target as HTMLElement).closest("a")) menu.current?.removeAttribute("open");
  }}><a href={`${prefix}#experience`}>Experience</a><a href={`${prefix}#work`}>Projects</a><a href={`${prefix}#about`}>About</a><a href={`${prefix}#contact`}>Contact</a><a href="/Yash_Mahesh_Kamerkar_Resume.pdf" target="_blank" rel="noopener">Resume ↗</a></nav></details>;
}
