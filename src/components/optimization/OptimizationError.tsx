"use client";

import { AlertCircle, Clock, Package, RefreshCw, WifiOff } from "lucide-react";
import type { OptimizationError } from "@/types/optimization";
import { cn } from "@/lib/utils/cn";

interface OptimizationErrorProps {
  error: OptimizationError;
  onRetry?: () => void;
  retryAfter?: number; // seconds for rate-limited countdown
}

/**
 * Error display component for optimization failures.
 * Shows actionable guidance based on error type.
 * (FR-021, FR-021a)
 */
export function OptimizationErrorDisplay({
  error,
  onRetry,
  retryAfter,
}: OptimizationErrorProps) {
  const { type, title, message, guidance } = error;

  // Get icon based on error type
  const getIcon = () => {
    switch (type) {
      case "timeout":
        return <Clock className="w-5 h-5" />;
      case "insufficient-resources":
        return <Package className="w-5 h-5" />;
      case "rate-limited":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Get color scheme based on error type
  const getColorClass = () => {
    switch (type) {
      case "timeout":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200";
      case "insufficient-resources":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
      case "rate-limited":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200";
      default:
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200";
    }
  };

  return (
    <div className={cn("rounded-lg border p-4", getColorClass())}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm mt-1 opacity-90">{message}</p>
          <p className="text-sm mt-2 font-medium">{guidance}</p>

          {/* Rate-limited countdown */}
          {type === "rate-limited" && retryAfter && retryAfter > 0 && (
            <div className="mt-3 text-sm">
              <span className="opacity-75">Retry available in: </span>
              <span className="font-mono font-medium">
                {formatCountdown(retryAfter)}
              </span>
            </div>
          )}

          {/* Retry button for transient errors */}
          {(type === "timeout" || type === "server-error") && onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Offline detection component.
 * Shows when network is unavailable during optimization.
 * (FR-021d)
 */
interface OfflineErrorProps {
  onRetryWhenOnline?: () => void;
  isOffline: boolean;
}

export function OfflineError({
  isOffline,
  onRetryWhenOnline,
}: OfflineErrorProps) {
  if (!isOffline) return null;

  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-4">
      <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
        <WifiOff className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium">Connection Lost</h3>
          <p className="text-sm mt-1 opacity-75">
            Your network connection was lost during optimization.
          </p>
          {onRetryWhenOnline && (
            <button
              onClick={onRetryWhenOnline}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry When Online
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Validation error component.
 * Shows specific validation failures with actionable guidance.
 * (FR-021a)
 */
interface ValidationErrorProps {
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export function ValidationError({ errors }: ValidationErrorProps) {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
      <div className="flex items-start gap-3 text-red-800 dark:text-red-200">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium">Validation Error</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="font-medium">{error.field}:</span>
                <span>{error.message}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm font-medium">
            Please correct the above issues and try again.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Insufficient resources error component.
 * Shows which resources are lacking with guidance.
 * (FR-021a)
 */
interface InsufficientResourcesErrorProps {
  deficits: Record<string, number>;
  onAddResources?: () => void;
}

export function InsufficientResourcesError({
  deficits,
  onAddResources,
}: InsufficientResourcesErrorProps) {
  const deficitEntries = Object.entries(deficits).filter(
    ([_, amount]) => amount > 0,
  );

  if (deficitEntries.length === 0) return null;

  const formatResourceName = (name: string): string => {
    // Convert camelCase to Title Case
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
      <div className="flex items-start gap-3 text-blue-800 dark:text-blue-200">
        <Package className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium">Insufficient Resources</h3>
          <p className="text-sm mt-1 opacity-75">
            You do not have enough resources for this optimization.
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {deficitEntries.map(([resource, amount]) => (
              <li key={resource} className="flex items-center gap-2">
                <span className="font-medium">
                  {formatResourceName(resource)}:
                </span>
                <span>Need {amount.toLocaleString()} more</span>
              </li>
            ))}
          </ul>
          {onAddResources && (
            <button
              onClick={onAddResources}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors"
            >
              Add More Resources
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to format countdown
function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
  return `${secs}s`;
}
