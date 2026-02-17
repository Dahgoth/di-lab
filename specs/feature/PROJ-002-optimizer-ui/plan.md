# Implementation Plan: Optimizer UI

**Branch**: `feature/PROJ-002-optimizer-ui` | **Date**: 2026-02-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/feature/PROJ-002-optimizer-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build the user interface components for the DI-Lab legendary gems optimizer, enabling Diablo Immortal players to input their gem inventory, specify available resources, receive optimization recommendations, and manage their builds. The UI uses React 19 with Next.js 16 App Router, Tailwind CSS 4 for styling, and implements a weighted greedy optimization algorithm for gem upgrade recommendations. Data persistence uses server-side SQLite database with anonymous session identification via localStorage UUID.

## Technical Context

**Language/Version**: TypeScript 5.9.x with Bun runtime
**Primary Dependencies**: Next.js 16, React 19, Tailwind CSS 4, Zod 4, lucide-react, drizzle-orm, better-sqlite3
**Storage**: SQLite via Drizzle ORM for server-side sessions and builds
**Testing**: Vitest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Web (responsive mobile-first, modern browsers ES2020+)
**Project Type**: web (single Next.js application)
**Performance Goals**: FCP < 1.8s, LCP < 2.5s, TTI < 3.8s, optimization < 5s for 10 gems
**Constraints**: < 200ms p95 for optimization API, mobile 60fps scrolling, WCAG 2.1 AA
**Scale/Scope**: 50-100 gems in catalog, up to 24 equipped gems per user, 5 saved builds per free user

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Evaluation

| Principle                       | Status  | Notes                                                                                                             |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| **I. User-First Experience**    | ✅ PASS | Fast results (<5s optimization), clear output, mobile-first design, progressive enhancement with skeleton loaders |
| **II. Data Integrity**          | ✅ PASS | Single source of truth (gems.json), versioned data, external validation via docs/, user corrections tracked       |
| **III. Security & Privacy**     | ✅ PASS | OAuth-only deferred (anonymous sessions for MVP), minimal data collection, no sensitive game data stored          |
| **IV. Transparent Methodology** | ✅ PASS | Documented algorithms in research.md, power gain visibility, resource breakdown displayed, alternatives shown     |
| **V. Tiered Value**             | ✅ PASS | Free tier provides basic optimization (greedy), build saving (5 builds), manual entry                             |

### Technical Constraints Check

| Constraint                       | Status      | Notes                                                     |
| -------------------------------- | ----------- | --------------------------------------------------------- |
| Framework: Next.js 16 + React 19 | ✅ PASS     | Using App Router with Server Components                   |
| Styling: Tailwind CSS 4          | ✅ PASS     | CSS-first configuration via @tailwindcss/postcss          |
| Database: Drizzle ORM + SQLite   | ✅ PASS     | Server-side session persistence                           |
| Auth: NextAuth 5                 | ⚠️ DEFERRED | Anonymous sessions for MVP, Battle.net OAuth out of scope |
| Validation: Zod                  | ✅ PASS     | Runtime validation for all user inputs                    |
| Package Manager: Bun             | ✅ PASS     | All commands use bun                                      |

### Performance Standards Check

| Standard                 | Target           | Status  | Notes                                      |
| ------------------------ | ---------------- | ------- | ------------------------------------------ |
| First Contentful Paint   | < 1.5s           | ✅ PASS | Static gem data bundled, Server Components |
| Time to Interactive      | < 3s             | ✅ PASS | Skeleton loaders, debounced validation     |
| Optimization Calculation | < 5s for 10 gems | ✅ PASS | O(n log n) greedy algorithm implemented    |
| Lighthouse Score         | > 90             | ⚠️ TBD  | Verify after implementation                |

### Code Quality Gates Check

| Gate                                  | Status  | Notes                          |
| ------------------------------------- | ------- | ------------------------------ |
| `bun typecheck` passes                | ✅ PASS | TypeScript strict mode enabled |
| `bun lint` passes                     | ✅ PASS | ESLint configured              |
| Server Components by default          | ✅ PASS | App Router pattern             |
| Client components with `"use client"` | ✅ PASS | Interactive components only    |

**Gate Status**: ✅ **ALL GATES PASS** - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/feature/PROJ-002-optimizer-ui/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - RESOLVED
├── data-model.md        # Phase 1 output - COMPLETE
├── quickstart.md        # Phase 1 output - COMPLETE
├── contracts/           # Phase 1 output - COMPLETE
│   └── optimize-api.schema.json
├── checklists/          # Validation checklists
│   ├── comprehensive.md
│   ├── requirements.md
│   └── validation-report.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + metadata
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Tailwind imports + global styles
│   ├── api/                      # API routes
│   │   ├── optimize/route.ts     # Optimization endpoint
│   │   └── session/route.ts      # Session management endpoint
│   ├── optimize/                 # Optimization page
│   │   └── page.tsx
│   └── builds/                   # Saved builds pages
│       ├── page.tsx              # Builds list
│       └── [id]/page.tsx         # Single build view
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   └── Select.tsx
│   ├── gems/                     # Gem-related components
│   │   ├── GemSelector.tsx
│   │   ├── GemCard.tsx
│   │   ├── GemCatalog.tsx
│   │   ├── GemDetailModal.tsx
│   │   └── EquippedGemCard.tsx
│   ├── optimization/             # Optimization components
│   │   ├── OptimizeButton.tsx
│   │   ├── OptimizationResult.tsx
│   │   ├── RecommendationCard.tsx
│   │   └── ProcessingModal.tsx
│   ├── resources/                # Resource input components
│   │   ├── ResourceInput.tsx
│   │   └── ResourcePanel.tsx
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navigation.tsx
├── lib/
│   ├── db/                       # Drizzle schema & queries
│   │   ├── schema.ts
│   │   ├── index.ts
│   │   └── migrations/
│   ├── optimization/             # Optimization algorithms
│   │   ├── engine.ts             # Main optimization entry
│   │   ├── scoring.ts            # Power calculation
│   │   ├── resources.ts          # Resource management
│   │   ├── resonance.ts          # Resonance calculation
│   │   ├── constants.ts          # Tier weights, thresholds
│   │   └── types.ts              # Shared types
│   ├── session/                  # Session management
│   │   └── anonymous-session.ts
│   └── external/                 # External API clients
│       └── (future integrations)
├── data/
│   └── gems.json                 # Static gem database
└── test/
    └── setup.ts                  # Testing library setup

tests/                            # E2E tests (Playwright)
└── e2e/
    └── optimize.spec.ts

e2e/                              # Playwright config directory
└── .gitkeep
```

**Structure Decision**: Single Next.js application with App Router. Server Components by default for data fetching (gem catalog from JSON), Client Components for interactive elements (selectors, buttons). Server-side SQLite for session persistence.

## Post-Design Constitution Re-Check

_Re-evaluated after Phase 1 design artifacts complete._

### Design Artifacts Alignment

| Artifact                               | Status      | Constitution Alignment                                              |
| -------------------------------------- | ----------- | ------------------------------------------------------------------- |
| **research.md**                        | ✅ RESOLVED | All NEEDS CLARIFICATION items resolved                              |
| **data-model.md**                      | ✅ COMPLETE | Correct resource model (gemPower + copies), server-side persistence |
| **contracts/optimize-api.schema.json** | ✅ COMPLETE | Corrected schema v1.1.0 with gemPower                               |
| **quickstart.md**                      | ✅ COMPLETE | Implementation order aligned with Constitution                      |

### Post-Design Gate Evaluation

| Principle                       | Status  | Design Verification                                                                                  |
| ------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| **I. User-First Experience**    | ✅ PASS | Two-panel inventory UI, skeleton loaders, debounced validation, mobile-first responsive design       |
| **II. Data Integrity**          | ✅ PASS | Zod schemas for all entities, XSS prevention in data-model.md, versioned gem data                    |
| **III. Security & Privacy**     | ✅ PASS | Anonymous sessions with localStorage UUID, no sensitive data stored, server-side validation          |
| **IV. Transparent Methodology** | ✅ PASS | Power formula documented in research.md, tier weights visible, alternatives shown in recommendations |
| **V. Tiered Value**             | ✅ PASS | Free tier: 5 builds, basic optimization; PVP/PVE mode selection; optional email opt-in               |

### Technical Constraints Re-Check

| Constraint                       | Status      | Design Verification                                                      |
| -------------------------------- | ----------- | ------------------------------------------------------------------------ |
| Framework: Next.js 16 + React 19 | ✅ PASS     | App Router structure defined in project structure section                |
| Styling: Tailwind CSS 4          | ✅ PASS     | Responsive breakpoints defined (sm/md/lg/xl/2xl)                         |
| Database: Drizzle ORM + SQLite   | ✅ PASS     | Schema defined in data-model.md with AnonymousSession, SavedBuild tables |
| Auth: NextAuth 5                 | ⚠️ DEFERRED | Anonymous session schema defined, Battle.net OAuth future enhancement    |
| Validation: Zod                  | ✅ PASS     | All entities have Zod schemas in data-model.md                           |
| Package Manager: Bun             | ✅ PASS     | All commands documented with bun                                         |

### Performance Standards Re-Check

| Standard                 | Target           | Status  | Design Verification                                    |
| ------------------------ | ---------------- | ------- | ------------------------------------------------------ |
| First Contentful Paint   | < 1.5s           | ✅ PASS | Static gem data bundled, Server Components for catalog |
| Time to Interactive      | < 3s             | ✅ PASS | Skeleton loaders defined, progressive enhancement      |
| Optimization Calculation | < 5s for 10 gems | ✅ PASS | O(n log n) greedy algorithm implemented and tested     |
| Lighthouse Score         | > 90             | ⚠️ TBD  | Will verify after implementation                       |

### Code Quality Gates Re-Check

| Gate                                  | Status  | Design Verification                                                   |
| ------------------------------------- | ------- | --------------------------------------------------------------------- |
| `bun typecheck` passes                | ✅ PASS | TypeScript strict mode, types defined in data-model.md                |
| `bun lint` passes                     | ✅ PASS | ESLint configured                                                     |
| Server Components by default          | ✅ PASS | App Router pattern documented in project structure                    |
| Client components with `"use client"` | ✅ PASS | Interactive components identified (GemSelector, OptimizeButton, etc.) |

**Post-Design Gate Status**: ✅ **ALL GATES PASS** - Ready for implementation

---

## Complexity Tracking

> **No violations - all Constitution principles satisfied**

| Item                           | Decision              | Rationale                                                                          |
| ------------------------------ | --------------------- | ---------------------------------------------------------------------------------- |
| Anonymous sessions (not OAuth) | Simpler approach      | Battle.net OAuth deferred per spec, localStorage UUID provides zero-friction start |
| Weighted greedy algorithm      | O(n log n) complexity | Sufficient for MVP, can upgrade to dynamic programming for paid tier               |
| Static gem data (not API)      | Bundled JSON          | Fastest load time, works offline for viewing, updated via deployment               |
| SQLite (not PostgreSQL)        | Simpler deployment    | Serverless-compatible, sufficient for expected scale                               |

---

## Generated Artifacts Summary

| Artifact            | Path                                                                     | Status                           |
| ------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| Implementation Plan | `specs/feature/PROJ-002-optimizer-ui/plan.md`                            | ✅ Complete                      |
| Research            | `specs/feature/PROJ-002-optimizer-ui/research.md`                        | ✅ Resolved                      |
| Data Model          | `specs/feature/PROJ-002-optimizer-ui/data-model.md`                      | ✅ Complete                      |
| API Contract        | `specs/feature/PROJ-002-optimizer-ui/contracts/optimize-api.schema.json` | ✅ Complete                      |
| Quickstart Guide    | `specs/feature/PROJ-002-optimizer-ui/quickstart.md`                      | ✅ Complete                      |
| Tasks               | `specs/feature/PROJ-002-optimizer-ui/tasks.md`                           | ✅ Existing (via /speckit.tasks) |

---

**Version**: 2.0.0 | **Last Updated**: 2026-02-17
