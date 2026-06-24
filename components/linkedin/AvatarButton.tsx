import type { ButtonHTMLAttributes, ReactNode } from "react";

export type AvatarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function AvatarButton({
  className = "",
  type = "button",
  children,
  ...props
}: AvatarButtonProps) {
  const classes = ["li-avatar-btn", className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
