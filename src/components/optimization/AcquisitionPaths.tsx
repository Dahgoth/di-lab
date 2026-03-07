"use client";

import { Swords, ShoppingCart, Shuffle } from "lucide-react";
import {
  getAcquisitionPaths,
  type AcquisitionPath,
} from "@/lib/utils/acquisition";
import { cn } from "@/lib/utils/cn";

interface AcquisitionPathsProps {
  /** Currently selected path */
  selectedPath?: "farming" | "market" | "hybrid";
  /** Callback when path is selected */
  onPathSelect?: (path: "farming" | "market" | "hybrid") => void;
}

/**
 * Component showing the three main acquisition paths.
 * Provides concise overview with descriptions only.
 * (FR-052)
 */
export function AcquisitionPaths({
  selectedPath,
  onPathSelect,
}: AcquisitionPathsProps) {
  const paths = getAcquisitionPaths();

  const getIcon = (type: AcquisitionPath["type"]) => {
    switch (type) {
      case "farming":
        return <Swords className="w-6 h-6" />;
      case "market":
        return <ShoppingCart className="w-6 h-6" />;
      case "hybrid":
        return <Shuffle className="w-6 h-6" />;
    }
  };

  const getColorClass = (type: AcquisitionPath["type"]) => {
    switch (type) {
      case "farming":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "market":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "hybrid":
        return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
    }
  };

  const getSelectedClass = (type: AcquisitionPath["type"]) => {
    if (selectedPath === type) {
      switch (type) {
        case "farming":
          return "ring-2 ring-green-500";
        case "market":
          return "ring-2 ring-blue-500";
        case "hybrid":
          return "ring-2 ring-purple-500";
      }
    }
    return "";
  };

  return (
    <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-lg shadow-md p-4">
      <h3 className="font-medium text-[var(--foreground)] mb-4">
        Acquisition Paths
      </h3>

      <div className="space-y-3">
        {paths.map((path) => (
          <button
            key={path.type}
            onClick={() => onPathSelect?.(path.type)}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-all",
              getColorClass(path.type),
              getSelectedClass(path.type),
              onPathSelect && "cursor-pointer hover:opacity-90",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-gray-600 dark:text-gray-400">
                {getIcon(path.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {path.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {path.description}
                </p>

                {/* Pros */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Pros: </span>
                  {path.pros.slice(0, 2).join(", ")}
                </div>

                {/* Cons */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span className="font-medium">Cons: </span>
                  {path.cons.slice(0, 2).join(", ")}
                </div>

                {/* Estimates */}
                <div className="flex gap-4 mt-2 text-xs">
                  {path.estimatedTime && (
                    <span className="text-gray-500 dark:text-gray-400">
                      ⏱️ {path.estimatedTime}
                    </span>
                  )}
                  {path.estimatedCost && (
                    <span className="text-gray-500 dark:text-gray-400">
                      💰 ~{path.estimatedCost.toLocaleString()} platinum
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Resource deficit display component.
 * Shows what resources are lacking and by how much.
 * (FR-051)
 */
interface ResourceDeficitProps {
  deficits: Record<string, number>;
  className?: string;
}

export function ResourceDeficit({ deficits, className }: ResourceDeficitProps) {
  const entries = Object.entries(deficits).filter(([_, amount]) => amount > 0);

  if (entries.length === 0) {
    return null;
  }

  const formatResourceName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div
      className={cn(
        "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4",
        className,
      )}
    >
      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
        Resource Deficit
      </h4>
      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
        You need additional resources to complete all recommendations:
      </p>
      <ul className="space-y-1">
        {entries.map(([resource, amount]) => (
          <li
            key={resource}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-yellow-700 dark:text-yellow-300">
              {formatResourceName(resource)}
            </span>
            <span className="font-medium text-yellow-800 dark:text-yellow-200">
              {amount.toLocaleString()} needed
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
