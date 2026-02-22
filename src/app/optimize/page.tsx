"use client";

/**
 * Optimize Page - Gem Selection, Resource Input, and Optimization
 *
 * User Story 1: Gem Inventory Entry
 * - Select gems from catalog
 * - Configure quality and rank
 * - View equipped gems with resonance calculation
 *
 * User Story 2: Resource Specification
 * - Input available resources
 * - Session persistence
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { EquippedGem, LegendaryGem, Quality, Rank } from "@/types/gem";
import type { ResourceInventory, SessionState, SavedBuild } from "@/types";
import { deriveSlotType } from "@/types/gem";
import { createEmptySessionState } from "@/types";
import GemCatalog from "@/components/gems/GemCatalog";
import GemDetail from "@/components/gems/GemDetail";
import ResourceInput from "@/components/optimization/ResourceInput";
import Card, { CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  getNextAvailableSlot,
  canAddGemToSlot,
  getTotalAvailableSlots,
  isAtMaxCapacity,
} from "@/lib/utils/slots";
import { getResonanceInfo } from "@/lib/utils/resonance";
import {
  getOrCreateAnonymousId,
  fetchSessionState,
  persistSessionState,
  handleSessionInvalidation,
} from "@/lib/session/anonymous-session";
import { ALL_GEMS, GEM_MAP } from "@/lib/data/gems";
import {
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  Save,
  AlertTriangle,
  Sword,
  Shield,
  Zap,
} from "lucide-react";
import type { OptimizationMode } from "@/types/gem";

// ============================================================================
// Quality and Rank Options
// ============================================================================

const QUALITY_OPTIONS = [
  { value: "2", label: "2★" },
  { value: "3", label: "3★" },
  { value: "4", label: "4★" },
  { value: "5", label: "5★" },
];

const RANK_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `Rank ${i + 1}`,
}));

// ============================================================================
// Page Component
// ============================================================================

export default function OptimizePage() {
  // Session state
  const [anonymousId, setAnonymousId] = useState<string>("");
  const [sessionState, setSessionState] = useState<SessionState>(() =>
    createEmptySessionState(),
  );
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Build management state (T078, T079, T081)
  const [loadedBuildId, setLoadedBuildId] = useState<string | null>(null);
  const [loadedBuildName, setLoadedBuildName] = useState<string | null>(null);
  const [deprecatedGems, setDeprecatedGems] = useState<EquippedGem[]>([]);

  // Debounced save timer ref
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State for gem detail modal
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null);
  const [showGemDetail, setShowGemDetail] = useState(false);

  // Extract state from session
  const equippedGems = sessionState.gems;
  const resources = sessionState.resources;
  const optimizationMode = sessionState.optimizationMode;
  const advancedStrategies = sessionState.advancedStrategies ?? false;

  // ============================================================================
  // Session Management
  // ============================================================================

  // Initialize anonymous ID and load session on mount
  useEffect(() => {
    const initSession = async () => {
      const id = getOrCreateAnonymousId();
      setAnonymousId(id);

      try {
        const result = await fetchSessionState(id);
        if (result.success) {
          setSessionState(result.data);
        } else {
          // Session not found or expired - create new
          const newState = createEmptySessionState();
          setSessionState(newState);
          // Save the new session
          await persistSessionState(id, newState);
        }
      } catch (error) {
        console.error("Failed to load session:", error);
        setSessionError("Failed to load session");
      } finally {
        setIsLoadingSession(false);
      }
    };

    initSession();

    // Cleanup save timer on unmount
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // T078: Load build from sessionStorage (from builds page)
  useEffect(() => {
    const loadBuildFromStorage = () => {
      const buildJson = sessionStorage.getItem("di-lab-load-build");
      if (!buildJson) return;

      try {
        const build: SavedBuild = JSON.parse(buildJson);

        // Detect deprecated gems (T081)
        const deprecated: EquippedGem[] = [];
        const validGems: EquippedGem[] = [];

        for (const gem of build.gems) {
          if (GEM_MAP.has(gem.gemId)) {
            validGems.push(gem);
          } else {
            deprecated.push(gem);
          }
        }

        if (deprecated.length > 0) {
          setDeprecatedGems(deprecated);
        }

        // Set session state with the loaded build
        setSessionState({
          gems: validGems,
          resources: build.resources,
          optimizationMode: build.optimizationMode,
          updatedAt: new Date().toISOString(),
        });

        setLoadedBuildId(build.id);
        setLoadedBuildName(build.name);

        // Clear sessionStorage after loading
        sessionStorage.removeItem("di-lab-load-build");
      } catch (error) {
        console.error("Failed to load build from sessionStorage:", error);
      }
    };

    loadBuildFromStorage();
  }, []);

  // T079: beforeunload confirmation for unsaved named builds
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show confirmation if a named build is loaded (has been explicitly saved)
      if (loadedBuildName) {
        e.preventDefault();
        // Standard requires returnValue to be set
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [loadedBuildName]);

  // Remove deprecated gem handler (T081)
  const handleRemoveDeprecatedGem = useCallback((gemId: string) => {
    setDeprecatedGems((prev) => prev.filter((g) => g.gemId !== gemId));
  }, []);

  // Clear all deprecated gems handler (T081)
  const handleClearDeprecatedGems = useCallback(() => {
    setDeprecatedGems([]);
  }, []);

  // Auto-save session state with debounce
  const saveSession = useCallback(
    (state: SessionState) => {
      // Cancel any pending save
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      // Debounce save by 500ms
      saveTimerRef.current = setTimeout(async () => {
        if (!anonymousId) return;

        const result = await persistSessionState(anonymousId, state);
        if (result.success) {
          setLastSaved(new Date());
        } else if (result.error === "Session expired") {
          // Handle session invalidation (T040a)
          const { anonymousId: newId, sessionState: newSession } =
            await handleSessionInvalidation(state);
          setAnonymousId(newId);
          setSessionState(newSession);
          setSessionError("Session expired. A new session has been created.");
          // Clear error after 5 seconds
          setTimeout(() => setSessionError(null), 5000);
        }
      }, 500);
    },
    [anonymousId],
  );

  // Update session state and trigger auto-save
  const updateSessionState = useCallback(
    (updates: Partial<SessionState>) => {
      const newState = {
        ...sessionState,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      setSessionState(newState);
      saveSession(newState);
    },
    [sessionState, saveSession],
  );

  // ============================================================================
  // Gem Management
  // ============================================================================

  // Calculate resonance info
  const resonanceInfo = useMemo(() => {
    return getResonanceInfo(equippedGems, GEM_MAP);
  }, [equippedGems]);

  // Check if at max capacity
  const atCapacity = useMemo(() => {
    return isAtMaxCapacity(equippedGems, resonanceInfo.total);
  }, [equippedGems, resonanceInfo.total]);

  // Get available slots count
  const availableSlotCount = useMemo(() => {
    const total = getTotalAvailableSlots(resonanceInfo.total);
    return total - equippedGems.length;
  }, [equippedGems.length, resonanceInfo.total]);

  // Handle adding a gem
  const handleAddGem = useCallback(
    (gemId: string) => {
      if (atCapacity) return;

      const nextSlot = getNextAvailableSlot(equippedGems, resonanceInfo.total);
      if (nextSlot === null) return;

      const gem = GEM_MAP.get(gemId);
      if (!gem) return;

      // Check duplicate rule for base slots
      const result = canAddGemToSlot(
        gemId,
        nextSlot,
        equippedGems,
        resonanceInfo.total,
      );
      if (!result.allowed) {
        console.warn(result.reason);
        return;
      }

      // Default quality: 5 for 5-star gems, 1 for others
      const defaultQuality: Quality = gem.starRating === 5 ? 5 : 1;

      const newGem: EquippedGem = {
        gemId,
        quality: defaultQuality,
        rank: 1,
        slotPosition: nextSlot,
        slotType: deriveSlotType(nextSlot),
      };

      updateSessionState({
        gems: [...equippedGems, newGem],
      });
    },
    [equippedGems, resonanceInfo.total, atCapacity, updateSessionState],
  );

  // Handle removing a gem
  const handleRemoveGem = useCallback(
    (slotPosition: number) => {
      updateSessionState({
        gems: equippedGems.filter((gem) => gem.slotPosition !== slotPosition),
      });
    },
    [equippedGems, updateSessionState],
  );

  // Handle quality change
  const handleQualityChange = useCallback(
    (slotPosition: number, quality: Quality) => {
      updateSessionState({
        gems: equippedGems.map((gem) =>
          gem.slotPosition === slotPosition ? { ...gem, quality } : gem,
        ),
      });
    },
    [equippedGems, updateSessionState],
  );

  // Handle rank change
  const handleRankChange = useCallback(
    (slotPosition: number, rank: Rank) => {
      updateSessionState({
        gems: equippedGems.map((gem) =>
          gem.slotPosition === slotPosition ? { ...gem, rank } : gem,
        ),
      });
    },
    [equippedGems, updateSessionState],
  );

  // Handle resource change
  const handleResourcesChange = useCallback(
    (newResources: ResourceInventory) => {
      updateSessionState({
        resources: newResources,
      });
    },
    [updateSessionState],
  );

  // Handle optimization mode change (T096)
  const handleOptimizationModeChange = useCallback(
    (mode: OptimizationMode) => {
      updateSessionState({
        optimizationMode: mode,
      });
    },
    [updateSessionState],
  );

  // Handle advanced strategies toggle (T100a - FR-037b)
  const handleAdvancedStrategiesChange = useCallback(
    (enabled: boolean) => {
      updateSessionState({
        advancedStrategies: enabled,
      });
    },
    [updateSessionState],
  );

  // Handle viewing gem details
  const handleViewGemDetail = useCallback((gemId: string) => {
    setSelectedGemId(gemId);
    setShowGemDetail(true);
  }, []);

  // Close gem detail modal
  const handleCloseGemDetail = useCallback(() => {
    setShowGemDetail(false);
    setSelectedGemId(null);
  }, []);

  // Get gem for detail view
  const selectedGem = selectedGemId ? GEM_MAP.get(selectedGemId) : null;

  // ============================================================================
  // Loading State
  // ============================================================================

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your session...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Optimize Your Build
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                Select and configure your legendary gems to optimize your build
              </p>
            </div>
            {/* Auto-save indicator (T080) */}
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Save className="w-4 h-4" />
                <span>Auto-saved</span>
              </div>
            )}
          </div>
        </div>

        {/* Session Error Toast */}
        {sessionError && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800">{sessionError}</p>
          </div>
        )}

        {/* Deprecated Gems Warning (T081) */}
        {deprecatedGems.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800">
                  Deprecated Gems Detected
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  The following gems are no longer in the database and cannot be
                  used:
                </p>
                <ul className="mt-2 space-y-1">
                  {deprecatedGems.map((gem) => (
                    <li
                      key={gem.gemId}
                      className="flex items-center gap-2 text-sm text-red-700"
                    >
                      <span className="font-mono">{gem.gemId}</span>
                      <span className="text-red-500">
                        (Slot {gem.slotPosition})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDeprecatedGem(gem.gemId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearDeprecatedGems}
                  className="mt-3"
                >
                  Clear All Deprecated Gems
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loaded Build Indicator (T078) */}
        {loadedBuildName && (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-purple-800">
                Editing: <strong>{loadedBuildName}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Gem Catalog */}
          <div className="lg:col-span-2">
            <Card padding="md">
              <CardBody>
                <GemCatalog
                  gems={ALL_GEMS}
                  onGemSelect={(gem: LegendaryGem) => handleAddGem(gem.id)}
                />
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Equipped Gems & Stats */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card padding="md">
              <div className="border-b border-gray-200 pb-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Build Stats
                </h3>
              </div>
              <CardBody>
                <div className="space-y-4">
                  {/* Optimization Mode Toggle (T096) */}
                  <div className="pb-3 border-b border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">
                      Optimization Mode
                    </div>
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleOptimizationModeChange("PVE")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                          optimizationMode === "PVE"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-pressed={optimizationMode === "PVE"}
                        aria-label="PVE Mode"
                      >
                        <Shield className="w-4 h-4" />
                        <span>PVE</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptimizationModeChange("PVP")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                          optimizationMode === "PVP"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-pressed={optimizationMode === "PVP"}
                        aria-label="PVP Mode"
                      >
                        <Sword className="w-4 h-4" />
                        <span>PVP</span>
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">
                      {optimizationMode === "PVE"
                        ? "Optimizing for dungeons and raids"
                        : "Optimizing for battlegrounds and arenas"}
                    </p>
                  </div>

                  {/* Advanced Strategies Toggle (T100a - FR-037b) */}
                  <div className="pb-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Advanced Strategies
                        </span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={advancedStrategies}
                        onClick={() =>
                          handleAdvancedStrategiesChange(!advancedStrategies)
                        }
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                          advancedStrategies ? "bg-purple-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            advancedStrategies
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">
                      {advancedStrategies
                        ? "Including dormant 5-star gem infusion paths"
                        : "Enable for infusion upgrade recommendations"}
                    </p>
                  </div>

                  {/* Total Resonance */}
                  <div>
                    <div className="text-sm text-gray-500">Total Resonance</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {resonanceInfo.total.toLocaleString()}
                    </div>
                  </div>

                  {/* Wing Slots */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Wing Slots</div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-semibold">
                        {resonanceInfo.unlockedWingSlots}
                      </span>
                      <span className="text-gray-400">/ 16</span>
                    </div>
                  </div>

                  {/* Available Slots */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Available Slots</div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-semibold">
                        {availableSlotCount}
                      </span>
                      <span className="text-gray-400">
                        / {resonanceInfo.totalSlots}
                      </span>
                    </div>
                  </div>

                  {/* Next Threshold */}
                  {resonanceInfo.nextThreshold && (
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Next Threshold
                      </div>
                      <div className="text-lg font-semibold text-gray-700">
                        {resonanceInfo.nextThreshold.toLocaleString()} resonance
                      </div>
                      <div className="text-sm text-gray-400">
                        {resonanceInfo.resonanceToNext.toLocaleString()} more
                        needed
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Equipped Gems Card */}
            <Card padding="md">
              <div className="border-b border-gray-200 pb-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Equipped Gems
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {equippedGems.length} of {resonanceInfo.totalSlots} slots
                </p>
              </div>
              <CardBody>
                {equippedGems.length === 0 ? (
                  // Empty State (T031)
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">No gems equipped</p>
                    <p className="text-sm text-gray-400">
                      Browse the catalog and click gems to add them
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {equippedGems.map((equipped) => {
                      const gem = GEM_MAP.get(equipped.gemId);
                      if (!gem) return null;

                      return (
                        <div
                          key={equipped.slotPosition}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          {/* Slot indicator */}
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-sm font-medium text-gray-600">
                            {equipped.slotPosition}
                          </div>

                          {/* Gem info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 truncate">
                                {gem.name}
                              </span>
                              {gem.starRating === 5 && (
                                <span className="flex-shrink-0 px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded">
                                  5★
                                </span>
                              )}
                            </div>

                            {/* Quality and Rank selectors */}
                            <div className="flex items-center gap-2 mt-1">
                              {gem.starRating === 5 && (
                                <Select
                                  value={String(equipped.quality)}
                                  onChange={(value) =>
                                    handleQualityChange(
                                      equipped.slotPosition,
                                      Number(value) as Quality,
                                    )
                                  }
                                  options={QUALITY_OPTIONS}
                                  className="text-xs py-1 px-2"
                                />
                              )}
                              <Select
                                value={String(equipped.rank)}
                                onChange={(value) =>
                                  handleRankChange(
                                    equipped.slotPosition,
                                    Number(value) as Rank,
                                  )
                                }
                                options={RANK_OPTIONS}
                                className="text-xs py-1 px-2"
                              />
                            </div>
                          </div>

                          {/* Remove button - 44x44px touch target (T089) */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveGem(equipped.slotPosition)
                            }
                            aria-label={`Remove ${gem.name}`}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Resource Input Card (T033) */}
            <Card padding="md">
              <CardBody>
                <ResourceInput
                  resources={resources}
                  onResourcesChange={handleResourcesChange}
                  gemDatabase={GEM_MAP}
                  debounceMs={300}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Gem Detail Modal */}
      {selectedGem && (
        <GemDetail
          gem={selectedGem}
          isOpen={showGemDetail}
          onClose={handleCloseGemDetail}
          onAdd={(gem: LegendaryGem) => {
            handleAddGem(gem.id);
          }}
          showAddButton={
            !atCapacity && !equippedGems.some((g) => g.gemId === selectedGem.id)
          }
        />
      )}
    </div>
  );
}
