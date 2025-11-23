/**
 * Spectator utilities scaffold
 * - Placeholder functions to list live games and subscribe to updates.
 * - Integration with a real-time backend (Firestore) will be added later.
 */

export function listLiveGames(snapshot) {
  // snapshot can be an array or a firestore snapshot; for now accept array
  if (!snapshot) return [];
  if (Array.isArray(snapshot)) return snapshot;
  // else try to map
  if (snapshot.docs) return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  return [];
}

export default { listLiveGames };
