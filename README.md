# DI-Lab

[![Build Status](https://img.shields.io/github/actions/workflow/status/dahgoth/di-lab/ci.yml?branch=main)](https://github.com/dahgoth/di-lab/actions)
[![License](https://img.shields.io/badge/License-AGPL%203.0%20or%20later-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-orange.svg)](CHANGELOG.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

A web application for optimizing legendary gems in Diablo Immortal, similar to World of Warcraft tools like Raidbots and Ask Mr. Robot.

## Description

DI-Lab helps Diablo Immortal players optimize their legendary gem builds by analyzing available resources and recommending the most efficient upgrade paths. Players face complex decisions when upgrading legendary gems - resources like platinum and Telluric Pearls are scarce, and suboptimal choices can significantly set back progress.

Unlike World of Warcraft, which has dedicated optimization tools, Diablo Immortal lacks a specialized gem optimization solution. DI-Lab fills this gap by providing data-driven recommendations based on current gem stats, upgrade costs, and resource constraints.

## Features

- **Gem Selection**: Select legendary gems from a comprehensive database, specifying quality (1-5★) and rank (1-10)
- **Resource Management**: Track available resources including platinum, Telluric Pearls, and other upgrade materials
- **Optimization Engine**: Algorithm that recommends the best gem upgrades within your resource constraints
- **DI Days Integration**: Incorporate current events and bonuses from diablo.tv
- **Battle.net Integration**: OAuth authentication with character verification (Planned)
- **Screenshot OCR**: Automatic gem detection from inventory screenshots (Planned)
- **Build Management**: Save, share, and compare builds (Planned)

## Quick Start

1. Visit DI-Lab
2. Select your legendary gems from the categorized list
3. Specify quality (1-5★) and rank (1-10) for each gem
4. Enter your available resources
5. Click "Optimize" to receive prioritized upgrade recommendations
6. Follow the recommendations in-game

## Installation

### Prerequisites

- [Bun](https://bun.sh/) installed
- Node.js 20+ (for compatibility)

### Setup

```bash
# Clone the repository
git clone https://github.com/dahgoth/di-lab.git
cd di-lab

# Install dependencies
bun install

# Start development server
bun dev
```

The application will be available at `http://localhost:3000`.

## Usage

### Basic Optimization

1. Navigate to the Optimize page
2. Select gems from your inventory
3. Enter your current resources
4. Click "Optimize" to see recommendations

### With Battle.net Account (Planned)

1. Sign in with Battle.net OAuth
2. Enter your character ID for verification
3. Sync your gem inventory automatically

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `feature/<identifier>-<###>-<name>`
3. Make your changes following our [coding standards](AGENTS.md)
4. Ensure all commits follow [Conventional Commits](https://www.conventionalcommits.org/)
5. Submit a pull request

### Development Commands

```bash
bun install      # Install dependencies
bun build        # Build production app
bun lint         # Check code quality
bun typecheck    # Type checking
```

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Home page
│   ├── api/                # API routes
│   ├── optimize/           # Optimization page
│   └── builds/             # Saved builds page
├── components/             # React components
├── lib/                    # Utilities and libraries
└── types/                  # TypeScript definitions
```

## License

This project is licensed under the GNU Affero General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for Diablo Immortal players
