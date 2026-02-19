/**
 * GemDetail component for DI-Lab
 * Modal showing full gem information with close button, ESC key support, click-outside close (FR-030, FR-030a)
 * Enhanced with upgrade costs (FR-032), tier rankings (FR-033), and resonance values (T082-T084)
 */

"use client";

import type {
  LegendaryGem,
  TierRanking,
  GemEffect,
  StarRating,
  Quality,
} from "@/types";
import { Modal } from "@/components/ui";
import { formatStarRating } from "@/lib/utils/formatting";
import {
  ONE_STAR_RESONANCE,
  TWO_STAR_RESONANCE,
  FIVE_STAR_RESONANCE,
  ONE_STAR_CR,
  TWO_STAR_CR,
  FIVE_STAR_CR,
  GEM_POWER_COSTS,
} from "@/lib/optimization/constants";

// ============================================================================
// Types
// ============================================================================

export interface GemDetailProps {
  /** Gem to display */
  gem: LegendaryGem | null;
  /** Whether modal is open */
  isOpen: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Called when user clicks "Add to Build" */
  onAdd?: (gem: LegendaryGem) => void;
  /** Show add button */
  showAddButton?: boolean;
}

// ============================================================================
// Styles
// ============================================================================

const tierColors: Record<TierRanking, string> = {
  S: "bg-yellow-500 text-white",
  A: "bg-gray-300 text-gray-800",
  B: "bg-amber-600 text-white",
  C: "bg-gray-400 text-white",
  D: "bg-gray-500 text-white",
};

const effectCategoryColors: Record<string, string> = {
  OFF: "bg-red-100 text-red-800 border-red-300",
  DEF: "bg-blue-100 text-blue-800 border-blue-300",
  ALL: "bg-purple-100 text-purple-800 border-purple-300",
  DOT: "bg-orange-100 text-orange-800 border-orange-300",
  LOC: "bg-pink-100 text-pink-800 border-pink-300",
  TLOC: "bg-pink-100 text-pink-800 border-pink-300",
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get resonance value for a gem at a specific rank and quality
 */
function getResonanceValue(
  starRating: StarRating,
  rank: number,
  quality?: number,
): number {
  switch (starRating) {
    case 1:
      return ONE_STAR_RESONANCE[rank] ?? 0;
    case 2:
      return TWO_STAR_RESONANCE[rank] ?? 0;
    case 5:
      const q = (quality ?? 2) as 2 | 3 | 4 | 5;
      return FIVE_STAR_RESONANCE[q]?.[rank] ?? 0;
    default:
      return 0;
  }
}

/**
 * Get CR value for a gem at a specific rank and quality
 */
function getCRValue(
  starRating: StarRating,
  rank: number,
  quality?: number,
): number {
  switch (starRating) {
    case 1:
      return ONE_STAR_CR[rank] ?? 0;
    case 2:
      return TWO_STAR_CR[rank] ?? 0;
    case 5:
      const q = (quality ?? 2) as 2 | 3 | 4 | 5;
      return FIVE_STAR_CR[q]?.[rank] ?? 0;
    default:
      return 0;
  }
}

/**
 * Get gem power cost for upgrading to next rank
 */
function getGemPowerCost(starRating: StarRating, fromRank: number): number {
  return GEM_POWER_COSTS[starRating]?.[fromRank] ?? 0;
}

// ============================================================================
// Component
// ============================================================================

/**
 * GemDetail displays comprehensive information about a legendary gem
 * including effects, tier rankings, and upgrade costs (FR-031, FR-032, FR-033)
 *
 * @example
 * ```tsx
 * <GemDetail
 *   gem={selectedGem}
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onAdd={(gem) => addToBuild(gem)}
 * />
 * ```
 */
export default function GemDetail({
  gem,
  isOpen,
  onClose,
  onAdd,
  showAddButton = true,
}: GemDetailProps) {
  if (!gem) return null;

  const starDisplay = "★".repeat(gem.starRating);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={gem.name}
      size="lg"
      footer={
        showAddButton && onAdd ? (
          <button
            onClick={() => {
              onAdd(gem);
              onClose();
            }}
            className="
              px-4 py-2 rounded-lg
              bg-blue-600 text-white font-medium
              hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors
            "
          >
            Add to Build
          </button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500 text-xl">{starDisplay}</span>
              <span className="text-sm text-gray-500">
                {formatStarRating(gem.starRating)} Gem
              </span>
            </div>

            {/* Source */}
            {gem.source && (
              <p className="text-sm text-gray-500">Source: {gem.source}</p>
            )}
          </div>

          {/* Tier Badges */}
          <div className="flex gap-2">
            <div
              className={`px-3 py-1 rounded-lg text-sm font-medium ${tierColors[gem.pvpTier]}`}
            >
              PVP: {gem.pvpTier}
            </div>
            <div
              className={`px-3 py-1 rounded-lg text-sm font-medium ${tierColors[gem.pveTier]}`}
            >
              PVE: {gem.pveTier}
            </div>
          </div>
        </div>

        {/* Effects Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Gem Effects
          </h4>
          <div className="space-y-3">
            {gem.effects.map((effect, index) => (
              <EffectCard key={index} effect={effect} />
            ))}
          </div>
        </div>

        {/* Resonance Values Table (T084) */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Resonance Values by Rank
          </h4>
          <ResonanceTable starRating={gem.starRating} />
        </div>

        {/* Upgrade Costs Table (T082) */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Gem Power Upgrade Costs
          </h4>
          <UpgradeCostTable starRating={gem.starRating} />
        </div>

        {/* Info Box */}
        {gem.starRating === 5 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>5-Star Gem:</strong> Quality affects resonance values.
              Higher quality gems provide more resonance at each rank.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

interface EffectCardProps {
  effect: GemEffect;
}

function EffectCard({ effect }: EffectCardProps) {
  const categoryColor =
    effectCategoryColors[effect.category] ||
    "bg-gray-100 text-gray-800 border-gray-300";

  // Get max value from maxValues record
  const maxValueEntry = Object.entries(effect.maxValues)[0];
  const maxValue = maxValueEntry ? maxValueEntry[1] : null;

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      {/* Category Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium border ${categoryColor}`}
        >
          {effect.category}
        </span>
        <span className="text-xs text-gray-500">{effect.type}</span>
        {effect.isStrifed && (
          <span className="text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
            Strifed
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700">{effect.description}</p>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
        {maxValue !== null && (
          <span>
            <span className="font-medium">Max:</span>{" "}
            {typeof maxValue === "number" ? `${maxValue}%` : maxValue}
          </span>
        )}
        {effect.duration && (
          <span>
            <span className="font-medium">Duration:</span> {effect.duration}s
          </span>
        )}
        {effect.cooldown && (
          <span>
            <span className="font-medium">Cooldown:</span> {effect.cooldown}s
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Resonance Table Component (T084)
// ============================================================================

interface ResonanceTableProps {
  starRating: StarRating;
}

function ResonanceTable({ starRating }: ResonanceTableProps) {
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (starRating === 5) {
    // 5-star gems have different resonance per quality
    const qualities: Quality[] = [2, 3, 4, 5];
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600 border-b">
                Rank
              </th>
              {qualities.map((q) => (
                <th
                  key={q}
                  className="px-3 py-2 text-center font-medium text-gray-600 border-b"
                >
                  Q{q}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranks.map((rank, idx) => (
              <tr
                key={rank}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-3 py-2 font-medium text-gray-700 border-b">
                  {rank}
                </td>
                {qualities.map((q) => (
                  <td
                    key={q}
                    className="px-3 py-2 text-center text-gray-600 border-b"
                  >
                    {getResonanceValue(5, rank, q).toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 1-star and 2-star gems have flat resonance per rank
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-600 border-b">
              Rank
            </th>
            <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">
              Resonance
            </th>
            <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">
              CR
            </th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((rank, idx) => (
            <tr
              key={rank}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-3 py-2 font-medium text-gray-700 border-b">
                {rank}
              </td>
              <td className="px-3 py-2 text-center text-gray-600 border-b">
                {getResonanceValue(starRating, rank).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-center text-gray-600 border-b">
                {getCRValue(starRating, rank).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Upgrade Cost Table Component (T082)
// ============================================================================

interface UpgradeCostTableProps {
  starRating: StarRating;
}

function UpgradeCostTable({ starRating }: UpgradeCostTableProps) {
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const costs = GEM_POWER_COSTS[starRating];

  if (!costs) {
    return (
      <p className="text-sm text-gray-500">
        Upgrade costs not available for this gem type.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-600 border-b">
              From Rank
            </th>
            <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">
              To Rank
            </th>
            <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">
              Gem Power Cost
            </th>
          </tr>
        </thead>
        <tbody>
          {ranks.slice(0, -1).map((rank, idx) => (
            <tr
              key={rank}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-3 py-2 font-medium text-gray-700 border-b">
                {rank}
              </td>
              <td className="px-3 py-2 text-center text-gray-600 border-b">
                {rank + 1}
              </td>
              <td className="px-3 py-2 text-center text-gray-600 border-b">
                {(costs[rank] ?? 0).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
