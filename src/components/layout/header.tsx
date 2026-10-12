import { profile } from "@/lib/content";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { PortfolioSearch } from "@/components/ui/portfolio-search";

export function Header({ caseStudy = false, active }: { caseStudy?: boolean; active?: string }) {
  const prefix = caseStudy ? "/" : "";
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="paper-header case-paper-header">
      <a className="header-name" href={caseStudy ? "/" : "#start"}>Home</a>
      <div className="paper-toolbar">
        <nav aria-label="Main navigation">{[["experience","Experience"],["work","Projects"],["about","About"],["contact","Contact"]].map(([id,label]) => <a key={id} href={prefix+"#"+id} aria-current={active === id ? "location" : undefined}>{label}</a>)}</nav>
        <a className="paper-resume" href={profile.resume} target="_blank" rel="noopener">Resume ↗</a>
        <PortfolioSearch/>
        <MobileMenu prefix={prefix}/>
      </div>
    </header>
  </>;
}
