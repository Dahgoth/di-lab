/**
 * Input component for DI-Lab
 * With label, error state, validation, and debounced onChange
 */

import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useId,
  type InputHTMLAttributes,
  type ChangeEvent,
} from "react";

// ============================================================================
// Types
// ============================================================================

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  /** Label text */
  label?: string;
  /** Helper text shown below input */
  helperText?: string;
  /** Error message (shows error state) */
  error?: string;
  /** Debounce delay in ms (default: 0 = no debounce) */
  debounceMs?: number;
  /** Change handler */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Full width input */
  fullWidth?: boolean;
  /** Start icon/adornment */
  startIcon?: React.ReactNode;
  /** End icon/adornment */
  endIcon?: React.ReactNode;
}

// ============================================================================
// Styles
// ============================================================================

const baseInputStyles = `
  block rounded-lg border 
  bg-white 
  px-3 py-2 
  text-gray-900 
  placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-offset-0
  disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
  transition-colors duration-150
`;

const normalStyles = `
  border-gray-300 
  focus:border-blue-500 focus:ring-blue-500
`;

const errorStyles = `
  border-red-500 
  focus:border-red-500 focus:ring-red-500
  text-red-900
`;

// ============================================================================
// Component
// ============================================================================

/**
 * Input component with label, error state, and debounced onChange
 *
 * @example
 * ```tsx
 * <Input
 *   label="Platinum Amount"
 *   type="number"
 *   value={platinum}
 *   onChange={(val) => setPlatinum(val)}
 *   debounceMs={300}
 *   error={error}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      debounceMs = 0,
      onChange,
      fullWidth = false,
      startIcon,
      endIcon,
      className = "",
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Generate unique ID if not provided
    const generatedId = useId();
    const inputId = id || generatedId;

    // Local state for debounced value - initialized from props
    const [localValue, setLocalValue] = useState(
      () => (props.value as string) ?? "",
    );

    // Debounce timer ref
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Use external value if provided (controlled), otherwise use local state
    const externalValue = props.value;
    const displayValue =
      externalValue !== undefined ? String(externalValue) : localValue;

    // Cleanup debounce timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    // Handle change with optional debounce
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setLocalValue(newValue);

      if (debounceMs > 0) {
        // Clear existing timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Set new timer
        debounceTimerRef.current = setTimeout(() => {
          onChange?.(newValue, event);
        }, debounceMs);
      } else {
        // No debounce - call immediately
        onChange?.(newValue, event);
      }
    };

    const hasError = Boolean(error);

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
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

          <input
            ref={ref}
            id={inputId}
            value={displayValue}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={`
              ${baseInputStyles}
              ${hasError ? errorStyles : normalStyles}
              ${startIcon ? "pl-10" : ""}
              ${endIcon ? "pr-10" : ""}
              ${fullWidth ? "w-full" : ""}
              ${disabled ? "opacity-50" : ""}
              ${className}
            `
              .replace(/\s+/g, " ")
              .trim()}
            {...props}
          />

          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {endIcon}
            </div>
          )}
        </div>

        {hasError && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// ============================================================================
// Number Input Variant
// ============================================================================

export interface NumberInputProps extends Omit<
  InputProps,
  "type" | "onChange" | "value"
> {
  /** Current value */
  value: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Change handler */
  onChange?: (value: number) => void;
}

/**
 * Number input with proper handling of numeric values
 *
 * @example
 * ```tsx
 * <NumberInput
 *   label="Platinum"
 *   value={platinum}
 *   onChange={(val) => setPlatinum(val)}
 *   min={0}
 *   debounceMs={300}
 * />
 * ```
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, min, max, step = 1, onChange, ...props }, ref) => {
    const handleChange = (stringValue: string) => {
      // Handle empty string
      if (stringValue === "") {
        onChange?.(0);
        return;
      }

      // Parse and validate
      const numValue = parseFloat(stringValue);

      if (isNaN(numValue)) {
        return;
      }

      // Clamp to min/max
      let clampedValue = numValue;
      if (min !== undefined) clampedValue = Math.max(min, clampedValue);
      if (max !== undefined) clampedValue = Math.min(max, clampedValue);

      // Only fire if it's a valid number
      if (!isNaN(clampedValue)) {
        onChange?.(clampedValue);
      }
    };

    return (
      <Input
        ref={ref}
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        {...props}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

// ============================================================================
// Exports
// ============================================================================

export default Input;
