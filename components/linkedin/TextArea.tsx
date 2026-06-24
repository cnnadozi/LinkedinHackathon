/** Labeled multiline field for message compose and event descriptions. */
import type { TextareaHTMLAttributes } from "react";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  fullWidth?: boolean;
};

export function TextArea({
  label,
  fullWidth = true,
  className = "",
  id,
  rows = 3,
  ...props
}: TextAreaProps) {
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
      <textarea
        id={inputId}
        className="li-textarea"
        rows={rows}
        {...props}
      />
    </div>
  );
}
