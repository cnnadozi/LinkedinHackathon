import type { ButtonHTMLAttributes } from "react";

type TextButtonVariant = "primary" | "default" | "connections";

export type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: TextButtonVariant;
};

export function TextButton({
  variant = "default",
  className = "",
  type = "button",
  children,
  ...props
}: TextButtonProps) {
  const classes = [
    "li-text-btn",
    `li-text-btn--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
