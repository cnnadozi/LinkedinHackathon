type TabOption<T extends string> = {
  value: T;
  label: string;
};

export type TabsProps<T extends string> = {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label"?: string;
  className?: string;
};

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className = "",
}: TabsProps<T>) {
  return (
    <div
      className={["li-tabs", className].filter(Boolean).join(" ")}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`li-tabs__tab${isActive ? " li-tabs__tab--active" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
