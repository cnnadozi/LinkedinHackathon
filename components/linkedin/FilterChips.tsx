"use client";

export type FilterChip = {
  id: string;
  label: string;
};

type FilterChipsProps = {
  chips: FilterChip[];
  activeIds?: string[];
  onToggle?: (id: string) => void;
  onClear?: () => void;
  className?: string;
};

export function FilterChips({
  chips,
  activeIds = [],
  onToggle,
  onClear,
  className = "",
}: FilterChipsProps) {
  const hasActive = activeIds.length > 0;

  return (
    <div className={`li-filter-chips ${className}`.trim()} role="group">
      {chips.map((chip) => {
        const isActive = activeIds.includes(chip.id);

        return (
          <button
            key={chip.id}
            type="button"
            className={`li-filter-chips__chip${isActive ? " li-filter-chips__chip--active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onToggle?.(chip.id)}
          >
            {chip.label}
            {isActive && (
              <span
                className="li-filter-chips__chip-remove"
                aria-hidden="true"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggle?.(chip.id);
                }}
              >
                ×
              </span>
            )}
          </button>
        );
      })}
      {hasActive && onClear && (
        <button
          type="button"
          className="li-filter-chips__clear"
          onClick={onClear}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
