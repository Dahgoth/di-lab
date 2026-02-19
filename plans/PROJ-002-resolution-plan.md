# Resolution Plan: PROJ-002-optimizer-ui Specification Issues

**Created**: 2026-02-15  
**Status**: Ready for Implementation  
**Issues Resolved**: CHK026, CHK027, CHK053, CHK059

---

## Executive Summary

This document provides detailed resolution plans for four specification issues identified during the comprehensive checklist audit. Each resolution includes exact requirement modifications, affected file references, implementation guidance, and traceability verification.

---

## Issue 1: CHK026 — Interaction State Conflict (CRITICAL)

### Problem Statement

**Conflict detected between**:

- [`FR-017`](specs/feature/PROJ-002-optimizer-ui/spec.md:184): "System MUST disable user interaction during optimization processing"
- [`FR-022`](specs/feature/PROJ-002-optimizer-ui/spec.md:189): "System MUST handle optimization timeout gracefully with a cancellation option after 30 seconds"

**User Clarification**: Show a modal overlay with progress indicator and Cancel button. The underlying form is visually disabled but the modal remains interactive.

### Resolution: Modal Overlay Pattern

#### FR-017 Modification

**Before** (Line 184):

```markdown
- **FR-017**: System MUST disable user interaction during optimization processing
```

**After**:

```markdown
- **FR-017**: System MUST display a modal overlay during optimization processing that:
  - Shows a progress indicator (spinner or progress bar)
  - Displays elapsed time (optional, updates every second)
  - Provides a Cancel button that remains interactive
  - Visually disables the underlying form with a semi-transparent overlay
  - Prevents all form interactions (clicks, keyboard navigation) on the underlying UI
  - Allows cancellation via the Cancel button or Escape key
```

#### FR-022 Modification

**Before** (Line 189):

```markdown
- **FR-022**: System MUST handle optimization timeout gracefully with a cancellation option after 30 seconds
```

**After**:

```markdown
- **FR-022**: System MUST handle optimization timeout gracefully:
  - Display a timeout warning after 20 seconds with "Still processing..." message
  - Enable cancellation at any time via Cancel button in the modal overlay
  - After 30 seconds, automatically offer cancellation if still processing
  - On cancellation: abort the optimization request, close modal, restore form interactivity
  - Show toast notification confirming cancellation with retry option
```

### Implementation Guidance

```typescript
// Modal state management
interface OptimizationModalState {
  isOpen: boolean;
  startTime: Date | null;
  elapsedTime: number; // seconds
  status: "processing" | "timeout-warning" | "cancelling";
}

// Cancel handler
async function handleCancel() {
  setStatus("cancelling");
  await abortController.abort();
  closeModal();
  showToast({
    type: "info",
    message: "Optimization cancelled",
    action: "Retry",
  });
}
```

### Checklist Validation Criteria Update

**CHK026 Resolution Verification**:

- [ ] Modal overlay displays during optimization
- [ ] Underlying form is visually disabled (pointer-events: none, opacity reduced)
- [ ] Cancel button is interactive throughout
- [ ] Escape key triggers cancellation
- [ ] No contradiction between FR-017 and FR-022 in implementation

---

## Issue 2: CHK027 — Persistence Model Conflict (CRITICAL)

### Problem Statement

**Conflict detected between**:

- [`FR-023a`](specs/feature/PROJ-002-optimizer-ui/spec.md:196): "System MUST auto-persist session state to localStorage on every change"
- [`FR-023b`](specs/feature/PROJ-002-optimizer-ui/spec.md:197): "System MUST show a confirmation dialog when user attempts to navigate away with unsaved changes"

**User Clarification**: Hybrid approach - Auto-persist session state, but require explicit save for named builds. Show confirmation only for unsaved named builds, not session state.

### Resolution: Hybrid Persistence Model

#### FR-023a Modification

**Before** (Line 196):

```markdown
- **FR-023a**: System MUST auto-persist session state to localStorage on every change (gem add/remove, quality/rank change, resource input) to ensure data is never lost
```

**After**:

```markdown
- **FR-023a**: System MUST auto-persist session state to localStorage on every change:
  - Auto-save applies to SessionState only (gems, resources, optimizationMode)
  - Auto-save occurs on every user action (gem add/remove, quality/rank change, resource input)
  - Auto-saved session is automatically restored on page load
  - Auto-saved session does NOT create a named build
  - User sees "Session auto-saved" indicator (subtle, non-intrusive)
```

#### FR-023b Modification

**Before** (Line 197):

```markdown
- **FR-023b**: System MUST show a confirmation dialog when user attempts to navigate away (close tab, navigate to another page) with unsaved changes, preventing accidental data loss
```

**After**:

```markdown
- **FR-023b**: System MUST show unsaved changes confirmation only for named builds:
  - Confirmation dialog appears when user has an unsaved named build in progress
  - A named build is considered "unsaved" when:
    - User explicitly saved the build, then modified it
    - User started with a loaded named build, then modified it
  - Confirmation does NOT appear for:
    - New session state (auto-persisted, no explicit save)
    - Already saved named builds (no modifications since save)
  - Dialog options: "Save", "Don't Save", "Cancel"
```

#### New FR-023c Addition

**Insert after FR-023b**:

```markdown
- **FR-023c**: System MUST distinguish between session state and named builds:
  - SessionState: Auto-persisted, restored on load, no confirmation on exit
  - SavedBuild: Explicit save required, confirmation on exit if modified
  - Transition from session to named build occurs when user clicks "Save Build"
```

### Data Model Clarification

Update [`data-model.md`](specs/feature/PROJ-002-optimizer-ui/data-model.md:241-250) SessionState section:

**Before**:

```typescript
interface SessionState {
  gems: EquippedGem[];
  resources: ResourceInventory;
  optimizationMode: "PVP" | "PVE";
  updatedAt: string; // ISO timestamp
}
```

**After**:

```typescript
interface SessionState {
  gems: EquippedGem[];
  resources: ResourceInventory;
  optimizationMode: "PVP" | "PVE";
  updatedAt: string; // ISO timestamp
  lastSavedBuildId?: string; // Reference to last saved/loaded build (if any)
  hasUnsavedChanges?: boolean; // True if named build was modified
}
```

### Implementation Guidance

```typescript
// State tracking
function hasUnsavedNamedBuild(
  state: SessionState,
  builds: SavedBuild[],
): boolean {
  if (!state.lastSavedBuildId) return false; // No named build context
  const savedBuild = builds.find((b) => b.id === state.lastSavedBuildId);
  if (!savedBuild) return false; // Build was deleted
  return state.hasUnsavedChanges; // Check modification flag
}

// beforeunload handler
window.addEventListener("beforeunload", (e) => {
  if (hasUnsavedNamedBuild(sessionState, savedBuilds)) {
    e.preventDefault();
    e.returnValue = "";
  }
});
```

### Checklist Validation Criteria Update

**CHK027 Resolution Verification**:

- [ ] Session state auto-persists on every change
- [ ] Auto-saved session restores on page load
- [ ] No confirmation dialog for new session state
- [ ] Confirmation dialog appears only for modified named builds
- [ ] "Save", "Don't Save", "Cancel" options work correctly
- [ ] Clear distinction between session state and named builds

---

## Issue 3: CHK053 — Screen Reader Async Announcements (HIGH)

### Problem Statement

**Gap identified**: Are accessibility requirements for screen reader announcements during async operations (loading, errors) defined?

**User Clarification**: Yes, but limit to critical announcements only (errors and completion), not loading start since the modal already indicates progress.

### Resolution: ARIA Live Regions for Critical Announcements

#### New FR-044a Addition

**Insert after FR-044** (Line 232):

```markdown
- **FR-044a**: System MUST provide screen reader announcements for critical optimization events:
  - **Optimization completion**: Announce "Optimization complete. X recommendations found."
  - **Optimization error**: Announce the error title and guidance from FR-021
  - **Optimization cancellation**: Announce "Optimization cancelled."
  - Do NOT announce loading start (modal overlay already indicates progress)
  - Use aria-live="polite" region for non-intrusive announcements
  - Use aria-live="assertive" for error announcements requiring immediate attention
```

### Implementation Guidance

```tsx
// ARIA Live Region Component
function LiveAnnouncer() {
  const [announcement, setAnnouncement] = useState("");
  const [priority, setPriority] = useState<"polite" | "assertive">("polite");

  const announce = useCallback((message: string, urgent = false) => {
    setPriority(urgent ? "assertive" : "polite");
    setAnnouncement(""); // Clear first to ensure re-announcement
    setTimeout(() => setAnnouncement(message), 100);
  }, []);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

// Usage in optimization flow
function handleOptimizationComplete(result: OptimizationResult) {
  announce(
    `Optimization complete. ${result.recommendations.length} recommendations found.`,
  );
}

function handleOptimizationError(error: OptimizationError) {
  announce(`${error.title}. ${error.guidance}`, true); // assertive
}
```

### CSS for Screen Reader Only Content

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Checklist Validation Criteria Update

**CHK053 Resolution Verification**:

- [ ] aria-live region exists in DOM for announcements
- [ ] Completion announcements are announced (polite)
- [ ] Error announcements are announced (assertive)
- [ ] Loading start is NOT announced
- [ ] Screen reader can access announcement content
- [ ] Multiple rapid announcements queue properly

---

## Issue 4: CHK059 — XSS Prevention for User Content (HIGH)

### Problem Statement

**Gap identified**: Are security requirements for XSS prevention in user-entered build names and notes defined?

**User Clarification**: Choose the most appropriate option based on React best practices. React's JSX auto-escaping provides baseline protection, but for saved content that persists, additional sanitization may be warranted.

### Resolution: Defense-in-Depth XSS Prevention

#### New FR-046 Addition

**Insert after FR-045** (Line 234):

```markdown
- **FR-046**: System MUST prevent XSS attacks in user-entered content:
  - Build names (1-50 characters) and notes (0-500 characters) are user-controllable
  - React's JSX auto-escaping provides baseline protection against injection
  - Additional sanitization required for defense-in-depth:
    - Strip HTML tags from build names and notes before storage
    - Escape special characters (< > & " ') on display
    - Reject content containing javascript: or data: URLs
  - Server-side validation must mirror client-side validation
  - Content Security Policy (CSP) header must be configured to prevent inline script execution
```

### Data Model Validation Update

Update [`SavedBuild`](specs/feature/PROJ-002-optimizer-ui/data-model.md:216-226) validation rules:

**Add to Validation Rules section**:

```markdown
**XSS Prevention**:

- `name` and `notes` must not contain HTML tags
- `name` and `notes` must not contain URL schemes (javascript:, data:, vbscript:)
- Sanitization must occur on both client (before save) and server (before storage)
- Display must use React's default escaping (do NOT use dangerouslySetInnerHTML)
```

### Zod Schema Enhancement

Update [`SavedBuildSchema`](specs/feature/PROJ-002-optimizer-ui/data-model.md:445-454) in data-model.md:

**Before**:

```typescript
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
```

**After**:

```typescript
// XSS sanitization helpers
const stripHtmlTags = (str: string): string => str.replace(/<[^>]*>/g, "");

const hasDangerousUrlScheme = (str: string): boolean =>
  /(?:javascript|data|vbscript):/i.test(str);

const sanitizeUserContent = (str: string): string => {
  const stripped = stripHtmlTags(str);
  if (hasDangerousUrlScheme(stripped)) {
    throw new Error("Content contains forbidden URL scheme");
  }
  return stripped;
};

// Enhanced schema with sanitization
const UserContentSchema = z
  .string()
  .transform(sanitizeUserContent)
  .refine((val) => !hasDangerousUrlScheme(val), {
    message: "Content contains forbidden URL scheme",
  });

const SavedBuildSchema = z.object({
  id: z.string().uuid(),
  name: UserContentSchema.min(1).max(50),
  gems: z.array(EquippedGemSchema),
  resources: ResourceInventorySchema,
  optimizationMode: OptimizationModeSchema,
  notes: UserContentSchema.max(500).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

### Implementation Guidance

```typescript
// Client-side sanitization before save
function sanitizeInput(input: string): string {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Check for dangerous URL schemes
  if (/(?:javascript|data|vbscript):/i.test(sanitized)) {
    throw new ValidationError('Content contains forbidden elements');
  }

  return sanitized.trim();
}

// Display - use React's default escaping (no dangerouslySetInnerHTML)
function BuildCard({ build }: { build: SavedBuild }) {
  return (
    <div>
      <h3>{build.name}</h3> {/* React auto-escapes */}
      {build.notes && <p>{build.notes}</p>} {/* React auto-escapes */}
    </div>
  );
}

// Server-side CSP header (Next.js middleware or next.config.ts)
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  }
];
```

### Checklist Validation Criteria Update

**CHK059 Resolution Verification**:

- [ ] HTML tags are stripped from build names and notes
- [ ] Dangerous URL schemes (javascript:, data:) are rejected
- [ ] Client-side validation prevents submission of dangerous content
- [ ] Server-side validation mirrors client-side validation
- [ ] Display uses React's default escaping (no dangerouslySetInnerHTML)
- [ ] CSP header is configured to prevent inline script execution
- [ ] Penetration testing confirms XSS vectors are blocked

---

## Traceability Matrix

| Issue ID | Original Requirement | Modified Requirement                     | New Requirement | Verification Checklist         |
| -------- | -------------------- | ---------------------------------------- | --------------- | ------------------------------ |
| CHK026   | FR-017, FR-022       | FR-017 (expanded), FR-022 (expanded)     | —               | CHK026 Resolution Verification |
| CHK027   | FR-023a, FR-023b     | FR-023a (clarified), FR-023b (clarified) | FR-023c         | CHK027 Resolution Verification |
| CHK053   | —                    | —                                        | FR-044a         | CHK053 Resolution Verification |
| CHK059   | —                    | —                                        | FR-046          | CHK059 Resolution Verification |

---

## Files Requiring Updates

| File                                                                                                                                 | Changes Required                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| [`specs/feature/PROJ-002-optimizer-ui/spec.md`](specs/feature/PROJ-002-optimizer-ui/spec.md)                                         | Modify FR-017, FR-022, FR-023a, FR-023b; Add FR-023c, FR-044a, FR-046   |
| [`specs/feature/PROJ-002-optimizer-ui/data-model.md`](specs/feature/PROJ-002-optimizer-ui/data-model.md)                             | Update SessionState interface, SavedBuild validation, Zod schemas       |
| [`specs/feature/PROJ-002-optimizer-ui/checklists/comprehensive.md`](specs/feature/PROJ-002-optimizer-ui/checklists/comprehensive.md) | Mark CHK026, CHK027, CHK053, CHK059 as resolved with verification items |

---

## Implementation Priority

| Priority | Issue             | Rationale                                                          |
| -------- | ----------------- | ------------------------------------------------------------------ |
| 1        | CHK026 (CRITICAL) | Affects core optimization flow, user cannot cancel long operations |
| 2        | CHK027 (CRITICAL) | Affects data persistence, potential data loss for named builds     |
| 3        | CHK059 (HIGH)     | Security vulnerability, must be addressed before production        |
| 4        | CHK053 (HIGH)     | Accessibility compliance, improves user experience                 |

---

## Next Steps

1. **Architect Mode**: Review and approve this resolution plan
2. **Code Mode**: Implement specification changes in order of priority
3. **Test Mode**: Verify each resolution using the validation criteria
4. **Update Checklist**: Mark issues as resolved in comprehensive.md

---

**Version**: 1.0.0 | **Created**: 2026-02-15
