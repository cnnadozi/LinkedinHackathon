"use client";

/**
 * AI-powered connection assistant shown above the nudge composer. Analyzes the
 * two members' shared activity and surfaces three sections: shared themes,
 * mutual events (last 6 months), and tappable AI talking points. Collapsible so
 * it doesn't crowd the chat; talking points drop into the message box on tap.
 */
import { useState } from "react";

export type NudgePanelData = {
  sharedThemes: string[];
  mutualEvents: { id: string; name: string }[];
  talkingPoints: string[];
};

type AiConnectionPanelProps = {
  data: NudgePanelData | null;
  loading: boolean;
};

function SparkleIcon() {
  return (
    <svg
      className="ai-panel__sparkle"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden
      fill="currentColor"
    >
      <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2zm6 12l.95 2.55L21.5 17.5l-2.55.95L18 21l-.95-2.55L14.5 17.5l2.55-.95L18 14zM6 15l.7 1.8L8.5 17.5l-1.8.7L6 20l-.7-1.8L3.5 17.5l1.8-.7L6 15z" />
    </svg>
  );
}

export function AiConnectionPanel({
  data,
  loading,
}: AiConnectionPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const hasContent =
    !!data &&
    (data.sharedThemes.length > 0 ||
      data.mutualEvents.length > 0 ||
      data.talkingPoints.length > 0);

  return (
    <section className="ai-panel" aria-label="AI connection assistant">
      <button
        type="button"
        className="ai-panel__header"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((c) => !c)}
      >
        <span className="ai-panel__title">
          <SparkleIcon />
          AI connection assistant
        </span>
        <span className="ai-panel__chevron" aria-hidden>
          {collapsed ? "▾" : "▴"}
        </span>
      </button>

      {!collapsed && (
        <div className="ai-panel__body">
          {loading ? (
            <p className="ai-panel__loading">Analyzing your shared activity…</p>
          ) : !hasContent ? (
            <p className="ai-panel__empty">
              No shared signals yet — say hello and introduce yourself.
            </p>
          ) : (
            <>
              {data!.sharedThemes.length > 0 && (
                <div className="ai-panel__section">
                  <h4 className="ai-panel__section-title">Shared Themes</h4>
                  <div className="ai-panel__chips">
                    {data!.sharedThemes.map((theme) => (
                      <span key={theme} className="ai-panel__chip">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data!.mutualEvents.length > 0 && (
                <div className="ai-panel__section">
                  <h4 className="ai-panel__section-title">
                    Mutual Events{" "}
                    <span className="ai-panel__count">
                      {data!.mutualEvents.length} mutual event
                      {data!.mutualEvents.length === 1 ? "" : "s"}
                    </span>
                  </h4>
                  <ul className="ai-panel__events">
                    {data!.mutualEvents.map((event) => (
                      <li key={event.id} className="ai-panel__event">
                        {event.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data!.talkingPoints.length > 0 && (
                <div className="ai-panel__section">
                  <h4 className="ai-panel__section-title">
                    Suggested Talking Points
                  </h4>
                  <ul className="ai-panel__points">
                    {data!.talkingPoints.map((point) => (
                      <li key={point} className="ai-panel__point">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
