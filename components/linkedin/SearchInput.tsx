/** Search field with magnifier icon and optional clear button. */
import type { InputHTMLAttributes } from "react";

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  onClear?: () => void;
  fullWidth?: boolean;
};

function SearchIcon() {
  return (
    <svg
      className="li-search-input__icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.156a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SearchInput({
  className = "",
  fullWidth = true,
  value,
  onClear,
  placeholder = "Search",
  ...props
}: SearchInputProps) {
  const classes = [
    "li-search-input",
    fullWidth ? "li-search-input--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const showClear =
    onClear && value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className={classes}>
      <SearchIcon />
      <input
        type="search"
        className="li-search-input__field"
        placeholder={placeholder}
        value={value}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          className="li-search-input__clear"
          aria-label="Clear search"
          onClick={onClear}
        >
          ×
        </button>
      )}
    </div>
  );
}
