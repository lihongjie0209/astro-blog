# Project Context: AstroPaper Blog

## Overview
This project is a personal blog built with **AstroPaper**, a minimal, responsive, and SEO-friendly **Astro** theme. It uses **TypeScript** for type safety, **TailwindCSS** for styling, and **Pagefind** for static search.

## Key Technologies
*   **Framework:** Astro (v5+)
*   **Language:** TypeScript
*   **Styling:** TailwindCSS (v4, via Vite plugin)
*   **Search:** Pagefind (Fuse.js alternative)
*   **Content:** Markdown (`.md`)
*   **Syntax Highlighting:** Shiki (configured in `astro.config.ts`)
*   **Linting/Formatting:** ESLint, Prettier

## Architecture
*   **Configuration:**
    *   `src/config.ts`: Main site settings (title, author, social links, etc.).
    *   `astro.config.ts`: Astro technical config (integrations, markdown plugins, Vite plugins).
    *   `src/content.config.ts`: Content collections schema definition.
*   **Content:**
    *   `src/data/blog/`: Directory for all blog posts (Markdown).
    *   `src/pages/`: Astro pages (routes).
    *   `src/layouts/`: Layout components (Main, PostDetails, etc.).
    *   `src/components/`: UI components (Header, Footer, Card, etc.).
*   **Assets:** `public/` for static assets, `src/assets/` for processed assets.

## Development Workflow

### Scripts (via `pnpm` or `npm`)
*   `pnpm dev`: Start local development server (localhost:4321).
*   `pnpm build`: Build for production (output to `dist/`).
*   `pnpm preview`: Preview the production build.
*   `pnpm lint`: Run ESLint check.
*   `pnpm format`: Format code using Prettier.
*   `pnpm sync`: Generate TypeScript types for Astro modules.

### Creating Content
1.  **Language:** Write all blog posts in **Chinese (Simplified)**.
2.  **File Creation:** Add a new Markdown file to `src/data/blog/`.
3.  **Frontmatter:** Ensure the frontmatter matches the schema in `src/content.config.ts`.
4.  **Verification:** **ALWAYS** run `pnpm run build` to ensure there are no errors before committing.
5.  **Submission:**
    *   If the build passes, commit changes following [Git Commit Conventions](#git-commit-conventions).
    *   Push changes to GitHub: `git push`.

## Coding Conventions
*   **Path Aliases:** Use `@/` to refer to `src/` (e.g., `import { SITE } from "@/config"`).
*   **Linting:** Strictly adhere to ESLint rules (e.g., `no-console` is enabled).
*   **Formatting:** Use Prettier for consistent code style.
*   **Type Safety:** Use TypeScript strict mode.

## Important Files
*   `src/config.ts`: Edit this to change blog metadata (Author, Title, URL).
*   `astro.config.ts`: Modify build settings and integrations.
*   `src/styles/global.css`: Global styles and Tailwind directives.

## Git Commit Conventions
*   **Standard:** Follow [Conventional Commits](https://www.conventionalcommits.org/).
*   **Format:** `<type>(<scope>): <subject>`
    *   Example: `feat(blog): add new markdown configuration`
*   **Types:**
    *   `feat`: A new feature
    *   `fix`: A bug fix
    *   `docs`: Documentation only changes
    *   `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
    *   `refactor`: A code change that neither fixes a bug nor adds a feature
    *   `perf`: A code change that improves performance
    *   `test`: Adding missing tests or correcting existing tests
    *   `build`: Changes that affect the build system or external dependencies
    *   `ci`: Changes to our CI configuration files and scripts
    *   `chore`: Other changes that don't modify src or test files
    *   `revert`: Reverts a previous commit
