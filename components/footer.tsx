import { profile } from "@/lib/content";
import { Arrow } from "./icons";
import { CopyEmail } from "./copy-email";

export function Contact() {
  return <section id="contact" className="contact-section" aria-labelledby="contact-title"><div className="container">
    <div className="section-label"><span className="mono">05 / Keep in touch</span><span className="mono">San Jose, California</span></div>
    <div className="contact-heading"><div><h2 id="contact-title">Have a good problem?<br /><em>Let’s talk.</em></h2><p className="contact-intro">Software, AI, or a thoughtful idea. My inbox is open.</p></div><a className="contact-arrow" href={`mailto:${profile.email}`} aria-label="Email Yash Kamerkar"><Arrow diagonal /></a></div>
    <div className="contact-bottom"><div><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<Arrow diagonal /></a><CopyEmail /></div><div className="contact-socials"><a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn <Arrow diagonal /></a><a href={profile.github} target="_blank" rel="noopener">GitHub <Arrow diagonal /></a><a href={profile.twitter} target="_blank" rel="noopener">Twitter / X <Arrow diagonal /></a><a href={profile.resume} target="_blank" rel="noopener">View resume <Arrow diagonal /></a><a href={profile.resume} download="Yash_Kamerkar_Resume.pdf">Download resume <span aria-hidden="true">↓</span></a></div></div>
  </div></section>;
}

export function Footer() {
  return <footer className="site-footer"><div className="container footer-inner"><a href="/" className="footer-name">Yash Kamerkar<span>.</span></a><span className="mono footer-credit">Thoughtfully built with Next.js & TypeScript.</span><a className="mono" href="#main">Back to top ↑</a><span className="mono">© 2026</span></div></footer>;
}
