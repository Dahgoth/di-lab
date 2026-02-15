# Feature Specification: Optimizer UI

**Feature Branch**: `feature/PROJ-002-optimizer-ui`  
**Created**: 2026-02-14  
**Status**: Ready for Implementation  
**Input**: Build the user interface components for the legendary gems optimizer, including gem selection, resource input, optimization results display, and build management

## Summary

This specification defines the user interface components, layout, and interaction patterns for the DI-Lab legendary gems optimizer application. The UI enables Diablo Immortal players to input their gem inventory, specify available resources, receive optimization recommendations, and manage their builds. This specification focuses exclusively on the presentation layer and user interactions.

---

## User Scenarios & Testing

### User Story 1 - Gem Inventory Entry (Priority: P1)

As a player, I want to select and configure my legendary gems so that the optimizer can analyze my current build and provide relevant recommendations.

**Why this priority**: Gem inventory is the foundational input for all optimization functionality. Without accurate gem data, recommendations would be meaningless.

**Independent Test**: User can open the application, select gems from a categorized list, set quality and rank for each, and see their selections displayed. Delivers immediate value by visualizing current build.

**Acceptance Scenarios**:

1. **Given** the gem selector is displayed, **When** user browses the gem catalog, **Then** gems are organized by star rating (1-star, 2-star, 5-star) with visual indicators for each tier
2. **Given** user has selected a gem, **When** user specifies quality (1-5) and rank (1-10), **Then** the gem card updates to show the configured state with appropriate visual feedback
3. **Given** user has configured multiple gems, **When** user views the equipped gems section, **Then** all selected gems are displayed with their quality, rank, and effect summary
4. **Given** user wants to remove a gem, **When** user clicks remove on a gem card, **Then** the gem is removed from the equipped list and returns to the available catalog
5. **Given** user has filled all available slots (base 8 + resonance-unlocked up to 24 total), **When** user attempts to add another gem, **Then** the interface prevents selection and indicates maximum capacity reached

---

### User Story 2 - Resource Specification (Priority: P1)

As a player, I want to input my available upgrade resources so that the optimizer can provide realistic recommendations within my constraints.

**Why this priority**: Resource constraints directly impact which upgrades are achievable. Accurate resource input is essential for practical recommendations.

**Independent Test**: User can input amounts for each resource type, see totals displayed, and modify values. Delivers value by tracking available resources in one place.

**Acceptance Scenarios**:

1. **Given** the resource input panel is displayed, **When** user enters platinum amount, **Then** the value is validated as a positive integer and displayed with formatting (commas for thousands)
2. **Given** user enters resource amounts, **When** user views the resources summary, **Then** all resource types are displayed with their current values and visual indicators
3. **Given** user has entered resource values, **When** user modifies a value to zero or empty, **Then** the interface accepts the input and indicates the resource is unavailable
4. **Given** resource input is complete, **When** user proceeds to optimization, **Then** the resources are validated and passed to the optimization engine

---

### User Story 3 - Optimization Execution & Results (Priority: P1)

As a player, I want to trigger optimization and view prioritized recommendations so that I can make informed decisions about which gems to upgrade.

**Why this priority**: Optimization is the core value proposition of the application. This is the primary reason users visit DI-Lab.

**Independent Test**: User can click optimize button, see loading state, and view ranked recommendations with expected power gains. Delivers immediate actionable intelligence.

**Acceptance Scenarios**:

1. **Given** user has configured gems and resources, **When** user clicks the "Optimize" button, **Then** the interface shows a loading indicator and disables interaction during processing
2. **Given** optimization completes successfully, **When** results are displayed, **Then** recommendations are ranked by priority with clear indicators of power gain per resource invested
3. **Given** optimization results are displayed, **When** user views a recommendation, **Then** the following information is shown: target gem, upgrade path (rank progression), resource cost, expected power gain, and priority ranking
4. **Given** user wants to understand a recommendation, **When** user expands a recommendation card, **Then** additional details appear showing the reasoning and comparison to alternatives
5. **Given** optimization cannot be performed (e.g., no gems selected), **When** user clicks optimize, **Then** the interface displays a clear error message explaining the requirement
6. **Given** optimization returns no viable upgrades (insufficient resources), **When** results are displayed, **Then** the interface indicates that current resources cannot fund any upgrades

---

### User Story 4 - Build Management (Priority: P2)

As a returning player, I want to save my current build configuration so that I can quickly reload it in future sessions without re-entering data.

**Why this priority**: Build persistence improves user experience for repeat visitors but is not required for first-time optimization.

**Independent Test**: User can save a build with a name, see it in their saved builds list, and load it to restore all gem and resource configuration.

**Acceptance Scenarios**:

1. **Given** user has configured a build, **When** user clicks "Save Build", **Then** a modal appears prompting for a build name with optional notes
2. **Given** user saves a build, **When** user navigates to the builds section, **Then** the saved build appears in the list with name, timestamp, and summary stats
3. **Given** user has saved builds, **When** user clicks "Load" on a build, **Then** the interface restores all gem selections, qualities, ranks, and resource amounts
4. **Given** user wants to remove a saved build, **When** user clicks delete on a build, **Then** a confirmation appears and upon confirmation the build is removed
5. **Given** user is not authenticated, **When** user attempts to save a build, **Then** the interface indicates that authentication is required for cloud storage (or allows local-only save)

---

### User Story 5 - Gem Information Reference (Priority: P2)

As a player unfamiliar with certain gems, I want to view detailed gem information so that I can make informed selection decisions.

**Why this priority**: Information access supports decision-making but is secondary to the core optimization flow.

**Independent Test**: User can click on any gem to view its full effect description, tier ranking, and upgrade costs at each rank.

**Acceptance Scenarios**:

1. **Given** user is browsing the gem catalog, **When** user clicks on a gem, **Then** a detail panel/modal appears showing the gem's name, star rating, and full effect description
2. **Given** gem detail view is open, **When** user views effect information, **Then** effects are categorized (OFF, DEF, ALL, etc.) with clear descriptions of what each effect does
3. **Given** gem detail view is open, **When** user views upgrade information, **Then** resource costs for each rank upgrade are displayed
4. **Given** gem detail view is open, **When** user views tier rankings, **Then** the gem's PVP and PVE tier rankings are displayed (S, A, B, C, D)
5. **Given** user wants to quickly compare gems, **When** user hovers over a gem in the catalog, **Then** a tooltip shows key stats and a brief effect summary

---

### User Story 6 - Optimization Constraints & Goals (Priority: P3)

As an advanced player, I want to set optimization preferences so that recommendations align with my specific goals (PVP vs PVE, specific content types).

**Why this priority**: Advanced customization improves recommendation quality but the default optimization provides value without configuration.

**Independent Test**: User can toggle between PVP and PVE optimization modes and see recommendations update accordingly.

**Acceptance Scenarios**:

1. **Given** optimization settings panel is open, **When** user selects optimization mode (PVP/PVE), **Then** the interface indicates the selected mode and subsequent optimizations use appropriate tier rankings
2. **Given** optimization settings panel is open, **When** user sets a maximum resource budget, **Then** recommendations are constrained to not exceed the specified budget
3. **Given** user has set optimization preferences, **When** user runs optimization, **Then** the preferences are applied to the algorithm and reflected in recommendations

---

### User Story 7 - Responsive Mobile Experience (Priority: P2)

As a player using my phone during gameplay, I want the interface to work smoothly on mobile so that I can use DI-Lab while playing Diablo Immortal.

**Why this priority**: Mobile usability is critical for in-game use cases but desktop layout can serve as the design foundation.

**Independent Test**: User can access DI-Lab on a mobile device, navigate all sections, and complete the optimization flow with touch interactions.

**Acceptance Scenarios**:

1. **Given** user accesses DI-Lab on mobile, **When** the page loads, **Then** the layout adapts to the viewport with appropriately sized touch targets
2. **Given** mobile user is viewing the gem catalog, **When** user scrolls through gems, **Then** the catalog scrolls smoothly at 60fps performance (full category loaded per tab, no infinite scroll needed)
3. **Given** mobile user is configuring gems, **When** user interacts with quality/rank selectors, **Then** mobile-friendly input controls are used (dropdowns, sliders, or stepper buttons)
4. **Given** mobile user is viewing optimization results, **When** user scrolls through recommendations, **Then** the results are presented in a mobile-optimized card stack

---

### Edge Cases

- What happens when a user tries to equip the same gem twice in base slots? The interface should prevent duplicate selections in base 8 slots and indicate the gem is already equipped there; duplicates are allowed in resonance wing slots.
- What happens when a user equips/removes a legendary gem? The interface should automatically recalculate total resonance and dynamically update the number of available wing slots based on resonance thresholds (6000=4, 7000=8, 8000=12, 8500+=16).
- What happens when a user has multiple copies of the same gem in their inventory? The app should allow recording multiple identical gems (quantity tracking), though only one can occupy a base slot during optimization.
- What happens when a user enters invalid resource values (negative, non-numeric)? The interface should reject invalid input and display an error message.
- What happens when optimization takes longer than expected? The interface should show a progress indicator and allow cancellation if processing exceeds a reasonable time.
- What happens when a user loses network connection during optimization? The interface should handle errors gracefully and allow retry when connection is restored.
- What happens when a user's saved build contains gems that have been removed from the database? The interface should indicate the deprecated gems and allow removal.
- What happens when a user has very high resource amounts that exceed display formatting? The interface should format numbers >= 1,000,000 with M suffix (e.g., "1.2M platinum"), numbers >= 1,000 with K suffix (e.g., "15.3K platinum"); exact thresholds: >= 1,000,000 uses M, >= 10,000 uses K.
- What happens when a user has DI-Lab open in multiple browser tabs and makes conflicting build changes? The interface should allow concurrent edits but show a non-blocking toast warning (auto-dismiss after 5 seconds with pause on hover) when changes are detected from another tab (optimistic UI pattern).

---

## Requirements

### Functional Requirements

#### Gem Selection & Configuration

- **FR-001**: System MUST display a gem catalog organized by star rating (1-star, 2-star, 5-star) using tabbed category selector, with 5-star category selected by default
- **FR-002**: System MUST display each gem with its name, star rating, and visual icon/placeholder
- **FR-003**: System MUST allow users to select gems from the catalog for equipment
- **FR-004**: System MUST provide quality selection (1-5) for each equipped gem
- **FR-005**: System MUST provide rank selection (1-10) for each equipped gem
- **FR-005a**: System MUST use dropdown select controls for quality and rank selection on equipped gem cards, providing compact mobile-friendly interaction with native accessibility support
- **FR-006**: System MUST limit equipped gems to 8 base slots plus resonance-unlocked slots (up to 24 total: 8 base + 16 from resonance wings). Resonance is automatically calculated from equipped legendary gems and dynamically unlocks wing slots at thresholds (6000 resonance = 4 slots, 7000 = 8 slots, 8000 = 12 slots, 8500+ = 16 slots). No manual resonance input is required.
- **FR-007**: System MUST display equipped gems in a dedicated section showing current configuration, including automatically calculated total resonance from all equipped legendary gems
- **FR-008**: System MUST allow removal of equipped gems
- **FR-008a**: System MUST provide optimistic UI updates for gem add/remove operations with automatic rollback on failure (optimistic update pattern: update UI immediately, revert if server operation fails)
- **FR-009**: System MUST prevent duplicate gem selections in base 8 slots (same gem ID); duplicate gem IDs are allowed in resonance wing slots. Users may record multiple copies of identical gems in their inventory for quantity tracking.

#### Resource Input

- **FR-010**: System MUST provide input fields for upgrade resources (Platinum, Telluric Pearls). Note: Resonance is NOT a manual input; it is auto-calculated from equipped legendary gems.
- **FR-011**: System MUST validate resource inputs as non-negative integers with debounced feedback (300-500ms delay after user stops typing)
- **FR-012**: System MUST display resource values with appropriate number formatting
- **FR-013**: System MUST show a resources summary panel with all configured values
- **FR-014**: System MUST allow clearing/resetting resource values

#### Optimization Execution

- **FR-015**: System MUST provide an "Optimize" button that triggers the optimization process via server-side API route (`/api/optimize`)
- **FR-016**: System MUST display skeleton loaders (gray placeholder shapes mimicking content layout) during data fetching and optimization processing, replaced by actual content when data arrives
- **FR-016a**: System MUST implement skeleton loaders for gem catalog grid (showing placeholder gem cards) and optimization results (showing placeholder recommendation cards)
- **FR-017**: System MUST display a modal overlay during optimization processing that:
  - Shows a progress indicator (spinner or progress bar)
  - Displays elapsed time (optional, updates every second)
  - Provides a Cancel button that remains interactive
  - Visually disables the underlying form with a semi-transparent overlay
  - Prevents all form interactions (clicks, keyboard navigation) on the underlying UI
  - Allows cancellation via the Cancel button or Escape key
- **FR-018**: System MUST display optimization results as prioritized recommendations
- **FR-019**: System MUST show for each recommendation: target gem, upgrade path, resource cost, expected power gain
- **FR-020**: System MUST allow users to expand recommendations for additional details
- **FR-021**: System MUST display typed error messages when optimization cannot be performed, with specific handling for: validation errors (invalid input), insufficient-resources (no viable upgrades), timeout (processing exceeded 30 second limit), and server-error (backend failure)
- **FR-022**: System MUST handle optimization timeout gracefully:
  - Display a timeout warning after 20 seconds with "Still processing..." message
  - Enable cancellation at any time via Cancel button in the modal overlay
  - After 30 seconds, automatically offer cancellation if still processing
  - On cancellation: abort the optimization request, close modal, restore form interactivity
  - Show toast notification confirming cancellation with retry option
- **FR-021a**: System MUST provide actionable guidance for each error type (e.g., "Add more resources" for insufficient-resources, "Check your gem configuration" for validation errors)
- **FR-021b**: System MUST implement single retry with fixed 1s delay for transient optimization API failures before displaying error to user (note: single retry only, not exponential backoff which would require multiple retries with increasing delays)

#### Build Management

- **FR-023**: System MUST restore the last session state (equipped gems, resources, optimization mode) from localStorage when the user loads the optimizer, providing continuity for returning users
- **FR-023a**: System MUST auto-persist session state to localStorage on every change:
  - Auto-save applies to SessionState only (gems, resources, optimizationMode)
  - Auto-save occurs on every user action (gem add/remove, quality/rank change, resource input)
  - Auto-saved session is automatically restored on page load
  - Auto-saved session does NOT create a named build
  - User sees "Session auto-saved" indicator (subtle, non-intrusive)
- **FR-023b**: System MUST show unsaved changes confirmation only for named builds:
  - Confirmation dialog appears when user has an unsaved named build in progress
  - A named build is considered "unsaved" when:
    - User explicitly saved the build, then modified it
    - User started with a loaded named build, then modified it
  - Confirmation does NOT appear for:
    - New session state (auto-persisted, no explicit save)
    - Already saved named builds (no modifications since save)
  - Dialog options: "Save", "Don't Save", "Cancel"
- **FR-023c**: System MUST distinguish between session state and named builds:
  - SessionState: Auto-persisted, restored on load, no confirmation on exit
  - SavedBuild: Explicit save required, confirmation on exit if modified
  - Transition from session to named build occurs when user clicks "Save Build"
- **FR-024**: System MUST provide a "Save Build" action that captures current configuration
- **FR-025**: System MUST prompt for a unique build name when saving, rejecting duplicates with a clear error message
- **FR-026**: System MUST display saved builds in a builds section with name and timestamp
- **FR-027**: System MUST allow loading saved builds to restore configuration
- **FR-028**: System MUST allow deletion of saved builds with confirmation
- **FR-029**: System MUST indicate authentication requirement for cloud storage of builds
- **FR-029a**: System MUST enforce build capacity limits based on subscription tier (free tier: 5 builds maximum, paid tiers: higher limits) and display remaining capacity to the user

#### Gem Information

- **FR-030**: System MUST provide detailed view for each gem showing full effect description
- **FR-031**: System MUST categorize gem effects (OFF, DEF, ALL, DOT, LOC, etc.)
- **FR-032**: System MUST display upgrade cost information for each rank
- **FR-033**: System MUST display tier rankings (PVP and PVE) for each gem
- **FR-034**: System MUST provide hover tooltips with quick gem summaries on desktop; on mobile/touch devices, provide tap-to-reveal info button or long-press gesture alternative with visual feedback

#### Optimization Preferences

- **FR-035**: System MUST provide optimization mode selection (PVP/PVE) with PVE as the default selection
- **FR-036**: System MUST apply selected mode to optimization algorithm
- **FR-037**: System MUST display the currently active optimization mode
- **FR-037a**: System MUST allow optional maximum resource budget constraint input that limits optimization recommendations to a user-specified platinum/pearls ceiling

#### Responsive Design

- **FR-038**: System MUST adapt layout for mobile viewport sizes using Tailwind default breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px)
- **FR-039**: System MUST provide touch-friendly interaction targets on mobile
- **FR-040**: System MUST ensure all core functionality is accessible on mobile devices
- **FR-041**: System MUST optimize scrolling performance for long lists on mobile

#### Accessibility

- **FR-042**: System MUST conform to WCAG 2.1 AA accessibility standards
- **FR-043**: System MUST provide keyboard navigation for all interactive elements
- **FR-044**: System MUST include appropriate ARIA labels and roles for screen reader support
- **FR-044a**: System MUST provide screen reader announcements for critical optimization events:
  - **Optimization completion**: Announce "Optimization complete. X recommendations found."
  - **Optimization error**: Announce the error title and guidance from FR-021
  - **Optimization cancellation**: Announce "Optimization cancelled."
  - Do NOT announce loading start (modal overlay already indicates progress)
  - Use aria-live="polite" region for non-intrusive announcements
  - Use aria-live="assertive" for error announcements requiring immediate attention
- **FR-045**: System MUST maintain sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **FR-046**: System MUST prevent XSS attacks in user-entered content:
  - Build names (1-50 characters) and notes (0-500 characters) are user-controllable
  - React's JSX auto-escaping provides baseline protection against injection
  - Additional sanitization required for defense-in-depth:
    - Strip HTML tags from build names and notes before storage
    - Escape special characters (< > & " ') on display
    - Reject content containing javascript: or data: URLs
  - Server-side validation must mirror client-side validation
  - Content Security Policy (CSP) header must be configured to prevent inline script execution

---

## Key Entities

### EquippedGem

Represents a gem selected by the user with specific configuration:

- **Gem Reference**: Identifier linking to the gem database
- **Quality**: Star rating (1-5) indicating gem quality
- **Rank**: Current upgrade rank (1-10)
- **Slot Position**: Position in the equipped gems grid (1-24, where 1-8 are base gear slots and 9-24 are resonance-unlocked wing slots)
- **Resonance Contribution**: Amount of resonance this gem provides (auto-calculated based on gem type, quality, and rank)

### ResourceInventory

Represents the user's available upgrade resources:

- **Platinum**: Amount of platinum currency available
- **Telluric Pearls**: Amount of Telluric Pearls available
- **Additional Resources**: Other upgrade materials as needed

### OptimizationResult

Represents the output of an optimization calculation:

- **Recommendations**: Ordered list of upgrade suggestions
- **Total Power Gain**: Sum of expected power improvements
- **Total Resource Cost**: Sum of resources required for all recommendations
- **Mode**: The optimization mode used (PVP/PVE)

### UpgradeRecommendation

Represents a single upgrade suggestion:

- **Target Gem**: The gem to upgrade
- **Current Rank**: Starting rank
- **Target Rank**: Destination rank
- **Resource Cost**: Resources required for this upgrade
- **Power Gain**: Expected improvement in combat rating/resonance
- **Priority Rank**: Position in the recommendation list

### SavedBuild

Represents a persisted build configuration:

- **Build Name**: User-provided identifier
- **Equipped Gems**: List of configured gems
- **Resources**: Resource amounts at save time
- **Timestamp**: When the build was saved
- **Notes**: Optional user notes

---

## UI Component Hierarchy

### Layout Components

```
App Layout
|-- Header
|   |-- Logo
|   |-- Navigation
|   |-- User Menu (authenticated)
|-- Main Content Area
|   |-- Optimizer View
|   |-- Builds View
|-- Footer
```

### Optimizer Page Components

```
Optimizer Page
|-- Gem Selection Panel
|   |-- Star Rating Tabs
|   |-- Gem Catalog Grid
|   |   |-- Gem Card (catalog view)
|   |       |-- Gem Icon
|   |       |-- Gem Name
|   |       |-- Quick Add Button
|   |-- Search/Filter Bar
|-- Equipped Gems Panel
|   |-- Slot Grid (8 base slots + up to 16 resonance-unlocked wing slots, dynamically unlocked based on auto-calculated resonance)
|   |   |-- Equipped Gem Card
|   |       |-- Gem Display
|   |       |-- Quality Selector
|   |       |-- Rank Selector
|   |       |-- Remove Button
|   |-- Summary Stats (auto-calculated resonance total, CR totals, unlocked wing slots indicator)
|-- Resources Panel
|   |-- Resource Input Fields
|   |   |-- Platinum Input
|   |   |-- Telluric Pearls Input
|   |-- Resources Summary Display
|   |-- Note: Resonance displayed in Equipped Gems Panel, not here
|-- Optimization Controls
|   |-- Optimization Mode Selector
|   |-- Optimize Button
|-- Results Panel
|   |-- Results Summary
|   |-- Recommendations List
|   |   |-- Recommendation Card
|   |       |-- Priority Badge
|   |       |-- Target Gem Display
|   |       |-- Upgrade Path
|   |       |-- Cost Summary
|   |       |-- Power Gain
|   |       |-- Expand Details Button
|   |       |-- Details Expansion
|-- Save Build Modal
|   |-- Build Name Input
|   |-- Notes Input
|   |-- Save/Cancel Actions
```

### Gem Detail Components

```
Gem Detail Modal/Panel
|-- Gem Header
|   |-- Gem Icon
|   |-- Gem Name
|   |-- Star Rating
|-- Effect Categories
|   |-- Effect Section
|   |   |-- Category Label
|   |   |-- Effect Description
|-- Upgrade Costs Table
|   |-- Rank Column
|   |-- Cost Columns
|-- Tier Rankings
|   |-- PVP Tier
|   |-- PVE Tier
|-- Action Buttons
|   |-- Add to Build
|   |-- Close
```

### Builds Page Components

```
Builds Page
|-- Saved Builds List
|   |-- Build Card
|   |   |-- Build Name
|   |   |-- Timestamp
|   |   |-- Summary Stats
|   |   |-- Actions (Load, Delete)
|-- Empty State (no builds)
```

---

## State Management Requirements

### Client-Side State

The UI uses React's built-in state management (useState/useContext) for all client-side state. This approach is sufficient for the P1-P3 scope without over-engineering.

The UI requires management of the following state:

#### Selection State

- **Selected Gems**: Array of currently equipped gems with their configurations
- **Active Slot**: Which slot is currently being configured (if any)
- **Catalog Filter**: Current filter/search criteria for gem catalog
- **Active Star Rating Tab**: Which star rating category is displayed (default: 5-star)
- **Total Resonance**: Auto-calculated sum of resonance from all equipped legendary gems
- **Unlocked Wing Slots**: Number of resonance-unlocked slots available (derived from total resonance thresholds)

#### Resource State

- **Platinum Amount**: User-entered platinum value
- **Pearls Amount**: User-entered Telluric Pearls value
- **Validation State**: Whether inputs are valid

#### Optimization State

- **Is Loading**: Boolean indicating optimization in progress
- **Results**: Current optimization results or null
- **Error**: Error message if optimization failed
- **Mode**: Current optimization mode (PVP/PVE)
- **Expanded Recommendations**: Which recommendation details are expanded

#### UI State

- **Current View**: Which page/section is active
- **Modal State**: Whether any modal is open and which one
- **Tooltips**: Hover state for tooltips
- **Mobile Menu**: Whether mobile navigation is open

#### Build State

- **Saved Builds**: List of persisted builds
- **Current Build**: The active build being configured
- **Is Saving**: Whether save operation is in progress

---

## Interaction Patterns

### Gem Selection Flow

1. User browses gem catalog (filtered by star rating or search)
2. User clicks gem card to open detail view OR clicks quick-add
3. If detail view: User reviews information and clicks "Add to Build"
4. Gem appears in first available slot in Equipped Gems Panel
5. User configures quality and rank using selectors on the equipped gem card
6. Summary stats update automatically (resonance recalculated, wing slots dynamically unlocked if thresholds reached)

### Resource Input Flow

1. User clicks resource input field
2. User types numeric value
3. Input is validated on blur or change
4. Summary display updates with formatted values
5. Validation state is visually indicated

### Optimization Flow

1. User verifies gems and resources are configured
2. User optionally selects optimization mode (PVP/PVE)
3. User clicks "Optimize" button
4. Loading state appears, button becomes disabled
5. Optimization processes (client or server)
6. Results appear in Results Panel
7. User browses recommendations, expands for details
8. User can re-optimize with different parameters

### Build Save Flow

1. User clicks "Save Build"
2. Modal appears with name input
3. User enters build name and optional notes
4. User clicks "Save"
5. Confirmation appears
6. Build is added to saved builds list

### Build Load Flow

1. User navigates to Builds page
2. User sees list of saved builds
3. User clicks "Load" on desired build
4. Optimizer page appears with build configuration restored
5. User can modify and re-optimize

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can complete the full optimization flow (select gems, enter resources, receive recommendations) in under 3 minutes on first use
- **SC-002**: Optimization results display within 5 seconds of clicking the Optimize button
- **SC-003**: 90% of users successfully add at least one gem to their build on first attempt
- **SC-004**: Mobile users can complete the optimization flow with no horizontal scrolling required
- **SC-005**: All interactive elements have touch targets of at least 44x44 pixels on mobile
- **SC-006**: Saved builds load in under 2 seconds
- **SC-007**: Gem catalog scrolls smoothly at 60fps on mid-range mobile devices
- **SC-008**: 95% of users understand optimization results without external documentation
- **SC-009**: All form validation errors provide clear, actionable guidance
- **SC-010**: Interface renders correctly on viewports from 320px to 1920px width

---

## Assumptions

1. **Gem Database Available**: The UI assumes a data source containing gem information (names, effects, costs, tier rankings) for approximately 50-100 gems
2. **Optimization Algorithm Exists**: The UI assumes an optimization engine is available to process inputs and return recommendations (out of scope for this spec)
3. **Local Storage for Builds**: Free tier builds are stored in browser localStorage as JSON structure (array of build objects) until authentication is implemented
4. **Image Assets**: Gem icons/visuals are available or placeholder graphics are acceptable initially
5. **Single-Language Support**: Initial implementation targets English-only; localization is future work
6. **No Offline Mode**: Application requires network connectivity for optimization calculations

---

## Out of Scope

The following items are explicitly out of scope for this UI specification:

1. **Optimization Algorithm**: The calculation engine itself is separate from UI
2. **Battle.net Authentication**: Authentication flow is deferred to a later phase
3. **Screenshot OCR**: Screenshot upload and gem detection is a future feature
4. **Backend APIs**: Server-side endpoints for optimization and data storage
5. **Database Schema**: Data persistence layer design
6. **Payment Integration**: Monetization features are future work
7. **DI Days Integration**: External event data integration
8. **Build Sharing**: Sharing builds with other users is future work
9. **Analytics Dashboard**: Historical tracking and analytics are future work
10. **Localization**: Multi-language support is future work

---

## Clarifications

### Session 2026-02-14

- Q: Should we use placeholder graphics initially, or are official/representative gem icons available?  
  A: Source representative icons from community - More authentic experience, potential licensing considerations

- Q: What is the correct maximum gem slot configuration?  
  A: 8 base slots from gear + up to 16 resonance-unlocked wing slots (4 at 6000, 8 at 7000, 12 at 8000, 16 at 8500+ resonance) for a theoretical maximum of 24 total slots. Reference: docs/legendary-gems/upgrading.md#resonance-wings

- Q: How should the UI interface with the optimization algorithm?  
  A: Server-side API route (`/api/optimize`) - UI POSTs inputs, receives JSON results

- Q: What is the expected size of the gem catalog?  
  A: 50-100 gems

- Q: What WCAG accessibility compliance level should the UI target?  
  A: WCAG 2.1 AA (standard compliance for public web applications)

- Q: What defines a "duplicate" gem for FR-009?  
  A: Base 8 slots: only one gem ID allowed (duplicates ignored in calculation). Resonance wing slots: duplicate gem IDs allowed. This matches game behavior where multiple same gems can be equipped but only one activates in base slots. Note: Players can own unlimited copies of the same gem type and rank in-game; the app requires users to explicitly specify each gem in their inventory (quantity tracking). "Duplicate" in FR-009 refers to equipping restrictions, not inventory limitations—the app should allow users to record multiple copies of identical gems they own, even though only one can occupy a base slot during optimization.

- Q: What storage format should be used for local build persistence?  
  A: JSON structure in localStorage (array of build objects)

- Q: How is resonance determined?  
  A: Resonance is calculated automatically from equipped legendary gems; no manual input required. Legendary gems are the sole source of Resonance.

- Q: What error handling strategy should the UI implement for optimization failures?  
  A: Typed error handling - Define specific error types (validation, insufficient-resources, timeout, server-error) with tailored UI for each

- Q: What loading state pattern should the UI use for the gem catalog and optimization results?  
  A: Skeleton loaders - Gray placeholder shapes that mimic content layout, replaced when data arrives

- Q: When should input validation feedback be displayed to the user?  
  A: Debounced validation - Wait 300-500ms after user stops typing, then validate and show feedback

- Q: Should saved build names be required to be unique per user?  
  A: Unique names enforced - Prevent duplicate build names, prompt user to choose a different name

- Q: Should there be a maximum limit on the number of saved builds per user?  
  A: Tiered subscription model - Build capacity varies by subscription tier (free tier: limited, paid tiers: higher limits)

- Q: What should happen when a user has DI-Lab open in multiple browser tabs and makes conflicting build changes?  
  A: Optimistic UI with warning - Allow concurrent edits but show a non-blocking toast warning when changes are detected from another tab

- Q: What should be the default optimization mode when a user first loads the optimizer?  
  A: PVE as default - PVE content represents the majority of gameplay for most Diablo Immortal players

- Q: What timeout threshold should the UI use before offering a cancellation option during optimization?  
  A: 30 seconds - Provides sufficient time for complex calculations while giving users a reasonable bound

- Q: How should the gem catalog display the 50-100 gems for user browsing?  
  A: Tabbed category selector with full category load - Tabs for 1-star, 2-star, 5-star categories; load entire selected category at once; 5-star selected by default; infinite scroll batching not needed

- Q: What state management approach should the UI use for client-side state?  
  A: React useState/useContext - Sufficient for P1-P3 scope without over-engineering; avoids adding complexity without clear benefit

- Q: What should be the initial state when a user loads the optimizer?  
  A: Restore last session - Load previous gems/resources from localStorage for returning users, providing continuity and reducing friction

- Q: What should happen if a user navigates away from the optimizer with unsaved changes?  
  A: Show confirmation dialog - Prevent accidental data loss when user attempts to close tab or navigate away with unsaved changes

- Q: What UI control pattern should be used for quality (1-5) and rank (1-10) selection on equipped gem cards?  
  A: Dropdown select - Compact, mobile-friendly, familiar UX pattern with native accessibility support

- Q: What should be the specific build capacity limit for free tier users?  
  A: 5 builds - Provides meaningful value for free users while creating natural upgrade incentive

- Q: How frequently should session state be auto-persisted to localStorage?  
  A: On every change - Ensures users never lose data, simpler implementation without debounce edge cases

- Q: What mobile responsive breakpoint strategy should the UI use?  
  A: Tailwind defaults (sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px) - Industry-standard, well-tested, aligns with Tailwind CSS 4

- Q: What toast notification behavior should the UI use for multi-tab conflict warnings?  
  A: Auto-dismiss after 5 seconds with pause on hover - Users have enough time to read, can pause if needed, doesn't persist indefinitely

- Q: What API retry strategy should the UI use for transient optimization failures?  
  A: Single retry with fixed 1s delay - Resilience without over-complication (note: single retry only, not exponential backoff)

- Q: How should the gem catalog data be loaded by the UI?  
  A: Static JSON bundled at build time - Fastest load time, no API latency, works offline for viewing; updated via code deployment when game patches release

---

**Version**: 1.0.0 | **Last Updated**: 2026-02-14
