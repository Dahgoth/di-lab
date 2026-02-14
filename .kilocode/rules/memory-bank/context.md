# Active Context: DI-Lab (Diablo Immortal Legendary Gems Optimizer)

## Current State

**Project Status**: 🔧 Spec-Kit Aligned - Documentation Updated

The project has been migrated to the Spec-Kit folder structure aligned with GitHub Spec Kit. The constitution now incorporates SDD principles, the specs README includes enhanced quality commands, and the workflow foundation spec has correct paths.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Fixed blank home page - added welcome content
- [x] Added dependencies: next-auth, drizzle-orm, better-sqlite3, lucide-react, zod
- [x] **Workflow Foundation Spec** - 000-workflow-foundation specification complete
- [x] **Issue Templates** - bug_report.md, feature_request.md, task.md
- [x] **PR Template** - pull_request_template.md with spec reference checklist
- [x] **Agent Commit Instructions** - .kilocode/rules/commit.md with failure scenarios
- [x] **Specs README** - Documentation for spec-driven workflow
- [x] **Spec-Kit Alignment** - Constitution updated with SDD principles
- [x] **Path Migration** - Specs moved to `specs/` at project root

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `.specify/memory/constitution.md` | Foundational principles (v2.0.0) | ✅ Updated |
| `specs/001-workflow-foundation/` | Workflow foundation spec | ✅ Complete |
| `specs/README.md` | SDD workflow documentation | ✅ Complete |
| `.github/ISSUE_TEMPLATE/` | Issue templates | ✅ Complete |
| `.github/pull_request_template.md` | PR template | ✅ Complete |
| `.kilocode/rules/commit.md` | Agent commit instructions | ✅ Complete |
| `src/app/` | Next.js application | 🔄 Ready for features |

## Current Focus

**Spec-Kit Workflow Established** - Ready for feature implementation:

| Component | Status | Purpose |
|-----------|--------|---------|
| Constitution | ✅ v2.0.0 | SDD principles + human-in-the-loop |
| Conventional Commits | 📋 Specified | commitlint configuration |
| Changelog Management | 📋 Specified | Automated CHANGELOG.md updates |
| Issue Templates | ✅ Created | Bug reports, features, tasks |
| PR Template | ✅ Created | Spec reference checklist |
| Agent Instructions | ✅ Created | Commit failure recovery |
| Spec-Kit Commands | ✅ Documented | clarify, analyze, checklist |

## Next Steps

1. **Implement Workflow Foundation** - Install commitlint, husky, configure hooks
2. **Proceed with Feature 001** - Gem Optimizer implementation
3. **Start with Phase 1: Setup** - Create directory structure and types
4. **Complete Phase 2: Foundational** - Database schema and optimization engine

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
├── 001-workflow-foundation/
│   └── spec.md              # Master specification
├── 002-gem-optimizer/
│   └── ...
└── README.md
```

### Branch Naming Convention
- `feature/<identifier>-<###>-<name>` for features
- `fix/<identifier>-<###>-<name>` for bugs

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Auth**: next-auth with Battle.net OAuth provider (deferred to P4)
- **Database**: Drizzle ORM + better-sqlite3 (SQLite)
- **UI**: Tailwind CSS 4 + lucide-react icons
- **Validation**: Zod schemas

## External APIs

| API | Purpose | Documentation |
|-----|---------|---------------|
| Battle.net OAuth | User authentication | https://develop.battle.net/ |
| diablo.tv | DI days/events data | TBD |
| diabloimmortalredeem.com | Character verification | Mock redemption API |

## Session History

| Date | Changes |
|------|---------|
| 2026-02-14 | Moved specs/ to project root, updated branch naming to feature/ prefix |
| 2026-02-14 | Updated constitution to v2.0.0 with SDD principles |
| 2026-02-14 | Added enhanced quality commands to specs README |
| 2026-02-13 | Created workflow foundation specification (000-workflow-foundation) |
| 2026-02-13 | Created issue templates: bug_report.md, feature_request.md, task.md |
| 2026-02-13 | Created PR template with spec reference checklist |
| 2026-02-13 | Created agent commit instructions with failure scenarios |
| 2026-02-13 | Created specs/README.md with SDD workflow documentation |
| 2026-02-13 | Created complete SDD planning artifacts for gem optimizer (001) |
| 2026-02-13 | Spec Kit v0.1.0 installed and initialized for Kilo Code |
| 2026-02-13 | Memory bank updated with DI-Lab project brief |
| Initial | Template created with base Next.js setup |

## Spec-Kit Workflow Reference

| Phase | Command | Purpose | Required |
|-------|---------|---------|----------|
| Constitution | `/speckit.constitution` | Establish foundational principles | ✅ Yes |
| Specify | `/speckit.specify` | Create feature specification | ✅ Yes |
| Clarify | `/speckit.clarify` | Resolve underspecified areas | ⚪ Optional |
| Plan | `/speckit.plan` | Create implementation plan | ✅ Yes |
| Checklist | `/speckit.checklist` | Verify requirements completeness | ⚪ Optional |
| Tasks | `/speckit.tasks` | Generate actionable tasks | ✅ Yes |
| Analyze | `/speckit.analyze` | Cross-artifact consistency check | ⚪ Optional |
| Implement | `/speckit.implement` | Execute implementation | ✅ Yes |

## Workflow Foundation Summary

| Component | File | Purpose |
|-----------|------|---------|
| Spec | `specs/001-workflow-foundation/spec.md` | 7 user stories, 30 functional requirements |
| Issue Templates | `.github/ISSUE_TEMPLATE/` | Bug, feature, task templates |
| PR Template | `.github/pull_request_template.md` | Spec reference checklist |
| Commit Rules | `.kilocode/rules/commit.md` | Agent failure recovery |
| Spec README | `specs/README.md` | SDD workflow documentation |
| Constitution | `.specify/memory/constitution.md` | SDD principles + human checkpoints |

## Gem Optimizer (001) Summary

| Artifact | File | Description |
|----------|------|-------------|
| Constitution | `.specify/memory/constitution.md` | 5 SDD principles + 5 domain principles |
| Specification | `.specify/memory/spec.md` | 4 user stories (P1-P4) |
| Plan | `.specify/memory/plan.md` | 6 implementation phases |
| Tasks | `.specify/memory/tasks.md` | 38 actionable tasks |

## Quick Reference

- **Package Manager**: `bun`
- **Commit Workflow**: `bun typecheck && bun lint && git add -A && git commit -m "type: description" && git push`
- **Pre-commit Hooks**: lint, typecheck
- **Commit Format**: `type(scope): description` (lowercase, max 72 chars)
- **Spec Directory**: `specs/`
- **Constitution Version**: 2.0.0
