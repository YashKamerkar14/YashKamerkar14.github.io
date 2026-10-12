import { profile } from "@/lib/content";

export function SocialLinks() {
  return (
    <nav className="social-icon-links" aria-label="Social profiles and email">
      <a href={profile.linkedin} aria-label="LinkedIn profile" title="LinkedIn" target="_blank" rel="noopener noreferrer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <circle cx="4.5" cy="4.5" r="1.75" />
          <path d="M3 9h3v12H3zM10 9h3v1.8c.8-1.3 1.8-2 3.5-2 3 0 4.5 1.9 4.5 5.1V21h-3v-6.4c0-1.8-.8-2.8-2.3-2.8-1.7 0-2.7 1.2-2.7 3.1V21h-3z" />
        </svg>
      </a>
      <a href={profile.twitter} aria-label="X profile — @Yashrooney14" title="X · @Yashrooney14" target="_blank" rel="noopener noreferrer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 3.5h4.4L20 20.5h-4.4L4 3.5ZM19.5 3.5l-6.2 7.2M10.7 13.3l-6.2 7.2" />
        </svg>
      </a>
      <a href={"mailto:" + profile.email} aria-label="Send an email" title="Email Yash">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
          <path d="m3.5 6 7 6a2.3 2.3 0 0 0 3 0l7-6" />
        </svg>
      </a>
    </nav>
  );
}
