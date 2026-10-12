# Preserved versions

The redesigned portfolio remains the official live site. The user explicitly requested that the old portfolio not be restored.

## Previous public portfolio

The complete earlier HTML/CSS/JavaScript site is preserved in Git commit 5e06c72101ab62e3722cbda941d9e1e5ae2c0bf2. Its files can be inspected without replacing the current site.

## Local design checkpoint

The immutable archive .portfolio-history/before-project-drawer-and-shelf/source.zip preserves the 11 October 2026 Next.js design before the project drawer and button experiment. Its adjacent manifest.json records 97 paths and SHA-256 hashes. The archive excludes environment files, dependencies, build output and Git history, and remains ignored by Git.

This archive uses the historical app/, components/, lib/, server/ and scripts/ paths. The current repository uses src/app, src/components grouped by feature, src/lib, src/server and src/styles, with Scout tools under scripts/scout. An archive extraction over the current root would create duplicate application directories and break imports. Restore into an isolated temporary directory and map the historical paths deliberately only if the user explicitly requests restoration.

Preserve the current private environment files and Vercel linkage. A presentation-only rollback must retain the three current projects, their actual links and the removal of Football analysis. A full checkpoint restore would undo later content changes and requires an explicit request. Never use git reset --hard or git clean to restore this design.
