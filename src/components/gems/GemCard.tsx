/**
 * GemCard component for DI-Lab
 * Displays a single gem in the catalog grid with visual hierarchy (FR-002, FR-002a, FR-003)
 */

"use client";

import type { LegendaryGem, TierRanking } from "@/types";
import { Plus, Info } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface GemCardProps {
  /** Gem data */
  gem: LegendaryGem;
  /** Called when card is clicked */
  onClick?: () => void;
  /** Called when info button is clicked */
  onInfoClick?: () => void;
  /** Show compact version for slots */
  compact?: boolean;
  /** Show selected state */
  selected?: boolean;
  /** Show add button */
  showAddButton?: boolean;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const starRatingColors: Record<number, string> = {
  1: "border-gray-300 bg-gray-50",
  2: "border-blue-300 bg-blue-50",
  5: "border-yellow-400 bg-yellow-50",
};

const starRatingBadgeColors: Record<number, string> = {
  1: "bg-gray-200 text-gray-700",
  2: "bg-blue-200 text-blue-800",
  5: "bg-yellow-300 text-yellow-900",
};

const tierColors: Record<TierRanking, string> = {
  S: "bg-yellow-500 text-white",
  A: "bg-gray-300 text-gray-800",
  B: "bg-amber-600 text-white",
  C: "bg-gray-400 text-white",
  D: "bg-gray-500 text-white",
};

// ============================================================================
// Component
// ============================================================================

/**
 * GemCard displays a gem with name, star rating, tier badges, and quick-add button
 * Visual hierarchy: 5-star gems have gold border, uniform card size (FR-002a)
 *
 * @example
 * ```tsx
 * <GemCard
 *   gem={gem}
 *   onClick={() => selectGem(gem)}
 *   showAddButton
 * />
 * ```
 */
export default function GemCard({
  gem,
  onClick,
  onInfoClick,
  compact = false,
  selected = false,
  showAddButton = true,
  className = "",
}: GemCardProps) {
  // Handle 5-star gold border (FR-002a)
  const borderStyle =
    gem.starRating === 5
      ? "border-2 border-yellow-500"
      : `border ${starRatingColors[gem.starRating]}`;

  // Star display
  const starDisplay = "★".repeat(gem.starRating);

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`
          flex items-center gap-2 p-2 rounded-lg
          ${borderStyle}
          ${selected ? "ring-2 ring-blue-500" : ""}
          ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
          ${className}
        `
          .replace(/\s+/g, " ")
          .trim()}
      >
        <span className="text-xs font-medium truncate">{gem.name}</span>
        <span className="text-yellow-500 text-xs">{starDisplay}</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col
        min-w-[120px] min-h-[160px]
        p-3 rounded-lg
        ${borderStyle}
        ${selected ? "ring-2 ring-blue-500" : ""}
        ${onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all" : ""}
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}
      style={{ gap: "16px" }}
    >
      {/* Star Rating Badge */}
      <div className="absolute top-2 right-2">
        <span
          className={`
            inline-flex items-center justify-center
            px-1.5 py-0.5 rounded text-xs font-bold
            ${starRatingBadgeColors[gem.starRating]}
          `}
        >
          {starDisplay}
        </span>
      </div>

      {/* Gem Icon Placeholder */}
      <div className="flex items-center justify-center h-12 mt-2">
        <div
          className={`
            w-10 h-10 rounded-full
            flex items-center justify-center
            text-2xl
            ${gem.starRating === 5 ? "bg-yellow-200" : gem.starRating === 2 ? "bg-blue-200" : "bg-gray-200"}
          `}
        >
          💎
        </div>
      </div>

      {/* Gem Name */}
      <div className="flex-1 min-h-0">
        <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2">
          {gem.name}
        </h3>
      </div>

      {/* Tier Badges */}
      <div className="flex justify-center gap-1">
        <span
          className={`
            px-1.5 py-0.5 rounded text-xs font-medium
            ${tierColors[gem.pvpTier]}
          `}
          title="PVP Tier"
        >
          PVP:{gem.pvpTier}
        </span>
        <span
          className={`
            px-1.5 py-0.5 rounded text-xs font-medium
            ${tierColors[gem.pveTier]}
          `}
          title="PVE Tier"
        >
          PVE:{gem.pveTier}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2 pt-1">
        {showAddButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="
              flex items-center justify-center
              w-8 h-8 rounded-full
              bg-blue-600 text-white
              hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              transition-colors
            "
            aria-label={`Add ${gem.name}`}
          >
            <Plus size={16} />
          </button>
        )}

        {onInfoClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick();
            }}
            className="
              flex items-center justify-center
              w-8 h-8 rounded-full
              bg-gray-200 text-gray-700
              hover:bg-gray-300
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1
              transition-colors
            "
            aria-label={`View ${gem.name} details`}
          >
            <Info size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
