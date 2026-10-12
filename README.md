# Yash Kamerkar

Software engineering and applied AI portfolio, with professional experience, three selected projects, and Scout, a source-backed project guide.

**[Live portfolio](https://yashkamerkar14.github.io/)** | [Resume](https://yashkamerkar14.github.io/Yash_Mahesh_Kamerkar_Resume.pdf)

Built with Next.js, React, TypeScript and Tailwind CSS. GitHub Pages hosts the static site; a separate Vercel function runs Scout.

## Repository layout

| Folder | Purpose |
| --- | --- |
| src/app | Pages, research case study and metadata |
| src/components | UI grouped into agents, hero, layout, projects and ui |
| src/lib | Resume facts, project catalog, search and API URL helpers |
| src/server | Private Scout API, source selection and spending checks |
| src/styles | Stylesheets, preserved in their original load order |
| public | Resume PDF, portrait, project image and licensed icons |
| scripts | Local servers, preview captures and Scout deployment tools |
| tests/e2e | Browser, accessibility and responsive checks |
| tests/server | Mocked API checks; no paid model calls |
| docs | Content sources, artwork credits and operating instructions |

## Local development

Use Node.js 24 and npm:

~~~sh
npm ci
npm run dev
~~~

Open http://127.0.0.1:3000. Development and preview use the same port; run one at a time.

## Build and check

~~~sh
npm run typecheck
npm run test:agents
npm run build
npm run preview
~~~

With preview running, use npm run test:e2e for browser checks or npm run capture for screenshots. CHROME_PATH overrides the local Chrome location in the browser configuration.

## Content and Scout

Edit src/lib/content.ts for resume-backed experience and src/lib/projects.json for project details. Add project images under public/projects. The gallery, drawer, search and Scout share this catalog. The unchanged resume is public/Yash_Mahesh_Kamerkar_Resume.pdf.

For local configuration, copy .env.example to .env.local. NEXT_PUBLIC_SCOUT_API_ORIGIN can point to the existing hosted Scout API; leaving it empty uses the companion local API. A private OPENROUTER_API_KEY is needed only for local model requests or configuring the backend. Environment files are ignored by Git. API keys must never use a NEXT_PUBLIC_ variable.

## Publishing

Push source changes to main. The GitHub Actions workflow checks TypeScript and the mocked API, builds the static export, and deploys it to the live address. The public repository variable SCOUT_API_ORIGIN supplies Scout's URL. Backend updates are deployed separately using the [Scout instructions](docs/operations/scout-backend.md).

Generated dependencies, build output and screenshots are ignored. VS Code hides these folders from its Explorer; they are recreated by the commands above. The private rollback archive and Vercel project linkage remain local.

See the [documentation index](docs/README.md) for content audits, artwork credits, verification and rollback instructions.
