"use client";

import { useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { SkeletonText } from "@/components/ui/Skeleton";

interface OptimizationModalProps {
  isOpen: boolean;
  elapsedSeconds: number;
  onCancel: () => void;
}

/**
 * Modal overlay shown during optimization processing.
 * Displays elapsed time and provides cancel functionality.
 * (FR-017)
 */
export function OptimizationModal({
  isOpen,
  elapsedSeconds,
  onCancel,
}: OptimizationModalProps) {
  // Handle Escape key cancellation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  // Handle click outside to cancel
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onCancel();
      }
    },
    [onCancel],
  );

  if (!isOpen) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isLongRunning = elapsedSeconds >= 20;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Optimizing...
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Cancel optimization"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-center mb-4">
            {/* Spinning loader */}
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
          </div>

          {/* Elapsed time */}
          <div className="text-center">
            <span className="text-3xl font-mono text-gray-900 dark:text-white">
              {formatTime(elapsedSeconds)}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              elapsed
            </p>
          </div>
        </div>

        {/* Long running warning */}
        {isLongRunning && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Still processing... This is taking longer than expected.
            </p>
          </div>
        )}

        {/* Loading details skeleton */}
        <div className="mb-4 space-y-2">
          <SkeletonText lines={2} />
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>

        {/* Keyboard hint */}
        <p className="mt-2 text-xs text-center text-gray-400 dark:text-gray-500">
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
            Esc
          </kbd>{" "}
          to cancel
        </p>
      </div>
    </div>
  );
}
