/**
 * Select component for DI-Lab
 * Native dropdown for mobile compatibility
 */

import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
  type ReactNode,
} from "react";

// ============================================================================
// Types
// ============================================================================

export interface SelectOption {
  /** Option value */
  value: string | number;
  /** Display label */
  label: string;
  /** Whether option is disabled */
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  /** Label text */
  label?: string;
  /** Helper text shown below select */
  helperText?: string;
  /** Error message (shows error state) */
  error?: string;
  /** Options array */
  options: SelectOption[];
  /** Placeholder text (shown as disabled first option) */
  placeholder?: string;
  /** Change handler */
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  /** Full width select */
  fullWidth?: boolean;
  /** Start icon/adornment */
  startIcon?: ReactNode;
}

// ============================================================================
// Styles
// ============================================================================

const baseSelectStyles = `
  block rounded-lg border 
  bg-white 
  px-3 py-2 
  text-gray-900 
  focus:outline-none focus:ring-2 focus:ring-offset-0
  disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
  transition-colors duration-150
  appearance-none
  cursor-pointer
`;

const normalStyles = `
  border-gray-300 
  focus:border-blue-500 focus:ring-blue-500
`;

const errorStyles = `
  border-red-500 
  focus:border-red-500 focus:ring-red-500
`;

// ============================================================================
// Component
// ============================================================================

/**
 * Select component with native dropdown for mobile compatibility
 *
 * @example
 * ```tsx
 * <Select
 *   label="Quality"
 *   value={quality}
 *   onChange={(val) => setQuality(Number(val))}
 *   options={[
 *     { value: 1, label: '1★' },
 *     { value: 2, label: '2★' },
 *     { value: 3, label: '3★' },
 *   ]}
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      placeholder,
      onChange,
      fullWidth = false,
      startIcon,
      className = "",
      id,
      disabled,
      value,
      ...props
    },
    ref,
  ) => {
    // Generate unique ID if not provided
    const generatedId = useId();
    const selectId = id || generatedId;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(event.target.value, event);
    };

    const hasError = Boolean(error);

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {startIcon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${selectId}-error`
                : helperText
                  ? `${selectId}-helper`
                  : undefined
            }
            className={`
              ${baseSelectStyles}
              ${hasError ? errorStyles : normalStyles}
              ${startIcon ? "pl-10" : ""}
              ${fullWidth ? "w-full" : ""}
              ${disabled ? "opacity-50" : ""}
              pr-10
              ${className}
            `
              .replace(/\s+/g, " ")
              .trim()}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown arrow icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {hasError && (
          <p
            id={`${selectId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create options array from a range of numbers
 * Useful for rank (1-10) or quality (1-5) selects
 */
export function createNumberOptions(
  start: number,
  end: number,
  labelFn?: (n: number) => string,
): SelectOption[] {
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const value = start + i;
    return {
      value,
      label: labelFn ? labelFn(value) : String(value),
    };
  });
}

/**
 * Pre-defined quality options (1-5 stars)
 */
export const QUALITY_OPTIONS: SelectOption[] = createNumberOptions(
  1,
  5,
  (n) => `Quality ${n}`,
);

/**
 * Pre-defined rank options (1-10)
 */
export const RANK_OPTIONS: SelectOption[] = createNumberOptions(
  1,
  10,
  (n) => `Rank ${n}`,
);

/**
 * Pre-defined star rating options
 */
export const STAR_RATING_OPTIONS: SelectOption[] = [
  { value: 1, label: "1-Star" },
  { value: 2, label: "2-Star" },
  { value: 5, label: "5-Star" },
];

// ============================================================================
// Exports
// ============================================================================

export default Select;
