/**
 * GemCatalog component for DI-Lab
 * Displays a searchable grid of legendary gems with star-rating tabs (FR-001)
 */

"use client";

import { useState, useMemo, useCallback, type ChangeEvent } from "react";
import { Search, Filter } from "lucide-react";
import type { LegendaryGem, StarRating, TierRanking } from "@/types";
import { Card } from "@/components/ui";
import GemCard from "./GemCard";

// ============================================================================
// Types
// ============================================================================

export interface GemCatalogProps {
  /** All legendary gems from database */
  gems: LegendaryGem[];
  /** Currently selected star rating tab */
  selectedStarRating?: StarRating;
  /** Called when star rating tab changes */
  onStarRatingChange?: (rating: StarRating) => void;
  /** Called when a gem is selected for adding */
  onGemSelect?: (gem: LegendaryGem) => void;
  /** Optional filter by tier ranking */
  tierFilter?: TierRanking;
  /** Optional search query from parent */
  searchQuery?: string;
  /** Called when search query changes */
  onSearchChange?: (query: string) => void;
}

// ============================================================================
// Constants
// ============================================================================

const STAR_RATING_TABS: { value: StarRating; label: string }[] = [
  { value: 5, label: "5-Star" },
  { value: 2, label: "2-Star" },
  { value: 1, label: "1-Star" },
];

const TIER_FILTERS: { value: TierRanking | "all"; label: string }[] = [
  { value: "all", label: "All Tiers" },
  { value: "S", label: "S Tier" },
  { value: "A", label: "A Tier" },
  { value: "B", label: "B Tier" },
  { value: "C", label: "C Tier" },
  { value: "D", label: "D Tier" },
];

// ============================================================================
// Component
// ============================================================================

/**
 * GemCatalog displays a grid of legendary gems with tabs for star ratings
 * and search/filter functionality (FR-001)
 *
 * @example
 * ```tsx
 * <GemCatalog
 *   gems={allGems}
 *   onGemSelect={(gem) => addGem(gem)}
 * />
 * ```
 */
export default function GemCatalog({
  gems,
  selectedStarRating = 5,
  onStarRatingChange,
  onGemSelect,
  tierFilter,
  searchQuery: externalSearchQuery,
  onSearchChange,
}: GemCatalogProps) {
  // Internal state for search (if not controlled)
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalTierFilter, setInternalTierFilter] = useState<
    TierRanking | "all"
  >("all");

  // Use external or internal state
  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const currentTierFilter = tierFilter ?? internalTierFilter;

  // Filter gems by star rating, search, and tier
  const filteredGems = useMemo(() => {
    return gems.filter((gem) => {
      // Star rating filter (from tabs)
      if (gem.starRating !== selectedStarRating) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = gem.name.toLowerCase().includes(query);
        const matchesEffect = gem.effects.some(
          (effect) =>
            effect.description.toLowerCase().includes(query) ||
            effect.type.toLowerCase().includes(query),
        );
        if (!matchesName && !matchesEffect) return false;
      }

      // Tier filter
      if (currentTierFilter !== "all") {
        const matchesPvp = gem.pvpTier === currentTierFilter;
        const matchesPve = gem.pveTier === currentTierFilter;
        if (!matchesPvp && !matchesPve) return false;
      }

      return true;
    });
  }, [gems, selectedStarRating, searchQuery, currentTierFilter]);

  // Handle search input
  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      if (onSearchChange) {
        onSearchChange(query);
      } else {
        setInternalSearchQuery(query);
      }
    },
    [onSearchChange],
  );

  // Handle star rating tab change
  const handleStarRatingChange = useCallback(
    (rating: StarRating) => {
      onStarRatingChange?.(rating);
    },
    [onStarRatingChange],
  );

  // Handle tier filter change
  const handleTierFilterChange = useCallback((tier: TierRanking | "all") => {
    setInternalTierFilter(tier);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        {/* Star Rating Tabs */}
        <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-1">
          {STAR_RATING_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStarRatingChange(tab.value)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  selectedStarRating === tab.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
              aria-pressed={selectedStarRating === tab.value}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search gems..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="
              w-full pl-10 pr-4 py-2
              border border-gray-300 rounded-lg
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            "
          />
        </div>

        {/* Tier Filter */}
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            value={currentTierFilter}
            onChange={(e) =>
              handleTierFilterChange(e.target.value as TierRanking | "all")
            }
            className="
              pl-10 pr-8 py-2
              border border-gray-300 rounded-lg
              text-gray-900 bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              appearance-none cursor-pointer
            "
          >
            {TIER_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500 mb-3">
        {filteredGems.length} gem{filteredGems.length !== 1 ? "s" : ""} found
      </div>

      {/* Gem Grid */}
      {filteredGems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredGems.map((gem) => (
            <GemCard
              key={gem.id}
              gem={gem}
              onClick={() => onGemSelect?.(gem)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="text-gray-400 mb-2">
            <Search size={48} />
          </div>
          <p className="text-gray-600 font-medium">No gems match your filter</p>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              if (onSearchChange) {
                onSearchChange("");
              } else {
                setInternalSearchQuery("");
              }
              setInternalTierFilter("all");
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
