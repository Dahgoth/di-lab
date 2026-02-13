# Active Context: DI-Lab (Diablo Immortal Legendary Gems Optimizer)

## Current State

**Project Status**: 🏗️ Early Development

The project is a Next.js 16 application with TypeScript and Tailwind CSS 4. Memory bank has been updated with the project brief. Ready for OpenSpec installation and feature development.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Fixed blank home page - added welcome content with heading, description, and CTA buttons
- [x] Memory bank updated with DI-Lab project brief
- [x] Added dependencies: next-auth, drizzle-orm, better-sqlite3, lucide-react, zod

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | 🔄 Needs DI-Lab UI |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `.kilocode/` | AI context & memory bank | ✅ Updated |
| `package.json` | Dependencies | ✅ Auth & DB added |

## Current Focus

SDD (Spec-Driven Development) is now set up with GitHub Spec Kit:

1. Spec Kit CLI v0.1.0 installed via `uv`
2. Project initialized with `specify init --here --force --ai kilocode`
3. Slash commands available in `.kilocode/workflows/`

## Next Steps

1. Use `/speckit.constitution` to establish DI-Lab project principles
2. Use `/speckit.specify` to create baseline specification for gem optimizer
3. Use `/speckit.plan` to create implementation plan
4. Use `/speckit.tasks` to generate actionable tasks
5. Use `/speckit.implement` to execute implementation

## Architecture Decisions

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Auth**: next-auth with Battle.net OAuth provider
- **Database**: Drizzle ORM + better-sqlite3 (SQLite)
- **UI**: Tailwind CSS 4 + lucide-react icons
- **Validation**: zod schemas

### Key Features to Build
1. **Gem Database**: Seed data for all legendary gems
2. **Optimization Engine**: Algorithm for upgrade recommendations
3. **Resource Calculator**: Track platinum, pearls, etc.
4. **Screenshot OCR**: (Paid tier) Image recognition for gems
5. **Battle.net Integration**: OAuth + character verification

## External APIs

| API | Purpose | Documentation |
|-----|---------|---------------|
| Battle.net OAuth | User authentication | https://develop.battle.net/ |
| diablo.tv | DI days/events data | TBD |
| diabloimmortalredeem.com | Character verification | Mock redemption API |

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Already have Drizzle + SQLite |

## Session History

| Date | Changes |
|------|---------|
| 2026-02-13 | Spec Kit v0.1.0 installed and initialized for Kilo Code |
| 2026-02-13 | Memory bank updated with DI-Lab project brief |
| 2026-02-13 | Analyzed SDD frameworks: Spec Kit vs OpenSpec vs Beads |
| 2026-02-13 | Decision: Spec Kit for team collaboration & PM features |
| 2026-02-13 | Fixed blank home page - added welcome content with heading, description, and CTA buttons |
| Initial | Template created with base Next.js setup |

## Spec Kit Commands Available

| Command | Purpose |
|---------|---------|
| `/speckit.constitution` | Establish project principles |
| `/speckit.specify` | Create baseline specification |
| `/speckit.plan` | Create implementation plan |
| `/speckit.tasks` | Generate actionable tasks |
| `/speckit.implement` | Execute implementation |
| `/speckit.clarify` | Ask structured questions (optional) |
| `/speckit.analyze` | Cross-artifact consistency check (optional) |
| `/speckit.checklist` | Generate quality checklists (optional) |
| `/speckit.taskstoissues` | Convert tasks to GitHub issues |
