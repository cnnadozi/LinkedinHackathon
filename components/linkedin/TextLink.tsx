/** Inline text link — blue per linkedin.com (never green). */
import type { AnchorHTMLAttributes } from "react";

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export default function TextLink({
  className = "",
  children,
  ...props
}: TextLinkProps) {
  return (
    <a className={`li-text-link ${className}`.trim()} {...props}>
      {children}
    </a>
  );
}
