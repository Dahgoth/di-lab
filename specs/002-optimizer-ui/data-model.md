# Data Model: Optimizer UI

**Branch**: `feature/PROJ-002-optimizer-ui` | **Date**: 2026-02-14

## Overview

This document defines the data models, entities, and their relationships for the Optimizer UI feature. All entities are designed for client-side state management with localStorage persistence.

---

## Core Entities

### 1. LegendaryGem (Static Data)

Represents a legendary gem in the game database. This data is static and bundled with the application.

```typescript
interface LegendaryGem {
  // Identity
  id: string; // Unique identifier (e.g., "blood-soaked-jade")
  name: string; // Display name (e.g., "Blood Soaked Jade")
  starRating: 1 | 2 | 5; // Gem tier (1-star, 2-star, 5-star)

  // Effect Information
  effects: GemEffect[]; // Array of gem effects
  effectCategories: EffectCategory[]; // Categories: OFF, DEF, ALL, etc.

  // Tier Rankings
  pvpTier: TierRanking; // PVP tier: S, A, B, C, D
  pveTier: TierRanking; // PVE tier: S, A, B, C, D

  // Upgrade Costs (per rank)
  upgradeCosts: UpgradeCost[]; // Costs for each rank upgrade

  // Resonance Data
  resonanceTable: ResonanceTable; // Resonance values by quality/rank

  // Metadata
  source?: string; // Acquisition source (e.g., "Battle Pass", "Event")
  isAuxiliary?: boolean; // Whether this is an auxiliary gem
}

interface GemEffect {
  category: EffectCategory;
  type: EffectType;
  description: string;
  maxValues: Record<string, string | number>;
  duration?: number; // Effect duration in seconds
  cooldown?: number; // Cooldown in seconds
  isStrifed: boolean; // Affected by BG strife (70% reduction)
}

type EffectCategory =
  | "OFF" // Offensive
  | "DEF" // Defensive
  | "ALL" // Affects multiple stats
  | "DOT" // Damage over time
  | "LOC" // Loss of control
  | "TLOC"; // Targeted loss of control

type EffectType =
  | "permanent"
  | "conditional"
  | "Buff"
  | "Debuff"
  | "DOT"
  | "LOC"
  | "Summon"
  | "Conjure"
  | "Damage"
  | "Heal";

type TierRanking = "S" | "A" | "B" | "C" | "D";

interface UpgradeCost {
  fromRank: number;
  toRank: number;
  gemPower: number;
  copies: number; // Additional R1 copies needed
}

interface ResonanceTable {
  // For 1-star and 2-star gems: single resonance per rank
  byRank?: Record<number, number>;
  // For 5-star gems: resonance varies by quality
  byQuality?: {
    2: Record<number, number>; // 2/5 quality
    3: Record<number, number>; // 3/5 quality
    4: Record<number, number>; // 4/5 quality
    5: Record<number, number>; // 5/5 quality
  };
}
```

**Validation Rules**:

- `id` must be unique across all gems
- `starRating` determines which resonance table structure to use
- `effects` array must have at least one effect
- Resonance values must be positive integers

**Data Source**: Static JSON file at `src/data/gems.json` (bundled at build time)

---

### 2. EquippedGem (User Data)

Represents a gem that the user has equipped in their build.

```typescript
interface EquippedGem {
  gemId: string; // Reference to LegendaryGem.id
  quality: 1 | 2 | 3 | 4 | 5; // Quality rating (only for 5-star gems)
  rank: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // Current rank
  slotPosition: number; // Position in grid (1-24)
  slotType: "base" | "wing"; // Derived from slotPosition
  quantity?: number; // For inventory tracking (optional)
}

// Slot position mapping
const SLOT_CONFIG = {
  BASE_SLOTS: 8, // Positions 1-8
  WING_SLOTS_START: 9, // Position 9+
  MAX_WING_SLOTS: 16, // Positions 9-24
  MAX_TOTAL_SLOTS: 24, // Total slots available
} as const;
```

**Validation Rules**:

- `slotPosition` must be 1-24
- `slotType` is derived: positions 1-8 are 'base', 9-24 are 'wing'
- `quality` is only meaningful for 5-star gems (1-star and 2-star gems always have quality 1)
- In base slots (1-8): no duplicate `gemId` allowed
- In wing slots (9-24): duplicate `gemId` is allowed

**State Transitions**:

```
[Not Equipped] → Add gem → [Equipped in first available slot]
[Equipped] → Remove → [Not Equipped]
[Equipped] → Change quality/rank → [Equipped with updated config]
[Equipped in base slot] → Cannot add duplicate gemId → [Blocked with error]
```

---

### 3. ResourceInventory (User Data)

Represents the user's available upgrade resources.

```typescript
interface ResourceInventory {
  platinum: number; // Platinum currency
  telluricPearls: number; // Telluric Pearls
  // Future resources can be added as needed
}
```

**Validation Rules**:

- All values must be non-negative integers
- Maximum value: 2,147,483,647 (32-bit integer max)
- Values above 1,000,000 should display with M suffix (e.g., "1.2M")

---

### 4. OptimizationResult (API Response)

Represents the output of an optimization calculation.

```typescript
interface OptimizationResult {
  recommendations: UpgradeRecommendation[];
  totalPowerGain: number; // Sum of all power gains
  totalResourceCost: ResourceInventory;
  mode: "PVP" | "PVE";
  calculatedAt: string; // ISO timestamp
  processingTime: number; // milliseconds
}

interface UpgradeRecommendation {
  id: string; // Unique recommendation ID
  targetGem: EquippedGem; // The gem to upgrade
  currentRank: number;
  targetRank: number;
  resourceCost: ResourceInventory;
  powerGain: number; // Expected CR/resonance improvement
  priorityRank: number; // Position in sorted recommendations (1 = highest priority)
  reasoning: string; // Human-readable explanation
  alternatives?: AlternativeUpgrade[];
}

interface AlternativeUpgrade {
  description: string;
  powerGain: number;
  resourceCost: ResourceInventory;
  tradeoff: string; // Why this alternative might be preferred
}
```

**Validation Rules**:

- `recommendations` must be sorted by `priorityRank` ascending
- `priorityRank` must be unique within a result
- All `powerGain` values must be positive
- `totalPowerGain` must equal sum of all recommendation power gains

---

### 5. SavedBuild (Persistent Data)

Represents a persisted build configuration stored in localStorage.

```typescript
interface SavedBuild {
  id: string; // UUID for unique identification
  name: string; // User-provided build name (must be unique)
  gems: EquippedGem[];
  resources: ResourceInventory;
  optimizationMode: "PVP" | "PVE";
  notes?: string; // Optional user notes
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

**Validation Rules**:

- `id` must be a valid UUID v4
- `name` must be unique across all saved builds
- `name` must be 1-50 characters
- `notes` must be 0-500 characters (if provided)

---

### 6. SessionState (Auto-persisted)

Represents the current work-in-progress state, auto-saved to localStorage.

```typescript
interface SessionState {
  gems: EquippedGem[];
  resources: ResourceInventory;
  optimizationMode: "PVP" | "PVE";
  updatedAt: string; // ISO timestamp
}
```

**Persistence**: Auto-saved on every change (gem add/remove, quality/rank change, resource input)

---

### 7. LocalStorageSchema

Complete localStorage structure for the application.

```typescript
interface LocalStorageSchema {
  version: 1; // Schema version for migrations
  builds: SavedBuild[];
  currentSession?: SessionState;
}

// Storage key
const STORAGE_KEY = "di-lab-v1";
```

---

## Derived/Calculated Data

### Total Resonance

```typescript
function calculateTotalResonance(
  gems: EquippedGem[],
  gemDatabase: Map<string, LegendaryGem>,
): number {
  return gems.reduce((total, equipped) => {
    const gem = gemDatabase.get(equipped.gemId);
    if (!gem) return total;

    const resonance = getResonanceForGem(gem, equipped.quality, equipped.rank);
    return total + resonance;
  }, 0);
}

function getResonanceForGem(
  gem: LegendaryGem,
  quality: number,
  rank: number,
): number {
  if (gem.starRating === 1 && gem.resonanceTable.byRank) {
    return gem.resonanceTable.byRank[rank] || 0;
  }
  if (gem.starRating === 2 && gem.resonanceTable.byRank) {
    return gem.resonanceTable.byRank[rank] || 0;
  }
  if (gem.starRating === 5 && gem.resonanceTable.byQuality) {
    return (
      gem.resonanceTable.byQuality[
        quality as keyof typeof gem.resonanceTable.byQuality
      ]?.[rank] || 0
    );
  }
  return 0;
}
```

### Unlocked Wing Slots

```typescript
function calculateUnlockedWingSlots(totalResonance: number): number {
  if (totalResonance >= 8500) return 16;
  if (totalResonance >= 8000) return 12;
  if (totalResonance >= 7000) return 8;
  if (totalResonance >= 6000) return 4;
  return 0;
}

function getTotalAvailableSlots(totalResonance: number): number {
  return 8 + calculateUnlockedWingSlots(totalResonance);
}
```

### Combat Rating Total

```typescript
function calculateTotalCR(
  gems: EquippedGem[],
  gemDatabase: Map<string, LegendaryGem>,
): number {
  // Similar to resonance calculation using CR tables
  return gems.reduce((total, equipped) => {
    const gem = gemDatabase.get(equipped.gemId);
    if (!gem) return total;
    return total + getCRForGem(gem, equipped.quality, equipped.rank);
  }, 0);
}
```

---

## Error Types

```typescript
type OptimizationErrorType =
  | "validation"
  | "insufficient-resources"
  | "timeout"
  | "server-error";

interface OptimizationError {
  type: OptimizationErrorType;
  title: string;
  message: string;
  guidance: string; // Actionable next step
  details?: Record<string, unknown>;
}
```

---

## Entity Relationships

```
┌─────────────────┐
│  LegendaryGem   │ (Static data, ~100 records)
│  - id           │
│  - name         │
│  - starRating   │
│  - effects[]    │
│  - tierRankings │
└────────┬────────┘
         │ referenced by
         ▼
┌─────────────────┐         ┌─────────────────┐
│  EquippedGem    │         │ ResourceInventory│
│  - gemId ───────┼────────►│  - platinum      │
│  - quality      │         │  - telluricPearls│
│  - rank         │         └─────────────────┘
│  - slotPosition │                 │
└────────┬────────┘                 │
         │                          │
         │ grouped in               │ grouped in
         ▼                          ▼
┌─────────────────────────────────────────┐
│            SavedBuild                    │
│  - id                                    │
│  - name                                  │
│  - gems: EquippedGem[]                   │
│  - resources: ResourceInventory          │
│  - optimizationMode                      │
│  - createdAt / updatedAt                 │
└─────────────────────────────────────────┘
         │
         │ produces
         ▼
┌─────────────────────────────────────────┐
│        OptimizationResult               │
│  - recommendations[]                    │
│  - totalPowerGain                       │
│  - totalResourceCost                    │
│  - mode                                 │
└─────────────────────────────────────────┘
```

---

## Zod Schemas

For runtime validation:

```typescript
import { z } from "zod";

// Enums
const TierRankingSchema = z.enum(["S", "A", "B", "C", "D"]);
const EffectCategorySchema = z.enum([
  "OFF",
  "DEF",
  "ALL",
  "DOT",
  "LOC",
  "TLOC",
]);
const OptimizationModeSchema = z.enum(["PVP", "PVE"]);

// Core schemas
const EquippedGemSchema = z.object({
  gemId: z.string().min(1),
  quality: z.number().int().min(1).max(5),
  rank: z.number().int().min(1).max(10),
  slotPosition: z.number().int().min(1).max(24),
  slotType: z.enum(["base", "wing"]),
  quantity: z.number().int().min(1).optional(),
});

const ResourceInventorySchema = z.object({
  platinum: z.number().int().min(0),
  telluricPearls: z.number().int().min(0),
});

const SavedBuildSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  gems: z.array(EquippedGemSchema),
  resources: ResourceInventorySchema,
  optimizationMode: OptimizationModeSchema,
  notes: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const SessionStateSchema = z.object({
  gems: z.array(EquippedGemSchema),
  resources: ResourceInventorySchema,
  optimizationMode: OptimizationModeSchema,
  updatedAt: z.string().datetime(),
});

const LocalStorageSchema = z.object({
  version: z.literal(1),
  builds: z.array(SavedBuildSchema),
  currentSession: SessionStateSchema.optional(),
});

// API schemas
const OptimizationErrorSchema = z.object({
  type: z.enum([
    "validation",
    "insufficient-resources",
    "timeout",
    "server-error",
  ]),
  title: z.string(),
  message: z.string(),
  guidance: z.string(),
  details: z.record(z.unknown()).optional(),
});

const UpgradeRecommendationSchema = z.object({
  id: z.string(),
  targetGem: EquippedGemSchema,
  currentRank: z.number().int().min(1).max(10),
  targetRank: z.number().int().min(1).max(10),
  resourceCost: ResourceInventorySchema,
  powerGain: z.number().positive(),
  priorityRank: z.number().int().positive(),
  reasoning: z.string(),
  alternatives: z
    .array(
      z.object({
        description: z.string(),
        powerGain: z.number().positive(),
        resourceCost: ResourceInventorySchema,
        tradeoff: z.string(),
      }),
    )
    .optional(),
});

const OptimizationResultSchema = z.object({
  recommendations: z.array(UpgradeRecommendationSchema),
  totalPowerGain: z.number(),
  totalResourceCost: ResourceInventorySchema,
  mode: OptimizationModeSchema,
  calculatedAt: z.string().datetime(),
  processingTime: z.number(),
});
```

---

## Data File Structure

Static gem data will be stored in JSON format:

```
src/
└── data/
    └── gems.json         # All legendary gem data
```

Example structure for `gems.json`:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-02-14",
  "gems": [
    {
      "id": "blood-soaked-jade",
      "name": "Blood Soaked Jade",
      "starRating": 5,
      "effects": [...],
      "pvpTier": "S",
      "pveTier": "S",
      "resonanceTable": {
        "byQuality": {
          "2": { "1": 30, "2": 110, ... },
          "3": { "1": 60, "2": 140, ... },
          "4": { "1": 90, "2": 180, ... },
          "5": { "1": 100, "2": 200, ... }
        }
      }
    }
  ]
}
```
