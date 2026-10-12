"use client";

import { useState } from "react";
import { profile } from "@/lib/content";

export function CopyEmail() {
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true); setStatus("Email address copied.");
    } catch { setCopied(false); setStatus("Copy unavailable. Use the email link or select the address to copy it."); }
  }
  return <div className="copy-wrap"><button type="button" className="copy-button" onClick={copy} aria-label={copied ? "Copied email address" : "Copy email address"}><svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.5" /></svg>{copied ? "Copied" : "Copy email"}</button><p className="copy-status" role="status">{status}</p></div>;
}
