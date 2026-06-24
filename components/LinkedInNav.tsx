/** Top global nav — mirrors linkedin.com shell with Gather icon for calendar overlay. */
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "./linkedin/Avatar";
import {
  NavIconGather,
  NavIconHome,
  NavIconJobs,
  NavIconLearning,
  NavIconMessaging,
  NavIconNetwork,
  NavIconNotifications,
  NavIconSearch,
  NavIconWorkplace,
  NavIconCaret,
} from "./linkedin/NavIcons";

type NavLinkItem = {
  label: string;
  href: string;
  icon: ReactNode;
  isActive?: (pathname: string) => boolean;
};

const NAV_ITEMS: NavLinkItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <NavIconHome />,
    isActive: (pathname) => pathname === "/",
  },
  {
    label: "My Network",
    href: "#",
    icon: <NavIconNetwork />,
  },
  {
    label: "Jobs",
    href: "#",
    icon: <NavIconJobs />,
  },
  {
    label: "Messaging",
    href: "#",
    icon: <NavIconMessaging />,
  },
  {
    label: "Notifications",
    href: "#",
    icon: <NavIconNotifications />,
  },
];

function navLinkClass(isActive: boolean, extra = "") {
  return [
    "li-nav__link",
    isActive ? "li-nav__link--active" : "",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function LinkedInNav() {
  const pathname = usePathname();
  const gatherActive = pathname.startsWith("/events");

  return (
    <header className="li-nav">
      <div className="li-nav__inner">
        <div className="li-nav__start">
          <Link href="/" className="li-nav__logo" aria-label="LinkedIn home">
            <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden>
              <path
                fill="#0a66c2"
                d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2z"
              />
              <path
                fill="#fff"
                d="M7.5 9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM6.75 18v-7h1.5v7h-1.5zM11.25 18v-4.25c0-1.24 1-2.25 2.25-2.25s2.25 1.01 2.25 2.25V18h1.5v-4.75a3.75 3.75 0 0 0-7.5 0V18h1.5z"
              />
            </svg>
          </Link>
          <label className="li-nav__search">
            <span className="li-nav__search-icon" aria-hidden>
              <NavIconSearch />
            </span>
            <input
              type="search"
              className="li-nav__search-input"
              placeholder="I'm looking for..."
              aria-label="Search"
            />
          </label>
        </div>

        <nav className="li-nav__links" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = item.isActive?.(pathname) ?? false;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={navLinkClass(active)}
              >
                <span className="li-nav__icon">{item.icon}</span>
                <span className="li-nav__label">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            className={navLinkClass(gatherActive, "li-nav__link--gather")}
            aria-label="Gather calendar"
            aria-current={gatherActive ? "page" : undefined}
          >
            <span className="li-nav__icon">
              <NavIconGather />
            </span>
            <span className="li-nav__label">Gather</span>
          </button>
        </nav>

        <div className="li-nav__end">
          <button type="button" className="li-nav__link li-nav__link--me">
            <span className="li-nav__icon li-nav__icon--avatar">
              <Avatar alt="Demo User" size="sm" />
            </span>
            <span className="li-nav__label li-nav__label--me">
              Me
              <NavIconCaret />
            </span>
          </button>
          <button type="button" className="li-nav__link">
            <span className="li-nav__icon">
              <NavIconWorkplace />
            </span>
            <span className="li-nav__label">For Business</span>
          </button>
          <button type="button" className="li-nav__link">
            <span className="li-nav__icon">
              <NavIconLearning />
            </span>
            <span className="li-nav__label">Learning</span>
          </button>
        </div>
      </div>
    </header>
  );
}
