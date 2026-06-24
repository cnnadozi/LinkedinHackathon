/** Solid nav icons — same visual weight as linkedin.com global nav. */
import type { ReactNode } from "react";

type NavIconProps = {
  children: ReactNode;
  className?: string;
};

export function NavIconSvg({ children, className = "" }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function NavIconHome() {
  return (
    <NavIconSvg>
      <path d="M22.46 7.57 12.357 2.115a.998.998 0 0 0-.714 0L1.543 7.57A1 1 0 0 0 1 8.298V19.07a1 1 0 0 0 1 1h6.5v-7h7v7h6.5a1 1 0 0 0 1-1V8.298a1 1 0 0 0-.54-.728z" />
    </NavIconSvg>
  );
}

export function NavIconNetwork() {
  return (
    <NavIconSvg>
      <path d="M7.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM18.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM7.5 14.5c-2.5 0-4.5 1.5-4.5 3.5V21h9v-3c0-2-2-3.5-4.5-3.5zM18.5 16c-1.9 0-3.5 1-4 2.5-.3.6-.5 1.3-.5 2V21h9v-4.5c0-2-2-3.5-4.5-3.5z" />
    </NavIconSvg>
  );
}

export function NavIconJobs() {
  return (
    <NavIconSvg>
      <path d="M20.5 8h-2.75V6.5A2.5 2.5 0 0 0 15.25 4h-6.5A2.5 2.5 0 0 0 6.25 6.5V8H3.5A1.5 1.5 0 0 0 2 9.5v9A1.5 1.5 0 0 0 3.5 20h17a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 20.5 8zM8.75 6.5a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 .75.75V8h-8V6.5z" />
    </NavIconSvg>
  );
}

export function NavIconMessaging() {
  return (
    <NavIconSvg>
      <path d="M16.5 4h-9A2.5 2.5 0 0 0 5 6.5v7A2.5 2.5 0 0 0 7.5 16H11l3.5 3.5V16h2A2.5 2.5 0 0 0 19 13.5v-7A2.5 2.5 0 0 0 16.5 4zM8.5 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3.5 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3.5-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </NavIconSvg>
  );
}

export function NavIconNotifications() {
  return (
    <NavIconSvg>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9z" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </NavIconSvg>
  );
}

/** Gather — solid calendar silhouette (matches filled nav icon set). */
export function NavIconGather() {
  return (
    <NavIconSvg>
      <path d="M17 2h-2v3H9V2H7v3H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2V2zm0 18H7V9h10v11z" />
      <path d="M8 11h2v2H8zm4 0h2v2h-2zm4 0h2v2h-2z" />
    </NavIconSvg>
  );
}

export function NavIconWorkplace() {
  return (
    <NavIconSvg>
      <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
    </NavIconSvg>
  );
}

export function NavIconLearning() {
  return (
    <NavIconSvg>
      <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm0 11.5L5 10v6.5l7 3.8 7-3.8V10l-7 4.5z" />
    </NavIconSvg>
  );
}

export function NavIconSearch() {
  return (
    <NavIconSvg className="li-nav__search-svg">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </NavIconSvg>
  );
}

export function NavIconCaret() {
  return (
    <NavIconSvg className="li-nav__caret">
      <path d="M7 10l5 5 5-5H7z" />
    </NavIconSvg>
  );
}
