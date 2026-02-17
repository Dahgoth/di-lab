# Implementation Plan: Optimizer UI

**Branch**: `feature/PROJ-002-optimizer-ui` | **Date**: 2026-02-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/feature/PROJ-002-optimizer-ui/spec.md`

## Summary

Build the user interface components for the legendary gems optimizer, including gem selection, resource input, optimization results display, and build management. The UI enables Diablo Immortal players to input their gem inventory, specify available resources, receive optimization recommendations, and manage their builds. This implementation focuses exclusively on the presentation layer and user interactions.

## Technical Context

**Language/Version**: TypeScript 5.9.x with Bun runtime
**Primary Dependencies**: Next.js 16, React 19, Tailwind CSS 4, Zod 4, lucide-react
**Storage**: SQLite via Drizzle ORM for server-side sessions; localStorage for anonymous ID only
**Testing**: No tests configured yet - framework addition needed
**Target Platform**: Web (modern browsers ES2020+, mobile-first responsive)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: <5s optimization calculation, <3s Time to Interactive, 60fps scroll on mobile
**Constraints**: <1.5s First Contentful Paint, WCAG 2.1 AA accessibility, mobile-first design
**Scale/Scope**: 50-100 gems catalog, 5 saved builds (free tier), 24 max gem slots

### Client Component Boundary

The following components require `"use client"` directive due to interactive features:

| Component                | Reason for Client Boundary        |
| ------------------------ | --------------------------------- |
| `GemCatalog.tsx`         | Tab selection, click handlers     |
| `GemCard.tsx`            | Click selection, hover states     |
| `GemSelector.tsx`        | Quality/rank dropdown selection   |
| `GemDetail.tsx`          | Modal open/close state            |
| `ResourceInput.tsx`      | Form inputs, debounced validation |
| `OptimizeButton.tsx`     | Click handler, loading state      |
| `ResultsPanel.tsx`       | Display client-side results       |
| `RecommendationCard.tsx` | Expand/collapse interaction       |
| `Modal.tsx`              | Open/close state, focus trap      |
| `Toast.tsx`              | Animation, auto-dismiss timers    |
| `Tooltip.tsx`            | Hover state, positioning          |

**Strategy**: Use Server Components for:

- Static gem data fetching (initial catalog load)
- Page layouts and wrappers
- SEO-critical content

**Hydration Pattern**: Server-render initial state, hydrate for interactivity.

### Progressive Enhancement Strategy

**Scope Clarification**: The optimizer's core functionality (gem selection, resource input, optimization calculation, results display) inherently requires JavaScript for:

- localStorage persistence
- API calls to `/api/optimize`
- Interactive form validation
- Dynamic UI updates

**Enhanced Experience (with JavaScript)**:

- Full gem selection and configuration
- Real-time validation feedback
- Optimization execution and results
- Build saving/loading
- Session persistence

**Baseline Experience (without JavaScript)**:

- Static gem catalog view (read-only)
- Informational content about gem effects and rankings
- Navigation between pages

**Implementation**:

- Use `<noscript>` elements for fallback messaging
- Server-render gem catalog as static HTML
- Display message: "JavaScript required for optimization features" when JS disabled

### Technical Constraints

- **Hybrid Rendering**: Server Components for static content, Client Components for interactivity
- **No-JS Fallback**: Static gem catalog viewable without JavaScript; optimization requires JS

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### User-First Experience ✅

| Requirement             | Status  | Implementation                                             |
| ----------------------- | ------- | ---------------------------------------------------------- |
| Fast Results (<5s)      | ✅ Pass | Server-side optimization via `/api/optimize` route         |
| Clear Output            | ✅ Pass | Ranked recommendations with power gain visibility          |
| Mobile-First            | ✅ Pass | Tailwind responsive breakpoints, touch targets ≥44px       |
| Progressive Enhancement | ✅ Pass | Server-rendered catalog; no-JS fallback documented in plan |

### Data Integrity ✅

| Requirement            | Status      | Implementation                                     |
| ---------------------- | ----------- | -------------------------------------------------- |
| Single Source of Truth | ✅ Pass     | Gem data in structured JSON, bundled at build time |
| Versioned Data         | ✅ Pass     | Game version metadata in gem data                  |
| External Validation    | ⏳ Deferred | DI days integration out of scope                   |
| User Corrections       | ⏳ Deferred | Future feature                                     |

### Security & Privacy ✅

| Requirement               | Status      | Implementation                                      |
| ------------------------- | ----------- | --------------------------------------------------- |
| OAuth-Only Authentication | ⏳ Deferred | Battle.net auth deferred to P4                      |
| Minimal Data Collection   | ✅ Pass     | Only anonymous ID, gem selections, resources stored |
| Anonymous Sessions        | ✅ Pass     | localStorage UUID v4, no fingerprinting             |
| Character Verification    | ⏳ Deferred | Out of scope                                        |
| No Sensitive Game Data    | ✅ Pass     | No Battle.net credentials stored                    |

### Transparent Methodology ✅

| Requirement           | Status  | Implementation                                     |
| --------------------- | ------- | -------------------------------------------------- |
| Documented Algorithms | ✅ Pass | Optimization logic documented in code comments     |
| Power Gain Visibility | ✅ Pass | FR-019: Each recommendation shows power gain       |
| Resource Breakdown    | ✅ Pass | FR-019: Resource cost displayed per recommendation |
| Alternative Options   | ✅ Pass | Ranked list with expandable details (FR-020)       |

### Tiered Value ✅

| Requirement     | Status      | Implementation                                   |
| --------------- | ----------- | ------------------------------------------------ |
| Free Tier Value | ✅ Pass     | Basic optimization, manual entry, 5 saved builds |
| Paid Tier 1     | ⏳ Deferred | Screenshot OCR, advanced algorithms - future     |
| Paid Tier 2     | ⏳ Deferred | Character sync, API access - future              |

**Gate Status**: ✅ PASS - All critical constitution requirements met within scope

## Project Structure

### Documentation (this feature)

```text
specs/feature/PROJ-002-optimizer-ui/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── optimize-api.schema.json
├── checklists/
│   └── requirements.md  # Quality validation (complete)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx           # Root layout (exists)
│   ├── page.tsx             # Home page (exists)
│   ├── globals.css          # Tailwind imports (exists)
│   ├── optimize/
│   │   └── page.tsx         # Optimizer page
│   ├── builds/
│   │   └── page.tsx         # Saved builds page
│   └── api/
│       ├── optimize/
│       │   └── route.ts     # Optimization API endpoint
│       └── session/
│           └── route.ts     # Session management endpoint
├── components/
│   ├── ui/
│   │   ├── Button.tsx       # Reusable button component
│   │   ├── Card.tsx         # Card container component
│   │   ├── Input.tsx        # Form input component
│   │   ├── Select.tsx       # Dropdown select component
│   │   ├── Modal.tsx        # Modal dialog component
│   │   ├── Skeleton.tsx     # Loading skeleton component
│   │   └── Toast.tsx        # Toast notification component
│   ├── gems/
│   │   ├── GemCatalog.tsx   # Gem catalog with tabs
│   │   ├── GemCard.tsx      # Gem display card (catalog/equipped)
│   │   ├── GemDetail.tsx    # Gem detail modal/panel
│   │   └── GemSelector.tsx  # Quality/rank selectors
│   ├── optimization/
│   │   ├── OptimizeButton.tsx     # Optimization trigger
│   │   ├── ResultsPanel.tsx       # Results container
│   │   ├── RecommendationCard.tsx # Single recommendation
│   │   └── ResourceInput.tsx      # Resource input fields
│   └── layout/
│       ├── Header.tsx       # App header
│       ├── Footer.tsx       # App footer
│       └── Navigation.tsx   # Main navigation
├── lib/
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema definitions
│   │   └── queries.ts       # Database queries
│   ├── session/
│   │   └── anonymous.ts     # Anonymous ID management
│   ├── optimization/
│   │   ├── engine.ts        # Optimization algorithm (exists)
│   │   └── types.ts         # Type definitions (exists)
│   ├── storage/
│   │   └── localStorage.ts  # Client-side persistence
│   └── utils/
│       ├── formatting.ts    # Number formatting utilities
│       └── validation.ts    # Input validation helpers
├── types/
│   ├── gem.ts               # Gem-related types
│   ├── optimization.ts      # Optimization types
│   └── build.ts             # Build management types
└── data/
    └── gems.json            # Static gem database (bundled)
```

**Structure Decision**: Web application structure using Next.js App Router. Components organized by domain (ui, gems, optimization, layout). Static gem data bundled at build time for fastest load performance.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |

## Phase 0: Research Questions

The following items need research to resolve any unknowns:

1. **Gem Icon Assets**: Where to source representative gem icons from community? What licensing considerations apply? ✅ RESOLVED
2. **Resonance Calculation**: Confirm exact resonance values per gem type/quality/rank from game data ✅ RESOLVED
3. **Tier Rankings Source**: Where to source PVP/PVE tier rankings (diablo.tv, community resources)? ✅ RESOLVED
4. **Mobile Touch Patterns**: Best practices for dropdown selects on mobile in React 19 ✅ RESOLVED
5. **localStorage Schema**: Optimal structure for build persistence with versioning support ✅ RESOLVED
6. **Error Handling Types**: Define specific error response structure for typed error handling ✅ RESOLVED
7. **Anonymous Session Strategy** (2026-02-17): Device fingerprinting vs registration form vs localStorage UUID ✅ RESOLVED

### Research Summary (T-04)

**Anonymous Session Strategy**: After evaluating three options, chose **localStorage UUID v4 with optional email opt-in**:

| Option                    | Pros                           | Cons                            | Decision    |
| ------------------------- | ------------------------------ | ------------------------------- | ----------- |
| Device Fingerprinting     | Zero friction                  | 40-60% stability, GDPR concerns | ❌ Rejected |
| Registration Form         | Stable ID, recovery            | 20-30% abandonment              | ❌ Rejected |
| localStorage UUID + Email | Zero friction, recovery option | Cross-device needs email        | ✅ Chosen   |

**Implementation**: UUID v4 stored in localStorage, server database stores session state keyed by anonymous ID, optional email for notifications/recovery.

## Phase 1: Design Artifacts

### Data Model (data-model.md)

Will define:

- AnonymousSession entity (server-side, keyed by localStorage UUID)
- EquippedGem entity with validation rules
- ResourceInventory structure
- OptimizationResult schema
- SavedBuild structure (server-side, linked to anonymous session)
- Gem database schema (static JSON structure)

### API Contracts (contracts/)

Will define:

- `/api/optimize` endpoint schema (request/response)
- `/api/session` endpoint schema (create/get/update session)
- Error type definitions
- localStorage schema (simplified: only anonymous ID)

### Quickstart Guide (quickstart.md)

Will provide:

- Component implementation order
- Integration steps
- Testing checklist

## Post-Design Constitution Re-Check

_Re-evaluated after Phase 1 design artifacts complete._

### User-First Experience

| Requirement             | Status | Design Artifact                                                 |
| ----------------------- | ------ | --------------------------------------------------------------- |
| Fast Results (<5s)      | Pass   | Server-side `/api/optimize` route defined in contracts          |
| Clear Output            | Pass   | `UpgradeRecommendation` schema includes powerGain, reasoning    |
| Mobile-First            | Pass   | Native `<select>` elements, 44x44px touch targets in quickstart |
| Progressive Enhancement | Pass   | Server-rendered catalog; no-JS fallback documented in plan      |

### Data Integrity

| Requirement            | Status   | Design Artifact                             |
| ---------------------- | -------- | ------------------------------------------- |
| Single Source of Truth | Pass     | `src/data/gems.json` defined in quickstart  |
| Versioned Data         | Pass     | Schema includes version, lastUpdated fields |
| External Validation    | Deferred | DI days integration out of scope            |
| User Corrections       | Deferred | Future feature                              |

### Security & Privacy

| Requirement               | Status   | Design Artifact                                           |
| ------------------------- | -------- | --------------------------------------------------------- |
| OAuth-Only Authentication | Deferred | Battle.net auth deferred to P4                            |
| Minimal Data Collection   | Pass     | Only anonymous ID, gemId, quality, rank, resources stored |
| Anonymous Sessions        | Pass     | localStorage UUID v4 defined in data-model.md             |
| Character Verification    | Deferred | Out of scope                                              |
| No Sensitive Game Data    | Pass     | No credentials or account data stored                     |

### Transparent Methodology

| Requirement           | Status | Design Artifact                                      |
| --------------------- | ------ | ---------------------------------------------------- |
| Documented Algorithms | Pass   | Code comments and reasoning field in recommendations |
| Power Gain Visibility | Pass   | `powerGain` field in `UpgradeRecommendation`         |
| Resource Breakdown    | Pass   | `resourceCost` field per recommendation              |
| Alternative Options   | Pass   | `alternatives` array in recommendation schema        |

### Tiered Value

| Requirement     | Status   | Design Artifact                            |
| --------------- | -------- | ------------------------------------------ |
| Free Tier Value | Pass     | 5 builds max, basic optimization supported |
| Paid Tier 1     | Deferred | Future feature                             |
| Paid Tier 2     | Deferred | Future feature                             |

**Final Gate Status**: PASS - All critical constitution requirements met within scope. No violations requiring justification.

---

## Planning Complete

This plan is ready for task generation via `/speckit.tasks` command.

---

## Analysis Remediation Changelog

| Date       | ID   | Severity | Issue                                                                          | File(s) Modified | Change                                                         |
| ---------- | ---- | -------- | ------------------------------------------------------------------------------ | ---------------- | -------------------------------------------------------------- |
| 2026-02-15 | F-01 | CRITICAL | T052 referenced "exponential backoff" contradicting spec's "single retry only" | tasks.md         | Changed T052 description to "single retry with fixed 1s delay" |
| 2026-02-15 | F-02 | CRITICAL | Deferred tasks T054/T055/T064 had numbering conflicts with Phase 6             | tasks.md         | Added disambiguation note to deferred section                  |
| 2026-02-15 | E-01 | HIGH     | FR-034 mobile tooltip alternative had no task coverage                         | tasks.md         | Added T069a for mobile tap-to-reveal tooltips                  |
| 2026-02-15 | E-02 | HIGH     | Network loss during optimization edge case uncovered                           | tasks.md         | Added T053a for offline detection and retry                    |
| 2026-02-15 | E-03 | HIGH     | Deprecated gems in saved builds edge case uncovered                            | tasks.md         | Added T063a for deprecated gem detection                       |

---

## Remediation Changelog

**Date**: 2026-02-15
**Type**: Alignment Audit Remediation

### Issues Resolved: 8

| ID   | Severity | Issue                                         | Resolution                                         |
| ---- | -------- | --------------------------------------------- | -------------------------------------------------- |
| C-01 | CRITICAL | Folder naming convention violation            | Migrated to `specs/feature/PROJ-002-optimizer-ui/` |
| C-02 | CRITICAL | Branch reference incorrect                    | Updated to `feature/PROJ-002-optimizer-ui`         |
| C-03 | CRITICAL | Contradictory exponential backoff requirement | Aligned with spec.md clarification                 |
| H-01 | HIGH     | Task count mismatch in context.md             | Updated to 93 tasks                                |
| H-02 | HIGH     | FR count error in requirements.md             | Updated to 53 total FRs                            |
| H-03 | HIGH     | Internal inconsistency in context.md          | Standardized to 93 tasks                           |
| M-01 | MEDIUM   | Version inconsistency                         | Noted for future alignment                         |
| M-02 | MEDIUM   | Status field outdated                         | Updated to "Ready for Implementation"              |

### Files Modified

- `specs/feature/PROJ-002-optimizer-ui/spec.md` - Branch reference, status
- `specs/feature/PROJ-002-optimizer-ui/checklists/requirements.md` - Exponential backoff, FR count
- `.kilocode/rules/memory-bank/context.md` - Task counts, path references
- Folder migrated from `specs/002-optimizer-ui/` to `specs/feature/PROJ-002-optimizer-ui/`

### Migration Actions

- Created: `specs/feature/PROJ-002-optimizer-ui/`
- Moved: All artifacts from `specs/002-optimizer-ui/`
- Deleted: `specs/002-optimizer-ui/`
- Updated: All cross-references in documentation
