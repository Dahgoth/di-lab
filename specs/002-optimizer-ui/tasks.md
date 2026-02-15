# Implementation Tasks: Optimizer UI

**Branch**: `feature/PROJ-002-optimizer-ui` | **Date**: 2026-02-14 | **Spec**: [spec.md](./spec.md)

## Overview

This document contains all implementation tasks for the Optimizer UI feature, organized by phase and user story priority. Tasks are designed for sequential execution within phases, with parallelizable tasks marked with `[P]`.

**Total Tasks**: 93
**MVP Tasks**: Phases 1-5 (60 tasks)
**Post-MVP Tasks**: Phases 6-10 (33 tasks)

---

## Phase 1: Setup

> **Checkpoint**: Review phase output before proceeding to next phase

Project initialization and infrastructure setup.

- [ ] T001 Create directory structure: `src/types/`, `src/components/ui/`, `src/components/gems/`, `src/components/optimization/`, `src/components/layout/`, `src/lib/utils/`, `src/lib/storage/`, `src/lib/optimization/`, `src/data/`
- [ ] T002 Update `src/app/globals.css` with Tailwind base styles and custom properties for gem colors

---

## Phase 2: Foundational

> **Checkpoint**: Review phase output before proceeding to next phase

Core types, utilities, and static data. No user story labels - these are infrastructure tasks.

- [ ] T003 Create `src/types/gem.ts` with LegendaryGem, EquippedGem, GemEffect, TierRanking, EffectCategory interfaces
- [ ] T004 [P] Create `src/types/optimization.ts` with OptimizationResult, UpgradeRecommendation, OptimizationError interfaces
- [ ] T005 [P] Create `src/types/build.ts` with SavedBuild, SessionState, ResourceInventory interfaces
- [ ] T006 Create `src/data/gems.json` with static gem database parsed from `docs/legendary-gems.csv`
- [ ] T007 [P] Create `src/lib/utils/formatting.ts` with formatNumber, formatPlatinum, formatDate utilities
- [ ] T008 [P] Create `src/lib/utils/validation.ts` with Zod schemas for EquippedGem, ResourceInventory, SavedBuild
- [ ] T009 Create `src/lib/storage/localStorage.ts` with versioned storage helpers (getStorage, setStorage, migrateStorage)

---

## Phase 3: US1 - Gem Inventory Entry (P1)

> **Checkpoint**: Review phase output before proceeding to next phase

User Story 1: As a player, I want to select and configure my legendary gems so that the optimizer can analyze my current build.

### UI Components

- [ ] T010 [US1] Create `src/components/ui/Button.tsx` with variants (primary, secondary, ghost) and sizes (sm, md, lg)
- [ ] T011 [P] [US1] Create `src/components/ui/Card.tsx` with header, body, footer sections
- [ ] T012 [P] [US1] Create `src/components/ui/Input.tsx` with label, error state, and validation
- [ ] T013 [P] [US1] Create `src/components/ui/Select.tsx` with options, placeholder, and change handler
- [ ] T014 [P] [US1] Create `src/components/ui/Modal.tsx` with open/close state and backdrop click handling

### Gem Components

- [ ] T015 [US1] Create `src/components/gems/GemCatalog.tsx` with star-rating tabs (1-star, 2-star, 5-star), 5-star default
- [ ] T016 [US1] Create `src/components/gems/GemCard.tsx` for catalog view with gem icon, name, quick-add button
- [ ] T017 [US1] Create `src/components/gems/GemSelector.tsx` with quality (1-5) and rank (1-10) dropdown selects
- [ ] T018 [US1] Create `src/components/gems/GemDetail.tsx` modal showing full gem information

### Slot Management

- [ ] T019 [US1] Add slot management logic in `src/lib/utils/slots.ts` with SLOT_CONFIG constants and validation
- [ ] T020 [US1] Implement base slot duplicate prevention (positions 1-8: no duplicate gemId)
- [ ] T021 [US1] Implement wing slot duplicate allowance (positions 9-24: duplicates allowed)
- [ ] T022 [US1] Create resonance calculation in `src/lib/utils/resonance.ts` with calculateTotalResonance function
- [ ] T023 [US1] Create wing slot unlocking logic with threshold checks (6000=4, 7000=8, 8000=12, 8500+=16)

### Page Integration

- [ ] T024 [US1] Create `src/app/optimize/page.tsx` with gem selection grid and equipped gems panel
- [ ] T025 [US1] Add equipped gems display with quality/rank selectors and remove button
- [ ] T026 [US1] Add summary stats display showing total resonance and unlocked wing slots
- [ ] T027 [US1] Implement gem add/remove flow with slot assignment

---

## Phase 4: US2 - Resource Specification (P1)

> **Checkpoint**: Review phase output before proceeding to next phase

User Story 2: As a player, I want to input my available upgrade resources so that the optimizer can provide realistic recommendations.

- [ ] T028 [US2] Create `src/components/optimization/ResourceInput.tsx` with platinum and Telluric Pearls input fields
- [ ] T029 [US2] Add debounced validation (300-500ms delay) for resource inputs
- [ ] T030 [US2] Add number formatting display (commas for thousands, M suffix for millions)
- [ ] T031 [US2] Create resource summary panel showing all configured values
- [ ] T032 [US2] Add clear/reset functionality for resource values
- [ ] T033 [US2] Integrate resource state with session persistence

---

## Phase 5: US3 - Optimization Execution & Results (P1)

> **Checkpoint**: Review phase output before proceeding to next phase

User Story 3: As a player, I want to trigger optimization and view prioritized recommendations so that I can make informed decisions.

### Optimization Engine

- [ ] T034 [US3] Create `src/lib/optimization/types.ts` with engine-specific type definitions
- [ ] T035 [US3] Create `src/lib/optimization/engine.ts` with greedy algorithm implementation
- [ ] T036 [US3] Add power gain calculation per upgrade path
- [ ] T037 [US3] Add resource cost calculation per upgrade path

### API Endpoint

- [ ] T038 [US3] Create `src/app/api/optimize/route.ts` POST endpoint
- [ ] T039 [US3] Add request validation with Zod schemas
- [ ] T040 [US3] Add error handling with typed error responses
- [ ] T041 [US3] Add 30-second timeout with AbortController

### UI Components

- [ ] T042 [US3] Create `src/components/optimization/OptimizeButton.tsx` with loading and disabled states
- [ ] T043 [US3] Create `src/components/ui/Skeleton.tsx` for loading placeholder shapes
- [ ] T044 [US3] Create `src/components/optimization/ResultsPanel.tsx` for recommendations display
- [ ] T045 [US3] Create `src/components/optimization/RecommendationCard.tsx` with expandable details
- [ ] T046 [US3] Add priority badge and power gain display to recommendation cards
- [ ] T047 [US3] Add resource cost breakdown to recommendation details
- [ ] T048 [US3] Add alternatives display in expanded recommendation view

### Error Handling

- [ ] T049 [US3] Create error display component for validation errors
- [ ] T050 [US3] Create error display for insufficient-resources with actionable guidance
- [ ] T051 [US3] Create error display for timeout with retry option
- [ ] T052 [US3] Implement single retry with fixed 1s delay for transient failures
- [ ] T053 [US3] Add loading state with disabled interaction during optimization
- [ ] T053a [US3] Handle network connection loss during optimization with offline detection and retry-when-online option

---

## Phase 6: US4 - Build Management (P2)

> **Checkpoint**: Review phase output before proceeding to next phase

User Story 4: As a returning player, I want to save my current build configuration so that I can quickly reload it in future sessions.

### Client-Side Persistence (MVP)

- [ ] T056 [US4] Implement build save to localStorage with name validation (unique names enforced)
- [ ] T057 [US4] Implement build load from localStorage with state restoration
- [ ] T058 [US4] Implement build delete from localStorage with confirmation dialog
- [ ] T059 [US4] Add 5-build limit for free tier users

### UI Components

- [ ] T060 [US4] Create `src/app/builds/page.tsx` for saved builds list
- [ ] T061 [US4] Create save build modal with name input and optional notes
- [ ] T062 [US4] Add load build functionality with state restoration
- [ ] T063 [US4] Add delete build functionality with confirmation
- [ ] T063a [US4] Detect and display deprecated gems in saved builds with visual indicator and removal option

---

## Phase 7: US5 - Gem Information Reference (P2)

> **Checkpoint**: Review phase output before proceeding to next phase

User Story 5: As a player unfamiliar with certain gems, I want to view detailed gem information so that I can make informed selection decisions.

- [ ] T065 [US5] Enhance `src/components/gems/GemDetail.tsx` with upgrade cost display per rank
- [ ] T066 [US5] Add tier ranking display (PVP and PVE: S/A/B/C/D) to gem detail
- [ ] T067 [US5] Add resonance thresholds display to gem detail
- [ ] T068 [US5] Add categorized effects display (OFF, DEF, ALL, DOT, LOC, TLOC)
- [ ] T069 [US5] Create `src/components/ui/Tooltip.tsx` for quick gem summaries on hover
- [ ] T069a [US5] Implement mobile tooltip alternative with tap-to-reveal info buttons for touch devices

---

## Phase 8: US7 - Responsive Mobile Experience (P2)

> **Checkpoint**: Review phase output before proceeding to next phase

User Story 7: As a player using my phone during gameplay, I want the interface to work smoothly on mobile so that I can use DI-Lab while playing Diablo Immortal.

- [ ] T070 [US7] Add responsive grid layouts to `src/app/optimize/page.tsx` using Tailwind breakpoints
- [ ] T071 [US7] Ensure 44x44px minimum touch targets for all interactive elements
- [ ] T072 [US7] Use native `<select>` elements for dropdowns on mobile (already done in T013)
- [ ] T073 [US7] Optimize scroll performance with CSS `will-change` and virtualization if needed
- [ ] T074 [US7] Test and fix horizontal scroll prevention on narrow viewports

---

## Phase 9: US6 - Optimization Constraints & Goals (P3)

> **Checkpoint**: Review phase output before proceeding to next phase

User Story 6: As an advanced player, I want to set optimization preferences so that recommendations align with my specific goals.

- [ ] T075 [US6] Add PVP/PVE mode toggle to optimization controls with PVE default and display active mode in UI
- [ ] T076 [US6] Add resource budget constraints input (optional max platinum/pearls)
- [ ] T077 [US6] Update optimization engine to respect mode selection in tier rankings
- [ ] T078 [US6] Update optimization engine to respect resource budget constraints

---

## Phase 10: Polish & Cross-cutting

> **Checkpoint**: Review phase output before proceeding to next phase

Final polish, accessibility, and cross-cutting concerns.

- [ ] T079 Add keyboard navigation for gem catalog (arrow keys, enter to select)
- [ ] T080 Add ARIA labels and roles for screen reader support
- [ ] T081 Implement session auto-save to localStorage on every change
- [ ] T082 Add beforeunload confirmation dialog for unsaved changes
- [ ] T083 Create `src/components/ui/Toast.tsx` for notification feedback
- [ ] T084 Add toast notification for multi-tab conflict warning (auto-dismiss 5s, pause on hover)
- [ ] T085 Add loading skeleton animations with pulse effect
- [ ] T086 Implement optimistic UI updates for gem operations
- [ ] T087 Add focus management for modals (focus trap, escape to close)
- [ ] T088 Test and verify WCAG 2.1 AA color contrast ratios (4.5:1 text, 3:1 large text)
- [ ] T089 Final integration testing and bug fixes
- [ ] **T090**: Manual usability validation for SC-003 (90% gem addition success) and SC-008 (95% result comprehension)
- [ ] **T091**: Run Lighthouse CI and verify score > 90
- [ ] **T092**: Verify FCP < 1.5s and TTI < 3s with performance profiling tools
- [ ] **T093**: Verify saved builds load in under 2 seconds (SC-006 validation)

---

## Phase 11: Deferred Features (Future Enhancement)

> **Note**: These tasks require authentication infrastructure and are deferred pending Battle.net OAuth implementation.

> **Note:** T054, T055, and T064 are deferred from their original phases and listed here for tracking. They retain their original IDs to maintain traceability to spec requirements.

- [ ] **T054**: Create src/lib/db/schema.ts with builds table (deferred - requires auth)
- [ ] **T055**: Create src/lib/db/queries.ts for build CRUD (deferred - requires auth)
- [ ] **T064**: Add auth requirement notice for cloud storage (deferred - requires auth)

---

## Dependencies

### Phase Dependency Graph

```
Phase 1 (Setup)
    │
    ▼
Phase 2 (Foundational)
    │
    ├──────────────────┬──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
Phase 3 (US1)    Phase 4 (US2)    Phase 5 (US3)
    │                  │                  │
    └──────────────────┴──────────────────┘
                       │
                       ▼
            ┌──────────┼──────────┐
            │          │          │
            ▼          ▼          ▼
    Phase 6 (US4) Phase 7 (US5) Phase 8 (US7)
            │          │          │
            └──────────┼──────────┘
                       │
                       ▼
              Phase 9 (US6)
                       │
                       ▼
             Phase 10 (Polish)
```

### Critical Path

1. **Phase 1 → Phase 2**: Directory structure required before creating files
2. **Phase 2 → Phases 3-5**: Types and data required before UI components
3. **Phase 3 → Phase 5**: Gem selection required for optimization input
4. **Phase 4 → Phase 5**: Resources required for optimization constraints
5. **Phase 5 → Phases 6-8**: Core optimization flow complete before enhancements
6. **Phases 6-8 → Phase 9**: P2 features complete before P3 advanced features
7. **All Phases → Phase 10**: Polish applies to all completed features

---

## Parallel Execution

Tasks marked with `[P]` can be executed in parallel within their phase.

### Phase 2 Parallel Groups

```
Group 1: T003 (gem.ts) - blocks other type files
Group 2: T004, T005 (optimization.ts, build.ts) - can run in parallel
Group 3: T006 (gems.json) - independent of types
Group 4: T007, T008 (formatting.ts, validation.ts) - can run in parallel
Group 5: T009 (localStorage.ts) - depends on T005, T008
```

### Phase 3 Parallel Groups

```
Group 1: T010-T014 (UI components) - can all run in parallel
Group 2: T015-T018 (Gem components) - sequential, depend on Group 1
Group 3: T019-T023 (Slot management) - can run in parallel with Group 2
Group 4: T024-T027 (Page integration) - depends on Groups 2, 3
```

### Phase 5 Parallel Groups

```
Group 1: T034-T037 (Optimization engine) - sequential
Group 2: T038-T041 (API endpoint) - can run in parallel with Group 1
Group 3: T042-T048 (UI components) - depend on Group 2
Group 4: T049-T053 (Error handling) - depends on Group 2
```

---

## MVP Scope

**MVP = Phases 1-5 (US1 + US2 + US3)**

The Minimum Viable Product delivers the core optimization flow:

1. **Gem Selection** (US1): Users can select, configure, and manage equipped gems
2. **Resource Input** (US2): Users can specify available upgrade resources
3. **Optimization** (US3): Users can trigger optimization and view recommendations

### MVP Task Count

- Phase 1: 2 tasks
- Phase 2: 7 tasks
- Phase 3: 18 tasks
- Phase 4: 6 tasks
- Phase 5: 20 tasks
- **Total MVP Tasks**: 53 tasks

### MVP Success Criteria

- [ ] Users can complete full optimization flow in under 3 minutes
- [ ] Optimization results display within 5 seconds
- [ ] 90% of users successfully add at least one gem on first attempt
- [ ] Mobile users can complete optimization without horizontal scrolling
- [ ] All interactive elements have 44x44px touch targets on mobile

---

## Task Execution Guidelines

### Before Starting

1. Ensure Phase 1 directory structure is complete
2. Run `bun install` to verify dependencies
3. Check that all prerequisite tasks are marked complete

### During Implementation

1. Follow the task order within each phase
2. Run `bun typecheck` after each task
3. Run `bun lint` before committing
4. Update task checkboxes as completed

### After Completion

1. Run full test suite (when tests are configured)
2. Verify accessibility with keyboard navigation
3. Test on mobile viewport (320px minimum)
4. Commit with conventional commit format: `feat(optimizer): description`

---

## Notes

- **Authentication**: Battle.net OAuth deferred to a later feature (P4)
- **Database**: Drizzle + SQLite setup deferred; localStorage used for MVP
- **Tests**: No test framework configured yet; add when needed
- **Icons**: Placeholder graphics acceptable; representative icons can be added later

---

**Version**: 1.1.0 | **Last Updated**: 2026-02-15
