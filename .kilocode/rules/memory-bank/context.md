# Active Context: DI-Lab (Diablo Immortal Legendary Gems Optimizer)

## Current State

**Project Status**: ✅ MVP Complete - Optimization Flow Implemented

The MVP (Phases 1-5) has been fully implemented with all core user stories:

- **User Story 1 (P1)**: Gem Inventory Entry - Select, configure, and manage equipped gems
- **User Story 2 (P1)**: Resource Specification - Input and validate upgrade resources
- **User Story 3 (P1)**: Optimization Execution & Results - Run optimization and view recommendations

### Implemented Components

| Phase      | Description                                     | Status      |
| ---------- | ----------------------------------------------- | ----------- |
| Phase 1    | Setup - Directory structure, globals.css        | ✅ Complete |
| Phase 2    | Foundational - Types, data, utilities, session  | ✅ Complete |
| Phase 3    | User Story 1 - Gem Inventory Entry              | ✅ Complete |
| Phase 4    | User Story 2 - Resource Specification           | ✅ Complete |
| Phase 5    | User Story 3 - Optimization Execution & Results | ✅ Complete |
| Phase 6-10 | P2/P3 Features (Build Management, Mobile, etc.) | ⏸️ Deferred |

## Recently Completed (2026-02-18)

- [x] **API Endpoint** - `/api/optimize` with validation, timeout, error handling
- [x] **UI Components** - Skeleton, OptimizeButton, Toast notifications
- [x] **Optimization UI** - Modal, ResultsPanel, RecommendationCard
- [x] **Error Handling** - Validation errors, timeout, retry logic, offline handling
- [x] **Accessibility** - Screen reader announcer (aria-live regions)
- [x] **Awakening Management** - AwakenedSlotsPanel, resonance bonus calculation
- [x] **Acquisition Paths** - Three-path overview, run calculator, crafting rates

## Current Structure

| File/Directory                  | Purpose                           | Status      |
| ------------------------------- | --------------------------------- | ----------- |
| `src/app/api/optimize/route.ts` | Optimization API endpoint         | ✅ Complete |
| `src/app/api/session/route.ts`  | Session persistence API           | ✅ Complete |
| `src/components/gems/`          | Gem selection components          | ✅ Complete |
| `src/components/optimization/`  | Optimization UI components        | ✅ Complete |
| `src/components/ui/`            | Base UI components                | ✅ Complete |
| `src/lib/hooks/useOptimize.ts`  | Optimization hook with retry      | ✅ Complete |
| `src/lib/utils/acquisition.ts`  | Crafting rates, run calculator    | ✅ Complete |
| `src/lib/utils/resonance.ts`    | Resonance + awakened calculations | ✅ Complete |
| `src/lib/optimization/`         | Optimization engine               | ✅ Complete |
| `src/types/`                    | TypeScript type definitions       | ✅ Complete |
| `src/data/gems.json`            | Static gem database               | ✅ Complete |

## Next Steps

1. **P2 Features** - Build Management (User Story 4)
2. **P2 Features** - Gem Information Reference (User Story 5)
3. **P2 Features** - Responsive Mobile Experience (User Story 7)
4. **P3 Features** - Optimization Constraints & Goals (User Story 6)
5. **Polish** - Accessibility, performance validation, integration testing

## Architecture Decisions

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **Auth**: Anonymous sessions (localStorage UUID) + optional email opt-in
- **Database**: Drizzle ORM + better-sqlite3 (SQLite)
- **UI**: Tailwind CSS 4 + lucide-react icons
- **Validation**: Zod schemas
- **Testing**: Vitest (15 tests passing)

### Key Patterns

- **Client Components**: Interactive UI with `"use client"` directive
- **Server Components**: Data fetching, static content
- **API Routes**: REST endpoints for optimization and session management
- **Type Safety**: Strict TypeScript with isolated modules

### Slot System

- **Base Slots**: 8 slots (positions 1-8), no duplicate gems
- **Wing Slots**: Up to 16 slots (positions 9-24), duplicates allowed
- **Unlock Thresholds**: 6000=4, 7000=8, 8000=12, 8500+=16 wing slots
- **Awakened Slots**: Up to 12 slots with 10% resonance bonus

## External APIs

| API                      | Purpose                | Status    |
| ------------------------ | ---------------------- | --------- |
| Battle.net OAuth         | User authentication    | 🔮 Future |
| diablo.tv                | DI days/events data    | 🔮 Future |
| diabloimmortalredeem.com | Character verification | 🔮 Future |

## Session History

| Date       | Changes                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| 2026-02-18 | Completed MVP implementation - All Phase 1-5 tasks done                                                                 |
| 2026-02-18 | Implemented optimization UI components - Modal, ResultsPanel, RecommendationCard                                        |
| 2026-02-18 | Added error handling - Validation, timeout, retry logic, offline handling                                               |
| 2026-02-18 | Created accessibility components - Screen reader announcer                                                              |
| 2026-02-18 | Implemented awakening management - AwakenedSlotsPanel, resonance bonus                                                  |
| 2026-02-18 | Added acquisition paths - Three-path overview, run calculator, crafting rates                                           |
| 2026-02-17 | Cross-checked and updated tasks.md: Added rate-limited (429) to FR-021 error types, moved FR-052-054 tasks to MVP scope |
| 2026-02-17 | Resolved 12 analysis findings via clarification session                                                                 |
| 2026-02-15 | Implemented optimization engine with weighted greedy algorithm                                                          |
| 2026-02-14 | Completed workflow foundation implementation - all 66 tasks done                                                        |

## Optimizer UI (002) Summary

| Component         | Status      | Description                                   |
| ----------------- | ----------- | --------------------------------------------- |
| Setup             | ✅ Complete | Directory structure, globals.css              |
| Foundational      | ✅ Complete | Types, data, utilities, session               |
| User Story 1 (P1) | ✅ Complete | Gem Inventory Entry                           |
| User Story 2 (P1) | ✅ Complete | Resource Specification                        |
| User Story 3 (P1) | ✅ Complete | Optimization Execution & Results              |
| User Story 4 (P2) | ⏸️ Deferred | Build Management                              |
| User Story 5 (P2) | ⏸️ Deferred | Gem Information Reference                     |
| User Story 6 (P3) | ⏸️ Deferred | Optimization Constraints & Goals              |
| User Story 7 (P2) | ⏸️ Deferred | Responsive Mobile Experience                  |
| Polish            | ⏸️ Deferred | Accessibility, performance, integration tests |

## Quick Reference

- **Package Manager**: `bun`
- **Commit Workflow**: `bun typecheck && bun lint && git add -A && git commit -m "type: description" && git push`
- **Pre-commit Hooks**: lint, typecheck
- **Commit Format**: `type(scope): description` (lowercase, max 72 chars)
- **Spec Directory**: `specs/`
- **Constitution Version**: 2.0.0
