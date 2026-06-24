import type { ReactNode } from "react";
import { Button } from "./Button";

type FilterBarProps = {
  children: ReactNode;
  className?: string;
};

export function FilterBar({ children, className = "" }: FilterBarProps) {
  return (
    <div className={`li-filter-bar ${className}`.trim()}>{children}</div>
  );
}

type FilterDropdownProps = {
  label: string;
  onClick?: () => void;
  options?: string[];
  value?: string | null;
  onChange?: (value: string | null) => void;
};

export function FilterDropdown({
  label,
  onClick,
  options,
  value = null,
  onChange,
}: FilterDropdownProps) {
  if (options && onChange) {
    const isActive = Boolean(value);
    const triggerLabel = isActive ? value : label;

    return (
      <div className="li-filter-dropdown">
        <Button
          variant="filter"
          showChevron
          className={[
            "li-filter-dropdown__trigger",
            isActive ? "li-filter-dropdown__trigger--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {triggerLabel}
        </Button>
        <select
          className="li-filter-dropdown__select"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          aria-label={`Filter by ${label}`}
        >
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <Button variant="filter" showChevron onClick={onClick}>
      {label}
    </Button>
  );
}

type ActiveFilterTagProps = {
  label: string;
  onRemove?: () => void;
};

export function ActiveFilterTag({ label, onRemove }: ActiveFilterTagProps) {
  return (
    <span className="li-active-tag">
      {label}
      <button
        type="button"
        className="li-active-tag-remove"
        aria-label={`Remove ${label} filter`}
        onClick={onRemove}
      >
        ×
      </button>
    </span>
  );
}

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentGroupProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange?: (value: T) => void;
};

export function SegmentGroup<T extends string>({
  options,
  value,
  onChange,
}: SegmentGroupProps<T>) {
  return (
    <div className="li-segment-group">
      {options.map((option) => (
        <Button
          key={option.value}
          variant="segment"
          active={value === option.value}
          onClick={() => onChange?.(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export function ClearFiltersLink({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" className="li-filter-bar__clear" onClick={onClick}>
      Clear filters
    </button>
  );
}

/** @deprecated Use ClearFiltersLink */
export const AllFiltersLink = ClearFiltersLink;
