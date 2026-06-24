/**
 * Rule-based AI connection panel payload for the messaging flow.
 */
const {
  events,
  eventById,
  userById,
  DEMO_USER_ID,
  memberHeadline,
} = require("./data");

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

function sharedValues(left = [], right = []) {
  const rightSet = new Set(right);
  return left.filter((value) => rightSet.has(value));
}

function sharedSchoolNames(currentUser, targetUser) {
  const targetSchools = new Set(
    (targetUser.school_history ?? []).map((entry) => entry.school_name),
  );
  return (currentUser.school_history ?? [])
    .map((entry) => entry.school_name)
    .filter((name) => targetSchools.has(name));
}

function attendeeSetForEvent(eventId) {
  // Lazy require avoids circular dependency with events.js
  const { deriveAttendeeIds } = require("./events");
  const event = eventById[eventId];
  if (!event) return new Set();
  return new Set(deriveAttendeeIds(event).ids);
}

function findMutualEvents(currentUserId, targetUserId) {
  const cutoff = Date.now() - SIX_MONTHS_MS;

  return events
    .filter((event) => {
      const eventTime = Date.parse(event.time);
      if (Number.isNaN(eventTime) || eventTime < cutoff) return false;
      const attendees = attendeeSetForEvent(event.id);
      return attendees.has(currentUserId) && attendees.has(targetUserId);
    })
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5)
    .map((event) => ({
      id: event.id,
      name: event.name,
      time: event.time,
      location: event.location,
    }));
}

function buildTalkingPoints({
  currentUser,
  targetUser,
  sharedSkills,
  sharedSchools,
  mutualEvents,
}) {
  const points = [];

  if (sharedSkills.length > 0) {
    points.push(`Ask about their experience with ${sharedSkills[0]}.`);
  }
  if (sharedSchools.length > 0) {
    points.push(`You both went to ${sharedSchools[0]} — easy way to break the ice.`);
  }
  if (mutualEvents.length > 0) {
    points.push(`You were both at ${mutualEvents[0].name}.`);
  }
  if (targetUser.posts_activity?.[0]) {
    points.push(`Reference their post: "${targetUser.posts_activity[0]}".`);
  }
  if (currentUser.posts_activity?.[0] && targetUser.posts_activity?.[1]) {
    points.push(
      `Compare notes on ${targetUser.posts_activity[1]} — you both care about this space.`,
    );
  }
  if (points.length === 0) {
    points.push(`Congratulate ${targetUser.name} on their work at ${memberHeadline(targetUser)}.`);
  }

  return points.slice(0, 5);
}

function getConnectionSuggestions(targetUserId, currentUserId = DEMO_USER_ID) {
  const targetUser = userById[targetUserId];
  const currentUser = userById[currentUserId];
  if (!targetUser || !currentUser || targetUserId === currentUserId) {
    return null;
  }

  const sharedSkills = sharedValues(currentUser.skills, targetUser.skills);
  const sharedThemes = sharedValues(
    currentUser.posts_activity,
    targetUser.posts_activity,
  );
  const sharedSchools = sharedSchoolNames(currentUser, targetUser);
  const mutualEvents = findMutualEvents(currentUserId, targetUserId);

  return {
    targetUser: {
      id: targetUser.id,
      name: targetUser.name,
      headline: memberHeadline(targetUser),
    },
    sharedThemes,
    sharedSkills,
    sharedSchools,
    mutualEvents,
    talkingPoints: buildTalkingPoints({
      currentUser,
      targetUser,
      sharedSkills,
      sharedSchools,
      mutualEvents,
    }),
  };
}

module.exports = {
  getConnectionSuggestions,
  findMutualEvents,
};
