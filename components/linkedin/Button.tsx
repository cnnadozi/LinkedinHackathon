import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "filter"
  | "ghost"
  | "pill-active"
  | "segment";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  active?: boolean;
  icon?: ReactNode;
  showChevron?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "li-btn-primary",
  filter: "li-btn-filter",
  ghost: "li-btn-ghost",
  "pill-active": "li-btn-pill-active",
  segment: "li-btn-segment",
};

export default function Button({
  variant = "primary",
  active = false,
  icon,
  showChevron = false,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const activeClass =
    variant === "segment" && active ? " li-btn-segment-active" : "";

  return (
    <button
      type={type}
      className={`li-btn ${variantClass[variant]}${activeClass} ${className}`.trim()}
      {...props}
    >
      {icon}
      {children}
      {showChevron && <span className="li-btn-chevron">▾</span>}
    </button>
  );
}
