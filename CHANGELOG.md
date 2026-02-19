# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0](https://github.com/Dahgoth/di-lab/compare/di-lab-v0.2.2...di-lab-v0.3.0) (2026-02-19)


### Features

* **optimizer:** implement legendary gems optimizer UI (PROJ-002) ([#12](https://github.com/Dahgoth/di-lab/issues/12)) ([5923e17](https://github.com/Dahgoth/di-lab/commit/5923e17e9c622441a99766a76274322f9ead0506))

## [0.2.2](https://github.com/Dahgoth/di-lab/compare/di-lab-v0.2.1...di-lab-v0.2.2) (2026-02-16)


### Bug Fixes

* update metadata and page content for di-lab project ([#10](https://github.com/Dahgoth/di-lab/issues/10)) ([a8bc049](https://github.com/Dahgoth/di-lab/commit/a8bc0494decb74c02403a6fae7d1193a5573d837))

## [0.2.1](https://github.com/Dahgoth/di-lab/compare/di-lab-v0.2.0...di-lab-v0.2.1) (2026-02-14)

### Bug Fixes

- **config:** remove optimizer ui spec from main ([f5e642b](https://github.com/Dahgoth/di-lab/commit/f5e642b6e514d2255d60a2de774acd17e5a22fce))

## [0.2.0](https://github.com/Dahgoth/di-lab/compare/di-lab-v0.1.0...di-lab-v0.2.0) (2026-02-14)

### Features

- **config:** implement template-based naming system ([b524e55](https://github.com/Dahgoth/di-lab/commit/b524e552332e4eb6e1476038f94c2d9cfdb907a1))
- install Spec Kit and update memory bank for DI-Lab ([cc32708](https://github.com/Dahgoth/di-lab/commit/cc32708919593dd2e1eac906fb636b62fde6509c))

### Bug Fixes

- add content to blank home page ([234ad7c](https://github.com/Dahgoth/di-lab/commit/234ad7cbbe006102f1b72a8c14d84ddaaf2032b2))
- **config:** add packages mapping to release-please config ([54666ac](https://github.com/Dahgoth/di-lab/commit/54666ac783181d30538dee0114e8f7bc70cd16a8))
- **config:** configure release-please to use manifest files ([9132285](https://github.com/Dahgoth/di-lab/commit/9132285798f3da288693ba6545a0ac74d46fb7c2))
- **config:** correct release-please config to use v0.1.0 initial version ([2871b31](https://github.com/Dahgoth/di-lab/commit/2871b31a771d7058270043fbd8d0534d9edd2844))
- sync bun.lock with package.json and remove conflicting package-lock.json ([d14d397](https://github.com/Dahgoth/di-lab/commit/d14d3974c9058ac3d3ae4ebe7d6fbb4ab6c09b75))

## [Unreleased]

### Added

- Workflow foundation with conventional commits enforcement
- Release automation via release-please-action
- Pre-commit hooks for code quality
- Commit message validation via commitlint

## [0.1.0] - 2026-02-14

### Added

- Initial project setup with Next.js 16 and React 19
- TypeScript 5.9.x with strict mode
- Tailwind CSS 4 integration
- ESLint configuration
- Memory bank documentation
- Recipe system for common features
- Base Next.js App Router structure
- Basic home page with welcome content
