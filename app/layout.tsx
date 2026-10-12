import type { Metadata, Viewport } from "next";
import { Anton, DM_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import { profile } from "@/lib/content";
import "./globals.css";
import "./editorial.css";
import "./agents.css";
import "./paper-motion.css";
import "./robot-dock.css";
import "./paper.css";
import "./project-workspace.css";
import "./walking-scout.css";
import "./project-gallery.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-dm", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex", display: "swap" });
const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://yashkamerkar14.github.io"),
  title: { default: "Yash Kamerkar — Software & AI Engineer", template: "%s — Yash Kamerkar" },
  description: "Yash Kamerkar is a Software & AI Engineer at Uber. Explore backend engineering experience, Context Window, Medical Bill Auditor, and FlightSense research.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", siteName: "Yash Kamerkar", title: "Yash Kamerkar — Software & AI Engineer", description: "I turn complexity into clarity. Explore Yash Kamerkar’s experience, projects, and research.", images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "Yash Kamerkar’s illustrated paper room and engineering portfolio." }] },
  twitter: { card: "summary_large_image", creator: "@Yashrooney14" },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#f3f1e6", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = { "@context": "https://schema.org", "@type": "Person", name: profile.name, url: "https://yashkamerkar14.github.io/", jobTitle: "Software Engineer | AI Engineer", worksFor: { "@type": "Organization", name: "Uber" }, alumniOf: { "@type": "CollegeOrUniversity", name: "Stevens Institute of Technology" }, address: { "@type": "PostalAddress", addressLocality: "San Jose", addressRegion: "CA", addressCountry: "US" }, email: profile.email, sameAs: [profile.linkedin, profile.github, profile.twitter, profile.paper] };
  return <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable} ${display.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />{children}</body></html>;
}
