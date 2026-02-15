/**
 * @fileoverview Commitlint configuration for DI-Lab project.
 *
 * This configuration enforces Conventional Commits with comprehensive scopes
 * organized by domain, infrastructure, workflow, and meta categories.
 *
 * SCOPE RESOLUTION: The ambiguous "optimize" scope has been removed.
 * - For performance improvements: Use commit TYPE "perf" (e.g., "perf: optimize render loop")
 * - For gem optimizer feature: Use SCOPE "gems" (e.g., "feat(gems): add greedy algorithm")
 *
 * @see https://conventionalcommits.org/
 * @see https://github.com/conventional-changelog/commitlint
 */

/**
 * Valid commit types following Conventional Commits specification.
 * @type {ReadonlyArray<string>}
 */
const COMMIT_TYPES = [
  'feat',     // New feature
  'fix',      // Bug fix
  'docs',     // Documentation only
  'style',    // Code style (formatting, whitespace)
  'refactor', // Code refactoring
  'test',     // Adding/updating tests
  'chore',    // Maintenance tasks
  'perf',     // Performance improvement
  'ci',       // CI/CD changes
  'build',    // Build system changes
  'revert',   // Revert previous commit
];

/**
 * SCOPE CATEGORIES FOR DI-LAB
 *
 * Domain Scopes (application features):
 * - gems: Legendary gems selection, management, optimization engine
 *         Example: "feat(gems): add greedy optimization algorithm"
 *         Example: "fix(gems): correct resonance calculation for 5-star gems"
 *
 * - auth: Battle.net OAuth, user authentication, character verification
 *         Example: "feat(auth): add Battle.net OAuth provider"
 *         Example: "fix(auth): handle expired session tokens"
 *
 * - api: API routes, endpoints, server actions
 *        Example: "feat(api): add optimize endpoint"
 *        Example: "fix(api): validate input schema before processing"
 *
 * - ui: Components, pages, styling, user interface elements
 *       Example: "feat(ui): add gem selector component"
 *       Example: "style(ui): improve mobile responsiveness"
 *
 * - db: Database schema, migrations, queries (Drizzle + SQLite)
 *       Example: "feat(db): add legendary_gems table"
 *       Example: "fix(db): correct foreign key constraint"
 *
 * Infrastructure Scopes:
 * - ci: Continuous integration, GitHub Actions workflows
 *       Example: "ci: add release-please workflow"
 *       Example: "fix(ci): resolve husky hook permissions"
 *
 * - cd: Continuous deployment, release automation
 *       Example: "cd: configure auto-deploy to production"
 *
 * - deps: Dependencies, package updates
 *         Example: "deps: upgrade next.js to v16"
 *         Example: "fix(deps): pin better-sqlite3 version"
 *
 * - config: Configuration files, environment setup
 *           Example: "config: add tailwind css 4 configuration"
 *           Example: "fix(config): correct path alias mapping"
 *
 * Workflow Scopes (GitFlow-inspired):
 * - release: Release preparation, version bumps, changelogs
 *            Example: "release: prepare v0.2.0"
 *            Example: "release: update changelog for v0.1.0"
 *
 * - hotfix: Critical bug fixes requiring immediate deployment
 *           Example: "hotfix: patch auth token validation"
 *
 * Meta Scopes:
 * - specs: Specification documents, planning artifacts
 *          Example: "docs(specs): add optimizer-ui specification"
 *          Example: "feat(specs): create workflow-foundation spec"
 *
 * - docs: Documentation, README, comments (general)
 *         Example: "docs: update installation instructions"
 *
 * @type {ReadonlyArray<string>}
 */
const COMMIT_SCOPES = [
  // Domain Scopes
  'gems',   // Legendary gems: selection, optimization, management
  'auth',   // Authentication: Battle.net OAuth, character verification
  'api',    // API: routes, endpoints, server actions
  'ui',     // User Interface: components, pages, styling
  'db',     // Database: schema, migrations, queries

  // Infrastructure Scopes
  'ci',     // Continuous Integration: GitHub Actions, workflows
  'cd',     // Continuous Deployment: release automation
  'deps',   // Dependencies: package updates, version management
  'config', // Configuration: files, environment setup

  // Workflow Scopes
  'release', // Release: version bumps, changelog updates
  'hotfix',  // Hotfix: critical bug fixes for immediate deployment

  // Meta Scopes
  'specs',  // Specifications: planning documents, feature specs
  'docs',   // Documentation: README, comments, guides
];

/**
 * Commitlint configuration object.
 * @type {import('@commitlint/types').UserConfig}
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of the conventional commit types
    'type-enum': [2, 'always', COMMIT_TYPES],

    // Scope must be one of the defined project scopes (or empty for global changes)
    'scope-enum': [2, 'always', COMMIT_SCOPES],

    // Subject must be lowercase
    'subject-case': [2, 'always', 'lower-case'],

    // Subject must not exceed 72 characters
    'subject-max-length': [2, 'always', 72],

    // Scope-enum is optional (allow empty scope for global changes)
    'scope-empty': [1, 'never'],
  },
};