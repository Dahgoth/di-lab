"use client";

import { Lock, Unlock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AwakenedSlotsPanelProps {
  /** Number of awakened slots currently enabled (0-12) */
  enabledSlots: number;
  /** Maximum allowed awakened slots (default 12) */
  maxSlots?: number;
  /** Callback when slots are toggled */
  onSlotsChange: (slots: number) => void;
  /** Dawning Echoes available */
  dawningEchoes: number;
  /** Platinum available */
  platinum: number;
  /** Whether the user can afford to awaken more slots */
  canAffordMore: boolean;
}

/**
 * Panel for managing awakened gem slots.
 * Shows slot toggles with Dawning Echo cost display.
 * (FR-047, FR-048, FR-049)
 */
export function AwakenedSlotsPanel({
  enabledSlots,
  maxSlots = 12,
  onSlotsChange,
  dawningEchoes,
  platinum,
  canAffordMore,
}: AwakenedSlotsPanelProps) {
  const DAWNING_ECHO_PLATINUM_COST = 10000; // 10,000 Platinum per Dawning Echo

  // Calculate if user can enable more slots
  const canEnableMore =
    enabledSlots < maxSlots &&
    (dawningEchoes > 0 ||
      platinum >= DAWNING_ECHO_PLATINUM_COST ||
      canAffordMore);

  // Calculate platinum equivalent
  const platinumEquivalent = enabledSlots * DAWNING_ECHO_PLATINUM_COST;

  const handleSlotToggle = (slotIndex: number) => {
    // If clicking on an enabled slot, disable it and all slots after
    if (slotIndex < enabledSlots) {
      onSlotsChange(slotIndex);
    }
    // If clicking on a disabled slot, enable up to that slot
    else if (canEnableMore) {
      onSlotsChange(slotIndex + 1);
    }
  };

  return (
    <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-medium text-[var(--foreground)]">
            Awakened Slots
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {enabledSlots}/{maxSlots} enabled
        </span>
      </div>

      {/* Slot Toggles */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        {Array.from({ length: maxSlots }).map((_, index) => {
          const isEnabled = index < enabledSlots;
          const canToggle =
            isEnabled || (canEnableMore && index === enabledSlots);

          return (
            <button
              key={index}
              onClick={() => handleSlotToggle(index)}
              disabled={!canToggle}
              className={cn(
                "aspect-square rounded-lg border-2 transition-all flex items-center justify-center",
                isEnabled
                  ? "bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-400"
                  : canToggle
                    ? "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50",
              )}
              aria-label={`Awakened slot ${index + 1} ${isEnabled ? "enabled" : "disabled"}`}
              aria-pressed={isEnabled}
            >
              {isEnabled ? (
                <Unlock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              ) : canToggle ? (
                <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              ) : (
                <Lock className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Cost Information */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Dawning Echoes used:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {enabledSlots}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-400">
            Platinum equivalent:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {platinumEquivalent.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Each awakened slot requires 1 Dawning Echo (10,000 Platinum or 1,000
          Orbs)
        </p>
      </div>

      {/* Available Resources */}
      <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
          Available Resources
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              Dawning Echoes:{" "}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {dawningEchoes}
            </span>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)]">Platinum: </span>
            <span className="font-medium text-[var(--foreground)]">
              {platinum.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      {!canEnableMore && enabledSlots < maxSlots && (
        <p className="mt-3 text-xs text-yellow-600 dark:text-yellow-400">
          Not enough resources to awaken more slots. You need 1 Dawning Echo or
          10,000 Platinum.
        </p>
      )}
    </div>
  );
}
