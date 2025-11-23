import { db } from '../firebaseConfig.js';
import { collection, doc, setDoc, addDoc, onSnapshot } from 'firebase/firestore';

function ensureDb() {
  if (!db) throw new Error('Firestore (db) not initialized. Check src/firebaseConfig.js');
}

/** Publish or update live game state */
export async function publishLiveGame(gameId, state) {
  try {
    ensureDb();
    const ref = doc(db, 'liveGames', gameId);
    await setDoc(ref, { ...state, updatedAt: new Date().toISOString() });
    return { id: gameId };
  } catch (err) {
    console.warn('publishLiveGame failed:', err.message);
    throw err;
  }
}

/** Subscribe to all live games; callback receives an array of game docs */
export function subscribeLiveGames(onChange) {
  ensureDb();
  const col = collection(db, 'liveGames');
  // returns unsubscribe
  return onSnapshot(col, snapshot => {
    const games = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    onChange(games);
  }, err => {
    console.warn('subscribeLiveGames snapshot error:', err.message);
  });
}

export default { publishLiveGame, subscribeLiveGames };
