/** Top global nav — mirrors linkedin.com shell with Gather icon for calendar overlay. */
"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ChevronDown, LayoutGrid, MonitorPlay, Search } from "lucide-react";
import {
  BellIcon,
  BriefcaseIcon,
  ChatBubbleOvalLeftIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Avatar } from "./linkedin/Avatar";

type NavLinkItem = {
  label: string;
  href: string;
  icon: ReactNode;
  isActive?: (pathname: string) => boolean;
};

const NAV_ICON_SIZE = 24;

const NAV_ITEMS: NavLinkItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="li-nav__glyph" aria-hidden />,
  },
  {
    label: "My Network",
    href: "#",
    icon: <UsersIcon className="li-nav__glyph" aria-hidden />,
  },
  {
    label: "Jobs",
    href: "#",
    icon: <BriefcaseIcon className="li-nav__glyph" aria-hidden />,
  },
  {
    label: "Messaging",
    href: "#",
    icon: <ChatBubbleOvalLeftIcon className="li-nav__glyph" aria-hidden />,
  },
  {
    label: "Notifications",
    href: "#",
    icon: <BellIcon className="li-nav__glyph" aria-hidden />,
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
  const gatherActive = pathname.startsWith("/gather");

  return (
    <header className="li-nav">
      <div className="li-nav__inner">
        <div className="li-nav__start">
          <Link href="/" className="li-nav__logo" aria-label="LinkedIn home">
            <Image
              src="/assets/linkedin-logo.png"
              alt="LinkedIn"
              width={34}
              height={34}
              priority
            />
          </Link>
          <label className="li-nav__search">
            <span className="li-nav__search-icon" aria-hidden>
              <Search size={16} />
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

          <Link
            href="/gather"
            className={navLinkClass(gatherActive, "li-nav__link--gather")}
            aria-label="Gather calendar"
            aria-current={gatherActive ? "page" : undefined}
          >
            <span className="li-nav__icon">
              <CalendarDays size={NAV_ICON_SIZE} aria-hidden />
            </span>
            <span className="li-nav__label">Gather</span>
          </Link>
        </nav>

        <div className="li-nav__end">
          <button type="button" className="li-nav__link li-nav__link--me">
            <span className="li-nav__icon li-nav__icon--avatar">
              <Avatar alt="Demo User" size="sm" />
            </span>
            <span className="li-nav__label li-nav__label--me">
              Me
              <ChevronDown className="li-nav__caret" size={14} aria-hidden />
            </span>
          </button>

          <span className="li-nav__divider" aria-hidden />

          <button type="button" className="li-nav__link">
            <span className="li-nav__icon">
              <LayoutGrid size={NAV_ICON_SIZE} aria-hidden />
            </span>
            <span className="li-nav__label li-nav__label--me">
              For Business
              <ChevronDown className="li-nav__caret" size={14} aria-hidden />
            </span>
          </button>
          <button type="button" className="li-nav__link">
            <span className="li-nav__icon">
              <MonitorPlay size={NAV_ICON_SIZE} aria-hidden />
            </span>
            <span className="li-nav__label">Learning</span>
          </button>
        </div>
      </div>
    </header>
  );
}
