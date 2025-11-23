/**
 * Tournament utilities scaffold
 * - This file provides placeholder functions for tournament pairing,
 *   standings and basic persistence hooks. We'll flesh these out as
 *   we integrate tournament UI and backend (Firestore) later.
 */

export function swissPairings(players) {
  // players: [{ id, name, score }]
  // returns array of pairs: [[p1, p2], [p3, p4], ...]
  if (!Array.isArray(players)) return [];
  // Simple pairing: sort by score desc, pair sequentially
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const pairs = [];
  for (let i = 0; i < sorted.length; i += 2) {
    if (i + 1 < sorted.length) pairs.push([sorted[i], sorted[i + 1]]);
    else pairs.push([sorted[i], null]);
  }
  return pairs;
}

export function updateStandings(standings, result) {
  // result: { winnerId, loserId, draw }
  const map = new Map(standings.map(s => [s.id, { ...s }]));
  if (result.draw) {
    if (map.has(result.winnerId) && map.has(result.loserId)) {
      map.get(result.winnerId).score += 0.5;
      map.get(result.loserId).score += 0.5;
    }
  } else {
    if (map.has(result.winnerId)) map.get(result.winnerId).score += 1;
  }
  return Array.from(map.values());
}

export default {
  swissPairings,
  updateStandings
};
