import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig.js';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Tournament() {
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Subscribe to tournaments collection (if Firestore configured)
    if (!db) return;
    const col = collection(db, 'tournaments');
    const unsub = onSnapshot(col, snapshot => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setTournaments(items);
    }, err => {
      console.warn('Tournament subscription error:', err.message);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!db || !selected) return;
    const playersCol = collection(db, 'tournaments', selected, 'players');
    const unsub = onSnapshot(playersCol, snapshot => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPlayers(list);
    }, err => console.warn('Players subscription error:', err.message));

    return () => unsub();
  }, [selected]);

  return (
    <div className="tournament">
      <h2>Turnuva Modu</h2>
      <p>Turnuva plan ve eşleştirmeler burada gösterilecek.</p>

      <section>
        <h3>Mevcut Turnuvalar</h3>
        {tournaments.length === 0 && <p>Henüz turnuva yok.</p>}
        <ul>
          {tournaments.map(t => (
            <li key={t.id}>
              <button onClick={() => setSelected(t.id)}>{t.name || t.id}</button>
            </li>
          ))}
        </ul>
      </section>

      {selected && (
        <section>
          <h3>Oyuncular ({selected})</h3>
          {players.length === 0 && <p>Oyuncu yok.</p>}
          <ul>
            {players.map(p => (
              <li key={p.id}>{p.name || p.id} — {p.score ?? 0} puan</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
