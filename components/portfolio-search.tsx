"use client";

import { useEffect, useRef, useState } from "react";
import { searchPortfolio } from "@/lib/search";
import { Arrow } from "./icons";

export function PortfolioSearch() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [shortcutLabel, setShortcutLabel] = useState("⌘ / Ctrl K");
  const results = searchPortfolio(query);
  function openSearch() { if (dialog.current?.open) return; setQuery(""); dialog.current?.showModal(); input.current?.focus(); }
  function closeSearch() { dialog.current?.close(); trigger.current?.focus(); }
  useEffect(() => {
    setShortcutLabel(/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘ K" : "Ctrl K");
    function revealDestination() {
      const id = window.location.hash.slice(1);
      if (id !== "toolkit" && !/^experience-[0-2]$/.test(id)) return;
      const target = document.getElementById(id);
      const details = id === "toolkit" ? target?.querySelector(".full-toolkit") : target?.querySelector("details");
      if (!target || !details) return;
      details.setAttribute("open", "");
      requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }));
    }
    revealDestination();
    window.addEventListener("hashchange", revealDestination);
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); if (dialog.current?.open) dialog.current.close(); else { setQuery(""); dialog.current?.showModal(); input.current?.focus(); } }
    }
    document.addEventListener("keydown", shortcut);
    return () => { document.removeEventListener("keydown", shortcut); window.removeEventListener("hashchange", revealDestination); };
  }, []);
  return <><button type="button" className="search-trigger" ref={trigger} onClick={openSearch} aria-label={"Search " + shortcutLabel + " - portfolio"} title="Search portfolio (Ctrl or ⌘ K)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" /><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg><span>Search</span>{" "}<kbd aria-hidden="true">{shortcutLabel}</kbd></button>
    <dialog className="search-dialog" ref={dialog} aria-labelledby="search-title" onClick={event => { if (event.target === event.currentTarget) closeSearch(); }} onClose={() => trigger.current?.focus()}>
      <div className="search-dialog-top"><div><p className="mono">YASH’S PORTFOLIO / QUICK FIND</p><h2 id="search-title">What are you <em>looking for?</em></h2></div><button type="button" onClick={closeSearch} aria-label="Close search">×</button></div>
      <label htmlFor="portfolio-search" className="sr-only">Search work, experience, skills, or contact</label><input ref={input} id="portfolio-search" autoComplete="off" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try ‘RAG’, ‘Java’, or ‘FlightSense’…" />
      <p className="search-count mono" role="status">{query.trim() ? `${results.length} ${results.length === 1 ? "match" : "matches"}` : "A FEW GOOD PLACES TO START"}</p>
      <ul className="search-results">{results.map((result, index) => <li key={`${result.href}-${index}`}><a href={result.href} onClick={() => { if (result.href === "/#toolkit") document.querySelector(".full-toolkit")?.setAttribute("open", ""); const target = result.href.split("#")[1]; if (target?.startsWith("experience-")) document.getElementById(target)?.querySelector("details")?.setAttribute("open", ""); closeSearch(); }}><span className="search-result-category mono">{result.category}</span><div><strong>{result.title}</strong><p>{result.description}</p></div><Arrow diagonal /></a></li>)}</ul>
      {!results.length && <div className="search-empty"><span aria-hidden="true">⌕</span><p>No matches yet. Try a technology, an employer, or a project.</p></div>}
      <div className="search-dialog-bottom mono"><span>SEARCH THE WORK, FOLLOW THE EVIDENCE.</span><span>ESC TO CLOSE</span></div>
    </dialog>
  </>;
}
