"use client";

/**
 * Guest list overlay — filters, connection badges, and Nudge actions.
 * Opens from the event detail attendee section (Figma: attendee popup).
 */
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "./linkedin/Avatar";
import { Button } from "./linkedin/Button";
import { ConnectionBadge } from "./linkedin/ConnectionBadge";
import { FilterChips, type FilterChip } from "./linkedin/FilterChips";
import { Modal } from "./linkedin/Modal";
import { recordEventNudge } from "@/lib/eventActions";
import type { AttendeeRow } from "@/lib/eventTypes";

type AttendeeModalProps = {
  open: boolean;
  onClose: () => void;
  eventId: string;
  attendees: AttendeeRow[];
  initialFilter?: "all" | "connections";
  onNudge?: (attendeeId: string) => void;
};

const DEGREE_CHIPS: FilterChip[] = [
  { id: "1", label: "1st" },
  { id: "2", label: "2nd" },
  { id: "3", label: "3rd+" },
];

function MessageIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M14 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2v3l3-3h7a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Zm-1 8H3.41L4 9.59V11h1v-1.59L5.59 9H13V3H3v7h10Z" />
    </svg>
  );
}

export function AttendeeModal({
  open,
  onClose,
  eventId,
  attendees,
  initialFilter = "all",
  onNudge,
}: AttendeeModalProps) {
  const router = useRouter();
  const [activeDegrees, setActiveDegrees] = useState<string[]>([]);
  const [connectionsOnly, setConnectionsOnly] = useState(
    initialFilter === "connections",
  );
  const [nudgedIds, setNudgedIds] = useState<Set<string>>(
    () => new Set(attendees.filter((row) => row.nudged).map((row) => row.id)),
  );

  useEffect(() => {
    if (open) {
      setConnectionsOnly(initialFilter === "connections");
    }
  }, [open, initialFilter]);

  const filteredAttendees = useMemo(() => {
    return attendees.filter((row) => {
      if (connectionsOnly && !row.isConnection) return false;
      if (
        activeDegrees.length > 0 &&
        !activeDegrees.includes(String(row.degree))
      ) {
        return false;
      }
      return true;
    });
  }, [attendees, activeDegrees, connectionsOnly]);

  function toggleDegree(id: string) {
    setActiveDegrees((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  }

  async function handleNudge(attendeeId: string) {
    await recordEventNudge(eventId, attendeeId);
    setNudgedIds((current) => new Set(current).add(attendeeId));
    onNudge?.(attendeeId);
    router.push(`/messages/${attendeeId}`);
  }

  return (
    <Modal open={open} onClose={onClose} title="Attendance List" wide>
      <div className="attendee-modal">
        <div className="attendee-modal__filters">
          <span className="attendee-modal__tab">People</span>
          <button
            type="button"
            className={`attendee-modal__connections-toggle${
              connectionsOnly ? " attendee-modal__connections-toggle--active" : ""
            }`}
            aria-pressed={connectionsOnly}
            onClick={() => setConnectionsOnly((value) => !value)}
          >
            Your connections
          </button>
          <FilterChips
            chips={DEGREE_CHIPS}
            activeIds={activeDegrees}
            onToggle={toggleDegree}
            onClear={() => setActiveDegrees([])}
          />
        </div>

        <ul className="attendee-modal__list">
          {filteredAttendees.slice(0, 50).map((attendee) => {
            const nudged = nudgedIds.has(attendee.id) || attendee.nudged;

            return (
              <li key={attendee.id} className="attendee-modal__row">
                <Avatar alt={attendee.name} size="md" />
                <div className="attendee-modal__info">
                  <div className="attendee-modal__name-row">
                    <span className="attendee-modal__name">{attendee.name}</span>
                    <ConnectionBadge degree={attendee.degree} />
                  </div>
                  <p className="attendee-modal__headline">{attendee.headline}</p>
                  {attendee.mutualEvents.length > 0 && (
                    <p className="attendee-modal__mutual">
                      {attendee.mutualEvents.map((eventName, index) => (
                        <span key={eventName}>
                          {index > 0 && ", "}
                          <span className="attendee-modal__mutual-link">
                            {eventName}
                          </span>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                <Button
                  variant={nudged ? "success" : "primary"}
                  size="sm"
                  disabled={nudged}
                  onClick={() => handleNudge(attendee.id)}
                  aria-label={
                    nudged
                      ? `Already nudged ${attendee.name}`
                      : `Nudge ${attendee.name}`
                  }
                >
                  <MessageIcon />
                  {nudged ? "Nudged ✓" : "Nudge"}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
