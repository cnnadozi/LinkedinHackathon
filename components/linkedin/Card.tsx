import type { ReactNode } from "react";

type CardPadding = "sm" | "md" | "lg";

export type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
};

export function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  const classes = [
    "li-card",
    `li-card--padding-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
