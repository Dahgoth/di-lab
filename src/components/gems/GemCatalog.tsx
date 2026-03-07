"use client";

/**
 * GemCatalog — Tactical Minimalism gem browser
 *
 * Dark theme: bg-black, border-zinc-800, font-mono data readouts.
 * Strict grid-cols-4 for the gem grid.
 */

import { useState, useMemo, useCallback, type ChangeEvent } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { LegendaryGem, StarRating, TierRanking } from "@/types";
import GemCard from "./GemCard";

// ============================================================================
// Types
// ============================================================================

export interface GemCatalogProps {
  gems: LegendaryGem[];
  selectedStarRating?: StarRating;
  onStarRatingChange?: (rating: StarRating) => void;
  onGemSelect?: (gem: LegendaryGem) => void;
  tierFilter?: TierRanking;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

// ============================================================================
// Constants
// ============================================================================

const STAR_RATING_TABS: { value: StarRating; label: string }[] = [
  { value: 5, label: "5★" },
  { value: 2, label: "2★" },
  { value: 1, label: "1★" },
];

const TIER_FILTERS: { value: TierRanking | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "S", label: "S" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
];

// ============================================================================
// Component
// ============================================================================

export default function GemCatalog({
  gems,
  selectedStarRating = 5,
  onStarRatingChange,
  onGemSelect,
  tierFilter,
  searchQuery: externalSearchQuery,
  onSearchChange,
}: GemCatalogProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalTierFilter, setInternalTierFilter] = useState<
    TierRanking | "all"
  >("all");

  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const currentTierFilter = tierFilter ?? internalTierFilter;

  const filteredGems = useMemo(() => {
    return gems.filter((gem) => {
      if (gem.starRating !== selectedStarRating) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = gem.name.toLowerCase().includes(q);
        const matchesEffect = gem.effects.some(
          (e) =>
            e.description.toLowerCase().includes(q) ||
            e.type.toLowerCase().includes(q),
        );
        if (!matchesName && !matchesEffect) return false;
      }
      if (currentTierFilter !== "all") {
        if (
          gem.pvpTier !== currentTierFilter &&
          gem.pveTier !== currentTierFilter
        )
          return false;
      }
      return true;
    });
  }, [gems, selectedStarRating, searchQuery, currentTierFilter]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const q = event.target.value;
      if (onSearchChange) onSearchChange(q);
      else setInternalSearchQuery(q);
    },
    [onSearchChange],
  );

  const handleStarRatingChange = useCallback(
    (rating: StarRating) => {
      onStarRatingChange?.(rating);
    },
    [onStarRatingChange],
  );

  const handleTierFilterChange = useCallback((tier: TierRanking | "all") => {
    setInternalTierFilter(tier);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 px-1">
        {/* Star rating tabs */}
        <div className="flex border border-zinc-800 divide-x divide-zinc-800">
          {STAR_RATING_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStarRatingChange(tab.value)}
              aria-pressed={selectedStarRating === tab.value}
              className={[
                "px-4 py-1.5 font-mono text-xs tracking-widest transition-colors",
                selectedStarRating === tab.value
                  ? "bg-zinc-900 text-zinc-100"
                  : "bg-black text-zinc-600 hover:text-zinc-300",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
            size={14}
          />
          <input
            type="text"
            placeholder="SEARCH GEMS"
            value={searchQuery}
            onChange={handleSearchChange}
            className="
              w-full pl-8 pr-3 py-1.5
              bg-black border border-zinc-800
              font-mono text-xs text-zinc-300 placeholder:text-zinc-700
              focus:outline-none focus:border-zinc-600
              tracking-wider uppercase
            "
          />
        </div>

        {/* Tier filter */}
        <div className="relative flex items-center border border-zinc-800">
          <SlidersHorizontal
            className="absolute left-2 text-zinc-600 pointer-events-none"
            size={12}
          />
          <select
            value={currentTierFilter}
            onChange={(e) =>
              handleTierFilterChange(e.target.value as TierRanking | "all")
            }
            className="
              pl-7 pr-6 py-1.5
              bg-black
              font-mono text-xs text-zinc-400 uppercase tracking-widest
              focus:outline-none focus:border-zinc-600
              appearance-none cursor-pointer
            "
          >
            {TIER_FILTERS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Count readout ───────────────────────────────────────────────── */}
      <div className="px-1 mb-2">
        <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
          {filteredGems.length} GEMS
        </span>
      </div>

      {/* ── Gem grid ────────────────────────────────────────────────────── */}
      {filteredGems.length > 0 ? (
        <div className="grid grid-cols-4 gap-px bg-[var(--border)]">
          {filteredGems.map((gem) => (
            <GemCard
              key={gem.id}
              gem={gem}
              onClick={() => onGemSelect?.(gem)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <Search size={32} className="text-zinc-800 mb-3" />
          <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
            NO GEMS FOUND
          </p>
          <button
            onClick={() => {
              if (onSearchChange) onSearchChange("");
              else setInternalSearchQuery("");
              setInternalTierFilter("all");
            }}
            className="mt-4 font-mono text-[10px] text-zinc-600 hover:text-zinc-300 uppercase tracking-widest transition-colors"
          >
            CLEAR FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
