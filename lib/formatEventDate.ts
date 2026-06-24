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
