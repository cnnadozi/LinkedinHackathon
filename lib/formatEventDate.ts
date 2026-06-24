/** Format ISO event timestamps for the event detail page. */

export type FormattedEventDate = {
  dateLabel: string;
  timeLabel: string;
  fullLabel: string;
  scheduleLabel: string;
};

export function formatEventDate(iso: string, durationMinutes = 45): FormattedEventDate {
  const start = new Date(iso);
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  const dateLabel = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeLabel = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const endTimeLabel = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const scheduleLabel = `${dateLabel}, ${timeLabel} - ${endTimeLabel} (your local time)`;

  return {
    dateLabel,
    timeLabel,
    fullLabel: `${dateLabel} · ${timeLabel}`,
    scheduleLabel,
  };
}

/** Banner accent class keyed by event industry. */
export function eventBannerClass(industry: string): string {
  const key = industry.toLowerCase().replace(/\s+/g, "-");
  return `event-detail__banner--${key}`;
}

export function isEventLive(iso: string, durationMinutes = 45): boolean {
  const start = new Date(iso);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const now = new Date();
  return now >= start && now < end;
}

export type SidebarEventStatus = {
  label: string;
  isLive: boolean;
};

/** Compact time label for sidebar recommendation rows. */
export function formatSidebarEventStatus(
  iso: string,
  durationMinutes = 45,
): SidebarEventStatus {
  if (isEventLive(iso, durationMinutes)) {
    return { label: "Happening now", isLive: true };
  }

  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (sameDay) return { label: `Today, ${time}`, isLive: false };
  if (isTomorrow) return { label: `Tomorrow, ${time}`, isLive: false };

  return {
    label: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    isLive: false,
  };
}
