/**
 * Button component for DI-Lab
 * Supports variants, sizes, loading states, and accessibility
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Show loading spinner and disable */
  loading?: boolean;
  /** Icon to display before the label */
  startIcon?: ReactNode;
  /** Icon to display after the label */
  endIcon?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
}

// ============================================================================
// Styles
// ============================================================================

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-blue-600 text-white 
    hover:bg-blue-700 
    focus:ring-blue-500 
    active:bg-blue-800
    disabled:bg-blue-300 disabled:cursor-not-allowed
  `,
  secondary: `
    bg-gray-100 text-gray-900 
    hover:bg-gray-200 
    focus:ring-gray-500 
    active:bg-gray-300
    disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
  `,
  ghost: `
    bg-transparent text-gray-700 
    hover:bg-gray-100 
    focus:ring-gray-500 
    active:bg-gray-200
    disabled:text-gray-400 disabled:cursor-not-allowed
  `,
  danger: `
    bg-red-600 text-white 
    hover:bg-red-700 
    focus:ring-red-500 
    active:bg-red-800
    disabled:bg-red-300 disabled:cursor-not-allowed
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-base gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
};

const baseStyles = `
  inline-flex items-center justify-center
  font-medium rounded-lg
  transition-all duration-150
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50
`;

// ============================================================================
// Component
// ============================================================================

/**
 * Button component with variants, sizes, and loading state
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * <Button loading>Saving...</Button>
 * <Button variant="danger" startIcon={<TrashIcon />}>Delete</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      startIcon,
      endIcon,
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `
          .replace(/\s+/g, " ")
          .trim()}
        {...props}
      >
        {loading ? (
          <Loader2
            className="animate-spin"
            size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
          />
        ) : (
          startIcon
        )}
        <span>{children}</span>
        {!loading && endIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

// ============================================================================
// Exports
// ============================================================================

export default Button;
