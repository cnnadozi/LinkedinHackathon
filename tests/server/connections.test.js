import { describe, expect, it } from "vitest";

describe("user connections dataset", () => {
  it("gives every member a symmetric connections array with 2–30 ids", () => {
    const { users, userById } = require("../../server/lib/data");

    for (const user of users) {
      expect(Array.isArray(user.connections)).toBe(true);
      expect(user.connections.length).toBeGreaterThanOrEqual(2);
      expect(user.connections.length).toBeLessThanOrEqual(30);
      expect(new Set(user.connections).size).toBe(user.connections.length);
      expect(user.connections).not.toContain(user.id);

      for (const connectionId of user.connections) {
        expect(userById[connectionId]).toBeTruthy();
        expect(userById[connectionId].connections).toContain(user.id);
      }
    }
  });
});

describe("connection degree helpers", () => {
  it("marks direct connections as 1st degree", () => {
    const { MAIN_USER_ID, getMainUser, getConnectionDegree, isDirectConnection } =
      require("../../server/lib/data");

    const mainUser = getMainUser();
    expect(mainUser?.connections?.length).toBeGreaterThan(0);

    const firstDegreeId = mainUser.connections[0];
    expect(isDirectConnection(MAIN_USER_ID, firstDegreeId)).toBe(true);
    expect(getConnectionDegree(MAIN_USER_ID, firstDegreeId)).toBe(1);
  });

  it("marks shared connections as 2nd degree", () => {
    const { MAIN_USER_ID, getMainUser, getConnectionDegree, isDirectConnection } =
      require("../../server/lib/data");

    const mainUser = getMainUser();
    const firstDegreeId = mainUser.connections[0];
    const secondDegreeCandidate = mainUser.connections
      .flatMap((connectionId) => require("../../server/lib/data").userById[connectionId].connections)
      .find(
        (candidateId) =>
          candidateId !== MAIN_USER_ID &&
          !mainUser.connections.includes(candidateId) &&
          !isDirectConnection(MAIN_USER_ID, candidateId),
      );

    expect(secondDegreeCandidate).toBeTruthy();
    expect(getConnectionDegree(MAIN_USER_ID, secondDegreeCandidate)).toBe(2);
    expect(isDirectConnection(MAIN_USER_ID, firstDegreeId)).toBe(true);
  });
});
