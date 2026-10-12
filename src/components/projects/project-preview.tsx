import Image from "next/image";
import projects from "@/lib/projects.json";
import { TechIcon } from "@/components/ui/tech-icon";
import { MedicalAuditPreview } from "@/components/projects/medical-audit-preview";
import { ProjectArtwork } from "@/components/projects/project-artwork";
import { profile } from "@/lib/content";

/** A concise workbench window; facts and URLs come from the catalog. */
export function ProjectPreview({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return <article className="project-card project-window" id={project.id} aria-labelledby={project.id+"-title"}>
    <div className="project-window-top" aria-hidden="true"><span className="window-dots"><i/><i/><i/></span><span>{String(index+1).padStart(2,"0")} / {project.section === "research" ? "RESEARCH LAB" : "PROJECT LAB"}</span><span>↗</span></div>
    {project.id === "medical-bill-auditor" && <MedicalAuditPreview/>}
    {project.id === "flightsense" && <ProjectArtwork kind="flightsense"/>}
    {project.image && <a className="project-preview" href={project.demoUrl || project.url} target="_blank" rel="noopener" aria-label={"Open "+project.name}><div className="project-browser"><span className="project-browser-bar" aria-hidden="true"><i/><i/><i/><span>{project.name}</span><b>↗</b></span><Image src={project.image} alt={project.imageAlt || project.name+" screenshot"} width={1440} height={1180} sizes="(max-width: 760px) 85vw, 680px"/></div></a>}
    <div className="project-card-copy"><p className="project-label">{project.label}{project.section === "research" ? " / CO-AUTHORED" : ""}</p><h3 id={project.id+"-title"}>{project.name}</h3><p className="project-description">{project.summary || project.description}</p><ul className="project-tags" aria-label="Project technologies">{(project.previewTags || project.tags.slice(0,4)).map(tag => <li key={tag}><TechIcon name={tag}/>{tag}</li>)}</ul><div className="project-links">{project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener">Live demo <span aria-hidden="true">↗</span></a>}{project.section === "research" && <a href={profile.paper} target="_blank" rel="noopener">Read paper <span aria-hidden="true">↗</span></a>}<a href={project.url} target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>{project.section === "research" && <a href="/work/flightsense/">Research notes <span aria-hidden="true">↗</span></a>}</div></div>
  </article>;
}
