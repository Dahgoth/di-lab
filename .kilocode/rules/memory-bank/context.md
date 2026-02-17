# Active Context: DI-Lab (Diablo Immortal Legendary Gems Optimizer)

## Current State

**Project Status**: 🔄 Optimization Engine Implemented - Core Algorithm Complete

The optimization engine has been implemented with the following components:

- **Weighted Greedy Algorithm** with O(n log n) complexity
- **Power Formula**: `(Resonance × 1.0 + CR × 2.0) × tierMultiplier × thresholdBonus × diminishingFactor`
- **Tier Weights**: S=1.5, A=1.3, B=1.1, C=0.9, D=0.7
- **15 unit tests passing** for the optimization engine

The workflow foundation has been fully implemented with all 66 tasks complete:

- Conventional commit enforcement via commitlint
- Pre-commit hooks for code quality (lint + typecheck)
- Automated changelog via release-please-action
- Complete project documentation (README, LICENSE, CHANGELOG)

## Recently Completed

- [x] **Optimization Engine** - Weighted greedy algorithm with 15 passing tests
- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Fixed blank home page - added welcome content
- [x] Added dependencies: next-auth, drizzle-orm, better-sqlite3, lucide-react, zod
- [x] **Workflow Foundation Spec** - 001-workflow-foundation specification complete
- [x] **Issue Templates** - bug_report.md, feature_request.md, task.md
- [x] **PR Template** - pull_request_template.md with spec reference checklist
- [x] **Agent Commit Instructions** - .kilocode/rules/commit.md with failure scenarios
- [x] **Specs README** - Documentation for spec-driven workflow
- [x] **Spec-Kit Alignment** - Constitution updated with SDD principles
- [x] **Path Migration** - Specs moved to `specs/` at project root
- [x] **Workflow Foundation Implementation** - All 66 tasks complete (100%)
- [x] **Husky Hooks** - pre-commit and commit-msg configured with bun
- [x] **release-please-action** - Automated changelog and releases
- [x] **Project Documentation** - README, LICENSE, CHANGELOG complete

## Current Structure

| File/Directory                                | Purpose                          | Status                |
| --------------------------------------------- | -------------------------------- | --------------------- |
| `.specify/memory/constitution.md`             | Foundational principles (v2.0.0) | ✅ Updated            |
| `specs/feature/PROJ-001-workflow-foundation/` | Workflow foundation spec         | ✅ Complete           |
| `specs/README.md`                             | SDD workflow documentation       | ✅ Complete           |
| `.github/ISSUE_TEMPLATE/`                     | Issue templates                  | ✅ Complete           |
| `.github/pull_request_template.md`            | PR template                      | ✅ Complete           |
| `.github/workflows/release-please.yml`        | Release automation               | ✅ Complete           |
| `.kilocode/rules/commit.md`                   | Agent commit instructions        | ✅ Complete           |
| `.husky/pre-commit`                           | Lint + typecheck hook            | ✅ Complete           |
| `.husky/commit-msg`                           | Commitlint hook                  | ✅ Complete           |
| `commitlint.config.js`                        | Commit message rules             | ✅ Complete           |
| `.lintstagedrc.json`                          | Lint-staged config               | ✅ Complete           |
| `README.md`                                   | Project documentation            | ✅ Complete           |
| `LICENSE`                                     | AGPL-3.0-or-later                | ✅ Complete           |
| `CHANGELOG.md`                                | Change history                   | ✅ Complete           |
| `src/lib/optimization/`                       | Optimization engine              | ✅ Implemented        |
| `src/app/`                                    | Next.js application              | 🔄 Ready for features |

## Current Focus

**Workflow Foundation Complete** - Ready for feature implementation:

| Component            | Status        | Purpose                            |
| -------------------- | ------------- | ---------------------------------- |
| Constitution         | ✅ v2.0.0     | SDD principles + human-in-the-loop |
| Conventional Commits | ✅ Enforced   | commitlint configuration           |
| Changelog Management | ✅ Automated  | release-please-action              |
| Pre-commit Hooks     | ✅ Active     | lint + typecheck                   |
| Commit-msg Hook      | ✅ Active     | commitlint validation              |
| Issue Templates      | ✅ Created    | Bug reports, features, tasks       |
| PR Template          | ✅ Created    | Spec reference checklist           |
| Agent Instructions   | ✅ Created    | Commit failure recovery            |
| Spec-Kit Commands    | ✅ Documented | clarify, analyze, checklist        |

## Next Steps

1. **Proceed with Feature 002** - Gem Optimizer implementation
2. **Start with Phase 1: Setup** - Create directory structure and types
3. **Complete Phase 2: Foundational** - Database schema and optimization engine

## Architecture Decisions

### GitHub-Centric Spec Hierarchy

- Parent Issues = PRD/Spec | Child Issues = Tasks
- Bidirectional sync: task frontmatter stores issue URL, issue closure updates task checkbox

### Spec Cycle Directory Structure

```
.specify/
├── memory/
│   └── constitution.md        # Foundational principles
├── scripts/
│   └── bash/                  # Automation scripts
└── templates/                 # Document templates

specs/
├── feature/
│   ├── PROJ-001-workflow-foundation/
│   │   └── spec.md              # Master specification
│   └── PROJ-002-optimizer-ui/
│       └── ...
└── README.md
```

### Branch Naming Convention

Configured in `.specify/config.yaml` with template-based naming:

```yaml
naming:
  branch_format: "{type}/{ticket}-{seq}-{kebab}"
  folder_format: "specs/{branch}"
```

**Tokens:** `{type}`, `{ticket}`, `{seq}`, `{kebab}`, `{date}`, `{branch}`

**Examples:**
| Description | Branch | Folder |
|-------------|--------|--------|
| "Add user auth" | `feature/PROJ-001-user-auth` | `specs/feature/PROJ-001-user-auth/` |
| "Fix login bug" | `fix/PROJ-002-login-bug` | `specs/fix/PROJ-002-login-bug/` |

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **Auth**: Anonymous sessions (localStorage UUID) + optional email opt-in; Battle.net OAuth deferred
- **Database**: Drizzle ORM + better-sqlite3 (SQLite) for server-side session persistence
- **UI**: Tailwind CSS 4 + lucide-react icons
- **Validation**: Zod schemas

### Anonymous Session Strategy (2026-02-17)

After research, chose **localStorage UUID with optional email opt-in**:

| Option                    | Pros                                 | Cons                                | Decision    |
| ------------------------- | ------------------------------------ | ----------------------------------- | ----------- |
| Device Fingerprinting     | Zero friction                        | 40-60% stability, GDPR concerns     | ❌ Rejected |
| Registration Form         | Stable ID, recovery                  | 20-30% abandonment, high complexity | ❌ Rejected |
| localStorage UUID + Email | Zero friction start, recovery option | Cross-device needs email            | ✅ Chosen   |

**Implementation**:

- UUID v4 stored in localStorage for identification
- Server database stores session state keyed by anonymous ID
- Optional email for notifications and account recovery
- Fallback: server-side session cookie if localStorage unavailable

## External APIs

| API                      | Purpose                | Documentation               |
| ------------------------ | ---------------------- | --------------------------- |
| Battle.net OAuth         | User authentication    | https://develop.battle.net/ |
| diablo.tv                | DI days/events data    | TBD                         |
| diabloimmortalredeem.com | Character verification | Mock redemption API         |

## Session History

| Date       | Changes                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------ |
| 2026-02-17 | Researched anonymous session strategy - chose localStorage UUID over fingerprinting/registration |
| 2026-02-17 | Updated spec FR-029 and data-model for server-side session persistence                           |
| 2026-02-15 | Implemented optimization engine with weighted greedy algorithm                                   |
| 2026-02-15 | Remediated alignment issues and migrated spec folder to PROJ-002 format                          |
| 2026-02-15 | Refactored commitlint.config.js with comprehensive scopes and JSDoc                              |
| 2026-02-15 | Created tasks.md for 002-optimizer-ui with 93 implementation tasks                               |
| 2026-02-14 | Implemented template-based naming system with configurable formats                               |
| 2026-02-14 | Completed workflow foundation implementation - all 66 tasks done                                 |
| 2026-02-14 | Updated Husky hooks to use bun commands                                                          |
| 2026-02-14 | Added release-please workflow documentation to commit.md                                         |
| 2026-02-14 | Moved specs/ to project root, updated branch naming to feature/ prefix                           |
| 2026-02-14 | Updated constitution to v2.0.0 with SDD principles                                               |
| 2026-02-14 | Added enhanced quality commands to specs README                                                  |
| 2026-02-13 | Created workflow foundation specification (000-workflow-foundation)                              |
| 2026-02-13 | Created issue templates: bug_report.md, feature_request.md, task.md                              |
| 2026-02-13 | Created PR template with spec reference checklist                                                |
| 2026-02-13 | Created agent commit instructions with failure scenarios                                         |
| 2026-02-13 | Created specs/README.md with SDD workflow documentation                                          |
| 2026-02-13 | Created complete SDD planning artifacts for gem optimizer (001)                                  |
| 2026-02-13 | Spec Kit v0.1.0 installed and initialized for Kilo Code                                          |
| 2026-02-13 | Memory bank updated with DI-Lab project brief                                                    |
| Initial    | Template created with base Next.js setup                                                         |

## Spec-Kit Workflow Reference

| Phase        | Command                 | Purpose                           | Required    |
| ------------ | ----------------------- | --------------------------------- | ----------- |
| Constitution | `/speckit.constitution` | Establish foundational principles | ✅ Yes      |
| Specify      | `/speckit.specify`      | Create feature specification      | ✅ Yes      |
| Clarify      | `/speckit.clarify`      | Resolve underspecified areas      | ⚪ Optional |
| Plan         | `/speckit.plan`         | Create implementation plan        | ✅ Yes      |
| Checklist    | `/speckit.checklist`    | Verify requirements completeness  | ⚪ Optional |
| Tasks        | `/speckit.tasks`        | Generate actionable tasks         | ✅ Yes      |
| Analyze      | `/speckit.analyze`      | Cross-artifact consistency check  | ⚪ Optional |
| Implement    | `/speckit.implement`    | Execute implementation            | ✅ Yes      |

## Workflow Foundation (001) Summary

| Component       | File                                                 | Purpose                                    |
| --------------- | ---------------------------------------------------- | ------------------------------------------ |
| Spec            | `specs/feature/PROJ-001-workflow-foundation/spec.md` | 7 user stories, 30 functional requirements |
| Issue Templates | `.github/ISSUE_TEMPLATE/`                            | Bug, feature, task templates               |
| PR Template     | `.github/pull_request_template.md`                   | Spec reference checklist                   |
| Commit Rules    | `.kilocode/rules/commit.md`                          | Agent failure recovery                     |
| Spec README     | `specs/README.md`                                    | SDD workflow documentation                 |
| Constitution    | `.specify/memory/constitution.md`                    | SDD principles + human checkpoints         |

## Optimizer UI (002) Summary

| Artifact      | File                                                                     | Description                         |
| ------------- | ------------------------------------------------------------------------ | ----------------------------------- |
| Specification | `specs/feature/PROJ-002-optimizer-ui/spec.md`                            | 7 user stories (US1-US7), 47 FRs    |
| Plan          | `specs/feature/PROJ-002-optimizer-ui/plan.md`                            | 11 implementation phases            |
| Data Model    | `specs/feature/PROJ-002-optimizer-ui/data-model.md`                      | Entity definitions with Zod schemas |
| API Contract  | `specs/feature/PROJ-002-optimizer-ui/contracts/optimize-api.schema.json` | API schema                          |
| Tasks         | `specs/feature/PROJ-002-optimizer-ui/tasks.md`                           | 93 implementation tasks             |

**Analysis Status**: All 14 findings resolved (2 CRITICAL, 4 HIGH, 4 MEDIUM, 4 LOW)

## Quick Reference

- **Package Manager**: `bun`
- **Commit Workflow**: `bun typecheck && bun lint && git add -A && git commit -m "type: description" && git push`
- **Pre-commit Hooks**: lint, typecheck
- **Commit Format**: `type(scope): description` (lowercase, max 72 chars)
- **Spec Directory**: `specs/`
- **Constitution Version**: 2.0.0
