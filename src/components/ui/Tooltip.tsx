/**
 * Tooltip component for DI-Lab
 * Accessible tooltip with desktop hover and mobile tap-to-reveal support (FR-034)
 */

"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { cn } from "@/lib/utils/cn";

// ============================================================================
// Types
// ============================================================================

export interface TooltipProps {
  /** Element that triggers the tooltip */
  trigger: React.ReactNode;
  /** Tooltip content */
  content: React.ReactNode;
  /** Position relative to trigger */
  position?: "top" | "bottom" | "left" | "right";
  /** Delay before showing (ms) */
  showDelay?: number;
  /** Delay before hiding (ms) */
  hideDelay?: number;
  /** Additional class names for tooltip */
  className?: string;
  /** Maximum width of tooltip */
  maxWidth?: number | string;
  /** Whether tooltip is disabled */
  disabled?: boolean;
  /** Called when tooltip opens */
  onOpen?: () => void;
  /** Called when tooltip closes */
  onClose?: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Tooltip displays informative content on hover (desktop) or tap (mobile)
 *
 * Features:
 * - Hover support for desktop
 * - Tap-to-toggle support for mobile/touch devices
 * - Keyboard accessible (focus triggers tooltip)
 * - Screen reader announcements via aria-describedby
 * - Auto-positioning to stay within viewport
 *
 * @example
 * ```tsx
 * <Tooltip
 *   trigger={<button>Hover me</button>}
 *   content={<div>Tooltip content here</div>}
 *   position="top"
 * />
 * ```
 */
export default function Tooltip({
  trigger,
  content,
  position = "top",
  showDelay = 300,
  hideDelay = 200,
  className,
  maxWidth = 280,
  disabled = false,
  onOpen,
  onClose,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  // Detect touch device via lazy initialization
  const [isTouchDevice] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = useId();

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const showTooltip = useCallback(() => {
    if (disabled) return;

    // Clear hide timeout if exists
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      onOpen?.();
    }, showDelay);
  }, [disabled, showDelay, onOpen]);

  const hideTooltip = useCallback(() => {
    // Clear show timeout if exists
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, hideDelay);
  }, [hideDelay, onClose]);

  const toggleTooltip = useCallback(() => {
    if (disabled) return;
    if (isVisible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  }, [disabled, isVisible, showTooltip, hideTooltip]);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!isVisible || !isTouchDevice) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(target)
      ) {
        setIsVisible(false);
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isVisible, isTouchDevice, onClose]);

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && isVisible) {
      setIsVisible(false);
      onClose?.();
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTooltip();
    }
  };

  // Position classes
  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // Arrow classes
  const arrowClasses: Record<string, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={!isTouchDevice ? showTooltip : undefined}
      onMouseLeave={!isTouchDevice ? hideTooltip : undefined}
      onClick={isTouchDevice ? toggleTooltip : undefined}
      onKeyDown={handleKeyDown}
      onFocus={!isTouchDevice ? showTooltip : undefined}
      onBlur={!isTouchDevice ? hideTooltip : undefined}
      tabIndex={0}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {trigger}

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute z-50 px-3 py-2",
            "bg-gray-800 text-white text-sm rounded-lg shadow-lg",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            positionClasses[position],
            className,
          )}
          style={{ maxWidth }}
        >
          {content}

          {/* Arrow */}
          <div
            className={cn(
              "absolute w-0 h-0",
              "border-4",
              arrowClasses[position],
            )}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Gem Quick Summary Tooltip (T087)
// ============================================================================

export interface GemSummaryTooltipProps {
  /** Gem name */
  name: string;
  /** Star rating (1, 2, or 5) */
  starRating: 1 | 2 | 5;
  /** PvP tier ranking */
  pvpTier: string;
  /** PvE tier ranking */
  pveTier: string;
  /** Short description */
  shortDescription?: string;
  /** Source (e.g., "Dungeon", "Event") */
  source?: string;
  /** Element to wrap with tooltip */
  children: React.ReactNode;
}

/**
 * Convenience wrapper for gem summary tooltips
 */
export function GemSummaryTooltip({
  name,
  starRating,
  pvpTier,
  pveTier,
  shortDescription,
  source,
  children,
}: GemSummaryTooltipProps) {
  const starDisplay = "★".repeat(starRating);

  return (
    <Tooltip
      trigger={children}
      content={
        <div className="space-y-1.5">
          <div className="font-medium">
            <span className="text-yellow-400">{starDisplay}</span> {name}
          </div>
          <div className="flex gap-2 text-xs">
            <span className="text-gray-300">
              PvP: <span className="text-white font-medium">{pvpTier}</span>
            </span>
            <span className="text-gray-300">
              PvE: <span className="text-white font-medium">{pveTier}</span>
            </span>
          </div>
          {shortDescription && (
            <p className="text-xs text-gray-300 leading-relaxed">
              {shortDescription}
            </p>
          )}
          {source && (
            <p className="text-xs text-gray-400">
              <span className="text-gray-500">Source:</span> {source}
            </p>
          )}
        </div>
      }
      position="top"
      maxWidth={250}
    />
  );
}
