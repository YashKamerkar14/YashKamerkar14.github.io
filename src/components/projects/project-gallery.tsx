import projects from "@/lib/projects.json";
import { ProjectPreview } from "@/components/projects/project-preview";
import { ProjectDrawer } from "@/components/projects/project-drawer";

/** Every selected project is visible together, including without JavaScript. */
export function ProjectGallery() {
  return <div className="project-workbench"><p className="workbench-note">A few things I’ve put into the world.</p><div className="project-window-grid">{projects.map((project,index)=><ProjectPreview key={project.id} project={project} index={index}/>)}</div><ProjectDrawer/></div>;
}
