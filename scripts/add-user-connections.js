/**
 * Adds a symmetric `connections` array (2–30 user IDs) to every member in user_data.json.
 * Run: node scripts/add-user-connections.js
 */
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data/user_data.json");

function mulberry32(seed) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(values, rand) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function main() {
  const users = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const ids = users.map((user) => user.id);
  const idSet = new Set(ids);
  const rand = mulberry32(5736);

  /** @type {Map<string, Set<string>>} */
  const adjacency = new Map(ids.map((id) => [id, new Set()]));

  function canConnect(a, b) {
    return a !== b && adjacency.get(a).size < 30 && adjacency.get(b).size < 30;
  }

  function connect(a, b) {
    if (!canConnect(a, b)) return false;
    adjacency.get(a).add(b);
    adjacency.get(b).add(a);
    return true;
  }

  for (const user of users) {
    const targetCount = 2 + Math.floor(rand() * 29);
    const candidates = shuffle(ids.filter((id) => id !== user.id), rand);

    for (const otherId of candidates) {
      if (adjacency.get(user.id).size >= targetCount) break;
      connect(user.id, otherId);
    }
  }

  for (const user of users) {
    if (adjacency.get(user.id).size >= 2) continue;

    const candidates = shuffle(ids.filter((id) => id !== user.id), rand);
    for (const otherId of candidates) {
      if (adjacency.get(user.id).size >= 2) break;
      connect(user.id, otherId);
    }
  }

  for (const user of users) {
    if (adjacency.get(user.id).size >= 2) continue;
    throw new Error(`Unable to assign at least 2 connections to ${user.id}`);
  }

  const updated = users.map((user) => {
    const connections = [...adjacency.get(user.id)].sort((a, b) => a.localeCompare(b));
    if (connections.length < 2 || connections.length > 30) {
      throw new Error(`${user.id} has ${connections.length} connections`);
    }
    for (const connectionId of connections) {
      if (!idSet.has(connectionId)) {
        throw new Error(`${user.id} references missing user ${connectionId}`);
      }
    }
    return { ...user, connections };
  });

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(updated, null, 4)}\n`, "utf-8");

  const counts = updated.map((user) => user.connections.length);
  console.log(
    `Updated ${updated.length} users — connections per user: min=${Math.min(...counts)}, max=${Math.max(...counts)}, avg=${(counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1)}`,
  );
}

main();
