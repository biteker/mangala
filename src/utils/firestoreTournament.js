import { db } from '../firebaseConfig.js';
import { collection, doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';

function ensureDb() {
  if (!db) throw new Error('Firestore (db) not initialized. Check src/firebaseConfig.js');
}

/** Create or overwrite a tournament document */
export async function createTournament(tournamentId, data = {}) {
  try {
    ensureDb();
    const ref = doc(db, 'tournaments', tournamentId);
    await setDoc(ref, { ...data, createdAt: new Date().toISOString() });
    return { id: tournamentId };
  } catch (err) {
    console.warn('createTournament failed:', err.message);
    throw err;
  }
}

/** Add a player to a tournament (players subcollection) */
export async function addPlayer(tournamentId, player) {
  try {
    ensureDb();
    const playersRef = collection(db, 'tournaments', tournamentId, 'players');
    const docRef = await addDoc(playersRef, { ...player, joinedAt: new Date().toISOString() });
    return { id: docRef.id };
  } catch (err) {
    console.warn('addPlayer failed:', err.message);
    throw err;
  }
}

/** Create a round entry */
export async function createRound(tournamentId, roundData) {
  try {
    ensureDb();
    const roundsRef = collection(db, 'tournaments', tournamentId, 'rounds');
    const docRef = await addDoc(roundsRef, { ...roundData, createdAt: new Date().toISOString() });
    return { id: docRef.id };
  } catch (err) {
    console.warn('createRound failed:', err.message);
    throw err;
  }
}

/** Record a match result for a given round */
export async function recordMatchResult(tournamentId, roundId, matchId, result) {
  try {
    ensureDb();
    const matchRef = doc(db, 'tournaments', tournamentId, 'rounds', roundId, 'matches', matchId);
    await setDoc(matchRef, { ...result, recordedAt: new Date().toISOString() });
    return { id: matchId };
  } catch (err) {
    console.warn('recordMatchResult failed:', err.message);
    throw err;
  }
}

export default {
  createTournament,
  addPlayer,
  createRound,
  recordMatchResult
};
