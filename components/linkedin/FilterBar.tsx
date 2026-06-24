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
};

export function FilterDropdown({ label, onClick }: FilterDropdownProps) {
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

export function AllFiltersLink({ onClick }: { onClick?: () => void }) {
  return (
    <span className="li-filter-bar-end">
      <Button variant="ghost" onClick={onClick}>
        All filters
      </Button>
    </span>
  );
}
