"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Sparkles,
  Zap,
  Gem,
} from "lucide-react";
import type { InfusionRecommendation } from "@/lib/optimization/types";
import { cn } from "@/lib/utils/cn";

interface InfusionRecommendationCardProps {
  recommendation: InfusionRecommendation;
  gemName?: string;
}

/**
 * Card displaying an infusion recommendation for dormant 5-star gems.
 * Shows source gems, GP requirements, and resonance gain.
 * (T100c - FR-037b)
 */
export function InfusionRecommendationCard({
  recommendation,
  gemName,
}: InfusionRecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    slot,
    gemId,
    currentRank,
    quality,
    sourceGems,
    totalGemPower,
    additionalResonance,
    powerGain,
    priorityRank,
    reasoning,
  } = recommendation;

  // Format gem name from ID if not provided
  const displayName =
    gemName ??
    gemId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Priority badge styling
  const getPriorityBadgeClass = (rank: number): string => {
    if (rank === 1)
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    if (rank === 2)
      return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
  };

  // Format source gem display
  const formatSourceGem = (gem: (typeof sourceGems)[0]): string => {
    const starLabel = gem.starRating === 2 ? "2★" : "5★";
    return `${starLabel} R${gem.rank}`;
  };

  return (
    <div className="border border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/30">
      {/* Main Card Content */}
      <div
        className="p-4 cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => e.key === "Enter" && setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-start gap-3">
          {/* Priority Badge */}
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              getPriorityBadgeClass(priorityRank),
            )}
          >
            <Zap className="w-3 h-3" />
            <span>#{priorityRank}</span>
          </div>

          {/* Gem Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {displayName}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                5★
              </span>
              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                INFUSION
              </span>
            </div>

            {/* Infusion Summary */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Gem className="w-4 h-4" />
              <span>
                Slot {slot} • R{currentRank} {quality}/5
              </span>
            </div>

            {/* Resonance Gain */}
            <div className="flex items-center gap-3 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  +{additionalResonance} Resonance
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-600 dark:text-green-400">
                  +{powerGain.toLocaleString()} Power
                </span>
              </div>
            </div>
          </div>

          {/* Expand Toggle */}
          <button
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-purple-200 dark:border-purple-700 pt-4">
          {/* Reasoning */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Strategy
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {reasoning}
            </p>
          </div>

          {/* Source Gems Required */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Source Gems ({sourceGems.length} slots)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sourceGems.map((gem, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                >
                  <Gem className="w-4 h-4 text-purple-500" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatSourceGem(gem)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      (+{gem.resonanceContributed} res)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gem Power Cost */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Gem Power Required
            </h4>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total GP for Infusion
                </span>
                <span className="font-medium text-purple-700 dark:text-purple-300">
                  {totalGemPower.toLocaleString()} GP
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Additional resonance = Socketed GP ÷ 200 (max{" "}
                {additionalResonance} for R10)
              </p>
            </div>
          </div>

          {/* Infusion Benefits */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
              Benefits
            </h4>
            <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>+{additionalResonance} additional resonance</span>
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>+{powerGain.toLocaleString()} power gain</span>
              </li>
              <li className="flex items-center gap-2">
                <Gem className="w-4 h-4" />
                <span>Re-awakens dormant gem effects</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
