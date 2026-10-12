import { experience, profile, skillGroups } from "./content";
import projects from "./projects.json";

export type SearchEntry = { title: string; category: string; description: string; href: string; keywords: string };
const entries: SearchEntry[] = [
  { title: "FlightSense", category: "Research", description: "Flight-delay prediction, AWS architecture, conversational AI, and the co-authored arXiv preprint.", href: "/work/flightsense/", keywords: "XGBoost SageMaker Streamlit Bedrock machine learning MLOps research paper" },
  ...projects.filter(project => project.demoUrl).map(project => ({ title: project.name + " · Live demo", category: "Project", description: project.summary, href: project.demoUrl!, keywords: project.tags.join(" ") + " live demo" })),
  { title: "View resume", category: "Resume", description: "The original resume PDF, with complete experience and technical skills.", href: profile.resume, keywords: "cv download education qualifications" },
  { title: "Say hello", category: "Contact", description: profile.email, href: "/#contact", keywords: "email contact connect" },
  { title: "About Yash", category: "About", description: "Software and AI engineering. M.S. in Computer Science, Stevens Institute of Technology.", href: "/#about", keywords: "San Jose California education Stevens masters" },
  { title: "Twitter / X", category: "Contact", description: "@Yashrooney14", href: profile.twitter, keywords: "social twitter x yashrooney" },
  ...projects.map(project=>({title:project.name+" · GitHub",category:"Project",description:project.summary,href:project.url,keywords:project.tags.join(" ")})),
  ...experience.flatMap((job, index) => job.bullets.map(bullet => ({ title: job.company, category: "Experience", description: bullet, href: `/#experience-${index}`, keywords: `${job.role} ${job.focus} ${job.date}` }))),
  ...skillGroups.map(group => ({ title: group.title, category: "Toolkit", description: group.items.join(" · "), href: "/#toolkit", keywords: "skills tools technologies" })),
];

export function searchPortfolio(query: string): SearchEntry[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return entries.slice(0, 5);
  return entries.map(entry => {
    const title = entry.title.toLowerCase().match(/[a-z0-9+#.]+/g) || [];
    const searchable = `${entry.title} ${entry.description} ${entry.keywords}`.toLowerCase().match(/[a-z0-9+#.]+/g) || [];
    const matches = (tokens: string[], word: string) => tokens.some(token => token.startsWith(word));
    const score = words.reduce((total, word) => total + (matches(title, word) ? 5 : matches(searchable, word) ? 1 : 0), 0);
    return { entry, score, all: words.every(word => matches(searchable, word)) };
  }).filter(result => result.all).sort((a, b) => b.score - a.score).slice(0, 8).map(result => result.entry);
}
