/**
 * Card component for DI-Lab
 * Container with header, body, and footer sections
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card header content */
  header?: ReactNode;
  /** Card footer content */
  footer?: ReactNode;
  /** Apply hover styles */
  hoverable?: boolean;
  /** Apply selected/active styles */
  selected?: boolean;
  /** Padding size */
  padding?: "none" | "sm" | "md" | "lg";
}

// ============================================================================
// Styles
// ============================================================================

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

const baseStyles = `
  bg-white 
  rounded-lg 
  border 
  border-gray-200 
  shadow-sm
`;

const hoverStyles = `
  hover:border-gray-300 
  hover:shadow-md 
  hover:scale-[1.02] 
  transition-all 
  duration-150 
  cursor-pointer
`;

const selectedStyles = `
  border-blue-500 
  ring-2 
  ring-blue-200
`;

// ============================================================================
// Component
// ============================================================================

/**
 * Card component with optional header and footer
 *
 * @example
 * ```tsx
 * <Card header={<h2>Title</h2>} footer={<Button>Action</Button>}>
 *   <p>Card content</p>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      header,
      footer,
      hoverable = false,
      selected = false,
      padding = "md",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${hoverable ? hoverStyles : ""}
          ${selected ? selectedStyles : ""}
          ${className}
        `
          .replace(/\s+/g, " ")
          .trim()}
        {...props}
      >
        {header && (
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
            {header}
          </div>
        )}

        <div className={paddingStyles[padding]}>{children}</div>

        {footer && (
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    );
  },
);

Card.displayName = "Card";

// ============================================================================
// Sub-Components
// ============================================================================

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Title text */
  title?: string;
  /** Subtitle/description text */
  subtitle?: string;
  /** Action buttons on the right side */
  action?: ReactNode;
}

/**
 * Card header with title, subtitle, and optional action
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between ${className}`}
        {...props}
      >
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          {children}
        </div>
        {action && <div className="ml-4 flex-shrink-0">{action}</div>}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Apply prose styling for text content */
  prose?: boolean;
}

/**
 * Card body content wrapper
 */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ prose = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          ${prose ? "prose prose-sm max-w-none" : ""}
          ${className}
        `
          .replace(/\s+/g, " ")
          .trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardBody.displayName = "CardBody";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Align actions to the right */
  alignRight?: boolean;
}

/**
 * Card footer for actions
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ alignRight = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          flex gap-3
          ${alignRight ? "justify-end" : "justify-start"}
          ${className}
        `
          .replace(/\s+/g, " ")
          .trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";

// ============================================================================
// Exports
// ============================================================================

export default Card;
