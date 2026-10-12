/** An illustrative workflow, not a screenshot or a live audit result. */
export function MedicalAuditPreview() {
  return <figure className="medical-audit-preview" aria-label="Illustration of bill and EOB input, deterministic checks, and evidence verification">
    <svg viewBox="0 0 640 260" fill="none" aria-hidden="true">
      <defs><pattern id="audit-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="#345e4d" opacity=".09"/></pattern></defs>
      <rect width="640" height="260" rx="8" fill="#e8efe3"/><rect width="640" height="260" fill="url(#audit-grid)"/>
      <ellipse cx="150" cy="215" rx="75" ry="12" fill="#486f5515"/><ellipse cx="331" cy="215" rx="58" ry="12" fill="#486f5515"/><ellipse cx="514" cy="215" rx="69" ry="12" fill="#486f5515"/>
      <g stroke="#365c4a" strokeWidth="2" strokeLinejoin="round">
        <path d="M193 129h72m-10-7 10 7-10 7m127-7h65m-10-7 10 7-10 7" strokeDasharray="5 6"/>
        <rect x="82" y="42" width="94" height="139" rx="5" fill="#dbd6bd" transform="rotate(-7 82 42)"/>
        <rect x="111" y="55" width="95" height="145" rx="5" fill="#fffdf0" transform="rotate(5 111 55)"/>
        <path d="m133 83 54 5m-56 15 54 5m-56 15 32 3m-34 17 54 5m-56 15 54 5"/>
        <rect x="278" y="74" width="101" height="116" rx="9" fill="#28584f"/>
        <path d="m296 99 5 5 9-12m-14 29 5 5 9-12m-14 29 5 5 9-12" stroke="#d2e8d6"/>
        <path d="M324 101h35m-35 22h35m-35 22h35" stroke="#a4c9b4"/>
        <path d="m469 60 96 16v116l-96-16z" fill="#fffdf0"/>
        <path d="m491 92 51 9m-51 16 51 9m-51 16 25 4"/>
        <circle cx="548" cy="169" r="27" fill="#c5dabc"/><path d="m535 169 9 9 17-19" strokeWidth="4" strokeLinecap="round"/>
      </g>
    </svg>
    <figcaption><span>Bill + EOB</span><span aria-hidden="true">→</span><span>Rule checks</span><span aria-hidden="true">→</span><span>Verified evidence</span></figcaption>
  </figure>;
}
