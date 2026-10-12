import Image from "next/image";

const icons: Record<string, string> = {
  Python: "python", Java: "java", "Spring Boot": "spring", "Spring MVC": "spring",
  FastAPI: "fastapi", LangChain: "langchain", LangGraph: "langgraph",
  AWS: "amazonwebservices", "Amazon Web Services (AWS)": "amazonwebservices",
  Azure: "azure", "Microsoft Azure": "azure", Docker: "docker",
  Kubernetes: "kubernetes", "Kubernetes (K8s)": "kubernetes",
  "Next.js": "nextjs", TypeScript: "typescript", React: "react", "React.js": "react", "React Flow": "react",
  PostgreSQL: "postgresql", "Neon Postgres": "postgresql", PyTorch: "pytorch", "scikit-learn": "scikitlearn",
};

/** Labels carry the accessible name; the adjacent brand mark is decorative. */
export function TechIcon({ name }: { name: string }) {
  const icon = icons[name];
  return icon ? <Image className="tech-icon" src={"/tech/" + icon + ".svg"} width={18} height={18} alt="" aria-hidden="true" /> : null;
}

export function TechLabels({ names }: { names: string[] }) {
  return <ul className="toolkit-tech-labels">{names.map(name => <li key={name}><TechIcon name={name}/><span>{name}</span></li>)}</ul>;
}
