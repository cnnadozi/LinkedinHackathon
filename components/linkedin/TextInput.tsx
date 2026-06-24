/** Labeled text field — auto-generates id from label when none is passed. */
import type { InputHTMLAttributes } from "react";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  fullWidth?: boolean;
};

export function TextInput({
  label,
  fullWidth = false,
  className = "",
  id,
  ...props
}: TextInputProps) {
  const inputId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const fieldClasses = [
    "li-field",
    fullWidth ? "li-field--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldClasses}>
      {label && (
        <label htmlFor={inputId} className="li-field__label">
          {label}
        </label>
      )}
      <input id={inputId} className="li-text-input" {...props} />
    </div>
  );
}
