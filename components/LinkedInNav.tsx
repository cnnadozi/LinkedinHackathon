"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── SVG icon helpers ── */

function LinkedInLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-label="LinkedIn">
      <rect width="34" height="34" rx="4" fill="#0A66C2" />
      <path
        d="M7.5 13.5h4V26.5h-4V13.5zm2-6.5a2.3 2.3 0 1 1 0 4.6A2.3 2.3 0 0 1 9.5 7zM14.5 13.5h3.8v1.8h.05c.53-1 1.82-2.05 3.75-2.05 4.02 0 4.76 2.64 4.76 6.07V26.5h-4v-6.38c0-1.52-.03-3.47-2.12-3.47-2.12 0-2.44 1.65-2.44 3.36V26.5h-3.8V13.5z"
        fill="#fff"
      />
    </svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="li-topnav__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {active ? (
        <path d="M10.02 2.54a2.75 2.75 0 0 1 3.96 0L22.5 9.67V21a1.5 1.5 0 0 1-1.5 1.5h-5.25v-6h-3.5v6H7A1.5 1.5 0 0 1 5.5 21V9.67l4.52-7.13z" />
      ) : (
        <path d="M13.98 2.54a2.75 2.75 0 0 0-3.96 0L1.5 9.67V21A1.5 1.5 0 0 0 3 22.5h5.25v-6h3.5v6H17A1.5 1.5 0 0 0 18.5 21V9.67l-4.52-7.13zm-2.5 1.3 4.52 7.13V21H14.5v-6h-5v6H3V10.97l8.48-7.13z" />
      )}
    </svg>
  );
}

function NetworkIcon({ active }: { active: boolean }) {
  return (
    <svg className="li-topnav__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {active ? (
        <path d="M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm8 0c-.33 0-.69.02-1.07.05 1.28.9 2.07 2.15 2.07 3.95v2h6v-2c0-2.66-5.33-4-7-4z" />
      ) : (
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      )}
    </svg>
  );
}

function JobsIcon({ active }: { active: boolean }) {
  return (
    <svg className="li-topnav__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {active ? (
        <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-10-2h4v2h-4V5z" />
      ) : (
        <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-10-2h4v2h-4V5zm10 15H4V9h16v11z" />
      )}
    </svg>
  );
}

function MessagingIcon({ active }: { active: boolean }) {
  return (
    <svg className="li-topnav__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {active ? (
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
      ) : (
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 14H6l-2 2V4h16v12z" />
      )}
    </svg>
  );
}

function NotificationsIcon({ active }: { active: boolean }) {
  return (
    <svg className="li-topnav__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {active ? (
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
      ) : (
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
      )}
    </svg>
  );
}

function MeIcon() {
  return (
    <svg className="li-topnav__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 11c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" />
    </svg>
  );
}

/** Gather calendar icon — slightly special, always branded blue */
function GatherIcon({ active }: { active: boolean }) {
  return (
    <svg className="li-topnav__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {active ? (
        <path d="M20 3h-1V1h-2v2H7V1H5v2H4C2.9 3 2 3.9 2 5v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
      ) : (
        <>
          <path d="M20 3h-1V1h-2v2H7V1H5v2H4C2.9 3 2 3.9 2 5v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
          <path d="M9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
        </>
      )}
    </svg>
  );
}

/* ── Nav items config ── */

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/network", label: "My Network", icon: NetworkIcon },
  { href: "/jobs", label: "Jobs", icon: JobsIcon },
  { href: "/messages", label: "Messaging", icon: MessagingIcon },
  { href: "/notifications", label: "Notifications", icon: NotificationsIcon },
] as const;

/* ── Component ── */

export default function LinkedInNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="li-topnav" role="banner">
      <div className="li-topnav__inner">
        {/* Logo */}
        <Link href="/" className="li-topnav__logo" aria-label="LinkedIn home">
          <LinkedInLogo />
        </Link>

        {/* Search */}
        <div className="li-topnav__search-wrap">
          <div className="li-search-input li-search-input--full">
            <span className="li-search-input__icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14.56 13.5l-3.26-3.26A5.5 5.5 0 1 0 10.24 11.3l3.26 3.26a.75.75 0 0 0 1.06-1.06zM2.5 7a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0z" />
              </svg>
            </span>
            <input
              type="search"
              className="li-search-input__field"
              placeholder="Search"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Nav icons */}
        <nav className="li-topnav__nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`li-topnav__item${active ? " li-topnav__item--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon active={active} />
                <span className="li-topnav__label">{label}</span>
              </Link>
            );
          })}

          {/* Me / profile */}
          <Link
            href="/profile"
            className={`li-topnav__item${isActive("/profile") ? " li-topnav__item--active" : ""}`}
          >
            <MeIcon />
            <span className="li-topnav__label">Me</span>
          </Link>

          <div className="li-topnav__divider" aria-hidden />

          {/* Gather — the new feature */}
          <Link
            href="/gather"
            className={`li-topnav__item li-topnav__item--gather${isActive("/gather") ? " li-topnav__item--active" : ""}`}
            aria-current={isActive("/gather") ? "page" : undefined}
          >
            <GatherIcon active={isActive("/gather")} />
            <span className="li-topnav__label">Gather</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
