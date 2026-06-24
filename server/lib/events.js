/**
 * Event detail, attendee derivation, RSVP, and nudge state for the demo API.
 */
const {
  users,
  events,
  eventById,
  userById,
  MAIN_USER_ID,
  DEMO_USER_ID,
  latestJob,
  memberHeadline,
} = require("./data");
const {
  toggleUserRsvp,
  userHasRsvp,
  hasNudge,
  addNudge,
  getUserRsvpIds,
} = require("./state");

function simpleHash(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function scoreUserForEvent(user, event) {
  let score = 0;
  if (user.id === event.host_user_id) score += 1000;
  if (user.current_location === event.location) score += 3;
  if (user.skills?.includes(event.industry)) score += 2;
  const job = latestJob(user);
  if (job?.industry === event.industry) score += 2;
  if (job?.company === event.company) score += 1;
  return score;
}

function deriveAttendeeIds(event) {
  const ids = users
    .filter((user) => user.attending_event_ids?.includes(event.id))
    .sort((a, b) => {
      const scoreDiff = scoreUserForEvent(b, event) - scoreUserForEvent(a, event);
      return scoreDiff || a.id.localeCompare(b.id);
    })
    .map((user) => user.id);

  if (!ids.includes(event.host_user_id) && userById[event.host_user_id]) {
    ids.unshift(event.host_user_id);
  }

  return { ids, totalAttending: ids.length };
}

function isConnection(attendeeId, eventId, currentUserId) {
  if (attendeeId === currentUserId) return false;
  const hash = simpleHash(`${currentUserId}:${eventId}:${attendeeId}`);
  return hash % 5 === 0;
}

function connectionDegree(attendeeId, eventId, currentUserId, connected) {
  if (connected) return 1;
  const hash = simpleHash(`${attendeeId}:${eventId}`);
  return hash % 3 === 0 ? 2 : 3;
}

function otherAttendingEvents(attendeeId, eventId, currentUserId = MAIN_USER_ID) {
  const attendee = userById[attendeeId];
  const mainUser = userById[currentUserId];
  if (!attendee || !mainUser) return [];

  const mainUserEventIds = new Set(mainUser.attending_event_ids ?? []);

  return events
    .filter(
      (candidate) =>
        candidate.id !== eventId &&
        attendee.attending_event_ids?.includes(candidate.id) &&
        mainUserEventIds.has(candidate.id),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((candidate) => ({ id: candidate.id, name: candidate.name }));
}

function buildAttendeeRow(attendeeId, event, currentUserId) {
  const user = userById[attendeeId];
  if (!user) return null;

  const connected = isConnection(attendeeId, event.id, currentUserId);
  const degree = connectionDegree(attendeeId, event.id, currentUserId, connected);
  const nudgeKey = `${event.id}:${attendeeId}`;

  const job = latestJob(user);

  return {
    id: user.id,
    name: user.name,
    headline: memberHeadline(user),
    profile_picture_url: user.profile_picture_url,
    location: user.current_location,
    company: job?.company ?? null,
    industry: job?.industry ?? null,
    degree,
    isConnection: connected,
    mutualEvents: otherAttendingEvents(attendeeId, event.id, currentUserId),
    nudged: hasNudge(nudgeKey),
  };
}

function getEventDetail(eventId, currentUserId = MAIN_USER_ID) {
  const event = eventById[eventId];
  if (!event) return null;

  const host = userById[event.host_user_id];
  const { ids, totalAttending } = deriveAttendeeIds(event);
  const attendeeRows = ids
    .map((id) => buildAttendeeRow(id, event, currentUserId))
    .filter(Boolean);

  const connections = attendeeRows.filter((row) => row.isConnection);
  const previewAvatars = attendeeRows.slice(0, 3).map((row) => ({
    alt: row.name,
    src: row.profile_picture_url,
  }));
  const connectionPreview = connections.slice(0, 5).map((row) => ({
    id: row.id,
    alt: row.name,
    src: row.profile_picture_url,
  }));

  return {
    event,
    host: host
      ? {
          id: host.id,
          name: host.name,
          headline: memberHeadline(host),
          profile_picture_url: host.profile_picture_url,
        }
      : null,
    attendance: {
      total: totalAttending,
      connectionsCount: connections.length,
      previewAvatars,
      connectionPreview,
    },
    attendees: attendeeRows,
    rsvpd: userHasRsvp(currentUserId, eventId),
  };
}

function toggleRsvp(eventId, currentUserId = MAIN_USER_ID) {
  const event = eventById[eventId];
  if (!event) return null;

  const rsvpd = toggleUserRsvp(currentUserId, eventId);
  return { rsvpd };
}

function recordNudge(eventId, targetUserId, currentUserId = MAIN_USER_ID) {
  const event = eventById[eventId];
  if (!event || targetUserId === currentUserId) return null;

  const nudgeKey = `${eventId}:${targetUserId}`;
  addNudge(nudgeKey);
  return { nudged: true };
}

function getRsvpEventsForUser(userId = MAIN_USER_ID) {
  const rsvpIds = new Set(getUserRsvpIds(userId));

  return events
    .filter((event) => rsvpIds.has(event.id))
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((event) => ({
      id: event.id,
      name: event.name,
      time: event.time,
      location: event.location,
      industry: event.industry,
    }));
}

module.exports = {
  getEventDetail,
  toggleRsvp,
  recordNudge,
  getRsvpEventsForUser,
  deriveAttendeeIds,
  isConnection,
};
