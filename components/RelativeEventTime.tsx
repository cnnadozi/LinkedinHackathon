"use client";

import { useEffect, useState } from "react";
import {
  formatEventDate,
  formatRelativeFeedTime,
  formatSidebarEventStatus,
  formatStaticEventTime,
} from "@/lib/formatEventDate";

type RelativeEventTimeProps = {
  iso: string;
  mode: "feed" | "sidebar" | "detail";
  className?: string;
  liveClassName?: string;
};

/** Resolves locale-relative event times after mount to avoid SSR/client hydration drift. */
export function RelativeEventTime({
  iso,
  mode,
  className,
  liveClassName,
}: RelativeEventTimeProps) {
  const [label, setLabel] = useState(() => formatStaticEventTime(iso));
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (mode === "feed") {
      setLabel(formatRelativeFeedTime(iso));
      setIsLive(false);
      return;
    }

    if (mode === "detail") {
      setLabel(formatEventDate(iso).scheduleLabel);
      setIsLive(false);
      return;
    }

    const status = formatSidebarEventStatus(iso);
    setLabel(status.label);
    setIsLive(status.isLive);
  }, [iso, mode]);

  const combinedClassName = [
    className,
    isLive && liveClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={combinedClassName || undefined} suppressHydrationWarning>
      {label}
    </span>
  );
}
