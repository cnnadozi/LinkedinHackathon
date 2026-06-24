"use client";

/**
 * Floating message window opened from a Nudge button — mirrors LinkedIn's
 * docked chat widget. Messages live in local state only; nothing is persisted.
 * An AI connection panel above the composer analyzes shared activity and offers
 * tappable talking points (Gemini, with a heuristic fallback server-side).
 */
import { useEffect, useRef, useState } from "react";
import { Avatar, ConnectionBadge } from "@/components/linkedin";
import {
  AiConnectionPanel,
  type NudgePanelData,
} from "@/components/AiConnectionPanel";
import type { AttendeeRow } from "@/lib/eventTypes";

type NudgeChatProps = {
  attendee: AttendeeRow;
  eventId: string;
  eventName: string;
  onClose: () => void;
};

type ChatMessage = {
  id: number;
  text: string;
};

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor">
      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM3 14h2v4.59l9.29-9.3 1.42 1.42-9.3 9.29H10v2H3v-7z" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor">
      <path d="M14 10h4.59L9.3 19.29l1.42 1.42L20 11.41V16h2V8h-8v2zm-4 4H5.41L14.7 4.71 13.28 3.29 4 12.59V8H2v8h8v-2z" />
    </svg>
  );
}

export function NudgeChat({
  attendee,
  eventId,
  eventName,
  onClose,
}: NudgeChatProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [panel, setPanel] = useState<NudgePanelData | null>(null);
  const [loadingPanel, setLoadingPanel] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the latest message in view as the thread grows.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (typeof list.scrollTo === "function") {
      list.scrollTo({ top: list.scrollHeight });
    } else {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages]);

  // Fetch the AI connection panel when the window opens for this attendee + event.
  useEffect(() => {
    let cancelled = false;
    setLoadingPanel(true);
    setPanel(null);

    fetch(`/api/events/${eventId}/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: attendee.id, eventName }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: NudgePanelData) => {
        if (!cancelled) setPanel(data);
      })
      .catch(() => {
        if (!cancelled) setPanel(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingPanel(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attendee.id, eventId, eventName]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: nextId.current++, text }]);
    setDraft("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter inserts a newline.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className={`nudge-chat${expanded ? " nudge-chat--expanded" : ""}`}
      role="dialog"
      aria-label={`Message ${attendee.name}`}
    >
      <header className="nudge-chat__header">
        {expanded ? (
          <h2 className="nudge-chat__title">New message</h2>
        ) : (
          <div className="nudge-chat__person">
            <Avatar
              alt={attendee.name}
              src={attendee.profile_picture_url}
              size="sm"
            />
            <div className="nudge-chat__person-text">
              <p className="nudge-chat__name">
                {attendee.name}
                <ConnectionBadge degree={attendee.degree} />
              </p>
              <p className="nudge-chat__headline">{attendee.headline}</p>
            </div>
          </div>
        )}
        <div className="nudge-chat__header-actions">
          <button
            type="button"
            className="nudge-chat__icon-btn"
            aria-label={expanded ? "Collapse message window" : "Expand message window"}
            aria-pressed={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </button>
          <button
            type="button"
            className="nudge-chat__icon-btn"
            aria-label="Close conversation"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </header>

      {expanded && (
        <div className="nudge-chat__recipient">
          <Avatar
            alt={attendee.name}
            src={attendee.profile_picture_url}
            size="md"
          />
          <div className="nudge-chat__person-text">
            <p className="nudge-chat__name">
              {attendee.name}
              <ConnectionBadge degree={attendee.degree} />
            </p>
            <p className="nudge-chat__headline nudge-chat__headline--full">
              {attendee.headline}
            </p>
          </div>
        </div>
      )}

      <div className="nudge-chat__body" ref={listRef}>
        {messages.length === 0 ? (
          <p className="nudge-chat__empty">
            This is the start of your conversation with {attendee.name}.
          </p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="nudge-chat__message">
              {message.text}
            </div>
          ))
        )}
      </div>

      <AiConnectionPanel data={panel} loading={loadingPanel} />

      <div className="nudge-chat__composer">
        <textarea
          className="nudge-chat__input"
          placeholder="Write a message…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={expanded ? 5 : 3}
        />
        <button
          type="button"
          className="nudge-chat__send"
          onClick={sendMessage}
          disabled={!draft.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
