/** LinkedIn-style button — styles in app/globals.css (live site reference). */
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "success"
  | "filter"
  | "pill-active"
  | "segment";

type ButtonSize = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  icon?: ReactNode;
  showChevron?: boolean;
};

/**
 * Variant guide (from linkedin.com):
 * - primary: filled blue CTA (RSVP, Send)
 * - secondary: outlined pill — Connections "Message" / attendee "Nudge"
 * - success: confirmed state ("Nudged ✓")
 */
const variantClass: Record<ButtonVariant, string> = {
  primary: "li-btn--primary",
  secondary: "li-btn--secondary",
  ghost: "li-btn--ghost",
  success: "li-btn--success",
  filter: "li-btn-filter",
  "pill-active": "li-btn-pill-active",
  segment: "li-btn-segment",
};

export function Button({
  variant = "primary",
  size = "md",
  active = false,
  icon,
  showChevron = false,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const isLegacyVariant = variant === "filter" || variant === "pill-active" || variant === "segment";
  const classes = [
    "li-btn",
    variantClass[variant],
    !isLegacyVariant ? `li-btn--${size}` : "",
    variant === "segment" && active ? "li-btn-segment-active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {icon}
      {children}
      {showChevron && <span className="li-btn-chevron">▾</span>}
    </button>
  );
}
