import Image from "next/image";
import { PaperStudio } from "@/components/layout/paper-studio";
import { CopyEmail } from "@/components/ui/copy-email";
import { ProjectAgents } from "@/components/agents/project-agents";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { EngineeringScene } from "@/components/hero/engineering-scene";
import { SocialLinks } from "@/components/ui/social-links";
import { TechIcon, TechLabels } from "@/components/ui/tech-icon";
import { experience, profile, skillGroups } from "@/lib/content";

function Highlight({ text }: { text: string }) {
  const parts = text.split(/(12,000 compliance documents|15 minutes to under 50 seconds|9 to 2 per week|420 repetitive delivery query resolutions per month|6 hours to 12 minutes|45,000 daily purchase requests|2.1 seconds to 340 ms|3.4 hours to 1.1 hours)/g);
  return <>{parts.map((part,index) => index % 2 ? <mark key={index}>{part}</mark> : part)}</>;
}

function RoomFloor() {
  return <svg className="room-floor" viewBox="0 0 1440 280" preserveAspectRatio="none" aria-hidden="true"><rect width="1440" height="280" fill="var(--paper)"/><g fill="none" stroke="currentColor" strokeWidth=".8">{Array.from({length:19},(_,index) => <path key={index} d={`M${720+(index-9)*75} 0L${720+(index-9)*235} 280`}/>)}{[0,23,55,98,150,211,279].map(y => <path key={y} d={`M0 ${y}H1440`}/>)}</g></svg>;
}

export default function Home() {
  return <PaperStudio>
    <main id="main">
      <section className="paper-room" id="start" aria-labelledby="hero-title">
        <div className="room-light" aria-hidden="true"/><div className="room-window-shadow" aria-hidden="true"/><RoomFloor/>
        <div className="room-stage">
        <div className="room-copy">
          <p className="room-eyebrow">SOFTWARE & AI ENGINEER · SAN JOSE, CA</p>
          <h1 id="hero-title">Yash<span> Kamerkar</span></h1>
          <p className="room-positioning">Turning complexity into clarity.</p>
          <p className="room-intro">I’m Yash, a software and AI engineer at Uber, building dependable backend services and useful AI applications.</p>
          <p className="hero-proof"><strong>Production backend &amp; AI systems</strong><span>Uber · Dell · Universal Courier</span></p>
          <div className="hero-actions"><a className="primary-link" href="#experience"><span>Explore my experience</span><span className="button-arrow" aria-hidden="true">↓</span></a><a className="resume-ticket" href={profile.resume} target="_blank" rel="noopener"><svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true"><path d="M5 2h7l4 4v12H5Z" stroke="currentColor"/><path d="M12 2v5h4M8 11h5m-5 3h5" stroke="currentColor"/></svg><span>View resume</span><span aria-hidden="true">↗</span></a><SocialLinks/></div>
        </div>
        <EngineeringScene/>
        <aside className="identity-note" aria-label="Current role"><p className="chapter-kicker">FIELD NOTES / YASH KAMERKAR</p><h2>Currently at <strong>Uber.</strong></h2><p>Software & AI Engineer<br/>San Jose, California</p><a href="#experience">Previously Dell & Universal Courier <span aria-hidden="true">↘</span></a></aside>
        <aside className="hero-workshop" aria-label="Scout, your portfolio guide"><ProjectAgents/></aside>
        <span className="room-footnote" aria-hidden="true">01 / A SMALL ROOM FOR BIG IDEAS</span>
        </div>
      </section>
      <section id="experience" className="paper-section experience-chapter" aria-labelledby="experience-title">
        <div className="chapter-heading"><div><p className="chapter-kicker">01 / PROFESSIONAL EXPERIENCE</p><h2 id="experience-title">Built in the <em>real world.</em></h2></div><a className="underlined-link" href={profile.resume} target="_blank" rel="noopener">Full resume ↗</a></div>
        <div className="employment-notes">{experience.map((job, index) => <article className="employment-note experience-item" id={"experience-"+index} key={job.company}>
          <div className="employment-label"><span className="employment-status">{index === 0 ? "CURRENT ROLE" : "PREVIOUSLY"}</span><h3>{job.company}</h3><p>{job.date}</p><span className="employment-place">{job.location}</span></div>
          <div className="experience-body"><h4>{job.role}</h4><p className="employment-focus">{job.focus}</p><ul>{job.bullets.slice(0,2).map(bullet => <li key={bullet}><Highlight text={bullet}/></li>)}</ul>{job.bullets.length > 2 && <details className="experience-details"><summary>{job.bullets.length-2} more contributions <span aria-hidden="true">+</span></summary><ul>{job.bullets.slice(2).map(bullet => <li key={bullet}>{bullet}</li>)}</ul></details>}</div>
        </article>)}</div>
      </section>
      <section id="work" className="paper-section work-chapter" aria-labelledby="work-title">
        <div className="chapter-heading"><div><p className="chapter-kicker">02 / SELECTED PROJECTS</p><h2 id="work-title">Made with <em>curiosity.</em></h2></div><a className="underlined-link" href={profile.github+"?tab=repositories"} target="_blank" rel="noopener">All repositories ↗</a></div>
        <ProjectGallery/>
      </section>
      <section id="about" className="paper-section about-chapter" aria-labelledby="about-title">
        <div className="about-paper"><figure className="paper-portrait"><Image src="/images/yash.webp" alt="Yash Kamerkar outside by the waterfront" width={460} height={460} sizes="(max-width: 700px) 80vw, 320px"/><figcaption>Yash Kamerkar · San Jose, California</figcaption></figure><div className="about-story"><p className="chapter-kicker">03 / ABOUT</p><h2 id="about-title">An engineer.<br/><em>Always curious.</em></h2><p>I enjoy the space between dependable backend systems and useful AI applications.</p><p>My work has taken me through enterprise technology at Dell, logistics at Universal Courier, and now engineering at Uber. I like turning complex problems into something people can actually use.</p><div className="education-slip"><h3>M.S. in Computer Science</h3><p>Stevens Institute of Technology</p><small>Sep 2024 — May 2026 · Hoboken, NJ</small></div><a className="underlined-link" href={profile.linkedin} target="_blank" rel="noopener">More on LinkedIn ↗</a></div></div>
      </section>
      <section id="toolkit" className="paper-section toolkit-chapter" aria-labelledby="toolkit-title">
        <div className="chapter-heading"><div><p className="chapter-kicker">04 / TOOLKIT</p><h2 id="toolkit-title">Tools I work with.</h2></div></div>
        <div className="toolkit-notes"><article><h3>Backend</h3><TechLabels names={["Java", "Spring Boot", "Python", "FastAPI"]}/><p>APIs, microservices, and data pipelines.</p></article><article><h3>Applied AI</h3><TechLabels names={["LangChain", "LangGraph", "PyTorch", "scikit-learn"]}/><p>Retrieval, language models, and ML.</p></article><article><h3>Infrastructure</h3><TechLabels names={["AWS", "Azure", "Docker", "Kubernetes"]}/><p>Cloud infrastructure and CI/CD.</p></article></div>
        <details className="full-toolkit"><summary>View the complete toolkit <span aria-hidden="true">+</span></summary><div className="toolkit-grid">{skillGroups.map(group => <div key={group.title}><h3>{group.title}</h3><ul>{group.items.map(skill => <li key={skill}><TechIcon name={skill}/><span>{skill}</span></li>)}</ul></div>)}</div></details>
      </section>
      <section id="contact" className="paper-section contact-chapter" aria-labelledby="contact-title">
        <p className="chapter-kicker">05 / CONTACT</p><h2 id="contact-title">Have something in mind?<br/><em>Let’s talk.</em></h2>
        <div className="contact-paper"><div><a className="email-link" href={"mailto:"+profile.email} aria-label="Email Yash Kamerkar">{profile.email}</a><CopyEmail/></div><div className="paper-socials"><a href={profile.github} target="_blank" rel="noopener">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a><a href={profile.twitter} target="_blank" rel="noopener">Twitter / X ↗</a><a href={profile.resume} download>Download resume ↓</a></div></div>
        <footer className="paper-footer"><span>© {new Date().getFullYear()} Yash Kamerkar</span><span>San Jose, California</span><a href="#start">Back to top ↑</a></footer>
      </section>
    </main>
  </PaperStudio>;
}
