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
import type { ResourceInventory, SessionState } from "@/types";
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
import { Plus, Trash2, Sparkles, AlertCircle, Save } from "lucide-react";

// ============================================================================
// Mock Gem Database (will be replaced with real data)
// ============================================================================

// Sample gems for development - will be loaded from src/data/gems.json
const MOCK_GEMS: LegendaryGem[] = [
  {
    id: "blood-soaked-jade",
    name: "Blood-Soaked Jade",
    starRating: 5,
    effects: [
      {
        category: "OFF",
        type: "permanent",
        description: "Increases damage dealt and reduces damage taken",
        maxValues: { damageIncrease: "10%", damageReduction: "10%" },
        isStrifed: false,
      },
    ],
    effectCategories: ["OFF", "DEF"],
    pvpTier: "S",
    pveTier: "S",
    upgradeCosts: [],
    resonanceTable: {
      byQuality: {
        2: {
          1: 30,
          2: 110,
          3: 190,
          4: 280,
          5: 370,
          6: 460,
          7: 550,
          8: 640,
          9: 730,
          10: 820,
        },
        3: {
          1: 60,
          2: 140,
          3: 230,
          4: 320,
          5: 410,
          6: 500,
          7: 590,
          8: 680,
          9: 770,
          10: 860,
        },
        4: {
          1: 90,
          2: 180,
          3: 270,
          4: 360,
          5: 450,
          6: 540,
          7: 630,
          8: 720,
          9: 810,
          10: 900,
        },
        5: {
          1: 100,
          2: 200,
          3: 300,
          4: 400,
          5: 500,
          6: 600,
          7: 700,
          8: 800,
          9: 900,
          10: 1000,
        },
      },
    },
  },
  {
    id: "seeping-bile",
    name: "Seeping Bile",
    starRating: 5,
    effects: [
      {
        category: "OFF",
        type: "DOT",
        description: "Attacks have a chance to poison enemies",
        maxValues: { poisonChance: "20%", poisonDamage: "100%" },
        isStrifed: true,
      },
    ],
    effectCategories: ["OFF", "DOT"],
    pvpTier: "S",
    pveTier: "A",
    upgradeCosts: [],
    resonanceTable: {
      byQuality: {
        2: {
          1: 30,
          2: 110,
          3: 190,
          4: 280,
          5: 370,
          6: 460,
          7: 550,
          8: 640,
          9: 730,
          10: 820,
        },
        3: {
          1: 60,
          2: 140,
          3: 230,
          4: 320,
          5: 410,
          6: 500,
          7: 590,
          8: 680,
          9: 770,
          10: 860,
        },
        4: {
          1: 90,
          2: 180,
          3: 270,
          4: 360,
          5: 450,
          6: 540,
          7: 630,
          8: 720,
          9: 810,
          10: 900,
        },
        5: {
          1: 100,
          2: 200,
          3: 300,
          4: 400,
          5: 500,
          6: 600,
          7: 700,
          8: 800,
          9: 900,
          10: 1000,
        },
      },
    },
  },
  {
    id: "blessing-of-the-worthy",
    name: "Blessing of the Worthy",
    starRating: 2,
    effects: [
      {
        category: "DEF",
        type: "Buff",
        description: "Taking damage has a chance to grant a shield",
        maxValues: { shieldChance: "20%", shieldAmount: "30% Max HP" },
        isStrifed: true,
      },
    ],
    effectCategories: ["DEF"],
    pvpTier: "A",
    pveTier: "B",
    upgradeCosts: [],
    resonanceTable: {
      byRank: {
        1: 30,
        2: 60,
        3: 90,
        4: 120,
        5: 150,
        6: 180,
        7: 210,
        8: 240,
        9: 270,
        10: 300,
      },
    },
  },
  {
    id: "everlasting-torment",
    name: "Everlasting Torment",
    starRating: 2,
    effects: [
      {
        category: "OFF",
        type: "DOT",
        description: "Critical hits apply a bleeding effect",
        maxValues: { bleedChance: "100%", bleedDamage: "100%" },
        isStrifed: true,
      },
    ],
    effectCategories: ["OFF", "DOT"],
    pvpTier: "B",
    pveTier: "A",
    upgradeCosts: [],
    resonanceTable: {
      byRank: {
        1: 30,
        2: 60,
        3: 90,
        4: 120,
        5: 150,
        6: 180,
        7: 210,
        8: 240,
        9: 270,
        10: 300,
      },
    },
  },
  {
    id: "power-and-command",
    name: "Power and Command",
    starRating: 1,
    effects: [
      {
        category: "OFF",
        type: "permanent",
        description: "Increases Primary Attack damage",
        maxValues: { primaryAttackDamage: "12%" },
        isStrifed: false,
      },
    ],
    effectCategories: ["OFF"],
    pvpTier: "B",
    pveTier: "B",
    upgradeCosts: [],
    resonanceTable: {
      byRank: {
        1: 15,
        2: 30,
        3: 45,
        4: 60,
        5: 75,
        6: 90,
        7: 105,
        8: 120,
        9: 135,
        10: 150,
      },
    },
  },
  {
    id: "caarsens-gambit",
    name: "Ca'arsen's Gambit",
    starRating: 1,
    effects: [
      {
        category: "OFF",
        type: "conditional",
        description: "Increases damage when HP is low",
        maxValues: { damageIncrease: "24%", hpThreshold: "50%" },
        isStrifed: false,
      },
    ],
    effectCategories: ["OFF"],
    pvpTier: "C",
    pveTier: "C",
    upgradeCosts: [],
    resonanceTable: {
      byRank: {
        1: 15,
        2: 30,
        3: 45,
        4: 60,
        5: 75,
        6: 90,
        7: 105,
        8: 120,
        9: 135,
        10: 150,
      },
    },
  },
];

// Create gem map for lookups
const GEM_MAP = new Map(MOCK_GEMS.map((gem) => [gem.id, gem]));

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

  // Debounced save timer ref
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State for gem detail modal
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null);
  const [showGemDetail, setShowGemDetail] = useState(false);

  // Extract state from session
  const equippedGems = sessionState.gems;
  const resources = sessionState.resources;
  const optimizationMode = sessionState.optimizationMode;

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Optimize Your Build
              </h1>
              <p className="mt-2 text-gray-600">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Gem Catalog */}
          <div className="lg:col-span-2">
            <Card padding="md">
              <CardBody>
                <GemCatalog
                  gems={MOCK_GEMS}
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

                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveGem(equipped.slotPosition)
                            }
                            aria-label={`Remove ${gem.name}`}
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
