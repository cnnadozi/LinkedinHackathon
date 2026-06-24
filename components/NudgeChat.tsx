"use client";

/**
 * Floating message window opened from a Nudge button — mirrors LinkedIn's
 * docked chat widget. Messages live in local state only; nothing is persisted.
 * Suggested-message blocks are AI-generated (Gemini) on open, scoped to the
 * event both people attended, with a heuristic fallback server-side.
 */
import { useEffect, useRef, useState } from "react";
import { Avatar, ConnectionBadge } from "@/components/linkedin";
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

export function NudgeChat({
  attendee,
  eventId,
  eventName,
  onClose,
}: NudgeChatProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the latest message in view as the thread grows.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  // Fetch AI suggestions when the window opens for this attendee + event.
  useEffect(() => {
    let cancelled = false;
    setLoadingSuggestions(true);
    setSuggestions([]);

    fetch(`/api/events/${eventId}/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: attendee.id, eventName }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { suggestions?: string[] }) => {
        if (!cancelled) setSuggestions(data.suggestions ?? []);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSuggestions(false);
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
      className="nudge-chat"
      role="dialog"
      aria-label={`Message ${attendee.name}`}
    >
      <header className="nudge-chat__header">
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
        <button
          type="button"
          className="nudge-chat__close"
          aria-label="Close conversation"
          onClick={onClose}
        >
          ×
        </button>
      </header>

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

      <div className="nudge-chat__suggestions">
        {loadingSuggestions ? (
          <p className="nudge-chat__suggestions-loading">
            Drafting suggestions…
          </p>
        ) : (
          suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="nudge-chat__suggestion"
              onClick={() => setDraft(suggestion)}
            >
              {suggestion}
            </button>
          ))
        )}
      </div>

      <div className="nudge-chat__composer">
        <textarea
          className="nudge-chat__input"
          placeholder="Write a message…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
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
