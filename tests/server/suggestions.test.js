const { getConnectionSuggestions } = require("../../server/lib/suggestions");
const { DEMO_USER_ID } = require("../../server/lib/data");

describe("connection suggestions", () => {
  it("returns AI panel payload for a valid target user", () => {
    const suggestions = getConnectionSuggestions("user_4579");

    expect(suggestions).not.toBeNull();
    expect(suggestions.targetUser.id).toBe("user_4579");
    expect(Array.isArray(suggestions.sharedThemes)).toBe(true);
    expect(Array.isArray(suggestions.sharedSkills)).toBe(true);
    expect(Array.isArray(suggestions.sharedSchools)).toBe(true);
    expect(Array.isArray(suggestions.mutualEvents)).toBe(true);
    expect(suggestions.talkingPoints.length).toBeGreaterThan(0);
  });

  it("returns null for unknown or demo users", () => {
    expect(getConnectionSuggestions("user_missing")).toBeNull();
    expect(getConnectionSuggestions(DEMO_USER_ID)).toBeNull();
  });
});
