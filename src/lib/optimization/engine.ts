/**
 * Main optimization engine for gem upgrade recommendations
 * @module optimization/engine
 */

import type {
  EquippedGem,
  GameMode,
  LegendaryGem,
  OptimizationInput,
  OptimizationResult,
  UpgradeCandidate,
  UpgradeRecommendation,
} from "./types";
import { getResonance } from "./constants";
import { calculateTotalResonance } from "./resonance";
import {
  getTierRanking,
  calculatePowerGain,
  calculatePriorityScore,
  generateReasoning,
} from "./scoring";
import {
  generatePossibleUpgrades,
  filterAffordableUpgrades,
  selectUpgradesWithinBudget,
  calculateTotalCost,
} from "./resources";

/**
 * Main optimization function implementing the weighted greedy algorithm
 *
 * Algorithm steps:
 * 1. Generate all possible upgrades
 * 2. Filter by resource constraints
 * 3. Calculate priority scores
 * 4. Sort by priority (greedy)
 * 5. Select within budget
 * 6. Generate reasoning text
 * 7. Return result with timing
 *
 * @param input - Optimization input with gems, resources, and mode
 * @returns Optimization result with recommendations
 */
export function optimize(input: OptimizationInput): OptimizationResult {
  const startTime = performance.now();

  // Handle empty input
  if (!input.gems || input.gems.length === 0) {
    return createEmptyResult(input.mode, startTime);
  }

  // Create or use provided gem database
  const gemDatabase = input.gemDatabase ?? new Map<string, LegendaryGem>();

  // Step 1: Generate all possible upgrades
  const possibleUpgrades = generatePossibleUpgrades(input.gems, gemDatabase);

  // Handle no upgrades possible
  if (possibleUpgrades.length === 0) {
    return createEmptyResult(input.mode, startTime);
  }

  // Step 2: Calculate current total resonance for threshold detection
  const currentTotalResonance = calculateTotalResonance(
    input.gems,
    gemDatabase,
  );

  // Step 3: Build upgrade candidates with priority scores
  const candidates: UpgradeCandidate[] = possibleUpgrades.map((upgrade) => {
    const gemDef = gemDatabase.get(upgrade.gemId);
    if (!gemDef) {
      throw new Error(`Gem definition not found for ID: ${upgrade.gemId}`);
    }

    const gem = input.gems.find((g) => g.slot === upgrade.slot);
    if (!gem) {
      throw new Error(`Gem not found in slot: ${upgrade.slot}`);
    }

    const tier = getTierRanking(gemDef, input.mode);
    const powerGain = calculatePowerGain(
      gemDef,
      upgrade.currentRank,
      upgrade.targetRank,
      gem.quality,
      input.mode,
      currentTotalResonance,
    );

    const priorityScore = calculatePriorityScore(
      powerGain,
      upgrade.gemPowerCost,
      upgrade.copiesRequired,
    );

    return {
      gemId: upgrade.gemId,
      slot: upgrade.slot,
      currentRank: upgrade.currentRank,
      targetRank: upgrade.targetRank,
      gemPowerCost: upgrade.gemPowerCost,
      copiesRequired: upgrade.copiesRequired,
      powerGain,
      priorityScore,
      tier,
    };
  });

  // Step 4: Filter by resource constraints
  const affordableCandidates = filterAffordableUpgrades(
    candidates,
    input.resources,
  );

  // Handle no affordable upgrades
  if (affordableCandidates.length === 0) {
    return createEmptyResult(input.mode, startTime);
  }

  // Step 5: Sort by priority score (descending - highest ROI first)
  affordableCandidates.sort((a, b) => b.priorityScore - a.priorityScore);

  // Step 6: Select upgrades within budget (greedy selection)
  const { selected } = selectUpgradesWithinBudget(
    affordableCandidates,
    input.resources,
  );

  // Step 7: Generate recommendations with reasoning
  const recommendations = generateRecommendations(
    selected,
    gemDatabase,
    input.gems,
    input.mode,
    currentTotalResonance,
  );

  // Step 8: Calculate totals
  const totalCost = calculateTotalCost(recommendations);
  const totalPowerGain = recommendations.reduce(
    (sum, rec) => sum + rec.powerGain,
    0,
  );

  const endTime = performance.now();

  return {
    recommendations,
    totalPowerGain,
    totalResourceCost: totalCost,
    mode: input.mode,
    calculatedAt: new Date().toISOString(),
    processingTime: endTime - startTime,
  };
}

/**
 * Generate upgrade recommendations with reasoning text
 */
function generateRecommendations(
  candidates: UpgradeCandidate[],
  gemDatabase: Map<string, LegendaryGem>,
  gems: EquippedGem[],
  mode: GameMode,
  currentTotalResonance: number,
): UpgradeRecommendation[] {
  const recommendations: UpgradeRecommendation[] = [];
  let runningResonance = currentTotalResonance;

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const gemDef = gemDatabase.get(candidate.gemId);
    const gem = gems.find((g) => g.slot === candidate.slot);

    if (!gemDef || !gem) continue;

    // Check for threshold bonus
    const resonanceBefore = runningResonance;
    const resonanceGain = calculateResonanceGain(
      gemDef,
      gem.quality,
      candidate.currentRank,
      candidate.targetRank,
    );
    const resonanceAfter = resonanceBefore + resonanceGain;

    // Check if this crosses a threshold
    let thresholdBonus = false;
    const thresholds = [6000, 7000, 8000, 8500];
    for (const threshold of thresholds) {
      if (resonanceBefore < threshold && resonanceAfter >= threshold) {
        thresholdBonus = true;
        break;
      }
    }

    // Generate reasoning
    const reasoning = generateReasoning(
      gemDef.name,
      candidate.currentRank,
      candidate.targetRank,
      candidate.powerGain,
      candidate.tier,
      thresholdBonus,
    );

    recommendations.push({
      gemId: candidate.gemId,
      slot: candidate.slot,
      fromRank: candidate.currentRank,
      toRank: candidate.targetRank,
      powerGain: candidate.powerGain,
      gemPowerCost: candidate.gemPowerCost,
      copiesCost: candidate.copiesRequired,
      priorityRank: i + 1,
      reasoning,
    });

    // Update running resonance
    runningResonance = resonanceAfter;
  }

  return recommendations;
}

/**
 * Calculate resonance gain from an upgrade
 */
function calculateResonanceGain(
  gemDef: LegendaryGem,
  quality: number,
  fromRank: number,
  toRank: number,
): number {
  const before = getResonance(gemDef.starRating, fromRank, quality);
  const after = getResonance(gemDef.starRating, toRank, quality);
  return after - before;
}

/**
 * Create an empty optimization result
 */
function createEmptyResult(
  mode: GameMode,
  startTime: number,
): OptimizationResult {
  const endTime = performance.now();
  return {
    recommendations: [],
    totalPowerGain: 0,
    totalResourceCost: { gemPower: 0, copies: 0 },
    mode,
    calculatedAt: new Date().toISOString(),
    processingTime: endTime - startTime,
  };
}

/**
 * Re-export types for convenience
 */
export type {
  OptimizationInput,
  OptimizationResult,
  UpgradeRecommendation,
  EquippedGem,
  GameMode,
  LegendaryGem,
} from "./types";

/**
 * Re-export constants for external use
 */
export {
  TIER_MULTIPLIERS,
  RESONANCE_THRESHOLDS,
  MAX_RANK,
  MAX_GEMS,
} from "./constants";
