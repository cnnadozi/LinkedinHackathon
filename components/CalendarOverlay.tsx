"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Event } from "@/types/event";
import "./CalendarOverlay.css";

type ViewMode = "month" | "week" | "day";

import { industryColor } from "@/lib/industryColors";

/* ── Date helpers ── */

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function eventsOnDate(list: Event[], date: Date): Event[] {
  return list.filter((e) => sameDay(new Date(e.time), date));
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12}${ampm}` : `${h12}:${String(m).padStart(2, "0")}${ampm}`;
}

/** Returns all Date cells shown in a month grid (Mon of prev + all days + overflow). */
function monthViewDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const startDow = first.getDay(); // 0=Sun
  const days: Date[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  const total = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= total; d++) {
    days.push(new Date(year, month, d));
  }

  while (days.length % 7 !== 0) {
    const last = days[days.length - 1];
    days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }

  return days;
}

/** Returns Sun–Sat for the week containing `date`. */
function weekDays(date: Date): Date[] {
  const dow = date.getDay();
  const sun = new Date(date);
  sun.setDate(date.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sun);
    d.setDate(sun.getDate() + i);
    return d;
  });
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DOW_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/** Hours shown in week/day view: 7 am → 9 pm */
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7);

function hourLabel(h: number): string {
  if (h === 12) return "12 pm";
  return h > 12 ? `${h - 12} pm` : `${h} am`;
}

/* ── Component ── */

type CalendarOverlayProps = {
  events: Event[];
  /** Event ids the main user has RSVP'd to (from their attending_event_ids). */
  rsvpEventIds: string[];
};

export default function CalendarOverlay({
  events,
  rsvpEventIds,
}: CalendarOverlayProps) {
  const rsvpSet = new Set(rsvpEventIds);
  const rsvpd = events.filter((e) => rsvpSet.has(e.id));

  const todayRef = useRef(new Date());
  const today = todayRef.current;

  const [view, setView]             = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to ~8 am when entering week/day view */
  useEffect(() => {
    if (view !== "month" && scrollRef.current) {
      scrollRef.current.scrollTop = 60; // 1 × 60px row = 8 am
    }
  }, [view]);

  /* ── Navigation ── */
  function navigate(dir: 1 | -1) {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "month") {
        d.setMonth(d.getMonth() + dir);
        d.setDate(1);
      } else if (view === "week") {
        d.setDate(d.getDate() + dir * 7);
      } else {
        d.setDate(d.getDate() + dir);
      }
      return d;
    });
  }

  function goToday() {
    setCurrentDate(new Date());
  }

  /* ── Header title ── */
  function headerTitle(): string {
    if (view === "month") {
      return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (view === "week") {
      const days = weekDays(currentDate);
      const [first, last] = [days[0], days[6]];
      if (first.getMonth() === last.getMonth()) {
        return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
      }
      return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()]} ${last.getDate()}, ${first.getFullYear()}`;
    }
    return `${DOW_SHORT[currentDate.getDay()]}, ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  }

  /* ── Month view ── */
  function renderMonth() {
    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days  = monthViewDays(year, month);

    return (
      <div className="cal-month">
        <div className="cal-month__dow-row">
          {DOW_SHORT.map((d) => (
            <div key={d} className="cal-month__dow">{d}</div>
          ))}
        </div>

        <div className="cal-month__grid">
          {days.map((day, idx) => {
            const inMonth  = day.getMonth() === month;
            const isToday  = sameDay(day, today);
            const dayEvts  = eventsOnDate(rsvpd, day);
            const shown    = dayEvts.slice(0, 3);
            const extra    = dayEvts.length - shown.length;

            return (
              <div
                key={idx}
                className={[
                  "cal-month__cell",
                  !inMonth ? "cal-month__cell--other-month" : "",
                  isToday  ? "cal-month__cell--today"       : "",
                ].join(" ")}
              >
                <span className="cal-month__day-num">{day.getDate()}</span>

                {shown.map((e) => (
                  <Link
                    key={e.id}
                    href={`/events/${e.id}`}
                    className="cal-event-pill"
                    style={{ background: industryColor(e.industry) }}
                    title={e.name}
                  >
                    <span className="cal-event-pill__time">{formatTime(e.time)}</span>
                    <span className="cal-event-pill__name">{e.name}</span>
                  </Link>
                ))}

                {extra > 0 && (
                  <span className="cal-event-pill cal-event-pill--more">+{extra} more</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Week view ── */
  function renderWeek() {
    const days       = weekDays(currentDate);
    const totalHeight = HOURS.length * 60;

    return (
      <div className="cal-week">
        {/* Day headers */}
        <div className="cal-week__header">
          <div className="cal-week__gutter-hd" />
          {days.map((day, i) => (
            <div
              key={i}
              className={`cal-week__day-hd${sameDay(day, today) ? " cal-week__day-hd--today" : ""}`}
            >
              <div className="cal-week__day-name">{DOW_SHORT[day.getDay()]}</div>
              <div className="cal-week__day-num">{day.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Scrollable time grid */}
        <div className="cal-week__scroll" ref={scrollRef}>
          <div className="cal-week__layout" style={{ height: totalHeight }}>
            {/* Time column */}
            <div className="cal-time-col">
              {HOURS.map((h) => (
                <div key={h} className="cal-hour-label-row">
                  <span className="cal-hour-label">{hourLabel(h)}</span>
                </div>
              ))}
            </div>

            {/* One column per day */}
            {days.map((day, di) => {
              const dayEvts = eventsOnDate(rsvpd, day);
              return (
                <div key={di} className="cal-week__day-col">
                  {/* Hour separator lines */}
                  {HOURS.map((h) => (
                    <div key={h} className="cal-hour-bg" />
                  ))}

                  {/* Events */}
                  {dayEvts.map((e, ei) => {
                    const d   = new Date(e.time);
                    const top = ((d.getHours() - 7) + d.getMinutes() / 60) * 60;
                    return (
                      <Link
                        key={e.id}
                        href={`/events/${e.id}`}
                        className="cal-week__event"
                        style={{
                          background: industryColor(e.industry),
                          top: top,
                          height: 55,
                          left: `${2 + ei * 3}px`,
                        }}
                        title={`${e.name} · ${e.location}`}
                      >
                        <div className="cal-week__event-name">
                          {formatTime(e.time)} {e.name}
                        </div>
                        <div className="cal-week__event-loc">{e.location}</div>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ── Day view ── */
  function renderDay() {
    const dayEvts    = eventsOnDate(rsvpd, currentDate);
    const totalHeight = HOURS.length * 60;

    return (
      <div className="cal-day">
        {/* Header */}
        <div className="cal-day__header">
          <div className="cal-week__gutter-hd" />
          <div className={`cal-week__day-hd${sameDay(currentDate, today) ? " cal-week__day-hd--today" : ""}`}>
            <div className="cal-week__day-name">{DOW_SHORT[currentDate.getDay()]}</div>
            <div className="cal-week__day-num">{currentDate.getDate()}</div>
          </div>
        </div>

        {/* Scrollable grid */}
        <div className="cal-day__scroll" ref={scrollRef}>
          <div className="cal-day__layout" style={{ height: totalHeight }}>
            {/* Time column */}
            <div className="cal-time-col">
              {HOURS.map((h) => (
                <div key={h} className="cal-hour-label-row">
                  <span className="cal-hour-label">{hourLabel(h)}</span>
                </div>
              ))}
            </div>

            {/* Single day column */}
            <div className="cal-day__col">
              {HOURS.map((h) => (
                <div key={h} className="cal-hour-bg" />
              ))}

              {dayEvts.map((e, i) => {
                const d   = new Date(e.time);
                const top = ((d.getHours() - 7) + d.getMinutes() / 60) * 60;
                return (
                  <Link
                    key={e.id}
                    href={`/events/${e.id}`}
                    className="cal-day__event"
                    style={{ background: industryColor(e.industry), top, height: 56 + (i % 2) * 4 }}
                  >
                    <div className="cal-day__event-time">{formatTime(e.time)}</div>
                    <div className="cal-day__event-name">{e.name}</div>
                    <div className="cal-day__event-meta">{e.location} · {e.company}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div className="cal-wrap">
      {/* Header bar */}
      <div className="cal-header">
        <div className="cal-header__nav-group">
          <button className="cal-header__today-btn" onClick={goToday}>
            Today
          </button>
          <button className="cal-header__arrow-btn" onClick={() => navigate(-1)} aria-label="Previous">
            ‹
          </button>
          <button className="cal-header__arrow-btn" onClick={() => navigate(1)} aria-label="Next">
            ›
          </button>
        </div>

        <span className="cal-header__title">{headerTitle()}</span>

        <div className="cal-view-toggle" role="group" aria-label="Calendar view">
          {(["month", "week", "day"] as ViewMode[]).map((v) => (
            <button
              key={v}
              className={`cal-view-toggle__btn${view === v ? " cal-view-toggle__btn--active" : ""}`}
              onClick={() => setView(v)}
              aria-pressed={view === v}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar body */}
      {view === "month" && renderMonth()}
      {view === "week" && renderWeek()}
      {view === "day"  && renderDay()}
    </div>
  );
}
