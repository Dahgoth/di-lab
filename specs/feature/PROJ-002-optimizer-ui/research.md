# Research: Optimizer UI

**Branch**: `feature/PROJ-002-optimizer-ui` | **Date**: 2026-02-14

## Summary

This document captures research findings for the Optimizer UI implementation, resolving all technical unknowns and establishing best practices for key implementation decisions.

---

## Research Topics

### 1. Gem Icon Assets

**Question**: Where to source representative gem icons from community? What licensing considerations apply?

**Decision**: Use placeholder icons initially with a plan to source community icons later.

**Rationale**:

- Project has existing gem data documentation but no icon assets
- Placeholder icons allow immediate development progress
- Community resources (diablo.tv, maxroll.gg) may have licensing restrictions
- Custom SVG placeholders provide consistent styling and are royalty-free

**Alternatives Considered**:

- Screenshot extraction from game: Not permitted (ToS violation)
- Community wiki images: Licensing unclear, may require attribution
- AI-generated icons: Inconsistent quality, potential style mismatch

**Implementation**:

- Create simple colored SVG placeholders based on star rating (gold for 5-star, silver for 2-star, bronze for 1-star)
- Add icon placeholder component that can be swapped later
- Document icon asset requirements for future sourcing

---

### 2. Resonance Calculation

**Question**: Confirm exact resonance values per gem type/quality/rank from game data.

**Decision**: Use documented resonance tables from `docs/legendary-gems/upgrading.md`.

**Findings**:

#### Resonance by Star Rating and Rank

| Rank | 1-Star Reso | 2-Star Reso | 5-Star 2/5 Reso | 5-Star 3/5 Reso | 5-Star 4/5 Reso | 5-Star 5/5 Reso |
| ---- | ----------- | ----------- | --------------- | --------------- | --------------- | --------------- |
| 1    | 15          | 30          | 30              | 60              | 90              | 100             |
| 2    | 30          | 60          | 110             | 140             | 180             | 200             |
| 3    | 45          | 90          | 190             | 230             | 270             | 300             |
| 4    | 60          | 120         | 280             | 320             | 360             | 400             |
| 5    | 75          | 150         | 370             | 410             | 450             | 500             |
| 6    | 90          | 180         | 460             | 500             | 540             | 600             |
| 7    | 105         | 210         | 550             | 590             | 630             | 700             |
| 8    | 120         | 240         | 640             | 680             | 720             | 800             |
| 9    | 135         | 270         | 730             | 770             | 810             | 900             |
| 10   | 150         | 300         | 820             | 860             | 900             | 1000            |

#### Wing Slot Thresholds (Auto-Calculated)

| Total Resonance | Unlocked Wing Slots |
| --------------- | ------------------- |
| 6000            | 4 slots             |
| 7000            | 8 slots             |
| 8000            | 12 slots            |
| 8500+           | 16 slots (max)      |

**Implementation**:

```typescript
function calculateResonance(gem: EquippedGem): number {
  // Use lookup table based on starRating, quality, and rank
  return RESONANCE_TABLE[gem.starRating][gem.quality][gem.rank];
}

function calculateUnlockedSlots(totalResonance: number): number {
  if (totalResonance >= 8500) return 16;
  if (totalResonance >= 8000) return 12;
  if (totalResonance >= 7000) return 8;
  if (totalResonance >= 6000) return 4;
  return 0;
}
```

---

### 3. Tier Rankings Source

**Question**: Where to source PVP/PVE tier rankings?

**Decision**: Use tier rankings from existing `docs/legendary-gems/tier-lists.md`.

**Findings**:

- Project already has comprehensive PVP and PVE tier lists
- Rankings are maintained by the project author
- Tier values: S, A, B, C, D

**Data Structure**:

```typescript
type TierRanking = "S" | "A" | "B" | "C" | "D";

interface GemTierInfo {
  gemId: string;
  pvpTier: TierRanking;
  pveTier: TierRanking;
}
```

**Implementation**:

- Extract tier rankings from documentation into JSON data file
- Include tier data in static gem database (`src/data/gems.json`)
- Display tier badges on gem cards and detail views

---

### 4. Mobile Touch Patterns for Dropdowns

**Question**: Best practices for dropdown selects on mobile in React 19.

**Decision**: Use native HTML `<select>` elements with Tailwind styling.

**Rationale**:

- Native selects provide best mobile UX (native picker on iOS/Android)
- Full keyboard accessibility built-in
- No additional JavaScript library needed
- React 19 has excellent native select support

**Alternatives Considered**:

- Custom dropdown component: More control but requires complex mobile handling
- Radix UI Select: Better styling but heavier bundle, custom mobile behavior
- Headless UI Listbox: Good accessibility but native is still better for mobile

**Implementation**:

```tsx
// Quality selector (1-5)
<select
  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
  value={quality}
  onChange={(e) => onQualityChange(Number(e.target.value))}
>
  {[1, 2, 3, 4, 5].map(q => (
    <option key={q} value={q}>{q}/5</option>
  ))}
</select>

// Rank selector (1-10)
<select
  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
  value={rank}
  onChange={(e) => onRankChange(Number(e.target.value))}
>
  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
    <option key={r} value={r}>Rank {r}</option>
  ))}
</select>
```

---

### 5. localStorage Schema for Build Persistence

**Question**: Optimal structure for build persistence with versioning support.

**Decision**: JSON structure with version field and array of build objects.

**Schema**:

```typescript
interface StoredBuild {
  id: string; // UUID for unique identification
  name: string; // User-provided build name
  gems: EquippedGem[]; // Array of equipped gems
  resources: {
    platinum: number;
    telluricPearls: number;
  };
  optimizationMode: "PVP" | "PVE";
  notes?: string; // Optional user notes
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

interface LocalStorageSchema {
  version: 1; // Schema version for future migrations
  builds: StoredBuild[];
  currentSession?: {
    // Auto-saved current work
    gems: EquippedGem[];
    resources: { platinum: number; telluricPearls: number };
    optimizationMode: "PVP" | "PVE";
    updatedAt: string;
  };
}
```

**localStorage Key**: `di-lab-v1`

**Implementation**:

```typescript
const STORAGE_KEY = "di-lab-v1";

function loadFromStorage(): LocalStorageSchema {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { version: 1, builds: [] };
  return JSON.parse(data);
}

function saveToStorage(data: LocalStorageSchema): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function autoSaveSession(session: CurrentSession): void {
  const data = loadFromStorage();
  data.currentSession = { ...session, updatedAt: new Date().toISOString() };
  saveToStorage(data);
}
```

---

### 6. Error Handling Types for Optimization API

**Question**: Define specific error response structure for typed error handling.

**Decision**: Use discriminated union error types with actionable guidance.

**Error Types**:

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
  guidance: string; // Actionable next step for user
  details?: Record<string, unknown>;
}

// Example error responses
const errorExamples = {
  validation: {
    type: "validation",
    title: "Invalid Input",
    message: "Your gem configuration has validation errors.",
    guidance:
      "Check your gem configuration and ensure all gems have valid quality and rank values.",
    details: { invalidGems: ["gem-id-1"] },
  },
  "insufficient-resources": {
    type: "insufficient-resources",
    title: "Insufficient Resources",
    message: "Your current resources cannot fund any upgrades.",
    guidance:
      "Add more platinum or Telluric Pearls to enable upgrade recommendations.",
    details: { required: { platinum: 1000 }, available: { platinum: 500 } },
  },
  timeout: {
    type: "timeout",
    title: "Optimization Timeout",
    message: "The optimization calculation exceeded the time limit.",
    guidance:
      "Try reducing the number of gems or simplifying your configuration.",
  },
  "server-error": {
    type: "server-error",
    title: "Server Error",
    message: "An unexpected error occurred during optimization.",
    guidance: "Please try again. If the problem persists, contact support.",
  },
};
```

---

## Technology Best Practices

### React 19 + Next.js 16 Patterns

**Server Components by Default**:

- Use Server Components for data fetching (gem catalog from JSON)
- Use Client Components only for interactive elements (selectors, buttons)

**State Management**:

- `useState` for local component state
- `useContext` for shared state (optimization mode, user preferences)
- localStorage for persistence (builds, session state)

**Performance**:

- Bundle gem data statically (no API calls for catalog)
- Debounce input validation (300-500ms)
- Use skeleton loaders for perceived performance

### Tailwind CSS 4 Patterns

**Touch Targets**:

```html
<!-- Minimum 44x44px touch target -->
<button class="min-h-11 min-w-11 px-4 py-2"></button>
```

**Responsive Grid**:

```html
<div
  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
></div>
```

**Skeleton Loaders**:

```html
<div class="animate-pulse bg-gray-200 rounded-md h-24 w-full"></div>
```

### Accessibility (WCAG 2.1 AA)

**Required Patterns**:

- All interactive elements have visible focus indicators
- Form inputs have associated labels
- Error messages linked to inputs via `aria-describedby`
- Color contrast minimum 4.5:1 for text
- Skip links for main content

---

## Resolved Technical Context

All NEEDS CLARIFICATION items from the plan have been resolved:

| Item                  | Resolution                                 |
| --------------------- | ------------------------------------------ |
| Gem Icons             | SVG placeholders, community sourcing later |
| Resonance Calculation | Tables from upgrading.md                   |
| Tier Rankings         | From tier-lists.md                         |
| Mobile Dropdowns      | Native `<select>` elements                 |
| localStorage Schema   | Versioned JSON structure                   |
| Error Types           | Discriminated union with guidance          |

---

## Next Steps

Proceed to Phase 1:

1. Generate `data-model.md` with entity definitions
2. Generate `contracts/` with API schemas
3. Generate `quickstart.md` with implementation guide
