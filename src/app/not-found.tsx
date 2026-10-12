import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Arrow } from "@/components/ui/icons";

export default function NotFound() {
  return <><Header caseStudy /><main id="main" className="container not-found"><p className="mono">404 / A small detour</p><h1>This route took<br /><em>a wrong turn.</em></h1><p>Let’s get you back to the work.</p><a className="button button-dark" href="/">Back to the portfolio <Arrow /></a></main><Footer /></>;
}
